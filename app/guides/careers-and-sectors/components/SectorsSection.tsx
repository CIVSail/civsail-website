'use client';

import Link from 'next/link';
import { SectorTile } from './SectorTile';
import { ScrollReveal } from './ScrollReveal';
import { sectors, sectorWaves } from '../data/sectors';

/**
 * SectorsSection - Main section for "Where You Sail"
 * 
 * Layout:
 * - Responsive masonry grid
 * - Wave-based scroll reveal animation
 * - CTA to quiz at bottom
 */

export function SectorsSection() {
  return (
    <section className="bg-slate-100 py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <ScrollReveal variant="fadeIn" className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="text-4xl">🗺️</span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900">
              Sectors
            </h2>
          </div>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Pick the part of the maritime world you want to learn about. Each
            sector has different schedules, pay patterns, and career ceilings.
          </p>
        </ScrollReveal>

        {/* Masonry grid */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-fr">
            {sectors.map((sector, index) => {
              // Determine which wave this sector belongs to
              let waveIndex = 0;
              let indexInWave = 0;
              
              for (let i = 0; i < sectorWaves.length; i++) {
                const waveStart = sectorWaves.slice(0, i).reduce((sum, wave) => sum + wave.length, 0);
                if (index >= waveStart && index < waveStart + sectorWaves[i].length) {
                  waveIndex = i;
                  indexInWave = index - waveStart;
                  break;
                }
              }

              return (
                <SectorTile
                  key={sector.id}
                  sector={sector}
                  waveIndex={waveIndex}
                  indexInWave={indexInWave}
                />
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <ScrollReveal variant="fadeUp" delay={0.6} className="max-w-4xl mx-auto mt-12">
          <div className="bg-white border border-slate-200 rounded-xl p-6 md:p-8 text-center shadow-sm">
            <h3 className="text-2xl font-semibold text-slate-900 mb-3">
              Want a recommendation?
            </h3>
            <p className="text-slate-600 leading-relaxed mb-6">
              If you're not sure where you fit, take the homepage quiz and
              we'll point you toward a few sectors that match your goals.
            </p>
            <Link
              href="/#quiz"
              className="inline-block bg-blue-600 text-white font-semibold px-8 py-3 rounded-full hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md"
            >
              Take the Career Quiz
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}