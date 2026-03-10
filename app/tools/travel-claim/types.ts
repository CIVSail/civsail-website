/**
 * Types for the Travel Claim Generator
 * Used for DD 1351-2 Travel Voucher and Comp Time for Travel forms
 */

// ============================================
// LOCATION TYPES
// ============================================

export type LocationType = 
  | 'HOR'           // Home of Record
  | 'Ship'          // A Ship
  | 'Training'      // Training facility
  | 'Hotel'         // Hotel/Lodging
  | 'Conference'    // Conference/Meeting
  | 'Airport'       // Airport (for layovers/connections)
  | 'ContractHotel' // Contract Hotel (San Diego or Norfolk)
  | 'Other';        // Other location

export interface Location {
  type: LocationType;
  /** Detailed description - e.g., "123 Main St" for HOR, "USNS Millinocket @ Guam" for Ship */
  details: string;
  /** City for address purposes */
  city?: string;
  /** State for address purposes */
  state?: string;
}

// ============================================
// TRANSPORTATION TYPES
// ============================================

/** Mode codes for DD 1351-2 form */
export type TransportMode = 'TP' | 'CP' | 'CA' | 'CB' | 'CR' | 'CV' | 'PA' | 'PM' | 'GT';

/** Transport type - internal value for the form */
export type TransportType = 
  | 'taxi-uber'
  | 'govt-ticket-flight'
  | 'govt-vehicle'
  | 'rental-car'
  | 'pov-auto'
  | 'pov-motorcycle'
  | 'commercial-flight-reimburse'
  | 'govt-aircraft'
  | 'govt-bus'
  | 'msc-navy-ship'
  | 'commercial-bus-reimburse'
  | 'commercial-train-reimburse'
  | 'ferry';

export interface TransportDetails {
  type: TransportType;
  /** Cost of transportation (if reimbursable) */
  cost?: number;
  /** Was this paid with GTCC? */
  paidWithGTCC?: boolean;
  /** Miles driven (for POV) */
  miles?: number;
  /** Baggage cost */
  baggageCost?: number;
  /** Was baggage paid with GTCC? */
  baggagePaidWithGTCC?: boolean;
  /** Has checked bags (affects waiting time for comp time) */
  hasCheckedBags?: boolean;
}

// ============================================
// STOP REASON TYPES
// ============================================

/** Stop reason - internal value for the form */
export type StopReason = 
  | 'CATCH_FLIGHT'
  | 'LAYOVER'
  | 'WAITING_TRANSPORT'
  | 'FINAL_DESTINATION'
  | 'FLIGHT_DELAY'
  | 'FLIGHT_CANCELLED'
  | 'HOTEL_OVERNIGHT'
  | 'TDY_STATION'
  | 'RETURNING_HOME'
  | 'LEAVE_ENROUTE';

// ============================================
// ITINERARY TYPES
// ============================================

export interface ItineraryLeg {
  id: string;
  /** Where this leg starts */
  from: Location;
  /** Where this leg ends */
  to: Location;
  /** Departure date (YYYY-MM-DD) */
  departureDate: string;
  /** Departure time (HH:MM) */
  departureTime: string;
  /** Arrival date (YYYY-MM-DD) */
  arrivalDate: string;
  /** Arrival time (HH:MM) */
  arrivalTime: string;
  /** Timezone offset of departure location (e.g., -5 for EST, -8 for PST) */
  departureTimezone: number;
  /** Timezone offset of arrival location */
  arrivalTimezone: number;
  /** How did you travel this leg? */
  transport: TransportDetails;
  /** Reason for this stop */
  reason: StopReason;
  /** Was there a delay over 13 hours? */
  hadExtendedDelay?: boolean;
  /** Hotel cost during delay */
  delayHotelCost?: number;
  /** Was delay hotel paid with GTCC? */
  delayHotelPaidWithGTCC?: boolean;
  /** Is this a flight? (for waiting time calculation) */
  isFlight?: boolean;
  /** Is this international travel? */
  isInternational?: boolean;
}

/** Helper to get full departure datetime string */
export function getDepartureDateTime(leg: ItineraryLeg): string {
  if (!leg.departureDate || !leg.departureTime) return '';
  return `${leg.departureDate}T${leg.departureTime}`;
}

/** Helper to get full arrival datetime string */
export function getArrivalDateTime(leg: ItineraryLeg): string {
  if (!leg.arrivalDate || !leg.arrivalTime) return '';
  return `${leg.arrivalDate}T${leg.arrivalTime}`;
}

// ============================================
// COMP TIME CALCULATION TYPES
// ============================================

