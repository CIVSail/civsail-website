// app/tools/leave-chit/page.tsx
import { ClipboardList, Clock, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Leave Chit Generator | CIVSail Tools',
  description: 'Generate properly formatted leave request forms for MSC.',
};

export default function LeaveChitPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-br from-amber-500 to-amber-700 text-white">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
              <ClipboardList className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Leave Chit Generator</h1>
              <p className="text-amber-100">Create leave requests quickly</p>
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
                'Select leave type (annual, sick, LWOP, etc.)',
                'Enter your personal and assignment details',
                'Specify leave dates and return information',
                'Add emergency contact information',
                'Generate and download a properly formatted PDF',
              ].map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0 mt-0.5">
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
                The Leave Chit Generator is still available on our current site while we complete the migration.
              </p>
              <a
                href="https://civsail.com/pages/leave-chit-generator"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-amber-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-amber-700 transition-colors"
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