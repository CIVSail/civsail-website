'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  ChevronRight,
  Ship,
  DollarSign,
  Users,
  MapPin,
  Home,
} from 'lucide-react';
import ShipPopup from '@/components/ShipPopup';

interface QuickStat {
  icon: React.ReactNode;
  label: string;
  value: string;
}

interface Section {
  id: string;
  title: string;
  icon: React.ReactNode;
}

export default function TAOShipPage() {
  const [activeSection, setActiveSection] = useState('overview');

  // State for popup
  const [selectedShip, setSelectedShip] = useState<{
    name: string;
    hull: string;
  } | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // Function to handle ship clicks
  const handleShipClick = (shipName: string, hull: string) => {
    setSelectedShip({ name: shipName, hull });
    setIsPopupOpen(true);
  };

  const quickStats: QuickStat[] = [
    {
      icon: <Ship className="w-5 h-5" />,
      label: 'Fleet Size',
      value: '15 vessels',
    },
    {
      icon: <Users className="w-5 h-5" />,
      label: 'Crew Size',
      value: 'MSC: 81 / Navy: 23',
    },
    {
      icon: <DollarSign className="w-5 h-5" />,
      label: 'Pay Category',
      value: 'High',
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      label: 'Deployment',
      value: '4-6 months',
    },
  ];

  const sections: Section[] = [
    {
      id: 'overview',
      title: 'Ship Overview',
      icon: <Ship className="w-5 h-5" />,
    },
    {
      id: 'operations',
      title: 'Operations & Pay',
      icon: <DollarSign className="w-5 h-5" />,
    },
    {
      id: 'life-aboard',
      title: 'Life Aboard',
      icon: <Home className="w-5 h-5" />,
    },
    {
      id: 'ships-ports',
      title: 'Ships & Ports',
      icon: <MapPin className="w-5 h-5" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-900 via-slate-800 to-orange-800">
      {/* Add the popup component */}
      {selectedShip && (
        <ShipPopup
          isOpen={isPopupOpen}
          onClose={() => setIsPopupOpen(false)}
          shipName={selectedShip.name}
          shipHull={selectedShip.hull}
        />
      )}

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-600/20 to-yellow-600/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Breadcrumb */}
          <div className="flex items-center text-white/70 text-sm mb-8">
            <Link href="/ships" className="hover:text-white transition-colors">
              Ships
            </Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <Link
              href="/ships/msc"
              className="hover:text-white transition-colors"
            >
              MSC
            </Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span className="text-white">T-AO</span>
          </div>

          {/* Hero Content */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center bg-orange-500/20 text-orange-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Ship className="w-4 h-4 mr-2" />
                Fleet Replenishment Oiler
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6">
                T-AO
                <span className="block text-2xl lg:text-3xl font-normal text-orange-300 mt-2">
                  Fleet Replenishment Oiler
                </span>
              </h1>
              <p className="text-xl text-white/80 leading-relaxed mb-8">
                Fuel tankers providing underway replenishment of petroleum
                products to Navy ships and shore installations. The backbone of
                naval fuel logistics supporting sustained operations worldwide.
              </p>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4">
                {quickStats.map((stat, index) => (
                  <div
                    key={index}
                    className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4"
                  >
                    <div className="flex items-center text-orange-300 mb-2">
                      {stat.icon}
                      <span className="ml-2 text-sm font-medium">
                        {stat.label}
                      </span>
                    </div>
                    <div className="text-white font-semibold">{stat.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Menu */}
            <div className="lg:pl-8">
              <div className="bg-white/5 backdrop-blur-lg border border-white/20 rounded-2xl p-6">
                <h3 className="text-white font-semibold mb-4 text-lg">
                  Ship Information
                </h3>
                <nav className="space-y-2">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center p-3 rounded-xl transition-all duration-300 ${
                        activeSection === section.id
                          ? 'bg-orange-500/30 text-white border border-orange-400/50'
                          : 'text-white/70 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {section.icon}
                      <span className="ml-3 font-medium">{section.title}</span>
                      <ChevronRight className="w-4 h-4 ml-auto" />
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Content Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white/5 backdrop-blur-lg border border-white/20 rounded-2xl p-8 lg:p-12">
          {/* Ship Overview Section */}
          {activeSection === 'overview' && (
            <div className="space-y-8">
              <div className="flex items-center mb-8">
                <Ship className="w-8 h-8 text-orange-400 mr-4" />
                <h2 className="text-3xl font-bold text-white">Ship Overview</h2>
              </div>

              <div className="prose prose-invert max-w-none">
                <p className="text-lg text-white/80 leading-relaxed">
                  Military Sealift Command operates the T-AO Fleet Replenishment
                  Oilers as a component of the Combat Logistics Force (CLF).
                  These tankers, designed to supply the US Navy and allied
                  forces with diesel and jet fuel at sea, help naval vessels
                  stay on patrol longer without needing to refuel in port.
                </p>

                <p className="text-lg text-white/80 leading-relaxed mb-8">
                  The tanker fleet includes the Kaiser Class (T-AO 187-204) and
                  the newer John Lewis Class (T-AO 205 and beyond). Fifteen
                  Kaiser Class vessels were built starting in 1986, but they are
                  being phased out in favor of the John Lewis Class; the Walter
                  S. Diehl (T-AO 193) has already been decommissioned.
                </p>

                <div className="grid lg:grid-cols-2 gap-8 mt-8">
                  {/* Mission & Operations */}
                  <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-xl p-6 border border-white/10">
                    <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                      <span className="text-2xl mr-3">🛢️</span>
                      Mission & Operations
                    </h3>
                    <div className="space-y-4">
                      <div className="bg-white/10 rounded-lg p-4">
                        <h4 className="font-medium text-orange-300 mb-2">
                          Primary Mission
                        </h4>
                        <p className="text-white/80 text-sm">
                          Supply US Navy and allied forces with diesel and jet
                          fuel at sea through underway replenishment operations
                        </p>
                      </div>
                      <div className="bg-white/10 rounded-lg p-4">
                        <h4 className="font-medium text-orange-300 mb-2">
                          Operational Advantage
                        </h4>
                        <p className="text-white/80 text-sm">
                          Access to wider range of piers and ports - no
                          ammunition means no anchoring required, can pull
                          directly into port
                        </p>
                      </div>
                      <div className="bg-white/10 rounded-lg p-4">
                        <h4 className="font-medium text-orange-300 mb-2">
                          Fleet Support
                        </h4>
                        <p className="text-white/80 text-sm">
                          Help naval vessels stay on patrol longer without
                          needing to refuel in port, extending operational
                          capabilities
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Fleet Transition */}
                <div className="bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-xl p-6 border border-white/10">
                  <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                    <span className="text-2xl mr-3">🔄</span>
                    Fleet Modernization
                  </h3>
                  <div className="space-y-4">
                    <div className="bg-white/10 rounded-lg p-4">
                      <h4 className="font-medium text-blue-300 mb-2">
                        Kaiser Class (Legacy)
                      </h4>
                      <p className="text-white/80 text-sm">
                        15 vessels built starting 1986, being phased out. Walter
                        S. Diehl (T-AO 193) already decommissioned
                      </p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4">
                      <h4 className="font-medium text-blue-300 mb-2">
                        John Lewis Class (Modern)
                      </h4>
                      <p className="text-white/80 text-sm">
                        20 total planned, first delivered July 2022. Built by
                        General Dynamics NASSCO starting 2018
                      </p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4">
                      <h4 className="font-medium text-blue-300 mb-2">
                        OPA 90 Compliance
                      </h4>
                      <p className="text-white/80 text-sm">
                        Double hulls required after 1990 Oil Pollution Act. Only
                        3 Kaiser class have double hulls vs single hull majority
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ship Classes Comparison */}
              <div className="bg-gradient-to-br from-green-500/20 to-teal-500/20 rounded-xl p-6 border border-white/10 mt-8">
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                  <span className="text-2xl mr-3">⚖️</span>
                  Ship Classes Comparison
                </h3>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Kaiser Class */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-green-300 mb-4">
                      Kaiser Class (T-AO 187-204)
                    </h4>

                    <div className="bg-white/10 rounded-lg p-4">
                      <h5 className="font-medium text-white mb-3">
                        Technical Specifications
                      </h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between border-b border-white/10 pb-1">
                          <span className="text-white/70">Length</span>
                          <span className="text-white">677.5 feet</span>
                        </div>
                        <div className="flex justify-between border-b border-white/10 pb-1">
                          <span className="text-white/70">Beam</span>
                          <span className="text-white">97.5 feet</span>
                        </div>
                        <div className="flex justify-between border-b border-white/10 pb-1">
                          <span className="text-white/70">Displacement</span>
                          <span className="text-white">
                            41,225 tons (double hull)
                          </span>
                        </div>
                        <div className="flex justify-between border-b border-white/10 pb-1">
                          <span className="text-white/70">Propulsion</span>
                          <span className="text-white">Twin shaft diesel</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/70">Speed</span>
                          <span className="text-white">20 knots</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white/10 rounded-lg p-4">
                      <h5 className="font-medium text-white mb-3">
                        Operational Data
                      </h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between border-b border-white/10 pb-1">
                          <span className="text-white/70">Fuel Capacity</span>
                          <span className="text-white">7.5M gallons</span>
                        </div>
                        <div className="flex justify-between border-b border-white/10 pb-1">
                          <span className="text-white/70">Crew Size</span>
                          <span className="text-white">74-89 personnel</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/70">Status</span>
                          <span className="text-orange-300">
                            Being phased out
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* John Lewis Class */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-green-300 mb-4">
                      John Lewis Class (T-AO 205+)
                    </h4>

                    <div className="bg-white/10 rounded-lg p-4">
                      <h5 className="font-medium text-white mb-3">
                        Technical Specifications
                      </h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between border-b border-white/10 pb-1">
                          <span className="text-white/70">Length</span>
                          <span className="text-white">227.3 meters</span>
                        </div>
                        <div className="flex justify-between border-b border-white/10 pb-1">
                          <span className="text-white/70">Beam</span>
                          <span className="text-white">32.2 meters</span>
                        </div>
                        <div className="flex justify-between border-b border-white/10 pb-1">
                          <span className="text-white/70">Displacement</span>
                          <span className="text-white">22,173 metric tons</span>
                        </div>
                        <div className="flex justify-between border-b border-white/10 pb-1">
                          <span className="text-white/70">Propulsion</span>
                          <span className="text-white">
                            Twin shaft geared diesel
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/70">Speed</span>
                          <span className="text-white">20 knots</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white/10 rounded-lg p-4">
                      <h5 className="font-medium text-white mb-3">
                        Operational Data
                      </h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between border-b border-white/10 pb-1">
                          <span className="text-white/70">Fuel Capacity</span>
                          <span className="text-white">6.8M gallons</span>
                        </div>
                        <div className="flex justify-between border-b border-white/10 pb-1">
                          <span className="text-white/70">Crew Size</span>
                          <span className="text-white">99 personnel</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/70">Status</span>
                          <span className="text-green-300">
                            Active production
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-yellow-500/20 rounded-lg border border-yellow-400/30">
                  <p className="text-yellow-300 text-sm">
                    <strong>Note:</strong> The John Lewis class has slightly
                    less fuel capacity but larger crew size. Only 3 Kaiser class
                    vessels (Patuxent, Laramie, Rappahannock) have double hulls
                    compliant with OPA 90 regulations.
                  </p>
                </div>
              </div>

              {/* Crew and Detachments */}
              <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl p-6 border border-white/10 mt-8">
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                  <span className="text-2xl mr-3">👥</span>
                  Crew Size & Military Detachments
                </h3>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-white/10 rounded-lg p-4">
                    <h4 className="font-medium text-purple-300 mb-3">
                      Kaiser Class Crew
                    </h4>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-400 mb-2">
                        74-89
                      </div>
                      <div className="text-white/70 text-sm">MSC Personnel</div>
                    </div>
                  </div>

                  <div className="bg-white/10 rounded-lg p-4">
                    <h4 className="font-medium text-purple-300 mb-3">
                      John Lewis Class Crew
                    </h4>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-400 mb-2">
                        99
                      </div>
                      <div className="text-white/70 text-sm">MSC Personnel</div>
                    </div>
                  </div>

                  <div className="bg-white/10 rounded-lg p-4">
                    <h4 className="font-medium text-purple-300 mb-3">
                      Military Detachments
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="text-white/80">
                        <strong>Air Det:</strong> None embarked
                      </div>
                      <div className="text-white/80">
                        <strong>Security Det:</strong> Only during 5th fleet
                        deployments
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tanker Life Appeal */}
              <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl p-6 border border-white/10 mt-8">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <span className="text-2xl mr-3">⚓</span>
                  The "Tanker Trash" Experience
                </h3>

                <p className="text-white/80 mb-6">
                  Tanker assignments are often seen as standard and not
                  particularly high-paying. However, many mariners enjoy the
                  unique aspects of tanker life, including the steadier pace and
                  consistent operations. Some CIVMARs even choose to stay on
                  tankers if they prefer the ship or its schedule.
                </p>

                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-white/10 rounded-lg p-4 text-center">
                    <div className="text-2xl mb-2">🚢</div>
                    <h4 className="font-medium text-white mb-2">Port Access</h4>
                    <p className="text-white/70 text-sm">
                      Wider range of ports accessible - no ammunition
                      restrictions mean direct pier access
                    </p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4 text-center">
                    <div className="text-2xl mb-2">⚡</div>
                    <h4 className="font-medium text-white mb-2">
                      Steady Operations
                    </h4>
                    <p className="text-white/70 text-sm">
                      More predictable pace with consistent fuel transfer
                      operations
                    </p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4 text-center">
                    <div className="text-2xl mb-2">👴</div>
                    <h4 className="font-medium text-white mb-2">
                      Experienced Crew
                    </h4>
                    <p className="text-white/70 text-sm">
                      Smaller crew size tends to attract more experienced, if
                      older, mariners
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-cyan-500/20 rounded-lg border border-cyan-400/30">
                  <p className="text-cyan-300 text-sm">
                    <strong>Mariner Insight:</strong> "If you're considering a
                    tanker assignment, you might find that being 'Tanker Trash'
                    is more enjoyable than you'd expect—give it a try and see
                    for yourself!"
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Operations & Pay Section */}
          {activeSection === 'operations' && (
            <div className="space-y-8">
              <div className="flex items-center mb-8">
                <DollarSign className="w-8 h-8 text-orange-400 mr-4" />
                <h2 className="text-3xl font-bold text-white">
                  Operations & Pay
                </h2>
              </div>

              {/* Operational Cycles */}
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-xl p-6 border border-white/10">
                  <h3 className="text-xl font-semibold text-white mb-4">
                    Operational Cycle
                  </h3>
                  <p className="text-white/80 mb-6">
                    Like other ships in the Combat Logistics Force (CLF), T-AOs
                    generally follow a semi-typical schedule: they deploy for 2
                    to 8 months, then undergo a maintenance period. After that,
                    they might serve as the East or West Coast duty tanker.
                  </p>

                  <div className="grid md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white/10 rounded-lg p-4">
                      <h4 className="font-medium text-white mb-2">
                        Deployment Phase
                      </h4>
                      <div className="text-2xl font-bold text-orange-400 mb-1">
                        2-8 months
                      </div>
                      <p className="text-white/70 text-sm">
                        Forward deployed operations
                      </p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4">
                      <h4 className="font-medium text-white mb-2">
                        Maintenance Period
                      </h4>
                      <div className="text-2xl font-bold text-orange-400 mb-1">
                        Variable
                      </div>
                      <p className="text-white/70 text-sm">
                        Shipyard or maintenance availability
                      </p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4">
                      <h4 className="font-medium text-white mb-2">
                        Duty Tanker
                      </h4>
                      <div className="text-2xl font-bold text-orange-400 mb-1">
                        Local Ops
                      </div>
                      <p className="text-white/70 text-sm">
                        East/West Coast fleet support
                      </p>
                    </div>
                  </div>
                </div>

                {/* Port to Sea Time Ratio */}
                <div className="bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-xl p-6 border border-white/10">
                  <h3 className="text-xl font-semibold text-white mb-4">
                    Port to Sea Time Ratio
                  </h3>
                  <p className="text-white/80 mb-6">
                    Like the T-AKEs, T-AOs are responsible for resupplying the
                    fleet. Typically, they spend 2-4 days in port loading fuel
                    and stores, followed by 5-15 days at sea distributing these
                    supplies. However, the exact schedule varies depending on
                    the vessel and its mission.
                  </p>

                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-white/10 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-300 mb-3">
                        Typical Schedule
                      </h4>
                      <ul className="text-white/80 text-sm space-y-2">
                        <li>
                          • <strong>Port Time:</strong> 2-4 days loading fuel
                          and stores
                        </li>
                        <li>
                          • <strong>Sea Time:</strong> 5-15 days distributing
                          supplies
                        </li>
                        <li>• Schedule varies by vessel and mission</li>
                        <li>
                          • No ammunition restrictions = direct pier access
                        </li>
                      </ul>
                    </div>

                    <div className="bg-white/10 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-300 mb-3">
                        Operational Advantage
                      </h4>
                      <ul className="text-white/80 text-sm space-y-2">
                        <li>• Never need to anchor out</li>
                        <li>• No explosive radius restrictions</li>
                        <li>• Access to more ports than ammunition ships</li>
                        <li>• Direct pier-side loading and unloading</li>
                      </ul>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-500/20 rounded-lg border border-blue-400/30">
                    <p className="text-blue-300 text-sm">
                      <strong>Key Difference:</strong> Unlike T-AKEs, T-AOs
                      never need to anchor out due to explosive radius
                      restrictions since they don't carry ammunition, providing
                      greater port access flexibility.
                    </p>
                  </div>
                </div>

                {/* Money Situation */}
                <div className="bg-gradient-to-br from-green-500/20 to-teal-500/20 rounded-xl p-6 border border-white/10">
                  <h3 className="text-xl font-semibold text-white mb-4">
                    💰 Pay & Compensation
                  </h3>
                  <p className="text-white/80 mb-6">
                    Pay on a tanker is typically average for MSC ships—not the
                    lowest, but not the highest either. While tankers might not
                    offer the top pay rates, a busy operational schedule can
                    provide additional overtime.
                  </p>

                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-3">
                      <div className="bg-white/10 rounded-lg p-4 border border-green-400/30">
                        <h4 className="font-medium text-green-300 mb-2">
                          Base Pay Level
                        </h4>
                        <p className="text-white/70 text-sm">
                          Average for MSC ships - middle of the range
                        </p>
                      </div>
                      <div className="bg-white/10 rounded-lg p-4 border border-green-400/30">
                        <h4 className="font-medium text-green-300 mb-2">
                          Overtime Potential
                        </h4>
                        <p className="text-white/70 text-sm">
                          Varies by operational tempo and ship's budget
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="bg-white/10 rounded-lg p-4 border border-red-400/30">
                        <h4 className="font-medium text-red-300 mb-2">
                          No Ammunition Pay
                        </h4>
                        <p className="text-white/70 text-sm">
                          Fuel operations don't qualify for hazard pay
                        </p>
                      </div>
                      <div className="bg-white/10 rounded-lg p-4 border border-red-400/30">
                        <h4 className="font-medium text-red-300 mb-2">
                          No Berthing Pay
                        </h4>
                        <p className="text-white/70 text-sm">
                          Standard berthing arrangements
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-yellow-500/20 rounded-lg border border-yellow-400/30">
                    <p className="text-yellow-300 text-sm">
                      <strong>Common Misconception:</strong> Many believe
                      tankers don't offer much overtime due to their focus on
                      fueling missions. However, overtime availability varies
                      depending on the ship's mission and budget - busy
                      operational schedules can provide additional
                      opportunities.
                    </p>
                  </div>
                </div>

                {/* Department Operations */}
                <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl p-6 border border-white/10">
                  <h3 className="text-xl font-semibold text-white mb-6">
                    👥 Department Operations
                  </h3>

                  {/* Deck Department */}
                  <div className="mb-8">
                    <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <span className="text-xl mr-2">⚓</span>
                      Deck Department
                    </h4>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-white/10 rounded-lg p-4">
                        <h5 className="font-medium text-white mb-3">
                          Deck Officers
                        </h5>
                        <ul className="text-white/70 text-sm space-y-2">
                          <li>
                            • <strong>Ship Handling:</strong> Twin screw vessels
                            with controllable pitch propellers
                          </li>
                          <li>
                            • <strong>Performance:</strong> Despite their age,
                            they drive well
                          </li>
                          <li>
                            • <strong>Loading Conditions:</strong> Favorite
                            among deck officers whether fully loaded or light
                          </li>
                          <li>
                            • <strong>Bridge Equipment:</strong> Engine order
                            telegraph and straightforward cargo control system
                          </li>
                        </ul>
                      </div>

                      <div className="bg-white/10 rounded-lg p-4">
                        <h5 className="font-medium text-white mb-3">
                          Deck Day Workers
                        </h5>
                        <ul className="text-white/70 text-sm space-y-2">
                          <li>• Standard dayworker operations</li>
                          <li>• Typical maintenance and preservation</li>
                          <li>
                            • Assisting with UNREPs and fueling operations
                          </li>
                          <li>• No ammunition handling requirements</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Engine Department */}
                  <div className="mb-8">
                    <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <span className="text-xl mr-2">🔧</span>
                      Engine Department
                    </h4>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-white/10 rounded-lg p-4">
                        <h5 className="font-medium text-white mb-3">
                          Engine Officers
                        </h5>
                        <div className="space-y-4">
                          <div>
                            <h6 className="font-medium text-purple-300 mb-2">
                              Kaiser Class
                            </h6>
                            <ul className="text-white/70 text-sm space-y-1">
                              <li>• All Engine officers are day workers</li>
                              <li>
                                • Duty rotation among 3rd A/Es and sometimes 2nd
                                A/E
                              </li>
                              <li>• Engine room unmanned at night</li>
                              <li>
                                • Monitored by alarm system to duty engineer's
                                room
                              </li>
                              <li>• Same setup used while in port</li>
                            </ul>
                          </div>
                          <div>
                            <h6 className="font-medium text-purple-300 mb-2">
                              John Lewis Class
                            </h6>
                            <ul className="text-white/70 text-sm space-y-1">
                              <li>• 3rd A/Es currently stand watch</li>
                              <li>
                                • Monitor potential alarms (new build status)
                              </li>
                              <li>
                                • Expected to shift to Kaiser-class routine
                                eventually
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white/10 rounded-lg p-4">
                        <h5 className="font-medium text-white mb-3">
                          Engine Unlicensed
                        </h5>
                        <ul className="text-white/70 text-sm space-y-2">
                          <li>• Standard Engine Department duties</li>
                          <li>
                            • <strong>Kaiser Class:</strong> Standard operations
                          </li>
                          <li>
                            • <strong>John Lewis Class:</strong> Currently 3 EUs
                            stand watch with 3rd A/Es
                          </li>
                          <li>
                            • Watch structure will change once John Lewis class
                            fully operational
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Supply Department */}
                  <div className="mb-8">
                    <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <span className="text-xl mr-2">📦</span>
                      Supply Department
                    </h4>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-white/10 rounded-lg p-4">
                        <h5 className="font-medium text-white mb-3">
                          Steward Department
                        </h5>
                        <ul className="text-white/70 text-sm space-y-2">
                          <li>• Food service is standard on T-AO</li>
                          <li>• May find it easier due to reduced crew size</li>
                          <li>
                            • Smaller crew compared to AKE or larger vessels
                          </li>
                          <li>• Standard galley operations and meal service</li>
                        </ul>
                      </div>

                      <div className="bg-white/10 rounded-lg p-4">
                        <h5 className="font-medium text-white mb-3">
                          Supply Department
                        </h5>
                        <ul className="text-white/70 text-sm space-y-2">
                          <li>• Led by one Supply Officer and one JSO</li>
                          <li>
                            • JSO handles both end-use and CLF responsibilities
                          </li>
                          <li>
                            • Well-supported with most items in stock system
                          </li>
                          <li>• Easy procurement using NIIN</li>
                          <li>
                            • <strong>Tank Sounding:</strong> Expect frequent
                            tank sounding during fueling ops
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className="mt-4 p-3 bg-orange-500/20 rounded-lg border border-orange-400/30">
                      <p className="text-orange-300 text-sm">
                        <strong>Supply Note:</strong> As a Supply Department
                        member on a tanker, expect to do a lot of tank sounding
                        during fueling operations, as tankers have numerous
                        tanks and frequently issue and load fuel.
                      </p>
                    </div>
                  </div>

                  {/* Communications Department */}
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <span className="text-xl mr-2">📡</span>
                      Communications Department
                    </h4>

                    <div className="bg-white/10 rounded-lg p-4">
                      <h5 className="font-medium text-white mb-3">
                        Communications Operations
                      </h5>
                      <p className="text-white/70 text-sm">
                        The T-AO communications department operates using
                        standard MSC communications protocols and equipment.
                        Communications capabilities include standard radio,
                        satellite, and data systems typical of CLF vessels.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Life on Board Summary */}
                <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl p-6 border border-white/10">
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                    <span className="text-xl mr-2">🏠</span>
                    Tanker Operations Summary
                  </h3>
                  <p className="text-white/80 mb-4">
                    T-AO operations focus on fuel logistics support to the
                    fleet. The smaller crew size and specialized mission create
                    a unique operational environment compared to other CLF
                    vessels.
                  </p>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-white/10 rounded-lg p-4">
                      <h4 className="font-medium text-white mb-2">
                        Operational Focus
                      </h4>
                      <p className="text-white/70 text-sm">
                        Fuel transfer operations, UNREP support, and fleet
                        sustainment
                      </p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4">
                      <h4 className="font-medium text-white mb-2">
                        Crew Experience
                      </h4>
                      <p className="text-white/70 text-sm">
                        Smaller crews tend to be more experienced, steady
                        operational pace
                      </p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4">
                      <h4 className="font-medium text-white mb-2">
                        Port Access
                      </h4>
                      <p className="text-white/70 text-sm">
                        Greater port flexibility due to no ammunition
                        restrictions
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Life Aboard Section */}
          {activeSection === 'life-aboard' && (
            <div className="space-y-8">
              <div className="flex items-center mb-8">
                <Home className="w-8 h-8 text-orange-400 mr-4" />
                <h2 className="text-3xl font-bold text-white">Life Aboard</h2>
              </div>

              {/* Introduction */}
              <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4">
                  T-AO Living Overview
                </h3>
                <p className="text-white/80 mb-6">
                  T-AO vessels offer comfortable living accommodations with the
                  advantage of smaller crew sizes creating more spacious
                  conditions. Both Kaiser and John Lewis class ships feature
                  single houses located aft with personal elevators running from
                  upper levels down to the engine room.
                </p>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-white/10 rounded-lg p-4">
                    <h4 className="font-medium text-white mb-2">
                      🏠 Single House Design
                    </h4>
                    <p className="text-white/70 text-sm">
                      Aft-located house with elevator access from upper levels
                      to engine room
                    </p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4">
                    <h4 className="font-medium text-white mb-2">
                      👥 Smaller Crew Size
                    </h4>
                    <p className="text-white/70 text-sm">
                      More spacious living conditions due to fewer personnel
                    </p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4">
                    <h4 className="font-medium text-white mb-2">
                      🔧 Modern Features
                    </h4>
                    <p className="text-white/70 text-sm">
                      John Lewis class features key fobs instead of physical
                      keys
                    </p>
                  </div>
                </div>
              </div>

              {/* Kaiser Class Accommodations */}
              <div className="bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                  <span className="text-2xl mr-3">🛏️</span>
                  Kaiser Class Accommodations
                </h3>

                {/* Officer Rooms */}
                <div className="mb-8">
                  <h4 className="text-lg font-semibold text-blue-300 mb-4 flex items-center">
                    <span className="text-xl mr-2">👔</span>
                    Officer Rooms
                  </h4>

                  <div className="grid lg:grid-cols-2 gap-6">
                    <div>
                      <div className="bg-white/10 rounded-lg p-4 mb-4">
                        <h5 className="font-medium text-white mb-3">
                          Room Layout & Size
                        </h5>
                        <ul className="text-white/80 text-sm space-y-2">
                          <li>
                            • <strong>Size:</strong> Significantly larger than
                            T-AKE staterooms
                          </li>
                          <li>
                            • <strong>Quality:</strong> Generally considered
                            above average within the fleet
                          </li>
                          <li>
                            • <strong>06 Level:</strong> Captain's room and one
                            other stateroom
                          </li>
                          <li>
                            • <strong>05 Level Port Side:</strong> Chief
                            Engineer and all other engineers
                          </li>
                          <li>
                            • <strong>05 Level:</strong> Other officers' rooms
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-lg aspect-square overflow-hidden">
                        <img
                          src="/images/global/Coming_Soon_Graphic.png"
                          alt="Kaiser Class Officer Room - Photo Coming Soon"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="rounded-lg aspect-square overflow-hidden">
                        <img
                          src="/images/global/Coming_Soon_Graphic.png"
                          alt="Kaiser Class Captain's Room - Photo Coming Soon"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="rounded-lg aspect-square overflow-hidden">
                        <img
                          src="/images/global/Coming_Soon_Graphic.png"
                          alt="Kaiser Class Chief Engineer Room - Photo Coming Soon"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="rounded-lg aspect-square overflow-hidden">
                        <img
                          src="/images/global/Coming_Soon_Graphic.png"
                          alt="Kaiser Class Officer Bathroom - Photo Coming Soon"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Unlicensed Rooms */}
                <div className="mb-8">
                  <h4 className="text-lg font-semibold text-blue-300 mb-4 flex items-center">
                    <span className="text-xl mr-2">⚓</span>
                    Unlicensed Rooms
                  </h4>

                  <div className="grid lg:grid-cols-2 gap-6">
                    <div>
                      <div className="bg-white/10 rounded-lg p-4">
                        <h5 className="font-medium text-white mb-3">
                          Room Distribution
                        </h5>
                        <ul className="text-white/80 text-sm space-y-2">
                          <li>
                            • <strong>04 Level:</strong> Chief Petty Officers
                            and some unlicensed crew
                          </li>
                          <li>
                            • <strong>Bathroom Sharing:</strong> Only a few crew
                            members need to share
                          </li>
                          <li>
                            • <strong>Ample Space:</strong> Good number of rooms
                            compared to crew size
                          </li>
                          <li>
                            • <strong>Even More Spacious:</strong> When no
                            military detachment aboard
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-lg aspect-square overflow-hidden">
                        <img
                          src="/images/global/Coming_Soon_Graphic.png"
                          alt="Kaiser Class CPO Room - Photo Coming Soon"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="rounded-lg aspect-square overflow-hidden">
                        <img
                          src="/images/global/Coming_Soon_Graphic.png"
                          alt="Kaiser Class Unlicensed Room - Photo Coming Soon"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="rounded-lg aspect-square overflow-hidden">
                        <img
                          src="/images/global/Coming_Soon_Graphic.png"
                          alt="Kaiser Class Shared Bathroom - Photo Coming Soon"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="rounded-lg aspect-square overflow-hidden">
                        <img
                          src="/images/global/Coming_Soon_Graphic.png"
                          alt="Kaiser Class Crew Berthing - Photo Coming Soon"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* John Lewis Class Accommodations */}
              <div className="bg-gradient-to-br from-green-500/20 to-teal-500/20 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                  <span className="text-2xl mr-3">🏠</span>
                  John Lewis Class Accommodations
                </h3>

                {/* Officer Rooms */}
                <div className="mb-8">
                  <h4 className="text-lg font-semibold text-green-300 mb-4 flex items-center">
                    <span className="text-xl mr-2">👔</span>
                    Officer Rooms
                  </h4>

                  <div className="grid lg:grid-cols-2 gap-6">
                    <div>
                      <div className="bg-white/10 rounded-lg p-4">
                        <h5 className="font-medium text-white mb-3">
                          Modern Features
                        </h5>
                        <ul className="text-white/80 text-sm space-y-2">
                          <li>
                            • <strong>Size:</strong> Similar to T-AKE officer
                            rooms
                          </li>
                          <li>
                            • <strong>Beds:</strong> Full-sized beds in all
                            officer quarters
                          </li>
                          <li>
                            • <strong>Department Heads:</strong> Slightly larger
                            rooms
                          </li>
                          <li>
                            • <strong>Location:</strong> 05 and 06 decks as
                            usual
                          </li>
                          <li>
                            • <strong>Unique Feature:</strong> Key fobs instead
                            of physical keys
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-lg aspect-square overflow-hidden">
                        <img
                          src="/images/ships/msc/t-ao/staterooms/Lewis Room 1.webp"
                          alt="John Lewis Class Officer Room"
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.currentTarget.src =
                              '/images/global/Coming_Soon_Graphic.png';
                          }}
                        />
                      </div>
                      <div className="rounded-lg aspect-square overflow-hidden">
                        <img
                          src="/images/ships/msc/t-ao/staterooms/Lewis Room 2.webp"
                          alt="John Lewis Class Department Head Room"
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.currentTarget.src =
                              '/images/global/Coming_Soon_Graphic.png';
                          }}
                        />
                      </div>
                      <div className="rounded-lg aspect-square overflow-hidden">
                        <img
                          src="/images/ships/msc/t-ao/staterooms/Lewis Room 3.webp"
                          alt="John Lewis Class Officer Room with Key Fob"
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.currentTarget.src =
                              '/images/global/Coming_Soon_Graphic.png';
                          }}
                        />
                      </div>
                      <div className="rounded-lg aspect-square overflow-hidden">
                        <img
                          src="/images/global/Coming_Soon_Graphic.png"
                          alt="John Lewis Class Officer Bathroom - Photo Coming Soon"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* CPO and Unlicensed Rooms */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white/10 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-green-300 mb-4">
                      CPO Rooms
                    </h4>
                    <ul className="text-white/80 text-sm space-y-2">
                      <li>
                        • <strong>Size:</strong> Slightly smaller than officer
                        quarters
                      </li>
                      <li>
                        • <strong>Comfort:</strong> Remain comfortable and
                        functional
                      </li>
                      <li>
                        • <strong>Storage:</strong> Ample space for personal
                        belongings
                      </li>
                      <li>
                        • <strong>Privacy:</strong> Good balance of privacy and
                        functionality
                      </li>
                      <li>
                        • <strong>Location:</strong> 05 deck
                      </li>
                    </ul>
                  </div>

                  <div className="bg-white/10 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-green-300 mb-4">
                      Unlicensed Rooms
                    </h4>
                    <ul className="text-white/80 text-sm space-y-2">
                      <li>
                        • <strong>Access:</strong> Key fobs like officer
                        quarters
                      </li>
                      <li>
                        • <strong>Similarity:</strong> Similar to T-AKE vessel
                        rooms
                      </li>
                      <li>
                        • <strong>CPO Location:</strong> 05 deck
                      </li>
                      <li>
                        • <strong>Crew Location:</strong> 03 and 04 decks
                      </li>
                      <li>
                        • <strong>03 Deck:</strong> Will likely share a bathroom
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Common Areas & Facilities */}
              <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                  <span className="text-2xl mr-3">🏢</span>
                  Common Areas & Facilities
                </h3>

                {/* Mess Deck */}
                <div className="mb-8">
                  <h4 className="text-lg font-semibold text-purple-300 mb-4 flex items-center">
                    <span className="text-xl mr-2">🍽️</span>
                    Mess Deck
                  </h4>

                  <div className="grid lg:grid-cols-2 gap-6">
                    <div>
                      <div className="bg-white/10 rounded-lg p-4">
                        <ul className="text-white/80 text-sm space-y-2">
                          <li>
                            • <strong>Size:</strong> Smaller due to reduced crew
                            size
                          </li>
                          <li>
                            • <strong>Adequacy:</strong> Adequate for the number
                            of people on board
                          </li>
                          <li>
                            • <strong>Layout:</strong> Efficient use of space
                          </li>
                          <li>
                            • <strong>Functionality:</strong> Meets all dining
                            needs
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-lg aspect-square overflow-hidden">
                        <img
                          src="/images/ships/msc/t-ao/mess_decks/Lewis Mess Deck 1.webp"
                          alt="T-AO Mess Deck"
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.currentTarget.src =
                              '/images/global/Coming_Soon_Graphic.png';
                          }}
                        />
                      </div>
                      <div className="rounded-lg aspect-square overflow-hidden">
                        <img
                          src="/images/ships/msc/t-ao/mess_decks/Lewis Mess Deck 2.webp"
                          alt="T-AO Mess Deck 2"
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.currentTarget.src =
                              '/images/global/Coming_Soon_Graphic.png';
                          }}
                        />
                      </div>
                      <div className="rounded-lg aspect-square overflow-hidden">
                        <img
                          src="/images/global/Coming_Soon_Graphic.png"
                          alt="T-AO Serving Line - Photo Coming Soon"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="rounded-lg aspect-square overflow-hidden">
                        <img
                          src="/images/global/Coming_Soon_Graphic.png"
                          alt="T-AO Galley - Photo Coming Soon"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Lounges */}
                <div className="mb-8">
                  <h4 className="text-lg font-semibold text-purple-300 mb-4 flex items-center">
                    <span className="text-xl mr-2">🛋️</span>
                    Lounges
                  </h4>

                  <div className="grid lg:grid-cols-2 gap-6">
                    <div>
                      <div className="bg-white/10 rounded-lg p-4">
                        <h5 className="font-medium text-white mb-3">
                          Deck Lounges
                        </h5>
                        <ul className="text-white/80 text-sm space-y-2">
                          <li>
                            • <strong>Distribution:</strong> Each deck has a
                            lounge
                          </li>
                          <li>
                            • <strong>Coffee:</strong> Coffee pot available
                          </li>
                          <li>
                            • <strong>Sink:</strong> Convenient sink access
                          </li>
                          <li>
                            • <strong>Entertainment:</strong> Television
                          </li>
                          <li>
                            • <strong>Ice:</strong> Some lounges have ice
                            machines
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-lg aspect-square overflow-hidden">
                        <img
                          src="/images/global/Coming_Soon_Graphic.png"
                          alt="T-AO Lounge - Photo Coming Soon"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="rounded-lg aspect-square overflow-hidden">
                        <img
                          src="/images/global/Coming_Soon_Graphic.png"
                          alt="T-AO Lounge Coffee Area - Photo Coming Soon"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="rounded-lg aspect-square overflow-hidden">
                        <img
                          src="/images/global/Coming_Soon_Graphic.png"
                          alt="T-AO Lounge TV Area - Photo Coming Soon"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="rounded-lg aspect-square overflow-hidden">
                        <img
                          src="/images/global/Coming_Soon_Graphic.png"
                          alt="T-AO Lounge Seating - Photo Coming Soon"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Ships Store */}
                <div className="mb-8">
                  <h4 className="text-lg font-semibold text-purple-300 mb-4 flex items-center">
                    <span className="text-xl mr-2">🏪</span>
                    Ships Store
                  </h4>

                  <div className="bg-white/10 rounded-lg p-4">
                    <ul className="text-white/80 text-sm space-y-2">
                      <li>
                        • <strong>Space Available:</strong> T-AOs do have space
                        for a ship store
                      </li>
                      <li>
                        • <strong>Size Advantage:</strong> Typically larger than
                        ship store found on T-AKEs
                      </li>
                      <li>
                        • <strong>Stock:</strong> Varies by operational schedule
                        and supply chain
                      </li>
                      <li>
                        • <strong>Convenience:</strong> Provides crew essentials
                        and snacks
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Gyms */}
              <div className="bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                  <span className="text-2xl mr-3">🏋️</span>
                  Gyms
                </h3>

                {/* Kaiser Class Gyms */}
                <div className="mb-8">
                  <h4 className="text-lg font-semibold text-emerald-300 mb-4">
                    Kaiser Class Gyms
                  </h4>

                  <div className="grid lg:grid-cols-2 gap-6">
                    <div>
                      <div className="bg-white/10 rounded-lg p-4 mb-4">
                        <h5 className="font-medium text-white mb-3">
                          Main Gym
                        </h5>
                        <ul className="text-white/80 text-sm space-y-2">
                          <li>
                            • <strong>Location:</strong> Same deck as steering
                            gear room
                          </li>
                          <li>
                            • <strong>Size:</strong> Decent size for crew needs
                          </li>
                          <li>
                            • <strong>Equipment:</strong> Varies by ship setup
                          </li>
                        </ul>
                      </div>

                      <div className="bg-white/10 rounded-lg p-4">
                        <h5 className="font-medium text-white mb-3">
                          Secondary Workout Area
                        </h5>
                        <ul className="text-white/80 text-sm space-y-2">
                          <li>
                            • <strong>Location:</strong> Some T-AOs have small
                            area on 06 deck
                          </li>
                          <li>
                            • <strong>Usage:</strong> May be repurposed by
                            Captain or Chief Mate
                          </li>
                          <li>
                            • <strong>Flexibility:</strong> Space usage varies
                            by ship needs
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-lg aspect-square overflow-hidden">
                        <img
                          src="/images/ships/msc/t-ao/gyms/Lewis Gym 1.webp"
                          alt="T-AO Main Gym"
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.currentTarget.src =
                              '/images/global/Coming_Soon_Graphic.png';
                          }}
                        />
                      </div>
                      <div className="rounded-lg aspect-square overflow-hidden">
                        <img
                          src="/images/ships/msc/t-ao/gyms/Lewisa gym 2.webp"
                          alt="T-AO Secondary Gym Area"
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.currentTarget.src =
                              '/images/global/Coming_Soon_Graphic.png';
                          }}
                        />
                      </div>
                      <div className="rounded-lg aspect-square overflow-hidden">
                        <img
                          src="/images/global/Coming_Soon_Graphic.png"
                          alt="Kaiser Class Cardio Equipment - Photo Coming Soon"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="rounded-lg aspect-square overflow-hidden">
                        <img
                          src="/images/global/Coming_Soon_Graphic.png"
                          alt="Kaiser Class Weight Equipment - Photo Coming Soon"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* John Lewis Class Gyms */}
                <div>
                  <h4 className="text-lg font-semibold text-emerald-300 mb-4">
                    John Lewis Class Gyms
                  </h4>

                  <div className="bg-white/10 rounded-lg p-4">
                    <p className="text-white/80 text-sm">
                      Gym facilities on the John Lewis class ships are being
                      developed as the class becomes fully operational. More
                      information will be available as crew members gain
                      experience with these newer vessels.
                    </p>
                  </div>
                </div>
              </div>

              {/* Photo Submission Call-to-Action */}
              <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-xl p-6 border border-yellow-400/30">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <span className="text-2xl mr-3">📸</span>
                  Help Us Document T-AO Life Aboard!
                </h3>
                <p className="text-white/80 mb-4">
                  We're working to create the most comprehensive resource for
                  T-AO living conditions. If you have photos of T-AO staterooms,
                  mess decks, gyms, lounges, or other areas that we're missing,
                  especially from John Lewis class ships, we'd love to include
                  them.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href="mailto:support@civsail.com?subject=T-AO Photos Submission"
                    className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-lg font-medium text-center transition-colors"
                  >
                    Submit Photos
                  </a>
                  <div className="text-yellow-300 text-sm flex items-center">
                    <span>📧 support@civsail.com</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Ships & Ports Section */}
          {activeSection === 'ships-ports' && (
            <div className="space-y-8">
              <div className="flex items-center mb-8">
                <MapPin className="w-8 h-8 text-orange-400 mr-4" />
                <h2 className="text-3xl font-bold text-white">Ships & Ports</h2>
              </div>

              {/* Fleet Overview */}
              <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4">
                  T-AO Fleet Overview
                </h3>
                <p className="text-white/80 mb-6">
                  The T-AO Class Replenishment Oiler is split into two different
                  classes, the Kaiser Class and the John Lewis Class. While all
                  Kaiser Class vessels are similar, there are some differences
                  between the ships. One major difference is that the Patuxent,
                  Laramie and Rappahannock are double hulled while the rest of
                  the Kaiser Class vessels are single hulled.
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white/10 rounded-lg p-4">
                    <h4 className="font-semibold text-white mb-3 flex items-center">
                      <span className="text-xl mr-2">⚙️</span>
                      Kaiser Class (Legacy Fleet)
                    </h4>
                    <ul className="text-white/70 text-sm space-y-1">
                      <li>• T-AO 187-204 (15 vessels built)</li>
                      <li>• Walter S. Diehl (T-AO 193) decommissioned</li>
                      <li>
                        • 3 double hull vessels: Patuxent, Laramie, Rappahannock
                      </li>
                      <li>• 11 single hull vessels (remaining active)</li>
                    </ul>
                  </div>

                  <div className="bg-white/10 rounded-lg p-4">
                    <h4 className="font-semibold text-white mb-3 flex items-center">
                      <span className="text-xl mr-2">🚢</span>
                      John Lewis Class (Modern Fleet)
                    </h4>
                    <ul className="text-white/70 text-sm space-y-1">
                      <li>• T-AO 205+ (20 total planned)</li>
                      <li>
                        • 3 delivered: John Lewis, Harvey Milk, Earl Warren
                      </li>
                      <li>• 4+ future vessels in production</li>
                      <li>• All double hull design (OPA 90 compliant)</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Individual Ships */}
              <div className="space-y-6">
                {/* Kaiser Class Ships */}
                <div className="bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-xl p-6 border border-white/10">
                  <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                    <span className="text-2xl mr-3">⚙️</span>
                    Kaiser Class Fleet (T-AO 187-204)
                  </h3>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    {[
                      {
                        name: 'Henry J. Kaiser',
                        hull: 'T-AO 187',
                        status: 'Active',
                        special: '',
                      },
                      {
                        name: 'Joshua Humphreys',
                        hull: 'T-AO 188',
                        status: 'Active',
                        special: '',
                      },
                      {
                        name: 'John Lenthall',
                        hull: 'T-AO 189',
                        status: 'Active',
                        special: '',
                      },
                      {
                        name: 'Walter S. Diehl',
                        hull: 'T-AO 193',
                        status: 'Decommissioned',
                        special: 'Decommissioned',
                      },
                      {
                        name: 'John Ericsson',
                        hull: 'T-AO 194',
                        status: 'Active',
                        special: '',
                      },
                      {
                        name: 'Leroy Grumman',
                        hull: 'T-AO 195',
                        status: 'Active',
                        special: '',
                      },
                      {
                        name: 'Kanawha',
                        hull: 'T-AO 196',
                        status: 'Active',
                        special: '',
                      },
                      {
                        name: 'Pecos',
                        hull: 'T-AO 197',
                        status: 'Active',
                        special: '',
                      },
                      {
                        name: 'Big Horn',
                        hull: 'T-AO 198',
                        status: 'Active',
                        special: '',
                      },
                      {
                        name: 'Tippecanoe',
                        hull: 'T-AO 199',
                        status: 'Active',
                        special: '',
                      },
                      {
                        name: 'Guadalupe',
                        hull: 'T-AO 200',
                        status: 'Active',
                        special: '',
                      },
                      {
                        name: 'Patuxent',
                        hull: 'T-AO 201',
                        status: 'Active',
                        special: 'Double Hull',
                      },
                      {
                        name: 'Yukon',
                        hull: 'T-AO 202',
                        status: 'Active',
                        special: '',
                      },
                      {
                        name: 'Laramie',
                        hull: 'T-AO 203',
                        status: 'Active',
                        special: 'Double Hull',
                      },
                      {
                        name: 'Rappahannock',
                        hull: 'T-AO 204',
                        status: 'Active',
                        special: 'Double Hull',
                      },
                    ].map((ship) => (
                      <div
                        key={ship.hull}
                        className={`bg-white/10 rounded-lg p-4 border border-white/20 transition-colors cursor-pointer group ${
                          ship.status === 'Decommissioned'
                            ? 'opacity-60 cursor-not-allowed'
                            : 'hover:bg-white/15'
                        }`}
                        onClick={() =>
                          ship.status !== 'Decommissioned' &&
                          handleShipClick(ship.name, ship.hull)
                        }
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span
                            className={`font-medium text-sm ${
                              ship.status === 'Decommissioned'
                                ? 'text-gray-400'
                                : 'text-white group-hover:text-orange-300'
                            } transition-colors`}
                          >
                            USNS {ship.name}
                          </span>
                          <span className="text-blue-300 text-xs font-mono">
                            {ship.hull}
                          </span>
                        </div>
                        <div className="text-white/60 text-xs mb-2">
                          {ship.status}
                        </div>
                        {ship.special && (
                          <div
                            className={`mt-2 px-2 py-1 rounded text-xs ${
                              ship.special === 'Decommissioned'
                                ? 'bg-red-500/20 text-red-300'
                                : 'bg-green-500/20 text-green-300'
                            }`}
                          >
                            {ship.special}
                          </div>
                        )}
                        {ship.status === 'Active' && (
                          <div className="mt-2 text-xs text-orange-300 opacity-0 group-hover:opacity-100 transition-opacity">
                            Click for news & photos →
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Double Hull Callout */}
                  <div className="bg-green-500/20 rounded-lg p-4 border border-green-400/30">
                    <h4 className="font-semibold text-green-300 mb-3">
                      🛡️ Double Hull Vessels
                    </h4>
                    <p className="text-green-200 text-sm mb-2">
                      Only 3 Kaiser class vessels have double hulls compliant
                      with the Oil Pollution Act of 1990:
                    </p>
                    <div className="grid md:grid-cols-3 gap-2">
                      <div className="bg-white/10 rounded px-3 py-2 text-sm text-white/80">
                        USNS Patuxent (T-AO 201)
                      </div>
                      <div className="bg-white/10 rounded px-3 py-2 text-sm text-white/80">
                        USNS Laramie (T-AO 203)
                      </div>
                      <div className="bg-white/10 rounded px-3 py-2 text-sm text-white/80">
                        USNS Rappahannock (T-AO 204)
                      </div>
                    </div>
                  </div>
                </div>

                {/* John Lewis Class Ships */}
                <div className="bg-gradient-to-br from-green-500/20 to-teal-500/20 rounded-xl p-6 border border-white/10">
                  <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                    <span className="text-2xl mr-3">🚢</span>
                    John Lewis Class Fleet (T-AO 205+)
                  </h3>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      {
                        name: 'John Lewis',
                        hull: 'T-AO 205',
                        status: 'Active',
                        special: 'Lead Ship',
                      },
                      {
                        name: 'Harvey Milk',
                        hull: 'T-AO 206',
                        status: 'Active',
                        special: 'Delivered',
                      },
                      {
                        name: 'Earl Warren',
                        hull: 'T-AO 207',
                        status: 'Active',
                        special: 'Delivered',
                      },
                      {
                        name: 'Robert F. Kennedy',
                        hull: 'T-AO 208',
                        status: 'Future',
                        special: 'Under Construction',
                      },
                      {
                        name: 'Lucy Stone',
                        hull: 'T-AO 209',
                        status: 'Future',
                        special: 'Under Construction',
                      },
                      {
                        name: 'Sojourner Truth',
                        hull: 'T-AO 210',
                        status: 'Future',
                        special: 'Planned',
                      },
                      {
                        name: 'Thurgood Marshall',
                        hull: 'T-AO 211',
                        status: 'Future',
                        special: 'Planned',
                      },
                    ].map((ship) => (
                      <div
                        key={ship.hull}
                        className={`bg-white/10 rounded-lg p-4 border border-white/20 transition-colors cursor-pointer group ${
                          ship.status === 'Future'
                            ? 'opacity-75'
                            : 'hover:bg-white/15'
                        }`}
                        onClick={() =>
                          ship.status === 'Active' &&
                          handleShipClick(ship.name, ship.hull)
                        }
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span
                            className={`font-medium text-sm ${
                              ship.status === 'Active'
                                ? 'text-white group-hover:text-green-300'
                                : 'text-gray-300'
                            } transition-colors`}
                          >
                            USNS {ship.name}
                          </span>
                          <span className="text-green-300 text-xs font-mono">
                            {ship.hull}
                          </span>
                        </div>
                        <div className="text-white/60 text-xs mb-2">
                          {ship.status === 'Active'
                            ? 'Operational'
                            : 'Future Vessel'}
                        </div>
                        {ship.special && (
                          <div
                            className={`mt-2 px-2 py-1 rounded text-xs ${
                              ship.status === 'Active'
                                ? 'bg-blue-500/20 text-blue-300'
                                : 'bg-yellow-500/20 text-yellow-300'
                            }`}
                          >
                            {ship.special}
                          </div>
                        )}
                        {ship.status === 'Active' && (
                          <div className="mt-2 text-xs text-green-300 opacity-0 group-hover:opacity-100 transition-opacity">
                            Click for news & photos →
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 p-4 bg-teal-500/20 rounded-lg border border-teal-400/30">
                    <p className="text-teal-300 text-sm">
                      <strong>Production Status:</strong> 20 total John Lewis
                      class vessels planned to replace the Kaiser class fleet.
                      All feature modern double hull design and improved
                      capabilities.
                    </p>
                  </div>
                </div>
              </div>

              {/* Fleet Assignments */}
              <div className="grid lg:grid-cols-2 gap-8">
                {/* East Coast Fleet */}
                <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl p-6 border border-white/10">
                  <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                    <span className="text-2xl mr-3">🌊</span>
                    East Coast Fleet
                  </h3>

                  <div className="space-y-4 mb-6">
                    <div className="grid grid-cols-1 gap-2">
                      {[
                        {
                          name: 'Joshua Humphreys',
                          hull: 'T-AO 188',
                          class: 'Kaiser',
                        },
                        {
                          name: 'John Lenthall',
                          hull: 'T-AO 189',
                          class: 'Kaiser',
                        },
                        {
                          name: 'Leroy Grumman',
                          hull: 'T-AO 195',
                          class: 'Kaiser',
                        },
                        { name: 'Kanawha', hull: 'T-AO 196', class: 'Kaiser' },
                        {
                          name: 'Patuxent',
                          hull: 'T-AO 201',
                          class: 'Kaiser (Double Hull)',
                        },
                        {
                          name: 'Laramie',
                          hull: 'T-AO 203',
                          class: 'Kaiser (Double Hull)',
                        },
                        {
                          name: 'Harvey Milk',
                          hull: 'T-AO 206',
                          class: 'John Lewis',
                        },
                        {
                          name: 'Earl Warren',
                          hull: 'T-AO 207',
                          class: 'John Lewis',
                        },
                      ].map((ship) => (
                        <div
                          key={ship.hull}
                          className="bg-white/10 rounded-lg p-3 hover:bg-white/15 transition-colors cursor-pointer group"
                          onClick={() => handleShipClick(ship.name, ship.hull)}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-white text-sm group-hover:text-purple-300 transition-colors">
                              USNS {ship.name}
                            </span>
                            <div className="text-right">
                              <div className="text-purple-300 text-xs font-mono">
                                {ship.hull}
                              </div>
                              <div className="text-white/60 text-xs">
                                {ship.class}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium text-purple-300 mb-3">
                      Common East Coast Ports
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        'Norfolk, Virginia',
                        'Craney Island, Virginia',
                        'Mobile, Alabama',
                        'Charleston, South Carolina',
                        'Mayport, Florida',
                        'Port Canaveral, Florida',
                        'Rota, Spain',
                        'Souda Bay, Greece',
                        'Augusta Bay, Italy',
                        'Zadar, Croatia',
                      ].map((port) => (
                        <div
                          key={port}
                          className="bg-white/10 rounded px-3 py-2 text-sm text-white/80 hover:bg-white/15 transition-colors"
                        >
                          {port}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* West Coast Fleet */}
                <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl p-6 border border-white/10">
                  <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                    <span className="text-2xl mr-3">🌍</span>
                    West Coast Fleet
                  </h3>

                  <div className="space-y-4 mb-6">
                    <div className="grid grid-cols-1 gap-2">
                      {[
                        {
                          name: 'Henry J. Kaiser',
                          hull: 'T-AO 187',
                          class: 'Kaiser',
                        },
                        {
                          name: 'John Ericsson',
                          hull: 'T-AO 194',
                          class: 'Kaiser',
                        },
                        { name: 'Pecos', hull: 'T-AO 197', class: 'Kaiser' },
                        { name: 'Big Horn', hull: 'T-AO 198', class: 'Kaiser' },
                        {
                          name: 'Tippecanoe',
                          hull: 'T-AO 199',
                          class: 'Kaiser',
                        },
                        {
                          name: 'Guadalupe',
                          hull: 'T-AO 200',
                          class: 'Kaiser',
                        },
                        { name: 'Yukon', hull: 'T-AO 202', class: 'Kaiser' },
                        {
                          name: 'Rappahannock',
                          hull: 'T-AO 204',
                          class: 'Kaiser (Double Hull)',
                        },
                        {
                          name: 'John Lewis',
                          hull: 'T-AO 205',
                          class: 'John Lewis',
                        },
                      ].map((ship) => (
                        <div
                          key={ship.hull}
                          className="bg-white/10 rounded-lg p-3 hover:bg-white/15 transition-colors cursor-pointer group"
                          onClick={() => handleShipClick(ship.name, ship.hull)}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-white text-sm group-hover:text-cyan-300 transition-colors">
                              USNS {ship.name}
                            </span>
                            <div className="text-right">
                              <div className="text-cyan-300 text-xs font-mono">
                                {ship.hull}
                              </div>
                              <div className="text-white/60 text-xs">
                                {ship.class}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium text-cyan-300 mb-3">
                      Common West Coast Ports
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        'San Diego, California',
                        'Manchester, Washington',
                        'Portland, Oregon',
                        'Oahu, Hawaii',
                        'Guam, Guam',
                        'Sasebo, Japan',
                        'Yokosuka, Japan',
                        'Okinawa, Japan',
                        'Chinhae, Korea',
                        'Busan, Korea',
                        'Singapore, Singapore',
                        'Subic Bay, Philippines',
                        'Sri Racha, Thailand',
                        'Phuket, Thailand',
                        'Dubai, UAE',
                        'Bahrain, Bahrain',
                      ].map((port) => (
                        <div
                          key={port}
                          className="bg-white/10 rounded px-3 py-2 text-sm text-white/80 hover:bg-white/15 transition-colors"
                        >
                          {port}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Fleet Summary */}
              <div className="bg-gradient-to-br from-gray-600/20 to-slate-600/20 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <span className="text-2xl mr-3">📊</span>
                  Fleet Summary
                </h3>

                <div className="grid md:grid-cols-5 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-400 mb-2">
                      15
                    </div>
                    <div className="text-white/70 text-sm">Total T-AOs</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-400 mb-2">
                      14
                    </div>
                    <div className="text-white/70 text-sm">
                      Kaiser Class Active
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-400 mb-2">
                      3
                    </div>
                    <div className="text-white/70 text-sm">
                      John Lewis Active
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-400 mb-2">
                      8
                    </div>
                    <div className="text-white/70 text-sm">East Coast</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-cyan-400 mb-2">
                      9
                    </div>
                    <div className="text-white/70 text-sm">West Coast</div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-orange-500/20 rounded-lg border border-orange-400/30">
                  <p className="text-orange-300 text-sm">
                    <strong>Fleet Modernization:</strong> The Kaiser class is
                    being phased out in favor of the modern John Lewis class.
                    Walter S. Diehl (T-AO 193) has already been decommissioned,
                    with 20 John Lewis class vessels planned as replacements.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center text-white/60">
          <p className="mb-2">
            Information based on current T-AO operations and sailor experiences
          </p>
          <p className="text-sm">
            Deployment schedules and operations may vary based on fleet
            requirements
          </p>
        </div>
      </div>
    </div>
  );
}
