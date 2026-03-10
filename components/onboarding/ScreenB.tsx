/**
 * @file ScreenB.tsx
 * @description Onboarding Screen B — Credentials & Career Track.
 *
 * @purpose Collects the MMC reference number as early as possible so the backend
 *          can start the NMC credential lookup while the user finishes setup.
 *          The career track field resolves the entry-level credential ambiguity —
 *          an OS/Wiper/Food Handler endorsement doesn't tell us which department
 *          someone intends to pursue, so the user must self-declare.
 *
 * @note The "Not yet" path (has_mmc = false) skips ref_number and career_track entirely
 *       and shows an encouraging message. These users get a full dashboard with empty
 *       states and helpful guidance.
 *
 * @note "Not Sure Yet" career track means the user HAS an MMC but doesn't know their
 *       path. This is different from "Not yet" (no MMC at all).
 */
'use client';

import { useState } from 'react';
import CareerTrackSelect from './CareerTrackSelect';

export interface ScreenBData {
  has_mmc: boolean;
  ref_number: string;
  career_track: string;
}

interface ScreenBProps {
  data: ScreenBData;
  onChange: (data: ScreenBData) => void;
  onSubmit: () => void;
  onBack: () => void;
  loading: boolean;
  error: string;
}

export default function ScreenB({
  data,
  onChange,
  onSubmit,
  onBack,
  loading,
  error,
}: ScreenBProps) {
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  function handleChange(field: keyof ScreenBData, value: string | boolean) {
    if (field === 'has_mmc') {
      // When toggling MMC off, clear those fields
      onChange({
        has_mmc: value as boolean,
        ref_number: '',
        career_track: '',
      });
    } else {
      onChange({ ...data, [field]: value });
    }
  }

  function handleSubmit() {
    setTouched({
      ref_number: data.has_mmc,
      career_track: data.has_mmc,
    });

    if (data.has_mmc) {
      if (!data.ref_number.trim()) return;
      if (!data.career_track) return;
    }

    onSubmit();
  }

  const inputClass =
    'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">
          Do you have an MMC?
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Your Merchant Mariner Credential reference number lets us
          automatically pull your Coast Guard credentials.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* MMC Toggle */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => handleChange('has_mmc', true)}
          className={`flex-1 py-3 px-4 rounded-lg border-2 font-medium transition-colors ${
            data.has_mmc
              ? 'border-blue-600 bg-blue-50 text-blue-700'
              : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
          }`}
        >
          Yes, I have an MMC
        </button>
        <button
          type="button"
          onClick={() => handleChange('has_mmc', false)}
          className={`flex-1 py-3 px-4 rounded-lg border-2 font-medium transition-colors ${
            !data.has_mmc
              ? 'border-blue-600 bg-blue-50 text-blue-700'
              : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
          }`}
        >
          Not yet
        </button>
      </div>

      {/* No MMC — encouraging message */}
      {!data.has_mmc && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg animate-in fade-in duration-200">
          <p className="text-sm text-blue-900">
            <span className="font-semibold">No problem.</span> You can add your
            MMC details anytime from your dashboard once you receive your
            credential. Your account is fully set up — we'll have helpful
            guidance waiting for you.
          </p>
        </div>
      )}

      {/* MMC fields — only shown when has_mmc = true */}
      {data.has_mmc && (
        <div className="space-y-5 animate-in fade-in duration-200">
          {/* Reference Number */}
          <div>
            <label
              htmlFor="ref_number"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              MMC Reference Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="ref_number"
              value={data.ref_number}
              onChange={(e) => handleChange('ref_number', e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, ref_number: true }))}
              placeholder="e.g., 1234567"
              className={`${inputClass} ${
                touched.ref_number && !data.ref_number.trim()
                  ? 'border-red-400'
                  : ''
              }`}
              autoComplete="off"
            />
            <p className="text-xs text-gray-500 mt-1">
              This is the reference number on your Merchant Mariner Credential.
              We'll use it to automatically verify your credentials with the
              Coast Guard.
            </p>
            {touched.ref_number && !data.ref_number.trim() && (
              <p className="text-xs text-red-500 mt-1">
                Reference number is required.
              </p>
            )}
          </div>

          {/* Career Track */}
          <div>
            <label
              htmlFor="career_track"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Career Track <span className="text-red-500">*</span>
            </label>
            <CareerTrackSelect
              value={data.career_track}
              onChange={(v) => handleChange('career_track', v)}
            />
            <p className="text-xs text-gray-500 mt-1">
              Entry-level credentials (OS, Wiper, Food Handler) apply to all
              departments. Your career track tells us which path you're on so we
              can personalize your experience.
            </p>
            {touched.career_track && !data.career_track && (
              <p className="text-xs text-red-500 mt-1">
                Please select your career track.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onBack}
          disabled={loading}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="flex-1 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {loading ? 'Setting up your account...' : 'Go to My Dashboard'}
        </button>
      </div>
    </div>
  );
}