export interface CompTimeCalculation {
  legId: string;
  /** Total actual travel time in hours */
  actualTravelTime: number;
  /** Hours during normal duty hours (0800-1630) - NOT creditable */
  dutyHours: number;
  /** Hours outside normal duty hours - potentially creditable */
  nonDutyHours: number;
  /** Non-creditable time (meals, extended waiting, etc.) */
  nonCreditableTime: number;
  /** Final comp time requested in hours */
  compTimeRequested: number;
  /** Breakdown of deductions */
  deductions: {
    /** 30-min meal periods during travel */
    mealPeriods: number;
    /** Excessive waiting time beyond "usual" */
    excessiveWaiting: number;
    /** Normal commute time (if applicable) */
    commuteTime: number;
    /** Masters/Chief Engineer 1-hour deduction */
    masterChiefDeduction: number;
  };
}

// ============================================
// TRAVELER INFO TYPES
// ============================================

export interface TravelerInfo {
  firstName: string;
  middleInitial: string;
  lastName: string;
  /** GS pay grade (1-15) */
  grade: number;
  /** Position title from jobs table */
  position: string;
  /** Last 4 of SSN */
  ssnLast4: string;
  /** DoD ID Number (10 digits) */
  dodId: string;
  /** Email address */
  email: string;
  /** Phone number */
  phone: string;
  /** Street address */
  street: string;
  city: string;
  state: string;
  zip: string;
  /** Is this person a Master or Chief Engineer? (affects comp time) */
  isMasterOrChiefEngineer: boolean;
  /** Normal work schedule (e.g., "0800-1630") */
  workSchedule: string;
  /** Normal commute time in minutes (for near CSU-E/W) */
  normalCommuteMinutes?: number;
}

// ============================================
// TRAVEL CLAIM FORM TYPES
// ============================================

export interface TravelClaimForm {
  /** Traveler personal info */
  traveler: TravelerInfo;
  /** Travel order/authorization number */
  authorizationNumber: string;
  /** Were travel orders issued? */
  travelOrdersIssued: boolean;
  /** Purpose of travel */
  purpose: string;
  /** Custom purpose if "Other" */
  customPurpose?: string;
  /** CONUS or OCONUS travel */
  travelType: 'CONUS' | 'OCONUS';
  /** Did traveler receive a travel advance? */
  receivedAdvance: boolean;
  /** Amount of travel advance */
  advanceAmount?: number;
  /** Travel itinerary - all legs */
  itinerary: ItineraryLeg[];
  /** Additional reimbursable expenses */
  additionalExpenses: AdditionalExpense[];
  /** Comp time calculations (computed) */
  compTimeCalculations?: CompTimeCalculation[];
  /** Total GTCC amount for split disbursement */
  gtccTotal?: number;
}

export interface AdditionalExpense {
  id: string;
  date: string; // ISO date
  description: string;
  amount: number;
  paidWithGTCC: boolean;
}

// ============================================
// UI STATE TYPES
// ============================================

export type WizardStep = 
  | 'overview'     // Basic trip info
  | 'itinerary'    // Build travel legs
  | 'expenses'     // Additional expenses
  | 'comptime'     // Review comp time
  | 'review';      // Final review & generate

export interface WizardState {
  currentStep: WizardStep;
  completedSteps: WizardStep[];
  formData: TravelClaimForm;
  isGenerating: boolean;
  error?: string;
}

// ============================================
// CONSTANTS - LOCATION OPTIONS
// ============================================

export const LOCATION_OPTIONS: { value: LocationType; label: string; placeholder: string }[] = [
  { value: 'HOR', label: 'Home of Record', placeholder: 'Enter your home address' },
  { value: 'ContractHotel', label: 'Contract Hotel', placeholder: 'San Diego or Norfolk Contract Hotel' },
  { value: 'Airport', label: 'Airport', placeholder: 'Airport code - Name (e.g., IAD - Dulles)' },
  { value: 'Ship', label: 'Ship', placeholder: 'Ship name @ Port (e.g., USNS Mercy @ San Diego)' },
  { value: 'Training', label: 'Training Facility', placeholder: 'Training location and name' },
  { value: 'Hotel', label: 'Hotel', placeholder: 'Hotel name and city' },
  { value: 'Conference', label: 'Conference/Meeting', placeholder: 'Conference location and name' },
  { value: 'Other', label: 'Other Location', placeholder: 'Enter location details' },
];

// ============================================
// CONSTANTS - TRANSPORT OPTIONS
// ============================================

/** 
 * Transport options with user-friendly labels
 * Maps to DD 1351-2 mode codes:
 * TP = Ticketed Plane (govt), CP = Commercial Plane, CA = Commercial Auto
 * CB = Commercial Bus, CR = Commercial Rail, CV = Commercial Vessel
 * PA = POV Auto, PM = POV Motorcycle, GT = Government Transport
 */
