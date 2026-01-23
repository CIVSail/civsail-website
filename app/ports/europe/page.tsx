/**
 * @file app/ports/europe/page.tsx
 * @description Europe region port landing page
 *
 * @purpose Show the scope of MSC mariner travel across Europe and invite
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
  country: string;
  subtitle: string;
  description: string;
  ports?: PortButton[];
  colorClass: string;
}

const ports: PortData[] = [
  {
    id: 'spain',
    name: 'Spain',
    country: 'Spain',
    subtitle: 'Mediterranean & Atlantic Gateway',
    description:
      'From the strategic naval base at Rota to historic Mediterranean ports, Spain offers diverse port calls along both its Atlantic and Mediterranean coasts.',
    colorClass: 'spain-card',
    ports: [
      { id: 'rota', name: 'Rota' },
      { id: 'cadiz', name: 'Cadiz' },
      { id: 'barcelona', name: 'Barcelona' },
      { id: 'mallorca', name: 'Mallorca' },
    ],
  },
  {
    id: 'greece',
    name: 'Greece',
    country: 'Greece',
    subtitle: 'Eastern Mediterranean Hub',
    description:
      'Souda Bay serves as a critical NATO facility in the eastern Mediterranean, providing strategic access to the Aegean and beyond.',
    colorClass: 'greece-card',
    ports: [{ id: 'souda-bay', name: 'Souda Bay (Theo la Neckie)' }],
  },
  {
    id: 'italy',
    name: 'Italy',
    country: 'Italy',
    subtitle: 'Heart of the Mediterranean',
    description:
      'Italy offers extensive port options from the major naval facility at Augusta Bay to cruise terminals and historic harbors throughout the peninsula.',
    colorClass: 'italy-card',
    ports: [
      { id: 'augusta-bay', name: 'Augusta Bay (Ben)' },
      { id: 'trieste', name: 'Trieste' },
      { id: 'genoa', name: 'Genoa' },
      { id: 'naples', name: 'Naples' },
      { id: 'civitavecchia', name: 'Civitavecchia' },
    ],
  },
  {
    id: 'croatia',
    name: 'Croatia',
    country: 'Croatia',
    subtitle: 'Adriatic Coastline',
    description:
      'Croatia\'s stunning Adriatic coast features historic ports and modern facilities, from ancient Dubrovnik to the industrial hub of Rijeka.',
    colorClass: 'croatia-card',
    ports: [
      { id: 'rijeka', name: 'Rijeka' },
      { id: 'zadar', name: 'Zadar' },
      { id: 'dubrovnik', name: 'Dubrovnik' },
      { id: 'split', name: 'Split' },
    ],
  },
  {
    id: 'slovenia',
    name: 'Slovenia',
    country: 'Slovenia',
    subtitle: 'Adriatic Access Point',
    description:
      'Koper serves as Slovenia\'s primary maritime gateway, providing efficient access to Central European markets.',
    colorClass: 'slovenia-card',
    ports: [{ id: 'koper', name: 'Koper' }],
  },
  {
    id: 'uk',
    name: 'United Kingdom',
    country: 'United Kingdom',
    subtitle: 'Historic Maritime Nation',
    description:
      'The UK\'s Channel ports have served mariners for centuries, with Southampton and Portsmouth remaining vital naval and commercial hubs.',
    colorClass: 'uk-card',
    ports: [
      { id: 'southampton', name: 'Southampton' },
      { id: 'portsmouth', name: 'Portsmouth' },
    ],
  },
  {
    id: 'scotland',
    name: 'Scotland',
    country: 'Scotland',
    subtitle: 'North Atlantic Operations',
    description:
      'Scotland\'s rugged coastline hosts facilities supporting North Atlantic and Arctic operations, including the naval base at Faslane.',
    colorClass: 'scotland-card',
    ports: [{ id: 'faslane', name: 'Faslane (Lockstriven)' }],
  },
  {
    id: 'sweden',
    name: 'Sweden',
    country: 'Sweden',
    subtitle: 'Baltic Gateway',
    description:
      'Gothenburg stands as Scandinavia\'s largest port, providing critical access to Baltic Sea operations and Northern European trade routes.',
    colorClass: 'sweden-card',
    ports: [{ id: 'gothenburg', name: 'Gothenburg' }],
  },
  {
    id: 'germany',
    name: 'Germany',
    country: 'Germany',
    subtitle: 'Baltic Naval Hub',
    description:
      'Kiel has been a major naval port for over a century, hosting the famous Kiel Canal and serving as a key Baltic Sea operations center.',
    colorClass: 'germany-card',
    ports: [{ id: 'kiel', name: 'Kiel' }],
  },
  {
    id: 'norway',
    name: 'Norway',
    country: 'Norway',
    subtitle: 'North Sea & Arctic Access',
    description:
      'Oslo provides access to Norwegian waters and serves as a gateway for operations extending into the North Sea and Arctic regions.',
    colorClass: 'norway-card',
    ports: [{ id: 'oslo', name: 'Oslo' }],
  },
  {
    id: 'poland',
    name: 'Poland',
    country: 'Poland',
    subtitle: 'Southern Baltic Port',
    description:
      'Świnoujście serves as Poland\'s primary Baltic gateway, supporting regional maritime operations and commercial shipping.',
    colorClass: 'poland-card',
    ports: [{ id: 'swinoujscie', name: 'Świnoujście' }],
  },
];

export default function EuropePorts() {
  const router = useRouter();

  const navigateToPort = (countryId: string, portId?: string) => {
    if (portId) {
      router.push(`/ports/europe/${countryId}/${portId}`);
    } else {
      router.push(`/ports/europe/${countryId}`);
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
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-indigo-900 to-blue-950 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 text-white">
          <Link
            href="/ports"
            className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-lg border border-white/30 text-white px-6 py-3 rounded-full font-medium transition-all duration-300 hover:bg-white/30 hover:-translate-x-1 mb-8"
          >
            ← Back to Ports
          </Link>
          <h1 className="text-5xl font-bold mb-4 text-shadow">Europe Ports</h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            From the Mediterranean to the Baltic, European ports serve as critical
            hubs for 6th Fleet and NATO maritime operations
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
                port.ports && port.ports.length > 3 ? 'min-h-[28rem]' : 'min-h-96'
              }`}
              onClick={() => !port.ports && navigateToPort(port.id)}
            >
              {/* Gradient line on hover */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-indigo-500 transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />

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

        .spain-card {
          background: linear-gradient(
            135deg,
            rgba(239, 68, 68, 0.15) 0%,
            rgba(234, 179, 8, 0.12) 50%,
            rgba(239, 68, 68, 0.08) 100%
          );
        }

        .greece-card {
          background: linear-gradient(
            135deg,
            rgba(59, 130, 246, 0.15) 0%,
            rgba(14, 165, 233, 0.08) 100%
          );
        }

        .italy-card {
          background: linear-gradient(
            135deg,
            rgba(34, 197, 94, 0.15) 0%,
            rgba(100, 116, 139, 0.10) 50%,
            rgba(239, 68, 68, 0.08) 100%
          );
        }

        .croatia-card {
          background: linear-gradient(
            135deg,
            rgba(239, 68, 68, 0.15) 0%,
            rgba(59, 130, 246, 0.12) 50%,
            rgba(239, 68, 68, 0.08) 100%
          );
        }

        .slovenia-card {
          background: linear-gradient(
            135deg,
            rgba(59, 130, 246, 0.15) 0%,
            rgba(239, 68, 68, 0.08) 100%
          );
        }

        .uk-card {
          background: linear-gradient(
            135deg,
            rgba(30, 58, 138, 0.20) 0%,
            rgba(239, 68, 68, 0.12) 50%,
            rgba(30, 58, 138, 0.15) 100%
          );
        }

        .scotland-card {
          background: linear-gradient(
            135deg,
            rgba(59, 130, 246, 0.18) 0%,
            rgba(99, 102, 241, 0.12) 100%
          );
        }

        .sweden-card {
          background: linear-gradient(
            135deg,
            rgba(59, 130, 246, 0.15) 0%,
            rgba(234, 179, 8, 0.12) 50%,
            rgba(59, 130, 246, 0.08) 100%
          );
        }

        .germany-card {
          background: linear-gradient(
            135deg,
            rgba(51, 65, 85, 0.18) 0%,
            rgba(239, 68, 68, 0.12) 50%,
            rgba(234, 179, 8, 0.10) 100%
          );
        }

        .norway-card {
          background: linear-gradient(
            135deg,
            rgba(239, 68, 68, 0.15) 0%,
            rgba(59, 130, 246, 0.12) 50%,
            rgba(239, 68, 68, 0.08) 100%
          );
        }

        .poland-card {
          background: linear-gradient(
            135deg,
            rgba(100, 116, 139, 0.15) 0%,
            rgba(239, 68, 68, 0.12) 100%
          );
        }
      `}</style>
    </div>
  );
}
