'use client';

import Link from 'next/link';
import { useState } from 'react';
import { CareerTile as CareerTileType } from '../data/careers';

/**
 * CareerTile - Individual clickable career card
 * 
 * Designed to work within CareerPair for the paired layout,
 * or standalone for "Other Positions"
 */

type CareerTileProps = {
  tile: CareerTileType;
  track?: 'deck' | 'engine' | 'other';
  isPaired?: boolean; // Used in a pair (affects hover behavior)
};

// Color schemes for different tracks
const trackColors = {
  deck: {
    hover: 'hover:border-blue-200 hover:bg-blue-50',
    accent: 'text-blue-700',
  },
  engine: {
    hover: 'hover:border-amber-200 hover:bg-amber-50',
    accent: 'text-amber-700',
  },
  other: {
    hover: 'hover:border-slate-200 hover:bg-slate-50',
    accent: 'text-slate-700',
  },
};

export function CareerTile({ tile, track = 'other', isPaired = false }: CareerTileProps) {
  const [isHovered, setIsHovered] = useState(false);
  const colors = trackColors[track];

  return (
    <Link
      href={tile.href}
      className={`
        block group relative
        ${isPaired ? '' : 'rounded-2xl border-2 border-slate-200'}
        p-6 md:p-8
        transition-all duration-300
        hover:shadow-lg hover:-translate-y-0.5
        ${colors.hover}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Icon */}
      <div
        className={`text-5xl md:text-6xl mb-4 transition-transform duration-300 ${
          isHovered ? '-translate-y-1' : ''
        }`}
      >
        {tile.icon}
      </div>

      {/* Title */}
      <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3 group-hover:underline">
        {tile.title}
      </h3>

      {/* Description */}
      <p className="text-base text-slate-600 leading-relaxed mb-4">
        {tile.description}
      </p>

      {/* Progression hint */}
      <p className={`text-sm italic ${colors.accent} mt-4`}>
        {tile.progression}
      </p>

      {/* Hover arrow indicator */}
      <div className="mt-6 flex items-center gap-2 text-sm font-medium text-slate-700">
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
  );
}