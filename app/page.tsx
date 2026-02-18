'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FadeIn } from '@/components/FadeIn';
import { createClient } from '@/lib/supabase/client';

/* ───────────────────────────────────────────
   Pain-point cards for "The maritime world is complex" section
   ─────────────────────────────────────────── */
const PAIN_POINTS = [
  {
    pain: '"What\'s the room situation on a T-AKE?"',
    fix: 'Ship guides with real details on berthing, gyms, mess — not a spec sheet.',
  },
  {
    pain: '"What\'s the pay like?"',
    fix: 'Calculators that break down base, penalty, OT, and premium by ship class.',
  },
  {
    pain: '"Where do I eat in Guam?"',
    fix: 'Interactive port pages with maps, restaurant picks, and local tips.',
  },
  {
    pain: '"When does my medical expire?"',
    fix: 'Credential dashboard with auto-verification against Coast Guard records.',
  },
  {
    pain: '"What\'s it like to sail for that company — and can I?"',
    fix: 'Employer info, qualification requirements, and what the job is actually like from people who\'ve done it.',
  },
  {
    pain: '"When should I stop sailing?"',
    fix: 'Career guides and real perspectives on when to come ashore — and what comes next.',
  },
];

/* ───────────────────────────────────────────
   MSC Hub items
   ─────────────────────────────────────────── */
const MSC_HUB_ITEMS = [
  { icon: '💰', label: 'Ship Pay Calculator', desc: 'Base pay, overtime, penalty, and premium by ship class and position' },
  { icon: '📊', label: 'Pay Comparison Tool', desc: 'Compare compensation across MSC ship classes side by side' },
  { icon: '📝', label: 'Leave Chit Generator', desc: 'Auto-fill MSC leave request forms — print-ready PDF in seconds' },
  { icon: '✈️', label: 'Travel Claim & Comp Time', desc: 'Calculate comp time and generate travel voucher paperwork' },
  { icon: '🚢', label: 'MSC Ship Class Pages', desc: '10+ classes with pay, ops, life aboard, and fleet rosters' },
];

/* ───────────────────────────────────────────
   For All Mariners items
   ─────────────────────────────────────────── */
const ALL_MARINER_ITEMS = [
  { icon: '🗺️', label: 'Port Guides', desc: 'Interactive maps, restaurant picks, local tips, and Know Before You Go briefings from mariners who\'ve been there', status: 'growing' as const, statusLabel: 'Growing' },
  { icon: '⚓', label: 'Ship Information Library', desc: 'Specs and crew-sourced details on what it\'s really like aboard', status: 'growing' as const, statusLabel: 'Growing' },
  { icon: '📚', label: 'Guides & Resources', desc: 'Credentials, training, renewals — without digging through USCG.gov', status: 'growing' as const, statusLabel: 'Growing' },
  { icon: '📋', label: 'Credential Dashboard', desc: 'Track MMC, TWIC, medical, STCW — with NMC auto-verification', status: 'coming' as const, statusLabel: 'In Development' },
  { icon: '🤝', label: 'Professional Network', desc: 'Financial planning, retirement resources, and connections to vetted professionals who understand mariners', status: 'growing' as const, statusLabel: 'Growing' },
];

const STATUS_COLORS = {
  live: { bg: 'bg-green-500/10', text: 'text-green-400' },
  growing: { bg: 'bg-yellow-400/10', text: 'text-yellow-400' },
  building: { bg: 'bg-blue-400/10', text: 'text-blue-400' },
  coming: { bg: 'bg-violet-400/10', text: 'text-violet-400' },
};

/* ───────────────────────────────────────────
   Contribution cards
   ─────────────────────────────────────────── */
const CONTRIBUTION_CARDS = [
  { icon: '📸', title: 'Ship Photos', desc: 'Rooms, gyms, mess decks, common areas — the stuff people want to see before they sign on.', cta: 'Send photos →' },
  { icon: '🗺️', title: 'Port Tips', desc: 'Where to eat, what to do, how to get around. Your knowledge helps the next crew that pulls in.', cta: 'Share a tip →' },
  { icon: '🚢', title: 'Ship Info & Corrections', desc: 'Ops details, crew culture, life aboard — or corrections to existing pages. If you sailed it, you know it best.', cta: 'Contribute info →' },
  { icon: '💼', title: 'Work With Mariners?', desc: 'If you have a product or service mariners need — financial, legal, gear, training — let\'s talk about how to get it in front of them.', cta: 'Reach out →' },
];

