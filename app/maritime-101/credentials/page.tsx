'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import {
  Shield,
  CreditCard,
  FileText,
  Stethoscope,
  Globe,
  GraduationCap,
  Building2,
  Users,
  ChevronUp,
  ChevronDown,
  ExternalLink,
  ArrowRight,
  Check,
  Anchor,
  Wrench,
  Award,
  Layers,
  Lock,
  Plane,
  BadgeCheck,
  ClipboardList,
  BookOpen,
  Ship,
  AlertCircle,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

// ============================================================================
// COMPONENTS
// ============================================================================

// External Link Component
function ExtLink({
  href,
  children,
  className = '',
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-1.5 text-blue-400 hover:text-blue-300 transition-colors ${className}`}
    >
      {children}
      <ExternalLink className="w-3.5 h-3.5" />
    </a>
  );
}

// Scroll-Reveal Section Component
function RevealSection({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-10% 0px -10% 0px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Horizontal Timeline Step
function TimelineStep({
  step,
  title,
  description,
  bullets,
  linkText,
  linkHref,
  icon: Icon,
  isLast = false,
}: {
  step: number;
  title: string;
  description: string;
  bullets: string[];
  linkText: string;
  linkHref: string;
  icon: React.ElementType;
  isLast?: boolean;
}) {
  return (
    <div className="flex-1 relative">
      {/* Connector Line */}
      {!isLast && (
        <div className="hidden md:block absolute top-8 left-[calc(50%+2rem)] right-0 h-0.5 bg-gradient-to-r from-blue-500/50 to-blue-500/20" />
      )}

      <div className="flex flex-col items-center text-center">
        {/* Step Number Circle */}
        <div className="relative mb-4">
          <div className="w-16 h-16 rounded-full bg-blue-500/20 border-2 border-blue-500/50 flex items-center justify-center">
            <Icon className="w-7 h-7 text-blue-400" />
          </div>
          <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold text-white">
            {step}
          </div>
        </div>

        {/* Content */}
        <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
        <p className="text-sm text-slate-400 mb-4 max-w-xs">{description}</p>

        {/* Bullets */}
        <ul className="text-xs text-slate-500 space-y-1 mb-4">
          {bullets.map((b, i) => (
            <li key={i}>• {b}</li>
          ))}
        </ul>

        {/* Link */}
        <ExtLink href={linkHref} className="text-sm font-medium">
          {linkText}
        </ExtLink>
      </div>
    </div>
  );
}

// MMC Wallet Component - Interactive "Open the Wallet" Animation
function MMCWallet() {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-20% 0px' });

  const contents = [
    {
      label: 'Entry-Level Ratings',
      examples: 'OS, Wiper, Steward',
      color: 'bg-slate-600',
    },
    { label: 'Ratings', examples: 'AB, QMED', color: 'bg-blue-600' },
    {
      label: 'Officer Licenses',
      examples: 'Mate, Master, Engineer',
      color: 'bg-emerald-600',
    },
    {
      label: 'Endorsements',
      examples: 'STCW, Tankerman, Towing',
      color: 'bg-amber-600',
    },
    {
      label: 'Limitations',
      examples: 'Tonnage, Route, Propulsion',
      color: 'bg-violet-600',
    },
  ];

  return (
    <div ref={ref} className="relative max-w-2xl mx-auto">
      {/* The Wallet/Card */}
      <motion.div
        className="relative cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* MMC Card - Front */}
        <motion.div
          className="relative z-10 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 border border-slate-600 rounded-2xl p-6 shadow-2xl"
          animate={isOpen ? { y: -20 } : { y: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        >
          {/* Card Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-blue-500/20 border border-blue-500/40 flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <div className="text-xs text-slate-500 uppercase tracking-wider">
                  U.S. Coast Guard
                </div>
                <div className="text-xl font-bold text-white">
                  Merchant Mariner Credential
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-500">MMC</div>
              <Shield className="w-8 h-8 text-blue-500/50" />
            </div>
          </div>

          {/* Card Body */}
          <div className="bg-slate-950/50 rounded-xl p-4 mb-4">
            <p className="text-slate-300 text-sm leading-relaxed">
              The MMC is the central credential in the U.S. maritime system.
            </p>
            <p className="text-blue-400 font-semibold mt-2">
              The MMC is a container. Licenses, ratings, and endorsements live
              inside it.
            </p>
          </div>

          {/* Tap to open indicator */}
          <div className="flex items-center justify-center gap-2 text-slate-500 text-sm">
            <motion.div
              animate={{ y: isOpen ? 0 : [0, -4, 0] }}
              transition={{ repeat: isOpen ? 0 : Infinity, duration: 1.5 }}
            >
              {isOpen ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </motion.div>
            <span>{isOpen ? 'Tap to close' : "Tap to see what's inside"}</span>
          </div>
        </motion.div>

        {/* Contents that slide out */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 25,
                delay: 0.1,
              }}
              className="relative z-0 mt-4"
            >
              <div className="bg-slate-900/80 border border-slate-700 rounded-xl p-4 space-y-3">
                <div className="text-xs text-slate-500 uppercase tracking-wider mb-3">
                  Inside Your MMC
                </div>

                {contents.map((item, idx) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 + idx * 0.08 }}
                    className="flex items-center gap-3"
                  >
                    <div className={`w-2 h-2 rounded-full ${item.color}`} />
                    <div className="flex-1">
                      <span className="text-white text-sm font-medium">
                        {item.label}
                      </span>
                      <span className="text-slate-500 text-xs ml-2">
                        ({item.examples})
                      </span>
                    </div>
                  </motion.div>
                ))}

                <Separator className="bg-slate-700 my-4" />

                <p className="text-xs text-slate-400 italic">
                  As your career progresses, your MMC evolves with you.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Auto-open on scroll into view */}
      {isInView && !isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          onAnimationComplete={() => setIsOpen(true)}
        />
      )}
    </div>
  );
}

// Visual Stack Component for STCW vs National
function CredentialStack() {
  const layers = [
    {
      label: 'STCW',
      sublabel: 'International Authority',
      color: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400',
    },
    {
      label: 'National License or Rating',
      sublabel: 'Domestic Authority',
      color: 'bg-blue-500/20 border-blue-500/40 text-blue-400',
    },
    {
      label: 'Merchant Mariner Credential (MMC)',
      sublabel: 'The Container',
      color: 'bg-slate-700/50 border-slate-600 text-slate-300',
    },
  ];

  return (
    <div className="max-w-md mx-auto space-y-2">
      {layers.map((layer, idx) => (
        <motion.div
          key={layer.label}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: idx * 0.15 }}
          className={`p-4 rounded-xl border ${layer.color} text-center`}
        >
          <div className="font-semibold">{layer.label}</div>
          <div className="text-xs opacity-70">{layer.sublabel}</div>
        </motion.div>
      ))}
    </div>
  );
}

// Flow Diagram Component
function FlowDiagram() {
  const steps = [
    { label: 'TWIC + Passport', icon: Lock },
    { label: 'Medical Certificate', sublabel: 'CG-719K', icon: Stethoscope },
    { label: 'Merchant Mariner Credential', sublabel: 'MMC', icon: CreditCard },
    { label: 'National & STCW Endorsements', icon: Globe },
    { label: 'Company / Union Training', icon: Building2 },
  ];

  return (
    <div className="max-w-xs mx-auto space-y-2">
      {steps.map((step, idx) => (
        <div key={step.label}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="flex items-center gap-3 p-3 bg-slate-900/50 border border-slate-800 rounded-lg"
          >
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
              <step.icon className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <div className="text-sm font-medium text-white">{step.label}</div>
              {step.sublabel && (
                <div className="text-xs text-slate-500">{step.sublabel}</div>
              )}
            </div>
          </motion.div>

          {idx < steps.length - 1 && (
            <div className="flex justify-center py-1">
              <ChevronDown className="w-4 h-4 text-slate-600" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// Checklist Item Component
function ChecklistItem({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Check className="w-3 h-3 text-emerald-400" />
      </div>
      <span className="text-slate-300 text-sm">{children}</span>
    </div>
  );
}

// Definition Card Component
function DefinitionCard({
  title,
  description,
  note,
  color,
}: {
  title: string;
  description: string;
  note: string;
  color: 'blue' | 'amber' | 'violet';
}) {
  const colorClasses = {
    blue: {
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/30',
      text: 'text-blue-400',
    },
    amber: {
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/30',
      text: 'text-amber-400',
    },
    violet: {
      bg: 'bg-violet-500/10',
      border: 'border-violet-500/30',
      text: 'text-violet-400',
    },
  };

  const c = colorClasses[color];

  return (
    <Card className={`p-5 ${c.bg} border ${c.border}`}>
      <h4 className={`text-lg font-bold ${c.text} mb-2`}>{title}</h4>
      <p className="text-slate-300 text-sm mb-3">{description}</p>
      <p className="text-slate-500 text-xs italic">{note}</p>
    </Card>
  );
}

// ============================================================================
// MAIN PAGE
// ============================================================================

export default function CredentialsPage() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Back to top */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 z-40 p-3 bg-slate-900 border border-slate-700 rounded-full shadow-lg hover:bg-slate-800 transition-colors"
      >
        <ChevronUp className="w-5 h-5 text-slate-400" />
      </motion.button>

      {/* Breadcrumbs */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
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
          <span className="text-white">Credentials & Licensing</span>
        </nav>
      </div>

      {/* ========== HERO ========== */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Badge className="mb-6 bg-blue-500/20 text-blue-400 border-blue-500/50">
            Maritime 101
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Credentials & Licensing
          </h1>
          <p className="text-xl text-slate-300 mb-4 max-w-3xl mx-auto">
            The documents that determine who you are, where you can sail, and
            what you're legally allowed to do.
          </p>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Working as a merchant mariner requires more than a single "license."
            U.S. mariners operate under a layered system of identity documents,
            Coast Guard credentials, medical approvals, and training
            requirements — each serving a distinct legal purpose.
          </p>
        </motion.div>
      </section>

      {/* ========== IF YOU'RE COMPLETELY NEW ========== */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <RevealSection>
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-emerald-500/20 text-emerald-400 border-emerald-500/50">
              Starting Point
            </Badge>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              If You're Completely New
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              If you are starting from zero, most mariners follow this sequence
              — not because it's arbitrary, but because the system is designed
              this way.
            </p>
          </div>

          {/* Horizontal Timeline */}
          <div className="flex flex-col md:flex-row gap-8 md:gap-4">
            <TimelineStep
              step={1}
              title="Get a TWIC Card"
              description="The Transportation Worker Identification Credential verifies your identity and security clearance."
              bullets={[
                'Issued by TSA',
                'Valid for 5 years',
                'Required before MMC application',
                'Does not authorize work',
              ]}
              linkText="Apply for a TWIC"
              linkHref="https://www.tsa.gov/for-industry/twic"
              icon={Lock}
            />
            <TimelineStep
              step={2}
              title="Get a Passport"
              description="Many U.S.-flag vessels sail internationally or require international travel for crew changes."
              bullets={[
                'Required for international voyages',
                'Strongly recommended for all mariners',
                'Often required by employers',
              ]}
              linkText="Apply for a Passport"
              linkHref="https://travel.state.gov/passport"
              icon={Plane}
            />
            <TimelineStep
              step={3}
              title="Apply for Your First MMC"
              description="The Merchant Mariner Credential authorizes you to work aboard U.S.-flagged vessels."
              bullets={[
                'Issued by U.S. Coast Guard',
                'Gateway into the industry',
                'Enables employment or training',
              ]}
              linkText="NMC Forms"
              linkHref="https://www.dco.uscg.mil/nmc/forms/"
              icon={CreditCard}
              isLast
            />
          </div>
        </RevealSection>
      </section>

      <Separator className="max-w-5xl mx-auto bg-slate-800" />

      {/* ========== THE NMC ========== */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <RevealSection>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-slate-800 text-slate-300 border-slate-700">
                The Authority
              </Badge>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                The National Maritime Center
              </h2>
              <p className="text-slate-300 mb-6">
                The National Maritime Center (NMC) is part of the U.S. Coast
                Guard and administers the merchant mariner credentialing system.
              </p>
              <p className="text-slate-400 text-sm mb-6">
                When mariners talk about "the Coast Guard" in credentialing
                conversations, they are usually referring to the NMC.
              </p>
              <ExtLink
                href="https://www.dco.uscg.mil/nmc/"
                className="text-base font-medium"
              >
                National Maritime Center
              </ExtLink>
            </div>

            <Card className="p-6 bg-slate-900/50 border border-slate-800">
              <h3 className="text-lg font-semibold text-white mb-4">
                The NMC:
              </h3>
              <ul className="space-y-3">
                {[
                  'Processes MMC applications',
                  'Evaluates sea service',
                  'Issues licenses and endorsements',
                  'Administers Coast Guard examinations',
                  'Manages medical certification',
                ].map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-center gap-3 text-slate-300"
                  >
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </RevealSection>
      </section>

      <Separator className="max-w-5xl mx-auto bg-slate-800" />

      {/* ========== CORE DOCUMENTS ========== */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <RevealSection>
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-slate-800 text-slate-300 border-slate-700">
              Foundation
            </Badge>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              The Core Documents Everyone Needs
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              These documents are foundational. They are not licenses — but
              without them, nothing else happens.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <Card className="p-6 bg-slate-900/50 border border-slate-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                  <Lock className="w-6 h-6 text-amber-400" />
                </div>
                <h3 className="text-xl font-bold text-white">TWIC Card</h3>
              </div>
              <p className="text-slate-300 text-sm mb-3">
                A security and identity credential required to access ports and
                vessels.
              </p>
              <p className="text-slate-500 text-xs">
                Required before applying for an MMC.
              </p>
            </Card>

            <Card className="p-6 bg-slate-900/50 border border-slate-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                  <Plane className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-white">Passport</h3>
              </div>
              <p className="text-slate-300 text-sm mb-3">
                An international travel document required for most international
                service and many domestic positions.
              </p>
              <p className="text-slate-500 text-xs">
                Strongly recommended for all mariners.
              </p>
            </Card>
          </div>
        </RevealSection>
      </section>

      <Separator className="max-w-5xl mx-auto bg-slate-800" />

      {/* ========== THE MMC (WALLET) ========== */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <RevealSection>
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-blue-500/20 text-blue-400 border-blue-500/50">
              The Centerpiece
            </Badge>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              The Merchant Mariner Credential
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              The central credential in the U.S. maritime system.
            </p>
          </div>

          <MMCWallet />
        </RevealSection>
      </section>

      <Separator className="max-w-5xl mx-auto bg-slate-800" />

      {/* ========== GETTING YOUR FIRST MMC ========== */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <RevealSection>
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <Badge className="mb-4 bg-emerald-500/20 text-emerald-400 border-emerald-500/50">
                Entry Level
              </Badge>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Getting Your First MMC
              </h2>
              <p className="text-slate-300 mb-4">
                Entry-level MMC endorsements require no sea time and are
                designed for mariners entering the industry for the first time.
              </p>
              <p className="text-slate-400 text-sm mb-6">
                Common entry-level endorsements include:
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                <Badge
                  variant="outline"
                  className="border-slate-600 text-slate-300"
                >
                  Ordinary Seaman (OS)
                </Badge>
                <Badge
                  variant="outline"
                  className="border-slate-600 text-slate-300"
                >
                  Wiper
                </Badge>
                <Badge
                  variant="outline"
                  className="border-slate-600 text-slate-300"
                >
                  Steward's Department
                </Badge>
              </div>
              <ExtLink
                href="https://www.dco.uscg.mil/nmc/forms/"
                className="text-base font-medium"
              >
                Official Coast Guard Forms
              </ExtLink>
            </div>

            <Card className="p-6 bg-slate-900/50 border border-slate-800">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-emerald-400" />
                Required Items
              </h3>
              <div className="space-y-3">
                <ChecklistItem>Valid TWIC card</ChecklistItem>
                <ChecklistItem>
                  Completed CG-719B (Application for MMC)
                </ChecklistItem>
                <ChecklistItem>
                  Proof of U.S. citizenship or permanent residency
                </ChecklistItem>
                <ChecklistItem>
                  Drug test completed within previous 6 months
                </ChecklistItem>
                <ChecklistItem>
                  Coast Guard medical certificate (or application in process)
                </ChecklistItem>
                <ChecklistItem>Applicable fees</ChecklistItem>
              </div>
            </Card>
          </div>
        </RevealSection>
      </section>

      <Separator className="max-w-5xl mx-auto bg-slate-800" />

      {/* ========== MEDICAL CERTIFICATION ========== */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <RevealSection>
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <Badge className="mb-4 bg-red-500/20 text-red-400 border-red-500/50">
                Required
              </Badge>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                Medical Certification
              </h2>
              <p className="text-slate-400">
                All mariners must hold a valid Coast Guard medical certificate
                certifying fitness for duty.
              </p>
            </div>

            <Card className="p-6 bg-slate-900/50 border border-slate-800 mb-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center flex-shrink-0">
                  <Stethoscope className="w-6 h-6 text-red-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Medical certification is:
                  </h3>
                  <ul className="text-slate-300 text-sm space-y-1">
                    <li>• Required for original MMC issuance</li>
                    <li>• Required for license upgrades</li>
                    <li>• Required for renewals</li>
                  </ul>
                </div>
              </div>
            </Card>

            <div className="flex items-start gap-3 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl mb-6">
              <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <p className="text-amber-200 text-sm">
                A company or employer physical does <strong>not</strong> replace
                Coast Guard medical certification.
              </p>
            </div>

            <div className="text-center">
              <p className="text-slate-400 text-sm mb-2">
                Required Form:{' '}
                <span className="text-white font-medium">CG-719K</span>
              </p>
              <ExtLink
                href="https://www.dco.uscg.mil/nmc/forms/"
                className="text-base font-medium"
              >
                Medical Certificate Forms
              </ExtLink>
            </div>
          </div>
        </RevealSection>
      </section>

      <Separator className="max-w-5xl mx-auto bg-slate-800" />

      {/* ========== NATIONAL VS STCW ========== */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <RevealSection>
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-slate-800 text-slate-300 border-slate-700">
              Key Distinction
            </Badge>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              National vs STCW Credentials
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              One of the most common sources of confusion in maritime careers.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* National */}
            <Card className="p-6 bg-blue-500/5 border border-blue-500/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 border border-blue-500/40 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-blue-400">
                  National Credentials
                </h3>
              </div>
              <p className="text-slate-300 text-sm mb-4">
                National credentials govern your{' '}
                <strong>domestic authority</strong> to work aboard U.S.-flagged
                vessels.
              </p>
              <div className="text-xs text-slate-500 mb-3">Examples:</div>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-blue-500/10 text-blue-300 border-blue-500/30">
                  Able Seaman
                </Badge>
                <Badge className="bg-blue-500/10 text-blue-300 border-blue-500/30">
                  Mate 500/1600
                </Badge>
                <Badge className="bg-blue-500/10 text-blue-300 border-blue-500/30">
                  Master 1600
                </Badge>
                <Badge className="bg-blue-500/10 text-blue-300 border-blue-500/30">
                  QMED
                </Badge>
              </div>
            </Card>

            {/* STCW */}
            <Card className="p-6 bg-emerald-500/5 border border-emerald-500/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                  <Globe className="w-5 h-5 text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-emerald-400">
                  STCW Endorsements
                </h3>
              </div>
              <p className="text-slate-300 text-sm mb-4">
                STCW is an <strong>international framework</strong> established
                by the IMO. Required for most international voyages.
              </p>
              <p className="text-slate-500 text-xs">
                A mariner may hold a national license and still be prohibited
                from sailing internationally without appropriate STCW
                endorsements.
              </p>
            </Card>
          </div>

          {/* BST Callout */}
          <Card className="p-6 bg-slate-900/50 border border-slate-800 mb-12 max-w-3xl mx-auto">
            <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-400" />
              STCW Basic Safety Training (BST)
            </h4>
            <p className="text-slate-300 text-sm mb-4">
              At the foundation of STCW is Basic Safety Training. BST is
              required for international voyages, most deep-sea vessels, and
              many government/commercial operations.
            </p>
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-xs text-slate-500 uppercase tracking-wide mb-2">
                  BST Includes
                </div>
                <ul className="text-sm text-slate-300 space-y-1">
                  <li>• Personal Survival Techniques</li>
                  <li>• Fire Prevention and Firefighting</li>
                  <li>• Elementary First Aid</li>
                  <li>• Personal Safety & Social Responsibility</li>
                </ul>
              </div>
              <div>
                <div className="text-xs text-slate-500 uppercase tracking-wide mb-2">
                  Important Notes
                </div>
                <ul className="text-sm text-slate-400 space-y-1">
                  <li>• Must be USCG-approved training</li>
                  <li>• Company training doesn't replace it</li>
                  <li>• Enables international service</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Key Statement */}
          <div className="text-center mb-8">
            <p className="text-lg text-white font-semibold">
              STCW does not replace national licenses — it supplements them.
            </p>
          </div>

          {/* Visual Stack */}
          <CredentialStack />
        </RevealSection>
      </section>

      <Separator className="max-w-5xl mx-auto bg-slate-800" />

      {/* ========== LICENSES VS ENDORSEMENTS VS TRAINING ========== */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <RevealSection>
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-slate-800 text-slate-300 border-slate-700">
              Definitions
            </Badge>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              Licenses, Endorsements & Training
            </h2>
            <p className="text-slate-400">What's the difference?</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <DefinitionCard
              title="License"
              description="Grants legal authority to perform a role aboard a vessel."
              note="Issued by the U.S. Coast Guard"
              color="blue"
            />
            <DefinitionCard
              title="Endorsement"
              description="Expands or limits that authority."
              note="Also issued by the Coast Guard"
              color="amber"
            />
            <DefinitionCard
              title="Training / Certification"
              description="Issued by schools, unions, or employers. Supports licenses and endorsements."
              note="Does not grant authority by itself"
              color="violet"
            />
          </div>

          <div className="text-center">
            <p className="text-lg text-white font-semibold">
              Training supports licenses. It does not replace them.
            </p>
          </div>
        </RevealSection>
      </section>

      <Separator className="max-w-5xl mx-auto bg-slate-800" />

      {/* ========== BEYOND THE COAST GUARD ========== */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <RevealSection>
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <Badge className="mb-4 bg-slate-800 text-slate-300 border-slate-700">
                Additional Requirements
              </Badge>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                Beyond the Coast Guard
              </h2>
              <p className="text-slate-400">
                In addition to Coast Guard requirements, mariners may need:
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {[
                { icon: Building2, label: 'Company-specific training' },
                { icon: Users, label: 'Union training' },
                { icon: Ship, label: 'Vessel-specific qualifications' },
                {
                  icon: Shield,
                  label: 'Security requirements (CAC, MSC, etc.)',
                },
              ].map((item, idx) => (
                <Card
                  key={idx}
                  className="p-4 bg-slate-900/50 border border-slate-800 flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-slate-400" />
                  </div>
                  <span className="text-slate-300 text-sm">{item.label}</span>
                </Card>
              ))}
            </div>

            <p className="text-center text-slate-400 text-sm">
              These requirements are important — but they sit{' '}
              <strong className="text-white">on top of</strong> Coast Guard
              credentials, not instead of them.
            </p>
          </div>
        </RevealSection>
      </section>

      <Separator className="max-w-5xl mx-auto bg-slate-800" />

      {/* ========== HOW IT ALL FITS TOGETHER ========== */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <RevealSection>
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-emerald-500/20 text-emerald-400 border-emerald-500/50">
              The Big Picture
            </Badge>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              How It All Fits Together
            </h2>
          </div>

          <FlowDiagram />
        </RevealSection>
      </section>

      <Separator className="max-w-5xl mx-auto bg-slate-800" />

      {/* ========== CTA ========== */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <RevealSection>
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Understanding the credential system makes every career decision
              easier.
            </h2>
            <p className="text-slate-400 mb-8 max-w-2xl mx-auto">
              Explore the system. Then use it intentionally.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/maritime-101/training-and-entry">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  View Career Ladders
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/maritime-101/training-and-entry">
                <Button
                  size="lg"
                  className="bg-blue-500/20 text-blue-400 border border-blue-500/50 hover:bg-blue-500/30"
                >
                  Explore Training Paths
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="ghost"
                className="text-slate-500"
                disabled
              >
                Track Credentials (Coming Soon)
              </Button>
            </div>
          </div>
        </RevealSection>
      </section>
    </div>
  );
}
