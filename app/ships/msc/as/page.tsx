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

export default function ASShipPage() {
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
      value: 'MSC: 157 / Navy: 300-700',
    },
    {
      icon: <DollarSign className="w-5 h-5" />,
      label: 'Pay Category',
      value: 'High',
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      label: 'Deployment',
      value: 'Homeported (Guam)',
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
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
            <span className="text-white">AS</span>
          </div>

          {/* Hero Content */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center bg-blue-500/20 text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Ship className="w-4 h-4 mr-2" />
                Submarine Tender
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6">
                AS
                <span className="block text-2xl lg:text-3xl font-normal text-blue-300 mt-2">
                  Submarine Tender
                </span>
              </h1>
              <p className="text-xl text-white/80 leading-relaxed mb-8">
                Hybrid MSC/Navy vessels designed to repair, re-arm, and resupply
                the U.S. Navy&apos;s submarine fleet. Homeported in Guam, these
                floating repair shops are popular for their in-port lifestyle
                and high pay.
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
                  The T-AS class vessels are submarine tenders designed to
                  repair, re-arm, and resupply the U.S. Navy&apos;s submarine fleet.
                  Military Sealift Command (MSC) operates the two remaining
                  sub-tenders using a hybrid model, with both vessels homeported
                  in Guam, where they spend most of their time.
                </p>

                <p className="text-lg text-white/80 leading-relaxed mb-8">
                  Similar to the T-AH, LCC, and ESB ships, MSC CIVMARs are
                  responsible for the physical maintenance of the ship, while
                  Navy sailors handle many of the mission-specific tasks. MSC
                  assumed control of the Emory S. Land in 2008 and the Frank
                  Cable in 2010.
                </p>

                <div className="grid lg:grid-cols-2 gap-8 mt-8">
                  {/* Homesteading Culture */}
                  <div className="bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-xl p-6 border border-white/10">
                    <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                      <span className="text-2xl mr-3">🏠</span>
                      Homesteading Culture
                    </h3>
                    <div className="space-y-4">
                      <div className="bg-white/10 rounded-lg p-4">
                        <h4 className="font-medium text-blue-300 mb-2">
                          Extended Rotations
                        </h4>
                        <p className="text-white/80 text-sm">
                          These vessels are known for &quot;homesteading&quot; due to
                          their homeported status. CIVMARs often extend their
                          rotations, remaining with the vessel for years.
                        </p>
                      </div>
                      <div className="bg-white/10 rounded-lg p-4">
                        <h4 className="font-medium text-blue-300 mb-2">
                          Competitive Assignments
                        </h4>
                        <p className="text-white/80 text-sm">
                          Extended rotations can make it challenging to secure
                          an assignment, depending on your rate.
                        </p>
                      </div>
                      <div className="bg-white/10 rounded-lg p-4">
                        <h4 className="font-medium text-blue-300 mb-2">
                          Guam Residents
                        </h4>
                        <p className="text-white/80 text-sm">
                          Many CIVMARs, particularly those living in Guam,
                          choose to stay on these vessels for extended periods.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Security & Future */}
                  <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl p-6 border border-white/10">
                    <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                      <span className="text-2xl mr-3">🔒</span>
                      Security & Future
                    </h3>
                    <div className="space-y-4">
                      <div className="bg-white/10 rounded-lg p-4">
                        <h4 className="font-medium text-purple-300 mb-2">
                          Heightened Security
                        </h4>
                        <p className="text-white/80 text-sm">
                          Sub-tenders may have heightened security measures
                          because of their close affiliation with submarines.
                          The Navy is understandably secretive about its
                          submarine fleet.
                        </p>
                      </div>
                      <div className="bg-white/10 rounded-lg p-4">
                        <h4 className="font-medium text-purple-300 mb-2">
                          Aging Fleet
                        </h4>
                        <p className="text-white/80 text-sm">
                          Both ships are aging, and although their service life
                          is nearing its end, the exact retirement dates are not
                          yet known.
                        </p>
                      </div>
                      <div className="bg-white/10 rounded-lg p-4">
                        <h4 className="font-medium text-purple-300 mb-2">
                          Next Generation
                        </h4>
                        <p className="text-white/80 text-sm">
                          The Navy has begun procuring the next generation of
                          submarine tenders, with delivery anticipated sometime
                          in the 2030s.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Ship Characteristics */}
                <div className="bg-gradient-to-br from-teal-500/20 to-cyan-500/20 rounded-xl p-6 border border-white/10 mt-8">
                  <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                    <span className="text-2xl mr-3">⚠️</span>
                    Ship Characteristics
                  </h3>

                  <p className="text-white/80 mb-6">
                    The AS vessels are old, hybrid ships. As a result, their
                    layout can be confusing, and it may take some extra time to
                    learn the layout of the ship.
                  </p>

                  <div className="grid md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white/10 rounded-lg p-4">
                      <h4 className="font-medium text-white mb-2">
                        No Elevators
                      </h4>
                      <p className="text-white/70 text-sm">
                        These ships do not have personnel elevators, and the
                        ladders/stairwells are very steep
                      </p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4">
                      <h4 className="font-medium text-white mb-2">
                        Confusing Layout
                      </h4>
                      <p className="text-white/70 text-sm">
                        Old hybrid design means the layout can be confusing for
                        new crew
                      </p>
                    </div>
                    <div className="bg-green-500/20 rounded-lg p-4 border border-green-400/30">
                      <h4 className="font-medium text-green-300 mb-2">
                        WiFi Available
                      </h4>
                      <p className="text-green-200 text-sm">
                        Unlike every other ship in the fleet, these ships DO
                        have WiFi
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
                          <span className="text-white">644 feet</span>
                        </div>
                        <div className="flex justify-between border-b border-white/10 pb-1">
                          <span className="text-white/70">Beam</span>
                          <span className="text-white">85 feet</span>
                        </div>
                        <div className="flex justify-between border-b border-white/10 pb-1">
                          <span className="text-white/70">Draft</span>
                          <span className="text-white">26 feet</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/70">Displacement</span>
                          <span className="text-white">23,000 tons</span>
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
                          <span className="text-white">Steam Turbines</span>
                        </div>
                        <div className="flex justify-between border-b border-white/10 pb-1">
                          <span className="text-white/70">Boilers</span>
                          <span className="text-white">2</span>
                        </div>
                        <div className="flex justify-between border-b border-white/10 pb-1">
                          <span className="text-white/70">Horsepower</span>
                          <span className="text-white">20,000 HP</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/70">Top Speed</span>
                          <span className="text-white">20 knots</span>
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
                        157
                      </div>
                      <div className="text-white/70 text-sm">MSC Personnel</div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4 text-center">
                      <div className="text-3xl font-bold text-orange-400 mb-2">
                        300-700
                      </div>
                      <div className="text-white/70 text-sm">
                        Navy Personnel (listed as 292, can exceed 700)
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-orange-500/20 rounded-lg border border-orange-400/30">
                    <p className="text-orange-300 text-sm">
                      <strong>Hybrid Model:</strong> MSC CIVMARs handle physical
                      maintenance of the ship, while Navy sailors handle
                      mission-specific tasks related to submarine support.
                    </p>
                  </div>
                </div>

                {/* Why Popular */}
                <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl p-6 border border-white/10 mt-8">
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                    <span className="text-2xl mr-3">⭐</span>
                    Why Sub-Tenders Are Popular
                  </h3>

                  <p className="text-white/80 mb-6">
                    Overall, these ships are popular among CIVMARs because they
                    are almost always in port and offer good pay.
                  </p>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-white/10 rounded-lg p-4 text-center">
                      <div className="text-2xl mb-2">🏖️</div>
                      <h4 className="font-medium text-white mb-2">
                        Almost Always In Port
                      </h4>
                      <p className="text-white/70 text-sm">
                        Submarines come to you—minimal time at sea
                      </p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4 text-center">
                      <div className="text-2xl mb-2">💰</div>
                      <h4 className="font-medium text-white mb-2">Good Pay</h4>
                      <p className="text-white/70 text-sm">
                        High-paying hybrid ship with overtime opportunities
                      </p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4 text-center">
                      <div className="text-2xl mb-2">🌴</div>
                      <h4 className="font-medium text-white mb-2">
                        Guam Lifestyle
                      </h4>
                      <p className="text-white/70 text-sm">
                        Tropical location with base amenities access
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
                <DollarSign className="w-8 h-8 text-blue-400 mr-4" />
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
                    The T-AS class vessels have a typical operational cycle that
                    consists of time in their homeport, deployed, and in a
                    shipyard. Since there are only 2 sub-tenders, the vessels
                    will balance their schedules to ensure that one is always
                    operational and able to re-supply the currently operational
                    submarines.
                  </p>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-white/10 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-blue-400 mb-2">
                        Homeport
                      </div>
                      <p className="text-white/70 text-sm">
                        Primary location in Guam
                      </p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-blue-400 mb-2">
                        Deployed
                      </div>
                      <p className="text-white/70 text-sm">
                        Infrequent deployments to other ports
                      </p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-blue-400 mb-2">
                        Shipyard
                      </div>
                      <p className="text-white/70 text-sm">
                        Maintenance and repair periods
                      </p>
                    </div>
                  </div>
                </div>

                {/* Port to Sea Time Ratio */}
                <div className="bg-gradient-to-br from-teal-500/20 to-cyan-500/20 rounded-xl p-6 border border-white/10">
                  <h3 className="text-xl font-semibold text-white mb-4">
                    Port to Sea Time Ratio
                  </h3>
                  <p className="text-white/80 mb-6">
                    Unlike other resupply ships in the MSC fleet, the
                    sub-tenders are designed to re-supply submarines in port.
                    Unlike surface ships, the main advantage of a submarine is
                    their stealth. It would defeat the purpose of having a
                    submarine if they had to pop-up in the middle of the ocean
                    to be re-supplied since they would then be detected.
                  </p>

                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-white/10 rounded-lg p-4">
                      <h4 className="font-semibold text-teal-300 mb-3">
                        How It Works
                      </h4>
                      <ul className="text-white/80 text-sm space-y-2">
                        <li>
                          Sub-tenders homeport in Guam (or other ports while
                          deployed)
                        </li>
                        <li>Submarines come to them to be serviced</li>
                        <li>
                          Specialized cranes and equipment for submarine needs
                        </li>
                        <li>Repairs, re-arming, and resupply done pier side</li>
                      </ul>
                    </div>

                    <div className="bg-white/10 rounded-lg p-4">
                      <h4 className="font-semibold text-teal-300 mb-3">
                        Deployment Pattern
                      </h4>
                      <ul className="text-white/80 text-sm space-y-2">
                        <li>Do not deploy often</li>
                        <li>When deployed, visit interesting/unique ports</li>
                        <li>Sit in port to fulfill mission</li>
                        <li>In Guam most of the time</li>
                      </ul>
                    </div>
                  </div>

                  <div className="p-4 bg-teal-500/20 rounded-lg border border-teal-400/30">
                    <p className="text-teal-300 text-sm">
                      <strong>Key Difference:</strong> Unlike CLF ships that go
                      to the customer, sub-tenders have the customer (submarines)
                      come to them to maintain submarine stealth.
                    </p>
                  </div>
                </div>

                {/* Money Situation */}
                <div className="bg-gradient-to-br from-green-500/20 to-teal-500/20 rounded-xl p-6 border border-white/10">
                  <h3 className="text-xl font-semibold text-white mb-4">
                    Money Situation
                  </h3>
                  <p className="text-white/80 mb-6">
                    Like the other hybrid ships, the sub-tenders are considered
                    high paying ships. Historically, overtime hours have been
                    generous and there are other available incentive/premium
                    pays.
                  </p>

                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-3">
                      <div className="bg-white/10 rounded-lg p-4 border border-green-400/30">
                        <h4 className="font-medium text-green-300 mb-2">
                          High Pay Category
                        </h4>
                        <p className="text-white/70 text-sm">
                          Hybrid ship status means high base pay
                        </p>
                      </div>
                      <div className="bg-white/10 rounded-lg p-4 border border-green-400/30">
                        <h4 className="font-medium text-green-300 mb-2">
                          Generous Overtime
                        </h4>
                        <p className="text-white/70 text-sm">
                          Historically, overtime hours have been generous
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="bg-white/10 rounded-lg p-4 border border-green-400/30">
                        <h4 className="font-medium text-green-300 mb-2">
                          Premium Pays
                        </h4>
                        <p className="text-white/70 text-sm">
                          Other available incentive and premium pay codes
                        </p>
                      </div>
                      <div className="bg-white/10 rounded-lg p-4 border border-green-400/30">
                        <h4 className="font-medium text-green-300 mb-2">
                          Habitability Pay
                        </h4>
                        <p className="text-white/70 text-sm">
                          Officers receive habitability pay for shared heads
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-yellow-500/20 rounded-lg border border-yellow-400/30">
                    <p className="text-yellow-300 text-sm">
                      <strong>Note:</strong> Your actual pay will depend on the
                      ship&apos;s operational schedule, budget, Captain, and your
                      department head.
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
                          <li>Ships are in port a lot</li>
                          <li>
                            <strong>Limited underway experience</strong>
                          </li>
                          <li>Minimal ship handling opportunities</li>
                          <li>Consider if you need sea days for license</li>
                        </ul>
                      </div>

                      <div className="bg-white/10 rounded-lg p-4">
                        <h5 className="font-medium text-white mb-3">
                          Deck Day Workers
                        </h5>
                        <ul className="text-white/70 text-sm space-y-2">
                          <li>Typical maintenance and preservation tasks</li>
                          <li>Lots of trash offloads</li>
                          <li>Operating cranes</li>
                        </ul>
                      </div>
                    </div>

                    <div className="mt-4 p-3 bg-yellow-500/20 rounded-lg border border-yellow-400/30">
                      <p className="text-yellow-300 text-sm">
                        <strong>License Note:</strong> If you need sea days to
                        advance your license, keep in mind these ships are in
                        port most of the time.
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
                          <li>Ships are in port a lot</li>
                          <li>Limited underway experience</li>
                          <li>
                            <strong>Steam ships:</strong> One of few remaining
                            in fleet
                          </li>
                          <li>Consider for license advancement</li>
                          <li>Ships are old—expect lots of maintenance</li>
                        </ul>
                      </div>

                      <div className="bg-white/10 rounded-lg p-4">
                        <h5 className="font-medium text-white mb-3">
                          Engine Unlicensed
                        </h5>
                        <ul className="text-white/70 text-sm space-y-2">
                          <li>Typical maintenance tasks</li>
                          <li>Ships are old and need preservation work</li>
                          <li>Expect typical maintenance and repairs</li>
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

                    <div className="bg-white/10 rounded-lg p-4">
                      <h5 className="font-medium text-white mb-3">
                        Department Structure
                      </h5>
                      <ul className="text-white/70 text-sm space-y-2">
                        <li>
                          <strong>No CLF/cargo office</strong>—only end-use/admin
                        </li>
                        <li>
                          Navy Supply Department handles much of onboard supply
                          operations
                        </li>
                        <li>
                          <strong>Coordination is key</strong> between MSC and
                          Navy Supply
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
                        Communications department information coming soon. If
                        you have experience on the Land or the Cable and have
                        communications tips to share, please contribute!
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
                  Life on a Submarine Tender
                </h3>
                <p className="text-white/80 mb-6">
                  The AS vessels are old, hybrid ships. As a result, their
                  layout can be confusing, and it may take some extra time to
                  learn the layout of the ship. Additionally, these ships do not
                  have personnel elevators, and the ladders/stairwells are very
                  steep.
                </p>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-white/10 rounded-lg p-4">
                    <h4 className="font-medium text-white mb-2">Old Ships</h4>
                    <p className="text-white/70 text-sm">
                      Confusing layout typical of older hybrid vessels
                    </p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4">
                    <h4 className="font-medium text-white mb-2">
                      Steep Ladders
                    </h4>
                    <p className="text-white/70 text-sm">
                      No personnel elevators—be prepared for steep stairwells
                    </p>
                  </div>
                  <div className="bg-green-500/20 rounded-lg p-4 border border-green-400/30">
                    <h4 className="font-medium text-green-300 mb-2">
                      WiFi Available!
                    </h4>
                    <p className="text-green-200 text-sm">
                      Unlike every other ship in the fleet, these ships have
                      WiFi
                    </p>
                  </div>
                </div>
              </div>

              {/* Officer Berthing */}
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
                        <li>Officers have their own rooms</li>
                        <li>
                          <strong>Shared bathroom</strong> down the hall
                        </li>
                        <li>Receive habitability pay for shared head</li>
                      </ul>
                    </div>

                    <div className="bg-white/10 rounded-lg p-4">
                      <h5 className="font-medium text-white mb-3">
                        Department Heads
                      </h5>
                      <ul className="text-white/80 text-sm space-y-2">
                        <li>Only department heads have private head</li>
                        <li>Own room with own bathroom</li>
                      </ul>
                    </div>
                  </div>

                  {/* Photo Placeholders - Officer Rooms */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg aspect-square overflow-hidden">
                      <img
                        src="/images/global/Coming_Soon_Graphic.png"
                        alt="AS Officer Room - Photo Coming Soon"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="rounded-lg aspect-square overflow-hidden">
                      <img
                        src="/images/global/Coming_Soon_Graphic.png"
                        alt="AS Shared Head - Photo Coming Soon"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* CPO Berthing */}
              <div className="bg-gradient-to-br from-teal-500/20 to-cyan-500/20 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                  <span className="text-2xl mr-3">🛌</span>
                  MSC CPO Accommodations
                </h3>

                <div className="grid lg:grid-cols-2 gap-6">
                  <div>
                    <div className="bg-white/10 rounded-lg p-4">
                      <h5 className="font-medium text-white mb-3">CPO Rooms</h5>
                      <ul className="text-white/80 text-sm space-y-2">
                        <li>Typically have small rooms</li>
                        <li>Shared bathroom</li>
                      </ul>
                    </div>
                  </div>

                  {/* Photo Placeholder - CPO Rooms */}
                  <div className="rounded-lg aspect-video overflow-hidden">
                    <img
                      src="/images/global/Coming_Soon_Graphic.png"
                      alt="AS CPO Room - Photo Coming Soon"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>

              {/* Unlicensed Berthing */}
              <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                  <span className="text-2xl mr-3">🛏️</span>
                  MSC Unlicensed Berthing
                </h3>

                <div className="grid lg:grid-cols-2 gap-6">
                  <div>
                    <div className="bg-white/10 rounded-lg p-4">
                      <h5 className="font-medium text-white mb-3">
                        Open Berthing
                      </h5>
                      <ul className="text-white/80 text-sm space-y-2">
                        <li>
                          <strong>Open berthing</strong> on the Cable and Land
                        </li>
                        <li>Most unlicensed crew in berthing areas</li>
                        <li>30-50 racks per berthing area</li>
                      </ul>
                    </div>
                  </div>

                  {/* Photo Placeholder - Unlicensed Berthing */}
                  <div className="rounded-lg aspect-video overflow-hidden">
                    <img
                      src="/images/global/Coming_Soon_Graphic.png"
                      alt="AS Open Berthing - Photo Coming Soon"
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
                        Best Gyms in the Fleet
                      </h5>
                      <ul className="text-white/80 text-sm space-y-2">
                        <li>
                          <strong>Some of the best gyms in the fleet</strong>
                        </li>
                        <li>Very large</li>
                        <li>Lots of equipment</li>
                        <li>
                          Typically in port—no worrying about ship movement
                        </li>
                      </ul>
                    </div>

                    <div className="p-4 bg-green-500/20 rounded-lg border border-green-400/30">
                      <p className="text-green-300 text-sm">
                        <strong>Pro Tip:</strong> The gyms on AS vessels are
                        consistently rated among the best in the MSC fleet.
                        Stable platform + great equipment = excellent workouts.
                      </p>
                    </div>
                  </div>

                  {/* Photo Placeholder - Gym */}
                  <div className="rounded-lg aspect-video overflow-hidden">
                    <img
                      src="/images/global/Coming_Soon_Graphic.png"
                      alt="AS Gym - Photo Coming Soon"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>

              {/* Base Amenities */}
              <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                  <span className="text-2xl mr-3">🏝️</span>
                  Base Amenities
                </h3>

                <p className="text-white/80 mb-6">
                  Since the Frank Cable and the Emory S. Land are almost always
                  in port, you&apos;ll have greater access to base amenities than any
                  other deployed ship.
                </p>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="bg-white/10 rounded-lg p-4 text-center">
                    <div className="text-2xl mb-2">🛒</div>
                    <h4 className="font-medium text-white mb-1">Large NEX</h4>
                    <p className="text-white/70 text-xs">
                      Need snacks or room supplies? Visit the NEX.
                    </p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4 text-center">
                    <div className="text-2xl mb-2">🥫</div>
                    <h4 className="font-medium text-white mb-1">Commissary</h4>
                    <p className="text-white/70 text-xs">
                      Don&apos;t like ship food? Head to the commissary.
                    </p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4 text-center">
                    <div className="text-2xl mb-2">🏋️</div>
                    <h4 className="font-medium text-white mb-1">Base Gym</h4>
                    <p className="text-white/70 text-xs">
                      Ship&apos;s gym crowded? Use the gym on base.
                    </p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4 text-center">
                    <div className="text-2xl mb-2">🏪</div>
                    <h4 className="font-medium text-white mb-1">
                      Other Services
                    </h4>
                    <p className="text-white/70 text-xs">
                      Typical base services available
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-yellow-500/20 rounded-lg border border-yellow-400/30">
                  <p className="text-yellow-300 text-sm">
                    <strong>In-Port Advantage:</strong> Being in port certainly
                    has its advantages. You have access to all Guam base
                    facilities that other deployed CIVMARs don&apos;t have.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Ships & Ports Section */}
          {activeSection === 'ships-ports' && (
            <div className="space-y-8">
              <div className="flex items-center mb-8">
                <MapPin className="w-8 h-8 text-blue-400 mr-4" />
                <h2 className="text-3xl font-bold text-white">Ships & Ports</h2>
              </div>

              {/* Fleet Overview */}
              <div className="bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4">
                  AS Submarine Tender Fleet
                </h3>
                <p className="text-white/80 mb-6">
                  There are only 2 T-AS class vessels in operation. Both are
                  homeported in Guam and designated as West Coast vessels. These
                  are commissioned Navy ships (USS) operated by MSC with hybrid
                  crews.
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white/10 rounded-lg p-4">
                    <h4 className="font-semibold text-white mb-3 flex items-center">
                      <span className="text-xl mr-2">🔱</span>
                      Fleet Characteristics
                    </h4>
                    <ul className="text-white/70 text-sm space-y-1">
                      <li>2 vessels total in the AS class</li>
                      <li>Both homeported in Guam</li>
                      <li>Designated West Coast vessels</li>
                      <li>USS (commissioned Navy) designation</li>
                    </ul>
                  </div>

                  <div className="bg-white/10 rounded-lg p-4">
                    <h4 className="font-semibold text-white mb-3 flex items-center">
                      <span className="text-xl mr-2">🎯</span>
                      Mission
                    </h4>
                    <ul className="text-white/70 text-sm space-y-1">
                      <li>Repair submarines</li>
                      <li>Re-arm submarines</li>
                      <li>Resupply submarine fleet</li>
                      <li>Support submarine operations in Pacific</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Individual Ships */}
              <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                  <span className="text-2xl mr-3">🌏</span>
                  West Coast Fleet (Guam)
                </h3>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  {/* USS Emory S. Land */}
                  <div
                    className="bg-white/10 rounded-lg p-4 hover:bg-white/15 transition-colors cursor-pointer group"
                    onClick={() =>
                      handleShipClick('Emory S. Land', 'AS-39')
                    }
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-white group-hover:text-blue-300 transition-colors">
                        USS Emory S. Land
                      </span>
                      <span className="text-blue-300 text-xs font-mono">
                        AS-39
                      </span>
                    </div>
                    <div className="text-white/60 text-xs mb-2">Active</div>
                    <ul className="text-white/70 text-sm space-y-1 mt-3">
                      <li>
                        <strong>Homeport:</strong> Guam
                      </li>
                      <li>
                        <strong>MSC Control:</strong> 2008
                      </li>
                      <li>
                        <strong>Class:</strong> Emory S. Land-class
                      </li>
                    </ul>
                    <div className="mt-3 text-xs text-blue-300 opacity-0 group-hover:opacity-100 transition-opacity">
                      Click for news & photos →
                    </div>
                  </div>

                  {/* USS Frank Cable */}
                  <div
                    className="bg-white/10 rounded-lg p-4 hover:bg-white/15 transition-colors cursor-pointer group"
                    onClick={() => handleShipClick('Frank Cable', 'AS-40')}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-white group-hover:text-blue-300 transition-colors">
                        USS Frank Cable
                      </span>
                      <span className="text-blue-300 text-xs font-mono">
                        AS-40
                      </span>
                    </div>
                    <div className="text-white/60 text-xs mb-2">Active</div>
                    <ul className="text-white/70 text-sm space-y-1 mt-3">
                      <li>
                        <strong>Homeport:</strong> Guam
                      </li>
                      <li>
                        <strong>MSC Control:</strong> 2010
                      </li>
                      <li>
                        <strong>Class:</strong> Emory S. Land-class
                      </li>
                    </ul>
                    <div className="mt-3 text-xs text-blue-300 opacity-0 group-hover:opacity-100 transition-opacity">
                      Click for news & photos →
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium text-purple-300 mb-3">
                    Common West Coast Ports
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {[
                      'Guam',
                      'Australia',
                      'Vietnam',
                      'Philippines',
                      'Singapore',
                      'Hawaii',
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
                      644
                    </div>
                    <div className="text-white/70 text-sm">Feet in Length</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-green-400 mb-2">
                      157
                    </div>
                    <div className="text-white/70 text-sm">MSC Crew</div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-teal-500/20 rounded-lg border border-teal-400/30">
                  <p className="text-teal-300 text-sm">
                    <strong>Homesteading:</strong> These vessels are known for
                    extended crew rotations. CIVMARs often stay for years,
                    making new assignments competitive depending on rate.
                  </p>
                </div>
              </div>

              {/* Future of Fleet */}
              <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <span className="text-2xl mr-3">🔮</span>
                  Future of the Fleet
                </h3>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white/10 rounded-lg p-4">
                    <h4 className="font-medium text-yellow-300 mb-2">
                      Aging Ships
                    </h4>
                    <p className="text-white/80 text-sm">
                      Both ships are aging, and their service life is nearing
                      its end. Exact retirement dates are not yet known.
                    </p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4">
                    <h4 className="font-medium text-yellow-300 mb-2">
                      Next Generation
                    </h4>
                    <p className="text-white/80 text-sm">
                      The Navy has begun procuring the next generation of
                      submarine tenders, with delivery anticipated sometime in
                      the 2030s.
                    </p>
                  </div>
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
