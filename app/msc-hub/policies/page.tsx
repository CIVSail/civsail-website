'use client';

/**
 * MSC Hub Policies Page
 * 
 * Displays all CMPIs (Civilian Mariners Personnel Instructions) in a 
 * filterable grid with explanatory header content.
 * 
 * To add new CMPIs:
 * 1. Add PDF to /public/policies/
 * 2. Add entry to cmpiData.ts
 */

import { useState } from 'react';
import Link from 'next/link';
import { 
  BookOpen, 
  ChevronRight, 
  Search,
  Filter,
  Scale,
  AlertCircle
} from 'lucide-react';
import CMPICard from './CMPICard';
import { CMPIS, CMPI_CATEGORY_CONFIG, type CMPICategory } from './cmpiData';

// "All" option for the filter
type FilterOption = CMPICategory | 'all';

export default function PoliciesPage() {
  // Track which category filter is active
  const [activeFilter, setActiveFilter] = useState<FilterOption>('all');
  // Track search query
  const [searchQuery, setSearchQuery] = useState('');

  // Filter CMPIs based on active category and search query
  const filteredCMPIs = CMPIS.filter((cmpi) => {
    // Category filter
    const matchesCategory = activeFilter === 'all' || cmpi.category === activeFilter;
    
    // Search filter (searches number, title, and description)
    const matchesSearch = searchQuery === '' || 
      cmpi.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cmpi.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cmpi.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  // All filter options
  const filterOptions: { key: FilterOption; label: string }[] = [
    { key: 'all', label: 'All CMPIs' },
    { key: 'employment', label: 'Employment' },
    { key: 'pay', label: 'Pay & Benefits' },
    { key: 'work-rules', label: 'Work Rules' },
    { key: 'training', label: 'Training' },
    { key: 'conduct', label: 'Conduct & Labor' },
    { key: 'travel', label: 'Travel' },
    { key: 'safety', label: 'Safety' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
      {/* ============================================ */}
      {/* HERO SECTION */}
      {/* ============================================ */}
      <div className="relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute top-40 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center text-sm text-white/60 mb-8">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <Link href="/msc-hub" className="hover:text-white transition-colors">
              MSC Hub
            </Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span className="text-white">Policies & CMPIs</span>
          </nav>

          {/* Page Header */}
          <div className="flex items-center mb-6">
            <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mr-6">
              <BookOpen className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-2">
                Policies, Instructions & CMPIs
              </h1>
              <p className="text-xl text-white/70">
                Civilian Mariners Personnel Instructions
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================ */}
      {/* EXPLAINER SECTION */}
      {/* ============================================ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="bg-white/5 backdrop-blur-lg border border-white/20 rounded-2xl p-8">
          {/* What are CMPIs? */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main explanation */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                <Scale className="w-6 h-6 text-blue-400 mr-3" />
                What are CMPIs?
              </h2>
              <p className="text-white/70 leading-relaxed mb-4">
                Civilian Mariners Personnel Instructions (CMPIs) are official Military Sealift Command 
                policy documents that govern the employment, pay, benefits, discipline and working 
                conditions of U.S. Civilian Mariners (CIVMARs).
              </p>
              <p className="text-white/70 leading-relaxed">
                CMPIs interpret how federal law, labor agreements and MSC policy are applied in 
                real-world situations at sea and ashore. They are the primary reference used by MSC 
                management when making personnel decisions and are frequently cited in pay disputes, 
                grievances and disciplinary actions.
              </p>
            </div>

            {/* Why it matters callout */}
            <div className="bg-amber-500/10 border border-amber-400/30 rounded-xl p-6">
              <div className="flex items-center mb-3">
                <AlertCircle className="w-5 h-5 text-amber-400 mr-2" />
                <h3 className="font-semibold text-amber-300">Why This Matters</h3>
              </div>
              <p className="text-white/70 text-sm leading-relaxed">
                Understanding the relevant CMPIs helps CIVMARs know what rules apply, what rights 
                exist and what procedures MSC is required to follow. Knowledge of CMPIs is essential 
                for protecting your interests.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================ */}
      {/* SEARCH BAR */}
      {/* ============================================ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="text"
              placeholder="Search by number or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="
                w-full pl-12 pr-4 py-3
                bg-white/10 backdrop-blur-sm
                border border-white/20 rounded-xl
                text-white placeholder-white/40
                focus:outline-none focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/20
                transition-all duration-200
              "
            />
          </div>

          {/* CMPI Count */}
          <div className="flex items-center text-white/60 text-sm">
            <Filter className="w-4 h-4 mr-2" />
            <span>
              Showing {filteredCMPIs.length} of {CMPIS.length} CMPIs
            </span>
          </div>
        </div>
      </div>

      {/* ============================================ */}
      {/* FILTER TABS */}
      {/* ============================================ */}
      <div className="sticky top-0 z-10 bg-slate-900/80 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto py-4 gap-2 scrollbar-hide">
            {filterOptions.map((option) => (
              <button
                key={option.key}
                onClick={() => setActiveFilter(option.key)}
                className={`
                  px-4 py-2 rounded-lg font-medium text-sm
                  whitespace-nowrap transition-all duration-200
                  ${activeFilter === option.key
                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                    : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
                  }
                `}
              >
                {option.label}
                {/* Show count for each category */}
                {option.key !== 'all' && (
                  <span className="ml-2 text-xs opacity-70">
                    ({CMPIS.filter(c => c.category === option.key).length})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ============================================ */}
      {/* CMPI GRID */}
      {/* ============================================ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {filteredCMPIs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCMPIs.map((cmpi) => (
              <CMPICard key={cmpi.id} cmpi={cmpi} />
            ))}
          </div>
        ) : (
          /* Empty state when no CMPIs match filter */
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-10 h-10 text-white/30" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No CMPIs found
            </h3>
            <p className="text-white/60 mb-6">
              Try adjusting your search or filter criteria
            </p>
            <button
              onClick={() => {
                setActiveFilter('all');
                setSearchQuery('');
              }}
              className="px-6 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* ============================================ */}
      {/* DISCLAIMER */}
      {/* ============================================ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-white/5 backdrop-blur-lg border border-white/20 rounded-2xl p-6">
          <p className="text-white/50 text-sm text-center">
            These CMPIs are provided for reference purposes. Always verify you have the most 
            current version through official MSC channels. CMPIs may be updated or superseded 
            without notice.
          </p>
        </div>
      </div>
    </div>
  );
}