/* ───────────────────────────────────────────
   Featured articles
   ─────────────────────────────────────────── */
const STACKED_ARTICLES = [
  {
    tag: 'MARINER STORIES',
    title: 'Shore Shock',
    desc: 'What nobody tells you about the transition from sea to shore — and why it hits harder than you expect.',
    color: 'amber',
    href: '/editorials/soundings/shore-shock',
  },
  {
    tag: 'MSC STORIES',
    title: 'Pros and Cons of Sailing with MSC',
    desc: 'An honest breakdown of what MSC gets right, what it doesn\'t, and who it\'s best for.',
    color: 'blue',
    href: '/editorials/soundings/msc-pros-cons',
  },
];

/* ───────────────────────────────────────────
   Footer nav links
   ─────────────────────────────────────────── */
const FOOTER_LINKS = [
  { label: 'MSC Hub', href: '/ships/msc' },
  { label: 'Ships', href: '/ships' },
  { label: 'Ports', href: '/ports' },
  { label: 'Tools', href: '/tools' },
  { label: 'Guides', href: '/maritime-101' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: 'mailto:support@civsail.com' },
];

/* ═══════════════════════════════════════════
   PAGE COMPONENT
   ═══════════════════════════════════════════ */
export default function Home() {
  const [email, setEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setNewsletterStatus('error');
      return;
    }
    setNewsletterStatus('loading');
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert({ email: email.toLowerCase().trim(), source: 'homepage' });
      if (error && error.code !== '23505') throw error;
      setNewsletterStatus('success');
      setEmail('');
    } catch {
      setNewsletterStatus('error');
    }
  };

  return (
    <div className="font-body text-slate-200 bg-[#0a0f1a] min-h-screen overflow-x-hidden">

      {/* ════════ HERO ════════ */}
      <section className="relative min-h-[min(88vh,780px)] flex items-center overflow-hidden">
        {/* Decorative background gradients */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 70% 55% at 45% 35%, rgba(37,99,235,0.1) 0%, transparent 70%), radial-gradient(ellipse 40% 40% at 80% 65%, rgba(250,204,21,0.04) 0%, transparent 60%)',
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
        <div
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{
            background:
              'linear-gradient(90deg, transparent, rgba(37,99,235,0.2), rgba(250,204,21,0.15), transparent)',
          }}
        />

        <div className="relative max-w-[800px] mx-auto px-8 pt-24 pb-20 w-full text-center">
          <FadeIn>
            <h1 className="font-heading font-extrabold text-[clamp(2.6rem,5.5vw,4rem)] leading-[1.08] mb-[22px] tracking-[-0.03em]">
              <span className="text-slate-100">One hub for your </span>
              <span className="bg-gradient-to-br from-yellow-400 to-yellow-500 bg-clip-text text-transparent">
                life as a mariner.
              </span>
            </h1>
          </FadeIn>

          <FadeIn delay={120}>
            <p className="text-[1.1rem] leading-[1.7] text-white/50 max-w-[560px] mx-auto mb-9">
              The information you need shouldn&apos;t live in a Facebook group, a
              ten-year-old PDF, or leave at crew change. Ships, ports, tools,
              your career, all in one place.
            </p>
          </FadeIn>

          <FadeIn delay={240}>
            <div className="relative flex gap-4 flex-wrap justify-center">
              {/* Shared glow backdrop */}
              <div
                className="absolute inset-0 -inset-x-6 -inset-y-3 rounded-2xl blur-xl opacity-25 pointer-events-none"
                style={{
                  background:
                    'radial-gradient(ellipse 70% 80% at 50% 50%, rgba(37,99,235,0.3), transparent 65%)',
                }}
              />
              <Link
                href="/ships"
                className="relative font-body bg-blue-600 text-white px-12 py-[13px] rounded-[9px] text-[0.92rem] font-semibold shadow-[0_2px_12px_rgba(37,99,235,0.35),0_0px_30px_rgba(37,99,235,0.1)] tracking-[0.01em] hover:bg-blue-500 hover:shadow-[0_2px_16px_rgba(37,99,235,0.5),0_0px_40px_rgba(37,99,235,0.15)] transition-all duration-300"
              >
                Ships
              </Link>
              <Link
                href="/ports"
                className="relative font-body bg-blue-600 text-white px-12 py-[13px] rounded-[9px] text-[0.92rem] font-semibold shadow-[0_2px_12px_rgba(37,99,235,0.35),0_0px_30px_rgba(37,99,235,0.1)] tracking-[0.01em] hover:bg-blue-500 hover:shadow-[0_2px_16px_rgba(37,99,235,0.5),0_0px_40px_rgba(37,99,235,0.15)] transition-all duration-300"
              >
                Ports
              </Link>
              <Link
                href="/editorials/soundings"
                className="relative font-body bg-blue-600 text-white px-12 py-[13px] rounded-[9px] text-[0.92rem] font-semibold shadow-[0_2px_12px_rgba(37,99,235,0.35),0_0px_30px_rgba(37,99,235,0.1)] tracking-[0.01em] hover:bg-blue-500 hover:shadow-[0_2px_16px_rgba(37,99,235,0.5),0_0px_40px_rgba(37,99,235,0.15)] transition-all duration-300"
              >
                Articles
              </Link>
              <Link
                href="/maritime-101"
                className="relative font-body bg-blue-600 text-white px-12 py-[13px] rounded-[9px] text-[0.92rem] font-semibold shadow-[0_2px_12px_rgba(37,99,235,0.35),0_0px_30px_rgba(37,99,235,0.1)] tracking-[0.01em] hover:bg-blue-500 hover:shadow-[0_2px_16px_rgba(37,99,235,0.5),0_0px_40px_rgba(37,99,235,0.15)] transition-all duration-300"
              >
                Maritime 101
              </Link>
            </div>
          </FadeIn>

          {/* Trust line */}
          <FadeIn delay={360}>
            <div className="flex items-center justify-center gap-6 mt-12 flex-wrap">
              {[
                { text: 'MSC pay calculators & tools', color: 'bg-blue-500' },
                { text: '10+ ship class guides', color: 'bg-green-500' },
                { text: 'Interactive port pages', color: 'bg-amber-500' },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-2">
                  <div className={`w-[5px] h-[5px] rounded-full ${item.color}`} />
                  <span className="font-body text-[0.82rem] text-white/[0.38] font-medium tracking-[0.01em]">
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ════════ THE MARITIME WORLD IS COMPLEX ════════ */}
      <section className="px-8 pt-28 pb-[5.5rem]">
        <div className="max-w-[1000px] mx-auto">
          <FadeIn>
            <div className="text-center mb-11">
              <h2 className="font-heading font-bold text-[clamp(1.85rem,3.5vw,2.75rem)] text-slate-100 leading-[1.15] tracking-[-0.02em] mb-4">
                The maritime world is complex.
              </h2>
              <p className="font-body text-base text-white/45 leading-[1.7] max-w-[580px] mx-auto">
                No two ships are the same. No two rotations are the same.
                Mariners are spread across the globe, and the answers you need
                are scattered across a dozen sources — if they exist at all.
                CIVSail puts it in one place and keeps it current.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {PAIN_POINTS.map((item, i) => (
              <FadeIn key={i} delay={i * 70}>
                <div className="bg-white/[0.025] border border-white/[0.07] rounded-xl p-[22px] transition-all duration-300 hover:border-yellow-400/25 hover:-translate-y-[3px]">
                  <p className="font-body italic text-white/70 text-[0.95rem] mb-3 font-medium leading-[1.5]">
                    {item.pain}
                  </p>
                  <div
                    className="w-7 h-[2px] mb-[10px] rounded-sm"
                    style={{
                      background: 'linear-gradient(90deg, #facc15, transparent)',
                    }}
                  />
                  <p className="font-body text-[0.84rem] text-white/45 leading-[1.7]">
                    {item.fix}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ WHAT'S LIVE TODAY ════════ */}
      <section
        className="px-8 py-[5.5rem]"
        style={{
          background:
            'linear-gradient(180deg, rgba(37,99,235,0.025) 0%, transparent 100%)',
        }}
      >
        <div className="max-w-[1100px] mx-auto">
          <FadeIn>
            <div className="text-center mb-12">
              <p className="font-body font-semibold text-[0.8rem] tracking-[0.08em] uppercase text-green-500 mb-[14px]">
                Live now
              </p>
              <h2 className="font-heading font-bold text-[clamp(1.85rem,3.5vw,2.75rem)] text-slate-100 leading-[1.15] tracking-[-0.02em]">
                What&apos;s live today.
              </h2>
              <p className="font-body text-[0.95rem] text-white/45 leading-[1.7] max-w-[540px] mx-auto mt-3">
                MSC was the starting point — not the ceiling. Every tool, guide,
                and page is built to expand across the industry.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-7">
            {/* MSC Hub */}
            <FadeIn>
              <div className="bg-white/[0.02] border border-blue-500/[0.12] rounded-2xl overflow-hidden h-full">
                <div
                  className="px-[26px] pt-6 pb-5 border-b border-blue-500/[0.08]"
                  style={{
                    background:
                      'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(59,130,246,0.03))',
                  }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 rounded-[9px] bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-[1.05rem]">
                      🔧
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-[1.2rem] text-slate-100 tracking-[-0.01em]">
                        MSC Hub
                      </h3>
                      <p className="font-body text-[0.72rem] text-blue-400 font-semibold tracking-[0.05em] uppercase">
                        Purpose-built for MSC mariners
                      </p>
                    </div>
                  </div>
                  <p className="font-body text-[0.84rem] text-white/45 leading-[1.7]">
                    Tools and calculators built specifically for Military Sealift
                    Command civil service mariners — current or prospective.
                  </p>
                </div>

                <div className="px-[26px] pt-4 pb-[26px]">
                  {MSC_HUB_ITEMS.map((item, i) => (
                    <div
                      key={i}
                      className={`flex gap-3 items-start py-[13px] ${
                        i < MSC_HUB_ITEMS.length - 1
                          ? 'border-b border-white/[0.035]'
                          : ''
                      }`}
                    >
                      <span className="text-[1.1rem] mt-[1px]">{item.icon}</span>
                      <div>
                        <div className="font-heading font-semibold text-[0.86rem] text-slate-100 mb-[2px] tracking-[-0.01em]">
                          {item.label}
                        </div>
                        <div className="font-body text-[0.8rem] text-white/45 leading-[1.7]">
                          {item.desc}
                        </div>
                      </div>
                    </div>
                  ))}
                  <Link
                    href="/tools/ship-pay-calculator"
                    className="font-body inline-flex items-center gap-[6px] mt-[14px] text-blue-400 text-[0.85rem] font-semibold tracking-[0.01em] hover:text-blue-300 transition-colors"
                  >
                    Explore MSC Hub →
                  </Link>
                </div>
              </div>
            </FadeIn>

            {/* For All Mariners */}
            <FadeIn delay={140}>
              <div className="bg-white/[0.02] border border-green-500/[0.12] rounded-2xl overflow-hidden h-full">
                <div
                  className="px-[26px] pt-6 pb-5 border-b border-green-500/[0.08]"
                  style={{
                    background:
                      'linear-gradient(135deg, rgba(34,197,94,0.1), rgba(34,197,94,0.03))',
                  }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 rounded-[9px] bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-[1.05rem]">
                      🌍
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-[1.2rem] text-slate-100 tracking-[-0.01em]">
                        For All Mariners
                      </h3>
                      <p className="font-body text-[0.72rem] text-green-400 font-semibold tracking-[0.05em] uppercase">
                        MSC · NOAA · Commercial · Academy
                      </p>
                    </div>
                  </div>
                  <p className="font-body text-[0.84rem] text-white/45 leading-[1.7]">
                    Ship info, port guides, and career resources useful to any
                    merchant mariner — regardless of employer.
                  </p>
                </div>

                <div className="px-[26px] pt-4 pb-[26px]">
                  {ALL_MARINER_ITEMS.map((item, i) => {
                    const sc = STATUS_COLORS[item.status];
                    return (
                      <div
                        key={i}
                        className={`flex gap-3 items-start py-[13px] ${
                          i < ALL_MARINER_ITEMS.length - 1
                            ? 'border-b border-white/[0.035]'
                            : ''
                        }`}
                      >
                        <span className="text-[1.1rem] mt-[1px]">
                          {item.icon}
                        </span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-[2px]">
                            <span className="font-heading font-semibold text-[0.86rem] text-slate-100 tracking-[-0.01em]">
                              {item.label}
                            </span>
                            <span
                              className={`font-body text-[0.6rem] font-semibold tracking-[0.05em] uppercase px-[6px] py-[2px] rounded ${sc.bg} ${sc.text}`}
                            >
                              {item.statusLabel}
                            </span>
                          </div>
                          <div className="font-body text-[0.8rem] text-white/45 leading-[1.7]">
                            {item.desc}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  <div className="mt-[18px] p-[14px_16px] rounded-[10px] bg-yellow-400/[0.04] border border-yellow-400/10">
                    <p className="font-body text-[0.82rem] text-white/45 leading-[1.55]">
                      <span className="text-yellow-400 font-semibold">
                        Growing
                      </span>{' '}
                      means it&apos;s live but needs more content — that&apos;s
                      where you come in.{' '}
                      <span className="text-violet-400 font-semibold">
                        In Development
                      </span>{' '}
                      means it&apos;s being built.
                    </p>
                  </div>

                  <Link
                    href="/ports"
                    className="font-body inline-flex items-center gap-[6px] mt-[14px] text-green-400 text-[0.85rem] font-semibold tracking-[0.01em] hover:text-green-300 transition-colors"
                  >
                    Browse Guides & Ports →
                  </Link>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ════════ HELP US GET THERE ════════ */}
      <section className="px-8 py-[5.5rem]">
        <div className="max-w-[1000px] mx-auto">
          <FadeIn>
            <div
              className="border border-yellow-400/10 rounded-[20px] p-[44px_36px] relative overflow-hidden"
              style={{
                background:
                  'linear-gradient(135deg, rgba(250,204,21,0.04), rgba(245,158,11,0.015))',
              }}
            >
              {/* Corner glow */}
              <div
                className="absolute top-0 right-0 w-[280px] h-[280px]"
                style={{
                  background:
                    'radial-gradient(circle at top right, rgba(250,204,21,0.04), transparent 70%)',
                }}
              />

              <div className="relative">
                <div className="text-center mb-9">
                  <p className="font-body font-semibold text-[0.8rem] tracking-[0.08em] uppercase text-yellow-400 mb-[14px]">
                    Help us get there
                  </p>
                  <h2 className="font-heading font-bold text-[clamp(1.85rem,3.5vw,2.75rem)] text-slate-100 leading-[1.15] tracking-[-0.02em] max-w-[560px] mx-auto mb-[14px]">
                    The more mariners contribute, the better this gets.
                  </h2>
                  <p className="font-body text-[0.95rem] text-white/45 leading-[1.7] max-w-[540px] mx-auto">
                    Ship pages and port guides get better with every photo, tip,
                    and correction. If you&apos;ve sailed it or been there, you
                    know something we need. Every contribution gets credited.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {CONTRIBUTION_CARDS.map((item, i) => (
                    <div
                      key={i}
                      className="bg-black/20 border border-white/5 rounded-xl p-[22px] transition-colors duration-300 hover:border-yellow-400/20"
                    >
                      <span className="text-2xl block mb-[10px]">
                        {item.icon}
                      </span>
                      <h3 className="font-heading font-semibold text-[0.95rem] text-slate-100 mb-[6px] tracking-[-0.01em]">
                        {item.title}
                      </h3>
                      <p className="font-body text-[0.82rem] text-white/45 leading-[1.7] mb-[14px]">
                        {item.desc}
                      </p>
                      <a
                        href="mailto:support@civsail.com"
                        className="font-body text-yellow-400 text-[0.82rem] font-semibold hover:text-yellow-300 transition-colors"
                      >
                        {item.cta}
                      </a>
                    </div>
                  ))}
                </div>

                <p className="font-body text-[0.78rem] text-white/[0.28] mt-5 text-center">
                  Email contributions to{' '}
                  <span className="text-white/45">
                    support@civsail.com
                  </span>{' '}
                  — all contributors are credited.
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ════════ STORIES FROM THE INDUSTRY ════════ */}
      <section className="px-8 py-[5.5rem]">
        <div className="max-w-[1000px] mx-auto">
          <FadeIn>
            <div className="text-center mb-10">
              <h2 className="font-heading font-bold text-[clamp(1.85rem,3.5vw,2.75rem)] text-slate-100 leading-[1.15] tracking-[-0.02em]">
                Stories from the industry.
              </h2>
              <p className="font-body text-[0.95rem] text-white/45 leading-[1.7] max-w-[480px] mx-auto mt-3">
                Real experiences, honest takes, and the things nobody tells you
                until it&apos;s too late.
              </p>
            </div>
          </FadeIn>

          {/* Magazine layout: large left + two stacked right */}
          <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-5">
            {/* Large featured card — Adam Butters */}
            <FadeIn>
              <Link
                href="/editorials/profiles/adam-butters-story"
                className="block h-full"
              >
                <div
                  className="border border-red-500/[0.12] rounded-2xl p-[36px_32px] h-full flex flex-col justify-between transition-all duration-300 cursor-pointer relative overflow-hidden hover:border-red-500/35 hover:-translate-y-[3px]"
                  style={{
                    background:
                      'linear-gradient(160deg, rgba(239,68,68,0.08), rgba(239,68,68,0.02))',
                  }}
                >
                  <div
                    className="absolute top-0 right-0 w-[200px] h-[200px]"
                    style={{
                      background:
                        'radial-gradient(circle at top right, rgba(239,68,68,0.06), transparent 70%)',
                    }}
                  />
                  <div className="relative">
                    <span className="font-body text-[0.65rem] font-semibold tracking-[0.06em] uppercase text-red-500 bg-red-500/10 px-[10px] py-1 rounded-md">
                      MSC Stories
                    </span>
                    <h3 className="font-heading font-bold text-2xl text-slate-100 mt-4 mb-[14px] tracking-[-0.02em] leading-[1.25]">
                      The Adam Butters Story
                    </h3>
                    <p className="font-body text-[0.92rem] text-white/45 leading-[1.7] max-w-[400px]">
                      A story every MSC mariner should know. How one
                      person&apos;s experience exposed cracks in the system —
                      and why it matters for everyone still sailing.
                    </p>
                  </div>
                  <span className="font-body inline-block mt-6 text-red-500 text-[0.85rem] font-semibold">
                    Read the full story →
                  </span>
                </div>
              </Link>
            </FadeIn>

            {/* Two stacked cards */}
            <div className="flex flex-col gap-5">
              {STACKED_ARTICLES.map((article, i) => {
                const isAmber = article.color === 'amber';
                const borderClass = isAmber
                  ? 'border-amber-500/[0.12] hover:border-amber-500/35'
                  : 'border-blue-500/[0.12] hover:border-blue-500/35';
                const tagColor = isAmber ? 'text-amber-500' : 'text-blue-500';
                const ctaColor = isAmber ? 'text-amber-500' : 'text-blue-500';
                const gradient = isAmber
                  ? 'linear-gradient(160deg, rgba(245,158,11,0.08), rgba(245,158,11,0.02))'
                  : 'linear-gradient(160deg, rgba(59,130,246,0.08), rgba(59,130,246,0.02))';

                return (
                  <FadeIn key={i} delay={100 + i * 100}>
                    <Link href={article.href} className="block">
                      <div
                        className={`border ${borderClass} rounded-2xl p-[26px_28px] transition-all duration-300 cursor-pointer hover:-translate-y-[2px]`}
                        style={{ background: gradient }}
                      >
                        <span
                          className={`font-body text-[0.62rem] font-semibold tracking-[0.06em] uppercase ${tagColor}`}
                        >
                          {article.tag}
                        </span>
                        <h3 className="font-heading font-bold text-[1.05rem] text-slate-100 mt-2 mb-2 tracking-[-0.01em] leading-[1.3]">
                          {article.title}
                        </h3>
                        <p className="font-body text-[0.82rem] text-white/40 leading-[1.6]">
                          {article.desc}
                        </p>
                        <span
                          className={`font-body inline-block mt-3 ${ctaColor} text-[0.82rem] font-semibold`}
                        >
                          Read →
                        </span>
                      </div>
                    </Link>
                  </FadeIn>
                );
              })}
            </div>
          </div>

          {/* About CIVSail bar */}
          <FadeIn delay={300}>
            <Link href="/about" className="block">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white/[0.02] border border-white/[0.06] rounded-xl px-6 py-4 mt-5 transition-colors duration-300 hover:border-blue-400/25 gap-2">
                <span className="font-body text-[0.85rem] text-white/40 font-medium">
                  How maritime academy, sea time, and shoreside experience led
                  to building this site
                </span>
                <span className="font-body text-blue-400 text-[0.82rem] font-semibold tracking-[0.01em] whitespace-nowrap">
                  Read our story →
                </span>
              </div>
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* ════════ STAY IN THE LOOP ════════ */}
      <section className="px-8 py-[5.5rem] text-center">
        <div className="max-w-[520px] mx-auto">
          <FadeIn>
            <h2 className="font-heading font-bold text-[clamp(1.85rem,3.5vw,2.75rem)] text-slate-100 leading-[1.15] tracking-[-0.02em] mb-[14px]">
              Stay in the loop.
            </h2>
            <p className="font-body text-base text-white/45 leading-[1.7] mb-8">
              New tools, new port guides, new ship pages — drop your email and
              we&apos;ll let you know when something ships. We promise not to
              spam you.
            </p>

            <div className="bg-white/[0.025] border border-white/[0.07] rounded-xl p-6">
              {newsletterStatus === 'success' ? (
                <div className="flex items-center justify-center gap-3 py-2">
                  <svg className="h-5 w-5 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <p className="font-body text-emerald-300 text-[0.92rem]">
                    You&apos;re in! We&apos;ll keep you posted.
                  </p>
                </div>
              ) : (
                <>
                  <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.name@ship-email.com"
                      disabled={newsletterStatus === 'loading'}
                      className="font-body flex-1 px-[14px] py-3 rounded-lg bg-white/5 border border-white/[0.08] text-slate-100 text-[0.9rem] outline-none focus:border-blue-500/50 transition-colors placeholder:text-white/25 disabled:opacity-50"
                    />
                    <button
                      type="submit"
                      disabled={newsletterStatus === 'loading'}
                      className="font-body bg-blue-600 text-white px-[22px] py-3 rounded-lg border-none font-semibold text-[0.9rem] cursor-pointer whitespace-nowrap tracking-[0.01em] hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {newsletterStatus === 'loading' ? 'Subscribing...' : 'Keep Me Posted'}
                    </button>
                  </form>
                  {newsletterStatus === 'error' && (
                    <p className="font-body text-[0.8rem] text-red-400 mt-2">
                      Please enter a valid email and try again.
                    </p>
                  )}
                  <p className="font-body text-[0.76rem] text-white/25 mt-3">
                    Updates only. No spam. Unsubscribe anytime.
                  </p>
                </>
              )}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ════════ FOOTER ════════ */}
      <footer className="border-t border-white/5 px-8 py-10">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4 flex-wrap">
          <div className="text-center md:text-left">
            <span className="font-heading font-extrabold text-[1.2rem] tracking-[-0.02em]">
              <span className="text-yellow-400">CIV</span>
              <span className="text-blue-400">Sail</span>
            </span>
            <p className="font-body text-[0.76rem] text-white/[0.28] mt-[3px]">
              Built by a mariner, for mariners.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-x-[22px] gap-y-2 text-[0.82rem] text-white/35 font-body font-medium">
            {FOOTER_LINKS.map((item) =>
              item.href.startsWith('mailto:') ? (
                <a
                  key={item.label}
                  href={item.href}
                  className="hover:text-white/70 transition-colors"
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.label}
                  href={item.href}
                  className="hover:text-white/70 transition-colors"
                >
                  {item.label}
                </Link>
              )
            )}
          </div>
          <p className="font-body text-[0.72rem] text-white/[0.18]">
            © {new Date().getFullYear()} CIVSail.com — Not affiliated with MSC,
            NOAA, or USCG.
          </p>
        </div>
      </footer>
    </div>
  );
}
