import Link from 'next/link';
import { Home, Ship, Anchor, Map, ArrowLeft } from 'lucide-react';

/**
 * Custom 404 page - shown when a route doesn't exist
 * Next.js App Router automatically uses this for all 404s
 */
export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        {/* Icon */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-blue-100 rounded-full">
            <Anchor className="w-12 h-12 text-blue-600" />
          </div>
        </div>

        {/* Message */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Page Not Found
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Looks like this page has drifted off course. 
          Let's get you back to charted waters.
        </p>

        {/* Primary CTA */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors mb-12"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </Link>

        {/* Quick Links */}
        <div className="border-t border-gray-200 pt-8">
          <p className="text-sm text-gray-500 mb-4">Or navigate to:</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/maritime-101/what-is-merchant-marine"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:border-blue-300 hover:text-blue-600 transition-colors"
            >
              <Home className="w-4 h-4" />
              Maritime 101
            </Link>
            <Link
              href="/ships/msc"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:border-blue-300 hover:text-blue-600 transition-colors"
            >
              <Ship className="w-4 h-4" />
              MSC Ships
            </Link>
            <Link
              href="/ports"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:border-blue-300 hover:text-blue-600 transition-colors"
            >
              <Map className="w-4 h-4" />
              Ports
            </Link>
            <Link
              href="/tools"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:border-blue-300 hover:text-blue-600 transition-colors"
            >
              <Anchor className="w-4 h-4" />
              Tools
            </Link>
          </div>
        </div>

        {/* Help text */}
        <p className="mt-12 text-sm text-gray-400">
          Think this page should exist?{' '}
          <a 
            href="mailto:alec.schenning@civsail.com" 
            className="text-blue-600 hover:underline"
          >
            Let us know
          </a>
        </p>
      </div>
    </div>
  );
}