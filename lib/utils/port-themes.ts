/**
 * @file port-themes.ts
 * @description Centralized color theme configuration for port pages
 *
 * @purpose Enable dynamic theming for port pages based on country/region identity.
 *          Each theme uses colors inspired by national flags or regional character.
 *          This avoids the monotony of identical blue gradients across all ports.
 *
 * @example
 * import { getPortTheme } from '@/lib/utils/port-themes';
 * const theme = getPortTheme('djibouti');
 * // Returns: { heroGradient: 'from-sky-900 via-emerald-800...', accent: 'sky-600', ... }
 */

export interface PortTheme {
  /** Tailwind gradient classes for hero section background */
  heroGradient: string;

  /** Primary accent color for buttons, links, highlights (e.g., 'sky-600') */
  accent: string;

  /** Secondary color for cards, badges, alternate elements (e.g., 'emerald-500') */
  secondary: string;

  /** Text color for hero section (typically 'white' for dark gradients) */
  heroText: string;
}

/**
 * Port theme configuration by country/region slug
 *
 * Africa region themes are based on national flag colors:
 * - Djibouti: Light blue + green (flag colors)
 * - Ghana: Red + gold + green (flag tricolor)
 * - Nigeria: Green dominant (flag colors)
 * - South Africa: Blue + green + yellow (multicolor flag)
 * - Sudan: Red + black + green (flag tricolor)
 * - Africa (default): Earthy amber/orange (continental warmth)
 *
 * Future regions can be added here following the same pattern.
 */
export const PORT_THEMES: Record<string, PortTheme> = {
  // ===== AFRICA REGION =====

  // Djibouti flag: light blue, green, white, red star
  'djibouti': {
    heroGradient: 'from-sky-900 via-emerald-800 to-sky-900',
    accent: 'sky-600',
    secondary: 'emerald-500',
    heroText: 'white',
  },

  // Ghana flag: red, gold, green, black star
  'ghana': {
    heroGradient: 'from-red-900 via-yellow-700 to-green-900',
    accent: 'yellow-600',
    secondary: 'green-600',
    heroText: 'white',
  },

  // Nigeria flag: green, white, green
  'nigeria': {
    heroGradient: 'from-green-900 via-green-800 to-emerald-900',
    accent: 'green-600',
    secondary: 'emerald-500',
    heroText: 'white',
  },

  // South Africa flag: multicolor - using dominant blue/green/yellow
  'south-africa': {
    heroGradient: 'from-blue-900 via-green-800 to-yellow-900',
    accent: 'green-600',
    secondary: 'yellow-500',
    heroText: 'white',
  },

  // Sudan flag: red, white, black, green triangle
  'sudan': {
    heroGradient: 'from-red-900 via-slate-800 to-green-900',
    accent: 'red-600',
    secondary: 'green-600',
    heroText: 'white',
  },

  // Africa region default (earthy, warm tones)
  'africa': {
    heroGradient: 'from-amber-900 via-orange-800 to-yellow-900',
    accent: 'amber-600',
    secondary: 'orange-500',
    heroText: 'white',
  },

  // ===== EUROPE REGION =====

  // Spain flag: red, yellow, red
  'spain': {
    heroGradient: 'from-red-900 via-yellow-700 to-red-900',
    accent: 'red-600',
    secondary: 'yellow-500',
    heroText: 'white',
  },

  // Greece flag: blue and white stripes
  'greece': {
    heroGradient: 'from-blue-900 via-blue-800 to-sky-900',
    accent: 'blue-600',
    secondary: 'sky-500',
    heroText: 'white',
  },

  // Italy flag: green, white, red
  'italy': {
    heroGradient: 'from-green-900 via-slate-700 to-red-900',
    accent: 'green-600',
    secondary: 'red-500',
    heroText: 'white',
  },

  // Croatia flag: red, white, blue with checkerboard
  'croatia': {
    heroGradient: 'from-red-900 via-blue-800 to-red-900',
    accent: 'red-600',
    secondary: 'blue-500',
    heroText: 'white',
  },

  // Slovenia flag: white, blue, red with coat of arms
  'slovenia': {
    heroGradient: 'from-blue-900 via-slate-700 to-red-900',
    accent: 'blue-600',
    secondary: 'red-500',
    heroText: 'white',
  },

  // UK flag: red, white, blue (Union Jack)
  'uk': {
    heroGradient: 'from-blue-950 via-red-900 to-blue-950',
    accent: 'blue-600',
    secondary: 'red-500',
    heroText: 'white',
  },

  // Scotland flag: blue with white saltire
  'scotland': {
    heroGradient: 'from-blue-900 via-blue-800 to-indigo-900',
    accent: 'blue-600',
    secondary: 'sky-400',
    heroText: 'white',
  },

  // Sweden flag: blue with yellow cross
  'sweden': {
    heroGradient: 'from-blue-900 via-yellow-700 to-blue-900',
    accent: 'blue-600',
    secondary: 'yellow-500',
    heroText: 'white',
  },

  // Germany flag: black, red, gold
  'germany': {
    heroGradient: 'from-slate-900 via-red-900 to-yellow-800',
    accent: 'red-600',
    secondary: 'yellow-500',
    heroText: 'white',
  },

  // Norway flag: red with blue cross outlined in white
  'norway': {
    heroGradient: 'from-red-900 via-blue-800 to-red-900',
    accent: 'red-600',
    secondary: 'blue-500',
    heroText: 'white',
  },

  // Poland flag: white and red
  'poland': {
    heroGradient: 'from-slate-700 via-red-800 to-red-900',
    accent: 'red-600',
    secondary: 'slate-400',
    heroText: 'white',
  },

  // Europe region default (deep blue/navy, EU inspired)
  'europe': {
    heroGradient: 'from-blue-950 via-indigo-900 to-blue-950',
    accent: 'blue-600',
    secondary: 'indigo-500',
    heroText: 'white',
  },

  // ===== UNITED STATES REGION =====

  // USA - Red, white, blue (American flag inspired)
  'united-states': {
    heroGradient: 'from-blue-950 via-red-900 to-blue-950',
    accent: 'blue-600',
    secondary: 'red-500',
    heroText: 'white',
  },

  // Virginia - Navy blue (naval heritage)
  'virginia': {
    heroGradient: 'from-blue-950 via-blue-900 to-indigo-950',
    accent: 'blue-600',
    secondary: 'indigo-500',
    heroText: 'white',
  },

  // New Jersey - Buff/yellow and blue (state colors)
  'new-jersey': {
    heroGradient: 'from-blue-900 via-yellow-800 to-blue-900',
    accent: 'blue-600',
    secondary: 'yellow-500',
    heroText: 'white',
  },

  // California - Blue and gold (state colors)
  'california': {
    heroGradient: 'from-blue-900 via-yellow-700 to-blue-900',
    accent: 'blue-600',
    secondary: 'yellow-500',
    heroText: 'white',
  },

  // Alabama - Crimson red (state identity)
  'alabama': {
    heroGradient: 'from-red-950 via-red-900 to-rose-950',
    accent: 'red-600',
    secondary: 'rose-500',
    heroText: 'white',
  },

  // South Carolina - Indigo blue and palmetto (state flag)
  'south-carolina': {
    heroGradient: 'from-indigo-950 via-indigo-900 to-blue-950',
    accent: 'indigo-600',
    secondary: 'blue-500',
    heroText: 'white',
  },

  // Pennsylvania - Blue and gold (state colors)
  'pennsylvania': {
    heroGradient: 'from-blue-950 via-yellow-800 to-blue-950',
    accent: 'blue-600',
    secondary: 'yellow-500',
    heroText: 'white',
  },

  // Washington - Green (Pacific Northwest evergreen)
  'washington': {
    heroGradient: 'from-green-950 via-emerald-900 to-green-950',
    accent: 'green-600',
    secondary: 'emerald-500',
    heroText: 'white',
  },

  // ===== FAR EAST REGION (for reference/future use) =====

  'japan': {
    heroGradient: 'from-red-900 via-rose-800 to-red-900',
    accent: 'red-600',
    secondary: 'rose-500',
    heroText: 'white',
  },

  'south-korea': {
    heroGradient: 'from-blue-900 via-red-800 to-blue-900',
    accent: 'blue-600',
    secondary: 'red-500',
    heroText: 'white',
  },

  'singapore': {
    heroGradient: 'from-red-900 via-slate-800 to-red-900',
    accent: 'red-600',
    secondary: 'slate-500',
    heroText: 'white',
  },

  'far-east': {
    heroGradient: 'from-emerald-600 via-teal-600 to-cyan-800',
    accent: 'teal-600',
    secondary: 'cyan-500',
    heroText: 'white',
  },

  // ===== FALLBACK =====

  'default': {
    heroGradient: 'from-blue-900 via-slate-800 to-blue-900',
    accent: 'blue-600',
    secondary: 'slate-500',
    heroText: 'white',
  },
};

