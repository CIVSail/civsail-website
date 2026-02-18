'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Anchor, ArrowLeft, RefreshCw } from 'lucide-react';

/**
 * Global error boundary - catches runtime errors in any route segment.
 * Displays a user-friendly message with options to retry or navigate away.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Runtime error:', error);
  }, [error]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        {/* Icon */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-red-100 rounded-full">
            <Anchor className="w-12 h-12 text-red-600" />
          </div>
        </div>

        {/* Message */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Something went wrong
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          We hit an unexpected problem. Try refreshing, or head back to familiar
          waters.
        </p>

        {/* Actions */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
            Try Again
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-white border border-gray-200 hover:border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </Link>
        </div>

        {/* Help text */}
        <p className="text-sm text-gray-400">
          If this keeps happening,{' '}
          <a
            href="mailto:support@civsail.com"
            className="text-blue-600 hover:underline"
          >
            let us know
          </a>
        </p>
      </div>
    </div>
  );
}
