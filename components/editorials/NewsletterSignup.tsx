'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Mail, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface NewsletterSignupProps {
  source?: string;              // Track where signups come from
  variant?: 'inline' | 'card';  // Visual style
  className?: string;
}

type SubmitState = 'idle' | 'loading' | 'success' | 'error';

export function NewsletterSignup({
  source = 'editorial',
  variant = 'card',
  className = '',
}: NewsletterSignupProps) {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<SubmitState>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!email || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address');
      setState('error');
      return;
    }

    setState('loading');
    setErrorMessage('');

    try {
      const supabase = createClient();

      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert({ email: email.toLowerCase().trim(), source });

      if (error) {
        // Handle duplicate email gracefully (they're already subscribed)
        if (error.code === '23505') {
          setState('success');
          return;
        }
        throw error;
      }

      setState('success');
      setEmail('');
    } catch (err) {
      console.error('Newsletter signup error:', err);
      setErrorMessage('Something went wrong. Please try again.');
      setState('error');
    }
  };

  // Success state - show confirmation message
  if (state === 'success') {
    return (
      <div
        className={`flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-lg ${className}`}
      >
        <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0" />
        <p className="text-emerald-800 text-sm">
          You&apos;re subscribed! Watch your inbox for updates from CIVSail.
        </p>
      </div>
    );
  }

  // Card variant - more prominent, for end of posts
  if (variant === 'card') {
    return (
      <div className={`bg-slate-50 border border-slate-200 rounded-xl p-6 ${className}`}>
        {/* Header */}
        <div className="flex items-start gap-3 mb-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Mail className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">Stay in the Loop</h3>
            <p className="text-sm text-slate-600 mt-1">
              Get new editorials, tools, and mariner resources delivered to your inbox.
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="flex-1 px-4 py-2.5 border border-slate-300 rounded-lg 
                       focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                       placeholder:text-slate-400 text-slate-900"
            disabled={state === 'loading'}
            aria-label="Email address"
          />
          <button
            type="submit"
            disabled={state === 'loading'}
            className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg
                       hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-colors flex items-center justify-center gap-2"
          >
            {state === 'loading' ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Subscribing...
              </>
            ) : (
              'Subscribe'
            )}
          </button>
        </form>

        {/* Error message */}
        {state === 'error' && (
          <div className="flex items-center gap-2 mt-3 text-red-600 text-sm">
            <AlertCircle className="h-4 w-4" />
            {errorMessage}
          </div>
        )}

        {/* Privacy note */}
        <p className="text-xs text-slate-500 mt-3">
          No spam, unsubscribe anytime. We respect your inbox.
        </p>
      </div>
    );
  }

  // Inline variant - compact, for sidebars
  return (
    <form onSubmit={handleSubmit} className={`flex gap-2 ${className}`}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email"
        className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-lg
                   focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        disabled={state === 'loading'}
        aria-label="Email address"
      />
      <button
        type="submit"
        disabled={state === 'loading'}
        className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700
                   disabled:opacity-50 transition-colors"
      >
        {state === 'loading' ? '...' : 'Subscribe'}
      </button>
    </form>
  );
}