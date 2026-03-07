-- CIVSail Onboarding Revamp Migration
-- Adds sector, department, career track, and onboarding completion tracking to profiles
-- Does NOT break existing users — all new columns are nullable and have safe defaults

ALTER TABLE profiles
  -- Which maritime sector the user operates in (MSC CIVMAR, commercial, offshore, etc.)
  ADD COLUMN IF NOT EXISTS sector TEXT,

  -- Department within the sector (e.g., Deck, Engine, Steward).
  -- Required for CIVMARs; optional/null for other sectors.
  ADD COLUMN IF NOT EXISTS department TEXT,

  -- Free-text contracting company name. Only populated for CONMAR users.
  ADD COLUMN IF NOT EXISTS contracting_company TEXT,

  -- The user's declared career track (licensed deck, unlicensed engine, cadet, etc.)
  -- This is the "intent" layer — NMC data alone can't determine track for entry-level mariners.
  ADD COLUMN IF NOT EXISTS career_track TEXT,

  -- Timestamp when the user completed onboarding. NULL means onboarding not yet done.
  -- This replaces the old "skip" logic: dashboard access is gated on this being non-null.
  ADD COLUMN IF NOT EXISTS onboarding_completed_at TIMESTAMPTZ;

-- Verify RLS policies cover the new columns (they inherit from table-level policies).
-- Users can only read/update their own profile row.
-- These policies should already exist but are documented here for clarity:

-- CREATE POLICY "Users can view own profile"
--   ON profiles FOR SELECT USING (auth.uid() = user_id);

-- CREATE POLICY "Users can update own profile"
--   ON profiles FOR UPDATE USING (auth.uid() = user_id);

-- CREATE POLICY "Users can insert own profile"
--   ON profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
