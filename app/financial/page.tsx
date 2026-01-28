'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import {
  TrendingDown,
  DollarSign,
  Heart,
  Anchor,
  Landmark,
  TrendingUp,
  HeartPulse,
  Wallet,
  GraduationCap,
  Home,
  Shield,
  Ship,
  Handshake,
  Lock,
  CheckCircle2,
  ArrowRight,
  ChevronRight,
  Loader2,
} from 'lucide-react';

// Problem cards data
const problems = [
  {
    icon: TrendingDown,
    title: 'Wrong Retirement Allocation',
    description:
      'Do you know what funds your retirement contributions go into?The wrong choice can quietly cost you thousands over time.',
  },
  {
    icon: DollarSign,
    title: 'No Budget Strategy',
    description:
      "Big paychecks come in waves. Without a plan for sea and shore, it's easy to end up with nothing to show for years of hard work.",
  },
  {
    icon: Heart,
    title: 'Benefits Confusion',
    description:
      "Are you paying for coverage you don't need, or missing coverage you do?",
  },
  {
    icon: Anchor,
    title: 'No Endgame Plan',
    description:
      "Whether you come ashore in five years or twenty-five, you need a roadmap before you get there.",
  },
];

// Services data
const services = [
  {
    icon: Landmark,
    title: 'Retirement Planning',
    description:
      "Whether you have a TSP, 401(k), union pension, or other retirement plan — make sure you're contributing the right amount to the right funds for YOUR goals.",
  },
  {
    icon: TrendingUp,
    title: 'Investing While at Sea',
    description:
      "Your money should work as hard as you do. Learn strategies to grow wealth even while you're underway for months at a time.",
  },
  {
    icon: HeartPulse,
    title: 'Benefits Selection',
    description:
      'Health, dental, vision — navigate open enrollment with confidence and choose the coverage that actually fits your needs.',
  },
  {
    icon: Wallet,
    title: 'Budgeting for Sea & Shore',
    description:
      'Create a realistic budget that accounts for the feast-or-famine nature of mariner income.',
  },
  {
    icon: GraduationCap,
    title: 'Debt Management',
    description:
      'Student loans, credit cards, or other debt? Build a payoff strategy that works with your rotation schedule.',
  },
  {
    icon: Home,
    title: 'Saving for a Home',
    description:
      "Set a strategy for saving a down payment or buying a house — even when you're gone half the year.",
  },
  {
    icon: Shield,
    title: 'Insurance Planning',
    description:
      'Life insurance, disability, liability — make sure you and your family are protected.',
  },
  {
    icon: Ship,
    title: 'Planning for The Final Muster',
    description:
      'Whether retirement is 5 years or 25 years away, start planning for life after sailing now.',
  },
];

// Trust features data
const trustFeatures = [
  {
    icon: Anchor,
    title: 'Mariner-Focused',
    description:
      'Our network includes professionals who understand the unique financial challenges of sea-based income, rotations, and the mariner lifestyle.',
  },
  {
    icon: Handshake,
    title: 'No Pressure',
    description:
      'This is a free consultation with no obligation. Get the information you need to make informed decisions.',
  },
  {
    icon: Lock,
    title: 'Your Privacy Protected',
    description:
      "Your information stays private. We'll personally connect you with a trusted advisor from our network.",
  },
];

// Form options
const sailingOptions = [
  { value: '', label: 'Select your current status' },
  { value: 'at-sea', label: 'Yes, currently at sea' },
  { value: 'ashore', label: 'Yes, on rotation ashore' },
  { value: 'between', label: 'No, between assignments' },
  { value: 'new', label: 'New to the industry' },
];

const helpOptions = [
  { value: 'retirement', label: 'Retirement planning' },
  { value: 'investing', label: 'Investing' },
  { value: 'benefits', label: 'Benefits selection' },
  { value: 'budgeting', label: 'Budgeting' },
  { value: 'debt', label: 'Debt management' },
  { value: 'home', label: 'Saving for a home' },
  { value: 'insurance', label: 'Insurance' },
  { value: 'general', label: 'General financial planning' },
  { value: 'unsure', label: 'Not sure — need guidance' },
];

