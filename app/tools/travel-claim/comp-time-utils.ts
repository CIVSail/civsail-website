/**
 * Comp Time for Travel Calculation Utilities
 * Based on MSC HR Advisory 2014-1
 *
 * KEY RULES:
 * - Normal duty hours: 0800-1630 (8 hours + 30 min lunch)
 * - Creditable: Travel time OUTSIDE normal duty hours
 * - Round to 6-minute increments (0.1 hour)
 * - Masters/Chief Engineers: Deduct 1 hour per travel day
 * - Meal periods: Deduct 30 min per 6 hours of travel
 * - Use departure point's timezone for calculations
 */

import {
  ItineraryLeg,
  CompTimeCalculation,
  TravelerInfo,
  getUsualWaitingMinutes,
  getDepartureDateTime,
  getArrivalDateTime,
} from './types';

// ============================================
// CONSTANTS
// ============================================

/** Normal duty day start time (8:00 AM) */
const DUTY_START_HOUR = 8;
const DUTY_START_MINUTE = 0;

/** Normal duty day end time (4:30 PM / 16:30) */
const DUTY_END_HOUR = 16;
const DUTY_END_MINUTE = 30;

/** Minutes in an hour */
const MINUTES_PER_HOUR = 60;

/** 6-minute increment for rounding */
const ROUNDING_INCREMENT_MINUTES = 6;

// ============================================
// TIME CALCULATION HELPERS
// ============================================

/**
 * Convert hours and minutes to decimal hours
 */
function toDecimalHours(hours: number, minutes: number): number {
  return hours + minutes / MINUTES_PER_HOUR;
}

/**
 * Convert decimal hours to minutes
 */
function toMinutes(decimalHours: number): number {
  return Math.round(decimalHours * MINUTES_PER_HOUR);
}

/**
 * Round to 6-minute increments (floor)
 * Per MSC HR Advisory 2014-1, fractions are rounded DOWN
 */
export function roundToSixMinuteIncrements(hours: number): number {
  const minutes = toMinutes(hours);
  const roundedMinutes =
    Math.floor(minutes / ROUNDING_INCREMENT_MINUTES) *
    ROUNDING_INCREMENT_MINUTES;
  return roundedMinutes / MINUTES_PER_HOUR;
}

/**
 * Get the duty start time in minutes from midnight
 */
function getDutyStartMinutes(): number {
  return DUTY_START_HOUR * MINUTES_PER_HOUR + DUTY_START_MINUTE;
}

/**
 * Get the duty end time in minutes from midnight
 */
function getDutyEndMinutes(): number {
  return DUTY_END_HOUR * MINUTES_PER_HOUR + DUTY_END_MINUTE;
}

/**
 * Check if a time (in minutes from midnight) is during duty hours
 */
function isDuringDutyHours(minutesFromMidnight: number): boolean {
  return (
    minutesFromMidnight >= getDutyStartMinutes() &&
    minutesFromMidnight < getDutyEndMinutes()
  );
}

// ============================================
// MAIN CALCULATION FUNCTIONS
// ============================================

/**
 * Calculate the total travel time for a leg in hours
 */
export function calculateTotalTravelTime(leg: ItineraryLeg): number {
  const depDateTime = getDepartureDateTime(leg);
  const arrDateTime = getArrivalDateTime(leg);

  if (!depDateTime || !arrDateTime) return 0;

  const departure = new Date(depDateTime);
  const arrival = new Date(arrDateTime);

  // Adjust for timezone difference
  const tzDiffHours = leg.arrivalTimezone - leg.departureTimezone;
  const arrivalAdjusted = new Date(
    arrival.getTime() - tzDiffHours * 60 * 60 * 1000
  );

  const diffMs = arrivalAdjusted.getTime() - departure.getTime();
  return diffMs / (1000 * 60 * 60); // Convert to hours
}

/**
 * Calculate hours during normal duty hours for a leg
 * This time is NOT creditable for comp time
 */
export function calculateDutyHours(leg: ItineraryLeg): number {
  const depDateTime = getDepartureDateTime(leg);
  const arrDateTime = getArrivalDateTime(leg);

  if (!depDateTime || !arrDateTime) return 0;

  const departure = new Date(depDateTime);
  const arrival = new Date(arrDateTime);

  // Adjust arrival for timezone difference (use departure timezone)
  const tzDiffHours = leg.arrivalTimezone - leg.departureTimezone;
  const arrivalAdjusted = new Date(
    arrival.getTime() - tzDiffHours * 60 * 60 * 1000
  );

  let totalDutyMinutes = 0;
  const current = new Date(departure);

  // Walk through each minute of travel
  while (current < arrivalAdjusted) {
    const minutesFromMidnight = current.getHours() * 60 + current.getMinutes();

    if (isDuringDutyHours(minutesFromMidnight)) {
      totalDutyMinutes++;
    }

    current.setMinutes(current.getMinutes() + 1);
  }

  return totalDutyMinutes / MINUTES_PER_HOUR;
}

/**
 * Calculate meal period deduction
 * Per MSC HR Advisory 2014-1: 30 minutes per 6 hours of travel
 */
export function calculateMealDeduction(totalTravelHours: number): number {
  const mealPeriods = Math.floor(totalTravelHours / 6);
  return (mealPeriods * 30) / MINUTES_PER_HOUR; // Convert to hours
}

/**
 * Calculate excessive waiting time deduction
 * Only "usual and customary" waiting time is creditable
 */
