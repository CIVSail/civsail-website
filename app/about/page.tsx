'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, Eye, Users, Scale, Mail } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const PRINCIPLES = [
  {
    title: 'Independent',
    description:
      'CIVSail is not affiliated with any employer, union, or government agency. The platform exists to serve mariners.',
    icon: Shield,
    color: 'blue',
  },
  {
    title: 'Transparent',
    description:
      'Information is presented as clearly and honestly as possible. Where things are uncertain or incomplete, we say so.',
    icon: Eye,
    color: 'emerald',
  },
  {
    title: 'Mariner-first',
    description:
      'Every feature is designed to help individuals make informed decisions. CIVSail does not steer anyone toward a particular employer, path, or outcome.',
    icon: Users,
    color: 'violet',
  },
  {
    title: 'Neutral',
    description:
      'The platform presents tradeoffs, not recommendations. Your priorities determine the best fit — not ours.',
    icon: Scale,
    color: 'amber',
  },
];

const colorMap: Record<
  string,
  { bg: string; border: string; text: string; icon: string }
> = {
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
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <nav className="flex items-center text-sm text-slate-400">
          <Link href="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-white">About</span>
        </nav>
      </div>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl"
        >
          <Badge className="mb-6 bg-blue-500/20 text-blue-400 border-blue-500/50">
            About CIVSail
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Built from lived experience
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 max-w-2xl">
            CIVSail is an independent platform that helps mariners navigate
            their careers with better tools, clearer information, and fewer dead
            ends.
          </p>
        </motion.div>
      </section>

      {/* What CIVSail Is */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            <div>
              <Badge className="mb-4 bg-slate-800 text-slate-300 border-slate-700">
                The Platform
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
                What is CIVSail
              </h2>
              <div className="space-y-6 text-lg text-slate-300 leading-relaxed">
                <p>
                  CIVSail brings together practical tools, port and ship
                  intelligence, and long-form career guidance into a single
                  platform. The goal is to clarify what options exist, what each
                  path demands, and how to navigate from where you are to where
                  you want to be.
                </p>
                <p>
                  Merchant mariners underpin national defense and global trade.
                  More than 90% of the world’s goods travel by sea, carried by
                  crews who rarely receive the same visibility or support as the
                  cargo they move. Despite their importance, accessible,
                  centralized information for working mariners remains scarce.
                </p>
                <p>
                  CIVSail is working to change that — one tool, one article, one
                  guide at a time.
                </p>
              </div>
            </div>

            {/* Industry at a Glance */}
            <div>
              <Card className="p-8 bg-slate-900/50 border-slate-800">
                <h3 className="text-xl font-bold text-white mb-8">
                  The industry at a glance
                </h3>
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <span className="text-slate-400">
                      Global goods moved by sea
                    </span>
                    <span className="text-2xl font-bold text-blue-400">
                      90%
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <span className="text-slate-400">U.S.-flagged vessels</span>
                    <span className="text-2xl font-bold text-blue-400">
                      ~188
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <span className="text-slate-400">
                      Active U.S. merchant mariners
                    </span>
                    <span className="text-2xl font-bold text-blue-400">
                      ~13,000
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">
                      Career paths across sectors
                    </span>
                    <span className="text-lg font-bold text-blue-400">
                      More than you think
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </motion.div>
      </section>

      <Separator className="max-w-7xl mx-auto bg-slate-800" />

      {/* Origin Story */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Badge className="mb-4 bg-slate-800 text-slate-300 border-slate-700">
            Origin
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
            How this started
          </h2>

          <div className="max-w-3xl space-y-6 text-lg text-slate-300 leading-relaxed">
            <p>
              CIVSail was started by a mariner who grew tired of hunting through
              scattered PDFs, outdated Facebook threads, and relying on
              word-of-mouth information for basic career information. Pay
              structures that should have been transparent were anything but.
              Credential requirements were fragmented across agencies. Practical
              knowledge lived in people’s heads — and often retired with them.
            </p>

            <p>
              The platform began with a focus on MSC simply because that was the
              experience base. But sharing an industry does not mean sharing a
              career path. Football and basketball are both ball sports, but are
              radically different. Ships may look similar from the pier, but the
              careers behind them follow entirely different systems, contracts,
              pay structures, and advancement tracks. Mapping one environment
              revealed how much structure the entire industry lacked.
            </p>

            <p>
              CIVSail is not built for a single organization. It is built to map
              the maritime industry itself — to bring structure, transparency,
              and direction back to the people who sail within it.
            </p>

            <div className="pt-4">
              <Link
                href="/editorials/soundings/weve-rebranded"
                className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
              >
                Read the full rebrand story
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      <Separator className="max-w-7xl mx-auto bg-slate-800" />

      {/* Principles */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-slate-800 text-slate-300 border-slate-700">
              Principles
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
              What CIVSail stands for
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              These aren&apos;t aspirational — they&apos;re how the platform is
              built and how decisions are made.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {PRINCIPLES.map((principle, idx) => {
              const colors = colorMap[principle.color];

              return (
                <motion.div
                  key={principle.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card className={`p-6 ${colors.bg} ${colors.border} h-full`}>
                    <div className="flex items-start gap-4">
                      <div className={`p-2 rounded-lg ${colors.icon}`}>
                        <principle.icon className={`w-5 h-5 ${colors.text}`} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white mb-2">
                          {principle.title}
                        </h3>
                        <p className="text-slate-300 text-sm leading-relaxed">
                          {principle.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </section>

      <Separator className="max-w-7xl mx-auto bg-slate-800" />

      {/* What's Here Today */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Badge className="mb-4 bg-emerald-500/20 text-emerald-400 border-emerald-500/50">
            What&apos;s Available
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            What&apos;s on the platform today
          </h2>
          <p className="text-slate-400 mb-8">
            CIVSail is actively being built. Here is what exists right now.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl">
            {[
              {
                label: 'Leave Chit Generator',
                href: '/tools/leave-chit',
                note: 'MSC',
              },
              {
                label: 'Travel Claim Generator',
                href: '/tools/travel-voucher',
                note: 'MSC',
              },
              {
                label: 'Ship Pay Calculator',
                href: '/tools/pay-calculator',
                note: 'MSC',
              },
              { label: 'Interactive Port Guides', href: '/ports', note: '' },
              { label: 'Ship Class Pages', href: '/ships', note: '' },
              {
                label: 'Maritime 101 Guide',
                href: '/maritime-101',
                note: '5 sections',
              },
              {
                label: 'Career & Sector Explorer',
                href: '/maritime-101/careers-and-sectors',
                note: '',
              },
              {
                label: 'NEO & New Mariner Help',
                href: '/msc-hub/neo-help',
                note: 'MSC',
              },
              { label: 'Editorials & Profiles', href: '/editorials', note: '' },
              { label: 'Financial Planning', href: '/financial', note: '' },
            ].map((item, idx) => (
              <Link key={idx} href={item.href}>
                <Card className="p-4 bg-slate-900/50 border-slate-800 hover:border-emerald-500/50 transition-colors group">
                  <div className="flex items-center justify-between">
                    <span className="text-white group-hover:text-emerald-400 transition-colors">
                      {item.label}
                    </span>
                    {item.note && (
                      <Badge
                        variant="outline"
                        className="border-slate-700 text-slate-500 text-xs"
                      >
                        {item.note}
                      </Badge>
                    )}
                  </div>
                </Card>
              </Link>
            ))}
          </div>

          <p className="text-slate-500 text-sm mt-6">
            More tools, guides, and sector-specific content are in development.
          </p>
        </motion.div>
      </section>

      <Separator className="max-w-7xl mx-auto bg-slate-800" />

      {/* CTA: Explore or Get in Touch */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-8 bg-gradient-to-br from-blue-600/20 to-blue-900/40 border-blue-500/30">
              <h3 className="text-2xl font-bold text-white mb-3">
                Start exploring
              </h3>
              <p className="text-slate-300 mb-6">
                New to the maritime industry? The Maritime 101 guide walks you
                through everything from careers and sectors to credentials and
                training.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/maritime-101">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Maritime 101
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link href="/tools">
                  <Button
                    variant="outline"
                    className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10"
                  >
                    Browse tools
                  </Button>
                </Link>
              </div>
            </Card>

            <Card className="p-8 bg-slate-900/50 border-slate-800">
              <h3 className="text-2xl font-bold text-white mb-3">
                Get in touch
              </h3>
              <p className="text-slate-300 mb-6">
                Have feedback, a correction, or something to contribute? CIVSail
                is built in the open and relies on real experience.
              </p>
              <div className="space-y-3">
                <a
                  href="mailto:support@civsail.com"
                  className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  support@civsail.com
                </a>
                <div className="flex items-center gap-4 text-slate-400">
                  <a
                    href="https://instagram.com/civsail"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    Instagram
                  </a>
                  <a
                    href="https://facebook.com/civsail"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    Facebook
                  </a>
                </div>
              </div>
            </Card>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
