'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface PortData {
  id: string;
  name: string;
  state: string;
  description: string;
  stats: {
    stat1: { value: string; label: string };
    stat2: { value: string; label: string };
    stat3: { value: string; label: string };
  };
}

const ports: PortData[] = [
  {
    id: 'virginia',
    name: 'Norfolk',
    state: 'Virginia',
    description:
      "One of the world's largest naval stations and a major commercial port on the East Coast, serving as a critical hub for military and civilian shipping operations.",
    stats: {
      stat1: { value: 'Major', label: 'Naval Base' },
      stat2: { value: 'East Coast', label: 'Location' },
      stat3: { value: 'Deep Water', label: 'Harbor' },
    },
  },
  {
    id: 'new-jersey',
    name: 'Earle',
    state: 'New Jersey',
    description:
      'Naval Weapons Station Earle serves as a strategic ammunition depot and pier facility, crucial for Navy fleet operations and logistics support.',
    stats: {
      stat1: { value: 'Military', label: 'Primary Use' },
      stat2: { value: 'Atlantic', label: 'Ocean' },
      stat3: { value: 'Secure', label: 'Facility' },
    },
  },
  {
    id: 'california',
    name: 'San Diego',
    state: 'California',
    description:
      'Home to the largest naval fleet in the world and a thriving commercial port, connecting the Pacific Coast with global maritime networks.',
    stats: {
      stat1: { value: 'Largest', label: 'Naval Fleet' },
      stat2: { value: 'Pacific', label: 'Coast' },
      stat3: { value: 'Year Round', label: 'Operations' },
    },
  },
  {
    id: 'alabama',
    name: 'Mobile',
    state: 'Alabama',
    description:
      "The Gulf Coast's premier port facility, handling diverse cargo operations and serving as a vital link for inland waterway transportation systems.",
    stats: {
      stat1: { value: 'Gulf Coast', label: 'Gateway' },
      stat2: { value: 'Inland', label: 'Waterways' },
      stat3: { value: 'Diverse', label: 'Cargo' },
    },
  },
  {
    id: 'south-carolina',
    name: 'Charleston',
    state: 'South Carolina',
    description:
      "A historic port city with modern container facilities, serving as the Southeast's gateway for international trade and naval operations.",
    stats: {
      stat1: { value: 'Historic', label: 'Port City' },
      stat2: { value: 'Southeast', label: 'Gateway' },
      stat3: { value: 'Container', label: 'Hub' },
    },
  },
  {
    id: 'pennsylvania',
    name: 'Philadelphia',
    state: 'Pennsylvania',
    description:
      'A major Mid-Atlantic port with extensive shipyard facilities, serving both commercial shipping and naval vessel maintenance operations.',
    stats: {
      stat1: { value: 'Mid-Atlantic', label: 'Region' },
      stat2: { value: 'Shipyard', label: 'Facilities' },
      stat3: { value: 'Delaware', label: 'River' },
    },
  },
  {
    id: 'washington',
    name: 'Seattle',
    state: 'Washington',
    description:
      "The Pacific Northwest's primary maritime hub, connecting North America with Asia-Pacific trade routes and serving diverse naval operations.",
    stats: {
      stat1: { value: 'Pacific NW', label: 'Hub' },
      stat2: { value: 'Asia-Pacific', label: 'Trade' },
      stat3: { value: 'Puget Sound', label: 'Location' },
    },
  },
];

export default function UnitedStatesPorts() {
  const router = useRouter();

  const navigateToPort = (portId: string) => {
    router.push(`/ports/united-states/${portId}`);
  };

  useEffect(() => {
    // Add loading animations
    const cards = document.querySelectorAll('.port-card');
    cards.forEach((card, index) => {
      setTimeout(() => {
        (card as HTMLElement).style.opacity = '1';
        (card as HTMLElement).style.transform = 'translateY(0)';
      }, index * 100);
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-purple-800 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 text-white">
          <Link
            href="/ports"
            className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-lg border border-white/30 text-white px-6 py-3 rounded-full font-medium transition-all duration-300 hover:bg-white/30 hover:-translate-x-1 mb-8"
          >
            ← Back to Ports
          </Link>
          <h1 className="text-5xl font-bold mb-4 text-shadow">
            United States Ports
          </h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Discover major maritime gateways across America's coastlines, from
            the Atlantic to the Pacific and Gulf of Mexico
          </p>
        </div>

        {/* Ports Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {ports.map((port, index) => (
            <div
              key={port.id}
              className="port-card bg-white rounded-3xl p-8 shadow-xl cursor-pointer transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl opacity-0 translate-y-5 relative overflow-hidden group"
              onClick={() => navigateToPort(port.id)}
            >
              {/* Hover gradient overlay */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />

              {/* Port Icon */}
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <span className="text-white text-3xl">⚓</span>
              </div>

              {/* Port Info */}
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {port.name}
              </h2>
              <p className="text-gray-600 font-medium mb-4">{port.state}</p>
              <p className="text-gray-700 leading-relaxed mb-6">
                {port.description}
              </p>

              {/* Stats */}
              <div className="flex justify-between pt-6 border-t border-gray-100">
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600">
                    {port.stats.stat1.value}
                  </div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide">
                    {port.stats.stat1.label}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600">
                    {port.stats.stat2.value}
                  </div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide">
                    {port.stats.stat2.label}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600">
                    {port.stats.stat3.value}
                  </div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide">
                    {port.stats.stat3.label}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .text-shadow {
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }
      `}</style>
    </div>
  );
}
