/**
 * @file app/ports/africa/page.tsx
 * @description Africa region port landing page
 *
 * @purpose Show the scope of MSC mariner travel across Africa and invite
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
    id: 'djibouti',
    name: 'Djibouti',
    country: 'Djibouti',
    subtitle: 'Horn of Africa Strategic Hub',
    description:
      'Home to Camp Lemonnier, the primary U.S. military base in Africa. Strategic location at the crossroads of the Red Sea and Gulf of Aden.',
    colorClass: 'djibouti-card',
    ports: [{ id: 'camp-lemonnier', name: 'Camp Lemonnier' }],
  },
  {
    id: 'ghana',
    name: 'Ghana',
    country: 'Ghana',
    subtitle: 'West African Gateway',
    description:
      "Ghana's largest port serves as a major commercial hub and gateway to Accra, supporting regional trade and maritime operations.",
    colorClass: 'ghana-card',
    ports: [{ id: 'tema', name: 'Tema' }],
  },
  {
    id: 'nigeria',
    name: 'Nigeria',
    country: 'Nigeria',
    subtitle: 'Economic Powerhouse',
    description:
      'Lagos stands as the largest city in Africa and a critical commercial hub, handling significant maritime traffic along the West African coast.',
    colorClass: 'nigeria-card',
    ports: [{ id: 'lagos', name: 'Lagos' }],
  },
  {
    id: 'south-africa',
    name: 'South Africa',
    country: 'South Africa',
    subtitle: 'Southern Crossroads',
    description:
      'Cape Town combines stunning natural beauty with modern port infrastructure, serving as a key maritime hub at the southern tip of Africa.',
    colorClass: 'south-africa-card',
    ports: [{ id: 'cape-town', name: 'Cape Town' }],
  },
  {
    id: 'sudan',
    name: 'Sudan',
    country: 'Sudan',
    subtitle: 'Red Sea Gateway',
    description:
      'Port Sudan provides strategic access to the Red Sea, serving as a critical link for maritime operations in the region.',
    colorClass: 'sudan-card',
    ports: [{ id: 'port-sudan', name: 'Port Sudan' }],
  },
];

export default function AfricaPorts() {
  const router = useRouter();

  const navigateToPort = (countryId: string, portId?: string) => {
    if (portId) {
      router.push(`/ports/africa/${countryId}/${portId}`);
    } else {
      router.push(`/ports/africa/${countryId}`);
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
    <div className="min-h-screen bg-gradient-to-br from-amber-900 via-orange-800 to-yellow-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 text-white">
          <Link
            href="/ports"
            className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-lg border border-white/30 text-white px-6 py-3 rounded-full font-medium transition-all duration-300 hover:bg-white/30 hover:-translate-x-1 mb-8"
          >
            ← Back to Ports
          </Link>
          <h1 className="text-5xl font-bold mb-4 text-shadow">Africa Ports</h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Strategic maritime gateways across the African continent, from the Horn
            of Africa to the Atlantic and Indian Ocean coasts
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

        .djibouti-card {
          background: linear-gradient(
            135deg,
            rgba(14, 165, 233, 0.15) 0%,
            rgba(16, 185, 129, 0.08) 100%
          );
        }

        .ghana-card {
          background: linear-gradient(
            135deg,
            rgba(239, 68, 68, 0.15) 0%,
            rgba(234, 179, 8, 0.12) 50%,
            rgba(34, 197, 94, 0.08) 100%
          );
        }

        .nigeria-card {
          background: linear-gradient(
            135deg,
            rgba(34, 197, 94, 0.15) 0%,
            rgba(16, 185, 129, 0.08) 100%
          );
        }

        .south-africa-card {
          background: linear-gradient(
            135deg,
            rgba(59, 130, 246, 0.15) 0%,
            rgba(34, 197, 94, 0.12) 50%,
            rgba(234, 179, 8, 0.08) 100%
          );
        }

        .sudan-card {
          background: linear-gradient(
            135deg,
            rgba(239, 68, 68, 0.15) 0%,
            rgba(71, 85, 105, 0.12) 50%,
            rgba(34, 197, 94, 0.08) 100%
          );
        }
      `}</style>
    </div>
  );
}
