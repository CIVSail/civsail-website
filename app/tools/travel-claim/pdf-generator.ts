/**
 * PDF Generation Utilities for Travel Claim Generator
 * Uses pdf-lib to fill DD 1351-2 and Comp Time for Travel forms
 */

import { PDFDocument } from 'pdf-lib';
import {
  TravelClaimForm,
  getTransportModeCode,
  getDepartureDateTime,
  getStopReasonCode,
  getArrivalDateTime,
  ItineraryLeg,
} from './types';
import {
  calculateAllCompTime,
  formatDecimalHours,
  calculateTotalTravelTime,
  calculateDutyHours,
} from './comp-time-utils';

// ============================================
// DD 1351-2 PDF GENERATION
// ============================================

/**
 * Generate DD 1351-2 Travel Voucher PDF
 */
export async function generateDD1351PDF(
  formData: TravelClaimForm
): Promise<Uint8Array> {
  const pdfUrl = '/forms/DD1351-2.pdf';
  const existingPdfBytes = await fetch(pdfUrl).then((res) => res.arrayBuffer());
  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  const form = pdfDoc.getForm();

  // Calculate GTCC total for split disbursement
  let gtccTotal = 0;
  formData.itinerary.forEach((leg) => {
    if (leg.transport.paidWithGTCC && leg.transport.cost) {
      gtccTotal += leg.transport.cost;
    }
    if (leg.transport.baggagePaidWithGTCC && leg.transport.baggageCost) {
      gtccTotal += leg.transport.baggageCost;
    }
    if (leg.delayHotelPaidWithGTCC && leg.delayHotelCost) {
      gtccTotal += leg.delayHotelCost;
    }
  });
  formData.additionalExpenses.forEach((exp) => {
    if (exp.paidWithGTCC) {
      gtccTotal += exp.amount;
    }
  });

  try {
    // === CHECKBOXES ===
    tryCheckBox(form, 'xeft[0]', true); // EFT payment
    tryCheckBox(form, 'xtdy[0]', true); // TDY travel
    tryCheckBox(form, 'xunacc[0]', true); // Unaccompanied

    if (gtccTotal > 0) {
      tryCheckBox(form, 'xsplit[0]', true); // Split disbursement
    }

    if (formData.travelType === 'CONUS') {
      tryCheckBox(form, 'xless12[0]', true);
    } else {
      tryCheckBox(form, 'xmore12[0]', true);
    }

    // === TEXT FIELDS ===
    const fullName =
      `${formData.traveler.lastName}, ${formData.traveler.firstName} ${formData.traveler.middleInitial}`.trim();
    trySetTextField(form, 'FormField[0]', fullName);
    trySetTextField(form, 'GRADE[0]', `GS-${formData.traveler.grade}`);
    trySetTextField(form, 'SSN[0]', `XXX-XX-${formData.traveler.ssnLast4}`);
    trySetTextField(form, 'ADDRESS_NUMBER_AND_ST[0]', formData.traveler.street);
    trySetTextField(form, 'CITY[0]', formData.traveler.city);
    trySetTextField(form, 'STATE[0]', formData.traveler.state);
    trySetTextField(form, 'zipcode[0]', formData.traveler.zip);
    trySetTextField(form, 'email[0]', formData.traveler.email);
    trySetTextField(form, 'DAYPHONE[0]', formData.traveler.phone);
    trySetTextField(
      form,
      'travel_order_number[0]',
      formData.authorizationNumber
    );
    trySetTextField(
      form,
      'prev_pay[0]',
      formData.receivedAdvance ? `$${formData.advanceAmount?.toFixed(2)}` : '$0'
    );
    trySetTextField(
      form,
      'ORGANIZATION_AND_STAT[0]',
      'Military Sealift Command'
    );

    if (gtccTotal > 0) {
      trySetTextField(form, 'splitamt[0]', gtccTotal.toFixed(2));
    }

    // === ITINERARY ===
    if (formData.itinerary.length > 0) {
      const firstLeg = formData.itinerary[0];
      if (firstLeg.departureDate) {
        const firstDate = new Date(firstLeg.departureDate);
        trySetTextField(
          form,
          'itinyear[0]',
          firstDate.getFullYear().toString()
        );
      }

      formData.itinerary.forEach((leg, index) => {
        const rowNum = index + 1;

        // Departure date (MM/DD format)
        if (leg.departureDate) {
          const depDate = new Date(leg.departureDate);
          const depDateStr = `${(depDate.getMonth() + 1)
            .toString()
            .padStart(2, '0')}/${depDate
            .getDate()
            .toString()
            .padStart(2, '0')}`;

          if (index === 0) {
            trySetTextField(form, 'dep1[0]', depDateStr, 8);
            const fromDetails =
              leg.from.type === 'HOR'
                ? `HOR - ${leg.from.details}`
                : leg.from.details || leg.from.type;
            trySetTextField(form, 'place1[0]', fromDetails);
          }
        }

        // Arrival date
        if (leg.arrivalDate) {
          const arrDate = new Date(leg.arrivalDate);
          const arrDateStr = `${(arrDate.getMonth() + 1)
            .toString()
            .padStart(2, '0')}/${arrDate
            .getDate()
            .toString()
            .padStart(2, '0')}`;
          trySetTextField(form, `arr${rowNum}[0]`, arrDateStr, 8);
        }

        // Destination (place)
        const toDetails =
          leg.to.type === 'HOR'
            ? `HOR - ${leg.to.details}`
            : leg.to.details || leg.to.type;
        trySetTextField(form, `place${rowNum + 1}[0]`, toDetails);

        // Mode of transport
        trySetTextField(
          form,
          `mode${rowNum}[0]`,
          getTransportModeCode(leg.transport.type)
        );

        // Reason for stop
        trySetTextField(form, `reason${rowNum}[0]`, getStopReasonCode(leg.reason));

        // Miles (for POV)
        if (leg.transport.miles) {
          trySetTextField(
            form,
            `miles${rowNum}[0]`,
            leg.transport.miles.toString()
          );
        }

        // Lodging cost
        if (leg.delayHotelCost) {
          trySetTextField(
            form,
            `lodging${rowNum}[0]`,
            leg.delayHotelCost.toFixed(2)
          );
        }
      });
    }

    // === ADDITIONAL EXPENSES ===
    let expenseRow = 1;
    formData.additionalExpenses.forEach((expense) => {
      if (!expense.paidWithGTCC && expenseRow <= 10) {
        const expDate = new Date(expense.date);
        const dateStr = `${(expDate.getMonth() + 1)
          .toString()
          .padStart(2, '0')}/${expDate.getDate().toString().padStart(2, '0')}`;
        trySetTextField(form, `date${expenseRow}[0]`, dateStr);
        trySetTextField(form, `exp${expenseRow}[0]`, expense.description);
        trySetTextField(form, `amt${expenseRow}[0]`, expense.amount.toFixed(2));
        expenseRow++;
      }
    });
  } catch (e) {
    console.warn('Error filling DD 1351-2:', e);
  }

  return await pdfDoc.save();
}

