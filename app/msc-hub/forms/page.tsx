'use client';

/**
 * MSC Hub Forms Page
 * 
 * Displays all common MSC forms in a beautiful, filterable grid.
 * Forms open in a new tab when clicked.
 * 
 * To add new forms:
 * 1. Add PDF to /public/forms/
 * 2. Add entry to formsData.ts
 */

import { useState } from 'react';
import Link from 'next/link';
import { 
  FileText, 
  ChevronRight, 
  Search,
  Filter,
  Anchor
} from 'lucide-react';
import FormCard from './FormCard';
import { FORMS, CATEGORY_CONFIG, type FormCategory } from './formsData';

// "All" option for the filter
type FilterOption = FormCategory | 'all';

export default function FormsPage() {
  // Track which category filter is active
  const [activeFilter, setActiveFilter] = useState<FilterOption>('all');
  // Track search query
  const [searchQuery, setSearchQuery] = useState('');

  // Filter forms based on active category and search query
  const filteredForms = FORMS.filter((form) => {
    // Category filter
    const matchesCategory = activeFilter === 'all' || form.category === activeFilter;
    
    // Search filter (searches title and description)
    const matchesSearch = searchQuery === '' || 
      form.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      form.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  // All filter options (including "All")
  const filterOptions: { key: FilterOption; label: string }[] = [
    { key: 'all', label: 'All Forms' },
    { key: 'leave', label: 'Leave' },
    { key: 'medical', label: 'Medical' },
    { key: 'coast-guard', label: 'Coast Guard' },
    { key: 'training', label: 'Training' },
    { key: 'benefits', label: 'Benefits' },
    { key: 'administrative', label: 'Administrative' },
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

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
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
            <span className="text-white">Forms</span>
          </nav>

          {/* Page Header */}
          <div className="flex items-center mb-6">
            <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mr-6">
              <FileText className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-2">
                MSC Forms
              </h1>
              <p className="text-xl text-white/70">
                Common forms and paperwork for MSC mariners
              </p>
            </div>
          </div>

          {/* Description */}
          <p className="text-white/60 max-w-2xl mb-8 leading-relaxed">
            Find the forms you need for leave requests, medical documentation, training, 
            Coast Guard credentials, and more. Click any form to open it in a new tab.
          </p>

          {/* Search and Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="text"
                placeholder="Search forms..."
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

            {/* Form Count */}
            <div className="flex items-center text-white/60 text-sm">
              <Filter className="w-4 h-4 mr-2" />
              <span>
                Showing {filteredForms.length} of {FORMS.length} forms
              </span>
            </div>
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
                    ({FORMS.filter(f => f.category === option.key).length})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ============================================ */}
      {/* FORMS GRID */}
      {/* ============================================ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {filteredForms.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredForms.map((form) => (
              <FormCard key={form.id} form={form} />
            ))}
          </div>
        ) : (
          /* Empty state when no forms match filter */
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="w-10 h-10 text-white/30" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No forms found
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
      {/* HELP SECTION */}
      {/* ============================================ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-white/5 backdrop-blur-lg border border-white/20 rounded-2xl p-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <Anchor className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Need a form that&apos;s not listed?
              </h3>
              <p className="text-white/60 leading-relaxed">
                This collection includes the most commonly used forms for MSC mariners. 
                If you need a specific form that&apos;s not here, check the official MSC 
                intranet or contact your HR representative. You can also submit a request 
                to have it added to this page.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}