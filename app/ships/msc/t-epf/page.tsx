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

export default function TEPFShipPage() {
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
      value: '22-26 MSC',
    },
    {
      icon: <DollarSign className="w-5 h-5" />,
      label: 'Pay Category',
      value: 'High',
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      label: 'Deployment',
      value: 'Mission-dependent',
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
    <div className="min-h-screen bg-gradient-to-br from-teal-900 via-slate-800 to-cyan-800">
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
        <div className="absolute inset-0 bg-gradient-to-r from-teal-600/20 to-cyan-600/20" />
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
            <span className="text-white">T-EPF</span>
          </div>

          {/* Hero Content */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center bg-teal-500/20 text-teal-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Ship className="w-4 h-4 mr-2" />
                Expeditionary Fast Transport
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6">
                T-EPF
                <span className="block text-2xl lg:text-3xl font-normal text-teal-300 mt-2">
                  Expeditionary Fast Transport
                </span>
              </h1>
              <p className="text-xl text-white/80 leading-relaxed mb-8">
                High-speed aluminum catamarans designed to rapidly move troops
                and cargo into difficult-to-reach ports. With a top speed of 35
                knots and shallow draft, EPFs offer a unique MSC experience with
                small crews and high pay.
              </p>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4">
                {quickStats.map((stat, index) => (
                  <div
                    key={index}
                    className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4"
                  >
                    <div className="flex items-center text-teal-300 mb-2">
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
                          ? 'bg-teal-500/30 text-white border border-teal-400/50'
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
                <Ship className="w-8 h-8 text-teal-400 mr-4" />
                <h2 className="text-3xl font-bold text-white">Ship Overview</h2>
              </div>

              <div className="prose prose-invert max-w-none">
                <p className="text-lg text-white/80 leading-relaxed">
                  The T-EPF class vessel is an Expeditionary Fast Transport
                  designed to quickly move troops and cargo into
                  difficult-to-reach ports. Built by Austal, the EPF has sparked
                  controversy for several reasons. Although these ships have
                  impressive capabilities, they have faced many maintenance
                  issues, resulting in a lackluster service history.
                </p>

                <p className="text-lg text-white/80 leading-relaxed mb-8">
                  With a top speed of 35 knots (40 MPH), a shallow draft, a
                  stern ramp, a mission bay, and seating for 312 troops, the EPF
                  can quickly enter a port, unload people and equipment without
                  the need for tugs, and return to sea. However, despite their
                  potential, their performance has often fallen short.
                </p>

                <div className="grid lg:grid-cols-2 gap-8 mt-8">
                  {/* Unique Design */}
                  <div className="bg-gradient-to-br from-teal-500/20 to-cyan-500/20 rounded-xl p-6 border border-white/10">
                    <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                      <span className="text-2xl mr-3">🚀</span>
                      Unique Design
                    </h3>
                    <div className="space-y-4">
                      <div className="bg-white/10 rounded-lg p-4">
                        <h4 className="font-medium text-teal-300 mb-2">
                          Aluminum Hull
                        </h4>
                        <p className="text-white/80 text-sm">
                          Unlike other MSC ships, EPFs are made of aluminum with
                          a catamaran-shaped hull. While lightweight and fast,
                          this has raised concerns about structural integrity.
                        </p>
                      </div>
                      <div className="bg-white/10 rounded-lg p-4">
                        <h4 className="font-medium text-teal-300 mb-2">
                          Catamaran Design
                        </h4>
                        <p className="text-white/80 text-sm">
                          The twin-hull design enables high speeds but does not
                          perform well in rough seas, making EPFs dependent on
                          good weather conditions.
                        </p>
                      </div>
                      <div className="bg-white/10 rounded-lg p-4">
                        <h4 className="font-medium text-teal-300 mb-2">
                          No Tugs Required
                        </h4>
                        <p className="text-white/80 text-sm">
                          With water jet propulsion and shallow draft, EPFs can
                          enter ports independently without tug assistance.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* HSC Code Requirements */}
                  <div className="bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-xl p-6 border border-white/10">
                    <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                      <span className="text-2xl mr-3">📜</span>
                      HSC Code Requirements
                    </h3>
                    <div className="space-y-4">
                      <div className="bg-white/10 rounded-lg p-4">
                        <h4 className="font-medium text-blue-300 mb-2">
                          Type Rating Required
                        </h4>
                        <p className="text-white/80 text-sm">
                          All crew must complete a safety course. Licensed
                          Officers need additional IMO High-Speed Craft (HSC)
                          Code certification.
                        </p>
                      </div>
                      <div className="bg-white/10 rounded-lg p-4">
                        <h4 className="font-medium text-blue-300 mb-2">
                          Training at TCHR
                        </h4>
                        <p className="text-white/80 text-sm">
                          Training typically offered at Training Center Hampton
                          Roads includes classroom, simulator time, testing, and
                          at-sea qualification period.
                        </p>
                      </div>
                      <div className="bg-white/10 rounded-lg p-4">
                        <h4 className="font-medium text-blue-300 mb-2">
                          Onboard Training Option
                        </h4>
                        <p className="text-white/80 text-sm">
                          Safety course can be taught onboard during the first
                          week if the Chief Engineer is qualified to instruct.
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
                    {/* Physical Specs */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-green-300 mb-4">
                        Vessel Characteristics
                      </h4>

                      <div className="bg-white/10 rounded-lg p-4">
                        <h5 className="font-medium text-white mb-3">
                          Dimensions & Performance
                        </h5>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between border-b border-white/10 pb-1">
                            <span className="text-white/70">Length</span>
                            <span className="text-white">338 feet</span>
                          </div>
                          <div className="flex justify-between border-b border-white/10 pb-1">
                            <span className="text-white/70">Beam</span>
                            <span className="text-white">93.5 feet</span>
                          </div>
                          <div className="flex justify-between border-b border-white/10 pb-1">
                            <span className="text-white/70">Draft</span>
                            <span className="text-white">3.8 meters</span>
                          </div>
                          <div className="flex justify-between border-b border-white/10 pb-1">
                            <span className="text-white/70">Displacement</span>
                            <span className="text-white">2,400 tons</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-white/70">Top Speed</span>
                            <span className="text-white font-semibold text-teal-300">
                              35 knots (40 MPH)
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white/10 rounded-lg p-4">
                        <h5 className="font-medium text-white mb-3">
                          Propulsion System
                        </h5>
                        <p className="text-white/80 text-sm">
                          4 x MTU 20V8000 M71L Diesel Engines with 4 Wartsila
                          WLD 1400 SR Water Jets. Over 48,000 horsepower total.
                        </p>
                      </div>
                    </div>

                    {/* Capacity Specs */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-green-300 mb-4">
                        Capacity & Features
                      </h4>

                      <div className="bg-white/10 rounded-lg p-4">
                        <h5 className="font-medium text-white mb-3">
                          Payload Capacity
                        </h5>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between border-b border-white/10 pb-1">
                            <span className="text-white/70">Cargo</span>
                            <span className="text-white">635 metric tons</span>
                          </div>
                          <div className="flex justify-between border-b border-white/10 pb-1">
                            <span className="text-white/70">
                              Embarked Berthing
                            </span>
                            <span className="text-white">150 personnel</span>
                          </div>
                          <div className="flex justify-between border-b border-white/10 pb-1">
                            <span className="text-white/70">
                              312 Seating Area
                            </span>
                            <span className="text-white">312 troops</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-white/70">Hull Shape</span>
                            <span className="text-white">Catamaran</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white/10 rounded-lg p-4">
                        <h5 className="font-medium text-white mb-3">
                          Flight Deck
                        </h5>
                        <p className="text-white/80 text-sm">
                          No embarked helicopter or hangar, but capable of
                          receiving CH-53K helicopters on the flight deck.
                        </p>
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

                  <p className="text-white/80 mb-6">
                    EPFs operate with small crews compared to other MSC vessels.
                    The small team dynamic means crew relationships
                    significantly impact the quality of the assignment.
                  </p>

                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-white/10 rounded-lg p-4 text-center">
                      <div className="text-3xl font-bold text-purple-400 mb-2">
                        22-26
                      </div>
                      <div className="text-white/70 text-sm">MSC Crew</div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4 text-center">
                      <div className="text-3xl font-bold text-purple-400 mb-2">
                        Variable
                      </div>
                      <div className="text-white/70 text-sm">
                        Military Detachments
                      </div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4 text-center">
                      <div className="text-3xl font-bold text-purple-400 mb-2">
                        No
                      </div>
                      <div className="text-white/70 text-sm">
                        Air Detachment
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-purple-500/20 rounded-lg border border-purple-400/30">
                    <p className="text-purple-300 text-sm">
                      <strong>Crew Dynamic:</strong> If the crew all gets along,
                      it can be a great assignment. If there are a few bad
                      apples, it can ruin the bunch.
                    </p>
                  </div>
                </div>

                {/* Future of EPF Fleet */}
                <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-xl p-6 border border-white/10 mt-8">
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                    <span className="text-2xl mr-3">🔮</span>
                    The Future of the EPF Fleet
                  </h3>

                  <div className="space-y-6">
                    <div className="bg-white/10 rounded-lg p-4">
                      <h4 className="font-medium text-yellow-300 mb-2">
                        Reduced Operating Status (ROS) Controversy
                      </h4>
                      <p className="text-white/80 text-sm mb-3">
                        Due to maintenance issues, limited use cases, and the
                        current manning crisis, many EPFs are being sent into
                        ROS. However, Section 1018 of the 2024 NDAA prohibits
                        using funds to place EPFs into ROS.
                      </p>
                      <p className="text-white/70 text-xs italic">
                        &quot;None of the funds authorized to be appropriated...may
                        be used to place an expeditionary fast transport vessel
                        into a reduced operating status.&quot; - NDAA Section 1018
                      </p>
                    </div>

                    <div className="bg-white/10 rounded-lg p-4">
                      <h4 className="font-medium text-yellow-300 mb-2">
                        EMS Medical Mission
                      </h4>
                      <p className="text-white/80 text-sm">
                        Austal and the Navy are developing a modified T-EPF
                        (Expeditionary Medical Ship) to fulfill the Navy&apos;s
                        medical mission. Instead of the 312 troop seating, EMS
                        vessels will have a medical suite, allowing medical
                        platforms to enter more austere environments than the
                        large T-AH hospital ships.
                      </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-white/10 rounded-lg p-4">
                        <h4 className="font-medium text-orange-300 mb-2">
                          Why Preserve the Program?
                        </h4>
                        <p className="text-white/70 text-sm">
                          Some believe this is a form of government subsidy to
                          Austal to keep US shipbuilding capacity alive, despite
                          the EPF&apos;s challenges.
                        </p>
                      </div>
                      <div className="bg-white/10 rounded-lg p-4">
                        <h4 className="font-medium text-orange-300 mb-2">
                          Indo-Pacific Strategy
                        </h4>
                        <p className="text-white/70 text-sm">
                          The NDAA requires the Chief of Naval Operations to
                          develop a strategy for EPF use in US Indo-Pacific
                          Command operations.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CIVMAR Perspectives */}
                <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl p-6 border border-white/10 mt-8">
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                    <span className="text-2xl mr-3">💭</span>
                    CIVMAR Perspectives
                  </h3>

                  <p className="text-white/80 mb-6">
                    CIVMARs have mixed views on EPFs. The trade-offs are
                    significant and depend heavily on personal priorities.
                  </p>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-green-500/20 rounded-lg p-4 border border-green-400/30">
                      <h4 className="font-semibold text-green-300 mb-3">
                        Pros
                      </h4>
                      <ul className="text-green-200 text-sm space-y-2">
                        <li>• High pay relative to workload</li>
                        <li>• Extended port time</li>
                        <li>• Lower operational tempo</li>
                        <li>• Small crew camaraderie (when it works)</li>
                        <li>• EPF bonus/retention incentive</li>
                        <li>• More adventure and exotic ports</li>
                      </ul>
                    </div>

                    <div className="bg-red-500/20 rounded-lg p-4 border border-red-400/30">
                      <h4 className="font-semibold text-red-300 mb-3">Cons</h4>
                      <ul className="text-red-200 text-sm space-y-2">
                        <li>• Most officers share rooms</li>
                        <li>• Skills may decline for larger ships</li>
                        <li>• Uncertain fleet future</li>
                        <li>• Rough ride in bad weather</li>
                        <li>• Small crew conflicts magnified</li>
                        <li>• Transitioning back to CLF can be hard</li>
                      </ul>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-cyan-500/20 rounded-lg border border-cyan-400/30">
                    <p className="text-cyan-300 text-sm">
                      <strong>Bottom Line:</strong> If you prefer to stay home
                      and earn good pay, EPFs can be a good option—provided you
                      are comfortable with the trade-offs.
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
                <DollarSign className="w-8 h-8 text-teal-400 mr-4" />
                <h2 className="text-3xl font-bold text-white">
                  Operations & Pay
                </h2>
              </div>

              {/* Operational Cycle */}
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-teal-500/20 to-cyan-500/20 rounded-xl p-6 border border-white/10">
                  <h3 className="text-xl font-semibold text-white mb-4">
                    Operational Cycle
                  </h3>
                  <p className="text-white/80 mb-6">
                    T-EPFs do not have a traditional operational cycle. Their
                    deployment schedule and shipyard rotation depend on the
                    vessel&apos;s current tasking, operational status, and manning
                    levels.
                  </p>

                  <div className="grid md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white/10 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-teal-400 mb-2">
                        Variable
                      </div>
                      <div className="text-white/70 text-sm">
                        Deployment Length
                      </div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-teal-400 mb-2">
                        Mission
                      </div>
                      <div className="text-white/70 text-sm">
                        Dependent Schedule
                      </div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-teal-400 mb-2">
                        Flexible
                      </div>
                      <div className="text-white/70 text-sm">
                        Shipyard Rotation
                      </div>
                    </div>
                  </div>
                </div>

                {/* Port to Sea Time Ratio */}
                <div className="bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-xl p-6 border border-white/10">
                  <h3 className="text-xl font-semibold text-white mb-4">
                    Port to Sea Time Ratio
                  </h3>
                  <p className="text-white/80 mb-6">
                    EPFs do not spend a lot of time at sea. Due to their rough
                    ride, inability to handle adverse weather conditions, and
                    mission as a high-speed transit vessel, these vessels spend
                    a lot of time in port.
                  </p>

                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-white/10 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-300 mb-3">
                        Typical Pattern
                      </h4>
                      <ul className="text-white/80 text-sm space-y-2">
                        <li>Extended periods in port at each visit</li>
                        <li>High-speed transits between locations</li>
                        <li>Weather-dependent operations</li>
                        <li>Mission-based scheduling</li>
                      </ul>
                    </div>

                    <div className="bg-white/10 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-300 mb-3">
                        Sea Time Considerations
                      </h4>
                      <ul className="text-white/80 text-sm space-y-2">
                        <li>
                          <strong>Underway:</strong> Day-for-day sea time
                        </li>
                        <li>
                          <strong>In port long enough:</strong> Converts to 1
                          for 3
                        </li>
                        <li>
                          <strong>Ships power:</strong> Resets the timer
                        </li>
                        <li>License upgrades may take longer on low-op ships</li>
                      </ul>
                    </div>
                  </div>

                  <div className="p-4 bg-yellow-500/20 rounded-lg border border-yellow-400/30">
                    <p className="text-yellow-300 text-sm">
                      <strong>License Upgrade Note:</strong> If you&apos;re on one of
                      the lesser operating ships, the sea time conversion to 1
                      for 3 means it will take longer to upgrade your license.
                    </p>
                  </div>
                </div>

                {/* Money Situation */}
                <div className="bg-gradient-to-br from-green-500/20 to-teal-500/20 rounded-xl p-6 border border-white/10">
                  <h3 className="text-xl font-semibold text-white mb-4">
                    Money Situation
                  </h3>
                  <p className="text-white/80 mb-6">
                    T-EPFs are generally considered high paying ships. EPFs are
                    in the highest salary group for all MSC ships, and there are
                    usually ample overtime opportunities because of the small
                    crew and litany of maintenance issues.
                  </p>

                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-3">
                      <div className="bg-white/10 rounded-lg p-4 border border-green-400/30">
                        <h4 className="font-medium text-green-300 mb-2">
                          Highest Salary Group
                        </h4>
                        <p className="text-white/70 text-sm">
                          EPFs are in the top salary group for all MSC ships
                        </p>
                      </div>
                      <div className="bg-white/10 rounded-lg p-4 border border-green-400/30">
                        <h4 className="font-medium text-green-300 mb-2">
                          EPF Bonus/Retention Incentive
                        </h4>
                        <p className="text-white/70 text-sm">
                          MSC incentivizes people to enter and stay in the
                          program with special bonuses
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="bg-white/10 rounded-lg p-4 border border-green-400/30">
                        <h4 className="font-medium text-green-300 mb-2">
                          Overtime Opportunities
                        </h4>
                        <p className="text-white/70 text-sm">
                          Ample OT due to small crew and frequent maintenance
                          issues
                        </p>
                      </div>
                      <div className="bg-white/10 rounded-lg p-4 border border-green-400/30">
                        <h4 className="font-medium text-green-300 mb-2">
                          Pay vs Workload
                        </h4>
                        <p className="text-white/70 text-sm">
                          Generally high pay relative to workload (can cause
                          tension with deployed crews)
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-yellow-500/20 rounded-lg border border-yellow-400/30">
                    <p className="text-yellow-300 text-sm">
                      <strong>Fleet Tension:</strong> The high pay relative to
                      workload can cause tension between those on busy, deployed
                      ships earning less and those on EPFs that are stateside or
                      in ROS for long periods.
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
                            <strong>HSC Type Rating:</strong> Required per IMO
                            Code
                          </li>
                          <li>Training at TCHR with simulator and at-sea time</li>
                          <li>Can upgrade unlimited tonnage license with EPF time</li>
                          <li>
                            Sea time converts to 1:3 after extended port stays
                          </li>
                        </ul>
                      </div>

                      <div className="bg-white/10 rounded-lg p-4">
                        <h5 className="font-medium text-white mb-3">
                          Deck Day Workers
                        </h5>
                        <ul className="text-white/70 text-sm space-y-2">
                          <li>Typical maintenance and fire marshal duties</li>
                          <li>
                            <strong>No chipping/painting:</strong> Aluminum hull
                          </li>
                          <li>Lots of cleaning</li>
                          <li>
                            <strong>AB Re-rating:</strong> Watch underway, day
                            work pier side
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className="mt-4 p-3 bg-yellow-500/20 rounded-lg border border-yellow-400/30">
                      <p className="text-yellow-300 text-sm">
                        <strong>Pay Issue:</strong> AB re-rates between watch
                        and day work require an SF-50 each time. This can cause
                        pay issues if not processed correctly shoreside.
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
                        <ul className="text-white/70 text-sm space-y-2">
                          <li>
                            <strong>HSC Type Rating:</strong> Required per IMO
                            Code
                          </li>
                          <li>
                            <strong>Bridge Watch:</strong> EOS stands watch on
                            bridge underway
                          </li>
                          <li>Cannot leave bridge per HSC Code requirements</li>
                          <li>48,000+ HP satisfies unlimited motors license</li>
                          <li>
                            Ships power (not shore) counts day-for-day and
                            resets timer
                          </li>
                        </ul>
                      </div>

                      <div className="bg-white/10 rounded-lg p-4">
                        <h5 className="font-medium text-white mb-3">
                          Engine Unlicensed (EUs)
                        </h5>
                        <ul className="text-white/70 text-sm space-y-2">
                          <li>
                            <strong>Hardest job on an EPF</strong>
                          </li>
                          <li>
                            Serve as both deck rover and engine watch stander
                          </li>
                          <li>Complete all rounds underway</li>
                          <li>
                            Responsible for solving most plant issues with
                            guidance
                          </li>
                          <li>Engine room only accessible by ladders/hatches</li>
                          <li>Often help with line handling for Deck Dept</li>
                          <li>Fill water and pump sewage on watch</li>
                        </ul>
                      </div>
                    </div>

                    <div className="mt-4 p-3 bg-blue-500/20 rounded-lg border border-blue-400/30">
                      <p className="text-blue-300 text-sm">
                        <strong>Watch Relief:</strong> If an EU cannot fix a
                        problem, the engineer on watch must be relieved from the
                        bridge by another engineer to troubleshoot the issue.
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
                        Department Structure
                      </h5>
                      <ul className="text-white/70 text-sm space-y-2">
                        <li>
                          <strong>JSO:</strong> Department Head (independent
                          duty)
                        </li>
                        <li>
                          <strong>Staff:</strong> Steward Cook, Cook Baker, 2
                          SUs
                        </li>
                        <li>
                          JSO should be experienced and well-versed in GPC
                          procedures
                        </li>
                        <li>
                          Must know Port Services, Non-Standard Orders, and Food
                          Service Ops
                        </li>
                        <li>No one on board to ask for help</li>
                      </ul>
                    </div>

                    <div className="mt-4 p-3 bg-red-500/20 rounded-lg border border-red-400/30">
                      <p className="text-red-300 text-sm">
                        <strong>Warning:</strong> This should NOT be your first
                        JSO assignment. The EPF JSO position requires experience
                        and confidence in your abilities.
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
                        Department Structure
                      </h5>
                      <ul className="text-white/70 text-sm space-y-2">
                        <li>
                          <strong>Staff:</strong> SCO and RET (2 people total)
                        </li>
                        <li>Much more responsibility than on bigger ships</li>
                        <li>
                          Must keep up with all normal message traffic and
                          maintenance
                        </li>
                        <li>Should be confident in abilities before accepting</li>
                        <li>Work in the C4I suite</li>
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
                <Home className="w-8 h-8 text-teal-400 mr-4" />
                <h2 className="text-3xl font-bold text-white">Life Aboard</h2>
              </div>

              {/* Introduction */}
              <div className="bg-gradient-to-br from-teal-500/20 to-cyan-500/20 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4">
                  Life on an EPF
                </h3>
                <p className="text-white/80 mb-6">
                  Life on board an EPF is different than the typical MSC ship.
                  With only 22-26 crewmembers on board, the crews are much
                  smaller. Additionally, many crewmembers will share rooms and
                  the living conditions are not as nice as some MSC ships
                  because of limited space.
                </p>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-white/10 rounded-lg p-4">
                    <h4 className="font-medium text-white mb-2">Small Crew</h4>
                    <p className="text-white/70 text-sm">
                      Only 22-26 people means everyone knows everyone. Crew
                      dynamics are critical.
                    </p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4">
                    <h4 className="font-medium text-white mb-2">Shared Rooms</h4>
                    <p className="text-white/70 text-sm">
                      Most officers and all unlicensed share rooms. For some,
                      this is a deal breaker.
                    </p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4">
                    <h4 className="font-medium text-white mb-2">
                      Limited Space
                    </h4>
                    <p className="text-white/70 text-sm">
                      Everything is smaller—rooms, lounges, mess deck, and ship
                      store.
                    </p>
                  </div>
                </div>
              </div>

              {/* Officer Berthing */}
              <div className="bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                  <span className="text-2xl mr-3">🛏️</span>
                  Officer Accommodations
                </h3>

                <div className="grid lg:grid-cols-2 gap-6 mb-6">
                  <div>
                    <div className="bg-white/10 rounded-lg p-4 mb-4">
                      <h5 className="font-medium text-white mb-3">
                        Private Rooms (6 billets only)
                      </h5>
                      <ul className="text-white/80 text-sm space-y-2">
                        <li>Captain</li>
                        <li>Chief Engineer</li>
                        <li>Chief Mate</li>
                        <li>1st Engineer</li>
                        <li>2nd Mate</li>
                        <li>2nd Assistant Engineer</li>
                      </ul>
                      <p className="text-white/60 text-xs mt-3">
                        Rooms are very small and double as offices
                      </p>
                    </div>

                    <div className="bg-white/10 rounded-lg p-4">
                      <h5 className="font-medium text-white mb-3">
                        Shared Rooms
                      </h5>
                      <ul className="text-white/80 text-sm space-y-2">
                        <li>3rd Mates and Engineers share rooms</li>
                        <li>Typically have a bathroom in the room</li>
                        <li>All other officers share</li>
                      </ul>
                    </div>
                  </div>

                  {/* Photo Placeholders - Officer Rooms */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg aspect-square overflow-hidden">
                      <img
                        src="/images/global/Coming_Soon_Graphic.png"
                        alt="T-EPF Officer Stateroom - Photo Coming Soon"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="rounded-lg aspect-square overflow-hidden">
                      <img
                        src="/images/global/Coming_Soon_Graphic.png"
                        alt="T-EPF Shared Officer Room - Photo Coming Soon"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Unlicensed Berthing */}
              <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                  <span className="text-2xl mr-3">🛌</span>
                  Unlicensed Berthing
                </h3>

                <div className="grid lg:grid-cols-2 gap-6 mb-6">
                  <div>
                    <div className="bg-white/10 rounded-lg p-4">
                      <h5 className="font-medium text-white mb-3">
                        4-Person Berthing
                      </h5>
                      <ul className="text-white/80 text-sm space-y-2">
                        <li>Typically 4 people per berthing space</li>
                        <li>Two sets of bunk beds</li>
                        <li>Very small rooms</li>
                        <li>Only bunk beds, a table, and lockers</li>
                        <li>
                          <strong>No head in room</strong> - shared bathroom
                          down the hall
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Photo Placeholders - Unlicensed Berthing */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg aspect-square overflow-hidden">
                      <img
                        src="/images/global/Coming_Soon_Graphic.png"
                        alt="T-EPF Unlicensed Berthing - Photo Coming Soon"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="rounded-lg aspect-square overflow-hidden">
                      <img
                        src="/images/global/Coming_Soon_Graphic.png"
                        alt="T-EPF Shared Head - Photo Coming Soon"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 312 Area */}
              <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                  <span className="text-2xl mr-3">💺</span>
                  The 312
                </h3>

                <div className="grid lg:grid-cols-2 gap-6">
                  <div>
                    <div className="bg-white/10 rounded-lg p-4">
                      <h5 className="font-medium text-white mb-3">
                        Main Passenger Area
                      </h5>
                      <p className="text-white/80 text-sm mb-3">
                        The &quot;312&quot; is the main area on an EPF. With 312 movie
                        theatre style seats, the room is the seating area for
                        embarked troops during transit operations.
                      </p>
                      <ul className="text-white/70 text-sm space-y-1">
                        <li>312 airline-style seats</li>
                        <li>Used for troop transport</li>
                        <li>Main mission space on the vessel</li>
                      </ul>
                    </div>
                  </div>

                  {/* Photo Placeholder - 312 */}
                  <div className="rounded-lg aspect-video overflow-hidden">
                    <img
                      src="/images/global/Coming_Soon_Graphic.png"
                      alt="T-EPF 312 Seating Area - Photo Coming Soon"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>

              {/* Common Areas */}
              <div className="bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                  <span className="text-2xl mr-3">🍽️</span>
                  Common Areas
                </h3>

                <div className="grid lg:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-4">
                    <div className="bg-white/10 rounded-lg p-4">
                      <h5 className="font-medium text-white mb-3">Mess Deck</h5>
                      <ul className="text-white/80 text-sm space-y-2">
                        <li>Only 1 chow line on the ship</li>
                        <li>One mess deck for everyone</li>
                        <li>All crewmembers eat together</li>
                        <li>Officers and unlicensed share the space</li>
                      </ul>
                    </div>

                    <div className="bg-white/10 rounded-lg p-4">
                      <h5 className="font-medium text-white mb-3">Lounge</h5>
                      <ul className="text-white/80 text-sm space-y-2">
                        <li>One small lounge behind the mess deck</li>
                        <li>Shared by officers and unlicensed crew</li>
                      </ul>
                    </div>

                    <div className="bg-white/10 rounded-lg p-4">
                      <h5 className="font-medium text-white mb-3">Ship Store</h5>
                      <ul className="text-white/80 text-sm space-y-2">
                        <li>Very small—typically just a locker</li>
                        <li>Contents vary by ship and operator</li>
                      </ul>
                    </div>

                    <div className="bg-white/10 rounded-lg p-4">
                      <h5 className="font-medium text-white mb-3">Offices</h5>
                      <ul className="text-white/80 text-sm space-y-2">
                        <li>Many officer rooms double as offices</li>
                        <li>Small Supply Office off the mess deck</li>
                        <li>C4I suite for Communications Dept</li>
                      </ul>
                    </div>
                  </div>

                  {/* Photo Placeholders - Common Areas */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg aspect-square overflow-hidden">
                      <img
                        src="/images/global/Coming_Soon_Graphic.png"
                        alt="T-EPF Mess Deck - Photo Coming Soon"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="rounded-lg aspect-square overflow-hidden">
                      <img
                        src="/images/global/Coming_Soon_Graphic.png"
                        alt="T-EPF Lounge - Photo Coming Soon"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="rounded-lg aspect-square overflow-hidden">
                      <img
                        src="/images/global/Coming_Soon_Graphic.png"
                        alt="T-EPF Bridge - Photo Coming Soon"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="rounded-lg aspect-square overflow-hidden">
                      <img
                        src="/images/global/Coming_Soon_Graphic.png"
                        alt="T-EPF Mission Bay - Photo Coming Soon"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Gym */}
              <div className="bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                  <span className="text-2xl mr-3">🏋️</span>
                  Gym
                </h3>

                <div className="grid lg:grid-cols-2 gap-6">
                  <div>
                    <div className="bg-white/10 rounded-lg p-4">
                      <h5 className="font-medium text-white mb-3">
                        Gym Facilities
                      </h5>
                      <ul className="text-white/80 text-sm space-y-2">
                        <li>Typically located in the mission bay</li>
                        <li>Exact setup varies by ship</li>
                        <li>Some have a Conex box full of equipment</li>
                        <li>
                          More operational ships tend to have better MWR gear
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Photo Placeholder - Gym */}
                  <div className="rounded-lg aspect-video overflow-hidden">
                    <img
                      src="/images/global/Coming_Soon_Graphic.png"
                      alt="T-EPF Mission Bay Gym - Photo Coming Soon"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Ships & Ports Section */}
          {activeSection === 'ships-ports' && (
            <div className="space-y-8">
              <div className="flex items-center mb-8">
                <MapPin className="w-8 h-8 text-teal-400 mr-4" />
                <h2 className="text-3xl font-bold text-white">Ships & Ports</h2>
              </div>

              {/* Fleet Overview */}
              <div className="bg-gradient-to-br from-teal-500/20 to-cyan-500/20 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4">
                  T-EPF Fleet Overview
                </h3>
                <p className="text-white/80 mb-6">
                  T-EPF vessels operate worldwide and visit some exotic ports in
                  addition to the common Navy ports. The fleet consists of 15
                  vessels, with some currently under construction.
                </p>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-white/10 rounded-lg p-4">
                    <h4 className="font-semibold text-white mb-3 flex items-center">
                      <span className="text-xl mr-2">🌊</span>
                      East Coast
                    </h4>
                    <ul className="text-white/70 text-sm space-y-1">
                      <li>7 vessels assigned</li>
                      <li>Based out of Virginia Beach area</li>
                      <li>Deploy to Med, Africa, Middle East</li>
                    </ul>
                  </div>

                  <div className="bg-white/10 rounded-lg p-4">
                    <h4 className="font-semibold text-white mb-3 flex items-center">
                      <span className="text-xl mr-2">🌏</span>
                      West Coast
                    </h4>
                    <ul className="text-white/70 text-sm space-y-1">
                      <li>5 vessels assigned</li>
                      <li>Pacific operations</li>
                      <li>Deploy to Asia, Pacific Islands</li>
                    </ul>
                  </div>

                  <div className="bg-white/10 rounded-lg p-4">
                    <h4 className="font-semibold text-white mb-3 flex items-center">
                      <span className="text-xl mr-2">🏗️</span>
                      Order Book
                    </h4>
                    <ul className="text-white/70 text-sm space-y-1">
                      <li>3 vessels under construction</li>
                      <li>Coast assignment TBD</li>
                      <li>EPF 13, 14, 15</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* East Coast Fleet */}
              <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                  <span className="text-2xl mr-3">🌊</span>
                  East Coast Fleet
                </h3>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  {[
                    { name: 'Spearhead', hull: 'T-EPF 1', status: 'Active' },
                    {
                      name: 'Choctaw County',
                      hull: 'T-EPF 2',
                      status: 'Active',
                    },
                    { name: 'Trenton', hull: 'T-EPF 5', status: 'Active' },
                    { name: 'Carson City', hull: 'T-EPF 7', status: 'Active' },
                    { name: 'Yuma', hull: 'T-EPF 8', status: 'Active' },
                    { name: 'Burlington', hull: 'T-EPF 10', status: 'Active' },
                    { name: 'Newport', hull: 'T-EPF 12', status: 'Active' },
                  ].map((ship) => (
                    <div
                      key={ship.hull}
                      className="bg-white/10 rounded-lg p-4 hover:bg-white/15 transition-colors cursor-pointer group"
                      onClick={() => handleShipClick(ship.name, ship.hull)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-white group-hover:text-teal-300 transition-colors">
                          USNS {ship.name}
                        </span>
                        <span className="text-teal-300 text-xs font-mono">
                          {ship.hull}
                        </span>
                      </div>
                      <div className="text-white/60 text-xs">{ship.status}</div>
                      <div className="mt-2 text-xs text-teal-300 opacity-0 group-hover:opacity-100 transition-opacity">
                        Click for news & photos →
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium text-purple-300 mb-3">
                    Common East Coast Ports
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {[
                      'Virginia Beach, VA',
                      'Mayport, FL',
                      'Orange, TX',
                      'Philadelphia, PA',
                      'Spain',
                      'Greece',
                      'Italy',
                      'Africa',
                      'UAE',
                      'Bahrain',
                      'South America',
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
                  <span className="text-2xl mr-3">🌏</span>
                  West Coast Fleet
                </h3>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  {[
                    { name: 'Millinocket', hull: 'T-EPF 3', status: 'Active' },
                    { name: 'Fall River', hull: 'T-EPF 4', status: 'Active' },
                    { name: 'Brunswick', hull: 'T-EPF 6', status: 'Active' },
                    {
                      name: 'City of Bismarck',
                      hull: 'T-EPF 9',
                      status: 'Active',
                    },
                    { name: 'Puerto Rico', hull: 'T-EPF 11', status: 'Active' },
                  ].map((ship) => (
                    <div
                      key={ship.hull}
                      className="bg-white/10 rounded-lg p-4 hover:bg-white/15 transition-colors cursor-pointer group"
                      onClick={() => handleShipClick(ship.name, ship.hull)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-white group-hover:text-teal-300 transition-colors">
                          USNS {ship.name}
                        </span>
                        <span className="text-teal-300 text-xs font-mono">
                          {ship.hull}
                        </span>
                      </div>
                      <div className="text-white/60 text-xs">{ship.status}</div>
                      <div className="mt-2 text-xs text-teal-300 opacity-0 group-hover:opacity-100 transition-opacity">
                        Click for news & photos →
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium text-cyan-300 mb-3">
                    Common West Coast Ports
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {[
                      'Hawaii',
                      'Guam',
                      'Japan',
                      'Korea',
                      'Singapore',
                      'Malaysia',
                      'Philippines',
                      'Thailand',
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

              {/* Order Book */}
              <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                  <span className="text-2xl mr-3">🏗️</span>
                  Order Book (Under Construction)
                </h3>

                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  {[
                    {
                      name: 'Apalachicola',
                      hull: 'T-EPF 13',
                      status: 'Building',
                    },
                    { name: 'Cody', hull: 'T-EPF 14', status: 'Building' },
                    { name: 'Point Loma', hull: 'T-EPF 15', status: 'Building' },
                  ].map((ship) => (
                    <div
                      key={ship.hull}
                      className="bg-white/10 rounded-lg p-4 border border-yellow-400/30"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-white">
                          USNS {ship.name}
                        </span>
                        <span className="text-yellow-300 text-xs font-mono">
                          {ship.hull}
                        </span>
                      </div>
                      <div className="text-yellow-300 text-xs">
                        {ship.status}
                      </div>
                      <div className="mt-2 px-2 py-1 bg-yellow-500/20 rounded text-xs text-yellow-300 inline-block">
                        Coast TBD
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 bg-yellow-500/20 rounded-lg border border-yellow-400/30">
                  <p className="text-yellow-300 text-sm">
                    <strong>Note:</strong> These vessels are currently under
                    construction by Austal. Coast assignment will be determined
                    upon delivery to MSC.
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
                      15
                    </div>
                    <div className="text-white/70 text-sm">Total Vessels</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-green-400 mb-2">
                      12
                    </div>
                    <div className="text-white/70 text-sm">Active Ships</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-green-400 mb-2">
                      3
                    </div>
                    <div className="text-white/70 text-sm">Under Construction</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-green-400 mb-2">
                      35
                    </div>
                    <div className="text-white/70 text-sm">Knots Top Speed</div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-teal-500/20 rounded-lg border border-teal-400/30">
                  <p className="text-teal-300 text-sm">
                    <strong>Worldwide Operations:</strong> EPFs operate globally
                    and visit exotic ports in addition to common Navy ports.
                    Port assignments vary based on current missions and tasking.
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
