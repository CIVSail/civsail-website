// app/tools/leave-chit/page.tsx
'use client';

import { useState, useMemo } from 'react';
import {
  ClipboardList,
  Info,
  Calendar,
  User,
  AlertTriangle,
  Download,
  FileText,
  ChevronDown,
  HelpCircle,
} from 'lucide-react';
import { PDFDocument } from 'pdf-lib';

// ============================================================================
// TYPES
// ============================================================================

type LeaveType = 'Annual' | 'Sick' | 'Compensatory' | 'Travel Comp' | 'Time Off AWD' | 'Shore' | 'LWOP' | '';

interface FormState {
  firstName: string;
  middleName: string;
  lastName: string;
  employeeId: string;
  phoneNumber: string;
  email: string;
  fmlaLeave: 'Yes' | 'No';
  fmlaReason: string;
  dutyStatus: 'FFD' | 'NFFD';
  annualHours: number;
  sickHours: number;
  compHours: number;
  travelCompHours: number;
  timeOffAWDHours: number;
  shoreDays: number;
  leaveFirst: LeaveType;
  leaveSecond: LeaveType;
  leaveThird: LeaveType;
  leaveFourth: LeaveType;
  leaveFifth: LeaveType;
  leaveSixth: LeaveType;
  dateStart: string;
  dateEnd: string;
  remarks: string;
}

