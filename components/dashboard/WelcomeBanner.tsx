/**
 * @file WelcomeBanner.tsx
 * @description Sector-aware welcome banner shown at the top of the dashboard.
 *
 * @purpose Orients the user by confirming their sector identity and surfacing
 *          the most relevant tools for that sector. MSC CIVMARs see Leave Chit
 *          and Travel Claim shortcuts; other sectors see neutral messaging.
 *
 * @note The banner responds to sector changes dynamically — no page reload needed.
 *       When a CIVMAR changes sector to Tug Boats, the MSC tools disappear immediately.
 */
'use client';

import Link from 'next/link';
import {
  isMscSector,
  SECTOR_LABELS,
  type Sector,
} from '@/lib/constants/sectors';

interface WelcomeBannerProps {
  firstName: string | null;
  sector: string | null;
}

export default function WelcomeBanner({
  firstName,
  sector,
}: WelcomeBannerProps) {
  const name = firstName || 'Mariner';
  const isMsc = isMscSector(sector);
  const sectorLabel = sector ? SECTOR_LABELS[sector as Sector] : null;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {name}.
          </h1>

          {sector && sectorLabel && (
            <p className="text-sm text-gray-500 mt-1">{sectorLabel}</p>
          )}

          {isMsc && (
            <p className="text-blue-700 font-medium mt-2">
              Your MSC toolkit is ready.
            </p>
          )}

          {!sector && (
            <p className="text-sm text-gray-500 mt-1">
              Your maritime career command center.
            </p>
          )}
        </div>

        {/* Sector icon */}
        <span className="text-4xl opacity-60" aria-hidden="true">
          {getSectorIcon(sector)}
        </span>
      </div>

      {/* MSC quick-action links */}
      {isMsc && (
        <div className="flex flex-wrap gap-3 mt-4">
          <Link
            href="/tools/leave-chit"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Leave Chit Generator
          </Link>
          <Link
            href="/tools/travel-claim"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 text-sm font-medium rounded-lg hover:bg-blue-100 transition-colors border border-blue-200"
          >
            Travel Claim Calculator
          </Link>
        </div>
      )}
    </div>
  );
}

function getSectorIcon(sector: string | null): string {
  switch (sector) {
    case 'civmar':
    case 'conmar':
      return '⚓';
    case 'noaa':
      return '🌊';
    case 'commercial_deep_sea':
      return '🚢';
    case 'offshore_rigs':
    case 'offshore_supply':
      return '🛢️';
    case 'tugboats':
    case 'barges':
      return '⛵';
    case 'ferries':
    case 'cruise':
      return '🛳️';
    case 'yachts':
      return '⛵';
    case 'fishing':
      return '🎣';
    case 'pilots':
      return '🧭';
    case 'not_sailing':
      return '🗺️';
    default:
      return '⚓';
  }
}
