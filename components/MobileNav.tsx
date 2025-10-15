'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

export default function MobileNav() {
  const [open, setOpen] = useState(false);

  const links = [
    { href: '/', label: 'Home' },
    { href: '/ports', label: 'Ports' },
    { href: '/tools', label: 'Tools' },
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/login', label: 'Sign In' },
  ];

  return (
    <>
      {/* Hamburger button - only visible on mobile */}
      <button
        onClick={() => setOpen(true)}
        className="md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded"
        aria-label="Open menu"
      >
        <Menu className="w-6 h-6" />
      </button>

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
          fixed top-0 right-0 h-full w-64 bg-white z-50 shadow-xl
          transform transition-transform duration-300 ease-in-out
          ${open ? 'translate-x-0' : 'translate-x-full'}
          md:hidden
        `}
      >
        {/* Close button */}
        <div className="flex justify-end p-4">
          <button
            onClick={() => setOpen(false)}
            className="p-2 text-gray-700 hover:bg-gray-100 rounded"
            aria-label="Close menu"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex flex-col gap-2 px-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="py-3 px-4 text-lg font-medium text-gray-700 hover:bg-gray-100 rounded transition"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}