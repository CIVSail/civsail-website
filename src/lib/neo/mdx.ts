/**
 * @file mdx.ts
 * @description MDX content utilities for NEO Help articles
 *
 * Functions to read, parse, and query NEO help articles from MDX files.
 * Articles live in src/content/neo-help/{slug}.mdx
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';

// Path to MDX content directory
const CONTENT_DIR = path.join(process.cwd(), 'src/content/neo-help');

/**
 * Frontmatter shape for NEO help articles
 */
export interface NeoArticleFrontmatter {
  title: string;
  description: string;
  timelineSection?: number;
  timelineSections?: number[];
  status: 'published' | 'coming-soon';
  coverImage?: string;
}

/**
 * Full article object with content and computed fields
 */
export interface NeoArticle {
  slug: string;
  frontmatter: NeoArticleFrontmatter;
  content: string;
  readingTime: string;
}

/**
 * Get all NEO help articles
 */
export function getAllNeoArticles(): NeoArticle[] {
  // Return empty array if directory doesn't exist yet
  if (!fs.existsSync(CONTENT_DIR)) {
    return [];
  }

  const files = fs.readdirSync(CONTENT_DIR).filter((file) => file.endsWith('.mdx'));

  const articles = files
    .map((filename) => {
      const filePath = path.join(CONTENT_DIR, filename);
      const fileContent = fs.readFileSync(filePath, 'utf-8');

      const { data, content } = matter(fileContent);
      const frontmatter = data as NeoArticleFrontmatter;

      return {
        slug: filename.replace('.mdx', ''),
        frontmatter,
        content,
        readingTime: readingTime(content).text,
      };
    });

  return articles;
}

/**
 * Get a single article by slug
 */
export function getNeoArticleBySlug(slug: string): NeoArticle | null {
  const filePath = path.join(CONTENT_DIR, `${slug}.mdx`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(fileContent);
  const frontmatter = data as NeoArticleFrontmatter;

  return {
    slug,
    frontmatter,
    content,
    readingTime: readingTime(content).text,
  };
}

/**
 * Get articles for a specific timeline section
 */
export function getNeoArticlesBySection(sectionId: number): NeoArticle[] {
  return getAllNeoArticles().filter((article) => {
    const { timelineSection, timelineSections } = article.frontmatter;

    if (timelineSections) {
      return timelineSections.includes(sectionId);
    }
    return timelineSection === sectionId;
  });
}

/**
 * Get all published articles
 */
export function getPublishedNeoArticles(): NeoArticle[] {
  return getAllNeoArticles().filter(
    (article) => article.frontmatter.status === 'published'
  );
}

/**
 * Get all article slugs for static generation
 */
export function getAllNeoArticleSlugs(): string[] {
  return getAllNeoArticles().map((article) => article.slug);
}

/**
 * Get timeline sections for an article
 * Normalizes timelineSection and timelineSections into a single array
 */
export function getArticleTimelineSections(article: NeoArticle): number[] {
  const { timelineSection, timelineSections } = article.frontmatter;

  if (timelineSections) {
    return timelineSections;
  }
  if (timelineSection) {
    return [timelineSection];
  }
  return [];
}
