'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, ChevronDown, ChevronRight } from 'lucide-react';

interface MobileNavProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function MobileNav({ open, setOpen }: MobileNavProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  // Reset expanded sections when menu closes
  useEffect(() => {
    if (!open) {
      setExpandedSection(null);
    }
  }, [open]);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Slide-out drawer */}
      <div
        className={`
          fixed top-0 right-0 h-full w-80 bg-white z-50 shadow-xl
          transform transition-transform duration-300 ease-in-out overflow-y-auto
          ${open ? 'translate-x-0' : 'translate-x-full'}
          md:hidden
        `}
      >
        {/* Close button */}
        <div className="flex justify-end p-4 border-b border-gray-100">
          <button
            onClick={() => setOpen(false)}
            className="p-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close menu"
          >
            <X className="w-7 h-7" />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex flex-col gap-1 p-4">
          {/* Home */}
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="py-3 px-4 text-base font-medium text-gray-700 hover:bg-gray-100 rounded transition"
          >
            Home
          </Link>

          {/* About Us */}
          <Link
            href="/about"
            onClick={() => setOpen(false)}
            className="py-3 px-4 text-base font-medium text-gray-700 hover:bg-gray-100 rounded transition"
          >
            About Us
          </Link>

          {/* Maritime 101 - Expandable */}
          <div className="border-t border-gray-100 mt-2 pt-2">
            <button
              onClick={() => toggleSection('maritime101')}
              className="w-full flex items-center justify-between py-3 px-4 text-base font-medium text-gray-700 hover:bg-gray-100 rounded transition"
            >
              Maritime 101
              {expandedSection === 'maritime101' ? (
                <ChevronDown className="w-5 h-5" />
              ) : (
                <ChevronRight className="w-5 h-5" />
              )}
            </button>

            {expandedSection === 'maritime101' && (
              <div className="ml-2 mt-1 space-y-1">
                {/* Start Here section */}
                <div className="px-4 py-2">
                  <div className="text-xs uppercase tracking-wide font-semibold text-gray-500 mb-2">
                    Start Here
                  </div>
                  <Link
                    href="/maritime-101/what-is-merchant-marine"
                    onClick={() => setOpen(false)}
                    className="block py-2 px-3 text-sm text-gray-700 hover:bg-gray-100 rounded transition"
                  >
                    What is the Merchant Marine?
                  </Link>
                </div>

                {/* Career Paths section */}
                <div className="px-4 py-2">
                  <div className="text-xs uppercase tracking-wide font-semibold text-gray-500 mb-2">
                    Career Paths
                  </div>
                  <Link
                    href="/maritime-101/careers-and-sectors"
                    onClick={() => setOpen(false)}
                    className="block py-2 px-3 text-sm text-gray-700 hover:bg-gray-100 rounded transition"
                  >
                    Careers & Sectors
                  </Link>
                  <Link
                    href="/maritime-101/life-at-sea"
                    onClick={() => setOpen(false)}
                    className="block py-2 px-3 text-sm text-gray-700 hover:bg-gray-100 rounded transition"
                  >
                    Life at Sea
                  </Link>
                </div>

                {/* Getting Started section */}
                <div className="px-4 py-2">
                  <div className="text-xs uppercase tracking-wide font-semibold text-gray-500 mb-2">
                    Getting Started
                  </div>
                  <Link
                    href="/maritime-101/training-and-entry"
                    onClick={() => setOpen(false)}
                    className="block py-2 px-3 text-sm text-gray-700 hover:bg-gray-100 rounded transition"
                  >
                    Training & Career Entry
                  </Link>
                  <Link
                    href="/maritime-101/credentials"
                    onClick={() => setOpen(false)}
                    className="block py-2 px-3 text-sm text-gray-700 hover:bg-gray-100 rounded transition"
                  >
                    Credentials & Licensing
                  </Link>
                </div>
              </div>
            )}
          </div>
{/* Tools - Expandable */}
          <div>
            <button
              onClick={() => toggleSection('tools')}
              className="w-full flex items-center justify-between py-3 px-4 text-base font-medium text-gray-700 hover:bg-gray-100 rounded transition"
            >
              Tools
              {expandedSection === 'tools' ? (
                <ChevronDown className="w-5 h-5" />
              ) : (
                <ChevronRight className="w-5 h-5" />
              )}
            </button>

            {expandedSection === 'tools' && (
              <div className="ml-2 mt-1 space-y-1 px-4">
                {/* MSC Tools Subheading */}
                <Link
                  href="/tools"
                  onClick={() => setOpen(false)}
                  className="block py-2 px-3 text-xs uppercase tracking-wide font-semibold text-gray-500 hover:text-blue-600 transition"
                >
                  MSC Tools →
                </Link>
                <Link
                  href="/tools/ship-pay-calculator"
                  onClick={() => setOpen(false)}
                  className="block py-2 px-3 text-sm text-gray-700 hover:bg-gray-100 rounded transition"
                >
                  Ship Pay Calculator
                </Link>
                <Link
                  href="/tools/pay-comparison"
                  onClick={() => setOpen(false)}
                  className="block py-2 px-3 text-sm text-gray-700 hover:bg-gray-100 rounded transition"
                >
                  Ship Pay Comparison
                </Link>
                <Link
                  href="/tools/leave-chit"
                  onClick={() => setOpen(false)}
                  className="block py-2 px-3 text-sm text-gray-700 hover:bg-gray-100 rounded transition"
                >
                  Leave Chit Generator
                </Link>
                <Link
                  href="/tools/travel-claim"
                  onClick={() => setOpen(false)}
                  className="block py-2 px-3 text-sm text-gray-700 hover:bg-gray-100 rounded transition"
                >
                  Travel Claim Calculator
                </Link>
              </div>
            )}
          </div>

          {/* Ships - Expandable */}
          <div>
            <button
              onClick={() => toggleSection('ships')}
              className="w-full flex items-center justify-between py-3 px-4 text-base font-medium text-gray-700 hover:bg-gray-100 rounded transition"
            >
              Ships
              {expandedSection === 'ships' ? (
                <ChevronDown className="w-5 h-5" />
              ) : (
                <ChevronRight className="w-5 h-5" />
              )}
            </button>

            {expandedSection === 'ships' && (
              <div className="ml-2 mt-1 space-y-1 px-4">
                <Link
                  href="/ships/msc"
                  onClick={() => setOpen(false)}
                  className="block py-2 px-3 text-sm text-gray-700 hover:bg-gray-100 rounded transition"
                >
                  MSC Fleet
                </Link>
                <Link
                  href="/ships/noaa"
                  onClick={() => setOpen(false)}
                  className="block py-2 px-3 text-sm text-gray-700 hover:bg-gray-100 rounded transition"
                >
                  NOAA Fleet
                </Link>
                <Link
                  href="/ships/deep-sea"
                  onClick={() => setOpen(false)}
                  className="block py-2 px-3 text-sm text-gray-700 hover:bg-gray-100 rounded transition"
                >
                  Deep Sea
                </Link>
                <Link
                  href="/ships/tug-barge"
                  onClick={() => setOpen(false)}
                  className="block py-2 px-3 text-sm text-gray-700 hover:bg-gray-100 rounded transition"
                >
                  Tug and Barge
                </Link>
                <Link
                  href="/ships/oil-rig"
                  onClick={() => setOpen(false)}
                  className="block py-2 px-3 text-sm text-gray-700 hover:bg-gray-100 rounded transition"
                >
                  Oil Rig
                </Link>
              </div>
            )}
          </div>

          {/* Ports - Expandable */}
          <div>
            <button
              onClick={() => toggleSection('ports')}
              className="w-full flex items-center justify-between py-3 px-4 text-base font-medium text-gray-700 hover:bg-gray-100 rounded transition"
            >
              Ports
              {expandedSection === 'ports' ? (
                <ChevronDown className="w-5 h-5" />
              ) : (
                <ChevronRight className="w-5 h-5" />
              )}
            </button>

            {expandedSection === 'ports' && (
              <div className="ml-2 mt-1 space-y-1 px-4">
                {/* Interactive Map link */}
                <Link
                  href="/ports/map"
                  onClick={() => setOpen(false)}
                  className="block py-2 px-3 text-sm text-blue-600 font-medium hover:bg-blue-50 rounded transition"
                >
                  🗺️ Interactive Map
                </Link>

                {/* Regions */}
                <div className="text-xs uppercase tracking-wide font-semibold text-gray-500 mt-3 mb-2 px-3">
                  By Region
                </div>
                <Link
                  href="/ports/united-states"
                  onClick={() => setOpen(false)}
                  className="block py-2 px-3 text-sm text-gray-700 hover:bg-gray-100 rounded transition"
                >
                  United States
                </Link>
                <Link
                  href="/ports/south-america"
                  onClick={() => setOpen(false)}
                  className="block py-2 px-3 text-sm text-gray-700 hover:bg-gray-100 rounded transition"
                >
                  South America
                </Link>
                <Link
                  href="/ports/europe"
                  onClick={() => setOpen(false)}
                  className="block py-2 px-3 text-sm text-gray-700 hover:bg-gray-100 rounded transition"
                >
                  Europe
                </Link>
                <Link
                  href="/ports/middle-east"
                  onClick={() => setOpen(false)}
                  className="block py-2 px-3 text-sm text-gray-700 hover:bg-gray-100 rounded transition"
                >
                  Middle East
                </Link>
                <Link
                  href="/ports/africa"
                  onClick={() => setOpen(false)}
                  className="block py-2 px-3 text-sm text-gray-700 hover:bg-gray-100 rounded transition"
                >
                  Africa
                </Link>
                <Link
                  href="/ports/far-east"
                  onClick={() => setOpen(false)}
                  className="block py-2 px-3 text-sm text-gray-700 hover:bg-gray-100 rounded transition"
                >
                  Far East
                </Link>
                <Link
                  href="/ports/australia"
                  onClick={() => setOpen(false)}
                  className="block py-2 px-3 text-sm text-gray-700 hover:bg-gray-100 rounded transition"
                >
                  Australia
                </Link>

                {/* All Ports link */}
                <Link
                  href="/ports"
                  onClick={() => setOpen(false)}
                  className="block py-2 px-3 text-sm text-blue-600 font-medium hover:bg-blue-50 rounded transition mt-2"
                >
                  All Ports →
                </Link>
              </div>
            )}
          </div>

          {/* Editorials - Expandable */}
          <div>
            <button
              onClick={() => toggleSection('editorials')}
              className="w-full flex items-center justify-between py-3 px-4 text-base font-medium text-gray-700 hover:bg-gray-100 rounded transition"
            >
              Editorials
              {expandedSection === 'editorials' ? (
                <ChevronDown className="w-5 h-5" />
              ) : (
                <ChevronRight className="w-5 h-5" />
              )}
            </button>

            {expandedSection === 'editorials' && (
              <div className="ml-2 mt-1 space-y-1 px-4">
                <Link
                  href="/editorials/soundings"
                  onClick={() => setOpen(false)}
                  className="block py-2 px-3 text-sm text-gray-700 hover:bg-gray-100 rounded transition"
                >
                  Soundings
                </Link>
                <Link
                  href="/editorials/final-muster"
                  onClick={() => setOpen(false)}
                  className="block py-2 px-3 text-sm text-gray-700 hover:bg-gray-100 rounded transition"
                >
                  The Final Muster
                </Link>
                <Link
                  href="/editorials/profiles"
                  onClick={() => setOpen(false)}
                  className="block py-2 px-3 text-sm text-gray-700 hover:bg-gray-100 rounded transition"
                >
                  Mariner Profiles
                </Link>
                <Link
                  href="/editorials"
                  onClick={() => setOpen(false)}
                  className="block py-2 px-3 text-sm text-blue-600 font-medium hover:bg-blue-50 rounded transition mt-2"
                >
                  All Editorials →
                </Link>
              </div>
            )}
          </div>

          {/* MSC Hub - Expandable */}
          <div className="border-t border-gray-100 mt-2 pt-2">
            <button
              onClick={() => toggleSection('mschub')}
              className="w-full flex items-center justify-between py-3 px-4 text-base font-medium text-gray-700 hover:bg-gray-100 rounded transition"
            >
              <span className="flex items-center gap-2">
                <span className="text-lg">🇺🇸</span>
                MSC Hub
              </span>
              {expandedSection === 'mschub' ? (
                <ChevronDown className="w-5 h-5" />
              ) : (
                <ChevronRight className="w-5 h-5" />
              )}
            </button>

            {expandedSection === 'mschub' && (
              <div className="ml-2 mt-1 space-y-1 px-4">
                <Link
                  href="/tools"
                  onClick={() => setOpen(false)}
                  className="block py-2 px-3 text-sm text-gray-700 hover:bg-gray-100 rounded transition"
                >
                  Tools
                </Link>
                <Link
                  href="/msc-hub/forms"
                  onClick={() => setOpen(false)}
                  className="block py-2 px-3 text-sm text-gray-700 hover:bg-gray-100 rounded transition"
                >
                  Forms
                </Link>
                <Link
                  href="/msc-hub/policies"
                  onClick={() => setOpen(false)}
                  className="block py-2 px-3 text-sm text-gray-700 hover:bg-gray-100 rounded transition"
                >
                  Policies, Instructions & CMPIs
                </Link>
                <Link
                  href="/msc-hub/common-needs"
                  onClick={() => setOpen(false)}
                  className="block py-2 px-3 text-sm text-gray-700 hover:bg-gray-100 rounded transition"
                >
                  Common Needs and Requests
                </Link>
                <Link
                  href="/msc-hub/neo-help"
                  onClick={() => setOpen(false)}
                  className="block py-2 px-3 text-sm text-gray-700 hover:bg-gray-100 rounded transition"
                >
                  NEO Help and Cadets
                </Link>
                <Link
                  href="/msc-hub"
                  onClick={() => setOpen(false)}
                  className="block py-2 px-3 text-sm text-blue-600 font-medium hover:bg-blue-50 rounded transition mt-2"
                >
                  MSC Hub Home →
                </Link>
              </div>
            )}
          </div>

          {/* Professional Network - Expandable */}
          <div>
            <button
              onClick={() => toggleSection('network')}
              className="w-full flex items-center justify-between py-3 px-4 text-base font-medium text-gray-700 hover:bg-gray-100 rounded transition"
            >
              Professional Network
              {expandedSection === 'network' ? (
                <ChevronDown className="w-5 h-5" />
              ) : (
                <ChevronRight className="w-5 h-5" />
              )}
            </button>

            {expandedSection === 'network' && (
              <div className="ml-2 mt-1 space-y-1 px-4">
                <Link
                  href="/network/financial"
                  onClick={() => setOpen(false)}
                  className="block py-2 px-3 text-sm text-gray-700 hover:bg-gray-100 rounded transition"
                >
                  Financial
                </Link>
                <Link
                  href="/retirement"
                  onClick={() => setOpen(false)}
                  className="block py-2 px-3 text-sm text-gray-700 hover:bg-gray-100 rounded transition"
                >
                  Retirement
                </Link>
                <Link
                  href="/network"
                  onClick={() => setOpen(false)}
                  className="block py-2 px-3 text-sm text-blue-600 font-medium hover:bg-blue-50 rounded transition mt-2"
                >
                  Professional Network →
                </Link>
              </div>
            )}
          </div>

          {/* Shop */}
          <a
            href="https://civsail.com/products"
            target="_blank"
            rel="noopener noreferrer"
            className="py-3 px-4 text-base font-medium text-gray-700 hover:bg-gray-100 rounded transition"
          >
            Shop
          </a>

          {/* Auth buttons */}
          <div className="border-t border-gray-100 mt-4 pt-4">
            <Link
              href="/dashboard"
              onClick={() => setOpen(false)}
              className="block py-3 px-4 text-center bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
            >
              Dashboard
            </Link>
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="block py-3 px-4 mt-2 text-center border-2 border-blue-600 text-blue-600 hover:bg-blue-50 rounded-lg font-medium transition"
            >
              Sign In
            </Link>
          </div>
        </nav>
      </div>
    </>
  );
}
