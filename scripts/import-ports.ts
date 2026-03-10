/**
 * @file import-ports.ts
 * @description One-time script to import ~3,900 world ports into Supabase
 *
 * Downloads port data from the world_ports GitHub repo and upserts into
 * the ports table. Preserves existing page_status, slug, display_name,
 * and region if they're already set.
 *
 * @usage
 * 1. Ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are in .env.local
 * 2. Run: npx tsx scripts/import-ports.ts
 *
 * @note Uses service role key (not anon key) to bypass RLS for bulk import
 */

import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { RawPortData } from '../types/ports';

// Load .env.local
config({ path: '.env.local' });

// Configuration
const PORTS_URL = 'https://raw.githubusercontent.com/Project-Harrison/world_ports/main/ports.json';
const BATCH_SIZE = 100; // Upsert in batches to avoid timeouts

// Load environment variables
const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  console.error('Error: SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL not found in environment');
  process.exit(1);
}

if (!supabaseServiceKey) {
  console.error('Error: SUPABASE_SERVICE_ROLE_KEY not found in environment');
  console.error('This script requires the service role key to bypass RLS.');
  process.exit(1);
}

// Create Supabase client with service role (bypasses RLS)
const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * Fetch port data from GitHub
 */
async function fetchPortData(): Promise<RawPortData[]> {
  console.log(`Fetching ports from ${PORTS_URL}...`);

  const response = await fetch(PORTS_URL);

  if (!response.ok) {
    throw new Error(`Failed to fetch ports: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  console.log(`Fetched ${data.length} ports from GitHub`);

  return data;
}

/**
 * Transform raw port data to our schema
 */
function transformPort(raw: RawPortData) {
  return {
    city: raw.CITY.trim(),
    state: raw.STATE?.trim() || null,
    country: raw.COUNTRY.trim(),
    latitude: raw.LATITUDE,
    longitude: raw.LONGITUDE,
    utc_offset: raw.OFFSET,
    has_dst: raw.DST || false,
    regulation_14: raw.Regulation_14 || false,
    regulation_13: raw.Regulation_13 || false,
    // These fields are NOT set during import - preserve existing values
    // page_status: 'none' (default in DB)
    // slug: null
    // display_name: null
    // region: null
  };
}

/**
 * Deduplicate ports by city+country
 * The source data has duplicates that cause upsert conflicts
 */
function deduplicatePorts(ports: RawPortData[]): RawPortData[] {
  const seen = new Map<string, RawPortData>();

  for (const port of ports) {
    const key = `${port.CITY.trim().toLowerCase()}|${port.COUNTRY.trim().toLowerCase()}`;
    if (!seen.has(key)) {
      seen.set(key, port);
    }
  }

  const unique = Array.from(seen.values());
  console.log(`Deduplicated: ${ports.length} -> ${unique.length} ports (removed ${ports.length - unique.length} duplicates)`);

  return unique;
}

/**
 * Upsert ports in batches
 * Uses ON CONFLICT to update coordinates but preserve CIVSail-specific fields
 */
async function upsertPorts(ports: RawPortData[]): Promise<{
  imported: number;
  errors: number;
  errorDetails: string[];
}> {
  let imported = 0;
  let errors = 0;
  const errorDetails: string[] = [];

  // Process in batches
  for (let i = 0; i < ports.length; i += BATCH_SIZE) {
    const batch = ports.slice(i, i + BATCH_SIZE);
    const transformedBatch = batch.map(transformPort);

    const { data, error } = await supabase
      .from('ports')
      .upsert(transformedBatch, {
        onConflict: 'city,country',
        // Only update coordinate/timezone data, preserve CIVSail fields
        ignoreDuplicates: false,
      })
      .select('id');

    if (error) {
      errors += batch.length;
      errorDetails.push(`Batch ${Math.floor(i / BATCH_SIZE) + 1}: ${error.message}`);
      console.error(`Error in batch ${Math.floor(i / BATCH_SIZE) + 1}:`, error.message);
    } else {
      imported += data?.length || batch.length;
    }

    // Progress update every 500 ports
    if ((i + BATCH_SIZE) % 500 === 0 || i + BATCH_SIZE >= ports.length) {
      console.log(`Progress: ${Math.min(i + BATCH_SIZE, ports.length)}/${ports.length} ports processed`);
    }
  }

  return { imported, errors, errorDetails };
}

/**
 * Verify import by checking counts
 */
async function verifyImport(): Promise<void> {
  const { count, error } = await supabase
    .from('ports')
    .select('*', { count: 'exact', head: true });

  if (error) {
    console.error('Error verifying import:', error.message);
    return;
  }

  console.log(`\nVerification: ${count} total ports in database`);

  // Check page_status distribution
  const { data: statusData } = await supabase
    .from('ports')
    .select('page_status')
    .not('page_status', 'is', null);

  if (statusData) {
    const statusCounts = statusData.reduce((acc, row) => {
      acc[row.page_status] = (acc[row.page_status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    console.log('Page status distribution:', statusCounts);
  }
}

/**
 * Main execution
 */
async function main() {
  console.log('='.repeat(60));
  console.log('CIVSail Port Import Script');
  console.log('='.repeat(60));
  console.log();

  try {
    // Step 1: Fetch data
    const rawPorts = await fetchPortData();

    // Step 2: Deduplicate (source has duplicate city+country entries)
    const uniquePorts = deduplicatePorts(rawPorts);

    // Step 3: Log sample for verification
    console.log('\nSample port data:');
    console.log(JSON.stringify(uniquePorts[0], null, 2));
    console.log();

    // Step 4: Upsert to database
    console.log('Upserting ports to Supabase...');
    const { imported, errors, errorDetails } = await upsertPorts(uniquePorts);

    // Step 4: Report results
    console.log();
    console.log('='.repeat(60));
    console.log('Import Complete');
    console.log('='.repeat(60));
    console.log(`Imported: ${imported} ports`);
    console.log(`Errors: ${errors} ports`);

    if (errorDetails.length > 0) {
      console.log('\nError details:');
      errorDetails.forEach((e) => console.log(`  - ${e}`));
    }

    // Step 5: Verify
    await verifyImport();

  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
}

// Run the script
main();
