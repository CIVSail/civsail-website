/**
 * Sector data for CIVSail
 * 
 * Each sector represents a different maritime industry segment
 * with distinct lifestyle, schedules, and career patterns
 */

export type SectorTile = {
  id: string;
  title: string;
  icon: string;
  description: string;
  chips: string[];
  href: string;
  // Visual identity
  colorScheme: {
    border: string;      // Tailwind border color class
    bg: string;          // Tailwind gradient start
    accent: string;      // Tailwind text color for accents
    pill: string;        // Chip background color
  };
  // Layout hints for masonry
  size?: 'normal' | 'tall' | 'wide';
};

export const sectors: SectorTile[] = [
  {
    id: 'government',
    title: 'Government',
    icon: '🇺🇸',
    description:
      'Federal missions and structured employment. Great for stability, benefits, and unique operations.',
    chips: ['MSC', 'NOAA'],
    href: '/guides/sectors/government',
    colorScheme: {
      border: 'border-red-300',
      bg: 'from-red-50',
      accent: 'text-red-700',
      pill: 'bg-red-100 text-red-800',
    },
    size: 'tall', // Hero sector
  },
  {
    id: 'commercial-deep-sea',
    title: 'Commercial Deep Sea',
    icon: '🚢',
    description:
      'Large ships on global routes. Union and contract paths. Often the "classic" merchant marine image.',
    chips: ['Union', 'CONMAR', 'RoRo', 'Tanker', 'LNG', 'Container', 'Bulk'],
    href: '/guides/sectors/commercial-deep-sea',
    colorScheme: {
      border: 'border-blue-400',
      bg: 'from-blue-50',
      accent: 'text-blue-700',
      pill: 'bg-blue-100 text-blue-800',
    },
    size: 'tall', // Hero sector
  },
  {
    id: 'offshore-oil-rigs',
    title: 'Offshore Oil Rigs',
    icon: '🛢️',
    description:
      'Rig-side work and specialized operations. High intensity, market cycles, and niche requirements.',
    chips: ['MODU', 'Drillship', 'Semisub', 'Jackup'],
    href: '/guides/sectors/offshore-oil-rigs',
    colorScheme: {
      border: 'border-amber-400',
      bg: 'from-amber-50',
      accent: 'text-amber-700',
      pill: 'bg-amber-100 text-amber-800',
    },
  },
  {
    id: 'offshore-supply-vessels',
    title: 'Offshore Supply Vessels',
    icon: '⚓',
    description:
      'OSVs supporting offshore operations. Shorter hitches, hands-on work, often DP-heavy.',
    chips: ['OSV', 'DP', 'Gulf', 'Cargo runs', 'Platform support'],
    href: '/guides/sectors/offshore-supply-vessels',
    colorScheme: {
      border: 'border-emerald-300',
      bg: 'from-emerald-50',
      accent: 'text-emerald-700',
      pill: 'bg-emerald-100 text-emerald-800',
    },
  },
  {
    id: 'tug-boats',
    title: 'Tug Boats',
    icon: '🚤',
    description:
      'High-skill boat handling close to home. Schedules can be stable. Strong regional demand.',
    chips: ['ATB', 'Ship assist', 'Harbor', 'Coastal tug'],
    href: '/guides/sectors/tug-boats',
    colorScheme: {
      border: 'border-purple-300',
      bg: 'from-purple-50',
      accent: 'text-purple-700',
      pill: 'bg-purple-100 text-purple-800',
    },
  },
  {
    id: 'barges',
    title: 'Barges',
    icon: '🟫',
    description:
      'Inland and coastal cargo work. Often paired with tugs or towboats, with distinct lifestyle tradeoffs.',
    chips: ['Inland', 'Coastal', 'Towboat', 'Petroleum', 'Dry cargo'],
    href: '/guides/sectors/barges',
    colorScheme: {
      border: 'border-slate-300',
      bg: 'from-slate-50',
      accent: 'text-slate-700',
      pill: 'bg-slate-100 text-slate-700',
    },
  },
  {
    id: 'ferries',
    title: 'Ferries',
    icon: '⛴️',
    description:
      'Regular routes and predictable schedules. Often regional. Great fit for stability and home time.',
    chips: ['Commuter', 'Vehicle ferry', 'Public agencies'],
    href: '/guides/sectors/ferries',
    colorScheme: {
      border: 'border-cyan-300',
      bg: 'from-cyan-50',
      accent: 'text-cyan-700',
      pill: 'bg-cyan-100 text-cyan-800',
    },
  },
  {
    id: 'cruise-ships',
    title: 'Cruise Ships',
    icon: '🛳️',
    description:
      'Passenger operations and hotel-style service. Unique culture, travel, and long workdays.',
    chips: ['Hospitality', 'Passenger safety', 'Entertainment'],
    href: '/guides/sectors/cruise-ships',
    colorScheme: {
      border: 'border-pink-300',
      bg: 'from-pink-50',
      accent: 'text-pink-700',
      pill: 'bg-pink-100 text-pink-800',
    },
  },
  {
    id: 'yachts',
    title: 'Yachts',
    icon: '🛥️',
    description:
      'Lifestyle-driven sector with big variability. Networking matters. Can be great or chaotic.',
    chips: ['Private', 'Charter', 'Networking', 'High variability'],
    href: '/guides/sectors/yachts',
    colorScheme: {
      border: 'border-yellow-300',
      bg: 'from-yellow-50',
      accent: 'text-yellow-700',
      pill: 'bg-yellow-100 text-yellow-800',
    },
  },
  {
    id: 'fishing-boats',
    title: 'Fishing Boats',
    icon: '🎣',
    description:
      'Hard, seasonal, high-risk work with high upside in the right fisheries. Not for tourists.',
    chips: ['Seasonal', 'High risk', 'High reward'],
    href: '/guides/sectors/fishing-boats',
    colorScheme: {
      border: 'border-orange-400',
      bg: 'from-orange-50',
      accent: 'text-orange-700',
      pill: 'bg-orange-100 text-orange-800',
    },
  },
  {
    id: 'pilots',
    title: 'Pilots',
    icon: '🧑‍✈️',
    description:
      'Local knowledge and shiphandling at the highest level. Not a shortcut, but a serious track.',
    chips: ['Apprenticeship', 'Local waters', 'Competitive'],
    href: '/guides/sectors/pilots',
    colorScheme: {
      border: 'border-indigo-400',
      bg: 'from-indigo-50',
      accent: 'text-indigo-700',
      pill: 'bg-indigo-100 text-indigo-800',
    },
    size: 'wide', // Emphasizes prestige/uniqueness
  },
];

// Helper to organize sectors into waves for scroll reveal
export const sectorWaves = [
  sectors.slice(0, 4),   // Wave 1: Government, Deep Sea, Oil Rigs, OSV
  sectors.slice(4, 8),   // Wave 2: Tugs, Barges, Ferries, Cruise
  sectors.slice(8, 11),  // Wave 3: Yachts, Fishing, Pilots
];