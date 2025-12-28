/**
 * Editorial Series Configuration
 * 
 * This is the central config for all editorial series on CIVSail.
 * Add new series here and they'll automatically appear on the site.
 */

export interface Series {
  slug: string;
  title: string;
  description: string;
  byline: string;
  bylineAuthorSlug?: string;
  metaDescription: string;
  accentColor: string;
  icon: string;
}

export const SERIES: Record<string, Series> = {
  soundings: {
    slug: 'soundings',
    title: 'Soundings',
    description: 'Essays, reporting, and analysis on maritime life, policy, and the moments that shape careers at sea and ashore.',
    byline: 'By the CIVSail Editorial Team',
    metaDescription: 'In-depth essays and analysis on maritime careers, policy changes, and life at sea from the CIVSail team.',
    accentColor: 'blue',
    icon: 'Waves',
  },
  'final-muster': {
    slug: 'final-muster',
    title: 'The Final Muster',
    description: 'Reflections on retirement, understanding your pay and benefits, transition, and life after sailing.',
    byline: 'By Mark Brown',
    bylineAuthorSlug: 'mark-brown',
    metaDescription: 'Expert guidance on maritime retirement, benefits, and transitioning from a career at sea.',
    accentColor: 'amber',
    icon: 'Anchor',
  },
  profiles: {
    slug: 'profiles',
    title: 'Mariner Profiles',
    description: 'Career stories and lessons learned from across the maritime world.',
    byline: 'Career Spotlights',
    metaDescription: 'Inspiring career stories and hard-won lessons from civilian mariners across the fleet.',
    accentColor: 'emerald',
    icon: 'Users',
  },
};

export const SERIES_LIST = Object.values(SERIES);

/**
 * Get a single series by its URL slug
 */
export function getSeriesBySlug(slug: string): Series | undefined {
  return SERIES[slug];
}

/**
 * Generate static params for all series
 * Used by Next.js generateStaticParams() in [series]/page.tsx
 */
export function getAllSeriesParams(): { series: string }[] {
  return Object.keys(SERIES).map((slug) => ({ series: slug }));
}