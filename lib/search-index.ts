/**
 * @file search-index.ts
 * @description Static search index for client-side site search.
 *
 * Each entry represents a searchable page on CIVSail. The search
 * bar in Navigation.tsx filters this index as the user types,
 * matching against title, description, category, and keywords.
 *
 * To add a new page to search: add an entry here with relevant keywords.
 */

export interface SearchEntry {
  title: string;
  description: string;
  url: string;
  category: string;
  keywords: string[];
}

export const SEARCH_INDEX: SearchEntry[] = [
  // ── Maritime 101 ──────────────────────────────────────────────
  {
    title: 'Maritime 101',
    description: 'Start here — everything you need to know about the merchant marine.',
    url: '/maritime-101',
    category: 'Maritime 101',
    keywords: ['getting started', 'beginner', 'intro', 'overview', 'new mariner'],
  },
  {
    title: 'What is the Merchant Marine?',
    description: 'An introduction to the U.S. Merchant Marine, its role, and how it works.',
    url: '/maritime-101/what-is-merchant-marine',
    category: 'Maritime 101',
    keywords: ['merchant marine', 'what is', 'intro', 'civilian', 'CIVMAR', 'overview'],
  },
  {
    title: 'Careers & Sectors',
    description: 'Explore the different sectors and career paths in the maritime industry.',
    url: '/maritime-101/careers-and-sectors',
    category: 'Maritime 101',
    keywords: ['career', 'sector', 'industry', 'jobs', 'path', 'options', 'commercial', 'government'],
  },
  {
    title: 'Life at Sea',
    description: 'What daily life is actually like onboard — schedules, food, internet, crew life.',
    url: '/maritime-101/life-at-sea',
    category: 'Maritime 101',
    keywords: ['life', 'sea', 'onboard', 'ship life', 'schedule', 'rotation', 'internet', 'food', 'crew', 'living'],
  },
  {
    title: 'Training & Career Entry',
    description: 'How to break into the maritime industry — academy, hawsepipe, and military paths.',
    url: '/maritime-101/training-and-entry',
    category: 'Maritime 101',
    keywords: ['training', 'entry', 'career', 'how to', 'start', 'break in', 'begin'],
  },
  {
    title: 'Maritime Academy Path',
    description: 'The four-year academy route to an unlimited license and officer career.',
    url: '/maritime-101/training-and-entry/academy',
    category: 'Maritime 101',
    keywords: ['academy', 'college', 'school', 'SUNY', 'Kings Point', 'Cal Maritime', 'Texas', 'Maine', 'Mass Maritime', 'Great Lakes', 'NSMV', 'officer', 'license', 'degree'],
  },
  {
    title: 'Hawsepipe Path',
    description: 'Work your way up from entry-level — no degree required, experience-based advancement.',
    url: '/maritime-101/training-and-entry/hawsepipe',
    category: 'Maritime 101',
    keywords: ['hawsepipe', 'no degree', 'experience', 'work up', 'entry level', 'OS', 'AB', 'wiper', 'rating', 'upgrade'],
  },
  {
    title: 'Military to Mariner',
    description: 'Convert military sea time and experience into civilian merchant mariner credentials.',
    url: '/maritime-101/training-and-entry/military',
    category: 'Maritime 101',
    keywords: ['military', 'veteran', 'Navy', 'Coast Guard', 'Army', 'Marines', 'DD-214', 'sea time', 'conversion', 'transition', 'DOD COOL'],
  },
  {
    title: 'Credentials & Licensing',
    description: 'MMC, TWIC, STCW, medical certificates — what you need and how to get them.',
    url: '/maritime-101/credentials',
    category: 'Maritime 101',
    keywords: ['credentials', 'license', 'MMC', 'TWIC', 'STCW', 'medical', 'NMC', 'endorsement', 'certificate', 'merchant mariner credential'],
  },

  // ── Maritime 101 Sectors ──────────────────────────────────────
  {
    title: 'Government Shipping',
    description: 'MSC, NOAA, and other federal maritime careers.',
    url: '/maritime-101/sectors/government',
    category: 'Sectors',
    keywords: ['government', 'MSC', 'NOAA', 'federal', 'CIVMAR', 'Military Sealift Command'],
  },
  {
    title: 'Commercial Deep Sea',
    description: 'Ocean-going cargo ships, container vessels, and tankers.',
    url: '/maritime-101/sectors/commercial-deep-sea',
    category: 'Sectors',
    keywords: ['commercial', 'deep sea', 'cargo', 'container', 'tanker', 'ocean', 'shipping'],
  },
  {
    title: 'Offshore Oil Rigs',
    description: 'Platform and drilling operations in the oil and gas industry.',
    url: '/maritime-101/sectors/offshore-rigs',
    category: 'Sectors',
    keywords: ['offshore', 'oil', 'rig', 'drilling', 'platform', 'gas', 'energy'],
  },
  {
    title: 'Offshore Supply Vessels',
    description: 'OSVs supporting offshore platforms with crew and cargo.',
    url: '/maritime-101/sectors/offshore-supply',
    category: 'Sectors',
    keywords: ['offshore', 'supply', 'OSV', 'platform', 'crew boat'],
  },
  {
    title: 'Tugboats',
    description: 'Harbor and coastal towing — ship assist, barge towing, escort work.',
    url: '/maritime-101/sectors/tugboats',
    category: 'Sectors',
    keywords: ['tug', 'tugboat', 'towing', 'harbor', 'barge', 'assist', 'escort'],
  },
  {
    title: 'Barges',
    description: 'ATB, ITB, and tank barges — inland and coastal operations.',
    url: '/maritime-101/sectors/barges',
    category: 'Sectors',
    keywords: ['barge', 'ATB', 'ITB', 'tank', 'inland', 'coastal'],
  },
  {
    title: 'Ferries',
    description: 'Passenger and vehicle ferry operations.',
    url: '/maritime-101/sectors/ferries',
    category: 'Sectors',
    keywords: ['ferry', 'passenger', 'vehicle', 'commuter', 'transport'],
  },
  {
    title: 'Cruise Ships',
    description: 'Life and careers aboard cruise vessels.',
    url: '/maritime-101/sectors/cruise-ships',
    category: 'Sectors',
    keywords: ['cruise', 'passenger', 'hospitality', 'cruise line', 'cruise ship'],
  },
  {
    title: 'Yachts',
    description: 'Private and charter yacht careers.',
    url: '/maritime-101/sectors/yachts',
    category: 'Sectors',
    keywords: ['yacht', 'private', 'charter', 'superyacht', 'mega yacht'],
  },
  {
    title: 'Fishing',
    description: 'Commercial fishing vessel operations.',
    url: '/maritime-101/sectors/fishing',
    category: 'Sectors',
    keywords: ['fishing', 'commercial fishing', 'trawler', 'crabbing'],
  },
  {
    title: 'Pilots',
    description: 'Maritime harbor and river pilots.',
    url: '/maritime-101/sectors/pilots',
    category: 'Sectors',
    keywords: ['pilot', 'harbor pilot', 'river pilot', 'bar pilot', 'docking'],
  },

  // ── Tools ─────────────────────────────────────────────────────
  {
    title: 'Tools',
    description: 'Interactive tools for CIVMARs — calculators, generators, and more.',
    url: '/tools',
    category: 'Tools',
    keywords: ['tools', 'calculator', 'generator'],
  },
  {
    title: 'Ship Pay Calculator',
    description: 'Calculate and compare CIVMAR earnings by ship class and position.',
    url: '/tools/ship-pay-calculator',
    category: 'Tools',
    keywords: ['pay', 'calculator', 'salary', 'wage', 'earnings', 'money', 'compensation', 'ship pay', 'how much'],
  },
  {
    title: 'Pay Comparison Tool',
    description: 'Compare pay across different ship classes and positions side by side.',
    url: '/tools/pay-comparison',
    category: 'Tools',
    keywords: ['pay', 'compare', 'comparison', 'salary', 'wage', 'side by side'],
  },
  {
    title: 'Leave Chit Generator',
    description: 'Auto-fill MSC leave request forms and calculate leave balances.',
    url: '/tools/leave-chit',
    category: 'Tools',
    keywords: ['leave', 'chit', 'leave request', 'annual leave', 'time off', 'vacation', 'form'],
  },
  {
    title: 'Travel Voucher (DD 1351-2)',
    description: 'Generate DD 1351-2 travel claims for faster reimbursement.',
    url: '/tools/travel-claim',
    category: 'Tools',
    keywords: ['travel', 'voucher', 'DD 1351', 'claim', 'reimbursement', 'PCS', 'TDY', 'per diem'],
  },

  // ── Ships (MSC Fleet) ─────────────────────────────────────────
  {
    title: 'MSC Ships',
    description: 'Browse all MSC ship classes — specs, pay, life aboard, and deployment info.',
    url: '/ships/msc',
    category: 'Ships',
    keywords: ['ships', 'MSC', 'fleet', 'vessel', 'class', 'Military Sealift Command'],
  },
  {
    title: 'T-AKE Class',
    description: 'Dry cargo and ammunition ships — the workhorse of MSC underway replenishment.',
    url: '/ships/msc/t-ake',
    category: 'Ships',
    keywords: ['T-AKE', 'dry cargo', 'ammunition', 'UNREP', 'Lewis and Clark', 'replenishment'],
  },
  {
    title: 'T-AO Class',
    description: 'Fleet oilers — refueling Navy ships at sea.',
    url: '/ships/msc/t-ao',
    category: 'Ships',
    keywords: ['T-AO', 'oiler', 'fuel', 'tanker', 'Henry J. Kaiser', 'refueling'],
  },
  {
    title: 'T-AOE Class',
    description: 'Fast combat support ships — the largest and fastest replenishment vessels.',
    url: '/ships/msc/t-aoe',
    category: 'Ships',
    keywords: ['T-AOE', 'combat support', 'supply', 'fast', 'replenishment'],
  },
  {
    title: 'T-AH Class',
    description: 'Hospital ships — USNS Mercy and USNS Comfort.',
    url: '/ships/msc/t-ah',
    category: 'Ships',
    keywords: ['T-AH', 'hospital', 'Mercy', 'Comfort', 'medical', 'humanitarian'],
  },
  {
    title: 'T-AS Class',
    description: 'Submarine tenders — supporting submarine operations.',
    url: '/ships/msc/t-as',
    category: 'Ships',
    keywords: ['T-AS', 'submarine', 'tender', 'support'],
  },
  {
    title: 'T-ARC Class',
    description: 'Cable laying and repair ships.',
    url: '/ships/msc/t-arc',
    category: 'Ships',
    keywords: ['T-ARC', 'cable', 'repair', 'laying', 'telecommunications'],
  },
  {
    title: 'T-ARS Class',
    description: 'Rescue and salvage ships.',
    url: '/ships/msc/t-ars',
    category: 'Ships',
    keywords: ['T-ARS', 'rescue', 'salvage', 'towing'],
  },
  {
    title: 'T-EPF Class',
    description: 'Expeditionary fast transport — high-speed catamaran vessels.',
    url: '/ships/msc/t-epf',
    category: 'Ships',
    keywords: ['T-EPF', 'expeditionary', 'fast', 'transport', 'catamaran', 'Spearhead'],
  },
  {
    title: 'LCC Class',
    description: 'Command ships — USS Blue Ridge and USS Mount Whitney.',
    url: '/ships/msc/lcc',
    category: 'Ships',
    keywords: ['LCC', 'command', 'Blue Ridge', 'Mount Whitney', 'flagship'],
  },
  {
    title: 'AS Class',
    description: 'Submarine support vessels.',
    url: '/ships/msc/as',
    category: 'Ships',
    keywords: ['AS', 'submarine', 'support'],
  },
  {
    title: 'ESB Class',
    description: 'Expeditionary sea base — mobile staging platforms.',
    url: '/ships/msc/esb',
    category: 'Ships',
    keywords: ['ESB', 'expeditionary', 'sea base', 'staging', 'Lewis B. Puller', 'mobile'],
  },

  // ── Ports (Regions + Key Ports) ───────────────────────────────
  {
    title: 'World Ports Map',
    description: 'Interactive map of ports visited by MSC and merchant vessels worldwide.',
    url: '/ports',
    category: 'Ports',
    keywords: ['ports', 'map', 'world', 'locations'],
  },
  {
    title: 'Norfolk, Virginia',
    description: 'Port guide for Norfolk — the largest MSC hub on the East Coast.',
    url: '/ports/united-states/virginia/norfolk',
    category: 'Ports',
    keywords: ['Norfolk', 'Virginia', 'East Coast', 'NAVSTA', 'VA'],
  },
  {
    title: 'San Diego, California',
    description: 'Port guide for San Diego — West Coast naval base and port.',
    url: '/ports/united-states/california/san-diego',
    category: 'Ports',
    keywords: ['San Diego', 'California', 'West Coast', 'CA'],
  },
  {
    title: 'Earle, New Jersey',
    description: 'Port guide for Naval Weapons Station Earle.',
    url: '/ports/united-states/new-jersey/earle',
    category: 'Ports',
    keywords: ['Earle', 'New Jersey', 'NWS', 'NJ', 'weapons station'],
  },
  {
    title: 'Guam',
    description: 'Port guide for Guam — MSC hub in the Western Pacific.',
    url: '/ports/far-east/guam',
    category: 'Ports',
    keywords: ['Guam', 'Pacific', 'Far East', 'Apra Harbor'],
  },
  {
    title: 'Sasebo, Japan',
    description: 'Port guide for Sasebo — U.S. naval base in Japan.',
    url: '/ports/far-east/japan/sasebo',
    category: 'Ports',
    keywords: ['Sasebo', 'Japan', 'Far East', 'Pacific'],
  },
  {
    title: 'Dubai, UAE',
    description: 'Port guide for Dubai — Jebel Ali and surrounding area.',
    url: '/ports/middle-east/uae/dubai',
    category: 'Ports',
    keywords: ['Dubai', 'UAE', 'Jebel Ali', 'Middle East'],
  },
  {
    title: 'Bahrain',
    description: 'Port guide for Bahrain — Fifth Fleet headquarters.',
    url: '/ports/middle-east/bahrain/bahrain',
    category: 'Ports',
    keywords: ['Bahrain', 'Middle East', 'Fifth Fleet', '5th Fleet'],
  },
  {
    title: 'Rota, Spain',
    description: 'Port guide for Naval Station Rota, Spain.',
    url: '/ports/europe/spain/rota',
    category: 'Ports',
    keywords: ['Rota', 'Spain', 'Europe', 'Mediterranean', 'NAVSTA'],
  },
  {
    title: 'Naples, Italy',
    description: 'Port guide for Naples — U.S. naval support activity.',
    url: '/ports/europe/italy/naples',
    category: 'Ports',
    keywords: ['Naples', 'Italy', 'Europe', 'Mediterranean', 'NSA'],
  },
  {
    title: 'Souda Bay, Greece',
    description: 'Port guide for Souda Bay — NATO base in Crete.',
    url: '/ports/europe/greece/souda-bay',
    category: 'Ports',
    keywords: ['Souda Bay', 'Greece', 'Crete', 'Europe', 'Mediterranean', 'NATO'],
  },
  {
    title: 'Camp Lemonnier, Djibouti',
    description: 'Port guide for Camp Lemonnier — the only permanent U.S. base in Africa.',
    url: '/ports/africa/djibouti/camp-lemonnier',
    category: 'Ports',
    keywords: ['Djibouti', 'Africa', 'Camp Lemonnier', 'Horn of Africa'],
  },
  {
    title: 'GITMO, Cuba',
    description: 'Port guide for Guantanamo Bay Naval Base.',
    url: '/ports/south-america/cuba/gitmo',
    category: 'Ports',
    keywords: ['GITMO', 'Guantanamo', 'Cuba', 'Caribbean'],
  },

  // ── Editorials ────────────────────────────────────────────────
  {
    title: 'Editorials',
    description: 'Essays, analysis, and career stories for civilian mariners.',
    url: '/editorials',
    category: 'Editorials',
    keywords: ['editorials', 'articles', 'essays', 'stories', 'analysis', 'opinion'],
  },

  // ── MSC Hub ───────────────────────────────────────────────────
  {
    title: 'MSC Hub',
    description: 'Resources for MSC CIVMARs — forms, policies, tools, and NEO help.',
    url: '/msc-hub/forms',
    category: 'MSC Hub',
    keywords: ['MSC', 'hub', 'CIVMAR', 'resources', 'forms'],
  },
  {
    title: 'MSC Policies',
    description: 'Key MSC policies and references for CIVMARs.',
    url: '/msc-hub/policies',
    category: 'MSC Hub',
    keywords: ['MSC', 'policies', 'rules', 'regulations', 'COMSCINST'],
  },
  {
    title: 'NEO & New Mariner Help',
    description: 'Onboarding guide for new MSC CIVMARs — what to expect and how to prepare.',
    url: '/msc-hub/neo-help',
    category: 'MSC Hub',
    keywords: ['NEO', 'new employee', 'onboarding', 'orientation', 'new mariner', 'first ship', 'new hire'],
  },
  {
    title: 'Common Requests',
    description: 'Quick links for frequent CIVMAR needs — placement, pay, benefits, HR.',
    url: '/common-requests',
    category: 'MSC Hub',
    keywords: ['common', 'requests', 'contacts', 'placement', 'HR', 'pay', 'benefits', 'drug test'],
  },

  // ── Professional Network ──────────────────────────────────────
  {
    title: 'Financial Planning',
    description: 'Financial guidance for mariners — budgeting, investing, benefits, and more.',
    url: '/financial',
    category: 'Professional',
    keywords: ['financial', 'money', 'budget', 'investing', 'TSP', 'retirement', 'savings', 'benefits'],
  },
  {
    title: 'Retirement Planning',
    description: 'FERS, TSP, Social Security, and retirement strategies for CIVMARs.',
    url: '/retirement',
    category: 'Professional',
    keywords: ['retirement', 'FERS', 'TSP', 'pension', 'Social Security', 'retire', 'annuity'],
  },

  // ── About ─────────────────────────────────────────────────────
  {
    title: 'About CIVSail',
    description: 'Who we are, what CIVSail does, and why we built it.',
    url: '/about',
    category: 'About',
    keywords: ['about', 'mission', 'who', 'team', 'contact'],
  },
];

