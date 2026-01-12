'use client';

import Link from 'next/link';
import {
  motion,
  useScroll,
  useSpring,
} from 'framer-motion';
import {
  Ship,
  Bed,
  Clock,
  Calendar,
  Wifi,
  Users,
  MapPin,
  ChevronUp,
  ArrowRight,
  Award,
  GraduationCap,
  Briefcase,
  Anchor,
  Gauge,
  Wrench,
  Sun,
  Moon,
  Coffee,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

/**
 * Life at Sea page - Honest FAQ-style guide for prospective mariners
 * Matches the design system from careers-and-sectors page
 */

// Section data for consistent rendering
const SECTIONS = [
  {
    id: 'the-ship',
    number: '01',
    title: 'The Ship Itself',
    icon: Ship,
    color: 'blue',
  },
  {
    id: 'living-conditions',
    number: '02',
    title: 'Your Room & Living Conditions',
    icon: Bed,
    color: 'emerald',
  },
  {
    id: 'day-to-day',
    number: '03',
    title: 'Day-to-Day Life Onboard',
    icon: Clock,
    color: 'amber',
  },
  {
    id: 'rotations',
    number: '04',
    title: 'Time Away, Rotations & Schedules',
    icon: Calendar,
    color: 'violet',
  },
  {
    id: 'connectivity',
    number: '05',
    title: 'Internet, Phones & Staying Connected',
    icon: Wifi,
    color: 'cyan',
  },
  {
    id: 'crew',
    number: '06',
    title: 'Crew Size & Social Life',
    icon: Users,
    color: 'pink',
  },
  {
    id: 'liberty',
    number: '07',
    title: 'Liberty, Ports & Getting Ashore',
    icon: MapPin,
    color: 'rose',
  },
];

// Watch schedule for visual display
const WATCH_SCHEDULE = [
  { time: '0000–0400', label: '"Balls to 4"', icon: Moon },
  { time: '0400–0800', label: 'Morning Watch', icon: Sun },
  { time: '0800–1200', label: 'Day Watch', icon: Coffee },
  { time: '1200–1600', label: 'Afternoon Watch', icon: Sun },
  { time: '1600–2000', label: 'Dinner Watch', icon: Sun },
  { time: '2000–0000', label: 'Evening Watch', icon: Moon },
];

// Common rotation examples
const ROTATIONS = [
  { rotation: '14 on / 14 off', typical: 'Tugs, OSVs, inland', predictability: 'High' },
  { rotation: '30 on / 30 off', typical: 'Some commercial, offshore', predictability: 'Medium' },
  { rotation: '60 on / 60 off', typical: 'NOAA', predictability: 'Medium' },
  { rotation: '90 on / 90 off', typical: 'Deep sea commercial', predictability: 'Variable' },
  { rotation: '120 on / 120 off', typical: 'Extended deployments-MSC CONMAR', predictability: 'Variable' },
];

// Crew size examples
const CREW_SIZES = [
  { type: 'Tugboats', size: '6–8', icon: Anchor },
  { type: 'Commercial Ships', size: '18–22', icon: Ship },
  { type: 'MSC Vessels', size: '80–120', icon: Ship },
];

export default function LifeAtSeaPage() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-blue-500 origin-left z-50"
        style={{ scaleX }}
      />

      {/* Back to top button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 z-40 p-3 bg-slate-900 border border-slate-700 rounded-full shadow-lg hover:bg-slate-800 transition-colors"
      >
        <ChevronUp className="w-5 h-5 text-slate-400" />
      </motion.button>

      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <nav className="flex items-center text-sm text-slate-400">
          <Link href="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/maritime-101" className="hover:text-white transition-colors">
            Maritime 101
          </Link>
          <span className="mx-2">/</span>
          <span className="text-white">Life at Sea</span>
        </nav>
      </div>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          <Badge className="mb-6 bg-blue-500/20 text-blue-400 border-blue-500/50">
            What to Expect
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Life at Sea
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 mb-4">
            What It&apos;s Really Like Working on a Ship
          </p>
          <p className="text-lg text-slate-400 mb-8 leading-relaxed max-w-3xl mx-auto">
            Life at sea varies widely depending on the ship, company, route and mission. 
            Many of the answers below start with &quot;it depends.&quot; That&apos;s not a dodge — 
            it&apos;s the reality of a global, highly varied industry. This page provides quick, 
            honest explanations to common questions and helps set realistic expectations.
          </p>

          {/* Quick nav */}
          <div className="flex flex-wrap justify-center gap-2 mt-8">
            {SECTIONS.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className="px-3 py-1.5 text-sm bg-slate-800/50 border border-slate-700 rounded-full text-slate-300 hover:text-white hover:border-slate-500 transition-colors"
              >
                {section.title}
              </button>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Section 1: The Ship Itself */}
      <section id="the-ship" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 rounded-xl bg-blue-500/20 border border-blue-500/30">
              <Ship className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <div className="text-sm text-blue-400 font-mono">01</div>
              <h2 className="text-3xl font-bold text-white">The Ship Itself</h2>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <p className="text-slate-300 leading-relaxed">
                Life at sea starts with the ship — and ships vary widely. There is no single &quot;mariner experience.&quot;
              </p>
              <p className="text-slate-300 leading-relaxed">
                Ships come in many sizes, designs and missions. Oil tankers operate differently than container ships. 
                Tugboats and fishing vessels are nothing like offshore rigs. Military Sealift Command resupply ships 
                operate differently than NOAA research vessels.
              </p>
              <p className="text-slate-300 leading-relaxed">
                Crew size, workload, living conditions and even how the ship feels underway depend heavily on 
                what kind of ship you&apos;re on and what it&apos;s designed to do.
              </p>
            </div>

            <div className="space-y-4">
              <Card className="p-6 bg-slate-900/50 border-slate-800">
                <div className="flex items-start gap-4">
                  <Gauge className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Size Matters</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      Bigger ships move more slowly and steadily. Smaller ships move more sharply and more often. 
                      Large ocean-going vessels tend to roll gradually and predictably. Smaller vessels — like tugboats, 
                      fishing boats and some offshore vessels — react more quickly to wind and waves.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-slate-900/50 border-slate-800">
                <div className="flex items-start gap-4">
                  <MapPin className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Routes Matter Too</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      Inland and coastal routes usually involve less motion. Open ocean routes experience more weather and swell. 
                      A large ship crossing an ocean may feel steadier than a small vessel working close to shore in rough conditions.
                    </p>
                  </div>
                </div>
              </Card>

              <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-slate-300">
                    <span className="font-semibold text-white">Bottom line:</span> Understanding the ship type 
                    is the first step to understanding what life at sea will actually be like.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <Separator className="max-w-7xl mx-auto bg-slate-800" />

      {/* Section 2: Living Conditions */}
      <section id="living-conditions" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30">
              <Bed className="w-8 h-8 text-emerald-400" />
            </div>
            <div>
              <div className="text-sm text-emerald-400 font-mono">02</div>
              <h2 className="text-3xl font-bold text-white">Your Room & Living Conditions</h2>
            </div>
          </div>

          <p className="text-slate-300 leading-relaxed mb-8 max-w-3xl">
            Your living space at sea depends on the company, the vessel and your position or rank. 
            There&apos;s no single standard across the industry.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Card className="p-6 bg-slate-900/50 border-slate-800">
              <h3 className="text-lg font-semibold text-white mb-3">What Does My Room Look Like?</h3>
              <p className="text-slate-400 text-sm mb-4">
                Most crew members live in a small, functional cabin designed for periods at sea. A typical cabin includes:
              </p>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  A bed (often a single bunk)
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  A desk or small work surface
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Storage for clothes and personal items
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Often a head (bathroom) attached
                </li>
              </ul>
            </Card>

            <Card className="p-6 bg-slate-900/50 border-slate-800">
              <h3 className="text-lg font-semibold text-white mb-3">Does Size and Rank Matter?</h3>
              <p className="text-slate-400 text-sm mb-4">
                Yes — both matter. As a general rule:
              </p>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Larger ships = larger living quarters
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Higher rank = better accommodations
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Newer ships = more comfortable
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Longer deployments = better crew spaces
                </li>
              </ul>
            </Card>

            <Card className="p-6 bg-slate-900/50 border-slate-800">
              <h3 className="text-lg font-semibold text-white mb-3">Do I Have Roommates?</h3>
              <p className="text-slate-400 text-sm mb-4">
                Sometimes. It depends on the vessel:
              </p>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Smaller vessels may require shared cabins
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Larger ships often provide single-occupancy
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Officers typically get private rooms
                </li>
              </ul>
            </Card>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6 bg-slate-900/50 border-slate-800">
              <h3 className="text-lg font-semibold text-white mb-3">Built for the Ocean</h3>
              <p className="text-slate-400 text-sm">
                Rooms are designed to secure for sea: drawers latch, furniture is bolted down, 
                and cabinets are built not to fly open.
              </p>
            </Card>

            <Card className="p-6 bg-amber-500/10 border-amber-500/30">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Pro Tip</h3>
                  <p className="text-slate-300 text-sm">
                    If something is taped, wedged or shimmed — don&apos;t touch it. Someone before you 
                    probably spent weeks silencing a rattle. A predictable noise at 2 a.m. is brutal.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </motion.div>
      </section>

      <Separator className="max-w-7xl mx-auto bg-slate-800" />

      {/* Section 3: Day-to-Day Life */}
      <section id="day-to-day" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 rounded-xl bg-amber-500/20 border border-amber-500/30">
              <Clock className="w-8 h-8 text-amber-400" />
            </div>
            <div>
              <div className="text-sm text-amber-400 font-mono">03</div>
              <h2 className="text-3xl font-bold text-white">Day-to-Day Life Onboard</h2>
            </div>
          </div>

          <p className="text-slate-300 leading-relaxed mb-8 max-w-3xl">
            Life at sea runs on routine. Every ship has watchstanders. Not every ship has day workers.
          </p>

          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Standing Watch</h3>
              <p className="text-slate-400 text-sm mb-6">
                There are two main types: <span className="text-white">deck watches</span> (driving and navigating) 
                and <span className="text-white">engine watches</span> (maintaining machinery and systems). 
                Watches are typically four hours long.
              </p>

              <div className="grid grid-cols-2 gap-3">
                {WATCH_SCHEDULE.map((watch, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-slate-900/50 border border-slate-800 rounded-lg flex items-center gap-3"
                  >
                    <watch.icon className="w-4 h-4 text-amber-400" />
                    <div>
                      <div className="text-xs font-mono text-slate-500">{watch.time}</div>
                      <div className="text-sm text-slate-300">{watch.label}</div>
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-slate-400 text-sm mt-4">
                Most watchstanders stand two watches per day. Work-rest rules govern minimum rest, 
                and overtime usually happens outside watch hours.
              </p>
            </div>

            <div className="space-y-6">
              <Card className="p-6 bg-slate-900/50 border-slate-800">
                <h3 className="text-lg font-semibold text-white mb-3">Day Workers</h3>
                <p className="text-slate-400 text-sm mb-3">
                  Day workers support maintenance and operations during normal working hours. They&apos;re more common on:
                </p>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    Military-adjacent operations
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    Offshore oil and rig work
                  </li>
                </ul>
                <p className="text-slate-400 text-sm mt-3">
                  On many commercial vessels, there may be few or no day workers. 
                  Maintenance then becomes overtime performed off watch.
                </p>
              </Card>

              <Card className="p-6 bg-slate-900/50 border-slate-800">
                <h3 className="text-lg font-semibold text-white mb-3">Mission Changes the Day</h3>
                <p className="text-slate-400 text-sm">
                  A tanker transiting the ocean is different than discharging cargo. A tug towing offshore 
                  is different than harbor assist. MSC UNREP operations differ from port loading. 
                  NOAA research differs from offshore supply work.
                </p>
                <p className="text-amber-400 text-sm mt-3 font-medium">
                  Different missions, same reality: you&apos;ll find a rhythm.
                </p>
              </Card>
            </div>
          </div>
        </motion.div>
      </section>

      <Separator className="max-w-7xl mx-auto bg-slate-800" />

      {/* Section 4: Rotations */}
      <section id="rotations" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 rounded-xl bg-violet-500/20 border border-violet-500/30">
              <Calendar className="w-8 h-8 text-violet-400" />
            </div>
            <div>
              <div className="text-sm text-violet-400 font-mono">04</div>
              <h2 className="text-3xl font-bold text-white">Time Away, Rotations & Schedules</h2>
            </div>
          </div>

          <p className="text-slate-300 leading-relaxed mb-8 max-w-3xl">
            Time away from home is one of the defining aspects of sailing. A rotation is time onboard followed by time off.
          </p>

          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2">
              <h3 className="text-lg font-semibold text-white mb-4">Common Rotations</h3>
              <div className="space-y-3">
                {ROTATIONS.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-slate-900/50 border border-slate-800 rounded-lg flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-lg font-bold text-violet-400 font-mono w-32">
                        {item.rotation}
                      </div>
                      <div className="text-sm text-slate-400">{item.typical}</div>
                    </div>
                    <Badge
                      className={`${
                        item.predictability === 'High'
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50'
                          : item.predictability === 'Medium'
                          ? 'bg-amber-500/20 text-amber-400 border-amber-500/50'
                          : 'bg-slate-500/20 text-slate-400 border-slate-500/50'
                      }`}
                    >
                      {item.predictability} predictability
                    </Badge>
                  </div>
                ))}
              </div>
              <p className="text-slate-500 text-sm mt-3">
                Some jobs allow mariners to go home at night.
              </p>
            </div>

            <div className="space-y-4">
              <Card className="p-6 bg-violet-500/10 border-violet-500/30">
                <h3 className="text-lg font-semibold text-white mb-3">Longer Rotations, Higher Pay</h3>
                <p className="text-slate-300 text-sm">
                  Generally: longer time onboard = more money. Shorter rotations trade income for predictability. 
                  Some prefer steady schedules. Others prefer long hitches with long breaks.
                </p>
              </Card>

              <Card className="p-6 bg-slate-900/50 border-slate-800">
                <h3 className="text-lg font-semibold text-white mb-3">How Preferences Change</h3>
                <p className="text-slate-400 text-sm">
                  Many mariners sail longer rotations when young, save money and build sea time, 
                  then transition to more predictable schedules — or leave sailing entirely.
                </p>
                <p className="text-violet-400 text-sm mt-3 font-medium">
                  Rotations shape relationships, finances and long-term plans.
                </p>
              </Card>
            </div>
          </div>
        </motion.div>
      </section>

      <Separator className="max-w-7xl mx-auto bg-slate-800" />

      {/* Section 5: Connectivity */}
      <section id="connectivity" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 rounded-xl bg-cyan-500/20 border border-cyan-500/30">
              <Wifi className="w-8 h-8 text-cyan-400" />
            </div>
            <div>
              <div className="text-sm text-cyan-400 font-mono">05</div>
              <h2 className="text-3xl font-bold text-white">Internet, Phones & Staying Connected</h2>
            </div>
          </div>

          <p className="text-slate-300 leading-relaxed mb-8 max-w-3xl">
            Connectivity varies widely. Many ships now use Starlink or similar systems, improving connectivity — but it&apos;s never guaranteed.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 bg-slate-900/50 border-slate-800">
              <h3 className="text-lg font-semibold text-white mb-3">Shipboard Internet</h3>
              <p className="text-slate-400 text-sm">
                On some ships, messaging and streaming work well. On others, bandwidth is limited and data caps apply. 
                It depends on the company, equipment, location and mission.
              </p>
            </Card>

            <Card className="p-6 bg-slate-900/50 border-slate-800">
              <h3 className="text-lg font-semibold text-white mb-3">Cell Service</h3>
              <p className="text-slate-400 text-sm">
                Inland and nearshore jobs often maintain normal cell service. 
                Offshore and international work does not.
              </p>
            </Card>

            <Card className="p-6 bg-slate-900/50 border-slate-800">
              <h3 className="text-lg font-semibold text-white mb-3">International Sailing</h3>
              <p className="text-slate-400 text-sm">
                Foreign-going vessels usually require international plans or local/regional eSIMs.
              </p>
            </Card>

            <Card className="p-6 bg-slate-900/50 border-slate-800">
              <h3 className="text-lg font-semibold text-white mb-3">Government Operations</h3>
              <p className="text-slate-400 text-sm">
                Some government or sensitive missions operate under communications restrictions or blackout conditions.
              </p>
            </Card>
          </div>

          <div className="mt-6 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
            <p className="text-slate-300 text-center">
              <span className="font-semibold text-white">Reality:</span> Connectivity is better than ever — but never guaranteed.
            </p>
          </div>
        </motion.div>
      </section>

      <Separator className="max-w-7xl mx-auto bg-slate-800" />

      {/* Section 6: Crew Size */}
      <section id="crew" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 rounded-xl bg-pink-500/20 border border-pink-500/30">
              <Users className="w-8 h-8 text-pink-400" />
            </div>
            <div>
              <div className="text-sm text-pink-400 font-mono">06</div>
              <h2 className="text-3xl font-bold text-white">Crew Size & Social Life</h2>
            </div>
          </div>

          <p className="text-slate-300 leading-relaxed mb-8 max-w-3xl">
            Who you sail with matters. Watchstanders spend most of their time with their own watch crew 
            and may rarely interact with the opposite watch.
          </p>

          <div className="grid lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Typical Crew Sizes</h3>
              <div className="space-y-4">
                {CREW_SIZES.map((crew, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-slate-900/50 border border-slate-800 rounded-lg flex items-center gap-4"
                  >
                    <div className="p-2 rounded-lg bg-pink-500/20">
                      <crew.icon className="w-6 h-6 text-pink-400" />
                    </div>
                    <div className="flex-1">
                      <div className="text-white font-medium">{crew.type}</div>
                    </div>
                    <div className="text-2xl font-bold text-pink-400 font-mono">
                      {crew.size}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <Card className="p-6 bg-slate-900/50 border-slate-800">
                <h3 className="text-lg font-semibold text-white mb-3">Social Dynamics</h3>
                <p className="text-slate-400 text-sm">
                  If you love your crew, life is great. If there&apos;s one person you can&apos;t stand — 
                  and every industry has one — confined spaces amplify that.
                </p>
              </Card>

              <Card className="p-6 bg-slate-900/50 border-slate-800">
                <h3 className="text-lg font-semibold text-white mb-3">Size Tradeoffs</h3>
                <p className="text-slate-400 text-sm">
                  Smaller crews mean closer relationships. Larger crews mean more anonymity.
                </p>
              </Card>

              <Card className="p-6 bg-pink-500/10 border-pink-500/30">
                <p className="text-slate-300 text-sm">
                  <span className="font-semibold text-white">Bottom line:</span> You don&apos;t have to like everyone — 
                  but professionalism matters.
                </p>
              </Card>
            </div>
          </div>
        </motion.div>
      </section>

      <Separator className="max-w-7xl mx-auto bg-slate-800" />

      {/* Section 7: Liberty */}
      <section id="liberty" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/30">
              <MapPin className="w-8 h-8 text-rose-400" />
            </div>
            <div>
              <div className="text-sm text-rose-400 font-mono">07</div>
              <h2 className="text-3xl font-bold text-white">Liberty, Ports & Getting Ashore</h2>
            </div>
          </div>

          <p className="text-slate-300 leading-relaxed mb-8 max-w-3xl">
            Ports are part of the job, not the job.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="p-6 bg-slate-900/50 border-slate-800">
              <h3 className="text-lg font-semibold text-white mb-3">Commercial Shipping</h3>
              <p className="text-slate-400 text-sm">
                Commercial ships often visit interesting places but stay briefly — 8 hours to 2 days is common. 
                Liberty depends on operations and watch schedules.
              </p>
            </Card>

            <Card className="p-6 bg-slate-900/50 border-slate-800">
              <h3 className="text-lg font-semibold text-white mb-3">Offshore & Rig Work</h3>
              <p className="text-slate-400 text-sm">
                Rig-related work usually means staying onsite for the duration of the hitch.
              </p>
            </Card>

            <Card className="p-6 bg-slate-900/50 border-slate-800">
              <h3 className="text-lg font-semibold text-white mb-3">Government Operations</h3>
              <p className="text-slate-400 text-sm">
                Some government vessels may remain in port 2–7 days, allowing more opportunity to get ashore, 
                though operations still come first.
              </p>
            </Card>
          </div>

          <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-lg">
            <p className="text-slate-300 text-center">
              <span className="font-semibold text-white">Reality:</span> Some mariners sail for years and rarely see ports. 
              Others explore regularly. Most fall somewhere in between.
            </p>
          </div>
        </motion.div>
      </section>

      <Separator className="max-w-7xl mx-auto bg-slate-800" />

      {/* Closing CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-xl text-slate-300 mb-4 max-w-3xl mx-auto">
            Life at sea is structured, demanding and highly variable. Understanding the tradeoffs early 
            helps you choose paths that match your goals — both onboard and ashore.
          </p>

          <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 mt-8">
            Continue Exploring
          </h2>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              {
                title: 'Careers & Sectors',
                desc: 'Find your path in the industry',
                href: '/maritime-101/careers-and-sectors',
                icon: Briefcase,
              },
              {
                title: 'Training & Entry',
                desc: 'How to get started',
                href: '/maritime-101/training-and-entry',
                icon: GraduationCap,
              },
              {
                title: 'Credentials',
                desc: 'Licenses and certifications',
                href: '/maritime-101/credentials',
                icon: Award,
              },
            ].map((cta, idx) => (
              <motion.div
                key={cta.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <Link href={cta.href}>
                  <Card className="p-6 md:p-8 bg-blue-600 border-blue-500 hover:bg-blue-700 transition-all hover:-translate-y-1 h-full">
                    <cta.icon className="w-8 h-8 text-white mb-4 mx-auto" />
                    <h3 className="text-lg font-semibold text-white mb-2">{cta.title}</h3>
                    <p className="text-sm text-blue-100">{cta.desc}</p>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>
    </div>
  );
}