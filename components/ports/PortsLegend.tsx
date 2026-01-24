/**
 * @file PortsLegend.tsx
 * @description Color legend for port markers on the globe
 *
 * Shows the three-tier status system:
 * - Green: Full guide available
 * - Yellow: Basic page exists
 * - Gray: No page yet
 */

import { PAGE_STATUS_COLORS } from '@/lib/ports/geojson';

export default function PortsLegend() {
  const legendItems = [
    {
      color: PAGE_STATUS_COLORS.full_guide,
      label: 'Full Guide',
      description: 'Complete port guide with venues and tips',
    },
    {
      color: PAGE_STATUS_COLORS.basic_page,
      label: 'Basic Page',
      description: 'Basic info available',
    },
    {
      color: PAGE_STATUS_COLORS.none,
      label: 'No Page Yet',
      description: 'Coordinates only',
    },
  ];

  return (
    <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 py-4 px-4 md:px-6">
      <span className="text-slate-500 text-sm font-medium">Legend:</span>

      {legendItems.map((item) => (
        <div key={item.label} className="flex items-center gap-2 group relative">
          {/* Color dot */}
          <span
            className="w-3 h-3 rounded-full flex-shrink-0"
            style={{ backgroundColor: item.color }}
          />

          {/* Label */}
          <span className="text-slate-400 text-sm">{item.label}</span>

          {/* Tooltip on hover (desktop) */}
          <div className="hidden md:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
            <div className="bg-slate-800 text-slate-200 text-xs px-3 py-2 rounded-lg shadow-lg whitespace-nowrap border border-slate-700">
              {item.description}
              {/* Arrow */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
