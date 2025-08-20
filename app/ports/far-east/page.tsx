'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface PortButton {
  id: string;
  name: string;
}

interface PortData {
  id: string;
  name: string;
  country: string;
  subtitle: string;
  description: string;
  ports?: PortButton[];
  colorClass: string;
}

const ports: PortData[] = [
  {
    id: 'japan',
    name: 'Japan',
    country: 'Japan',
    subtitle: 'Maritime Powerhouse',
    description:
      'Major maritime hubs including strategic naval bases and commercial ports throughout the Japanese archipelago.',
    colorClass: 'japan-card',
    ports: [
      { id: 'sasebo', name: 'Sasebo Naval Base' },
      { id: 'yokosuka', name: 'Yokosuka Naval Base' },
      { id: 'yokohama', name: 'Yokohama Port' },
    ],
  },
  {
    id: 'singapore',
    name: 'Singapore',
    country: 'Singapore',
    subtitle: 'Global Maritime Center',
    description:
      "One of the world's busiest ports and the maritime center of Southeast Asia, controlling critical shipping lanes.",
    colorClass: 'singapore-card',
    ports: [{ id: 'sembawang', name: 'Sembawang Shipyard' }],
  },
  {
    id: 'korea',
    name: 'Korea',
    country: 'South Korea',
    subtitle: 'Northeast Asia Hub',
    description:
      'Modern container ports and strategic locations connecting Northeast Asia with global shipping routes.',
    colorClass: 'korea-card',
    ports: [
      { id: 'busan', name: 'Busan Port' },
      { id: 'chinhae', name: 'Chinhae Naval Base' },
    ],
  },
  {
    id: 'thailand',
    name: 'Thailand',
    country: 'Thailand',
    subtitle: 'Southeast Asia Gateway',
    description:
      'Key Southeast Asian ports serving as important gateways for regional trade and naval operations.',
    colorClass: 'thailand-card',
    ports: [
      { id: 'sri-racha', name: 'Sri Racha Port' },
      { id: 'pattaya', name: 'Pattaya Port' },
    ],
  },
  {
    id: 'guam',
    name: 'Guam',
    country: 'US Territory',
    subtitle: 'Pacific Outpost',
    description:
      'Strategic US naval base in the Western Pacific, serving as a forward deployment location and refueling station for military and commercial vessels.',
    colorClass: 'guam-card',
  },
  {
    id: 'saipan',
    name: 'Saipan',
    country: 'CNMI',
    subtitle: 'Pacific Gateway',
    description:
      'Northern Mariana Islands port facility serving as a Pacific outpost for military logistics and civilian transportation in the region.',
    colorClass: 'saipan-card',
  },
  {
    id: 'diego-garcia',
    name: 'Diego Garcia',
    country: 'British Territory',
    subtitle: 'Strategic Atoll',
    description:
      'Highly strategic military atoll in the Indian Ocean, serving as a critical logistics and refueling station for naval operations.',
    colorClass: 'diego-garcia-card',
  },
  {
    id: 'malaysia',
    name: 'Malaysia',
    country: 'Malaysia',
    subtitle: 'Strait of Malacca',
    description:
      'Strategic ports along the Strait of Malacca, vital for international shipping and regional connectivity.',
    colorClass: 'malaysia-card',
  },
];

