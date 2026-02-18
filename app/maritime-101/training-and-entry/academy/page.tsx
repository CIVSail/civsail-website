import { Metadata } from 'next';
import Link from 'next/link';
import {
  GraduationCap,
  MapPin,
  ArrowRight,
  ArrowLeft,
  Star,
  AlertTriangle,
  CheckCircle2,
  BookOpen,
  Ship,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export const metadata: Metadata = {
  title: 'Maritime Academy Path | CIVSail',
  description:
    'Complete guide to U.S. maritime academies: all 7 programs compared, application timelines, what to expect, and how academy graduates enter the merchant marine.',
  openGraph: {
    title: 'Maritime Academy Path | CIVSail',
    description:
      'Everything you need to know about the maritime academy path to a merchant mariner career.',
    url: 'https://civsail.com/maritime-101/training-and-entry/academy',
  },
  alternates: {
    canonical: 'https://civsail.com/maritime-101/training-and-entry/academy',
  },
};

// ============================================================================
// DATA
// ============================================================================

interface Academy {
  id: string;
  name: string;
  shortName: string;
  location: string;
  type: 'federal' | 'state';
  programs: string[];
  highlights: string[];
  considerations: string[];
  notes: string;
}

const ACADEMIES: Academy[] = [
  {
    id: 'usmma',
    name: 'U.S. Merchant Marine Academy',
    shortName: 'Kings Point',
    location: 'Kings Point, NY',
    type: 'federal',
    programs: ['Marine Transportation', 'Marine Engineering', 'Marine Engineering Systems', 'Marine Engineering & Shipyard Management', 'Logistics & Intermodal Transportation'],
    highlights: [
      'Only federal maritime academy',
      'Tuition-free (federally funded)',
      'Sea Year: sail on commercial vessels during training',
      'Dual Deck/Engine option available',
    ],
    considerations: [
      'Service obligation after graduation (military or maritime industry)',
      'Competitive Congressional nomination required',
      'Regimental lifestyle',
      'Sea Year policies have changed over time',
    ],
    notes: 'Kings Point is unique among maritime academies. It is a federal service academy — think Annapolis or West Point, but for the merchant marine. Graduates receive a Coast Guard license and a commission as an officer in a reserve branch of the armed forces.',
  },
  {
    id: 'cal-maritime',
    name: 'California State University Maritime Academy',
    shortName: 'Cal Maritime',
    location: 'Vallejo, CA',
    type: 'state',
    programs: ['Marine Transportation', 'Marine Engineering Technology', 'Facilities Engineering Technology', 'Global Studies & Maritime Affairs', 'Mechanical Engineering', 'Oceanography'],
    highlights: [
      'West Coast location with strong Pacific shipping ties',
      'Part of the CSU system (in-state tuition rates)',
      'NSMV Golden State training ship (expected late 2026)',
      'Strong STEM and engineering programs',
    ],
    considerations: [
      'Smaller campus in Vallejo',
      'Regimental structure (Corps of Cadets)',
      'Out-of-state tuition is higher',
    ],
    notes: 'Cal Maritime is the only maritime academy on the West Coast. Its location gives cadets exposure to Pacific trade routes and West Coast maritime employers.',
  },
  {
    id: 'glma',
    name: 'Great Lakes Maritime Academy',
    shortName: 'GLMA',
    location: 'Traverse City, MI',
    type: 'state',
    programs: ['Marine Technology (Deck)', 'Marine Engineering Technology'],
    highlights: [
      'Smallest maritime academy — tight-knit community',
      'Part of Northwestern Michigan College',
      'Graduates with Great Lakes pilotage endorsement',
      'Training vessel State of Michigan',
      'Great Lakes shipping industry connections',
      'Lower cost of attendance',
    ],
    considerations: [
      'Fewer program options than larger academies',
      'Regional focus (Great Lakes)',
      'Smaller alumni network',
    ],
    notes: 'GLMA is part of Northwestern Michigan College in Traverse City. Its small size means more individual attention, and its location connects cadets directly to the Great Lakes shipping industry.',
  },
  {
    id: 'mma-maine',
    name: 'Maine Maritime Academy',
    shortName: 'Maine Maritime',
    location: 'Castine, ME',
    type: 'state',
    programs: ['Marine Transportation', 'Marine Engineering', 'Power Engineering Technology', 'International Business & Logistics', 'Marine Science', 'Marine Systems Engineering'],
    highlights: [
      'One of the oldest maritime academies in the U.S.',
      'Strong engineering and marine science programs',
      'Training ship cruises (NSMV State of Maine)',
      'Small-town, focused campus environment',
    ],
    considerations: [
      'Remote location (Castine, ME)',
      'Regimental structure for first-year cadets',
      'New England winters',
    ],
    notes: 'Maine Maritime has a long tradition and a strong reputation, particularly in marine engineering. The Castine campus is small and focused — there are few distractions.',
  },
  {
    id: 'mass-maritime',
    name: 'Massachusetts Maritime Academy',
    shortName: 'Mass Maritime',
    location: 'Buzzards Bay, MA',
    type: 'state',
    programs: ['Marine Transportation', 'Marine Engineering', 'Emergency Management', 'Energy Systems Engineering', 'Facilities Engineering', 'International Maritime Business'],
    highlights: [
      'Unique emergency management degree program',
      'Strong regimental system (Regiment of Cadets)',
      'Cape Cod location',
      'Training ship cruises (NSMV Patriot State)',
    ],
    considerations: [
      'Strict regimental structure',
      'Cape Cod location is somewhat isolated',
    ],
    notes: 'Mass Maritime is known for its discipline and structure. The emergency management program is unique among maritime academies and attracts students beyond the traditional maritime path.',
  },
  {
    id: 'suny-maritime',
    name: 'SUNY Maritime College',
    shortName: 'SUNY Maritime',
    location: 'Fort Schuyler, NY (Bronx)',
    type: 'state',
    programs: ['Marine Transportation', 'Marine Engineering', 'Naval Architecture', 'Marine Environmental Science', 'International Transportation & Trade', 'Electrical Engineering'],
    highlights: [
      'Located in New York City (Bronx) — urban access',
      'Part of SUNY system (in-state tuition rates)',
      'Training ship cruises (NSMV Empire State)',
      'Historic Fort Schuyler campus',
      'Diverse program offerings beyond traditional maritime',
    ],
    considerations: [
      'Urban campus feels different from other academies',
      'Regimental structure (Regiment of Cadets)',
      'NYC cost of living for off-campus needs',
    ],
    notes: 'SUNY Maritime offers something no other academy can: proximity to New York City and the Port of New York/New Jersey, one of the busiest ports in the country. It also offers naval architecture, which is rare.',
  },
  {
    id: 'tamug',
    name: 'Texas A&M Maritime Academy',
    shortName: 'Texas A&M Maritime',
    location: 'Galveston, TX',
    type: 'state',
    programs: ['Marine Transportation', 'Marine Engineering Technology', 'Maritime Administration', 'Maritime Studies'],
    highlights: [
      'Part of the Texas A&M University system',
      'Gulf Coast location — offshore and oil/gas industry connections',
      'Access to the Aggie network',
      'Training ship cruises (NSMV Lone Star State — expected late 2026)',
    ],
    considerations: [
      'Maritime program is part of a larger non-maritime university',
      'Hurricane risk on Galveston Island',
      'Program is smaller within the broader TAMUG campus',
    ],
    notes: 'Texas A&M Maritime at Galveston gives cadets access to the massive Gulf Coast maritime industry, including offshore oil and gas, LNG shipping, and the Port of Houston.',
  },
];

// ============================================================================
// PAGE
// ============================================================================

export default function AcademyPage() {
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
          <span className="text-white">Maritime Academies</span>
        </nav>
      </div>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/maritime-101/training-and-entry"
            className="inline-flex items-center gap-1.5 text-sm text-blue-400 hover:text-blue-300 mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Training & Career Entry
          </Link>

          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-500/20 border border-blue-500/30 rounded-xl">
              <GraduationCap className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <Badge className="mb-1 bg-blue-500/20 text-blue-400 border-blue-500/50">Academy Path</Badge>
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight">Maritime Academies</h1>
            </div>
          </div>

          <p className="text-xl text-slate-300 mt-4 mb-3">
            Four-year degree programs that produce licensed officers.
          </p>
          <p className="text-slate-400 max-w-3xl">
            Maritime academies combine a college education with Coast Guard–approved training,
            sea time on training ships, and direct licensure upon graduation. Graduates enter the
            career ladder at the Third Mate or Third Assistant Engineer level — skipping the
            unlicensed ranks entirely.
          </p>
        </div>
      </section>

      <Separator className="max-w-7xl mx-auto bg-slate-800" />

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-8">How the Academy Path Works</h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {[
              { step: '1', title: 'Apply & Enroll', desc: 'Apply to one or more academies. Some require nominations or early applications.', icon: BookOpen },
              { step: '2', title: '4-Year Program', desc: 'Complete Coast Guard–approved coursework, training ship cruises, and practical assessments.', icon: GraduationCap },
              { step: '3', title: 'Earn Your License', desc: 'Pass Coast Guard licensing exams. Graduate with a Third Mate or Third A/E license.', icon: CheckCircle2 },
              { step: '4', title: 'Start Your Career', desc: 'Enter the industry as a licensed officer. Your degree and license open doors immediately.', icon: Ship },
            ].map((item) => (
              <div key={item.step} className="p-4 bg-slate-900/50 border border-slate-700 rounded-xl">
                <div className="flex items-center gap-2 mb-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold">{item.step}</span>
                  <item.icon className="w-4 h-4 text-blue-400" />
                </div>
                <h3 className="text-sm font-semibold text-white mb-1">{item.title}</h3>
                <p className="text-xs text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Quick Facts */}
          <div className="grid sm:grid-cols-3 gap-4 mb-12">
            <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl text-center">
              <div className="text-2xl font-bold text-blue-400">4 years</div>
              <div className="text-xs text-slate-400 mt-1">Time to license</div>
            </div>
            <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl text-center">
              <div className="text-2xl font-bold text-blue-400">7 schools</div>
              <div className="text-xs text-slate-400 mt-1">1 federal + 6 state academies</div>
            </div>
            <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl text-center">
              <div className="text-2xl font-bold text-blue-400">3rd Mate / 3rd A/E</div>
              <div className="text-xs text-slate-400 mt-1">Entry point on the career ladder</div>
            </div>
          </div>

          {/* Who This Is For */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="p-6 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
              <h3 className="text-lg font-semibold text-emerald-400 mb-3">Good Fit If You...</h3>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" /> Are 17-25 and considering college</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" /> Want a degree alongside your license</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" /> Prefer structured learning over learn-as-you-go</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" /> Want to enter the industry as an officer from day one</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" /> Are comfortable with a regimental/structured environment</li>
              </ul>
            </div>
            <div className="p-6 bg-amber-500/10 border border-amber-500/30 rounded-xl">
              <h3 className="text-lg font-semibold text-amber-400 mb-3">May Not Be Right If You...</h3>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex items-start gap-2"><AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" /> Need to earn income immediately</li>
                <li className="flex items-start gap-2"><AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" /> Are mid-career and changing fields</li>
                <li className="flex items-start gap-2"><AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" /> Already have significant sea time</li>
                <li className="flex items-start gap-2"><AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" /> Want to work in a specific niche (tugs, yachts) that doesn't require unlimited tonnage</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <Separator className="max-w-7xl mx-auto bg-slate-800" />

      {/* All 7 Academies */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-3">The 7 U.S. Maritime Academies</h2>
          <p className="text-slate-400 mb-8">
            One federal academy and six state academies. All produce Coast Guard–licensed officers.
            Each has its own character, strengths, and regional connections.
          </p>

          <div className="space-y-6">
            {ACADEMIES.map((academy) => (
              <Card key={academy.id} className={`p-6 ${academy.type === 'federal' ? 'bg-blue-500/10 border-blue-500/30' : 'bg-slate-900/50 border-slate-700'}`}>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {academy.type === 'federal' && <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />}
                      <Badge className={`text-xs ${academy.type === 'federal' ? 'bg-blue-500/20 text-blue-400 border-blue-500/40' : 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40'}`}>
                        {academy.type === 'federal' ? 'Federal Academy' : 'State Academy'}
                      </Badge>
                    </div>
                    <h3 className="text-xl font-bold text-white">{academy.name}</h3>
                    <div className="flex items-center gap-1.5 text-slate-400 text-sm mt-1">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{academy.location}</span>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-slate-300 mb-4">{academy.notes}</p>

                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <div className="text-xs text-slate-500 uppercase tracking-wide mb-2">Programs</div>
                    <ul className="text-xs text-slate-300 space-y-1">
                      {academy.programs.map((p, i) => <li key={i}>• {p}</li>)}
                    </ul>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 uppercase tracking-wide mb-2">Highlights</div>
                    <ul className="text-xs text-slate-300 space-y-1">
                      {academy.highlights.map((h, i) => <li key={i} className="flex items-start gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-400 mt-0.5 flex-shrink-0" />{h}</li>)}
                    </ul>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 uppercase tracking-wide mb-2">Consider</div>
                    <ul className="text-xs text-slate-300 space-y-1">
                      {academy.considerations.map((c, i) => <li key={i} className="flex items-start gap-1"><AlertTriangle className="w-3 h-3 text-amber-400 mt-0.5 flex-shrink-0" />{c}</li>)}
                    </ul>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Separator className="max-w-7xl mx-auto bg-slate-800" />

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-4">
            See Where Graduates Land on the Career Ladder
          </h2>
          <p className="text-slate-400 mb-8">
            Academy graduates enter at the officer level. Explore the full career ladder to see the progression from Third Mate / Third A/E all the way to Master or Chief Engineer.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/maritime-101/training-and-entry">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                View the Career Ladder
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/maritime-101/training-and-entry/hawsepipe">
              <Button size="lg" className="bg-blue-500/20 text-blue-400 border border-blue-500/50 hover:bg-blue-500/30">
                Compare: Hawsepipe Path
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
