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

export default function TARSShipPage() {
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
      value: '2 vessels',
    },
    {
      icon: <Users className="w-5 h-5" />,
      label: 'Crew Size',
      value: 'MSC: 28 / Navy Dive: up to 35',
    },
    {
      icon: <DollarSign className="w-5 h-5" />,
      label: 'Pay Category',
      value: 'Low base pay, but high OT possibility',
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      label: 'Deployment',
      value: 'Mission-dependent, in port except for missions',
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
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-slate-800 to-violet-800">
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
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-violet-600/20" />
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
            <span className="text-white">T-ARS</span>
          </div>

          {/* Hero Content */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center bg-purple-500/20 text-purple-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Ship className="w-4 h-4 mr-2" />
                Rescue & Salvage Ship
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6">
                T-ARS
                <span className="block text-2xl lg:text-3xl font-normal text-purple-300 mt-2">
                  Safeguard Class
                </span>
              </h1>
              <p className="text-xl text-white/80 leading-relaxed mb-8">
                Versatile rescue and salvage vessels equipped to rescue disabled
                ships, conduct dive operations, and provide heavy lift support.
                Their shallow draft allows access to ports other MSC ships
                can&apos;t reach.
              </p>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4">
                {quickStats.map((stat, index) => (
                  <div
                    key={index}
                    className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4"
                  >
                    <div className="flex items-center text-purple-300 mb-2">
                      {stat.icon}
                      <span className="ml-2 text-sm font-medium">
                        {stat.label}
                      </span>
                    </div>
                    <div className="text-white font-semibold text-sm">{stat.value}</div>
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
                          ? 'bg-purple-500/30 text-white border border-purple-400/50'
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
                <Ship className="w-8 h-8 text-purple-400 mr-4" />
                <h2 className="text-3xl font-bold text-white">Ship Overview</h2>
              </div>

              <div className="prose prose-invert max-w-none">
                <p className="text-lg text-white/80 leading-relaxed">
                  Military Sealift Command operates two Safeguard Class T-ARS
                  rescue and salvage ships: the USNS Grasp (T-ARS 51) and the
                  USNS Salvor (T-ARS 52). These versatile vessels are equipped
                  to rescue disabled ships, tow distressed vessels, conduct
                  salvage and dive operations, and provide heavy lift support.
                </p>

                <p className="text-lg text-white/80 leading-relaxed mb-8">
                  Their shallow draft and maneuverability enable them to access
                  ports and piers that other MSC ships cannot reach, making them
                  invaluable for retrieving sunken military equipment and
                  assisting in emergency situations. The T-ARS vessels are
                  unique ships in the MSC fleet.
                </p>

                <div className="grid lg:grid-cols-2 gap-8 mt-8">
                  {/* Capabilities */}
                  <div className="bg-gradient-to-br from-purple-500/20 to-violet-500/20 rounded-xl p-6 border border-white/10">
                    <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                      <span className="text-2xl mr-3">🎯</span>
                      Mission Capabilities
                    </h3>
                    <div className="space-y-4">
                      <div className="bg-white/10 rounded-lg p-4">
                        <h4 className="font-medium text-purple-300 mb-2">
                          Rescue Operations
                        </h4>
                        <p className="text-white/80 text-sm">
                          Rescue disabled ships and tow distressed vessels to
                          safety
                        </p>
                      </div>
                      <div className="bg-white/10 rounded-lg p-4">
                        <h4 className="font-medium text-purple-300 mb-2">
                          Dive Operations
                        </h4>
                        <p className="text-white/80 text-sm">
                          Conduct salvage and dive operations with diving depth
                          capability to 190 feet
                        </p>
                      </div>
                      <div className="bg-white/10 rounded-lg p-4">
                        <h4 className="font-medium text-purple-300 mb-2">
                          Heavy Lift Support
                        </h4>
                        <p className="text-white/80 text-sm">
                          150-ton hauling force with 7.5-ton forward boom and
                          40-ton aft boom
                        </p>
                      </div>
                      <div className="bg-white/10 rounded-lg p-4">
                        <h4 className="font-medium text-purple-300 mb-2">
                          Decompression Chamber
                        </h4>
                        <p className="text-white/80 text-sm">
                          Prepared for emergency medical assistance during
                          real-world diving events
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Unique Features */}
                  <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl p-6 border border-white/10">
                    <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                      <span className="text-2xl mr-3">⭐</span>
                      Unique Features
                    </h3>
                    <div className="space-y-4">
                      <div className="bg-white/10 rounded-lg p-4">
                        <h4 className="font-medium text-blue-300 mb-2">
                          Shallow Draft
                        </h4>
                        <p className="text-white/80 text-sm">
                          Can access ports and piers that other MSC ships cannot
                          reach
                        </p>
                      </div>
                      <div className="bg-white/10 rounded-lg p-4">
                        <h4 className="font-medium text-blue-300 mb-2">
                          Exotic Ports
                        </h4>
                        <p className="text-white/80 text-sm">
                          Frequently invited to unique and exotic locations
                          thanks to specialized role
                        </p>
                      </div>
                      <div className="bg-white/10 rounded-lg p-4">
                        <h4 className="font-medium text-blue-300 mb-2">
                          Training Platform
                        </h4>
                        <p className="text-white/80 text-sm">
                          May train foreign divers or participate in
                          &quot;Goodwill&quot; missions globally
                        </p>
                      </div>
                      <div className="bg-white/10 rounded-lg p-4">
                        <h4 className="font-medium text-blue-300 mb-2">
                          DP Training
                        </h4>
                        <p className="text-white/80 text-sm">
                          May serve as training platform for new Dynamic
                          Positioning (DP) class vessels
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Technical Specifications */}
                <div className="bg-gradient-to-br from-green-500/20 to-teal-500/20 rounded-xl p-6 border border-white/10 mt-8">
                  <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                    <span className="text-2xl mr-3">⚙️</span>
                    Technical Specifications
                  </h3>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white/10 rounded-lg p-4">
                      <h5 className="font-medium text-white mb-3">
                        Vessel Dimensions
                      </h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between border-b border-white/10 pb-1">
                          <span className="text-white/70">Length</span>
                          <span className="text-white">255 feet (77.7m)</span>
                        </div>
                        <div className="flex justify-between border-b border-white/10 pb-1">
                          <span className="text-white/70">Beam</span>
                          <span className="text-white">51 feet (15.5m)</span>
                        </div>
                        <div className="flex justify-between border-b border-white/10 pb-1">
                          <span className="text-white/70">Draft</span>
                          <span className="text-white">16 ft 9 in (5.11m)</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/70">Displacement</span>
                          <span className="text-white">3,283 tons (full)</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white/10 rounded-lg p-4">
                      <h5 className="font-medium text-white mb-3">
                        Propulsion & Performance
                      </h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between border-b border-white/10 pb-1">
                          <span className="text-white/70">Propulsion</span>
                          <span className="text-white">4 Diesel Engines</span>
                        </div>
                        <div className="flex justify-between border-b border-white/10 pb-1">
                          <span className="text-white/70">Shafts</span>
                          <span className="text-white">2</span>
                        </div>
                        <div className="flex justify-between border-b border-white/10 pb-1">
                          <span className="text-white/70">Horsepower</span>
                          <span className="text-white">4,200 HP</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/70">Top Speed</span>
                          <span className="text-white">14 knots</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4 mt-6">
                    <div className="bg-white/10 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-green-400 mb-1">
                        190 ft
                      </div>
                      <div className="text-white/70 text-sm">Diving Depth</div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-green-400 mb-1">
                        40 ton
                      </div>
                      <div className="text-white/70 text-sm">Aft Boom Capacity</div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-green-400 mb-1">
                        150 ton
                      </div>
                      <div className="text-white/70 text-sm">Hauling Force</div>
                    </div>
                  </div>
                </div>

                {/* Crew Composition */}
                <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-xl p-6 border border-white/10 mt-8">
                  <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                    <span className="text-2xl mr-3">👥</span>
                    Crew Composition
                  </h3>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white/10 rounded-lg p-4 text-center">
                      <div className="text-3xl font-bold text-purple-400 mb-2">
                        28
                      </div>
                      <div className="text-white/70 text-sm">MSC CIVMARs</div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4 text-center">
                      <div className="text-3xl font-bold text-purple-400 mb-2">
                        Up to 35
                      </div>
                      <div className="text-white/70 text-sm">
                        Navy Dive Units
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-purple-500/20 rounded-lg border border-purple-400/30">
                    <p className="text-purple-300 text-sm">
                      <strong>Small Crew Benefit:</strong> Due to the small MSC
                      crew size of only 28, there are often more overtime
                      opportunities available per person.
                    </p>
                  </div>
                </div>

                {/* Ship Characteristics Note */}
                <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-xl p-6 border border-white/10 mt-8">
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                    <span className="text-2xl mr-3">⚠️</span>
                    Important Considerations
                  </h3>

                  <div className="space-y-4">
                    <div className="bg-white/10 rounded-lg p-4">
                      <h4 className="font-medium text-yellow-300 mb-2">
                        Old Ships
                      </h4>
                      <p className="text-white/80 text-sm">
                        These are old ships that typically require annual
                        maintenance periods in shipyards.
                      </p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4">
                      <h4 className="font-medium text-yellow-300 mb-2">
                        Rough Weather Handling
                      </h4>
                      <p className="text-white/80 text-sm">
                        Small vessels that handle roughly in bad weather. They
                        often wait for favorable conditions before getting
                        underway.
                      </p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4">
                      <h4 className="font-medium text-yellow-300 mb-2">
                        Limited Endurance
                      </h4>
                      <p className="text-white/80 text-sm">
                        Slower transit speeds and limited capacity reduce
                        long-term endurance, leading to frequent port stops.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Operations & Pay Section */}
          {activeSection === 'operations' && (
            <div className="space-y-8">
              <div className="flex items-center mb-8">
                <DollarSign className="w-8 h-8 text-purple-400 mr-4" />
                <h2 className="text-3xl font-bold text-white">
                  Operations & Pay
                </h2>
              </div>

              {/* Operational Cycle */}
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-xl p-6 border border-white/10">
                  <h3 className="text-xl font-semibold text-white mb-4">
                    Operational Cycle
                  </h3>
                  <p className="text-white/80 mb-6">
                    The tasking and operational cycle for T-ARS vessels varies
                    based on real-world demands. Their operational tempo hinges
                    on how often they are called to respond to rescue or salvage
                    missions.
                  </p>

                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-white/10 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-300 mb-3">
                        Mission Types
                      </h4>
                      <ul className="text-white/80 text-sm space-y-2">
                        <li>• Rescue and salvage operations</li>
                        <li>• Training foreign divers</li>
                        <li>• &quot;Goodwill&quot; missions to showcase U.S. presence</li>
                        <li>• Emergency medical assistance (decompression chamber)</li>
                      </ul>
                    </div>

                    <div className="bg-white/10 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-300 mb-3">
                        Port vs Sea Time
                      </h4>
                      <ul className="text-white/80 text-sm space-y-2">
                        <li>• Typically spend more time in port than at sea</li>
                        <li>• Limited rescue/salvage calls</li>
                        <li>• Wait for favorable weather conditions</li>
                        <li>• Frequent port stops due to limited endurance</li>
                      </ul>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-500/20 rounded-lg border border-blue-400/30">
                    <p className="text-blue-300 text-sm">
                      <strong>Exotic Ports:</strong> Beyond dive or salvage
                      operations, T-ARS vessels may visit unique and exotic
                      ports during Goodwill missions, opening doors to
                      destinations other ships can&apos;t access.
                    </p>
                  </div>
                </div>

                {/* Money Situation */}
                <div className="bg-gradient-to-br from-green-500/20 to-teal-500/20 rounded-xl p-6 border border-white/10">
                  <h3 className="text-xl font-semibold text-white mb-4">
                    Money Situation
                  </h3>
                  <p className="text-white/80 mb-6">
                    While these vessels have the lowest base pay in the MSC, the
                    opportunity for extra earnings through overtime can be
                    substantial.
                  </p>

                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-red-500/20 rounded-lg p-4 border border-red-400/30">
                      <h4 className="font-medium text-red-300 mb-2">
                        Base Pay
                      </h4>
                      <p className="text-white/70 text-sm">
                        Lowest base pay in the MSC fleet
                      </p>
                    </div>
                    <div className="bg-green-500/20 rounded-lg p-4 border border-green-400/30">
                      <h4 className="font-medium text-green-300 mb-2">
                        Overtime Potential
                      </h4>
                      <p className="text-white/70 text-sm">
                        Substantial overtime opportunity due to small crew size
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="bg-white/10 rounded-lg p-4">
                      <h4 className="font-medium text-white mb-2">
                        Small Crew = More OT
                      </h4>
                      <p className="text-white/80 text-sm">
                        Due to the small crew size, T-ARS vessels often allow
                        for a generous amount of overtime (varies based on
                        ship&apos;s budget, captain, and operational demands).
                      </p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4">
                      <h4 className="font-medium text-white mb-2">
                        Tow/Salvage Operations
                      </h4>
                      <p className="text-white/80 text-sm">
                        If tasked with a tow or salvage operation, the workload
                        and overtime hours typically increase.
                      </p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4">
                      <h4 className="font-medium text-white mb-2">
                        DP Training Platform
                      </h4>
                      <p className="text-white/80 text-sm">
                        The T-ARS may serve as a training platform for new
                        Dynamic Positioning (DP) class vessels, which are in the
                        highest base-pay tier.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Department Operations */}
                <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl p-6 border border-white/10">
                  <h3 className="text-xl font-semibold text-white mb-6">
                    Department Operations
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
                            Can obtain <strong>towing endorsement</strong> if
                            opportunity arises
                          </li>
                          <li>
                            <strong>Best ship handling experience</strong> for
                            Deck Officers of every rank
                          </li>
                          <li>
                            Despite low pay, offers valuable experience
                          </li>
                          <li>Should not be discounted as an assignment</li>
                        </ul>
                      </div>

                      <div className="bg-white/10 rounded-lg p-4">
                        <h5 className="font-medium text-white mb-3">
                          Deck Day Workers (~7 personnel)
                        </h5>
                        <ul className="text-white/70 text-sm space-y-2">
                          <li>Responsible for external portion of ship</li>
                          <li>
                            Due to small crew, also maintain: main deck, in-house
                            passageways, ladder wells, and bathrooms
                          </li>
                          <li>
                            These tasks would normally be handled by SUs on
                            larger ships
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className="mt-4 p-3 bg-green-500/20 rounded-lg border border-green-400/30">
                      <p className="text-green-300 text-sm">
                        <strong>Career Benefit:</strong> This class of vessel
                        offers some of the best ship handling experiences for
                        Deck Officers. The valuable experience can outweigh the
                        lower base pay.
                      </p>
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
                        <p className="text-white/70 text-sm">
                          Since the vessels are old, there is usually some sort
                          of maintenance that needs to be performed. Expect to
                          conduct routine maintenance on a lot of systems.
                        </p>
                      </div>

                      <div className="bg-white/10 rounded-lg p-4">
                        <h5 className="font-medium text-white mb-3">
                          Engine Unlicensed
                        </h5>
                        <p className="text-white/70 text-sm">
                          Expect to conduct routine maintenance on a lot of
                          systems.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Supply Department */}
                  <div className="mb-8">
                    <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <span className="text-xl mr-2">📦</span>
                      Supply Department
                    </h4>

                    <div className="bg-white/10 rounded-lg p-4">
                      <p className="text-white/80 text-sm mb-4">
                        The Supply Department on T-ARS vessels is similar to
                        that of T-EPF ships:
                      </p>
                      <ul className="text-white/70 text-sm space-y-2">
                        <li>
                          <strong>Junior Supply Officer</strong> – leads
                          department in independent duty role
                        </li>
                        <li>
                          <strong>Steward Cook</strong> – functions as Chief
                          Steward
                        </li>
                        <li>
                          <strong>Cook Baker</strong> – handles most of the
                          cooking
                        </li>
                        <li>
                          <strong>Two Supply Utilitymen</strong> – assist
                          wherever needed
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Communications Department */}
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <span className="text-xl mr-2">📡</span>
                      Communications Department
                    </h4>

                    <div className="bg-white/10 rounded-lg p-4">
                      <p className="text-white/70 text-sm">
                        If you have any information to provide regarding the
                        T-ARS Communications Department, please reach out via
                        email!
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
                <Home className="w-8 h-8 text-purple-400 mr-4" />
                <h2 className="text-3xl font-bold text-white">Life Aboard</h2>
              </div>

              {/* Overview */}
              <div className="bg-gradient-to-br from-purple-500/20 to-violet-500/20 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4">
                  Life on a T-ARS
                </h3>
                <p className="text-white/80 mb-6">
                  The T-ARS vessels are smaller than most other MSC vessels.
                  Space is limited, but the small crew creates a close-knit
                  environment.
                </p>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-white/10 rounded-lg p-4 text-center">
                    <div className="text-2xl mb-2">📏</div>
                    <h4 className="font-medium text-white mb-2">Small Ship</h4>
                    <p className="text-white/70 text-sm">
                      255 feet—one of the smallest MSC vessels
                    </p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4 text-center">
                    <div className="text-2xl mb-2">👥</div>
                    <h4 className="font-medium text-white mb-2">Small Crew</h4>
                    <p className="text-white/70 text-sm">
                      Only 28 MSC mariners
                    </p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4 text-center">
                    <div className="text-2xl mb-2">🏖️</div>
                    <h4 className="font-medium text-white mb-2">
                      Mostly In Port
                    </h4>
                    <p className="text-white/70 text-sm">
                      More time in port than at sea
                    </p>
                  </div>
                </div>
              </div>

              {/* Officer Accommodations */}
              <div className="bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                  <span className="text-2xl mr-3">🛏️</span>
                  Officer Accommodations
                </h3>

                <div className="grid lg:grid-cols-2 gap-6 mb-6">
                  <div>
                    <div className="bg-white/10 rounded-lg p-4">
                      <h5 className="font-medium text-white mb-3">
                        Officer Rooms
                      </h5>
                      <ul className="text-white/80 text-sm space-y-2">
                        <li>
                          Officers and Department heads have their own room
                        </li>
                        <li>
                          <strong>In-room bathroom</strong> included
                        </li>
                        <li>
                          Rooms are much smaller than those on T-AKEs and T-AOs
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Officer Room Photos */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg aspect-square overflow-hidden">
                      <img
                        src="/images/global/Coming_Soon_Graphic.png"
                        alt="T-ARS Officer Room"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="rounded-lg aspect-square overflow-hidden">
                      <img
                        src="/images/global/Coming_Soon_Graphic.png"
                        alt="T-ARS Officer Room"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Unlicensed Berthing */}
              <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                  <span className="text-2xl mr-3">🛌</span>
                  Unlicensed Berthing
                </h3>

                <div className="grid lg:grid-cols-2 gap-6">
                  <div>
                    <div className="bg-white/10 rounded-lg p-4 mb-4">
                      <h5 className="font-medium text-white mb-3">
                        MSC Berthing
                      </h5>
                      <ul className="text-white/80 text-sm space-y-2">
                        <li>Unlicensed crew members live in berthing</li>
                        <li>Similar to T-AOE berthing areas but smaller</li>
                        <li>
                          <strong>Cubicle-style</strong> with rack, chair, and
                          small desk
                        </li>
                        <li>Shared heads in berthing areas</li>
                      </ul>
                    </div>

                    <div className="bg-white/10 rounded-lg p-4">
                      <h5 className="font-medium text-white mb-3">
                        Military Berthing
                      </h5>
                      <p className="text-white/80 text-sm">
                        Bulk berthing available for up to 40+ military members
                        (Navy Dive Units)
                      </p>
                    </div>
                  </div>

                  {/* Unlicensed Berthing Photos */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg aspect-square overflow-hidden">
                      <img
                        src="/images/ships/msc/t-ars/staterooms/unlicensed/dd2ab957-3d8f-41ca-80af-4d62d6b08c4a.JPG"
                        alt="T-ARS Unlicensed Berthing"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="rounded-lg aspect-square overflow-hidden">
                      <img
                        src="/images/ships/msc/t-ars/staterooms/unlicensed/PHOTO-2023-12-21-13-08-25.jpg"
                        alt="T-ARS Unlicensed Berthing"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Mess Decks */}
              <div className="bg-gradient-to-br from-teal-500/20 to-cyan-500/20 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                  <span className="text-2xl mr-3">🍽️</span>
                  Mess Decks
                </h3>

                <div className="grid lg:grid-cols-2 gap-6">
                  <div>
                    <p className="text-white/80 mb-4">
                      There are three mess decks on the ship:
                    </p>

                    <div className="space-y-3">
                      <div className="bg-white/10 rounded-lg p-4">
                        <h4 className="font-medium text-white mb-2">
                          Wardroom
                        </h4>
                        <p className="text-white/70 text-sm">
                          Small wardroom directly aft of the galley for officers
                          and department heads
                        </p>
                      </div>
                      <div className="bg-white/10 rounded-lg p-4">
                        <h4 className="font-medium text-white mb-2">
                          Main Mess
                        </h4>
                        <p className="text-white/70 text-sm">
                          Directly connected to the galley
                        </p>
                      </div>
                      <div className="bg-white/10 rounded-lg p-4">
                        <h4 className="font-medium text-white mb-2">
                          Dive/Military Area
                        </h4>
                        <p className="text-white/70 text-sm">
                          Separate area within Main Mess for Dive Department
                          and/or Military; can also serve as lounge space
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Mess Deck Photos */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg aspect-square overflow-hidden">
                      <img
                        src="/images/ships/msc/t-ars/mess_decks/8fd8fa09-cc77-48c1-b54e-2d150e8224aa.JPG"
                        alt="T-ARS Mess Deck"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="rounded-lg aspect-square overflow-hidden">
                      <img
                        src="/images/ships/msc/t-ars/mess_decks/f72e7565-b1c2-4b87-9a83-07f0cd979846.JPG"
                        alt="T-ARS Mess Deck"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Lounges */}
              <div className="bg-gradient-to-br from-gray-500/20 to-slate-500/20 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <span className="text-2xl mr-3">🛋️</span>
                  Lounges
                </h3>

                <div className="bg-yellow-500/20 rounded-lg p-4 border border-yellow-400/30">
                  <p className="text-yellow-300 text-sm">
                    <strong>Note:</strong> There are no dedicated lounge spaces
                    onboard. The Dive/Military area within the Main Mess can
                    serve as informal lounge space.
                  </p>
                </div>
              </div>

              {/* Offices */}
              <div className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <span className="text-2xl mr-3">🏢</span>
                  Offices
                </h3>

                <div className="space-y-4">
                  <div className="bg-white/10 rounded-lg p-4">
                    <h4 className="font-medium text-white mb-2">
                      Limited Space
                    </h4>
                    <p className="text-white/80 text-sm">
                      Due to limited space on an ARS, offices are compact and
                      may be integrated with or located near your berthing area.
                    </p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4">
                    <h4 className="font-medium text-white mb-2">
                      No Purser&apos;s Office
                    </h4>
                    <p className="text-white/80 text-sm">
                      The Captain serves as the Purser, so there is no separate
                      Purser&apos;s Office.
                    </p>
                  </div>
                </div>
              </div>

              {/* Gym */}
              <div className="bg-gradient-to-br from-green-500/20 to-teal-500/20 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                  <span className="text-2xl mr-3">🏋️</span>
                  Gym
                </h3>

                <div className="grid lg:grid-cols-2 gap-6">
                  <div>
                    <div className="bg-white/10 rounded-lg p-4">
                      <h5 className="font-medium text-white mb-3">
                        Small But Well-Stocked
                      </h5>
                      <ul className="text-white/80 text-sm space-y-2">
                        <li>Gym area is small</li>
                        <li>Surprisingly well-stocked with equipment</li>
                        <li>
                          Since ships are in port often, can utilize base gym
                          facilities
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Gym Photos */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg aspect-square overflow-hidden">
                      <img
                        src="/images/ships/msc/t-ars/gyms/27157e9c-bc8e-47eb-b1c8-f7d958206392.JPG"
                        alt="T-ARS Gym"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="rounded-lg aspect-square overflow-hidden">
                      <img
                        src="/images/ships/msc/t-ars/gyms/2ceb5213-c814-4691-a4e5-796758a49b3e.JPG"
                        alt="T-ARS Gym"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Photo Request */}
              <div className="bg-gradient-to-br from-purple-400/20 to-violet-400/20 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <span className="text-2xl mr-3">📸</span>
                  Help Us Build This Page
                </h3>
                <p className="text-white/80 mb-4">
                  Have photos from your time on a T-ARS? We&apos;d love to feature
                  them! Ship photos help future mariners know what to expect.
                </p>
                <p className="text-white/70 text-sm">
                  Send photos to:{' '}
                  <a
                    href="mailto:alec.schenning@civsail.com"
                    className="text-purple-300 hover:text-purple-200 underline"
                  >
                    alec.schenning@civsail.com
                  </a>
                </p>
              </div>
            </div>
          )}

          {/* Ships & Ports Section */}
          {activeSection === 'ships-ports' && (
            <div className="space-y-8">
              <div className="flex items-center mb-8">
                <MapPin className="w-8 h-8 text-purple-400 mr-4" />
                <h2 className="text-3xl font-bold text-white">Ships & Ports</h2>
              </div>

              {/* Fleet Overview */}
              <div className="bg-gradient-to-br from-purple-500/20 to-violet-500/20 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4">
                  Safeguard Class T-ARS Fleet
                </h3>
                <p className="text-white/80 mb-6">
                  Military Sealift Command operates two T-ARS class rescue and
                  salvage vessels, both stationed on the West Coast. Thanks to
                  their shallow drafts and specialized roles, these ships are
                  frequently invited to ports that other MSC vessels can&apos;t
                  access.
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white/10 rounded-lg p-4">
                    <h4 className="font-semibold text-white mb-3 flex items-center">
                      <span className="text-xl mr-2">🔱</span>
                      Fleet Status
                    </h4>
                    <ul className="text-white/70 text-sm space-y-1">
                      <li>2 vessels in class</li>
                      <li>Both West Coast designation</li>
                      <li>Rescue and salvage mission</li>
                      <li>Access to unique/exotic ports</li>
                    </ul>
                  </div>

                  <div className="bg-white/10 rounded-lg p-4">
                    <h4 className="font-semibold text-white mb-3 flex items-center">
                      <span className="text-xl mr-2">⭐</span>
                      Port Access Advantage
                    </h4>
                    <ul className="text-white/70 text-sm space-y-1">
                      <li>Shallow draft allows unique port access</li>
                      <li>Frequently visit exotic locations</li>
                      <li>Goodwill missions open many destinations</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Individual Ships */}
              <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                  <span className="text-2xl mr-3">🚢</span>
                  West Coast Fleet
                </h3>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  {/* USNS Grasp */}
                  <div
                    className="bg-white/10 rounded-lg p-4 hover:bg-white/15 transition-colors cursor-pointer group"
                    onClick={() => handleShipClick('Grasp', 'T-ARS-51')}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-white group-hover:text-purple-300 transition-colors">
                        USNS Grasp
                      </span>
                      <span className="text-purple-300 text-xs font-mono">
                        T-ARS 51
                      </span>
                    </div>
                    <div className="text-white/60 text-xs mb-2">Active</div>
                    <ul className="text-white/70 text-sm space-y-1 mt-3">
                      <li>
                        <strong>Designation:</strong> West Coast
                      </li>
                      <li>
                        <strong>Class:</strong> Safeguard
                      </li>
                      <li>
                        <strong>Mission:</strong> Rescue & Salvage
                      </li>
                    </ul>
                    <div className="mt-3 text-xs text-purple-300 opacity-0 group-hover:opacity-100 transition-opacity">
                      Click for news & photos →
                    </div>
                  </div>

                  {/* USNS Salvor */}
                  <div
                    className="bg-white/10 rounded-lg p-4 hover:bg-white/15 transition-colors cursor-pointer group"
                    onClick={() => handleShipClick('Salvor', 'T-ARS-52')}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-white group-hover:text-purple-300 transition-colors">
                        USNS Salvor
                      </span>
                      <span className="text-purple-300 text-xs font-mono">
                        T-ARS 52
                      </span>
                    </div>
                    <div className="text-white/60 text-xs mb-2">Active</div>
                    <ul className="text-white/70 text-sm space-y-1 mt-3">
                      <li>
                        <strong>Designation:</strong> West Coast
                      </li>
                      <li>
                        <strong>Class:</strong> Safeguard
                      </li>
                      <li>
                        <strong>Mission:</strong> Rescue & Salvage
                      </li>
                    </ul>
                    <div className="mt-3 text-xs text-purple-300 opacity-0 group-hover:opacity-100 transition-opacity">
                      Click for news & photos →
                    </div>
                  </div>
                </div>
              </div>

              {/* Common Ports */}
              <div className="bg-gradient-to-br from-green-500/20 to-teal-500/20 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                  <span className="text-2xl mr-3">🌏</span>
                  Common West Coast Ports
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                  {[
                    'Bremerton, WA',
                    'San Diego, CA',
                    'Hawaii',
                    'Alaska',
                    'Philippines',
                    'Australia',
                    'Guam',
                    'Japan',
                    'Korea',
                    'Micronesia',
                  ].map((port) => (
                    <div
                      key={port}
                      className="bg-white/10 rounded-lg px-4 py-3 text-center text-white/80 text-sm hover:bg-white/15 transition-colors"
                    >
                      {port}
                    </div>
                  ))}
                </div>

                <div className="p-4 bg-green-500/20 rounded-lg border border-green-400/30">
                  <p className="text-green-300 text-sm">
                    <strong>Exotic Destinations:</strong> Their capabilities
                    make them versatile and valuable, opening doors to many
                    unique destinations around the world that other MSC ships
                    can&apos;t access.
                  </p>
                </div>
              </div>

              {/* Fleet Summary */}
              <div className="bg-gradient-to-br from-orange-500/20 to-yellow-500/20 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                  <span className="text-2xl mr-3">📊</span>
                  Fleet Summary
                </h3>

                <div className="grid md:grid-cols-4 gap-4">
                  <div className="bg-white/10 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-purple-400 mb-2">
                      2
                    </div>
                    <div className="text-white/70 text-sm">Total Vessels</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-purple-400 mb-2">
                      255
                    </div>
                    <div className="text-white/70 text-sm">Feet in Length</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-purple-400 mb-2">
                      28
                    </div>
                    <div className="text-white/70 text-sm">MSC Crew</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-purple-400 mb-2">
                      190
                    </div>
                    <div className="text-white/70 text-sm">Feet Dive Depth</div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-purple-500/20 rounded-lg border border-purple-400/30">
                  <p className="text-purple-300 text-sm">
                    <strong>Unique Ships:</strong> The T-ARS vessels are unique
                    ships in the MSC fleet, offering rescue, salvage, diving,
                    and heavy lift capabilities with access to ports other ships
                    can&apos;t reach.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center text-white/50 text-sm">
          <p>
            Information compiled from MSC sources and mariner experiences.
            Details may vary by vessel and operational status.
          </p>
        </div>
      </div>
    </div>
  );
}
