'use client';

import Link from 'next/link';
import { FadeIn } from '@/components/FadeIn';

/* ───────────────────────────────────────────
   Sector data
   ─────────────────────────────────────────── */
const COMING_SOON_SECTORS = [
  {
    name: 'Commercial Deep Sea',
    subtitle: 'Container, Tanker & Bulk Carriers',
    description:
      'International and coastwise shipping on large oceangoing vessels. Container ships, tankers, and bulk carriers moving cargo across oceans and between major ports.',
    icon: '🌊',
    detail: '60-120 day rotations · Union scale + OT',
    accentColor: 'amber' as const,
  },
  {
    name: 'Offshore Oil Rigs',
    subtitle: 'Platform & Drilling Operations',
    description:
      'Work aboard fixed and floating drilling platforms, production facilities, and mobile offshore drilling units (MODUs). Premium pay for demanding conditions.',
    icon: '🛢️',
    detail: '14/14 or 21/21 · Day rate $300-700',
    accentColor: 'red' as const,
  },
  {
    name: 'Offshore Supply Vessels',
    subtitle: 'PSV, AHTS & Fast Supply',
    description:
      'Platform Supply Vessels (PSV), Anchor Handling Tug Supply (AHTS), and Fast Supply Vessels supporting offshore energy operations. Dynamic positioning skills valued.',
    icon: '🚢',
    detail: '14/14 - 28/28 · Day rate $400-800',
    accentColor: 'orange' as const,
  },
  {
    name: 'Tugboats',
    subtitle: 'Harbor & Coastal Towing',
    description:
      'Ship-assist tugs in ports, coastal towing, and ocean towing operations. Smaller crews, technical ship handling, home more often than deep sea.',
    icon: '🚤',
    detail: '7/7 - 14/14 · $50K-150K/year',
    accentColor: 'green' as const,
  },
  {
    name: 'Barges',
    subtitle: 'ATB, ITB & Tank Barges',
    description:
      'Articulated Tug-Barge (ATB) and Integrated Tug-Barge (ITB) units moving petroleum, chemicals, and dry cargo coastwise. Growing sector with modern tonnage.',
    icon: '🔗',
    detail: '14/14 - 28/28 · $60K-180K/year',
    accentColor: 'teal' as const,
  },
  {
    name: 'Ferries',
    subtitle: 'Passenger & Vehicle Ferries',
    description:
      'Passenger and vehicle ferries operating scheduled routes. Day work schedules possible, state ferry systems offer government benefits.',
    icon: '⛴️',
    detail: 'Daily/Weekly · $45K-120K/year',
    accentColor: 'sky' as const,
  },
  {
    name: 'Cruise Ships',
    subtitle: 'Passenger Vessels & Expedition',
    description:
      'Large passenger vessels with hotel operations. International crews, extended contracts, unique lifestyle. Growing small expedition cruise market.',
    icon: '🚢',
    detail: '4-8 month contracts · Varies widely',
    accentColor: 'pink' as const,
  },
  {
    name: 'Yachts',
    subtitle: 'Private & Charter',
    description:
      'Private and charter yachts from 80 to 500+ feet. MCA/PYA certifications, service-oriented, potential for excellent compensation on larger vessels.',
    icon: '⛵',
    detail: 'Seasonal/Year-round · $40K-200K+ tips',
    accentColor: 'violet' as const,
  },
  {
    name: 'Fishing Boats',
    subtitle: 'Commercial Fishing',
    description:
      'Commercial fishing vessels from small day boats to large factory trawlers. Share-based pay, physically demanding, seasonal patterns vary by fishery.',
    icon: '🎣',
    detail: 'Trip-based · Share system',
    accentColor: 'slate' as const,
  },
  {
    name: 'Pilots',
    subtitle: 'Harbor & River Pilots',
    description:
      'Licensed pilots guide vessels through ports, rivers, and restricted waterways. Highest paid maritime profession, extremely competitive entry, long apprenticeship.',
    icon: '🧭',
    detail: 'On-call rotation · $200K-700K+/year',
    accentColor: 'indigo' as const,
  },
];

