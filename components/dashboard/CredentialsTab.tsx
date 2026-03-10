// components/dashboard/CredentialsTab.tsx
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import CredentialModal from './CredentialModal';
import {
  getCredentialDisplayInfo,
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

interface CredentialsTabProps {
  userId: string;
  nmcVerifiedAt?: string | null;
  hasMmc?: boolean;
  refNumber?: string | null;
  lastName?: string | null;
}

export default function CredentialsTab({
  userId,
  nmcVerifiedAt,
  hasMmc = false,
  refNumber,
  lastName,
}: CredentialsTabProps) {
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCredential, setSelectedCredential] =
    useState<Credential | null>(null);
  const [reverifyStatus, setReverifyStatus] = useState<
    'idle' | 'checking' | 'done' | 'no_change'
  >('idle');
  const [reverifyMessage, setReverifyMessage] = useState('');
  // Track credential IDs present before the re-verify so we can highlight new ones after
  const [preReverifyIds, setPreReverifyIds] = useState<Set<string>>(new Set());
  const supabase = createClient();

  useEffect(() => {
    loadCredentials();
  }, [userId]);

  async function loadCredentials() {
    const { data, error } = await supabase
      .from('credentials')
      .select('*')
      .eq('user_id', userId)
      .order('rank', { ascending: false })
      .order('endorsement_name', { ascending: true });

    if (error) {
      console.error('Error loading credentials:', error);
    } else {
      setCredentials(data || []);
    }
    setLoading(false);
  }

  async function handleReverify() {
    if (!refNumber) return;

    // Capture current credential IDs so we can highlight new ones after the lookup
    setPreReverifyIds(new Set(credentials.map((c) => c.id)));
    setReverifyStatus('checking');
    setReverifyMessage('');

    const res = await fetch('/api/nmc-lookup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        refNumber,
        lastName,
        verificationType: 're-verification',
      }),
    });

    if (!res.ok) {
      setReverifyStatus('idle');
      setReverifyMessage('Failed to start verification. Please try again.');
      return;
    }

    // Poll for completion — check the nmc_verifications status
    pollForCompletion(userId);
  }

  async function pollForCompletion(userId: string) {
    const maxAttempts = 60; // 5 minutes at 5-second intervals
    let attempts = 0;

    const interval = setInterval(async () => {
      attempts++;

      const { data: profile } = await supabase
        .from('profiles')
        .select('nmc_verification_status, nmc_verified_at')
        .eq('user_id', userId)
        .single();

      if (!profile) {
        clearInterval(interval);
        setReverifyStatus('idle');
        return;
      }

      if (
        profile.nmc_verification_status === 'verified' ||
        profile.nmc_verification_status === 'verified_needs_review'
      ) {
        clearInterval(interval);

        // Reload credentials to find new ones
        const { data: newCreds } = await supabase
          .from('credentials')
          .select('*')
          .eq('user_id', userId)
          .order('rank', { ascending: false });

        const newCredList = newCreds || [];
        const newIds = new Set(newCredList.map((c: Credential) => c.id));

        // Find credentials that weren't in the pre-reverify set
        const newlyAdded = newCredList.filter(
          (c: Credential) => !preReverifyIds.has(c.id)
        );

        setCredentials(newCredList);
        setReverifyStatus('done');

        if (newlyAdded.length > 0) {
          setReverifyMessage(
            `${newlyAdded.length} new credential${newlyAdded.length > 1 ? 's' : ''} detected: ${newlyAdded.map((c: Credential) => c.short_name || c.endorsement_name).join(', ')}`
          );
        } else if (profile.nmc_verified_at) {
          setReverifyMessage('Your credentials are up to date and verified.');
        }

        return;
      }

      if (profile.nmc_verification_status === 'timeout') {
        clearInterval(interval);
        setReverifyStatus('idle');
        setReverifyMessage(
          'Verification timed out. Please check your reference number and try again.'
        );
        return;
      }

      if (attempts >= maxAttempts) {
        clearInterval(interval);
        setReverifyStatus('checking'); // Leave it showing so user knows it's still in progress
        setReverifyMessage(
          'Still waiting for NMC response. Check back in a few minutes.'
        );
      }
    }, 5000);
  }

  // Group credentials
  const nationalCredentials = credentials.filter(
    (c) => c.endorsement_system === 'national'
  );
  const stcwCredentials = credentials.filter(
    (c) => c.endorsement_system === 'stcw'
  );

  // Group national by department
  const deckCredentials = nationalCredentials.filter(
    (c) => c.department === 'deck'
  );
  const engineCredentials = nationalCredentials.filter(
    (c) => c.department === 'engine'
  );
  const otherCredentials = nationalCredentials.filter(
    (c) => c.department !== 'deck' && c.department !== 'engine'
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading credentials...</p>
        </div>
      </div>
    );
  }

  // No MMC empty state — different from "MMC but no credentials yet"
  if (!hasMmc) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
        <div className="text-6xl mb-4">📜</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No MMC on File
        </h3>
        <p className="text-gray-600 max-w-md mx-auto">
          When you receive your Merchant Mariner Credential, enter your
          reference number in Settings and we&apos;ll automatically pull your
          credentials from the Coast Guard.
        </p>
      </div>
    );
  }

  if (credentials.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
        <div className="text-6xl mb-4">📜</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No Credentials Found Yet
        </h3>
        <p className="text-gray-600 max-w-md mx-auto mb-6">
          Your NMC endorsements will appear here once verified. If you just
          submitted your reference number, this may take a few minutes.
        </p>
        {refNumber && (
          <button
            onClick={handleReverify}
            disabled={reverifyStatus === 'checking'}
            className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {reverifyStatus === 'checking'
              ? 'Checking...'
              : 'Check for Credentials'}
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Re-verify header row */}
      {refNumber && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {reverifyStatus === 'checking' && (
              <div className="flex items-center gap-2 text-sm text-blue-700">
                <div className="animate-spin h-4 w-4 rounded-full border-b-2 border-blue-600" />
                Checking for updated credentials...
              </div>
            )}
            {reverifyStatus === 'done' && reverifyMessage && (
              <p className="text-sm text-green-700 font-medium">
                {reverifyMessage}
              </p>
            )}
            {reverifyStatus === 'idle' && reverifyMessage && (
              <p className="text-sm text-red-600">{reverifyMessage}</p>
            )}
          </div>
          <button
            onClick={handleReverify}
            disabled={reverifyStatus === 'checking'}
            className="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 disabled:opacity-50 transition-colors"
          >
            {reverifyStatus === 'checking'
              ? 'Checking...'
              : 'Re-verify with NMC'}
          </button>
        </div>
      )}

      {/* National Credentials Section */}
      {nationalCredentials.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center space-x-3 mb-6">
            <span className="text-3xl">⚓</span>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                National Credentials
              </h2>
              <p className="text-sm text-gray-600">
                US Merchant Mariner Credentials
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {deckCredentials.length > 0 && (
              <DepartmentSection
                title="Deck Department"
                icon="🎖️"
                credentials={deckCredentials}
                onCredentialClick={setSelectedCredential}
                newIds={reverifyStatus === 'done' ? preReverifyIds : new Set()}
              />
            )}

            {engineCredentials.length > 0 && (
              <DepartmentSection
                title="Engine Department"
                icon="⚙️"
                credentials={engineCredentials}
                onCredentialClick={setSelectedCredential}
                newIds={reverifyStatus === 'done' ? preReverifyIds : new Set()}
              />
            )}

            {otherCredentials.length > 0 && (
              <DepartmentSection
                title="Other Departments"
                icon="🍽️"
                credentials={otherCredentials}
                onCredentialClick={setSelectedCredential}
                newIds={reverifyStatus === 'done' ? preReverifyIds : new Set()}
              />
            )}
          </div>
        </div>
      )}

      {/* STCW Certifications Section */}
      {stcwCredentials.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center space-x-3 mb-6">
            <span className="text-3xl">🌍</span>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                STCW Certifications
              </h2>
              <p className="text-sm text-gray-600">
                Standards of Training, Certification and Watchkeeping
              </p>
            </div>
          </div>

          <CredentialTable
            credentials={stcwCredentials}
            onCredentialClick={setSelectedCredential}
            newIds={reverifyStatus === 'done' ? preReverifyIds : new Set()}
          />
        </div>
      )}

      {/* Verification Timestamp */}
      {nmcVerifiedAt && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <span className="text-green-600 text-xl">✓</span>
            <p className="text-sm text-green-900">
              <span className="font-semibold">Last verified by NMC</span> on{' '}
              {new Date(nmcVerifiedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
              })}
            </p>
          </div>
        </div>
      )}

      {/* Modal */}
      {selectedCredential && (
        <CredentialModal
          credential={selectedCredential}
          onClose={() => setSelectedCredential(null)}
        />
      )}
    </div>
  );
}

