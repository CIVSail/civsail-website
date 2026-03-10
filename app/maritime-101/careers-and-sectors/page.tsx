'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  motion,
  useScroll,
  useSpring,
  useInView,
  AnimatePresence,
} from 'framer-motion';
import {
  Compass,
  Anchor,
  Ship,
  Globe,
  Shield,
  Zap,
  Wrench,
  ChefHat,
  ChevronUp,
  ChevronDown,
  ArrowRight,
  ArrowUp,
  DollarSign,
  Clock,
  Award,
  Users,
  GraduationCap,
  Navigation,
  X,
  Fuel,
  Building2,
  Waves,
  Fish,
  Sailboat,
  Radio,
  Briefcase,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

// Career categories - restructured with entry → advanced order
const CAREER_CATEGORIES = [
  {
    id: 'licensed-deck',
    title: 'Licensed Deck',
    subtitle: 'Officers of the Watch',
    icon: Compass,
    color: 'blue',
    description:
      'Licensed deck officers hold USCG credentials authorizing them to serve as officers in charge of a navigational watch. This is the required path to become a Master.',
    requirements:
      'Maritime academy degree or hawsepipe progression, USCG license, STCW certification',
    roles: [
      {
        title: 'Third Mate / Third Officer',
        salary: '$70,000 - $110,000',
        years: '0-5',
        description:
          'Your first licensed position. You have earned your credential and are now responsible for standing a navigational watch.',
        duties: [
          'Stand navigational watch',
          'Maintain firefighting and lifesaving equipment',
          'Conduct safety drills and training',
          'Manage navigation charts and publications',
          'Supervise deck crew during watch',
        ],
        nextStep:
          'Accumulate sea time and endorsements to sit for Second Mate exam',
      },
      {
        title: 'Second Mate / Second Officer',
        salary: '$90,000 - $140,000',
        years: '4-6',
        description:
          'The navigation officer. You own the bridge equipment, charts, and publications. Safety and medical responsibilities expand.',
        duties: [
          'Stand navigation watch',
          'Maintain all navigation equipment',
          'Update charts and voyage planning',
          'Increased general responsibility',
          'Manage safety equipment inventories',
        ],
        nextStep: 'Take exams and accumulate sea time for Chief Mate license',
      },
      {
        title: 'Chief Mate / Chief Officer',
        salary: '$120,000 - $200,000',
        years: '6-15',
        description:
          'Second in command. You run the deck department, oversee cargo operations, and are responsible for maintenance and crew management.',
        duties: [
          'Stand navigation watch',
          'Supervise all cargo operations',
          'Manage deck department personnel',
          'Oversee vessel maintenance program',
          'Serve as safety officer',
          'Relieve Master as needed',
        ],
        nextStep:
          'Accumulate sea time to earn Masters license and command of a vessel',
      },
      {
        title: 'Master / Captain',
        salary: '$150,000 - $300,000+',
        years: '10-20+',
        description:
          'Ultimate authority aboard. You are responsible for the vessel, crew, cargo, and safe navigation. The buck stops with you.',
        duties: [
          'Command overall vessel operations',
          'Final authority on all decisions',
          'Interface with charterers, agents, authorities',
          'Ensure regulatory compliance',
          'Manage vessel budget and crew',
          'Navigate in restricted waters and during emergencies',
        ],
        nextStep:
          'Continue building experience, mentor junior officers, transition to shore-side leadership or retire.',
      },
    ],
  },
  {
    id: 'unlicensed-deck',
    title: 'Unlicensed Deck',
    subtitle: 'Ratings & Skilled Seafarers',
    icon: Anchor,
    color: 'sky',
    description:
      'Unlicensed deck personnel are the backbone of deck operations. Starting as an Ordinary Seaman, you will learn seamanship fundamentals and can progress to officer positions or more advanced unlicensed roles like Bosun.',
    requirements:
      'MMC with appropriate endorsements, TWIC, Basic Safety Training (BST)',
    roles: [
      {
        title: 'Ordinary Seaman (OS)',
        salary: '$40,000 - $80,000',
        years: '0-2',
        description:
          'Entry position. You are learning the fundamentals of seamanship while supporting the deck department in daily operations.',
        duties: [
          'Stand lookout watches',
          'Assist with mooring operations',
          'Chip, paint, and preserve the vessel',
          'Learn knots, splicing, and line handling',
          'Assist ABs with maintenance tasks',
          'Keep decks and spaces clean',
        ],
        nextStep:
          'Accumulate sea days and take classes necessary for AB endorsement',
      },
      {
        title: 'Able Seaman (AB)',
        salary: '$60,000 - $100,000',
        years: '2-8',
        description:
          'Qualified rating. You can stand helm watches, work independently, and are proficient in all aspects of deck seamanship.',
        duties: [
          'Stand helm and lookout watches',
          'Lead mooring stations',
          'Operate deck machinery (cranes, winches)',
          'Perform skilled maintenance work',
          'Assist with cargo operations',
          'Train and mentor Ordinary Seamen',
        ],
        nextStep:
          'Build experience toward Bosun or begin studying for Third Mate license',
      },
      {
        title: 'Bosun (Boatswain)',
        salary: '$85,000 - $120,000',
        years: '8-15',
        description:
          "Senior unlicensed deck position. You lead the deck gang, coordinate all maintenance, and are the Chief Mate's right hand.",
        duties: [
          'Supervise all unlicensed deck personnel',
          'Plan and coordinate maintenance work',
          'Manage deck stores and supplies',
          'Lead mooring and anchoring operations',
          'Ensure deck safety compliance',
          'Train crew in seamanship skills',
        ],
        nextStep:
          'Many Bosuns continue in this role for career; others pursue Third Mate license via hawsepipe',
      },
    ],
  },
  {
    id: 'licensed-engine',
    title: 'Licensed Engine',
    subtitle: 'Engineering Officers',
    icon: Wrench,
    color: 'amber',
    description:
      'Licensed engineers hold USCG credentials for operation and maintenance of propulsion and auxiliary machinery. From learning systems as a Third to running the entire engineering plant as Chief, this path rewards technical expertise with premium compensation.',
    requirements:
      'Maritime academy degree or hawsepipe progression, USCG engineering license, STCW certification',
    roles: [
      {
        title: 'Third Assistant Engineer',
        salary: '$70,000 - $110,000',
        years: '0-5',
        description:
          'Your first licensed engineering position. You stand watches, learn the plant, and build the foundation for your engineering career.',
        duties: [
          'Stand engine room watch',
          'Monitor and log plant parameters',
          'Perform routine maintenance tasks',
          'Assist with repairs under supervision',
          'Maintain assigned machinery spaces',
          'Learn vessel-specific systems',
        ],
        nextStep: 'Accumulate sea time for Second Assistant Engineer',
      },
      {
        title: 'Second Assistant Engineer',
        salary: '$90,000 - $140,000',
        years: '4-8',
        description:
          'Growing responsibility. You typically own auxiliary systems, boilers, or specific machinery groups depending on vessel type.',
        duties: [
          'Stand engine room watch',
          'Maintain boilers and steam systems',
          'Manage auxiliary machinery maintenance',
          'Supervise engine room ratings',
          'Coordinate with deck on cargo systems',
          'Order parts and manage inventory',
        ],
        nextStep:
          'Build experience and take classes necessary for First Assistant Engineer license',
      },
      {
        title: 'First Assistant Engineer',
        salary: '$120,000 - $200,000',
        years: '10-15',
        description:
          'Second in the engine department. You manage the main engine, coordinate all maintenance, and run the department day-to-day.',
        duties: [
          'Stand engine room watch',
          'Maintain main propulsion machinery',
          'Supervise all engine department personnel',
          'Manage maintenance schedules and records',
          'Coordinate with Chief on budget and repairs',
          'Relieve Chief Engineer as needed',
        ],
        nextStep:
          'Prepare for Chief Engineer license and command of the engine department',
      },
      {
        title: 'Chief Engineer',
        salary: '$150,000 - $280,000',
        years: '10-20+',
        description:
          'Head of the engineering department. You are responsible for all machinery, fuel management, and your engineering team.',
        duties: [
          'Overall responsibility for engineering plant',
          'Manage department budget and repairs',
          'Interface with office, contractors and authorities',
          'Ensure regulatory compliance',
          'Lead major repairs and drydock planning',
          'Mentor and develop engineering officers',
        ],
        nextStep:
          'Continue building expertise, transition to shore-side technical management, or retire.',
      },
    ],
  },
  {
    id: 'unlicensed-engine',
    title: 'Unlicensed Engine',
    subtitle: 'Engine Ratings & Support',
    icon: Fuel,
    color: 'orange',
    description:
      'Unlicensed engine personnel maintain and operate machinery under engineer supervision. Starting as a Wiper, you learn the engine room from the bilges up. With sea time and study, you can advance to QMED ratings or pursue engineering licenses.',
    requirements:
      'MMC with entry rating or QMED endorsement, TWIC, Basic Safety Training',
    roles: [
      {
        title: 'Wiper',
        salary: '$40,000 - $80,000',
        years: '0-2',
        description:
          'Entry engine department position. You learn the machinery spaces while keeping them clean and assisting with basic maintenance.',
        duties: [
          'Clean engine room spaces and bilges',
          'Paint and preserve machinery',
          'Assist Oilers with maintenance',
          'Learn engine room layout and systems',
          'Handle tools and parts for engineers',
          'Dispose of waste oil and oily rags properly',
        ],
        nextStep: 'Accumulate sea time to qualify for Oiler or QMED rating',
      },
      {
        title: 'Oiler',
        salary: '$60,000 - $85,000',
        years: '2-5',
        description:
          'Engine room watchstander. You monitor machinery, take readings, and ensure proper lubrication of all equipment.',
        duties: [
          'Stand engine room watches',
          'Take hourly machinery readings',
          'Check and maintain oil levels',
          'Monitor pumps, motors, and auxiliaries',
          'Assist engineers with maintenance',
          'Respond to alarms and abnormalities',
        ],
        nextStep:
          'Qualify for QMED endorsements through sea time and examination',
      },
      {
        title: 'QMED (Qualified Member Engine Department)',
        salary: '$70,000 - $100,000',
        years: '5-12',
        description:
          'Specialized engine rating. QMEDs hold endorsements in specific areas: Electrician, Refrigeration, Pumpman, Machinist, or Junior Engineer.',
        duties: [
          'Perform specialized maintenance in rating area',
          'Stand watches as qualified',
          'Troubleshoot systems in specialty',
          'Train junior ratings',
          'Work independently on assigned equipment',
          'Support major repairs and overhauls',
        ],
        nextStep:
          'Many continue as QMED; others pursue Third Assistant Engineer license via hawsepipe',
      },
    ],
  },
  {
    id: 'other-positions',
    title: 'Other Positions',
    subtitle: 'Steward, Supply, Communications & Specialty',
    icon: Users,
    color: 'emerald',
    description:
      'Essential shipboard roles beyond traditional deck and engine departments. These positions vary significantly by company, ship type, and sector. Large vessels, cruise ships, and specialized operations may have positions not found on standard cargo ships.',
    requirements:
      'Varies by position - culinary credentials, medical certifications, supply chain experience, or specialized training',
    note: 'Positions and titles vary by company, vessel type, and sector. Not all vessels carry all positions.',
    roles: [
      {
        title: 'Steward Utility (SU)',
        salary: '$38,000 - $75,000',
        years: '0-3',
        description:
          'Entry steward department position. You support galley operations and maintain crew accommodations and common areas.',
        duties: [
          'Assist with food preparation',
          'Serve meals in mess rooms',
          'Clean galley, mess, and accommodations',
          'Maintain laundry facilities',
          'Stock provisions and supplies',
          'Support Chief Cook as directed',
        ],
        nextStep: 'Develop culinary skills to advance to Cook or Chief Cook',
      },
      {
        title: 'Chief Cook',
        salary: '$55,000 - $85,000',
        years: '3-10',
        description:
          'Head of galley operations. You plan menus, prepare meals for the crew, and manage food inventory.',
        duties: [
          'Plan and prepare all crew meals',
          'Manage food inventory and ordering',
          'Maintain galley sanitation standards',
          'Accommodate dietary restrictions',
          'Supervise steward utilities',
          'Control food costs within budget',
        ],
        nextStep:
          'Advance to Chief Steward on larger vessels or specialized operations',
      },
      {
        title: 'Chief Steward',
        salary: '$75,000 - $105,000',
        years: '10-15',
        description:
          'Department head on larger vessels. You manage all hotel services including galley, accommodations, and stores.',
        duties: [
          'Supervise steward department personnel',
          'Manage all provisions and stores',
          'Coordinate with port agents for supplies',
          'Maintain department budget',
          'Ensure health and sanitation compliance',
          'Handle crew welfare and accommodations',
        ],
        nextStep:
          'Continue in role or transition to shore-side hospitality management',
      },
      {
        title: 'Supply Officer / Storekeeper',
        salary: '$85,000 - $135,000',
        years: '3-10',
        description:
          'Manages vessel stores, spare parts, and procurement. Common on government vessels (MSC).',
        duties: [
          'Maintain inventory of all ship stores',
          'Process requisitions and procurement',
          'Coordinate deliveries with agents',
          'Track and control supplies budget',
          'Manage bonded stores and customs',
          'Maintain inventory management systems',
        ],
        nextStep: 'Advance to senior supply roles or shore-side logistics',
      },
      {
        title: 'Purser',
        salary: '$65,000 - $120,000',
        years: '3-10',
        description:
          'Administrative officer handling payroll, customs documentation, and passenger services. Common on passenger vessels and ferries.',
        duties: [
          'Process crew payroll and accounts',
          'Handle customs and immigration paperwork',
          'Manage passenger manifests and ticketing',
          'Maintain ship certificates and documents',
          'Coordinate with port authorities',
          'Handle cash and ship funds',
        ],
        nextStep: 'Advance to senior purser or shore-side administration',
      },
      {
        title: 'Radio Officer / Communications',
        salary: '$60,000 - $125,000',
        years: '3-12',
        description:
          'Electronics and communications specialist. Maintains GMDSS equipment and IT systems on modern vessels.',
        duties: [
          'Maintain GMDSS radio equipment',
          'Handle distress and safety communications',
          'Maintain navigation electronics',
          'Manage shipboard IT systems',
          'Coordinate satellite communications',
          'Support bridge electronics maintenance',
        ],
        nextStep:
          'Advance to ETO (Electro-Technical Officer) or shore-side technical roles',
      },
      {
        title: 'Helicopter Pilot',
        salary: '$100,000 - $180,000',
        years: '5-15',
        description:
          'Operates helicopters on vessels with helidecks. Common on offshore support vessels, government vessels (MSC), icebreakers, and research ships.',
        duties: [
          'Conduct helicopter operations from vessel',
          'Personnel and cargo transfers',
          'Search and rescue support',
          'Ice reconnaissance (icebreakers)',
          'Medical evacuations',
          'Maintain flight logs and compliance',
        ],
        nextStep: 'Senior pilot roles or flight operations management',
      },
      {
        title: 'Other Specialty Positions',
        salary: 'Varies widely',
        years: 'Varies',
        description:
          'Specialized roles on certain vessel types: Medical Officers on cruise ships, DPOs on offshore vessels, Riding Crew/Surveyors, Cadets, and more.',
        duties: [
          'Medical Officer: Shipboard healthcare',
          'DPO: Dynamic positioning operations',
          'Riding Crew: Maintenance during transit',
          'Cadet: Training position for future officers',
          'Surveyor: Inspection and compliance',
          'Security Officer: Vessel security (SSO)',
        ],
        nextStep: 'Varies by specialty - see sector-specific pages for details',
      },
    ],
  },
];

// Expanded sectors - 11 total
const SECTORS = [
  {
    id: 'government',
    title: 'Government',
    subtitle: 'MSC, NOAA & Federal',
    icon: Shield,
    color: 'emerald',
    description:
      'Federal maritime service supporting military operations (MSC), scientific research (NOAA), and other government missions. Exceptional benefits, job security, and mission-driven work.',
    stats: {
      rotation: '4-6 months',
      pay: 'Federal GS/WG scale',
      benefits: 'FERS, TSP, Health',
    },
    highlights: [
      'Federal employee benefits',
      'CIVMAR positions on MSC ships',
      'NOAA Corps opportunities',
      'Clear advancement pathway',
    ],
    href: '/maritime-101/sectors/government',
  },
  {
    id: 'commercial-deep-sea',
    title: 'Commercial Deep Sea',
    subtitle: 'Container, Tanker, Bulk',
    icon: Globe,
    color: 'blue',
    description:
      'International and coastwise shipping on large oceangoing vessels. Container ships, tankers, and bulk carriers moving cargo across oceans and between major ports.',
    stats: {
      rotation: '60-120 days',
      pay: 'Union scale + OT',
      benefits: 'Full medical, pension',
    },
    highlights: [
      'Largest vessels in the fleet',
      'International port calls',
      'Strong union contracts',
      'Jones Act protections',
    ],
    href: '/maritime-101/sectors/commercial-deep-sea',
  },
  {
    id: 'offshore-rigs',
    title: 'Offshore Oil Rigs',
    subtitle: 'Platform & Drilling',
    icon: Building2,
    color: 'slate',
    description:
      'Work aboard fixed and floating drilling platforms, production facilities, and mobile offshore drilling units (MODUs). Premium pay for demanding conditions.',
    stats: {
      rotation: '14/14 or 21/21',
      pay: 'Day rate $300-700',
      benefits: 'Varies by employer',
    },
    highlights: [
      'Highest day rates',
      'Equal time off',
      'Technical specializations',
      'Gulf of Mexico focus',
    ],
    href: '/maritime-101/sectors/offshore-rigs',
  },
  {
    id: 'offshore-supply',
    title: 'Offshore Supply Vessels',
    subtitle: 'PSV, AHTS, FSV',
    icon: Zap,
    color: 'violet',
    description:
      'Platform Supply Vessels (PSV), Anchor Handling Tug Supply (AHTS), and Fast Supply Vessels supporting offshore energy operations. Dynamic positioning skills valued.',
    stats: {
      rotation: '14/14 - 28/28',
      pay: 'Day rate $400-800',
      benefits: 'Company varies',
    },
    highlights: [
      'DP certification premium',
      'Growing wind sector',
      'Technical operations',
      'Shorter trips',
    ],
    href: '/maritime-101/sectors/offshore-supply',
  },
  {
    id: 'tugboats',
    title: 'Tugboats',
    subtitle: 'Harbor & Coastal Towing',
    icon: Anchor,
    color: 'amber',
    description:
      'Ship-assist tugs in ports, coastal towing, and ocean towing operations. Smaller crews, technical ship handling, home more often than deep sea.',
    stats: {
      rotation: '7/7 - 14/14',
      pay: '$50K-150K/year',
      benefits: 'Union or company',
    },
    highlights: [
      'More time home',
      'Technical boat handling',
      'Harbor and coastal work',
      'Path to tug master',
    ],
    href: '/maritime-101/sectors/tugboats',
  },
  {
    id: 'barges',
    title: 'Barges',
    subtitle: 'ATB, ITB & Tank Barges',
    icon: Waves,
    color: 'cyan',
    description:
      'Articulated Tug-Barge (ATB), Integrated Tug-Barge (ITB) units and Bunker Barges moving petroleum, chemicals, and dry cargo coastwise. Growing sector with modern tonnage.',
    stats: {
      rotation: '14/14 - 28/28',
      pay: '$60K-180K/year',
      benefits: 'Union contracts or company provided',
    },
    highlights: [
      'Modern ATB fleet',
      'Jones Act cargo',
      'Tanker experience credit',
      'Union representation',
    ],
    href: '/maritime-101/sectors/barges',
  },
  {
    id: 'ferries',
    title: 'Ferries',
    subtitle: 'Passenger & Vehicle',
    icon: Ship,
    color: 'sky',
    description:
      'Passenger and vehicle ferries operating scheduled routes. Day work schedules possible, state ferry systems offer government benefits.',
    stats: {
      rotation: 'Daily/Weekly',
      pay: '$45K-120K/year',
      benefits: 'State or company',
    },
    highlights: [
      'Day work possible',
      'Home every night',
      'State ferry benefits',
      'Passenger vessel experience',
    ],
    href: '/maritime-101/sectors/ferries',
  },
  {
    id: 'cruise-ships',
    title: 'Cruise Ships',
    subtitle: 'Passenger Vessels',
    icon: Users,
    color: 'pink',
    description:
      'Large passenger vessels with hotel operations. International crews, extended contracts, unique lifestyle. Growing small expedition cruise market.',
    stats: {
      rotation: '4-8 month contracts',
      pay: 'Varies widely',
      benefits: 'Company provided',
    },
    highlights: [
      'International travel',
      'Diverse positions',
      'Expedition cruises growing',
      'Hotel + maritime careers',
    ],
    href: '/maritime-101/sectors/cruise-ships',
  },
  {
    id: 'yachts',
    title: 'Yachts',
    subtitle: 'Private & Charter',
    icon: Sailboat,
    color: 'indigo',
    description:
      'Private and charter yachts from 80 to 500+ feet. MCA/PYA certifications, service-oriented, potential for excellent compensation on larger vessels.',
    stats: {
      rotation: 'Seasonal/Year-round',
      pay: '$40K-200K+ tips',
      benefits: 'Varies widely',
    },
    highlights: [
      'Tips can double salary',
      'Travel with owners',
      'Smaller crew dynamics',
      'MCA certification path',
    ],
    href: '/maritime-101/sectors/yachts',
  },
  {
    id: 'fishing',
    title: 'Fishing Boats',
    subtitle: 'Commercial Fishing',
    icon: Fish,
    color: 'teal',
    description:
      'Commercial fishing vessels from small day boats to large factory trawlers. Share-based pay, physically demanding, seasonal patterns vary by fishery.',
    stats: { rotation: 'Trip-based', pay: 'Share system', benefits: 'Limited' },
    highlights: [
      'Share of catch pay',
      'Seasonal opportunities',
      'Path to vessel ownership',
      'Diverse fisheries',
    ],
    href: '/maritime-101/sectors/fishing',
  },
  {
    id: 'pilots',
    title: 'Pilots',
    subtitle: 'Harbor & River Pilots',
    icon: Navigation,
    color: 'rose',
    description:
      'Licensed pilots guide vessels through ports, rivers, and restricted waterways. Highest paid maritime profession, extremely competitive entry, long apprenticeship.',
    stats: {
      rotation: 'On-call rotation',
      pay: '$200K-700K+/year',
      benefits: 'Association provided',
    },
    highlights: [
      'Highest maritime pay',
      'Home often with on-call schedule',
      '10+ year apprenticeship',
      'Limited positions',
    ],
    href: '/maritime-101/sectors/pilots',
  },
];

// Career section with scroll snap and nested scrollable roles
function CareerChapterSection({
  category,
  index,
  isLast,
  onNextChapter,
}: {
  category: (typeof CAREER_CATEGORIES)[0];
  index: number;
  isLast: boolean;
  onNextChapter: () => void;
}) {
  const colorMap: Record<
    string,
    { bg: string; border: string; text: string; gradient: string; dot: string }
  > = {
    blue: {
      bg: 'bg-blue-500/20',
      border: 'border-blue-500/30',
      text: 'text-blue-400',
      gradient: 'from-blue-600/20 to-blue-900/40',
      dot: 'bg-blue-500',
    },
    sky: {
      bg: 'bg-sky-500/20',
      border: 'border-sky-500/30',
      text: 'text-sky-400',
      gradient: 'from-sky-600/20 to-sky-900/40',
      dot: 'bg-sky-500',
    },
    amber: {
      bg: 'bg-amber-500/20',
      border: 'border-amber-500/30',
      text: 'text-amber-400',
      gradient: 'from-amber-600/20 to-amber-900/40',
      dot: 'bg-amber-500',
    },
    orange: {
      bg: 'bg-orange-500/20',
      border: 'border-orange-500/30',
      text: 'text-orange-400',
      gradient: 'from-orange-600/20 to-orange-900/40',
      dot: 'bg-orange-500',
    },
    emerald: {
      bg: 'bg-emerald-500/20',
      border: 'border-emerald-500/30',
      text: 'text-emerald-400',
      gradient: 'from-emerald-600/20 to-emerald-900/40',
      dot: 'bg-emerald-500',
    },
  };

  const colors = colorMap[category.color];

  return (
    <section
      id={`chapter-${category.id}`}
      className="min-h-screen snap-start snap-always flex items-start py-8"
    >
      <div className="container mx-auto px-4 h-full">
        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12 h-full">
          {/* Left side - Category info (2 columns) - sticky on desktop */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-2 flex flex-col"
          >
            <div
              className={`inline-flex p-3 rounded-xl ${colors.bg} ${colors.border} border mb-4 w-fit`}
            >
              <category.icon className={`w-8 h-8 ${colors.text}`} />
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
              {category.title}
            </h2>
            <p className={`text-lg ${colors.text} mb-4`}>{category.subtitle}</p>

            <p className="text-slate-300 leading-relaxed mb-6">
              {category.description}
            </p>

            <div
              className={`p-4 rounded-lg ${colors.bg} ${colors.border} border mb-4`}
            >
              <div className="text-xs text-slate-400 uppercase tracking-wide mb-1">
                Requirements
              </div>
              <p className="text-sm text-slate-300">{category.requirements}</p>
            </div>

            {category.note && (
              <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700 mb-4">
                <div className="text-xs text-amber-400 uppercase tracking-wide mb-1">
                  Note
                </div>
                <p className="text-sm text-slate-400">{category.note}</p>
              </div>
            )}

            {/* Chapter indicator */}
            <div className="mt-auto pt-4">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span>
                  Chapter {index + 1} of {CAREER_CATEGORIES.length}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Right side - Roles with nested scroll (3 columns) */}
          <div className="lg:col-span-3 flex flex-col h-[calc(100vh-8rem)]">
            {/* Scrollable roles container with overscroll containment */}
            <div
              className="flex-1 overflow-y-auto overscroll-contain pr-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent"
              style={{ scrollbarGutter: 'stable' }}
            >
              <div className="space-y-6 pb-4">
                {category.roles.map((role, idx) => (
                  <motion.div
                    key={role.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className="relative"
                  >
                    {/* Progression connector line */}
                    {idx < category.roles.length - 1 && (
                      <div
                        className={`absolute left-6 top-full w-0.5 h-6 ${colors.dot} opacity-30`}
                      />
                    )}

                    <Card
                      className={`p-6 bg-gradient-to-br ${colors.gradient} border ${colors.border} backdrop-blur-sm`}
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="flex items-start gap-4">
                          {/* Step number */}
                          <div
                            className={`flex-shrink-0 w-12 h-12 rounded-full ${colors.bg} ${colors.border} border flex items-center justify-center`}
                          >
                            <span
                              className={`text-lg font-bold ${colors.text}`}
                            >
                              {idx + 1}
                            </span>
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-white">
                              {role.title}
                            </h3>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="text-sm text-slate-400">
                                {role.years} years typical
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className={`text-lg font-bold ${colors.text}`}>
                            {role.salary}
                          </div>
                          <div className="text-xs text-slate-500">per year</div>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-slate-300 mb-4 leading-relaxed">
                        {role.description}
                      </p>

                      {/* Daily Duties */}
                      <div className="mb-4">
                        <div className="text-xs text-slate-500 uppercase tracking-wide mb-2">
                          Daily Duties & Responsibilities
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {role.duties.map((duty, dutyIdx) => (
                            <div
                              key={dutyIdx}
                              className="flex items-start gap-2"
                            >
                              <div
                                className={`w-1.5 h-1.5 rounded-full ${colors.dot} mt-1.5 flex-shrink-0`}
                              />
                              <span className="text-sm text-slate-400">
                                {duty}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Next Step */}
                      <div
                        className={`p-3 rounded-lg bg-slate-900/50 border ${colors.border}`}
                      >
                        <div className="flex items-center gap-2">
                          <ArrowUp className={`w-4 h-4 ${colors.text}`} />
                          <span className="text-xs text-slate-500 uppercase tracking-wide">
                            Path Forward
                          </span>
                        </div>
                        <p className="text-sm text-slate-300 mt-1">
                          {role.nextStep}
                        </p>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Next chapter button */}
            {!isLast && (
              <div className="pt-4 flex justify-center">
                <button
                  onClick={onNextChapter}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full ${colors.bg} ${colors.border} border text-sm ${colors.text} hover:opacity-80 transition-opacity`}
                >
                  Next: {CAREER_CATEGORIES[index + 1]?.title}
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// Compass with side panel (desktop) or modal (mobile)
function CompassNavigation() {
  const [activeSector, setActiveSector] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const compassRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(compassRef, { once: true, margin: '-100px' });

  const activeSectorData = SECTORS.find((s) => s.id === activeSector);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const getPosition = (index: number, total: number, radius: number) => {
    const angle = (index * (360 / total) - 90) * (Math.PI / 180);
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
    };
  };

  const colorMap: Record<
    string,
    { bg: string; text: string; border: string; button: string }
  > = {
    emerald: {
      bg: 'bg-emerald-500',
      text: 'text-emerald-400',
      border: 'border-emerald-500/50',
      button: 'bg-emerald-600 hover:bg-emerald-700',
    },
    blue: {
      bg: 'bg-blue-500',
      text: 'text-blue-400',
      border: 'border-blue-500/50',
      button: 'bg-blue-600 hover:bg-blue-700',
    },
    slate: {
      bg: 'bg-slate-500',
      text: 'text-slate-400',
      border: 'border-slate-500/50',
      button: 'bg-slate-600 hover:bg-slate-700',
    },
    violet: {
      bg: 'bg-violet-500',
      text: 'text-violet-400',
      border: 'border-violet-500/50',
      button: 'bg-violet-600 hover:bg-violet-700',
    },
    amber: {
      bg: 'bg-amber-500',
      text: 'text-amber-400',
      border: 'border-amber-500/50',
      button: 'bg-amber-600 hover:bg-amber-700',
    },
    cyan: {
      bg: 'bg-cyan-500',
      text: 'text-cyan-400',
      border: 'border-cyan-500/50',
      button: 'bg-cyan-600 hover:bg-cyan-700',
    },
    sky: {
      bg: 'bg-sky-500',
      text: 'text-sky-400',
      border: 'border-sky-500/50',
      button: 'bg-sky-600 hover:bg-sky-700',
    },
    pink: {
      bg: 'bg-pink-500',
      text: 'text-pink-400',
      border: 'border-pink-500/50',
      button: 'bg-pink-600 hover:bg-pink-700',
    },
    indigo: {
      bg: 'bg-indigo-500',
      text: 'text-indigo-400',
      border: 'border-indigo-500/50',
      button: 'bg-indigo-600 hover:bg-indigo-700',
    },
    teal: {
      bg: 'bg-teal-500',
      text: 'text-teal-400',
      border: 'border-teal-500/50',
      button: 'bg-teal-600 hover:bg-teal-700',
    },
    rose: {
      bg: 'bg-rose-500',
      text: 'text-rose-400',
      border: 'border-rose-500/50',
      button: 'bg-rose-600 hover:bg-rose-700',
    },
  };

  const handleSectorClick = (sectorId: string) => {
    setActiveSector(activeSector === sectorId ? null : sectorId);
  };

  const handleClose = () => {
    setActiveSector(null);
  };

  const handleCompassAreaClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  return (
    <>
      <div ref={compassRef} className="relative py-12">
        <div
          className={`flex items-center gap-8 transition-all duration-500 ${
            activeSector && !isMobile ? 'justify-start' : 'justify-center'
          }`}
        >
          {/* Compass */}
          <div
            className={`relative transition-all duration-500 ${
              activeSector && !isMobile ? 'w-1/2 flex justify-center' : 'w-full'
            }`}
            onClick={handleCompassAreaClick}
          >
            <div className="relative w-[420px] h-[420px] max-w-full">
              <motion.div
                initial={{ opacity: 0, scale: 0.8, rotate: -180 }}
                animate={isInView ? { opacity: 1, scale: 1, rotate: 0 } : {}}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="absolute inset-0 rounded-full border-2 border-slate-700"
              />

              <motion.div
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 1, delay: 0.3 }}
                className="absolute inset-10 rounded-full border border-slate-800"
              />
              <motion.div
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 1, delay: 0.5 }}
                className="absolute inset-20 rounded-full border border-slate-800/50"
              />

              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.8, delay: 0.7 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-slate-900 border-2 border-slate-700 flex items-center justify-center shadow-2xl">
                    <Compass className="w-9 h-9 text-slate-500" />
                  </div>
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 text-xs font-bold text-slate-500">
                    N
                  </div>
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-xs font-bold text-slate-600">
                    S
                  </div>
                  <div className="absolute top-1/2 -left-3 -translate-y-1/2 text-xs font-bold text-slate-600">
                    W
                  </div>
                  <div className="absolute top-1/2 -right-3 -translate-y-1/2 text-xs font-bold text-slate-600">
                    E
                  </div>
                </div>
              </motion.div>

              {SECTORS.map((sector, idx) => {
                const pos = getPosition(idx, SECTORS.length, 160);
                const isActive = activeSector === sector.id;
                const colors = colorMap[sector.color];

                return (
                  <motion.button
                    key={sector.id}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.5, delay: 0.8 + idx * 0.08 }}
                    onClick={() => handleSectorClick(sector.id)}
                    className={`absolute w-16 h-16 md:w-18 md:h-18 rounded-full flex flex-col items-center justify-center transition-all duration-300 cursor-pointer
                      ${
                        isActive
                          ? `${colors.bg} shadow-lg shadow-${sector.color}-500/30 scale-110 z-10`
                          : 'bg-slate-900 border-2 border-slate-700 hover:border-slate-500 hover:scale-105'
                      }`}
                    style={{
                      left: `calc(50% + ${pos.x}px - 32px)`,
                      top: `calc(50% + ${pos.y}px - 32px)`,
                    }}
                  >
                    <sector.icon
                      className={`w-5 h-5 ${
                        isActive ? 'text-white' : colors.text
                      }`}
                    />
                    <span
                      className={`text-[8px] md:text-[9px] font-bold mt-0.5 text-center leading-tight ${
                        isActive ? 'text-white' : 'text-slate-300'
                      }`}
                    >
                      {sector.title}
                    </span>
                  </motion.button>
                );
              })}

              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                {SECTORS.map((sector, idx) => {
                  const pos = getPosition(idx, SECTORS.length, 120);
                  const isActive = activeSector === sector.id;

                  return (
                    <motion.line
                      key={sector.id}
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={
                        isInView
                          ? { pathLength: 1, opacity: isActive ? 0.6 : 0.2 }
                          : {}
                      }
                      transition={{ duration: 1, delay: 1 + idx * 0.05 }}
                      x1="210"
                      y1="210"
                      x2={210 + pos.x}
                      y2={210 + pos.y}
                      stroke={isActive ? '#fff' : '#334155'}
                      strokeWidth={isActive ? 2 : 1}
                      strokeDasharray="4 4"
                    />
                  );
                })}
              </svg>
            </div>
          </div>

          {/* Desktop Side Panel */}
          <AnimatePresence>
            {activeSector && !isMobile && activeSectorData && (
              <motion.div
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="w-1/2 pr-4"
              >
                <SectorDetailPanel
                  sector={activeSectorData}
                  onClose={handleClose}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {!activeSector && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-slate-500 mt-8"
          >
            Click any sector to explore
          </motion.p>
        )}
      </div>

      {/* Mobile Modal */}
      <AnimatePresence>
        {activeSector && isMobile && activeSectorData && (
          <SectorModal sector={activeSectorData} onClose={handleClose} />
        )}
      </AnimatePresence>
    </>
  );
}

// Sector detail panel (desktop side panel)
function SectorDetailPanel({
  sector,
  onClose,
}: {
  sector: (typeof SECTORS)[0];
  onClose: () => void;
}) {
  const colorMap: Record<
    string,
    { bg: string; border: string; text: string; button: string }
  > = {
    emerald: {
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/50',
      text: 'text-emerald-400',
      button: 'bg-emerald-600 hover:bg-emerald-700',
    },
    blue: {
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/50',
      text: 'text-blue-400',
      button: 'bg-blue-600 hover:bg-blue-700',
    },
    slate: {
      bg: 'bg-slate-500/10',
      border: 'border-slate-500/50',
      text: 'text-slate-400',
      button: 'bg-slate-600 hover:bg-slate-700',
    },
    violet: {
      bg: 'bg-violet-500/10',
      border: 'border-violet-500/50',
      text: 'text-violet-400',
      button: 'bg-violet-600 hover:bg-violet-700',
    },
    amber: {
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/50',
      text: 'text-amber-400',
      button: 'bg-amber-600 hover:bg-amber-700',
    },
    cyan: {
      bg: 'bg-cyan-500/10',
      border: 'border-cyan-500/50',
      text: 'text-cyan-400',
      button: 'bg-cyan-600 hover:bg-cyan-700',
    },
    sky: {
      bg: 'bg-sky-500/10',
      border: 'border-sky-500/50',
      text: 'text-sky-400',
      button: 'bg-sky-600 hover:bg-sky-700',
    },
    pink: {
      bg: 'bg-pink-500/10',
      border: 'border-pink-500/50',
      text: 'text-pink-400',
      button: 'bg-pink-600 hover:bg-pink-700',
    },
    indigo: {
      bg: 'bg-indigo-500/10',
      border: 'border-indigo-500/50',
      text: 'text-indigo-400',
      button: 'bg-indigo-600 hover:bg-indigo-700',
    },
    teal: {
      bg: 'bg-teal-500/10',
      border: 'border-teal-500/50',
      text: 'text-teal-400',
      button: 'bg-teal-600 hover:bg-teal-700',
    },
    rose: {
      bg: 'bg-rose-500/10',
      border: 'border-rose-500/50',
      text: 'text-rose-400',
      button: 'bg-rose-600 hover:bg-rose-700',
    },
  };

  const colors = colorMap[sector.color];

  return (
    <Card className={`p-6 ${colors.bg} border ${colors.border} relative`}>
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 text-slate-500 hover:text-white transition-colors"
      >
        <X className="w-5 h-5" />
      </button>

      <div className="flex items-center gap-4 mb-6 pr-8">
        <div className={`p-3 rounded-xl ${colors.bg} border ${colors.border}`}>
          <sector.icon className={`w-8 h-8 ${colors.text}`} />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-white">{sector.title}</h3>
          <p className={colors.text}>{sector.subtitle}</p>
        </div>
      </div>

      <p className="text-slate-300 mb-6 leading-relaxed">
        {sector.description}
      </p>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="text-center p-3 bg-slate-900/50 rounded-lg">
          <Clock className="w-4 h-4 text-slate-500 mx-auto mb-1" />
          <div className="text-xs text-slate-500 mb-1">Rotation</div>
          <div className="text-sm text-white font-medium">
            {sector.stats.rotation}
          </div>
        </div>
        <div className="text-center p-3 bg-slate-900/50 rounded-lg">
          <DollarSign className="w-4 h-4 text-slate-500 mx-auto mb-1" />
          <div className="text-xs text-slate-500 mb-1">Pay</div>
          <div className="text-sm text-white font-medium">
            {sector.stats.pay}
          </div>
        </div>
        <div className="text-center p-3 bg-slate-900/50 rounded-lg">
          <Award className="w-4 h-4 text-slate-500 mx-auto mb-1" />
          <div className="text-xs text-slate-500 mb-1">Benefits</div>
          <div className="text-sm text-white font-medium">
            {sector.stats.benefits}
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="text-xs text-slate-500 uppercase tracking-wide mb-3">
          Highlights
        </div>
        <div className="space-y-2">
          {sector.highlights.map((highlight, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <div
                className={`w-1.5 h-1.5 rounded-full ${colors.text.replace(
                  'text-',
                  'bg-'
                )}`}
              />
              <span className="text-sm text-slate-300">{highlight}</span>
            </div>
          ))}
        </div>
      </div>

      <Link href={sector.href}>
        <Button className={`w-full ${colors.button} text-white`}>
          Explore {sector.title} Careers
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </Link>
    </Card>
  );
}

// Mobile modal
function SectorModal({
  sector,
  onClose,
}: {
  sector: (typeof SECTORS)[0];
  onClose: () => void;
}) {
  const colorMap: Record<
    string,
    { bg: string; border: string; text: string; button: string }
  > = {
    emerald: {
      bg: 'bg-emerald-500/20',
      border: 'border-emerald-500/50',
      text: 'text-emerald-400',
      button: 'bg-emerald-600 hover:bg-emerald-700',
    },
    blue: {
      bg: 'bg-blue-500/20',
      border: 'border-blue-500/50',
      text: 'text-blue-400',
      button: 'bg-blue-600 hover:bg-blue-700',
    },
    slate: {
      bg: 'bg-slate-500/20',
      border: 'border-slate-500/50',
      text: 'text-slate-400',
      button: 'bg-slate-600 hover:bg-slate-700',
    },
    violet: {
      bg: 'bg-violet-500/20',
      border: 'border-violet-500/50',
      text: 'text-violet-400',
      button: 'bg-violet-600 hover:bg-violet-700',
    },
    amber: {
      bg: 'bg-amber-500/20',
      border: 'border-amber-500/50',
      text: 'text-amber-400',
      button: 'bg-amber-600 hover:bg-amber-700',
    },
    cyan: {
      bg: 'bg-cyan-500/20',
      border: 'border-cyan-500/50',
      text: 'text-cyan-400',
      button: 'bg-cyan-600 hover:bg-cyan-700',
    },
    sky: {
      bg: 'bg-sky-500/20',
      border: 'border-sky-500/50',
      text: 'text-sky-400',
      button: 'bg-sky-600 hover:bg-sky-700',
    },
    pink: {
      bg: 'bg-pink-500/20',
      border: 'border-pink-500/50',
      text: 'text-pink-400',
      button: 'bg-pink-600 hover:bg-pink-700',
    },
    indigo: {
      bg: 'bg-indigo-500/20',
      border: 'border-indigo-500/50',
      text: 'text-indigo-400',
      button: 'bg-indigo-600 hover:bg-indigo-700',
    },
    teal: {
      bg: 'bg-teal-500/20',
      border: 'border-teal-500/50',
      text: 'text-teal-400',
      button: 'bg-teal-600 hover:bg-teal-700',
    },
    rose: {
      bg: 'bg-rose-500/20',
      border: 'border-rose-500/50',
      text: 'text-rose-400',
      button: 'bg-rose-600 hover:bg-rose-700',
    },
  };

  const colors = colorMap[sector.color];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto"
      >
        <Card className={`p-6 bg-slate-900 border ${colors.border} shadow-2xl`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-500 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4 mb-6 pr-8">
            <div
              className={`p-3 rounded-xl ${colors.bg} border ${colors.border}`}
            >
              <sector.icon className={`w-8 h-8 ${colors.text}`} />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">{sector.title}</h3>
              <p className={colors.text}>{sector.subtitle}</p>
            </div>
          </div>

          <p className="text-slate-300 mb-6 leading-relaxed">
            {sector.description}
          </p>

          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="text-center p-3 bg-slate-800/50 rounded-lg">
              <Clock className="w-4 h-4 text-slate-500 mx-auto mb-1" />
              <div className="text-xs text-slate-500 mb-1">Rotation</div>
              <div className="text-xs text-white font-medium">
                {sector.stats.rotation}
              </div>
            </div>
            <div className="text-center p-3 bg-slate-800/50 rounded-lg">
              <DollarSign className="w-4 h-4 text-slate-500 mx-auto mb-1" />
              <div className="text-xs text-slate-500 mb-1">Pay</div>
              <div className="text-xs text-white font-medium">
                {sector.stats.pay}
              </div>
            </div>
            <div className="text-center p-3 bg-slate-800/50 rounded-lg">
              <Award className="w-4 h-4 text-slate-500 mx-auto mb-1" />
              <div className="text-xs text-slate-500 mb-1">Benefits</div>
              <div className="text-xs text-white font-medium">
                {sector.stats.benefits}
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="text-xs text-slate-500 uppercase tracking-wide mb-3">
              Highlights
            </div>
            <div className="grid grid-cols-2 gap-2">
              {sector.highlights.map((highlight, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${colors.text.replace(
                      'text-',
                      'bg-'
                    )}`}
                  />
                  <span className="text-sm text-slate-300">{highlight}</span>
                </div>
              ))}
            </div>
          </div>

          <Link href={sector.href}>
            <Button className={`w-full ${colors.button} text-white`}>
              Explore {sector.title} Careers
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </Card>
      </motion.div>
    </motion.div>
  );
}

export default function CareersAndSectorsPage() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToChapter = (index: number) => {
    const chapter = document.getElementById(
      `chapter-${CAREER_CATEGORIES[index].id}`
    );
    if (chapter) {
      chapter.scrollIntoView({ behavior: 'smooth' });
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
          <Link
            href="/maritime-101"
            className="hover:text-white transition-colors"
          >
            Maritime 101
          </Link>
          <span className="mx-2">/</span>
          <span className="text-white">Careers & Sectors</span>
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
            Career Exploration
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Chart Your Course
          </h1>
          <p className="text-lg md:text-xl text-slate-300 mb-8 leading-relaxed">
            Maritime careers split along two axes:{' '}
            <span className="text-white font-semibold">what you do</span> aboard
            and <span className="text-white font-semibold">where you sail</span>
            . Explore the progression from entry-level to command.
          </p>

          {/* Legend */}
          <div className="flex flex-wrap justify-center gap-4 text-xs">
            {CAREER_CATEGORIES.map((cat) => (
              <div key={cat.id} className="flex items-center gap-2">
                <div
                  className={`w-2.5 h-2.5 rounded-full bg-${cat.color}-500`}
                />
                <span className="text-slate-400">{cat.title}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Section: What You Do (Careers) with scroll snap */}
      <div className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-4"
          >
            <Badge className="mb-4 bg-slate-800 text-slate-300 border-slate-700">
              Part 1
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
              What You Do
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Five career tracks from entry to senior positions. Each card shows
              the progression, daily duties, and path forward.
            </p>
          </motion.div>
        </div>

        {/* Career chapters with scroll snap */}
        <div
          className="snap-y snap-mandatory"
          style={{ scrollPaddingTop: '2rem' }}
        >
          {CAREER_CATEGORIES.map((category, index) => (
            <CareerChapterSection
              key={category.id}
              category={category}
              index={index}
              isLast={index === CAREER_CATEGORIES.length - 1}
              onNextChapter={() => scrollToChapter(index + 1)}
            />
          ))}
        </div>
      </div>

      <Separator className="max-w-7xl mx-auto bg-slate-800 my-16" />

      {/* Section: Where You Sail (Sectors) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-4"
        >
          <Badge className="mb-4 bg-slate-800 text-slate-300 border-slate-700">
            Part 2
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Where You Sail
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Eleven distinct sectors with different rotations, pay structures,
            and lifestyles. Click any sector to explore.
          </p>
        </motion.div>

        {/* Compass Navigation */}
        <CompassNavigation />
      </section>

      <Separator className="max-w-7xl mx-auto bg-slate-800" />

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Start?
          </h2>
          <p className="text-slate-400 mb-12 max-w-2xl mx-auto">
            Now that you understand the landscape, learn how to break into the
            industry.
          </p>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              {
                title: 'Training & Entry',
                desc: 'Pathways into maritime careers',
                href: '/maritime-101/training-and-entry',
                icon: GraduationCap,
              },
              {
                title: 'Credentials',
                desc: 'Licenses and certifications',
                href: '/maritime-101/credentials',
                icon: Award,
              },
              {
                title: 'Life at Sea',
                desc: 'What to expect from the lifestyle',
                href: '/maritime-101/life-at-sea',
                icon: Ship,
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
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {cta.title}
                    </h3>
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
