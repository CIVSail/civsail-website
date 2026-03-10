/**
 * @file PortsGlobeSection.tsx
 * @description Wrapper component that combines all globe UI elements
 *
 * Manages:
 * - Filter state and URL sync
 * - View mode (globe vs list)
 * - Search and fly-to
 * - Error handling with fallback to list
 * - Dynamic import of globe for SSR safety
 */

'use client';

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { useRouter, useSearchParams } from 'next/navigation';
import { List } from 'lucide-react';
import { PortMinimal, PortFilterOption, PortFilterCounts } from '@/types/ports';
import PortsFilter from './PortsFilter';
import PortsSearch from './PortsSearch';
import PortsLegend from './PortsLegend';
import PortsList from './PortsList';
import PortsGlobeLoading from './PortsGlobeLoading';
import PortsGlobeError from './PortsGlobeError';

// Dynamic import of globe component (no SSR - Mapbox requires window)
const PortsGlobe = dynamic(() => import('./PortsGlobe'), {
  ssr: false,
  loading: () => <PortsGlobeLoading />,
});

interface PortsGlobeSectionProps {
  ports: PortMinimal[];
  counts: PortFilterCounts;
  initialFilter?: PortFilterOption;
  initialHighlight?: string | null;
  initialView?: 'globe' | 'list';
}

export default function PortsGlobeSection({
  ports,
  counts,
  initialFilter = 'coverage',
  initialHighlight = null,
  initialView = 'globe',
}: PortsGlobeSectionProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State
  const [filter, setFilter] = useState<PortFilterOption>(initialFilter);
  const [highlightPort, setHighlightPort] = useState<string | null>(initialHighlight);
  const [view, setView] = useState<'globe' | 'list'>(initialView);
  const [globeError, setGlobeError] = useState<Error | null>(null);

  // Update URL when filter changes
  const updateUrl = useCallback(
    (newFilter: PortFilterOption, newView?: 'globe' | 'list') => {
      const params = new URLSearchParams(searchParams.toString());

      // Update filter param (coverage is the default, so omit it from URL)
      if (newFilter === 'coverage') {
        params.delete('filter');
      } else {
        params.set('filter', newFilter);
      }

      // Update view param
      const viewToSet = newView ?? view;
      if (viewToSet === 'list') {
        params.set('view', 'list');
      } else {
        params.delete('view');
      }

      // Remove highlight after initial load
      params.delete('port');

      const newUrl = params.toString() ? `?${params.toString()}` : '/ports';
      router.replace(newUrl, { scroll: false });
    },
    [router, searchParams, view]
  );

  // Handle filter change
  const handleFilterChange = useCallback(
    (newFilter: PortFilterOption) => {
      setFilter(newFilter);
      updateUrl(newFilter);
    },
    [updateUrl]
  );

  // Handle view toggle
  const handleViewChange = useCallback(
    (newView: 'globe' | 'list') => {
      setView(newView);
      updateUrl(filter, newView);
    },
    [filter, updateUrl]
  );

  // Handle search selection - fly to port
  const handleSelectPort = useCallback((port: PortMinimal) => {
    setHighlightPort(port.city);

    // Call the globe's flyTo function if available
    if (typeof window !== 'undefined' && (window as any).__portsGlobeFlyTo) {
      (window as any).__portsGlobeFlyTo(port);
    }

    // Clear highlight after animation
    setTimeout(() => {
      setHighlightPort(null);
    }, 3000);
  }, []);

  // Handle globe error - switch to list view
  const handleGlobeError = useCallback((error: Error) => {
    console.error('Globe error:', error);
    setGlobeError(error);
  }, []);

  // Handle retry
  const handleRetry = useCallback(() => {
    setGlobeError(null);
  }, []);

  // Show list view if globe errored
  const showList = view === 'list' || globeError !== null;

  return (
    <section className="max-w-7xl mx-auto px-4 pb-12">
      {/* Controls row */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        {/* Search */}
        <PortsSearch ports={ports} onSelectPort={handleSelectPort} />

        {/* Filter dropdown */}
        <PortsFilter
          currentFilter={filter}
          counts={counts}
          onChange={handleFilterChange}
        />

        {/* View toggle (only show if globe hasn't errored) */}
        {!globeError && (
          <button
            onClick={() => handleViewChange(view === 'globe' ? 'list' : 'globe')}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-slate-300 font-medium transition-colors md:ml-auto"
          >
            <List className="w-4 h-4" />
            {view === 'globe' ? 'View as List' : 'View Globe'}
          </button>
        )}
      </div>

      {/* Globe or List */}
      {showList ? (
        <>
          {globeError && (
            <div className="mb-6">
              <PortsGlobeError
                error={globeError}
                onRetry={handleRetry}
                onViewList={() => setView('list')}
              />
            </div>
          )}
          <PortsList
            ports={ports}
            filter={filter}
            onViewGlobe={
              globeError
                ? undefined
                : () => handleViewChange('globe')
            }
          />
        </>
      ) : (
        <>
          <PortsGlobe
            ports={ports}
            filter={filter}
            highlightPort={highlightPort}
            onError={handleGlobeError}
          />
          <PortsLegend />
        </>
      )}
    </section>
  );
}
