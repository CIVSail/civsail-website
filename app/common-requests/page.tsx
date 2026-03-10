'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ChevronRight,
  Users,
  FileCheck,
  FlaskConical,
  ExternalLink,
  Mail,
  Copy,
  Check,
  AlertTriangle,
  Phone,
  DollarSign,
  Heart,
  User,
  FileText,
  Link as LinkIcon,
} from 'lucide-react';

// Section definitions
const sections = [
  {
    id: 'placement-contacts',
    title: 'Placement Contacts',
    icon: Users,
  },
  {
    id: 'employment-verification',
    title: 'Employment Verification',
    icon: FileCheck,
  },
  {
    id: 'drug-letter',
    title: 'Drug Test Letter',
    icon: FlaskConical,
  },
  {
    id: 'important-links',
    title: 'Important Links',
    icon: LinkIcon,
  },
];

// Important links data organized by category
const linkCategories = [
  {
    title: 'Pay & Finance',
    icon: DollarSign,
    links: [
      {
        name: 'MyPay',
        url: 'https://mypay.dfas.mil',
        description: 'Pay stubs, tax documents, W-2s',
      },
      {
        name: 'DFAS',
        url: 'https://www.dfas.mil',
        description: 'Defense Finance and Accounting Service',
      },
      {
        name: 'TSP',
        url: 'https://www.tsp.gov',
        description: 'Thrift Savings Plan (retirement)',
      },
      {
        name: 'TSP Phone',
        url: 'tel:888-320-2917',
        description: '888-320-2917 — 7am-9pm ET',
        isPhone: true,
      },
    ],
  },
  {
    title: 'Benefits',
    icon: Heart,
    links: [
      {
        name: 'OPM',
        url: 'https://www.opm.gov',
        description: 'Benefits, retirement info',
      },
      {
        name: 'BENEFEDS',
        url: 'https://www.benefeds.com',
        description: 'Federal dental & vision enrollment',
      },
      {
        name: 'BENEFEDS Support',
        url: 'mailto:Service@BENEFEDS.com',
        description: 'Service@BENEFEDS.com',
        isEmail: true,
      },
      {
        name: 'FSAFEDS',
        url: 'https://www.fsafeds.gov',
        description: 'Flexible Spending Accounts',
      },
      {
        name: 'FSA Phone',
        url: 'tel:877-372-3337',
        description: '877-372-3337 — SHPS Customer Service',
        isPhone: true,
      },
    ],
  },
  {
    title: 'HR & Self-Service',
    icon: User,
    links: [
      {
        name: 'MyBiz+',
        url: 'https://compo.dcpds.cpms.osd.mil',
        description: 'HR self-service portal',
      },
      {
        name: 'USA Jobs',
        url: 'https://www.usajobs.gov',
        description: 'Federal job listings',
      },
      {
        name: 'MSC Careers',
        url: 'https://www.sealiftcommand.com',
        description: 'MSC job opportunities',
      },
    ],
  },
  {
    title: 'Credentials & Licensing',
    icon: FileText,
    links: [
      {
        name: 'NMC',
        url: 'https://www.dco.uscg.mil/nmc',
        description: 'National Maritime Center (Coast Guard credentials)',
      },
      {
        name: 'TWIC',
        url: 'https://www.tsa.gov/twic',
        description: 'Transportation Worker ID Credential',
      },
    ],
  },
];

