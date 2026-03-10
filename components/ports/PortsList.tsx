/**
 * @file PortsList.tsx
 * @description Table/list view fallback for ports
 *
 * Shown when:
 * - User prefers list view (?view=list)
 * - WebGL/globe fails to load
 * - User clicks "View as List"
 *
 * Features:
 * - Sortable columns
 * - Respects current filter
 * - Pagination (50 per page)
 * - Status indicators match globe colors
 */

'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  MapPin,
} from 'lucide-react';
import { PortMinimal, PortFilterOption } from '@/types/ports';
import { PAGE_STATUS_COLORS, getPortDisplayName } from '@/lib/ports/geojson';

interface PortsListProps {
  ports: PortMinimal[];
  filter: PortFilterOption;
  onViewGlobe?: () => void;
}

type SortField = 'city' | 'country' | 'region' | 'page_status';
type SortDirection = 'asc' | 'desc';

const PAGE_SIZE = 50;

// Human-readable status labels
const STATUS_LABELS = {
  full_guide: 'Full Guide',
  basic_page: 'Basic Page',
  none: 'No Page',
};

export default function PortsList({
  ports,
  filter,
  onViewGlobe,
}: PortsListProps) {
  const [sortField, setSortField] = useState<SortField>('city');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [currentPage, setCurrentPage] = useState(1);

  // Filter ports based on current filter
  const filteredPorts = useMemo(() => {
    if (filter === 'coverage') {
      return ports.filter(
        (p) => p.page_status === 'full_guide' || p.page_status === 'basic_page'
      );
    }
    // 'all' - show everything
    return ports;
  }, [ports, filter]);

  // Sort ports
  const sortedPorts = useMemo(() => {
    return [...filteredPorts].sort((a, b) => {
      let aVal: string;
      let bVal: string;

      switch (sortField) {
        case 'city':
          aVal = getPortDisplayName(a).toLowerCase();
          bVal = getPortDisplayName(b).toLowerCase();
          break;
        case 'country':
          aVal = a.country.toLowerCase();
          bVal = b.country.toLowerCase();
          break;
        case 'region':
          aVal = (a.region || 'zzz').toLowerCase(); // Push null to end
          bVal = (b.region || 'zzz').toLowerCase();
          break;
        case 'page_status':
          // Sort order: full_guide > basic_page > none
          const statusOrder = { full_guide: 1, basic_page: 2, none: 3 };
          aVal = String(statusOrder[a.page_status]);
          bVal = String(statusOrder[b.page_status]);
          break;
        default:
          aVal = '';
          bVal = '';
      }

      if (sortDirection === 'asc') {
        return aVal.localeCompare(bVal);
      } else {
        return bVal.localeCompare(aVal);
      }
    });
  }, [filteredPorts, sortField, sortDirection]);

  // Paginate
  const totalPages = Math.ceil(sortedPorts.length / PAGE_SIZE);
  const paginatedPorts = sortedPorts.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  // Handle sort toggle
  function handleSort(field: SortField) {
    if (field === sortField) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setCurrentPage(1); // Reset to first page on sort
  }

  // Sort indicator icon
  function SortIcon({ field }: { field: SortField }) {
    if (field !== sortField) {
      return <ArrowUpDown className="w-4 h-4 text-slate-500" />;
    }
    return sortDirection === 'asc' ? (
      <ArrowUp className="w-4 h-4 text-blue-400" />
    ) : (
      <ArrowDown className="w-4 h-4 text-blue-400" />
    );
  }

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
      {/* Header with globe toggle */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
        <span className="text-slate-400 text-sm">
          Showing {paginatedPorts.length} of {filteredPorts.length} ports
        </span>

        {onViewGlobe && (
          <button
            onClick={onViewGlobe}
            className="flex items-center gap-2 px-3 py-1.5 text-sm text-blue-400 hover:text-blue-300 transition-colors"
          >
            <MapPin className="w-4 h-4" />
            View Globe
          </button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-800/50 text-left">
              <th className="px-4 py-3">
                <button
                  onClick={() => handleSort('city')}
                  className="flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
                >
                  Port Name
                  <SortIcon field="city" />
                </button>
              </th>
              <th className="px-4 py-3">
                <button
                  onClick={() => handleSort('country')}
                  className="flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
                >
                  Country
                  <SortIcon field="country" />
                </button>
              </th>
              <th className="px-4 py-3 hidden md:table-cell">
                <button
                  onClick={() => handleSort('region')}
                  className="flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
                >
                  Region
                  <SortIcon field="region" />
                </button>
              </th>
              <th className="px-4 py-3">
                <button
                  onClick={() => handleSort('page_status')}
                  className="flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
                >
                  Status
                  <SortIcon field="page_status" />
                </button>
              </th>
              <th className="px-4 py-3 text-right">
                <span className="text-sm font-medium text-slate-300">Action</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {paginatedPorts.map((port) => (
              <tr
                key={port.id}
                className="hover:bg-slate-800/30 transition-colors"
              >
                {/* Port name */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{
                        backgroundColor: PAGE_STATUS_COLORS[port.page_status],
                      }}
                    />
                    <span className="text-white font-medium">
                      {getPortDisplayName(port)}
                    </span>
                  </div>
                </td>

                {/* Country */}
                <td className="px-4 py-3 text-slate-400">
                  {port.state ? `${port.state}, ` : ''}
                  {port.country}
                </td>

                {/* Region (hidden on mobile) */}
                <td className="px-4 py-3 text-slate-500 hidden md:table-cell">
                  {port.region || '—'}
                </td>

                {/* Status badge */}
                <td className="px-4 py-3">
                  <span
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: `${PAGE_STATUS_COLORS[port.page_status]}20`,
                      color: PAGE_STATUS_COLORS[port.page_status],
                    }}
                  >
                    {STATUS_LABELS[port.page_status]}
                  </span>
                </td>

                {/* Action */}
                <td className="px-4 py-3 text-right">
                  {port.slug ? (
                    <Link
                      href={`/ports/${port.slug}`}
                      className="inline-flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      View
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  ) : (
                    <Link
                      href={`/contribute?port=${encodeURIComponent(port.city)}&country=${encodeURIComponent(port.country)}`}
                      className="text-sm text-slate-500 hover:text-slate-400 transition-colors"
                    >
                      Contribute
                    </Link>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-800">
          <span className="text-sm text-slate-500">
            Page {currentPage} of {totalPages}
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 text-slate-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 text-slate-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Next page"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
