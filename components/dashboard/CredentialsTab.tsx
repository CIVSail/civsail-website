// components/dashboard/CredentialsTab.tsx
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import CredentialModal from './CredentialModal';
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

interface CredentialsTabProps {
  userId: string;
  nmcVerifiedAt?: string | null;
}

export default function CredentialsTab({ userId, nmcVerifiedAt }: CredentialsTabProps) {
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCredential, setSelectedCredential] = useState<Credential | null>(null);
  const supabase = createClient();

  useEffect(() => {
    loadCredentials();
  }, [userId]);

  async function loadCredentials() {
    const { data, error } = await supabase
      .from('credentials')
      .select('*')
      .eq('user_id', userId)
      .order('rank', { ascending: false }) // Highest rank first
      .order('endorsement_name', { ascending: true });

    if (error) {
      console.error('Error loading credentials:', error);
    } else {
      setCredentials(data || []);
    }
    setLoading(false);
  }

  // Group credentials
  const nationalCredentials = credentials.filter(c => c.endorsement_system === 'national');
  const stcwCredentials = credentials.filter(c => c.endorsement_system === 'stcw');

  // Group national by department
  const deckCredentials = nationalCredentials.filter(c => c.department === 'deck');
  const engineCredentials = nationalCredentials.filter(c => c.department === 'engine');
  const otherCredentials = nationalCredentials.filter(c => c.department === 'other');

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

  if (credentials.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
        <div className="text-6xl mb-4">📜</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No Credentials Found
        </h3>
        <p className="text-gray-600">
          Your NMC credentials will appear here once verified.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
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
            {/* Deck Department */}
            {deckCredentials.length > 0 && (
              <DepartmentSection
                title="Deck Department"
                icon="🎖️"
                credentials={deckCredentials}
                onCredentialClick={setSelectedCredential}
              />
            )}

            {/* Engine Department */}
            {engineCredentials.length > 0 && (
              <DepartmentSection
                title="Engine Department"
                icon="⚙️"
                credentials={engineCredentials}
                onCredentialClick={setSelectedCredential}
              />
            )}

            {/* Other Departments */}
            {otherCredentials.length > 0 && (
              <DepartmentSection
                title="Other Departments"
                icon="🍽️"
                credentials={otherCredentials}
                onCredentialClick={setSelectedCredential}
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
          />
        </div>
      )}

      {/* Verification Timestamp */}
      {nmcVerifiedAt && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <span className="text-green-600 text-xl">✓</span>
            <p className="text-sm text-green-900">
              <span className="font-semibold">Last verified by NMC</span>
              {' '}on{' '}
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
}: {
  title: string;
  icon: string;
  credentials: Credential[];
  onCredentialClick: (credential: Credential) => void;
}) {
  // Find highest rank credential
  const highestRank = Math.max(...credentials.map(c => c.rank));

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
      />
    </div>
  );
}

// Component: Credential Table
function CredentialTable({
  credentials,
  onCredentialClick,
  highestRank,
}: {
  credentials: Credential[];
  onCredentialClick: (credential: Credential) => void;
  highestRank?: number;
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
            const isHighestRank = highestRank !== undefined && credential.rank === highestRank && credential.rank > 0;

            return (
              <tr
                key={credential.id}
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => onCredentialClick(credential)}
              >
                {/* Official Name */}
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-2">
                    {isHighestRank && (
                      <span className="text-yellow-500 text-lg" title="Highest rank credential">
                        ⭐
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