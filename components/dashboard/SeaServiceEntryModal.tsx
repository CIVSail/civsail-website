// components/dashboard/SeaServiceEntryModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import type {
  SeaServiceFormData,
  SeaServicePeriod,
  ValidationError,
  OverlapCheck,
} from '@/types/sea-service';
import {
  COMMON_POSITIONS,
  COMMON_VESSEL_TYPES,
  FLAG_STATES,
} from '@/types/sea-service';

interface SeaServiceEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  mode: 'review' | 'manual'; // Review OCR results or manual entry
  initialData?: Partial<SeaServicePeriod>; // Pre-filled from OCR or for editing
  sourcePath?: string; // Storage path of uploaded document
}

export default function SeaServiceEntryModal({
  isOpen,
  onClose,
  onSave,
  mode,
  initialData,
  sourcePath,
}: SeaServiceEntryModalProps) {
  const supabase = createClient();

  // Form state
  const [formData, setFormData] = useState<SeaServiceFormData>(
    getInitialFormData()
  );
  const [showOptionalFields, setShowOptionalFields] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>(
    []
  );
  const [overlapWarning, setOverlapWarning] = useState<OverlapCheck | null>(
    null
  );
  const [saving, setSaving] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [userHistory, setUserHistory] = useState<{
    vessels: string[];
    companies: string[];
  }>({
    vessels: [],
    companies: [],
  });

  // Load user history for autocomplete
  useEffect(() => {
    if (isOpen) {
      loadUserHistory();
    }
  }, [isOpen]);

  // Update form when initialData changes (FIXED VERSION)
  useEffect(() => {
    if (initialData) {
      setFormData((prev) => ({
        ...prev,
        // Explicitly map fields from SeaServicePeriod to SeaServiceFormData
        vessel_name: initialData.vessel_name || '',
        sign_on_date: initialData.sign_on_date || '',
        sign_off_date: initialData.sign_off_date || '',
        position_held: initialData.position_held || '',
        department: initialData.department || null, // Database values are lowercase
        grt: initialData.grt?.toString() || '',
        route: initialData.route || null, // Database values are lowercase with underscores
        propulsion: initialData.propulsion_type || null, // Note: DB column is propulsion_type
        watchkeeping_days: initialData.watchkeeping_days?.toString() || '0',
        supervised: initialData.supervised || false,
        officer_on_watch: initialData.officer_on_watch || false,
        // Optional fields
        imo_number: initialData.imo_number || '',
        vessel_type: initialData.vessel_type || '',
        flag_state: initialData.flag_state || '',
        company: initialData.company || '',
        dp_days: initialData.dp_days?.toString() || '0',
        cadet_service: initialData.cadet_service || false,
        port_sign_on: initialData.port_sign_on || '',
        port_sign_off: initialData.port_sign_off || '',
        notes: initialData.notes || '',
        // Preserve id if editing
        id: initialData.id,
      }));
    }
  }, [initialData]);

  // Validate on data change
  useEffect(() => {
    validateForm();
  }, [
    formData.sign_on_date,
    formData.sign_off_date,
    formData.watchkeeping_days,
    formData.grt,
  ]);

  // Check for overlaps when dates change
  useEffect(() => {
    if (formData.sign_on_date && formData.sign_off_date) {
      checkOverlaps();
    }
  }, [formData.sign_on_date, formData.sign_off_date]);

  function getInitialFormData(): SeaServiceFormData {
    return {
      vessel_name: '',
      sign_on_date: '',
      sign_off_date: '',
      position_held: '',
      department: null, // Start with no selection - user must choose
      grt: '',
      route: null, // Start with no selection - user must choose
      propulsion: null, // Start with no selection - user must choose
      watchkeeping_days: '0',
      supervised: false,
      officer_on_watch: false,
      imo_number: '',
      vessel_type: '',
      flag_state: '',
      company: '',
      dp_days: '0',
      cadet_service: false,
      port_sign_on: '',
      port_sign_off: '',
      notes: '',
    };
  }

  async function loadUserHistory() {
    try {
      setLoadingHistory(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('sea_service')
        .select('vessel_name, company')
        .eq('user_id', user.id)
        .order('sign_on_date', { ascending: false })
        .limit(20);

      if (error) {
        console.error('Error loading history:', error);
        return;
      }

      // Extract unique vessels and companies
      const vessels = [
        ...new Set(data?.map((d) => d.vessel_name).filter(Boolean) || []),
      ];
      const companies = [
        ...new Set(data?.map((d) => d.company).filter(Boolean) || []),
      ];

      setUserHistory({ vessels, companies });
    } finally {
      setLoadingHistory(false);
    }
  }

  async function checkOverlaps() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase.rpc('check_sea_service_overlap', {
      p_user_id: user.id,
      p_sign_on: formData.sign_on_date,
      p_sign_off: formData.sign_off_date,
      p_exclude_id: formData.id || null,
    });

    if (error) {
      console.error('Overlap check error:', error);
      return;
    }

    if (data && data[0]) {
      setOverlapWarning(data[0] as OverlapCheck);
    } else {
      setOverlapWarning(null);
    }
  }

  function validateForm(): boolean {
    const errors: ValidationError[] = [];

    // Required field checks
    if (!formData.vessel_name.trim()) {
      errors.push({
        field: 'vessel_name',
        message:
          'Vessel name is required. Coast Guard will reject without this.',
        type: 'error',
        code: 'MISSING_VESSEL_NAME',
      });
    }

    if (!formData.sign_on_date) {
      errors.push({
        field: 'sign_on_date',
        message: 'Sign-on date is required.',
        type: 'error',
        code: 'MISSING_SIGN_ON',
      });
    }

    if (!formData.sign_off_date) {
      errors.push({
        field: 'sign_off_date',
        message: 'Sign-off date is required.',
        type: 'error',
        code: 'MISSING_SIGN_OFF',
      });
    }

    // Date logic validation
    if (formData.sign_on_date && formData.sign_off_date) {
      const signOn = new Date(formData.sign_on_date);
      const signOff = new Date(formData.sign_off_date);

      if (signOff < signOn) {
        errors.push({
          field: 'sign_off_date',
          message: 'Sign-off date must be on or after sign-on date.',
          type: 'error',
          code: 'INVALID_DATE_RANGE',
        });
      }

      const daysServed =
        Math.floor(
          (signOff.getTime() - signOn.getTime()) / (1000 * 60 * 60 * 24)
        ) + 1;
      const watchkeepingDays =
        parseInt(formData.watchkeeping_days as string) || 0;

      if (watchkeepingDays > daysServed) {
        errors.push({
          field: 'watchkeeping_days',
          message: `Watchkeeping days (${watchkeepingDays}) cannot exceed days served (${daysServed}).`,
          type: 'error',
          code: 'WATCHKEEPING_EXCEEDS_DAYS',
        });
      }
    }

    // GRT validation
    const grt = parseInt(formData.grt as string);
    if (!grt || grt <= 0) {
      errors.push({
        field: 'grt',
        message: 'Gross tonnage must be greater than 0.',
        type: 'error',
        code: 'INVALID_GRT',
      });
    } else if (grt > 500000) {
      errors.push({
        field: 'grt',
        message: 'GRT seems unusually high. Please verify.',
        type: 'warning',
        code: 'SUSPICIOUS_GRT',
      });
    }

    // Department/watchkeeping sanity check
    // Both Deck (OICNW) and Engine (OICEW) departments stand watches
    if (
      formData.department === 'steward' &&
      parseInt(formData.watchkeeping_days as string) > 0
    ) {
      errors.push({
        field: 'watchkeeping_days',
        message:
          'Steward department typically does not stand watches. Please verify this is correct.',
        type: 'warning',
        code: 'WATCHKEEPING_STEWARD',
      });
    }

    setValidationErrors(errors);
    return errors.filter((e) => e.type === 'error').length === 0;
  }

  function updateField<K extends keyof SeaServiceFormData>(
    field: K,
    value: SeaServiceFormData[K]
  ) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  // Helper for select elements with constrained values
  function handleSelectChange<K extends keyof SeaServiceFormData>(
    field: K,
    value: string
  ) {
    // Convert empty string to null for optional select fields
    const finalValue = value === '' ? null : value;
    setFormData((prev) => ({
      ...prev,
      [field]: finalValue as SeaServiceFormData[K],
    }));
  }

  function handleCopyPrevious() {
    if (userHistory.vessels.length === 0) return;

    // Find the most recent period (already in history from loadUserHistory)
    supabase
      .from('sea_service')
      .select('*')
      .order('sign_on_date', { ascending: false })
      .limit(1)
      .single()
      .then(({ data, error }) => {
        if (error || !data) return;

        setFormData((prev) => ({
          ...prev,
          vessel_name: data.vessel_name,
          grt: data.grt?.toString() || prev.grt,
          route: data.route || prev.route,
          propulsion: data.propulsion || prev.propulsion,
          vessel_type: data.vessel_type || prev.vessel_type,
          flag_state: data.flag_state || prev.flag_state,
          company: data.company || prev.company,
        }));
      });
  }

  async function handleSave() {
    if (!validateForm()) {
      return;
    }

    setSaving(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Not authenticated');
      }

      // Calculate days served (for display/validation only - DB will compute actual value)
      const signOn = new Date(formData.sign_on_date);
      const signOff = new Date(formData.sign_off_date);
      const daysServedCalculated =
        Math.floor(
          (signOff.getTime() - signOn.getTime()) / (1000 * 60 * 60 * 24)
        ) + 1;

      // Parse GRT for calculations
      const grtValue = parseInt(formData.grt as string) || 0;

      // Determine tonnage category
      let tonnageCategory = 'under_200';
      if (grtValue >= 1600) tonnageCategory = 'over_1600';
      else if (grtValue >= 500) tonnageCategory = '500_to_1600';
      else if (grtValue >= 200) tonnageCategory = '200_to_500';

      // Determine if counts toward unlimited (typically 1600+ GRT)
      const countsTowardUnlimited = grtValue >= 1600;

      // Prepare data for database
      const dbData = {
        user_id: user.id,
        vessel_name: formData.vessel_name.trim(),
        sign_on_date: formData.sign_on_date,
        sign_off_date: formData.sign_off_date,
        // REMOVED: days_served - database computes this automatically from dates
        position_held: formData.position_held.trim(),
        department: formData.department,
        grt: grtValue,
        gross_tonnage: grtValue, // Also populate for backwards compatibility
        tonnage_category: tonnageCategory,
        counts_toward_unlimited: countsTowardUnlimited,
        route: formData.route,
        propulsion_type: formData.propulsion || null,
        watchkeeping_days: parseInt(formData.watchkeeping_days as string) || 0,
        supervised: formData.supervised,
        officer_on_watch: formData.officer_on_watch,
        imo_number: formData.imo_number.trim() || null,
        vessel_type: formData.vessel_type.trim() || null,
        flag_state: formData.flag_state.trim() || null,
        company: formData.company.trim() || null,
        dp_days: parseInt(formData.dp_days as string) || 0,
        cadet_service: formData.cadet_service,
        port_sign_on: formData.port_sign_on.trim() || null,
        port_sign_off: formData.port_sign_off.trim() || null,
        notes: formData.notes.trim() || null,
        source_doc_path: sourcePath || null,
        ocr_confidence:
          initialData?.ocr_confidence || (mode === 'manual' ? 1.0 : undefined),
        needs_manual_review: validationErrors.some((e) => e.type === 'warning'),
        verified: mode === 'manual',
        is_creditable: true,
      };

      let result;
      if (formData.id) {
        // Update existing
        result = await supabase
          .from('sea_service')
          .update(dbData)
          .eq('id', formData.id);
      } else {
        // Insert new
        result = await supabase.from('sea_service').insert([dbData]);
      }

      if (result.error) {
        console.error('Supabase error details:', {
          message: result.error.message,
          details: result.error.details,
          hint: result.error.hint,
          code: result.error.code,
        });
        throw result.error;
      }

      onSave();
      onClose();
    } catch (error: any) {
      console.error('Save error:', error);
      console.error('Error details:', {
        message: error?.message,
        details: error?.details,
        hint: error?.hint,
        code: error?.code,
      });
      alert(
        `Failed to save sea service period: ${
          error?.message || 'Unknown error'
        }. Please try again.`
      );
    } finally {
      setSaving(false);
    }
  }

  if (!isOpen) return null;

  // Calculate computed fields for display
  const signOn = formData.sign_on_date ? new Date(formData.sign_on_date) : null;
  const signOff = formData.sign_off_date
    ? new Date(formData.sign_off_date)
    : null;
  const daysServed =
    signOn && signOff
      ? Math.floor(
          (signOff.getTime() - signOn.getTime()) / (1000 * 60 * 60 * 24)
        ) + 1
      : 0;
  const watchkeepingPercent =
    daysServed > 0
      ? (
          ((parseInt(formData.watchkeeping_days as string) || 0) / daysServed) *
          100
        ).toFixed(1)
      : '0';
  const grt = parseInt(formData.grt as string) || 0;
  const tonnageBucket = grt >= 1600 ? '≥1600 GRT' : '<1600 GRT';
  const hasErrors =
    validationErrors.filter((e) => e.type === 'error').length > 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">
                {mode === 'review'
                  ? '📋 Review Sea Service'
                  : '✏️ Add Sea Service Period'}
              </h2>
              <p className="text-blue-100 text-sm mt-1">
                {mode === 'review'
                  ? 'Verify the extracted data and make any necessary corrections'
                  : 'Enter your sea service details manually'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6">
          {/* Validation Warnings Banner */}
          {validationErrors.length > 0 && (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <span className="text-amber-600 text-xl">⚠️</span>
                <div className="flex-1">
                  <h4 className="font-semibold text-amber-900 mb-2">
                    {hasErrors ? 'Please fix these issues:' : 'Warnings:'}
                  </h4>
                  <ul className="space-y-1">
                    {validationErrors.map((error, idx) => (
                      <li
                        key={idx}
                        className={`text-sm ${
                          error.type === 'error'
                            ? 'text-red-700'
                            : 'text-amber-700'
                        }`}
                      >
                        {error.type === 'error' ? '❌' : '⚠️'} {error.message}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Overlap Warning */}
          {overlapWarning?.has_overlap && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-300 rounded-lg">
              <div className="flex items-start space-x-3">
                <span className="text-yellow-600 text-xl">⚠️</span>
                <div>
                  <h4 className="font-semibold text-yellow-900">
                    Overlapping Service Detected
                  </h4>
                  <p className="text-sm text-yellow-800 mt-1">
                    This period overlaps with service on{' '}
                    <strong>{overlapWarning.overlapping_vessel}</strong>. Please
                    verify dates.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          {mode === 'manual' && userHistory.vessels.length > 0 && (
            <div className="mb-6">
              <button
                onClick={handleCopyPrevious}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors"
              >
                📋 Copy vessel details from last entry
              </button>
            </div>
          )}

          {/* Required Fields Section */}
          <div className="space-y-4 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
              Required Information
            </h3>

            {/* Vessel Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vessel Name *
              </label>
              <input
                type="text"
                value={formData.vessel_name}
                onChange={(e) => updateField('vessel_name', e.target.value)}
                list="vessel-history"
                placeholder="e.g., USNS John Lewis, M/V Ocean Victory"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  validationErrors.find((e) => e.field === 'vessel_name')
                    ? 'border-red-300 bg-red-50'
                    : 'border-gray-300'
                }`}
              />
              <datalist id="vessel-history">
                {userHistory.vessels.map((v) => (
                  <option key={v} value={v} />
                ))}
              </datalist>
            </div>

            {/* Dates Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sign On Date *
                </label>
                <input
                  type="date"
                  value={formData.sign_on_date}
                  onChange={(e) => updateField('sign_on_date', e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    validationErrors.find((e) => e.field === 'sign_on_date')
                      ? 'border-red-300 bg-red-50'
                      : 'border-gray-300'
                  }`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sign Off Date *
                </label>
                <input
                  type="date"
                  value={formData.sign_off_date}
                  onChange={(e) => updateField('sign_off_date', e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    validationErrors.find((e) => e.field === 'sign_off_date')
                      ? 'border-red-300 bg-red-50'
                      : 'border-gray-300'
                  }`}
                />
              </div>
            </div>

            {/* Position */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Position Held *
              </label>
              <input
                type="text"
                value={formData.position_held}
                onChange={(e) => updateField('position_held', e.target.value)}
                list="position-options"
                placeholder="e.g., Third Mate, AB, QMED"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <datalist id="position-options">
                {COMMON_POSITIONS.map((p) => (
                  <option key={p} value={p} />
                ))}
              </datalist>
            </div>

            {/* Department and GRT Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department *
                </label>
                <select
                  value={formData.department || ''}
                  onChange={(e) =>
                    handleSelectChange('department', e.target.value)
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Department...</option>
                  <option value="deck">Deck</option>
                  <option value="engine">Engine</option>
                  <option value="steward">Steward</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Which department did you serve in?
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gross Tonnage (GRT) *
                </label>
                <input
                  type="number"
                  value={formData.grt}
                  onChange={(e) => updateField('grt', e.target.value)}
                  min="1"
                  placeholder="e.g., 49000"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    validationErrors.find((e) => e.field === 'grt')
                      ? 'border-red-300 bg-red-50'
                      : 'border-gray-300'
                  }`}
                />
              </div>
            </div>

            {/* Route and Propulsion Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Route *
                </label>
                <select
                  value={formData.route || ''}
                  onChange={(e) => handleSelectChange('route', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Route...</option>
                  <option value="oceans">Oceans</option>
                  <option value="near_coastal">Near Coastal</option>
                  <option value="great_lakes">Great Lakes</option>
                  <option value="inland">Inland</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Propulsion *
                </label>
                <select
                  value={formData.propulsion || ''}
                  onChange={(e) =>
                    handleSelectChange('propulsion', e.target.value)
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Propulsion...</option>
                  <option value="motor">Motor (Diesel)</option>
                  <option value="steam">Steam</option>
                  <option value="gas_turbine">Gas Turbine</option>
                  <option value="sail">Sail</option>
                </select>
              </div>
            </div>

            {/* Watchkeeping Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Watchkeeping Days
                  <span className="text-gray-500 text-xs ml-1">
                    (max: {daysServed})
                  </span>
                </label>
                <input
                  type="number"
                  value={formData.watchkeeping_days}
                  onChange={(e) =>
                    updateField('watchkeeping_days', e.target.value)
                  }
                  min="0"
                  max={daysServed}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    validationErrors.find(
                      (e) => e.field === 'watchkeeping_days'
                    )
                      ? 'border-red-300 bg-red-50'
                      : 'border-gray-300'
                  }`}
                />
              </div>
              <div className="md:col-span-1 flex items-end">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.supervised}
                    onChange={(e) =>
                      updateField('supervised', e.target.checked)
                    }
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Supervised
                  </span>
                </label>
              </div>
              <div className="md:col-span-1 flex items-end">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.officer_on_watch}
                    onChange={(e) =>
                      updateField('officer_on_watch', e.target.checked)
                    }
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Officer on Watch
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Optional Fields Section */}
          <div className="mb-6">
            <button
              onClick={() => setShowOptionalFields(!showOptionalFields)}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-medium mb-4"
            >
              <span>{showOptionalFields ? '▼' : '▶'}</span>
              <span>More Fields (Optional)</span>
            </button>

            {showOptionalFields && (
              <div className="space-y-4 pl-4 border-l-2 border-gray-200">
                {/* IMO and Vessel Type */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      IMO Number
                    </label>
                    <input
                      type="text"
                      value={formData.imo_number}
                      onChange={(e) =>
                        updateField('imo_number', e.target.value)
                      }
                      placeholder="e.g., 9891234"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Vessel Type
                    </label>
                    <input
                      type="text"
                      value={formData.vessel_type}
                      onChange={(e) =>
                        updateField('vessel_type', e.target.value)
                      }
                      list="vessel-type-options"
                      placeholder="e.g., Tanker, Container"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <datalist id="vessel-type-options">
                      {COMMON_VESSEL_TYPES.map((vt) => (
                        <option key={vt} value={vt} />
                      ))}
                    </datalist>
                  </div>
                </div>

                {/* Flag State and Company */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Flag State
                    </label>
                    <input
                      type="text"
                      value={formData.flag_state}
                      onChange={(e) =>
                        updateField('flag_state', e.target.value)
                      }
                      list="flag-options"
                      placeholder="e.g., United States"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <datalist id="flag-options">
                      {FLAG_STATES.map((fs) => (
                        <option key={fs} value={fs} />
                      ))}
                    </datalist>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company / Operator
                    </label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => updateField('company', e.target.value)}
                      list="company-history"
                      placeholder="e.g., MSC, Maersk"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <datalist id="company-history">
                      {userHistory.companies.map((c) => (
                        <option key={c} value={c} />
                      ))}
                    </datalist>
                  </div>
                </div>

                {/* Ports */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Port of Sign On
                    </label>
                    <input
                      type="text"
                      value={formData.port_sign_on}
                      onChange={(e) =>
                        updateField('port_sign_on', e.target.value)
                      }
                      placeholder="e.g., Norfolk, VA"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Port of Sign Off
                    </label>
                    <input
                      type="text"
                      value={formData.port_sign_off}
                      onChange={(e) =>
                        updateField('port_sign_off', e.target.value)
                      }
                      placeholder="e.g., San Diego, CA"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* DP Days */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    DP (Dynamic Positioning) Days
                  </label>
                  <input
                    type="number"
                    value={formData.dp_days}
                    onChange={(e) => updateField('dp_days', e.target.value)}
                    min="0"
                    max={daysServed}
                    className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Cadet Service */}
                <div>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.cadet_service}
                      onChange={(e) =>
                        updateField('cadet_service', e.target.checked)
                      }
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Cadet / Training Service
                    </span>
                  </label>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes / Remarks
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => updateField('notes', e.target.value)}
                    rows={3}
                    placeholder="e.g., Bridge watch 8-12/20-24, Relief Chief Mate"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Computed Fields Panel */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 mb-6 border border-blue-200">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
              <span className="text-blue-600 mr-2">📊</span>
              Computed Values
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-gray-600">Days Served</p>
                <p className="text-lg font-bold text-gray-900">{daysServed}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Watchkeeping %</p>
                <p className="text-lg font-bold text-gray-900">
                  {watchkeepingPercent}%
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Tonnage Bucket</p>
                <p className="text-sm font-medium text-gray-900">
                  {tonnageBucket}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Recency</p>
                <p className="text-sm font-medium text-gray-900">
                  {signOff &&
                  new Date().getFullYear() - signOff.getFullYear() <= 7
                    ? '✅ Valid'
                    : '❌ Outside 7yr'}
                </p>
              </div>
            </div>

            {/* Contribution Summary */}
            <div className="mt-3 pt-3 border-t border-blue-200">
              <p className="text-xs text-gray-600 mb-1">
                This entry contributes to:
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-white text-blue-700 text-xs rounded border border-blue-300">
                  Total {formData.department} Days
                </span>
                {grt >= 1600 && (
                  <span className="px-2 py-1 bg-white text-blue-700 text-xs rounded border border-blue-300">
                    ≥1600 GRT Days
                  </span>
                )}
                {signOff &&
                  new Date().getFullYear() - signOff.getFullYear() <= 7 && (
                    <span className="px-2 py-1 bg-white text-green-700 text-xs rounded border border-green-300">
                      Recency (90-in-7)
                    </span>
                  )}
                {parseInt(formData.watchkeeping_days as string) > 0 && (
                  <span className="px-2 py-1 bg-white text-purple-700 text-xs rounded border border-purple-300">
                    Watchkeeping Days
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Evidence Panel (if from OCR) */}
          {mode === 'review' && sourcePath && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                <span className="text-gray-600 mr-2">📎</span>
                Source Document
              </h4>
              <p className="text-sm text-gray-600">
                Extracted from:{' '}
                <code className="text-xs bg-gray-200 px-2 py-1 rounded">
                  {sourcePath.split('/').pop()}
                </code>
              </p>
              {initialData?.ocr_confidence && (
                <div className="mt-2">
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      initialData.ocr_confidence >= 0.9
                        ? 'bg-green-100 text-green-800'
                        : initialData.ocr_confidence >= 0.7
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    Confidence: {(initialData.ocr_confidence * 100).toFixed(0)}%
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6 rounded-b-2xl flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>

          <div className="flex items-center space-x-4">
            {hasErrors && (
              <span className="text-sm text-red-600 font-medium">
                ⚠️ Fix errors to save
              </span>
            )}
            <button
              onClick={handleSave}
              disabled={hasErrors || saving}
              className={`px-8 py-3 rounded-lg font-semibold transition-colors ${
                hasErrors || saving
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {saving
                ? 'Saving...'
                : formData.id
                ? 'Update Period'
                : 'Save Period'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
