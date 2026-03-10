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

export default function TAHShipPage() {
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
      value: 'ROS: 15 / FOS: 70 MSC',
    },
    {
      icon: <DollarSign className="w-5 h-5" />,
      label: 'Pay Category',
      value: 'High',
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      label: 'Deployment',
      value: '2-6 months (every 2 years)',
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
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-slate-800 to-rose-800">
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
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-rose-600/20" />
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
            <span className="text-white">T-AH</span>
          </div>

          {/* Hero Content */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center bg-red-500/20 text-red-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Ship className="w-4 h-4 mr-2" />
                Hospital Ship
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6">
                T-AH
                <span className="block text-2xl lg:text-3xl font-normal text-red-300 mt-2">
                  Hospital Ship
                </span>
              </h1>
              <p className="text-xl text-white/80 leading-relaxed mb-8">
                The most unique vessels in the MSC fleet. The USNS Comfort and
                USNS Mercy are hybrid MSC/Navy crewed hospital ships, operated
                as National Level Assets with full medical facilities capable of
                treating 1,000 patients.
              </p>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4">
                {quickStats.map((stat, index) => (
                  <div
                    key={index}
                    className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4"
                  >
                    <div className="flex items-center text-red-300 mb-2">
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
                          ? 'bg-red-500/30 text-white border border-red-400/50'
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
                <Ship className="w-8 h-8 text-red-400 mr-4" />
                <h2 className="text-3xl font-bold text-white">Ship Overview</h2>
              </div>

              <div className="prose prose-invert max-w-none">
                <p className="text-lg text-white/80 leading-relaxed">
                  An assignment to one of the hospital ships is a rare and
                  unique experience. The USNS Comfort and the USNS Mercy are
                  operated with a hybrid MSC and Navy crew and desired for their
                  high pay, one-of-a-kind mission and exotic ports. These
                  vessels are considered National Level Assets and receive lots
                  of media attention anytime they are activated.
                </p>

                <p className="text-lg text-white/80 leading-relaxed mb-8">
                  The T-AH class vessels stand as the largest ships in the MSC
                  GOGO (government-owned, government-operated) fleet and boast
                  remarkable capacities. Once aboard these vessels, it is
                  obvious to see that they were retrofitted and not purpose
                  built as not all design layouts make perfect sense.
                </p>

                <div className="grid lg:grid-cols-2 gap-8 mt-8">
                  {/* Origins & History */}
                  <div className="bg-gradient-to-br from-red-500/20 to-rose-500/20 rounded-xl p-6 border border-white/10">
                    <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                      <span className="text-2xl mr-3">🏥</span>
                      Origins & Transformation
                    </h3>
                    <div className="space-y-4">
                      <div className="bg-white/10 rounded-lg p-4">
                        <h4 className="font-medium text-red-300 mb-2">
                          Original Purpose
                        </h4>
                        <p className="text-white/80 text-sm">
                          Initially served as San Clemente class commercial oil
                          tankers before their transformation into hospital
                          ships
                        </p>
                      </div>
                      <div className="bg-white/10 rounded-lg p-4">
                        <h4 className="font-medium text-red-300 mb-2">
                          USNS Mercy (T-AH 19)
                        </h4>
                        <p className="text-white/80 text-sm">
                          Converted from SS Worth starting in 1984, commissioned
                          in 1986. Original keel laid in 1974. In slightly
                          better working condition.
                        </p>
                      </div>
                      <div className="bg-white/10 rounded-lg p-4">
                        <h4 className="font-medium text-red-300 mb-2">
                          USNS Comfort (T-AH 20)
                        </h4>
                        <p className="text-white/80 text-sm">
                          Delivered to MSC in 1987. Original keel laid in 1975.
                          Both ships show signs of aging.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Mission */}
                  <div className="bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-xl p-6 border border-white/10">
                    <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                      <span className="text-2xl mr-3">🎯</span>
                      Mission Set
                    </h3>
                    <div className="space-y-4">
                      <div className="bg-white/10 rounded-lg p-4">
                        <h4 className="font-medium text-blue-300 mb-2">
                          Scheduled Missions
                        </h4>
                        <p className="text-white/80 text-sm">
                          Continuing Promise (CP) and Pacific Partnership (PP)
                          missions provide disaster relief, develop
                          relationships with allies, and offer free medical aid
                        </p>
                      </div>
                      <div className="bg-white/10 rounded-lg p-4">
                        <h4 className="font-medium text-blue-300 mb-2">
                          Crisis Response
                        </h4>
                        <p className="text-white/80 text-sm">
                          Can be activated by the President during crises (e.g.,
                          COVID pandemic when Comfort went to NYC and Mercy to
                          LA)
                        </p>
                      </div>
                      <div className="bg-white/10 rounded-lg p-4">
                        <h4 className="font-medium text-blue-300 mb-2">
                          MSC&apos;s Role
                        </h4>
                        <p className="text-white/80 text-sm">
                          MSC acts as the &quot;Uber driver&quot; - ferrying medical teams
                          to mission stops while maintaining the vessel. Medical
                          events mostly occur ashore.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Technical Specifications */}
                <div className="bg-gradient-to-br from-green-500/20 to-teal-500/20 rounded-xl p-6 border border-white/10 mt-8">
                  <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                    <span className="text-2xl mr-3">⚙️</span>
                    Vessel Specifications
                  </h3>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Physical Specs */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-green-300 mb-4">
                        Physical Characteristics
                      </h4>

                      <div className="bg-white/10 rounded-lg p-4">
                        <h5 className="font-medium text-white mb-3">
                          Vessel Dimensions
                        </h5>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between border-b border-white/10 pb-1">
                            <span className="text-white/70">Length</span>
                            <span className="text-white">894 feet</span>
                          </div>
                          <div className="flex justify-between border-b border-white/10 pb-1">
                            <span className="text-white/70">Beam</span>
                            <span className="text-white">106 feet</span>
                          </div>
                          <div className="flex justify-between border-b border-white/10 pb-1">
                            <span className="text-white/70">Propulsion</span>
                            <span className="text-white">Steam Turbine</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-white/70">Speed</span>
                            <span className="text-white">~17.5 knots</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white/10 rounded-lg p-4">
                        <h5 className="font-medium text-white mb-3">
                          Propulsion System
                        </h5>
                        <p className="text-white/80 text-sm">
                          Two Foster Wheeler Steam Generating Boilers with GE
                          Turbines. One of the few remaining steam-powered
                          vessels in the MSC fleet.
                        </p>
                      </div>
                    </div>

                    {/* Medical Specs */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-green-300 mb-4">
                        Medical Capabilities
                      </h4>

                      <div className="bg-white/10 rounded-lg p-4">
                        <h5 className="font-medium text-white mb-3">
                          Hospital Facilities
                        </h5>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between border-b border-white/10 pb-1">
                            <span className="text-white/70">Patient Wards</span>
                            <span className="text-white">15</span>
                          </div>
                          <div className="flex justify-between border-b border-white/10 pb-1">
                            <span className="text-white/70">Hospital Beds</span>
                            <span className="text-white">1,000</span>
                          </div>
                          <div className="flex justify-between border-b border-white/10 pb-1">
                            <span className="text-white/70">ICU Beds</span>
                            <span className="text-white">80</span>
                          </div>
                          <div className="flex justify-between border-b border-white/10 pb-1">
                            <span className="text-white/70">
                              Operating Suites
                            </span>
                            <span className="text-white">11</span>
                          </div>
                          <div className="flex justify-between border-b border-white/10 pb-1">
                            <span className="text-white/70">
                              Radiology Suites
                            </span>
                            <span className="text-white">1</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-white/70">
                              Blood Bank Capacity
                            </span>
                            <span className="text-white">5,000 units</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-yellow-500/20 rounded-lg border border-yellow-400/30">
                    <p className="text-yellow-300 text-sm">
                      <strong>Note:</strong> Routine missions seldom require the
                      ships to utilize their full medical capabilities. The main
                      aspects that take place on board are surgeries, which
                      provide the most value to patients.
                    </p>
                  </div>
                </div>

                {/* Crew Composition */}
                <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl p-6 border border-white/10 mt-8">
                  <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                    <span className="text-2xl mr-3">👥</span>
                    Crew Composition & Manning
                  </h3>

                  <p className="text-white/80 mb-6">
                    The hospital ships have two manning scales: Full Operating
                    Status (FOS) and Reduced Operating Status (ROS). Due to the
                    cyclical nature of the vessel and its pre-determined ROS, it
                    is a difficult ship to homestead on. Most crew will be sent
                    on leave or to other ships upon mission completion.
                  </p>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white/10 rounded-lg p-4">
                      <h4 className="font-medium text-purple-300 mb-3">
                        Reduced Operating Status (ROS)
                      </h4>
                      <div className="space-y-3">
                        <div className="text-center p-3 bg-white/10 rounded-lg">
                          <div className="text-3xl font-bold text-purple-400 mb-1">
                            15
                          </div>
                          <div className="text-white/70 text-sm">
                            MSC Personnel
                          </div>
                        </div>
                        <div className="text-center p-3 bg-white/10 rounded-lg">
                          <div className="text-3xl font-bold text-purple-400 mb-1">
                            50
                          </div>
                          <div className="text-white/70 text-sm">
                            Navy Personnel
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white/10 rounded-lg p-4">
                      <h4 className="font-medium text-purple-300 mb-3">
                        Full Operating Status (FOS)
                      </h4>
                      <div className="space-y-3">
                        <div className="text-center p-3 bg-white/10 rounded-lg">
                          <div className="text-3xl font-bold text-purple-400 mb-1">
                            70
                          </div>
                          <div className="text-white/70 text-sm">
                            MSC Personnel
                          </div>
                        </div>
                        <div className="text-center p-3 bg-white/10 rounded-lg">
                          <div className="text-3xl font-bold text-purple-400 mb-1">
                            900-1,100
                          </div>
                          <div className="text-white/70 text-sm">
                            Navy & Other Agencies
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-purple-500/20 rounded-lg border border-purple-400/30">
                    <p className="text-purple-300 text-sm">
                      <strong>Terminology:</strong> On board, the MSC crew is
                      referred to as &quot;HULL&quot; and the medical personnel are part
                      of the Medical Treatment Facility (MTF).
                    </p>
                  </div>
                </div>

                {/* Diplomacy Section */}
                <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl p-6 border border-white/10 mt-8">
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                    <span className="text-2xl mr-3">🇺🇸</span>
                    The Big Red Cross: American Diplomacy
                  </h3>

                  <p className="text-white/80 mb-6">
                    The hospital ships are an arm of American diplomacy.
                    Symbolizing American goodwill, they gain national attention
                    with their iconic big red crosses. Each port visit creates
                    many photo opportunities and high-level dignitaries
                    routinely tour the vessel.
                  </p>

                  <div className="grid md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white/10 rounded-lg p-4 text-center">
                      <div className="text-2xl mb-2">📸</div>
                      <h4 className="font-medium text-white mb-2">
                        Media Attention
                      </h4>
                      <p className="text-white/70 text-sm">
                        National Level Assets that receive significant media
                        coverage when activated
                      </p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4 text-center">
                      <div className="text-2xl mb-2">🤝</div>
                      <h4 className="font-medium text-white mb-2">
                        Diplomatic Mission
                      </h4>
                      <p className="text-white/70 text-sm">
                        Build relationships with host nations through medical
                        aid and goodwill
                      </p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4 text-center">
                      <div className="text-2xl mb-2">🎖️</div>
                      <h4 className="font-medium text-white mb-2">VIP Visits</h4>
                      <p className="text-white/70 text-sm">
                        High-level dignitaries routinely tour the vessel during
                        port calls
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-cyan-500/20 rounded-lg border border-cyan-400/30">
                    <p className="text-cyan-300 text-sm">
                      <strong>Reality Check:</strong> &quot;There will probably be as
                      many photos taken as patients treated.&quot;
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
                <DollarSign className="w-8 h-8 text-red-400 mr-4" />
                <h2 className="text-3xl font-bold text-white">
                  Operations & Pay
                </h2>
              </div>

              {/* Operational Cycle */}
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-red-500/20 to-rose-500/20 rounded-xl p-6 border border-white/10">
                  <h3 className="text-xl font-semibold text-white mb-4">
                    Operational Cycle
                  </h3>
                  <p className="text-white/80 mb-6">
                    Both ships follow a similar, cyclical schedule. The ships
                    typically deploy once every 2 years on the Continuing
                    Promise or Pacific Partnership mission for 2-6 months. This
                    predictable cycle makes T-AH assignments unique in the MSC
                    fleet.
                  </p>

                  <div className="grid md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white/10 rounded-lg p-4">
                      <h4 className="font-medium text-white mb-2">
                        1. Deployment
                      </h4>
                      <div className="text-2xl font-bold text-red-400 mb-1">
                        2-6 months
                      </div>
                      <p className="text-white/70 text-sm">
                        CP or PP mission deployment
                      </p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4">
                      <h4 className="font-medium text-white mb-2">2. Return</h4>
                      <div className="text-2xl font-bold text-red-400 mb-1">
                        De-crew
                      </div>
                      <p className="text-white/70 text-sm">
                        Return to homeport, prepare for ROS
                      </p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4">
                      <h4 className="font-medium text-white mb-2">
                        3. Maintenance
                      </h4>
                      <div className="text-2xl font-bold text-red-400 mb-1">
                        Shipyard
                      </div>
                      <p className="text-white/70 text-sm">
                        Maintenance and repair period
                      </p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4">
                      <h4 className="font-medium text-white mb-2">4. Re-crew</h4>
                      <div className="text-2xl font-bold text-red-400 mb-1">
                        Prepare
                      </div>
                      <p className="text-white/70 text-sm">
                        Re-crew and prepare for next deployment
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-yellow-500/20 rounded-lg border border-yellow-400/30">
                    <p className="text-yellow-300 text-sm">
                      <strong>Exception:</strong> Ships can be activated at any
                      time to respond to a crisis or world event at the
                      President&apos;s discretion.
                    </p>
                  </div>
                </div>

                {/* Port to Sea Time Ratio */}
                <div className="bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-xl p-6 border border-white/10">
                  <h3 className="text-xl font-semibold text-white mb-4">
                    Port to Sea Time Ratio
                  </h3>
                  <p className="text-white/80 mb-6">
                    Unlike the rest of the MSC fleet, the hospital ships spend
                    more time in port than at sea. With a stable schedule during
                    deployment, they navigate directly between ports via the
                    most direct route.
                  </p>

                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-white/10 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-300 mb-3">
                        Typical Schedule
                      </h4>
                      <ul className="text-white/80 text-sm space-y-2">
                        <li>
                          <strong>Port Time:</strong> 4-15 days at each mission
                          stop
                        </li>
                        <li>
                          <strong>Sea Time:</strong> 1-3 days transit between
                          ports
                        </li>
                        <li>Direct routing between mission stops</li>
                        <li>More port time than any other MSC ship type</li>
                      </ul>
                    </div>

                    <div className="bg-white/10 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-300 mb-3">
                        Anchoring Considerations
                      </h4>
                      <ul className="text-white/80 text-sm space-y-2">
                        <li>Due to size, frequently anchor out</li>
                        <li>Many ports cannot handle them pier side</li>
                        <li>Liberty boats or onboard tenders transport crew</li>
                        <li>Same tenders used to transport patients</li>
                      </ul>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-500/20 rounded-lg border border-blue-400/30">
                    <p className="text-blue-300 text-sm">
                      <strong>Key Difference:</strong> Hospital ships are unique
                      in spending MORE time in port than at sea - the opposite
                      of most MSC vessels.
                    </p>
                  </div>
                </div>

                {/* Money Situation */}
                <div className="bg-gradient-to-br from-green-500/20 to-teal-500/20 rounded-xl p-6 border border-white/10">
                  <h3 className="text-xl font-semibold text-white mb-4">
                    Money Situation
                  </h3>
                  <p className="text-white/80 mb-6">
                    Like most hybrid ships, the Comfort and the Mercy are
                    relatively high paying ships. For rates whose ship pay is
                    based on gross tonnage, the hospital ships have some of the
                    highest pay in MSC.
                  </p>

                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-3">
                      <div className="bg-white/10 rounded-lg p-4 border border-green-400/30">
                        <h4 className="font-medium text-green-300 mb-2">
                          Base Pay Level
                        </h4>
                        <p className="text-white/70 text-sm">
                          High - among the highest gross tonnage pay in MSC
                        </p>
                      </div>
                      <div className="bg-white/10 rounded-lg p-4 border border-green-400/30">
                        <h4 className="font-medium text-green-300 mb-2">
                          Berthing Pay
                        </h4>
                        <p className="text-white/70 text-sm">
                          Commonly applied when sharing rooms with 2+ people
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="bg-white/10 rounded-lg p-4 border border-green-400/30">
                        <h4 className="font-medium text-green-300 mb-2">
                          Premium Pay Codes
                        </h4>
                        <p className="text-white/70 text-sm">
                          Commonly applied throughout routine MSC tasks
                        </p>
                      </div>
                      <div className="bg-white/10 rounded-lg p-4 border border-green-400/30">
                        <h4 className="font-medium text-green-300 mb-2">
                          Hybrid Ship Bonus
                        </h4>
                        <p className="text-white/70 text-sm">
                          High pay potential typical of hybrid MSC/Navy vessels
                        </p>
                      </div>
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
                          <li>These ships are big and old</li>
                          <li>
                            <strong>Day Thirds:</strong> Two usually added on
                            deployment
                          </li>
                          <li>
                            Operate onboard tender boats to transport patients
                          </li>
                          <li>
                            Tenders used when anchored out (common occurrence)
                          </li>
                        </ul>
                      </div>

                      <div className="bg-white/10 rounded-lg p-4">
                        <h5 className="font-medium text-white mb-3">
                          Deck Day Workers
                        </h5>
                        <ul className="text-white/70 text-sm space-y-2">
                          <li>
                            <strong>Primary Task:</strong> Trash, trash, and
                            more trash
                          </li>
                          <li>
                            Segregating and offloading trash is MSC
                            responsibility
                          </li>
                          <li>With 1,100 people aboard, massive trash volume</li>
                          <li>Far more than typical MSC ships generate</li>
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
                            <strong>Steam Plant:</strong> One of few remaining
                            steam engines
                          </li>
                          <li>
                            Important consideration for license advancement
                          </li>
                          <li>Each watch has 2 3/AEs plus a day third billet</li>
                          <li>
                            <strong>Steam Plant 3/AE:</strong> Aft house and
                            propulsion
                          </li>
                          <li>
                            <strong>AMR 3/AE:</strong> 3 diesel generators for
                            forward house/hospital
                          </li>
                        </ul>
                      </div>

                      <div className="bg-white/10 rounded-lg p-4">
                        <h5 className="font-medium text-white mb-3">
                          Engine Unlicensed
                        </h5>
                        <ul className="text-white/70 text-sm space-y-2">
                          <li>
                            <strong>Incinerator:</strong> Burning oily rags is
                            common
                          </li>
                          <li>Good opportunity for overtime</li>
                          <li>
                            <strong>Electricians:</strong> Lots of lightbulbs to
                            change
                          </li>
                          <li>Get your steps in on this large vessel</li>
                          <li>
                            Hotel services: plumbing and lighting for 1,000+
                            people
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className="mt-4 p-3 bg-yellow-500/20 rounded-lg border border-yellow-400/30">
                      <p className="text-yellow-300 text-sm">
                        <strong>License Note:</strong> If you&apos;re trying to
                        advance your license, keep in mind these are some of the
                        few remaining steam engine vessels in the fleet.
                      </p>
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
                          Manning & Coordination
                        </h5>
                        <ul className="text-white/70 text-sm space-y-2">
                          <li>
                            <strong>ROS Manning:</strong> Only a YNSK
                          </li>
                          <li>
                            <strong>Pre-Deployment:</strong> JSO added
                          </li>
                          <li>
                            All Port Services routed through MSC Supply Dept
                          </li>
                          <li>Includes Navy requirements</li>
                          <li>
                            Proper coordination with Navy Supply Dept is
                            essential
                          </li>
                        </ul>
                      </div>

                      <div className="bg-white/10 rounded-lg p-4">
                        <h5 className="font-medium text-white mb-3">
                          Food Service Operations
                        </h5>
                        <ul className="text-white/70 text-sm space-y-2">
                          <li>
                            <strong>Separate Operations:</strong> MSC and Navy
                            food service are independent
                          </li>
                          <li>Separate galleys and inventories</li>
                          <li>Separate food deliveries</li>
                          <li>No requirement to feed Navy personnel</li>
                          <li>
                            Positive relationship with Navy counterparts
                            recommended
                          </li>
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

                    <div className="bg-white/10 rounded-lg p-4">
                      <h5 className="font-medium text-white mb-3">
                        Communications Operations
                      </h5>
                      <ul className="text-white/70 text-sm space-y-2">
                        <li>
                          <strong>MSC Manning:</strong> Only a CRET in the MSC
                          comms department
                        </li>
                        <li>
                          Navy handles most communications and LAN requirements
                        </li>
                        <li>
                          <strong>Warning:</strong> Hospital ships are notorious
                          for poor communications and connectivity
                        </li>
                      </ul>
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
                <Home className="w-8 h-8 text-red-400 mr-4" />
                <h2 className="text-3xl font-bold text-white">Life Aboard</h2>
              </div>

              {/* Introduction */}
              <div className="bg-gradient-to-br from-red-500/20 to-rose-500/20 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4">
                  Life on the Hospital Ships
                </h3>
                <p className="text-white/80 mb-6">
                  Life on board the hospital ships is different than the typical
                  MSC ship. When fully operational, expect around 1,000 people
                  on board, most of which are active-duty Navy. With the Navy
                  presence, the culture is controlled by the Navy Chain of
                  Command.
                </p>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-white/10 rounded-lg p-4">
                    <h4 className="font-medium text-white mb-2">
                      Navy Culture
                    </h4>
                    <p className="text-white/70 text-sm">
                      Frequent 1MC pipes, ringing people on/off, cleaning
                      stations are daily events
                    </p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4">
                    <h4 className="font-medium text-white mb-2">
                      MSC Independence
                    </h4>
                    <p className="text-white/70 text-sm">
                      MSC does not partake in Navy procedures. MSC Master is in
                      charge of CIVMARs.
                    </p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4">
                    <h4 className="font-medium text-white mb-2">
                      Daily Interaction
                    </h4>
                    <p className="text-white/70 text-sm">
                      Expect to interact with Navy daily. Be prepared to answer
                      questions about MSC.
                    </p>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-500/20 rounded-lg border border-blue-400/30">
                  <p className="text-blue-300 text-sm">
                    <strong>Cultural Note:</strong> Generally, the Navy is
                    unfamiliar with MSC and CIVMARs, so be prepared to answer a
                    lot of questions about who you are and what you do.
                  </p>
                </div>
              </div>

              {/* Berthing */}
              <div className="bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                  <span className="text-2xl mr-3">🛏️</span>
                  Berthing & Accommodations
                </h3>

                <p className="text-white/80 mb-6">
                  On board, there are two houses. The bridge and deck officers
                  live in the forward house while the rest of the MSC crew
                  living quarters and the MSC galley reside in the aft house.
                </p>

                <div className="grid lg:grid-cols-2 gap-6 mb-6">
                  <div>
                    <div className="bg-white/10 rounded-lg p-4 mb-4">
                      <h5 className="font-medium text-white mb-3">
                        Room Assignments
                      </h5>
                      <ul className="text-white/80 text-sm space-y-2">
                        <li>
                          <strong>Officers & CPOs:</strong> Own staterooms
                        </li>
                        <li>
                          <strong>Non-Officers:</strong> 2-4 people per room
                        </li>
                        <li>
                          <strong>Forward House:</strong> Bridge and deck
                          officers
                        </li>
                        <li>
                          <strong>Aft House:</strong> Rest of MSC crew + galley
                        </li>
                        <li>Rooms assigned by vessel leadership, not chosen</li>
                      </ul>
                    </div>

                    <div className="bg-white/10 rounded-lg p-4">
                      <h5 className="font-medium text-white mb-3">
                        ROS Accommodations
                      </h5>
                      <p className="text-white/80 text-sm">
                        If you remain after transition to ROS, all MSC crew
                        members will have their own staterooms. However, not
                        many crew are retained in ROS after deployment.
                      </p>
                    </div>
                  </div>

                  {/* Photo Placeholders - Officer Rooms */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg aspect-square overflow-hidden">
                      <img
                        src="/images/global/Coming_Soon_Graphic.png"
                        alt="T-AH Officer Stateroom - Photo Coming Soon"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="rounded-lg aspect-square overflow-hidden">
                      <img
                        src="/images/global/Coming_Soon_Graphic.png"
                        alt="T-AH CPO Room - Photo Coming Soon"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="rounded-lg aspect-square overflow-hidden">
                      <img
                        src="/images/global/Coming_Soon_Graphic.png"
                        alt="T-AH Unlicensed Berthing - Photo Coming Soon"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="rounded-lg aspect-square overflow-hidden">
                      <img
                        src="/images/global/Coming_Soon_Graphic.png"
                        alt="T-AH Forward House - Photo Coming Soon"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-green-500/20 rounded-lg p-4 border border-green-400/30">
                    <h4 className="font-semibold text-green-300 mb-2">
                      MSC Advantage
                    </h4>
                    <p className="text-green-200 text-sm">
                      Overall, the MSC living situation is much better than the
                      Navy. Enlisted Navy live in large open berthing areas and
                      Navy Officers/Doctors live in 6-person rooms.
                    </p>
                  </div>

                  <div className="bg-yellow-500/20 rounded-lg p-4 border border-yellow-400/30">
                    <h4 className="font-semibold text-yellow-300 mb-2">
                      Berthing Pay
                    </h4>
                    <p className="text-yellow-200 text-sm">
                      CIVMARs are paid berthing pay if in a room with more than
                      2 people. When space is limited, Marines and military may
                      live in unused hospital wards.
                    </p>
                  </div>
                </div>
              </div>

              {/* Mess Deck & Lounges */}
              <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                  <span className="text-2xl mr-3">🍽️</span>
                  Mess Deck & Lounges
                </h3>

                <div className="grid lg:grid-cols-2 gap-6 mb-6">
                  <div>
                    <div className="bg-white/10 rounded-lg p-4 mb-4">
                      <h5 className="font-medium text-white mb-3">
                        MSC Facilities (Aft House)
                      </h5>
                      <ul className="text-white/80 text-sm space-y-2">
                        <li>MSC has own lounge, galley, crew mess</li>
                        <li>Separate officers mess</li>
                        <li>MSC food prepared by MSC CIVMARs</li>
                        <li>Food service operation separate from Navy</li>
                        <li>
                          Large outdoor area for MSC steel beach picnics
                        </li>
                      </ul>
                    </div>

                    <div className="bg-white/10 rounded-lg p-4">
                      <h5 className="font-medium text-white mb-3">
                        Additional Facilities
                      </h5>
                      <ul className="text-white/80 text-sm space-y-2">
                        <li>Chapel available on board</li>
                        <li>Library for crew use</li>
                        <li>Other lounges for Navy personnel</li>
                        <li>
                          Navy hosts MWR events - MSC usually welcome to attend
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Photo Placeholders - Mess Deck & Lounges */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg aspect-square overflow-hidden">
                      <img
                        src="/images/global/Coming_Soon_Graphic.png"
                        alt="T-AH MSC Mess Deck - Photo Coming Soon"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="rounded-lg aspect-square overflow-hidden">
                      <img
                        src="/images/global/Coming_Soon_Graphic.png"
                        alt="T-AH MSC Galley - Photo Coming Soon"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="rounded-lg aspect-square overflow-hidden">
                      <img
                        src="/images/global/Coming_Soon_Graphic.png"
                        alt="T-AH MSC Lounge - Photo Coming Soon"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="rounded-lg aspect-square overflow-hidden">
                      <img
                        src="/images/global/Coming_Soon_Graphic.png"
                        alt="T-AH Steel Beach Area - Photo Coming Soon"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Gyms */}
              <div className="bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                  <span className="text-2xl mr-3">🏋️</span>
                  Gyms
                </h3>

                <div className="grid lg:grid-cols-2 gap-6">
                  <div>
                    <div className="bg-white/10 rounded-lg p-4 mb-4">
                      <h5 className="font-medium text-white mb-3">
                        Gym Facilities
                      </h5>
                      <ul className="text-white/80 text-sm space-y-2">
                        <li>
                          <strong>Two gyms available:</strong> Cardio and Weight
                        </li>
                        <li>Both Comfort and Mercy have same setup</li>
                        <li>Gyms are decently sized</li>
                        <li>
                          <strong>Warning:</strong> Get VERY crowded with 1,100
                          people aboard
                        </li>
                      </ul>
                    </div>

                    <div className="p-4 bg-yellow-500/20 rounded-lg border border-yellow-400/30">
                      <p className="text-yellow-300 text-sm">
                        <strong>Pro Tip:</strong> Plan your workout times
                        carefully during FOS operations. With over 1,000 people
                        sharing two gyms, peak hours can be extremely crowded.
                      </p>
                    </div>
                  </div>

                  {/* Photo Placeholders - Gyms */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg aspect-square overflow-hidden">
                      <img
                        src="/images/global/Coming_Soon_Graphic.png"
                        alt="T-AH Cardio Gym - Photo Coming Soon"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="rounded-lg aspect-square overflow-hidden">
                      <img
                        src="/images/global/Coming_Soon_Graphic.png"
                        alt="T-AH Weight Gym - Photo Coming Soon"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="rounded-lg aspect-square overflow-hidden">
                      <img
                        src="/images/global/Coming_Soon_Graphic.png"
                        alt="T-AH Chapel - Photo Coming Soon"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="rounded-lg aspect-square overflow-hidden">
                      <img
                        src="/images/global/Coming_Soon_Graphic.png"
                        alt="T-AH Library - Photo Coming Soon"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Ships & Ports Section */}
          {activeSection === 'ships-ports' && (
            <div className="space-y-8">
              <div className="flex items-center mb-8">
                <MapPin className="w-8 h-8 text-red-400 mr-4" />
                <h2 className="text-3xl font-bold text-white">Ships & Ports</h2>
              </div>

              {/* Fleet Overview */}
              <div className="bg-gradient-to-br from-red-500/20 to-rose-500/20 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4">
                  T-AH Hospital Ship Fleet
                </h3>
                <p className="text-white/80 mb-6">
                  The T-AH class consists of only two vessels, each assigned to
                  a different coast and mission. Both ships are converted San
                  Clemente class oil tankers that were transformed into hospital
                  ships in the mid-1980s.
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white/10 rounded-lg p-4">
                    <h4 className="font-semibold text-white mb-3 flex items-center">
                      <span className="text-xl mr-2">🏥</span>
                      Fleet Characteristics
                    </h4>
                    <ul className="text-white/70 text-sm space-y-1">
                      <li>2 vessels total in the T-AH class</li>
                      <li>Largest ships in MSC GOGO fleet</li>
                      <li>Converted from commercial oil tankers</li>
                      <li>Both are National Level Assets</li>
                    </ul>
                  </div>

                  <div className="bg-white/10 rounded-lg p-4">
                    <h4 className="font-semibold text-white mb-3 flex items-center">
                      <span className="text-xl mr-2">🎯</span>
                      Mission Assignments
                    </h4>
                    <ul className="text-white/70 text-sm space-y-1">
                      <li>
                        <strong>Comfort:</strong> Continuing Promise (CP) -
                        Caribbean/Americas
                      </li>
                      <li>
                        <strong>Mercy:</strong> Pacific Partnership (PP) - Far
                        East/Pacific
                      </li>
                      <li>Each deploys approximately every 2 years</li>
                      <li>Both can be activated for crisis response</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Individual Ships */}
              <div className="grid lg:grid-cols-2 gap-8">
                {/* USNS Comfort - East Coast */}
                <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl p-6 border border-white/10">
                  <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                    <span className="text-2xl mr-3">🌊</span>
                    East Coast
                  </h3>

                  <div
                    className="bg-white/10 rounded-lg p-4 mb-6 hover:bg-white/15 transition-colors cursor-pointer group"
                    onClick={() => handleShipClick('Comfort', 'T-AH 20')}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-white group-hover:text-red-300 transition-colors">
                        USNS Comfort
                      </span>
                      <span className="text-red-300 text-xs font-mono">
                        T-AH 20
                      </span>
                    </div>
                    <div className="text-white/60 text-xs mb-2">Active</div>
                    <ul className="text-white/70 text-sm space-y-1 mt-3">
                      <li>
                        <strong>Homeport:</strong> Norfolk, Virginia
                      </li>
                      <li>
                        <strong>Mission:</strong> Continuing Promise (CP)
                      </li>
                      <li>
                        <strong>AOR:</strong> 4th Fleet - Caribbean, Central
                        &amp; South America
                      </li>
                      <li>
                        <strong>Commissioned:</strong> 1987
                      </li>
                    </ul>
                    <div className="mt-3 text-xs text-red-300 opacity-0 group-hover:opacity-100 transition-opacity">
                      Click for news & photos →
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium text-purple-300 mb-3">
                      Past Continuing Promise Ports
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        'Guatemala',
                        'Honduras',
                        'Colombia',
                        'Haiti',
                        'Dominican Republic',
                        'Cuba',
                        'Ecuador',
                        'Peru',
                        'Belize',
                        'Jamaica',
                        'Nicaragua',
                        'Panama',
                        'El Salvador',
                        'Dominica',
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

                {/* USNS Mercy - West Coast */}
                <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl p-6 border border-white/10">
                  <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                    <span className="text-2xl mr-3">🌏</span>
                    West Coast
                  </h3>

                  <div
                    className="bg-white/10 rounded-lg p-4 mb-6 hover:bg-white/15 transition-colors cursor-pointer group"
                    onClick={() => handleShipClick('Mercy', 'T-AH 19')}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-white group-hover:text-red-300 transition-colors">
                        USNS Mercy
                      </span>
                      <span className="text-red-300 text-xs font-mono">
                        T-AH 19
                      </span>
                    </div>
                    <div className="text-white/60 text-xs mb-2">Active</div>
                    <ul className="text-white/70 text-sm space-y-1 mt-3">
                      <li>
                        <strong>Homeport:</strong> San Diego, California
                      </li>
                      <li>
                        <strong>Mission:</strong> Pacific Partnership (PP)
                      </li>
                      <li>
                        <strong>AOR:</strong> 7th Fleet - Far East &amp;
                        Micronesia
                      </li>
                      <li>
                        <strong>Commissioned:</strong> 1986
                      </li>
                      <li>
                        <strong>Condition:</strong> Slightly better working
                        condition
                      </li>
                    </ul>
                    <div className="mt-3 text-xs text-red-300 opacity-0 group-hover:opacity-100 transition-opacity">
                      Click for news & photos →
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium text-cyan-300 mb-3">
                      Past Pacific Partnership Ports
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        'Guam',
                        'Solomon Islands',
                        'Weno, FSM',
                        'Kolonia, FSM',
                        'Palau',
                        'Majuro',
                        'Hawaii',
                        'Vietnam',
                        'Philippines',
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
              <div className="bg-gradient-to-br from-green-500/20 to-teal-500/20 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                  <span className="text-2xl mr-3">📊</span>
                  Fleet Summary
                </h3>

                <div className="grid md:grid-cols-4 gap-4">
                  <div className="bg-white/10 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-green-400 mb-2">
                      2
                    </div>
                    <div className="text-white/70 text-sm">Total Vessels</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-green-400 mb-2">
                      2
                    </div>
                    <div className="text-white/70 text-sm">Active Ships</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-green-400 mb-2">
                      894
                    </div>
                    <div className="text-white/70 text-sm">Feet in Length</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-green-400 mb-2">
                      1,000
                    </div>
                    <div className="text-white/70 text-sm">
                      Hospital Bed Capacity
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-teal-500/20 rounded-lg border border-teal-400/30">
                  <p className="text-teal-300 text-sm">
                    <strong>Unique Assignment:</strong> Due to the cyclical
                    ROS/FOS schedule, hospital ship assignments are typically
                    temporary. Most crew will be sent to other ships or leave
                    upon mission completion.
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