/**
 * Search the index by matching a query against title, description, category, and keywords.
 * Returns the top N matches sorted by relevance (title match > keyword match > description match).
 */
export function searchIndex(query: string, limit = 8): SearchEntry[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];

  return SEARCH_INDEX
    .map((entry) => {
      const titleLower = entry.title.toLowerCase();
      const descLower = entry.description.toLowerCase();
      const catLower = entry.category.toLowerCase();
      const kwString = entry.keywords.join(' ').toLowerCase();

      let score = 0;

      // Exact title match is highest
      if (titleLower === q) score += 100;
      // Title starts with query
      else if (titleLower.startsWith(q)) score += 80;
      // Title contains query
      else if (titleLower.includes(q)) score += 60;

      // Category match
      if (catLower.includes(q)) score += 30;

      // Keyword match (check each keyword individually for better matching)
      for (const kw of entry.keywords) {
        if (kw.toLowerCase() === q) { score += 50; break; }
        if (kw.toLowerCase().startsWith(q)) { score += 35; break; }
        if (kw.toLowerCase().includes(q)) { score += 20; break; }
      }

      // Description match
      if (descLower.includes(q)) score += 10;

      // Multi-word: check if all words appear somewhere
      const words = q.split(/\s+/);
      if (words.length > 1) {
        const combined = `${titleLower} ${kwString} ${descLower} ${catLower}`;
        const allMatch = words.every((w) => combined.includes(w));
        if (allMatch) score += 40;
      }

      return { entry, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ entry }) => entry);
}
