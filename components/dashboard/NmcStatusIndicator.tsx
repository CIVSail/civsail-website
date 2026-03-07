/**
 * @file NmcStatusIndicator.tsx
 * @description Shows the current NMC credential verification status in the dashboard.
 *
 * @purpose Gives users real-time feedback on whether their Coast Guard credentials
 *          have been verified, are still pending, or encountered a problem.
 *          Eliminates the "why is my credentials tab empty?" question.
 *
 * States handled:
 *   pending         — Lookup in progress; polling nmc_verifications table
 *   verified        — Credentials populated successfully
 *   verified_needs_review — Dates from NMC differ from what user entered; needs review
 *   timeout         — 48-hour window passed without a response; user can retry
 *   not_started     — User has an MMC ref number but hasn't triggered lookup yet
 *   not_applicable  — User has no MMC; safe to show empty state guidance instead
 */
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

interface NmcStatusIndicatorProps {
  userId: string;
  initialStatus: string | null;
  refNumber: string | null;
  lastName: string | null;
  onVerified?: () => void; // Called when verification completes so parent can refresh credentials
}

export default function NmcStatusIndicator({
  userId,
  initialStatus,
  refNumber,
  lastName,
  onVerified,
}: NmcStatusIndicatorProps) {
  const [status, setStatus] = useState(initialStatus);
  const supabase = createClient();

  // Subscribe to real-time updates on the nmc_verifications table for this user.
  // When the cron job completes the lookup, this fires and the UI updates without
  // requiring a page reload.
  useEffect(() => {
    if (status !== 'pending') return;

    const channel = supabase
      .channel(`nmc_verification_${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const newStatus = payload.new?.nmc_verification_status;
          if (newStatus && newStatus !== status) {
            setStatus(newStatus);
            if (
              newStatus === 'verified' ||
              newStatus === 'verified_needs_review'
            ) {
              onVerified?.();
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, status]);

  async function handleRetry() {
    if (!refNumber) return;

    const res = await fetch('/api/nmc-lookup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        refNumber,
        lastName,
        verificationType: 're-verification',
      }),
    });

    if (res.ok) {
      setStatus('pending');
    }
  }

  if (status === 'not_applicable' || !status) return null;

  if (status === 'pending') {
    return (
      <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl mb-4">
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-medium text-blue-900">
            Verifying your credentials with the National Maritime Center...
          </p>
          <p className="text-xs text-blue-700 mt-1">
            This usually takes a few minutes. Your endorsements will appear here
            automatically when complete — no need to refresh.
          </p>
        </div>
      </div>
    );
  }

  if (status === 'verified') {
    return (
      <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl mb-4">
        <span className="text-green-600 text-xl shrink-0">✓</span>
        <p className="text-sm font-medium text-green-900">
          Your credentials have been verified with the National Maritime Center.
        </p>
      </div>
    );
  }

  if (status === 'verified_needs_review') {
    return (
      <div className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-xl mb-4">
        <span className="text-yellow-600 text-xl shrink-0">⚠</span>
        <div>
          <p className="text-sm font-medium text-yellow-900">
            Credentials verified — but some dates differ from what you entered.
          </p>
          <p className="text-xs text-yellow-700 mt-1">
            Check the Credentials tab to review the discrepancies and confirm
            which dates are correct.
          </p>
        </div>
      </div>
    );
  }

  if (status === 'timeout') {
    return (
      <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl mb-4">
        <span className="text-red-500 text-xl shrink-0">!</span>
        <div>
          <p className="text-sm font-medium text-red-900">
            We couldn&apos;t verify credentials for reference number{' '}
            <span className="font-mono">{refNumber}</span>.
          </p>
          <p className="text-xs text-red-700 mt-1 mb-3">
            This is usually a mismatch between the reference number or last name
            and what&apos;s on file with the NMC. Double-check that your last
            name matches your MMC exactly.
          </p>
          {refNumber && (
            <button
              onClick={handleRetry}
              className="text-xs px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Retry Verification
            </button>
          )}
        </div>
      </div>
    );
  }

  if (status === 'not_started') {
    return (
      <div className="flex items-start gap-3 p-4 bg-gray-50 border border-gray-200 rounded-xl mb-4">
        <span className="text-gray-400 text-xl shrink-0">○</span>
        <div>
          <p className="text-sm font-medium text-gray-700">
            NMC verification not yet started.
          </p>
          {refNumber && (
            <button
              onClick={handleRetry}
              className="text-xs mt-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Start Verification
            </button>
          )}
        </div>
      </div>
    );
  }

  return null;
}
