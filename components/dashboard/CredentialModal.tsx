// components/dashboard/CredentialModal.tsx
'use client';

import { X } from 'lucide-react';
import {
  getCredentialDisplayInfo,
  getDepartmentIcon,
  getDepartmentName,
  getQualificationBadgeColor,
  getQualificationLevelName,
} from '@/lib/utils/credential-display';

interface Credential {
  id: string;
  endorsement_name: string;
  name: string;
  short_name: string;
  credential_type: string;
  endorsement_system: 'national' | 'stcw';
  department: string;
  rank: number;
  qualification_level: string;
  raw_nmc_text: string;
  issue_date?: string;
  expiration_date?: string;
  verified_by_nmc: boolean;
  created_at: string;
}

interface CredentialModalProps {
  credential: Credential;
  onClose: () => void;
}

export default function CredentialModal({ credential, onClose }: CredentialModalProps) {
  // Get display info
  const displayInfo = getCredentialDisplayInfo(
    credential.raw_nmc_text || credential.endorsement_name,
    credential.short_name || credential.endorsement_name
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-start justify-between rounded-t-2xl">
          <div className="flex items-start space-x-3">
            <span className="text-3xl">{displayInfo.icon}</span>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {displayInfo.colloquialName}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {credential.endorsement_system === 'national' ? '⚓ National' : '🌍 STCW'} • {getDepartmentName(credential.department)}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Description */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-2">
              What This Means
            </h3>
            <p className="text-gray-900 leading-relaxed">
              {displayInfo.description}
            </p>
          </div>

          {/* Official NMC Text */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-2">
              Official NMC Endorsement
            </h3>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p className="text-gray-900 font-mono text-sm">
                {credential.raw_nmc_text || credential.endorsement_name}
              </p>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Credential Type */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-2">
                Type
              </h3>
              <p className="text-gray-900 capitalize">
                {credential.credential_type.replace('_', ' ')}
              </p>
            </div>

            {/* System */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-2">
                System
              </h3>
              <p className="text-gray-900 capitalize">
                {credential.endorsement_system === 'national' ? 'US National' : 'STCW International'}
              </p>
            </div>

            {/* Rank (if National) */}
            {credential.endorsement_system === 'national' && credential.rank > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-2">
                  Rank
                </h3>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold text-blue-600">
                    {credential.rank}
                  </span>
                  <span className="text-gray-500 text-sm">
                    (1 = Entry, 10 = Senior)
                  </span>
                </div>
              </div>
            )}

            {/* Qualification Level */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-2">
                Level
              </h3>
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getQualificationBadgeColor(credential.qualification_level)}`}
              >
                {getQualificationLevelName(credential.qualification_level)}
              </span>
            </div>

            {/* Issue Date */}
            {credential.issue_date && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-2">
                  Issue Date
                </h3>
                <p className="text-gray-900">
                  {new Date(credential.issue_date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            )}

            {/* Expiration Date */}
            {credential.expiration_date && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-2">
                  Expiration Date
                </h3>
                <p className="text-gray-900">
                  {new Date(credential.expiration_date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            )}
          </div>

          {/* Verification Status */}
          {credential.verified_by_nmc && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <span className="text-green-600 text-xl">✓</span>
                <div>
                  <p className="font-semibold text-green-900">Verified by NMC</p>
                  <p className="text-sm text-green-700">
                    Confirmed on {new Date(credential.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6 rounded-b-2xl">
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}