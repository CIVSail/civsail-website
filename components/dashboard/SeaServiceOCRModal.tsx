/**
 * SeaServiceOCRModal.tsx
 * Modal that displays results after OCR processing of sea service letters
 * Shows: extracted periods, duplicates, and any errors/warnings
 */

'use client';

import { X, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

interface OCRResult {
  success: boolean;
  servicePeriods: {
    extracted: number;
    inserted: number;
    duplicates: number;
  };
  periods: Array<{
    vessel_name: string;
    sign_on_date: string;
    sign_off_date: string;
    position_held: string;
    days_served: number | null;
    gross_tonnage: number | null;
    propulsion_type: string | null;
    department: string | null;
    route: string | null;
    needs_manual_review: boolean;
    isDuplicate: boolean;
    error?: string;
  }>;
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
  const { success, servicePeriods, periods, needsReview, error } = result;

  // Determine overall status
  const getStatusIcon = () => {
    if (!success || error) {
      return <XCircle className="w-12 h-12 text-red-500" />;
    }
    if (needsReview || servicePeriods.duplicates > 0) {
      return <AlertTriangle className="w-12 h-12 text-amber-500" />;
    }
    return <CheckCircle className="w-12 h-12 text-green-500" />;
  };

  const getStatusMessage = () => {
    if (!success || error) {
      return 'Processing Failed';
    }
    if (servicePeriods.inserted === 0 && servicePeriods.duplicates > 0) {
      return 'All Periods Already Exist';
    }
    if (servicePeriods.inserted > 0 && servicePeriods.duplicates > 0) {
      return 'Partially Successful';
    }
    if (servicePeriods.inserted > 0) {
      return 'Successfully Processed';
    }
    return 'No Service Periods Found';
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">OCR Processing Results</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Status Icon & Message */}
          <div className="text-center mb-6">
            <div className="flex justify-center mb-4">{getStatusIcon()}</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {getStatusMessage()}
            </h3>

            {/* Stats Summary */}
            {success && !error && (
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <p className="text-3xl font-bold text-blue-600">
                    {servicePeriods.extracted}
                  </p>
                  <p className="text-sm text-gray-600">Extracted</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <p className="text-3xl font-bold text-green-600">
                    {servicePeriods.inserted}
                  </p>
                  <p className="text-sm text-gray-600">Added</p>
                </div>
                <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                  <p className="text-3xl font-bold text-amber-600">
                    {servicePeriods.duplicates}
                  </p>
                  <p className="text-sm text-gray-600">Duplicates</p>
                </div>
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-start space-x-3">
                <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-red-900 mb-1">Error</h4>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Review Warning */}
          {needsReview && !error && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-amber-900 mb-1">
                    Manual Review Needed
                  </h4>
                  <p className="text-sm text-amber-700">
                    Some data could not be extracted with high confidence.
                    Please review and verify the details in your Sea Service
                    tab.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Extracted Periods */}
          {periods.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 text-lg">
                Service Periods
              </h4>
              {periods.map((period, index) => (
                <div
                  key={index}
                  className={`border rounded-lg p-4 ${
                    period.error
                      ? 'bg-red-50 border-red-200'
                      : period.isDuplicate
                      ? 'bg-amber-50 border-amber-200'
                      : period.needs_manual_review
                      ? 'bg-blue-50 border-blue-200'
                      : 'bg-green-50 border-green-200'
                  }`}
                >
                  {/* Period Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h5 className="font-bold text-gray-900">
                        {period.vessel_name}
                      </h5>
                      <p className="text-sm text-gray-600">
                        {period.position_held}
                      </p>
                    </div>
                    <div className="text-right">
                      {period.error && (
                        <span className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded-full">
                          Error
                        </span>
                      )}
                      {period.isDuplicate && !period.error && (
                        <span className="text-xs px-2 py-1 bg-amber-100 text-amber-700 rounded-full">
                          Duplicate
                        </span>
                      )}
                      {period.needs_manual_review &&
                        !period.isDuplicate &&
                        !period.error && (
                          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                            Needs Review
                          </span>
                        )}
                      {!period.error &&
                        !period.isDuplicate &&
                        !period.needs_manual_review && (
                          <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                            Added
                          </span>
                        )}
                    </div>
                  </div>

                  {/* Period Details */}
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-500 text-xs">Sign On</p>
                      <p className="font-medium text-gray-900">
                        {new Date(period.sign_on_date).toLocaleDateString(
                          'en-US',
                          {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          }
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Sign Off</p>
                      <p className="font-medium text-gray-900">
                        {new Date(period.sign_off_date).toLocaleDateString(
                          'en-US',
                          {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          }
                        )}
                      </p>
                    </div>
                    {period.days_served !== null && (
                      <div>
                        <p className="text-gray-500 text-xs">Days Served</p>
                        <p className="font-medium text-gray-900">
                          {period.days_served}
                        </p>
                      </div>
                    )}
                    {period.gross_tonnage !== null && (
                      <div>
                        <p className="text-gray-500 text-xs">Tonnage</p>
                        <p className="font-medium text-gray-900">
                          {period.gross_tonnage} GT
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Additional Details */}
                  <div className="mt-3 pt-3 border-t border-gray-200 flex flex-wrap gap-2">
                    {period.department && (
                      <span className="text-xs px-2 py-1 bg-white text-gray-700 rounded border border-gray-300">
                        {period.department}
                      </span>
                    )}
                    {period.route && (
                      <span className="text-xs px-2 py-1 bg-white text-gray-700 rounded border border-gray-300">
                        {period.route}
                      </span>
                    )}
                    {period.propulsion_type && (
                      <span className="text-xs px-2 py-1 bg-white text-gray-700 rounded border border-gray-300">
                        {period.propulsion_type}
                      </span>
                    )}
                  </div>

                  {/* Error Message for Period */}
                  {period.error && (
                    <div className="mt-3 text-sm text-red-700">
                      ⚠️ {period.error}
                    </div>
                  )}

                  {/* Duplicate Message */}
                  {period.isDuplicate && (
                    <div className="mt-3 text-sm text-amber-700">
                      ℹ️ This period already exists in your records
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Close
            </button>
            <button
              onClick={onConfirm}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              View Sea Service
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}