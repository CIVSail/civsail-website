'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import {
  Anchor,
  Wrench,
  GraduationCap,
  Ship,
  ChevronUp,
  AlertTriangle,
  Info,
  ArrowRight,
  Clock,
  BookOpen,
  FileCheck,
  Target,
  Shield,
  Zap,
  Compass,
  Sparkles,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

// ============================================================================
// TYPES
// ============================================================================

interface Rung {
  id: string;
  title: string;
  subtitle?: string;
  level: 'entry' | 'rating' | 'officer' | 'senior';
  isLicensed: boolean;
  entryPoints?: ('academy' | 'hawsepipe' | 'military')[];
  seaTime: {
    unlimited?: string;
    limited?: string;
  };
  training: string[];
  exams: {
    unlimited?: string[];
    limited?: string[];
  };
  scope: {
    unlimited?: string;
    limited?: string;
  };
  limitations?: string[];
  warning?: string;
  branches?: string[];
  note?: string;
}

// ============================================================================
// DATA: CAREER LADDER RUNGS
// ============================================================================

const DECK_RUNGS: Rung[] = [
  {
    id: 'os',
    title: 'Ordinary Seaman (OS)',
    subtitle: 'Entry-Level Deck Rating',
    level: 'entry',
    isLicensed: false,
    entryPoints: ['hawsepipe'],
    seaTime: { unlimited: 'None required for entry', limited: 'None required for entry' },
    training: ['Basic Safety Training (BST)', 'TWIC Card', 'MMC Application'],
    exams: { unlimited: ['No exam required'], limited: ['No exam required'] },
    scope: { unlimited: 'Any vessel, any waters', limited: 'Any vessel, any waters' },
    note: 'Sea time accumulation begins here. This is where hawsepipers start their journey.',
  },
  {
    id: 'ab',
    title: 'Able Seaman (AB)',
    subtitle: 'Qualified Deck Rating',
    level: 'rating',
    isLicensed: false,
    seaTime: { unlimited: '1,080 days for AB-Unlimited', limited: '540 days (AB-Limited), 360 days (AB-Special), 180 days (AB-OSV)' },
    training: ['Lifeboatman or Lifeboatman-Limited', 'Proficiency in Survival Craft (PSC)', 'Marlinespike Seamanship Demonstration'],
    exams: { unlimited: ['Exams required to obtain credential'], limited: ['Exams required to obtain credential'] },
    scope: { unlimited: 'AB-Unlimited: Any vessel on any waters', limited: 'AB-Limited/Special/OSV: Specific vessel types or tonnages' },
    branches: ['AB-Unlimited', 'AB-Limited', 'AB-Special', 'AB-OSV', 'AB-Sail', 'AB-Fishing'],
  },
  {
    id: 'bosun',
    title: 'Boatswain (Bosun)',
    subtitle: 'Senior Unlicensed Deck Leadership',
    level: 'rating',
    isLicensed: false,
    seaTime: { unlimited: 'No specific requirement - based on experience', limited: 'No specific requirement - based on experience' },
    training: ['All AB requirements', 'Leadership experience', 'Vessel-specific training'],
    exams: { unlimited: ['No additional exam'], limited: ['No additional exam'] },
    scope: { unlimited: 'Supervises unlicensed deck crew', limited: 'Supervises unlicensed deck crew' },
    note: 'Bosun is a leadership position, not a credential. Many make this their career.',
  },
  {
    id: 'third-mate',
    title: 'Third Mate / Third Officer',
    subtitle: 'Junior Deck Officer',
    level: 'officer',
    isLicensed: true,
    entryPoints: ['academy', 'hawsepipe', 'military'],
    seaTime: { unlimited: '1,080 days total, including specific watchstanding time', limited: '720 days for Mate <1600 GRT' },
    training: ['STCW Basic Training', 'STCW Advanced Firefighting', 'Proficiency in Survival Craft', 'ARPA', 'GMDSS', 'Medical PIC', 'Radar Observer'],
    exams: { unlimited: ['Exams required to obtain credential'], limited: ['Exams required to obtain credential'] },
    scope: { unlimited: 'Oceans or Near Coastal, Unlimited Tonnage', limited: 'Near Coastal, <1600 GRT or <500 GRT' },
    note: 'Academy graduates enter here. Hawsepipers reach this after AB sea time + exams.',
  },
  {
    id: 'second-mate',
    title: 'Second Mate / Second Officer',
    subtitle: 'Navigation Officer',
    level: 'officer',
    isLicensed: true,
    seaTime: { unlimited: '360 days as Third Mate', limited: '360 days as Mate <1600 GRT' },
    training: ['All Third Mate requirements maintained', 'Additional sea time documentation'],
    exams: { unlimited: ['No additional exam'], limited: ['No additional exam'] },
    scope: { unlimited: 'Oceans or Near Coastal, Unlimited Tonnage', limited: 'Near Coastal, <1600 GRT' },
  },
  {
    id: 'chief-mate',
    title: 'Chief Mate / Chief Officer',
    subtitle: 'Senior Deck Officer',
    level: 'senior',
    isLicensed: true,
    seaTime: { unlimited: '360 days as Second Mate', limited: 'N/A - Limited path goes directly to Master' },
    training: ['All lower license requirements maintained', 'Advanced Stability (recommended)', 'Cargo Operations training'],
    exams: { unlimited: ['Exams required to obtain credential'], limited: ['N/A'] },
    scope: { unlimited: 'Oceans or Near Coastal, Unlimited Tonnage', limited: 'Limited path does not include Chief Mate' },
  },
  {
    id: 'master',
    title: 'Master / Captain',
    subtitle: 'Commanding Officer',
    level: 'senior',
    isLicensed: true,
    seaTime: { unlimited: '360 days as Chief Mate', limited: '360 days as Mate for Master <1600 GRT' },
    training: ['All lower license requirements maintained', 'Company-specific training', 'Advanced certifications as required'],
    exams: { unlimited: ['No additional exam'], limited: ['Exams required to obtain credential'] },
    scope: { unlimited: 'Master Unlimited: Any tonnage, Oceans worldwide', limited: 'Master <1600 GRT, <500 GRT, <200 GRT, <100 GRT' },
    warning: 'Master 1600 GRT does NOT automatically convert to Third Mate Unlimited. Crossing over requires additional sea time, training, and examination.',
    limitations: ['Master <1600 GRT is tonnage-restricted', 'Route restrictions may apply', 'Not equivalent to unlimited officer progression'],
  },
];

