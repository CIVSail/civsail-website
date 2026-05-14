/**
 * @file app/(dashboard)/onboarding/page.tsx
 * @description Mandatory two-screen onboarding wizard. No skip.
 *
 * @purpose Collect the minimum information needed to:
 *          1. Create a working profile row (enables dashboard access)
 *          2. Determine which sector/tools are relevant to the user
 *          3. Kick off the NMC credential lookup in the background
 *
 * The goal is to get users into a personalized dashboard as quickly as possible,
 * ideally with their Coast Guard credentials already populating by the time
 * they first see it.
 *
 * Access: Authenticated users with no completed profile only.
 * The middleware redirects users who have already onboarded to /dashboard,
 * and unauthenticated users to /login.
 */
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import ScreenA, { type ScreenAData } from '@/components/onboarding/ScreenA';
import ScreenB, { type ScreenBData } from '@/components/onboarding/ScreenB';

type Screen = 'A' | 'B';

export default function OnboardingPage() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('A');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const router = useRouter();
  const supabase = createClient();

  // Screen A data: identity + sector
  const [screenAData, setScreenAData] = useState<ScreenAData>({
    first_name: '',
    last_name: '',
    sector: '',
    department: '',
    contracting_company: '',
  });

  // Screen B data: MMC + career track
  const [screenBData, setScreenBData] = useState<ScreenBData>({
    has_mmc: true,
    ref_number: '',
    career_track: '',
  });

  async function handleSubmit() {
    setLoading(true);
    setError('');

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login');
        return;
      }

      // Build the profile row
      const profileData = {
        user_id: user.id,
        email: user.email,
        first_name: screenAData.first_name.trim(),
        last_name: screenAData.last_name.trim(),
        // full_name kept for backwards compatibility with existing dashboard components
        full_name: `${screenAData.first_name.trim()} ${screenAData.last_name.trim()}`,
        sector: screenAData.sector,
        department: screenAData.department || null,
        contracting_company: screenAData.contracting_company.trim() || null,
        has_mmc: screenBData.has_mmc,
        ref_number: screenBData.has_mmc ? screenBData.ref_number.trim() : null,
        career_track: screenBData.has_mmc ? screenBData.career_track : null,
        // No MMC users get 'not_applicable'; MMC users start as 'not_started' then
        // get set to 'pending' immediately below after the NMC lookup fires
        nmc_verification_status: screenBData.has_mmc
          ? 'not_started'
          : 'not_applicable',
        onboarding_completed_at: new Date().toISOString(),
      };

      const { error: profileError } = await supabase
        .from('profiles')
        .upsert(profileData, { onConflict: 'user_id' });

      if (profileError) throw profileError;

      // If the user has an MMC, fire the NMC lookup immediately.
      // This creates a pending nmc_verifications row and kicks off credential fetching
      // so credentials may be populated by the time the user first sees their dashboard.
      if (screenBData.has_mmc && screenBData.ref_number.trim()) {
        try {
          const res = await fetch('/api/nmc-lookup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              refNumber: screenBData.ref_number.trim(),
              lastName: screenAData.last_name.trim(),
              verificationType: 'onboarding',
            }),
          });

          if (res.ok) {
            // Update status to 'pending' now that the lookup has been initiated
            await supabase
              .from('profiles')
              .update({ nmc_verification_status: 'pending' })
              .eq('user_id', user.id);
          } else {
            // Non-fatal — log but don't block the user from reaching their dashboard
            console.error(
              '[Onboarding] NMC lookup failed to initiate:',
              await res.text()
            );
          }
        } catch (nmcErr) {
          // Non-fatal — NMC lookup can be retried from the dashboard
          console.error('[Onboarding] NMC lookup error:', nmcErr);
        }
      }

      router.push('/dashboard');
    } catch (err: any) {
      console.error('[Onboarding] Submit error:', err);
      setError(err.message || 'Failed to save your profile. Please try again.');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50 py-12 px-4">
      <div className="max-w-lg mx-auto">
        {/* Logo */}
        <div className="text-center mb-10">
          <Image
            src="/CIVSail-Logo-Crop.png"
            alt="CIVSail"
            width={200}
            height={50}
            className="mx-auto mb-4"
          />
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome to CIVSail
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            Let&apos;s get you set up. This takes about 2 minutes.
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-4 mb-8">
          {(['A', 'B'] as Screen[]).map((screen, idx) => (
            <div key={screen} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                  currentScreen === screen
                    ? 'bg-blue-600 text-white'
                    : currentScreen === 'B' && screen === 'A'
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-500'
                }`}
              >
                {currentScreen === 'B' && screen === 'A' ? '✓' : idx + 1}
              </div>
              {idx < 1 && (
                <div
                  className={`w-12 h-1 mx-1 transition-colors ${
                    currentScreen === 'B' ? 'bg-green-500' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Screen card */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {currentScreen === 'A' && (
            <ScreenA
              data={screenAData}
              onChange={setScreenAData}
              onNext={() => {
                setError('');
                setCurrentScreen('B');
              }}
              error={error}
            />
          )}

          {currentScreen === 'B' && (
            <ScreenB
              data={screenBData}
              onChange={setScreenBData}
              onSubmit={handleSubmit}
              onBack={() => {
                setError('');
                setCurrentScreen('A');
              }}
              loading={loading}
              error={error}
            />
          )}
        </div>

        {/* Personal email reminder — important for account recovery */}
        <p className="text-xs text-gray-400 text-center mt-6 px-4">
          Using your personal email? Good. If you created your account with your
          ship email and lose access to it, you may have trouble resetting your
          password. You can add a ship email from your dashboard at any time.
        </p>
      </div>
    </div>
  );
}
