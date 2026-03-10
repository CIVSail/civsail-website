import { Metadata } from 'next';
import Link from 'next/link';
import {
  Wrench,
  FileText,
  BookOpen,
  HelpCircle,
  ClipboardList,
  ChevronRight,
  Anchor,
  Ship,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'MSC Hub | CIVSail',
  description:
    'Your central resource for MSC CIVMAR life — tools, forms, policies, common requests, and new employee orientation help.',
  openGraph: {
    title: 'MSC Hub | CIVSail',
    description:
      'Your central resource for MSC CIVMAR life — tools, forms, policies, and NEO help.',
    url: 'https://civsail.com/msc-hub',
  },
  alternates: {
    canonical: 'https://civsail.com/msc-hub',
  },
};

const HUB_SECTIONS = [
  {
    title: 'Tools',
    description:
      'Pay calculators, leave chit generator, travel voucher builder, and more.',
    href: '/tools',
    icon: Wrench,
    color: 'blue',
    highlights: ['Ship Pay Calculator', 'Leave Chit Generator', 'Travel Voucher (DD 1351-2)', 'Pay Comparison'],
  },
  {
    title: 'Forms',
    description:
      'Common MSC forms organized and searchable — open, fill, and submit.',
    href: '/msc-hub/forms',
    icon: FileText,
    color: 'emerald',
    highlights: ['SF-1150', 'Leave Request', 'Travel Authorization', 'Allotment Changes'],
  },
  {
    title: 'Policies & CMPIs',
    description:
      'Civilian Mariners Personnel Instructions explained in plain language.',
    href: '/msc-hub/policies',
    icon: BookOpen,
    color: 'amber',
    highlights: ['Pay & Compensation', 'Leave & Absence', 'Conduct & Discipline', 'Training Requirements'],
  },
  {
    title: 'Common Requests',
    description:
      'Quick links for the things you actually need — placement, drug test letters, pay contacts, benefits.',
    href: '/common-requests',
    icon: ClipboardList,
    color: 'purple',
    highlights: ['Placement Contacts', 'Employment Verification', 'Drug Test Letter', 'Benefits & HR'],
  },
  {
    title: 'NEO & New Mariner Help',
    description:
      'First 6 months at MSC — from orientation to arriving at your first ship.',
    href: '/msc-hub/neo-help',
    icon: HelpCircle,
    color: 'rose',
    highlights: ['What to Expect at NEO', 'Packing for Your First Ship', 'Rank & Pay Structure', 'Union Basics'],
  },
];

const COLOR_MAP: Record<string, { card: string; icon: string; badge: string; arrow: string }> = {
  blue: {
    card: 'hover:border-blue-500/30',
    icon: 'bg-blue-500/15 text-blue-400',
    badge: 'bg-blue-500/10 text-blue-400',
    arrow: 'text-blue-400 group-hover:translate-x-1',
  },
  emerald: {
    card: 'hover:border-emerald-500/30',
    icon: 'bg-emerald-500/15 text-emerald-400',
    badge: 'bg-emerald-500/10 text-emerald-400',
    arrow: 'text-emerald-400 group-hover:translate-x-1',
  },
  amber: {
    card: 'hover:border-amber-500/30',
    icon: 'bg-amber-500/15 text-amber-400',
    badge: 'bg-amber-500/10 text-amber-400',
    arrow: 'text-amber-400 group-hover:translate-x-1',
  },
  purple: {
    card: 'hover:border-purple-500/30',
    icon: 'bg-purple-500/15 text-purple-400',
    badge: 'bg-purple-500/10 text-purple-400',
    arrow: 'text-purple-400 group-hover:translate-x-1',
  },
  rose: {
    card: 'hover:border-rose-500/30',
    icon: 'bg-rose-500/15 text-rose-400',
    badge: 'bg-rose-500/10 text-rose-400',
    arrow: 'text-rose-400 group-hover:translate-x-1',
  },
};

export default function MSCHubPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
      {/* Hero */}
      <div className="border-b border-white/10 bg-black/20">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-2 text-sm text-slate-400">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-200">MSC Hub</span>
          </nav>

          <div className="flex items-start gap-5">
            <div className="rounded-xl bg-blue-500/15 p-3">
              <Anchor className="h-8 w-8 text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white sm:text-4xl">
                MSC Hub
              </h1>
              <p className="mt-2 max-w-2xl text-lg text-slate-400">
                Your central resource for MSC CIVMAR life. Tools, forms, policies,
                and everything you need — all in one place.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Section Cards */}
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {HUB_SECTIONS.map((section) => {
            const colors = COLOR_MAP[section.color];
            const Icon = section.icon;
            return (
              <Link
                key={section.href}
                href={section.href}
                className={`group rounded-xl border border-white/10 bg-white/[0.03] p-6 transition-all hover:bg-white/[0.06] ${colors.card}`}
              >
                <div className="flex items-start justify-between">
                  <div className={`rounded-lg p-2.5 ${colors.icon}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <ChevronRight
                    className={`h-5 w-5 transition-transform ${colors.arrow}`}
                  />
                </div>

                <h2 className="mt-4 text-lg font-semibold text-white">
                  {section.title}
                </h2>
                <p className="mt-1 text-sm text-slate-400 leading-relaxed">
                  {section.description}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {section.highlights.map((item) => (
                    <span
                      key={item}
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${colors.badge}`}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </Link>
            );
          })}
        </div>

        {/* Ship Classes Quick Link */}
        <div className="mt-12 rounded-xl border border-white/10 bg-white/[0.03] p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="rounded-lg bg-slate-500/15 p-2.5">
              <Ship className="h-5 w-5 text-slate-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-base font-semibold text-white">
                MSC Ship Class Guides
              </h3>
              <p className="text-sm text-slate-400">
                Detailed guides for every MSC ship class — pay, life aboard, deployment
                patterns, and what to expect.
              </p>
            </div>
            <Link
              href="/ships/msc"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-500 transition-colors"
            >
              View Ship Classes
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
