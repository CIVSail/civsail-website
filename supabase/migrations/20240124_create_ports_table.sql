-- ============================================================================
-- CIVSail Ports Table Migration
-- Creates the ports table with ~3,900 world ports for the globe visualization
-- ============================================================================

-- Step 1: Create enum for port page status (three-tier system)
-- full_guide = complete port guide with venues, tips, maps
-- basic_page = template page with basic info
-- none = just coordinates, no page built yet
CREATE TYPE port_page_status AS ENUM ('full_guide', 'basic_page', 'none');

-- Step 2: Create the ports table
CREATE TABLE ports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Core location data (from world_ports dataset)
  city TEXT NOT NULL,
  state TEXT,
  country TEXT NOT NULL,
  latitude DECIMAL(9,6) NOT NULL,
  longitude DECIMAL(9,6) NOT NULL,

  -- Timezone info
  utc_offset INTEGER,
  has_dst BOOLEAN DEFAULT false,

  -- Emission control areas (from dataset)
  -- Regulation 14: SOx emission control area
  -- Regulation 13: NOx emission control area
  regulation_14 BOOLEAN DEFAULT false,
  regulation_13 BOOLEAN DEFAULT false,

  -- CIVSail-specific fields
  slug TEXT UNIQUE,                              -- URL path: 'far-east/guam'
  page_status port_page_status DEFAULT 'none',   -- Content tier
  display_name TEXT,                             -- Override for city name
  region TEXT,                                   -- 'far-east', 'mediterranean', etc.

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Step 3: Add unique constraint for upsert operations
-- Prevents duplicate city+country combinations
ALTER TABLE ports ADD CONSTRAINT ports_city_country_unique UNIQUE (city, country);

-- Step 4: Create indexes for common query patterns
CREATE INDEX idx_ports_coordinates ON ports (latitude, longitude);
CREATE INDEX idx_ports_region ON ports (region) WHERE region IS NOT NULL;
CREATE INDEX idx_ports_slug ON ports (slug) WHERE slug IS NOT NULL;
CREATE INDEX idx_ports_page_status ON ports (page_status);
CREATE INDEX idx_ports_country ON ports (country);

-- Step 5: Create updated_at trigger
CREATE OR REPLACE FUNCTION update_ports_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER ports_updated_at
  BEFORE UPDATE ON ports
  FOR EACH ROW
  EXECUTE FUNCTION update_ports_updated_at();

-- Step 6: Enable Row Level Security
ALTER TABLE ports ENABLE ROW LEVEL SECURITY;

-- Step 7: RLS Policies
-- Anyone can read ports (public data for the globe)
CREATE POLICY "Public read access for ports"
  ON ports FOR SELECT
  USING (true);

-- Only admins can modify ports
-- Check user metadata for admin role OR match specific admin user IDs
CREATE POLICY "Admin write access for ports"
  ON ports FOR INSERT
  WITH CHECK (
    auth.jwt() ->> 'role' = 'admin' OR
    auth.uid() IN (
      -- Add your admin user UUIDs here
      -- Example: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'::uuid
      SELECT auth.uid() WHERE auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
    )
  );

CREATE POLICY "Admin update access for ports"
  ON ports FOR UPDATE
  USING (
    auth.jwt() ->> 'role' = 'admin' OR
    auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
  );

CREATE POLICY "Admin delete access for ports"
  ON ports FOR DELETE
  USING (
    auth.jwt() ->> 'role' = 'admin' OR
    auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
  );

-- ============================================================================
-- Verification queries (run after migration)
-- ============================================================================
-- Check table exists:
-- SELECT * FROM ports LIMIT 5;

-- Check indexes:
-- SELECT indexname FROM pg_indexes WHERE tablename = 'ports';

-- Check RLS is enabled:
-- SELECT relname, relrowsecurity FROM pg_class WHERE relname = 'ports';