// Component: Department Section
function DepartmentSection({
  title,
  icon,
  credentials,
  onCredentialClick,
  newIds,
}: {
  title: string;
  icon: string;
  credentials: Credential[];
  onCredentialClick: (credential: Credential) => void;
  newIds: Set<string>;
}) {
  const highestRank = Math.max(...credentials.map((c) => c.rank));

  return (
    <div>
      <div className="flex items-center space-x-2 mb-3">
        <span className="text-xl">{icon}</span>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <span className="text-sm text-gray-500">
          ({credentials.length} credential{credentials.length !== 1 ? 's' : ''})
        </span>
      </div>

      <CredentialTable
        credentials={credentials}
        onCredentialClick={onCredentialClick}
        highestRank={highestRank}
        newIds={newIds}
      />
    </div>
  );
}

// Component: Credential Table
function CredentialTable({
  credentials,
  onCredentialClick,
  highestRank,
  newIds,
}: {
  credentials: Credential[];
  onCredentialClick: (credential: Credential) => void;
  highestRank?: number;
  newIds: Set<string>;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 uppercase tracking-wider">
              Official NMC Name
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 uppercase tracking-wider">
              Common Name
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 uppercase tracking-wider">
              Level
            </th>
            {highestRank !== undefined && (
              <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 uppercase tracking-wider">
                Rank
              </th>
            )}
            <th className="w-12"></th>
          </tr>
        </thead>
        <tbody>
          {credentials.map((credential) => {
            const displayInfo = getCredentialDisplayInfo(
              credential.raw_nmc_text || credential.endorsement_name,
              credential.short_name || credential.endorsement_name
            );
            const isHighestRank =
              highestRank !== undefined &&
              credential.rank === highestRank &&
              credential.rank > 0;
            // A credential is "new" if it was in pre-reverify ids — meaning it wasn't there before
            // (newIds holds the IDs that were present BEFORE the re-verify)
            const isNew = newIds.size > 0 && !newIds.has(credential.id);

            return (
              <tr
                key={credential.id}
                className={`border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer ${
                  isNew ? 'bg-green-50' : ''
                }`}
                onClick={() => onCredentialClick(credential)}
              >
                {/* Official Name */}
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-2">
                    {isHighestRank && (
                      <span
                        className="text-yellow-500 text-lg"
                        title="Highest rank credential"
                      >
                        ⭐
                      </span>
                    )}
                    {isNew && (
                      <span className="inline-block px-1.5 py-0.5 text-xs font-bold bg-green-500 text-white rounded">
                        NEW
                      </span>
                    )}
                    <span className="text-sm text-gray-900 font-mono">
                      {credential.raw_nmc_text || credential.endorsement_name}
                    </span>
                  </div>
                </td>

                {/* Colloquial Name */}
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{displayInfo.icon}</span>
                    <div>
                      <p className="font-medium text-gray-900">
                        {displayInfo.colloquialName}
                      </p>
                      <p className="text-xs text-gray-500 line-clamp-1">
                        {displayInfo.description}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Level Badge */}
                <td className="py-4 px-4">
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs font-medium border ${getQualificationBadgeColor(credential.qualification_level)}`}
                  >
                    {getQualificationLevelName(credential.qualification_level)}
                  </span>
                </td>

                {/* Rank (if applicable) */}
                {highestRank !== undefined && (
                  <td className="py-4 px-4 text-center">
                    {credential.rank > 0 ? (
                      <span className="text-lg font-bold text-blue-600">
                        {credential.rank}
                      </span>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                )}

                {/* Click indicator */}
                <td className="py-4 px-4 text-right">
                  <span className="text-gray-400">→</span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
