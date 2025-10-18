'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import type { Profile } from '@/types/database';
import { calculateExpiration } from '@/lib/utils/dates';

type TabType = 'info' | 'documents' | 'settings';

export default function DashboardPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('info');
  const [editing, setEditing] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState('');

  const router = useRouter();
  const supabase = createClient();

  // File management state
  const [mmcFiles, setMmcFiles] = useState<any[]>([]);
  const [seaServiceFiles, setSeaServiceFiles] = useState<any[]>([]);
  const [uploadingTo, setUploadingTo] = useState<string | null>(null);

  useEffect(() => {
    loadProfile();
    loadFiles();
  }, []);

  async function loadProfile() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push('/login');
      return;
    }

    const { data: profileData, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) {
      console.error('Profile fetch error:', error);
    }

    if (!profileData) {
      router.push('/onboarding');
      return;
    }

    setProfile(profileData);
    setLoading(false);
  }

  async function loadFiles() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    // Load MMC files
    const { data: mmcList } = await supabase.storage
      .from('documents')
      .list(`mmc/${user.id}`);
    setMmcFiles(mmcList || []);

    // Load sea service files
    const { data: seaList } = await supabase.storage
      .from('documents')
      .list(`sea_service/${user.id}`);
    setSeaServiceFiles(seaList || []);
  }

  async function handleUpdateField(field: keyof Profile, value: any) {
    if (!profile) return;

    const { error } = await supabase
      .from('profiles')
      .update({ [field]: value })
      .eq('user_id', profile.user_id);

    if (error) {
      console.error('Update error:', error);
      setSaveMessage('❌ Failed to save');
    } else {
      setProfile({ ...profile, [field]: value });
      setSaveMessage('✅ Saved!');
      setTimeout(() => setSaveMessage(''), 2000);
    }
    setEditing(null);
  }

  async function handleFileUpload(
    type: 'mmc' | 'sea_service',
    files: FileList | null
  ) {
    if (!files || !profile) return;
    setUploadingTo(type);

    for (const file of Array.from(files)) {
      const path = `${type}/${profile.user_id}/${file.name}`;
      await supabase.storage
        .from('documents')
        .upload(path, file, { upsert: true });
    }

    await loadFiles();
    setUploadingTo(null);
  }

  async function handleDeleteFile(
    type: 'mmc' | 'sea_service',
    fileName: string
  ) {
    if (!profile) return;
    if (!confirm(`Delete ${fileName}?`)) return;

    const path = `${type}/${profile.user_id}/${fileName}`;
    await supabase.storage.from('documents').remove([path]);
    await loadFiles();
  }

  async function getFileUrl(type: 'mmc' | 'sea_service', fileName: string) {
    if (!profile) return '#';
    const path = `${type}/${profile.user_id}/${fileName}`;
    const { data } = await supabase.storage
      .from('documents')
      .createSignedUrl(path, 3600);
    return data?.signedUrl || '#';
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <Image
              src="/CIVSail-Logo-Crop.png"
              alt="CIVSail"
              width={160}
              height={40}
              className="h-8 w-auto"
            />
            <button
              onClick={async () => {
                await supabase.auth.signOut();
                router.push('/login');
              }}
              className="text-gray-600 hover:text-gray-900 transition-colors text-sm"
            >
              Sign Out
            </button>
          </div>

          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {profile?.full_name || 'Mariner'}!
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your maritime credentials and documents
          </p>
        </div>

        {/* Tabs */}
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex space-x-8 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('info')}
              className={`pb-4 px-2 font-medium transition-colors border-b-2 ${
                activeTab === 'info'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Information
            </button>
            <button
              onClick={() => setActiveTab('documents')}
              className={`pb-4 px-2 font-medium transition-colors border-b-2 ${
                activeTab === 'documents'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Documents
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`pb-4 px-2 font-medium transition-colors border-b-2 ${
                activeTab === 'settings'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Settings
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {saveMessage && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-center">
            <p className="text-sm text-green-700">{saveMessage}</p>
          </div>
        )}

        {/* Info Tab */}
        {activeTab === 'info' && (
          <div className="space-y-6">
            {/* Profile Info */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Profile Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ProfileField
                  label="Full Name"
                  value={profile?.full_name || ''}
                  editing={editing === 'full_name'}
                  onEdit={() => setEditing('full_name')}
                  onSave={(value) => handleUpdateField('full_name', value)}
                  onCancel={() => setEditing(null)}
                />
                <ProfileField
                  label="Phone"
                  value={profile?.phone || ''}
                  editing={editing === 'phone'}
                  onEdit={() => setEditing('phone')}
                  onSave={(value) => handleUpdateField('phone', value)}
                  onCancel={() => setEditing(null)}
                />
                <ProfileField
                  label="Email"
                  value={profile?.email || ''}
                  editing={editing === 'email'}
                  onEdit={() => setEditing('email')}
                  onSave={(value) => handleUpdateField('email', value)}
                  onCancel={() => setEditing(null)}
                />
                <ProfileField
                  label="Ship Email"
                  value={profile?.ship_email || ''}
                  editing={editing === 'ship_email'}
                  onEdit={() => setEditing('ship_email')}
                  onSave={(value) => handleUpdateField('ship_email', value)}
                  onCancel={() => setEditing(null)}
                />
                <ProfileField
                  label="Mariner Reference #"
                  value={profile?.ref_number || ''}
                  editing={editing === 'ref_number'}
                  onEdit={() => setEditing('ref_number')}
                  onSave={(value) => handleUpdateField('ref_number', value)}
                  onCancel={() => setEditing(null)}
                />
              </div>
            </div>

            {/* Credentials */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Credential Expirations
              </h2>
              <div className="space-y-3">
                <CredentialRow
                  label="MMC"
                  date={profile?.mmc_exp || null}
                  editing={editing === 'mmc_exp'}
                  onEdit={() => setEditing('mmc_exp')}
                  onSave={(value) => handleUpdateField('mmc_exp', value)}
                  onCancel={() => setEditing(null)}
                />
                <CredentialRow
                  label="Medical Certificate"
                  date={profile?.medical_exp || null}
                  editing={editing === 'medical_exp'}
                  onEdit={() => setEditing('medical_exp')}
                  onSave={(value) => handleUpdateField('medical_exp', value)}
                  onCancel={() => setEditing(null)}
                />
                <CredentialRow
                  label="Passport"
                  date={profile?.passport_exp || null}
                  editing={editing === 'passport_exp'}
                  onEdit={() => setEditing('passport_exp')}
                  onSave={(value) => handleUpdateField('passport_exp', value)}
                  onCancel={() => setEditing(null)}
                />
                <CredentialRow
                  label="TWIC"
                  date={profile?.twic_exp || null}
                  editing={editing === 'twic_exp'}
                  onEdit={() => setEditing('twic_exp')}
                  onSave={(value) => handleUpdateField('twic_exp', value)}
                  onCancel={() => setEditing(null)}
                />
                <CredentialRow
                  label="Driver's License"
                  date={profile?.license_exp || null}
                  editing={editing === 'license_exp'}
                  onEdit={() => setEditing('license_exp')}
                  onSave={(value) => handleUpdateField('license_exp', value)}
                  onCancel={() => setEditing(null)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Documents Tab */}
        {activeTab === 'documents' && (
          <div className="space-y-6">
            <DocumentSection
              title="MMC Documents"
              files={mmcFiles}
              type="mmc"
              uploading={uploadingTo === 'mmc'}
              onUpload={(files) => handleFileUpload('mmc', files)}
              onDelete={(name) => handleDeleteFile('mmc', name)}
              getFileUrl={(name) => getFileUrl('mmc', name)}
            />
            <DocumentSection
              title="Sea Service Letters"
              files={seaServiceFiles}
              type="sea_service"
              uploading={uploadingTo === 'sea_service'}
              onUpload={(files) => handleFileUpload('sea_service', files)}
              onDelete={(name) => handleDeleteFile('sea_service', name)}
              getFileUrl={(name) => getFileUrl('sea_service', name)}
            />
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Notification Preferences
              </h2>
              <div className="space-y-4">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={profile?.alert_email ?? true}
                    onChange={(e) =>
                      handleUpdateField('alert_email', e.target.checked)
                    }
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-gray-700">
                    Send email alerts for expiring credentials
                  </span>
                </label>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Account Actions
              </h2>
              <div className="space-y-3">
                <button
                  onClick={() => router.push('/onboarding')}
                  className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  ← Back to Onboarding
                </button>
                <button
                  onClick={() => router.push('/reset-profile')}
                  className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-gray-700"
                >
                  Reset Profile (Testing)
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Component: Profile Field with Inline Editing
function ProfileField({
  label,
  value,
  editing,
  onEdit,
  onSave,
  onCancel,
}: {
  label: string;
  value: string;
  editing: boolean;
  onEdit: () => void;
  onSave: (value: string) => void;
  onCancel: () => void;
}) {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  if (editing) {
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
        <div className="flex space-x-2">
          <input
            type="text"
            value={localValue}
            onChange={(e) => setLocalValue(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            autoFocus
          />
          <button
            onClick={() => onSave(localValue)}
            className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            ✓
          </button>
          <button
            onClick={onCancel}
            className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            ✕
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
        <p className="font-medium text-gray-900">{value || 'Not set'}</p>
        <button
          onClick={onEdit}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          Edit
        </button>
      </div>
    </div>
  );
}

// Component: Credential Row with Expiration Badge
function CredentialRow({
  label,
  date,
  editing,
  onEdit,
  onSave,
  onCancel,
}: {
  label: string;
  date: string | null;
  editing: boolean;
  onEdit: () => void;
  onSave: (value: string) => void;
  onCancel: () => void;
}) {
  const [localValue, setLocalValue] = useState(date || '');
  const expInfo = date ? calculateExpiration(date) : null;

  useEffect(() => {
    setLocalValue(date || '');
  }, [date]);

  const getBadgeColor = () => {
    if (!expInfo) return 'bg-gray-100 text-gray-600';
    switch (expInfo.status) {
      case 'expired':
        return 'bg-red-100 text-red-800 border border-red-300';
      case 'urgent':
        return 'bg-red-50 text-red-700 border border-red-200';
      case 'warning':
        return 'bg-yellow-50 text-yellow-700 border border-yellow-200';
      case 'valid':
        return 'bg-green-50 text-green-700 border border-green-200';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  if (editing) {
    return (
      <div className="p-4 bg-gray-50 rounded-lg">
        <p className="text-sm font-medium text-gray-700 mb-2">{label}</p>
        <div className="flex space-x-2">
          <input
            type="date"
            value={localValue}
            onChange={(e) => setLocalValue(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
          <button
            onClick={() => onSave(localValue)}
            className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            ✓
          </button>
          <button
            onClick={onCancel}
            className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            ✕
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
      <div className="flex-1">
        <p className="font-medium text-gray-900">{label}</p>
        <div className="flex items-center space-x-3 mt-1">
          {date ? (
            <>
              <p className="text-sm text-gray-600">
                {new Date(date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </p>
              {expInfo && (
                <span className="text-xs text-gray-500">
                  • {expInfo.message}
                </span>
              )}
            </>
          ) : (
            <p className="text-sm text-gray-500">Not set</p>
          )}
        </div>
      </div>
      <div className="flex items-center space-x-3">
        {date && expInfo && (
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${getBadgeColor()}`}
          >
            {expInfo.daysRemaining >= 0
              ? `${expInfo.daysRemaining} days`
              : 'Expired'}
          </span>
        )}
        <button
          onClick={onEdit}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          Edit
        </button>
      </div>
    </div>
  );
}

