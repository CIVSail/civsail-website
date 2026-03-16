'use client';

import { useEffect, useRef, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [supabase] = useState(() => createClient());
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [mode, setMode] = useState<'request' | 'update'>('request');
  const [loading, setLoading] = useState(false);
  const [checkingLink, setCheckingLink] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const hasCheckedRecovery = useRef(false);

  useEffect(() => {
    const requestedEmail = searchParams.get('email');

    if (requestedEmail) {
      setEmail((currentEmail) => currentEmail || requestedEmail);
    }
  }, [searchParams]);

  useEffect(() => {
    let isMounted = true;

    const clearRecoveryParams = () => {
      const url = new URL(window.location.href);
      url.searchParams.delete('code');
      url.searchParams.delete('type');
      url.hash = '';
      const nextUrl = `${url.pathname}${url.search}`;
      window.history.replaceState({}, '', nextUrl);
    };

    const detectRecoveryLink = async () => {
      if (hasCheckedRecovery.current) {
        return;
      }

      hasCheckedRecovery.current = true;

      const hashParams = new URLSearchParams(
        window.location.hash.replace(/^#/, '')
      );
      const recoveryType = searchParams.get('type') ?? hashParams.get('type');
      const code = searchParams.get('code');
      const hasRecoveryToken = Boolean(hashParams.get('access_token'));
      const isRecoveryLink =
        recoveryType === 'recovery' || Boolean(code) || hasRecoveryToken;

      if (!isRecoveryLink) {
        if (isMounted) {
          setCheckingLink(false);
        }
        return;
      }

      try {
        if (code) {
          const { error: exchangeError } =
            await supabase.auth.exchangeCodeForSession(code);

          if (exchangeError) {
            throw exchangeError;
          }
        }

        if (!isMounted) {
          return;
        }

        setMode('update');
        setError('');
        setMessage('Enter a new password for your account.');
        clearRecoveryParams();
      } catch (recoveryError) {
        if (!isMounted) {
          return;
        }

        setMode('request');
        setError(
          getErrorMessage(
            recoveryError,
            'This password reset link is invalid or has expired. Request a new one below.'
          )
        );
        setMessage('');
      } finally {
        if (isMounted) {
          setCheckingLink(false);
        }
      }
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (!isMounted || event !== 'PASSWORD_RECOVERY') {
        return;
      }

      setMode('update');
      setError('');
      setMessage('Enter a new password for your account.');
      clearRecoveryParams();
      setCheckingLink(false);
    });

    detectRecoveryLink();

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [searchParams, supabase]);

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const redirectTo = `${window.location.origin}/reset-password`;
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email,
        {
          redirectTo,
        }
      );

      if (resetError) {
        throw resetError;
      }

      setMessage(
        `If an account exists for ${email}, we've sent a password reset link to that inbox.`
      );
    } catch (resetError) {
      setError(
        getErrorMessage(resetError, 'Failed to send password reset email.')
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password,
      });

      if (updateError) {
        throw updateError;
      }

      setMessage('Your password has been updated. Redirecting you now.');
      setPassword('');
      setConfirmPassword('');

      window.setTimeout(() => {
        router.push('/dashboard');
      }, 1200);
    } catch (updateError) {
      setError(getErrorMessage(updateError, 'Failed to update password.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-8">
          <Link href="/">
            <Image
              src="/CIVSail-Logo-Crop.png"
              alt="CIVSail"
              width={200}
              height={50}
              className="mx-auto mb-4"
            />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            {mode === 'update' ? 'Set a New Password' : 'Reset Your Password'}
          </h1>
          <p className="text-gray-600 mt-2">
            {mode === 'update'
              ? 'Choose a new password for your CIVSail account.'
              : 'Enter your email and we will send you a password reset link.'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {message && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-700">{message}</p>
          </div>
        )}

        {checkingLink ? (
          <div className="py-10 text-center text-sm text-gray-600">
            Checking your reset link...
          </div>
        ) : mode === 'update' ? (
          <form onSubmit={handlePasswordUpdate} className="space-y-6">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                New Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="At least 6 characters"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Re-enter your new password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 rounded-lg transition-colors"
            >
              {loading ? 'Updating Password...' : 'Update Password'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetRequest} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="your.email@example.com"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 rounded-lg transition-colors"
            >
              {loading ? 'Sending Reset Link...' : 'Send Reset Link'}
            </button>
          </form>
        )}

        <div className="mt-8 text-center">
          <Link
            href="/login"
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
