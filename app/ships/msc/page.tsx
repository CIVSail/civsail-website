'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface ShipClassData {
  id: string;
  name: string;
  fullName: string;
  description: string;
  stats: {
    fleetSize: string;
    mission: string;
    crew: string;
    deployment: string;
  };
  colorClass: string;
}

const shipClasses: ShipClassData[] = [
  {
    id: 't-ake',
    name: 'T-AKE',
    fullName: 'Dry Cargo/Ammunition Ship',
    description:
      'Combat Logistics Force vessels providing underway replenishment of dry cargo, ammunition, and provisions to Navy ships worldwide.',
    stats: {
      fleetSize: '14 vessels',
      mission: 'Dry Cargo Replenishment',
      crew: 'MSC: 124 / Navy: 49',
      deployment: '2-8 months',
    },
    colorClass: 't-ake-card',
  },
  {
    id: 't-aoe',
    name: 'T-AOE',
    fullName: 'Fast Combat Support Ship',
    description:
      'Multi-product replenishment ships providing fuel, ammunition, provisions, and spare parts to carrier strike groups.',
    stats: {
      fleetSize: '2 vessels',
      mission: 'Multi-Product Replenishment',
      crew: 'MSC: 158 / Navy: 63',
      deployment: '6-9 months',
    },
    colorClass: 't-aoe-card',
  },
  {
    id: 't-ao',
    name: 'T-AO',
    fullName: 'Fleet Replenishment Oiler',
    description:
      'Fuel tankers providing underway replenishment of petroleum products to Navy ships and shore installations.',
    stats: {
      fleetSize: '15 vessels',
      mission: 'Fuel Replenishment',
      crew: 'MSC: 81 / Navy: 23',
      deployment: '4-6 months',
    },
    colorClass: 't-ao-card',
  },
  {
    id: 't-ah',
    name: 'T-AH',
    fullName: 'Hospital Ship',
    description:
      'Hospital ships providing mobile medical treatment and humanitarian assistance worldwide.',
    stats: {
      fleetSize: '2 vessels',
      mission: 'Medical Support',
      crew: 'MSC: 63 / Navy: 956',
      deployment: '4-7 months',
    },
    colorClass: 't-ah-card',
  },
  {
    id: 't-epf',
    name: 'T-EPF',
    fullName: 'Expeditionary Fast Transport',
    description:
      'High-speed, shallow-draft vessels supporting special operations and theater security cooperation.',
    stats: {
      fleetSize: '12 vessels',
      mission: 'Fast Transport',
      crew: 'MSC: 26 / Navy: 8',
      deployment: '3-5 months',
    },
    colorClass: 't-epf-card',
  },
  {
    id: 'lcc',
    name: 'LCC',
    fullName: 'Command Ship',
    description:
      'Fleet command and control vessels serving as floating headquarters for major military operations.',
    stats: {
      fleetSize: '1 vessel',
      mission: 'Command & Control',
      crew: 'MSC: 48 / Navy: 840',
      deployment: '6-12 months',
    },
    colorClass: 'lcc-card',
  },
  {
    id: 'esb',
    name: 'ESB',
    fullName: 'Expeditionary Sea Base',
    description:
      'Mobile sea bases supporting special operations, aviation, and equipment staging in remote locations.',
    stats: {
      fleetSize: '4 vessels',
      mission: 'Mobile Sea Base',
      crew: 'MSC: 34 / Navy: 75',
      deployment: '4-7 months',
    },
    colorClass: 'esb-card',
  },
  {
    id: 'as',
    name: 'AS',
    fullName: 'Submarine Tender',
    description:
      'Support vessels providing maintenance, supplies, and services to submarines and submarine crews.',
    stats: {
      fleetSize: '2 vessels',
      mission: 'Submarine Support',
      crew: 'MSC: 50 / Navy: 1,200',
      deployment: '6-9 months',
    },
    colorClass: 'as-card',
  },
  {
    id: 't-arc',
    name: 'T-ARC',
    fullName: 'Cable Repair Ship',
    description:
      'Specialized vessels maintaining and repairing underwater communication cables critical to military operations.',
    stats: {
      fleetSize: '2 vessels',
      mission: 'Cable Repair',
      crew: 'MSC: 39 / Contractor: 35',
      deployment: '4-8 months',
    },
    colorClass: 't-arc-card',
  },
  {
    id: 't-ars',
    name: 'T-ARS',
    fullName: 'Rescue and Salvage Ship',
    description:
      'Salvage and rescue vessels providing emergency response, diving support, and heavy lift capabilities.',
    stats: {
      fleetSize: '4 vessels',
      mission: 'Rescue & Salvage',
      crew: 'MSC: 18 / Navy: 16',
      deployment: '3-6 months',
    },
    colorClass: 't-ars-card',
  },
];

