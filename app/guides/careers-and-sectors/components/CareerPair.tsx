'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CareerPairData } from '../data/careers';
import { CareerTile } from './CareerTile';

/**
 * CareerPair - Paired layout for Officer ⟷ Unlicensed careers
 * 
 * Creates a unified visual block with shared container to teach
 * that these are two sides of the same career track
 */

type CareerPairProps = {
  data: CareerPairData;
  index: number; // For stagger animation
};

// Stagger animation variants - Fixed type issues
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // Officer tile → Unlicensed tile stagger
    },
  },
};

const tileVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut" as const,
    },
  },
};

export function CareerPair({ data, index }: CareerPairProps) {
  const [hoveredSide, setHoveredSide] = useState<'officer' | 'unlicensed' | null>(null);

  // Track-specific colors
  const trackColors = {
    deck: {
      label: 'text-blue-600',
      border: 'border-slate-200',
    },
    engine: {
      label: 'text-amber-600',
      border: 'border-slate-200',
    },
  };

  const colors = trackColors[data.track];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      className="group"
    >
      {/* Track label above the pair */}
      <div className="mb-3">
        <span
          className={`text-xs uppercase tracking-widest font-semibold ${colors.label}`}
        >
          {data.trackLabel}
        </span>
      </div>

      {/* Paired container */}
      <div
        className={`
          border-2 ${colors.border}
          rounded-2xl
          bg-slate-50/30
          overflow-hidden
          hover:shadow-lg
          transition-shadow duration-300
        `}
      >
        <div className="grid md:grid-cols-2">
          {/* Left: Officer */}
          <motion.div
            variants={tileVariants}
            className="relative"
            onMouseEnter={() => setHoveredSide('officer')}
            onMouseLeave={() => setHoveredSide(null)}
            style={{
              opacity: hoveredSide === 'unlicensed' ? 0.85 : 1,
              transition: 'opacity 200ms ease',
            }}
          >
            <CareerTile
              tile={data.officerTile}
              track={data.track}
              isPaired
            />
          </motion.div>

          {/* Vertical divider (hidden on mobile) */}
          <div className="hidden md:block absolute top-0 bottom-0 left-1/2 w-px bg-slate-200" />

          {/* Right: Unlicensed */}
          <motion.div
            variants={tileVariants}
            className="relative border-t-2 md:border-t-0 md:border-l-2 border-slate-200"
            onMouseEnter={() => setHoveredSide('unlicensed')}
            onMouseLeave={() => setHoveredSide(null)}
            style={{
              opacity: hoveredSide === 'officer' ? 0.85 : 1,
              transition: 'opacity 200ms ease',
            }}
          >
            <CareerTile
              tile={data.unlicensedTile}
              track={data.track}
              isPaired
            />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}