const ENGINE_RUNGS: Rung[] = [
  {
    id: 'wiper',
    title: 'Wiper',
    subtitle: 'Entry-Level Engine Rating',
    level: 'entry',
    isLicensed: false,
    entryPoints: ['hawsepipe'],
    seaTime: { unlimited: 'None required for entry', limited: 'None required for entry' },
    training: ['Basic Safety Training (BST)', 'TWIC Card', 'MMC Application'],
    exams: { unlimited: ['No exam required'], limited: ['No exam required'] },
    scope: { unlimited: 'Any vessel, any waters', limited: 'Any vessel, any waters' },
    note: 'Sea time accumulation begins here. Engine department hawsepipers start here.',
  },
  {
    id: 'qmed',
    title: 'QMED',
    subtitle: 'Qualified Member of Engine Department',
    level: 'rating',
    isLicensed: false,
    seaTime: { unlimited: '180 days in engine department for Oiler; varies by rating', limited: '180 days minimum' },
    training: ['Basic Safety Training', 'Rating-specific training courses available'],
    exams: { unlimited: ['Exams required to obtain credential'], limited: ['Exams required to obtain credential'] },
    scope: { unlimited: 'Various specializations available', limited: 'Various specializations available' },
    branches: ['Oiler', 'Fireman-Watertender', 'Electrician-Refrigerating Engineer', 'Machinist-Pumpman', 'Junior Engineer'],
    note: 'Multiple QMED ratings exist. Junior Engineer is often the path to licensed engineer.',
  },
  {
    id: 'third-ae',
    title: 'Third Assistant Engineer',
    subtitle: 'Junior Engineering Officer',
    level: 'officer',
    isLicensed: true,
    entryPoints: ['academy', 'hawsepipe', 'military'],
    seaTime: { unlimited: '1,080 days in engine department, including QMED time', limited: '540 days for DDE or Limited endorsements' },
    training: ['STCW Basic Training', 'STCW Advanced Firefighting', 'Proficiency in Survival Craft', 'Engine Room Resource Management', 'Propulsion plant-specific training'],
    exams: { unlimited: ['Exams required to obtain credential'], limited: ['Exams required to obtain credential'] },
    scope: { unlimited: 'Unlimited Horsepower, Steam/Motor/Gas Turbine', limited: 'DDE-1000 HP, DDE-4000 HP, or specific limitations' },
    note: 'Academy graduates enter here. Hawsepipers advance through QMED first.',
  },
  {
    id: 'second-ae',
    title: 'Second Assistant Engineer',
    subtitle: 'Engineering Officer',
    level: 'officer',
    isLicensed: true,
    seaTime: { unlimited: '360 days as Third Assistant Engineer', limited: '360 days as Assistant Engineer-Limited' },
    training: ['All Third A/E requirements maintained', 'Continued professional development'],
    exams: { unlimited: ['No additional exam'], limited: ['No additional exam'] },
    scope: { unlimited: 'Unlimited Horsepower', limited: 'Limited by original endorsement' },
  },
  {
    id: 'first-ae',
    title: 'First Assistant Engineer',
    subtitle: 'Senior Engineering Officer',
    level: 'senior',
    isLicensed: true,
    seaTime: { unlimited: '360 days as Second Assistant Engineer', limited: 'N/A - Limited path structure differs' },
    training: ['All lower license requirements maintained', 'Management-level competencies'],
    exams: { unlimited: ['Exams required to obtain credential'], limited: ['N/A'] },
    scope: { unlimited: 'Unlimited Horsepower, all plant types as endorsed', limited: 'Limited path uses Chief Engineer-Limited structure' },
  },
  {
    id: 'chief-engineer',
    title: 'Chief Engineer',
    subtitle: 'Head of Engineering Department',
    level: 'senior',
    isLicensed: true,
    seaTime: { unlimited: '360 days as First Assistant Engineer', limited: '360 days as Assistant Engineer-Limited for CE-Limited' },
    training: ['All lower license requirements maintained', 'Company-specific training', 'Management certifications as required'],
    exams: { unlimited: ['No additional exam'], limited: ['Exams required to obtain credential'] },
    scope: { unlimited: 'Chief Engineer Unlimited: Any horsepower, all plant types', limited: 'Chief Engineer-Limited: Horsepower restricted' },
    warning: 'Limited propulsion or horsepower licenses do NOT automatically convert to unlimited. Crossover requires additional sea time, training, and examination.',
    limitations: ['CE-Limited is horsepower-restricted', 'DDE licenses have specific HP limits', 'Plant type limitations may apply'],
  },
];

