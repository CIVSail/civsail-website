/**
 * @file app/ports/middle-east/page.tsx
 * @description Middle East region port landing page
 *
 * @purpose Show the scope of MSC mariner travel to the Middle East and invite
 *          community contributions to build comprehensive port guides.
 */

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
  flag: string;
  subtitle: string;
  description: string;
  ports?: PortButton[];
  colorClass: string;
}

const ports: PortData[] = [
  {
    id: 'uae',
    name: 'United Arab Emirates',
    flag: '🇦🇪',
    subtitle: 'Strategic Gulf Hub',
    description:
      'The UAE serves as a critical logistics and resupply hub in the Persian Gulf, with world-class port facilities and extensive amenities for visiting mariners.',
    colorClass: 'uae-card',
    ports: [
      { id: 'dubai', name: 'Dubai' },
      { id: 'fujairah', name: 'Fujairah' },
    ],
  },
  {
    id: 'saudi-arabia',
    name: 'Saudi Arabia',
    flag: '🇸🇦',
    subtitle: 'Red Sea Gateway',
    description:
      'Saudi Arabia provides key port access on both the Red Sea and Persian Gulf coasts, supporting regional maritime operations and logistics.',
    colorClass: 'saudi-card',
    ports: [
      { id: 'jeddah', name: 'Jeddah' },
    ],
  },
  {
    id: 'oman',
    name: 'Oman',
    flag: '🇴🇲',
    subtitle: 'Gulf of Oman Access',
    description:
      'Oman offers strategic ports at the entrance to the Persian Gulf, with a long maritime tradition and modern facilities for commercial and naval vessels.',
    colorClass: 'oman-card',
    ports: [
      { id: 'duqum', name: 'Duqum' },
      { id: 'salalah', name: 'Salalah' },
    ],
  },
  {
    id: 'bahrain',
    name: 'Kingdom of Bahrain',
    flag: '🇧🇭',
    subtitle: '5th Fleet Headquarters',
    description:
      'Bahrain hosts the U.S. Naval Support Activity and serves as headquarters for the U.S. 5th Fleet, making it a frequent destination for MSC vessels.',
    colorClass: 'bahrain-card',
    ports: [
      { id: 'bahrain', name: 'Bahrain' },
    ],
  },
];

export default function MiddleEastPorts() {
  const router = useRouter();

  const navigateToPort = (countryId: string, portId?: string) => {
    if (portId) {
      router.push(`/ports/middle-east/${countryId}/${portId}`);
    } else {
      router.push(`/ports/middle-east/${countryId}`);
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
    <div className="min-h-screen bg-gradient-to-br from-amber-900 via-yellow-800 to-orange-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 text-white">
          <Link
            href="/ports"
            className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-lg border border-white/30 text-white px-6 py-3 rounded-full font-medium transition-all duration-300 hover:bg-white/30 hover:-translate-x-1 mb-8"
          >
            ← Back to Ports
          </Link>
          <h1 className="text-5xl font-bold mb-4 text-shadow">Middle East Ports</h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Strategic maritime gateways in the Persian Gulf, Red Sea, and Gulf of Oman
            supporting 5th Fleet operations
          </p>
        </div>

        {/* Ports Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {ports.map((port, index) => (
            <div
              key={port.id}
              className={`port-card ${
                port.colorClass
              } bg-gradient-to-br backdrop-blur-lg border border-white/20 rounded-3xl p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl opacity-0 translate-y-5 relative overflow-hidden group cursor-pointer min-h-96`}
              onClick={() => !port.ports && navigateToPort(port.id)}
            >
              {/* Gradient line on hover */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-orange-500 transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />

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
                  <span className="text-2xl">{port.flag}</span>
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

              {/* Ports Section */}
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

        .uae-card {
          background: linear-gradient(
            135deg,
            rgba(22, 101, 52, 0.18) 0%,
            rgba(239, 68, 68, 0.15) 100%
          );
        }

        .saudi-card {
          background: linear-gradient(
            135deg,
            rgba(22, 101, 52, 0.22) 0%,
            rgba(16, 185, 129, 0.15) 100%
          );
        }

        .oman-card {
          background: linear-gradient(
            135deg,
            rgba(185, 28, 28, 0.18) 0%,
            rgba(22, 101, 52, 0.15) 100%
          );
        }

        .bahrain-card {
          background: linear-gradient(
            135deg,
            rgba(185, 28, 28, 0.20) 0%,
            rgba(244, 63, 94, 0.15) 100%
          );
        }
      `}</style>
    </div>
  );
}
