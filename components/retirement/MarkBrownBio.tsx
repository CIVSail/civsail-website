'use client';

import { ExternalLink, Mail, Phone } from 'lucide-react';

export default function MarkBrownBio() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="mx-auto max-w-5xl px-4">
        <div className="grid gap-12 md:grid-cols-3">
          <div className="flex justify-center md:justify-start">
            <div className="relative h-64 w-64 overflow-hidden rounded-2xl bg-linear-to-br from-[#1e3a5f] to-[#3db4c0] shadow-xl">
              <div className="flex h-full w-full items-center justify-center">
                <span className="text-6xl font-bold text-white/30">MB</span>
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-[#3db4c0]">
              About the Author
            </h2>
            <h3 className="mb-4 text-3xl font-bold text-[#1e3a5f]">Mark Brown</h3>
            <p className="mb-4 text-gray-600">
              Founder of High3Team.com, Mark Brown has spent over 22 years helping federal employees with complex, non-traditional careers navigate retirement. From High-3 calculations and FERS quirks to military buybacks and TSP strategy, Mark has guided hundreds of retirees, including CIVMARs, through the maze of federal benefits with clarity and care.
            </p>
            <p className="mb-4 text-gray-600">
              High 3 Team provides workshops and individual services to CIVMARs, Federal Firefighters, Air Traffic Controllers, and Federal Law Enforcement. These job series represent only 5.6% of the federal workforce and often have difficulty finding accurate guidance on base pay, leave accrual, and retirement eligibility.
            </p>
            <p className="mb-6 text-gray-600">
              Mark has personally visited 22 MSC ships, meeting with mariners around the world to help them take control of their post-sea future. Now, he brings that expertise to CIVSail with a monthly column answering your most pressing retirement questions.
            </p>

            <div className="flex flex-wrap gap-4">
              <a
                href="https://high3team.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[#1e3a5f] px-6 py-2.5 font-medium text-white transition hover:bg-[#2a4a73]"
              >
                <ExternalLink className="h-4 w-4" />
                Visit High3Team.com
              </a>
              <a
                href="mailto:markbrown@high3team.com"
                className="inline-flex items-center gap-2 rounded-full border-2 border-[#1e3a5f] px-6 py-2.5 font-medium text-[#1e3a5f] transition hover:bg-[#1e3a5f] hover:text-white"
              >
                <Mail className="h-4 w-4" />
                Email Mark
              </a>
              <a
                href="tel:214-649-3580"
                className="inline-flex items-center gap-2 rounded-full border-2 border-[#1e3a5f] px-6 py-2.5 font-medium text-[#1e3a5f] transition hover:bg-[#1e3a5f] hover:text-white"
              >
                <Phone className="h-4 w-4" />
                214-649-3580
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}