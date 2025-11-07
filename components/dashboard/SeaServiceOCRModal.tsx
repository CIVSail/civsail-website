// components/dashboard/SeaServiceOCRModal.tsx
'use client';

import { X } from 'lucide-react';

interface ServicePeriod {
  id?: string;
  vessel_name: string;
  sign_on_date: string | null;
  sign_off_date: string | null;
  days_served: number | null;
  position_held: string;
  isDuplicate?: boolean;
  validationFlags: Array<{
    type: string;
    field: string;
    message: string;
    code?: string;
  }>;
}

interface OCRResult {
  success: boolean;
  servicePeriods: {
    extracted: number;
    inserted: number;
    duplicates: number;
  };
  periods: ServicePeriod[];
  needsReview: boolean;
  error?: string;
}

interface SeaServiceOCRModalProps {
  result: OCRResult;
  onClose: () => void;
  onConfirm: () => void;
}

export default function SeaServiceOCRModal({
  result,
  onClose,
  onConfirm,
}: SeaServiceOCRModalProps) {
  
  if (!result.success) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-2">
              <span className="text-3xl">❌</span>
              <h2 className="text-xl font-bold text-gray-900">OCR Failed</h2>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <p className="text-gray-700 mb-4">{result.error}</p>
          
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-3xl">✅</span>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Document Processed
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Found {result.servicePeriods.extracted} service period
                  {result.servicePeriods.extracted !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Summary */}
          <div className="mt-4 flex items-center space-x-4 text-sm">
            {result.servicePeriods.inserted > 0 && (
              <div className="flex items-center space-x-2 text-green-700">
                <span className="text-lg">➕</span>
                <span className="font-medium">
                  {result.servicePeriods.inserted} new period
                  {result.servicePeriods.inserted !== 1 ? 's' : ''} added
                </span>
              </div>
            )}
            {result.servicePeriods.duplicates > 0 && (
              <div className="flex items-center space-x-2 text-amber-700">
                <span className="text-lg">⏭️</span>
                <span className="font-medium">
                  {result.servicePeriods.duplicates} duplicate
                  {result.servicePeriods.duplicates !== 1 ? 's' : ''} skipped
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {result.periods.map((period, index) => (
            <ServicePeriodCard key={index} period={period} index={index} />
          ))}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6 rounded-b-2xl">
          <button
            onClick={onConfirm}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            {result.servicePeriods.inserted > 0 
              ? `Got it! ${result.servicePeriods.inserted} period${result.servicePeriods.inserted !== 1 ? 's' : ''} saved`
              : 'Close'
            }
          </button>
        </div>
      </div>
    </div>
  );
}

// Component to display one service period
function ServicePeriodCard({ period, index }: { period: ServicePeriod; index: number }) {
  const hasErrors = period.validationFlags.some(f => f.type === 'error');
  const hasWarnings = period.validationFlags.some(f => f.type === 'warning');

  return (
    <div className={`border rounded-lg p-4 ${
      period.isDuplicate 
        ? 'bg-amber-50 border-amber-200' 
        : hasErrors
        ? 'bg-red-50 border-red-200'
        : 'bg-green-50 border-green-200'
    }`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">
            {period.isDuplicate ? '⏭️' : hasErrors ? '⚠️' : '✅'}
          </span>
          <div>
            <h3 className="font-bold text-gray-900">
              Period {index + 1}: {period.vessel_name}
            </h3>
            <p className="text-sm text-gray-600">
              {period.position_held}
            </p>
          </div>
        </div>
        {period.isDuplicate && (
          <span className="px-2 py-1 bg-amber-100 text-amber-800 text-xs font-medium rounded">
            Already on File
          </span>
        )}
      </div>

      {/* Dates and Days */}
      <div className="grid grid-cols-3 gap-3 mb-3">
        <div>
          <p className="text-xs text-gray-500">Sign On</p>
          <p className="font-medium text-gray-900">
            {period.sign_on_date 
              ? new Date(period.sign_on_date).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric' 
                })
              : 'Unknown'
            }
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Sign Off</p>
          <p className="font-medium text-gray-900">
            {period.sign_off_date 
              ? new Date(period.sign_off_date).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric' 
                })
              : 'Unknown'
            }
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Days Served</p>
          <p className="font-bold text-gray-900 text-lg">
            {period.days_served || '?'}
          </p>
        </div>
      </div>

      {/* Validation Flags */}
      {period.validationFlags.length > 0 && (
        <div className="space-y-2 mt-3 pt-3 border-t border-gray-200">
          {period.validationFlags.map((flag, i) => (
            <div
              key={i}
              className={`flex items-start space-x-2 text-sm ${
                flag.type === 'error'
                  ? 'text-red-700'
                  : flag.type === 'warning'
                  ? 'text-amber-700'
                  : 'text-blue-700'
              }`}
            >
              <span className="mt-0.5">
                {flag.type === 'error' ? '❌' : flag.type === 'warning' ? '⚠️' : 'ℹ️'}
              </span>
              <span>{flag.message}</span>
            </div>
          ))}
        </div>
      )}

      {/* Status message */}
      {period.isDuplicate && (
        <p className="mt-3 text-sm text-amber-700">
          This service period was already in your records. We skipped it to prevent double-counting.
        </p>
      )}
    </div>
  );
}