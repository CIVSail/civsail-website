import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-blue-800 text-white py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6">
              About CIVSail
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 leading-relaxed">
              Built by mariners, for mariners — supporting you through every
              stage of your maritime career
            </p>
          </div>
        </div>
      </section>

      {/* Mission Statement Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-serif font-bold text-gray-900 mb-4">
                Our Mission
              </h2>
              <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed text-center">
                CIVSail.com is the premier hub for mariners and their families —
                built to support you to, through, and after your maritime
                career. We understand the unique challenges of life at sea and
                ashore. That's why we've created a platform that offers
                practical tools, trusted guidance, and a growing community — all
                designed to help you make the most of your time in the Merchant
                Marine and plan for what comes next.
              </p>

              <div className="mt-8 p-6 bg-blue-50 rounded-lg border-l-4 border-blue-600">
                <p className="text-lg text-blue-900 font-medium text-center">
                  Whether you're just getting started, actively sailing, or
                  transitioning to life after sea, CIVSail is here to help you
                  navigate every leg of the journey.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who We Are Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-serif font-bold text-gray-900 mb-4">
                Who We Are
              </h2>
              <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Content */}
              <div className="space-y-6">
                <p className="text-lg text-gray-700 leading-relaxed">
                  CIVSail.com is a one-stop platform for mariners and their
                  families — designed to support you at sea, at home, and at
                  every step in between. Sailing can be a rewarding career
                  filled with adventure, purpose, and financial opportunity —
                  but it also comes with a unique set of challenges. We know
                  that world firsthand and we're here to help you navigate it.
                </p>

                <p className="text-lg text-gray-700 leading-relaxed">
                  Merchant Mariners are essential to both national defense and
                  global trade. Over 90% of the world's goods move by sea — none
                  of it possible without the hard-working men and women who crew
                  the ships. Despite their critical role, mariners are often
                  overlooked. CIVSail.com is committed to changing that.
                </p>

                <p className="text-lg text-gray-700 leading-relaxed">
                  From gear that actually fits and tools that actually work, to
                  career guidance, pay calculators, credential planning, and
                  onboard support, we're building a platform that makes life at
                  sea — and after — a little easier. Whether you're working
                  toward your first credential or planning your final shore
                  transition, CIVSail is here to help you build a more
                  lucrative, fulfilling and sustainable maritime career.
                </p>
              </div>

              {/* Stats/Visual Element */}
              <div className="bg-slate-900 rounded-lg p-8 text-white">
                <h3 className="text-2xl font-semibold mb-8 text-center">
                  Maritime by the Numbers
                </h3>

                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-700 pb-4">
                    <span className="text-slate-300">
                      Global goods moved by sea
                    </span>
                    <span className="text-3xl font-bold text-blue-400">
                      90%
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-b border-slate-700 pb-4">
                    <span className="text-slate-300">
                      US merchant fleet ships
                    </span>
                    <span className="text-3xl font-bold text-blue-400">
                      180+
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-b border-slate-700 pb-4">
                    <span className="text-slate-300">Active US mariners</span>
                    <span className="text-3xl font-bold text-blue-400">
                      8,000+
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">
                      Years of combined experience
                    </span>
                    <span className="text-3xl font-bold text-blue-400">∞</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-serif font-bold text-gray-900 mb-4">
                What We Stand For
              </h2>
              <div className="w-24 h-1 bg-blue-600 mx-auto mb-6"></div>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our values guide everything we build and every decision we make
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Value 1 */}
              <div className="bg-white rounded-lg p-8 shadow-lg text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl">⚓</span>
                </div>
                <h3 className="text-xl font-semibold mb-4">
                  Built by Mariners
                </h3>
                <p className="text-gray-600">
                  We understand the industry because we've lived it. Every tool
                  and resource is created with real maritime experience.
                </p>
              </div>

              {/* Value 2 */}
              <div className="bg-white rounded-lg p-8 shadow-lg text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl">🛠️</span>
                </div>
                <h3 className="text-xl font-semibold mb-4">
                  Practical Solutions
                </h3>
                <p className="text-gray-600">
                  No fluff, no theory — just tools and information that actually
                  work when you need them most.
                </p>
              </div>

              {/* Value 3 */}
              <div className="bg-white rounded-lg p-8 shadow-lg text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl">🤝</span>
                </div>
                <h3 className="text-xl font-semibold mb-4">Community First</h3>
                <p className="text-gray-600">
                  Mariners looking out for mariners. We're building a platform
                  that strengthens our entire community.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-serif font-bold mb-6">
              Ready to Navigate Your Career?
            </h2>
            <p className="text-xl text-gray-300 mb-10">
              Join thousands of mariners who are already using CIVSail to take
              control of their maritime careers
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/tools"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
              >
                Explore Our Tools
              </Link>
              <Link
                href="/guides"
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-slate-900 transition-colors"
              >
                Read Our Guides
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-white border-t border-gray-200">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              Questions? We're Here to Help
            </h3>
            <p className="text-gray-600 mb-6">
              Have feedback, suggestions, or just want to connect? We'd love to
              hear from you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="mailto:support@civsail.com"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                support@civsail.com
              </a>
              <span className="hidden sm:block text-gray-400">|</span>
              <div className="flex items-center space-x-4">
                <a
                  href="https://instagram.com/civsail"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-pink-600 transition-colors"
                >
                  Instagram
                </a>
                <a
                  href="https://facebook.com/civsail"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-600 transition-colors"
                >
                  Facebook
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