export function calculateExcessiveWaitingDeduction(
  leg: ItineraryLeg,
  actualWaitingMinutes: number
): number {
  const usualWaiting = getUsualWaitingMinutes(
    leg.transport.type,
    leg.transport.hasCheckedBags ?? false,
    leg.isInternational ?? false
  );

  if (actualWaitingMinutes > usualWaiting) {
    return (actualWaitingMinutes - usualWaiting) / MINUTES_PER_HOUR;
  }

  return 0;
}

/**
 * Calculate comp time for a single leg
 */
export function calculateLegCompTime(
  leg: ItineraryLeg,
  traveler: TravelerInfo
): CompTimeCalculation {
  const totalTravelTime = calculateTotalTravelTime(leg);
  const dutyHours = calculateDutyHours(leg);
  const nonDutyHours = Math.max(0, totalTravelTime - dutyHours);

  // Calculate deductions
  const mealDeduction = calculateMealDeduction(totalTravelTime);

  // For now, we're not tracking actual waiting time separately
  // This would require more detailed input from the user
  const excessiveWaitingDeduction = 0;

  // Commute deduction (only for legs starting/ending at HOR)
  const commuteDeduction =
    leg.from.type === 'HOR' || leg.to.type === 'HOR'
      ? (traveler.normalCommuteMinutes ?? 0) / MINUTES_PER_HOUR
      : 0;

  // Master/Chief Engineer deduction: 1 hour per travel day
  // Count travel days (any day with travel activity)
  const depDate = leg.departureDate;
  const arrDate = leg.arrivalDate;
  let travelDays = 1;
  if (depDate && arrDate && depDate !== arrDate) {
    const dep = new Date(depDate);
    const arr = new Date(arrDate);
    travelDays =
      Math.ceil((arr.getTime() - dep.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  }
  const masterChiefDeduction = traveler.isMasterOrChiefEngineer
    ? travelDays
    : 0;

  const totalDeductions =
    mealDeduction +
    excessiveWaitingDeduction +
    commuteDeduction +
    masterChiefDeduction;
  const nonCreditableTime = totalDeductions;

  // Comp time = non-duty hours minus deductions, rounded down to 0.1 hour
  const rawCompTime = Math.max(0, nonDutyHours - totalDeductions);
  const compTimeRequested = roundToSixMinuteIncrements(rawCompTime);

  return {
    legId: leg.id,
    actualTravelTime: totalTravelTime,
    dutyHours,
    nonDutyHours,
    nonCreditableTime,
    compTimeRequested,
    deductions: {
      mealPeriods: mealDeduction,
      excessiveWaiting: excessiveWaitingDeduction,
      commuteTime: commuteDeduction,
      masterChiefDeduction,
    },
  };
}

/**
 * Calculate comp time for all legs
 */
export function calculateAllCompTime(
  itinerary: ItineraryLeg[],
  traveler: TravelerInfo
): {
  calculations: CompTimeCalculation[];
  totals: {
    actualTravelTime: number;
    dutyHours: number;
    nonDutyHours: number;
    nonCreditableTime: number;
    compTimeRequested: number;
  };
} {
  const calculations = itinerary.map((leg) =>
    calculateLegCompTime(leg, traveler)
  );

  const totals = calculations.reduce(
    (acc, calc) => ({
      actualTravelTime: acc.actualTravelTime + calc.actualTravelTime,
      dutyHours: acc.dutyHours + calc.dutyHours,
      nonDutyHours: acc.nonDutyHours + calc.nonDutyHours,
      nonCreditableTime: acc.nonCreditableTime + calc.nonCreditableTime,
      compTimeRequested: acc.compTimeRequested + calc.compTimeRequested,
    }),
    {
      actualTravelTime: 0,
      dutyHours: 0,
      nonDutyHours: 0,
      nonCreditableTime: 0,
      compTimeRequested: 0,
    }
  );

  // Round totals
  totals.compTimeRequested = roundToSixMinuteIncrements(
    totals.compTimeRequested
  );

  return { calculations, totals };
}

// ============================================
// FORMATTING HELPERS
// ============================================

/**
 * Format hours as "Xh Ym" display
 */
export function formatHoursDisplay(hours: number): string {
  if (hours === 0) return '0h';

  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);

  if (m === 0) return `${h}h`;
  if (h === 0) return `${m}m`;
  return `${h}h ${m}m`;
}

/**
 * Format as decimal hours (e.g., "8.5")
 */
export function formatDecimalHours(hours: number): string {
  return hours.toFixed(1);
}

// ============================================
// VALIDATION HELPERS
// ============================================

/**
 * Check if travel is eligible for comp time
 * Some travel types are NOT eligible
 */
export function isTravelEligibleForCompTime(leg: ItineraryLeg): boolean {
  // Leave travel is not eligible
  if (leg.reason === 'LEAVE_ENROUTE') return false;

  return true;
}

/**
 * Validate that comp time request is timely
 * Must be submitted within 5 working days of travel completion
 */
export function validateCompTimeTimeliness(
  lastTravelDate: string,
  submissionDate: string
): { isValid: boolean; daysOverdue?: number } {
  const travel = new Date(lastTravelDate);
  const submission = new Date(submissionDate);

  // Calculate working days between dates (simplified - doesn't account for holidays)
  let workingDays = 0;
  const current = new Date(travel);

  while (current < submission) {
    current.setDate(current.getDate() + 1);
    const dayOfWeek = current.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      workingDays++;
    }
  }

  if (workingDays <= 5) {
    return { isValid: true };
  }

  return { isValid: false, daysOverdue: workingDays - 5 };
}