export const TRANSPORT_OPTIONS: { value: TransportType; label: string; mode: TransportMode; hasCost: boolean; hasMiles: boolean }[] = [
  { 
    value: 'taxi-uber', 
    label: 'Taxi/Uber', 
    mode: 'CA', 
    hasCost: true, 
    hasMiles: false 
  },
  { 
    value: 'govt-ticket-flight', 
    label: 'Commercial flight with a ticket purchased by the government (ie. The Purser or your detailer gave you a plane ticket)', 
    mode: 'TP', 
    hasCost: false, 
    hasMiles: false 
  },
  { 
    value: 'govt-vehicle', 
    label: 'Duty driver, ship vehicle or government vehicle', 
    mode: 'GT', 
    hasCost: false, 
    hasMiles: false 
  },
  { 
    value: 'rental-car', 
    label: 'A Rental Vehicle was allowed on your orders, and you need reimbursement', 
    mode: 'CA', 
    hasCost: true, 
    hasMiles: false 
  },
  { 
    value: 'pov-auto', 
    label: 'Personal Automobile- You used a personally owned vehicle', 
    mode: 'PA', 
    hasCost: false, 
    hasMiles: true 
  },
  { 
    value: 'pov-motorcycle', 
    label: 'Personal Motorcycle- You used a personally owned motorcycle', 
    mode: 'PM', 
    hasCost: false, 
    hasMiles: true 
  },
  { 
    value: 'commercial-flight-reimburse', 
    label: 'Commercial flight with ticket purchased with your own money and need reimbursement', 
    mode: 'CP', 
    hasCost: true, 
    hasMiles: false 
  },
  { 
    value: 'govt-aircraft', 
    label: 'Government owned flight (MAC flight or military aircraft)', 
    mode: 'GT', 
    hasCost: false, 
    hasMiles: false 
  },
  { 
    value: 'govt-bus', 
    label: 'NEO bus/government owned bus', 
    mode: 'GT', 
    hasCost: false, 
    hasMiles: false 
  },
  { 
    value: 'msc-navy-ship', 
    label: 'An MSC or Navy ship moved you to your next destination (EX EPFs moved people during COVID)', 
    mode: 'GT', 
    hasCost: false, 
    hasMiles: false 
  },
  { 
    value: 'commercial-bus-reimburse', 
    label: 'Commercial Bus with ticket purchased with your own money and need reimbursement', 
    mode: 'CB', 
    hasCost: true, 
    hasMiles: false 
  },
  { 
    value: 'commercial-train-reimburse', 
    label: 'Commercial Train with ticket purchased with your own money and need reimbursement', 
    mode: 'CR', 
    hasCost: true, 
    hasMiles: false 
  },
  { 
    value: 'ferry', 
    label: 'Ferry/Commercial Vessel', 
    mode: 'CV', 
    hasCost: true, 
    hasMiles: false 
  },
];

// ============================================
// CONSTANTS - STOP REASON OPTIONS
// ============================================

/**
 * Stop reason options with user-friendly labels
 * Maps to DD 1351-2 codes:
 * TD = Temporary Duty, MC = Mission Complete, AD = Authorized Delay
 * AT = Awaiting Transportation, AR = Authorized Return, LV = Leave
 */
export const STOP_REASON_OPTIONS: { value: StopReason; code: string; label: string }[] = [
  { value: 'CATCH_FLIGHT', code: 'AT', label: 'To catch a flight' },
  { value: 'LAYOVER', code: 'AD', label: 'Flight Layover' },
  { value: 'WAITING_TRANSPORT', code: 'AT', label: 'Waiting Further Transportation to Next Destination' },
  { value: 'FINAL_DESTINATION', code: 'MC', label: 'I have reached my final destination' },
  { value: 'FLIGHT_DELAY', code: 'AD', label: 'Flight Delay' },
  { value: 'FLIGHT_CANCELLED', code: 'AD', label: 'Flight Cancelled' },
  { value: 'HOTEL_OVERNIGHT', code: 'AD', label: 'I stayed in a hotel to continue my travel' },
  { value: 'TDY_STATION', code: 'TD', label: 'Arrived at Temporary Duty Station' },
  { value: 'RETURNING_HOME', code: 'AR', label: 'Returning Home (Authorized)' },
  { value: 'LEAVE_ENROUTE', code: 'LV', label: 'Taking Leave During Travel' },
];

// ============================================
// CONSTANTS - PURPOSE OPTIONS
// ============================================

