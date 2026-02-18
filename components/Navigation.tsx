'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';
import MobileNav from './MobileNav';
import { searchIndex, type SearchEntry } from '@/lib/search-index';

// Category → color mapping for search result badges
const CATEGORY_COLORS: Record<string, string> = {
  'Maritime 101': 'bg-blue-100 text-blue-700',
  'Sectors': 'bg-emerald-100 text-emerald-700',
  'Tools': 'bg-amber-100 text-amber-700',
  'Ships': 'bg-slate-200 text-slate-700',
  'Ports': 'bg-purple-100 text-purple-700',
  'Editorials': 'bg-pink-100 text-pink-700',
  'MSC Hub': 'bg-indigo-100 text-indigo-700',
  'Professional': 'bg-teal-100 text-teal-700',
  'About': 'bg-gray-100 text-gray-600',
};

export default function Navigation() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient();

  // Search state
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchEntry[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);

  // Filter search results as user types
  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
    setSelectedIndex(-1);
    if (value.trim()) {
      setSearchResults(searchIndex(value));
      setIsSearchOpen(true);
    } else {
      setSearchResults([]);
      setIsSearchOpen(false);
    }
  }, []);

  // Navigate to a search result
  const handleSelect = useCallback((url: string) => {
    setSearchQuery('');
    setSearchResults([]);
    setIsSearchOpen(false);
    setMobileSearchOpen(false);
    router.push(url);
  }, [router]);

  // Keyboard navigation for search results
  const handleSearchKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!isSearchOpen || searchResults.length === 0) {
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
        setMobileSearchOpen(false);
        inputRef.current?.blur();
        mobileInputRef.current?.blur();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => (prev < searchResults.length - 1 ? prev + 1 : 0));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : searchResults.length - 1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSelect(searchResults[selectedIndex].url);
        } else if (searchResults.length > 0) {
          handleSelect(searchResults[0].url);
        }
        break;
      case 'Escape':
        setIsSearchOpen(false);
        setMobileSearchOpen(false);
        inputRef.current?.blur();
        mobileInputRef.current?.blur();
        break;
    }
  }, [isSearchOpen, searchResults, selectedIndex, handleSelect]);

  // Close search dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      const inDesktop = searchRef.current?.contains(target);
      const inMobile = mobileSearchRef.current?.contains(target);
      if (!inDesktop && !inMobile) {
        setIsSearchOpen(false);
        setMobileSearchOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const handleDropdownToggle = (dropdownName: string) => {
    setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName);
  };

  const handleMouseLeave = () => {
    setActiveDropdown(null);
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md border-b border-gray-200">
      {/* Top Row - Logo, Search, Auth */}
      <div className="border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <Image
                src="/CIVSail-Logo-Crop.png"
                alt="CIVSail"
                width={180}
                height={40}
                className="h-8 w-auto"
                priority
              />
            </Link>

            {/* Search and Auth */}
            <div className="flex items-center space-x-6">
              {/* Desktop Search Bar */}
              <div className="hidden md:flex items-center" ref={searchRef}>
                <div className="relative">
                  <input
                    ref={inputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    onFocus={() => { if (searchQuery.trim()) setIsSearchOpen(true); }}
                    onKeyDown={handleSearchKeyDown}
                    placeholder="Search guides, tools, ports..."
                    className="w-80 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <svg
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>

                  {/* Search Results Dropdown */}
                  {isSearchOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-[60]">
                      {searchResults.length > 0 ? (
                        <ul>
                          {searchResults.map((result, i) => (
                            <li key={result.url}>
                              <button
                                onClick={() => handleSelect(result.url)}
                                onMouseEnter={() => setSelectedIndex(i)}
                                className={`w-full text-left px-4 py-3 flex items-start gap-3 transition-colors ${
                                  i === selectedIndex ? 'bg-blue-50' : 'hover:bg-gray-50'
                                }`}
                              >
                                <span className={`shrink-0 mt-0.5 text-xs font-medium px-2 py-0.5 rounded-full ${
                                  CATEGORY_COLORS[result.category] || 'bg-gray-100 text-gray-600'
                                }`}>
                                  {result.category}
                                </span>
                                <div className="min-w-0">
                                  <div className="text-sm font-medium text-gray-900 truncate">{result.title}</div>
                                  <div className="text-xs text-gray-500 truncate">{result.description}</div>
                                </div>
                              </button>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="px-4 py-3 text-sm text-gray-500">No results found</div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Mobile Search Icon */}
              <button
                className="md:hidden text-gray-700 hover:text-slate-900 transition-colors"
                onClick={() => {
                  setMobileSearchOpen(!mobileSearchOpen);
                  setTimeout(() => mobileInputRef.current?.focus(), 100);
                }}
                aria-label="Search"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>

              {/* Social Media and Auth */}
              <div className="flex items-center space-x-4">
                {/* Social Media Icons */}
                <div className="flex items-center space-x-3">
                  <a
                    href="https://instagram.com/civsail"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-pink-600 transition-colors"
                    aria-label="Follow us on Instagram"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.17.054 1.97.24 2.43.403a4.088 4.088 0 011.47.958c.453.453.753.882.958 1.47.163.46.349 1.26.404 2.43.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.055 1.17-.241 1.97-.404 2.43a4.088 4.088 0 01-.958 1.47 4.088 4.088 0 01-1.47.958c-.46.163-1.26.349-2.43.404-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.17-.055-1.97-.241-2.43-.404a4.088 4.088 0 01-1.47-.958 4.088 4.088 0 01-.958-1.47c-.163-.46-.349-1.26-.404-2.43C2.175 15.584 2.163 15.204 2.163 12s.012-3.584.07-4.85c.055-1.17.241-1.97.404-2.43a4.088 4.088 0 01.958-1.47 4.088 4.088 0 011.47-.958c.46-.163 1.26-.349 2.43-.404C8.416 2.175 8.796 2.163 12 2.163zM12 0C8.741 0 8.333.014 7.053.072 5.775.13 4.902.333 4.14.63a5.876 5.876 0 00-2.126 1.384A5.876 5.876 0 00.63 4.14C.333 4.902.13 5.775.072 7.053.014 8.333 0 8.741 0 12s.014 3.667.072 4.947c.058 1.278.261 2.151.558 2.913a5.876 5.876 0 001.384 2.126 5.876 5.876 0 002.126 1.384c.762.297 1.635.5 2.913.558C8.333 23.986 8.741 24 12 24s3.667-.014 4.947-.072c1.278-.058 2.151-.261 2.913-.558a5.876 5.876 0 002.126-1.384 5.876 5.876 0 001.384-2.126c.297-.762.5-1.635.558-2.913.058-1.28.072-1.688.072-4.947s-.014-3.667-.072-4.947c-.058-1.278-.261-2.151-.558-2.913a5.876 5.876 0 00-1.384-2.126A5.876 5.876 0 0019.86.63c-.762-.297-1.635-.5-2.913-.558C15.667.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                    </svg>
                  </a>

                  <a
                    href="https://facebook.com/civsail"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-blue-600 transition-colors"
                    aria-label="Follow us on Facebook"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 1.092.063 1.375.126V8.16c-.15-.018-.387-.018-.693-.018-1.297 0-1.848.495-1.848 1.78v1.731h3.33l-.457 3.667h-2.873v8.218A12.005 12.005 0 0012 24c-.476 0-.946-.028-1.41-.082a12.073 12.073 0 01-1.489-.227z" />
                    </svg>
                  </a>
                </div>

                {/* Auth Button - Dynamic based on login state */}
                {user ? (
                  <Link
                    href="/dashboard"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors font-medium"
                  >
                    Dashboard
                  </Link>
                ) : (
                  <Link
                    href="/login"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors font-medium"
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Search Panel */}
      {mobileSearchOpen && (
        <div ref={mobileSearchRef} className="md:hidden border-b border-gray-200 bg-white px-4 py-3">
          <div className="relative">
            <input
              ref={mobileInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              placeholder="Search guides, tools, ports..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {/* Mobile Search Results */}
          {isSearchOpen && (
            <div className="mt-2 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
              {searchResults.length > 0 ? (
                <ul>
                  {searchResults.map((result, i) => (
                    <li key={result.url}>
                      <button
                        onClick={() => handleSelect(result.url)}
                        className={`w-full text-left px-4 py-3 flex items-start gap-3 transition-colors ${
                          i === selectedIndex ? 'bg-blue-50' : 'hover:bg-gray-50'
                        }`}
                      >
                        <span className={`shrink-0 mt-0.5 text-xs font-medium px-2 py-0.5 rounded-full ${
                          CATEGORY_COLORS[result.category] || 'bg-gray-100 text-gray-600'
                        }`}>
                          {result.category}
                        </span>
                        <div className="min-w-0">
                          <div className="text-sm font-medium text-gray-900 truncate">{result.title}</div>
                          <div className="text-xs text-gray-500 truncate">{result.description}</div>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="px-4 py-3 text-sm text-gray-500">No results found</div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Bottom Row - Main Navigation */}
      <div className="bg-white">
        <div className="container mx-auto px-4">
          <nav
            className="hidden lg:flex items-center justify-center space-x-8 h-14"
            onMouseLeave={handleMouseLeave}
          >
            {/* About Us */}
            <Link
              href="/about"
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
            >
              About Us
            </Link>

            {/* Maritime 101 Mega Menu */}
            <div className="relative">
              <button
                className="text-gray-700 hover:text-blue-600 transition-colors flex items-center font-medium"
                onMouseEnter={() => handleDropdownToggle('maritime101')}
              >
                Maritime 101
                <svg
                  className="ml-1 h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {activeDropdown === 'maritime101' && (
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-175 bg-white rounded-lg shadow-xl border border-gray-200 py-6 px-6">
                  <div className="grid grid-cols-3 gap-6">
                    {/* Column 1: Start Here */}
                    <div>
                      <h3 className="text-gray-700 font-semibold mb-3 text-xs uppercase tracking-wide">
                        Start Here
                      </h3>
                      <div className="space-y-2">
                        <Link
                          href="/maritime-101/what-is-merchant-marine"
                          className="block text-gray-700 hover:text-blue-600 transition-colors text-sm py-1"
                        >
                          What is the Merchant Marine?
                        </Link>
                      </div>
                    </div>

                    {/* Column 2: Career Paths */}
                    <div>
                      <h3 className="text-gray-700 font-semibold mb-3 text-xs uppercase tracking-wide">
                        Career Paths
                      </h3>
                      <div className="space-y-2">
                        <Link
                          href="/maritime-101/careers-and-sectors"
                          className="block text-gray-700 hover:text-blue-600 transition-colors text-sm py-1"
                        >
                          Careers & Sectors
                        </Link>

                        <Link
                          href="/maritime-101/life-at-sea"
                          className="block text-gray-700 hover:text-blue-600 transition-colors text-sm py-1"
                        >
                          Life at Sea
                        </Link>
                      </div>
                    </div>

                    {/* Column 3: Getting Started */}
                    <div>
                      <h3 className="text-gray-700 font-semibold mb-3 text-xs uppercase tracking-wide">
                        Getting Started
                      </h3>
                      <div className="space-y-2">
                        <Link
                          href="/maritime-101/training-and-entry"
                          className="block text-gray-700 hover:text-blue-600 transition-colors text-sm py-1"
                        >
                          Training & Career Entry
                        </Link>

                        <Link
                          href="/maritime-101/credentials"
                          className="block text-gray-700 hover:text-blue-600 transition-colors text-sm py-1"
                        >
                          Credentials & Licensing
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Bottom CTA */}
                  <div className="border-t border-gray-200 mt-4 pt-4">
                    <Link
                      href="/maritime-101"
                      className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center justify-center gap-1"
                    >
                      View All Maritime 101 Topics
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Tools Dropdown */}
            <div className="relative">
              <button
                className="text-gray-700 hover:text-blue-600 transition-colors flex items-center font-medium"
                onMouseEnter={() => handleDropdownToggle('tools')}
              >
                Tools
                <svg
                  className="ml-1 h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {activeDropdown === 'tools' && (
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 py-6">
                  {/* MSC Tools Section */}
                  <div className="px-6">
                    <Link
                      href="/tools"
                      className="text-xs uppercase tracking-wide font-semibold text-gray-500 mb-3 block hover:text-blue-600 transition-colors"
                    >
                      MSC Tools →
                    </Link>
                    <div className="space-y-2">
                      <Link
                        href="/tools/ship-pay-calculator"
                        className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      >
                        Ship Pay Calculator
                      </Link>
                      <Link
                        href="/tools/pay-comparison"
                        className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      >
                        Ship Pay Comparison Calculator
                      </Link>
                      <Link
                        href="/tools/leave-chit"
                        className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      >
                        Leave Chit Generator
                      </Link>
                      <Link
                        href="/tools/travel-claim"
                        className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      >
                        Travel Claim Calculator
                      </Link>
                    </div>
                  </div>

                  {/* Coming Soon Section */}
                  <div className="border-t border-gray-100 mt-4 pt-4 px-6">
                    <h3 className="text-xs uppercase tracking-wide font-semibold text-gray-500 mb-3">
                      Coming Soon
                    </h3>
                    <div className="space-y-2">
                      <div className="px-3 py-2 text-gray-400 cursor-not-allowed text-sm">
                        Credential Expiration Reminders
                      </div>
                      <div className="px-3 py-2 text-gray-400 cursor-not-allowed text-sm">
                        Sea Day Tracking
                      </div>
                      <div className="px-3 py-2 text-gray-400 cursor-not-allowed text-sm">
                        Career Planning
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Ships Dropdown */}
            <div className="relative">
              <button
                className="text-gray-700 hover:text-blue-600 transition-colors flex items-center font-medium"
                onMouseEnter={() => handleDropdownToggle('ships')}
              >
                Ships
                <svg
                  className="ml-1 h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {activeDropdown === 'ships' && (
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 py-6">
                  <div className="px-6">
                    <h3 className="text-xs uppercase tracking-wide font-semibold text-gray-500 mb-3">
                      By Sector
                    </h3>
                    <div className="space-y-2">
                      <Link
                        href="/ships/msc"
                        className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      >
                        MSC Fleet
                      </Link>
                      <div className="px-3 py-2 text-gray-400 cursor-not-allowed text-sm">
                        NOAA Fleet{' '}
                        <span className="text-xs">(coming soon)</span>
                      </div>
                      <div className="px-3 py-2 text-gray-400 cursor-not-allowed text-sm">
                        Commercial{' '}
                        <span className="text-xs">(coming soon)</span>
                      </div>
                      <div className="px-3 py-2 text-gray-400 cursor-not-allowed text-sm">
                        Cruise Lines{' '}
                        <span className="text-xs">(coming soon)</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 mt-4 pt-4 px-6">
                    <Link
                      href="/ships"
                      className="text-sm font-medium text-blue-600 hover:text-blue-700"
                    >
                      All Ships →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Ports Dropdown */}
            <div className="relative">
              <button
                className="text-gray-700 hover:text-blue-600 transition-colors flex items-center font-medium"
                onMouseEnter={() => handleDropdownToggle('ports')}
              >
                Ports
                <svg
                  className="ml-1 h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {activeDropdown === 'ports' && (
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 py-6">
                  <div className="px-6 pb-2">
                    <Link
                      href="/ports"
                      className="block px-3 py-2 text-blue-600 font-medium hover:text-blue-700 hover:bg-blue-50 rounded-md mb-3 transition-colors"
                    >
                      🗺️ Interactive Map
                    </Link>
                  </div>

                  <div className="border-t border-gray-100 pt-4 px-6">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">
                      By Region
                    </h3>
                    <div className="grid grid-cols-2 gap-1">
                      <Link
                        href="/ports/united-states"
                        className="block px-3 py-2 text-sm text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      >
                        United States
                      </Link>
                      <Link
                        href="/ports/south-america"
                        className="block px-3 py-2 text-sm text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      >
                        South America
                      </Link>
                      <Link
                        href="/ports/europe"
                        className="block px-3 py-2 text-sm text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      >
                        Europe
                      </Link>
                      <Link
                        href="/ports/middle-east"
                        className="block px-3 py-2 text-sm text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      >
                        Middle East
                      </Link>
                      <Link
                        href="/ports/africa"
                        className="block px-3 py-2 text-sm text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      >
                        Africa
                      </Link>
                      <Link
                        href="/ports/far-east"
                        className="block px-3 py-2 text-sm text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      >
                        Far East
                      </Link>
                      <Link
                        href="/ports/australia"
                        className="block px-3 py-2 text-sm text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      >
                        Australia
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {/* Editorials Dropdown */}
            <div className="relative">
              <button
                className="text-gray-700 hover:text-blue-600 transition-colors flex items-center font-medium"
                onMouseEnter={() => handleDropdownToggle('editorials')}
              >
                Editorials
                <svg
                  className="ml-1 h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {activeDropdown === 'editorials' && (
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 py-6">
                  <div className="px-6">
                    <div className="space-y-2">
                      <Link
                        href="/editorials/soundings"
                        className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      >
                        <span className="font-medium">Soundings</span>
                        <span className="block text-xs text-gray-500">
                          Essays & analysis
                        </span>
                      </Link>
                      <Link
                        href="/editorials/final-muster"
                        className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      >
                        <span className="font-medium">The Final Muster</span>
                        <span className="block text-xs text-gray-500">
                          Retirement & benefits
                        </span>
                      </Link>
                      <Link
                        href="/editorials/profiles"
                        className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      >
                        <span className="font-medium">Mariner Profiles</span>
                        <span className="block text-xs text-gray-500">
                          Career stories
                        </span>
                      </Link>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 mt-4 pt-4 px-6">
                    <Link
                      href="/editorials"
                      className="text-sm font-medium text-blue-600 hover:text-blue-700"
                    >
                      All Editorials →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* MSC Hub Dropdown */}
            <div className="relative">
              <button
                className="text-gray-700 hover:text-blue-600 transition-colors flex items-center font-medium"
                onMouseEnter={() => handleDropdownToggle('msc-hub')}
              >
                MSC Hub
                <svg
                  className="ml-1 h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {activeDropdown === 'msc-hub' && (
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 py-6">
                  <div className="px-6">
                    <div className="space-y-2">
                      <Link
                        href="/tools"
                        className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      >
                        Tools
                      </Link>
                      <Link
                        href="/msc-hub/forms"
                        className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      >
                        Forms
                      </Link>
                      <Link
                        href="/msc-hub/policies"
                        className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      >
                        Policies, Instructions and CMPIs
                      </Link>
                      <Link
                        href="/common-requests"
                        className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      >
                        Common Needs and Requests
                      </Link>
                      <Link
                        href="/msc-hub/neo-help"
                        className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      >
                        NEO Help and Cadets
                      </Link>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 mt-4 pt-4 px-6">
                    <Link
                      href="/msc-hub"
                      className="text-sm font-medium text-blue-600 hover:text-blue-700"
                    >
                      MSC Hub Home →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Professional Network Dropdown */}
            <div className="relative">
              <button
                className="text-gray-700 hover:text-blue-600 transition-colors flex items-center font-medium"
                onMouseEnter={() => handleDropdownToggle('network')}
              >
                Professional Network
                <svg
                  className="ml-1 h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {activeDropdown === 'network' && (
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-6">
                  <div className="px-6">
                    <div className="space-y-2">
                      <Link
                        href="/financial"
                        className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      >
                        Financial
                      </Link>
                      <Link
                        href="/retirement"
                        className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      >
                        Retirement
                      </Link>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 mt-4 pt-4 px-6">
                    <Link
                      href="/network"
                      className="text-sm font-medium text-blue-600 hover:text-blue-700"
                    >
                      Professional Network →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Shop - External Link */}
            <a
              href="https://civsail.com/products"
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
              target="_blank"
              rel="noopener noreferrer"
            >
              Shop
            </a>
          </nav>

          {/* Mobile Menu Button - Larger touch target */}
          <div className="lg:hidden flex items-center justify-center py-2">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-3 text-gray-700 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Open menu"
            >
              <svg
                className="h-7 w-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <MobileNav open={mobileMenuOpen} setOpen={setMobileMenuOpen} />
    </header>
  );
}
