'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Compass,
  Ship,
  Anchor,
  GraduationCap,
  Award,
  ChevronRight,
  HelpCircle,
  Briefcase,
  MapPin,
  Users,
  Clock,
  ArrowRight,
  Sparkles,
  Target,
  BookOpen,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

/**
 * Maritime 101 Index Page
 * Helps users navigate to the right content based on their situation
 */

// Main content sections in logical order
const CORE_SECTIONS = [
  {
    id: 'what-is',
    number: '01',
    title: 'What is the Merchant Marine?',
    description: 'The basics: what civilian mariners do, who employs them, and why this career path exists.',
    href: '/maritime-101/what-is-merchant-marine',
    icon: Compass,
    color: 'blue',
    timeToRead: '5 min read',
    bestFor: 'Complete beginners',
  },
  {
    id: 'careers',
    number: '02',
    title: 'Careers & Sectors',
    description: 'Explore departments (deck, engine, steward), positions from entry to command, and the 11 sectors where mariners work.',
    href: '/maritime-101/careers-and-sectors',
    icon: Briefcase,
    color: 'emerald',
    timeToRead: '15 min read',
    bestFor: 'Exploring options',
  },
  {
    id: 'life-at-sea',
    number: '03',
    title: 'Life at Sea',
    description: 'What it\'s really like: watches, rotations, living quarters, connectivity, crew dynamics, and honest expectations.',
    href: '/maritime-101/life-at-sea',
    icon: Ship,
    color: 'violet',
    timeToRead: '10 min read',
    bestFor: 'Making the decision',
  },
  {
    id: 'training',
    number: '04',
    title: 'Training & Career Entry',
    description: 'How to actually get started: maritime academies, hawsepipe path, union halls, and entry-level positions.',
    href: '/maritime-101/training-and-entry',
    icon: GraduationCap,
    color: 'amber',
    timeToRead: '12 min read',
    bestFor: 'Ready to start',
  },
  {
    id: 'credentials',
    number: '05',
    title: 'Credentials & Licensing',
    description: 'MMC, TWIC, STCW, medical certificates — what you need, how to get it, and how to maintain it.',
    href: '/maritime-101/credentials',
    icon: Award,
    color: 'rose',
    timeToRead: '10 min read',
    bestFor: 'Getting credentialed',
  },
];

// Quick-start paths based on user situation
const QUICK_PATHS = [
  {
    question: "I know nothing about maritime careers",
    answer: "Start with What is the Merchant Marine, then explore Careers & Sectors",
    links: [
      { label: 'Start Here', href: '/maritime-101/what-is-merchant-marine' },
    ],
    icon: HelpCircle,
    color: 'blue',
  },
  {
    question: "I'm considering this career but unsure",
    answer: "Read Life at Sea for honest expectations, then explore what sectors fit your lifestyle",
    links: [
      { label: 'Life at Sea', href: '/maritime-101/life-at-sea' },
      { label: 'Careers & Sectors', href: '/maritime-101/careers-and-sectors' },
    ],
    icon: Target,
    color: 'violet',
  },
  {
    question: "I've decided to pursue this — what now?",
    answer: "Training & Entry shows your options, then Credentials explains what paperwork you need",
    links: [
      { label: 'Training & Entry', href: '/maritime-101/training-and-entry' },
      { label: 'Credentials', href: '/maritime-101/credentials' },
    ],
    icon: Sparkles,
    color: 'emerald',
  },
  {
    question: "I'm already a mariner looking for info",
    answer: "Check out our ship pages, port guides, and MSC-specific tools",
    links: [
      { label: 'Ships', href: '/ships' },
      { label: 'Ports', href: '/ports' },
      { label: 'Tools', href: '/tools' },
    ],
    icon: Anchor,
    color: 'amber',
  },
];

// Sector quick links
const SECTORS = [
  { name: 'Government (MSC/NOAA)', href: '/maritime-101/sectors/government' },
  { name: 'Commercial Deep Sea', href: '/maritime-101/sectors/commercial-deep-sea' },
  { name: 'Offshore Rigs', href: '/maritime-101/sectors/offshore-rigs' },
  { name: 'Offshore Supply', href: '/maritime-101/sectors/offshore-supply' },
  { name: 'Tugboats', href: '/maritime-101/sectors/tugboats' },
  { name: 'Barges', href: '/maritime-101/sectors/barges' },
  { name: 'Ferries', href: '/maritime-101/sectors/ferries' },
  { name: 'Cruise Ships', href: '/maritime-101/sectors/cruise-ships' },
  { name: 'Yachts', href: '/maritime-101/sectors/yachts' },
  { name: 'Fishing', href: '/maritime-101/sectors/fishing' },
  { name: 'Pilots', href: '/maritime-101/sectors/pilots' },
];

// Color mapping
const colorMap: Record<string, { bg: string; border: string; text: string; icon: string }> = {
  blue: {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    text: 'text-blue-400',
    icon: 'bg-blue-500/20',
  },
  emerald: {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    text: 'text-emerald-400',
    icon: 'bg-emerald-500/20',
  },
  violet: {
    bg: 'bg-violet-500/10',
    border: 'border-violet-500/30',
    text: 'text-violet-400',
    icon: 'bg-violet-500/20',
  },
  amber: {
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    text: 'text-amber-400',
    icon: 'bg-amber-500/20',
  },
  rose: {
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/30',
    text: 'text-rose-400',
    icon: 'bg-rose-500/20',
  },
};

