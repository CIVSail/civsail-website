/**
 * @file PortsHero.tsx
 * @description Hero section for the All Ports page
 *
 * Displays title, subtitle, and key statistics about port coverage.
 * Styled for dark theme to match the globe visualization.
 */

import { MapPin, Globe, Compass } from 'lucide-react';
import { PortFilterCounts } from '@/types/ports';

interface PortsHeroProps {
  counts: PortFilterCounts;
}

export default function PortsHero({ counts }: PortsHeroProps) {
  return (
    <div className="relative py-12 md:py-16 px-4 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-800 to-slate-900" />

      {/* Subtle pattern overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Content */}
      <div className="relative max-w-7xl mx-auto text-center">
        {/* Title */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
          Explore World Ports
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-slate-400 mb-8 max-w-2xl mx-auto">
          Interactive guide to{' '}
          <span className="text-white font-semibold">
            {counts.total.toLocaleString()}
          </span>{' '}
          ports worldwide for civilian mariners
        </p>

        {/* Stats row */}
        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8">
          {/* Total ports */}
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-full">
            <Globe className="w-5 h-5 text-blue-400" />
            <span className="text-slate-300">
              <span className="font-semibold text-white">
                {counts.total.toLocaleString()}
              </span>{' '}
              total ports
            </span>
          </div>

          {/* CIVSail coverage */}
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-full">
            <MapPin className="w-5 h-5 text-green-400" />
            <span className="text-slate-300">
              <span className="font-semibold text-white">
                {counts.coverage.toLocaleString()}
              </span>{' '}
              with CIVSail coverage
            </span>
          </div>

          {/* Full guides */}
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-full">
            <Compass className="w-5 h-5 text-yellow-400" />
            <span className="text-slate-300">
              <span className="font-semibold text-white">
                {counts.fullGuide.toLocaleString()}
              </span>{' '}
              complete guides
            </span>
          </div>
        </div>

        {/* Encouragement text */}
        {counts.none > 0 && (
          <p className="mt-6 text-sm text-slate-500">
            {counts.none.toLocaleString()} ports need content —{' '}
            <a
              href="mailto:support@civsail.com?subject=Port%20Guide%20Contribution"
              className="text-blue-400 hover:text-blue-300 underline underline-offset-2 transition-colors"
            >
              help us build guides
            </a>
          </p>
        )}
      </div>
    </div>
  );
}