export default function CommonRequestsPage() {
  const [activeSection, setActiveSection] = useState('placement-contacts');
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Handle URL hash on load and change
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (hash && sections.some((s) => s.id === hash)) {
        setActiveSection(hash);
      }
    };

    // Check hash on mount
    handleHashChange();

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Update hash when section changes
  const handleSectionChange = (sectionId: string) => {
    setActiveSection(sectionId);
    window.history.pushState(null, '', `#${sectionId}`);
  };

  const copyEmail = async (email: string) => {
    await navigator.clipboard.writeText(email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-slate-600/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          {/* Breadcrumb */}
          <div className="flex items-center text-white/60 text-sm mb-6">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <Link href="/msc-hub" className="hover:text-white transition-colors">
              MSC Hub
            </Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span className="text-white">Common Requests</span>
          </div>

          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-3">
            Common Needs & Requests
          </h1>
          <p className="text-lg text-white/70 max-w-2xl">
            Quick access to frequently needed resources, contacts, and
            self-service tools for MSC mariners.
          </p>
        </div>
      </section>

      {/* Main Content with Sidebar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="lg:grid lg:grid-cols-[280px_1fr] lg:gap-8">
          {/* Mobile Navigation - Horizontal Tabs */}
          <div className="lg:hidden mb-6 overflow-x-auto">
            <div className="flex gap-2 pb-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => handleSectionChange(section.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg whitespace-nowrap text-sm font-medium transition-all ${
                    activeSection === section.id
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/50'
                      : 'bg-white/5 text-white/70 border border-white/10 hover:bg-white/10'
                  }`}
                >
                  <section.icon className="w-4 h-4" />
                  {section.title}
                </button>
              ))}
            </div>
          </div>

          {/* Desktop Sidebar */}
          <aside className="hidden lg:block">
            <nav className="sticky top-24 space-y-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => handleSectionChange(section.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                    activeSection === section.id
                      ? 'bg-blue-500/20 text-white border border-blue-500/50'
                      : 'text-white/70 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <section.icon className="w-5 h-5 flex-shrink-0" />
                  <span className="font-medium">{section.title}</span>
                </button>
              ))}
            </nav>
          </aside>

          {/* Content Area */}
          <main className="min-h-[600px]">
            {/* Placement Contacts Section */}
            {activeSection === 'placement-contacts' && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">
                    Placement Contacts
                  </h2>
                </div>

                {/* Disclaimer */}
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
                  <div className="flex gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-amber-200 text-sm">
                        <strong>Note:</strong> This information is sourced from
                        MSC&apos;s website and is updated periodically. CIVSail
                        cannot directly update this content on behalf of MSC. If
                        the information is incorrect or outdated (as it often
                        is), please contact MSC directly for accurate details.
                      </p>
                    </div>
                  </div>
                </div>

                {/* PDF Preview Card */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-3">
                    MSC CIVMAR Placement-Training Division Contacts
                  </h3>
                  <p className="text-white/60 text-sm mb-4">
                    The Placement-Training Division contact sheet lists phone
                    numbers and emails for placement specialists by region and
                    department. Use this to follow up on assignments, training
                    questions, or rotation scheduling.
                  </p>

                  <div className="bg-slate-800/50 border border-white/10 rounded-xl p-8 text-center mb-4">
                    <FileText className="w-12 h-12 text-white/30 mx-auto mb-3" />
                    <p className="text-white/50 text-sm mb-4">
                      PDF Document — January 2026
                    </p>
                    <a
                      href="https://d38fsb1zpaztrx.cloudfront.net/files/MSC%20CIVMAR%20PLACEMENT-TRAINING%20DIVISION%2002%20Jan%202026.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-400 text-white font-medium px-6 py-3 rounded-lg transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      View Full Document
                    </a>
                  </div>

                  <p className="text-white/40 text-xs text-center">
                    Opens in a new tab. Last known update: January 2026
                  </p>
                </div>
              </div>
            )}

            {/* Employment Verification Section */}
            {activeSection === 'employment-verification' && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                    <FileCheck className="w-5 h-5 text-blue-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">
                    Employment Verification
                  </h2>
                </div>

                {/* Introduction */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <p className="text-white/80 leading-relaxed">
                    Employment Verification (EV) is an online self-service
                    MyBiz+ tool allowing current DOD employees to send
                    employment and/or salary information to an external
                    organization (business, bank, credit union) or person
                    directly from the Defense Civilian Personnel Data System
                    (DCPDS) in a password-protected document via email.
                  </p>
                  <p className="text-white/60 mt-3 text-sm">
                    All you need is the recipient&apos;s email address along
                    with your work or personal email address to initiate
                    confirmation and validation of your employment verification.
                  </p>
                </div>

                {/* Information That Gets Sent */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Information That Gets Sent
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {[
                      'Employee Name',
                      'Employer Name',
                      'Employer Address',
                      'Duty Station',
                      'Last Four of SSN',
                      'Employment Status',
                      'Most Recent Start Date',
                      'Original Hire Date',
                      'Total Time with Employer',
                      'Position Title',
                      'Rate of Pay (if selected)',
                      'Salary (if selected)',
                      'Reference Number',
                      'Email to Address',
                    ].map((item) => (
                      <div
                        key={item}
                        className="flex items-center gap-2 text-white/70 text-sm"
                      >
                        <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Steps */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Steps to Send EV Information
                  </h3>
                  <ol className="space-y-3">
                    {[
                      <>
                        Log into the DCPDS Portal at{' '}
                        <a
                          href="https://compo.dcpds.cpms.osd.mil/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 underline"
                        >
                          compo.dcpds.cpms.osd.mil
                        </a>
                      </>,
                      'Select MyBiz+',
                      'Under Key Services, select Request Employment Verification',
                      'Select your details to share: Employment Information, OR Employment and Salary Information',
                      "Enter recipient's email information in the To field",
                      'Verify that your desired email address is included in the My Email field to receive the password',
                      'Select Continue to preview the information',
                      'Select Acknowledge and Submit to send your EV information',
                      'Confirm your submission',
                      'Consent to release your information',
                      'Provide password to recipient to view EV information',
                    ].map((step, index) => (
                      <li key={index} className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-blue-500/20 text-blue-300 rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </span>
                        <span className="text-white/70 pt-0.5">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Footer Note */}
                <div className="bg-slate-800/50 border border-white/10 rounded-xl p-4">
                  <p className="text-white/60 text-sm">
                    Access to the MyBiz+ Employment Verification tool is
                    available with your Common Access Card (CAC). For more
                    information, visit{' '}
                    <a
                      href="http://www.cpms.osd.mil/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300"
                    >
                      cpms.osd.mil
                    </a>
                  </p>
                </div>
              </div>
            )}

            {/* Drug Test Letter Section */}
            {activeSection === 'drug-letter' && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                    <FlaskConical className="w-5 h-5 text-blue-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">
                    Drug Testing Letter
                  </h2>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 lg:p-8">
                  <h3 className="text-lg font-semibold text-white mb-3">
                    Requesting a Drug Testing Letter
                  </h3>
                  <p className="text-white/70 mb-6">
                    To request a drug letter for an MMC renewal or another
                    purpose, send an email to:
                  </p>

                  {/* Email Display */}
                  <div className="bg-slate-800/50 border border-white/20 rounded-xl p-6 text-center mb-6">
                    <a
                      href="mailto:MSC_HR_DRUG_LETTERS@us.navy.mil"
                      className="text-xl lg:text-2xl font-mono text-blue-400 hover:text-blue-300 transition-colors break-all"
                    >
                      MSC_HR_DRUG_LETTERS@us.navy.mil
                    </a>
                  </div>

                  <div className="flex flex-wrap justify-center gap-3 mb-8">
                    <a
                      href="mailto:MSC_HR_DRUG_LETTERS@us.navy.mil"
                      className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-400 text-white font-medium px-5 py-2.5 rounded-lg transition-colors"
                    >
                      <Mail className="w-4 h-4" />
                      Send Email
                    </a>
                    <button
                      onClick={() =>
                        copyEmail('MSC_HR_DRUG_LETTERS@us.navy.mil')
                      }
                      className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-medium px-5 py-2.5 rounded-lg transition-colors border border-white/20"
                    >
                      {copiedEmail ? (
                        <>
                          <Check className="w-4 h-4 text-green-400" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copy Email
                        </>
                      )}
                    </button>
                  </div>

                  {/* What to Include */}
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                    <h4 className="text-white font-medium mb-2">
                      In your email, include:
                    </h4>
                    <ul className="space-y-1 text-white/70 text-sm">
                      <li>• Your full name</li>
                      <li>• Employee ID</li>
                      <li>• Purpose of request (e.g., &quot;MMC renewal&quot;)</li>
                      <li>• Any deadline if applicable</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Important Links Section */}
            {activeSection === 'important-links' && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                    <LinkIcon className="w-5 h-5 text-blue-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">
                    Important Links & Contacts
                  </h2>
                </div>

                <div className="space-y-6">
                  {linkCategories.map((category) => (
                    <div
                      key={category.title}
                      className="bg-white/5 border border-white/10 rounded-2xl p-6"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                          <category.icon className="w-4 h-4 text-blue-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-white">
                          {category.title}
                        </h3>
                      </div>

                      <div className="space-y-2">
                        {category.links.map((link) => (
                          <a
                            key={link.name}
                            href={link.url}
                            target={
                              link.isPhone || link.isEmail ? undefined : '_blank'
                            }
                            rel={
                              link.isPhone || link.isEmail
                                ? undefined
                                : 'noopener noreferrer'
                            }
                            className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all group"
                          >
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-white font-medium">
                                  {link.name}
                                </span>
                                {link.isPhone && (
                                  <Phone className="w-3.5 h-3.5 text-white/40" />
                                )}
                                {link.isEmail && (
                                  <Mail className="w-3.5 h-3.5 text-white/40" />
                                )}
                              </div>
                              <p className="text-white/50 text-sm">
                                {link.description}
                              </p>
                            </div>
                            {!link.isPhone && (
                              <ExternalLink className="w-4 h-4 text-white/30 group-hover:text-white/60 transition-colors" />
                            )}
                          </a>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
