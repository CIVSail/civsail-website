/**
 * MDX Content Utilities
 * 
 * Functions to read, parse, and query editorial posts from MDX files.
 * Posts live in src/content/editorials/{series}/{slug}.mdx
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';
import { SERIES } from './series';

// Path to MDX content directory
const CONTENT_DIR = path.join(process.cwd(), 'src/content/editorials');

/**
 * Frontmatter shape for editorial posts
 * This is the metadata at the top of each MDX file between the --- lines
 */
export interface PostFrontmatter {
  title: string;          // Post title
  description: string;    // Short summary for cards and SEO
  date: string;           // Publication date as ISO string: "2024-01-15"
  author: string;         // Author slug (must match key in authors.ts)
  coverImage?: string;    // Optional path to cover image
  tags?: string[];        // Optional tags for categorization
  featured?: boolean;     // Optional flag to highlight on homepage
  draft?: boolean;        // Set true to hide from production
}

/**
 * Full post object with content and computed fields
 */
export interface Post {
  slug: string;                   // URL slug derived from filename
  series: string;                 // Series slug (soundings, final-muster, profiles)
  frontmatter: PostFrontmatter;   // Metadata from MDX frontmatter
  content: string;                // Raw MDX content (without frontmatter)
  readingTime: string;            // Computed reading time (e.g., "5 min read")
}

/**
 * Get all posts for a specific series
 * Returns posts sorted by date (newest first)
 */
export function getPostsBySeries(seriesSlug: string): Post[] {
  const seriesDir = path.join(CONTENT_DIR, seriesSlug);

  // Return empty array if series directory doesn't exist yet
  if (!fs.existsSync(seriesDir)) {
    return [];
  }

  // Get all .mdx files in the series folder
  const files = fs.readdirSync(seriesDir).filter((file) => file.endsWith('.mdx'));

  const posts = files
    .map((filename) => {
      const filePath = path.join(seriesDir, filename);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      
      // Parse frontmatter and content
      const { data, content } = matter(fileContent);
      const frontmatter = data as PostFrontmatter;

      // Skip drafts in production
      if (frontmatter.draft && process.env.NODE_ENV === 'production') {
        return null;
      }

      return {
        slug: filename.replace('.mdx', ''),
        series: seriesSlug,
        frontmatter,
        content,
        readingTime: readingTime(content).text,
      };
    })
    .filter((post): post is Post => post !== null);

  // Sort by date, newest first
  return posts.sort(
    (a, b) => new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime()
  );
}

/**
 * Get a single post by series and slug
 * Returns null if post doesn't exist
 */
export function getPostBySlug(seriesSlug: string, postSlug: string): Post | null {
  const filePath = path.join(CONTENT_DIR, seriesSlug, `${postSlug}.mdx`);

  // Return null if file doesn't exist
  if (!fs.existsSync(filePath)) {
    return null;
  }

  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(fileContent);
  const frontmatter = data as PostFrontmatter;

  return {
    slug: postSlug,
    series: seriesSlug,
    frontmatter,
    content,
    readingTime: readingTime(content).text,
  };
}

/**
 * Get all posts across all series
 * Useful for sitemaps, RSS feeds, and global search
 */
export function getAllPosts(): Post[] {
  const allPosts: Post[] = [];

  // Loop through each series and collect posts
  Object.keys(SERIES).forEach((seriesSlug) => {
    const seriesPosts = getPostsBySeries(seriesSlug);
    allPosts.push(...seriesPosts);
  });

  // Sort by date, newest first
  return allPosts.sort(
    (a, b) => new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime()
  );
}

/**
 * Get featured posts for homepage highlights
 */
export function getFeaturedPosts(limit = 3): Post[] {
  return getAllPosts()
    .filter((post) => post.frontmatter.featured)
    .slice(0, limit);
}

/**
 * Get most recent posts across all series
 */
export function getRecentPosts(limit = 6): Post[] {
  return getAllPosts().slice(0, limit);
}

/**
 * Generate static params for all posts
 * Used by Next.js generateStaticParams() in [series]/[slug]/page.tsx
 */
export function getAllPostParams(): { series: string; slug: string }[] {
  return getAllPosts().map((post) => ({
    series: post.series,
    slug: post.slug,
  }));
}

/**
 * Generate static params for all series
 * Used by Next.js generateStaticParams() in [series]/page.tsx
 */
export function getAllSeriesParams(): { series: string }[] {
  return Object.keys(SERIES).map((slug) => ({ series: slug }));
}