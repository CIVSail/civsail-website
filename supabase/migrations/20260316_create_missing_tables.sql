-- ============================================================================
-- CIVSail: Create missing tables
-- Picks up from 20260306_onboarding_revamp.sql
-- Essentially supabase migrations were ignored and not maintained for a while, so this
-- is the restarting point.
--
-- Tables created here:
--   profiles, credentials, nmc_verifications, credential_reminders,
--   sea_service, newsletter_subscribers, training_certificates,
--   career_goals, ships, retirement_reviews
-- ============================================================================


-- ── profiles ─────────────────────────────────────────────────────────────────
-- Core user record. One row per authenticated Supabase user.

CREATE TABLE IF NOT EXISTS profiles (
  user_id      UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,

  first_name   TEXT,
  last_name    TEXT,
  full_name    TEXT,
  email        TEXT,
  ship_email   TEXT,
  phone        TEXT,

  has_mmc    BOOLEAN DEFAULT false,
  ref_number TEXT,

  mmc_exp      DATE,
  medical_exp  DATE,
  passport_exp DATE,
  twic_exp     DATE,
  license_exp  DATE,

  mmc_exp_user_entered      DATE,
  mmc_exp_nmc_verified      DATE,
  mmc_exp_user_override     BOOLEAN DEFAULT false,
  medical_exp_user_entered  DATE,
  medical_exp_nmc_verified  DATE,
  medical_exp_user_override BOOLEAN DEFAULT false,

  nmc_verification_status TEXT NOT NULL DEFAULT 'not_started'
    CHECK (nmc_verification_status IN (
      'not_started', 'pending', 'verified', 'verified_needs_review', 'timeout', 'not_applicable'
    )),
  nmc_verified_at              TIMESTAMPTZ,
  nmc_discrepancy_reviewed     BOOLEAN DEFAULT false,
  nmc_discrepancy_reviewed_at  TIMESTAMPTZ,

  alert_email  BOOLEAN DEFAULT true,
  alert_sms    BOOLEAN DEFAULT false,

  industry_entry_route TEXT CHECK (industry_entry_route IN ('hawsepiper', 'academy', 'military')),
  academy_name         TEXT,
  academy_program      TEXT,
  military_branch      TEXT,
  sea_days_per_year    INTEGER DEFAULT 200,

  -- Onboarding revamp fields (also managed by 20260306_onboarding_revamp.sql
  -- for existing deployments — IF NOT EXISTS guards there are harmless)
  sector               TEXT,
  department           TEXT,
  contracting_company  TEXT,
  career_track         TEXT,
  onboarding_completed_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_profiles_nmc_status  ON profiles (nmc_verification_status);
CREATE INDEX IF NOT EXISTS idx_profiles_alert_email ON profiles (alert_email) WHERE alert_email = true;

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users can view own profile') THEN
    CREATE POLICY "Users can view own profile"   ON profiles FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users can insert own profile') THEN
    CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users can update own profile') THEN
    CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = user_id);
  END IF;
END $$;


-- ── nmc_verifications ────────────────────────────────────────────────────────
-- Tracks each NMC credential lookup request.
-- Created before credentials so credentials can safely reference it.

CREATE TABLE IF NOT EXISTS nmc_verifications (
  id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,

  ref_number TEXT NOT NULL,
  last_name  TEXT NOT NULL,

  verification_type TEXT NOT NULL DEFAULT 'onboarding'
    CHECK (verification_type IN ('onboarding', 're-verification', 'upgrade', 'email')),

  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'completed', 'timeout')),

  requested_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at    TIMESTAMPTZ,
  check_count     INTEGER NOT NULL DEFAULT 0,
  last_checked_at TIMESTAMPTZ,

  raw_email_text  TEXT,
  parsed_data     JSONB,
  has_discrepancy BOOLEAN DEFAULT false,

  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_nmc_verifications_user_id ON nmc_verifications (user_id);
CREATE INDEX IF NOT EXISTS idx_nmc_verifications_status  ON nmc_verifications (status);
CREATE INDEX IF NOT EXISTS idx_nmc_verifications_pending ON nmc_verifications (requested_at)
  WHERE status = 'pending';

ALTER TABLE nmc_verifications ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'nmc_verifications' AND policyname = 'Users can view own verifications') THEN
    CREATE POLICY "Users can view own verifications"   ON nmc_verifications FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'nmc_verifications' AND policyname = 'Users can insert own verifications') THEN
    CREATE POLICY "Users can insert own verifications" ON nmc_verifications FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;


