'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';

export default function Navigation() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient();

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
              {/* Search Bar */}
              <div className="hidden md:flex items-center">
                <div className="relative">
                  <input
                    type="text"
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
                </div>
              </div>

              {/* Mobile Search Icon */}
              <button className="md:hidden text-gray-700 hover:text-slate-900 transition-colors">
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
                      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.621 5.367 11.988 11.988 11.988s11.988-5.367 11.988-11.988C24.005 5.367 18.638.001 12.017.001zM8.449 20.312c-3.66 0-6.625-2.964-6.625-6.625s2.964-6.625 6.625-6.625 6.625 2.964 6.625 6.625-2.965 6.625-6.625 6.625zm7.718-10.8c-.678 0-1.228-.55-1.228-1.228s.55-1.228 1.228-1.228 1.228.55 1.228 1.228-.55 1.228-1.228 1.228zm-3.731 5.472c-2.042 0-3.697-1.655-3.697-3.697s1.655-3.697 3.697-3.697 3.697 1.655 3.697 3.697-1.655 3.697-3.697 3.697z" />
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
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
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

            {/* Guides Dropdown */}
            <div className="relative">
              <button
                className="text-gray-700 hover:text-blue-600 transition-colors flex items-center font-medium"
                onMouseEnter={() => handleDropdownToggle('guides')}
              >
                Guides
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

              {activeDropdown === 'guides' && (
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 py-6">
                  <div className="px-6">
                    <div className="space-y-2">
                      <Link
                        href="/guides/maritime-101"
                        className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      >
                        Maritime 101
                      </Link>
                      <Link
                        href="/guides/credentials-training-renewal" // ← change this to match your folder
                        className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      >
                        Credentials, Training and Renewal
                      </Link>
                      <Link
                        href="/guides/careers"
                        className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      >
                        Careers and Sectors
                      </Link>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 mt-4 pt-4 px-6">
                    <Link
                      href="/guides"
                      className="text-sm font-medium text-blue-600 hover:text-blue-700"
                    >
                      All Guides →
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
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 py-6">
                  <div className="px-6 pb-2">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">
                      MSC Tools
                    </h3>
                    <div className="space-y-2">
                      <Link
                        href="/tools/pay-calculator"
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
                        href="/tools/travel-claim"
                        className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      >
                        Travel Claim Generator
                      </Link>
                      <Link
                        href="/tools/msc-tools/leave-chit-calculator"
                        className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      >
                        MSC Tools → Leave Chit Calculator
                      </Link>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 mt-4 pt-4 px-6">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">
                      Mariner Tools
                    </h3>
                    <div className="space-y-2">
                      <Link
                        href="/tools/credential-management"
                        className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      >
                        Credential Management
                      </Link>
                      <Link
                        href="/tools/promotion-tracker"
                        className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      >
                        Promotion Tracker
                      </Link>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 mt-4 pt-4 px-6">
                    <Link
                      href="/tools"
                      className="text-sm font-medium text-blue-600 hover:text-blue-700"
                    >
                      View All Tools →
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
                      href="/ports/map"
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

                  <div className="border-t border-gray-100 mt-4 pt-4 px-6">
                    <Link
                      href="/ports"
                      className="text-sm font-medium text-blue-600 hover:text-blue-700"
                    >
                      All Ports →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Ships by Sector Dropdown */}
            <div className="relative">
              <button
                className="text-gray-700 hover:text-blue-600 transition-colors flex items-center font-medium"
                onMouseEnter={() => handleDropdownToggle('ships')}
              >
                Ships by Sector
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
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-200 py-6">
                  <div className="px-6">
                    <div className="space-y-2">
                      <Link
                        href="/ships/msc"
                        className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      >
                        MSC
                      </Link>
                      <Link
                        href="/ships/noaa"
                        className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      >
                        NOAA
                      </Link>
                      <Link
                        href="/ships/deep-sea"
                        className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      >
                        Deep Sea
                      </Link>
                      <Link
                        href="/ships/tug-barge"
                        className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      >
                        Tug and Barge
                      </Link>
                      <Link
                        href="/ships/oil-rig"
                        className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      >
                        Oil Rig
                      </Link>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 mt-4 pt-4 px-6">
                    <Link
                      href="/ships"
                      className="text-sm font-medium text-blue-600 hover:text-blue-700"
                    >
                      All Sectors →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Blogs Dropdown */}
            <div className="relative">
              <button
                className="text-gray-700 hover:text-blue-600 transition-colors flex items-center font-medium"
                onMouseEnter={() => handleDropdownToggle('blogs')}
              >
                Blogs
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

              {activeDropdown === 'blogs' && (
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-200 py-6">
                  <div className="px-6">
                    <div className="space-y-2">
                      <Link
                        href="/blogs/from-the-team"
                        className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      >
                        From the Team
                      </Link>
                      <Link
                        href="/blogs/final-muster"
                        className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      >
                        The Final Muster
                      </Link>
                      <Link
                        href="/blogs/mariner-profiles"
                        className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      >
                        Mariner Profiles
                      </Link>
                      <Link
                        href="/blogs/essays-advice"
                        className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      >
                        Essays and Advice
                      </Link>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 mt-4 pt-4 px-6">
                    <Link
                      href="/blogs"
                      className="text-sm font-medium text-blue-600 hover:text-blue-700"
                    >
                      All Blogs →
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
                        href="/msc-hub/common-needs"
                        className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      >
                        Common Needs and Requests
                      </Link>
                      <Link
                        href="/msc-hub/policies"
                        className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      >
                        Policies, Instructions and CMPIs
                      </Link>
                      <Link
                        href="/msc-hub/forms"
                        className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      >
                        Forms
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
                        href="/network/financial"
                        className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      >
                        Financial
                      </Link>
                      <Link
                        href="/network/retirement"
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

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center justify-center py-3">
            <button className="text-gray-700 hover:text-blue-600">
              <svg
                className="h-6 w-6"
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
    </header>
  );
}
