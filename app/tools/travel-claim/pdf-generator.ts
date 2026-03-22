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
  const pdfUrl = '/forms/DD1351-2(2026).pdf';
  const existingPdfBytes = await fetch(pdfUrl).then((res) => res.arrayBuffer());
  const pdfDoc = await PDFDocument.load(existingPdfBytes, {ignoreEncryption: true});
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
    const identityValue = formData.traveler.dodId || '';

    const departureFieldNames = [
      'form1[0].#subform[0].#subform[3].#subform[8].TextField5[0]',
      'form1[0].#subform[0].#subform[3].#subform[9].#subform[10].TextField7[0]',
      'form1[0].#subform[0].#subform[3].#subform[14].#subform[15].TextField9[0]',
      'form1[0].#subform[0].#subform[3].#subform[19].#subform[20].TextField11[0]',
      'form1[0].#subform[0].#subform[3].#subform[24].#subform[25].TextField13[0]',
      'form1[0].#subform[0].#subform[3].#subform[29].#subform[30].TextField15[0]',
      'form1[0].#subform[0].#subform[3].#subform[34].#subform[35].TextField17[0]',
    ];
    const arrivalFieldNames = [
      '',
      'form1[0].#subform[0].#subform[3].#subform[9].#subform[10].TextField6[0]',
      'form1[0].#subform[0].#subform[3].#subform[14].#subform[15].TextField8[0]',
      'form1[0].#subform[0].#subform[3].#subform[19].#subform[20].TextField10[0]',
      'form1[0].#subform[0].#subform[3].#subform[24].#subform[25].TextField12[0]',
      'form1[0].#subform[0].#subform[3].#subform[29].#subform[30].TextField14[0]',
      'form1[0].#subform[0].#subform[3].#subform[34].#subform[35].TextField16[0]',
      'form1[0].#subform[0].#subform[3].#subform[39].TextField18[0]',
    ];
    const placeFieldNames = [
      'form1[0].#subform[0].#subform[3].#subform[8].TextField3[1]',
      'form1[0].#subform[0].#subform[3].#subform[9].TextField3[3]',
      'form1[0].#subform[0].#subform[3].#subform[14].TextField3[7]',
      'form1[0].#subform[0].#subform[3].#subform[19].TextField3[11]',
      'form1[0].#subform[0].#subform[3].#subform[24].TextField3[15]',
      'form1[0].#subform[0].#subform[3].#subform[29].TextField3[19]',
      'form1[0].#subform[0].#subform[3].#subform[34].TextField3[23]',
      'form1[0].#subform[0].#subform[3].#subform[39].TextField3[27]',
    ];
    const modeFieldNames = [
      'form1[0].#subform[0].#subform[3].#subform[8].TextField3[2]',
      'form1[0].#subform[0].#subform[3].#subform[9].#subform[11].#subform[12].TextField3[5]',
      'form1[0].#subform[0].#subform[3].#subform[14].#subform[16].#subform[17].TextField3[9]',
      'form1[0].#subform[0].#subform[3].#subform[19].#subform[21].#subform[22].TextField3[13]',
      'form1[0].#subform[0].#subform[3].#subform[24].#subform[26].#subform[27].TextField3[17]',
      'form1[0].#subform[0].#subform[3].#subform[29].#subform[31].#subform[32].TextField3[21]',
      'form1[0].#subform[0].#subform[3].#subform[34].#subform[36].#subform[37].TextField3[25]',
    ];
    const reasonFieldNames = [
      '',
      'form1[0].#subform[0].#subform[3].#subform[9].#subform[11].#subform[12].TextField3[4]',
      'form1[0].#subform[0].#subform[3].#subform[14].#subform[16].#subform[17].TextField3[8]',
      'form1[0].#subform[0].#subform[3].#subform[19].#subform[21].#subform[22].TextField3[12]',
      'form1[0].#subform[0].#subform[3].#subform[24].#subform[26].#subform[27].TextField3[16]',
      'form1[0].#subform[0].#subform[3].#subform[29].#subform[31].#subform[32].TextField3[20]',
      'form1[0].#subform[0].#subform[3].#subform[34].#subform[36].#subform[37].TextField3[24]',
      'form1[0].#subform[0].#subform[3].#subform[39].TextField3[28]',
    ];
    const milesFieldNames = [
      '',
      'form1[0].#subform[0].#subform[3].#subform[9].#subform[11].#subform[13].TextField3[6]',
      'form1[0].#subform[0].#subform[3].#subform[14].#subform[16].#subform[18].TextField3[10]',
      'form1[0].#subform[0].#subform[3].#subform[19].#subform[21].#subform[23].TextField3[14]',
      'form1[0].#subform[0].#subform[3].#subform[24].#subform[26].#subform[28].TextField3[18]',
      'form1[0].#subform[0].#subform[3].#subform[29].#subform[31].#subform[33].TextField3[22]',
      'form1[0].#subform[0].#subform[3].#subform[34].#subform[36].#subform[38].TextField3[26]',
      'form1[0].#subform[0].#subform[3].#subform[39].TextField3[29]',
    ];
    const lodgingFieldNames = [
      '',
      'form1[0].#subform[0].#subform[3].#subform[9].#subform[11].DecimalField4[0]',
      'form1[0].#subform[0].#subform[3].#subform[14].#subform[16].DecimalField4[1]',
      'form1[0].#subform[0].#subform[3].#subform[19].#subform[21].DecimalField4[2]',
      'form1[0].#subform[0].#subform[3].#subform[24].#subform[26].DecimalField4[3]',
      'form1[0].#subform[0].#subform[3].#subform[29].#subform[31].DecimalField4[4]',
      'form1[0].#subform[0].#subform[3].#subform[34].#subform[36].DecimalField4[5]',
      'form1[0].#subform[0].#subform[3].#subform[39].DecimalField4[6]',
    ];

    const expenseDateFieldNames = [
      'form1[0].#subform[0].#subform[3].#subform[40].DateField1[1]',
      'form1[0].#subform[0].#subform[3].#subform[40].DateField1[2]',
      'form1[0].#subform[0].#subform[3].#subform[40].DateField1[3]',
      'form1[0].#subform[0].#subform[3].#subform[40].DateField1[4]',
      'form1[0].#subform[0].#subform[3].#subform[45].DateField1[5]',
      'form1[0].#subform[0].#subform[3].#subform[45].DateField1[6]',
      'form1[0].#subform[0].#subform[3].#subform[45].DateField1[7]',
      'form1[0].#subform[0].#subform[3].#subform[45].DateField1[8]',
      'form1[0].#subform[0].#subform[3].#subform[45].DateField1[9]',
    ];
    const expenseDescFieldNames = [
      'form1[0].#subform[0].#subform[3].#subform[40].TextField3[30]',
      'form1[0].#subform[0].#subform[3].#subform[40].TextField3[31]',
      'form1[0].#subform[0].#subform[3].#subform[40].TextField3[32]',
      'form1[0].#subform[0].#subform[3].#subform[40].TextField3[33]',
      'form1[0].#subform[0].#subform[3].#subform[45].TextField3[34]',
      'form1[0].#subform[0].#subform[3].#subform[45].TextField3[35]',
      'form1[0].#subform[0].#subform[3].#subform[45].TextField3[36]',
      'form1[0].#subform[0].#subform[3].#subform[45].TextField3[37]',
      'form1[0].#subform[0].#subform[3].#subform[45].TextField3[38]',
    ];
    const expenseAmountFieldNames = [
      'form1[0].#subform[0].#subform[3].#subform[40].DecimalField5[0]',
      'form1[0].#subform[0].#subform[3].#subform[40].DecimalField5[1]',
      'form1[0].#subform[0].#subform[3].#subform[40].DecimalField5[2]',
      'form1[0].#subform[0].#subform[3].#subform[40].DecimalField5[3]',
      'form1[0].#subform[0].#subform[3].#subform[45].DecimalField5[4]',
      'form1[0].#subform[0].#subform[3].#subform[45].DecimalField5[5]',
      'form1[0].#subform[0].#subform[3].#subform[45].DecimalField5[6]',
      'form1[0].#subform[0].#subform[3].#subform[45].DecimalField5[7]',
      'form1[0].#subform[0].#subform[3].#subform[45].DecimalField5[8]',
    ];

    // === CHECKBOXES ===
    tryCheckBox(form, 'form1[0].#subform[0].#subform[1].CheckBox1[0]', true); // EFT payment
    tryCheckBox(
      form,
      'form1[0].#subform[0].#subform[42].#subform[43].CheckBox2[7]',
      true
    ); // TDY travel
    tryCheckBox(
      form,
      'form1[0].#subform[0].#subform[3].#subform[5].CheckBox2[1]',
      true
    ); // Unaccompanied

    if (gtccTotal > 0) {
      tryCheckBox(form, 'form1[0].#subform[0].#subform[2].CheckBox1[2]', true); // Split disbursement
    }

    if (formData.travelType === 'CONUS') {
      tryCheckBox(
        form,
        'form1[0].#subform[0].#subform[3].#subform[41].CheckBox2[4]',
        true
      );
    } else {
      tryCheckBox(
        form,
        'form1[0].#subform[0].#subform[3].#subform[41].CheckBox2[5]',
        true
      );
    }

    tryCheckBox(
      form,
      'form1[0].#subform[0].#subform[3].four[0].CheckBox3[1]',
      true
    );

    // === TEXT FIELDS ===
    const fullName =
      `${formData.traveler.lastName}, ${formData.traveler.firstName} ${formData.traveler.middleInitial}`.trim();
    trySetTextField(form, 'form1[0].#subform[0].#subform[3].TextField2[0]', fullName);
    trySetTextField(
      form,
      'form1[0].#subform[0].#subform[3].TextField2[1]',
      `GS-${formData.traveler.grade}`
    );
    trySetTextField(
      form,
      'form1[0].#subform[0].#subform[3].four[0].TextField2[0]',
      identityValue
    );
    trySetTextField(form, 'form1[0].#subform[0].#subform[3].TextField2[2]', formData.traveler.street);
    trySetTextField(form, 'form1[0].#subform[0].#subform[3].TextField2[3]', formData.traveler.city);
    trySetTextField(form, 'form1[0].#subform[0].#subform[3].TextField2[4]', formData.traveler.state);
    trySetTextField(form, 'form1[0].#subform[0].#subform[3].TextField2[5]', formData.traveler.zip);
    trySetTextField(form, 'form1[0].#subform[0].#subform[3].TextField2[6]', formData.traveler.email);
    trySetTextField(
      form,
      'form1[0].#subform[0].#subform[3].#subform[5].TextField2[7]',
      formData.traveler.phone
    );
    trySetTextField(
      form,
      'form1[0].#subform[0].#subform[3].#subform[5].TextField2[8]',
      formData.authorizationNumber
    );
    trySetTextField(
      form,
      'form1[0].#subform[0].#subform[3].#subform[6].DecimalField2[0]',
      formData.receivedAdvance ? `$${formData.advanceAmount?.toFixed(2)}` : '$0'
    );
    trySetTextField(
      form,
      'form1[0].#subform[0].#subform[3].#subform[5].TextField2[9]',
      'Military Sealift Command'
    );

    if (gtccTotal > 0) {
      trySetTextField(
        form,
        'form1[0].#subform[0].#subform[2].DecimalField1[0]',
        gtccTotal.toFixed(2)
      );
    }

    // === ITINERARY ===
    if (formData.itinerary.length > 0) {
      const firstLeg = formData.itinerary[0];
      if (firstLeg.departureDate) {
        const firstDate = new Date(firstLeg.departureDate);
        trySetTextField(
          form,
          'form1[0].#subform[0].#subform[3].#subform[7].DecimalField2[1]',
          firstDate.getFullYear().toString()
        );
      }

      formData.itinerary.forEach((leg, index) => {
        if (index >= placeFieldNames.length) return;

        // Departure date (MM/DD format)
        if (leg.departureDate) {
          const depDate = new Date(leg.departureDate);
          const depDateStr = `${(depDate.getMonth() + 1)
            .toString()
            .padStart(2, '0')}/${depDate
            .getDate()
            .toString()
            .padStart(2, '0')}`;

          const departureFieldName = departureFieldNames[index];
          if (departureFieldName) {
            trySetTextField(form, departureFieldName, depDateStr, 8);
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
          const arrivalFieldName = arrivalFieldNames[index];
          if (arrivalFieldName) {
            trySetTextField(form, arrivalFieldName, arrDateStr, 8);
          }
        }

        if (index === 0) {
          const fromDetails =
            leg.from.type === 'HOR'
              ? `HOR - ${leg.from.details}`
              : leg.from.details || leg.from.type;
          trySetTextField(form, placeFieldNames[0], fromDetails);
        }

        const destinationFieldName = placeFieldNames[index + 1];
        if (destinationFieldName) {
          const toDetails =
            leg.to.type === 'HOR'
              ? `HOR - ${leg.to.details}`
              : leg.to.details || leg.to.type;
          trySetTextField(form, destinationFieldName, toDetails);
        }

        // Mode of transport
        const modeFieldName = modeFieldNames[index];
        if (modeFieldName) {
          trySetTextField(form, modeFieldName, getTransportModeCode(leg.transport.type));
        }

        // Reason for stop
        const reasonFieldName = reasonFieldNames[index + 1];
        if (reasonFieldName) {
          trySetTextField(form, reasonFieldName, getStopReasonCode(leg.reason));
        }

        // Miles (for POV)
        if (leg.transport.miles) {
          const milesFieldName = milesFieldNames[index + 1];
          if (milesFieldName) {
            trySetTextField(form, milesFieldName, leg.transport.miles.toString());
          }
        }

        // Lodging cost
        if (leg.delayHotelCost) {
          const lodgingFieldName = lodgingFieldNames[index + 1];
          if (lodgingFieldName) {
            trySetTextField(form, lodgingFieldName, leg.delayHotelCost.toFixed(2));
          }
        }
      });
    }

    // === ADDITIONAL EXPENSES ===
    let expenseRow = 0;
    formData.additionalExpenses.forEach((expense) => {
      if (!expense.paidWithGTCC && expenseRow < expenseDateFieldNames.length) {
        const expDate = new Date(expense.date);
        const dateStr = `${expDate.getFullYear()}${(expDate.getMonth() + 1)
          .toString()
          .padStart(2, '0')}${expDate.getDate().toString().padStart(2, '0')}`;
        trySetTextField(form, expenseDateFieldNames[expenseRow], dateStr);
        trySetTextField(form, expenseDescFieldNames[expenseRow], expense.description);
        trySetTextField(form, expenseAmountFieldNames[expenseRow], expense.amount.toFixed(2));
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
