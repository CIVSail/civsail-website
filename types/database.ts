/**
 * Database type definitions for CIVSail
 * Generated from Supabase schema
 */

export interface Profile {
  user_id: string;
  full_name: string | null;
  email: string | null;
  ship_email: string | null;
  phone: string | null;
  ref_number: string | null;
  mmc_exp: string | null; // ISO date string
  medical_exp: string | null;
  passport_exp: string | null;
  twic_exp: string | null;
  license_exp: string | null;
  alert_email: boolean;
  alert_sms: boolean;
  created_at: string;
}

export interface Document {
  id: string;
  user_id: string;
  file_name: string;
  file_type: 'mmc' | 'sea_service' | 'training' | 'evaluations';
  storage_path: string;
  uploaded_at: string;
}

export interface LeaveChit {
  id: string;
  user_id: string;
  file_path: string;
  created_at: string;
}

// Helper type for credential expiration fields
export type CredentialField = 
  | 'mmc_exp' 
  | 'medical_exp' 
  | 'passport_exp' 
  | 'twic_exp' 
  | 'license_exp';

// Expiration status for UI color coding
export type ExpirationStatus = 'expired' | 'urgent' | 'warning' | 'valid';

export interface ExpirationInfo {
  status: ExpirationStatus;
  daysRemaining: number;
  message: string;
}

// Credential labels for display
export const CREDENTIAL_LABELS: Record<CredentialField, string> = {
  mmc_exp: 'MMC',
  medical_exp: 'Medical Certificate',
  passport_exp: 'Passport',
  twic_exp: 'TWIC',
  license_exp: "Driver's License",
};