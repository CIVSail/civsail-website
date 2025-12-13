'use client';

import Link from 'next/link';
import { Hero } from './components/Hero';
import { CareersSection } from './components/CareersSection';
import { SectorsSection } from './components/SectorsSection';
import { SectionTransition } from './components/SectionTransition';
import { ScrollReveal } from './components/ScrollReveal';

/**
 * Careers & Sectors Page - Main entry point
 * 
 * Advanced UI implementation with:
 * - Split hero teaching core concepts
 * - Paired career tiles with scroll reveals
 * - Masonry sector grid with wave animations
 * - Smooth section transitions
 * - CTAs to quiz and account creation
 */

export default function CareersAndSectorsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero - Split concept introduction */}
      <Hero />

      {/* Section 1: Careers (What You Do) */}
      <CareersSection />

      {/* Visual transition between sections */}
      <SectionTransition />

      {/* Section 2: Sectors (Where You Sail) */}
      <SectorsSection />

      {/* Final CTA Section */}
      <section className="bg-gradient-to-br from-blue-900 via-slate-800 to-blue-800 text-white py-16 md:py-20">
        <div className="container mx-auto px-4">
          <ScrollReveal variant="fadeUp" className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
              Want a personalized path?
            </h2>
            <p className="text-lg md:text-xl text-blue-100 mb-8 leading-relaxed">
              Create an account to save your interests, track credentials, and
              build a career roadmap tailored to your goals.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/signup"
                className="inline-block bg-white text-blue-800 font-semibold px-8 py-4 rounded-full hover:bg-blue-50 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-transform"
              >
                Create free account
              </Link>
              <Link
                href="/guides/maritime-101"
                className="inline-block bg-white/10 border-2 border-white/30 text-white font-semibold px-8 py-4 rounded-full hover:bg-white/20 transition-colors backdrop-blur-sm"
              >
                Start with Maritime 101
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="mt-12 pt-8 border-t border-white/20">
              <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-blue-200">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Free forever</span>
                </div>
                <span className="text-white/30">•</span>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>No credit card required</span>
                </div>
                <span className="text-white/30">•</span>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Built by mariners</span>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}