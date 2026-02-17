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
  Anchor,
  Package,
  Zap,
  AlertCircle,
  Fuel,
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

export default function TAOEPage() {
  const [activeSection, setActiveSection] = useState('overview');

  // DVIDS popup state management
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
      value: 'MSC: 100-160 / Navy: 50-70',
    },
    {
      icon: <DollarSign className="w-5 h-5" />,
      label: 'Pay Category',
      value: 'High',
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      label: 'Top Speed',
      value: '25+ knots',
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-950 to-gray-900">
      {/* DVIDS Popup - placed at the top level */}
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
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-orange-600/20" />
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
            <span className="text-white">T-AOE</span>
          </div>

          {/* Hero Content */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Content */}
            <div>
              <div className="inline-flex items-center bg-red-500/20 text-red-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Ship className="w-4 h-4 mr-2" />
                Fast Combat Support Ship
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6">
                T-AOE
                <span className="block text-2xl lg:text-3xl font-normal text-red-300 mt-2">
                  Fast Combat Support Ship
                </span>
              </h1>
              <p className="text-xl text-white/80 leading-relaxed mb-8">
                The workhorses of the Combat Logistics Force—high-tempo,
                high-pay platforms keeping carrier strike groups fueled and
                supplied worldwide. Only two remain in active service.
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

            {/* Right Column - Navigation Menu */}
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

      {/* Content Sections Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white/5 backdrop-blur-lg border border-white/20 rounded-2xl p-8 lg:p-12">
          {/* Overview Section */}
          {activeSection === 'overview' && (
            <div className="space-y-8">
              <div className="flex items-center mb-8">
                <Ship className="w-8 h-8 text-red-400 mr-4" />
                <h2 className="text-3xl font-bold text-white">Ship Overview</h2>
              </div>

              {/* Age Warning Callout */}
              <div className="bg-amber-500/20 border border-amber-400/30 rounded-xl p-6">
                <div className="flex items-start">
                  <AlertCircle className="w-6 h-6 text-amber-300 mr-3 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-amber-200 mb-2">
                      Only Two Ships Remain
                    </h3>
                    <p className="text-amber-100/90">
                      Despite their age, MSC T-AOE vessels remain workhorses.
                      Originally owned and operated by the Navy, these ships
                      came under MSC control in the early 2000s. Today, only two
                      operational AOEs are left in the fleet: the USNS Supply
                      (T-AOE 6) and the USNS Arctic (T-AOE 8). Both ships were
                      launched in the 1990s and show signs of wear and tear.
                    </p>
                  </div>
                </div>
              </div>

              {/* What Makes T-AOEs Unique */}
              <div className="bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <Zap className="w-6 h-6 text-red-300 mr-2" />
                  What Makes T-AOEs Unique
                </h3>
                <div className="space-y-4 text-white/80">
                  <p>
                    Designated as{' '}
                    <strong className="text-white">
                      fast combat support ships
                    </strong>
                    , T-AOEs can keep pace with aircraft carriers and support an
                    entire strike group. They combine the cargo capacity of
                    T-AKEs and the fuel capacity of T-AOs, making them capable
                    of resupplying an entire strike group on their own.
                  </p>
                  <p>
                    While they don't carry as much cargo as T-AKEs, they hold
                    more fuel than T-AOs and are significantly faster than both.
                    Aircraft carriers favor deploying with these vessels for
                    their efficiency in delivering stores and fuel while
                    maintaining a fast pace.
                  </p>
                  <div className="bg-white/10 rounded-lg p-4 mt-4">
                    <p className="text-sm text-white/90">
                      <strong>Why aren't more being built?</strong> Cost. T-AOEs
                      are powered by gas turbine engines, and it takes a lot of
                      fuel to propel a 750+ foot ship at over 25 knots.
                    </p>
                  </div>
                  <p className="mt-4">
                    If you are assigned to an AOE on deployment,{' '}
                    <strong className="text-white">expect to be busy</strong>.
                    These ships are worked hard but offer a great platform to
                    gain extensive UNREP experience quickly. It's a unique
                    opportunity—with only two operational AOEs, you'll gain
                    valuable experience and good pay, though it comes with hard
                    work.
                  </p>
                  <p className="italic text-white/70 text-sm mt-4">
                    Some crew members have been stationed on these ships for
                    years, developing a strong attachment reminiscent of the old
                    Navy specs. This almost cult-like attraction among veterans
                    can be comforting for those who remember the USNS Bridge,
                    the USNS Rainer, and the older AFS ammo ships.
                  </p>
                </div>
              </div>

              {/* Technical Specifications */}
              <div className="bg-gradient-to-br from-slate-600/20 to-gray-600/20 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                  <Anchor className="w-6 h-6 text-slate-300 mr-2" />
                  Technical Characteristics
                </h3>

                <div className="grid lg:grid-cols-2 gap-6">
                  {/* Hull Specs */}
                  <div>
                    <h4 className="font-semibold text-white mb-3 text-lg">
                      Hull
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between bg-white/5 rounded p-3">
                        <span className="text-white/70">Length</span>
                        <span className="text-white font-medium">754 feet</span>
                      </div>
                      <div className="flex justify-between bg-white/5 rounded p-3">
                        <span className="text-white/70">Beam</span>
                        <span className="text-white font-medium">107 feet</span>
                      </div>
                      <div className="flex justify-between bg-white/5 rounded p-3">
                        <span className="text-white/70">Displacement</span>
                        <span className="text-white font-medium">
                          48,800 tons
                        </span>
                      </div>
                      <div className="flex justify-between bg-white/5 rounded p-3">
                        <span className="text-white/70">Top Speed</span>
                        <span className="text-white font-medium">
                          25+ knots
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Propulsion */}
                  <div>
                    <h4 className="font-semibold text-white mb-3 text-lg">
                      Propulsion
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between bg-white/5 rounded p-3">
                        <span className="text-white/70">Engines</span>
                        <span className="text-white font-medium">
                          4× GE LM2500
                        </span>
                      </div>
                      <div className="flex justify-between bg-white/5 rounded p-3">
                        <span className="text-white/70">Type</span>
                        <span className="text-white font-medium">
                          Gas turbines
                        </span>
                      </div>
                      <div className="flex justify-between bg-white/5 rounded p-3">
                        <span className="text-white/70">Shafts</span>
                        <span className="text-white font-medium">2</span>
                      </div>
                      <div className="flex justify-between bg-white/5 rounded p-3">
                        <span className="text-white/70">Horsepower</span>
                        <span className="text-white font-medium">
                          105,000 HP
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Flight Deck */}
                <div className="mt-6 pt-6 border-t border-white/10">
                  <h4 className="font-semibold text-white mb-3 text-lg">
                    Flight Deck
                  </h4>
                  <p className="text-white/80">
                    Typically deploys with{' '}
                    <strong className="text-white">
                      2 VERTREP-capable MH-60 helicopters
                    </strong>
                  </p>
                </div>
              </div>

              {/* Cargo Capacity */}
              <div className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                  <Package className="w-6 h-6 text-blue-300 mr-2" />
                  Operational Characteristics
                </h3>

                <div className="grid lg:grid-cols-2 gap-6">
                  {/* Dry Cargo */}
                  <div>
                    <h4 className="font-semibold text-white mb-3">
                      Dry Stores
                    </h4>
                    <div className="space-y-2 text-white/80 text-sm">
                      <div className="flex justify-between bg-white/5 rounded p-3">
                        <span>Dry Cargo</span>
                        <span className="text-white font-medium">250 tons</span>
                      </div>
                      <div className="flex justify-between bg-white/5 rounded p-3">
                        <span>Ammunition</span>
                        <span className="text-white font-medium">
                          1,800 long tons
                        </span>
                      </div>
                      <div className="flex justify-between bg-white/5 rounded p-3">
                        <span>Refrigerated/Frozen Cargo</span>
                        <span className="text-white font-medium">
                          400 long tons
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Fuel Capacity */}
                  <div>
                    <h4 className="font-semibold text-white mb-3">
                      Fuel Capacity
                    </h4>
                    <div className="space-y-2 text-white/80 text-sm">
                      <div className="flex justify-between bg-white/5 rounded p-3">
                        <span>Cargo Diesel Fuel</span>
                        <span className="text-white font-medium">
                          ~4 million gal.
                        </span>
                      </div>
                      <div className="flex justify-between bg-white/5 rounded p-3">
                        <span>Cargo Jet Fuel</span>
                        <span className="text-white font-medium">
                          ~2.6 million gal.
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* UNREP Stations */}
                <div className="mt-6 pt-6 border-t border-white/10">
                  <h4 className="font-semibold text-white mb-3">
                    UNREP Stations
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 rounded-lg p-4">
                      <div className="text-2xl font-bold text-white mb-1">
                        6+
                      </div>
                      <div className="text-sm text-white/70">
                        Cargo Stations (plus flight deck)
                      </div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4">
                      <div className="text-2xl font-bold text-white mb-1">
                        5
                      </div>
                      <div className="text-sm text-white/70">Fuel Stations</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Crew Composition */}
              <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                  <Users className="w-6 h-6 text-purple-300 mr-2" />
                  Crew Size Breakdown
                </h3>

                <div className="space-y-4">
                  <div className="bg-white/10 rounded-lg p-4">
                    <h4 className="font-semibold text-white mb-2 flex items-center">
                      <span className="text-xl mr-2">👔</span>
                      MSC Civilian Crew
                    </h4>
                    <p className="text-white/80">100–160 personnel</p>
                  </div>

                  <div className="bg-white/10 rounded-lg p-4">
                    <h4 className="font-semibold text-white mb-3 flex items-center">
                      <span className="text-xl mr-2">🎖️</span>
                      Military Detachments (if applicable)
                    </h4>
                    <div className="space-y-2 text-white/80 text-sm">
                      <div className="flex justify-between py-2 border-b border-white/10">
                        <span>Air Detachment</span>
                        <span className="text-white font-medium">
                          30–40 personnel
                        </span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span>Security Detachment</span>
                        <span className="text-white font-medium">
                          20–30 personnel
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mission & UNREP Operations - Part 1 */}
              <div className="bg-gradient-to-br from-indigo-600/20 to-blue-600/20 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <Fuel className="w-6 h-6 text-indigo-300 mr-2" />
                  Mission: Aircraft Carrier CLF Provider of Choice
                </h3>

                <div className="space-y-4 text-white/80">
                  <p>
                    The main mission of the T-AOE is to provide cargo to the
                    United States and allied navies at sea. The{' '}
                    <strong className="text-white">
                      Combat Logistics Force (CLF)
                    </strong>{' '}
                    is a crucial component of the U.S. Navy, delivering
                    essential logistical support that ensures the Navy's global
                    reach, operational readiness, and mission effectiveness.
                  </p>

                  <p>
                    By facilitating underway replenishment operations, CLF
                    vessels supply fuel, ammunition, food, and other critical
                    resources to naval forces at sea, enabling them to sustain
                    operations far from home ports and logistical
                    infrastructure.
                  </p>

                  <p>
                    This capability enhances operational continuity by reducing
                    the need for frequent port visits and extends the Navy's
                    ability to project power and influence across multiple
                    maritime domains. Whether conducting combat operations,
                    training exercises, humanitarian assistance, or disaster
                    relief missions, the CLF fleet ensures naval forces remain
                    well-equipped and mission-ready.
                  </p>

                  <div className="bg-white/10 rounded-lg p-4 mt-6">
                    <p className="text-sm text-white/90">
                      <strong>Bottom line:</strong> Without CLF vessels like
                      T-AOEs, the Navy's ability to sustain naval forces at sea
                      would be severely limited, hindering their ability to
                      safeguard national security interests on a global scale.
                    </p>
                  </div>
                </div>

                {/* Understanding UNREPs */}
                <div className="mt-8 pt-6 border-t border-white/10">
                  <h4 className="font-semibold text-white mb-4 text-lg">
                    Understanding UNREPs
                  </h4>
                  <p className="text-white/80 mb-6">
                    Underway replenishments (UNREPs) are how sustaining
                    materials are transferred at sea. T-AOEs excel at two types
                    of transfers:
                  </p>

                  {/* CONREP */}
                  <div className="bg-white/10 rounded-lg p-5 mb-4">
                    <h5 className="font-semibold text-white mb-3 flex items-center">
                      <span className="text-xl mr-2">🔗</span>
                      Connected Replenishments (CONREP)
                    </h5>
                    <div className="space-y-3 text-white/80 text-sm">
                      <p>
                        Vessels maneuver alongside each other, maintaining
                        precise distance. Rig crews transfer fuel hoses and
                        cargo lines, then supplies move "over the wire"—fuel,
                        ammunition, food, spare parts. T-AOEs provide both jet
                        fuel and dry cargo to carriers and supporting ships.
                      </p>
                      <p>
                        Aircraft carriers receive around{' '}
                        <strong className="text-white">
                          2 million gallons of jet fuel per week
                        </strong>{' '}
                        for flight operations. AOEs often have{' '}
                        <strong className="text-white">
                          two vessels alongside simultaneously
                        </strong>
                        —a carrier to port and a smaller ship to starboard.
                      </p>
                    </div>
                  </div>

                  {/* VERTREP */}
                  <div className="bg-white/10 rounded-lg p-5">
                    <h5 className="font-semibold text-white mb-3 flex items-center">
                      <span className="text-xl mr-2">🚁</span>
                      Vertical Replenishments (VERTREP)
                    </h5>
                    <div className="space-y-3 text-white/80 text-sm">
                      <p>
                        Helicopters transfer supplies when ships can't come
                        alongside. Pallets are lifted from one ship to another.
                        The helicopter hovers over the receiving vessel's deck,
                        drops the material, and repeats.
                      </p>
                      <div className="bg-red-500/20 border-l-4 border-red-400 p-3">
                        <p className="text-red-100 text-sm">
                          <strong>Impressive sight:</strong> Seeing an AOE
                          operating at full capacity with two vessels alongside
                          and conducting a VERTREP is truly remarkable. If
                          you're on the main deck, stay alert—forklifts will be
                          zipping around!
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Life on UNREPs */}
                <div className="mt-6 pt-6 border-t border-white/10">
                  <h4 className="font-semibold text-white mb-4 text-lg">
                    What to Expect During UNREPs
                  </h4>
                  <div className="space-y-3 text-white/80 text-sm">
                    <p>
                      Over time, you'll get into a rhythm of seeing and
                      resupplying a group of Navy ships. You'll start to notice
                      patterns and judge your customers. Some ships are smooth
                      sailing, and the UNREPs go well—often ending with the
                      customer ship sending{' '}
                      <strong className="text-white">UNREP cookies</strong> as a
                      sign of goodwill. Other customers are less coordinated and
                      don't send any treats!
                    </p>
                    <p>
                      UNREPs are a delicate dance between ships in the middle of
                      the ocean, supporting America's interests. They are truly
                      a sight to see!
                    </p>
                    <p className="italic text-white/70">
                      If you are new to MSC and want to learn more, check out
                      the other articles on CIVSail.com. If you're an MSC
                      veteran with a good UNREP story, shoot us an email—we
                      would love to share it!
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

              {/* Operational Cycles */}
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-xl p-6 border border-white/10">
                  <h3 className="text-xl font-semibold text-white mb-4">
                    Operational Cycle
                  </h3>
                  <p className="text-white/80 mb-6">
                    T-AOEs often deploy with Aircraft Carrier Strike Groups as
                    the main replenishment vessel. These deployments typically
                    last 2-8 months, but they are often extended. During
                    deployment, expect a busy schedule and many underway
                    replenishments (UNREPs).
                  </p>

                  <div className="grid md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white/10 rounded-lg p-4">
                      <h4 className="font-medium text-white mb-2">
                        Deployment Phase
                      </h4>
                      <div className="text-2xl font-bold text-red-400 mb-1">
                        2-8 months
                      </div>
                      <p className="text-white/70 text-sm">
                        Often extended due to operational needs
                      </p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4">
                      <h4 className="font-medium text-white mb-2">
                        Post-Deployment
                      </h4>
                      <div className="text-2xl font-bold text-red-400 mb-1">
                        Earle, NJ
                      </div>
                      <p className="text-white/70 text-sm">
                        Offload ammo, prepare for maintenance
                      </p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4">
                      <h4 className="font-medium text-white mb-2">Duty Ship</h4>
                      <div className="text-2xl font-bold text-red-400 mb-1">
                        Local Ops
                      </div>
                      <p className="text-white/70 text-sm">
                        East Coast fleet support
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-red-500/20 rounded-lg border border-red-400/30">
                    <p className="text-red-300 text-sm">
                      <strong>High Value Asset:</strong> Because of their
                      capabilities, AOEs are valuable assets for all ships in
                      the area and can expect frequent tasking.
                    </p>
                  </div>
                </div>

                {/* Port to Sea Time Ratio */}
                <div className="bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-xl p-6 border border-white/10">
                  <h3 className="text-xl font-semibold text-white mb-4">
                    Port to Sea Time Ratio
                  </h3>
                  <p className="text-white/80 mb-6">
                    An AOE's port to sea time ratio depends on its operational
                    schedule. AOEs are busy ships, so you can expect a cycle of
                    loading fuel and supplies in port for 2-4 days, followed by
                    5-10 days at sea to resupply other vessels.
                  </p>

                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-white/10 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-300 mb-3">
                        Typical Schedule
                      </h4>
                      <ul className="text-white/80 text-sm space-y-2">
                        <li>
                          • <strong>Port Time:</strong> 2-4 days loading fuel
                          and supplies
                        </li>
                        <li>
                          • <strong>Sea Time:</strong> 5-10 days distributing to
                          fleet
                        </li>
                        <li>• Return to port once supplies distributed</li>
                        <li>
                          • CLF vessels pull in so Navy ships don't have to
                        </li>
                      </ul>
                    </div>

                    <div className="bg-white/10 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-300 mb-3">
                        Schedule Flexibility
                      </h4>
                      <ul className="text-white/80 text-sm space-y-2">
                        <li>• Schedules change frequently</li>
                        <li>• Mission needs drive operations</li>
                        <li>• Expect schedule adjustments</li>
                        <li>• High operational tempo throughout</li>
                      </ul>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-500/20 rounded-lg border border-blue-400/30">
                    <p className="text-blue-300 text-sm">
                      <strong>Schedule Reality:</strong> If T-AH schedules are
                      written in pen, T-AOE schedules are written in dry-erase
                      marker. Flexibility is key.
                    </p>
                  </div>
                </div>

                {/* Money Situation */}
                <div className="bg-gradient-to-br from-green-500/20 to-teal-500/20 rounded-xl p-6 border border-white/10">
                  <h3 className="text-xl font-semibold text-white mb-4">
                    💰 Pay & Compensation
                  </h3>
                  <p className="text-white/80 mb-6">
                    T-AOEs are considered high paying ships due to their high
                    operational tempo and other incentive pays. Crew members
                    onboard AOEs work hard and are commensurately compensated.
                  </p>

                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-3">
                      <div className="bg-white/10 rounded-lg p-4 border border-green-400/30">
                        <h4 className="font-medium text-green-300 mb-2">
                          Base Pay Level
                        </h4>
                        <p className="text-white/70 text-sm">
                          Generally on the higher end of MSC pay scale
                        </p>
                      </div>
                      <div className="bg-white/10 rounded-lg p-4 border border-green-400/30">
                        <h4 className="font-medium text-green-300 mb-2">
                          Ammunition Pay
                        </h4>
                        <p className="text-white/70 text-sm">
                          Almost always carrying ammo outside the US
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="bg-white/10 rounded-lg p-4 border border-green-400/30">
                        <h4 className="font-medium text-green-300 mb-2">
                          Berthing Pay
                        </h4>
                        <p className="text-white/70 text-sm">
                          Most unlicensed crew members receive this
                        </p>
                      </div>
                      <div className="bg-white/10 rounded-lg p-4 border border-green-400/30">
                        <h4 className="font-medium text-green-300 mb-2">
                          Penalty Meal Hours
                        </h4>
                        <p className="text-white/70 text-sm">
                          High ops tempo = working through meals (1 and 1s)
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-yellow-500/20 rounded-lg border border-yellow-400/30">
                    <p className="text-yellow-300 text-sm">
                      <strong>Pay factors:</strong> Your exact earnings depend
                      on the captain, ship's budget, department head,
                      operational tempo, and ammunition carriage. When busy and
                      carrying ammunition (often the case), compensation and
                      overtime increase significantly.
                    </p>
                  </div>
                </div>

                {/* Life on Board Summary */}
                <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl p-6 border border-white/10">
                  <h3 className="text-xl font-semibold text-white mb-4">
                    Life on Board
                  </h3>
                  <p className="text-white/80 mb-6">
                    AOEs are old vessels. Generally, they ride well in the
                    water, but this can change depending on the sea-state and
                    vessel speed. Long stretches without operations can be
                    boring, but there's always something you can do to prevent
                    or alleviate boredom.
                  </p>

                  <div className="grid md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white/10 rounded-lg p-4">
                      <h4 className="font-medium text-white mb-2">
                        Work Expectations
                      </h4>
                      <p className="text-white/70 text-sm">
                        Expect to do a lot of work. Work comes first on AOEs.
                      </p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4">
                      <h4 className="font-medium text-white mb-2">
                        Liberty Time
                      </h4>
                      <p className="text-white/70 text-sm">
                        Adequate opportunities, but may be impacted by
                        operations
                      </p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4">
                      <h4 className="font-medium text-white mb-2">Internet</h4>
                      <p className="text-white/70 text-sm">
                        Notoriously poor and unreliable connectivity
                      </p>
                    </div>
                  </div>

                  <div className="bg-white/10 rounded-lg p-5 mb-4">
                    <h4 className="font-semibold text-white mb-3">
                      Fueling & Loading Operations
                    </h4>
                    <div className="space-y-2 text-white/80 text-sm">
                      <p>
                        • AOEs undergo many fueling operations with long in-port
                        loading times
                      </p>
                      <p>
                        • T-AOEs hold a lot of fuel - you may pump longer than
                        expected
                      </p>
                      <p>
                        • Coming from an AKE? Expect longer fueling evolutions
                      </p>
                    </div>
                  </div>

                  <div className="bg-white/10 rounded-lg p-5">
                    <h4 className="font-semibold text-white mb-3">
                      Cargo Handling Challenges
                    </h4>
                    <div className="space-y-2 text-white/80 text-sm">
                      <p>
                        • Due to age and size, loading isn't always as easy as
                        T-AKE/T-AO vessels
                      </p>
                      <p>• Cargo elevators are small and holds are low</p>
                      <p>
                        • Often need to break down double-stacked pallets to fit
                      </p>
                      <p>
                        • Elevators and holds require special handling
                        procedures
                      </p>
                    </div>
                  </div>
                </div>

                {/* Department Operations */}
                <div className="bg-gradient-to-br from-slate-700/20 to-gray-700/20 rounded-xl p-6 border border-white/10">
                  <h3 className="text-xl font-semibold text-white mb-6">
                    👥 Department-Specific Information
                  </h3>

                  {/* Deck Department */}
                  <div className="mb-8">
                    <h4 className="text-lg font-semibold text-white mb-4 flex items-center border-b border-white/10 pb-2">
                      <span className="text-2xl mr-3">⚓</span>
                      For the Deck Department
                    </h4>

                    {/* Deck Officers */}
                    <div className="bg-white/10 rounded-lg p-5 mb-4">
                      <h5 className="font-semibold text-blue-300 mb-3">
                        Deck Officers
                      </h5>
                      <div className="space-y-3 text-white/80 text-sm">
                        <p>
                          At full manning, these ships are manned with{' '}
                          <strong className="text-white">2 Chief Mates</strong>.
                          One Chief Mate acts as the Cargo Mate and one acts as
                          the Chief Mate. The Cargo Mate is responsible for all
                          cargo operations and the deck department cargo gangs,
                          while the Chief Mate is responsible for training,
                          watch standers, and vessel maintenance/preservation.
                        </p>
                        <p>
                          Due to the current state of manning, it is exceedingly
                          rare to have both 1st Officers. At full manning, there
                          are{' '}
                          <strong className="text-white">3 2nd Mates</strong>:
                          two assist with cargo operations, and one works as the
                          Navigator/Operations officer. Due to the manning
                          shortage, the Cargo 2s will need to pick up the work
                          for the missing 1st Officer.
                        </p>
                        <p>
                          Last, an AOE will have{' '}
                          <strong className="text-white">
                            three watch standing 3rd Mates
                          </strong>
                          . Once in a blue moon, there will be a day-working
                          Third Mate who acts as the Cargo 3. Due to the current
                          manning shortage, it is most likely that there will be
                          1 Chief Mate, a Navigator, 2 Cargo 2s, and 3 watch
                          standing thirds... if you're lucky.
                        </p>
                        <div className="bg-amber-500/20 border-l-4 border-amber-400 p-3 mt-3">
                          <p className="text-amber-100 text-xs">
                            <strong>Important:</strong> The bridge is located in
                            the forward house.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Deck Day Workers */}
                    <div className="bg-white/10 rounded-lg p-5">
                      <h5 className="font-semibold text-blue-300 mb-3">
                        Deck Day Workers
                      </h5>
                      <div className="space-y-3 text-white/80 text-sm">
                        <p>
                          The Deck Department Day Workers include the Bosun,
                          Cargo Bosun, Boatswain Mates, Day Working Able-Bodied
                          Seamen (ABs), and Day Working Ordinary Seamen (OS).
                          The deck department is split between cargo gangs and
                          maintenance teams.
                        </p>
                        <p>
                          On deployment, the Cargo Bosun and Boatswain Mates
                          handle UNREPs, cargo operations, forklift driving, and
                          operating the UNREP rigs and cranes. Due to the number
                          of UNREP stations on board,{' '}
                          <strong className="text-white">
                            AOEs typically have twice as many Boatswain Mates as
                            AKEs
                          </strong>
                          . The maintenance team assists with these tasks and
                          handles vessel upkeep, such as chipping and painting.
                        </p>
                        <p>
                          With the high operational tempo, expect to frequently
                          help with netting cargo for VERTREPs and UNREPs.
                        </p>
                        <div className="bg-blue-500/20 border-l-4 border-blue-400 p-3 mt-3">
                          <p className="text-blue-100 text-xs">
                            <strong>Note:</strong> The onboard cargo cranes are
                            not actual cranes; they are booms. Like T-AO class
                            vessels, AOEs load one pallet at a time, even though
                            they are often tasked with loading cargo like an
                            AKE.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Engine Department */}
                  <div className="mb-8">
                    <h4 className="text-lg font-semibold text-white mb-4 flex items-center border-b border-white/10 pb-2">
                      <span className="text-2xl mr-3">⚙️</span>
                      For the Engine Department
                    </h4>

                    {/* Engine Officers */}
                    <div className="bg-white/10 rounded-lg p-5 mb-4">
                      <h5 className="font-semibold text-orange-300 mb-3">
                        Engine Officers
                      </h5>
                      <div className="space-y-3 text-white/80 text-sm">
                        <p>
                          The AOEs have{' '}
                          <strong className="text-white">
                            gas turbine engines
                          </strong>
                          , so take that into account for sea days and advancing
                          your license. MSC does not have many gas turbine
                          ships, so this may impact your ship assignments if you
                          have an advanced license.
                        </p>
                        <p>
                          Unlike the T-AKEs, the T-AOEs have{' '}
                          <strong className="text-white">
                            2 3rd Assistant Engineers on watch at a time
                          </strong>
                          .
                        </p>
                      </div>
                    </div>

                    {/* Engine Unlicensed */}
                    <div className="bg-white/10 rounded-lg p-5">
                      <h5 className="font-semibold text-orange-300 mb-3">
                        Engine Unlicensed
                      </h5>
                      <p className="text-white/80 text-sm">
                        As mentioned, the AOEs are old. Expect to do a lot of
                        routine maintenance on the house and on the UNREP rigs.
                        The rigs see a lot of work and always need work.
                      </p>
                    </div>
                  </div>

                  {/* Supply Department */}
                  <div className="mb-8">
                    <h4 className="text-lg font-semibold text-white mb-4 flex items-center border-b border-white/10 pb-2">
                      <span className="text-2xl mr-3">📦</span>
                      Supply Department
                    </h4>
                    <p className="text-white/80 text-sm mb-4">
                      The Supply Department consists of several divisions, all
                      reporting directly to the Supply Officer. Per the manning
                      scale, the T-AOEs are billeted for 1 JSO, but they add a
                      second JSO when going on deployment.
                    </p>

                    {/* Steward Department */}
                    <div className="bg-white/10 rounded-lg p-5 mb-4">
                      <h5 className="font-semibold text-green-300 mb-3">
                        Steward Department
                      </h5>
                      <p className="text-white/80 text-sm">
                        The Chief Steward is the primary contact for all food
                        and hotel services operations. The division also
                        includes a Third Steward, Cooks, and Supply Utilitymen
                        (SUs). Due to manpower shortages and the increased need
                        for manning stations,{' '}
                        <strong className="text-white">
                          AOEs can have upwards of 20 SUs on board
                        </strong>{' '}
                        to assist with UNREPs.
                      </p>
                    </div>

                    {/* End-Use Supply */}
                    <div className="bg-white/10 rounded-lg p-5 mb-4">
                      <h5 className="font-semibold text-green-300 mb-3">
                        End-Use Supply
                      </h5>
                      <p className="text-white/80 text-sm">
                        The Admin JSO acts as the office manager of the Ship
                        Support Office and handles all MSC-specific supply and
                        logistics functions.
                      </p>
                    </div>

                    {/* CLF Supply */}
                    <div className="bg-white/10 rounded-lg p-5">
                      <h5 className="font-semibold text-green-300 mb-3">
                        CLF Supply
                      </h5>
                      <div className="space-y-3 text-white/80 text-sm">
                        <p>
                          The Cargo (CLF) JSO manages the Combat Logistics
                          Office and is responsible for all Navy-specific supply
                          and logistics functions. Due to frequent operations,
                          the Cargo JSO will be busy supporting numerous UNREPs
                          and preparing for upcoming loadouts.
                        </p>
                        <p>
                          If you are an{' '}
                          <strong className="text-white">ASK or YNSK</strong>,
                          expect to frequently serve as a tank sounder for
                          fueling operations.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Communications Department */}
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-4 flex items-center border-b border-white/10 pb-2">
                      <span className="text-2xl mr-3">📡</span>
                      Communications Department
                    </h4>

                    <div className="bg-white/10 rounded-lg p-5">
                      <h5 className="font-semibold text-cyan-300 mb-3">
                        Communications Operations
                      </h5>
                      <div className="space-y-3 text-white/80 text-sm">
                        <p>
                          The communications department is run by the Ship's
                          Communications Officer (SCO). Under the SCO is a LAN
                          Administrator, CRET, and two RET2's. The
                          Communications department is divided between the LAN
                          Administrator and the Radio Shack.
                        </p>
                        <p>
                          The LAN Administrator performs typical Information
                          Technology (IT) troubleshooting duties while the Radio
                          Shack monitors and sends Navy Messages.
                        </p>
                        <div className="bg-red-500/20 border-l-4 border-red-400 p-3 mt-3">
                          <p className="text-red-100 text-xs">
                            <strong>Known Issue:</strong> The internet is
                            notoriously poor on the AOEs.
                          </p>
                        </div>
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
                <Home className="w-8 h-8 text-red-400 mr-4" />
                <h2 className="text-3xl font-bold text-white">Life Aboard</h2>
              </div>

              {/* Introduction */}
              <div className="bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4">
                  T-AOE Living Overview
                </h3>
                <p className="text-white/80 mb-6">
                  T-AOEs are old ships, and their layout can be confusing,
                  especially if you are not familiar with them or expect the
                  T-AKE layout. T-AOEs have two houses with living spaces and
                  amenities divided almost evenly between them.
                </p>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white/10 rounded-lg p-4">
                    <h4 className="font-medium text-white mb-2">
                      Forward House
                    </h4>
                    <p className="text-white/70 text-sm">
                      Bridge, many Deck Officer staterooms, weight gym
                    </p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4">
                    <h4 className="font-medium text-white mb-2">Aft House</h4>
                    <p className="text-white/70 text-sm">
                      Engine Officers, other officers, crew mess, main deck
                      facilities
                    </p>
                  </div>
                </div>
              </div>

              {/* Staterooms and Berthing Areas */}
              <div className="bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                  <span className="text-2xl mr-3">
                    Rooms and Living Situation
                  </span>
                </h3>

                {/* Officer Staterooms */}
                <div className="mb-8">
                  <h4 className="text-lg font-semibold text-blue-300 mb-4 flex items-center">
                    <span className="text-xl mr-2">Officer Staterooms</span>
                  </h4>

                  <div className="grid lg:grid-cols-2 gap-6">
                    <div>
                      <div className="bg-white/10 rounded-lg p-4">
                        <h5 className="font-medium text-white mb-3">
                          Room Configuration
                        </h5>
                        <ul className="text-white/80 text-sm space-y-2">
                          <li>Officers have their own staterooms</li>
                          <li>Not as nice or new as T-AKE staterooms</li>
                          <li>Many share bathroom with adjoining room</li>
                          <li>
                            Rooms scattered among each level of both houses
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div>
                      <div className="bg-white/10 rounded-lg p-4">
                        <h5 className="font-medium text-white mb-3">
                          Location Distribution
                        </h5>
                        <ul className="text-white/80 text-sm space-y-2">
                          <li>
                            <strong>Forward House:</strong> Many Deck Officer
                            staterooms behind bridge
                          </li>
                          <li>
                            <strong>Aft House:</strong> Engine Officers and
                            other officers
                          </li>
                          <li>
                            Officer rooms distributed across multiple levels
                          </li>
                          <li>Layout less centralized than T-AKE</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
                    <div className="rounded-lg aspect-square overflow-hidden">
                      <img
                        src="/images/global/Coming_Soon_Graphic.png"
                        alt="T-AOE Officer Stateroom"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="rounded-lg aspect-square overflow-hidden">
                      <img
                        src="/images/global/Coming_Soon_Graphic.png"
                        alt="T-AOE Officer Bathroom"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="rounded-lg aspect-square overflow-hidden">
                      <img
                        src="/images/global/Coming_Soon_Graphic.png"
                        alt="T-AOE Officer Room Forward"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="rounded-lg aspect-square overflow-hidden">
                      <img
                        src="/images/global/Coming_Soon_Graphic.png"
                        alt="T-AOE Officer Room Aft"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>

                {/* CPO Staterooms */}
                <div className="mb-8">
                  <h4 className="text-lg font-semibold text-blue-300 mb-4 flex items-center">
                    <span className="text-xl mr-2">CPO Staterooms</span>
                  </h4>

                  <div className="bg-white/10 rounded-lg p-4 mb-4">
                    <h5 className="font-medium text-white mb-3">
                      Living Arrangements
                    </h5>
                    <ul className="text-white/80 text-sm space-y-2">
                      <li>CPOs have their own staterooms</li>
                      <li>
                        Share bathroom with adjoining stateroom or communal
                        bathroom
                      </li>
                      <li>Staterooms located in both forward and aft houses</li>
                      <li>Scattered amongst different levels</li>
                    </ul>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="rounded-lg aspect-square overflow-hidden">
                      <img
                        src="/images/global/Coming_Soon_Graphic.png"
                        alt="T-AOE CPO Stateroom"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="rounded-lg aspect-square overflow-hidden">
                      <img
                        src="/images/global/Coming_Soon_Graphic.png"
                        alt="T-AOE CPO Bathroom"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="rounded-lg aspect-square overflow-hidden">
                      <img
                        src="/images/global/Coming_Soon_Graphic.png"
                        alt="T-AOE CPO Room Forward"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="rounded-lg aspect-square overflow-hidden">
                      <img
                        src="/images/global/Coming_Soon_Graphic.png"
                        alt="T-AOE CPO Room Aft"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>

                {/* Berthing */}
                <div>
                  <h4 className="text-lg font-semibold text-blue-300 mb-4 flex items-center">
                    <span className="text-xl mr-2">Berthing</span>
                  </h4>

                  <div className="grid lg:grid-cols-2 gap-6">
                    <div>
                      <div className="bg-white/10 rounded-lg p-4 mb-4">
                        <h5 className="font-medium text-white mb-3">
                          Berthing Areas
                        </h5>
                        <p className="text-white/80 text-sm mb-3">
                          All unlicensed, non-CPO personnel live in berthing.
                          There are several different berthing areas onboard:
                        </p>
                        <ul className="text-white/70 text-xs space-y-1">
                          <li>Watch standers berthing</li>
                          <li>Boatswain mates berthing</li>
                          <li>Deck Department day worker berthing</li>
                          <li>Supply Department berthing</li>
                          <li>Engine Department berthing</li>
                          <li>Female berthing</li>
                          <li>Military berthing</li>
                        </ul>
                      </div>

                      <div className="bg-white/10 rounded-lg p-4">
                        <h5 className="font-medium text-white mb-3">
                          Space and Comfort
                        </h5>
                        <ul className="text-white/80 text-sm space-y-2">
                          <li>Berthing pay is authorized onboard</li>
                          <li>Each crewmember has decent space</li>
                          <li>MSC does not max out berthing areas</li>
                          <li>More spacious than Navy berthing</li>
                        </ul>
                      </div>
                    </div>

                    <div>
                      <div className="bg-white/10 rounded-lg p-4 mb-4">
                        <h5 className="font-medium text-white mb-3">
                          vs. Navy Berthing
                        </h5>
                        <p className="text-white/80 text-sm">
                          If you were in the Navy, the berthing areas are much
                          more spacious and do not have 3-person high coffin
                          racks like the Navy. MSC berthing is more akin to
                          having your own cubicle.
                        </p>
                      </div>

                      <div className="bg-white/10 rounded-lg p-4">
                        <h5 className="font-medium text-white mb-3">
                          Location
                        </h5>
                        <p className="text-white/80 text-sm">
                          Like the staterooms, berthing areas are in both houses
                          and located on different levels.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
                    <div className="rounded-lg aspect-square overflow-hidden">
                      <img
                        src="/images/global/Coming_Soon_Graphic.png"
                        alt="T-AOE Berthing Area"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="rounded-lg aspect-square overflow-hidden">
                      <img
                        src="/images/global/Coming_Soon_Graphic.png"
                        alt="T-AOE Crew Berthing"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="rounded-lg aspect-square overflow-hidden">
                      <img
                        src="/images/global/Coming_Soon_Graphic.png"
                        alt="T-AOE Berthing Cubicle"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="rounded-lg aspect-square overflow-hidden">
                      <img
                        src="/images/global/Coming_Soon_Graphic.png"
                        alt="T-AOE Berthing Storage"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Mess Decks and Lounges */}
              <div className="bg-gradient-to-br from-green-500/20 to-teal-500/20 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                  <span className="text-2xl mr-3">Mess Decks and Lounges</span>
                </h3>

                {/* Mess Decks */}
                <div className="mb-8">
                  <h4 className="text-lg font-semibold text-green-300 mb-4">
                    Mess Decks
                  </h4>

                  <div className="grid lg:grid-cols-2 gap-6">
                    <div>
                      <div className="bg-white/10 rounded-lg p-4">
                        <h5 className="font-medium text-white mb-3">
                          Crew Mess
                        </h5>
                        <ul className="text-white/80 text-sm space-y-2">
                          <li>Located on the main deck</li>
                          <li>Primary dining area for crew</li>
                          <li>Same food and menu as officers</li>
                        </ul>
                      </div>
                    </div>

                    <div>
                      <div className="bg-white/10 rounded-lg p-4">
                        <h5 className="font-medium text-white mb-3">
                          Officers Mess
                        </h5>
                        <ul className="text-white/80 text-sm space-y-2">
                          <li>Located a few decks above crew mess</li>
                          <li>Separate galley but same food and menu</li>
                          <li>More formal dining environment</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
                    <div className="rounded-lg aspect-square overflow-hidden">
                      <img
                        src="/images/global/Coming_Soon_Graphic.png"
                        alt="T-AOE Crew Mess"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="rounded-lg aspect-square overflow-hidden">
                      <img
                        src="/images/global/Coming_Soon_Graphic.png"
                        alt="T-AOE Officers Mess"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="rounded-lg aspect-square overflow-hidden">
                      <img
                        src="/images/global/Coming_Soon_Graphic.png"
                        alt="T-AOE Serving Line"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="rounded-lg aspect-square overflow-hidden">
                      <img
                        src="/images/global/Coming_Soon_Graphic.png"
                        alt="T-AOE Galley"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>

                {/* Lounges */}
                <div>
                  <h4 className="text-lg font-semibold text-green-300 mb-4">
                    Lounges
                  </h4>

                  <div className="bg-white/10 rounded-lg p-4 mb-4">
                    <h5 className="font-medium text-white mb-3">
                      Lounge Locations
                    </h5>
                    <p className="text-white/80 text-sm mb-3">
                      There are many lounges on board the T-AOEs:
                    </p>
                    <ul className="text-white/80 text-sm space-y-2">
                      <li>
                        <strong>Officers Lounge:</strong> Located in the
                        officers mess
                      </li>
                      <li>
                        <strong>Crew Lounge:</strong> Main deck near crew mess
                      </li>
                      <li>
                        <strong>Berthing Lounges:</strong> Lounge spaces in each
                        berthing area
                      </li>
                    </ul>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="rounded-lg aspect-square overflow-hidden">
                      <img
                        src="/images/global/Coming_Soon_Graphic.png"
                        alt="T-AOE Crew Lounge"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="rounded-lg aspect-square overflow-hidden">
                      <img
                        src="/images/global/Coming_Soon_Graphic.png"
                        alt="T-AOE Officers Lounge"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="rounded-lg aspect-square overflow-hidden">
                      <img
                        src="/images/global/Coming_Soon_Graphic.png"
                        alt="T-AOE Berthing Lounge"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="rounded-lg aspect-square overflow-hidden">
                      <img
                        src="/images/global/Coming_Soon_Graphic.png"
                        alt="T-AOE Lounge Seating"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Gyms */}
              <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                  <span className="text-2xl mr-3">Gyms</span>
                </h3>

                <p className="text-white/80 mb-6">
                  The T-AOEs have 2 gyms: a weight gym and a cardio gym. Both
                  gyms are fairly large as far as shipboard gyms go.
                </p>

                <div className="grid lg:grid-cols-2 gap-6 mb-6">
                  <div>
                    <div className="bg-white/10 rounded-lg p-4">
                      <h4 className="font-medium text-purple-300 mb-3">
                        Weight Gym
                      </h4>
                      <ul className="text-white/80 text-sm space-y-2">
                        <li>
                          <strong>Location:</strong> Bottom of forward house
                        </li>
                        <li>
                          <strong>Size:</strong> Large for a shipboard gym
                        </li>
                        <li>
                          <strong>Equipment:</strong> Dumbbells, barbells,
                          weight machines
                        </li>
                        <li>Typical shipboard gym loadout</li>
                      </ul>
                    </div>
                  </div>

                  <div>
                    <div className="bg-white/10 rounded-lg p-4">
                      <h4 className="font-medium text-purple-300 mb-3">
                        Cardio Gym
                      </h4>
                      <ul className="text-white/80 text-sm space-y-2">
                        <li>
                          <strong>Location:</strong> Midship on main deck
                        </li>
                        <li>
                          <strong>Size:</strong> Fairly large
                        </li>
                        <li>
                          <strong>Equipment:</strong> Treadmills, bikes, rowers,
                          ellipticals
                        </li>
                        <li>Dedicated cardio space</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="rounded-lg aspect-square overflow-hidden">
                    <img
                      src="/images/global/Coming_Soon_Graphic.png"
                      alt="T-AOE Weight Gym"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="rounded-lg aspect-square overflow-hidden">
                    <img
                      src="/images/global/Coming_Soon_Graphic.png"
                      alt="T-AOE Cardio Gym"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="rounded-lg aspect-square overflow-hidden">
                    <img
                      src="/images/global/Coming_Soon_Graphic.png"
                      alt="T-AOE Weight Equipment"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="rounded-lg aspect-square overflow-hidden">
                    <img
                      src="/images/global/Coming_Soon_Graphic.png"
                      alt="T-AOE Cardio Equipment"
                      className="w-full h-full object-cover"
                    />
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
                  resource for T-AOE life aboard. If you have photos of T-AOE
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

          {/* Ships & Ports Section */}
          {activeSection === 'ships-ports' && (
            <div className="space-y-8">
              <div className="flex items-center mb-8">
                <MapPin className="w-8 h-8 text-red-400 mr-4" />
                <h2 className="text-3xl font-bold text-white">Ships & Ports</h2>
              </div>

              {/* Fleet Overview */}
              <div className="bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4">
                  T-AOE Fleet Overview
                </h3>
                <p className="text-white/80 mb-6">
                  MSC currently has 2 operational T-AOE vessels, and they are
                  both designated as East Coast vessels. These ships represent
                  the last of the fast combat support ship class still in
                  service.
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white/10 rounded-lg p-4">
                    <h4 className="font-semibold text-white mb-3 flex items-center">
                      <span className="text-xl mr-2">Active Fleet</span>
                    </h4>
                    <ul className="text-white/70 text-sm space-y-1">
                      <li>2 operational T-AOE vessels</li>
                      <li>Both East Coast designated</li>
                      <li>Homeported in Norfolk, Virginia</li>
                      <li>Support Atlantic and Mediterranean operations</li>
                    </ul>
                  </div>

                  <div className="bg-white/10 rounded-lg p-4">
                    <h4 className="font-semibold text-white mb-3 flex items-center">
                      <span className="text-xl mr-2">Fleet Status</span>
                    </h4>
                    <ul className="text-white/70 text-sm space-y-1">
                      <li>Last remaining fast combat support ships</li>
                      <li>High-value assets for carrier strike groups</li>
                      <li>No replacement class planned</li>
                      <li>Operating beyond original service life</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Active Ships - WITH DVIDS CLICK FUNCTIONALITY */}
              <div className="bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                  <span className="text-2xl mr-3">Active T-AOE Fleet</span>
                </h3>

                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div
                    onClick={() => handleShipClick('Supply', 'T-AOE 6')}
                    className="bg-white/10 rounded-lg p-5 border border-white/20 hover:bg-white/15 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-medium text-white text-lg group-hover:text-blue-300 transition-colors">
                        USNS Supply
                      </span>
                      <span className="text-red-300 text-sm font-mono">
                        T-AOE 6
                      </span>
                    </div>
                    <div className="text-white/70 text-sm mb-2">
                      <strong>Status:</strong> Active - East Coast
                    </div>
                    <div className="text-white/70 text-sm">
                      <strong>Homeport:</strong> Norfolk, Virginia
                    </div>
                    <div className="mt-2 text-xs text-blue-300 opacity-0 group-hover:opacity-100 transition-opacity">
                      Click for news & photos →
                    </div>
                  </div>

                  <div
                    onClick={() => handleShipClick('Arctic', 'T-AOE 8')}
                    className="bg-white/10 rounded-lg p-5 border border-white/20 hover:bg-white/15 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-medium text-white text-lg group-hover:text-blue-300 transition-colors">
                        USNS Arctic
                      </span>
                      <span className="text-red-300 text-sm font-mono">
                        T-AOE 8
                      </span>
                    </div>
                    <div className="text-white/70 text-sm mb-2">
                      <strong>Status:</strong> Active - East Coast
                    </div>
                    <div className="text-white/70 text-sm">
                      <strong>Homeport:</strong> Norfolk, Virginia
                    </div>
                    <div className="mt-2 text-xs text-blue-300 opacity-0 group-hover:opacity-100 transition-opacity">
                      Click for news & photos →
                    </div>
                  </div>
                </div>
              </div>

              {/* Decommissioned Ships */}
              <div className="bg-gradient-to-br from-gray-600/20 to-slate-600/20 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                  <span className="text-2xl mr-3">Decommissioned T-AOEs</span>
                </h3>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white/10 rounded-lg p-5 border border-gray-400/30 opacity-70">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-medium text-white text-lg">
                        USNS Rainer
                      </span>
                      <span className="text-gray-300 text-sm font-mono">
                        T-AOE 7
                      </span>
                    </div>
                    <div className="text-white/60 text-sm">
                      <strong>Status:</strong> Decommissioned
                    </div>
                  </div>

                  <div className="bg-white/10 rounded-lg p-5 border border-gray-400/30 opacity-70">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-medium text-white text-lg">
                        USNS Bridge
                      </span>
                      <span className="text-gray-300 text-sm font-mono">
                        T-AOE 10
                      </span>
                    </div>
                    <div className="text-white/60 text-sm">
                      <strong>Status:</strong> Decommissioned
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-gray-500/20 rounded-lg border border-gray-400/30">
                  <p className="text-gray-300 text-sm">
                    <strong>Historical Note:</strong> These vessels served the
                    fleet for decades before being decommissioned. Many veterans
                    remember them fondly as the last of the true fast combat
                    support ships.
                  </p>
                </div>
              </div>

              {/* Common Ports */}
              <div className="bg-gradient-to-br from-green-500/20 to-teal-500/20 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                  <span className="text-2xl mr-3">
                    Common East Coast T-AOE Ports
                  </span>
                </h3>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-green-300 mb-3">
                      United States
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {[
                        'Norfolk, Virginia',
                        'Earle, New Jersey',
                        'Craney Island, Virginia',
                        'Mobile, Alabama',
                        'Charleston, South Carolina',
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
                    <h4 className="font-medium text-green-300 mb-3">
                      Europe & Mediterranean
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {[
                        'Rota, Spain',
                        'Mallorca, Spain',
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

                  <div>
                    <h4 className="font-medium text-green-300 mb-3">
                      Middle East
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {['Fujairah, UAE'].map((port) => (
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

                <div className="mt-6 p-4 bg-teal-500/20 rounded-lg border border-teal-400/30">
                  <p className="text-teal-300 text-sm">
                    <strong>Port Operations:</strong> T-AOEs frequently visit
                    Earle, New Jersey for ammunition loading and offloading
                    operations. Norfolk serves as the primary homeport for both
                    active vessels.
                  </p>
                </div>
              </div>

              {/* Fleet Summary */}
              <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <span className="text-2xl mr-3">Fleet Summary</span>
                </h3>

                <div className="grid md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-400 mb-2">
                      2
                    </div>
                    <div className="text-white/70 text-sm">Active T-AOEs</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-400 mb-2">
                      2
                    </div>
                    <div className="text-white/70 text-sm">East Coast</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-400 mb-2">
                      2
                    </div>
                    <div className="text-white/70 text-sm">Decommissioned</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-400 mb-2">
                      11
                    </div>
                    <div className="text-white/70 text-sm">Common Ports</div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-amber-500/20 rounded-lg border border-amber-400/30">
                  <p className="text-amber-300 text-sm">
                    <strong>Assignment Rarity:</strong> With only two T-AOE
                    vessels remaining, assignments to these ships are relatively
                    rare. However, they offer unique opportunities for
                    high-tempo operations and excellent compensation.
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
            Information based on current T-AOE operations and sailor experiences
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
