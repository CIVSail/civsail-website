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
                <Link
                  href="/tools/pay-calculator"
                  onClick={() => setOpen(false)}
                  className="block py-2 px-3 text-sm text-gray-700 hover:bg-gray-100 rounded transition"
                >
                  Pay Calculator
                </Link>
                <Link
                  href="/tools/leave-chit"
                  onClick={() => setOpen(false)}
                  className="block py-2 px-3 text-sm text-gray-700 hover:bg-gray-100 rounded transition"
                >
                  Leave Chit Generator
                </Link>
                <Link
                  href="/tools/travel-voucher"
                  onClick={() => setOpen(false)}
                  className="block py-2 px-3 text-sm text-gray-700 hover:bg-gray-100 rounded transition"
                >
                  Travel Voucher
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
                <div className="py-2 px-3 text-sm text-gray-400">
                  NOAA Fleet (coming soon)
                </div>
                <div className="py-2 px-3 text-sm text-gray-400">
                  Commercial (coming soon)
                </div>
              </div>
            )}
          </div>

          {/* Ports */}
          <Link
            href="/ports"
            onClick={() => setOpen(false)}
            className="py-3 px-4 text-base font-medium text-gray-700 hover:bg-gray-100 rounded transition"
          >
            Ports
          </Link>

          {/* Blogs - Expandable */}
          <div>
            <button
              onClick={() => toggleSection('blogs')}
              className="w-full flex items-center justify-between py-3 px-4 text-base font-medium text-gray-700 hover:bg-gray-100 rounded transition"
            >
              Blogs
              {expandedSection === 'blogs' ? (
                <ChevronDown className="w-5 h-5" />
              ) : (
                <ChevronRight className="w-5 h-5" />
              )}
            </button>
            
            {expandedSection === 'blogs' && (
              <div className="ml-2 mt-1 space-y-1 px-4">
                <Link
                  href="/blogs/from-the-team"
                  onClick={() => setOpen(false)}
                  className="block py-2 px-3 text-sm text-gray-700 hover:bg-gray-100 rounded transition"
                >
                  From the Team
                </Link>
                <Link
                  href="/blogs/final-muster"
                  onClick={() => setOpen(false)}
                  className="block py-2 px-3 text-sm text-gray-700 hover:bg-gray-100 rounded transition"
                >
                  The Final Muster
                </Link>
                <Link
                  href="/blogs/mariner-profiles"
                  onClick={() => setOpen(false)}
                  className="block py-2 px-3 text-sm text-gray-700 hover:bg-gray-100 rounded transition"
                >
                  Mariner Profiles
                </Link>
                <Link
                  href="/blogs/essays-advice"
                  onClick={() => setOpen(false)}
                  className="block py-2 px-3 text-sm text-gray-700 hover:bg-gray-100 rounded transition"
                >
                  Essays and Advice
                </Link>
              </div>
            )}
          </div>

          {/* MSC Hub */}
          <div className="border-t border-gray-100 mt-2 pt-2">
            <Link
              href="/msc-hub"
              onClick={() => setOpen(false)}
              className="py-3 px-4 text-base font-medium text-gray-700 hover:bg-gray-100 rounded transition flex items-center gap-2"
            >
              <span className="text-xl">🇺🇸</span>
              MSC Hub
            </Link>
          </div>

          {/* Professional Network */}
          <Link
            href="/network"
            onClick={() => setOpen(false)}
            className="py-3 px-4 text-base font-medium text-gray-700 hover:bg-gray-100 rounded transition"
          >
            Professional Network
          </Link>

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