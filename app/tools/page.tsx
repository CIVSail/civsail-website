import Link from 'next/link';

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-blue-600 hover:text-blue-700">
                ← Back to Home
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-2xl font-bold text-gray-900">
                CIVSail Tools
              </h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Maritime Career Tools
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Calculate pay, generate forms, and manage your maritime career with
            tools built specifically for MSC CIVMARs.
          </p>
        </div>

        {/* MSC Tools Section */}
        <div className="mb-16">
          <h3 className="text-2xl font-semibold text-gray-900 mb-2">
            MSC Tools
          </h3>
          <p className="text-gray-600 mb-8">
            Essential tools for Military Sealift Command personnel
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Pay Calculator */}
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">💰</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">
                Ship Pay Calculator
              </h3>
              <p className="text-gray-600 mb-4">
                Calculate your ship pay including overtime, retention bonuses,
                and benefits. Compare different vessels and deployments.
              </p>
              <div className="space-y-2 mb-6">
                <div className="flex items-center text-sm text-gray-500">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Overtime calculations
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Retention bonus tracking
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Export to PDF
                </div>
              </div>
              <Link
                href="/tools/pay-calculator"
                className="inline-block w-full text-center bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Open Calculator
              </Link>
            </div>

            {/* Pay Comparison Tool */}
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">
                Pay Comparison Tool
              </h3>
              <p className="text-gray-600 mb-4">
                Compare pay across different ship classes, routes, and contract
                lengths to maximize your earnings.
              </p>
              <div className="space-y-2 mb-6">
                <div className="flex items-center text-sm text-gray-500">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Ship class comparison
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Route analysis
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Annual earnings projection
                </div>
              </div>
              <Link
                href="/tools/pay-comparison"
                className="inline-block w-full text-center bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Compare Pay
              </Link>
            </div>

            {/* Leave Chit Generator */}
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">📝</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">
                Leave Chit Generator
              </h3>
              <p className="text-gray-600 mb-4">
                Generate properly formatted annual and sick leave requests.
                Calculate leave balances and accrual rates.
              </p>
              <div className="space-y-2 mb-6">
                <div className="flex items-center text-sm text-gray-500">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                  Annual leave forms
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                  Sick leave tracking
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                  Balance calculations
                </div>
              </div>
              <Link
                href="/tools/leave-chit"
                className="inline-block w-full text-center bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Generate Form
              </Link>
            </div>

            {/* Travel Voucher */}
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">✈️</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">
                Travel Voucher (DD 1351-2)
              </h3>
              <p className="text-gray-600 mb-4">
                Auto-generate travel claims with proper receipts and
                documentation for faster reimbursement.
              </p>
              <div className="space-y-2 mb-6">
                <div className="flex items-center text-sm text-gray-500">
                  <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                  DD 1351-2 forms
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                  Receipt tracking
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                  Auto-calculations
                </div>
              </div>
              <Link
                href="/tools/travel-voucher"
                className="inline-block w-full text-center bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Generate Voucher
              </Link>
            </div>
          </div>
        </div>

        {/* Mariner Tools Section */}
        <div className="mb-16">
          <h3 className="text-2xl font-semibold text-gray-900 mb-2">
            Mariner Tools
          </h3>
          <p className="text-gray-600 mb-8">
            Professional development and career planning tools for all mariners
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Sea Service Calculator */}
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">⚓</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">
                Sea Service Calculator
              </h3>
              <p className="text-gray-600 mb-4">
                Track your sea time for license upgrades and calculate
                requirements for advancement.
              </p>
              <div className="space-y-2 mb-6">
                <div className="flex items-center text-sm text-gray-500">
                  <span className="w-2 h-2 bg-teal-500 rounded-full mr-2"></span>
                  Sea time tracking
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="w-2 h-2 bg-teal-500 rounded-full mr-2"></span>
                  License requirements
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="w-2 h-2 bg-teal-500 rounded-full mr-2"></span>
                  Upgrade planning
                </div>
              </div>
              <Link
                href="/tools/sea-service"
                className="inline-block w-full text-center bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Calculate Time
              </Link>
            </div>

            {/* Coming Soon - Credential Tracker */}
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow opacity-75">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🏆</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Credential Tracker</h3>
              <p className="text-gray-600 mb-4">
                Track MMC, medical, TWIC, and other credentials with automatic
                expiration alerts.
              </p>
              <div className="space-y-2 mb-6">
                <div className="flex items-center text-sm text-gray-500">
                  <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                  Document management
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                  Expiration alerts
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                  Renewal reminders
                </div>
              </div>
              <div className="inline-block w-full text-center bg-gray-400 text-white py-3 rounded-lg font-medium">
                Coming Soon
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 bg-slate-900 rounded-lg p-8 text-center text-white">
          <h3 className="text-2xl font-semibold mb-4">
            Need a tool that doesn't exist yet?
          </h3>
          <p className="text-gray-300 mb-6">
            We're constantly building new tools for the CIVMAR community. Let us
            know what would help your career.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
          >
            Request a Tool
          </Link>
        </div>
      </div>
    </div>
  );
}
