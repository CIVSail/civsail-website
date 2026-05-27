-- ============================================================================
-- CIVSail: Travel claims table
-- Stores generated travel claim packages and extraction metadata
-- ============================================================================

CREATE TABLE IF NOT EXISTS travel_claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'submitted', 'archived')),
  package_path TEXT,
  extracted_data JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_travel_claims_user_id ON travel_claims (user_id);
CREATE INDEX IF NOT EXISTS idx_travel_claims_status ON travel_claims (status);

ALTER TABLE travel_claims ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'travel_claims'
      AND policyname = 'Users can view own travel claims'
  ) THEN
    CREATE POLICY "Users can view own travel claims"
      ON travel_claims FOR SELECT
      USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'travel_claims'
      AND policyname = 'Users can insert own travel claims'
  ) THEN
    CREATE POLICY "Users can insert own travel claims"
      ON travel_claims FOR INSERT
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'travel_claims'
      AND policyname = 'Users can update own travel claims'
  ) THEN
    CREATE POLICY "Users can update own travel claims"
      ON travel_claims FOR UPDATE
      USING (auth.uid() = user_id);
  END IF;
END $$;
