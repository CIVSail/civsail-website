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
  state: string;
  subtitle: string;
  description: string;
  ports?: PortButton[];
  colorClass: string;
}

const ports: PortData[] = [
  {
    id: 'virginia',
    name: 'Virginia',
    state: 'Virginia',
    subtitle: 'East Coast Naval Hub',
    description:
      "Home to one of the world's largest naval stations, Norfolk serves as a critical hub for Atlantic Fleet operations and commercial shipping.",
    colorClass: 'virginia-card',
    ports: [{ id: 'norfolk', name: 'Norfolk' }],
  },
  {
    id: 'new-jersey',
    name: 'New Jersey',
    state: 'New Jersey',
    subtitle: 'Strategic Weapons Station',
    description:
      'Naval Weapons Station Earle serves as a strategic ammunition depot and pier facility, crucial for Navy fleet operations.',
    colorClass: 'new-jersey-card',
    ports: [{ id: 'earle', name: 'Earle' }],
  },
  {
    id: 'california',
    name: 'California',
    state: 'California',
    subtitle: 'Pacific Fleet Headquarters',
    description:
      'San Diego is home to the largest naval fleet in the world, connecting the Pacific Coast with global maritime networks.',
    colorClass: 'california-card',
    ports: [{ id: 'san-diego', name: 'San Diego' }],
  },
  {
    id: 'alabama',
    name: 'Alabama',
    state: 'Alabama',
    subtitle: 'Gulf Coast Gateway',
    description:
      "Mobile serves as the Gulf Coast's premier port facility, handling diverse cargo and linking inland waterway systems.",
    colorClass: 'alabama-card',
    ports: [{ id: 'mobile', name: 'Mobile' }],
  },
  {
    id: 'south-carolina',
    name: 'South Carolina',
    state: 'South Carolina',
    subtitle: 'Southeast Maritime Hub',
    description:
      "Charleston combines historic port heritage with modern container facilities, serving as the Southeast's gateway for trade.",
    colorClass: 'south-carolina-card',
    ports: [{ id: 'charleston', name: 'Charleston' }],
  },
  {
    id: 'pennsylvania',
    name: 'Pennsylvania',
    state: 'Pennsylvania',
    subtitle: 'Mid-Atlantic Shipyard',
    description:
      'Philadelphia offers extensive shipyard facilities on the Delaware River, supporting both commercial and naval operations.',
    colorClass: 'pennsylvania-card',
    ports: [{ id: 'philadelphia', name: 'Philadelphia' }],
  },
  {
    id: 'washington',
    name: 'Washington',
    state: 'Washington',
    subtitle: 'Pacific Northwest Hub',
    description:
      "Seattle serves as the Pacific Northwest's primary maritime gateway, connecting North America with Asia-Pacific trade routes.",
    colorClass: 'washington-card',
    ports: [{ id: 'seattle', name: 'Seattle' }],
  },
];

export default function UnitedStatesPorts() {
  const router = useRouter();

  const navigateToPort = (stateId: string, portId?: string) => {
    if (portId) {
      router.push(`/ports/united-states/${stateId}/${portId}`);
    } else {
      router.push(`/ports/united-states/${stateId}`);
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
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-red-900 to-blue-950 py-8">
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
            Major maritime gateways across America's coastlines, from the
            Atlantic to the Pacific and Gulf of Mexico
          </p>
        </div>

        {/* Ports Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {ports.map((port, index) => (
            <div
              key={port.id}
              className={`port-card ${
                port.colorClass
              } bg-gradient-to-br backdrop-blur-lg border border-white/20 rounded-3xl p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl opacity-0 translate-y-5 relative overflow-hidden group cursor-pointer min-h-96`}
              onClick={() => !port.ports && navigateToPort(port.id)}
            >
              {/* Gradient line on hover */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-blue-500 transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />

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

        .virginia-card {
          background: linear-gradient(
            135deg,
            rgba(30, 58, 138, 0.20) 0%,
            rgba(67, 56, 202, 0.12) 100%
          );
        }

        .new-jersey-card {
          background: linear-gradient(
            135deg,
            rgba(59, 130, 246, 0.15) 0%,
            rgba(234, 179, 8, 0.12) 100%
          );
        }

        .california-card {
          background: linear-gradient(
            135deg,
            rgba(59, 130, 246, 0.15) 0%,
            rgba(234, 179, 8, 0.15) 100%
          );
        }

        .alabama-card {
          background: linear-gradient(
            135deg,
            rgba(220, 38, 38, 0.18) 0%,
            rgba(244, 63, 94, 0.12) 100%
          );
        }

        .south-carolina-card {
          background: linear-gradient(
            135deg,
            rgba(79, 70, 229, 0.18) 0%,
            rgba(59, 130, 246, 0.12) 100%
          );
        }

        .pennsylvania-card {
          background: linear-gradient(
            135deg,
            rgba(30, 58, 138, 0.18) 0%,
            rgba(234, 179, 8, 0.12) 100%
          );
        }

        .washington-card {
          background: linear-gradient(
            135deg,
            rgba(22, 101, 52, 0.18) 0%,
            rgba(16, 185, 129, 0.12) 100%
          );
        }
      `}</style>
    </div>
  );
}