-- ── credentials ──────────────────────────────────────────────────────────────
-- Individual NMC endorsements parsed from verification emails.

CREATE TABLE IF NOT EXISTS credentials (
  id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,

  credential_type TEXT NOT NULL CHECK (credential_type IN ('national', 'stcw', 'license')),
  endorsement_name   TEXT NOT NULL,
  endorsement_system TEXT,
  department         TEXT CHECK (department IN ('deck', 'engine', 'steward')),
  rank               TEXT,
  qualification_level TEXT,
  raw_nmc_text        TEXT,
  verified_by_nmc     BOOLEAN DEFAULT false,
  needs_review        BOOLEAN DEFAULT false,
  -- Plain UUID (no FK) so table order doesn't matter
  source_verification_id UUID,

  verified_at TIMESTAMPTZ DEFAULT now(),
  created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS credentials_user_endorsement_unique
  ON credentials (user_id, endorsement_name);

CREATE INDEX IF NOT EXISTS idx_credentials_user_id ON credentials (user_id);
CREATE INDEX IF NOT EXISTS idx_credentials_type    ON credentials (credential_type);

ALTER TABLE credentials ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'credentials' AND policyname = 'Users can view own credentials') THEN
    CREATE POLICY "Users can view own credentials"   ON credentials FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'credentials' AND policyname = 'Users can insert own credentials') THEN
    CREATE POLICY "Users can insert own credentials" ON credentials FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'credentials' AND policyname = 'Users can update own credentials') THEN
    CREATE POLICY "Users can update own credentials" ON credentials FOR UPDATE USING (auth.uid() = user_id);
  END IF;
END $$;


-- ── credential_reminders ─────────────────────────────────────────────────────
-- Idempotency log for the check-expirations cron job.

CREATE TABLE IF NOT EXISTS credential_reminders (
  id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,

  document_type TEXT NOT NULL
    CHECK (document_type IN ('mmc', 'medical', 'passport', 'twic', 'license')),
  document_name TEXT NOT NULL,
  milestone     TEXT NOT NULL,
  days_before_expiration INTEGER NOT NULL,
  expiration_date DATE NOT NULL,

  emails_sent_to    TEXT[] NOT NULL DEFAULT '{}',
  delivery_status   TEXT NOT NULL DEFAULT 'sent'
    CHECK (delivery_status IN ('sent', 'delivered', 'bounced', 'failed')),
  resend_message_id TEXT,

  sent_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS credential_reminders_dedup
  ON credential_reminders (user_id, document_type, milestone, expiration_date);

CREATE INDEX IF NOT EXISTS idx_credential_reminders_user_id ON credential_reminders (user_id);

ALTER TABLE credential_reminders ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'credential_reminders' AND policyname = 'Users can view own reminders') THEN
    CREATE POLICY "Users can view own reminders" ON credential_reminders FOR SELECT USING (auth.uid() = user_id);
  END IF;
END $$;


-- ── sea_service ───────────────────────────────────────────────────────────────
-- Sea service ledger. One row per vessel sign-on/sign-off period.