// ============================================================================
// SPECIALIZATIONS
// ============================================================================

const SPECIALIZATIONS = [
  { id: 'tankerman', title: 'Tankerman', description: 'Dangerous liquids and liquefied gas cargo handling', track: 'both' },
  { id: 'dp', title: 'Dynamic Positioning (DP)', description: 'DP certification for offshore and specialized vessels', track: 'both' },
  { id: 'towing', title: 'Towing Vessels', description: 'Master/Mate of Towing Vessels endorsements', track: 'deck' },
  { id: 'osv', title: 'Offshore Supply Vessels', description: 'OSV-specific officer endorsements', track: 'both' },
  { id: 'modu', title: 'Mobile Offshore Drilling Units', description: 'OIM, Barge Supervisor, Ballast Control, MODU Engineer', track: 'both' },
  { id: 'pilot', title: 'First Class Pilot', description: 'Harbor and river pilotage', track: 'deck' },
  { id: 'government', title: 'Government Service', description: 'MSC CIVMAR, NOAA Corps, other federal maritime', track: 'both' },
];

// ============================================================================
// COMPONENTS
// ============================================================================

// Character Select Card Component
function CharacterCard({
  id,
  title,
  icon: Icon,
  tagline,
  stats,
  color,
  isSelected,
  onSelect,
}: {
  id: string;
  title: string;
  icon: React.ElementType;
  tagline: string;
  stats: { label: string; value: string }[];
  color: 'blue' | 'amber' | 'emerald';
  isSelected: boolean;
  onSelect: () => void;
}) {
  const colorClasses = {
    blue: {
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/30',
      borderHover: 'hover:border-blue-400',
      borderSelected: 'border-blue-400',
      text: 'text-blue-400',
      glow: 'shadow-blue-500/20',
      ring: 'ring-blue-500/50',
    },
    amber: {
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/30',
      borderHover: 'hover:border-amber-400',
      borderSelected: 'border-amber-400',
      text: 'text-amber-400',
      glow: 'shadow-amber-500/20',
      ring: 'ring-amber-500/50',
    },
    emerald: {
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/30',
      borderHover: 'hover:border-emerald-400',
      borderSelected: 'border-emerald-400',
      text: 'text-emerald-400',
      glow: 'shadow-emerald-500/20',
      ring: 'ring-emerald-500/50',
    },
  };

  const c = colorClasses[color];

  return (
    <motion.button
      onClick={onSelect}
      className={`
        relative w-full p-6 rounded-2xl border-2 transition-all duration-300 text-left
        ${c.bg} ${isSelected ? c.borderSelected : c.border} ${c.borderHover}
        ${isSelected ? `ring-4 ${c.ring} shadow-2xl ${c.glow}` : 'shadow-lg'}
      `}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      animate={isSelected ? { scale: 1.02 } : { scale: 1 }}
    >
      {/* Selected indicator */}
      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className={`absolute -top-3 -right-3 w-8 h-8 rounded-full ${c.bg} border-2 ${c.borderSelected} flex items-center justify-center`}
        >
          <Sparkles className={`w-4 h-4 ${c.text}`} />
        </motion.div>
      )}

      {/* Icon */}
      <div className={`w-16 h-16 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center mb-4`}>
        <Icon className={`w-8 h-8 ${c.text}`} />
      </div>

      {/* Title */}
      <h3 className="text-2xl font-bold text-white mb-1">{title}</h3>
      <p className={`text-sm ${c.text} mb-4`}>{tagline}</p>

      {/* Stats */}
      <div className="space-y-2">
        {stats.map((stat, idx) => (
          <div key={idx} className="flex justify-between text-sm">
            <span className="text-slate-400">{stat.label}</span>
            <span className="text-white font-medium">{stat.value}</span>
          </div>
        ))}
      </div>

      {/* Select prompt */}
      <div className={`mt-4 pt-4 border-t ${c.border} text-center`}>
        <span className={`text-sm ${isSelected ? c.text : 'text-slate-500'}`}>
          {isSelected ? '✓ Selected' : 'Click to select'}
        </span>
      </div>
    </motion.button>
  );
}

