-- ============================================================================
-- CIVSail: Leave chits table
-- Stores generated leave chit form data
-- ============================================================================

DROP TABLE IF EXISTS leave_chits CASCADE;

CREATE TABLE leave_chits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
  "status" TEXT NOT NULL DEFAULT 'draft',
  form_data JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT leave_chits_status_check CHECK ("status" IN ('draft', 'submitted', 'archived'))
);

CREATE INDEX IF NOT EXISTS idx_leave_chits_user_id ON leave_chits (user_id);
CREATE INDEX IF NOT EXISTS idx_leave_chits_status ON leave_chits ("status");

ALTER TABLE leave_chits ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'leave_chits'
      AND policyname = 'Users can view own leave chits'
  ) THEN
    CREATE POLICY "Users can view own leave chits"
      ON leave_chits FOR SELECT
      USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'leave_chits'
      AND policyname = 'Users can insert own leave chits'
  ) THEN
    CREATE POLICY "Users can insert own leave chits"
      ON leave_chits FOR INSERT
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'leave_chits'
      AND policyname = 'Users can update own leave chits'
  ) THEN
    CREATE POLICY "Users can update own leave chits"
      ON leave_chits FOR UPDATE
      USING (auth.uid() = user_id);
  END IF;
END $$;
