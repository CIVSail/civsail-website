/**
 * @file career-tracks.ts
 * @description Maritime career track enum values and display labels.
 *
 * @purpose Career track is the "intent" layer on top of NMC credential data.
 *          Entry-level credentials (OS, Wiper, Food Handler) span all departments,
 *          so we cannot determine someone's intended career from their NMC record alone.
 *          The user's self-declared track resolves this ambiguity.
 *
 * @note "not_sure" means the user HAS an MMC but hasn't decided their path.
 *       A user without any MMC is handled by the has_mmc = false flag, not by this field.
 *
 * @note Career track is mutable. Users can update it from Settings, and the system will
 *       suggest updates when NMC re-verification reveals new endorsements that don't
 *       match the stored track (e.g., unlicensed_deck user earns a Third Mate license).
 */

export const CAREER_TRACK_VALUES = [
  'licensed_deck',
  'licensed_engine',
  'unlicensed_deck',
  'unlicensed_engine',
  'steward',
  'cadet',
  'not_sure',
  'other',
] as const;

export type CareerTrack = (typeof CAREER_TRACK_VALUES)[number];

export const CAREER_TRACK_LABELS: Record<CareerTrack, string> = {
  licensed_deck: 'Licensed Deck (3rd Mate and up, or working toward it)',
  licensed_engine: 'Licensed Engine (3rd A/E and up, or working toward it)',
  unlicensed_deck: 'Unlicensed Deck (AB, OS)',
  unlicensed_engine: 'Unlicensed Engine (QMED, Wiper, Electrician)',
  steward: 'Steward Department (Chief Steward, Cook, SA)',
  cadet: 'Cadet / Academy Student',
  not_sure: 'Not Sure Yet',
  other: 'Other (Supply Officer, Purser, Radio, etc.)',
};

export const CAREER_TRACK_OPTIONS = CAREER_TRACK_VALUES.map((value) => ({
  value,
  label: CAREER_TRACK_LABELS[value],
}));

/**
 * Cadets are excluded from SSL-based sector-change detection in the future.
 * They sail on many different ship types as part of their training, which is normal
 * and should NOT trigger "did you change jobs?" prompts.
 */
export const CADET_TRACKS: CareerTrack[] = ['cadet'];

export function isCadetTrack(track: string | null | undefined): boolean {
  return CADET_TRACKS.includes(track as CareerTrack);
}
