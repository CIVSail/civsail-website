/**
 * @file ComingSoonPortPage.tsx
 * @description Reusable "coming soon" port page component for ports being built
 *
 * @purpose Create professional, community-driven port pages that:
 *          1. Show the SCOPE of where MSC mariners travel (impressive!)
 *          2. Invite mariner community to help build guides collaboratively
 *          3. Are form-ready for future Google Form embeds
 *          4. Use positive framing ("building together" vs "under construction")
 *
 * @example
 * <ComingSoonPortPage
 *   portName="Cape Town"
 *   country="South Africa"
 *   countrySlug="south-africa"
 *   countryFlag="🇿🇦"
 *   fleet="5th Fleet AOR"
 *   coordinates={{ lat: -33.9249, lng: 18.4241 }}
 * />
 */

'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import {
  ChevronRight,
  Utensils,
  Wine,
  Car,
  AlertTriangle,
  Lightbulb,
  Mail,
  MapPin,
  ExternalLink,
  Send,
} from 'lucide-react';
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

  // Mapbox initialization
  useEffect(() => {
    if (map.current) return; // Already initialized
    if (!mapContainer.current) return;

    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token) {
      console.warn('Mapbox token not found');
      return;
    }

    mapboxgl.accessToken = token;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      center: [coordinates.lng, coordinates.lat],
      zoom: 13,
    });

    // Add port marker
    new mapboxgl.Marker({ color: '#ef4444', scale: 1.2 })
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
    };
  }, [coordinates, portName, country]);

  // Email subjects
  const portIntelSubject = `Port Intel: ${portName}, ${country}`;
  const portIntelBody = `Port: ${portName}%0D%0ACountry: ${country}%0D%0A%0D%0AWhat would you like to share?%0D%0A%0D%0A`;

  const suggestPortSubject = `Suggest New Port to Add`;
  const suggestPortBody = `I'd like to suggest adding this port:%0D%0A%0D%0APort Name:%0D%0ACountry:%0D%0ARegion:%0D%0A%0D%0AWhy this port matters:%0D%0A`;

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${coordinates.lat},${coordinates.lng}`;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className={`bg-gradient-to-br ${theme.heroGradient} text-${theme.heroText} py-16`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm mb-8 text-white/80">
            {breadcrumbs.map((crumb, index) => (
              <div key={crumb.href} className="flex items-center gap-2">
                {index > 0 && <ChevronRight className="w-4 h-4" />}
                <Link
                  href={crumb.href}
                  className="hover:text-white transition-colors"
                >
                  {crumb.label}
                </Link>
              </div>
            ))}
          </nav>

          {/* Port Title */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-6xl">{countryFlag}</span>
                <div>
                  <h1 className="text-5xl font-bold mb-2">{portName}</h1>
                  <p className="text-xl text-white/90">{country}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mt-6">
                <span className={`px-4 py-2 bg-${theme.accent}/20 backdrop-blur-sm border border-white/30 rounded-full text-sm font-medium`}>
                  {fleet}
                </span>
                <span className="px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full text-sm font-medium">
                  {portType}
                </span>
                <span className={`px-4 py-2 bg-${theme.secondary}/20 backdrop-blur-sm border border-white/30 rounded-full text-sm font-medium`}>
                  Community-Built Guide
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Mission Statement Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12 border-l-4 border-blue-600">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Built BY Mariners, FOR Mariners
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            CIVSail port guides aren't written by people who've never set foot on a ship.
            They're built from real experiences shared by crew who've actually been there.
          </p>
          <p className="text-gray-700 leading-relaxed">
            <strong>{portName}</strong> is on our radar, and we need your help to make this guide great.
            Your experience matters—whether it's finding the best meal after a long watch,
            knowing which bars are worth the trip, or understanding what to watch out for.
          </p>
        </div>

        {/* What We're Building Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            What We're Building
          </h2>
          <p className="text-gray-600 mb-8">
            Here's what a complete port guide includes. Help us fill in the details:
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <Utensils className="w-8 h-8" />,
                title: 'Restaurants',
                description: 'Local spots and familiar comfort food',
                color: 'red',
              },
              {
                icon: <Wine className="w-8 h-8" />,
                title: 'Bars & Nightlife',
                description: 'From chill hangs to lively scenes',
                color: 'purple',
              },
              {
                icon: <Car className="w-8 h-8" />,
                title: 'Transportation',
                description: 'How to get around efficiently',
                color: 'blue',
              },
              {
                icon: <AlertTriangle className="w-8 h-8" />,
                title: 'Safety Intel',
                description: 'What to watch out for',
                color: 'yellow',
              },
              {
                icon: <Lightbulb className="w-8 h-8" />,
                title: 'Insider Tips',
                description: 'The stuff you only learn by going',
                color: 'green',
              },
              {
                icon: <MapPin className="w-8 h-8" />,
                title: 'Local Context',
                description: 'Culture, currency, and customs',
                color: 'teal',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <div className={`text-${item.color}-600 mb-4`}>{item.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                <p className="text-blue-600 text-sm font-medium">
                  Help us fill this in →
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Contribution Section - PRIMARY CTA */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 md:p-12 mb-12">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Share What You Know
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed mb-8">
              Been to {portName}? Your experience is valuable. Whether it's the best place
              to grab a meal, a bar worth checking out, transportation tips, or things to
              watch out for—if you've been there, you know things that would help the next crew.
            </p>

            {/* Form Placeholder - Ready for Google Form Embed */}
            <div className="bg-white border-2 border-dashed border-gray-300 rounded-xl p-8">
              <Mail className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600 mb-2 font-medium">
                Google Form coming soon
              </p>
              <p className="text-sm text-gray-500 mb-6">
                For now, share your intel via email
              </p>

              {/* TODO: Replace with embedded Google Form */}
              {/* <iframe src="GOOGLE_FORM_URL" width="100%" height="600px" /> */}

              <a
                href={`mailto:support@civsail.com?subject=${encodeURIComponent(portIntelSubject)}&body=${portIntelBody}`}
                className={`inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold transition-colors shadow-lg hover:shadow-xl`}
              >
                <Send className="w-5 h-5" />
                Share Your {portName} Intel
              </a>
            </div>
          </div>
        </div>

        {/* Don't See Your Port Section */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-lg p-6 mb-12">
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Don't See Your Port?
          </h3>
          <p className="text-gray-700 mb-4">
            Mariners go everywhere. MSC ships visit ports around the world that aren't
            on our list yet. If you've been somewhere we haven't covered, let us know—we'll add it.
          </p>
          <a
            href={`mailto:support@civsail.com?subject=${encodeURIComponent(suggestPortSubject)}&body=${suggestPortBody}`}
            className="inline-flex items-center gap-2 text-yellow-700 hover:text-yellow-900 font-semibold transition-colors"
          >
            <Send className="w-4 h-4" />
            Suggest a Port to Add
          </a>
        </div>

        {/* Interactive Map */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Location</h2>
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div ref={mapContainer} className="w-full h-96" />
            <div className="p-4 border-t border-gray-200">
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
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
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Other Ports in {region}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {relatedPorts.map((port) => (
                <Link
                  key={port.href}
                  href={port.href}
                  className="bg-white rounded-lg shadow-md p-4 border border-gray-200 hover:shadow-lg hover:border-blue-300 transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {port.name}
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        port.status === 'complete'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-blue-100 text-blue-700'
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
