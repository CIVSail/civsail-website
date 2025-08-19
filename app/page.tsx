import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-blue-800 text-white">
        <div className="container mx-auto px-4 py-24">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6">
              Tools & Resources for Civilian Mariners
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-12 leading-relaxed">
              From pay calculators to credential tracking, CIVSail provides the
              tools MSC mariners need to manage their careers and maximize their
              earnings
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/signup"
                className="bg-white text-blue-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors"
              >
                Get Started Free
              </Link>
              <Link
                href="/tools/pay-calculator"
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-900 transition-colors"
              >
                Try Pay Calculator
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Tools Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-gray-900 mb-4">
              Essential Tools for Every Mariner
            </h2>
            <p className="text-xl text-gray-600">
              Calculate pay, generate forms, and manage your maritime career
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Pay Calculator */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow group">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6 group-hover:bg-blue-200 transition-colors">
                <span className="text-2xl">💰</span>
              </div>
              <h3 className="text-2xl font-semibold mb-4">Pay Calculator</h3>
              <p className="text-gray-600 mb-6">
                Calculate ship pay with overtime, retention bonuses, and
                benefits. Compare different vessels and deployments.
              </p>
              <Link
                href="/tools/pay-calculator"
                className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 transition-colors"
              >
                Try Calculator →
              </Link>
            </div>

            {/* Leave Chit Generator */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow group">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6 group-hover:bg-green-200 transition-colors">
                <span className="text-2xl">📝</span>
              </div>
              <h3 className="text-2xl font-semibold mb-4">
                Leave Chit Generator
              </h3>
              <p className="text-gray-600 mb-6">
                Generate properly formatted annual and sick leave requests.
                Calculate leave balances and accrual rates.
              </p>
              <Link
                href="/tools/leave-chit"
                className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 transition-colors"
              >
                Generate Form →
              </Link>
            </div>

            {/* Travel Voucher */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow group">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6 group-hover:bg-purple-200 transition-colors">
                <span className="text-2xl">✈️</span>
              </div>
              <h3 className="text-2xl font-semibold mb-4">
                Travel Voucher (DD 1351-2)
              </h3>
              <p className="text-gray-600 mb-6">
                Auto-generate travel claims with proper receipts and
                documentation for faster reimbursement.
              </p>
              <Link
                href="/tools/travel-voucher"
                className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 transition-colors"
              >
                Generate Voucher →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Articles Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-gray-900 mb-4">
              Latest Guides & Resources
            </h2>
            <p className="text-xl text-gray-600">
              Expert insights and practical advice for your maritime career
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Shore Shock Article */}
            <article className="group cursor-pointer">
              <Link href="https://civsail.com/blogs/from-the-team/shore-shock-what-happens-after-you-stop-sailing-and-how-to-prepare">
                <div className="bg-gradient-to-br from-blue-500 to-blue-700 h-48 rounded-lg mb-6 flex items-center justify-center">
                  <span className="text-white text-6xl">🏠</span>
                </div>
                <div className="space-y-3">
                  <span className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                    Career Planning
                  </span>
                  <h3 className="text-xl font-semibold group-hover:text-blue-600 transition-colors">
                    Shore Shock: What Happens After You Stop Sailing
                  </h3>
                  <p className="text-gray-600">
                    Complete guide to transitioning from sea to shore, including
                    financial planning and career options.
                  </p>
                  <span className="text-sm text-gray-500">5 min read</span>
                </div>
              </Link>
            </article>

            {/* Pay Guide Article */}
            <article className="group cursor-pointer">
              <Link href="https://civsail.com/blogs/neo-topics/pay-payroll-dfas-and-pay-issues">
                <div className="bg-gradient-to-br from-green-500 to-green-700 h-48 rounded-lg mb-6 flex items-center justify-center">
                  <span className="text-white text-6xl">💸</span>
                </div>
                <div className="space-y-3">
                  <span className="inline-block bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
                    Pay & Benefits
                  </span>
                  <h3 className="text-xl font-semibold group-hover:text-blue-600 transition-colors">
                    Pay, Payroll, DFAS and Pay Issues
                  </h3>
                  <p className="text-gray-600">
                    Everything you need to know about CIVMAR pay, overtime, and
                    resolving common payroll problems.
                  </p>
                  <span className="text-sm text-gray-500">8 min read</span>
                </div>
              </Link>
            </article>

            {/* T-AKE Operations Article */}
            <article className="group cursor-pointer">
              <Link href="https://civsail.com/blogs/t-ake/t-ake-money-and-operations">
                <div className="bg-gradient-to-br from-purple-500 to-purple-700 h-48 rounded-lg mb-6 flex items-center justify-center">
                  <span className="text-white text-6xl">🚢</span>
                </div>
                <div className="space-y-3">
                  <span className="inline-block bg-purple-100 text-purple-800 text-sm px-3 py-1 rounded-full">
                    Ship Classes
                  </span>
                  <h3 className="text-xl font-semibold group-hover:text-blue-600 transition-colors">
                    T-AKE Money and Operations
                  </h3>
                  <p className="text-gray-600">
                    Detailed breakdown of T-AKE operations, deployment cycles,
                    and earning potential.
                  </p>
                  <span className="text-sm text-gray-500">12 min read</span>
                </div>
              </Link>
            </article>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-serif font-bold mb-6">
            Ready to take control of your maritime career?
          </h2>
          <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto">
            Join thousands of CIVMARs who use CIVSail to track credentials,
            calculate pay, and plan their next moves. Get started today with our
            free tools.
          </p>
          <Link
            href="/signup"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-lg font-semibold text-lg transition-colors"
          >
            Create Your Free Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Brand */}
            <div>
              <h3 className="text-xl font-bold mb-4">CIVSail</h3>
              <p className="text-gray-400 mb-4">
                Tools and resources built by mariners, for mariners. Making MSC
                careers easier since 2024.
              </p>
            </div>

            {/* Tools */}
            <div>
              <h4 className="font-semibold mb-4">Tools</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link
                    href="/tools/pay-calculator"
                    className="hover:text-white"
                  >
                    Pay Calculator
                  </Link>
                </li>
                <li>
                  <Link href="/tools/leave-chit" className="hover:text-white">
                    Leave Chit Generator
                  </Link>
                </li>
                <li>
                  <Link
                    href="/tools/travel-voucher"
                    className="hover:text-white"
                  >
                    Travel Voucher
                  </Link>
                </li>
                <li>
                  <Link href="/tools" className="hover:text-white">
                    All Tools
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link
                    href="https://civsail.com/blogs"
                    className="hover:text-white"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/ships" className="hover:text-white">
                    Ship Classes
                  </Link>
                </li>
                <li>
                  <Link href="/ports" className="hover:text-white">
                    Port Guides
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://civsail.com/products"
                    className="hover:text-white"
                  >
                    Shop
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/about" className="hover:text-white">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white">
                    Contact
                  </Link>
                </li>
                <li>
                  <a
                    href="mailto:support@civsail.com"
                    className="hover:text-white"
                  >
                    support@civsail.com
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 CIVSail.com. Built for mariners, by mariners.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
