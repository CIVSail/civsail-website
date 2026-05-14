'use client';

import Link from 'next/link';
import { FadeIn } from '@/components/FadeIn';

const DISCOVER_ITEMS = [
  { label: 'Useful gear', icon: '&#9881;' },
  { label: 'Tools built for life at sea', icon: '&#9875;' },
  { label: 'Educational resources', icon: '&#128218;' },
  { label: 'Books and media from the maritime world', icon: '&#128214;' },
  { label: 'Apparel and artwork created by mariners', icon: '&#127912;' },
  { label: 'Services that support mariner careers', icon: '&#128188;' },
];

const WORK_WITH_US_ITEMS = [
  {
    title: 'Maritime Gear',
    desc: 'Equipment, tools, or supplies designed for mariners.',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
  },
  {
    title: 'Books & Educational Resources',
    desc: 'Training materials, guides, or maritime-focused media.',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  {
    title: 'Industry Tools & Software',
    desc: 'Apps, platforms, or digital tools that serve the maritime community.',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    title: 'Apparel & Artwork',
    desc: 'Clothing, prints, or creative work by and for mariners.',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
  },
  {
    title: 'Services for Mariners',
    desc: 'Financial, legal, career, or wellness services relevant to the industry.',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    title: 'Something Else Entirely',
    desc: 'Anything you believe the mariner community would appreciate.',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
  },
];

export default function MarketplacePage() {
  return (
    <div className="font-body text-slate-200 bg-[#0a0f1a] min-h-screen overflow-x-hidden">
      {/* Hero */}
      <section className="relative min-h-[min(70vh,620px)] flex items-center overflow-hidden">
        {/* Decorative background */}
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
            <h1 className="font-heading font-extrabold text-[clamp(2.4rem,5vw,3.5rem)] leading-[1.08] mb-[22px] tracking-[-0.03em]">
              <span className="text-slate-100">CIVSail </span>
              <span className="bg-gradient-to-br from-yellow-400 to-yellow-500 bg-clip-text text-transparent">
                Marketplace
              </span>
            </h1>
          </FadeIn>

          <FadeIn delay={100}>
            <p className="text-[1.15rem] text-white/60 font-medium mb-2">
              CIVSail started by selling a few hats.
            </p>
            <p className="text-[1.05rem] text-white/40">
              Now we&apos;re building something a little bigger.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Origin Story */}
      <section className="px-8 py-[5.5rem]">
        <div className="max-w-[740px] mx-auto">
          <FadeIn>
            <div className="bg-white/[0.025] border border-white/[0.07] rounded-xl p-[26px] sm:p-8 transition-all duration-300 hover:border-yellow-400/20">
              <p className="text-white/70 leading-[1.75] text-base mb-4">
                When CIVSail first launched we experimented with selling a few hats and t-shirts.
              </p>
              <p className="text-white/55 leading-[1.75] text-base mb-4">
                The idea was simple. If the site could generate a little revenue, it would help offset the cost of hosting, software, and the time required to build and maintain the platform.
              </p>
              <p className="text-white/55 leading-[1.75] text-base mb-5">
                As it turns out, that small experiment led to one of the more interesting moments in the site&apos;s history — it helped trigger the cease and desist that ultimately led to the CIVSail rebrand.
              </p>

              <div
                className="w-10 h-[2px] mb-5 rounded-sm"
                style={{
                  background: 'linear-gradient(90deg, #facc15, transparent)',
                }}
              />

              <p className="text-white/50 text-[0.95rem] mb-3">If you&apos;re curious about that story:</p>
              <Link
                href="/editorials/soundings/weve-rebranded"
                className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-semibold text-base transition-colors"
              >
                Read the CIVSail Rebrand Story
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Where This Page Is Going */}
      <section
        className="px-8 py-[5.5rem]"
        style={{
          background:
            'linear-gradient(180deg, rgba(37,99,235,0.025) 0%, transparent 100%)',
        }}
      >
        <div className="max-w-[800px] mx-auto">
          <FadeIn>
            <div className="text-center mb-10">
              <p className="font-body font-semibold text-[0.8rem] tracking-[0.08em] uppercase text-blue-400 mb-[14px]">
                The Vision
              </p>
              <h2 className="font-heading font-bold text-[clamp(1.85rem,3.5vw,2.75rem)] text-slate-100 leading-[1.15] tracking-[-0.02em] mb-5">
                Where This Page Is Going
              </h2>
            </div>
          </FadeIn>

          <FadeIn delay={80}>
            <div className="space-y-4 text-white/55 leading-[1.75] text-base mb-10 max-w-[640px] mx-auto">
              <p>While building CIVSail we realized something else.</p>
              <p>
                There are a lot of mariners and maritime companies building interesting things — gear, tools, books, services, artwork, and products the community would genuinely enjoy.
              </p>
              <p>But the mariner world is surprisingly fragmented.</p>
            </div>
          </FadeIn>

          <FadeIn delay={160}>
            <div className="bg-white/[0.025] border border-white/[0.07] rounded-xl p-[26px] sm:p-8 max-w-[640px] mx-auto mb-10">
              <p className="text-white/45 italic text-base leading-[1.75] mb-1">
                Great ideas often stay trapped inside small circles.
              </p>
              <p className="text-white/45 italic text-base leading-[1.75]">
                Good products rarely reach the wider mariner community.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={220}>
            <p className="text-white/55 text-base leading-[1.75] max-w-[640px] mx-auto mb-8">
              CIVSail is becoming a place to help bring that community together.
            </p>

            <div className="text-center">
              <div className="inline-block bg-gradient-to-r from-blue-600/10 to-blue-500/5 border border-blue-500/[0.15] rounded-xl px-8 py-5">
                <p className="text-white/55 text-base mb-1">The goal is simple:</p>
                <p className="font-heading font-bold text-xl bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent">
                  Connect mariners with the people building things for mariners.
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Built Around the Mariner Community */}
      <section className="px-8 py-[5.5rem]">
        <div className="max-w-[1000px] mx-auto">
          <FadeIn>
            <div className="text-center mb-12">
              <h2 className="font-heading font-bold text-[clamp(1.85rem,3.5vw,2.75rem)] text-slate-100 leading-[1.15] tracking-[-0.02em] mb-4">
                Built Around the Mariner Community
              </h2>
              <p className="font-body text-base text-white/55 leading-[1.75] max-w-[560px] mx-auto">
                CIVSail is built around the people who actually live this life. That means the platform is slowly becoming a place where mariners can discover:
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {DISCOVER_ITEMS.map((item, i) => (
              <FadeIn key={item.label} delay={i * 70}>
                <div className="bg-white/[0.025] border border-white/[0.07] rounded-xl p-[22px] transition-all duration-300 hover:border-yellow-400/25 hover:-translate-y-[3px] h-full">
                  <p className="font-heading font-semibold text-base text-slate-100 tracking-[-0.01em]">
                    {item.label}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={450}>
            <p className="text-white/45 italic text-[0.95rem] text-center mt-8">
              Not everything needs to be serious either. Sometimes it&apos;s just something cool that people who work at sea will appreciate.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Work With CIVSail */}
      <section
        className="px-8 py-[5.5rem]"
        style={{
          background:
            'linear-gradient(180deg, transparent 0%, rgba(37,99,235,0.02) 50%, transparent 100%)',
        }}
      >
        <div className="max-w-[1000px] mx-auto">
          <FadeIn>
            <div className="text-center mb-12">
              <p className="font-body font-semibold text-[0.8rem] tracking-[0.08em] uppercase text-yellow-400 mb-[14px]">
                Partner With Us
              </p>
              <h2 className="font-heading font-bold text-[clamp(1.85rem,3.5vw,2.75rem)] text-slate-100 leading-[1.15] tracking-[-0.02em] mb-4">
                Work With CIVSail
              </h2>
              <p className="font-body text-base text-white/55 leading-[1.75] max-w-[560px] mx-auto">
                If you&apos;re building something you think mariners would enjoy, we would love to hear about it.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {WORK_WITH_US_ITEMS.map((item, i) => (
              <FadeIn key={item.title} delay={i * 70}>
                <div className="bg-white/[0.025] border border-white/[0.07] rounded-xl p-[22px] transition-all duration-300 hover:border-blue-400/25 hover:-translate-y-[3px] h-full">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-[9px] bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white shrink-0">
                      {item.icon}
                    </div>
                    <h3 className="font-heading font-bold text-base text-slate-100 tracking-[-0.01em]">
                      {item.title}
                    </h3>
                  </div>
                  <div
                    className="w-7 h-[2px] mb-[10px] rounded-sm"
                    style={{
                      background: 'linear-gradient(90deg, #facc15, transparent)',
                    }}
                  />
                  <p className="font-body text-sm text-white/50 leading-[1.75]">
                    {item.desc}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={450}>
            <p className="text-white/50 text-base text-center mt-8">
              If it&apos;s something the community would genuinely like, we would be happy to feature it.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* CTA */}
      <section className="relative px-8 py-[5.5rem] overflow-hidden">
        {/* Background glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(37,99,235,0.06) 0%, transparent 70%)',
          }}
        />

        <div className="relative max-w-[640px] mx-auto text-center">
          <FadeIn>
            <h2 className="font-heading font-bold text-[clamp(1.85rem,3.5vw,2.75rem)] text-slate-100 leading-[1.15] tracking-[-0.02em] mb-4">
              Get Your Product in Front of Mariners
            </h2>
            <p className="font-body text-base text-white/55 leading-[1.75] max-w-[480px] mx-auto mb-8">
              If you&apos;re interested in working with CIVSail or featuring a product on the site, reach out.
            </p>
          </FadeIn>

          <FadeIn delay={100}>
            <div className="relative inline-block">
              {/* Glow backdrop */}
              <div
                className="absolute inset-0 -inset-x-4 -inset-y-2 rounded-2xl blur-xl opacity-30 pointer-events-none"
                style={{
                  background:
                    'radial-gradient(ellipse 70% 80% at 50% 50%, rgba(37,99,235,0.4), transparent 65%)',
                }}
              />
              <a
                href="mailto:support@civsail.com"
                className="relative inline-flex items-center gap-3 bg-blue-600 text-white px-10 py-4 rounded-[9px] font-semibold text-[1.05rem] shadow-[0_2px_12px_rgba(37,99,235,0.35),0_0px_30px_rgba(37,99,235,0.1)] hover:bg-blue-500 hover:shadow-[0_2px_16px_rgba(37,99,235,0.5),0_0px_40px_rgba(37,99,235,0.15)] transition-all duration-300"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                support@civsail.com
              </a>
            </div>
          </FadeIn>

          <FadeIn delay={180}>
            <p className="text-white/50 text-base mt-6">
              Tell us what you&apos;re building and why mariners would find it useful.
            </p>

            <div
              className="w-12 h-[2px] mx-auto my-8 rounded-sm"
              style={{
                background: 'linear-gradient(90deg, transparent, #facc15, transparent)',
              }}
            />

            <p className="text-white/35 text-sm">
              CIVSail exists to help bring the mariner community together, and good ideas deserve the right audience.
            </p>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
