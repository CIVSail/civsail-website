/**
 * @file mark-existing-ports.ts
 * @description Mark ports that already have CIVSail pages built
 *
 * Updates the page_status, slug, region, and display_name for ports
 * that have existing detailed or basic pages in the codebase.
 *
 * @usage
 * 1. Add your ports to the existingPorts array below
 * 2. Run: npx tsx scripts/mark-existing-ports.ts
 *
 * @note Run import-ports.ts first to populate the database
 */

import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { PortPageStatus } from '../types/ports';

// Load .env.local
config({ path: '.env.local' });

// Load environment variables
const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY required');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * Existing ports in CIVSail with their status
 *
 * Add ports here as you build pages. The city name should match
 * what's in the world_ports dataset (check the database if unsure).
 */
interface ExistingPort {
  city: string;          // Must match database city name
  country: string;       // Must match database country name
  slug: string;          // URL path: 'region/port-name'
  page_status: PortPageStatus;
  region: string;
  display_name?: string; // Optional: override city name for display
}

const existingPorts: ExistingPort[] = [
  // ============================================================
  // FAR EAST
  // ============================================================
  {
    city: 'Apra', // Guam might be listed as Apra Harbor in the dataset
    country: 'Guam',
    slug: 'far-east/guam',
    page_status: 'full_guide',
    region: 'far-east',
    display_name: 'Guam (Apra Harbor)',
  },
  {
    city: 'Sasebo',
    country: 'Japan',
    slug: 'far-east/japan/sasebo',
    page_status: 'full_guide',
    region: 'far-east',
  },

  // ============================================================
  // UNITED STATES (dataset uses "U.S.A.")
  // ============================================================
  {
    city: 'Norfolk',
    country: 'U.S.A.',
    slug: 'usa/virginia/norfolk',
    page_status: 'basic_page',
    region: 'usa',
  },
  {
    city: 'San Diego',
    country: 'U.S.A.',
    slug: 'usa/california/san-diego',
    page_status: 'basic_page',
    region: 'usa',
  },
  {
    city: 'Seattle',
    country: 'U.S.A.',
    slug: 'usa/washington/seattle',
    page_status: 'basic_page',
    region: 'usa',
  },
  {
    city: 'Mobile',
    country: 'U.S.A.',
    slug: 'usa/alabama/mobile',
    page_status: 'basic_page',
    region: 'usa',
  },
  {
    city: 'Charleston',
    country: 'U.S.A.',
    slug: 'usa/south-carolina/charleston',
    page_status: 'basic_page',
    region: 'usa',
  },
  {
    city: 'Philadelphia',
    country: 'U.S.A.',
    slug: 'usa/pennsylvania/philadelphia',
    page_status: 'basic_page',
    region: 'usa',
  },

  // ============================================================
  // EUROPE
  // ============================================================
  {
    city: 'Rota',
    country: 'Spain',
    slug: 'europe/spain/rota',
    page_status: 'basic_page',
    region: 'europe',
  },
  {
    city: 'Naples',
    country: 'Italy',
    slug: 'europe/italy/naples',
    page_status: 'basic_page',
    region: 'europe',
  },
  {
    city: 'Souda',
    country: 'Greece',
    slug: 'europe/greece/souda-bay',
    page_status: 'basic_page',
    region: 'europe',
    display_name: 'Souda Bay',
  },

  // ============================================================
  // MIDDLE EAST (dataset uses "U.A.E." for UAE)
  // ============================================================
  {
    city: 'Dubai',
    country: 'U.A.E.',
    slug: 'middle-east/uae/dubai',
    page_status: 'basic_page',
    region: 'middle-east',
  },
  {
    city: 'Fujairah',
    country: 'U.A.E.',
    slug: 'middle-east/uae/fujairah',
    page_status: 'basic_page',
    region: 'middle-east',
  },
  {
    city: 'Jeddah',
    country: 'Saudi Arabia',
    slug: 'middle-east/saudi-arabia/jeddah',
    page_status: 'basic_page',
    region: 'middle-east',
  },
  {
    city: 'Salalah',
    country: 'Oman',
    slug: 'middle-east/oman/salalah',
    page_status: 'basic_page',
    region: 'middle-east',
  },
  // Note: Duqm not in world_ports dataset - will need manual addition
  // {
  //   city: 'Duqm',
  //   country: 'Oman',
  //   slug: 'middle-east/oman/duqm',
  //   page_status: 'basic_page',
  //   region: 'middle-east',
  // },
  {
    city: 'Manama',
    country: 'Bahrain',
    slug: 'middle-east/bahrain/manama',
    page_status: 'basic_page',
    region: 'middle-east',
    display_name: 'Bahrain',
  },

  // ============================================================
  // AFRICA
  // ============================================================
  {
    city: 'Djibouti',
    country: 'Djibouti',
    slug: 'africa/djibouti/djibouti',
    page_status: 'basic_page',
    region: 'africa',
  },

  // ============================================================
  // AUSTRALIA
  // ============================================================
  {
    city: 'Sydney',
    country: 'Australia',
    slug: 'australia/sydney',
    page_status: 'basic_page',
    region: 'australia',
  },

  // ============================================================
  // SOUTH AMERICA / CARIBBEAN
  // ============================================================
  {
    city: 'Santos',
    country: 'Brazil',
    slug: 'south-america/brazil/santos',
    page_status: 'basic_page',
    region: 'south-america',
  },
  {
    city: 'Cartagena',
    country: 'Colombia',
    slug: 'south-america/colombia/cartagena',
    page_status: 'basic_page',
    region: 'south-america',
  },
  {
    city: 'San Juan',
    country: 'Puerto Rico',
    slug: 'caribbean/puerto-rico/san-juan',
    page_status: 'basic_page',
    region: 'caribbean',
  },

  // Add more ports as you build them...
];

