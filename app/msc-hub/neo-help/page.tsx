/**
 * @file page.tsx
 * @description NEO & New Mariner Help landing page with vertical timeline
 *
 * @purpose Guide new MSC employees through their first 6 months — from getting
 *          a NEO date to arriving at their first ship.
 */

import { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, GraduationCap, Ship, MapPin, Anchor } from 'lucide-react';
import { NeoDisclaimer, NeoTimeline, ArticleGrid } from '@/components/neo';

export const metadata: Metadata = {
  title: 'NEO & New Mariner Help | CIVSail',
  description:
    'Your complete guide to the first 6 months at MSC. From NEO orientation to your first ship assignment, we explain everything you need to know.',
  openGraph: {
    title: 'NEO & New Mariner Help | CIVSail',
    description:
      'Your complete guide to the first 6 months at MSC. From NEO orientation to your first ship assignment.',
    url: 'https://civsail.com/msc-hub/neo-help',
  },
  alternates: {
    canonical: 'https://civsail.com/msc-hub/neo-help',
  },
};

export default function NeoHelpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
      {/* Hero Section */}
      <div className="border-b border-white/10 bg-black/20">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-2 text-sm text-slate-400">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/msc-hub" className="hover:text-white transition-colors">
              MSC Hub
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-white">NEO & New Mariner Help</span>
          </nav>

          {/* Title section */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-500/20 px-4 py-2 text-blue-400">
                <GraduationCap className="h-5 w-5" />
                <span className="font-medium">New Employee Guide</span>
              </div>
              <h1 className="text-4xl font-bold text-white md:text-5xl">
                NEO & New Mariner Help
              </h1>
              <p className="mt-4 max-w-2xl text-lg text-slate-300">
                Your first 6 months at MSC, explained. From getting your NEO date
                to stepping aboard your first ship, we&apos;ll guide you through
                every step.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Disclaimer */}
        <div className="mb-12">
          <NeoDisclaimer />
        </div>

        {/* Timeline */}
        <div className="mb-16">
          <NeoTimeline />
        </div>

        {/* Divider */}
        <div className="mb-12 border-t border-white/10" />

        {/* All Articles Grid */}
        <div className="mb-16">
          <ArticleGrid />
        </div>

        {/* Additional Resources / CTA Section */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-8">
          <h2 className="text-xl font-bold text-white mb-4">
            Ready for Your First Ship?
          </h2>
          <p className="text-slate-300 mb-6">
            Explore our ship guides and port information to prepare for wherever
            MSC sends you.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/ships"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-500"
            >
              <Ship className="h-5 w-5" />
              Explore Ships
            </Link>
            <Link
              href="/ports"
              className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-6 py-3 font-medium text-white transition-colors hover:bg-white/10"
            >
              <MapPin className="h-5 w-5" />
              Port Guides
            </Link>
          </div>
        </div>

        {/* Footer message */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 text-slate-400">
            <Anchor className="h-5 w-5" />
            <span>Good luck on your maritime journey!</span>
          </div>
        </div>
      </div>
    </div>
  );
}