const ACCENT_STYLES = {
  amber: {
    border: 'border-amber-500/[0.12]',
    tagBg: 'bg-amber-500/10',
    tagText: 'text-amber-400',
    iconBg: 'from-amber-500 to-amber-600',
    gradient:
      'linear-gradient(135deg, rgba(245,158,11,0.06), rgba(245,158,11,0.02))',
  },
  red: {
    border: 'border-red-500/[0.12]',
    tagBg: 'bg-red-500/10',
    tagText: 'text-red-400',
    iconBg: 'from-red-500 to-red-600',
    gradient:
      'linear-gradient(135deg, rgba(239,68,68,0.06), rgba(239,68,68,0.02))',
  },
  orange: {
    border: 'border-orange-500/[0.12]',
    tagBg: 'bg-orange-500/10',
    tagText: 'text-orange-400',
    iconBg: 'from-orange-500 to-orange-600',
    gradient:
      'linear-gradient(135deg, rgba(249,115,22,0.06), rgba(249,115,22,0.02))',
  },
  green: {
    border: 'border-green-500/[0.12]',
    tagBg: 'bg-green-500/10',
    tagText: 'text-green-400',
    iconBg: 'from-green-500 to-green-600',
    gradient:
      'linear-gradient(135deg, rgba(34,197,94,0.06), rgba(34,197,94,0.02))',
  },
  teal: {
    border: 'border-teal-500/[0.12]',
    tagBg: 'bg-teal-500/10',
    tagText: 'text-teal-400',
    iconBg: 'from-teal-500 to-teal-600',
    gradient:
      'linear-gradient(135deg, rgba(20,184,166,0.06), rgba(20,184,166,0.02))',
  },
  sky: {
    border: 'border-sky-500/[0.12]',
    tagBg: 'bg-sky-500/10',
    tagText: 'text-sky-400',
    iconBg: 'from-sky-500 to-sky-600',
    gradient:
      'linear-gradient(135deg, rgba(14,165,233,0.06), rgba(14,165,233,0.02))',
  },
  pink: {
    border: 'border-pink-500/[0.12]',
    tagBg: 'bg-pink-500/10',
    tagText: 'text-pink-400',
    iconBg: 'from-pink-500 to-pink-600',
    gradient:
      'linear-gradient(135deg, rgba(236,72,153,0.06), rgba(236,72,153,0.02))',
  },
  violet: {
    border: 'border-violet-500/[0.12]',
    tagBg: 'bg-violet-500/10',
    tagText: 'text-violet-400',
    iconBg: 'from-violet-500 to-violet-600',
    gradient:
      'linear-gradient(135deg, rgba(139,92,246,0.06), rgba(139,92,246,0.02))',
  },
  slate: {
    border: 'border-slate-500/[0.12]',
    tagBg: 'bg-slate-500/10',
    tagText: 'text-slate-400',
    iconBg: 'from-slate-500 to-slate-600',
    gradient:
      'linear-gradient(135deg, rgba(100,116,139,0.06), rgba(100,116,139,0.02))',
  },
  indigo: {
    border: 'border-indigo-500/[0.12]',
    tagBg: 'bg-indigo-500/10',
    tagText: 'text-indigo-400',
    iconBg: 'from-indigo-500 to-indigo-600',
    gradient:
      'linear-gradient(135deg, rgba(99,102,241,0.06), rgba(99,102,241,0.02))',
  },
};

/* ═══════════════════════════════════════════
   PAGE COMPONENT
   ═══════════════════════════════════════════ */
