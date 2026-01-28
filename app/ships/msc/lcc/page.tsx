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

export default function LCCShipPage() {
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
      value: 'MSC: ~150 / Navy: ~200',
    },
    {
      icon: <DollarSign className="w-5 h-5" />,
      label: 'Pay Category',
      value: 'High',
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      label: 'Deployment',
      value: 'Homeported (Gaeta, Italy)',
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
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-slate-900 to-amber-950">
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
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-amber-600/20" />
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
            <span className="text-white">LCC</span>
          </div>

          {/* Hero Content */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center bg-amber-500/20 text-amber-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Ship className="w-4 h-4 mr-2" />
                Amphibious Command Ship
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6">
                LCC
                <span className="block text-2xl lg:text-3xl font-normal text-amber-300 mt-2">
                  Blue Ridge Class Command Ship
                </span>
              </h1>
              <p className="text-xl text-white/80 leading-relaxed mb-8">
                The Navy&apos;s flagship for 6th Fleet command operations,
                forward deployed in Gaeta, Italy. A unique hybrid ship combining
                MSC mariners with Navy crew, offering European homeporting and a
                dynamic operational environment.
              </p>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4">
                {quickStats.map((stat, index) => (
                  <div
                    key={index}
                    className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4"
                  >
                    <div className="flex items-center text-amber-300 mb-2">
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
                          ? 'bg-amber-500/30 text-white border border-amber-400/50'
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
                <Ship className="w-8 h-8 text-amber-400 mr-4" />
                <h2 className="text-3xl font-bold text-white">Ship Overview</h2>
              </div>

              <div className="prose prose-invert max-w-none">
                <p className="text-lg text-white/80 leading-relaxed">
                  The USS Mount Whitney (LCC 20) is a Blue Ridge-class
                  amphibious command ship serving as the flagship for the United
                  States 6th Fleet. Forward deployed in Gaeta, Italy, she
                  represents one of the most unique assignments in the MSC
                  fleet—a true hybrid ship combining civilian mariners with Navy
                  operations at the highest command level.
                </p>

                <p className="text-lg text-white/80 leading-relaxed mb-8">
                  Operating under dual authority of MSC and the Navy, the Mount
                  Whitney provides command, control, and communications for
                  fleet commanders and joint force operations throughout the
                  European theater. Her Italian homeport offers mariners a rare
                  opportunity to live and work in Europe.
                </p>

                <div className="grid lg:grid-cols-2 gap-8 mt-8">
                  {/* The Flagship Concept */}
                  <div className="bg-gradient-to-br from-amber-500/20 to-yellow-500/20 rounded-xl p-6 border border-white/10">
                    <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                      <span className="text-2xl mr-3">⭐</span>
                      The Flagship Concept
                    </h3>
                    <div className="space-y-4">
                      <div className="bg-white/10 rounded-lg p-4">
                        <h4 className="font-medium text-amber-300 mb-2">
                          Command Vessel
                        </h4>
                        <p className="text-white/80 text-sm">
                          Serves as the command ship for 6th Fleet, housing the
                          Fleet Commander and their staff
                        </p>
                      </div>
                      <div className="bg-white/10 rounded-lg p-4">
                        <h4 className="font-medium text-amber-300 mb-2">
                          Force Multiplier
                        </h4>
                        <p className="text-white/80 text-sm">
                          Provides command, control, and communications (C3) for
                          joint force operations in the European theater
                        </p>
                      </div>
                      <div className="bg-white/10 rounded-lg p-4">
                        <h4 className="font-medium text-amber-300 mb-2">
                          High Visibility
                        </h4>
                        <p className="text-white/80 text-sm">
                          Regularly hosts VIPs, dignitaries, and media—expect
                          frequent high-profile events and visitors
                        </p>
                      </div>
                      <div className="bg-white/10 rounded-lg p-4">
                        <h4 className="font-medium text-amber-300 mb-2">
                          USS Designation
                        </h4>
                        <p className="text-white/80 text-sm">
                          Uses &quot;USS&quot; designation rather than &quot;USNS&quot;—one of
                          the few MSC-crewed ships with this distinction
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Hybrid Ship Dynamics */}
                  <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl p-6 border border-white/10">
                    <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                      <span className="text-2xl mr-3">⚖️</span>
                      Hybrid Ship Dynamics
                    </h3>
                    <div className="space-y-4">
                      <div className="bg-white/10 rounded-lg p-4">
                        <h4 className="font-medium text-blue-300 mb-2">
                          Dual Authority Structure
                        </h4>
                        <p className="text-white/80 text-sm">
                          Operates under both MSC and Navy command—MSC handles
                          navigation and ship operations, Navy commands the
                          mission
                        </p>
                      </div>
                      <div className="bg-white/10 rounded-lg p-4">
                        <h4 className="font-medium text-blue-300 mb-2">
                          ~150 MSC CIVMARs
                        </h4>
                        <p className="text-white/80 text-sm">
                          Civilian mariners handle ship propulsion, navigation,
                          engineering, and steward services
                        </p>
                      </div>
                      <div className="bg-white/10 rounded-lg p-4">
                        <h4 className="font-medium text-blue-300 mb-2">
                          ~200 Navy Personnel
                        </h4>
                        <p className="text-white/80 text-sm">
                          Navy crew handles communications, weapons systems,
                          fleet command operations, and military mission
                        </p>
                      </div>
                      <div className="bg-white/10 rounded-lg p-4">
                        <h4 className="font-medium text-blue-300 mb-2">
                          Culture Clash Potential
                        </h4>
                        <p className="text-white/80 text-sm">
                          Two different organizations with different cultures,
                          rules, and expectations living and working together
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
                          <span className="text-white">634 feet (193.2m)</span>
                        </div>
                        <div className="flex justify-between border-b border-white/10 pb-1">
                          <span className="text-white/70">Beam</span>
                          <span className="text-white">108 feet (32.9m)</span>
                        </div>
                        <div className="flex justify-between border-b border-white/10 pb-1">
                          <span className="text-white/70">Draft</span>
                          <span className="text-white">27 feet (8.2m)</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/70">Displacement</span>
                          <span className="text-white">18,874 tons (full)</span>
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
                          <span className="text-white">Steam (2 boilers)</span>
                        </div>
                        <div className="flex justify-between border-b border-white/10 pb-1">
                          <span className="text-white/70">Turbine</span>
                          <span className="text-white">1 Geared Turbine</span>
                        </div>
                        <div className="flex justify-between border-b border-white/10 pb-1">
                          <span className="text-white/70">Horsepower</span>
                          <span className="text-white">22,000 HP</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/70">Top Speed</span>
                          <span className="text-white">~20 knots</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4 mt-6">
                    <div className="bg-white/10 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-green-400 mb-1">
                        1971
                      </div>
                      <div className="text-white/70 text-sm">Commissioned</div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-green-400 mb-1">
                        ~350
                      </div>
                      <div className="text-white/70 text-sm">Total Crew</div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-green-400 mb-1">
                        Steam
                      </div>
                      <div className="text-white/70 text-sm">Propulsion Type</div>
                    </div>
                  </div>
                </div>

                {/* The "Drama Ship" Reality */}
                <div className="bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-xl p-6 border border-white/10 mt-8">
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                    <span className="text-2xl mr-3">⚠️</span>
                    The &quot;Drama Ship&quot; Reality
                  </h3>

                  <p className="text-white/80 mb-6">
                    Mount Whitney has a reputation in the MSC fleet—it&apos;s
                    sometimes called the &quot;drama ship.&quot; This isn&apos;t necessarily
                    negative, but it&apos;s worth understanding what you&apos;re getting
                    into.
                  </p>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white/10 rounded-lg p-4">
                      <h4 className="font-medium text-red-300 mb-3">
                        Why the Reputation?
                      </h4>
                      <ul className="text-white/80 text-sm space-y-2">
                        <li>• Two organizations with different cultures sharing one ship</li>
                        <li>• High-visibility operations mean higher scrutiny</li>
                        <li>• Frequent VIP visits = frequent inspections</li>
                        <li>• European homeport attracts diverse personalities</li>
                        <li>• Flagship pressure from all directions</li>
                      </ul>
                    </div>

                    <div className="bg-white/10 rounded-lg p-4">
                      <h4 className="font-medium text-green-300 mb-3">
                        The Flip Side
                      </h4>
                      <ul className="text-white/80 text-sm space-y-2">
                        <li>• &quot;Drama&quot; often means &quot;something is happening&quot;</li>
                        <li>• Never boring—always engaged in operations</li>
                        <li>• European homeport is genuinely incredible</li>
                        <li>• Unique career experience not available elsewhere</li>
                        <li>• Some thrive in the dynamic environment</li>
                      </ul>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-yellow-500/20 rounded-lg border border-yellow-400/30">
                    <p className="text-yellow-300 text-sm">
                      <strong>Bottom Line:</strong> If you like routine,
                      predictability, and minimal interaction with Navy
                      operations, this may not be your ship. If you want
                      adventure, Europe, and don&apos;t mind some interpersonal
                      complexity, Mount Whitney could be the assignment of a
                      lifetime.
                    </p>
                  </div>
                </div>

                {/* Steam Propulsion Note */}
                <div className="bg-gradient-to-br from-purple-500/20 to-indigo-500/20 rounded-xl p-6 border border-white/10 mt-8">
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                    <span className="text-2xl mr-3">🔥</span>
                    Steam Propulsion
                  </h3>
                  <p className="text-white/80 mb-4">
                    Mount Whitney is powered by steam—two boilers feeding one
                    geared turbine. This is increasingly rare in modern fleets
                    and has implications for engineering personnel.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-white/10 rounded-lg p-4">
                      <h4 className="font-medium text-purple-300 mb-2">
                        For Engineers
                      </h4>
                      <p className="text-white/70 text-sm">
                        Valuable steam experience, but be prepared for an older
                        plant requiring hands-on maintenance
                      </p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4">
                      <h4 className="font-medium text-purple-300 mb-2">
                        Ship Age
                      </h4>
                      <p className="text-white/70 text-sm">
                        Commissioned in 1971—one of the older ships in the
                        fleet, with all that entails
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
                <DollarSign className="w-8 h-8 text-amber-400 mr-4" />
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
                    As a forward-deployed flagship, Mount Whitney operates on a
                    schedule driven by fleet command requirements,
                    exercises, and diplomatic events throughout the European
                    theater.
                  </p>

                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-white/10 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-300 mb-3">
                        Homeport Operations
                      </h4>
                      <ul className="text-white/80 text-sm space-y-2">
                        <li>• Based in Gaeta, Italy year-round</li>
                        <li>• Significant time in port between operations</li>
                        <li>• In-port periods include maintenance and training</li>
                        <li>• VIP visits and events even in port</li>
                      </ul>
                    </div>

                    <div className="bg-white/10 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-300 mb-3">
                        Underway Operations
                      </h4>
                      <ul className="text-white/80 text-sm space-y-2">
                        <li>• Exercises throughout Mediterranean and Europe</li>
                        <li>• Fleet command presence missions</li>
                        <li>• Port visits across European nations</li>
                        <li>• NATO and allied operations</li>
                      </ul>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-500/20 rounded-lg border border-blue-400/30">
                    <p className="text-blue-300 text-sm">
                      <strong>European Living:</strong> Forward homeporting
                      means you can establish a residence in Italy, travel
                      Europe on time off, and truly live abroad—not just visit.
                    </p>
                  </div>
                </div>

                {/* Money Situation */}
                <div className="bg-gradient-to-br from-green-500/20 to-teal-500/20 rounded-xl p-6 border border-white/10">
                  <h3 className="text-xl font-semibold text-white mb-4">
                    Money Situation
                  </h3>
                  <p className="text-white/80 mb-6">
                    Mount Whitney is in the high pay category, with additional
                    benefits from overseas assignment and flagship status.
                  </p>

                  <div className="mb-6">
                    <div className="bg-green-500/20 rounded-lg p-4 border border-green-400/30">
                      <h4 className="font-medium text-green-300 mb-2">
                        Base Pay
                      </h4>
                      <p className="text-white/70 text-sm">
                        High base pay and overtime opportunities
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="bg-white/10 rounded-lg p-4">
                      <h4 className="font-medium text-white mb-2">
                        Overtime Opportunities
                      </h4>
                      <p className="text-white/80 text-sm">
                        Large crew size and high operational tempo means
                        overtime is available, especially during exercises and
                        VIP events.
                      </p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4">
                      <h4 className="font-medium text-white mb-2">
                        Supply Department OT
                      </h4>
                      <p className="text-white/80 text-sm">
                        Supply unlicensed (cooks, stewards) often see
                        significant OT during events, receptions, and VIP
                        visits—the flagship hosts frequently.
                      </p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4">
                      <h4 className="font-medium text-white mb-2">
                        Travel Benefits
                      </h4>
                      <p className="text-white/80 text-sm">
                        European homeport means access to cheap flights, trains,
                        and travel throughout Europe during time off.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Department Operations */}
                <div className="bg-gradient-to-br from-amber-500/20 to-yellow-500/20 rounded-xl p-6 border border-white/10">
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
                          <li>Standard navigation and ship handling duties</li>
                          <li>Mediterranean navigation experience</li>
                          <li>Interaction with Navy operations staff</li>
                          <li>European port entries and departures</li>
                        </ul>
                      </div>

                      <div className="bg-white/10 rounded-lg p-4">
                        <h5 className="font-medium text-white mb-3">
                          Deck Unlicensed
                        </h5>
                        <ul className="text-white/70 text-sm space-y-2">
                          <li>Larger crew means defined roles</li>
                          <li>Flagship appearance standards are high</li>
                          <li>Frequent maintenance for inspections</li>
                          <li>Paint, clean, repeat—VIPs visit often</li>
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
                            <strong>Steam plant experience</strong>—increasingly
                            rare and valuable
                          </li>
                          <li>Older ship means hands-on maintenance</li>
                          <li>Two boilers, one geared turbine</li>
                          <li>Engineering challenges = learning opportunities</li>
                        </ul>
                      </div>

                      <div className="bg-white/10 rounded-lg p-4">
                        <h5 className="font-medium text-white mb-3">
                          Engine Unlicensed
                        </h5>
                        <ul className="text-white/70 text-sm space-y-2">
                          <li>Steam plant operations and maintenance</li>
                          <li>Auxiliary systems support</li>
                          <li>Older equipment requires more attention</li>
                          <li>Larger engineering team than diesel ships</li>
                        </ul>
                      </div>
                    </div>

                    <div className="mt-4 p-3 bg-purple-500/20 rounded-lg border border-purple-400/30">
                      <p className="text-purple-300 text-sm">
                        <strong>Steam Experience:</strong> For engineers
                        interested in steam propulsion, Mount Whitney is one of
                        the few remaining opportunities. This experience can be
                        valuable for shore-side positions in power generation.
                      </p>
                    </div>
                  </div>

                  {/* Supply Department - The Star of the Show */}
                  <div className="mb-8">
                    <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <span className="text-xl mr-2">📦</span>
                      Supply Department
                      <span className="ml-3 bg-amber-500/30 text-amber-300 px-2 py-1 rounded text-xs">
                        Flagship Focus
                      </span>
                    </h4>

                    <div className="bg-gradient-to-br from-amber-500/10 to-yellow-500/10 rounded-lg p-6 border border-amber-500/20 mb-6">
                      <p className="text-white/80 mb-4">
                        The Supply Department on Mount Whitney is legendary in
                        MSC circles. As a flagship that regularly hosts admirals,
                        dignitaries, foreign military officers, and VIPs, the
                        galley and steward services operate at a different level.
                      </p>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-white/10 rounded-lg p-4">
                          <h5 className="font-medium text-amber-300 mb-3">
                            Events & Catering
                          </h5>
                          <ul className="text-white/70 text-sm space-y-2">
                            <li>• VIP receptions and dinners</li>
                            <li>• Diplomatic functions</li>
                            <li>• Admiral&apos;s mess service</li>
                            <li>• Change of command ceremonies</li>
                            <li>• Foreign dignitary visits</li>
                          </ul>
                        </div>

                        <div className="bg-white/10 rounded-lg p-4">
                          <h5 className="font-medium text-amber-300 mb-3">
                            What This Means
                          </h5>
                          <ul className="text-white/70 text-sm space-y-2">
                            <li>• Higher standards than typical MSC galleys</li>
                            <li>• More variety and quality in food service</li>
                            <li>• Significant overtime during events</li>
                            <li>• Professional development opportunities</li>
                            <li>• Pressure to perform at high level</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-white/10 rounded-lg p-4">
                        <h5 className="font-medium text-white mb-3">
                          Supply Officer (SUPPO)
                        </h5>
                        <ul className="text-white/70 text-sm space-y-2">
                          <li>
                            <strong>Large department to manage</strong>—stewards,
                            cooks, storekeepers
                          </li>
                          <li>Event planning and coordination</li>
                          <li>European procurement relationships</li>
                          <li>
                            <strong>Legendary stateroom</strong>—see Life Aboard
                          </li>
                        </ul>
                      </div>

                      <div className="bg-white/10 rounded-lg p-4">
                        <h5 className="font-medium text-white mb-3">
                          Supply Unlicensed
                        </h5>
                        <ul className="text-white/70 text-sm space-y-2">
                          <li>
                            <strong>High overtime potential</strong> during
                            events
                          </li>
                          <li>VIP-level food service experience</li>
                          <li>Catering and event support</li>
                          <li>European ingredients and cuisine exposure</li>
                        </ul>
                      </div>
                    </div>

                    <div className="mt-4 p-3 bg-green-500/20 rounded-lg border border-green-400/30">
                      <p className="text-green-300 text-sm">
                        <strong>Career Opportunity:</strong> Supply personnel
                        who excel on Mount Whitney gain experience in high-end
                        hospitality that transfers well to shore-side careers in
                        hotel/restaurant management, event planning, or cruise
                        lines.
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
                      <p className="text-white/80 text-sm mb-4">
                        Communications on a flagship command ship is primarily
                        Navy-handled due to the classified nature of fleet
                        command communications. MSC COMMS personnel support
                        commercial and administrative communications.
                      </p>
                      <ul className="text-white/70 text-sm space-y-2">
                        <li>• Interface with Navy communications systems</li>
                        <li>• Administrative and commercial traffic</li>
                        <li>• Coordination with European ports and agencies</li>
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
                <Home className="w-8 h-8 text-amber-400 mr-4" />
                <h2 className="text-3xl font-bold text-white">Life Aboard</h2>
              </div>

              {/* Overview */}
              <div className="bg-gradient-to-br from-amber-500/20 to-yellow-500/20 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4">
                  Life on the Flagship
                </h3>
                <p className="text-white/80 mb-6">
                  Mount Whitney is one of the larger ships in the MSC fleet,
                  with accommodations for a combined crew of ~350 people. As a
                  flagship, standards are higher, spaces are maintained to
                  impress visitors, and the atmosphere reflects the ship&apos;s
                  command role.
                </p>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-white/10 rounded-lg p-4 text-center">
                    <div className="text-2xl mb-2">🇮🇹</div>
                    <h4 className="font-medium text-white mb-2">Gaeta, Italy</h4>
                    <p className="text-white/70 text-sm">
                      Your homeport is in beautiful coastal Italy
                    </p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4 text-center">
                    <div className="text-2xl mb-2">⭐</div>
                    <h4 className="font-medium text-white mb-2">Flagship Standards</h4>
                    <p className="text-white/70 text-sm">
                      Higher maintenance and appearance standards
                    </p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4 text-center">
                    <div className="text-2xl mb-2">👥</div>
                    <h4 className="font-medium text-white mb-2">~350 Total Crew</h4>
                    <p className="text-white/70 text-sm">
                      MSC and Navy personnel combined
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
                    <div className="bg-white/10 rounded-lg p-4 mb-4">
                      <h5 className="font-medium text-white mb-3">
                        Officer Staterooms
                      </h5>
                      <ul className="text-white/80 text-sm space-y-2">
                        <li>Officers have private or semi-private staterooms</li>
                        <li>Department heads typically have private rooms</li>
                        <li>Larger ship = more spacious accommodations</li>
                        <li>In-room facilities vary by position</li>
                      </ul>
                    </div>

                    {/* The SUPPO Stateroom */}
                    <div className="bg-gradient-to-br from-amber-500/20 to-yellow-500/20 rounded-lg p-4 border border-amber-400/30">
                      <h5 className="font-medium text-amber-300 mb-3 flex items-center">
                        <span className="text-xl mr-2">👑</span>
                        The Legendary SUPPO Stateroom
                      </h5>
                      <p className="text-white/80 text-sm mb-3">
                        The Supply Officer&apos;s stateroom on Mount Whitney is
                        famous throughout MSC. Due to the ship&apos;s original design
                        and the SUPPO&apos;s role in flagship hospitality:
                      </p>
                      <ul className="text-white/70 text-sm space-y-1">
                        <li>• Significantly larger than other officer rooms</li>
                        <li>• Often cited as one of the best accommodations in MSC</li>
                        <li>• Reflects the Supply Officer&apos;s hosting responsibilities</li>
                      </ul>
                    </div>
                  </div>

                  {/* Photo Placeholders */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg aspect-square overflow-hidden">
                      <img
                        src="/images/global/Coming_Soon_Graphic.png"
                        alt="LCC Officer Stateroom - Photo Coming Soon"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="rounded-lg aspect-square overflow-hidden">
                      <img
                        src="/images/global/Coming_Soon_Graphic.png"
                        alt="LCC Officer Stateroom - Photo Coming Soon"
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
                        <li>Unlicensed crew in designated berthing areas</li>
                        <li>Separate from Navy berthing</li>
                        <li>Larger ship allows for better spacing</li>
                        <li>Shared heads and shower facilities</li>
                      </ul>
                    </div>

                    <div className="bg-white/10 rounded-lg p-4">
                      <h5 className="font-medium text-white mb-3">
                        Flagship Standards
                      </h5>
                      <p className="text-white/80 text-sm">
                        Berthing areas are maintained to flagship standards—
                        cleanliness and organization are emphasized more than on
                        typical MSC ships due to frequent inspections and visits.
                      </p>
                    </div>
                  </div>

                  {/* Photo Placeholder */}
                  <div className="rounded-lg aspect-video overflow-hidden">
                    <img
                      src="/images/global/Coming_Soon_Graphic.png"
                      alt="LCC Berthing - Photo Coming Soon"
                      className="w-full h-full object-cover"
                    />
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
                      As a flagship with frequent VIP events, the galley and
                      dining areas operate at a higher standard than typical MSC
                      ships.
                    </p>

                    <div className="space-y-3">
                      <div className="bg-white/10 rounded-lg p-4">
                        <h4 className="font-medium text-white mb-2">
                          Wardroom
                        </h4>
                        <p className="text-white/70 text-sm">
                          Officers&apos; dining area with mess attendant service.
                          Often hosts visiting officers and dignitaries.
                        </p>
                      </div>
                      <div className="bg-white/10 rounded-lg p-4">
                        <h4 className="font-medium text-white mb-2">
                          Admiral&apos;s Mess
                        </h4>
                        <p className="text-white/70 text-sm">
                          Separate dining facility for the Fleet Commander and
                          senior staff—flagship-specific feature.
                        </p>
                      </div>
                      <div className="bg-white/10 rounded-lg p-4">
                        <h4 className="font-medium text-white mb-2">
                          Crew Mess
                        </h4>
                        <p className="text-white/70 text-sm">
                          Unlicensed crew dining area. Food quality tends to be
                          above average due to flagship standards.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Photo Placeholder */}
                  <div className="rounded-lg aspect-video overflow-hidden">
                    <img
                      src="/images/global/Coming_Soon_Graphic.png"
                      alt="LCC Mess Deck - Photo Coming Soon"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div className="mt-6 p-4 bg-amber-500/20 rounded-lg border border-amber-400/30">
                  <p className="text-amber-300 text-sm">
                    <strong>Food Quality:</strong> Between flagship standards,
                    experienced Supply Department, and access to European
                    ingredients during port calls, food on Mount Whitney is
                    generally considered above average for MSC.
                  </p>
                </div>
              </div>

              {/* Lounges & Recreation */}
              <div className="bg-gradient-to-br from-gray-500/20 to-slate-500/20 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                  <span className="text-2xl mr-3">🛋️</span>
                  Lounges & Recreation
                </h3>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white/10 rounded-lg p-4">
                    <h4 className="font-medium text-white mb-3">
                      Recreation Areas
                    </h4>
                    <ul className="text-white/70 text-sm space-y-2">
                      <li>MSC lounge spaces available</li>
                      <li>Larger ship = more common areas</li>
                      <li>Ship&apos;s store for basic necessities</li>
                      <li>Some areas shared with Navy crew</li>
                    </ul>
                  </div>

                  <div className="bg-white/10 rounded-lg p-4">
                    <h4 className="font-medium text-white mb-3">
                      Shore-Based Recreation
                    </h4>
                    <ul className="text-white/70 text-sm space-y-2">
                      <li>
                        <strong>Gaeta</strong>—beautiful Italian coastal town
                      </li>
                      <li>Rome ~1 hour away by train</li>
                      <li>Naples ~1 hour south</li>
                      <li>Easy access to all of Italy and Europe</li>
                    </ul>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-green-500/20 rounded-lg border border-green-400/30">
                  <p className="text-green-300 text-sm">
                    <strong>Living in Italy:</strong> Unlike typical MSC
                    deployments, forward homeporting means you can rent an
                    apartment in Gaeta, buy a car, and actually live in Italy.
                    Many crew members consider this the biggest benefit of the
                    assignment.
                  </p>
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
                        Ship&apos;s Gym
                      </h5>
                      <ul className="text-white/80 text-sm space-y-2">
                        <li>Fitness equipment available onboard</li>
                        <li>Shared between MSC and Navy</li>
                        <li>Larger ship allows for decent gym space</li>
                        <li>
                          Base gym in Gaeta available when in port
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Photo Placeholder */}
                  <div className="rounded-lg aspect-video overflow-hidden">
                    <img
                      src="/images/global/Coming_Soon_Graphic.png"
                      alt="LCC Gym - Photo Coming Soon"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>

              {/* Photo Request */}
              <div className="bg-gradient-to-br from-amber-400/20 to-yellow-400/20 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <span className="text-2xl mr-3">📸</span>
                  Help Us Build This Page
                </h3>
                <p className="text-white/80 mb-4">
                  Have photos from your time on Mount Whitney? We&apos;d love to
                  feature them! Ship photos help future mariners know what to
                  expect from life on the flagship.
                </p>
                <p className="text-white/70 text-sm">
                  Send photos to:{' '}
                  <a
                    href="mailto:alec.schenning@civsail.com"
                    className="text-amber-300 hover:text-amber-200 underline"
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
                <MapPin className="w-8 h-8 text-amber-400 mr-4" />
                <h2 className="text-3xl font-bold text-white">Ships & Ports</h2>
              </div>

              {/* Fleet Overview */}
              <div className="bg-gradient-to-br from-amber-500/20 to-yellow-500/20 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4">
                  Blue Ridge Class LCC
                </h3>
                <p className="text-white/80 mb-6">
                  The USS Mount Whitney (LCC 20) is the sole MSC-crewed
                  amphibious command ship forward deployed in Europe. Her sister
                  ship, USS Blue Ridge (LCC 19), serves as 7th Fleet flagship in
                  Japan but is Navy-crewed.
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white/10 rounded-lg p-4">
                    <h4 className="font-semibold text-white mb-3 flex items-center">
                      <span className="text-xl mr-2">🏛️</span>
                      6th Fleet Flagship
                    </h4>
                    <ul className="text-white/70 text-sm space-y-1">
                      <li>Command ship for U.S. 6th Fleet</li>
                      <li>European theater operations</li>
                      <li>NATO and allied coordination</li>
                      <li>Mediterranean presence</li>
                    </ul>
                  </div>

                  <div className="bg-white/10 rounded-lg p-4">
                    <h4 className="font-semibold text-white mb-3 flex items-center">
                      <span className="text-xl mr-2">🌍</span>
                      Forward Deployed
                    </h4>
                    <ul className="text-white/70 text-sm space-y-1">
                      <li>Permanently based in Gaeta, Italy</li>
                      <li>Not on rotation—true overseas homeport</li>
                      <li>Crew can establish European residence</li>
                      <li>Year-round Mediterranean operations</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* The Ship */}
              <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                  <span className="text-2xl mr-3">🚢</span>
                  USS Mount Whitney
                </h3>

                <div
                  className="bg-white/10 rounded-lg p-6 hover:bg-white/15 transition-colors cursor-pointer group"
                  onClick={() => handleShipClick('Mount Whitney', 'LCC-20')}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="font-semibold text-white text-lg group-hover:text-amber-300 transition-colors">
                        USS Mount Whitney
                      </span>
                      <span className="text-amber-300 text-sm font-mono ml-3">
                        LCC 20
                      </span>
                    </div>
                    <div className="text-green-400 text-sm">Active</div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <span className="text-white/50 text-xs">Homeport</span>
                      <div className="text-white">Gaeta, Italy</div>
                    </div>
                    <div>
                      <span className="text-white/50 text-xs">Class</span>
                      <div className="text-white">Blue Ridge</div>
                    </div>
                    <div>
                      <span className="text-white/50 text-xs">Role</span>
                      <div className="text-white">6th Fleet Flagship</div>
                    </div>
                  </div>

                  <div className="text-xs text-amber-300 opacity-0 group-hover:opacity-100 transition-opacity">
                    Click for news & photos →
                  </div>
                </div>
              </div>

              {/* Common Ports */}
              <div className="bg-gradient-to-br from-green-500/20 to-teal-500/20 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                  <span className="text-2xl mr-3">🇪🇺</span>
                  Common European Ports
                </h3>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h4 className="font-medium text-white mb-3">Mediterranean</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        'Gaeta, Italy',
                        'Naples, Italy',
                        'Rota, Spain',
                        'Barcelona, Spain',
                        'Marseille, France',
                        'Toulon, France',
                        'Split, Croatia',
                        'Souda Bay, Greece',
                      ].map((port) => (
                        <div
                          key={port}
                          className="bg-white/10 rounded-lg px-3 py-2 text-center text-white/80 text-sm hover:bg-white/15 transition-colors"
                        >
                          {port}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-white mb-3">Northern Europe & Black Sea</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        'Portsmouth, UK',
                        'Kiel, Germany',
                        'Oslo, Norway',
                        'Tallinn, Estonia',
                        'Constanta, Romania',
                        'Varna, Bulgaria',
                        'Batumi, Georgia',
                        'Odessa, Ukraine',
                      ].map((port) => (
                        <div
                          key={port}
                          className="bg-white/10 rounded-lg px-3 py-2 text-center text-white/80 text-sm hover:bg-white/15 transition-colors"
                        >
                          {port}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-green-500/20 rounded-lg border border-green-400/30">
                  <p className="text-green-300 text-sm">
                    <strong>Travel Opportunity:</strong> European port visits
                    combined with Italian homeporting mean unprecedented travel
                    opportunities. Many mariners use their time off to explore
                    countries throughout Europe.
                  </p>
                </div>
              </div>

              {/* Homeport: Gaeta */}
              <div className="bg-gradient-to-br from-orange-500/20 to-amber-500/20 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                  <span className="text-2xl mr-3">🇮🇹</span>
                  Homeport: Gaeta, Italy
                </h3>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-white/10 rounded-lg p-4">
                    <h4 className="font-medium text-white mb-3">About Gaeta</h4>
                    <ul className="text-white/70 text-sm space-y-2">
                      <li>Beautiful medieval coastal town</li>
                      <li>Between Rome (~1 hr) and Naples (~1 hr)</li>
                      <li>Beach town atmosphere</li>
                      <li>Active U.S. Navy support facility</li>
                      <li>Italian culture and cuisine</li>
                    </ul>
                  </div>

                  <div className="bg-white/10 rounded-lg p-4">
                    <h4 className="font-medium text-white mb-3">Living Options</h4>
                    <ul className="text-white/70 text-sm space-y-2">
                      <li>Rent apartments in town or nearby</li>
                      <li>Some mariners commute from Naples or Rome</li>
                      <li>Navy support services available</li>
                      <li>Exchange and commissary access</li>
                      <li>Italian driver&apos;s license obtainable</li>
                    </ul>
                  </div>
                </div>

                <div className="p-4 bg-amber-500/20 rounded-lg border border-amber-400/30">
                  <p className="text-amber-300 text-sm">
                    <strong>Living in Italy:</strong> Unlike typical MSC
                    deployments, forward homeporting in Gaeta allows you to
                    truly live abroad—rent an apartment, buy a Vespa, learn
                    Italian, and immerse yourself in European life.
                  </p>
                </div>
              </div>

              {/* Fleet Summary */}
              <div className="bg-gradient-to-br from-purple-500/20 to-indigo-500/20 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                  <span className="text-2xl mr-3">📊</span>
                  Ship Summary
                </h3>

                <div className="grid md:grid-cols-4 gap-4">
                  <div className="bg-white/10 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-amber-400 mb-2">
                      1
                    </div>
                    <div className="text-white/70 text-sm">MSC-Crewed LCC</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-amber-400 mb-2">
                      634
                    </div>
                    <div className="text-white/70 text-sm">Feet in Length</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-amber-400 mb-2">
                      ~150
                    </div>
                    <div className="text-white/70 text-sm">MSC Crew</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-amber-400 mb-2">
                      1971
                    </div>
                    <div className="text-white/70 text-sm">Commissioned</div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-amber-500/20 rounded-lg border border-amber-400/30">
                  <p className="text-amber-300 text-sm">
                    <strong>Unique Assignment:</strong> Mount Whitney offers
                    what no other MSC ship can—European homeporting, flagship
                    prestige, and the chance to live in Italy. For mariners
                    seeking adventure beyond typical deployments, it&apos;s worth
                    serious consideration.
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
            Details may vary by operational status and current command.
          </p>
        </div>
      </div>
    </div>
  );
}