interface LeaveBalance {
  id: keyof FormState;
  label: string;
  color: string;
  unit: 'Hrs' | 'Days';
  leaveType: LeaveType;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const LEAVE_BALANCES: LeaveBalance[] = [
  { id: 'annualHours', label: 'Annual', color: '#007BFF', unit: 'Hrs', leaveType: 'Annual' },
  { id: 'sickHours', label: 'Sick', color: '#FF3131', unit: 'Hrs', leaveType: 'Sick' },
  { id: 'compHours', label: 'Compensatory', color: '#FFDE59', unit: 'Hrs', leaveType: 'Compensatory' },
  { id: 'travelCompHours', label: 'Travel Comp', color: '#8C52FF', unit: 'Hrs', leaveType: 'Travel Comp' },
  { id: 'timeOffAWDHours', label: 'Time Off AWD', color: '#00BF63', unit: 'Hrs', leaveType: 'Time Off AWD' },
  { id: 'shoreDays', label: 'Shore', color: '#FF66C4', unit: 'Days', leaveType: 'Shore' },
];

const FMLA_REASONS = [
  'Birth/Adoption/Foster Care',
  'Serious health condition of spouse, son, daughter, or parent',
  'Serious health condition of self',
];

const initialFormState: FormState = {
  firstName: '',
  middleName: '',
  lastName: '',
  employeeId: '',
  phoneNumber: '',
  email: '',
  fmlaLeave: 'No',
  fmlaReason: 'Birth/Adoption/Foster Care',
  dutyStatus: 'FFD',
  annualHours: 0,
  sickHours: 0,
  compHours: 0,
  travelCompHours: 0,
  timeOffAWDHours: 0,
  shoreDays: 0,
  leaveFirst: '',
  leaveSecond: '',
  leaveThird: '',
  leaveFourth: '',
  leaveFifth: '',
  leaveSixth: '',
  dateStart: '',
  dateEnd: '',
  remarks: '',
};

// ============================================================================
// HOLIDAY DETECTION - Matches original exactly
// ============================================================================

function isFederalHolidayOrWeekend(date: Date): boolean {
  const dayOfWeek = date.getUTCDay();
  const month = date.getUTCMonth();
  const day = date.getUTCDate();

  // Weekends
  if (dayOfWeek === 0 || dayOfWeek === 6) return true;

  // New Year's Day
  if (month === 0 && day === 1) return true;
  if (month === 0 && day === 2 && dayOfWeek === 1) return true;
  if (month === 11 && day === 31 && dayOfWeek === 5) return true;

  // MLK Jr's Birthday (3rd Monday Jan)
  if (month === 0 && day >= 15 && day <= 21 && dayOfWeek === 1) return true;

  // Washington's Birthday (3rd Monday Feb)
  if (month === 1 && day >= 15 && day <= 21 && dayOfWeek === 1) return true;

  // Memorial Day (Last Monday May)
  if (month === 4 && day >= 25 && day <= 31 && dayOfWeek === 1) return true;

  // Juneteenth
  if (month === 5 && day === 19) return true;
  if (month === 5 && day === 20 && dayOfWeek === 1) return true;
  if (month === 5 && day === 18 && dayOfWeek === 5) return true;

  // Independence Day
  if (month === 6 && day === 4) return true;
  if (month === 6 && day === 5 && dayOfWeek === 1) return true;
  if (month === 6 && day === 3 && dayOfWeek === 5) return true;

  // Labor Day (1st Monday Sept)
  if (month === 8 && day >= 1 && day <= 7 && dayOfWeek === 1) return true;

  // Columbus Day (2nd Monday Oct)
  if (month === 9 && day >= 8 && day <= 14 && dayOfWeek === 1) return true;

  // Veterans Day
  if (month === 10 && day === 11) return true;
  if (month === 10 && day === 12 && dayOfWeek === 1) return true;
  if (month === 10 && day === 10 && dayOfWeek === 5) return true;

  // Thanksgiving (4th Thursday Nov)
  if (month === 10 && day >= 22 && day <= 28 && dayOfWeek === 4) return true;

  // Christmas
  if (month === 11 && day === 25) return true;
  if (month === 11 && day === 26 && dayOfWeek === 1) return true;
  if (month === 11 && day === 24 && dayOfWeek === 5) return true;

  return false;
}

// ============================================================================
// LEAVE CALCULATION - Matches original logic
// ============================================================================

interface LeaveResult {
  startDateShore: string; endDateShore: string;
  startDateAnnual: string; endDateAnnual: string;
  startDateComp: string; endDateComp: string;
  startDateSick: string; endDateSick: string;
  startDateTravel: string; endDateTravel: string;
  startDateAWD: string; endDateAWD: string;
  startDateLWOP: string; endDateLWOP: string;
  annualDays: number; sickDays: number; compDays: number;
  travelDays: number; awdDays: number; shoreDays: number; lwopDays: number;
}

function calculateLeaveDates(form: FormState): LeaveResult | null {
  if (!form.dateStart || !form.dateEnd) return null;

  const priorities: LeaveType[] = [
    form.leaveFirst, form.leaveSecond, form.leaveThird,
    form.leaveFourth, form.leaveFifth, form.leaveSixth,
  ].filter(Boolean) as LeaveType[];

  // Available days
  let annualDays = Math.floor(form.annualHours / 8);
  let sickDays = Math.floor(form.sickHours / 8);
  let compDays = Math.floor(form.compHours / 8);
  let travelDays = Math.floor(form.travelCompHours / 8);
  let awdDays = Math.floor(form.timeOffAWDHours / 8);
  let shoreDaysAvail = form.shoreDays;
  let lwopDays = 0;

  const startDate = new Date(form.dateStart);
  const endDate = new Date(form.dateEnd);
  const curDate = new Date(startDate.getTime());

  let startDateShore = '', endDateShore = '';
  let startDateAnnual = '', endDateAnnual = '';
  let startDateComp = '', endDateComp = '';
  let startDateSick = '', endDateSick = '';
  let startDateTravel = '', endDateTravel = '';
  let startDateAWD = '', endDateAWD = '';
  let startDateLWOP = '', endDateLWOP = '';

  let usedAnnual = 0, usedSick = 0, usedComp = 0, usedTravel = 0, usedAWD = 0, usedShore = 0;

  const getRemainingDays = (type: LeaveType): number => {
    switch (type) {
      case 'Annual': return annualDays;
      case 'Sick': return sickDays;
      case 'Compensatory': return compDays;
      case 'Travel Comp': return travelDays;
      case 'Time Off AWD': return awdDays;
      case 'Shore': return shoreDaysAvail;
      default: return 0;
    }
  };

  const decrementDays = (type: LeaveType) => {
    switch (type) {
      case 'Annual': annualDays--; usedAnnual++; break;
      case 'Sick': sickDays--; usedSick++; break;
      case 'Compensatory': compDays--; usedComp++; break;
      case 'Travel Comp': travelDays--; usedTravel++; break;
      case 'Time Off AWD': awdDays--; usedAWD++; break;
      case 'Shore': shoreDaysAvail--; usedShore++; break;
      case 'LWOP': lwopDays++; break;
    }
  };

  const formatDate = (d: Date) => d.toLocaleDateString('en-us', {
    year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC'
  });

  let currentPriorityIndex = 0;
  let currentLeaveType: LeaveType = priorities[0] || 'LWOP';
  let count = 0;

  while (curDate <= endDate) {
    const dateStr = formatDate(curDate);

    if (!isFederalHolidayOrWeekend(curDate)) {
      // Move to next priority if current is exhausted
      while (currentLeaveType !== 'LWOP' && getRemainingDays(currentLeaveType) <= 0) {
        // Set end date for exhausted type
        switch (currentLeaveType) {
          case 'Annual': endDateAnnual = dateStr; break;
          case 'Sick': endDateSick = dateStr; break;
          case 'Compensatory': endDateComp = dateStr; break;
          case 'Travel Comp': endDateTravel = dateStr; break;
          case 'Time Off AWD': endDateAWD = dateStr; break;
          case 'Shore': endDateShore = dateStr; break;
        }
        currentPriorityIndex++;
        currentLeaveType = priorities[currentPriorityIndex] || 'LWOP';
        count = 0;
      }

      // Set start date if first day of this type
      if (count === 0) {
        switch (currentLeaveType) {
          case 'Annual': if (!startDateAnnual) startDateAnnual = dateStr; break;
          case 'Sick': if (!startDateSick) startDateSick = dateStr; break;
          case 'Compensatory': if (!startDateComp) startDateComp = dateStr; break;
          case 'Travel Comp': if (!startDateTravel) startDateTravel = dateStr; break;
          case 'Time Off AWD': if (!startDateAWD) startDateAWD = dateStr; break;
          case 'Shore': if (!startDateShore) startDateShore = dateStr; break;
          case 'LWOP': if (!startDateLWOP) startDateLWOP = dateStr; break;
        }
      }

      decrementDays(currentLeaveType);
      count++;

      // Update end date
      switch (currentLeaveType) {
        case 'Annual': endDateAnnual = dateStr; break;
        case 'Sick': endDateSick = dateStr; break;
        case 'Compensatory': endDateComp = dateStr; break;
        case 'Travel Comp': endDateTravel = dateStr; break;
        case 'Time Off AWD': endDateAWD = dateStr; break;
        case 'Shore': endDateShore = dateStr; break;
        case 'LWOP': endDateLWOP = dateStr; break;
      }
    }

    curDate.setUTCDate(curDate.getUTCDate() + 1);
  }

  return {
    startDateShore, endDateShore,
    startDateAnnual, endDateAnnual,
    startDateComp, endDateComp,
    startDateSick, endDateSick,
    startDateTravel, endDateTravel,
    startDateAWD, endDateAWD,
    startDateLWOP, endDateLWOP,
    annualDays: usedAnnual,
    sickDays: usedSick,
    compDays: usedComp,
    travelDays: usedTravel,
    awdDays: usedAWD,
    shoreDays: usedShore,
    lwopDays,
  };
}

// ============================================================================
// PDF GENERATION
// ============================================================================

async function generateLeaveChitPDF(form: FormState): Promise<void> {
  const calc = calculateLeaveDates(form);
  if (!calc) {
    alert('Please enter valid start and end dates.');
    return;
  }

  try {
    // Fetch OPM 71 PDF template - you'll need to place this in public/forms/
    const pdfUrl = '/forms/opm71_fillable.pdf';
    const existingPdfBytes = await fetch(pdfUrl).then(res => res.arrayBuffer());
    
    // Fetch logo - you'll need to place this in public/images/
    const logoUrl = '/images/CIVSail_Logo_Crop.png';
    const logoBytes = await fetch(logoUrl).then(res => res.arrayBuffer());

    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const logo = await pdfDoc.embedPng(logoBytes);
    const logoDims = logo.scale(0.05);
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    const pdfForm = pdfDoc.getForm();

    // Build remarks
    let fullRemarks = `Contact: ${form.phoneNumber} / ${form.email}; ${form.remarks}`;

    // Fill basic fields
    pdfForm.getTextField('form1[0].#subform[0].Table1[0].Row2[0].TextField[0]')
      .setText(`${form.lastName}, ${form.firstName}, ${form.middleName}`);
    pdfForm.getTextField('form1[0].#subform[0].Table1[0].Row2[0].TextField[1]')
      .setText(form.employeeId);
    pdfForm.getTextField('form1[0].#subform[0].Table1[0].Row4[0].TextField[0]')
      .setText('Military Sealift Command');
    pdfForm.getTextField('form1[0].#subform[0].Table8[0].Row5[0].DateTimeField25[0]')
      .setText(new Date().toDateString());

    // Fill Shore Leave
    if (calc.startDateShore) {
      pdfForm.getCheckBox('form1[0].#subform[0].CheckBox4[1]').check();
      pdfForm.getTextField('form1[0].#subform[0].Table7[0].Row2[0].DateTimeField21[0]').setText(calc.startDateShore);
      pdfForm.getTextField('form1[0].#subform[0].Table7[0].Row2[0].DateTimeField22[0]').setText(calc.endDateShore);
      pdfForm.getTextField('form1[0].#subform[0].Table7[0].Row2[0].DateTimeField28[0]').setText('8:00:00 AM');
      pdfForm.getTextField('form1[0].#subform[0].Table7[0].Row2[0].DateTimeField31[0]').setText('5:00:00 PM');
      pdfForm.getTextField('form1[0].#subform[0].Table7[0].Row2[0].TextField[0]').setText(calc.shoreDays.toString());
      fullRemarks = `${calc.shoreDays} Shore Days for ${calc.startDateShore} - ${calc.endDateShore}; ${fullRemarks}`;
    }

    // Fill Annual Leave
    if (calc.startDateAnnual) {
      pdfForm.getCheckBox('form1[0].#subform[0].CheckBox1[0]').check();
      pdfForm.getTextField('form1[0].#subform[0].Table3[0].Row3[0].DateTimeField1[0]').setText(calc.startDateAnnual);
      pdfForm.getTextField('form1[0].#subform[0].Table3[0].Row3[0].DateTimeField2[0]').setText(calc.endDateAnnual);
      pdfForm.getTextField('form1[0].#subform[0].Table3[1].Row3[0].DateTimeField1[0]').setText('8:00:00 AM');
      pdfForm.getTextField('form1[0].#subform[0].Table3[1].Row3[0].DateTimeField2[0]').setText('5:00:00 PM');
      pdfForm.getTextField('form1[0].#subform[0].Table4[0].Row2[0].TextField[0]').setText((calc.annualDays * 8).toString());
    }

    // Fill Comp Leave
    if (calc.startDateComp) {
      pdfForm.getCheckBox('form1[0].#subform[0].CheckBox4[0]').check();
      pdfForm.getTextField('form1[0].#subform[0].Table7[0].Row1[0].DateTimeField19[0]').setText(calc.startDateComp);
      pdfForm.getTextField('form1[0].#subform[0].Table7[0].Row1[0].DateTimeField20[0]').setText(calc.endDateComp);
      pdfForm.getTextField('form1[0].#subform[0].Table7[0].Row1[0].DateTimeField27[0]').setText('8:00:00 AM');
      pdfForm.getTextField('form1[0].#subform[0].Table7[0].Row1[0].DateTimeField30[0]').setText('5:00:00 PM');
      pdfForm.getTextField('form1[0].#subform[0].Table7[0].Row1[0].TextField[0]').setText((calc.compDays * 8).toString());
    }

    // Fill Sick Leave
    if (calc.startDateSick) {
      pdfForm.getCheckBox('form1[0].#subform[0].CheckBox1[3]').check();
      pdfForm.getTextField('form1[0].#subform[0].Table3[0].Row6[0].DateTimeField7[0]').setText(calc.startDateSick);
      pdfForm.getTextField('form1[0].#subform[0].Table3[0].Row6[0].DateTimeField8[0]').setText(calc.endDateSick);
      pdfForm.getTextField('form1[0].#subform[0].Table3[1].Row6[0].DateTimeField15[0]').setText('8:00:00 AM');
      pdfForm.getTextField('form1[0].#subform[0].Table3[1].Row6[0].DateTimeField16[0]').setText('5:00:00 PM');
      pdfForm.getTextField('form1[0].#subform[0].Table4[0].Row5[0].TextField[0]').setText((calc.sickDays * 8).toString());
    }

    // Travel Comp and Time Off AWD go in remarks
    if (calc.startDateTravel) {
      fullRemarks = `${calc.travelDays * 8} hours Travel Comp for ${calc.startDateTravel} - ${calc.endDateTravel}; ${fullRemarks}`;
    }
    if (calc.startDateAWD) {
      fullRemarks = `${calc.awdDays * 8} hours Time Off AWD for ${calc.startDateAWD} - ${calc.endDateAWD}; ${fullRemarks}`;
    }

    // Fill LWOP
    if (calc.startDateLWOP) {
      pdfForm.getCheckBox('form1[0].#subform[0].CheckBox4[2]').check();
      pdfForm.getTextField('form1[0].#subform[0].Table7[0].Row3[0].DateTimeField23[0]').setText(calc.startDateLWOP);
      pdfForm.getTextField('form1[0].#subform[0].Table7[0].Row3[0].DateTimeField24[0]').setText(calc.endDateLWOP);
      pdfForm.getTextField('form1[0].#subform[0].Table7[0].Row3[0].DateTimeField29[0]').setText('8:00:00 AM');
      pdfForm.getTextField('form1[0].#subform[0].Table7[0].Row3[0].DateTimeField32[0]').setText('5:00:00 PM');
      pdfForm.getTextField('form1[0].#subform[0].Table7[0].Row3[0].TextField[0]').setText((calc.lwopDays * 8).toString());
    }

    // FMLA checkboxes
    if (form.fmlaLeave === 'Yes') {
      pdfForm.getCheckBox('form1[0].#subform[0].CheckBox2[0]').check();
      if (form.fmlaReason === 'Birth/Adoption/Foster Care') {
        pdfForm.getCheckBox('form1[0].#subform[0].CheckBox2[1]').check();
      } else if (form.fmlaReason === 'Serious health condition of spouse, son, daughter, or parent') {
        pdfForm.getCheckBox('form1[0].#subform[0].CheckBox2[2]').check();
      } else if (form.fmlaReason === 'Serious health condition of self') {
        pdfForm.getCheckBox('form1[0].#subform[0].CheckBox2[3]').check();
      }
    }

    // Set remarks
    pdfForm.getTextField('form1[0].#subform[0].Table8[0].Row2[0].TextField[0]').setText(fullRemarks);

    // Draw logos
    firstPage.drawImage(logo, { x: 5, y: 5, width: logoDims.width, height: logoDims.height });
    firstPage.drawImage(logo, {
      x: firstPage.getWidth() - logoDims.width * 0.9 - 5,
      y: firstPage.getHeight() - logoDims.height * 0.9 - 5,
      width: logoDims.width * 0.9,
      height: logoDims.height * 0.9,
    });

    // Save and download
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes as BlobPart], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `OPM71_${form.lastName}_${form.firstName}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Error generating PDF. Please ensure the OPM 71 template and logo are available.');
  }
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function LeaveChitPage() {
  const [form, setForm] = useState<FormState>(initialFormState);
  const [generating, setGenerating] = useState(false);

  const activeLeaveTypes = useMemo(() => {
    const active: LeaveType[] = [];
    if (form.annualHours > 0) active.push('Annual');
    if (form.sickHours > 0) active.push('Sick');
    if (form.compHours > 0 && form.fmlaLeave !== 'Yes') active.push('Compensatory');
    if (form.travelCompHours > 0 && form.fmlaLeave !== 'Yes') active.push('Travel Comp');
    if (form.timeOffAWDHours > 0 && form.fmlaLeave !== 'Yes') active.push('Time Off AWD');
    if (form.shoreDays > 0 && form.fmlaLeave !== 'Yes') active.push('Shore');
    return active;
  }, [form.annualHours, form.sickHours, form.compHours, form.travelCompHours, form.timeOffAWDHours, form.shoreDays, form.fmlaLeave]);

  const updateField = <K extends keyof FormState>(field: K, value: FormState[K]) => {
    setForm(prev => {
      const newForm = { ...prev, [field]: value };
      
      if (field === 'sickHours' && prev.dutyStatus === 'FFD' && (value as number) > 24) {
        alert('You cannot use more than 24 hours of sick leave in a pay period while in a Fit For Duty status.');
        return { ...prev, sickHours: 24 };
      }

      if (field === 'fmlaLeave' && value === 'Yes') {
        newForm.dutyStatus = 'NFFD';
        newForm.compHours = 0;
        newForm.travelCompHours = 0;
        newForm.timeOffAWDHours = 0;
        newForm.shoreDays = 0;
      }

      return newForm;
    });
  };

  const enabledPriorityCount = activeLeaveTypes.length;

  const handleGenerate = async () => {
    if (!form.dateStart || !form.dateEnd) {
      alert('Please enter start and end dates.');
      return;
    }
    setGenerating(true);
    try {
      await generateLeaveChitPDF(form);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-amber-50/30">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 text-white">
        <div className="max-w-4xl mx-auto px-6 py-10">
          <div className="flex items-center gap-4 mb-3">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
              <ClipboardList className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold">Leave Chit Generator</h1>
              <p className="text-amber-100 text-sm">Generate OPM 71 Leave Request Forms</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Instructions */}
        <div className="bg-white rounded-xl border border-amber-100 shadow-sm p-5 mb-6">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-gray-600 space-y-3">
              <p className="font-medium text-gray-700">Instructions:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Enter your name and last 4 of SSN (or 0000 if preferred)</li>
                <li>Enter your available leave balances from your LES on MyPay</li>
                <li>Set the priority order for how leave should be charged</li>
                <li>Enter your leave start and end dates</li>
                <li>Click &quot;Generate Leave Chit&quot; to download the filled OPM 71 form</li>
              </ol>
            </div>
          </div>
        </div>

        {/* FFD Warning */}
        {form.dutyStatus === 'FFD' && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-red-700">
                <p className="font-medium">Important: Sick Leave Restriction</p>
                <p>Unless you are Not Fit For Duty (NFFD), you cannot use more than 3 days (24 hours) of sick leave per pay period.</p>
              </div>
            </div>
          </div>
        )}

        {/* Personal Information */}
        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-slate-50 to-gray-50 px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <User className="w-5 h-5 text-amber-600" />
              Personal Information
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">First Name</label>
                <input type="text" value={form.firstName} onChange={(e) => updateField('firstName', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-amber-500 focus:border-amber-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Middle Name</label>
                <input type="text" value={form.middleName} onChange={(e) => updateField('middleName', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-amber-500 focus:border-amber-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Last Name</label>
                <input type="text" value={form.lastName} onChange={(e) => updateField('lastName', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-amber-500 focus:border-amber-500" />
              </div>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">SSN Last 4</label>
                <input type="text" maxLength={4} value={form.employeeId} onChange={(e) => updateField('employeeId', e.target.value)}
                  placeholder="0000" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-amber-500 focus:border-amber-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
                <input type="text" value={form.phoneNumber} onChange={(e) => updateField('phoneNumber', e.target.value)}
                  placeholder="(123) 456-7890" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-amber-500 focus:border-amber-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                <input type="email" value={form.email} onChange={(e) => updateField('email', e.target.value)}
                  placeholder="email@example.com" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-amber-500 focus:border-amber-500" />
              </div>
            </div>
          </div>
        </section>

        {/* FMLA & Duty Status */}
        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-slate-50 to-gray-50 px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-amber-600" />
              Leave Status
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">FMLA Leave?</label>
                <div className="relative">
                  <select value={form.fmlaLeave} onChange={(e) => updateField('fmlaLeave', e.target.value as 'Yes' | 'No')}
                    className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2.5 pr-10 text-gray-900 focus:ring-2 focus:ring-amber-500">
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Duty Status</label>
                <div className="relative">
                  <select value={form.dutyStatus} onChange={(e) => updateField('dutyStatus', e.target.value as 'FFD' | 'NFFD')}
                    disabled={form.fmlaLeave === 'Yes'}
                    className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2.5 pr-10 text-gray-900 focus:ring-2 focus:ring-amber-500 disabled:bg-gray-100">
                    <option value="FFD">Fit For Duty (FFD)</option>
                    <option value="NFFD">Not Fit For Duty (NFFD)</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>
            {form.fmlaLeave === 'Yes' && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">FMLA Reason</label>
                <div className="relative">
                  <select value={form.fmlaReason} onChange={(e) => updateField('fmlaReason', e.target.value)}
                    className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2.5 pr-10 text-gray-900 focus:ring-2 focus:ring-amber-500">
                    {FMLA_REASONS.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
                <p className="text-sm text-amber-700 mt-2">Note: FMLA only allows Annual and Sick leave types.</p>
              </div>
            )}
          </div>
        </section>

        {/* Leave Balances & Priority */}
        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-slate-50 to-gray-50 px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-amber-600" />
              Leave Balances & Priority
            </h2>
          </div>
          <div className="p-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Available Leave</h3>
                {LEAVE_BALANCES.map((balance) => {
                  const isDisabled = form.fmlaLeave === 'Yes' && !['annualHours', 'sickHours'].includes(balance.id);
                  return (
                    <div key={balance.id} className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: balance.color }} />
                      <label className="text-sm text-gray-700 w-28">{balance.label}:</label>
                      <input type="number" min="0" value={form[balance.id] as number}
                        onChange={(e) => updateField(balance.id, Number(e.target.value) || 0)}
                        disabled={isDisabled}
                        className="w-20 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-amber-500 disabled:bg-gray-100" />
                      <span className="text-sm text-gray-500">{balance.unit}</span>
                    </div>
                  );
                })}
              </div>
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-1">
                  Leave Priority Order <HelpCircle className="w-4 h-4 text-gray-400" />
                </h3>
                {['First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth'].map((label, i) => {
                  const fieldName = ['leaveFirst', 'leaveSecond', 'leaveThird', 'leaveFourth', 'leaveFifth', 'leaveSixth'][i] as keyof FormState;
                  const isEnabled = i < enabledPriorityCount;
                  return (
                    <div key={label} className="flex items-center gap-3">
                      <span className={`text-sm w-24 ${isEnabled ? 'text-gray-700' : 'text-gray-400'}`}>{label} Priority:</span>
                      <div className="relative flex-1">
                        <select value={form[fieldName] as string} onChange={(e) => updateField(fieldName, e.target.value as LeaveType)}
                          disabled={!isEnabled}
                          className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-3 py-1.5 pr-8 text-sm focus:ring-2 focus:ring-amber-500 disabled:bg-gray-100">
                          <option value="">Choose Leave Type</option>
                          {activeLeaveTypes.map((type) => <option key={type} value={type}>{type}</option>)}
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Date Range & Remarks */}
        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-slate-50 to-gray-50 px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Leave Dates & Remarks</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Start Date</label>
                <input type="date" value={form.dateStart} onChange={(e) => updateField('dateStart', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-amber-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">End Date</label>
                <input type="date" value={form.dateEnd} onChange={(e) => updateField('dateEnd', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-amber-500" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Remarks</label>
              <textarea value={form.remarks} onChange={(e) => updateField('remarks', e.target.value)} rows={3}
                placeholder="Enter any additional remarks here..."
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-amber-500 resize-none" />
            </div>
          </div>
        </section>

        {/* Generate Button */}
        <div className="text-center">
          <button onClick={handleGenerate} disabled={generating || !form.dateStart || !form.dateEnd}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed">
            {generating ? (
              <><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>Generating...</>
            ) : (
              <><Download className="w-5 h-5" />Generate Leave Chit</>
            )}
          </button>
        </div>
        <p className="text-center text-sm text-gray-500 mt-4">
          Tip: Request a screenshot from your detailer for proof of Leave Chit acceptance.
        </p>
      </div>
    </div>
  );
}