/**
 * Get theme configuration for a specific country or region
 *
 * @param countrySlug - The country or region slug (e.g., 'djibouti', 'ghana', 'africa')
 * @returns PortTheme object with gradient and color classes
 *
 * @example
 * const theme = getPortTheme('south-africa');
 * // theme.heroGradient = 'from-blue-900 via-green-800 to-yellow-900'
 * // theme.accent = 'green-600'
 */
export function getPortTheme(countrySlug: string): PortTheme {
  return PORT_THEMES[countrySlug] || PORT_THEMES['default'];
}

/**
 * Get gradient class string for use in className prop
 *
 * @param countrySlug - The country or region slug
 * @returns Complete gradient class string (e.g., 'bg-gradient-to-br from-sky-900 via-emerald-800 to-sky-900')
 *
 * @example
 * <div className={getGradientClass('djibouti')}>...</div>
 */
export function getGradientClass(countrySlug: string): string {
  const theme = getPortTheme(countrySlug);
  return `bg-gradient-to-br ${theme.heroGradient}`;
}

/**
 * Get accent color class for buttons, links, etc.
 *
 * @param countrySlug - The country or region slug
 * @param property - CSS property to apply color to (default: 'bg')
 * @returns Color class string (e.g., 'bg-sky-600', 'text-sky-600', 'border-sky-600')
 *
 * @example
 * <button className={getAccentClass('djibouti', 'bg')}>Click me</button>
 * // Returns: 'bg-sky-600'
 */
export function getAccentClass(countrySlug: string, property: 'bg' | 'text' | 'border' = 'bg'): string {
  const theme = getPortTheme(countrySlug);
  return `${property}-${theme.accent}`;
}

/**
 * Get secondary color class for cards, badges, etc.
 *
 * @param countrySlug - The country or region slug
 * @param property - CSS property to apply color to (default: 'bg')
 * @returns Color class string (e.g., 'bg-emerald-500')
 *
 * @example
 * <div className={getSecondaryClass('djibouti', 'border')}>...</div>
 * // Returns: 'border-emerald-500'
 */
export function getSecondaryClass(countrySlug: string, property: 'bg' | 'text' | 'border' = 'bg'): string {
  const theme = getPortTheme(countrySlug);
  return `${property}-${theme.secondary}`;
}
