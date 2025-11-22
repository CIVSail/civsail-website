// types/sea-service.ts
/**
 * Comprehensive types for Sea Service Ledger
 * Matches expanded database schema for Career Navigator
 * 
 * IMPORTANT: All enum-like values use lowercase to match database CHECK constraints
 */

export interface SeaServicePeriod {
  // Primary fields
  id: string;
  user_id: string;

  // Required core fields
  vessel_name: string;
  sign_on_date: string; // ISO date string
  sign_off_date: string; // ISO date string
  days_served: number; // Auto-computed from dates
  position_held: string;
  department: 'deck' | 'engine' | 'steward' | null; // MUST be lowercase - DB constraint
  grt: number; // Gross Registered Tons
  route: 'oceans' | 'near_coastal' | 'great_lakes' | 'inland' | null; // MUST be lowercase with underscores
  propulsion_type: 'motor' | 'steam' | 'gas_turbine' | 'sail' | null; // MUST be lowercase with underscores (note: DB column is propulsion_type)

  // Watchkeeping fields (STCW/OICNW requirements)
  watchkeeping_days: number;
  supervised: boolean;
  officer_on_watch: boolean;

  // Optional enrichment fields
  imo_number: string | null;
  vessel_type: string | null; // 'Tanker', 'Tug/ATB', 'RO/RO', etc.
  flag_state: string | null;
  company: string | null;
  dp_days: number;
  cadet_service: boolean;
  port_sign_on: string | null;
  port_sign_off: string | null;
  notes: string | null;

  // Provenance/evidence fields
  source_doc_id: string | null;
  source_doc_path: string | null;
  ocr_confidence: number; // 0-1
  ocr_confidence_details: OCRConfidenceDetails | null;
  page_reference: string | null;

  // Status fields
  needs_manual_review: boolean;
  verified: boolean;

  // Legacy/compatibility fields
  gross_tonnage: number | null; // Duplicate of grt for backwards compatibility
  tonnage_category: string | null; // 'unlimited', 'limited', etc.
  creditable_for_routes: string[] | null;

  // Timestamps
  created_at: string;
  updated_at?: string;
}

export interface OCRConfidenceDetails {
  vessel_name?: number;
  sign_on_date?: number;
  sign_off_date?: number;
  position?: number;
  grt?: number;
  route?: number;
  propulsion?: number;
  department?: number;
  overall?: number;
}

export interface SeaServiceFormData {
  // Required fields
  vessel_name: string;
  sign_on_date: string;
  sign_off_date: string;
  position_held: string;
  department: 'deck' | 'engine' | 'steward' | null; // MUST be lowercase - DB constraint
  grt: number | string; // Allow string for form input
  route: 'oceans' | 'near_coastal' | 'great_lakes' | 'inland' | null; // MUST be lowercase with underscores
  propulsion: 'motor' | 'steam' | 'gas_turbine' | 'sail' | null; // Note: maps to propulsion_type in DB

  // Watchkeeping
  watchkeeping_days: number | string;
  supervised: boolean;
  officer_on_watch: boolean;

  // Optional fields
  imo_number: string;
  vessel_type: string;
  flag_state: string;
  company: string;
  dp_days: number | string;
  cadet_service: boolean;
  port_sign_on: string;
  port_sign_off: string;
  notes: string;

  // For editing existing records
  id?: string;
}

export interface ValidationError {
  field: string;
  message: string;
  type: 'error' | 'warning' | 'info';
  code: string;
}

export interface SeaServiceSummary {
  total_days: number;
  deck_days: number;
  engine_days: number;
  steward_days: number;
  ocean_days: number;
  near_coastal_days: number;
  watchkeeping_days: number;
  supervised_watchkeeping_days: number;
  days_over_1600grt: number;
  most_recent_sign_off: string | null;
  needs_review_count: number;
}

export interface OverlapCheck {
  has_overlap: boolean;
  overlapping_vessel: string | null;
  overlapping_id: string | null;
}

// Autocomplete suggestions
export const COMMON_VESSEL_TYPES = [
  'Tanker',
  'Tug/ATB',
  'Container Ship',
  'RO/RO',
  'Dry Cargo',
  'Bulk Carrier',
  'Research Vessel',
  'Cable Ship',
  'Offshore Supply',
  'Crane Ship',
  'Other',
];

export const COMMON_POSITIONS = [
  // Deck
  'Able Seaman (AB)',
  'Ordinary Seaman (OS)',
  'Bosun',
  'Quartermaster',
  'Third Mate',
  'Second Mate',
  'Chief Mate',
  'Master',
  'Deck Cadet',
  // Engine
  'Wiper',
  'Oiler',
  'QMED',
  'Junior Engineer',
  'Third Assistant Engineer',
  'Second Assistant Engineer',
  'First Assistant Engineer',
  'Chief Engineer',
  'Engine Cadet',
  'Electrician',
  // Steward
  'Steward Utility (SU)',
  'Chief Steward',
  'Chief Cook',
  // MSC specific
  'Junior Supply Officer',
  'Supply Officer',
];

export const FLAG_STATES = [
  'United States',
  'Marshall Islands',
  'Liberia',
  'Panama',
  'Bahamas',
  'Singapore',
  'Malta',
  'United Kingdom',
  'Other',
];