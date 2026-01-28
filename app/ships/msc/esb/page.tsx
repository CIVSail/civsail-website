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

export default function ESBShipPage() {
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
      value: '6 vessels',
    },
    {
      icon: <Users className="w-5 h-5" />,
      label: 'Crew Size',
      value: 'MSC: 40-45 / Navy: 120-200',
    },
    {
      icon: <DollarSign className="w-5 h-5" />,
      label: 'Pay Category',
      value: 'High',
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      label: 'Deployment',
      value: 'Homeported',
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
    <div className="min-h-screen bg-gradient-to-br from-orange-900 via-slate-800 to-amber-800">
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
        <div className="absolute inset-0 bg-gradient-to-r from-orange-600/20 to-amber-600/20" />
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
            <span className="text-white">ESB</span>
          </div>

          {/* Hero Content */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center bg-orange-500/20 text-orange-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Ship className="w-4 h-4 mr-2" />
                Expeditionary Sea Base
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6">
                ESB
                <span className="block text-2xl lg:text-3xl font-normal text-orange-300 mt-2">
                  Lewis B. Puller Class
                </span>
              </h1>
              <p className="text-xl text-white/80 leading-relaxed mb-8">
                Multi-mission hybrid platforms designed as flexible sea bases
                for launching military operations. One of the largest and
                highest-paying ships in the MSC fleet with a unique dual
                command structure.
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
                  Military Sealift Command operates the Lewis B. Puller class
                  Expeditionary Sea Base (ESB) as a hybrid ship. While MSC
                  operates the ship and is responsible for the physical ship,
                  there will also be uniformed military personnel on board
                  conducting operations. The exact makeup of the ESB crew will
                  depend on the specific mission and current tasking.
                </p>

                <p className="text-lg text-white/80 leading-relaxed mb-8">
                  ESBs are one of the larger vessels in the MSC fleet, and they
                  have a unique and distinctive shape. ESBs are very tall and
                  have almost 100 feet of freeboard from the mission deck to
                  the flight deck.
                </p>

                <div className="grid lg:grid-cols-2 gap-8 mt-8">
                  {/* USS vs USNS Designation */}
                  <div className="bg-gradient-to-br from-orange-500/20 to-amber-500/20 rounded-xl p-6 border border-white/10">
                    <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                      <span className="text-2xl mr-3">⚓</span>
                      USS Designation
                    </h3>
                    <div className="space-y-4">
                      <div className="bg-white/10 rounded-lg p-4">
                        <h4 className="font-medium text-orange-300 mb-2">
                          Why USS, Not USNS?
                        </h4>
                        <p className="text-white/80 text-sm">
                          The Lewis B. Puller class was originally supposed to
                          be designated as USNS vessels; however, after they
                          were introduced, they were changed to a USS
                          designation.
                        </p>
                      </div>
                      <div className="bg-white/10 rounded-lg p-4">
                        <h4 className="font-medium text-orange-300 mb-2">
                          USNS Definition
                        </h4>
                        <p className="text-white/80 text-sm">
                          USNS stands for United States Naval Ship—designated
                          for non-combatant operations and operated by
                          civilians. Most MSC vessels are USNS.
                        </p>
                      </div>
                      <div className="bg-white/10 rounded-lg p-4">
                        <h4 className="font-medium text-orange-300 mb-2">
                          USS Definition
                        </h4>
                        <p className="text-white/80 text-sm">
                          USS stands for United States Ship—used for combatant
                          operations and directly owned/operated by the U.S.
                          Navy. ESBs are able to launch offensive operations.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Dual Command Structure */}
                  <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl p-6 border border-white/10">
                    <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                      <span className="text-2xl mr-3">👥</span>
                      Dual Command Structure
                    </h3>
                    <div className="space-y-4">
                      <div className="bg-white/10 rounded-lg p-4">
                        <h4 className="font-medium text-purple-300 mb-2">
                          MSC Captain
                        </h4>
                        <p className="text-white/80 text-sm">
                          Licensed MSC Captain responsible for the physical
                          operation and safety of the ship.
                        </p>
                      </div>
                      <div className="bg-white/10 rounded-lg p-4">
                        <h4 className="font-medium text-purple-300 mb-2">
                          Navy Commanding Officer
                        </h4>
                        <p className="text-white/80 text-sm">
                          Military chain of command includes a Navy CO who has
                          significant power over the vessel and can play a big
                          role in crew morale.
                        </p>
                      </div>
                      <div className="bg-white/10 rounded-lg p-4">
                        <h4 className="font-medium text-purple-300 mb-2">
                          Leadership Balance
                        </h4>
                        <p className="text-white/80 text-sm">
                          There is a delicate leadership balance between the
                          MSC Captain and Navy CO. This balance directly
                          impacts crew morale.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mission */}
                <div className="bg-gradient-to-br from-teal-500/20 to-cyan-500/20 rounded-xl p-6 border border-white/10 mt-8">
                  <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                    <span className="text-2xl mr-3">🎯</span>
                    Mission
                  </h3>

                  <p className="text-white/80 mb-6">
                    Designed as a special missions ship, ESBs have a variety of
                    military personnel on board including Special Operations
                    Forces, pilots, and other entities. The operations they
                    conduct depend on the military forces on board.
                  </p>

                  <div className="grid md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white/10 rounded-lg p-4">
                      <h4 className="font-medium text-white mb-2">
                        Flexible Sea Base
                      </h4>
                      <p className="text-white/70 text-sm">
                        Acts as a flexible base of operations to launch a
                        variety of missions
                      </p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4">
                      <h4 className="font-medium text-white mb-2">
                        Flight Operations
                      </h4>
                      <p className="text-white/70 text-sm">
                        4 landing spots on flight deck, multiple helicopters
                        in hangar
                      </p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4">
                      <h4 className="font-medium text-white mb-2">
                        Small Boat Ops
                      </h4>
                      <p className="text-white/70 text-sm">
                        Davits capable of launching small boats for various
                        missions
                      </p>
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
                          <span className="text-white">785 feet (239.3m)</span>
                        </div>
                        <div className="flex justify-between border-b border-white/10 pb-1">
                          <span className="text-white/70">Beam</span>
                          <span className="text-white">164 feet (50m)</span>
                        </div>
                        <div className="flex justify-between border-b border-white/10 pb-1">
                          <span className="text-white/70">Draft</span>
                          <span className="text-white">34 feet (10.5m)</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/70">Displacement</span>
                          <span className="text-white">90,000 tons (full)</span>
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
                          <span className="text-white">Diesel Electric</span>
                        </div>
                        <div className="flex justify-between border-b border-white/10 pb-1">
                          <span className="text-white/70">Type</span>
                          <span className="text-white">Commercial</span>
                        </div>
                        <div className="flex justify-between border-b border-white/10 pb-1">
                          <span className="text-white/70">Top Speed</span>
                          <span className="text-white">15 knots</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/70">Freeboard</span>
                          <span className="text-white">~100 feet</span>
                        </div>
                      </div>
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
                      <div className="text-3xl font-bold text-orange-400 mb-2">
                        40-45
                      </div>
                      <div className="text-white/70 text-sm">MSC CIVMARs</div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4 text-center">
                      <div className="text-3xl font-bold text-orange-400 mb-2">
                        120-200
                      </div>
                      <div className="text-white/70 text-sm">
                        Navy Personnel (mission dependent)
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-orange-500/20 rounded-lg border border-orange-400/30">
                    <p className="text-orange-300 text-sm">
                      <strong>Hybrid Model:</strong> MSC CIVMARs handle the
                      physical operation and maintenance of the ship, while
                      Navy personnel conduct mission-specific operations.
                    </p>
                  </div>
                </div>

                {/* Important Considerations */}
                <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-xl p-6 border border-white/10 mt-8">
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                    <span className="text-2xl mr-3">⚠️</span>
                    Important Considerations
                  </h3>

                  <div className="space-y-4">
                    <div className="bg-white/10 rounded-lg p-4">
                      <h4 className="font-medium text-yellow-300 mb-2">
                        Ship Motion
                      </h4>
                      <p className="text-white/80 text-sm">
                        These ships are large and uniquely designed. As a
                        result, they rock and roll a lot. If you get seasick
                        easily, this may not be the platform for you.
                      </p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4">
                      <h4 className="font-medium text-yellow-300 mb-2">
                        Working with Navy
                      </h4>
                      <p className="text-white/80 text-sm">
                        Some MSC mariners dislike hybrid crew ships due to the
                        required working relationship with the Navy.
                      </p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4">
                      <h4 className="font-medium text-yellow-300 mb-2">
                        Recognition
                      </h4>
                      <p className="text-white/80 text-sm">
                        As a general rule, the Navy and Navy personnel will
                        always be credited for the work/mission despite MSC
                        mariners playing a large role. If you&apos;re looking for
                        recognition and status, it probably won&apos;t come. Many
                        mariners are happy to count their money and move along.
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
                <DollarSign className="w-8 h-8 text-orange-400 mr-4" />
                <h2 className="text-3xl font-bold text-white">
                  Operations & Pay
                </h2>
              </div>

              {/* Money Situation */}
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-green-500/20 to-teal-500/20 rounded-xl p-6 border border-white/10">
                  <h3 className="text-xl font-semibold text-white mb-4">
                    Money Situation
                  </h3>
                  <p className="text-white/80 mb-6">
                    Due to their size and hybrid status, ESBs are one of the
                    highest paying ships in the fleet. The overtime budgets are
                    up to the discretion of the Chief Engineer and Chief Mate.
                  </p>

                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-3">
                      <div className="bg-white/10 rounded-lg p-4 border border-green-400/30">
                        <h4 className="font-medium text-green-300 mb-2">
                          Operations Budget
                        </h4>
                        <p className="text-white/70 text-sm">
                          The overtime budget on an ESB is not a standard M&R
                          budget. It is entirely an operations budget.
                        </p>
                      </div>
                      <div className="bg-white/10 rounded-lg p-4 border border-green-400/30">
                        <h4 className="font-medium text-green-300 mb-2">
                          24/7 Operations
                        </h4>
                        <p className="text-white/70 text-sm">
                          ESBs conduct small boat operations and/or flight
                          quarters at all hours of the day.
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="bg-white/10 rounded-lg p-4 border border-green-400/30">
                        <h4 className="font-medium text-green-300 mb-2">
                          Flexible Hours
                        </h4>
                        <p className="text-white/70 text-sm">
                          The Navy is very lax with their hours of work, which
                          means you will likely work at odd hours and through
                          meals.
                        </p>
                      </div>
                      <div className="bg-white/10 rounded-lg p-4 border border-green-400/30">
                        <h4 className="font-medium text-green-300 mb-2">
                          Increased Overtime
                        </h4>
                        <p className="text-white/70 text-sm">
                          Odd hours and working through meals all increase your
                          overtime earnings.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-green-500/20 rounded-lg border border-green-400/30">
                    <p className="text-green-300 text-sm">
                      <strong>Bottom Line:</strong> ESBs are consistently among
                      the highest-paying ships in the MSC fleet due to their
                      hybrid status, operational tempo, and flexible hours.
                    </p>
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
                            JP-5 carried on board does not count as cargo since
                            it is owned by the Navy after loading
                          </li>
                          <li>
                            <strong>No PIC endorsement</strong> possible for any
                            loads/discharges—this is End-Use re-fueling
                          </li>
                        </ul>
                      </div>

                      <div className="bg-white/10 rounded-lg p-4">
                        <h5 className="font-medium text-white mb-3">
                          Stability Challenge
                        </h5>
                        <ul className="text-white/70 text-sm space-y-2">
                          <li>
                            The ESB platform has <strong>31 ballast tanks</strong>
                          </li>
                          <li>Holds millions of gallons of water</li>
                          <li>This may be an added challenge for stability</li>
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
                          Physical Layout
                        </h5>
                        <ul className="text-white/70 text-sm space-y-2">
                          <li>
                            <strong>No elevators on board</strong>—not even for
                            the engine room
                          </li>
                          <li>ESBs are very tall with A LOT of stairs</li>
                          <li>2 engine rooms and 2 pump rooms</li>
                          <li>You will get your steps in</li>
                        </ul>
                      </div>

                      <div className="bg-white/10 rounded-lg p-4">
                        <h5 className="font-medium text-white mb-3">
                          Responsibilities
                        </h5>
                        <ul className="text-white/70 text-sm space-y-2">
                          <li>
                            MSC takes care of the physical ship (typical hybrid
                            arrangement)
                          </li>
                          <li>
                            2 houses onboard have separate habitability
                            systems—MSC maintains both
                          </li>
                          <li>
                            <strong>4 cranes</strong> onboard—MSC has custody
                            and is responsible for maintenance
                          </li>
                          <li>Only 1 UNREP fuel receiving station</li>
                        </ul>
                      </div>
                    </div>

                    <div className="mt-4 p-3 bg-yellow-500/20 rounded-lg border border-yellow-400/30">
                      <p className="text-yellow-300 text-sm">
                        <strong>Note for Pre-ESB 4:</strong> Any ship before ESB
                        4 will not have an entrance from the pump room to the
                        engine room. Engineers will need to go all the way up to
                        then go all the way down to enter the engine room.
                      </p>
                    </div>
                  </div>

                  {/* Supply Department */}
                  <div className="mb-8">
                    <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <span className="text-xl mr-2">📦</span>
                      Supply Department
                    </h4>

                    <div className="bg-white/10 rounded-lg p-4">
                      <h5 className="font-medium text-white mb-3">
                        Limited Department
                      </h5>
                      <ul className="text-white/70 text-sm space-y-2">
                        <li>
                          ESB Supply Departments are limited—only a{' '}
                          <strong>JSO and an ASK</strong>
                        </li>
                        <li>
                          JSO will be the de-facto MSC Supply Officer and need
                          to assume department head duties
                        </li>
                        <li>Navy Supply personnel will also be on board</li>
                        <li>
                          Know the separation of duties—what MSC is and is not
                          responsible for
                        </li>
                      </ul>

                      <div className="mt-4 p-3 bg-orange-500/20 rounded-lg border border-orange-400/30">
                        <p className="text-orange-300 text-sm">
                          <strong>Food Service:</strong> Limited galley
                          personnel with a Steward Cook heading day-to-day
                          operations. If you&apos;re a JSO, brush up on Food Service
                          Operations before heading to an ESB.
                        </p>
                      </div>
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

              {/* Two Houses */}
              <div className="bg-gradient-to-br from-orange-500/20 to-amber-500/20 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4">
                  Two Houses Layout
                </h3>
                <p className="text-white/80 mb-6">
                  There are 2 houses on ESBs. MSC crew members live in the aft
                  house. Also located in the aft house is the MSC galley and
                  mess halls. In the forward house, the Navy has an entirely
                  different layout separate from MSC.
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white/10 rounded-lg p-4">
                    <h4 className="font-semibold text-orange-300 mb-3">
                      Aft House (MSC)
                    </h4>
                    <ul className="text-white/80 text-sm space-y-2">
                      <li>MSC crew living quarters</li>
                      <li>MSC galley and mess halls</li>
                      <li>One food line for everyone</li>
                      <li>2 mess decks: Officer and Unlicensed</li>
                      <li>No Chief Petty Officer mess</li>
                    </ul>
                  </div>

                  <div className="bg-white/10 rounded-lg p-4">
                    <h4 className="font-semibold text-orange-300 mb-3">
                      Forward House (Navy)
                    </h4>
                    <ul className="text-white/80 text-sm space-y-2">
                      <li>Navy living quarters</li>
                      <li>Separate layout from MSC</li>
                      <li>Navy food service</li>
                      <li>Navy ship store location</li>
                    </ul>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-green-500/20 rounded-lg border border-green-400/30">
                  <p className="text-green-300 text-sm">
                    <strong>Food Quality:</strong> MSC food is completely
                    separate from the Navy&apos;s—and MSC food is usually a lot
                    better!
                  </p>
                </div>
              </div>

              {/* The Widow-Maker */}
              <div className="bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <span className="text-2xl mr-3">⚠️</span>
                  &quot;The Widow-Maker&quot;
                </h3>
                <p className="text-white/80 mb-6">
                  One of the most notable features of the ESB is that it is a
                  tall ship with <strong>no personnel elevator</strong>. There
                  is a ladder well that runs from the Mission Deck (bottom
                  outside deck) to the Flight Deck by the aft house—this is
                  referred to as &quot;the widow-maker.&quot;
                </p>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-white/10 rounded-lg p-4 text-center">
                    <div className="text-2xl mb-2">🪜</div>
                    <h4 className="font-medium text-white mb-2">Very Steep</h4>
                    <p className="text-white/70 text-sm">
                      The stairs are extremely steep
                    </p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4 text-center">
                    <div className="text-2xl mb-2">📏</div>
                    <h4 className="font-medium text-white mb-2">~100 Feet</h4>
                    <p className="text-white/70 text-sm">
                      Mission deck to flight deck
                    </p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4 text-center">
                    <div className="text-2xl mb-2">👟</div>
                    <h4 className="font-medium text-white mb-2">
                      Get Your Steps
                    </h4>
                    <p className="text-white/70 text-sm">
                      You&apos;ll certainly stay in shape
                    </p>
                  </div>
                </div>
              </div>

              {/* Officer Accommodations */}
              <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                  <span className="text-2xl mr-3">🛏️</span>
                  MSC Officer Accommodations
                </h3>

                <div className="grid lg:grid-cols-2 gap-6 mb-6">
                  <div>
                    <div className="bg-white/10 rounded-lg p-4 mb-4">
                      <h5 className="font-medium text-white mb-3">
                        Officer Rooms
                      </h5>
                      <ul className="text-white/80 text-sm space-y-2">
                        <li>Per typical MSC arrangements, officers have their own rooms</li>
                        <li>
                          Deck and Engine Third Officers typically have the
                          smallest rooms, but this can vary
                        </li>
                        <li>
                          Even the smallest rooms are larger than most junior
                          officer staterooms at MSC
                        </li>
                      </ul>
                    </div>

                    <div className="bg-white/10 rounded-lg p-4">
                      <h5 className="font-medium text-white mb-3">
                        Senior Officers
                      </h5>
                      <ul className="text-white/80 text-sm space-y-2">
                        <li>
                          Senior officer staterooms are some of the{' '}
                          <strong>largest rooms in all of MSC</strong>
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Photo Placeholders - Officer Rooms */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg aspect-square overflow-hidden">
                      <img
                        src="/images/global/Coming_Soon_Graphic.png"
                        alt="ESB Officer Room - Photo Coming Soon"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="rounded-lg aspect-square overflow-hidden">
                      <img
                        src="/images/global/Coming_Soon_Graphic.png"
                        alt="ESB Senior Officer Room - Photo Coming Soon"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Unlicensed Accommodations */}
              <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                  <span className="text-2xl mr-3">🛌</span>
                  Unlicensed & CPO Accommodations
                </h3>

                <div className="grid lg:grid-cols-2 gap-6">
                  <div>
                    <div className="bg-white/10 rounded-lg p-4 mb-4">
                      <h5 className="font-medium text-white mb-3">CPO Rooms</h5>
                      <ul className="text-white/80 text-sm space-y-2">
                        <li>CPOs have their own staterooms</li>
                        <li>Rooms are quite small</li>
                      </ul>
                    </div>

                    <div className="bg-white/10 rounded-lg p-4">
                      <h5 className="font-medium text-white mb-3">
                        Unlicensed Berthing
                      </h5>
                      <ul className="text-white/80 text-sm space-y-2">
                        <li>
                          Unlike senior officers, unlicensed rooms leave a lot
                          to be desired
                        </li>
                        <li>Typically have a roommate</li>
                        <li>Beds are bunks with desks underneath</li>
                        <li>
                          Rooms are <strong>very small</strong>—some about the
                          size of a closet
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Photo Placeholder */}
                  <div className="rounded-lg aspect-video overflow-hidden">
                    <img
                      src="/images/global/Coming_Soon_Graphic.png"
                      alt="ESB Unlicensed Berthing - Photo Coming Soon"
                      className="w-full h-full object-cover"
                    />
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
                    <div className="bg-white/10 rounded-lg p-4 mb-4">
                      <h5 className="font-medium text-white mb-3">
                        Gym Layout Varies
                      </h5>
                      <ul className="text-white/80 text-sm space-y-2">
                        <li>ESBs have gyms, but each ship&apos;s layout is different</li>
                        <li>
                          USS Lewis B. Puller has more tanks than other ESBs,
                          affecting gym locations
                        </li>
                        <li>
                          ESBs without extra tanks have large gyms (like USS
                          Hershel &quot;Woody&quot; Williams)
                        </li>
                        <li>
                          USS Woody has two gyms forward and a large one aft
                        </li>
                      </ul>
                    </div>

                    <div className="p-4 bg-green-500/20 rounded-lg border border-green-400/30">
                      <p className="text-green-300 text-sm">
                        <strong>New Equipment:</strong> Since these ships were
                        built more recently, their gym equipment is newer
                        compared to other ships in the MSC fleet.
                      </p>
                    </div>
                  </div>

                  {/* Photo Placeholder */}
                  <div className="rounded-lg aspect-video overflow-hidden">
                    <img
                      src="/images/global/Coming_Soon_Graphic.png"
                      alt="ESB Gym - Photo Coming Soon"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>

              {/* Offices */}
              <div className="bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                  <span className="text-2xl mr-3">🏢</span>
                  Ship Offices
                </h3>

                <p className="text-white/80 mb-6">
                  The ship&apos;s offices adhere to standard layout among the ESB
                  fleet with minor variations.
                </p>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white/10 rounded-lg p-4">
                    <h4 className="font-medium text-white mb-2">Cargo Mate</h4>
                    <p className="text-white/70 text-sm">
                      Office doubles as Cargo Ballast Control Room
                    </p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4">
                    <h4 className="font-medium text-white mb-2">Chief Mate</h4>
                    <p className="text-white/70 text-sm">
                      Serves dual purposes, partly as medical facility
                    </p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4">
                    <h4 className="font-medium text-white mb-2">Supply</h4>
                    <p className="text-white/70 text-sm">
                      Relatively compact due to small department size
                    </p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4">
                    <h4 className="font-medium text-white mb-2">
                      Engineer&apos;s Log
                    </h4>
                    <p className="text-white/70 text-sm">
                      Largest office with 1st AE desk plus 2 additional desks
                    </p>
                  </div>
                </div>
              </div>

              {/* Lounges */}
              <div className="bg-gradient-to-br from-teal-500/20 to-cyan-500/20 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                  <span className="text-2xl mr-3">🛋️</span>
                  Lounges
                </h3>

                <div className="grid lg:grid-cols-2 gap-6">
                  <div>
                    <p className="text-white/80 mb-4">
                      In the aft house, there are 2 lounges. Both are on
                      &apos;A&apos; deck.
                    </p>

                    <div className="space-y-3">
                      <div className="bg-white/10 rounded-lg p-4">
                        <h4 className="font-medium text-white mb-2">
                          Crew Lounge
                        </h4>
                        <p className="text-white/70 text-sm">
                          Part of the crew mess with computers, couches, chairs,
                          and TV
                        </p>
                      </div>
                      <div className="bg-white/10 rounded-lg p-4">
                        <h4 className="font-medium text-white mb-2">
                          Officers Lounge
                        </h4>
                        <p className="text-white/70 text-sm">
                          Adjacent to officers&apos; mess with similar amenities
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Photo Placeholder */}
                  <div className="rounded-lg aspect-video overflow-hidden">
                    <img
                      src="/images/global/Coming_Soon_Graphic.png"
                      alt="ESB Lounge - Photo Coming Soon"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>

              {/* Ship Store */}
              <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <span className="text-2xl mr-3">🏪</span>
                  Ship&apos;s Store
                </h3>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white/10 rounded-lg p-4">
                    <h4 className="font-medium text-white mb-2">
                      Navy Run Store
                    </h4>
                    <p className="text-white/80 text-sm mb-4">
                      The ship&apos;s store is a Navy run store located in the
                      forward house.
                    </p>
                    <p className="text-white/70 text-sm">
                      Navy ship stores typically use a &quot;Navy Cash Card&quot;—basically
                      shipboard debit cards issued by the Navy to avoid having
                      to keep physical cash on ships.
                    </p>
                  </div>

                  <div className="bg-white/10 rounded-lg p-4">
                    <h4 className="font-medium text-white mb-2">
                      For MSC CIVMARs
                    </h4>
                    <p className="text-white/80 text-sm">
                      It is possible for MSC CIVMARs to get a Navy Cash Card,
                      but many CIVMARs will just give cash to a Navy sailor with
                      a card to buy whatever is needed.
                    </p>
                  </div>
                </div>
              </div>

              {/* Photo Request */}
              <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <span className="text-2xl mr-3">📸</span>
                  Help Us Build This Page
                </h3>
                <p className="text-white/80 mb-4">
                  Have photos from your time on an ESB? We&apos;d love to feature
                  them! Ship photos help future mariners know what to expect.
                </p>
                <p className="text-white/70 text-sm">
                  Send photos to:{' '}
                  <a
                    href="mailto:alec.schenning@civsail.com"
                    className="text-orange-300 hover:text-orange-200 underline"
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
                <MapPin className="w-8 h-8 text-orange-400 mr-4" />
                <h2 className="text-3xl font-bold text-white">Ships & Ports</h2>
              </div>

              {/* Fleet Overview */}
              <div className="bg-gradient-to-br from-orange-500/20 to-amber-500/20 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4">
                  Lewis B. Puller Class ESB Fleet
                </h3>
                <p className="text-white/80 mb-6">
                  Currently, there are 4 Lewis B. Puller Class ESBs in operation
                  with MSC. More ESBs are currently being built with more
                  scheduled for delivery in the coming years. Unlike most MSC
                  ships, ESBs do have designated homeports because of their
                  constant Navy presence on board.
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white/10 rounded-lg p-4">
                    <h4 className="font-semibold text-white mb-3 flex items-center">
                      <span className="text-xl mr-2">🔱</span>
                      Fleet Status
                    </h4>
                    <ul className="text-white/70 text-sm space-y-1">
                      <li>4 vessels currently in operation</li>
                      <li>2 vessels under construction</li>
                      <li>6 total in class</li>
                      <li>All USS (commissioned Navy) designation</li>
                    </ul>
                  </div>

                  <div className="bg-white/10 rounded-lg p-4">
                    <h4 className="font-semibold text-white mb-3 flex items-center">
                      <span className="text-xl mr-2">🏠</span>
                      Homeported Ships
                    </h4>
                    <ul className="text-white/70 text-sm space-y-1">
                      <li>Each ship has a designated homeport</li>
                      <li>Operates in specific regional areas</li>
                      <li>Subject to change based on mission</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Active Ships */}
              <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                  <span className="text-2xl mr-3">🚢</span>
                  Active Fleet
                </h3>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  {/* USS Lewis B. Puller */}
                  <div
                    className="bg-white/10 rounded-lg p-4 hover:bg-white/15 transition-colors cursor-pointer group"
                    onClick={() =>
                      handleShipClick('Lewis B. Puller', 'ESB-3')
                    }
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-white group-hover:text-orange-300 transition-colors">
                        USS Lewis B. Puller
                      </span>
                      <span className="text-orange-300 text-xs font-mono">
                        ESB-3
                      </span>
                    </div>
                    <div className="text-white/60 text-xs mb-2">Active</div>
                    <ul className="text-white/70 text-sm space-y-1 mt-3">
                      <li>
                        <strong>Homeport:</strong> Norfolk, Virginia
                      </li>
                      <li>
                        <strong>Typical AOR:</strong> 5th Fleet / Persian Gulf
                      </li>
                      <li>
                        <strong>Common Ports:</strong> Bahrain, UAE
                      </li>
                    </ul>
                    <div className="mt-3 text-xs text-orange-300 opacity-0 group-hover:opacity-100 transition-opacity">
                      Click for news & photos →
                    </div>
                  </div>

                  {/* USS Hershel "Woody" Williams */}
                  <div
                    className="bg-white/10 rounded-lg p-4 hover:bg-white/15 transition-colors cursor-pointer group"
                    onClick={() =>
                      handleShipClick('Hershel Woody Williams', 'ESB-4')
                    }
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-white group-hover:text-orange-300 transition-colors">
                        USS Hershel &quot;Woody&quot; Williams
                      </span>
                      <span className="text-orange-300 text-xs font-mono">
                        ESB-4
                      </span>
                    </div>
                    <div className="text-white/60 text-xs mb-2">Active</div>
                    <ul className="text-white/70 text-sm space-y-1 mt-3">
                      <li>
                        <strong>Homeport:</strong> Souda Bay, Greece
                      </li>
                      <li>
                        <strong>Typical AOR:</strong> Mediterranean / Africa
                      </li>
                      <li>
                        <strong>Common Ports:</strong> Croatia (shipyard), has
                        circumnavigated Africa
                      </li>
                    </ul>
                    <div className="mt-3 text-xs text-orange-300 opacity-0 group-hover:opacity-100 transition-opacity">
                      Click for news & photos →
                    </div>
                  </div>

                  {/* USS Miguel Keith */}
                  <div
                    className="bg-white/10 rounded-lg p-4 hover:bg-white/15 transition-colors cursor-pointer group"
                    onClick={() => handleShipClick('Miguel Keith', 'ESB-5')}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-white group-hover:text-orange-300 transition-colors">
                        USS Miguel Keith
                      </span>
                      <span className="text-orange-300 text-xs font-mono">
                        ESB-5
                      </span>
                    </div>
                    <div className="text-white/60 text-xs mb-2">Active</div>
                    <ul className="text-white/70 text-sm space-y-1 mt-3">
                      <li>
                        <strong>Homeport:</strong> San Diego, California
                      </li>
                      <li>
                        <strong>Typical AOR:</strong> 7th Fleet
                      </li>
                      <li>
                        <strong>Common Ports:</strong> Guam, Micronesia, Japan,
                        Korea
                      </li>
                    </ul>
                    <div className="mt-3 text-xs text-orange-300 opacity-0 group-hover:opacity-100 transition-opacity">
                      Click for news & photos →
                    </div>
                  </div>

                  {/* USS John L. Canley */}
                  <div
                    className="bg-white/10 rounded-lg p-4 hover:bg-white/15 transition-colors cursor-pointer group"
                    onClick={() => handleShipClick('John L. Canley', 'ESB-6')}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-white group-hover:text-orange-300 transition-colors">
                        USS John L. Canley
                      </span>
                      <span className="text-orange-300 text-xs font-mono">
                        ESB-6
                      </span>
                    </div>
                    <div className="text-white/60 text-xs mb-2">Active</div>
                    <ul className="text-white/70 text-sm space-y-1 mt-3">
                      <li>
                        <strong>Homeport:</strong> TBD
                      </li>
                    </ul>
                    <div className="mt-3 text-xs text-orange-300 opacity-0 group-hover:opacity-100 transition-opacity">
                      Click for news & photos →
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Book */}
              <div className="bg-gradient-to-br from-teal-500/20 to-cyan-500/20 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                  <span className="text-2xl mr-3">🔨</span>
                  Order Book (Under Construction)
                </h3>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* USS Robert E. Simanek */}
                  <div className="bg-white/10 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-white">
                        USS Robert E. Simanek
                      </span>
                      <span className="text-teal-300 text-xs font-mono">
                        ESB-7
                      </span>
                    </div>
                    <div className="text-yellow-400 text-xs mb-2">
                      Under Construction
                    </div>
                    <ul className="text-white/70 text-sm space-y-1 mt-3">
                      <li>
                        <strong>Homeport:</strong> TBD
                      </li>
                    </ul>
                  </div>

                  {/* USS Hector A. Cafferata Jr. */}
                  <div className="bg-white/10 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-white">
                        USS Hector A. Cafferata Jr.
                      </span>
                      <span className="text-teal-300 text-xs font-mono">
                        ESB-8
                      </span>
                    </div>
                    <div className="text-yellow-400 text-xs mb-2">
                      Under Construction
                    </div>
                    <ul className="text-white/70 text-sm space-y-1 mt-3">
                      <li>
                        <strong>Homeport:</strong> TBD
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Fleet Summary */}
              <div className="bg-gradient-to-br from-green-500/20 to-teal-500/20 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                  <span className="text-2xl mr-3">📊</span>
                  Fleet Summary
                </h3>

                <div className="grid md:grid-cols-4 gap-4">
                  <div className="bg-white/10 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-green-400 mb-2">
                      6
                    </div>
                    <div className="text-white/70 text-sm">Total Vessels</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-green-400 mb-2">
                      4
                    </div>
                    <div className="text-white/70 text-sm">Active Ships</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-green-400 mb-2">
                      2
                    </div>
                    <div className="text-white/70 text-sm">Under Construction</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-green-400 mb-2">
                      785
                    </div>
                    <div className="text-white/70 text-sm">Feet in Length</div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-orange-500/20 rounded-lg border border-orange-400/30">
                  <p className="text-orange-300 text-sm">
                    <strong>Growing Fleet:</strong> The ESB program continues to
                    expand with more vessels under construction and planned for
                    the future.
                  </p>
                </div>
              </div>

              {/* Deployment Patterns Note */}
              <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <span className="text-2xl mr-3">📝</span>
                  Deployment Note
                </h3>

                <p className="text-white/80">
                  Please note these are always subject to change and only
                  summaries of past deployments, not predictions of future
                  deployments. ESBs will typically operate in certain areas as
                  detailed above, but operational requirements may change their
                  assignments.
                </p>
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