/**
 * Update a port in the database
 */
async function updatePort(port: ExistingPort): Promise<{
  success: boolean;
  error?: string;
}> {
  const { city, country, slug, page_status, region, display_name } = port;

  const updateData: Record<string, unknown> = {
    slug,
    page_status,
    region,
  };

  if (display_name) {
    updateData.display_name = display_name;
  }

  const { error } = await supabase
    .from('ports')
    .update(updateData)
    .eq('city', city)
    .eq('country', country);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

/**
 * Try to find a port with fuzzy matching if exact match fails
 */
async function findPort(city: string, country: string): Promise<{
  found: boolean;
  suggestions?: Array<{ city: string; country: string }>;
}> {
  // First try exact match
  const { data: exact } = await supabase
    .from('ports')
    .select('city, country')
    .eq('city', city)
    .eq('country', country)
    .limit(1);

  if (exact && exact.length > 0) {
    return { found: true };
  }

  // Try fuzzy match on city name
  const { data: fuzzy } = await supabase
    .from('ports')
    .select('city, country')
    .ilike('city', `%${city}%`)
    .limit(5);

  if (fuzzy && fuzzy.length > 0) {
    return { found: false, suggestions: fuzzy };
  }

  return { found: false };
}

/**
 * Main execution
 */
async function main() {
  console.log('='.repeat(60));
  console.log('CIVSail Mark Existing Ports');
  console.log('='.repeat(60));
  console.log(`\nProcessing ${existingPorts.length} ports...\n`);

  let updated = 0;
  let notFound = 0;
  const notFoundPorts: Array<{
    port: ExistingPort;
    suggestions?: Array<{ city: string; country: string }>;
  }> = [];

  for (const port of existingPorts) {
    // Check if port exists
    const { found, suggestions } = await findPort(port.city, port.country);

    if (!found) {
      notFound++;
      notFoundPorts.push({ port, suggestions });
      console.log(`  [NOT FOUND] ${port.city}, ${port.country}`);
      continue;
    }

    // Update the port
    const { success, error } = await updatePort(port);

    if (success) {
      updated++;
      console.log(`  [UPDATED] ${port.city}, ${port.country} -> ${port.page_status}`);
    } else {
      console.log(`  [ERROR] ${port.city}, ${port.country}: ${error}`);
    }
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('Summary');
  console.log('='.repeat(60));
  console.log(`Updated: ${updated} ports`);
  console.log(`Not found: ${notFound} ports`);

  if (notFoundPorts.length > 0) {
    console.log('\nPorts not found in database:');
    for (const { port, suggestions } of notFoundPorts) {
      console.log(`\n  "${port.city}", "${port.country}"`);
      if (suggestions && suggestions.length > 0) {
        console.log('  Suggestions:');
        suggestions.forEach((s) => console.log(`    - "${s.city}", "${s.country}"`));
      }
    }
    console.log('\nUpdate the city/country names in this script to match the database.');
  }

  // Verify by querying page_status distribution
  const { data: stats } = await supabase
    .from('ports')
    .select('page_status')
    .not('page_status', 'eq', 'none');

  if (stats) {
    const counts = stats.reduce((acc, row) => {
      acc[row.page_status] = (acc[row.page_status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    console.log('\nCurrent page_status distribution:');
    console.log(`  full_guide: ${counts.full_guide || 0}`);
    console.log(`  basic_page: ${counts.basic_page || 0}`);
  }
}

main();
