export interface Profile {
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  full_name: string | null; // Keep for backwards compatibility
  email: string | null;
  ship_email: string | null;
  phone: string | null;
  ref_number: string | null;
  has_mmc: boolean;
  
  // Expiration dates (all optional)
  mmc_exp: string | null;
  medical_exp: string | null;
  passport_exp: string | null;
  twic_exp: string | null;
  license_exp: string | null;
  
  // Verification tracking
  nmc_verification_status: 'not_started' | 'pending' | 'verified' | 'verified_needs_review' | 'timeout' | 'not_applicable';
  nmc_verified_at: string | null;
  nmc_discrepancy_reviewed: boolean;
  nmc_discrepancy_reviewed_at: string | null;
  
  // Date tracking (user vs CG)
  mmc_exp_user_entered: string | null;
  mmc_exp_nmc_verified: string | null;
  mmc_exp_user_override: boolean;
  medical_exp_user_entered: string | null;
  medical_exp_nmc_verified: string | null;
  medical_exp_user_override: boolean;
  
  // Alert preferences
  alert_email: boolean;
  alert_sms: boolean;
  
  created_at: string;
}

export interface Credential {
  id: string;
  user_id: string;
  credential_type: 'national' | 'stcw' | 'license';
  endorsement_name: string;
  department: 'deck' | 'engine' | 'steward' | null;
  verified_by_nmc: boolean;
  verified_at: string;
  created_at: string;
}

export interface NMCVerification {
  id: string;
  user_id: string;
  ref_number: string;
  last_name: string;
  verification_type: 'onboarding' | 're-verification' | 'upgrade';
  status: 'pending' | 'completed' | 'timeout';
  requested_at: string;
  completed_at: string | null;
  raw_email_text: string | null;
  parsed_data: {
    refNumber: string;
    mmcExpiration: string;
    medicalExpiration: string;
    credentials: Array<{
      type: 'national' | 'stcw' | 'license';
      name: string;
      department: string | null;
    }>;
  } | null;
  check_count: number;
  last_checked_at: string | null;
  has_discrepancy: boolean;
}
// Expiration tracking types
export type ExpirationStatus = 'expired' | 'urgent' | 'warning' | 'valid';

export interface ExpirationInfo {
  status: ExpirationStatus;
  daysRemaining: number;
  message: string;
}