-- ============================================================================
-- CIVSail: Drop leave_chits table (undo migration 20260605000000)
-- We switched to Supabase Storage for saved form data instead
-- ============================================================================

DROP TABLE IF EXISTS leave_chits CASCADE;
