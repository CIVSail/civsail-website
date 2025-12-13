'use client';

import { CareerPair } from './CareerPair';
import { CareerTile } from './CareerTile';
import { ScrollReveal } from './ScrollReveal';
import { careerPairs, otherPositions } from '../data/careers';

/**
 * CareersSection - Main section for "What You Do Onboard"
 * 
 * Layout:
 * - Paired career tiles (Officer ⟷ Unlicensed)
 * - Standalone "Other Positions" tile
 * - Educational note about careers vs sectors
 */

export function CareersSection() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <ScrollReveal variant="fadeIn" className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="text-4xl">🧑‍🔧</span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900">
              Careers
            </h2>
          </div>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Pick the onboard role that matches your interests. Each track has
            different credentials, lifestyle, and upgrade paths.
          </p>
        </ScrollReveal>

        {/* Career pairs */}
        <div className="max-w-6xl mx-auto space-y-8 mb-8">
          {careerPairs.map((pair, index) => (
            <CareerPair key={pair.track} data={pair} index={index} />
          ))}
        </div>

        {/* Other Positions (standalone) */}
        <ScrollReveal variant="fadeUp" delay={0.4} className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-r from-slate-50 to-white rounded-2xl border-2 border-slate-200">
            <CareerTile tile={otherPositions} track="other" />
          </div>
        </ScrollReveal>

        {/* Educational note */}
        <ScrollReveal variant="fadeUp" delay={0.5} className="max-w-4xl mx-auto mt-12">
          <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-6 md:p-8">
            <h3 className="text-xl font-semibold text-blue-900 mb-2">
              Quick note
            </h3>
            <p className="text-blue-800 leading-relaxed">
              Your <strong>career</strong> is the job you do onboard. Your{' '}
              <strong>sector</strong> is the environment you do it in. Same
              license, totally different lifestyle depending on where you sail.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}