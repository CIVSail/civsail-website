'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, useScroll, useSpring } from 'framer-motion';
import {
  Ship,
  Users,
  Scale,
  Target,
  Globe,
  Zap,
  Wheat,
  Shield,
  Container,
  Anchor,
  Database,
  Gauge,
  Waves,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Building2,
  BookOpen,
  Award,
  AlertCircle,
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

// Section IDs for navigation
const SECTIONS = [
  { id: 'overview', label: 'Overview', key: true },
  { id: 'what-it-does', label: 'What It Does', key: true },
  { id: 'sectors', label: 'Sectors', key: true },
  { id: 'players', label: 'Major Players', key: false },
  { id: 'fleet', label: 'The Fleet', key: false },
  { id: 'history', label: 'History', key: false },
  { id: 'why-matters', label: 'Why It Matters', key: true },
  { id: 'next-steps', label: 'Next Steps', key: false },
];

// Overview cards data
const OVERVIEW_CARDS = [
  {
    icon: Ship,
    title: 'Ships',
    desc: 'Commercial vessels transporting cargo, passengers, or supporting maritime operations globally',
  },
  {
    icon: Users,
    title: 'People',
    desc: 'Licensed officers and unlicensed crew working aboard vessels in specialized roles',
  },
  {
    icon: Scale,
    title: 'Rules',
    desc: 'International standards, flag state regulations, safety codes and port state control',
  },
  {
    icon: Target,
    title: 'Missions',
    desc: 'Global trade, energy transport, national security support and specialized maritime work',
  },
];

// Pillar cards data
const PILLARS = [
  {
    icon: Globe,
    title: 'Global Trade & Logistics',
    desc: 'Moving manufactured goods, raw materials and consumer products across oceans',
    example:
      'Container ships carry everything from electronics to clothing between manufacturing hubs and consumer markets. Bulk carriers move grain, ore and coal. Specialized vessels handle oversized cargo like wind turbine blades.',
  },
  {
    icon: Zap,
    title: 'Energy & Industrial Supply Chains',
    desc: 'Transporting oil, gas, chemicals and bulk commodities that power economies',
    example:
      'Tankers deliver crude oil to refineries and refined products to distribution terminals. LNG carriers move natural gas. Chemical tankers transport industrial feedstocks. Bulk carriers deliver coal and other energy commodities.',
  },
  {
    icon: Wheat,
    title: 'Food Systems & Resource Economy',
    desc: 'Supplying global food markets through agricultural and seafood transport',
    example:
      'Refrigerated vessels (reefers) carry produce, meat and dairy products. Bulk carriers transport grain, soybeans and animal feed. Commercial fishing fleets supply seafood markets and support coastal economies through regulated, specialized operations.',
  },
  {
    icon: Shield,
    title: 'National Security & Strategic Mobility',
    desc: 'Providing sealift capability and sustainment for military operations',
    example:
      'Military Sealift Command operates vessels that preposition equipment, deliver supplies to overseas bases and provide surge capacity during contingencies. The Ready Reserve Force maintains vessels that can activate within days for national emergencies.',
  },
];

// Fleet categories data
const FLEET_CATEGORIES = [
  {
    icon: Container,
    title: 'Containers',
    what: 'Manufactured goods, retail products, electronics',
    why: 'Enables global supply chains and just-in-time inventory',
  },
  {
    icon: Database,
    title: 'Bulk',
    what: 'Grain, ore, coal and other unpackaged commodities',
    why: 'Moves raw materials that feed industrial production',
  },
  {
    icon: Waves,
    title: 'Tankers',
    what: 'Crude oil, refined petroleum, chemicals, LNG',
    why: 'Powers refineries, factories and transportation systems',
  },
  {
    icon: Gauge,
    title: 'Ro-Ro',
    what: 'Vehicles, heavy equipment, military assets',
    why: 'Specialized handling for rolling cargo and oversized loads',
  },
  {
    icon: Zap,
    title: 'Offshore Support',
    what: 'Energy infrastructure, platform supply, construction support',
    why: 'Enables offshore oil, gas and renewable energy operations',
  },
  {
    icon: BookOpen,
    title: 'Research & Survey',
    what: 'Oceanographic data, seabed mapping, environmental monitoring',
    why: 'Advances scientific knowledge and supports climate research',
  },
  {
    icon: Anchor,
    title: 'Harbor Operations',
    what: 'Tugs, barges, pilot boats and coastal support',
    why: 'Keeps ports functioning and enables safe vessel movements',
  },
  {
    icon: Ship,
    title: 'Specialized',
    what: 'Cable layers, dredgers, icebreakers, salvage vessels',
    why: 'Handles unique maritime missions that standard ships cannot',
  },
];

// History events data
const HISTORY_EVENTS = [
  {
    year: '1914 & 1869',
    title: 'Strategic Canals',
    subtitle: 'Panama and Suez transform global trade routes',
    content:
      'The Panama Canal (1914) and Suez Canal (1869) eliminated weeks of travel time, creating chokepoints that still define maritime logistics today. Over 12% of global trade passes through Suez; 6% through Panama. Disruptions at either canal ripple through supply chains worldwide.',
  },
  {
    year: '1939-1945',
    title: 'WWII Merchant Mariners',
    subtitle: 'Civilian crews sustain Allied logistics under fire',
    content:
      'U.S. Merchant Mariners suffered the highest casualty rate of any service branch in WWII, delivering fuel, food and munitions to troops overseas. Their service demonstrated the strategic necessity of a capable civilian maritime workforce - a principle that shaped postwar maritime policy including the Jones Act and Reserve Fleet programs.',
  },
  {
    year: '1956',
    title: 'The Container Revolution',
    subtitle: 'Standardized boxes reshape global trade',
    content:
      'Malcolm McLean first container ship, the Ideal X, introduced standardized cargo boxes that could move seamlessly between ships, trucks and trains. This innovation slashed loading times from days to hours, reduced theft and damage, and enabled the just-in-time supply chains that define modern commerce.',
  },
  {
    year: '1920 & 1936',
    title: 'Merchant Marine Acts',
    subtitle: 'Policy foundations for U.S. maritime strength',
    content:
      'The Jones Act (1920) required domestic shipping between U.S. ports to use American-built, -owned, -crewed and -flagged vessels. The Merchant Marine Act of 1936 supported shipbuilding and training programs. Together, these laws aimed to maintain a viable domestic maritime industry capable of supporting national defense during wartime.',
  },
  {
    year: '2020-2022',
    title: 'COVID Crew Change Crisis',
    subtitle: 'Pandemic reveals workforce fragility',
    content:
      'Border closures stranded hundreds of thousands of seafarers aboard vessels beyond their contracted service periods - some for over a year. The crisis exposed how dependent global supply chains are on the free movement of maritime labor and highlighted the human cost when crews cannot rotate home on schedule.',
  },
  {
    year: '2021',
    title: 'Ever Given Blocks Suez',
    subtitle: 'One ship halts 12% of global trade',
    content:
      'When the container ship Ever Given ran aground in the Suez Canal, it blocked one of the world most critical shipping lanes for six days. The incident cost an estimated $10 billion per day in delayed cargo and reminded the public how fragile modern supply chains are when key maritime chokepoints fail.',
  },
  {
    year: '2020s',
    title: 'Modern Challenges',
    subtitle: 'Red Sea disruptions, supply chain fragility, climate',
    content:
      'Recent years have brought new pressures: piracy and instability disrupting Red Sea routes, semiconductor shortages exposing supply chain vulnerabilities, extreme weather threatening port operations, and growing demand for decarbonization in shipping. These challenges underscore the need for resilient maritime systems and skilled crews.',
  },
];

// Stats data
const STATS = [
  { number: '90%', label: 'of global trade moves by sea' },
  { number: '$150B+', label: 'U.S. maritime economy value' },
  { number: '40,000+', label: 'U.S. Merchant Mariners' },
];

// Why it matters blocks
const WHY_IT_MATTERS = [
  {
    icon: AlertCircle,
    title: 'Resilience',
    content:
      'Modern supply chains are fragile by design - optimized for cost, not disruption. Blocked canals, port strikes and crew shortages reveal how dependent society is on maritime systems working seamlessly. Building resilience requires investment in infrastructure, training and strategic capacity.',
    ctas: ['Careers', 'Credentials'],
  },
  {
    icon: Shield,
    title: 'National Capacity',
    content:
      'The United States maintains sealift capability through Military Sealift Command, the Ready Reserve Fleet and domestic maritime industries. This capacity matters during contingencies - but sustaining it requires a pipeline of skilled civilian mariners who can crew vessels when surge capacity is needed.',
    ctas: ['Training'],
  },
  {
    icon: Award,
    title: 'Career Opportunity',
    content:
      'Maritime careers offer strong pay, specialized skills and geographic mobility. The tradeoffs - time away from home, rotating schedules, physical demands - are real. But for those who thrive in maritime environments, the work provides stability, advancement pathways and a role in systems that power modern life.',
    ctas: ['Explore Careers', 'See Training Paths'],
  },
];

// CTA cards
const CTA_CARDS = [
  {
    title: 'Explore Careers & Sectors',
    desc: 'See what mariners do and where they work',
    href: '/maritime-101/careers-and-sectors',
    primary: true,
  },
  {
    title: 'Credentials Roadmap',
    desc: 'Understand licenses, training and requirements',
    href: '/maritime-101/credentials',
    primary: false,
  },
  {
    title: 'Training & Entry Pathways',
    desc: 'Learn how to get started in maritime',
    href: '/maritime-101/training-and-entry',
    primary: false,
  },
];

// Tools teaser
const TOOLS_TEASER = [
  {
    title: 'Credential Reminders',
    desc: 'Never miss a renewal deadline again',
  },
  { title: 'Sea Time Tracking', desc: 'Log time toward license upgrades' },
  { title: 'Upgrade Planner', desc: 'Map your path to the next credential' },
];

// International companies
const INTL_COMPANIES = ['Maersk', 'MSC', 'CMA CGM', 'Hapag-Lloyd', 'Cosco'];

// Domestic companies
const DOMESTIC_COMPANIES = ['Matson', 'Crowley', 'Kirby', 'Foss Maritime'];

// Unions
const UNIONS = [
  {
    name: 'AMO',
    full: 'American Maritime Officers',
    role: 'Licensed deck and engine officers',
  },
  {
    name: 'MEBA',
    full: 'Marine Engineers Beneficial Association',
    role: 'Licensed marine engineers',
  },
  {
    name: 'SIU',
    full: 'Seafarers International Union',
    role: 'Unlicensed ratings and entry-level crew',
  },
];

// Regulators
const REGULATORS = [
  {
    name: 'USCG / NMC',
    desc: 'Issues U.S. Merchant Mariner Credentials and enforces vessel safety standards',
  },
  {
    name: 'IMO / STCW',
    desc: 'International Maritime Organization sets global standards for seafarer training and certification',
  },
  {
    name: 'MARAD',
    desc: 'U.S. Maritime Administration supports industry policy, training programs and strategic sealift',
  },
  {
    name: 'Port State Control',
    desc: 'Inspection regimes that verify vessel compliance with international safety and labor standards',
  },
];

export default function WhatIsMerchantMarinePage() {
  const [activeSection, setActiveSection] = useState('overview');
  const [showAllNavSections, setShowAllNavSections] = useState(false);
  const [showStickyCTA, setShowStickyCTA] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Track active section with IntersectionObserver
  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    SECTIONS.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (!element) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSection(id);
            }
          });
        },
        { rootMargin: '-20% 0px -70% 0px' }
      );

      observer.observe(element);
      observers.push(observer);
    });

    return () => observers.forEach((obs) => obs.disconnect());
  }, []);

  // Show sticky CTA after 50% scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPercent =
        (window.scrollY /
          (document.documentElement.scrollHeight - window.innerHeight)) *
        100;
      setShowStickyCTA(scrollPercent > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const visibleNavSections = showAllNavSections
    ? SECTIONS
    : SECTIONS.filter((s) => s.key);

  const getCtaHref = (cta: string) => {
    if (cta === 'Careers' || cta === 'Explore Careers')
      return '/maritime-101/careers-and-sectors';
    if (cta === 'Credentials') return '/maritime-101/credentials';
    if (cta === 'Training' || cta === 'See Training Paths')
      return '/maritime-101/training-and-entry';
    return '#';
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Progress Indicator */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-blue-500 origin-left z-50"
        style={{ scaleX }}
      />

      {/* Sticky Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <button
              onClick={scrollToTop}
              className="text-slate-400 hover:text-white transition-colors"
              aria-label="Back to top"
            >
              <ChevronUp className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-6 overflow-x-auto scrollbar-hide">
              {visibleNavSections.map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => scrollToSection(id)}
                  className={`text-sm font-medium whitespace-nowrap transition-colors pb-0.5 border-b-2 ${
                    activeSection === id
                      ? 'text-white border-blue-500'
                      : 'text-slate-400 hover:text-white border-transparent'
                  }`}
                >
                  {label}
                </button>
              ))}

              <button
                onClick={() => setShowAllNavSections(!showAllNavSections)}
                className="text-sm font-medium text-slate-400 hover:text-white transition-colors flex items-center gap-1"
              >
                {showAllNavSections ? (
                  <>
                    Less <ChevronUp className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    More <ChevronDown className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <nav className="flex items-center text-sm text-slate-400">
          <Link href="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link
            href="/maritime-101"
            className="hover:text-white transition-colors"
          >
            Maritime 101
          </Link>
          <span className="mx-2">/</span>
          <span className="text-white">What is the Merchant Marine?</span>
        </nav>
      </div>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl"
        >
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            The Invisible Fleet
            <br />
            That Moves the World
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 mb-12 leading-relaxed">
            The Merchant Marine is the global network of commercial vessels,
            crews and systems that move 90% of world trade. In the United
            States, it includes both international operators and the domestic
            fleet serving American ports - a vital workforce that CIVSail helps
            navigate their careers.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/maritime-101/careers-and-sectors">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Explore Careers
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              onClick={() => scrollToSection('sectors')}
              className="border-slate-700 hover:bg-slate-800"
            >
              See the Industry Map
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Overview Section */}
      <section
        id="overview"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
      >
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold mb-4">
            The Merchant Marine in One Minute
          </h2>
          <p className="text-lg text-slate-300 mb-12 max-w-3xl">
            Four fundamental concepts that explain how this industry works
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {OVERVIEW_CARDS.map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="p-6 bg-slate-900 border-slate-800 hover:border-blue-500/50 transition-all hover:-translate-y-1">
                  <item.icon className="w-8 h-8 text-blue-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2 text-white">
                    {item.title}
                  </h3>
                  <p className="text-slate-400 text-sm">{item.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-8">
            <h3 className="text-lg font-semibold mb-3 text-white flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-blue-400" />
              Why Most People Never Notice It
            </h3>
            <p className="text-slate-300 leading-relaxed">
              The Merchant Marine works best when it is invisible. Ships arrive
              on schedule, store shelves stay stocked, fuel flows to refineries
              and power plants. Only when disruptions occur - blocked canals,
              port strikes, crew shortages - does the public glimpse how
              dependent modern life is on this seamless global system.
            </p>
          </div>
        </motion.div>
      </section>

      <Separator className="max-w-7xl mx-auto bg-slate-800" />

      {/* What It Does Section */}
      <section
        id="what-it-does"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
      >
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold mb-4">What It Does</h2>
          <p className="text-lg text-slate-300 mb-12 max-w-3xl">
            Four core functions that define modern maritime operations
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {PILLARS.map((pillar, idx) => (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="p-8 bg-slate-900 border-slate-800 h-full">
                  <pillar.icon className="w-10 h-10 text-blue-400 mb-4" />
                  <h3 className="text-2xl font-semibold mb-2 text-white">
                    {pillar.title}
                  </h3>
                  <p className="text-white mb-4">{pillar.desc}</p>

                  <Accordion type="single" collapsible>
                    <AccordionItem value="example" className="border-slate-800">
                      <AccordionTrigger className="text-sm text-blue-400 hover:text-blue-300">
                        What this looks like in real life
                      </AccordionTrigger>
                      <AccordionContent className="text-slate-400 text-sm leading-relaxed pt-2">
                        {pillar.example}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      <Separator className="max-w-7xl mx-auto bg-slate-800" />

      {/* Sectors Section */}
      <section
        id="sectors"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
      >
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold mb-4">
            Industry Map: Where Mariners Work
          </h2>
          <p className="text-lg text-slate-300 mb-12 max-w-3xl">
            Three major sectors with distinct operations, regulations and career
            paths
          </p>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* International */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <Card className="p-8 bg-slate-900 border-slate-800 hover:border-blue-500/50 transition-all h-full flex flex-col">
                <Globe className="w-12 h-12 text-blue-400 mb-6" />
                <h3 className="text-2xl font-bold mb-3 text-white">
                  International / Global Trade
                </h3>

                <div className="space-y-4 mb-6 flex-1">
                  <div>
                    <h4 className="font-semibold text-white mb-2">
                      What it is
                    </h4>
                    <p className="text-slate-400 text-sm">
                      Vessels operating under various flags, moving cargo
                      between international ports on scheduled liner services or
                      flexible tramp routes
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">
                      Where it operates
                    </h4>
                    <p className="text-slate-400 text-sm">
                      Worldwide trade routes connecting manufacturing hubs,
                      commodity sources and consumer markets across all oceans
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">
                      Who works here
                    </h4>
                    <p className="text-slate-400 text-sm">
                      Deck officers, engineering officers, unlicensed ratings
                      and specialized crew on container ships, tankers, bulk
                      carriers
                    </p>
                  </div>
                </div>

                <Link href="/maritime-101/sectors/international">
                  <Button
                    variant="outline"
                    className="w-full border-slate-700 hover:bg-slate-800"
                  >
                    Explore International
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </Card>
            </motion.div>

            {/* Domestic */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <Card className="p-8 bg-slate-900 border-slate-800 hover:border-blue-500/50 transition-all h-full flex flex-col">
                <Anchor className="w-12 h-12 text-blue-400 mb-6" />
                <h3 className="text-2xl font-bold mb-3 text-white">
                  Domestic / Cabotage Markets
                </h3>

                <div className="space-y-4 mb-6 flex-1">
                  <div>
                    <h4 className="font-semibold text-white mb-2">
                      What it is
                    </h4>
                    <p className="text-slate-400 text-sm">
                      U.S.-flagged vessels operating between American ports
                      under Jones Act requirements (built, owned, crewed and
                      flagged domestically)
                    </p>
                  </div>

                  <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                    <h4 className="font-semibold text-white mb-2 text-sm">
                      Jones Act Quick Facts
                    </h4>
                    <ul className="text-xs text-slate-400 space-y-1">
                      <li>
                        Protects domestic maritime workforce and shipbuilding
                      </li>
                      <li>Requires U.S. crew on domestic routes</li>
                      <li>Maintains strategic sealift capacity</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-white mb-2">
                      Who works here
                    </h4>
                    <p className="text-slate-400 text-sm">
                      U.S. Merchant Mariners on tankers, container ships, tugs,
                      barges, ferries and offshore support vessels
                    </p>
                  </div>
                </div>

                <Link href="/maritime-101/sectors/domestic">
                  <Button
                    variant="outline"
                    className="w-full border-slate-700 hover:bg-slate-800"
                  >
                    Explore Domestic
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </Card>
            </motion.div>

            {/* Government */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-8 bg-slate-900 border-slate-800 hover:border-blue-500/50 transition-all h-full flex flex-col">
                <Shield className="w-12 h-12 text-blue-400 mb-6" />
                <h3 className="text-2xl font-bold mb-3 text-white">
                  Public Service & Government-Adjacent
                </h3>

                <div className="space-y-4 mb-6 flex-1">
                  <div>
                    <h4 className="font-semibold text-white mb-2">
                      What it is
                    </h4>
                    <p className="text-slate-400 text-sm">
                      Federal agencies operating vessels for military support,
                      scientific research, environmental monitoring and maritime
                      logistics
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">
                      Where it operates
                    </h4>
                    <p className="text-slate-400 text-sm">
                      Worldwide military support (MSC), U.S. waters and oceans
                      (NOAA), research missions, survey operations
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">
                      Who works here
                    </h4>
                    <p className="text-slate-400 text-sm">
                      CIVMARs (civilian mariners) on MSC vessels, NOAA Corps
                      officers and crew, research vessel personnel
                    </p>
                  </div>
                </div>

                <Link href="/maritime-101/sectors/government">
                  <Button
                    variant="outline"
                    className="w-full border-slate-700 hover:bg-slate-800"
                  >
                    Explore Government
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </section>

      <Separator className="max-w-7xl mx-auto bg-slate-800" />

      {/* Major Players Section */}
      <section
        id="players"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
      >
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold mb-4">Major Players</h2>
          <p className="text-lg text-slate-300 mb-12 max-w-3xl">
            Companies run ships, labor crews ships, regulators set the rules
          </p>

          {/* Ecosystem Visual */}
          <div className="mb-16 relative">
            <div className="flex items-center justify-center mb-12">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500/20 blur-3xl"></div>
                <div className="relative bg-slate-900 border-2 border-blue-500 rounded-2xl p-8">
                  <Ship className="w-16 h-16 text-blue-400 mx-auto" />
                  <p className="text-center text-sm font-semibold mt-4 text-white">
                    The Ship
                  </p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Operators */}
              <Card className="p-6 bg-slate-900 border-slate-800">
                <Building2 className="w-8 h-8 text-blue-400 mb-4" />
                <h3 className="text-xl font-semibold mb-4 text-white">
                  Operators & Companies
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold text-white mb-2">
                      International
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {INTL_COMPANIES.map((company) => (
                        <Badge
                          key={company}
                          variant="outline"
                          className="border-slate-700 text-slate-400"
                        >
                          {company}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white mb-2">
                      U.S. Domestic
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {DOMESTIC_COMPANIES.map((company) => (
                        <Badge
                          key={company}
                          variant="outline"
                          className="border-slate-700 text-slate-400"
                        >
                          {company}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 italic">
                    Examples, not exhaustive
                  </p>
                </div>
              </Card>

              {/* Labor */}
              <Card className="p-6 bg-slate-900 border-slate-800">
                <Users className="w-8 h-8 text-blue-400 mb-4" />
                <h3 className="text-xl font-semibold mb-4 text-white">
                  Crewing & Labor
                </h3>
                <div className="space-y-3">
                  {UNIONS.map((union) => (
                    <div
                      key={union.name}
                      className="border-l-2 border-blue-500 pl-3"
                    >
                      <h4 className="font-semibold text-sm text-white">
                        {union.name}{' '}
                        <span className="text-slate-500 font-normal text-xs">
                          ({union.full})
                        </span>
                      </h4>
                      <p className="text-xs text-slate-400">{union.role}</p>
                    </div>
                  ))}
                  <Link href="/maritime-101/training-and-entry#unions">
                    <Button
                      variant="link"
                      className="text-blue-400 hover:text-blue-300 p-0 h-auto text-xs"
                    >
                      Learn how maritime hiring works
                    </Button>
                  </Link>
                </div>
              </Card>

              {/* Regulators */}
              <Card className="p-6 bg-slate-900 border-slate-800">
                <Scale className="w-8 h-8 text-blue-400 mb-4" />
                <h3 className="text-xl font-semibold mb-4 text-white">
                  Regulatory & Standards
                </h3>
                <div className="space-y-3">
                  {REGULATORS.map((org) => (
                    <div
                      key={org.name}
                      className="border-l-2 border-slate-700 pl-3"
                    >
                      <h4 className="font-semibold text-sm text-white">
                        {org.name}
                      </h4>
                      <p className="text-xs text-slate-400 mt-1">{org.desc}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </motion.div>
      </section>

      <Separator className="max-w-7xl mx-auto bg-slate-800" />

      {/* Fleet Section */}
      <section
        id="fleet"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
      >
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold mb-4">The Fleet Is a System</h2>
          <p className="text-lg text-white mb-4 max-w-3xl">
            Understanding shipping through functional categories, not individual
            vessel types
          </p>
          <p className="text-sm text-slate-400 mb-12 max-w-3xl">
            This section provides the mental model. For specific ship classes
            and real examples, see our ship pages.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {FLEET_CATEGORIES.map((category, idx) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card className="p-5 bg-slate-900 border-slate-800 hover:border-blue-500/50 transition-all h-full">
                  <category.icon className="w-7 h-7 text-blue-400 mb-3" />
                  <h3 className="text-lg font-semibold mb-2 text-white">
                    {category.title}
                  </h3>
                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-slate-300 font-medium">
                        What moves:
                      </span>
                      <p className="text-slate-400">{category.what}</p>
                    </div>
                    <div>
                      <span className="text-slate-300 font-medium">
                        Why it matters:
                      </span>
                      <p className="text-slate-400">{category.why}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Link href="/ships">
              <Button
                variant="outline"
                size="lg"
                className="border-slate-700 hover:bg-slate-800"
              >
                Explore ship types and real examples
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      <Separator className="max-w-7xl mx-auto bg-slate-800" />

      {/* History Section */}
      <section
        id="history"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
      >
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold mb-4">Maritime History</h2>
          <p className="text-lg text-slate-300 mb-12 max-w-3xl">
            Key moments that shaped modern shipping - from canals to containers
            to crew change crises
          </p>

          <div className="space-y-6">
            {HISTORY_EVENTS.map((event, idx) => (
              <motion.div
                key={event.year}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
              >
                <Dialog>
                  <DialogTrigger asChild>
                    <button className="w-full text-left group">
                      <Card className="p-6 bg-slate-900 border-slate-800 hover:border-blue-500/50 transition-all hover:-translate-y-0.5">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0">
                            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50">
                              {event.year}
                            </Badge>
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold mb-1 text-white group-hover:text-blue-400 transition-colors">
                              {event.title}
                            </h3>
                            <p className="text-slate-400 text-sm">
                              {event.subtitle}
                            </p>
                          </div>
                          <ArrowRight className="w-5 h-5 text-slate-600 group-hover:text-blue-400 transition-colors flex-shrink-0" />
                        </div>
                      </Card>
                    </button>
                  </DialogTrigger>
                  <DialogContent className="bg-slate-900 border-slate-800 text-white max-w-2xl">
                    <DialogHeader>
                      <div className="mb-2">
                        <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50">
                          {event.year}
                        </Badge>
                      </div>
                      <DialogTitle className="text-2xl">
                        {event.title}
                      </DialogTitle>
                      <DialogDescription className="text-slate-400 text-base">
                        {event.subtitle}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="text-slate-300 leading-relaxed mt-4">
                      {event.content}
                    </div>
                  </DialogContent>
                </Dialog>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      <Separator className="max-w-7xl mx-auto bg-slate-800" />

      {/* Why It Matters Section */}
      <section
        id="why-matters"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
      >
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold mb-4">Why It Matters Now</h2>
          <p className="text-lg text-slate-300 mb-12 max-w-3xl">
            Three reasons maritime careers and maritime strength matter in 2025
          </p>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {STATS.map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="text-center p-8 bg-slate-900 border border-slate-800 rounded-xl"
              >
                <div className="text-5xl font-bold text-blue-400 mb-2">
                  {stat.number}
                </div>
                <div className="text-slate-400 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {WHY_IT_MATTERS.map((block, idx) => (
              <motion.div
                key={block.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="p-8 bg-slate-900 border-slate-800 h-full flex flex-col">
                  <block.icon className="w-10 h-10 text-blue-400 mb-4" />
                  <h3 className="text-2xl font-semibold mb-4 text-white">
                    {block.title}
                  </h3>
                  <p className="text-slate-300 leading-relaxed mb-6 flex-1">
                    {block.content}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {block.ctas.map((cta) => (
                      <Link key={cta} href={getCtaHref(cta)}>
                        <Badge
                          variant="outline"
                          className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10 cursor-pointer"
                        >
                          {cta}
                        </Badge>
                      </Link>
                    ))}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      <Separator className="max-w-7xl mx-auto bg-slate-800" />

      {/* Next Steps Section */}
      <section
        id="next-steps"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
      >
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-4xl font-bold mb-4">Ready to Explore?</h2>
          <p className="text-lg text-slate-300 mb-12 max-w-2xl mx-auto">
            Whether you are considering a maritime career or just learning how
            the system works, here is where to go next
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {CTA_CARDS.map((cta, idx) => (
              <motion.div
                key={cta.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <Link href={cta.href}>
                  <Card className="p-8 h-full transition-all hover:-translate-y-1 bg-blue-600 border-blue-500 hover:bg-blue-700">
                    <h3 className="text-xl font-semibold mb-2 text-white">
                      {cta.title}
                    </h3>
                    <p className="text-sm text-white mb-4">{cta.desc}</p>
                    <div className="flex items-center justify-center text-sm font-medium">
                      Learn More
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Tools Teaser */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 max-w-3xl mx-auto">
            <h3 className="text-xl font-semibold mb-4 text-white">
              CIVSAIL Tools{' '}
              <Badge className="ml-2 bg-blue-500/20 text-blue-400 border-blue-500/50">
                Coming Soon
              </Badge>
            </h3>
            <p className="text-slate-400 mb-6 leading-relaxed">
              We are building tools to help mariners manage their careers more
              effectively:
            </p>
            <div className="grid sm:grid-cols-3 gap-4 text-sm">
              {TOOLS_TEASER.map((tool) => (
                <div
                  key={tool.title}
                  className="text-left border-l-2 border-blue-500 pl-4"
                >
                  <div className="font-semibold text-white">{tool.title}</div>
                  <div className="text-slate-400 text-xs mt-1">{tool.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Sticky CTA Bar */}
      {showStickyCTA && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-xl border-t border-slate-800 py-4 z-40"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <p className="font-semibold text-white">
                  Ready to explore maritime careers?
                </p>
                <p className="text-sm text-slate-400">
                  See what mariners do and where they work
                </p>
              </div>
              <Link href="/maritime-101/careers-and-sectors">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  Explore Careers
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
