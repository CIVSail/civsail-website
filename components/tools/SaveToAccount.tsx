'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

interface SaveToAccountProps {
  formData: Record<string, unknown>;
  storageFolder: string;
  formLabel: string;
  generatePdf?: () => Promise<Blob | Uint8Array>;
}

export default function SaveToAccount({
  formData,
  storageFolder,
  formLabel,
  generatePdf,
}: SaveToAccountProps) {
  const [user, setUser] = useState<{
    id: string;
    email?: string | null;
  } | null>(null);
  const [userLoading, setUserLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [authTab, setAuthTab] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);

  const supabase = createClient();
  const pendingKey = `pending_save_${storageFolder}`;

  useEffect(() => {
    async function checkAuth() {
      const {
        data: { user: u },
      } = await supabase.auth.getUser();
      setUser(u);
      setUserLoading(false);
    }
    checkAuth();
  }, [supabase]);

  useEffect(() => {
    if (!user) return;
    const pending = localStorage.getItem(pendingKey);
    if (pending) {
      localStorage.removeItem(pendingKey);
    }
  }, [user, pendingKey]);

  const performSave = async (userId: string) => {
    setSaving(true);
    try {
      if (!generatePdf) {
        alert('No PDF generator provided.');
        return;
      }

      const pdfBytes = await generatePdf();
      const blob = pdfBytes instanceof Blob ? pdfBytes : new Blob([pdfBytes as BlobPart], { type: 'application/pdf' });

      const timestamp = Date.now();
      const fileName = `${formLabel.toLowerCase().replace(/\s+/g, '-')}-${timestamp}.pdf`;
      const path = `${storageFolder}/${userId}/${fileName}`;
      const file = new File([blob], fileName, { type: 'application/pdf' });

      const { error } = await supabase.storage
        .from('documents')
        .upload(path, file, { upsert: true });

      if (error) throw error;

      const { data: signedData } = await supabase.storage
        .from('documents')
        .createSignedUrl(path, 31536000);

      if (signedData?.signedUrl) {
        window.open(signedData.signedUrl, '_blank');
      }
      setSaved(true);
    } catch (err) {
      console.error('Failed to save form:', err);
      alert('Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleButtonClick = () => {
    if (user) {
      performSave(user.id);
    } else {
      setShowAuth(true);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      if (data.session && data.user) {
        setUser(data.user);
        setShowAuth(false);
        await performSave(data.user.id);
      }
    } catch (err: unknown) {
      setAuthError(
        err instanceof Error ? err.message : 'Failed to sign in'
      );
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    if (password !== confirmPassword) {
      setAuthError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setAuthError('Password must be at least 6 characters');
      return;
    }

    setAuthLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/tools/${storageFolder === 'leave-chits' ? 'leave-chit' : 'travel-claim'}`,
        },
      });
      if (error) throw error;

      if (data.user && !data.session) {
        localStorage.setItem(pendingKey, JSON.stringify(formData));
        setSignupSuccess(true);
      } else if (data.session && data.user) {
        setUser(data.user);
        setShowAuth(false);
        await performSave(data.user.id);
      }
    } catch (err: unknown) {
      setAuthError(
        err instanceof Error ? err.message : 'Failed to create account'
      );
    } finally {
      setAuthLoading(false);
    }
  };

  const closeAuth = () => {
    setShowAuth(false);
    setAuthError('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setAuthTab('login');
    setSignupSuccess(false);
  };

  if (userLoading) return null;

  if (saved) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-4">
        <p className="text-sm text-green-700 font-medium">
          {formLabel} saved to your account.
        </p>
      </div>
    );
  }

  return (
    <>
      <button
        onClick={handleButtonClick}
        disabled={saving}
        className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-all"
      >
        {saving ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Saving...
          </>
        ) : (
          <span>Save {formLabel} to My Account</span>
        )}
      </button>

      {showAuth && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div
            className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeAuth}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl leading-none p-1"
              aria-label="Close"
            >
              &times;
            </button>

            {signupSuccess ? (
              <>
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Check Your Email
                </h2>
                <p className="text-gray-600 text-sm">
                  We sent a confirmation link to <strong>{email}</strong>.
                  Click the link to verify your account. Your form data
                  will be saved to your account once you sign in.
                </p>
                <button
                  onClick={closeAuth}
                  className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors"
                >
                  Got it
                </button>
              </>
            ) : (
              <>
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Save to My Account
                </h2>

                <div className="flex border-b border-gray-200 mb-6">
                  <button
                    onClick={() => setAuthTab('login')}
                    className={`pb-3 px-4 text-sm font-medium border-b-2 transition-colors ${authTab === 'login' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => setAuthTab('signup')}
                    className={`pb-3 px-4 text-sm font-medium border-b-2 transition-colors ${authTab === 'signup' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                  >
                    Create Account
                  </button>
                </div>

                {authError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                    {authError}
                  </div>
                )}

                {authTab === 'login' ? (
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <label
                        htmlFor="modal-email"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Email
                      </label>
                      <input
                        id="modal-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoComplete="email"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="modal-password"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Password
                      </label>
                      <input
                        id="modal-password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        autoComplete="current-password"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={authLoading}
                      className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2.5 rounded-lg transition-colors"
                    >
                      {authLoading ? 'Signing In...' : 'Sign In'}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleSignup} className="space-y-4">
                    <div>
                      <label
                        htmlFor="modal-signup-email"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Email
                      </label>
                      <input
                        id="modal-signup-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoComplete="email"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="modal-signup-password"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Password
                      </label>
                      <input
                        id="modal-signup-password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        autoComplete="new-password"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="modal-signup-confirm"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Confirm Password
                      </label>
                      <input
                        id="modal-signup-confirm"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        autoComplete="new-password"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={authLoading}
                      className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2.5 rounded-lg transition-colors"
                    >
                      {authLoading
                        ? 'Creating Account...'
                        : 'Create Account'}
                    </button>
                  </form>
                )}

                <p className="text-center text-xs text-gray-500 mt-4">
                  Your form will be saved after signing in.
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
