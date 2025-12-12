'use client';

import { useState } from 'react';
import Link from 'next/link';

type SectionId = 'careers' | 'sectors';

type Tile = {
  title: string;
  description: string;
  icon: string;
  href: string;
  chips?: string[];
  tone?: 'blue' | 'green' | 'purple' | 'amber' | 'red' | 'slate';
};

function toneClasses(tone: Tile['tone'] = 'slate') {
  const map: Record<NonNullable<Tile['tone']>, { bg: string; border: string; text: string; pill: string }> = {
    blue: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-900',
      pill: 'bg-blue-100 text-blue-800',
    },
    green: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-900',
      pill: 'bg-green-100 text-green-800',
    },
    purple: {
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      text: 'text-purple-900',
      pill: 'bg-purple-100 text-purple-800',
    },
    amber: {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      text: 'text-amber-900',
      pill: 'bg-amber-100 text-amber-800',
    },
    red: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-900',
      pill: 'bg-red-100 text-red-800',
    },
    slate: {
      bg: 'bg-gray-50',
      border: 'border-gray-200',
      text: 'text-gray-900',
      pill: 'bg-gray-100 text-gray-700',
    },
  };
  return map[tone];
}

function TileCard({ tile }: { tile: Tile }) {
  const t = toneClasses(tile.tone);

  return (
    <Link
      href={tile.href}
      className={`group block rounded-xl border-2 ${t.border} ${t.bg} p-6 hover:shadow-lg transition-shadow`}
    >
      <div className="flex items-start gap-4">
        <div className="text-3xl leading-none">{tile.icon}</div>
        <div className="flex-1">
          <h3 className={`text-xl font-bold ${t.text} group-hover:underline`}>
            {tile.title}
          </h3>
          <p className="mt-2 text-gray-700 leading-relaxed">{tile.description}</p>

          {tile.chips && tile.chips.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {tile.chips.slice(0, 8).map((chip) => (
                <span
                  key={chip}
                  className={`text-xs font-medium px-2 py-1 rounded-full ${t.pill}`}
                >
                  {chip}
                </span>
              ))}
              {tile.chips.length > 8 && (
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-white/60 text-gray-700 border border-gray-200">
                  +{tile.chips.length - 8} more
                </span>
              )}
            </div>
          )}

          <div className="mt-5 text-sm font-medium text-gray-700">
            Learn more <span className="inline-block group-hover:translate-x-0.5 transition-transform">→</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function CareersAndSectorsPage() {
  const [activeSection, setActiveSection] = useState<SectionId>('careers');

  // ----------------------------
  // Careers (what you do onboard)
  // ----------------------------
  const careerTiles: Tile[] = [
    {
      title: 'Deck Officer',
      icon: '🧭',
      tone: 'blue',
      href: '/guides/careers/deck-officer',
      description:
        'Navigation, shiphandling, cargo ops, watchstanding, leadership. The mate-to-master track.',
      chips: ['3/M', '2/M', 'C/M', 'Master', 'Pilotage (later)'],
    },
    {
      title: 'Engine Officer',
      icon: '⚙️',
      tone: 'green',
      href: '/guides/careers/engine-officer',
      description:
        'Propulsion, power generation, maintenance, troubleshooting. The assistant-to-chief engineer track.',
      chips: ['3AE', '2AE', '1AE', 'Chief', 'ETO (sometimes)'],
    },
    {
      title: 'Non-Officer Deck',
      icon: '🪢',
      tone: 'purple',
      href: '/guides/careers/non-officer-deck',
      description:
        'Hands-on deck seamanship, mooring, maintenance, cargo support. The AB-to-bosun world.',
      chips: ['OS', 'AB', 'Bosun', 'Dayworker'],
    },
    {
      title: 'Non-Officer Engine',
      icon: '🔧',
      tone: 'amber',
      href: '/guides/careers/non-officer-engine',
      description:
        'Mechanical support, rounds, oiling, repairs. The QMED / oiler path into engineering.',
      chips: ['Wiper', 'Oiler', 'QMED', 'Electrician (varies)'],
    },
    {
      title: 'Other Positions',
      icon: '📦',
      tone: 'slate',
      href: '/guides/careers/other-positions',
      description:
        'Supply, purser/admin, radio, stewards, specialty roles. Some exist only in certain sectors.',
      chips: ['Supply', 'Purser', 'Radio', 'Steward Dept', 'Research tech (NOAA)'],
    },
  ];

  // ----------------------------
  // Sectors (where you sail)
  // ----------------------------
  const sectorTiles: Tile[] = [
    {
      title: 'Government',
      icon: '🇺🇸',
      tone: 'red',
      href: '/guides/sectors/government',
      description:
        'Federal missions and structured employment. Great for stability, benefits, and unique operations.',
      chips: ['MSC', 'NOAA'],
    },
    {
      title: 'Commercial Deep Sea',
      icon: '🚢',
      tone: 'blue',
      href: '/guides/sectors/commercial-deep-sea',
      description:
        'Large ships on global routes. Union and contract paths. Often the “classic” merchant marine image.',
      chips: ['Union', 'CONMAR', 'RoRo', 'Tanker', 'LNG', 'Container', 'Bulk'],
    },
    {
      title: 'Offshore Oil Rigs',
      icon: '🛢️',
      tone: 'amber',
      href: '/guides/sectors/offshore-oil-rigs',
      description:
        'Rig-side work and specialized operations. High intensity, market cycles, and niche requirements.',
      chips: ['MODU', 'Drillship', 'Semisub', 'Jackup'],
    },
    {
      title: 'Offshore Supply Vessels',
      icon: '⚓',
      tone: 'green',
      href: '/guides/sectors/offshore-supply-vessels',
      description:
        'OSVs supporting offshore operations. Shorter hitches, hands-on work, often DP-heavy.',
      chips: ['OSV', 'DP', 'Gulf', 'Cargo runs', 'Platform support'],
    },
    {
      title: 'Tug Boats',
      icon: '🚤',
      tone: 'purple',
      href: '/guides/sectors/tug-boats',
      description:
        'High-skill boat handling close to home. Schedules can be stable. Strong regional demand.',
      chips: ['ATB', 'Ship assist', 'Harbor', 'Coastal tug'],
    },
    {
      title: 'Barges',
      icon: '🟫',
      tone: 'slate',
      href: '/guides/sectors/barges',
      description:
        'Inland and coastal cargo work. Often paired with tugs or towboats, with distinct lifestyle tradeoffs.',
      chips: ['Inland', 'Coastal', 'Towboat', 'Petroleum', 'Dry cargo'],
    },
    {
      title: 'Ferries',
      icon: '⛴️',
      tone: 'blue',
      href: '/guides/sectors/ferries',
      description:
        'Regular routes and predictable schedules. Often regional. Great fit for stability and home time.',
      chips: ['Commuter', 'Vehicle ferry', 'Public agencies'],
    },
    {
      title: 'Cruise Ships',
      icon: '🛳️',
      tone: 'purple',
      href: '/guides/sectors/cruise-ships',
      description:
        'Passenger operations and hotel-style service. Unique culture, travel, and long workdays.',
      chips: ['Hospitality', 'Passenger safety', 'Entertainment'],
    },
    {
      title: 'Yachts',
      icon: '🛥️',
      tone: 'green',
      href: '/guides/sectors/yachts',
      description:
        'Lifestyle-driven sector with big variability. Networking matters. Can be great or chaotic.',
      chips: ['Private', 'Charter', 'Networking', 'High variability'],
    },
    {
      title: 'Fishing Boats',
      icon: '🎣',
      tone: 'amber',
      href: '/guides/sectors/fishing-boats',
      description:
        'Hard, seasonal, high-risk work with high upside in the right fisheries. Not for tourists.',
      chips: ['Seasonal', 'High risk', 'High reward'],
    },
    {
      title: 'Pilots',
      icon: '🧑‍✈️',
      tone: 'red',
      href: '/guides/sectors/pilots',
      description:
        'Local knowledge and shiphandling at the highest level. Not a shortcut, but a serious track.',
      chips: ['Apprenticeship', 'Local waters', 'Competitive'],
    },
  ];

  const sections = [
    { id: 'careers' as const, title: 'Careers', icon: '🧑‍🔧' },
    { id: 'sectors' as const, title: 'Sectors', icon: '🗺️' },
  ];

  const activeTitle =
    activeSection === 'careers' ? 'Careers' : 'Sectors';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-blue-900 via-slate-800 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6">
              Careers & Sectors
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 leading-relaxed">
              Two different questions: <span className="font-semibold">what you do onboard</span> and{' '}
              <span className="font-semibold">where you sail</span>. Click any tile to go deeper.
            </p>
            <div className="flex items-center justify-center space-x-4 text-sm text-blue-200">
              <span>🧭 Career tracks</span>
              <span>•</span>
              <span>🗺️ Industry sectors</span>
              <span>•</span>
              <span>🎓 Beginner Friendly</span>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
              <h3 className="font-semibold text-gray-900 mb-4">
                On this page
              </h3>
              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full text-left px-3 py-2 rounded-md transition-colors flex items-center space-x-2 ${
                      activeSection === section.id
                        ? 'bg-blue-100 text-blue-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <span>{section.icon}</span>
                    <span className="text-sm">{section.title}</span>
                  </button>
                ))}
              </nav>

              <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-700 leading-relaxed">
                  New to all of this? Start with{' '}
                  <Link href="/guides/maritime-101" className="text-blue-700 font-medium hover:underline">
                    Maritime 101
                  </Link>
                  .
                </p>
              </div>
            </div>
          </div>

          {/* Main */}
          <div className="lg:w-3/4">
            <div className="bg-white rounded-lg shadow-lg">
              <div className="p-8 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">{activeSection === 'careers' ? '🧑‍🔧' : '🗺️'}</span>
                  <h2 className="text-3xl font-bold text-gray-900">
                    {activeTitle}
                  </h2>
                </div>
                <p className="mt-4 text-lg text-gray-700 leading-relaxed">
                  {activeSection === 'careers'
                    ? 'Pick the onboard role that matches your interests. Each track has different credentials, lifestyle, and upgrade paths.'
                    : 'Pick the part of the maritime world you want to learn about. Each sector has different schedules, pay patterns, and career ceilings.'}
                </p>
              </div>

              {/* Careers */}
              {activeSection === 'careers' && (
                <div className="p-8">
                  <div className="grid md:grid-cols-2 gap-6">
                    {careerTiles.map((tile) => (
                      <TileCard key={tile.title} tile={tile} />
                    ))}
                  </div>

                  <div className="mt-10 bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold text-blue-900 mb-2">
                      Quick note
                    </h3>
                    <p className="text-blue-800 leading-relaxed">
                      Your <strong>career</strong> is the job you do onboard. Your <strong>sector</strong> is the environment you do it in.
                      Same license, totally different lifestyle depending on where you sail.
                    </p>
                  </div>
                </div>
              )}

              {/* Sectors */}
              {activeSection === 'sectors' && (
                <div className="p-8">
                  <div className="grid md:grid-cols-2 gap-6">
                    {sectorTiles.map((tile) => (
                      <TileCard key={tile.title} tile={tile} />
                    ))}
                  </div>

                  <div className="mt-10 bg-gray-50 border border-gray-200 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Want a recommendation?
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      If you’re not sure where you fit, take the homepage quiz and we’ll point you toward a few sectors that match your goals.
                    </p>
                  </div>
                </div>
              )}

              {/* Footer CTA */}
              <div className="p-8 border-t border-gray-100">
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-8 text-white text-center">
                  <h3 className="text-2xl font-bold mb-3">
                    Want a personalized path?
                  </h3>
                  <p className="text-lg mb-6 opacity-90">
                    Create an account to save your interests, track credentials, and build a career roadmap.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                      href="/signup"
                      className="bg-white text-blue-800 font-semibold px-6 py-3 rounded-full hover:bg-blue-50 transition-colors"
                    >
                      Create free account
                    </Link>
                    <Link
                      href="/guides/maritime-101"
                      className="bg-white/15 border border-white/30 text-white font-semibold px-6 py-3 rounded-full hover:bg-white/20 transition-colors"
                    >
                      Start with Maritime 101
                    </Link>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
