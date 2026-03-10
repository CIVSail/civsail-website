import { Metadata } from 'next';
import Link from 'next/link';
import {
  Shield,
  ArrowRight,
  ArrowLeft,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Ship,
  Clock,
  Anchor,
  ExternalLink,
  XCircle,
  Users,
  BookOpen,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export const metadata: Metadata = {
  title: 'Military to Mariner Program — How Military Sea Service Transfers to an MMC | CIVSail',
  description:
    'How military sea service credit works for merchant mariner credentials. Step-by-step NMC evaluation process, documentation requirements, 60% sea time rule, common hangups, and entry points by branch.',
  openGraph: {
    title: 'Military to Mariner Program | CIVSail',
    description:
      'Complete guide to transferring military sea service toward a Merchant Mariner Credential. NMC evaluation process, documentation, and common pitfalls.',
    url: 'https://civsail.com/maritime-101/training-and-entry/military',
  },
  alternates: {
    canonical: 'https://civsail.com/maritime-101/training-and-entry/military',
  },
};

// ============================================================================
// PAGE
// ============================================================================

export default function MilitaryPage() {
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
          <span className="text-white">Military to Mariner</span>
        </nav>
      </div>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/maritime-101/training-and-entry"
            className="inline-flex items-center gap-1.5 text-sm text-emerald-400 hover:text-emerald-300 mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Training & Career Entry
          </Link>

          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-emerald-500/20 border border-emerald-500/30 rounded-xl">
              <Shield className="w-8 h-8 text-emerald-400" />
            </div>
            <div>
              <Badge className="mb-1 bg-emerald-500/20 text-emerald-400 border-emerald-500/50">Military Path</Badge>
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight">Military to Mariner</h1>
            </div>
          </div>

          <p className="text-xl text-slate-300 mt-4 mb-3">
            How military sea service transfers to a Merchant Mariner Credential.
          </p>
          <p className="text-slate-400 max-w-3xl">
            The U.S. Coast Guard&apos;s National Maritime Center (NMC) evaluates military sea service
            and training on a case-by-case basis. Depending on your role, vessel type, and documentation,
            you may receive credit toward merchant mariner credentials — but the process is more involved
            than most people expect.
          </p>
        </div>
      </section>

      <Separator className="max-w-7xl mx-auto bg-slate-800" />

      {/* What This Is (and Isn't) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="p-6 bg-emerald-500/10 border border-emerald-500/30 rounded-xl mb-12">
            <h2 className="text-xl font-bold text-white mb-4">What &ldquo;Military to Mariner&rdquo; Actually Is</h2>
            <p className="text-slate-300 mb-4">
              Military to Mariner is <strong className="text-white">not a school</strong>,{' '}
              <strong className="text-white">not a shortcut</strong>, and{' '}
              <strong className="text-white">not automatic credit</strong>.
            </p>
            <p className="text-slate-300 mb-4">
              It is a <strong className="text-white">Coast Guard NMC evaluation process</strong> that
              allows documented military sea service and training to be credited toward a Merchant
              Mariner Credential (MMC). The NMC reviews your records and determines what — if anything —
              counts toward the credential you&apos;re applying for.
            </p>
            <p className="text-slate-300 mb-4">
              The outcome depends on your specific military role, the types and sizes of vessels you
              served on, your documented watchstanding time, and the credential you&apos;re targeting.
            </p>
            <p className="text-amber-400 text-sm font-medium">
              Start gathering your documentation now — before you separate. It is significantly harder
              to get military records after you leave the service.
            </p>
          </div>

          {/* How Sea Time Is Calculated */}
          <h2 className="text-2xl font-bold text-white mb-4">How Military Sea Time Is Calculated</h2>
          <p className="text-slate-400 mb-6">
            This is the most misunderstood part of the process. Understanding these rules upfront
            will help you set realistic expectations.
          </p>

          <div className="space-y-4 mb-12">
            {/* 60% Rule */}
            <Card className="p-5 bg-slate-900/50 border border-slate-700">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-semibold text-white">The 60% Rule</h3>
              </div>
              <p className="text-sm text-slate-300 mb-2">
                For most modern applicants, military sea time is <strong className="text-white">credited
                at approximately 60%</strong> of your total time assigned to a vessel.
              </p>
              <p className="text-sm text-slate-400 mb-2">
                <strong className="text-slate-300">Why 60%?</strong> Military vessels spend significant
                time in port for maintenance, training, and standby. The Coast Guard accounts for this
                by applying a reduction factor that reflects actual time underway vs. total time assigned.
                This means if you were assigned to a ship for 1,000 days, you would typically be credited
                with approximately 600 sea days.
              </p>
              <p className="text-xs text-slate-500">
                Source:{' '}
                <a
                  href="https://www.dco.uscg.mil/Portals/9/NMC/pdfs/professional_qualifications/crediting_military_ss.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400/70 hover:text-emerald-400 underline"
                >
                  NMC Military Sea Service Credit Policy
                </a>
              </p>
            </Card>

            {/* What Is a "Day" */}
            <Card className="p-5 bg-slate-900/50 border border-slate-700">
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-semibold text-white">What Counts as a &ldquo;Day&rdquo;</h3>
              </div>
              <p className="text-sm text-slate-300 mb-2">
                Under <strong className="text-slate-200">46 CFR 10.107</strong>, a &ldquo;day&rdquo;
                of sea service is defined as 8 hours of watchstanding or day-working — not overtime,
                not total hours aboard.
              </p>
              <p className="text-xs text-slate-500">
                Source:{' '}
                <a
                  href="https://www.ecfr.gov/current/title-46/chapter-I/subchapter-B/part-10/subpart-A/section-10.107"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400/70 hover:text-emerald-400 underline"
                >
                  46 CFR 10.107 — Definitions
                </a>
              </p>
            </Card>

            {/* Small Boat Time */}
            <Card className="p-5 bg-slate-900/50 border border-slate-700">
              <div className="flex items-center gap-2 mb-3">
                <Anchor className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-semibold text-white">Small Boat Time Rules</h3>
              </div>
              <p className="text-sm text-slate-300 mb-2">
                If you were <strong className="text-slate-200">permanently assigned to a ship</strong>,
                small boat operations conducted from that ship generally cannot be counted
                separately — no &ldquo;double dipping.&rdquo;
              </p>
              <p className="text-sm text-slate-300 mb-2">
                If you were <strong className="text-slate-200">temporarily assigned or shore-based</strong>,
                small boat time may be credited day-for-day if properly documented with actual days underway.
              </p>
              <p className="text-sm text-slate-400">
                This is especially relevant for LEDET, NSW, SWCC, boat units, and expeditionary communities.
              </p>
            </Card>

            {/* Vessel Tonnage */}
            <Card className="p-5 bg-slate-900/50 border border-slate-700">
              <div className="flex items-center gap-2 mb-3">
                <Ship className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-semibold text-white">Vessel Size & Tonnage</h3>
              </div>
              <p className="text-sm text-slate-300 mb-2">
                The tonnage of the vessels you served on determines which credentials you can
                qualify for. Officer licenses specify tonnage limits (e.g., Mate 1600 GRT vs.
                Third Mate Unlimited).
              </p>
              <p className="text-sm text-slate-300">
                If GRT is not available for a military vessel, the NMC uses a conversion formula:{' '}
                <strong className="text-slate-200">GRT ≈ Displacement × 0.57</strong>
              </p>
            </Card>
          </div>

          {/* Authoritative Resources */}
          <h2 className="text-2xl font-bold text-white mb-4">Official Resources</h2>
          <p className="text-slate-400 mb-6">
            These are the authoritative sources for the Military to Mariner process. Use government
            sites directly — not third-party summaries — when preparing your application.
          </p>

          <div className="grid sm:grid-cols-2 gap-3 mb-12">
            {[
              {
                name: 'NMC Military Sea Service',
                url: 'https://www.dco.uscg.mil/nmc/military_sea_service/',
                desc: 'Official NMC portal for military credit evaluation',
              },
              {
                name: 'MARAD Military to Mariner',
                url: 'https://www.maritime.dot.gov/outreach/military-mariner',
                desc: 'MARAD overview and program resources',
              },
              {
                name: 'NMC Sea Service Credit Policy (PDF)',
                url: 'https://www.dco.uscg.mil/Portals/9/NMC/pdfs/professional_qualifications/crediting_military_ss.pdf',
                desc: 'Detailed policy on how military time is credited',
              },
              {
                name: '46 CFR Definitions',
                url: 'https://www.ecfr.gov/current/title-46',
                desc: 'Federal regulations governing mariner credentials',
              },
              {
                name: 'DoD COOL',
                url: 'https://www.cool.osd.mil/',
                desc: 'Search military-to-civilian credential equivalencies by MOS/rate',
              },
              {
                name: 'National Maritime Center',
                url: 'https://www.dco.uscg.mil/nmc/',
                desc: 'Main NMC portal for all credential applications',
              },
            ].map((resource) => (
              <a
                key={resource.name}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 p-4 bg-slate-900/50 border border-slate-700 rounded-xl hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-colors group"
              >
                <ExternalLink className="w-4 h-4 text-slate-500 mt-0.5 shrink-0 group-hover:text-emerald-400" />
                <div>
                  <div className="text-sm font-medium text-white group-hover:text-emerald-400">{resource.name}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{resource.desc}</div>
                </div>
              </a>
            ))}
          </div>

          <Separator className="bg-slate-800 mb-12" />

          {/* Common Hangups */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-3">Common Hangups</h2>
            <p className="text-slate-400 mb-6">
              The Military to Mariner process spans multiple government agencies — the NMC, MARAD,
              your branch&apos;s personnel command, and the Coast Guard. These are the most common
              reasons applications get delayed or denied.
            </p>

            <div className="space-y-3">
              {[
                {
                  title: 'Submitting a DD-214 only',
                  desc: 'A DD-214 confirms your service but is NOT accepted as proof of sea service. The NMC requires detailed sea service documentation: vessel names, dates, tonnage, horsepower, waters operated, and your position onboard.',
                },
                {
                  title: 'Missing vessel specifications',
                  desc: 'Every vessel assignment must include: vessel name, dates assigned, tonnage (GRT or displacement), horsepower, waters operated in, and your specific duties/position. Missing any of these can stall your application.',
                },
                {
                  title: 'Assuming 100% time credit',
                  desc: 'Most applicants overestimate their credited sea time by about 40%. Military sea time is typically credited at ~60% of total time assigned, not day-for-day. Plan accordingly.',
                },
                {
                  title: 'Small boat time not properly logged',
                  desc: 'If you served in a boat unit, LEDET, NSW, or expeditionary community, you need documentation showing actual days underway — not just your assignment dates.',
                },
                {
                  title: 'Recency requirements not met',
                  desc: 'Officer endorsements typically require qualifying sea service within the last 7 years (varies by endorsement). If you\'ve been out of the service for several years, you may need refresher training or additional sea time.',
                },
                {
                  title: 'Confusing national endorsements with STCW',
                  desc: 'A national endorsement and an STCW endorsement are different things. STCW requires additional training and assessments beyond what most military training covers. You will likely need to complete STCW courses separately.',
                },
              ].map((hangup, idx) => (
                <Card key={idx} className="p-4 bg-red-500/5 border border-red-500/20">
                  <div className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-400 mt-0.5 shrink-0" />
                    <div>
                      <h3 className="text-sm font-semibold text-white">{hangup.title}</h3>
                      <p className="text-sm text-slate-400 mt-1">{hangup.desc}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <Separator className="bg-slate-800 mb-12" />

          {/* Documentation Checklist */}
          <h2 className="text-2xl font-bold text-white mb-4">Documentation to Gather</h2>
          <p className="text-slate-400 mb-6">
            Start collecting these <strong className="text-slate-300">before you separate</strong> from
            the military. Getting records after discharge is significantly harder and slower.
          </p>

          <Card className="p-6 bg-slate-900/50 border border-slate-700 mb-12">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-blue-400" />
              <h3 className="text-lg font-semibold text-white">Required Documentation</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <div>
                    <strong className="text-white">Transcript of Sea Service (TOSS)</strong>
                    <p className="text-xs text-slate-500 mt-0.5">Official record of vessel assignments</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <div>
                    <strong className="text-white">History of Assignments</strong>
                    <p className="text-xs text-slate-500 mt-0.5">Complete duty station history</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <div>
                    <strong className="text-white">Vessel specifications</strong>
                    <p className="text-xs text-slate-500 mt-0.5">Name, tonnage, horsepower, waters for each vessel</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <div>
                    <strong className="text-white">DD-214</strong>
                    <p className="text-xs text-slate-500 mt-0.5">Confirms service — but is not sufficient alone</p>
                  </div>
                </li>
              </ul>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <div>
                    <strong className="text-white">Watch qualification records</strong>
                    <p className="text-xs text-slate-500 mt-0.5">Bridge, engineering, or other watchstanding quals</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <div>
                    <strong className="text-white">Training course certificates</strong>
                    <p className="text-xs text-slate-500 mt-0.5">Any military courses that may have Coast Guard equivalency</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <div>
                    <strong className="text-white">Engineering plant logs</strong>
                    <p className="text-xs text-slate-500 mt-0.5">If pursuing engine department credentials</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <div>
                    <strong className="text-white">CO letters detailing duties</strong>
                    <p className="text-xs text-slate-500 mt-0.5">Letters from commanding officers specifying your role and responsibilities</p>
                  </div>
                </li>
              </ul>
            </div>
          </Card>

          <Separator className="bg-slate-800 mb-12" />

          {/* Common Entry Points by Branch */}
          <h2 className="text-2xl font-bold text-white mb-4">Credential Pathways by Branch</h2>
          <p className="text-slate-400 mb-6">
            Where you enter the civilian career ladder depends heavily on your military role and branch.
            These are general patterns — individual evaluations vary.
          </p>

          <div className="space-y-4 mb-12">
            <Card className="p-5 bg-slate-900/50 border border-slate-700">
              <h3 className="text-base font-semibold text-white mb-2">Navy — Surface Warfare</h3>
              <p className="text-sm text-slate-400 mb-3">
                Navy surface warfare officers and deck-side enlisted rates often have the most directly
                transferable deck department experience. Boatswain&apos;s Mates, Quartermasters, and Operations
                Specialists with bridge watchstanding time frequently receive significant sea time credit
                toward deck credentials.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">Deck: AB → Mate 1600 → 3/M possible</Badge>
              </div>
            </Card>

            <Card className="p-5 bg-slate-900/50 border border-slate-700">
              <h3 className="text-base font-semibold text-white mb-2">Navy — Engineering Ratings</h3>
              <p className="text-sm text-slate-400 mb-3">
                Engineering rates (MM, EM, EN, GSM, GSE) with documented watch time in engineering
                spaces may receive credit toward engine department credentials. The key is documented
                watchstanding — not just being assigned to an engineering division.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-xs">Engine: QMED → DDE → 3rd A/E possible</Badge>
              </div>
            </Card>

            <Card className="p-5 bg-slate-900/50 border border-slate-700">
              <h3 className="text-base font-semibold text-white mb-2">Coast Guard</h3>
              <p className="text-sm text-slate-400 mb-3">
                Coast Guard members often have the most straightforward transition and typically the
                highest success rate. Many already operate under similar regulatory frameworks and
                vessel types. BM, MK, and OS rates translate particularly well.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">Deck: Often strong credit — BM, OS rates</Badge>
                <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-xs">Engine: MK rate translates well</Badge>
              </div>
            </Card>

            <Card className="p-5 bg-slate-900/50 border border-slate-700">
              <h3 className="text-base font-semibold text-white mb-2">Army — Watercraft Operations</h3>
              <p className="text-sm text-slate-400 mb-3">
                Army watercraft operators (88K, 88L, 88H) have directly applicable experience on Army
                vessels. Sea time on Army landing craft and logistics support vessels may be credited.
                Both deck and engine pathways are possible depending on your specific MOS.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">Deck: 88K — vessel-dependent credit</Badge>
                <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-xs">Engine: 88L — Watercraft Engineer</Badge>
              </div>
            </Card>

            <Card className="p-5 bg-slate-900/50 border border-slate-700">
              <h3 className="text-base font-semibold text-white mb-2">Marine Corps / Air Force / Other Branches</h3>
              <p className="text-sm text-slate-400 mb-3">
                Limited direct sea service credit in most cases. Some roles may qualify — particularly
                Marines with significant time on amphibious vessels — but for most, the{' '}
                <Link href="/maritime-101/training-and-entry/hawsepipe" className="text-emerald-400 hover:text-emerald-300 underline">
                  hawsepipe
                </Link>{' '}
                or{' '}
                <Link href="/maritime-101/training-and-entry/academy" className="text-emerald-400 hover:text-emerald-300 underline">
                  academy
                </Link>{' '}
                path is typically more applicable.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-slate-500/20 text-slate-400 border-slate-500/30 text-xs">Generally start at entry level for licensed positions</Badge>
              </div>
            </Card>
          </div>

          <Separator className="bg-slate-800 mb-12" />

          {/* Other Military Billets */}
          <h2 className="text-2xl font-bold text-white mb-4">Beyond Licensed Positions: Other Maritime Careers</h2>
          <p className="text-slate-400 mb-6">
            Not all shipboard positions require a Coast Guard license. Your military job skills may
            not translate directly to a deck or engine license — but they can translate to skilled
            positions that only require a basic MMC endorsement.
          </p>

          <Card className="p-6 bg-emerald-500/5 border border-emerald-500/20 mb-12">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-emerald-400" />
              <h3 className="text-lg font-semibold text-white">Skilled Positions with Basic Endorsements</h3>
            </div>
            <p className="text-sm text-slate-300 mb-4">
              Some employers — particularly MSC — have officer-level and specialist positions that
              require only an entry-level MMC rather than a Coast Guard license. Your military
              experience in these fields can make you highly competitive even without deck or engine
              sea time credit.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-semibold text-emerald-400 mb-2">Examples include:</h4>
                <ul className="space-y-1.5 text-sm text-slate-300">
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" /> Supply Officers</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" /> Communications Officers</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" /> Electronics Technicians</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" /> Medical Department personnel</li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-amber-400 mb-2">Important to understand:</h4>
                <ul className="space-y-1.5 text-sm text-slate-300">
                  <li className="flex items-start gap-2"><AlertTriangle className="w-3.5 h-3.5 text-amber-400 mt-0.5 shrink-0" /> These positions are employer-specific, not industry-wide</li>
                  <li className="flex items-start gap-2"><AlertTriangle className="w-3.5 h-3.5 text-amber-400 mt-0.5 shrink-0" /> You still need a basic MMC with STCW endorsements</li>
                  <li className="flex items-start gap-2"><AlertTriangle className="w-3.5 h-3.5 text-amber-400 mt-0.5 shrink-0" /> Not all companies have these billets</li>
                </ul>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-4">
              This is a pathway worth exploring if you have military experience in supply, communications,
              IT, electronics, or medical fields. Your skills are valued aboard ships even if they don&apos;t
              lead to a traditional deck or engine license.
            </p>
          </Card>

          <Separator className="bg-slate-800 mb-12" />

          {/* MSC */}
          <h2 className="text-2xl font-bold text-white mb-4">MSC as a Transition Point</h2>

          <Card className="p-6 bg-slate-900/50 border border-slate-700 mb-12">
            <div className="flex items-center gap-3 mb-4">
              <Ship className="w-6 h-6 text-slate-400" />
              <h3 className="text-lg font-semibold text-white">Military Sealift Command (MSC)</h3>
            </div>
            <p className="text-sm text-slate-300 mb-3">
              MSC operates as a civilian-crewed naval auxiliary. It is often a natural transition
              for veterans because the mission environment is familiar — you work alongside the Navy —
              but the crew is civilian and the credentials are standard Coast Guard merchant mariner credentials.
            </p>
            <p className="text-sm text-slate-300 mb-3">
              MSC positions require the same credentials as commercial shipping. Your military experience
              may help you qualify for entry-level or officer positions, and the sea time you earn at MSC
              counts toward further upgrades on the career ladder.
            </p>
            <p className="text-sm text-slate-400">
              Many veterans use MSC as a bridge: familiar enough to feel comfortable, civilian enough
              to build merchant mariner credentials that transfer to any sector of the industry.
            </p>
          </Card>

          <Separator className="bg-slate-800 mb-12" />

          {/* The Evaluation Process */}
          <h2 className="text-2xl font-bold text-white mb-8">The Evaluation Process</h2>

          <div className="space-y-4 mb-12">
            {[
              {
                step: '1',
                title: 'Determine Your Target Credential',
                desc: 'Different credentials have different sea time thresholds. Know whether you\'re targeting OS, AB, Mate 1600, Third Mate Unlimited, QMED, DDE, or STCW endorsements before you apply.',
              },
              {
                step: '2',
                title: 'Gather Your Documentation',
                desc: 'Collect your TOSS, history of assignments, vessel specifications, watch qualification records, training certificates, and CO letters. Do this before you separate from the military.',
              },
              {
                step: '3',
                title: 'Get Basic Credentials',
                desc: 'Apply for your TWIC card, medical certificate (CG-719K), and basic MMC. These are required regardless of military experience.',
              },
              {
                step: '4',
                title: 'Submit NMC Application',
                desc: 'Apply to the National Maritime Center with all your military documentation. Specify what credential you are seeking. Include vessel specs for every assignment.',
              },
              {
                step: '5',
                title: 'NMC Evaluation',
                desc: 'The NMC reviews your records and determines what sea service credit and course equivalencies to grant. This process can take several weeks to months.',
              },
              {
                step: '6',
                title: 'Complete Remaining Requirements',
                desc: 'Fill any gaps identified by the NMC. This typically includes STCW courses, possibly additional sea time, and specific Coast Guard-approved training.',
              },
              {
                step: '7',
                title: 'Pass Coast Guard Exams',
                desc: 'If pursuing a licensed credential, take and pass the required Coast Guard licensing exams at a Regional Exam Center (REC).',
              },
            ].map((item) => (
              <div key={item.step} className="flex gap-4">
                <div className="shrink-0">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-600 text-white text-sm font-bold">{item.step}</span>
                </div>
                <div className="flex-1 pb-4 border-b border-slate-800 last:border-0">
                  <h3 className="text-base font-semibold text-white">{item.title}</h3>
                  <p className="text-sm text-slate-400 mt-1">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <Separator className="bg-slate-800 mb-12" />

          {/* Recency */}
          <h2 className="text-2xl font-bold text-white mb-4">Recency Requirements</h2>

          <Card className="p-5 bg-amber-500/5 border border-amber-500/20 mb-12">
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm text-slate-300 mb-2">
                  If you&apos;re targeting an officer endorsement, the Coast Guard typically requires
                  qualifying sea service within a recent window — often <strong className="text-white">360
                  days within the last 7 years</strong>, though this varies by endorsement.
                </p>
                <p className="text-sm text-slate-400">
                  If you&apos;ve been out of the military for several years, your sea time may still count
                  but you may need refresher training or additional recent sea service to meet recency
                  requirements. Check the specific requirements for your target credential.
                </p>
              </div>
            </div>
          </Card>

        </div>
      </section>

      <Separator className="max-w-7xl mx-auto bg-slate-800" />

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-4">
            See Where You Land on the Career Ladder
          </h2>
          <p className="text-slate-400 mb-8">
            Your military experience determines your entry point. View the full career ladder to understand
            the progression from entry-level to Master or Chief Engineer.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/maritime-101/training-and-entry">
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700">
                View the Career Ladder
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/maritime-101/credentials">
              <Button size="lg" className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 hover:bg-emerald-500/30">
                Credentials & Licensing
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
