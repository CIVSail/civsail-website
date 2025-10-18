-- Add MMC status and name fields to profiles
ALTER TABLE profiles 
  ADD COLUMN has_mmc BOOLEAN DEFAULT true,
  ADD COLUMN first_name TEXT,
  ADD COLUMN last_name TEXT,
  ADD COLUMN ref_number TEXT;

-- Make all expiration dates optional (already are, but being explicit)
-- No changes needed - DATE fields are nullable by default

-- Add verification tracking fields
ALTER TABLE profiles
  ADD COLUMN nmc_verification_status TEXT DEFAULT 'not_started',
  -- Values: 'not_started' | 'pending' | 'verified' | 'verified_needs_review' | 'timeout' | 'not_applicable'
  ADD COLUMN nmc_verified_at TIMESTAMPTZ,
  ADD COLUMN nmc_discrepancy_reviewed BOOLEAN DEFAULT false,
  ADD COLUMN nmc_discrepancy_reviewed_at TIMESTAMPTZ;

-- Store both user-entered and CG-verified dates
ALTER TABLE profiles
  ADD COLUMN mmc_exp_user_entered DATE,
  ADD COLUMN mmc_exp_nmc_verified DATE,
  ADD COLUMN mmc_exp_user_override BOOLEAN DEFAULT false,
  ADD COLUMN medical_exp_user_entered DATE,
  ADD COLUMN medical_exp_nmc_verified DATE,
  ADD COLUMN medical_exp_user_override BOOLEAN DEFAULT false;

-- Create credentials table for endorsement inventory
CREATE TABLE credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(user_id) ON DELETE CASCADE,
  credential_type TEXT NOT NULL, -- 'national' | 'stcw' | 'license'
  endorsement_name TEXT NOT NULL,
  department TEXT, -- 'deck' | 'engine' | 'steward' | null
  verified_by_nmc BOOLEAN DEFAULT true,
  verified_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, endorsement_name)
);

CREATE INDEX idx_credentials_user ON credentials(user_id);
CREATE INDEX idx_credentials_type ON credentials(credential_type);

-- Create NMC verifications tracking table
CREATE TABLE nmc_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(user_id) ON DELETE CASCADE,
  ref_number TEXT NOT NULL,
  last_name TEXT NOT NULL,
  verification_type TEXT NOT NULL, -- 'onboarding' | 're-verification' | 'upgrade'
  status TEXT DEFAULT 'pending', -- 'pending' | 'completed' | 'timeout'
  requested_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  raw_email_text TEXT, -- Store full email for debugging
  parsed_data JSONB, -- Store structured parse result
  check_count INTEGER DEFAULT 0,
  last_checked_at TIMESTAMPTZ,
  has_discrepancy BOOLEAN DEFAULT false
);

CREATE INDEX idx_nmc_pending ON nmc_verifications(status, requested_at) 
WHERE status = 'pending';

CREATE INDEX idx_nmc_user ON nmc_verifications(user_id);

-- Enable RLS on new tables
ALTER TABLE credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE nmc_verifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for credentials
CREATE POLICY "Users can view own credentials"
  ON credentials FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own credentials"
  ON credentials FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own credentials"
  ON credentials FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for nmc_verifications
CREATE POLICY "Users can view own verifications"
  ON nmc_verifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own verifications"
  ON nmc_verifications FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Service role can update verifications (for cron job)
CREATE POLICY "Service role can update verifications"
  ON nmc_verifications FOR UPDATE
  USING (true);