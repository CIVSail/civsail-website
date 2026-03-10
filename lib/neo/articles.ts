/**
 * @file articles.ts
 * @description NEO & New Mariner Help timeline sections and article utilities
 *
 * @purpose Centralized data for the NEO timeline page. Article content is loaded
 *          from MDX files in src/content/neo-help/
 */

import {
  getAllNeoArticles,
  getNeoArticleBySlug,
  getArticleTimelineSections,
  type NeoArticle as MdxNeoArticle,
} from '@/lib/neo/mdx';

// Re-export types for convenience
export type { NeoArticle as MdxNeoArticle } from '@/lib/neo/mdx';

export type ArticleStatus = 'published' | 'coming-soon';

/**
 * Simplified article interface for UI components
 * (derived from MDX frontmatter)
 */
export interface NeoArticle {
  slug: string;
  title: string;
  description: string;
  timelineSections: number[];
  status: ArticleStatus;
  readingTime?: string;
}

export interface TimelineSectionData {
  id: number;
  title: string;
  durationBadge: string;
  icon: string;
  content: string;
  articleSlugs: string[];
}

// Timeline sections data (UI/structural - not in MDX)
export const timelineSections: TimelineSectionData[] = [
  {
    id: 1,
    title: 'You Got a NEO Date, Now What?',
    durationBadge: 'Before You Leave',
    icon: '📋',
    content:
      'Preparing for your MSC journey starts before you leave home. Here\'s what you need to know and do before heading to Norfolk.',
    articleSlugs: ['financial-tips', 'what-to-pack'],
  },
  {
    id: 2,
    title: 'At NEO (Week 1)',
    durationBadge: 'Week 1 - Norfolk, VA',
    icon: '📝',
    content:
      "New Employee Orientation takes place at Naval Station Norfolk. This is where you'll complete paperwork, set up benefits, and learn the basics of MSC. Pay attention — it's better to get everything right the first time.",
    articleSlugs: [
      'subsistence-quarters',
      'pay-payroll-dfas',
      'how-to-read-les',
      'ler',
      'rank-structure',
    ],
  },
  {
    id: 3,
    title: 'Resiliency Training (Week 2)',
    durationBadge: 'Week 2 - Norfolk, VA',
    icon: '🧠',
    content:
      "After NEO, you'll complete Resiliency Training in the same building. This program was implemented to improve CIVMAR retention and prepare new hires for success. Topics include maritime culture, mental health, professional communications, and shipboard familiarization. Yes, it feels like high school team-building exercises. Yes, you still have to do it.",
    articleSlugs: [],
  },
  {
    id: 4,
    title: 'TCHR - Training Center Hampton Roads',
    durationBadge: '~1 Month - Williamsburg, VA',
    icon: '🔥',
    content:
      "After resiliency training, you'll be transported to TCHR in Williamsburg, Virginia. Here you'll complete mandatory safety training including basic firefighting, water survival, and other required courses — regardless of what credentials you already hold.",
    articleSlugs: ['training-basics', 'tchr'],
  },
  {
    id: 5,
    title: 'Follow-On Training',
    durationBadge: 'Varies by Rate',
    icon: '📚',
    content:
      'Depending on your rate (job) and choices, you may have additional training after TCHR. This includes rate-specific courses and optional programs like the Surface Rescue Swimmer program.',
    articleSlugs: ['sar-swimmers', 'training-basics'],
  },
  {
    id: 6,
    title: 'The Pool',
    durationBadge: '1 Day - 2 Months',
    icon: '⏳',
    content:
      'After completing training, you\'ll "check into the pool" to await your ship assignment. The pool is in Norfolk, VA or San Diego, CA. Wait times vary from 1 day to 2 months depending on your rate and fleet needs.\n\nYou may have heard about "detailing from home" or the "virtual pool" — these options are still not consistently implemented. If you want to transfer to the San Diego pool from Norfolk, you can, but MSC won\'t pay for your flight and you\'ll need to do it over a weekend to avoid being marked AWOL.',
    articleSlugs: ['the-pool'],
  },
  {
    id: 7,
    title: 'Going to Your First Ship',
    durationBadge: '4-6 Months',
    icon: '🚢',
    content:
      "You won't know your ship or destination until you receive your orders and ticket. Your first assignment will be 4-6 months. Pack for all seasons — your ship could be anywhere in the world. Don't forget steel-toe boots and work clothes.\n\nThis is where the real learning begins. Good luck!",
    articleSlugs: ['esims', 'rank-structure', 'first-ship'],
  },
];

/**
 * Convert MDX article to simplified UI format
 */
function toNeoArticle(mdxArticle: MdxNeoArticle): NeoArticle {
  return {
    slug: mdxArticle.slug,
    title: mdxArticle.frontmatter.title,
    description: mdxArticle.frontmatter.description,
    timelineSections: getArticleTimelineSections(mdxArticle),
    status: mdxArticle.frontmatter.status,
    readingTime: mdxArticle.readingTime,
  };
}

/**
 * Get article by slug (simplified format for UI)
 */
export function getArticleBySlug(slug: string): NeoArticle | undefined {
  const mdxArticle = getNeoArticleBySlug(slug);
  if (!mdxArticle) return undefined;
  return toNeoArticle(mdxArticle);
}

/**
 * Get full article with MDX content by slug
 */
export function getFullArticleBySlug(slug: string) {
  return getNeoArticleBySlug(slug);
}

/**
 * Get articles for a timeline section
 */
export function getArticlesForSection(sectionId: number): NeoArticle[] {
  const section = timelineSections.find((s) => s.id === sectionId);
  if (!section) return [];

  return section.articleSlugs
    .map((slug) => getArticleBySlug(slug))
    .filter((article): article is NeoArticle => article !== undefined);
}

/**
 * Get all articles (simplified format)
 */
export function getAllArticles(): NeoArticle[] {
  return getAllNeoArticles().map(toNeoArticle);
}

/**
 * Get all published articles
 */
export function getAllPublishedArticles(): NeoArticle[] {
  return getAllArticles().filter((article) => article.status === 'published');
}