export const PURPOSE_OPTIONS = [
  'Reporting to a ship assignment',
  'Returning from a ship assignment',
  'Going to Training',
  'Returning from Training',
  'Ship-to-Ship Transfer',
  'Conference/Meeting',
  'Other',
];

// ============================================
// CONSTANTS - TIMEZONE OPTIONS
// ============================================

/** Comprehensive timezone list for worldwide travel */
export const TIMEZONE_OPTIONS: { value: number; label: string; abbr: string }[] = [
  // US Timezones
  { value: -10, label: 'Hawaii (HST)', abbr: 'HST' },
  { value: -9, label: 'Alaska (AKST)', abbr: 'AKST' },
  { value: -8, label: 'Pacific (PST)', abbr: 'PST' },
  { value: -7, label: 'Mountain (MST)', abbr: 'MST' },
  { value: -6, label: 'Central (CST)', abbr: 'CST' },
  { value: -5, label: 'Eastern (EST)', abbr: 'EST' },
  { value: -4, label: 'Atlantic (AST)', abbr: 'AST' },
  
  // Europe
  { value: 0, label: 'GMT / UTC', abbr: 'GMT' },
  { value: 1, label: 'Central European (CET)', abbr: 'CET' },
  { value: 2, label: 'Eastern European (EET)', abbr: 'EET' },
  { value: 3, label: 'Moscow (MSK)', abbr: 'MSK' },
  
  // Middle East
  { value: 3.5, label: 'Iran (IRST)', abbr: 'IRST' },
  { value: 4, label: 'Gulf (GST)', abbr: 'GST' },
  { value: 4.5, label: 'Afghanistan (AFT)', abbr: 'AFT' },
  
  // Asia
  { value: 5, label: 'Pakistan (PKT)', abbr: 'PKT' },
  { value: 5.5, label: 'India (IST)', abbr: 'IST' },
  { value: 7, label: 'Indochina (ICT)', abbr: 'ICT' },
  { value: 8, label: 'China/Singapore (CST/SGT)', abbr: 'SGT' },
  { value: 9, label: 'Japan/Korea (JST/KST)', abbr: 'JST' },
  
  // Pacific
  { value: 10, label: 'Guam/Chamorro (ChST)', abbr: 'ChST' },
  { value: 11, label: 'Solomon Islands (SBT)', abbr: 'SBT' },
  { value: 12, label: 'New Zealand (NZST)', abbr: 'NZST' },
  
  // Other US Territories
  { value: -11, label: 'Samoa (SST)', abbr: 'SST' },
];

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Get the DD 1351-2 code for a stop reason
 */
export function getStopReasonCode(reason: StopReason): string {
  return STOP_REASON_OPTIONS.find(o => o.value === reason)?.code ?? 'TD';
}

/**
 * Convert transport type to DD 1351-2 mode code
 */
export function getTransportModeCode(type: TransportType): TransportMode {
  return TRANSPORT_OPTIONS.find(o => o.value === type)?.mode ?? 'CA';
}

/**
 * Get the "usual waiting time" allowed for a transport type
 * Based on MSC HR Advisory 2014-1
 */
export function getUsualWaitingMinutes(
  transportType: TransportType, 
  hasCheckedBags: boolean, 
  isInternational: boolean
): number {
  // Flight types
  const isGovtFlight = transportType === 'govt-ticket-flight' || transportType === 'govt-aircraft';
  const isCommercialFlight = transportType === 'commercial-flight-reimburse';
  const isFlight = isGovtFlight || isCommercialFlight;
  
  // Train/bus
  const isTrain = transportType === 'commercial-train-reimburse';
  const isBus = transportType === 'commercial-bus-reimburse' || transportType === 'govt-bus';
  
  if (isTrain || isBus) {
    return 60; // 60 minutes for train/bus
  }
  
  if (isFlight) {
    if (isInternational) {
      return 180; // 3 hours for international
    }
    if (hasCheckedBags) {
      return 120; // 2 hours with checked bags
    }
    return 90; // 90 minutes domestic without bags
  }
  
  return 0; // No waiting time for other transport types
}

/**
 * Check if transport type is a flight (for baggage questions)
 */
export function isFlightTransport(type: TransportType): boolean {
  return type === 'govt-ticket-flight' || 
         type === 'commercial-flight-reimburse' || 
         type === 'govt-aircraft';
}

/**
 * Get location placeholder text
 */
export function getLocationPlaceholder(type: LocationType): string {
  const option = LOCATION_OPTIONS.find(o => o.value === type);
  return option?.placeholder ?? 'Enter location details';
}

/**
 * Get location label
 */
export function getLocationLabel(type: LocationType): string {
  const option = LOCATION_OPTIONS.find(o => o.value === type);
  return option?.label ?? type;
}