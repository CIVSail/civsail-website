/**
 * @file SectorSelect.tsx
 * @description Reusable maritime sector dropdown component.
 *
 * @purpose Used in onboarding Screen A and in dashboard Settings so users can change
 *          their sector without re-doing onboarding. When sector changes, the dashboard
 *          must react immediately (MSC tools show/hide, welcome messaging updates).
 *
 * @note Sector drives feature gating throughout the platform. civmar unlocks MSC tools.
 *       See lib/constants/sectors.ts for the full enum and helpers.
 */
'use client';

import { SECTOR_OPTIONS, type Sector } from '@/lib/constants/sectors';

interface SectorSelectProps {
  value: string;
  onChange: (value: Sector) => void;
  disabled?: boolean;
  className?: string;
}

export default function SectorSelect({
  value,
  onChange,
  disabled = false,
  className = '',
}: SectorSelectProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as Sector)}
      disabled={disabled}
      className={`w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      <option value="">Select your sector...</option>
      {SECTOR_OPTIONS.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
