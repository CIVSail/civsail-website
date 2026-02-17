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

export default function TARCShipPage() {
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
      value: '1 vessel',
    },
    {
      icon: <Users className="w-5 h-5" />,
      label: 'Crew Size',
      value: 'MSC: 50-60 + Security: 15-20 + Contractors: 15-20',
    },
    {
      icon: <DollarSign className="w-5 h-5" />,
      label: 'Pay Category',
      value: 'High',
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      label: 'Deployment',
      value: 'Long (6 weeks sea / 2 weeks port)',
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
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-gray-700 to-slate-900">
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
        <div className="absolute inset-0 bg-gradient-to-r from-gray-400/20 to-slate-400/20" />
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
            <span className="text-white">T-ARC</span>
          </div>

          {/* Hero Content */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center bg-gray-400/20 text-gray-200 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Ship className="w-4 h-4 mr-2" />
                Cable Laying Ship
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6">
                T-ARC
                <span className="block text-2xl lg:text-3xl font-normal text-gray-300 mt-2">
                  USNS Zeus
                </span>
              </h1>
              <p className="text-xl text-white/80 leading-relaxed mb-8">
                The only active naval vessel capable of laying and repairing
                undersea fiber optic cables. One of the few white-painted ships
                in the MSC fleet, featuring strict OPSEC protocols and a unique
                mission unlike any other.
              </p>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4">
                {quickStats.map((stat, index) => (
                  <div
                    key={index}
                    className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4"
                  >
                    <div className="flex items-center text-gray-300 mb-2">
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
                          ? 'bg-gray-400/30 text-white border border-gray-300/50'
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
                <Ship className="w-8 h-8 text-gray-300 mr-4" />
                <h2 className="text-3xl font-bold text-white">Ship Overview</h2>
              </div>

              <div className="prose prose-invert max-w-none">
                <p className="text-lg text-white/80 leading-relaxed">
                  Military Sealift Command operates the USNS Zeus (T-ARC 7), the
                  only active naval vessel capable of laying and repairing
                  undersea fiber optic cables, and one of the few vessels in the
                  MSC GOGO fleet painted white. The Zeus is an old ship and an
                  assignment like no other in MSC.
                </p>

                <p className="text-lg text-white/80 leading-relaxed mb-8">
                  The USNS Zeus can lay 1,000 miles of undersea cable at depths
                  of up to 9,000 feet before needing to resupply. Due to the
                  sensitive nature of its missions, operational security (OPSEC)
                  is taken very seriously.
                </p>

                <div className="grid lg:grid-cols-2 gap-8 mt-8">
                  {/* Undersea Cables */}
                  <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl p-6 border border-white/10">
                    <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                      <span className="text-2xl mr-3">🌐</span>
                      Undersea Cables
                    </h3>
                    <div className="space-y-4">
                      <div className="bg-white/10 rounded-lg p-4">
                        <h4 className="font-medium text-blue-300 mb-2">
                          What Are They?
                        </h4>
                        <p className="text-white/80 text-sm">
                          Undersea fiber optic cables are critical infrastructure
                          that enable global communication by transmitting data
                          across continents under the oceans.
                        </p>
                      </div>
                      <div className="bg-white/10 rounded-lg p-4">
                        <h4 className="font-medium text-blue-300 mb-2">
                          Why Important?
                        </h4>
                        <p className="text-white/80 text-sm">
                          These cables carry most international internet traffic,
                          including phone calls, emails, and financial
                          transactions. An estimated $10 trillion in financial
                          transactions occur daily via these cables.
                        </p>
                      </div>
                      <div className="bg-white/10 rounded-lg p-4">
                        <h4 className="font-medium text-blue-300 mb-2">
                          Security Importance
                        </h4>
                        <p className="text-white/80 text-sm">
                          Governments and militaries rely on these cables for
                          secure communication. Disruption or tapping would be a
                          severe breach of national security.
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 p-3 bg-blue-500/20 rounded-lg border border-blue-400/30">
                      <p className="text-blue-300 text-sm">
                        <strong>Explore:</strong>{' '}
                        <a
                          href="https://www.submarinecablemap.com/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline hover:text-blue-200"
                        >
                          View the Submarine Cable Map →
                        </a>
                      </p>
                    </div>
                  </div>

                  {/* OPSEC / Dark Ship */}
                  <div className="bg-gradient-to-br from-gray-500/20 to-slate-500/20 rounded-xl p-6 border border-white/10">
                    <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                      <span className="text-2xl mr-3">🔒</span>
                      &quot;Dark Ship&quot; Operations
                    </h3>
                    <div className="space-y-4">
                      <div className="bg-white/10 rounded-lg p-4">
                        <h4 className="font-medium text-gray-300 mb-2">
                          What It Means
                        </h4>
                        <p className="text-white/80 text-sm">
                          To protect the location of undersea cables, the ship
                          &quot;goes dark&quot; during missions, eliminating all outgoing
                          transmissions.
                        </p>
                      </div>
                      <div className="bg-white/10 rounded-lg p-4">
                        <h4 className="font-medium text-gray-300 mb-2">
                          No Communications
                        </h4>
                        <p className="text-white/80 text-sm">
                          No internet connectivity, emails, or phone calls are
                          allowed during missions.
                        </p>
                      </div>
                      <div className="bg-white/10 rounded-lg p-4">
                        <h4 className="font-medium text-gray-300 mb-2">
                          Phone Restrictions
                        </h4>
                        <p className="text-white/80 text-sm">
                          Strict rule prohibiting cell phone use on deck while
                          working—all cell phone usage must occur inside the
                          skin of the ship.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mission & Operations */}
                <div className="bg-gradient-to-br from-teal-500/20 to-cyan-500/20 rounded-xl p-6 border border-white/10 mt-8">
                  <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                    <span className="text-2xl mr-3">🎯</span>
                    Mission & Operations
                  </h3>

                  <p className="text-white/80 mb-6">
                    The USNS Zeus is equipped with several large drums used to
                    store cable. Cable is paid out of these drums to the ocean
                    floor. In conjunction with cable operations, the Zeus
                    conducts ROV (Remotely Operated Vehicle) operations.
                  </p>

                  <div className="grid md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white/10 rounded-lg p-4">
                      <h4 className="font-medium text-white mb-2">
                        Cable Laying
                      </h4>
                      <p className="text-white/70 text-sm">
                        Can lay 1,000 miles of cable at depths up to 9,000 feet
                      </p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4">
                      <h4 className="font-medium text-white mb-2">
                        ROV Operations
                      </h4>
                      <p className="text-white/70 text-sm">
                        Conducted by onboard contractors to locate and repair
                        cables
                      </p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4">
                      <h4 className="font-medium text-white mb-2">
                        Dynamic Positioning
                      </h4>
                      <p className="text-white/70 text-sm">
                        DP system keeps the ship stationary without anchors
                        during cable ops
                      </p>
                    </div>
                  </div>

                  <div className="bg-white/10 rounded-lg p-4">
                    <h4 className="font-medium text-white mb-2">
                      Cable Repair Process
                    </h4>
                    <p className="text-white/80 text-sm">
                      CIVMARs navigate to the last known position of the cable
                      needing repair and enter Dynamic Positioning. Contractors
                      drop the ROV over the side, let it sink to the bottom, and
                      search for the cable. Finding the cable can take anywhere
                      from a couple hours to a couple days. Live video footage of
                      the ROV can be seen from screens on the bridge.
                    </p>
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
                          <span className="text-white">513 feet</span>
                        </div>
                        <div className="flex justify-between border-b border-white/10 pb-1">
                          <span className="text-white/70">Beam</span>
                          <span className="text-white">73 feet</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/70">Displacement</span>
                          <span className="text-white">15,174 tons</span>
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
                          <span className="text-white/70">Configuration</span>
                          <span className="text-white">Twin Shaft</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/70">Top Speed</span>
                          <span className="text-white">14 knots</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Crew Composition */}
                <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl p-6 border border-white/10 mt-8">
                  <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                    <span className="text-2xl mr-3">👥</span>
                    Crew Composition
                  </h3>

                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-white/10 rounded-lg p-4 text-center">
                      <div className="text-3xl font-bold text-gray-300 mb-2">
                        50-60
                      </div>
                      <div className="text-white/70 text-sm">MSC CIVMARs</div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4 text-center">
                      <div className="text-3xl font-bold text-gray-300 mb-2">
                        15-20
                      </div>
                      <div className="text-white/70 text-sm">
                        Security Detachment
                      </div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4 text-center">
                      <div className="text-3xl font-bold text-gray-300 mb-2">
                        15-20
                      </div>
                      <div className="text-white/70 text-sm">
                        Cable Contractors
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-gray-500/20 rounded-lg border border-gray-400/30">
                    <p className="text-gray-300 text-sm">
                      <strong>Unique Crew Mix:</strong> The Zeus has a diverse
                      crew including MSC mariners, a security detachment, and
                      specialized cable contractors who handle the ROV and cable
                      repair operations.
                    </p>
                  </div>
                </div>

                {/* Mixed Opinions */}
                <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-xl p-6 border border-white/10 mt-8">
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                    <span className="text-2xl mr-3">⚖️</span>
                    CIVMAR Perspectives
                  </h3>

                  <p className="text-white/80 mb-4">
                    CIVMARs have mixed opinions about assignments to the Zeus.
                    Few CIVMARs have been assigned due to it being the only
                    vessel of its kind.
                  </p>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-green-500/20 rounded-lg p-4 border border-green-400/30">
                      <h4 className="font-medium text-green-300 mb-2">
                        Pros
                      </h4>
                      <ul className="text-white/80 text-sm space-y-1">
                        <li>• High pay with plenty of overtime</li>
                        <li>• Unique, interesting mission</li>
                        <li>• Extended port visits (2 weeks)</li>
                        <li>• One-of-a-kind experience</li>
                      </ul>
                    </div>
                    <div className="bg-red-500/20 rounded-lg p-4 border border-red-400/30">
                      <h4 className="font-medium text-red-300 mb-2">
                        Cons
                      </h4>
                      <ul className="text-white/80 text-sm space-y-1">
                        <li>• No internet/phone during missions</li>
                        <li>• Strict security protocols</li>
                        <li>• Long deployments</li>
                        <li>• Cell phone restrictions on deck</li>
                      </ul>
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
                <DollarSign className="w-8 h-8 text-gray-300 mr-4" />
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
                    USNS Zeus deployments are typically long and last many
                    months. However, this will depend on the mission. While the
                    deployments are long, they are often broken up with a
                    predictable pattern.
                  </p>

                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-white/10 rounded-lg p-4 text-center">
                      <div className="text-3xl font-bold text-blue-400 mb-2">
                        ~6 Weeks
                      </div>
                      <div className="text-white/70 text-sm">At Sea</div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4 text-center">
                      <div className="text-3xl font-bold text-green-400 mb-2">
                        ~2 Weeks
                      </div>
                      <div className="text-white/70 text-sm">
                        Extended Port Visit
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-500/20 rounded-lg border border-blue-400/30">
                    <p className="text-blue-300 text-sm">
                      <strong>Work Hard, Play Hard:</strong> This schedule of
                      long underway periods followed by extended port visits can
                      lead to a &quot;work hard, play hard&quot; mindset among the crew.
                    </p>
                  </div>
                </div>

                {/* Money Situation */}
                <div className="bg-gradient-to-br from-green-500/20 to-teal-500/20 rounded-xl p-6 border border-white/10">
                  <h3 className="text-xl font-semibold text-white mb-4">
                    Money Situation
                  </h3>
                  <p className="text-white/80 mb-6">
                    The Zeus is a high paying ship with ample overtime
                    opportunities when on deployment.
                  </p>

                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-3">
                      <div className="bg-white/10 rounded-lg p-4 border border-green-400/30">
                        <h4 className="font-medium text-green-300 mb-2">
                          High Pay Category
                        </h4>
                        <p className="text-white/70 text-sm">
                          Unique mission and long deployments mean high earnings
                          potential
                        </p>
                      </div>
                      <div className="bg-white/10 rounded-lg p-4 border border-green-400/30">
                        <h4 className="font-medium text-green-300 mb-2">
                          Ample Overtime
                        </h4>
                        <p className="text-white/70 text-sm">
                          Plenty of overtime opportunities during deployment
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="bg-white/10 rounded-lg p-4 border border-green-400/30">
                        <h4 className="font-medium text-green-300 mb-2">
                          Deck Department Hours
                        </h4>
                        <p className="text-white/70 text-sm">
                          When on mission, it&apos;s not uncommon to work 12 hours a
                          day, 7 days a week
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
                          <li>
                            <strong>Basic DP course required</strong> for all
                            Deck Officers
                          </li>
                          <li>
                            <strong>DP Officer endorsement</strong> required for
                            advanced license on the Zeus as a mate
                          </li>
                        </ul>
                      </div>

                      <div className="bg-white/10 rounded-lg p-4">
                        <h5 className="font-medium text-white mb-3">
                          Deck Day Workers
                        </h5>
                        <ul className="text-white/70 text-sm space-y-2">
                          <li>
                            CIVMARs are not responsible for repairing the
                            cable—that&apos;s the contractor&apos;s job
                          </li>
                          <li>CIVMARs do assist in cable operations</li>
                          <li>Common task: pay the cable in and out</li>
                          <li>
                            Walk the cable in the drums to ensure it doesn&apos;t
                            twist or kink
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className="mt-4 p-3 bg-yellow-500/20 rounded-lg border border-yellow-400/30">
                      <p className="text-yellow-300 text-sm">
                        <strong>DP Requirement:</strong> Dynamic Positioning
                        training is essential for deck officers on the Zeus.
                        Plan ahead if you&apos;re interested in this assignment.
                      </p>
                    </div>
                  </div>

                  {/* Engine Department */}
                  <div className="mb-8">
                    <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <span className="text-xl mr-2">🔧</span>
                      Engine Department
                    </h4>

                    <div className="bg-white/10 rounded-lg p-4">
                      <p className="text-white/70 text-sm">
                        If any engine officer or engine department member with
                        experience on the Zeus has information that should be
                        shared, please reach out via the contact form below!
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
                      <ul className="text-white/70 text-sm space-y-2">
                        <li>
                          <strong>Order stock prior to deployment</strong>—critical
                        </li>
                        <li>
                          When the ship goes dark, it will be difficult to send
                          out orders
                        </li>
                        <li>
                          All MILSTRIPs will need to be sent via the high side
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
                      <ul className="text-white/70 text-sm space-y-2">
                        <li>
                          Responsible for managing &quot;dark ship&quot; conditions
                        </li>
                        <li>
                          Ensuring all transmission security requirements are
                          met and maintained
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
                <Home className="w-8 h-8 text-gray-300 mr-4" />
                <h2 className="text-3xl font-bold text-white">Life Aboard</h2>
              </div>

              {/* Life Overview */}
              <div className="bg-gradient-to-br from-gray-500/20 to-slate-500/20 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4">
                  Life on the Zeus
                </h3>
                <p className="text-white/80 mb-6">
                  As a result of the heightened OPSEC measures, the USNS Zeus has
                  strict security protocols when on mission. Life onboard will be
                  impacted by crew cohesion—if it&apos;s a good crew and everyone gets
                  along, it will likely be a good deployment.
                </p>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-red-500/20 rounded-lg p-4 border border-red-400/30">
                    <h4 className="font-medium text-red-300 mb-2">
                      No Internet
                    </h4>
                    <p className="text-white/70 text-sm">
                      Internet connectivity not available during missions
                    </p>
                  </div>
                  <div className="bg-red-500/20 rounded-lg p-4 border border-red-400/30">
                    <h4 className="font-medium text-red-300 mb-2">
                      No Phone Calls
                    </h4>
                    <p className="text-white/70 text-sm">
                      Phone calls and emails not available during missions
                    </p>
                  </div>
                  <div className="bg-yellow-500/20 rounded-lg p-4 border border-yellow-400/30">
                    <h4 className="font-medium text-yellow-300 mb-2">
                      No Phones on Deck
                    </h4>
                    <p className="text-white/70 text-sm">
                      Cell phones strictly prohibited when working on deck
                    </p>
                  </div>
                </div>
              </div>

              {/* Officer Accommodations */}
              <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl p-6 border border-white/10">
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
                          Similar to Kaiser-class T-AO vessels
                        </li>
                        <li>
                          Officers each have their own private staterooms
                        </li>
                        <li>
                          Comfortable and private space for rest
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Photo Placeholders */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg aspect-square overflow-hidden">
                      <img
                        src="/images/global/Coming_Soon_Graphic.png"
                        alt="T-ARC Officer Room - Photo Coming Soon"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="rounded-lg aspect-square overflow-hidden">
                      <img
                        src="/images/global/Coming_Soon_Graphic.png"
                        alt="T-ARC Officer Room - Photo Coming Soon"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Unlicensed Accommodations */}
              <div className="bg-gradient-to-br from-teal-500/20 to-cyan-500/20 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                  <span className="text-2xl mr-3">🛌</span>
                  Unlicensed Accommodations
                </h3>

                <div className="grid lg:grid-cols-2 gap-6">
                  <div>
                    <div className="bg-white/10 rounded-lg p-4">
                      <h5 className="font-medium text-white mb-3">
                        Unlicensed/Non-Officer Staterooms
                      </h5>
                      <ul className="text-white/80 text-sm space-y-2">
                        <li>
                          <strong>All MSC crewmembers</strong> on the USNS Zeus
                          are provided with their own staterooms
                        </li>
                        <li>Ensures privacy for all crew</li>
                        <li>
                          <strong>No open berthing</strong>—a significant perk
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Photo Placeholder */}
                  <div className="rounded-lg aspect-video overflow-hidden">
                    <img
                      src="/images/global/Coming_Soon_Graphic.png"
                      alt="T-ARC Unlicensed Room - Photo Coming Soon"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div className="mt-4 p-4 bg-green-500/20 rounded-lg border border-green-400/30">
                  <p className="text-green-300 text-sm">
                    <strong>No Open Berthing:</strong> Unlike many MSC vessels,
                    every crewmember on the Zeus has their own private room—a
                    major quality of life benefit.
                  </p>
                </div>
              </div>

              {/* Mess Decks */}
              <div className="bg-gradient-to-br from-orange-500/20 to-yellow-500/20 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                  <span className="text-2xl mr-3">🍽️</span>
                  Mess Decks
                </h3>

                <div className="grid lg:grid-cols-2 gap-6">
                  <div>
                    <p className="text-white/80 mb-4">
                      The USNS Zeus features two mess decks.
                    </p>

                    <div className="space-y-3">
                      <div className="bg-white/10 rounded-lg p-4">
                        <h4 className="font-medium text-white mb-2">
                          Officers Mess
                        </h4>
                        <p className="text-white/70 text-sm">
                          Designated dining area for officers
                        </p>
                      </div>
                      <div className="bg-white/10 rounded-lg p-4">
                        <h4 className="font-medium text-white mb-2">
                          Crew Mess
                        </h4>
                        <p className="text-white/70 text-sm">
                          Designated dining area for crew
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Mess Deck Photos */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg aspect-square overflow-hidden">
                      <img
                        src="/images/ships/msc/t-arc/mess_decks/Mess Deck Best.JPG"
                        alt="T-ARC Mess Deck"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="rounded-lg aspect-square overflow-hidden">
                      <img
                        src="/images/ships/msc/t-arc/mess_decks/Mess Deck 2.JPG"
                        alt="T-ARC Mess Deck"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Lounges */}
              <div className="bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                  <span className="text-2xl mr-3">🛋️</span>
                  Lounges
                </h3>

                <div className="grid lg:grid-cols-2 gap-6">
                  <div>
                    <div className="bg-white/10 rounded-lg p-4">
                      <p className="text-white/80 text-sm">
                        There are multiple lounges available on the USNS Zeus
                        providing spaces for relaxation and socializing.
                      </p>
                    </div>
                  </div>

                  {/* Photo Placeholder */}
                  <div className="rounded-lg aspect-video overflow-hidden">
                    <img
                      src="/images/global/Coming_Soon_Graphic.png"
                      alt="T-ARC Lounge - Photo Coming Soon"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>

              {/* Gym */}
              <div className="bg-gradient-to-br from-green-500/20 to-teal-500/20 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                  <span className="text-2xl mr-3">🏋️</span>
                  Gyms
                </h3>

                <div className="grid lg:grid-cols-2 gap-6">
                  <div>
                    <p className="text-white/80 mb-4">
                      The ship is equipped with several gyms.
                    </p>

                    <div className="space-y-3">
                      <div className="bg-white/10 rounded-lg p-4">
                        <h4 className="font-medium text-white mb-2">
                          01 Level - Weight Gym
                        </h4>
                        <p className="text-white/70 text-sm">
                          Weight training equipment
                        </p>
                      </div>
                      <div className="bg-white/10 rounded-lg p-4">
                        <h4 className="font-medium text-white mb-2">
                          One Deck Below - Cardio Room
                        </h4>
                        <p className="text-white/70 text-sm">
                          Large cardio room with a heavy bag
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Photo Placeholder */}
                  <div className="rounded-lg aspect-video overflow-hidden">
                    <img
                      src="/images/global/Coming_Soon_Graphic.png"
                      alt="T-ARC Gym - Photo Coming Soon"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>

              {/* Photo Request */}
              <div className="bg-gradient-to-br from-gray-400/20 to-slate-400/20 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <span className="text-2xl mr-3">📸</span>
                  Help Us Build This Page
                </h3>
                <p className="text-white/80 mb-4">
                  Have photos from your time on the Zeus? We&apos;d love to feature
                  them! Ship photos help future mariners know what to expect.
                </p>
                <p className="text-white/70 text-sm">
                  Send photos to:{' '}
                  <a
                    href="mailto:support@civsail.com"
                    className="text-gray-300 hover:text-white underline"
                  >
                    support@civsail.com
                  </a>
                </p>
              </div>
            </div>
          )}

          {/* Ships & Ports Section */}
          {activeSection === 'ships-ports' && (
            <div className="space-y-8">
              <div className="flex items-center mb-8">
                <MapPin className="w-8 h-8 text-gray-300 mr-4" />
                <h2 className="text-3xl font-bold text-white">Ships & Ports</h2>
              </div>

              {/* Fleet Overview */}
              <div className="bg-gradient-to-br from-gray-500/20 to-slate-500/20 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4">
                  T-ARC Fleet
                </h3>
                <p className="text-white/80 mb-6">
                  Military Sealift Command operates one T-ARC vessel, the USNS
                  Zeus (T-ARC 7). The USNS Zeus is designated as an East Coast
                  vessel. However, since the Zeus is the only ship in its class,
                  it has the potential to go anywhere.
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white/10 rounded-lg p-4">
                    <h4 className="font-semibold text-white mb-3 flex items-center">
                      <span className="text-xl mr-2">🔱</span>
                      Fleet Status
                    </h4>
                    <ul className="text-white/70 text-sm space-y-1">
                      <li>1 vessel in class</li>
                      <li>Only cable-laying ship in MSC</li>
                      <li>East Coast designation (Norfolk, VA)</li>
                      <li>Can deploy anywhere in the world</li>
                    </ul>
                  </div>

                  <div className="bg-white/10 rounded-lg p-4">
                    <h4 className="font-semibold text-white mb-3 flex items-center">
                      <span className="text-xl mr-2">🎨</span>
                      Unique Features
                    </h4>
                    <ul className="text-white/70 text-sm space-y-1">
                      <li>One of few white-painted MSC ships</li>
                      <li>Only naval cable-laying vessel</li>
                      <li>Strict OPSEC protocols</li>
                      <li>DP capability required</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* The Ship */}
              <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                  <span className="text-2xl mr-3">🚢</span>
                  USNS Zeus
                </h3>

                <div
                  className="bg-white/10 rounded-lg p-4 hover:bg-white/15 transition-colors cursor-pointer group"
                  onClick={() => handleShipClick('Zeus', 'T-ARC-7')}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-white group-hover:text-gray-300 transition-colors">
                      USNS Zeus
                    </span>
                    <span className="text-gray-300 text-xs font-mono">
                      T-ARC 7
                    </span>
                  </div>
                  <div className="text-white/60 text-xs mb-2">Active</div>
                  <ul className="text-white/70 text-sm space-y-1 mt-3">
                    <li>
                      <strong>Homeport:</strong> Norfolk, Virginia
                    </li>
                    <li>
                      <strong>Designation:</strong> East Coast
                    </li>
                    <li>
                      <strong>Mission:</strong> Undersea cable laying and repair
                    </li>
                    <li>
                      <strong>Hull Color:</strong> White (unique in fleet)
                    </li>
                  </ul>
                  <div className="mt-3 text-xs text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity">
                    Click for news & photos →
                  </div>
                </div>
              </div>

              {/* Common Ports */}
              <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                  <span className="text-2xl mr-3">🌍</span>
                  Deployment Areas
                </h3>

                <p className="text-white/80 mb-6">
                  Due to its unique mission and increased security, it is
                  difficult to provide common port visits. Wherever there is
                  undersea cable, the Zeus has the potential to go.
                </p>

                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-white/10 rounded-lg p-4 text-center">
                    <div className="text-2xl mb-2">🇺🇸</div>
                    <h4 className="font-medium text-white mb-2">Norfolk, VA</h4>
                    <p className="text-white/70 text-sm">Homeport</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4 text-center">
                    <div className="text-2xl mb-2">🇯🇵</div>
                    <h4 className="font-medium text-white mb-2">Japan</h4>
                    <p className="text-white/70 text-sm">Pacific deployments</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4 text-center">
                    <div className="text-2xl mb-2">🇬🇧</div>
                    <h4 className="font-medium text-white mb-2">
                      United Kingdom
                    </h4>
                    <p className="text-white/70 text-sm">Atlantic deployments</p>
                  </div>
                </div>

                <div className="p-4 bg-yellow-500/20 rounded-lg border border-yellow-400/30">
                  <p className="text-yellow-300 text-sm">
                    <strong>Global Reach:</strong> Sometimes the Zeus&apos;
                    deployment will transit from Norfolk, Virginia to Japan;
                    other times it will operate off the United Kingdom. Wherever
                    there is undersea cable, the Zeus can go.
                  </p>
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
                      1
                    </div>
                    <div className="text-white/70 text-sm">Total Vessel</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-green-400 mb-2">
                      513
                    </div>
                    <div className="text-white/70 text-sm">Feet in Length</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-green-400 mb-2">
                      1,000
                    </div>
                    <div className="text-white/70 text-sm">Miles of Cable</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-green-400 mb-2">
                      9,000
                    </div>
                    <div className="text-white/70 text-sm">Feet Depth</div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-gray-500/20 rounded-lg border border-gray-400/30">
                  <p className="text-gray-300 text-sm">
                    <strong>One of a Kind:</strong> The USNS Zeus is the only
                    active naval vessel capable of laying and repairing undersea
                    fiber optic cables, making it a truly unique assignment in
                    the MSC fleet.
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
