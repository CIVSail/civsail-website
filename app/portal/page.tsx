'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { FadeIn } from '@/components/FadeIn';

const FEATURES = [
  {
    title: 'Credential Management',
    subtitle: 'Never miss a renewal again.',
    description:
      'The portal will track important credential expiration dates and send reminders well in advance so you have time to renew. CIVSail will also send instructions and guidance on how to complete each renewal, helping simplify the process.',
    items: [
      'Merchant Mariner Credential (MMC)',
      'Medical Certificate',
      'TWIC',
      'Passport',
      "Driver's License",
      'Other required credentials',
    ],
    footer:
      'Automated reminders will notify you months before expiration so renewals never sneak up on you.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    accent: 'from-blue-600 to-blue-700',
    borderHover: 'hover:border-blue-400/25',
  },
  {
    title: 'Sea Service Tracking',
    subtitle: 'Your sea time is your career.',
    description:
      'CIVSail will allow you to log and track sea service across ships and contracts, helping you understand exactly where you stand for your next credential upgrade.',
    items: [
      'Sea service logging',
      'Sea days by year',
      'Upgrade eligibility tracking',
      'License upgrade planning',
      'Visual sea-time progress tracking',
    ],
    footer: null,
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    accent: 'from-emerald-600 to-emerald-700',
    borderHover: 'hover:border-emerald-400/25',
  },
  {
    title: 'Document Management',
    subtitle: 'Keep your most important documents organized and accessible.',
    description: 'Upload and store the files that define your professional record:',
    items: [
      'Sea service letters',
      'MMC copies',
      'Training certificates',
      'Evaluations',
      'Medical documents',
      'Generated forms',
    ],
    footer: 'Everything stored in one secure location so you can quickly access it when needed.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
      </svg>
    ),
    accent: 'from-amber-600 to-amber-700',
    borderHover: 'hover:border-amber-400/25',
  },
  {
    title: 'Automated Form Tools',
    subtitle: 'Paperwork is a reality of life at sea. CIVSail aims to make it easier.',
    description: 'Current and upcoming tools include:',
    items: [
      'Leave Chit Generator',
      'Travel Claim Generator',
      'Form autofill tools',
      'Document generation and storage',
    ],
    footer: 'Forms created through CIVSail can also be saved directly to your profile for future reference.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    accent: 'from-violet-600 to-violet-700',
    borderHover: 'hover:border-violet-400/25',
  },
  {
    title: 'Career Navigation Tools',
    subtitle: 'Your career should not be managed passively.',
    description:
      "Don't rely solely on your company or your union to plan your career. Make sure you maintain control of your professional path. CIVSail is building tools designed to help mariners make intentional decisions so their career fits their life.",
    items: [
      'Plan credential upgrades',
      'Track required courses',
      'Discover training opportunities',
      'Understand career pathways across the maritime industry',
    ],
    footer: 'The goal is simple: give mariners better information so they can make better decisions.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
      </svg>
    ),
    accent: 'from-cyan-600 to-cyan-700',
    borderHover: 'hover:border-cyan-400/25',
  },
];

function EmailSignup({ source, buttonText = 'Notify Me' }: { source: string; buttonText?: string }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setStatus('error');
      return;
    }
    setStatus('loading');
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert({ email: email.toLowerCase().trim(), source });
      if (error && error.code !== '23505') throw error;
      setStatus('success');
      setEmail('');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="flex items-center justify-center gap-3 py-3">
        <svg className="h-5 w-5 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        <p className="text-emerald-400 font-medium text-[0.95rem]">
          You&apos;re on the list. We&apos;ll be in touch.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="relative flex flex-col sm:flex-row gap-3">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your.name@email.com"
        disabled={status === 'loading'}
        className="flex-1 px-[14px] py-3 rounded-lg bg-white/5 border border-white/[0.08] text-slate-100 text-[0.9rem] outline-none focus:border-blue-500/50 transition-colors placeholder:text-white/25 disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className="font-body bg-blue-600 text-white px-[22px] py-3 rounded-lg border-none font-semibold text-[0.9rem] cursor-pointer whitespace-nowrap tracking-[0.01em] hover:bg-blue-500 hover:shadow-[0_2px_16px_rgba(37,99,235,0.5)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_2px_12px_rgba(37,99,235,0.35)]"
      >
        {status === 'loading' ? 'Submitting...' : buttonText}
      </button>
      {status === 'error' && (
        <p className="text-red-400 text-[0.8rem] sm:absolute sm:-bottom-6 sm:left-0">
          Please enter a valid email and try again.
        </p>
      )}
    </form>
  );
}

