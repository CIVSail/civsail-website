'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';

const CredentialsTrainingRenewal = () => {
  useEffect(() => {
    // Add interaction effects after component mounts
    const cards = document.querySelectorAll('.section-card');
    cards.forEach((card) => {
      card.addEventListener('click', () => {
        // Add a subtle click animation
        const element = card as HTMLElement;
        element.style.transform = 'translateY(-5px) scale(0.98)';
        setTimeout(() => {
          element.style.transform = 'translateY(-10px)';
        }, 150);
      });
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-blue-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-slate-900 via-blue-900 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">
            Credentials, Training & Renewal
          </h1>
          <p className="text-xl text-blue-100 max-w-4xl mx-auto">
            Your comprehensive guide to maritime documentation, professional
            development, and staying current in the civilian maritime industry
          </p>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        {/* Intro Section */}
        <section className="bg-white rounded-2xl shadow-xl p-8 mb-12 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">
            Navigate Your Maritime Career
          </h2>
          <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Whether you're just starting your civilian maritime career or are a
            seasoned professional, staying current with credentials, training,
            and renewals is essential. Our comprehensive guides help you
            understand requirements, streamline applications, and maintain
            compliance across all aspects of your maritime documentation and
            professional development.
          </p>
        </section>

        {/* Main Sections Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {/* Credentials Card */}
          <Link
            href="/maritime-101/credentials"
            className="section-card bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 p-8 group border-l-4 border-red-500"
          >
            <div className="text-6xl mb-6">🆔</div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-blue-600">
              Credentials
            </h3>
            <p className="text-gray-600 mb-6">
              Essential documentation and identification required for maritime
              employment, facility access, and career advancement in the
              civilian maritime sector.
            </p>

            <div className="mb-6">
              <h4 className="font-semibold text-slate-900 mb-3">
                Key Topics Include:
              </h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="bg-red-50 p-2 rounded-lg hover:bg-red-100 transition-colors">
                  Transportation Worker Identification Credential (TWIC)
                </li>
                <li className="bg-red-50 p-2 rounded-lg hover:bg-red-100 transition-colors">
                  Merchant Mariner Credential (MMC)
                </li>
                <li className="bg-red-50 p-2 rounded-lg hover:bg-red-100 transition-colors">
                  US Passport & Passport Cards
                </li>
                <li className="bg-red-50 p-2 rounded-lg hover:bg-red-100 transition-colors">
                  Common Access Cards (CAC)
                </li>
                <li className="bg-red-50 p-2 rounded-lg hover:bg-red-100 transition-colors">
                  Medical Certificates
                </li>
                <li className="bg-red-50 p-2 rounded-lg hover:bg-red-100 transition-colors">
                  Security Clearances
                </li>
              </ul>
            </div>

            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors">
              Explore Credentials
            </button>
          </Link>

          {/* Training Card */}
          <Link
            href="/maritime-101/training-and-entry"
            className="section-card bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 p-8 group border-l-4 border-teal-500"
          >
            <div className="text-6xl mb-6">📚</div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-blue-600">
              Training
            </h3>
            <p className="text-gray-600 mb-6">
              Required courses, certifications, and professional development
              opportunities to advance your skills and meet industry standards.
            </p>

            <div className="mb-6">
              <h4 className="font-semibold text-slate-900 mb-3">
                Key Topics Include:
              </h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="bg-teal-50 p-2 rounded-lg hover:bg-teal-100 transition-colors">
                  STCW Basic Safety Training
                </li>
                <li className="bg-teal-50 p-2 rounded-lg hover:bg-teal-100 transition-colors">
                  Vessel Security Officer Training
                </li>
                <li className="bg-teal-50 p-2 rounded-lg hover:bg-teal-100 transition-colors">
                  Hazmat & Dangerous Goods
                </li>
                <li className="bg-teal-50 p-2 rounded-lg hover:bg-teal-100 transition-colors">
                  First Aid & CPR Certification
                </li>
                <li className="bg-teal-50 p-2 rounded-lg hover:bg-teal-100 transition-colors">
                  Radio Operator Permits
                </li>
                <li className="bg-teal-50 p-2 rounded-lg hover:bg-teal-100 transition-colors">
                  Specialized Equipment Training
                </li>
              </ul>
            </div>

            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors">
              View Training Options
            </button>
          </Link>

          {/* Renewal Card */}
          <Link
            href="/maritime-101/credentials"
            className="section-card bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 p-8 group border-l-4 border-blue-500"
          >
            <div className="text-6xl mb-6">🔄</div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-blue-600">
              Renewal
            </h3>
            <p className="text-gray-600 mb-6">
              Stay compliant with renewal timelines, requirements, and processes
              to maintain your credentials and certifications without
              interruption.
            </p>

            <div className="mb-6">
              <h4 className="font-semibold text-slate-900 mb-3">
                Key Topics Include:
              </h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="bg-blue-50 p-2 rounded-lg hover:bg-blue-100 transition-colors">
                  TWIC Renewal Process
                </li>
                <li className="bg-blue-50 p-2 rounded-lg hover:bg-blue-100 transition-colors">
                  MMC Renewal & Upgrades
                </li>
                <li className="bg-blue-50 p-2 rounded-lg hover:bg-blue-100 transition-colors">
                  Medical Certificate Renewals
                </li>
                <li className="bg-blue-50 p-2 rounded-lg hover:bg-blue-100 transition-colors">
                  Training Certificate Updates
                </li>
                <li className="bg-blue-50 p-2 rounded-lg hover:bg-blue-100 transition-colors">
                  Renewal Timelines & Deadlines
                </li>
                <li className="bg-blue-50 p-2 rounded-lg hover:bg-blue-100 transition-colors">
                  Online vs. In-Person Requirements
                </li>
              </ul>
            </div>

            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors">
              Check Renewal Info
            </button>
          </Link>
        </div>

        {/* Quick Links Section */}
        <section className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <h3 className="text-2xl font-bold text-slate-900 mb-4">
            Quick Access Resources
          </h3>
          <p className="text-gray-600 mb-8">
            Jump directly to frequently needed information and external
            resources
          </p>

          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
            <a
              href="https://www.uscg.mil/nmc/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all hover:-translate-y-1 text-sm font-medium"
            >
              USCG National Maritime Center
            </a>
            <a
              href="https://www.tsa.gov/for-industry/twic"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all hover:-translate-y-1 text-sm font-medium"
            >
              TSA TWIC Program
            </a>
            <Link
              href="/maritime-101/training-and-entry"
              className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all hover:-translate-y-1 text-sm font-medium"
            >
              Training Providers Directory
            </Link>
            <Link
              href="/maritime-101/credentials"
              className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all hover:-translate-y-1 text-sm font-medium"
            >
              Renewal Calendar
            </Link>
            <Link
              href="/tools"
              className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all hover:-translate-y-1 text-sm font-medium"
            >
              Cost Calculator
            </Link>
            <Link
              href="/maritime-101/credentials"
              className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all hover:-translate-y-1 text-sm font-medium"
            >
              Document Checklist
            </Link>
          </div>
        </section>

        {/* Footer Note */}
        <div className="text-center mt-12 p-6 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
          <p className="text-gray-700">
            <strong>Stay Updated:</strong> Maritime regulations and requirements
            change frequently. Always verify current requirements with official
            sources before beginning any application or renewal process.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CredentialsTrainingRenewal;