CREATE TABLE IF NOT EXISTS sea_service (
  id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,

  vessel_name   TEXT NOT NULL,
  sign_on_date  DATE NOT NULL,
  sign_off_date DATE NOT NULL,
  days_served   INTEGER NOT NULL DEFAULT 0,
  position_held TEXT NOT NULL,

  department      TEXT CHECK (department IN ('deck', 'engine', 'steward')),
  grt             INTEGER,
  route           TEXT CHECK (route IN ('oceans', 'near_coastal', 'great_lakes', 'inland')),
  propulsion_type TEXT CHECK (propulsion_type IN ('motor', 'steam', 'gas_turbine', 'sail')),

  watchkeeping_days INTEGER NOT NULL DEFAULT 0,
  supervised        BOOLEAN NOT NULL DEFAULT false,
  officer_on_watch  BOOLEAN NOT NULL DEFAULT false,

  imo_number   TEXT,
  vessel_type  TEXT,
  flag_state   TEXT,
  company      TEXT,
  dp_days      INTEGER NOT NULL DEFAULT 0,
  cadet_service BOOLEAN NOT NULL DEFAULT false,
  port_sign_on  TEXT,
  port_sign_off TEXT,
  notes         TEXT,

  source_doc_path   TEXT,
  ocr_confidence    NUMERIC(4,3) CHECK (ocr_confidence IS NULL OR (ocr_confidence >= 0 AND ocr_confidence <= 1)),

  needs_manual_review BOOLEAN NOT NULL DEFAULT false,
  verified            BOOLEAN NOT NULL DEFAULT false,

  gross_tonnage       INTEGER,
  tonnage_category    TEXT,
  creditable_for_routes TEXT[],

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE OR REPLACE FUNCTION update_sea_service_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS sea_service_updated_at ON sea_service;
CREATE TRIGGER sea_service_updated_at
  BEFORE UPDATE ON sea_service
  FOR EACH ROW EXECUTE FUNCTION update_sea_service_updated_at();

CREATE INDEX IF NOT EXISTS idx_sea_service_user_id      ON sea_service (user_id);
CREATE INDEX IF NOT EXISTS idx_sea_service_sign_on_date ON sea_service (user_id, sign_on_date DESC);
CREATE INDEX IF NOT EXISTS idx_sea_service_dedup        ON sea_service (user_id, vessel_name, sign_on_date, sign_off_date);
CREATE INDEX IF NOT EXISTS idx_sea_service_department   ON sea_service (user_id, department);
CREATE INDEX IF NOT EXISTS idx_sea_service_review       ON sea_service (user_id) WHERE needs_manual_review = true;

ALTER TABLE sea_service ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'sea_service' AND policyname = 'Users can view own sea service') THEN
    CREATE POLICY "Users can view own sea service"   ON sea_service FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'sea_service' AND policyname = 'Users can insert own sea service') THEN
    CREATE POLICY "Users can insert own sea service" ON sea_service FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'sea_service' AND policyname = 'Users can update own sea service') THEN
    CREATE POLICY "Users can update own sea service" ON sea_service FOR UPDATE USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'sea_service' AND policyname = 'Users can delete own sea service') THEN
    CREATE POLICY "Users can delete own sea service" ON sea_service FOR DELETE USING (auth.uid() = user_id);
  END IF;
END $$;


-- ── newsletter_subscribers ────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'homepage',
  subscribed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS newsletter_subscribers_email_unique
  ON newsletter_subscribers (email);

ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'newsletter_subscribers' AND policyname = 'Anyone can subscribe') THEN
    CREATE POLICY "Anyone can subscribe" ON newsletter_subscribers FOR INSERT WITH CHECK (true);
  END IF;
END $$;


-- ── training_certificates ─────────────────────────────────────────────────────
-- STCW courses and required training records per user.

CREATE TABLE IF NOT EXISTS training_certificates (
  id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,

  certificate_category TEXT NOT NULL
    CHECK (certificate_category IN ('safety_renewable', 'operational', 'management_level', 'specialist')),
  course_type     TEXT NOT NULL,
  course_name     TEXT NOT NULL,
  completion_date DATE NOT NULL,
  expiration_date DATE,
  certificate_number TEXT,
  issuing_school     TEXT,
  doc_path           TEXT,
  satisfied_via_academy BOOLEAN NOT NULL DEFAULT false,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE OR REPLACE FUNCTION update_training_certificates_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS training_certificates_updated_at ON training_certificates;
CREATE TRIGGER training_certificates_updated_at
  BEFORE UPDATE ON training_certificates
  FOR EACH ROW EXECUTE FUNCTION update_training_certificates_updated_at();

CREATE INDEX IF NOT EXISTS idx_training_certs_user_id  ON training_certificates (user_id);
CREATE INDEX IF NOT EXISTS idx_training_certs_category ON training_certificates (user_id, certificate_category);
CREATE INDEX IF NOT EXISTS idx_training_certs_expiring ON training_certificates (user_id, expiration_date)
  WHERE expiration_date IS NOT NULL;

ALTER TABLE training_certificates ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'training_certificates' AND policyname = 'Users can view own training certificates') THEN
    CREATE POLICY "Users can view own training certificates"   ON training_certificates FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'training_certificates' AND policyname = 'Users can insert own training certificates') THEN
    CREATE POLICY "Users can insert own training certificates" ON training_certificates FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'training_certificates' AND policyname = 'Users can update own training certificates') THEN
    CREATE POLICY "Users can update own training certificates" ON training_certificates FOR UPDATE USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'training_certificates' AND policyname = 'Users can delete own training certificates') THEN
    CREATE POLICY "Users can delete own training certificates" ON training_certificates FOR DELETE USING (auth.uid() = user_id);
  END IF;
END $$;


-- ── career_goals ──────────────────────────────────────────────────────────────
-- User's current credential and upgrade target. One row per user (upserted).

