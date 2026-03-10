/**
 * @file sectors.ts
 * @description Maritime sector enum values and display labels for the CIVSail platform.
 *
 * @purpose The sector field is how CIVSail determines which tools, tabs, and content
 *          are relevant to a given user. MSC CIVMARs get Leave Chit and Travel Claim
 *          access; commercial mariners do not. This is the authoritative source for
 *          all sector values. Never use free-text for sector — always use these enums.
 *
 * @note Sector is mutable. Users can change it from Settings. All UI that shows/hides
 *       features based on sector should respond to changes dynamically.
 */

export const SECTOR_VALUES = [
  'civmar',
  'conmar',
  'noaa',
  'commercial_deep_sea',
  'offshore_rigs',
  'offshore_supply',
  'tugboats',
  'barges',
  'ferries',
  'cruise',
  'yachts',
  'fishing',
  'pilots',
  'not_sailing',
] as const;

export type Sector = (typeof SECTOR_VALUES)[number];

export const SECTOR_LABELS: Record<Sector, string> = {
  civmar: 'Military Sealift Command (CIVMAR)',
  conmar: 'MSC Contractor (CONMAR)',
  noaa: 'NOAA Corps',
  commercial_deep_sea: 'Commercial Deep Sea',
  offshore_rigs: 'Offshore Oil Rigs',
  offshore_supply: 'Offshore Supply Vessels',
  tugboats: 'Tug Boats',
  barges: 'Barges',
  ferries: 'Ferries',
  cruise: 'Cruise Ships',
  yachts: 'Yachts',
  fishing: 'Fishing Boats',
  pilots: 'Pilots',
  not_sailing: 'Not Currently Sailing / Exploring',
};

export const SECTOR_OPTIONS = SECTOR_VALUES.map((value) => ({
  value,
  label: SECTOR_LABELS[value],
}));

/**
 * Sectors that unlock MSC-specific tools (Leave Chit Generator, Travel Claim Calculator).
 * CONMARs may get access in the future — add 'conmar' here when that's ready.
 */
export const MSC_SECTORS: Sector[] = ['civmar'];

/**
 * Whether a given sector should see MSC-specific tools and content.
 */
export function isMscSector(sector: string | null | undefined): boolean {
  return MSC_SECTORS.includes(sector as Sector);
}

/**
 * Sectors that require the Department field during onboarding.
 */
export const SECTORS_WITH_DEPARTMENT: Sector[] = ['civmar'];

/**
 * Sectors that show the Contracting Company field during onboarding.
 */
export const SECTORS_WITH_COMPANY: Sector[] = ['conmar'];
