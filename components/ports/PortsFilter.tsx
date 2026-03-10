/**
 * @file PortsFilter.tsx
 * @description Simple toggle between "Ports with Pages" and "All Worldwide Ports"
 *
 * Default shows only ports with full_guide or basic_page status.
 * Toggle to show all ~3,100 worldwide ports.
 */

'use client';

import { Globe, MapPin } from 'lucide-react';
import { PortFilterOption, PortFilterCounts } from '@/types/ports';

interface PortsFilterProps {
  currentFilter: PortFilterOption;
  counts: PortFilterCounts;
  onChange: (filter: PortFilterOption) => void;
}

export default function PortsFilter({
  currentFilter,
  counts,
  onChange,
}: PortsFilterProps) {
  const isCoverage = currentFilter === 'coverage';

  return (
    <div className="flex bg-slate-800 border border-slate-700 rounded-lg p-1">
      {/* Ports with Pages button */}
      <button
        onClick={() => onChange('coverage')}
        className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${
          isCoverage
            ? 'bg-blue-600 text-white'
            : 'text-slate-400 hover:text-white hover:bg-slate-700'
        }`}
        aria-pressed={isCoverage}
      >
        <MapPin className="w-4 h-4" />
        <span>Ports with Pages</span>
        <span className={`text-sm ${isCoverage ? 'text-blue-200' : 'text-slate-500'}`}>
          ({counts.coverage})
        </span>
      </button>

      {/* All Worldwide Ports button */}
      <button
        onClick={() => onChange('all')}
        className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${
          !isCoverage
            ? 'bg-blue-600 text-white'
            : 'text-slate-400 hover:text-white hover:bg-slate-700'
        }`}
        aria-pressed={!isCoverage}
      >
        <Globe className="w-4 h-4" />
        <span>All Worldwide</span>
        <span className={`text-sm ${!isCoverage ? 'text-blue-200' : 'text-slate-500'}`}>
          ({counts.total.toLocaleString()})
        </span>
      </button>
    </div>
  );
}