// Component: Document Section
function DocumentSection({
  title,
  files,
  type,
  uploading,
  onUpload,
  onDelete,
  getFileUrl,
}: {
  title: string;
  files: any[];
  type: string;
  uploading: boolean;
  onUpload: (files: FileList | null) => void;
  onDelete: (name: string) => void;
  getFileUrl: (name: string) => Promise<string>;
}) {
  const [downloadingFile, setDownloadingFile] = useState<string | null>(null);

  const handleDownload = async (fileName: string) => {
    setDownloadingFile(fileName);
    const url = await getFileUrl(fileName);
    window.open(url, '_blank');
    setDownloadingFile(null);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        <label className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
          {uploading ? 'Uploading...' : '+ Upload'}
          <input
            type="file"
            className="hidden"
            multiple={type === 'sea_service'}
            accept="image/*,application/pdf"
            onChange={(e) => onUpload(e.target.files)}
            disabled={uploading}
          />
        </label>
      </div>

      {files.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          No documents uploaded yet
        </p>
      ) : (
        <div className="space-y-2">
          {files.map((file) => (
            <div
              key={file.name}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">📄</span>
                <div>
                  <p className="font-medium text-gray-900">{file.name}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(file.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleDownload(file.name)}
                  disabled={downloadingFile === file.name}
                  className="px-3 py-1 text-blue-600 hover:text-blue-800 text-sm font-medium disabled:opacity-50"
                >
                  {downloadingFile === file.name ? 'Opening...' : 'Download'}
                </button>
                <button
                  onClick={() => onDelete(file.name)}
                  className="px-3 py-1 text-red-600 hover:text-red-800 text-sm font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
