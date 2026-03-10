/**
 * @file ScreenA.tsx
 * @description Onboarding Screen A — Identity & Sector.
 *
 * @purpose Collects the minimum identity fields needed to create a working profile
 *          and determine which sector/tools are relevant to the user.
 *          The last_name field is critical for NMC lookup — it must be the user's
 *          legal name exactly as it appears on their MMC.
 *
 * @note Conditional fields animate in based on sector:
 *       - civmar → Department dropdown (required)
 *       - conmar → Contracting Company text field (optional)
 */
'use client';

import { useState } from 'react';
import SectorSelect from './SectorSelect';
import type { Sector } from '@/lib/constants/sectors';
import {
  SECTORS_WITH_DEPARTMENT,
  SECTORS_WITH_COMPANY,
} from '@/lib/constants/sectors';

export interface ScreenAData {
  first_name: string;
  last_name: string;
  sector: string;
  department: string;
  contracting_company: string;
}

interface ScreenAProps {
  data: ScreenAData;
  onChange: (data: ScreenAData) => void;
  onNext: () => void;
  error: string;
}

export default function ScreenA({
  data,
  onChange,
  onNext,
  error,
}: ScreenAProps) {
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const showDepartment = SECTORS_WITH_DEPARTMENT.includes(
    data.sector as Sector
  );
  const showCompany = SECTORS_WITH_COMPANY.includes(data.sector as Sector);

  function handleChange(field: keyof ScreenAData, value: string) {
    // When sector changes, clear the conditional fields
    if (field === 'sector') {
      onChange({
        ...data,
        sector: value,
        department: '',
        contracting_company: '',
      });
    } else {
      onChange({ ...data, [field]: value });
    }
  }

  function handleNext() {
    setTouched({
      first_name: true,
      last_name: true,
      sector: true,
      department: showDepartment,
    });

    if (!data.first_name.trim()) return;
    if (!data.last_name.trim()) return;
    if (!data.sector) return;
    if (showDepartment && !data.department) return;

    onNext();
  }

  const inputClass =
    'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Who are you?</h2>
        <p className="text-sm text-gray-500 mt-1">
          This helps us personalize your dashboard and start verifying your
          credentials.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* First Name */}
      <div>
        <label
          htmlFor="first_name"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          First Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="first_name"
          value={data.first_name}
          onChange={(e) => handleChange('first_name', e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, first_name: true }))}
          placeholder="John"
          className={`${inputClass} ${touched.first_name && !data.first_name.trim() ? 'border-red-400' : ''}`}
          autoComplete="given-name"
        />
        {touched.first_name && !data.first_name.trim() && (
          <p className="text-xs text-red-500 mt-1">First name is required.</p>
        )}
      </div>

      {/* Last Name */}
      <div>
        <label
          htmlFor="last_name"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Last Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="last_name"
          value={data.last_name}
          onChange={(e) => handleChange('last_name', e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, last_name: true }))}
          placeholder="Doe"
          className={`${inputClass} ${touched.last_name && !data.last_name.trim() ? 'border-red-400' : ''}`}
          autoComplete="family-name"
        />
        {/* Critical for NMC lookup — must be legal name */}
        <p className="text-xs text-gray-500 mt-1">
          Enter your legal last name as it appears on your MMC or government ID.
          This is used to verify your credentials with the Coast Guard.
        </p>
        {touched.last_name && !data.last_name.trim() && (
          <p className="text-xs text-red-500 mt-1">Last name is required.</p>
        )}
      </div>

      {/* Sector */}
      <div>
        <label
          htmlFor="sector"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Sector <span className="text-red-500">*</span>
        </label>
        <SectorSelect
          value={data.sector}
          onChange={(v) => handleChange('sector', v)}
        />
        {touched.sector && !data.sector && (
          <p className="text-xs text-red-500 mt-1">Please select a sector.</p>
        )}
      </div>

      {/* Department — animates in for civmar */}
      {showDepartment && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-200">
          <label
            htmlFor="department"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Department <span className="text-red-500">*</span>
          </label>
          <select
            id="department"
            value={data.department}
            onChange={(e) => handleChange('department', e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, department: true }))}
            className={`${inputClass} bg-white ${touched.department && showDepartment && !data.department ? 'border-red-400' : ''}`}
          >
            <option value="">Select department...</option>
            <option value="deck">Deck</option>
            <option value="engine">Engine</option>
            <option value="steward">Steward</option>
            <option value="other">Other</option>
          </select>
          {touched.department && showDepartment && !data.department && (
            <p className="text-xs text-red-500 mt-1">
              Department is required for MSC CIVMARs.
            </p>
          )}
        </div>
      )}

      {/* Contracting Company — animates in for conmar */}
      {showCompany && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-200">
          <label
            htmlFor="contracting_company"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Contracting Company{' '}
            <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <input
            type="text"
            id="contracting_company"
            value={data.contracting_company}
            onChange={(e) =>
              handleChange('contracting_company', e.target.value)
            }
            placeholder="e.g., Crowley Maritime, Maersk"
            className={inputClass}
          />
        </div>
      )}

      {/* Next */}
      <div className="pt-2">
        <button
          type="button"
          onClick={handleNext}
          className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
