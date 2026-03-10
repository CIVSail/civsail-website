/**
 * @file CareerTrackSelect.tsx
 * @description Reusable career track dropdown component.
 *
 * @purpose Career track is the "intent" layer that NMC data alone can't provide.
 *          Entry-level credentials (OS, Wiper, Food Handler) exist in all departments,
 *          so we need the user to self-declare their intended path.
 *
 * @note This component is used in onboarding Screen B (when has_mmc = true).
 *       It could also be used in dashboard Settings to allow track changes.
 */
'use client';

import {
  CAREER_TRACK_OPTIONS,
  type CareerTrack,
} from '@/lib/constants/career-tracks';

interface CareerTrackSelectProps {
  value: string;
  onChange: (value: CareerTrack) => void;
  disabled?: boolean;
  className?: string;
}

export default function CareerTrackSelect({
  value,
  onChange,
  disabled = false,
  className = '',
}: CareerTrackSelectProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as CareerTrack)}
      disabled={disabled}
      className={`w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      <option value="">Select your career track...</option>
      {CAREER_TRACK_OPTIONS.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
