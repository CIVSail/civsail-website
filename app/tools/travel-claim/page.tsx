// app/tools/travel-claim/page.tsx
import { FileText, Clock, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Travel Claim Generator | CIVSail Tools',
  description: 'Create DD1351-2 travel voucher forms automatically.',
};

export default function TravelClaimPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-600 to-purple-800 text-white">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
              <FileText className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Travel Claim Generator</h1>
              <p className="text-purple-100">Create DD1351-2 forms automatically</p>
            </div>
          </div>
        </div>
      </div>

      {/* Coming Soon Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Coming Soon Banner */}
          <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border-b border-amber-200 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="bg-amber-100 p-2 rounded-lg">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h2 className="font-semibold text-amber-900">Coming Soon</h2>
                <p className="text-sm text-amber-700">This tool is being migrated to the new platform</p>
              </div>
            </div>
          </div>

          {/* Preview of Features */}
          <div className="p-6 lg:p-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">What you&apos;ll be able to do:</h3>
            
            <ul className="space-y-3 mb-8">
              {[
                'Enter personal and travel authorization details',
                'Add multiple travel legs with transportation modes',
                'Include lodging, meals, and incidental expenses',
                'Track GTCC purchases vs. out-of-pocket expenses',
                'Generate a completed DD1351-2 PDF ready for submission',
              ].map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-sm font-medium">{index + 1}</span>
                  </div>
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>

            {/* CTA to current tool */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-2">Need this tool now?</h4>
              <p className="text-gray-600 text-sm mb-4">
                The Travel Claim Generator is still available on our current site while we complete the migration.
              </p>
              <a
                href="https://civsail.com/pages/travel-claim-generator"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-purple-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-purple-700 transition-colors"
              >
                Open Current Generator
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}