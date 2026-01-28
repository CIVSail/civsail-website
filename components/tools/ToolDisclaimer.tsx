'use client';

import { useState } from 'react';
import {
  AlertTriangle,
  MessageSquare,
  Send,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

export default function ToolDisclaimer() {
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: 'bug',
    message: '',
    email: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit feedback');
      }

      setSubmitted(true);
      setFormData({ type: 'bug', message: '', email: '' });

      setTimeout(() => {
        setSubmitted(false);
        setShowForm(false);
      }, 3000);
    } catch (err) {
      setError('Something went wrong. Please try again.');
      console.error('Feedback submission error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-12 space-y-6">
      <div className="p-6 bg-amber-50 border-2 border-amber-200 rounded-xl">
        <div className="flex items-start gap-4">
          <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-lg font-semibold text-amber-900 mb-2">
              Disclaimer
            </h3>
            <p className="text-amber-800 text-sm leading-relaxed">
              This tool is provided for{' '}
              <span className="font-medium">
                informational and planning purposes only
              </span>
              . Always verify calculations with official sources and your HR or
              payroll department. Results are estimates based on publicly
              available information and may not reflect your specific situation,
              contract terms, or current rates. This tool is not legally binding
              and CIVSail assumes no liability for decisions made based on these
              calculations.
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 bg-gray-50 border border-gray-200 rounded-xl">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <MessageSquare className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                Feedback and Issues
              </h3>
              <p className="text-gray-600 text-sm">
                Found a bug? Have a feature request? Let us know so we can
                improve.
              </p>
            </div>
          </div>
          {!showForm && !submitted && (
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors text-sm font-medium"
            >
              Give Feedback
            </button>
          )}
        </div>

        {submitted && (
          <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            <p className="text-emerald-700">
              Thanks for your feedback! We will look into it.
            </p>
          </div>
        )}

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {showForm && !submitted && (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What type of feedback?
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'bug' })}
                  className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                    formData.type === 'bug'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Bug Report
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'feature' })}
                  className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                    formData.type === 'feature'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Feature Request
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'data' })}
                  className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                    formData.type === 'data'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Data Issue
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'other' })}
                  className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                    formData.type === 'other'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Other
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Describe the issue or suggestion
              </label>
              <textarea
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                placeholder="Tell us what you found or what you would like to see..."
                rows={4}
                required
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email (optional - if you want a response)
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="your@email.com"
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                <Send className="w-4 h-4" />
                {loading ? 'Sending...' : 'Submit Feedback'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
