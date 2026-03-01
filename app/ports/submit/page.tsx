/**
 * @file /app/ports/submit/page.tsx
 * @description Standalone port submission page
 *
 * @purpose Lets mariners submit port intel without navigating to a specific
 * port page first. Fetches existing port names for autocomplete suggestions.
 * Dark-themed to match the port section of the site.
 */

import { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { fetchAllPorts } from '@/lib/ports/queries';
import PortSubmissionForm from '@/components/ports/PortSubmissionForm';

export const metadata: Metadata = {
  title: 'Share Port Intel | CIVSail',
  description:
    'Help fellow mariners by sharing your port knowledge. Restaurant tips, local recommendations, transportation, safety info, and more.',
  openGraph: {
    title: 'Share Port Intel | CIVSail',
    description:
      'Help fellow mariners by sharing your firsthand port experience.',
    url: 'https://civsail.com/ports/submit',
  },
  alternates: {
    canonical: 'https://civsail.com/ports/submit',
  },
};

// Revalidate port name suggestions hourly
export const revalidate = 3600;

export default async function PortSubmitPage() {
  const allPorts = await fetchAllPorts();

  // Suggest ports that already have CIVSail pages (not all 3,900+)
  const coveragePorts = allPorts.filter((p) => p.page_status !== 'none');
  const portNames = [
    ...new Set(coveragePorts.map((p) => p.display_name || p.city)),
  ].sort();

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-950 via-slate-900 to-blue-950 relative">
      {/* Dot pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm mb-8">
          <Link
            href="/ports"
            className="text-white/50 hover:text-white/80 transition-colors"
          >
            Ports
          </Link>
          <ChevronRight className="w-4 h-4 text-white/30" />
          <span className="text-white/80">Share Port Intel</span>
        </nav>

        {/* Page header */}
        <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight">
          Share Your Port Knowledge
        </h1>
        <p className="font-body text-lg text-slate-400 mb-10 max-w-xl leading-relaxed">
          Been somewhere? Help the next crew. Your firsthand experience with
          restaurants, bars, transportation, safety, and local tips makes
          CIVSail better for everyone.
        </p>

        {/* Form */}
        <PortSubmissionForm portSuggestions={portNames} />
      </div>
    </main>
  );
}