export default function AsianPorts() {
  const router = useRouter();

  const navigateToPort = (countryId: string, portId?: string) => {
    if (portId) {
      router.push(`/ports/far-east/${countryId}/${portId}`);
    } else {
      router.push(`/ports/far-east/${countryId}`);
    }
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
    <div className="min-h-screen bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-800 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 text-white">
          <Link
            href="/ports"
            className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-lg border border-white/30 text-white px-6 py-3 rounded-full font-medium transition-all duration-300 hover:bg-white/30 hover:-translate-x-1 mb-8"
          >
            ← Back to Ports
          </Link>
          <h1 className="text-5xl font-bold mb-4 text-shadow">Asian Ports</h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Explore vital maritime gateways across Asia and the Pacific, from
            bustling commercial hubs to strategic military outposts
          </p>
        </div>

        {/* Ports Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {ports.map((port, index) => (
            <div
              key={port.id}
              className={`port-card ${
                port.colorClass
              } bg-gradient-to-br backdrop-blur-lg border border-white/20 rounded-3xl p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl opacity-0 translate-y-5 relative overflow-hidden group cursor-pointer ${
                port.ports ? 'min-h-96' : 'min-h-80'
              }`}
              onClick={() => !port.ports && navigateToPort(port.id)}
            >
              {/* Gradient line on hover */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-teal-500 transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />

              {/* Floating particles */}
              <div
                className="absolute top-4 right-4 w-1 h-1 bg-white/40 rounded-full animate-pulse"
                style={{ animationDelay: `${index * 0.5}s` }}
              />
              <div
                className="absolute bottom-8 left-8 w-1 h-1 bg-white/40 rounded-full animate-pulse"
                style={{ animationDelay: `${index * 0.7}s` }}
              />
              <div
                className="absolute top-1/2 right-8 w-1 h-1 bg-white/40 rounded-full animate-pulse"
                style={{ animationDelay: `${index * 1.2}s` }}
              />

              {/* Card Header */}
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl flex items-center justify-center mr-4">
                  <span className="text-2xl">⚓</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">
                    {port.name}
                  </h2>
                  <p className="text-white/80 text-sm font-medium">
                    {port.subtitle}
                  </p>
                </div>
              </div>

              {/* Description */}
              <p className="text-white/85 leading-relaxed mb-6 text-sm">
                {port.description}
              </p>

              {/* Ports Section or Single Country Button */}
              {port.ports ? (
                <div className="flex-1">
                  <h3 className="text-white/90 font-semibold mb-4 text-sm uppercase tracking-wider border-b border-white/20 pb-2">
                    Available Ports
                  </h3>
                  <div className="space-y-3">
                    {port.ports.map((individualPort) => (
                      <button
                        key={individualPort.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigateToPort(port.id, individualPort.id);
                        }}
                        className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-3 text-white text-left transition-all duration-300 hover:bg-white/20 hover:translate-x-2 hover:border-white/40 group/button flex items-center justify-between"
                      >
                        <span className="font-medium text-sm">
                          {individualPort.name}
                        </span>
                        <span className="text-white/60 group-hover/button:text-white group-hover/button:translate-x-1 transition-all duration-300 text-sm">
                          →
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex items-end">
                  <div className="w-full bg-white/15 backdrop-blur-sm border border-white/30 rounded-xl p-4 text-center transition-all duration-300 hover:bg-white/25 hover:border-white/50">
                    <span className="text-white font-medium">
                      View {port.name} Details
                    </span>
                    <div className="text-white/70 text-sm mt-1">
                      Click to explore
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .text-shadow {
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .japan-card {
          background: linear-gradient(
            135deg,
            rgba(255, 107, 107, 0.15) 0%,
            rgba(255, 142, 83, 0.08) 100%
          );
        }

        .singapore-card {
          background: linear-gradient(
            135deg,
            rgba(116, 185, 255, 0.15) 0%,
            rgba(74, 144, 226, 0.08) 100%
          );
        }

        .korea-card {
          background: linear-gradient(
            135deg,
            rgba(130, 202, 157, 0.15) 0%,
            rgba(74, 194, 154, 0.08) 100%
          );
        }

        .thailand-card {
          background: linear-gradient(
            135deg,
            rgba(255, 193, 7, 0.15) 0%,
            rgba(255, 152, 0, 0.08) 100%
          );
        }

        .guam-card {
          background: linear-gradient(
            135deg,
            rgba(63, 81, 181, 0.15) 0%,
            rgba(48, 63, 159, 0.08) 100%
          );
        }

        .saipan-card {
          background: linear-gradient(
            135deg,
            rgba(156, 39, 176, 0.15) 0%,
            rgba(123, 31, 162, 0.08) 100%
          );
        }

        .diego-garcia-card {
          background: linear-gradient(
            135deg,
            rgba(76, 175, 80, 0.15) 0%,
            rgba(56, 142, 60, 0.08) 100%
          );
        }

        .malaysia-card {
          background: linear-gradient(
            135deg,
            rgba(233, 30, 99, 0.15) 0%,
            rgba(194, 24, 91, 0.08) 100%
          );
        }
      `}</style>
    </div>
  );
}
