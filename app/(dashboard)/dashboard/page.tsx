'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import type { Profile } from '@/types/database';
import { calculateExpiration } from '@/lib/utils/dates';
import CredentialsTab from '@/components/dashboard/CredentialsTab';
import SeaServiceOCRModal from '@/components/dashboard/SeaServiceOCRModal';

// NEW: Add 'seaService' to tab types
type TabType = 'info' | 'credentials' | 'documents' | 'seaService' | 'settings';

// NEW: Type for OCR results from the API
interface OCRResult {
  success: boolean;
  servicePeriods: {
    extracted: number;
    inserted: number;
    duplicates: number;
  };
  periods: any[];
  needsReview: boolean;
  error?: string;
}

// NEW: Type for sea service data from database
interface SeaServicePeriod {
  id: string;
  vessel_name: string;
  sign_on_date: string;
  sign_off_date: string;
  days_served: number;
  position_held: string;
  tonnage: number | null;
  tonnage_category: string | null;
  propulsion: string | null;
  department: string | null;
  route: string | null;
  creditable_for_routes: string[] | null;
  needs_manual_review: boolean;
  verified: boolean;
  created_at: string;
}

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

  // NEW: OCR modal state
  const [ocrResult, setOcrResult] = useState<OCRResult | null>(null);
  const [showOcrModal, setShowOcrModal] = useState(false);

  // NEW: Sea service data state
  const [seaServicePeriods, setSeaServicePeriods] = useState<
    SeaServicePeriod[]
  >([]);
  const [loadingSeaService, setLoadingSeaService] = useState(false);

  useEffect(() => {
    loadProfile();
    loadFiles();
    loadSeaServiceData(); // NEW: Load sea service periods on mount
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

  // NEW: Load sea service periods from database
  async function loadSeaServiceData() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    setLoadingSeaService(true);

    const { data, error } = await supabase
      .from('sea_service')
      .select('*')
      .eq('user_id', user.id)
      .order('sign_on_date', { ascending: false });

    if (error) {
      console.error('Error loading sea service:', error);
    } else {
      setSeaServicePeriods(data || []);
    }

    setLoadingSeaService(false);
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

  // UPDATED: Modified to process sea service files with OCR
  async function handleFileUpload(
    type: 'mmc' | 'sea_service',
    files: FileList | null
  ) {
    if (!files || !profile) return;
    setUploadingTo(type);

    try {
      for (const file of Array.from(files)) {
        const path = `${type}/${profile.user_id}/${file.name}`;

        // Upload to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from('documents')
          .upload(path, file, { upsert: true });

        if (uploadError) {
          console.error('Upload error:', uploadError);
          continue;
        }

        // NEW: If this is a sea service file, trigger OCR processing
        if (type === 'sea_service') {
          await processSeaServiceOCR(file, path);
        }
      }

      await loadFiles();
    } catch (error) {
      console.error('File upload error:', error);
      alert('Failed to upload file. Please try again.');
    } finally {
      setUploadingTo(null);
    }
  }

  // NEW: Process uploaded sea service file with OCR
  async function processSeaServiceOCR(file: File, storagePath: string) {
    try {
      // Create FormData to send file to API
      const formData = new FormData();
      formData.append('file', file);
      formData.append('storagePath', storagePath);

      // Call our OCR API endpoint
      const response = await fetch('/api/ocr/process-sea-service', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('OCR processing failed');
      }

      const result: OCRResult = await response.json();

      // Show the modal with results
      setOcrResult(result);
      setShowOcrModal(true);

      // Reload sea service data to show new periods
      await loadSeaServiceData();
    } catch (error) {
      console.error('OCR processing error:', error);
      // Show error in modal
      setOcrResult({
        success: false,
        error:
          'Failed to process document. Please try again or enter data manually.',
        servicePeriods: { extracted: 0, inserted: 0, duplicates: 0 },
        periods: [],
        needsReview: false,
      });
      setShowOcrModal(true);
    }
  }

  // NEW: Handle closing OCR modal
  function handleOcrModalClose() {
    setShowOcrModal(false);
    setOcrResult(null);
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

  if (!profile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* OCR Modal */}
      {showOcrModal && ocrResult && (
        <SeaServiceOCRModal
          result={ocrResult}
          onClose={handleOcrModalClose}
          onConfirm={handleOcrModalClose}
        />
      )}

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
          <div className="flex space-x-8 border-b border-gray-200 overflow-x-auto">
            <button
              onClick={() => setActiveTab('info')}
              className={`pb-4 px-2 font-medium transition-colors border-b-2 whitespace-nowrap ${
                activeTab === 'info'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Information
            </button>

            <button
              onClick={() => setActiveTab('credentials')}
              className={`pb-4 px-2 font-medium transition-colors border-b-2 whitespace-nowrap ${
                activeTab === 'credentials'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Credentials
            </button>

            <button
              onClick={() => setActiveTab('seaService')}
              className={`pb-4 px-2 font-medium transition-colors border-b-2 whitespace-nowrap ${
                activeTab === 'seaService'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Sea Service
            </button>

            <button
              onClick={() => setActiveTab('documents')}
              className={`pb-4 px-2 font-medium transition-colors border-b-2 whitespace-nowrap ${
                activeTab === 'documents'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Documents
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`pb-4 px-2 font-medium transition-colors border-b-2 whitespace-nowrap ${
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

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {saveMessage && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-center">
            <p className="text-sm text-green-700">{saveMessage}</p>
          </div>
        )}

        {/* Info Tab */}
        {activeTab === 'info' && (
          <div className="space-y-6">
            {/* Profile Information */}
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
                  label="MMC Reference Number"
                  value={profile?.ref_number || ''}
                  editing={editing === 'ref_number'}
                  onEdit={() => setEditing('ref_number')}
                  onSave={(value) => handleUpdateField('ref_number', value)}
                  onCancel={() => setEditing(null)}
                />
              </div>
            </div>

            {/* Credential Expirations */}
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

        {/* Credentials Tab - NMC Credentials from Email Parsing */}
        {activeTab === 'credentials' && (
          <CredentialsTab
            userId={profile.user_id}
            nmcVerifiedAt={profile.nmc_verified_at}
          />
        )}

        {/* Sea Service Tab */}
        {activeTab === 'seaService' && (
          <SeaServiceTab
            periods={seaServicePeriods}
            loading={loadingSeaService}
            onRefresh={loadSeaServiceData}
          />
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
              userId={profile.user_id}
              supabase={supabase}
            />
            <DocumentSection
              title="Sea Service Letters"
              description="Upload your Sea Service Letters (SSL) for automatic OCR processing"
              files={seaServiceFiles}
              type="sea_service"
              uploading={uploadingTo === 'sea_service'}
              onUpload={(files) => handleFileUpload('sea_service', files)}
              onDelete={(name) => handleDeleteFile('sea_service', name)}
              userId={profile.user_id}
              supabase={supabase}
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
                  className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  🔄 Reset Profile Data
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Component: Profile Field with Edit
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
        <p className="text-sm text-gray-500 mb-1">{label}</p>
        <div className="flex space-x-2">
          <input
            type="text"
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

// Component: Document Section
function DocumentSection({
  title,
  description,
  files,
  type,
  uploading,
  onUpload,
  onDelete,
  userId,
  supabase,
}: {
  title: string;
  description?: string;
  files: any[];
  type: 'mmc' | 'sea_service';
  uploading: boolean;
  onUpload: (files: FileList | null) => void;
  onDelete: (name: string) => void;
  userId: string;
  supabase: any;
}) {
  const [downloadingFile, setDownloadingFile] = useState<string | null>(null);

  const handleDownload = async (fileName: string) => {
    try {
      setDownloadingFile(fileName);
      const path = `${type}/${userId}/${fileName}`;
      const { data, error } = await supabase.storage
        .from('documents')
        .download(path);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download file. Please try again.');
    } finally {
      setDownloadingFile(null);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          {description && (
            <p className="text-sm text-gray-500 mt-1">{description}</p>
          )}
        </div>
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
                  {downloadingFile === file.name
                    ? 'Downloading...'
                    : 'Download'}
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

// NEW: Sea Service Tab Component
function SeaServiceTab({
  periods,
  loading,
  onRefresh,
}: {
  periods: SeaServicePeriod[];
  loading: boolean;
  onRefresh: () => void;
}) {
  // Calculate total days and most recent service
  const totalDays = periods.reduce((sum, p) => sum + (p.days_served || 0), 0);
  const mostRecentPeriod = periods[0]; // Already sorted by sign_on_date desc

  // Count periods needing review
  const needsReview = periods.filter((p) => p.needs_manual_review).length;

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading sea service data...</p>
      </div>
    );
  }

  if (periods.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
        <span className="text-6xl mb-4 block">⚓</span>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No Sea Service Records Yet
        </h3>
        <p className="text-gray-600 mb-6">
          Upload your Sea Service Letters in the Documents tab to get started
        </p>
        <button
          onClick={onRefresh}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Refresh
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Days */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">
                Total Sea Service
              </p>
              <p className="text-4xl font-bold mt-2">{totalDays}</p>
              <p className="text-blue-100 text-sm mt-1">days</p>
            </div>
            <span className="text-5xl opacity-20">⚓</span>
          </div>
        </div>

        {/* Most Recent Service */}
        <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-teal-100 text-sm font-medium">Last Sign-Off</p>
              <p className="text-2xl font-bold mt-2">
                {mostRecentPeriod
                  ? new Date(mostRecentPeriod.sign_off_date).toLocaleDateString(
                      'en-US',
                      {
                        month: 'short',
                        year: 'numeric',
                      }
                    )
                  : 'N/A'}
              </p>
              <p className="text-teal-100 text-sm mt-1">
                {mostRecentPeriod?.vessel_name}
              </p>
            </div>
            <span className="text-5xl opacity-20">🚢</span>
          </div>
        </div>

        {/* Needs Review Count */}
        <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-100 text-sm font-medium">Needs Review</p>
              <p className="text-4xl font-bold mt-2">{needsReview}</p>
              <p className="text-amber-100 text-sm mt-1">periods</p>
            </div>
            <span className="text-5xl opacity-20">⚠️</span>
          </div>
        </div>
      </div>

      {/* Service Periods Timeline */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Service History
          </h2>
          <button
            onClick={onRefresh}
            className="px-4 py-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            🔄 Refresh
          </button>
        </div>

        <div className="space-y-4">
          {periods.map((period, index) => (
            <ServicePeriodCard
              key={period.id}
              period={period}
              index={index}
              totalCount={periods.length}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// Service Period Card Component
function ServicePeriodCard({
  period,
  index,
  totalCount,
}: {
  period: SeaServicePeriod;
  index: number;
  totalCount: number;
}) {
  const signOnDate = new Date(period.sign_on_date);
  const signOffDate = new Date(period.sign_off_date);

  return (
    <div
      className={`border rounded-lg p-4 ${
        period.needs_manual_review
          ? 'bg-amber-50 border-amber-200'
          : period.verified
          ? 'bg-green-50 border-green-200'
          : 'bg-blue-50 border-blue-200'
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">
            {period.needs_manual_review ? '⚠️' : period.verified ? '✅' : '📋'}
          </span>
          <div>
            <h3 className="font-bold text-gray-900">{period.vessel_name}</h3>
            <p className="text-sm text-gray-600">{period.position_held}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Period {totalCount - index}</p>
          {period.tonnage && (
            <p className="text-xs text-gray-500">{period.tonnage} GT</p>
          )}
        </div>
      </div>

      {/* Dates and Days */}
      <div className="grid grid-cols-3 gap-3 mb-3">
        <div>
          <p className="text-xs text-gray-500">Sign On</p>
          <p className="font-medium text-gray-900">
            {signOnDate.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Sign Off</p>
          <p className="font-medium text-gray-900">
            {signOffDate.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Days Served</p>
          <p className="font-bold text-gray-900 text-lg">
            {period.days_served}
          </p>
        </div>
      </div>

      {/* Additional Info */}
      <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-200">
        {period.department && (
          <span className="px-2 py-1 bg-white text-gray-700 text-xs rounded border border-gray-300">
            {period.department}
          </span>
        )}
        {period.route && (
          <span className="px-2 py-1 bg-white text-gray-700 text-xs rounded border border-gray-300">
            {period.route}
          </span>
        )}
        {period.tonnage_category && (
          <span className="px-2 py-1 bg-white text-gray-700 text-xs rounded border border-gray-300">
            {period.tonnage_category.replace(/_/g, ' ').toUpperCase()}
          </span>
        )}
      </div>

      {/* Review Flag */}
      {period.needs_manual_review && (
        <div className="mt-3 p-2 bg-amber-100 rounded text-sm text-amber-800">
          ⚠️ This period needs manual review due to missing or unclear data
        </div>
      )}
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
