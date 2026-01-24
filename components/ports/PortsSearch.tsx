/**
 * @file PortsSearch.tsx
 * @description Search input with autocomplete for finding ports
 *
 * Features:
 * - Debounced search (300ms)
 * - Client-side filtering (no API call needed, data already loaded)
 * - Keyboard navigation (arrows, enter, escape)
 * - Shows port name, country, and status indicator
 */

'use client';

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { PortMinimal } from '@/types/ports';
import { PAGE_STATUS_COLORS, getPortDisplayName } from '@/lib/ports/geojson';

interface PortsSearchProps {
  ports: PortMinimal[];
  onSelectPort: (port: PortMinimal) => void;
  placeholder?: string;
}

export default function PortsSearch({
  ports,
  onSelectPort,
  placeholder = 'Search ports...',
}: PortsSearchProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Debounced search query
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Filter ports based on debounced query
  const results = useMemo(() => {
    if (!debouncedQuery.trim()) return [];

    const searchLower = debouncedQuery.toLowerCase().trim();

    return ports
      .filter((port) => {
        const displayName = getPortDisplayName(port).toLowerCase();
        const city = port.city.toLowerCase();
        const country = port.country.toLowerCase();
        const state = port.state?.toLowerCase() || '';

        return (
          displayName.includes(searchLower) ||
          city.includes(searchLower) ||
          country.includes(searchLower) ||
          state.includes(searchLower)
        );
      })
      .slice(0, 8); // Limit to 8 results
  }, [ports, debouncedQuery]);

  // Open dropdown when we have results
  useEffect(() => {
    setIsOpen(results.length > 0);
    setHighlightedIndex(-1);
  }, [results]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (!isOpen) return;

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          setHighlightedIndex((prev) =>
            prev < results.length - 1 ? prev + 1 : 0
          );
          break;

        case 'ArrowUp':
          event.preventDefault();
          setHighlightedIndex((prev) =>
            prev > 0 ? prev - 1 : results.length - 1
          );
          break;

        case 'Enter':
          event.preventDefault();
          if (highlightedIndex >= 0 && results[highlightedIndex]) {
            handleSelect(results[highlightedIndex]);
          }
          break;

        case 'Escape':
          event.preventDefault();
          setIsOpen(false);
          setQuery('');
          inputRef.current?.blur();
          break;
      }
    },
    [isOpen, results, highlightedIndex]
  );

  // Select a port
  const handleSelect = useCallback(
    (port: PortMinimal) => {
      onSelectPort(port);
      setQuery('');
      setIsOpen(false);
      inputRef.current?.blur();
    },
    [onSelectPort]
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        listRef.current &&
        !listRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Scroll highlighted item into view
  useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const item = listRef.current.children[highlightedIndex] as HTMLElement;
      if (item) {
        item.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex]);

  return (
    <div className="relative w-full md:w-80">
      {/* Search input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          aria-label="Search ports"
          aria-autocomplete="list"
          aria-controls={isOpen ? 'port-search-results' : undefined}
          aria-activedescendant={
            highlightedIndex >= 0
              ? `port-result-${highlightedIndex}`
              : undefined
          }
        />

        {/* Clear button */}
        {query && (
          <button
            onClick={() => {
              setQuery('');
              inputRef.current?.focus();
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-slate-300 transition-colors"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Results dropdown */}
      {isOpen && (
        <div
          ref={listRef}
          id="port-search-results"
          className="absolute top-full left-0 right-0 mt-2 py-1 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50 max-h-80 overflow-y-auto"
          role="listbox"
        >
          {results.map((port, index) => (
            <button
              key={port.id}
              id={`port-result-${index}`}
              onClick={() => handleSelect(port)}
              onMouseEnter={() => setHighlightedIndex(index)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                index === highlightedIndex
                  ? 'bg-slate-700 text-white'
                  : 'text-slate-300 hover:bg-slate-700/50'
              }`}
              role="option"
              aria-selected={index === highlightedIndex}
            >
              {/* Status dot */}
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{
                  backgroundColor: PAGE_STATUS_COLORS[port.page_status],
                }}
              />

              {/* Port info */}
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">
                  {getPortDisplayName(port)}
                </div>
                <div className="text-sm text-slate-500 truncate">
                  {port.state ? `${port.state}, ` : ''}
                  {port.country}
                </div>
              </div>

              {/* Region badge (if set) */}
              {port.region && (
                <span className="text-xs px-2 py-1 bg-slate-700 rounded-full text-slate-400 flex-shrink-0">
                  {port.region}
                </span>
              )}
            </button>
          ))}

          {/* No results message */}
          {results.length === 0 && debouncedQuery.trim() && (
            <div className="px-4 py-6 text-center text-slate-500">
              No ports found for "{debouncedQuery}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}