CREATE TABLE IF NOT EXISTS career_goals (
  id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,

  current_credential TEXT NOT NULL,
  target_credential  TEXT NOT NULL,
  preferred_route    TEXT CHECK (preferred_route IN ('oceans', 'near_coastal', 'great_lakes', 'inland', 'both')),

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS career_goals_user_id_unique ON career_goals (user_id);

CREATE OR REPLACE FUNCTION update_career_goals_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS career_goals_updated_at ON career_goals;
CREATE TRIGGER career_goals_updated_at
  BEFORE UPDATE ON career_goals
  FOR EACH ROW EXECUTE FUNCTION update_career_goals_updated_at();

ALTER TABLE career_goals ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'career_goals' AND policyname = 'Users can view own career goals') THEN
    CREATE POLICY "Users can view own career goals"   ON career_goals FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'career_goals' AND policyname = 'Users can insert own career goals') THEN
    CREATE POLICY "Users can insert own career goals" ON career_goals FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'career_goals' AND policyname = 'Users can update own career goals') THEN
    CREATE POLICY "Users can update own career goals" ON career_goals FOR UPDATE USING (auth.uid() = user_id);
  END IF;
END $$;


-- ── ships ─────────────────────────────────────────────────────────────────────
-- Career Navigator vessel records. NOT the pay-calculator ships
-- (those live in a separate Supabase project: NEXT_PUBLIC_SUPABASE_PAY_URL).

CREATE TABLE IF NOT EXISTS ships (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  class       TEXT NOT NULL,
  hull_number TEXT,

  operator TEXT NOT NULL DEFAULT 'msc'
    CHECK (operator IN ('msc', 'noaa', 'commercial', 'usn')),

  service_type    TEXT,
  grt             INTEGER,
  tonnage_band    TEXT CHECK (tonnage_band IN ('unlimited', '500_to_1600', '200_to_500', 'under_200')),
  route_category  TEXT CHECK (route_category IN ('oceans', 'near_coastal', 'great_lakes', 'inland')),
  propulsion_type TEXT CHECK (propulsion_type IN ('motor', 'steam', 'gas_turbine', 'sail')),
  typical_theater TEXT,
  home_port       TEXT,
  slug            TEXT NOT NULL,
  description     TEXT,
  image_url       TEXT,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS ships_slug_unique ON ships (slug);

CREATE OR REPLACE FUNCTION update_ships_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS ships_updated_at ON ships;
CREATE TRIGGER ships_updated_at
  BEFORE UPDATE ON ships
  FOR EACH ROW EXECUTE FUNCTION update_ships_updated_at();

CREATE INDEX IF NOT EXISTS idx_ships_operator       ON ships (operator);
CREATE INDEX IF NOT EXISTS idx_ships_tonnage_band   ON ships (tonnage_band);
CREATE INDEX IF NOT EXISTS idx_ships_route_category ON ships (route_category);

ALTER TABLE ships ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'ships' AND policyname = 'Public read access for ships') THEN
    CREATE POLICY "Public read access for ships" ON ships FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'ships' AND policyname = 'Admin write access for ships') THEN
    CREATE POLICY "Admin write access for ships" ON ships FOR INSERT
      WITH CHECK (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'ships' AND policyname = 'Admin update access for ships') THEN
    CREATE POLICY "Admin update access for ships" ON ships FOR UPDATE
      USING (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');
  END IF;
END $$;


-- ── retirement_reviews ────────────────────────────────────────────────────────
-- User-submitted testimonials for the CIVMAR retirement planning page.
-- Require admin approval (approved = false by default) before appearing publicly.

CREATE TABLE IF NOT EXISTS retirement_reviews (
  id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name    TEXT NOT NULL,
  review  TEXT NOT NULL,
  rating  INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  approved BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_retirement_reviews_approved
  ON retirement_reviews (approved, created_at DESC);

ALTER TABLE retirement_reviews ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'retirement_reviews' AND policyname = 'Public can read approved reviews') THEN
    CREATE POLICY "Public can read approved reviews" ON retirement_reviews FOR SELECT USING (approved = true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'retirement_reviews' AND policyname = 'Anyone can submit a review') THEN
    CREATE POLICY "Anyone can submit a review" ON retirement_reviews FOR INSERT WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'retirement_reviews' AND policyname = 'Admin can manage reviews') THEN
    CREATE POLICY "Admin can manage reviews" ON retirement_reviews FOR UPDATE
      USING (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');
  END IF;
END $$;
