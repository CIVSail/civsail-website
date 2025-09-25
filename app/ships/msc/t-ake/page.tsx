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
import ShipPopup from '@/components/ShipPopup'; // Add this import

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

export default function TAKEShipPage() {
  const [activeSection, setActiveSection] = useState('overview');
  // Add these new state variables for the popup
  const [selectedShip, setSelectedShip] = useState<{
    name: string;
    hull: string;
  } | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // Add this function to handle ship clicks
  const handleShipClick = (shipName: string, hull: string) => {
    setSelectedShip({ name: shipName, hull });
    setIsPopupOpen(true);
  };

  const quickStats: QuickStat[] = [
    {
      icon: <Ship className="w-5 h-5" />,
      label: 'Fleet Size',
      value: '14 vessels',
    },
    {
      icon: <Users className="w-5 h-5" />,
      label: 'Crew Size',
      value: 'MSC: 124 / Navy: 49',
    },
    {
      icon: <DollarSign className="w-5 h-5" />,
      label: 'Pay Category',
      value: 'High (Prepos: Highest)',
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      label: 'Deployment',
      value: '2-8 months',
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
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-slate-800 to-blue-800">
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
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-indigo-600/20" />
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
            <span className="text-white">T-AKE</span>
          </div>

          {/* Hero Content */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center bg-blue-500/20 text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Ship className="w-4 h-4 mr-2" />
                Combat Logistics Force
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6">
                T-AKE
                <span className="block text-2xl lg:text-3xl font-normal text-blue-300 mt-2">
                  Dry Cargo/Ammunition Ship
                </span>
              </h1>
              <p className="text-xl text-white/80 leading-relaxed mb-8">
                Combat Logistics Force vessels providing underway replenishment
                of dry cargo, ammunition, and provisions to Navy ships
                worldwide. Known for diverse operational cycles and competitive
                compensation.
              </p>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4">
                {quickStats.map((stat, index) => (
                  <div
                    key={index}
                    className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4"
                  >
                    <div className="flex items-center text-blue-300 mb-2">
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
                          ? 'bg-blue-500/30 text-white border border-blue-400/50'
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
                <Ship className="w-8 h-8 text-blue-400 mr-4" />
                <h2 className="text-3xl font-bold text-white">Ship Overview</h2>
              </div>

              <div className="prose prose-invert max-w-none">
                <p className="text-lg text-white/80 leading-relaxed">
                  The T-AKE class vessels play a crucial role in the Combat
                  Logistics Force (CLF) and are common assignments for CIVMARs
                  with Military Sealift Command. With 14 vessels under MSC's
                  purview, 12 vessels are tasked with conducting underway
                  replenishments (UNREPs), while the other 2 vessels are
                  critical components of the Marine Corps Maritime
                  Prepositioning Force.
                </p>

                <p className="text-lg text-white/80 leading-relaxed mb-8">
                  Being assigned to a T-AKE vessel is a common occurrence due to
                  the number of ships under MSC's control and the larger crew
                  size. These vessels offer a higher standard of living and
                  engage in a variety of operations. From beans to bullets and
                  Red Bull to jet engines, T-AKEs are the backbone of naval
                  logistics worldwide.
                </p>

                <div className="grid lg:grid-cols-2 gap-8 mt-8">
                  {/* Ship Characteristics */}
                  <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl p-6 border border-white/10">
                    <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                      <span className="text-2xl mr-3">⚙️</span>
                      Ship Characteristics
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-2 border-b border-white/10">
                        <span className="text-white/70">Propulsion</span>
                        <span className="text-white font-medium">
                          Single Screw Diesel Electric
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-white/10">
                        <span className="text-white/70">Length</span>
                        <span className="text-white font-medium">689 feet</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-white/10">
                        <span className="text-white/70">Beam</span>
                        <span className="text-white font-medium">106 feet</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-white/10">
                        <span className="text-white/70">Displacement</span>
                        <span className="text-white font-medium">
                          41,000 tons
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-white/10">
                        <span className="text-white/70">Top Speed</span>
                        <span className="text-white font-medium">20 knots</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-white/10">
                        <span className="text-white/70">Typical Speed</span>
                        <span className="text-white font-medium">
                          12-14 knots
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-white/10">
                        <span className="text-white/70">Draft</span>
                        <span className="text-white font-medium">30 feet</span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-white/70">Flight Deck</span>
                        <span className="text-white font-medium text-sm">
                          2 VERTREP helicopters
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Operational Characteristics */}
                  <div className="bg-gradient-to-br from-green-500/20 to-teal-500/20 rounded-xl p-6 border border-white/10">
                    <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                      <span className="text-2xl mr-3">📦</span>
                      Cargo Capacity
                    </h3>
                    <div className="space-y-4">
                      <div className="bg-white/10 rounded-lg p-4">
                        <div className="text-2xl font-bold text-green-400 mb-1">
                          6,675 tons
                        </div>
                        <div className="text-white/70 text-sm">Dry Cargo</div>
                      </div>
                      <div className="bg-white/10 rounded-lg p-4">
                        <div className="text-2xl font-bold text-green-400 mb-1">
                          1,716 tons
                        </div>
                        <div className="text-white/70 text-sm">
                          Refrigerated/Frozen Stores
                        </div>
                      </div>
                      <div className="bg-white/10 rounded-lg p-4">
                        <div className="text-2xl font-bold text-green-400 mb-1">
                          985,000 gal
                        </div>
                        <div className="text-white/70 text-sm">Cargo Fuels</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Crew Size Breakdown */}
                <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl p-6 border border-white/10 mt-8">
                  <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                    <span className="text-2xl mr-3">👥</span>
                    Crew Size Breakdown
                  </h3>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold text-white mb-3">
                        Regular T-AKE
                      </h4>
                      <div className="space-y-3">
                        <div className="bg-white/10 rounded-lg p-3 flex justify-between">
                          <span className="text-white/70">MSC Crew</span>
                          <span className="text-white font-medium">
                            80-120 people
                          </span>
                        </div>
                        <div className="bg-white/10 rounded-lg p-3 flex justify-between">
                          <span className="text-white/70">Air Detachment</span>
                          <span className="text-white font-medium">
                            30-40 people
                          </span>
                        </div>
                        <div className="bg-white/10 rounded-lg p-3 flex justify-between">
                          <span className="text-white/70">
                            Security Detachment
                          </span>
                          <span className="text-white font-medium">
                            20-30 people
                          </span>
                        </div>
                        <div className="bg-white/10 rounded-lg p-3 flex justify-between">
                          <span className="text-white/70">
                            Civilian Air Det.
                          </span>
                          <span className="text-white font-medium">
                            12 people
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-semibold text-white mb-3">
                        Preposition T-AKE
                      </h4>
                      <div className="space-y-3">
                        <div className="bg-white/10 rounded-lg p-3 flex justify-between">
                          <span className="text-white/70">MSC Crew</span>
                          <span className="text-white font-medium">
                            40-60 people
                          </span>
                        </div>
                        <div className="bg-white/10 rounded-lg p-3 flex justify-between">
                          <span className="text-white/70">Contractors</span>
                          <span className="text-white font-medium">
                            4-5 people
                          </span>
                        </div>
                      </div>
                      <div className="mt-4 p-3 bg-blue-500/20 rounded-lg border border-blue-400/30">
                        <p className="text-blue-300 text-sm">
                          <strong>Note:</strong> Lewis and Clark (T-AKE 1) and
                          Sacagawea (T-AKE 2) are the prepositioned vessels with
                          reduced manning
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mission and CLF Role */}
                <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-xl p-6 border border-white/10 mt-8">
                  <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                    <span className="text-2xl mr-3">🎯</span>
                    Mission: The CLF Fleet Cargo Carrier
                  </h3>

                  <p className="text-white/80 mb-6">
                    The T-AKE's main mission is to provide cargo to the United
                    States and allied Navies at sea. While AKEs can and do
                    provide fuel, they are primarily tasked with moving cargo
                    such as food, ammunition and repair parts.
                  </p>

                  <p className="text-white/80 mb-6">
                    The Combat Logistics Force (CLF) stands as an indispensable
                    pillar of the United States Navy, providing essential
                    logistical support that underpins the Navy's global reach,
                    operational readiness and mission effectiveness. By
                    facilitating underway replenishment operations, CLF vessels
                    ensure the continuous supply of fuel, ammunition, food, and
                    other critical resources to naval forces at sea.
                  </p>

                  <div className="grid md:grid-cols-3 gap-4 mt-6">
                    <div className="bg-white/10 rounded-lg p-4 text-center">
                      <div className="text-2xl mb-2">🌊</div>
                      <h4 className="font-medium text-white mb-2">
                        Global Reach
                      </h4>
                      <p className="text-white/70 text-sm">
                        Sustain operations far from home ports and logistical
                        infrastructure
                      </p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4 text-center">
                      <div className="text-2xl mb-2">⚡</div>
                      <h4 className="font-medium text-white mb-2">
                        Force Projection
                      </h4>
                      <p className="text-white/70 text-sm">
                        Project power and influence across multiple maritime
                        domains
                      </p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4 text-center">
                      <div className="text-2xl mb-2">🔄</div>
                      <h4 className="font-medium text-white mb-2">
                        Rapid Response
                      </h4>
                      <p className="text-white/70 text-sm">
                        Respond to emerging threats, crises, and contingencies
                      </p>
                    </div>
                  </div>
                </div>

                {/* UNREP Operations */}
                <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl p-6 border border-white/10 mt-8">
                  <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                    <span className="text-2xl mr-3">🔗</span>
                    Underway Replenishment (UNREP) Operations
                  </h3>

                  <p className="text-white/80 mb-6">
                    Underway replenishments (UNREPs) is the process of how fleet
                    sustaining materials are physically transferred at sea.
                    There are two types of transfers that make an UNREP:
                    Connected Replenishments (CONREPs) and Vertical
                    Replenishments (VERTREPs).
                  </p>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white/10 rounded-lg p-6">
                      <h4 className="font-semibold text-white mb-4 flex items-center">
                        <span className="text-xl mr-2">🔗</span>
                        CONREP (Connected Replenishment)
                      </h4>
                      <p className="text-white/70 text-sm mb-4">
                        Conducted between a CLF vessel and a Navy ship. T-AKEs
                        regularly provide 600-1,200 pallets of cargo to a
                        carrier each event.
                      </p>
                      <ul className="text-white/60 text-xs space-y-1">
                        <li>• Ships maneuver into precise position</li>
                        <li>• Rig crews transfer fuel hoses and cargo lines</li>
                        <li>• Supplies transferred "over the wire"</li>
                        <li>• Fuel, ammunition, food, spare parts</li>
                      </ul>
                    </div>

                    <div className="bg-white/10 rounded-lg p-6">
                      <h4 className="font-semibold text-white mb-4 flex items-center">
                        <span className="text-xl mr-2">🚁</span>
                        VERTREP (Vertical Replenishment)
                      </h4>
                      <p className="text-white/70 text-sm mb-4">
                        Method of replenishing naval vessels using helicopters.
                        Particularly useful when ships cannot maneuver close
                        together.
                      </p>
                      <ul className="text-white/60 text-xs space-y-1">
                        <li>• Supplies loaded onto pallets</li>
                        <li>• Helicopters lift between ships</li>
                        <li>• Hover over designated landing area</li>
                        <li>• Can occur simultaneously with CONREP</li>
                      </ul>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-yellow-500/20 rounded-lg border border-yellow-400/30">
                    <p className="text-yellow-300 text-sm">
                      <strong>Life on AKEs:</strong> If you are assigned to an
                      AKE, expect to get into a rhythm of seeing and
                      re-supplying a group of Navy ships. Some customer ships
                      are smooth sailing and send UNREP cookies at the end of
                      the evolution as a sign of good will. Others... don't send
                      any treats! UNREPs are a delicate dance between ships in
                      the middle of the ocean — truly a sight to see!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Operations & Pay Section */}
          {activeSection === 'operations' && (
            <div className="space-y-8">
              <div className="flex items-center mb-8">
                <DollarSign className="w-8 h-8 text-blue-400 mr-4" />
                <h2 className="text-3xl font-bold text-white">
                  Operations & Pay
                </h2>
              </div>

              {/* Operational Cycles */}
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-xl p-6 border border-white/10">
                  <h3 className="text-xl font-semibold text-white mb-4">
                    Operational Cycles
                  </h3>
                  <p className="text-white/80 mb-6">
                    Despite all having the same mission, T-AKEs have a few
                    different operational cycles. However, these cycles and
                    missions are always in flux and subject to change depending
                    on current events such as natural disasters and wars.
                  </p>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white/10 rounded-lg p-4 border border-white/20">
                      <h4 className="font-semibold text-white mb-3">
                        🚢 Deployed with Carrier Strike Group
                      </h4>
                      <p className="text-white/70 text-sm mb-3">
                        T-AKEs frequently deploy with Aircraft Carrier Strike
                        Groups to fulfill their mission as a dry cargo
                        replenishment vessel.
                      </p>
                      <ul className="text-white/60 text-xs space-y-1">
                        <li>
                          • <strong>East Coast:</strong> 2-8 month deployments,
                          return to Norfolk
                        </li>
                        <li>
                          • <strong>West Coast:</strong> Usually always deployed
                          overseas
                        </li>
                        <li>
                          • West Coast ships bounce between 5th and 7th fleet
                        </li>
                        <li>
                          • Return to US only for large maintenance periods
                        </li>
                      </ul>
                    </div>

                    <div className="bg-white/10 rounded-lg p-4 border border-white/20">
                      <h4 className="font-semibold text-white mb-3">
                        ⚓ Duty T-AKE
                      </h4>
                      <p className="text-white/70 text-sm mb-3">
                        Similar to duty tanker, usually a temporary cycle where
                        an AKE services local ships from Norfolk or San Diego.
                      </p>
                      <ul className="text-white/60 text-xs space-y-1">
                        <li>• Semi-frequent schedule with short underways</li>
                        <li>• Usually after maintenance, before deployment</li>
                        <li>• Based in Norfolk or San Diego</li>
                        <li>• Return to port frequently</li>
                      </ul>
                    </div>

                    <div className="bg-white/10 rounded-lg p-4 border border-white/20">
                      <h4 className="font-semibold text-white mb-3">
                        🔄 Ammo Round Robin
                      </h4>
                      <p className="text-white/70 text-sm mb-3">
                        More common on West Coast - visiting multiple ports in
                        an AOR to take old ammunition back to the States to be
                        refurbished or swapped.
                      </p>
                      <ul className="text-white/60 text-xs space-y-1">
                        <li>• Multiple ports in an AOR</li>
                        <li>• End of deployment cycle</li>
                        <li>• Before shipyard period</li>
                        <li>• Ammunition transport and exchange</li>
                      </ul>
                    </div>

                    <div className="bg-white/10 rounded-lg p-4 border border-white/20">
                      <h4 className="font-semibold text-white mb-3">
                        🎯 Pre-Positioned
                      </h4>
                      <p className="text-white/70 text-sm mb-3">
                        Only applicable to Lewis and Clark (T-AKE 1) and
                        Sacagawea (T-AKE 2).
                      </p>
                      <ul className="text-white/60 text-xs space-y-1">
                        <li>• 27 days in port, 1 day underway cycle</li>
                        <li>• Strategic overseas ports for emergencies</li>
                        <li>• Occasional exercises or maintenance</li>
                        <li>• Pre-staged for rapid response</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Port to Sea Ratio */}
                <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl p-6 border border-white/10">
                  <h3 className="text-xl font-semibold text-white mb-4">
                    Port to Sea Time Ratio
                  </h3>
                  <p className="text-white/80 mb-4">
                    An AKE's port to sea time ratio is contingent on the ship's
                    operational schedule. AKE schedules frequently change and
                    are some of the least reliable in MSC.
                  </p>

                  <div className="grid md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white/10 rounded-lg p-4">
                      <h4 className="font-medium text-white mb-2">
                        Minimum Port Time
                      </h4>
                      <p className="text-white/70 text-sm">
                        As little as 8 hours
                      </p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4">
                      <h4 className="font-medium text-white mb-2">
                        Maximum Port Time
                      </h4>
                      <p className="text-white/70 text-sm">
                        As long as 3 weeks
                      </p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4">
                      <h4 className="font-medium text-white mb-2">
                        Typical Schedule
                      </h4>
                      <p className="text-white/70 text-sm">
                        2-4 days port, 5-10 days underway
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-purple-500/20 rounded-lg border border-purple-400/30">
                    <p className="text-purple-300 text-sm">
                      <strong>Remember:</strong> T-AKEs and other CLF vessels
                      pull into port so the Navy doesn't have to! Schedules are
                      difficult to predict except for pre-positioned ships.
                    </p>
                  </div>
                </div>

                {/* Money Situation */}
                <div className="bg-gradient-to-br from-green-500/20 to-teal-500/20 rounded-xl p-6 border border-white/10">
                  <h3 className="text-xl font-semibold text-white mb-4">
                    💰 Pay & Compensation
                  </h3>
                  <p className="text-white/80 mb-6">
                    AKE's are moderately high paying vessels. The AKE general
                    base pay is typically on the higher end. The exception are
                    the USNS Lewis and Clark and USNS Sacagawea, which have
                    reduced manning placing them in the highest pay category.
                  </p>

                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-3">
                      <div className="bg-white/10 rounded-lg p-4 border border-green-400/30">
                        <h4 className="font-medium text-green-300 mb-2">
                          Regular T-AKEs
                        </h4>
                        <p className="text-white/70 text-sm">
                          Higher end of MSC pay scale
                        </p>
                      </div>
                      <div className="bg-white/10 rounded-lg p-4 border border-green-400/30">
                        <h4 className="font-medium text-green-300 mb-2">
                          Prepos Ships
                        </h4>
                        <p className="text-white/70 text-sm">
                          Highest pay category (reduced manning)
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="bg-white/10 rounded-lg p-4 border border-green-400/30">
                        <h4 className="font-medium text-green-300 mb-2">
                          Ammo Pay
                        </h4>
                        <p className="text-white/70 text-sm">
                          Additional pay when carrying ammunition
                        </p>
                      </div>
                      <div className="bg-white/10 rounded-lg p-4 border border-green-400/30">
                        <h4 className="font-medium text-green-300 mb-2">
                          Overtime Potential
                        </h4>
                        <p className="text-white/70 text-sm">
                          Increases with busy operational tempo
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-yellow-500/20 rounded-lg border border-yellow-400/30">
                    <p className="text-yellow-300 text-sm">
                      <strong>Pay factors:</strong> Captain, ship's budget,
                      department head, operational tempo, and ammunition
                      carriage. If carrying ammunition with a busy schedule,
                      compensation and overtime increase.
                    </p>
                  </div>
                </div>

                {/* Department Breakdown */}
                <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-xl p-6 border border-white/10">
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
                            • <strong>Billeted for Two Chief Mates:</strong>{' '}
                            Cargo Mate (cargo ops) & Chief Mate
                            (admin/maintenance)
                          </li>
                          <li>
                            • <strong>Billeted for Three 2nd Mates:</strong> 2
                            for cargo ops, 1 as Navigator/Operations
                          </li>
                          <li>
                            • <strong>Billeted for Three 3rd Mates:</strong>{' '}
                            Watch standing positions
                          </li>
                          <li>
                            •{' '}
                            <strong>Billeted for Day-working 3rd Mate:</strong>{' '}
                            Cargo 3 (rare)
                          </li>
                        </ul>
                      </div>

                      <div className="bg-white/10 rounded-lg p-4">
                        <h5 className="font-medium text-white mb-3">
                          Deck Day Workers
                        </h5>
                        <ul className="text-white/70 text-sm space-y-2">
                          <li>
                            • <strong>Bosun & Cargo Bosun:</strong> UNREP ops,
                            cargo operations
                          </li>
                          <li>
                            • <strong>Boatswain Mates:</strong> Forktruck
                            driving, crane operations
                          </li>
                          <li>
                            • <strong>ABs & OSs:</strong> Cargo gangs and
                            maintenance
                          </li>
                          <li>
                            • <strong>Preservation:</strong> Chipping, painting
                            when tempo drops
                          </li>
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
                        <ul className="text-white/70 text-sm space-y-2">
                          <li>
                            • <strong>Chief Engineer:</strong> Department head
                          </li>
                          <li>
                            • <strong>1st Engineer:</strong> Assistant to Chief
                          </li>
                          <li>
                            • <strong>Two 2nd Engineers:</strong> Cargo Engineer
                            & Engine 2nd
                          </li>
                          <li>
                            • <strong>Three 3rd Engineers:</strong> Watch
                            standing
                          </li>
                          <li>
                            • <strong>Day-working 3rd:</strong> If lucky!
                          </li>
                        </ul>
                        <div className="mt-3 p-2 bg-blue-500/20 rounded text-xs text-blue-300">
                          <strong>Note:</strong> Diesel plant = daily generator
                          switching practice
                        </div>
                      </div>

                      <div className="bg-white/10 rounded-lg p-4">
                        <h5 className="font-medium text-white mb-3">
                          Engine Unlicensed
                        </h5>
                        <ul className="text-white/70 text-sm space-y-2">
                          <li>• Change light bulbs, fix toilets</li>
                          <li>• Habitability equipment maintenance</li>
                          <li>• Painting and preservation in engine room</li>
                          <li>
                            • <strong>DEMACH:</strong> Fabrication,
                            forktruck/UNREP station maintenance
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

                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="bg-white/10 rounded-lg p-4">
                        <h5 className="font-medium text-white mb-3">
                          Food & Hotel Services
                        </h5>
                        <ul className="text-white/70 text-sm space-y-1">
                          <li>• Chief Steward (primary contact)</li>
                          <li>• Third Steward</li>
                          <li>• Cooks</li>
                          <li>• Supply Utilitymen</li>
                        </ul>
                      </div>

                      <div className="bg-white/10 rounded-lg p-4">
                        <h5 className="font-medium text-white mb-3">
                          Ship Support Office
                        </h5>
                        <ul className="text-white/70 text-sm space-y-1">
                          <li>• Supply Officer (SUPPO) Department Head</li>
                          <li>• Admin JSO (office manager)</li>
                          <li>• YNSK (Yeoman Storekeeper)</li>
                          <li>• ASK (Assistant Storekeeper)</li>
                          <li>• MSC-specific supply & logistics</li>
                        </ul>
                      </div>

                      <div className="bg-white/10 rounded-lg p-4">
                        <h5 className="font-medium text-white mb-3">
                          CLF Office
                        </h5>
                        <ul className="text-white/70 text-sm space-y-1">
                          <li>• Cargo CLF JSO</li>
                          <li>• YNSK & ASK support</li>
                          <li>• Navy-specific supply & logistics</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Communications Department */}
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <span className="text-xl mr-2">📡</span>
                      Communications Department
                    </h4>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-white/10 rounded-lg p-4">
                        <h5 className="font-medium text-white mb-3">
                          Personnel
                        </h5>
                        <ul className="text-white/70 text-sm space-y-2">
                          <li>
                            • <strong>SCO:</strong> Ships Communications Officer
                          </li>
                          <li>
                            • <strong>LAN Administrator:</strong> IT
                            troubleshooting
                          </li>
                          <li>
                            • <strong>CRET:</strong> Communications specialist
                          </li>
                          <li>
                            • <strong>Two RET2s:</strong> Radio technicians
                          </li>
                        </ul>
                      </div>

                      <div className="bg-white/10 rounded-lg p-4">
                        <h5 className="font-medium text-white mb-3">
                          Operations
                        </h5>
                        <ul className="text-white/70 text-sm space-y-2">
                          <li>
                            • <strong>LAN Admin:</strong> Network & IT support
                          </li>
                          <li>
                            • <strong>Radio Shack:</strong> Monitor/send Navy
                            messages
                          </li>
                          <li>• Internet better than other MSC platforms</li>
                          <li>• Still not known for speed</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Life on Board Summary */}
                <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl p-6 border border-white/10">
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                    <span className="text-xl mr-2">🏠</span>
                    Life on Board Summary
                  </h3>
                  <p className="text-white/80 mb-4">
                    AKE's are normal MSC vessels with a good number of amenities
                    and are comfortable vessels. Overall, they ride decently in
                    the water and are not the roughest ships.
                  </p>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-white/10 rounded-lg p-4">
                      <h4 className="font-medium text-white mb-2">
                        Sea Keeping
                      </h4>
                      <p className="text-white/70 text-sm">
                        Ride decently, not the roughest ships (depends on sea
                        state)
                      </p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4">
                      <h4 className="font-medium text-white mb-2">
                        Boredom Factor
                      </h4>
                      <p className="text-white/70 text-sm">
                        Long underways without ops can be boring, but activities
                        available
                      </p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4">
                      <h4 className="font-medium text-white mb-2">
                        Communications
                      </h4>
                      <p className="text-white/70 text-sm">
                        Internet and comms sporadic at best, like most vessels
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
                <Home className="w-8 h-8 text-blue-400 mr-4" />
                <h2 className="text-3xl font-bold text-white">Life Aboard</h2>
              </div>

              {/* Introduction */}
              <div className="bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4">
                  T-AKE Living Overview
                </h3>
                <p className="text-white/80 mb-6">
                  T-AKE vessels have a single house located on the aft end of
                  the ship. Comprised of 8 decks, T-AKEs are considered
                  comfortable vessels that have several amenities that increase
                  crewmember quality of life.
                </p>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-white/10 rounded-lg p-4">
                    <h4 className="font-medium text-white mb-2">
                      🏠 No Open Berthing
                    </h4>
                    <p className="text-white/70 text-sm">
                      All positions get individual or shared staterooms
                    </p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4">
                    <h4 className="font-medium text-white mb-2">
                      🧺 Deck Amenities
                    </h4>
                    <p className="text-white/70 text-sm">
                      Washers, dryers, and lounges on each level
                    </p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4">
                    <h4 className="font-medium text-white mb-2">
                      🛗 Elevators
                    </h4>
                    <p className="text-white/70 text-sm">
                      Personnel elevators from engine room to bridge
                    </p>
                  </div>
                </div>
              </div>

              {/* Staterooms and Berthing Areas */}
              <div className="bg-gradient-to-br from-green-500/20 to-teal-500/20 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                  <span className="text-2xl mr-3">🛏️</span>
                  Staterooms and Berthing Areas
                </h3>

                {/* Officer Staterooms */}
                <div className="mb-8">
                  <h4 className="text-lg font-semibold text-green-300 mb-4 flex items-center">
                    <span className="text-xl mr-2">👔</span>
                    Officer Staterooms
                  </h4>

                  <div className="grid lg:grid-cols-2 gap-6">
                    <div>
                      <div className="bg-white/10 rounded-lg p-4 mb-4">
                        <h5 className="font-medium text-white mb-3">
                          MSC Officers (06 Level)
                        </h5>
                        <ul className="text-white/80 text-sm space-y-1">
                          <li>
                            • Individual staterooms with private bathrooms
                          </li>
                          <li>• Full beds (not bunks)</li>
                          <li>• Some rooms equipped with computers</li>
                          <li>
                            • Captain & Chief Engineer have office/stateroom
                            combo
                          </li>
                        </ul>
                      </div>

                      <div className="bg-white/10 rounded-lg p-4">
                        <h5 className="font-medium text-white mb-3">
                          Military Officers & CPOs (05 Level)
                        </h5>
                        <ul className="text-white/80 text-sm space-y-1">
                          <li>
                            • Individual staterooms with private bathrooms
                          </li>
                          <li>• Own shower, sink, and toilet</li>
                          <li>• CPOs: port and starboard side rooms</li>
                          <li>
                            • Officers/AirDet: forward rooms (door separated)
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-lg aspect-square overflow-hidden">
                        <img
                          src="/images/ships/msc/t-ake/staterooms/T-AKE Officer Room 1 -CHD copy.JPG"
                          alt="T-AKE Officer Room"
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.currentTarget.src =
                              '/images/global/Coming_Soon_Graphic.png';
                          }}
                        />
                      </div>
                      <div className="rounded-lg aspect-square overflow-hidden">
                        <img
                          src="/images/ships/msc/t-ake/staterooms/T-AKE Officer Room 2 -CHD.JPG"
                          alt="T-AKE Officer Room 2"
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.currentTarget.src =
                              '/images/global/Coming_Soon_Graphic.png';
                          }}
                        />
                      </div>
                      <div className="rounded-lg aspect-square overflow-hidden">
                        <img
                          src="/images/ships/msc/t-ake/staterooms/T-AKE Officers Room 1.JPG"
                          alt="T-AKE Officers Room"
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.currentTarget.src =
                              '/images/global/Coming_Soon_Graphic.png';
                          }}
                        />
                      </div>
                      <div className="rounded-lg aspect-square overflow-hidden">
                        <img
                          src="/images/ships/msc/t-ake/staterooms/T-AKE Officers Room 2.JPG"
                          alt="T-AKE Officers Room 2"
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.currentTarget.src =
                              '/images/global/Coming_Soon_Graphic.png';
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Non-Officer Staterooms */}
                <div className="mb-8">
                  <h4 className="text-lg font-semibold text-green-300 mb-4 flex items-center">
                    <span className="text-xl mr-2">⚓</span>
                    Non-Officer Staterooms
                  </h4>

                  <div className="grid lg:grid-cols-2 gap-6">
                    <div>
                      <div className="bg-white/10 rounded-lg p-4 mb-4">
                        <h5 className="font-medium text-white mb-3">
                          Unlicensed Crew (03 & 04 Levels)
                        </h5>
                        <ul className="text-white/80 text-sm space-y-1">
                          <li>• Individual staterooms</li>
                          <li>• Shared bathroom with adjoining room</li>
                          <li>• Standard crew accommodations</li>
                          <li>• More privacy than lower decks</li>
                        </ul>
                      </div>

                      <div className="bg-white/10 rounded-lg p-4">
                        <h5 className="font-medium text-white mb-3">
                          Enlisted Military & Cadets (02 Level)
                        </h5>
                        <ul className="text-white/80 text-sm space-y-1">
                          <li>• Designed for two people to share</li>
                          <li>• Bunk beds with individual storage</li>
                          <li>• Shared bathroom between rooms</li>
                          <li>
                            • Often single occupancy if excess berthing space
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-lg aspect-square overflow-hidden">
                        <img
                          src="/images/global/Coming_Soon_Graphic.png"
                          alt="T-AKE Crew Stateroom - Photo Coming Soon"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="rounded-lg aspect-square overflow-hidden">
                        <img
                          src="/images/global/Coming_Soon_Graphic.png"
                          alt="T-AKE Enlisted Berthing - Photo Coming Soon"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="rounded-lg aspect-square overflow-hidden">
                        <img
                          src="/images/global/Coming_Soon_Graphic.png"
                          alt="T-AKE Shared Bathroom - Photo Coming Soon"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="rounded-lg aspect-square overflow-hidden">
                        <img
                          src="/images/global/Coming_Soon_Graphic.png"
                          alt="T-AKE Bunk Beds - Photo Coming Soon"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Galley and Mess Decks */}
              <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                  <span className="text-2xl mr-3">🍽️</span>
                  Galley and Mess Decks
                </h3>

                {/* Officers Mess */}
                <div className="mb-8">
                  <h4 className="text-lg font-semibold text-cyan-300 mb-4 flex items-center">
                    <span className="text-xl mr-2">👔</span>
                    Officers Mess
                  </h4>

                  <div className="grid lg:grid-cols-2 gap-6">
                    <div>
                      <div className="bg-white/10 rounded-lg p-4">
                        <ul className="text-white/80 text-sm space-y-2">
                          <li>• Separate dining area for officers</li>
                          <li>• More formal dining environment</li>
                          <li>• Same food as crew mess</li>
                          <li>• Goes through same serving line</li>
                        </ul>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-lg aspect-square overflow-hidden">
                        <img
                          src="/images/global/Coming_Soon_Graphic.png"
                          alt="T-AKE Officers Mess - Photo Coming Soon"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="rounded-lg aspect-square overflow-hidden">
                        <img
                          src="/images/global/Coming_Soon_Graphic.png"
                          alt="T-AKE Officer Dining - Photo Coming Soon"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Crew Mess */}
                <div className="mb-8">
                  <h4 className="text-lg font-semibold text-cyan-300 mb-4 flex items-center">
                    <span className="text-xl mr-2">⚓</span>
                    Crew Mess
                  </h4>

                  <div className="grid lg:grid-cols-2 gap-6">
                    <div>
                      <div className="bg-white/10 rounded-lg p-4 mb-4">
                        <h5 className="font-medium text-white mb-3">
                          Main Crew Mess
                        </h5>
                        <ul className="text-white/80 text-sm space-y-1">
                          <li>• Primary dining area for crew</li>
                          <li>• Larger capacity than officers mess</li>
                          <li>• Casual dining environment</li>
                        </ul>
                      </div>

                      <div className="bg-white/10 rounded-lg p-4 mb-4">
                        <h5 className="font-medium text-white mb-3">
                          CPO Mess
                        </h5>
                        <ul className="text-white/80 text-sm space-y-1">
                          <li>• Separate area for Chief Petty Officers</li>
                          <li>• Mid-level between officers and crew</li>
                        </ul>
                      </div>

                      <div className="bg-white/10 rounded-lg p-4">
                        <h5 className="font-medium text-white mb-3">
                          "Dirty" Mess
                        </h5>
                        <ul className="text-white/80 text-sm space-y-1">
                          <li>• For workers coming off dirty jobs</li>
                          <li>• Night lunch storage area</li>
                          <li>
                            • Don't touch wrapped plates - they're for night
                            watch!
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-lg aspect-square overflow-hidden">
                        <img
                          src="/images/ships/msc/t-ake/mess_decks/T-AKE Crew Mess- CHD 2.JPG"
                          alt="T-AKE Crew Mess"
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
                          alt="T-AKE Serving Line - Photo Coming Soon"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="rounded-lg aspect-square overflow-hidden">
                        <img
                          src="/images/global/Coming_Soon_Graphic.png"
                          alt="T-AKE CPO Mess - Photo Coming Soon"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="rounded-lg aspect-square overflow-hidden">
                        <img
                          src="/images/global/Coming_Soon_Graphic.png"
                          alt="T-AKE Sandwich Line - Photo Coming Soon"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-cyan-500/20 rounded-lg border border-cyan-400/30">
                  <p className="text-cyan-300 text-sm">
                    <strong>Note:</strong> Despite separate mess decks, everyone
                    goes through the same serving line and receives the same
                    food. T-AKEs also have a "sandwich line" that varies in use
                    depending on the ship.
                  </p>
                </div>
              </div>

              {/* Gyms */}
              <div className="bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                  <span className="text-2xl mr-3">🏋️</span>
                  Gyms
                </h3>

                <div className="grid lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="bg-white/10 rounded-lg p-4">
                      <h4 className="font-medium text-emerald-300 mb-3 flex items-center">
                        <span className="mr-2">🏃</span>
                        04 Level - Cardio Gym
                      </h4>
                      <ul className="text-white/80 text-sm space-y-1">
                        <li>
                          • Cardio machines (treadmills, bikes, ellipticals)
                        </li>
                        <li>• Various fitness equipment</li>
                        <li>• Primary cardio workout space</li>
                        <li>• Equipment varies by ship</li>
                      </ul>
                    </div>

                    <div className="bg-white/10 rounded-lg p-4">
                      <h4 className="font-medium text-emerald-300 mb-3 flex items-center">
                        <span className="mr-2">💪</span>
                        06 Level - Weight Gym
                      </h4>
                      <ul className="text-white/80 text-sm space-y-1">
                        <li>• Dumbbells up to 100 pounds</li>
                        <li>• Weightlifting machines</li>
                        <li>• Primary strength training area</li>
                        <li>• Setup varies from ship to ship</li>
                      </ul>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg aspect-square overflow-hidden">
                      <img
                        src="/images/ships/msc/t-ake/gyms/T-AKE Gym 1 -CHD.JPG"
                        alt="T-AKE Cardio Gym"
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
                        alt="T-AKE Weight Gym - Photo Coming Soon"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="rounded-lg aspect-square overflow-hidden">
                      <img
                        src="/images/global/Coming_Soon_Graphic.png"
                        alt="T-AKE Cardio Equipment - Photo Coming Soon"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="rounded-lg aspect-square overflow-hidden">
                      <img
                        src="/images/global/Coming_Soon_Graphic.png"
                        alt="T-AKE Weight Equipment - Photo Coming Soon"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Lounges and Common Areas */}
              <div className="bg-gradient-to-br from-violet-500/20 to-purple-500/20 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                  <span className="text-2xl mr-3">🛋️</span>
                  Lounges and Common Areas
                </h3>

                <div className="grid lg:grid-cols-2 gap-6">
                  <div>
                    <div className="bg-white/10 rounded-lg p-4 mb-4">
                      <h4 className="font-medium text-violet-300 mb-3">
                        Deck Lounges
                      </h4>
                      <ul className="text-white/80 text-sm space-y-1">
                        <li>• One lounge per deck with staterooms</li>
                        <li>• Computers for internet access</li>
                        <li>• Card tables and seating areas</li>
                        <li>• Television and coffee maker</li>
                        <li>• Sink for convenience</li>
                      </ul>
                    </div>

                    <div className="bg-white/10 rounded-lg p-4 mb-4">
                      <h4 className="font-medium text-violet-300 mb-3">
                        Library (02 Level)
                      </h4>
                      <ul className="text-white/80 text-sm space-y-1">
                        <li>• Books and reading materials</li>
                        <li>• Multiple computers</li>
                        <li>• Quiet space for reading/study</li>
                      </ul>
                    </div>

                    <div className="bg-white/10 rounded-lg p-4">
                      <h4 className="font-medium text-violet-300 mb-3">
                        Ship Store (02 Level)
                      </h4>
                      <ul className="text-white/80 text-sm space-y-1">
                        <li>• Usage varies greatly by ship</li>
                        <li>• Stock depends on schedule and operator</li>
                        <li>• Basic supplies and snacks when operational</li>
                      </ul>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg aspect-square overflow-hidden">
                      <img
                        src="/images/ships/msc/t-ake/lounges/T-AKE Crew Lounge 1 -CHD.JPG"
                        alt="T-AKE Crew Lounge"
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.currentTarget.src =
                            '/images/global/Coming_Soon_Graphic.png';
                        }}
                      />
                    </div>
                    <div className="rounded-lg aspect-square overflow-hidden">
                      <img
                        src="/images/ships/msc/t-ake/lounges/T-AKE Crew Lounge 2-CHD .JPG"
                        alt="T-AKE Crew Lounge 2"
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.currentTarget.src =
                            '/images/global/Coming_Soon_Graphic.png';
                        }}
                      />
                    </div>
                    <div className="rounded-lg aspect-square overflow-hidden">
                      <img
                        src="/images/ships/msc/t-ake/lounges/T-AKE Library 2-CHD.JPG"
                        alt="T-AKE Library"
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.currentTarget.src =
                            '/images/global/Coming_Soon_Graphic.png';
                        }}
                      />
                    </div>
                    <div className="rounded-lg aspect-square overflow-hidden">
                      <img
                        src="/images/ships/msc/t-ake/lounges/T-AKE Library-CHD.JPG"
                        alt="T-AKE Library Computer Area"
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.currentTarget.src =
                            '/images/global/Coming_Soon_Graphic.png';
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Other - T-AKE Specific */}
              <div className="bg-gradient-to-br from-slate-600/20 to-gray-600/20 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                  <span className="text-2xl mr-3">🏢</span>
                  Other - T-AKE Specific Areas
                </h3>

                <div className="grid lg:grid-cols-2 gap-6">
                  <div>
                    <div className="bg-white/10 rounded-lg p-4 mb-4">
                      <h4 className="font-medium text-slate-300 mb-3">
                        Offices & Workspaces
                      </h4>
                      <ul className="text-white/80 text-sm space-y-1">
                        <li>
                          • <strong>01 Level:</strong> Chief Steward, Cargo
                          offices (forward)
                        </li>
                        <li>
                          • <strong>02 Level:</strong> Medical, Supply, Purser,
                          Chief Mate
                        </li>
                        <li>
                          • <strong>06 Level:</strong> Captain & Chief Engineer
                          (with staterooms)
                        </li>
                        <li>
                          • <strong>07 Level:</strong> Bridge, Radio, LAN Admin,
                          Navigator
                        </li>
                      </ul>
                    </div>

                    <div className="bg-white/10 rounded-lg p-4">
                      <h4 className="font-medium text-slate-300 mb-3">
                        Special Features
                      </h4>
                      <ul className="text-white/80 text-sm space-y-1">
                        <li>• Barber shop (some AKEs, usually 02 level)</li>
                        <li>• Medical office with treatment capabilities</li>
                        <li>• Multiple office spaces for department heads</li>
                        <li>• Laundry facilities on each deck</li>
                      </ul>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg aspect-square overflow-hidden">
                      <img
                        src="/images/global/Coming_Soon_Graphic.png"
                        alt="T-AKE Bridge - Photo Coming Soon"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="rounded-lg aspect-square overflow-hidden">
                      <img
                        src="/images/global/Coming_Soon_Graphic.png"
                        alt="T-AKE Medical Office - Photo Coming Soon"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="rounded-lg aspect-square overflow-hidden">
                      <img
                        src="/images/global/Coming_Soon_Graphic.png"
                        alt="T-AKE Barber Shop - Photo Coming Soon"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="rounded-lg aspect-square overflow-hidden">
                      <img
                        src="/images/global/Coming_Soon_Graphic.png"
                        alt="T-AKE Office Space - Photo Coming Soon"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Photo Submission Call-to-Action */}
              <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-xl p-6 border border-yellow-400/30">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <span className="text-2xl mr-3">📸</span>
                  Help Us Complete This Section!
                </h3>
                <p className="text-white/80 mb-4">
                  We're working to make this the most accurate and comprehensive
                  resource for T-AKE life aboard. If you have photos of T-AKE
                  staterooms, mess decks, gyms, or other areas that we're
                  missing, we'd love to include them.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href="mailto:support@civsail.com?subject=T-AKE Photos Submission"
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

          {/* Ships & Ports Section - UPDATED with click handlers */}
          {activeSection === 'ships-ports' && (
            <div className="space-y-8">
              <div className="flex items-center mb-8">
                <MapPin className="w-8 h-8 text-blue-400 mr-4" />
                <h2 className="text-3xl font-bold text-white">Ships & Ports</h2>
              </div>

              {/* Fleet Overview */}
              <div className="bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4">
                  T-AKE Fleet Overview
                </h3>
                <p className="text-white/80 mb-6">
                  MSC currently has 14 T-AKE vessels split between the East and
                  West Coast, each with distinct operational areas and port
                  patterns.
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white/10 rounded-lg p-4">
                    <h4 className="font-semibold text-white mb-3 flex items-center">
                      <span className="text-xl mr-2">🌊</span>
                      East Coast (5 vessels)
                    </h4>
                    <ul className="text-white/70 text-sm space-y-1">
                      <li>• Homeported in Norfolk, Virginia</li>
                      <li>• Deploy to 6th fleet (occasional 5th fleet)</li>
                      <li>
                        • Serve as East Coast duty tanker when not deployed
                      </li>
                      <li>• Return to Norfolk between deployments</li>
                    </ul>
                  </div>

                  <div className="bg-white/10 rounded-lg p-4">
                    <h4 className="font-semibold text-white mb-3 flex items-center">
                      <span className="text-xl mr-2">🌏</span>
                      West Coast (9 vessels)
                    </h4>
                    <ul className="text-white/70 text-sm space-y-1">
                      <li>• Homeported in San Diego, California</li>
                      <li>• Almost always forward deployed</li>
                      <li>• Deploy to 5th and 7th fleet</li>
                      <li>• Return for shipyards and major exercises</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Individual Ships */}
              <div className="space-y-6">
                {/* East Coast Ships - UPDATED with click handlers */}
                <div className="bg-gradient-to-br from-green-500/20 to-teal-500/20 rounded-xl p-6 border border-white/10">
                  <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                    <span className="text-2xl mr-3">🇺🇸</span>
                    East Coast T-AKEs
                  </h3>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    {[
                      {
                        name: 'Lewis and Clark',
                        hull: 'T-AKE 1',
                        special: 'Preposition - Diego Garcia',
                      },
                      {
                        name: 'Sacagawea',
                        hull: 'T-AKE 2',
                        special: 'Preposition - Saipan',
                      },
                      {
                        name: 'Robert E. Peary',
                        hull: 'T-AKE 5',
                        special: 'Norfolk Homeport',
                      },
                      {
                        name: 'William McLean',
                        hull: 'T-AKE 12',
                        special: 'Norfolk Homeport',
                      },
                      {
                        name: 'Medgar Evers',
                        hull: 'T-AKE 13',
                        special: 'Norfolk Homeport',
                      },
                    ].map((ship) => (
                      <div
                        key={ship.hull}
                        className="bg-white/10 rounded-lg p-4 border border-white/20 hover:bg-white/15 transition-colors cursor-pointer group"
                        onClick={() => handleShipClick(ship.name, ship.hull)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-white text-sm group-hover:text-blue-300 transition-colors">
                            USNS {ship.name}
                          </span>
                          <span className="text-green-300 text-xs font-mono">
                            {ship.hull}
                          </span>
                        </div>
                        <div className="text-white/60 text-xs mb-2">
                          {ship.special}
                        </div>
                        {ship.special.includes('Preposition') && (
                          <div className="mt-2 px-2 py-1 bg-yellow-500/20 rounded text-xs text-yellow-300">
                            Special Mission
                          </div>
                        )}
                        <div className="mt-2 text-xs text-blue-300 opacity-0 group-hover:opacity-100 transition-opacity">
                          Click for news & photos →
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Preposition Ships Detail */}
                  <div className="bg-yellow-500/20 rounded-lg p-4 border border-yellow-400/30">
                    <h4 className="font-semibold text-yellow-300 mb-3">
                      ⭐ Special Mission: Pre-Position Ships
                    </h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-medium text-white mb-2">
                          USNS Lewis and Clark (T-AKE 1)
                        </h5>
                        <ul className="text-yellow-200 text-sm space-y-1">
                          <li>
                            • <strong>Homeport:</strong> Diego Garcia
                          </li>
                          <li>
                            • <strong>Mission:</strong> Store ammo/cargo for
                            USMC
                          </li>
                          <li>
                            • <strong>Maintenance:</strong> Chinhae, South Korea
                          </li>
                          <li>
                            • <strong>US Returns:</strong> Charleston,
                            Jacksonville for cargo
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-medium text-white mb-2">
                          USNS Sacagawea (T-AKE 2)
                        </h5>
                        <ul className="text-yellow-200 text-sm space-y-1">
                          <li>
                            • <strong>Homeport:</strong> Saipan
                          </li>
                          <li>
                            • <strong>Mission:</strong> Store ammo/cargo for
                            USMC
                          </li>
                          <li>
                            • <strong>Maintenance:</strong> Chinhae, South Korea
                          </li>
                          <li>
                            • <strong>US Returns:</strong> Charleston,
                            Jacksonville for cargo
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* West Coast Ships - UPDATED with click handlers */}
                <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl p-6 border border-white/10">
                  <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                    <span className="text-2xl mr-3">🌊</span>
                    West Coast T-AKEs
                  </h3>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      { name: 'Alan Shepard', hull: 'T-AKE 3' },
                      { name: 'Richard E. Byrd', hull: 'T-AKE 4' },
                      { name: 'Amelia Earhart', hull: 'T-AKE 6' },
                      { name: 'Carl Brashear', hull: 'T-AKE 7' },
                      { name: 'Wally Schirra', hull: 'T-AKE 8' },
                      { name: 'Matthew Perry', hull: 'T-AKE 9' },
                      { name: 'Charles Drew', hull: 'T-AKE 10' },
                      { name: 'Washington Chambers', hull: 'T-AKE 11' },
                      { name: 'Cesar Chavez', hull: 'T-AKE 14' },
                    ].map((ship) => (
                      <div
                        key={ship.hull}
                        className="bg-white/10 rounded-lg p-4 border border-white/20 hover:bg-white/15 transition-colors cursor-pointer group"
                        onClick={() => handleShipClick(ship.name, ship.hull)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-white text-sm group-hover:text-blue-300 transition-colors">
                            USNS {ship.name}
                          </span>
                          <span className="text-purple-300 text-xs font-mono">
                            {ship.hull}
                          </span>
                        </div>
                        <div className="text-white/60 text-xs mb-2">
                          San Diego Homeport
                        </div>
                        <div className="text-xs text-blue-300 opacity-0 group-hover:opacity-100 transition-opacity">
                          Click for news & photos →
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 p-4 bg-purple-500/20 rounded-lg border border-purple-400/30">
                    <p className="text-purple-300 text-sm">
                      <strong>Note:</strong> West Coast T-AKEs are almost always
                      forward deployed and occasionally return to the US for
                      shipyards and participation in major naval exercises like
                      RIMPAC and Talisman Saber.
                    </p>
                  </div>
                </div>
              </div>

              {/* Common Ports */}
              <div className="grid lg:grid-cols-2 gap-8">
                {/* East Coast Ports */}
                <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-xl p-6 border border-white/10">
                  <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                    <span className="text-2xl mr-3">🏛️</span>
                    Common East Coast Ports
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-orange-300 mb-3">
                        United States
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          'Norfolk, Virginia',
                          'Earle, New Jersey',
                          'Craney Island, Virginia',
                          'Yorktown, Virginia',
                          'Mobile, Alabama',
                          'Charleston, South Carolina',
                          'Jacksonville, Florida',
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

                    <div>
                      <h4 className="font-medium text-orange-300 mb-3">
                        Europe/Mediterranean
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        {[
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
                </div>

                {/* West Coast Ports */}
                <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl p-6 border border-white/10">
                  <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                    <span className="text-2xl mr-3">🌏</span>
                    Common West Coast Ports
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-cyan-300 mb-3">
                        United States & Pacific
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          'San Diego, California',
                          'Indian Island, Washington',
                          'Manchester, Washington',
                          'Portland, Oregon',
                          'Oahu, Hawaii',
                          'Guam, Guam',
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

                    <div>
                      <h4 className="font-medium text-cyan-300 mb-3">
                        Japan & Korea
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          'Sasebo, Japan',
                          'Yokosuka, Japan',
                          'Okinawa, Japan',
                          'Chinhae, Korea',
                          'Busan, Korea',
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

                    <div>
                      <h4 className="font-medium text-cyan-300 mb-3">
                        Southeast Asia & Middle East
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          'Singapore, Singapore',
                          'Subic Bay, Philippines',
                          'Sri Racha, Thailand',
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
              </div>

              {/* Fleet Summary */}
              <div className="bg-gradient-to-br from-gray-600/20 to-slate-600/20 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <span className="text-2xl mr-3">📊</span>
                  Fleet Summary
                </h3>

                <div className="grid md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-400 mb-2">
                      14
                    </div>
                    <div className="text-white/70 text-sm">Total T-AKEs</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-400 mb-2">
                      5
                    </div>
                    <div className="text-white/70 text-sm">East Coast</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-400 mb-2">
                      9
                    </div>
                    <div className="text-white/70 text-sm">West Coast</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-400 mb-2">
                      2
                    </div>
                    <div className="text-white/70 text-sm">Pre-Position</div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-500/20 rounded-lg border border-blue-400/30">
                  <p className="text-blue-300 text-sm">
                    <strong>Assignment probability:</strong> With 14 vessels and
                    larger crew sizes, T-AKE assignments are common for MSC
                    mariners. If you sail with MSC long enough, you can
                    certainly expect to receive more than one AKE assignment.
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
            Information based on current T-AKE operations and sailor experiences
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
