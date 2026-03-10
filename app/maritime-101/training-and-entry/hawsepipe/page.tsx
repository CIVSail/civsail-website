import { Metadata } from 'next';
import Link from 'next/link';
import {
  Anchor,
  MapPin,
  ArrowRight,
  ArrowLeft,
  Star,
  AlertTriangle,
  CheckCircle2,
  DollarSign,
  Building2,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export const metadata: Metadata = {
  title: 'Hawsepipe Path — Work Your Way Up | CIVSail',
  description:
    'Complete guide to hawsepiping: how to enter the merchant marine without a degree, advance from unlicensed to licensed, training schools, timelines, and what to expect.',
  openGraph: {
    title: 'Hawsepipe Path — Work Your Way Up | CIVSail',
    description:
      'How to enter the maritime industry and advance from the deck up. The hawsepiper guide.',
    url: 'https://civsail.com/maritime-101/training-and-entry/hawsepipe',
  },
  alternates: {
    canonical: 'https://civsail.com/maritime-101/training-and-entry/hawsepipe',
  },
};

// ============================================================================
// DATA
// ============================================================================

interface School {
  id: string;
  name: string;
  location: string;
  type: 'union' | 'independent' | 'workboat';
  focus: string[];
  forWhom: string[];
  notes: string;
  highlight?: boolean;
}

const TRAINING_SCHOOLS: School[] = [
  {
    id: 'paul-hall',
    name: 'Paul Hall Center (SIU)',
    location: 'Piney Point, MD',
    type: 'union',
    focus: ['Entry-level unlicensed', 'AB, QMED, Tankerman', 'Officer upgrading'],
    forWhom: ['Hawsepipers', 'SIU members', 'Career changers'],
    notes: 'One of the largest maritime training pipelines in the U.S. The SIU Apprentice Program is a common starting point for hawsepipers — you train, earn credentials, and get placed on vessels through the union hiring hall.',
    highlight: true,
  },
  {
    id: 'star-center',
    name: 'STAR Center (AMO)',
    location: 'Dania Beach, FL',
    type: 'union',
    focus: ['Licensed deck & engine officers', 'Unlimited license upgrades', 'Advanced STCW'],
    forWhom: ['Officer-level mariners', 'Unlimited tonnage pathways'],
    notes: 'STAR Center is for officer-level training and upgrades. Not an entry point — this is where you go once you have sea time and are upgrading your license.',
    highlight: true,
  },
  {
    id: 'calhoon-meba',
    name: 'Calhoon MEBA Engineering School',
    location: 'Easton, MD',
    type: 'union',
    focus: ['Engineering license upgrades', 'Steam, motor, gas turbine', 'Engine-only'],
    forWhom: ['Hawsepiper engineers', 'Licensed engineers upgrading'],
    notes: 'One of the most important engineering schools in the country. If you are an engine-side hawsepiper, you will likely spend time here. Focuses exclusively on engineering credentials.',
    highlight: true,
  },
  {
    id: 'maritime-institute',
    name: 'Maritime Institute',
    location: 'Norfolk, VA',
    type: 'independent',
    focus: ['Deck & engine exam prep', 'STCW courses', 'Entry & upgrade training'],
    forWhom: ['Hawsepipers', 'MSC and commercial mariners', 'Exam prep'],
    notes: 'Formerly Mid-Atlantic Maritime Academy. Well-known for exam prep courses. Many MSC mariners train here due to the Norfolk location.',
  },
  {
    id: 'mitags',
    name: 'MITAGS',
    location: 'Linthicum Heights, MD & Seattle, WA',
    type: 'independent',
    focus: ['Officer license upgrades', 'STCW and advanced navigation', 'Radar, BRM, ECDIS'],
    forWhom: ['Deck & engine hawsepipers', 'MSC, NOAA, commercial officers'],
    notes: 'Despite the name, MITAGS is not a college. It is one of the most widely used upgrade schools in the industry. Two campuses — East Coast (Maryland) and West Coast (Seattle).',
    highlight: true,
  },
  {
    id: 'mpt',
    name: 'Maritime Professional Training',
    location: 'Fort Lauderdale, FL',
    type: 'independent',
    focus: ['STCW training', 'Yacht, offshore, commercial credentials'],
    forWhom: ['Yacht sector', 'Offshore and international mariners'],
    notes: 'Strong STCW catalog. Popular outside the union ecosystem, especially for yacht and offshore sectors.',
  },
  {
    id: 'hmts',
    name: 'Houston Marine Training Services',
    location: 'Houston, TX',
    type: 'independent',
    focus: ['Tankerman endorsements', 'Offshore and inland credentials'],
    forWhom: ['Gulf Coast mariners', 'Inland and OSV sectors'],
    notes: 'Practical, regionally focused training for the Gulf Coast maritime industry.',
  },
  {
    id: 'msi',
    name: 'Maritime Simulation Institute',
    location: 'Newport, RI',
    type: 'workboat',
    focus: ['Towing officer assessments', 'Simulator-based training'],
    forWhom: ['Tug and barge officers'],
    notes: 'Highly respected in the towing sector. If you want to work tugs and barges, this is a key school for towing officer assessments.',
  },
  {
    id: 'nemi',
    name: 'Northeast Maritime Institute',
    location: 'Fairhaven, MA',
    type: 'workboat',
    focus: ['Workboat credentials', 'Limited tonnage licenses'],
    forWhom: ['Small vessel operators', 'Regional workboat sector'],
    notes: 'Strong Northeast presence. Focused on workboat and limited tonnage credentials rather than unlimited deep-sea licenses.',
  },
];

const typeColors: Record<string, { bg: string; border: string; text: string; label: string }> = {
  union: { bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-400', label: 'Union-Affiliated' },
  independent: { bg: 'bg-violet-500/10', border: 'border-violet-500/30', text: 'text-violet-400', label: 'Independent' },
  workboat: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400', label: 'Workboat / Tug' },
};

// ============================================================================
// PAGE
// ============================================================================

export default function HawsepipePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <nav className="flex items-center text-sm text-slate-400">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/maritime-101" className="hover:text-white transition-colors">Maritime 101</Link>
          <span className="mx-2">/</span>
          <Link href="/maritime-101/training-and-entry" className="hover:text-white transition-colors">Training & Career Entry</Link>
          <span className="mx-2">/</span>
          <span className="text-white">Hawsepipe</span>
        </nav>
      </div>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/maritime-101/training-and-entry"
            className="inline-flex items-center gap-1.5 text-sm text-amber-400 hover:text-amber-300 mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Training & Career Entry
          </Link>

          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-amber-500/20 border border-amber-500/30 rounded-xl">
              <Anchor className="w-8 h-8 text-amber-400" />
            </div>
            <div>
              <Badge className="mb-1 bg-amber-500/20 text-amber-400 border-amber-500/50">Hawsepipe Path</Badge>
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight">Hawsepiping</h1>
            </div>
          </div>

          <p className="text-xl text-slate-300 mt-4 mb-3">
            Work your way up. Earn while you learn. No degree required.
          </p>
          <p className="text-slate-400 max-w-3xl">
            Hawsepiping is the path from unlicensed to licensed mariner through accumulated sea time,
            Coast Guard–approved training courses, and licensing exams. You work aboard ships,
            attend training schools between assignments, and advance rung by rung.
          </p>
        </div>
      </section>

      <Separator className="max-w-7xl mx-auto bg-slate-800" />

      {/* What Hawsepiping Actually Means */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="p-6 bg-amber-500/10 border border-amber-500/30 rounded-xl mb-12">
            <h2 className="text-xl font-bold text-white mb-3">What &quot;Hawsepiping&quot; Actually Means</h2>
            <p className="text-slate-300 mb-3">
              The term comes from sailors boarding ships via the hawsepipe — the opening in the hull
              where the anchor chain passes through — rather than walking up the gangway as an officer.
              It means learning the ship from the deck up.
            </p>
            <p className="text-slate-300 mb-3">
              <strong className="text-white">Hawsepiping does not mean avoiding school.</strong> Most
              hawsepipers attend maritime training schools throughout their career. The difference from the
              academy path is that you work between courses rather than completing a four-year degree program first.
              You earn a paycheck from day one.
            </p>
            <p className="text-slate-400 text-sm">
              Hawsepipers are some of the most respected mariners in the industry. They know every level of the
              ship because they&apos;ve worked every level.
            </p>
          </div>

          {/* How It Works */}
          <h2 className="text-2xl font-bold text-white mb-8">How the Hawsepipe Path Works</h2>

          <div className="space-y-4 mb-12">
            {[
              {
                step: '1',
                title: 'Get Your Basic Credentials',
                desc: 'TWIC card, medical certificate, Basic Safety Training (BST), and your initial MMC application. This gets you in the door.',
                time: '2-4 weeks',
              },
              {
                step: '2',
                title: 'Ship Out as Entry-Level',
                desc: 'Start as an Ordinary Seaman (deck) or Wiper (engine). Get aboard a vessel and begin accumulating sea time. You can find work through unions, direct-hire companies, or MSC.',
                time: 'Immediate',
              },
              {
                step: '3',
                title: 'Advance to Qualified Rating',
                desc: 'After enough sea time, complete required courses and exams to earn AB (deck) or QMED (engine). Your pay increases and responsibilities grow.',
                time: '6 months – 3 years',
              },
              {
                step: '4',
                title: 'Accumulate Sea Time for License',
                desc: 'Continue working and building documented sea days. You need 1,080 days for an unlimited Third Mate or Third A/E license.',
                time: '3-6 years total',
              },
              {
                step: '5',
                title: 'Complete Required Training Courses',
                desc: 'Attend a maritime training school for STCW courses, exam prep, and other requirements. This happens between ship assignments.',
                time: 'Several weeks of courses',
              },
              {
                step: '6',
                title: 'Pass Coast Guard Licensing Exams',
                desc: 'Take and pass the Coast Guard exam modules for your license. This is the hardest part — the exams are comprehensive.',
                time: 'Study + exam period',
              },
              {
                step: '7',
                title: 'Receive Your Officer License',
                desc: 'You are now a licensed Third Mate or Third Assistant Engineer. Continue advancing through the officer ranks with additional sea time.',
                time: '6-10+ years total from start',
              },
            ].map((item) => (
              <div key={item.step} className="flex gap-4">
                <div className="flex-shrink-0">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-600 text-white text-sm font-bold">{item.step}</span>
                </div>
                <div className="flex-1 pb-4 border-b border-slate-800 last:border-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-base font-semibold text-white">{item.title}</h3>
                    <span className="text-xs text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full whitespace-nowrap">{item.time}</span>
                  </div>
                  <p className="text-sm text-slate-400 mt-1">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Facts */}
          <div className="grid sm:grid-cols-3 gap-4 mb-12">
            <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl text-center">
              <div className="text-2xl font-bold text-amber-400">6-10+ years</div>
              <div className="text-xs text-slate-400 mt-1">Entry to officer license</div>
            </div>
            <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl text-center">
              <div className="text-2xl font-bold text-amber-400">Day 1</div>
              <div className="text-xs text-slate-400 mt-1">You start earning immediately</div>
            </div>
            <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl text-center">
              <div className="text-2xl font-bold text-amber-400">No degree</div>
              <div className="text-xs text-slate-400 mt-1">Required to start or advance</div>
            </div>
          </div>

          {/* Who This Is For */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="p-6 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
              <h3 className="text-lg font-semibold text-emerald-400 mb-3">Good Fit If You...</h3>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" /> Need to earn income now, not in 4 years</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" /> Are a career changer or non-traditional student</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" /> Learn by doing rather than in a classroom</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" /> Want to understand every level of the ship before leading</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" /> Are comfortable with a longer path to officer status</li>
              </ul>
            </div>
            <div className="p-6 bg-amber-500/10 border border-amber-500/30 rounded-xl">
              <h3 className="text-lg font-semibold text-amber-400 mb-3">May Not Be Right If You...</h3>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex items-start gap-2"><AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" /> Want to be an officer as quickly as possible</li>
                <li className="flex items-start gap-2"><AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" /> Want a college degree included in the process</li>
                <li className="flex items-start gap-2"><AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" /> Aren't ready for physical labor as an entry-level rating</li>
                <li className="flex items-start gap-2"><AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" /> Need a highly predictable timeline</li>
              </ul>
            </div>
          </div>

          {/* The Economics */}
          <div className="p-6 bg-slate-900/50 border border-slate-700 rounded-xl mb-12">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="w-5 h-5 text-emerald-400" />
              <h3 className="text-lg font-semibold text-white">The Economics of Hawsepiping</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-semibold text-emerald-300 mb-2">You earn from day one</h4>
                <p className="text-sm text-slate-400">
                  Unlike academy students paying tuition for 4 years, hawsepipers earn a paycheck
                  from their first ship assignment. Entry-level wages are modest but livable, and
                  pay increases significantly with each credential upgrade.
                </p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-amber-300 mb-2">Training costs add up</h4>
                <p className="text-sm text-slate-400">
                  STCW courses, exam prep, and upgrade training cost money and take you off the ship
                  (meaning lost wages). Union members often get training covered or subsidized.
                  Non-union mariners pay out of pocket or through employer sponsorship.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Separator className="max-w-7xl mx-auto bg-slate-800" />

      {/* Training Schools */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <Building2 className="w-6 h-6 text-amber-400" />
            <h2 className="text-2xl font-bold text-white">Maritime Training Schools</h2>
          </div>
          <p className="text-slate-400 mb-8">
            These are training institutions, not four-year colleges. They provide Coast Guard–approved
            courses, exam prep, STCW training, and license upgrades. You attend between ship assignments.
          </p>

          <div className="space-y-4">
            {TRAINING_SCHOOLS.map((school) => {
              const colors = typeColors[school.type];
              return (
                <Card key={school.id} className={`p-5 ${colors.bg} border ${colors.border}`}>
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        {school.highlight && <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />}
                        <Badge className={`text-xs ${colors.bg} ${colors.text} border ${colors.border}`}>
                          {colors.label}
                        </Badge>
                      </div>
                      <h3 className="text-lg font-bold text-white">{school.name}</h3>
                      <div className="flex items-center gap-1.5 text-slate-400 text-sm mt-0.5">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{school.location}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-slate-300 mb-3">{school.notes}</p>

                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">Focus Areas</div>
                      <ul className="text-xs text-slate-300 space-y-0.5">
                        {school.focus.map((f, i) => <li key={i}>• {f}</li>)}
                      </ul>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">Best For</div>
                      <ul className="text-xs text-slate-300 space-y-0.5">
                        {school.forWhom.map((w, i) => <li key={i}>• {w}</li>)}
                      </ul>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <Separator className="max-w-7xl mx-auto bg-slate-800" />

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-4">
            See Every Rung of the Ladder
          </h2>
          <p className="text-slate-400 mb-8">
            The hawsepipe path starts at the bottom and climbs every rung. View the full career ladder
            to see what each step requires and where you can go.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/maritime-101/training-and-entry">
              <Button size="lg" className="bg-amber-600 hover:bg-amber-700">
                View the Career Ladder
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/maritime-101/training-and-entry/academy">
              <Button size="lg" className="bg-amber-500/20 text-amber-400 border border-amber-500/50 hover:bg-amber-500/30">
                Compare: Academy Path
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
