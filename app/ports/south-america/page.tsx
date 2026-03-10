/**
 * @file app/ports/south-america/page.tsx
 * @description South America & Caribbean region port landing page
 *
 * @purpose Show the scope of MSC mariner travel to South America and the Caribbean
 *          and invite community contributions to build comprehensive port guides.
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
    id: 'puerto-rico',
    name: 'Puerto Rico',
    flag: '🇵🇷',
    subtitle: 'U.S. Territory in the Caribbean',
    description:
      'Puerto Rico serves as a strategic hub in the Caribbean, with San Juan offering excellent facilities and a unique blend of American convenience and Caribbean culture.',
    colorClass: 'puerto-rico-card',
    ports: [
      { id: 'san-juan', name: 'San Juan' },
    ],
  },
  {
    id: 'colombia',
    name: 'Colombia',
    flag: '🇨🇴',
    subtitle: 'Caribbean Gateway to South America',
    description:
      'Colombia\'s Caribbean coast features Cartagena, a historic port city with modern facilities and rich colonial heritage that makes it a memorable stop for MSC mariners.',
    colorClass: 'colombia-card',
    ports: [
      { id: 'cartagena', name: 'Cartagena' },
    ],
  },
  {
    id: 'guatemala',
    name: 'Guatemala',
    flag: '🇬🇹',
    subtitle: 'Central American Hub',
    description:
      'Guatemala provides access to Central American markets through Puerto Barrios on the Caribbean coast, connecting MSC operations to regional logistics networks.',
    colorClass: 'guatemala-card',
    ports: [
      { id: 'puerto-barrios', name: 'Puerto Barrios' },
    ],
  },
  {
    id: 'honduras',
    name: 'Honduras',
    flag: '🇭🇳',
    subtitle: 'Caribbean Coast Operations',
    description:
      'Honduras offers strategic access through Puerto Cortez, the largest and most important port in Central America, supporting regional cargo operations.',
    colorClass: 'honduras-card',
    ports: [
      { id: 'puerto-cortez', name: 'Puerto Cortez' },
    ],
  },
  {
    id: 'cuba',
    name: 'Cuba',
    flag: '🇨🇺',
    subtitle: 'Naval Station Guantanamo Bay',
    description:
      'GITMO serves as a strategic U.S. Naval installation in Cuba, providing unique operational support and logistics capabilities for MSC vessels in the Caribbean.',
    colorClass: 'cuba-card',
    ports: [
      { id: 'gitmo', name: 'GITMO' },
    ],
  },
  {
    id: 'dominican-republic',
    name: 'Dominican Republic',
    flag: '🇩🇴',
    subtitle: 'Caribbean Island Nation',
    description:
      'The Dominican Republic offers port facilities on the island of Hispaniola, with Santiago serving as a key destination for MSC operations in the region.',
    colorClass: 'dominican-republic-card',
    ports: [
      { id: 'santiago', name: 'Santiago' },
    ],
  },
  {
    id: 'haiti',
    name: 'Haiti',
    flag: '🇭🇹',
    subtitle: 'Caribbean Operations',
    description:
      'Haiti provides access to the western portion of Hispaniola, with port facilities supporting humanitarian and logistics operations in the Caribbean region.',
    colorClass: 'haiti-card',
    ports: [
      { id: 'port-au-prince', name: 'Port-au-Prince' },
    ],
  },
  {
    id: 'brazil',
    name: 'Brazil',
    flag: '🇧🇷',
    subtitle: 'South American Powerhouse',
    description:
      'Brazil\'s extensive coastline features major commercial ports supporting global trade. Santos is the largest port in Latin America and a frequent destination for MSC vessels.',
    colorClass: 'brazil-card',
    ports: [
      { id: 'santos', name: 'Santos' },
    ],
  },
];

export default function SouthAmericaPorts() {
  const router = useRouter();

  const navigateToPort = (countryId: string, portId?: string) => {
    if (portId) {
      router.push(`/ports/south-america/${countryId}/${portId}`);
    } else {
      router.push(`/ports/south-america/${countryId}`);
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
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-green-800 to-teal-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 text-white">
          <Link
            href="/ports"
            className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-lg border border-white/30 text-white px-6 py-3 rounded-full font-medium transition-all duration-300 hover:bg-white/30 hover:-translate-x-1 mb-8"
          >
            ← Back to Ports
          </Link>
          <h1 className="text-5xl font-bold mb-4 text-shadow">South America / Caribbean Ports</h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Strategic maritime gateways across the Americas supporting global MSC operations
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

        .puerto-rico-card {
          background: linear-gradient(
            135deg,
            rgba(37, 99, 235, 0.20) 0%,
            rgba(239, 68, 68, 0.15) 100%
          );
        }

        .colombia-card {
          background: linear-gradient(
            135deg,
            rgba(234, 179, 8, 0.20) 0%,
            rgba(37, 99, 235, 0.15) 100%
          );
        }

        .guatemala-card {
          background: linear-gradient(
            135deg,
            rgba(14, 165, 233, 0.20) 0%,
            rgba(100, 116, 139, 0.15) 100%
          );
        }

        .honduras-card {
          background: linear-gradient(
            135deg,
            rgba(37, 99, 235, 0.20) 0%,
            rgba(56, 189, 248, 0.15) 100%
          );
        }

        .cuba-card {
          background: linear-gradient(
            135deg,
            rgba(37, 99, 235, 0.20) 0%,
            rgba(239, 68, 68, 0.15) 100%
          );
        }

        .dominican-republic-card {
          background: linear-gradient(
            135deg,
            rgba(37, 99, 235, 0.20) 0%,
            rgba(239, 68, 68, 0.15) 100%
          );
        }

        .haiti-card {
          background: linear-gradient(
            135deg,
            rgba(37, 99, 235, 0.20) 0%,
            rgba(239, 68, 68, 0.15) 100%
          );
        }

        .brazil-card {
          background: linear-gradient(
            135deg,
            rgba(22, 101, 52, 0.20) 0%,
            rgba(234, 179, 8, 0.15) 100%
          );
        }
      `}</style>
    </div>
  );
}