export default function ShipsPage() {
  return (
    <div className="font-body text-slate-200 bg-[#0a0f1a] min-h-screen overflow-x-hidden">
      {/* ════════ HERO ════════ */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        {/* Background effects */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 60% 50% at 50% 30%, rgba(37,99,235,0.08) 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)',
            backgroundSize: '72px 72px',
          }}
        />

        <div className="relative max-w-[1000px] mx-auto px-8 text-center">
          <FadeIn>
            <p className="font-body font-semibold text-[0.8rem] tracking-[0.08em] uppercase text-blue-400 mb-4">
              Ship Information
            </p>
            <h1 className="font-heading font-extrabold text-[clamp(2.2rem,4.5vw,3.5rem)] leading-[1.1] mb-5 tracking-[-0.03em]">
              <span className="text-slate-100">Ships by </span>
              <span className="bg-gradient-to-br from-yellow-400 to-yellow-500 bg-clip-text text-transparent">
                Sector
              </span>
            </h1>
            <p className="font-body text-[1.05rem] leading-[1.7] text-white/45 max-w-[580px] mx-auto">
              Explore different vessel types across the U.S. maritime industry.
              Every sector has its own ships, missions, and lifestyle — pick one
              to see what it&apos;s really like aboard.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ════════ MSC FEATURED CARD ════════ */}
      <section className="px-8 pb-10">
        <div className="max-w-[1000px] mx-auto">
          <FadeIn>
            <Link href="/ships/msc" className="block group">
              <div
                className="border border-blue-500/[0.15] rounded-2xl p-[36px_32px] relative overflow-hidden transition-all duration-300 hover:border-blue-500/40 hover:-translate-y-[3px]"
                style={{
                  background:
                    'linear-gradient(160deg, rgba(59,130,246,0.1), rgba(59,130,246,0.03))',
                }}
              >
                {/* Corner glow */}
                <div
                  className="absolute top-0 right-0 w-[280px] h-[280px]"
                  style={{
                    background:
                      'radial-gradient(circle at top right, rgba(59,130,246,0.08), transparent 70%)',
                  }}
                />

                <div className="relative flex flex-col lg:flex-row gap-8 items-start">
                  {/* Left: icon + text */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-2xl">
                        ⚓
                      </div>
                      <div>
                        <span className="font-body text-[0.65rem] font-semibold tracking-[0.06em] uppercase text-blue-400 bg-blue-500/10 px-[10px] py-1 rounded-md">
                          Active · 10+ Ship Classes
                        </span>
                      </div>
                    </div>

                    <h2 className="font-heading font-bold text-[clamp(1.6rem,3vw,2.2rem)] text-slate-100 mb-3 tracking-[-0.02em] leading-[1.2]">
                      Military Sealift Command
                    </h2>
                    <p className="font-body text-[0.95rem] text-white/45 leading-[1.7] max-w-[520px] mb-6">
                      Government civilian mariners operating Navy support vessels
                      worldwide — combat logistics, hospital ships, expeditionary
                      sea bases, cable repair ships, and more. The largest employer
                      of federal civilian mariners in the U.S.
                    </p>

                    <span className="font-body inline-flex items-center gap-2 text-blue-400 text-[0.88rem] font-semibold group-hover:text-blue-300 transition-colors">
                      Explore MSC Fleet
                      <span className="transform group-hover:translate-x-1 transition-transform">
                        →
                      </span>
                    </span>
                  </div>

                  {/* Right: quick stats */}
                  <div className="grid grid-cols-3 lg:grid-cols-1 gap-3 lg:w-[180px] w-full">
                    {[
                      { label: 'Ship Classes', value: '10+' },
                      { label: 'Active Vessels', value: '125+' },
                      { label: 'Operations', value: 'Global' },
                    ].map((stat) => (
                      <div
                        key={stat.label}
                        className="bg-white/[0.04] border border-white/[0.06] rounded-xl px-4 py-3 text-center lg:text-left"
                      >
                        <div className="font-heading font-bold text-[1.1rem] text-slate-100">
                          {stat.value}
                        </div>
                        <div className="font-body text-[0.72rem] text-white/35 uppercase tracking-[0.05em] font-medium">
                          {stat.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* ════════ OTHER SECTORS ════════ */}
      <section className="px-8 pb-20">
        <div className="max-w-[1000px] mx-auto">
          <FadeIn>
            <div className="flex items-center gap-3 mb-6">
              <div
                className="flex-1 h-px"
                style={{
                  background:
                    'linear-gradient(90deg, rgba(255,255,255,0.06), transparent)',
                }}
              />
              <p className="font-body text-[0.78rem] text-white/30 font-medium tracking-[0.03em]">
                More sectors coming soon
              </p>
              <div
                className="flex-1 h-px"
                style={{
                  background:
                    'linear-gradient(90deg, transparent, rgba(255,255,255,0.06))',
                }}
              />
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {COMING_SOON_SECTORS.map((sector, i) => {
              const style = ACCENT_STYLES[sector.accentColor];
              return (
                <FadeIn key={sector.name} delay={i * 60}>
                  <div
                    className={`${style.border} border rounded-2xl p-[26px_28px] relative overflow-hidden transition-all duration-300 hover:-translate-y-[2px] h-full`}
                    style={{ background: style.gradient }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className={`w-10 h-10 rounded-[10px] bg-gradient-to-br ${style.iconBg} flex items-center justify-center text-xl opacity-80`}
                      >
                        {sector.icon}
                      </div>
                      <span
                        className={`font-body text-[0.6rem] font-semibold tracking-[0.06em] uppercase ${style.tagBg} ${style.tagText} px-[8px] py-[3px] rounded-md`}
                      >
                        Coming Soon
                      </span>
                    </div>

                    <h3 className="font-heading font-bold text-[1.1rem] text-slate-100/80 mb-1 tracking-[-0.01em]">
                      {sector.name}
                    </h3>
                    <p className={`font-body text-[0.72rem] ${style.tagText} opacity-70 mb-2 font-medium`}>
                      {sector.subtitle}
                    </p>
                    <p className="font-body text-[0.84rem] text-white/35 leading-[1.65] mb-3">
                      {sector.description}
                    </p>
                    <p className="font-body text-[0.75rem] text-white/25 font-medium">
                      {sector.detail}
                    </p>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════ BOTTOM CTA ════════ */}
      <section className="px-8 pb-16">
        <div className="max-w-[1000px] mx-auto">
          <FadeIn>
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl px-6 py-5 text-center">
              <p className="font-body text-[0.88rem] text-white/40 leading-[1.6] mb-1">
                Know a sector we should cover next? Have photos or info to
                share?
              </p>
              <a
                href="mailto:support@civsail.com"
                className="font-body text-yellow-400 text-[0.85rem] font-semibold hover:text-yellow-300 transition-colors"
              >
                Let us know →
              </a>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