interface FormData {
  name: string;
  email: string;
  phone: string;
  currentlySailing: string;
  helpWith: string[];
  additionalInfo: string;
}

export default function FinancialPage() {
  const formRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    currentlySailing: '',
    helpWith: [],
    additionalInfo: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleHelpWithChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      helpWith: prev.helpWith.includes(value)
        ? prev.helpWith.filter((v) => v !== value)
        : [...prev.helpWith, value],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic validation
    if (!formData.name.trim()) {
      setError('Please enter your name');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    if (!formData.currentlySailing) {
      setError('Please select your current sailing status');
      return;
    }
    if (formData.helpWith.length === 0) {
      setError('Please select at least one area you need help with');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/financial-consultation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok || !result.ok) {
        throw new Error(result.message || 'Failed to submit form');
      }

      setIsSubmitted(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Something went wrong. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/10 to-green-600/10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-500/20 via-transparent to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          {/* Breadcrumb */}
          <div className="flex items-center text-white/60 text-sm mb-8">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span className="text-white">Financial Planning</span>
          </div>

          <div className="max-w-4xl">
            <div className="inline-flex items-center bg-emerald-500/20 text-emerald-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <DollarSign className="w-4 h-4 mr-2" />
              Free Financial Consultation
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Making Money at Sea?
              <span className="block text-emerald-400">
                Make Sure You Keep It.
              </span>
            </h1>

            <p className="text-xl text-white/80 leading-relaxed mb-10 max-w-3xl">
              Whether you&apos;re a new mariner or a seasoned sailor, having a
              solid financial plan is crucial to making the most of your
              earnings. Let us connect you with a trusted financial professional
              who understands the unique challenges of life at sea.
            </p>

            <button
              onClick={scrollToForm}
              className="group inline-flex items-center bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40"
            >
              Get Your Free Consultation
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              The Hard Truth About Mariner Finances
            </h2>
            <p className="text-lg text-white/70 max-w-3xl mx-auto">
              You’re earning more than most people your age. That’s a real head
              start if you protect it. Without a plan, excess spending and a
              lack of intention quietly undo the advantage.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-10">
            {problems.map((problem, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-emerald-500/30 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
                    <problem.icon className="w-6 h-6 text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {problem.title}
                    </h3>
                    <p className="text-white/60">{problem.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Shore Shock Callout */}
          <Link
            href="/editorials/soundings/shore-shock"
            className="block max-w-2xl mx-auto mt-12 group"
          >
            <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-2xl p-6 hover:border-amber-400/50 hover:from-amber-500/20 hover:to-orange-500/20 transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center">
                  <Anchor className="w-6 h-6 text-amber-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-amber-300 transition-colors">
                    Shore Shock
                  </h3>
                  <p className="text-white/60 text-sm mb-2">
                    The financial and emotional challenges of returning to shore life and how to prepare before you get there.
                  </p>
                  <span className="inline-flex items-center text-amber-400 text-sm font-medium group-hover:text-amber-300">
                    Read the article
                    <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20 lg:py-28 bg-gradient-to-b from-transparent via-emerald-950/30 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              Chart Your Course to Financial Success
            </h2>
            <p className="text-lg text-white/70 max-w-3xl mx-auto">
              No matter where you are in your career, having a financial
              professional in your corner makes all the difference. Here&apos;s
              what our network can help you with:
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-10">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-emerald-500/30 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center mb-4">
                  <service.icon className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {service.title}
                </h3>
                <p className="text-white/60 text-sm">{service.description}</p>
              </div>
            ))}
          </div>

          {/* Final Muster Callout */}
          <Link
            href="/editorials/final-muster"
            className="block max-w-2xl mx-auto mt-12 group"
          >
            <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 rounded-2xl p-6 hover:border-emerald-400/50 hover:from-emerald-500/20 hover:to-teal-500/20 transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                  <Ship className="w-6 h-6 text-emerald-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-emerald-300 transition-colors">
                    The Final Muster
                  </h3>
                  <p className="text-white/60 text-sm mb-2">
                    Our editorial series on retirement, benefits, and planning for life after sailing.
                  </p>
                  <span className="inline-flex items-center text-emerald-400 text-sm font-medium group-hover:text-emerald-300">
                    Explore the series
                    <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              Financial Guidance That Understands Your Life
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {trustFeatures.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <feature.icon className="w-8 h-8 text-emerald-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-white/60">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section
        ref={formRef}
        className="py-20 lg:py-28 bg-gradient-to-b from-transparent via-emerald-950/50 to-transparent"
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              Get Your Free Financial Consultation
            </h2>

            <div className="flex flex-wrap justify-center gap-4 text-emerald-300">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                100% free consultation
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                No obligation, no pressure
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                Advisors who understand mariner life
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                Personal response within 48 hours
              </span>
            </div>
          </div>

          {isSubmitted ? (
            <div className="bg-white/5 backdrop-blur-lg border border-emerald-500/30 rounded-2xl p-8 lg:p-12 text-center">
              <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Thanks for reaching out!
              </h3>
              <p className="text-white/70 text-lg">
                We&apos;ve received your request and will connect you with an
                advisor within 48 hours.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="bg-white/5 backdrop-blur-lg border border-white/20 rounded-2xl p-8 lg:p-12 shadow-2xl shadow-emerald-500/10"
            >
              {error && (
                <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 mb-6 text-red-300">
                  {error}
                </div>
              )}

              <div className="space-y-6">
                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-white/80 mb-2"
                  >
                    Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="Your name"
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-white/80 mb-2"
                  >
                    Email <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    placeholder="your.email@example.com"
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-white/80 mb-2"
                  >
                    Phone <span className="text-white/40">(optional)</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                    placeholder="Phone number (optional)"
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
                  />
                </div>

                {/* Currently Sailing */}
                <div>
                  <label
                    htmlFor="currentlySailing"
                    className="block text-sm font-medium text-white/80 mb-2"
                  >
                    Currently Sailing? <span className="text-red-400">*</span>
                  </label>
                  <select
                    id="currentlySailing"
                    value={formData.currentlySailing}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        currentlySailing: e.target.value,
                      }))
                    }
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
                  >
                    {sailingOptions.map((option) => (
                      <option
                        key={option.value}
                        value={option.value}
                        className="bg-slate-900 text-white"
                      >
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Help With */}
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-3">
                    What do you need help with?{' '}
                    <span className="text-red-400">*</span>
                    <span className="text-white/40 ml-1">
                      (select all that apply)
                    </span>
                  </label>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {helpOptions.map((option) => (
                      <label
                        key={option.value}
                        className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                          formData.helpWith.includes(option.value)
                            ? 'bg-emerald-500/20 border border-emerald-500/50'
                            : 'bg-white/5 border border-white/10 hover:bg-white/10'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={formData.helpWith.includes(option.value)}
                          onChange={() => handleHelpWithChange(option.value)}
                          className="sr-only"
                        />
                        <div
                          className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 ${
                            formData.helpWith.includes(option.value)
                              ? 'bg-emerald-500'
                              : 'bg-white/20'
                          }`}
                        >
                          {formData.helpWith.includes(option.value) && (
                            <CheckCircle2 className="w-4 h-4 text-white" />
                          )}
                        </div>
                        <span className="text-white/80">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Additional Info */}
                <div>
                  <label
                    htmlFor="additionalInfo"
                    className="block text-sm font-medium text-white/80 mb-2"
                  >
                    Anything else we should know?{' '}
                    <span className="text-white/40">(optional)</span>
                  </label>
                  <textarea
                    id="additionalInfo"
                    value={formData.additionalInfo}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        additionalInfo: e.target.value,
                      }))
                    }
                    placeholder="Tell us about your situation (optional)"
                    rows={4}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all resize-none"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 disabled:from-emerald-600 disabled:to-green-600 disabled:cursor-not-allowed text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Connect Me With an Advisor
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>

                {/* Privacy Note */}
                <p className="text-center text-white/50 text-sm">
                  Your information is kept private and will only be shared with
                  a trusted advisor from our network to assist with your
                  consultation.
                </p>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* Urgency Footer */}
      <section className="py-16 bg-gradient-to-b from-emerald-950/30 to-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xl lg:text-2xl text-white/90 font-medium mb-6">
            Every rotation you wait is money left on the table. Get your plan
            started before your next hitch.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            Have questions? Contact us
            <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