// ============================================
// COMP TIME PDF GENERATION
// ============================================

/**
 * Generate Comp Time for Travel Request PDF
 * Field mappings based on actual PDF form structure
 */
export async function generateCompTimePDF(
  formData: TravelClaimForm
): Promise<Uint8Array> {
  const pdfUrl = '/forms/CompTimeForTravel.pdf';
  const existingPdfBytes = await fetch(pdfUrl).then((res) => res.arrayBuffer());
  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  const form = pdfDoc.getForm();

  const { calculations, totals } = calculateAllCompTime(
    formData.itinerary,
    formData.traveler
  );

  try {
    // === HEADER INFO ===
    const fullName =
      `${formData.traveler.firstName} ${formData.traveler.middleInitial} ${formData.traveler.lastName}`.trim();
    trySetTextField(form, 'Full_Name_1', fullName);
    trySetTextField(form, 'Text_1', formData.traveler.position);
    trySetTextField(form, 'Number_1', formData.traveler.dodId);

    // Date submitted (today)
    const today = new Date();
    const dateStr = `${
      today.getMonth() + 1
    }/${today.getDate()}/${today.getFullYear()}`;
    trySetTextField(form, 'Date_1', dateStr);

  // TDY Location - find first TDY station or final destination leg
const tdyLeg = formData.itinerary.find(
  (l) => l.reason === 'TDY_STATION' || l.reason === 'FINAL_DESTINATION'
);
if (tdyLeg) {
  trySetTextField(form, 'Text_2', tdyLeg.to.details || tdyLeg.to.type);
}

    // Purpose
    const purpose =
      formData.purpose === 'Other' ? formData.customPurpose : formData.purpose;
    trySetTextField(form, 'Text_3', purpose || '');

    // Work schedule
    trySetTextField(
      form,
      'Text_4',
      formData.traveler.workSchedule || '0800-1630'
    );

    // Travel orders
    if (formData.travelOrdersIssued) {
      tryCheckBox(form, 'Checkbox_1', true);
      trySetTextField(form, 'Text_5', formData.authorizationNumber);
    } else {
      tryCheckBox(form, 'Checkbox_2', true);
    }

    // === ITINERARY ROWS ===
    // The form has specific field naming for each row
    // Row fields map to departure time, arrival time, activity, actual travel, duty, non-duty, non-creditable, comp time

    // Field name arrays for each column (up to 10 rows)
    const localDateTimeFields = [
      'Text_7',
      'Text_8',
      'Text_9',
      'Text_10',
      'Text_11',
      'Text_12',
      'Text_13',
      'Text_14',
      'Text_15',
      'Text_16',
    ];
    const arrivalDateTimeFields = [
      'Text_21',
      'Text_22',
      'Text_23',
      'Text_24',
      'Text_25',
      'Text_26',
      'Text_27',
      'Text_28',
      'Text_29',
      'Text_30',
    ];
    const activityFields = [
      'Text_35',
      'Text_37',
      'Text_38',
      'Text_39',
      'Text_40',
      'Text_41',
      'Text_42',
      'Text_36',
      'Text_43',
      'Text_44',
    ];
    const actualTravelFields = [
      'Number_2',
      'Number_3',
      'Number_4',
      'Number_5',
      'Number_6',
      'Number_7',
      'Number_8',
      'Number_9',
      'Number_10',
      'Number_11',
    ];
    const dutyHoursFields = [
      'Number_17',
      'Number_18',
      'Number_19',
      'Number_20',
      'Number_21',
      'Number_22',
      'Number_23',
      'Number_24',
      'Number_25',
      'Number_26',
    ];
    const nonDutyHoursFields = [
      'Number_32',
      'Number_33',
      'Number_34',
      'Number_35',
      'Number_36',
      'Number_37',
      'Number_38',
      'Number_39',
      'Number_40',
      'Number_41',
    ];
    const nonCreditableFields = [
      'Number_48',
      'Number_49',
      'Number_50',
      'Number_51',
      'Number_52',
      'Number_53',
      'Number_54',
      'Number_55',
      'Number_56',
      'Number_57',
    ];
    const compTimeFields = [
      'Number_63',
      'Number_64',
      'Number_65',
      'Number_66',
      'Number_67',
      'Number_68',
      'Number_69',
      'Number_70',
      'Number_71',
      'Number_72',
    ];

    formData.itinerary.forEach((leg, index) => {
      if (index >= 10) return; // Form only has 10 rows

      const calc = calculations[index];
      if (!calc) return;

      // Format departure datetime
      const depDateTime = getDepartureDateTime(leg);
      if (depDateTime) {
        const dep = new Date(depDateTime);
        const depStr = formatDateTime(dep);
        trySetTextField(form, localDateTimeFields[index], depStr);
      }

      // Format arrival datetime
      const arrDateTime = getArrivalDateTime(leg);
      if (arrDateTime) {
        const arr = new Date(arrDateTime);
        const arrStr = formatDateTime(arr);
        trySetTextField(form, arrivalDateTimeFields[index], arrStr);
      }

      // Activity description (from -> to)
      const fromStr = leg.from.details || leg.from.type;
      const toStr = leg.to.details || leg.to.type;
      const activity = `${fromStr} to ${toStr}`;
      trySetTextField(form, activityFields[index], activity);

      // Numerical fields
      trySetTextField(
        form,
        actualTravelFields[index],
        formatDecimalHours(calc.actualTravelTime)
      );
      trySetTextField(
        form,
        dutyHoursFields[index],
        formatDecimalHours(calc.dutyHours)
      );
      trySetTextField(
        form,
        nonDutyHoursFields[index],
        formatDecimalHours(calc.nonDutyHours)
      );
      trySetTextField(
        form,
        nonCreditableFields[index],
        formatDecimalHours(calc.nonCreditableTime)
      );
      trySetTextField(
        form,
        compTimeFields[index],
        formatDecimalHours(calc.compTimeRequested)
      );
    });

    // === TOTALS ===
    trySetTextField(
      form,
      'Number_47',
      formatDecimalHours(totals.actualTravelTime)
    );
    trySetTextField(
      form,
      'Number_62',
      formatDecimalHours(totals.compTimeRequested)
    );

    // Signature fields
    trySetTextField(form, 'Full_Name_2', fullName);
    trySetTextField(form, 'Date_2', dateStr);
  } catch (e) {
    console.warn('Error filling Comp Time form:', e);
  }

  return await pdfDoc.save();
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Format a date/time for the comp time form
 */
function formatDateTime(date: Date): string {
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 || 12;

  return `${month}/${day} ${hour12}:${minutes}${ampm}`;
}

/**
 * Safely try to set a text field
 */
function trySetTextField(
  form: ReturnType<typeof PDFDocument.prototype.getForm>,
  fieldName: string,
  value: string,
  fontSize?: number
): void {
  try {
    const field = form.getTextField(fieldName);
    if (fontSize) {
      field.setFontSize(fontSize);
    }
    field.setText(value);
  } catch (e) {
    console.warn(`Could not set field ${fieldName}:`, e);
  }
}

/**
 * Safely try to check a checkbox
 */
function tryCheckBox(
  form: ReturnType<typeof PDFDocument.prototype.getForm>,
  fieldName: string,
  checked: boolean
): void {
  try {
    const field = form.getCheckBox(fieldName);
    if (checked) {
      field.check();
    } else {
      field.uncheck();
    }
  } catch (e) {
    console.warn(`Could not set checkbox ${fieldName}:`, e);
  }
}

// ============================================
// DOWNLOAD FUNCTIONS
// ============================================

/**
 * Generate both PDFs and trigger downloads
 */
export async function generateAndDownloadPDFs(
  formData: TravelClaimForm
): Promise<void> {
  try {
    // Generate DD 1351-2
    const dd1351Bytes = await generateDD1351PDF(formData);
    const lastName = formData.traveler.lastName || 'Traveler';
    downloadPDF(dd1351Bytes, `DD1351-2_${lastName}_${getDateString()}.pdf`);

    // Small delay between downloads
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Generate Comp Time form
    const compTimeBytes = await generateCompTimePDF(formData);
    downloadPDF(compTimeBytes, `CompTime_${lastName}_${getDateString()}.pdf`);
  } catch (e) {
    console.error('Error generating PDFs:', e);
    throw e;
  }
}

/**
 * Trigger PDF download in browser
 */
function downloadPDF(pdfBytes: Uint8Array, filename: string): void {
  const blob = new Blob([pdfBytes as BlobPart], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Get current date as YYYYMMDD string
 */
function getDateString(): string {
  const now = new Date();
  return `${now.getFullYear()}${(now.getMonth() + 1)
    .toString()
    .padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}`;
}