export default function MSCShipsPage() {
  const router = useRouter();

  const navigateToShipClass = (shipClassId: string) => {
    router.push(`/ships/msc/${shipClassId}`);
  };

  useEffect(() => {
    // Add loading animations
    const cards = document.querySelectorAll('.ship-card');
    cards.forEach((card, index) => {
      setTimeout(() => {
        (card as HTMLElement).style.opacity = '1';
        (card as HTMLElement).style.transform = 'translateY(0)';
      }, index * 100);
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-slate-800 to-blue-800 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 text-white">
          <Link
            href="/ships"
            className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-lg border border-white/30 text-white px-6 py-3 rounded-full font-medium transition-all duration-300 hover:bg-white/30 hover:-translate-x-1 mb-8"
          >
            ← Back to Ships
          </Link>
          <h1 className="text-5xl font-bold mb-4 text-shadow">
            Military Sealift Command
          </h1>
          <p className="text-xl opacity-90 max-w-3xl mx-auto">
            Explore MSC's diverse fleet of vessels supporting Navy operations
            worldwide. From combat logistics to specialized support, discover
            what life is like aboard each ship class.
          </p>
        </div>

        {/* Ship Classes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {shipClasses.map((shipClass, index) => (
            <div
              key={shipClass.id}
              className={`ship-card ${shipClass.colorClass} bg-gradient-to-br backdrop-blur-lg border border-white/20 rounded-3xl p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl opacity-0 translate-y-5 relative overflow-hidden group cursor-pointer`}
              onClick={() => navigateToShipClass(shipClass.id)}
            >
              {/* Hover gradient line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />

              {/* Floating particles */}
              <div
                className="absolute top-4 right-4 w-1 h-1 bg-white/40 rounded-full animate-pulse"
                style={{ animationDelay: `${index * 0.5}s` }}
              />
              <div
                className="absolute bottom-8 left-8 w-1 h-1 bg-white/40 rounded-full animate-pulse"
                style={{ animationDelay: `${index * 0.7}s` }}
              />

              {/* Ship Class Icon */}
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-3xl">🚢</span>
              </div>

              {/* Ship Class Info */}
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-white mb-2">
                  {shipClass.name}
                </h2>
                <p className="text-white/80 font-medium mb-3">
                  {shipClass.fullName}
                </p>
                <p className="text-white/75 leading-relaxed text-sm">
                  {shipClass.description}
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-3">
                  <div className="text-white/70 text-xs font-medium uppercase tracking-wider mb-1">
                    Fleet Size
                  </div>
                  <div className="text-white font-bold">
                    {shipClass.stats.fleetSize}
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-3">
                  <div className="text-white/70 text-xs font-medium uppercase tracking-wider mb-1">
                    Mission
                  </div>
                  <div className="text-white font-bold text-sm">
                    {shipClass.stats.mission}
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-3">
                  <div className="text-white/70 text-xs font-medium uppercase tracking-wider mb-1">
                    Crew Size
                  </div>
                  <div className="text-white font-bold text-xs">
                    {shipClass.stats.crew}
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-3">
                  <div className="text-white/70 text-xs font-medium uppercase tracking-wider mb-1">
                    Deployment
                  </div>
                  <div className="text-white font-bold">
                    {shipClass.stats.deployment}
                  </div>
                </div>
              </div>

              {/* Click indicator */}
              <div className="mt-6 text-center">
                <div className="inline-flex items-center text-white/60 group-hover:text-white text-sm">
                  Learn More
                  <span className="ml-2 transform group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Note */}
        <div className="text-center mt-16 text-white/70">
          <p className="mb-2">
            Information based on current MSC fleet composition and typical
            operations
          </p>
          <p className="text-sm">
            Deployment schedules and crew sizes may vary based on operational
            requirements
          </p>
        </div>
      </div>

      <style jsx>{`
        .text-shadow {
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .t-ake-card {
          background: linear-gradient(
            135deg,
            rgba(59, 130, 246, 0.15) 0%,
            rgba(37, 99, 235, 0.08) 100%
          );
        }

        .t-aoe-card {
          background: linear-gradient(
            135deg,
            rgba(239, 68, 68, 0.15) 0%,
            rgba(220, 38, 38, 0.08) 100%
          );
        }

        .t-ao-card {
          background: linear-gradient(
            135deg,
            rgba(245, 158, 11, 0.15) 0%,
            rgba(217, 119, 6, 0.08) 100%
          );
        }

        .t-ah-card {
          background: linear-gradient(
            135deg,
            rgba(34, 197, 94, 0.15) 0%,
            rgba(22, 163, 74, 0.08) 100%
          );
        }

        .t-epf-card {
          background: linear-gradient(
            135deg,
            rgba(168, 85, 247, 0.15) 0%,
            rgba(147, 51, 234, 0.08) 100%
          );
        }

        .lcc-card {
          background: linear-gradient(
            135deg,
            rgba(244, 63, 94, 0.15) 0%,
            rgba(225, 29, 72, 0.08) 100%
          );
        }

        .esb-card {
          background: linear-gradient(
            135deg,
            rgba(6, 182, 212, 0.15) 0%,
            rgba(8, 145, 178, 0.08) 100%
          );
        }

        .as-card {
          background: linear-gradient(
            135deg,
            rgba(107, 114, 128, 0.15) 0%,
            rgba(75, 85, 99, 0.08) 100%
          );
        }

        .t-arc-card {
          background: linear-gradient(
            135deg,
            rgba(16, 185, 129, 0.15) 0%,
            rgba(5, 150, 105, 0.08) 100%
          );
        }

        .t-ars-card {
          background: linear-gradient(
            135deg,
            rgba(251, 146, 60, 0.15) 0%,
            rgba(249, 115, 22, 0.08) 100%
          );
        }
      `}</style>
    </div>
  );
}
