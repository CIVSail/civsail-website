'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { SectorTile as SectorTileType } from '../data/sectors';

/**
 * SectorTile - Individual sector card with unique visual identity
 * 
 * Each sector has its own color scheme and layout size
 * to create visual variety in the masonry grid
 */

type SectorTileProps = {
  sector: SectorTileType;
  waveIndex: number;    // Which wave this belongs to (for animation)
  indexInWave: number;  // Position within wave (for stagger)
};

export function SectorTile({ sector, waveIndex, indexInWave }: SectorTileProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Animation variants - tiles reveal in horizontal waves
  const tileVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: waveIndex * 0.15 + indexInWave * 0.05, // Wave stagger + tile stagger
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  // Size-specific classes
  const sizeClasses = {
    normal: 'md:col-span-1',
    tall: 'md:col-span-1 md:row-span-2',
    wide: 'md:col-span-2',
  };

  const sizeClass = sizeClasses[sector.size || 'normal'];

  return (
    <motion.div
      variants={tileVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      className={sizeClass}
    >
      <Link
        href={sector.href}
        className={`
          group block h-full
          border-2 ${sector.colorScheme.border}
          bg-gradient-to-br ${sector.colorScheme.bg} to-white
          rounded-xl
          p-6 md:p-8
          transition-all duration-300
          hover:shadow-xl hover:-translate-y-1
          hover:border-opacity-100
        `}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Icon */}
        <div
          className={`text-4xl md:text-5xl mb-4 transition-transform duration-300 ${
            isHovered ? '-translate-y-0.5' : ''
          }`}
        >
          {sector.icon}
        </div>

        {/* Title */}
        <h3
          className={`
            text-xl md:text-2xl font-bold mb-3
            ${sector.colorScheme.accent}
            group-hover:underline
          `}
        >
          {sector.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-slate-600 leading-relaxed mb-4">
          {sector.description}
        </p>

        {/* Chips */}
        {sector.chips && sector.chips.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {sector.chips.slice(0, 5).map((chip) => (
              <span
                key={chip}
                className={`
                  text-xs font-medium px-2 py-1 rounded-full
                  ${sector.colorScheme.pill}
                  transition-transform duration-150
                  hover:scale-105
                `}
              >
                {chip}
              </span>
            ))}
            {sector.chips.length > 5 && (
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-white/60 text-slate-700 border border-slate-200">
                +{sector.chips.length - 5} more
              </span>
            )}
          </div>
        )}

        {/* Learn more indicator */}
        <div className="mt-auto flex items-center gap-2 text-sm font-medium text-slate-700">
          <span>Learn more</span>
          <span
            className={`inline-block transition-transform duration-300 ${
              isHovered ? 'translate-x-1' : ''
            }`}
          >
            →
          </span>
        </div>
      </Link>
    </motion.div>
  );
}