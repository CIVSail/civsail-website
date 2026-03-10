/**
 * Author Profiles
 * 
 * Defines authors who contribute to CIVSail editorials.
 * Add new authors here and reference them by slug in post frontmatter.
 */

export interface Author {
  slug: string;           // URL-friendly identifier (e.g., "mark-brown")
  name: string;           // Display name
  role: string;           // Title/role shown under name
  bio: string;            // Short bio paragraph
  avatar?: string;        // Path to headshot in /public/authors/ (optional for now)
  twitter?: string;       // Twitter handle without @ (optional)
  linkedin?: string;      // LinkedIn username (optional)
}

export const AUTHORS: Record<string, Author> = {
  'civsail-team': {
    slug: 'civsail-team',
    name: 'CIVSail Editorial Team',
    role: 'CIVSail',
    bio: 'The CIVSail team is dedicated to serving the civilian mariner community with tools, resources, and stories that matter.',
    // TODO: Add team logo/avatar
    // avatar: '/authors/civsail-logo.png',
  },
  'mark-brown': {
  slug: 'mark-brown',
  name: 'Mark Brown',
  role: 'Retirement & Benefits Contributor',
  bio: 'Founder of High3Team.com, Mark Brown has spent over 22 years helping federal employees with complex, non-traditional careers navigate retirement. From High-3 calculations and FERS quirks to military buybacks and TSP strategy, Mark has guided hundreds of retirees, including CIVMARs, through the maze of federal benefits with clarity and care. Mark has personally visited 22 MSC ships, meeting with mariners around the world to help them take control of their post-sea future. Now, he brings that expertise to CIVSail with a monthly column answering your most pressing retirement questions.',
  // TODO: Add Mark's headshot when available
  // avatar: '/authors/mark-brown.jpg',
},
  'alec-schenning': {
    slug: 'alec-schenning',
    name: 'Alec Schenning',
    role: 'Founder, CIVSail',
    bio: 'Alec created CIVSail to build the tools and community he wished existed when he started sailing.',
    // TODO: Add Alec's headshot when available
    // avatar: '/authors/alec-schenning.jpg',
  },
};

// Array of all authors
export const AUTHORS_LIST = Object.values(AUTHORS);

/**
 * Get a single author by their slug
 */
export function getAuthorBySlug(slug: string): Author | undefined {
  return AUTHORS[slug];
}