// Ladder Rung Component
function LadderRung({ 
  rung, 
  track, 
  showUnlimited,
  index,
  isStartingPoint,
}: { 
  rung: Rung; 
  track: 'deck' | 'engine';
  showUnlimited: boolean;
  index: number;
  isStartingPoint?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, margin: '-20% 0px -20% 0px' });
  
  const trackColor = track === 'deck' ? 'blue' : 'amber';
  const bgColor = track === 'deck' ? 'bg-blue-500/10' : 'bg-amber-500/10';
  const borderColor = track === 'deck' ? 'border-blue-500/30' : 'border-amber-500/30';
  const dotColor = track === 'deck' ? 'bg-blue-500' : 'bg-amber-500';

  const getLevelBadge = () => {
    switch (rung.level) {
      case 'entry': return { text: 'Entry Level', color: 'bg-slate-600' };
      case 'rating': return { text: 'Rating', color: 'bg-slate-600' };
      case 'officer': return { text: 'Licensed Officer', color: track === 'deck' ? 'bg-blue-600' : 'bg-amber-600' };
      case 'senior': return { text: 'Senior Officer', color: track === 'deck' ? 'bg-blue-700' : 'bg-amber-700' };
      default: return { text: '', color: '' };
    }
  };

  const levelBadge = getLevelBadge();
  const shouldExpand = isInView;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isInView ? 1 : 0.5, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="relative"
    >
      {/* Starting point indicator */}
      {isStartingPoint && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute -top-8 left-1/2 -translate-x-1/2 z-10"
        >
          <div className={`px-3 py-1 rounded-full ${bgColor} border ${borderColor} flex items-center gap-1.5`}>
            <Sparkles className={`w-3 h-3 ${track === 'deck' ? 'text-blue-400' : 'text-amber-400'}`} />
            <span className={`text-xs font-medium ${track === 'deck' ? 'text-blue-400' : 'text-amber-400'}`}>
              You Start Here
            </span>
          </div>
        </motion.div>
      )}

      {/* Connector line */}
      {index > 0 && (
        <div className={`absolute left-1/2 -top-4 w-0.5 h-4 ${dotColor} opacity-40 -translate-x-1/2`} />
      )}
      
      <Card className={`p-4 ${bgColor} border ${borderColor} transition-all duration-300 ${shouldExpand ? 'ring-1 ring-white/20' : ''} ${isStartingPoint ? 'ring-2 ring-white/40' : ''}`}>
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Badge className={`${levelBadge.color} text-white text-[10px]`}>
                {levelBadge.text}
              </Badge>
              {rung.isLicensed && (
                <Badge className="bg-green-600/20 text-green-400 border-green-500/30 text-[10px]">
                  Licensed
                </Badge>
              )}
            </div>
            <h3 className="text-lg font-bold text-white">{rung.title}</h3>
            {rung.subtitle && (
              <p className="text-sm text-slate-400">{rung.subtitle}</p>
            )}
          </div>
        </div>

        {/* Entry Point Badges */}
        {rung.entryPoints && rung.entryPoints.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {rung.entryPoints.includes('academy') && (
              <div className="flex items-center gap-1 text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full">
                <GraduationCap className="w-3 h-3" />
                <span>Academy Entry</span>
              </div>
            )}
            {rung.entryPoints.includes('hawsepipe') && (
              <div className="flex items-center gap-1 text-xs bg-amber-500/20 text-amber-300 px-2 py-1 rounded-full">
                <Anchor className="w-3 h-3" />
                <span>Hawsepipe</span>
              </div>
            )}
            {rung.entryPoints.includes('military') && (
              <div className="flex items-center gap-1 text-xs bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded-full">
                <Shield className="w-3 h-3" />
                <span>Military</span>
              </div>
            )}
          </div>
        )}

        {/* Expanded Content */}
        <motion.div
          initial={false}
          animate={{ height: shouldExpand ? 'auto' : 0, opacity: shouldExpand ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          {/* Warning */}
          {rung.warning && (
            <div className="flex items-start gap-2 p-3 mb-3 bg-red-500/10 border border-red-500/30 rounded-lg">
              <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-red-300">{rung.warning}</p>
            </div>
          )}

          {/* Requirements Grid */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="p-2 bg-slate-900/50 rounded-lg">
              <div className="flex items-center gap-1.5 mb-1">
                <Clock className="w-3 h-3 text-slate-500" />
                <span className="text-[10px] text-slate-500 uppercase tracking-wide">Sea Time</span>
              </div>
              <p className="text-xs text-slate-300">
                {showUnlimited ? rung.seaTime.unlimited : rung.seaTime.limited}
              </p>
            </div>

            <div className="p-2 bg-slate-900/50 rounded-lg">
              <div className="flex items-center gap-1.5 mb-1">
                <BookOpen className="w-3 h-3 text-slate-500" />
                <span className="text-[10px] text-slate-500 uppercase tracking-wide">Training</span>
              </div>
              <ul className="text-xs text-slate-300 space-y-0.5">
                {rung.training.slice(0, 3).map((t, i) => (
                  <li key={i} className="truncate">• {t}</li>
                ))}
                {rung.training.length > 3 && (
                  <li className="text-slate-500">+{rung.training.length - 3} more</li>
                )}
              </ul>
            </div>

            <div className="p-2 bg-slate-900/50 rounded-lg">
              <div className="flex items-center gap-1.5 mb-1">
                <FileCheck className="w-3 h-3 text-slate-500" />
                <span className="text-[10px] text-slate-500 uppercase tracking-wide">Exams</span>
              </div>
              <ul className="text-xs text-slate-300 space-y-0.5">
                {(showUnlimited ? rung.exams.unlimited : rung.exams.limited)?.slice(0, 3).map((e, i) => (
                  <li key={i} className="truncate">• {e}</li>
                ))}
              </ul>
            </div>

            <div className="p-2 bg-slate-900/50 rounded-lg">
              <div className="flex items-center gap-1.5 mb-1">
                <Target className="w-3 h-3 text-slate-500" />
                <span className="text-[10px] text-slate-500 uppercase tracking-wide">Scope</span>
              </div>
              <p className="text-xs text-slate-300">
                {showUnlimited ? rung.scope.unlimited : rung.scope.limited}
              </p>
            </div>
          </div>

          {/* Limitations */}
          {!showUnlimited && rung.limitations && rung.limitations.length > 0 && (
            <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded-lg mb-3">
              <div className="flex items-center gap-1.5 mb-1">
                <AlertTriangle className="w-3 h-3 text-amber-400" />
                <span className="text-[10px] text-amber-400 uppercase tracking-wide">Limitations</span>
              </div>
              <ul className="text-xs text-amber-200 space-y-0.5">
                {rung.limitations.map((l, i) => (
                  <li key={i}>• {l}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Branches */}
          {rung.branches && rung.branches.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {rung.branches.map((b, i) => (
                <Badge key={i} variant="outline" className="text-[10px] border-slate-600 text-slate-400">
                  {b}
                </Badge>
              ))}
            </div>
          )}

          {/* Note */}
          {rung.note && (
            <div className="flex items-start gap-2 text-xs text-slate-400 italic">
              <Info className="w-3 h-3 flex-shrink-0 mt-0.5" />
              <p>{rung.note}</p>
            </div>
          )}
        </motion.div>
      </Card>
    </motion.div>
  );
}

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export default function TrainingAndEntryPage() {
  const [selectedPath, setSelectedPath] = useState<'academy' | 'hawsepipe' | 'military'>('academy');
  const [showUnlimited, setShowUnlimited] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter rungs based on selected path
  const getFilteredRungs = (rungs: Rung[], path: 'academy' | 'hawsepipe' | 'military') => {
    if (path === 'academy') {
      // Start at officer level (Third Mate / Third A/E)
      return rungs.filter(r => r.level === 'officer' || r.level === 'senior');
    }
    // Hawsepipe and Military show all rungs
    return rungs;
  };

  const filteredDeckRungs = getFilteredRungs(DECK_RUNGS, selectedPath);
  const filteredEngineRungs = getFilteredRungs(ENGINE_RUNGS, selectedPath);

  // Get starting rung ID
  const getStartingRungId = (track: 'deck' | 'engine') => {
    if (selectedPath === 'academy') {
      return track === 'deck' ? 'third-mate' : 'third-ae';
    }
    if (selectedPath === 'hawsepipe') {
      return track === 'deck' ? 'os' : 'wiper';
    }
    // Military - variable entry, highlight officer level
    return track === 'deck' ? 'third-mate' : 'third-ae';
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
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
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/maritime-101" className="hover:text-white transition-colors">Maritime 101</Link>
          <span className="mx-2">/</span>
          <span className="text-white">Training & Career Entry</span>
        </nav>
      </div>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          <Badge className="mb-6 bg-emerald-500/20 text-emerald-400 border-emerald-500/50">
            The Career Ladder
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Training & Career Entry
          </h1>
          <p className="text-xl text-slate-300 mb-4">
            One system. Multiple entry points. Different paths.
          </p>
          <p className="text-slate-400 max-w-2xl mx-auto">
            How you enter the maritime industry should be guided by where you want to end up.
          </p>
        </motion.div>
      </section>

      {/* ========== CHARACTER SELECT ========== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Choose Your Path</h2>
          <p className="text-slate-400">Select your entry point to see the relevant career progression, or dive deeper into each path</p>
        </motion.div>

        {/* Character Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <CharacterCard
            id="academy"
            title="Academy Graduate"
            icon={GraduationCap}
            tagline="Degree → License"
            stats={[
              { label: 'Time to License', value: '4 years' },
              { label: 'Entry Point', value: '3rd Mate / 3rd A/E' },
              { label: 'Sea Time Built In', value: 'Yes' },
            ]}
            color="blue"
            isSelected={selectedPath === 'academy'}
            onSelect={() => setSelectedPath('academy')}
          />
          <CharacterCard
            id="hawsepipe"
            title="Hawsepiper"
            icon={Anchor}
            tagline="Work → Learn → Advance"
            stats={[
              { label: 'Time to License', value: '6-10+ years' },
              { label: 'Entry Point', value: 'OS / Wiper' },
              { label: 'Earn While Learning', value: 'Yes' },
            ]}
            color="amber"
            isSelected={selectedPath === 'hawsepipe'}
            onSelect={() => setSelectedPath('hawsepipe')}
          />
          <CharacterCard
            id="military"
            title="Military to Mariner"
            icon={Shield}
            tagline="Service → Evaluation → Credit"
            stats={[
              { label: 'Time to License', value: 'Varies' },
              { label: 'Entry Point', value: 'Case-by-case' },
              { label: 'Credits Military Time', value: 'Partial/Full' },
            ]}
            color="emerald"
            isSelected={selectedPath === 'military'}
            onSelect={() => setSelectedPath('military')}
          />
        </div>

        {/* ========== PATH SUMMARY + LEARN MORE ========== */}
        <AnimatePresence mode="wait">
          {selectedPath === 'academy' && (
            <motion.div
              key="academy-summary"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="max-w-2xl mx-auto mb-8"
            >
              <Link href="/maritime-101/training-and-entry/academy" className="block">
                <div className="relative p-6 rounded-2xl bg-blue-500/10 border border-blue-500/30 hover:border-blue-400/50 transition-all duration-300 shadow-lg shadow-blue-500/10 hover:shadow-xl hover:shadow-blue-500/20 text-center group">
                  <div className="absolute inset-0 rounded-2xl bg-blue-500/5 blur-xl -z-10" />
                  <p className="text-slate-300 mb-3">
                    Four-year degree programs that include Coast Guard–approved curricula, training ship sea time,
                    and direct licensure upon graduation. 7 academies across the U.S.
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-blue-400 group-hover:text-blue-300 font-semibold transition-colors">
                    All 7 academies, timelines, and what to expect <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </Link>
            </motion.div>
          )}

          {selectedPath === 'hawsepipe' && (
            <motion.div
              key="hawsepipe-summary"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="max-w-2xl mx-auto mb-8"
            >
              <Link href="/maritime-101/training-and-entry/hawsepipe" className="block">
                <div className="relative p-6 rounded-2xl bg-amber-500/10 border border-amber-500/30 hover:border-amber-400/50 transition-all duration-300 shadow-lg shadow-amber-500/10 hover:shadow-xl hover:shadow-amber-500/20 text-center group">
                  <div className="absolute inset-0 rounded-2xl bg-amber-500/5 blur-xl -z-10" />
                  <p className="text-slate-300 mb-3">
                    Start working immediately, earn while you learn, and advance through sea time + training + exams.
                    No degree required. Most hawsepipers attend training schools between ship assignments.
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-amber-400 group-hover:text-amber-300 font-semibold transition-colors">
                    Step-by-step guide, training schools, and economics <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </Link>
            </motion.div>
          )}

          {selectedPath === 'military' && (
            <motion.div
              key="military-summary"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="max-w-2xl mx-auto mb-8"
            >
              <Link href="/maritime-101/training-and-entry/military" className="block">
                <div className="relative p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 hover:border-emerald-400/50 transition-all duration-300 shadow-lg shadow-emerald-500/10 hover:shadow-xl hover:shadow-emerald-500/20 text-center group">
                  <div className="absolute inset-0 rounded-2xl bg-emerald-500/5 blur-xl -z-10" />
                  <p className="text-slate-300 mb-3">
                    Military sea service may be credited toward merchant mariner credentials. The Coast Guard
                    evaluates experience on a case-by-case basis. Entry point varies by role and documentation.
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-emerald-400 group-hover:text-emerald-300 font-semibold transition-colors">
                    Credit evaluation, documentation, and entry points by branch <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <Separator className="max-w-7xl mx-auto bg-slate-800" />

      {/* ========== CAREER LADDER ========== */}
      <section ref={containerRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <Badge className="mb-4 bg-slate-800 text-slate-300 border-slate-700">The Ladder</Badge>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            {selectedPath === 'academy' ? 'Officer Career Progression' :
             selectedPath === 'hawsepipe' ? 'Full Career Ladder' :
             'Career Progression (Variable Entry)'}
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto mb-4">
            {selectedPath === 'academy'
              ? 'Academy graduates enter at the licensed officer level. Your degree and sea time get you here.'
              : selectedPath === 'hawsepipe'
              ? 'Start from the bottom, climb every rung. This is the full hawsepiper journey.'
              : 'Military experience determines your entry point. The ladder shows the full progression.'}
          </p>
          <p className="text-slate-500 text-sm max-w-2xl mx-auto mb-8">
            This ladder covers <strong className="text-slate-300">Deck</strong> and <strong className="text-slate-300">Engine</strong> department positions — the two core shipboard departments found on every vessel. Specialized endorsements (tankerman, towing, DP, etc.) branch off from specific rungs and are listed below the ladder.
          </p>

          {/* Info Callouts */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto mb-8 text-left">
            {/* Sea Days Explainer */}
            <div className="p-4 bg-slate-900/50 border border-slate-700 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-semibold text-white">What Are "Sea Days"?</span>
              </div>
              <p className="text-xs text-slate-400">
                Sea days are days of <strong className="text-slate-300">documented sea service</strong> — actual time aboard a vessel, not calendar days. A mariner working 6 months on / 6 months off earns roughly 180 sea days per year.
              </p>
            </div>

            {/* Unlimited vs Limited Explainer */}
            <div className="p-4 bg-slate-900/50 border border-slate-700 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <Compass className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-semibold text-white">Unlimited vs. Limited</span>
              </div>
              <p className="text-xs text-slate-400">
                <strong className="text-slate-300">Unlimited</strong> credentials have no tonnage or horsepower restrictions — valid for any size vessel. <strong className="text-slate-300">Limited</strong> credentials are restricted by vessel size (GRT) or engine power (HP) and route.
              </p>
            </div>

            {/* Universal Requirements Link */}
            <div className="p-4 bg-slate-900/50 border border-slate-700 rounded-xl sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-2 mb-2">
                <FileCheck className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-semibold text-white">Universal Requirements</span>
              </div>
              <p className="text-xs text-slate-400 mb-2">
                Every mariner needs a TWIC card, medical certificate, passport, and drug testing — regardless of position or department.
              </p>
              <Link href="/maritime-101/credentials" className="text-xs text-blue-400 hover:text-blue-300 font-medium inline-flex items-center gap-1">
                View all on Credentials & Licensing <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Unlimited / Limited Toggle */}
          <div className="inline-flex items-center gap-2 p-1 bg-slate-900 border border-slate-700 rounded-full">
            <button
              onClick={() => setShowUnlimited(true)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                showUnlimited
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Unlimited
            </button>
            <button
              onClick={() => setShowUnlimited(false)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                !showUnlimited
                  ? 'bg-amber-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Limited
            </button>
          </div>

          {!showUnlimited && (
            <p className="text-amber-400 text-sm mt-3">
              Viewing Limited pathway — note restrictions and non-transferability warnings
            </p>
          )}
        </motion.div>

        {/* Dual Spine Ladder */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Deck Track */}
          <div>
            <div className="flex items-center gap-3 mb-6 sticky top-4 z-10 bg-slate-950/90 backdrop-blur-sm py-2 -mx-2 px-2 rounded-lg">
              <div className="p-2 bg-blue-500/20 border border-blue-500/30 rounded-lg">
                <Anchor className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Deck Track</h3>
                <p className="text-xs text-blue-400">Navigation & Command</p>
              </div>
            </div>
            
            <div className="space-y-4">
              {filteredDeckRungs.map((rung, idx) => (
                <LadderRung
                  key={rung.id}
                  rung={rung}
                  track="deck"
                  showUnlimited={showUnlimited}
                  index={idx}
                  isStartingPoint={rung.id === getStartingRungId('deck') && idx === 0}
                />
              ))}
            </div>
          </div>

          {/* Engine Track */}
          <div>
            <div className="flex items-center gap-3 mb-6 sticky top-4 z-10 bg-slate-950/90 backdrop-blur-sm py-2 -mx-2 px-2 rounded-lg">
              <div className="p-2 bg-amber-500/20 border border-amber-500/30 rounded-lg">
                <Wrench className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Engine Track</h3>
                <p className="text-xs text-amber-400">Engineering & Propulsion</p>
              </div>
            </div>
            
            <div className="space-y-4">
              {filteredEngineRungs.map((rung, idx) => (
                <LadderRung
                  key={rung.id}
                  rung={rung}
                  track="engine"
                  showUnlimited={showUnlimited}
                  index={idx}
                  isStartingPoint={rung.id === getStartingRungId('engine') && idx === 0}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <Separator className="max-w-7xl mx-auto bg-slate-800" />

      {/* Specializations */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <Badge className="mb-4 bg-slate-800 text-slate-300 border-slate-700">Side Paths</Badge>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Specializations & Branches</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            From specific rungs, you can branch into specialized endorsements.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {SPECIALIZATIONS.map((spec, idx) => (
            <motion.div
              key={spec.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card className="p-4 bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4 text-violet-400" />
                  <h4 className="font-semibold text-white">{spec.title}</h4>
                </div>
                <p className="text-xs text-slate-400 mb-2">{spec.description}</p>
                <Badge variant="outline" className="text-[10px] border-slate-700 text-slate-500">
                  {spec.track === 'both' ? 'Deck & Engine' : spec.track === 'deck' ? 'Deck Only' : 'Engine Only'}
                </Badge>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      <Separator className="max-w-7xl mx-auto bg-slate-800" />

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Start with your end goal, then choose your entry wisely.
          </h2>
          <p className="text-slate-400 mb-8 max-w-2xl mx-auto">
            Understanding the ladder is the first step. Now explore the careers available 
            and the credentials you'll need.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/maritime-101/careers-and-sectors">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Explore Careers & Sectors
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/maritime-101/credentials">
              <Button size="lg" className="bg-blue-500/20 text-blue-400 border border-blue-500/50 hover:bg-blue-500/30">
                View Credential Requirements
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}