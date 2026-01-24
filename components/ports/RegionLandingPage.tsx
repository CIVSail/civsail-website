/**
 * @file RegionLandingPage.tsx
 * @description Reusable region landing page component for port regions
 *
 * @purpose Create regional overview pages that:
 *          1. Show the full scope of ports in a region (impressive!)
 *          2. Display transparent progress stats (builds trust)
 *          3. Organize ports by country with visual hierarchy
 *          4. Invite community contributions
 *
 * @example
 * <RegionLandingPage
 *   regionName="Africa"
 *   regionSlug="africa"
 *   fleet="5th Fleet AOR"
 *   description="Strategic ports across the African continent..."
 *   ports={africaPorts}
 *   theme={getPortTheme('africa')}
 * />
 */

'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Send, TrendingUp } from 'lucide-react';
import { PortTheme } from '@/lib/utils/port-themes';

export interface Port {
  name: string;
  slug: string;
  country: string;
  countrySlug: string;
  countryFlag: string;
  coordinates: { lat: number; lng: number };
  status: 'complete' | 'coming-soon';
}

interface RegionLandingPageProps {
  regionName: string;
  regionSlug: string;
  fleet: string;
  description: string;
  ports: Port[];
  theme: PortTheme;
}

export default function RegionLandingPage({
  regionName,
  regionSlug,
  fleet,
  description,
  ports,
  theme,
}: RegionLandingPageProps) {
  const router = useRouter();

  // Group ports by country
  const portsByCountry = ports.reduce((acc, port) => {
    if (!acc[port.country]) {
      acc[port.country] = {
        countrySlug: port.countrySlug,
        countryFlag: port.countryFlag,
        ports: [],
      };
    }
    acc[port.country].ports.push(port);
    return acc;
  }, {} as Record<string, { countrySlug: string; countryFlag: string; ports: Port[] }>);

  // Calculate stats
  const totalPorts = ports.length;
  const totalCountries = Object.keys(portsByCountry).length;
  const completePorts = ports.filter((p) => p.status === 'complete').length;
  const inProgressPorts = ports.filter((p) => p.status === 'coming-soon').length;
  const progressPercentage = totalPorts > 0 ? (completePorts / totalPorts) * 100 : 0;

  // Email subjects
  const shareIntelSubject = `Port Intel for ${regionName} Region`;
  const shareIntelBody = `I'd like to share information about a port in ${regionName}:%0D%0A%0D%0APort Name:%0D%0AWhat I'd like to share:%0D%0A`;

  const suggestPortSubject = `Suggest New Port in ${regionName}`;
  const suggestPortBody = `I'd like to suggest adding this port to ${regionName}:%0D%0A%0D%0APort Name:%0D%0ACountry:%0D%0AWhy this port matters:%0D%0A`;

  // Navigate to port page
  const navigateToPort = (countrySlug: string, portSlug: string) => {
    router.push(`/ports/${regionSlug}/${countrySlug}/${portSlug}`);
  };

  // Animate cards on load
  useEffect(() => {
    const cards = document.querySelectorAll('.country-card');
    cards.forEach((card, index) => {
      setTimeout(() => {
        (card as HTMLElement).style.opacity = '1';
        (card as HTMLElement).style.transform = 'translateY(0)';
      }, index * 100);
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className={`bg-gradient-to-br ${theme.heroGradient} text-${theme.heroText} py-16`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/ports"
            className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-lg border border-white/30 text-white px-6 py-3 rounded-full font-medium transition-all duration-300 hover:bg-white/30 hover:-translate-x-1 mb-8"
          >
            ← Back to Ports
          </Link>

          <h1 className="text-5xl font-bold mb-4">{regionName} Ports</h1>
          <p className="text-xl text-white/90 max-w-3xl mb-6">{description}</p>

          <div className="flex flex-wrap gap-4">
            <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg px-6 py-3">
              <div className="text-3xl font-bold">{totalCountries}</div>
              <div className="text-sm text-white/80">
                {totalCountries === 1 ? 'Country' : 'Countries'}
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg px-6 py-3">
              <div className="text-3xl font-bold">{totalPorts}</div>
              <div className="text-sm text-white/80">
                {totalPorts === 1 ? 'Port' : 'Ports'}
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg px-6 py-3">
              <div className="text-3xl font-bold">{completePorts}</div>
              <div className="text-sm text-white/80">Complete Guides</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Mission Statement */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12 border-l-4 border-blue-600">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Mapping the Mariner's World
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Mariners don't just visit tourist destinations—they go everywhere. From major
            naval bases to remote anchorages, CIVSail is building the definitive collection
            of port guides written by the people who actually go there.
          </p>
          <p className="text-gray-700 leading-relaxed">
            This region shows <strong>{totalPorts} ports</strong> across{' '}
            <strong>{totalCountries} {totalCountries === 1 ? 'country' : 'countries'}</strong>.
            Some guides are complete, others are in progress. All of them need your input.
          </p>
        </div>

        {/* Progress Stats */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 mb-12">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            <h3 className="text-xl font-bold text-gray-900">Build Progress</h3>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-1">{totalPorts}</div>
              <div className="text-sm text-gray-600">Ports Mapped</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-1">{completePorts}</div>
              <div className="text-sm text-gray-600">Complete Guides</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-yellow-600 mb-1">{inProgressPorts}</div>
              <div className="text-sm text-gray-600">In Progress</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-green-500 h-full transition-all duration-500 rounded-full"
              style={{ width: `${Math.max(5, progressPercentage)}%` }}
            />
          </div>
          <p className="text-sm text-gray-600 mt-2">
            {progressPercentage.toFixed(0)}% complete
          </p>
        </div>

        {/* Country Grid */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Ports by Country</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {Object.entries(portsByCountry).map(([countryName, data], index) => (
              <div
                key={countryName}
                className="country-card bg-white rounded-2xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-all duration-300 opacity-0 translate-y-5"
              >
                {/* Country Header */}
                <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-200">
                  <span className="text-5xl">{data.countryFlag}</span>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{countryName}</h3>
                    <p className="text-sm text-gray-600">
                      {data.ports.length} {data.ports.length === 1 ? 'port' : 'ports'}
                    </p>
                  </div>
                </div>

                {/* Port List */}
                <div className="space-y-3">
                  {data.ports.map((port) => (
                    <button
                      key={port.slug}
                      onClick={() => navigateToPort(data.countrySlug, port.slug)}
                      className="w-full flex items-center justify-between bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-lg p-4 transition-all group"
                    >
                      <span className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {port.name}
                      </span>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs px-3 py-1 rounded-full ${
                            port.status === 'complete'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          {port.status === 'complete' ? 'Complete' : 'In Progress'}
                        </span>
                        <span className="text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all">
                          →
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-8 md:p-12 text-white">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Help Us Build These Guides</h2>
            <p className="text-lg text-blue-100 mb-8">
              Every port on this list exists because mariners go there. Help us build the
              guides they deserve. Your experience, recommendations, and local knowledge
              make these guides valuable for the next crew.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={`mailto:support@civsail.com?subject=${encodeURIComponent(shareIntelSubject)}&body=${shareIntelBody}`}
                className="inline-flex items-center justify-center gap-2 bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-lg font-semibold transition-colors shadow-lg"
              >
                <Send className="w-5 h-5" />
                Share Port Intel
              </a>
              <a
                href={`mailto:support@civsail.com?subject=${encodeURIComponent(suggestPortSubject)}&body=${suggestPortBody}`}
                className="inline-flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-8 py-4 rounded-lg font-semibold transition-colors border-2 border-white/20"
              >
                <Send className="w-5 h-5" />
                Suggest a New Port
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