export default function PortalPage() {
  return (
    <div className="font-body text-slate-200 bg-[#0a0f1a] min-h-screen overflow-x-hidden">
      {/* Hero */}
      <section className="relative min-h-[min(80vh,720px)] flex items-center overflow-hidden">
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
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-8">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              Under Development
            </div>
          </FadeIn>

          <FadeIn delay={80}>
            <h1 className="font-heading font-extrabold text-[clamp(2.4rem,5vw,3.5rem)] leading-[1.08] mb-[22px] tracking-[-0.03em]">
              <span className="text-slate-100">A platform for </span>
              <span className="bg-gradient-to-br from-yellow-400 to-yellow-500 bg-clip-text text-transparent">
                managing life at sea.
              </span>
            </h1>
          </FadeIn>

          <FadeIn delay={160}>
            <p className="text-lg leading-[1.75] text-white/55 max-w-[600px] mx-auto mb-10">
              CIVSail is building the tools many mariners have always wished existed. Instead of managing your career through scattered emails, spreadsheets and paperwork, the CIVSail portal is designed to give you one place to organize your credentials, track your sea service and manage the documents that define your career.
            </p>
          </FadeIn>

          <FadeIn delay={240}>
            <div className="max-w-lg mx-auto">
              <p className="text-sm text-white/50 font-medium tracking-[0.01em] mb-4">
                Drop your email below and we will notify you when Stage 1 of the CIVSail Portal goes live.
              </p>
              <EmailSignup source="portal-hero" />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* What CIVSail Is Building */}
      <section
        className="px-8 py-[5.5rem]"
        style={{
          background:
            'linear-gradient(180deg, rgba(37,99,235,0.025) 0%, transparent 100%)',
        }}
      >
        <div className="max-w-[1000px] mx-auto">
          <FadeIn>
            <div className="text-center mb-14">
              <p className="font-body font-semibold text-[0.8rem] tracking-[0.08em] uppercase text-blue-400 mb-[14px]">
                Coming Soon
              </p>
              <h2 className="font-heading font-bold text-[clamp(1.85rem,3.5vw,2.75rem)] text-slate-100 leading-[1.15] tracking-[-0.02em] mb-4">
                What CIVSail Is Building
              </h2>
              <p className="font-body text-base text-white/55 leading-[1.75] max-w-[580px] mx-auto">
                The CIVSail portal is being built to help mariners take control of the administrative side of their career so they can spend less time dealing with paperwork and more time focusing on the work that actually matters.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((feature, i) => (
              <FadeIn key={feature.title} delay={i * 80}>
                <div className={`group bg-white/[0.025] border border-white/[0.07] rounded-xl p-[22px] transition-all duration-300 ${feature.borderHover} hover:-translate-y-[3px] h-full flex flex-col`}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 rounded-[9px] bg-gradient-to-br ${feature.accent} flex items-center justify-center text-white shrink-0`}>
                      {feature.icon}
                    </div>
                    <h3 className="font-heading font-bold text-[1.05rem] text-slate-100 tracking-[-0.01em] leading-tight">
                      {feature.title}
                    </h3>
                  </div>

                  <p className="font-body text-[0.95rem] text-white/65 font-medium mb-2">
                    {feature.subtitle}
                  </p>

                  <div
                    className="w-8 h-[2px] mb-3 rounded-sm"
                    style={{
                      background: 'linear-gradient(90deg, #facc15, transparent)',
                    }}
                  />

                  <p className="font-body text-sm text-white/50 leading-[1.75] mb-3">
                    {feature.description}
                  </p>

                  <ul className="space-y-1.5 mb-3 flex-1">
                    {feature.items.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-white/50">
                        <span className="text-blue-400/50 mt-[5px] shrink-0">
                          <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                            <circle cx="10" cy="10" r="4" />
                          </svg>
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>

                  {feature.footer && (
                    <p className="text-white/40 text-sm italic leading-[1.7]">{feature.footer}</p>
                  )}
                </div>
              </FadeIn>
            ))}
          </div>

          {/* Pesky admin callout */}
          <FadeIn>
            <div className="mt-10 text-center">
              <div className="inline-block bg-white/[0.025] border border-white/[0.07] rounded-xl px-8 py-5">
                <p className="text-white/55 text-base">
                  If there are any other pesky administrative tasks you wish were automated, shoot us an email at{' '}
                  <a href="mailto:support@civsail.com" className="text-blue-400 hover:text-blue-300 transition-colors font-medium">
                    support@civsail.com
                  </a>{' '}
                  and we will work toward building solutions.
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Stay in the Loop (bottom CTA) */}
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
            <p className="font-body font-semibold text-[0.8rem] tracking-[0.08em] uppercase text-yellow-400 mb-[14px]">
              Stay in the loop
            </p>
            <h2 className="font-heading font-bold text-[clamp(1.85rem,3.5vw,2.75rem)] text-slate-100 leading-[1.15] tracking-[-0.02em] mb-4">
              Be the first to know.
            </h2>
            <p className="font-body text-base text-white/55 leading-[1.75] max-w-[540px] mx-auto mb-3">
              CIVSail is launching in stages as new tools come online. Drop your email below and we will notify you when Stage 1 of the CIVSail Portal goes live.
            </p>
            <p className="font-body text-[0.95rem] text-white/45 leading-[1.75] mb-8">
              Early users will help shape the platform and be the first to access new features as they are released.
            </p>
          </FadeIn>

          <FadeIn delay={100}>
            <div className="bg-white/[0.025] border border-white/[0.07] rounded-xl p-6 sm:p-8 mb-8">
              <p className="font-heading font-semibold text-[1.05rem] text-slate-100 mb-5">
                CIVSail is being built for mariners, by mariners.
              </p>
              <EmailSignup source="portal-footer" buttonText="Notify Me When Stage 1 Launches" />
            </div>
          </FadeIn>

          <FadeIn delay={200}>
            <p className="text-white/35 text-sm">
              Information on CIVSail is based on real mariner experience. Always verify credential requirements with the USCG and your employer.
            </p>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
