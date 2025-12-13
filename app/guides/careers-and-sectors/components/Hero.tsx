'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

/**
 * Hero - Split hero section that immediately teaches the core concept:
 * Careers (what you do) vs Sectors (where you sail)
 */

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white">
      {/* Subtle diagonal texture overlay */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,.1)_50%,transparent_75%,transparent_100%)] bg-[length:60px_60px]" />
      </div>

      <div className="relative container mx-auto px-4 py-16 md:py-24">
        {/* Main title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center mb-12 md:mb-16"
        >
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold tracking-tight mb-4">
            Careers & Sectors
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
            Two fundamental questions about sailing for a living
          </p>
        </motion.div>

        {/* Split concept preview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
          className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto"
        >
          {/* Left: Careers */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 md:p-8 hover:bg-white/10 transition-colors">
            <div className="text-sm uppercase tracking-widest text-blue-200 mb-3 font-semibold">
              Question One
            </div>
            <h2 className="text-2xl md:text-3xl font-semibold mb-4">
              What You Do
            </h2>
            <p className="text-blue-100 mb-6 leading-relaxed">
              Your job onboard. Officer or unlicensed. Deck or engine. Each
              has different credentials and upgrade paths.
            </p>
            <div className="space-y-2 text-sm text-blue-200 opacity-75">
              <div>• Deck Officer</div>
              <div>• Engine Officer</div>
              <div>• Unlicensed Deck</div>
              <div>• Unlicensed Engine</div>
            </div>
          </div>

          {/* Right: Sectors */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 md:p-8 hover:bg-white/10 transition-colors">
            <div className="text-sm uppercase tracking-widest text-blue-200 mb-3 font-semibold">
              Question Two
            </div>
            <h2 className="text-2xl md:text-3xl font-semibold mb-4">
              Where You Sail
            </h2>
            <p className="text-blue-100 mb-6 leading-relaxed">
              The maritime industry you work in. Same license, totally
              different lifestyle depending on where you go.
            </p>
            <div className="space-y-2 text-sm text-blue-200 opacity-75">
              <div>• Government</div>
              <div>• Commercial Deep Sea</div>
              <div>• Offshore</div>
              <div>• Tugs & Barges</div>
            </div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 md:mt-16 text-center"
        >
          <div className="inline-flex flex-col items-center gap-2 text-blue-200">
            <span className="text-sm uppercase tracking-widest">
              Scroll to explore both
            </span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}