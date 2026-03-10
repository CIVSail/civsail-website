/**
 * @file ComingSoonPortPage.tsx
 * @description Reusable port page for ports that don't yet have full guides
 *
 * @purpose Community-driven port pages that invite mariners to contribute
 *          firsthand knowledge. Dark-themed to match the site aesthetic.
 *          Structure: Hero → Intro → Submission Form → Map → Related Ports
 *
 * @example
 * <ComingSoonPortPage
 *   portName="Cape Town"
 *   country="South Africa"
 *   countrySlug="south-africa"
 *   countryFlag="🇿🇦"
 *   region="Africa"
 *   regionSlug="africa"
 *   fleet="5th Fleet AOR"
 *   coordinates={{ lat: -33.9249, lng: 18.4241 }}
 * />
 */

'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { ChevronRight, ExternalLink } from 'lucide-react';
import PortSubmissionForm from '@/components/ports/PortSubmissionForm';
import { getPortTheme } from '@/lib/utils/port-themes';

interface ComingSoonPortPageProps {
  portName: string;
  country: string;
  countrySlug: string;
  countryFlag: string;
  region: string;
  regionSlug: string;
  fleet: string;
  coordinates: { lat: number; lng: number };
  breadcrumbs: { label: string; href: string }[];
  portType?: string;
  relatedPorts?: Array<{
    name: string;
    href: string;
    status: 'complete' | 'coming-soon';
  }>;
}

export default function ComingSoonPortPage({
  portName,
  country,
  countrySlug,
  countryFlag,
  region,
  regionSlug,
  fleet,
  coordinates,
  breadcrumbs,
  portType = 'Port',
  relatedPorts,
}: ComingSoonPortPageProps) {
  const theme = getPortTheme(countrySlug);
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  // Mapbox initialization — empty deps array to run once on mount
  // (matches the working pattern in Guam/Sasebo full port pages)
  useEffect(() => {
    if (map.current) return;
    if (!mapContainer.current) return;

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';
    if (!mapboxgl.accessToken) {
      console.warn('Mapbox token not found');
      return;
    }

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      center: [coordinates.lng, coordinates.lat],
      zoom: 13,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add port marker
    new mapboxgl.Marker({ color: '#3b82f6', scale: 1.2 })
      .setLngLat([coordinates.lng, coordinates.lat])
      .setPopup(
        new mapboxgl.Popup({ offset: 25 }).setHTML(
          `<div class="p-2">
            <h3 class="font-bold text-lg">${portName}</h3>
            <p class="text-sm text-gray-600">${country}</p>
          </div>`
        )
      )
      .addTo(map.current);

    return () => {
      map.current?.remove();
      map.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${coordinates.lat},${coordinates.lng}`;

  return (
    <div className="min-h-screen bg-[#0a0f1a]">
      {/* Hero Section */}
      <div className={`bg-gradient-to-br ${theme.heroGradient} py-16 relative`}>
        {/* Subtle pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm mb-8 text-white/60">
            {breadcrumbs.map((crumb, index) => (
              <div key={crumb.href} className="flex items-center gap-2">
                {index > 0 && <ChevronRight className="w-4 h-4" />}
                <Link
                  href={crumb.href}
                  className="hover:text-white/90 transition-colors"
                >
                  {crumb.label}
                </Link>
              </div>
            ))}
          </nav>

          {/* Port Title */}
          <div className="flex items-center gap-4 mb-6">
            <span className="text-5xl md:text-6xl">{countryFlag}</span>
            <div>
              <h1 className="font-heading text-4xl md:text-5xl font-bold text-white tracking-tight">
                {portName}
              </h1>
              <p className="text-lg text-white/70 mt-1">{country}</p>
            </div>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-3">
            <span className="px-4 py-1.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-sm font-medium text-white/90">
              {fleet}
            </span>
            <span className="px-4 py-1.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-sm font-medium text-white/90">
              {portType}
            </span>
            <span className="px-4 py-1.5 bg-blue-500/15 backdrop-blur-sm border border-blue-400/25 rounded-full text-sm font-medium text-blue-300">
              Community-Built Guide
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Brief Intro */}
        <div className="mb-12">
          <p className="font-body text-lg text-white/50 leading-relaxed max-w-3xl">
            This port page is being built by the community. CIVSail port guides
            come from real experiences shared by crew who&apos;ve actually been
            there — not from people who&apos;ve never set foot on a ship.
            If you&apos;ve been to <span className="text-white/80 font-medium">{portName}</span>,
            your knowledge helps the next crew that pulls in.
          </p>
        </div>

        {/* Submission Form */}
        <div className="mb-16">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-white mb-2 tracking-tight">
            Share What You Know
          </h2>
          <p className="text-slate-400 mb-8 max-w-2xl">
            Restaurants, bars, getting around, safety tips, insider knowledge —
            anything that helps. Every contribution gets credited.
          </p>

          <PortSubmissionForm portName={portName} portRegion={region} />
        </div>

        {/* Map */}
        <div className="mb-16">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-white mb-6 tracking-tight">
            Location
          </h2>
          <div className="rounded-xl overflow-hidden border border-white/10">
            <div ref={mapContainer} className="w-full h-96" />
            <div className="p-4 bg-white/[0.03] border-t border-white/10">
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-medium text-sm transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Open in Google Maps
              </a>
            </div>
          </div>
        </div>

        {/* Related Ports */}
        {relatedPorts && relatedPorts.length > 0 && (
          <div>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-white mb-6 tracking-tight">
              Other Ports in {region}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
              {relatedPorts.map((port) => (
                <Link
                  key={port.href}
                  href={port.href}
                  className="bg-white/[0.03] border border-white/10 rounded-lg p-4 hover:border-blue-400/30 hover:bg-white/[0.05] transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-200 group-hover:text-white transition-colors">
                      {port.name}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        port.status === 'complete'
                          ? 'bg-green-500/15 text-green-400 border border-green-500/25'
                          : 'bg-blue-500/15 text-blue-400 border border-blue-500/25'
                      }`}
                    >
                      {port.status === 'complete' ? 'Complete' : 'In Progress'}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