export default function Maritime101Page() {
  const [expandedPath, setExpandedPath] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <nav className="flex items-center text-sm text-slate-400">
          <Link href="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-white">Maritime 101</span>
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
            Start Here
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Maritime 101
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 mb-4">
            Your guide to understanding and entering the maritime industry
          </p>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Whether you&apos;re exploring careers, preparing to enter the field, or just curious — 
            start here and work through the sections in order, or jump to what you need.
          </p>
        </motion.div>
      </section>

      {/* Quick Path Finder */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Where are you in your journey?</h2>
            <p className="text-slate-400">Click your situation for a recommended path</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {QUICK_PATHS.map((path, idx) => {
              const colors = colorMap[path.color];
              const isExpanded = expandedPath === idx;

              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card
                    className={`p-5 cursor-pointer transition-all duration-300 ${
                      isExpanded
                        ? `${colors.bg} ${colors.border}`
                        : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                    }`}
                    onClick={() => setExpandedPath(isExpanded ? null : idx)}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-2 rounded-lg ${colors.icon}`}>
                        <path.icon className={`w-5 h-5 ${colors.text}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-medium mb-1">{path.question}</h3>
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <p className="text-slate-400 text-sm mb-3">{path.answer}</p>
                            <div className="flex flex-wrap gap-2">
                              {path.links.map((link, linkIdx) => (
                                <Link key={linkIdx} href={link.href}>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className={`${colors.border} ${colors.text} hover:${colors.bg}`}
                                  >
                                    {link.label}
                                    <ArrowRight className="w-3 h-3 ml-1" />
                                  </Button>
                                </Link>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </div>
                      <ChevronRight
                        className={`w-5 h-5 text-slate-500 transition-transform ${
                          isExpanded ? 'rotate-90' : ''
                        }`}
                      />
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </section>

      {/* Main Content Sections */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <Badge className="mb-4 bg-slate-800 text-slate-300 border-slate-700">
            The Full Guide
          </Badge>
          <h2 className="text-3xl font-bold text-white mb-3">Learn in Order</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            These five sections build on each other. New to maritime? Start at the top and work down.
          </p>
        </motion.div>

        {/* Journey line + sections */}
        <div className="relative max-w-4xl mx-auto">
          {/* Vertical line connecting sections */}
          <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-blue-500 via-emerald-500 via-violet-500 via-amber-500 to-rose-500 hidden md:block" />

          <div className="space-y-6">
            {CORE_SECTIONS.map((section, idx) => {
              const colors = colorMap[section.color];
              const isLast = idx === CORE_SECTIONS.length - 1;

              return (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Link href={section.href}>
                    <Card
                      className={`p-6 ${colors.bg} ${colors.border} hover:scale-[1.02] transition-all duration-300 ml-0 md:ml-16 relative`}
                    >
                      {/* Number badge - connects to line on desktop */}
                      <div
                        className={`absolute -left-16 top-6 w-8 h-8 rounded-full ${colors.icon} ${colors.border} border-2 items-center justify-center font-mono text-sm ${colors.text} hidden md:flex`}
                      >
                        {section.number}
                      </div>

                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-xl ${colors.icon} ${colors.border} border md:hidden`}>
                          <section.icon className={`w-6 h-6 ${colors.text}`} />
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className={`text-xs font-mono ${colors.text} md:hidden`}>
                              {section.number}
                            </span>
                            <h3 className="text-xl font-bold text-white">{section.title}</h3>
                          </div>
                          <p className="text-slate-300 mb-3">{section.description}</p>
                          <div className="flex items-center gap-4 text-sm">
                            <span className="text-slate-500 flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {section.timeToRead}
                            </span>
                            <Badge variant="outline" className={`${colors.border} ${colors.text}`}>
                              {section.bestFor}
                            </Badge>
                          </div>
                        </div>

                        <div className={`p-3 rounded-xl ${colors.icon} ${colors.border} border hidden md:block`}>
                          <section.icon className={`w-6 h-6 ${colors.text}`} />
                        </div>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Sector Quick Links */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 className="text-2xl font-bold text-white mb-2">Explore by Sector</h2>
          <p className="text-slate-400">
            Each sector has different rotations, pay, and lifestyle. Dive into specifics.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-2 max-w-4xl mx-auto"
        >
          {SECTORS.map((sector, idx) => (
            <Link key={idx} href={sector.href}>
              <Badge
                variant="outline"
                className="px-4 py-2 bg-slate-900/50 border-slate-700 text-slate-300 hover:border-slate-500 hover:text-white transition-colors cursor-pointer"
              >
                {sector.name}
              </Badge>
            </Link>
          ))}
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Card className="p-8 md:p-12 bg-gradient-to-br from-blue-600/20 to-blue-900/40 border-blue-500/30 text-center">
            <BookOpen className="w-12 h-12 text-blue-400 mx-auto mb-4" />
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              New here? Start at the beginning.
            </h2>
            <p className="text-slate-300 mb-6 max-w-xl mx-auto">
              &quot;What is the Merchant Marine?&quot; gives you the foundation to understand 
              everything else. It only takes 5 minutes.
            </p>
            <Link href="/maritime-101/what-is-merchant-marine">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                Start with the Basics
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </Card>
        </motion.div>
      </section>
    </div>
  );
}
