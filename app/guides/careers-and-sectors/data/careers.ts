/**
 * Career track data for CIVSail
 * 
 * Organized into pairs (Officer ⟷ Unlicensed) to teach
 * the fundamental structure of maritime career paths
 */

export type CareerTile = {
  id: string;
  title: string;
  icon: string;
  description: string;
  progression: string; // Hint about career ceiling
  href: string;
};

export type CareerTrack = 'deck' | 'engine';

export type CareerPairData = {
  track: CareerTrack;
  trackLabel: string;
  officerTile: CareerTile;
  unlicensedTile: CareerTile;
};

// ============================================
// DECK TRACK
// ============================================
const deckOfficer: CareerTile = {
  id: 'deck-officer',
  title: 'Deck Officer',
  icon: '🧭',
  description:
    'Navigation, shiphandling, cargo operations, watchstanding, and leadership. The mate-to-master track.',
  progression: '→ Upgrade to Master Unlimited',
  href: '/guides/careers/deck-officer',
};

const unlicensedDeck: CareerTile = {
  id: 'unlicensed-deck',
  title: 'Unlicensed Deck',
  icon: '🪢',
  description:
    'Hands-on deck seamanship, mooring, maintenance, and cargo support. The AB-to-bosun world.',
  progression: '→ Path to Bosun or AB Unlimited',
  href: '/guides/careers/unlicensed-deck',
};

// ============================================
// ENGINE TRACK
// ============================================
const engineOfficer: CareerTile = {
  id: 'engine-officer',
  title: 'Engine Officer',
  icon: '⚙️',
  description:
    'Propulsion systems, power generation, maintenance, and troubleshooting. The assistant-to-chief engineer track.',
  progression: '→ Upgrade to Chief Engineer',
  href: '/guides/careers/engine-officer',
};

const unlicensedEngine: CareerTile = {
  id: 'unlicensed-engine',
  title: 'Unlicensed Engine',
  icon: '🔧',
  description:
    'Mechanical support, rounds, oiling, and repairs. The QMED/oiler path into engineering.',
  progression: '→ Path to QMED ratings',
  href: '/guides/careers/unlicensed-engine',
};

// ============================================
// CAREER PAIRS
// ============================================
export const careerPairs: CareerPairData[] = [
  {
    track: 'deck',
    trackLabel: 'DECK TRACK',
    officerTile: deckOfficer,
    unlicensedTile: unlicensedDeck,
  },
  {
    track: 'engine',
    trackLabel: 'ENGINE TRACK',
    officerTile: engineOfficer,
    unlicensedTile: unlicensedEngine,
  },
];

// ============================================
// OTHER POSITIONS (standalone)
// ============================================
export const otherPositions: CareerTile = {
  id: 'other-positions',
  title: 'Other Positions',
  icon: '📦',
  description:
    'Supply, purser/admin, radio operators, steward department, and specialty roles. Some exist only in certain sectors.',
  progression: '→ Sector-specific career paths',
  href: '/guides/careers/other-positions',
};