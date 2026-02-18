import { MetadataRoute } from 'next';
import fs from 'fs';
import path from 'path';

const BASE_URL = 'https://civsail.com';

/**
 * Generate a dynamic sitemap for all public CIVSail pages.
 * Covers: static pages, ports, ships, tools, editorials, maritime-101, and neo-help.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // --- Static pages ---
  const staticRoutes = [
    { path: '/', priority: 1.0, changeFrequency: 'weekly' as const },
    { path: '/about', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/tools', priority: 0.9, changeFrequency: 'monthly' as const },
    { path: '/tools/ship-pay-calculator', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/tools/leave-chit', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/tools/travel-claim', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/tools/pay-comparison', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/editorials', priority: 0.8, changeFrequency: 'weekly' as const },
    { path: '/financial', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/retirement', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/common-requests', priority: 0.6, changeFrequency: 'monthly' as const },
    { path: '/guides/careers-and-sectors', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/guides/credentials-training-renewal', priority: 0.7, changeFrequency: 'monthly' as const },
  ];

  // --- Maritime 101 ---
  const maritime101Routes = [
    '/maritime-101',
    '/maritime-101/what-is-merchant-marine',
    '/maritime-101/careers-and-sectors',
    '/maritime-101/credentials',
    '/maritime-101/life-at-sea',
    '/maritime-101/training-and-entry',
    '/maritime-101/training-and-entry/academy',
    '/maritime-101/training-and-entry/hawsepipe',
    '/maritime-101/training-and-entry/military',
    '/maritime-101/sectors/barges',
    '/maritime-101/sectors/commercial-deep-sea',
    '/maritime-101/sectors/cruise-ships',
    '/maritime-101/sectors/ferries',
    '/maritime-101/sectors/fishing',
    '/maritime-101/sectors/government',
    '/maritime-101/sectors/offshore-rigs',
    '/maritime-101/sectors/offshore-supply',
    '/maritime-101/sectors/pilots',
    '/maritime-101/sectors/tugboats',
    '/maritime-101/sectors/yachts',
  ];

  // --- MSC Hub ---
  const mscHubRoutes = [
    '/msc-hub',
    '/msc-hub/neo-help',
    '/msc-hub/forms',
    '/msc-hub/policies',
  ];

  // --- Ships ---
  const shipRoutes = [
    '/ships',
    '/ships/msc',
    '/ships/msc/t-ake',
    '/ships/msc/t-ao',
    '/ships/msc/t-aoe',
    '/ships/msc/t-ah',
    '/ships/msc/t-epf',
    '/ships/msc/t-arc',
    '/ships/msc/t-ars',
    '/ships/msc/lcc',
    '/ships/msc/esb',
    '/ships/msc/as',
  ];

  // --- Ports (dynamically discover all port pages) ---
  const portRoutes = discoverPortRoutes();

  // --- Editorials (read MDX files from content directory) ---
  const editorialRoutes = discoverEditorialRoutes();

  // --- Neo-help articles ---
  const neoHelpRoutes = discoverNeoHelpRoutes();

  // Combine everything
  const entries: MetadataRoute.Sitemap = [];

  // Static pages with custom priority
  for (const route of staticRoutes) {
    entries.push({
      url: `${BASE_URL}${route.path}`,
      lastModified: now,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    });
  }

  // Maritime 101 pages
  for (const route of maritime101Routes) {
    entries.push({
      url: `${BASE_URL}${route}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    });
  }

  // MSC Hub
  for (const route of mscHubRoutes) {
    entries.push({
      url: `${BASE_URL}${route}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    });
  }

  // Ships
  for (const route of shipRoutes) {
    entries.push({
      url: `${BASE_URL}${route}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    });
  }

  // Ports
  for (const route of portRoutes) {
    entries.push({
      url: `${BASE_URL}${route}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    });
  }

  // Editorials
  for (const route of editorialRoutes) {
    entries.push({
      url: `${BASE_URL}${route}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    });
  }

  // Neo-help
  for (const route of neoHelpRoutes) {
    entries.push({
      url: `${BASE_URL}${route}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    });
  }

  return entries;
}

/**
 * Recursively discover all port page.tsx routes under app/ports/
 */
function discoverPortRoutes(): string[] {
  const portsDir = path.join(process.cwd(), 'app', 'ports');
  const routes: string[] = [];

  function walk(dir: string, urlPath: string) {
    if (!fs.existsSync(dir)) return;

    const entries = fs.readdirSync(dir, { withFileTypes: true });

    // If this directory has a page.tsx, it's a route
    if (entries.some((e) => e.isFile() && e.name === 'page.tsx')) {
      routes.push(urlPath);
    }

    // Recurse into subdirectories
    for (const entry of entries) {
      if (entry.isDirectory() && !entry.name.startsWith('[')) {
        walk(path.join(dir, entry.name), `${urlPath}/${entry.name}`);
      }
    }
  }

  walk(portsDir, '/ports');
  return routes;
}

/**
 * Discover editorial series and individual post routes from MDX files
 */
function discoverEditorialRoutes(): string[] {
  const contentDir = path.join(process.cwd(), 'src', 'content', 'editorials');
  const routes: string[] = [];

  if (!fs.existsSync(contentDir)) return routes;

  const seriesDirs = fs.readdirSync(contentDir, { withFileTypes: true });

  for (const seriesDir of seriesDirs) {
    if (!seriesDir.isDirectory()) continue;

    // Add the series page itself
    routes.push(`/editorials/${seriesDir.name}`);

    // Add individual post pages
    const postsDir = path.join(contentDir, seriesDir.name);
    const posts = fs.readdirSync(postsDir).filter((f) => f.endsWith('.mdx'));

    for (const post of posts) {
      const slug = post.replace('.mdx', '');
      routes.push(`/editorials/${seriesDir.name}/${slug}`);
    }
  }

  return routes;
}

/**
 * Discover neo-help article routes from MDX files
 */
function discoverNeoHelpRoutes(): string[] {
  const contentDir = path.join(process.cwd(), 'src', 'content', 'neo-help');
  const routes: string[] = [];

  if (!fs.existsSync(contentDir)) return routes;

  const files = fs.readdirSync(contentDir).filter((f) => f.endsWith('.mdx'));

  for (const file of files) {
    const slug = file.replace('.mdx', '');
    routes.push(`/msc-hub/neo-help/${slug}`);
  }

  return routes;
}
