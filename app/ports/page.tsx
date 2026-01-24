/**
 * @file /app/ports/page.tsx
 * @description All Ports landing page with interactive 3D globe
 *
 * Displays ~3,900 world ports on an interactive globe with:
 * - Three-tier color coding (full guide, basic page, no page)
 * - Clustering for performance
 * - Search, filter, and fly-to
 * - Fallback list view
 *
 * This is a Server Component that fetches data, with client
 * components for interactivity (globe, search, filter).
 */

import { Metadata } from 'next';
import { Suspense } from 'react';
import { fetchAllPorts, calculateFilterCounts } from '@/lib/ports/queries';
import { PortFilterOption } from '@/types/ports';
import PortsHero from '@/components/ports/PortsHero';
import PortsGlobeSection from '@/components/ports/PortsGlobeSection';
import PortsGlobeLoading from '@/components/ports/PortsGlobeLoading';

// SEO Metadata
export const metadata: Metadata = {
  title: 'World Ports Map | CIVSail',
  description:
    'Explore 3,900+ ports worldwide with our interactive globe. Find port guides, local tips, and information for civilian mariners.',
  openGraph: {
    title: 'Explore World Ports | CIVSail',
    description:
      'Interactive globe with 3,900+ ports. Guides and tips for civilian mariners.',
    images: ['/images/og-ports-globe.png'],
    type: 'website',
    url: 'https://civsail.com/ports',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'World Ports Map | CIVSail',
    description: 'Interactive globe with 3,900+ ports for mariners.',
  },
  alternates: {
    canonical: 'https://civsail.com/ports',
  },
};

// Revalidate every hour (ISR)
export const revalidate = 3600;

interface PageProps {
  searchParams: Promise<{
    filter?: string;
    port?: string;
    view?: string;
  }>;
}

export default async function AllPortsPage({ searchParams }: PageProps) {
  // Fetch all ports from Supabase
  const ports = await fetchAllPorts();

  // Calculate counts for filter UI
  const counts = calculateFilterCounts(ports);

  // Parse URL search params
  const params = await searchParams;

  // Validate filter param (only 'coverage' or 'all' are valid now)
  const validFilters: PortFilterOption[] = ['coverage', 'all'];
  const initialFilter: PortFilterOption = validFilters.includes(
    params.filter as PortFilterOption
  )
    ? (params.filter as PortFilterOption)
    : 'coverage';

  // Port to highlight on load
  const highlightPort = params.port || null;

  // View mode
  const initialView: 'globe' | 'list' =
    params.view === 'list' ? 'list' : 'globe';

  return (
    <main className="min-h-screen bg-slate-900">
      {/* Hero section with title and stats */}
      <PortsHero counts={counts} />

      {/* Globe section with search, filter, and map */}
      <Suspense fallback={<PortsGlobeLoading />}>
        <PortsGlobeSection
          ports={ports}
          counts={counts}
          initialFilter={initialFilter}
          initialHighlight={highlightPort}
          initialView={initialView}
        />
      </Suspense>

      {/* Help text */}
      <section className="max-w-7xl mx-auto px-4 pb-16 text-center">
        <p className="text-slate-500 text-sm">
          Click a port marker to see details • Scroll to zoom • Drag to rotate
        </p>
      </section>
    </main>
  );
}
