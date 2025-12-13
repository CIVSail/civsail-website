'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import type { Profile } from '@/types/database';
import { calculateExpiration } from '@/lib/utils/dates';
import CredentialsTab from '@/components/dashboard/CredentialsTab';
import SeaServiceEntryModal from '@/components/dashboard/SeaServiceEntryModal';
import PDFRejectionModal from '@/components/dashboard/PDFRejectionModal';
import type { SeaServicePeriod } from '@/types/sea-service';
import CareerPathPage from '@/app/(dashboard)/career-path/page';
import {
  CAREER_GOAL_ARCHETYPES,
  type CareerGoalType,
  type CredentialLevel,
} from '@/types/career-navigator';

// Tab types
type TabType =
  | 'info'
  | 'credentials'
  | 'documents'
  | 'seaService'
  | 'careerPath'
  | 'settings';

// Type for OCR results from the API
interface OCRResult {
  success: boolean;
  isPDF?: boolean;
  fileName?: string;
  servicePeriods?: {
    extracted: number;
    inserted: number;
    duplicates: number;
  };
  periods?: any[];
  needsReview?: boolean;
  error?: string;
  message?: string;
  ocrConfidence?: number;
}

export default function DashboardPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('info');
  const [editing, setEditing] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState('');
  const [careerGoal, setCareerGoal] = useState<any>(null);
  const [loadingGoal, setLoadingGoal] = useState(false);

  const router = useRouter();
  const supabase = createClient();

  // File management state
  const [mmcFiles, setMmcFiles] = useState<any[]>([]);
  const [seaServiceFiles, setSeaServiceFiles] = useState<any[]>([]);
  const [uploadingTo, setUploadingTo] = useState<string | null>(null);

  // Sea service data state
  const [seaServicePeriods, setSeaServicePeriods] = useState<
    SeaServicePeriod[]
  >([]);
  const [loadingSeaService, setLoadingSeaService] = useState(false);

  // Entry modal states
  const [showSeaServiceEntry, setShowSeaServiceEntry] = useState(false);
  const [entryMode, setEntryMode] = useState<'review' | 'manual'>('manual');
  const [reviewData, setReviewData] = useState<
    Partial<SeaServicePeriod> | undefined
  >();

  // PDF rejection modal state
  const [showPDFRejection, setShowPDFRejection] = useState(false);
  const [rejectedPDFName, setRejectedPDFName] = useState('');

  useEffect(() => {
    loadProfile();
    loadFiles();
    loadSeaServiceData();
    loadCareerGoal(); // ← ADD THIS LINE
  }, []);
  // Load career goal from database
  async function loadCareerGoal() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    setLoadingGoal(true);

    const { data, error } = await supabase
      .from('career_goals')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) {
      console.error('Error loading career goal:', error);
    } else {
      setCareerGoal(data);
    }

    setLoadingGoal(false);
  }
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

  // Load sea service periods from database
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

  // Modified to process sea service files with OCR
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

        // If this is a sea service file, trigger OCR processing
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

  // UPDATED: Process uploaded sea service file with OCR
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

      const result: OCRResult = await response.json();

      // Check if it's a PDF rejection
      if (result.isPDF) {
        setRejectedPDFName(file.name);
        setShowPDFRejection(true);
        return; // Exit early - PDF modal will handle next steps
      }

      if (!result.success) {
        throw new Error(result.error || 'OCR processing failed');
      }

      // If we got periods, show them for review
      if (result.periods && result.periods.length > 0) {
        // Open entry modal with first period data for review
        const firstPeriod = result.periods[0];

        setReviewData({
          vessel_name: firstPeriod.vessel_name,
          sign_on_date: firstPeriod.sign_on_date,
          sign_off_date: firstPeriod.sign_off_date,
          position_held: firstPeriod.position_held,
          department: firstPeriod.department,
          grt: firstPeriod.grt,
          route: firstPeriod.route,
          propulsion_type: firstPeriod.propulsion,
          watchkeeping_days: firstPeriod.watchkeeping_days || 0,
          supervised: firstPeriod.supervised || false,
          officer_on_watch: firstPeriod.officer_on_watch || false,
          ocr_confidence: result.ocrConfidence,
        });
        setEntryMode('review');
        setShowSeaServiceEntry(true);
      }

      // Reload sea service data to show new periods
      await loadSeaServiceData();

      // Show success message if periods were inserted
      if (result.servicePeriods && result.servicePeriods.inserted > 0) {
        alert(
          `✅ Successfully added ${result.servicePeriods.inserted} service period(s)!`
        );
      } else if (
        result.servicePeriods &&
        result.servicePeriods.duplicates > 0
      ) {
        alert(
          'ℹ️ All periods were already in your ledger (duplicates skipped).'
        );
      }
    } catch (error) {
      console.error('OCR processing error:', error);
      alert('Failed to process document. Please try manual entry.');
    }
  }

  // Handler for manual entry button
  function handleManualEntry() {
    setReviewData(undefined);
    setEntryMode('manual');
    setShowSeaServiceEntry(true);
  }

  // Handler when sea service entry is saved
  function handleSeaServiceSaved() {
    loadSeaServiceData(); // Reload ledger
    setShowSeaServiceEntry(false);
  }

  // Handler for PDF re-upload
  function handleReupload() {
    // Trigger the file input click
    const fileInput = document.querySelector(
      'input[type="file"][accept*="image"]'
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
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

  // Safety check: profile should always exist here, but TypeScript needs confirmation
  if (!profile) {
    return null;
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
                  ? 'text-blue-600 border-blue-600'
                  : 'text-gray-600 border-transparent hover:text-gray-900'
              }`}
            >
              Personal Info
            </button>
            <button
              onClick={() => setActiveTab('credentials')}
              className={`pb-4 px-2 font-medium transition-colors border-b-2 ${
                activeTab === 'credentials'
                  ? 'text-blue-600 border-blue-600'
                  : 'text-gray-600 border-transparent hover:text-gray-900'
              }`}
            >
              Credentials
            </button>
            <button
              onClick={() => setActiveTab('seaService')}
              className={`pb-4 px-2 font-medium transition-colors border-b-2 ${
                activeTab === 'seaService'
                  ? 'text-blue-600 border-blue-600'
                  : 'text-gray-600 border-transparent hover:text-gray-900'
              }`}
            >
              Sea Service
            </button>
            <button
              onClick={() => setActiveTab('documents')}
              className={`pb-4 px-2 font-medium transition-colors border-b-2 ${
                activeTab === 'documents'
                  ? 'text-blue-600 border-blue-600'
                  : 'text-gray-600 border-transparent hover:text-gray-900'
              }`}
            >
              Documents
            </button>
            <button
              onClick={() => setActiveTab('careerPath')}
              className={`pb-4 px-2 font-medium transition-colors border-b-2 ${
                activeTab === 'careerPath'
                  ? 'text-blue-600 border-blue-600'
                  : 'text-gray-600 border-transparent hover:text-gray-900'
              }`}
            >
              Career Path
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`pb-4 px-2 font-medium transition-colors border-b-2 ${
                activeTab === 'settings'
                  ? 'text-blue-600 border-blue-600'
                  : 'text-gray-600 border-transparent hover:text-gray-900'
              }`}
            >
              Settings
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Personal Info Tab */}
          {activeTab === 'info' && (
            <div className="space-y-6">
              {/* Contact Information */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-semibold mb-6">
                  Contact Information
                </h2>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="font-medium text-gray-900">Full Name</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {profile.full_name}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="font-medium text-gray-900">Email</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {profile.email}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="font-medium text-gray-900">Phone</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {profile.phone || 'Not set'}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="font-medium text-gray-900">
                      Reference Number
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {profile.ref_number || 'Not set'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Career Background */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-semibold mb-6">
                  Career Background
                </h2>
                <div className="space-y-4">
                  {/* Industry Entry Route */}
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-gray-900">
                        How did you enter the industry?
                      </p>
                      <button
                        onClick={() => {
                          if (editing === 'industry_entry') {
                            setEditing(null);
                          } else {
                            setEditing('industry_entry');
                          }
                        }}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        {editing === 'industry_entry' ? 'Cancel' : 'Edit'}
                      </button>
                    </div>

                    {editing === 'industry_entry' ? (
                      <div className="space-y-3">
                        <select
                          value={profile.industry_entry_route || ''}
                          onChange={(e) =>
                            handleUpdateField(
                              'industry_entry_route',
                              e.target.value
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select...</option>
                          <option value="hawsepiper">
                            Hawsepiper (worked my way up)
                          </option>
                          <option value="academy">
                            Maritime Academy Graduate
                          </option>
                          <option value="military">Former Military</option>
                        </select>

                        {profile.industry_entry_route === 'academy' && (
                          <input
                            type="text"
                            value={profile.academy_name || ''}
                            onChange={(e) =>
                              handleUpdateField('academy_name', e.target.value)
                            }
                            placeholder="Academy name (e.g., SUNY Maritime, Cal Maritime)"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                        )}

                        {profile.industry_entry_route === 'military' && (
                          <input
                            type="text"
                            value={profile.military_branch || ''}
                            onChange={(e) =>
                              handleUpdateField(
                                'military_branch',
                                e.target.value
                              )
                            }
                            placeholder="Branch (e.g., Navy, Coast Guard, Merchant Marine)"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                        )}
                      </div>
                    ) : (
                      <div>
                        <p className="text-sm text-gray-600 mt-1">
                          {profile.industry_entry_route
                            ? profile.industry_entry_route === 'hawsepiper'
                              ? 'Hawsepiper (worked my way up)'
                              : profile.industry_entry_route === 'academy'
                              ? `Maritime Academy Graduate${
                                  profile.academy_name
                                    ? ` - ${profile.academy_name}`
                                    : ''
                                }`
                              : `Former Military${
                                  profile.military_branch
                                    ? ` - ${profile.military_branch}`
                                    : ''
                                }`
                            : 'Not set'}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Expected Sea Days Per Year */}
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-medium text-gray-900">
                          Expected Sea Days Per Year
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Used to estimate time to upgrades
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          if (editing === 'sea_days') {
                            setEditing(null);
                          } else {
                            setEditing('sea_days');
                          }
                        }}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        {editing === 'sea_days' ? 'Cancel' : 'Edit'}
                      </button>
                    </div>

                    {editing === 'sea_days' ? (
                      <div className="flex items-center space-x-2">
                        <input
                          type="number"
                          min="0"
                          max="365"
                          value={profile.sea_days_per_year || 200}
                          onChange={(e) =>
                            handleUpdateField(
                              'sea_days_per_year',
                              parseInt(e.target.value)
                            )
                          }
                          className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-600">days/year</span>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-600 mt-1">
                        {profile.sea_days_per_year || 200} days/year
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Career Goals */}
              <CareerGoalsSection
                careerGoal={careerGoal}
                userId={profile.user_id}
                onUpdate={loadCareerGoal}
              />

              {/* Credential Expirations */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-semibold mb-6">
                  Credential Expirations
                </h2>
                <div className="space-y-3">
                  <CredentialRow
                    label="MMC Expiration"
                    date={profile.mmc_exp}
                    editing={editing === 'mmc_exp'}
                    onEdit={() => setEditing('mmc_exp')}
                    onSave={(value) => handleUpdateField('mmc_exp', value)}
                    onCancel={() => setEditing(null)}
                  />
                  <CredentialRow
                    label="Medical Certificate"
                    date={profile.medical_exp}
                    editing={editing === 'medical_exp'}
                    onEdit={() => setEditing('medical_exp')}
                    onSave={(value) => handleUpdateField('medical_exp', value)}
                    onCancel={() => setEditing(null)}
                  />
                  <CredentialRow
                    label="Passport"
                    date={profile.passport_exp}
                    editing={editing === 'passport_exp'}
                    onEdit={() => setEditing('passport_exp')}
                    onSave={(value) => handleUpdateField('passport_exp', value)}
                    onCancel={() => setEditing(null)}
                  />
                  <CredentialRow
                    label="TWIC"
                    date={profile.twic_exp}
                    editing={editing === 'twic_exp'}
                    onEdit={() => setEditing('twic_exp')}
                    onSave={(value) => handleUpdateField('twic_exp', value)}
                    onCancel={() => setEditing(null)}
                  />
                  <CredentialRow
                    label="Driver's License"
                    date={profile.license_exp}
                    editing={editing === 'license_exp'}
                    onEdit={() => setEditing('license_exp')}
                    onSave={(value) => handleUpdateField('license_exp', value)}
                    onCancel={() => setEditing(null)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Credentials Tab */}
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
              onAddManual={handleManualEntry}
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
          {/* Career Path Tab */}
          {activeTab === 'careerPath' && (
            <div>
              <CareerPathPage />
            </div>
          )}
          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-semibold mb-6">Account Settings</h2>
              <p className="text-gray-600">Settings panel coming soon...</p>
            </div>
          )}
        </div>
      </div>
      .{/* Modals */}
      <SeaServiceEntryModal
        isOpen={showSeaServiceEntry}
        onClose={() => setShowSeaServiceEntry(false)}
        onSave={handleSeaServiceSaved}
        mode={entryMode}
        initialData={reviewData}
      />
      <PDFRejectionModal
        isOpen={showPDFRejection}
        fileName={rejectedPDFName}
        onClose={() => setShowPDFRejection(false)}
        onManualEntry={handleManualEntry}
        onReupload={handleReupload}
      />
      {/* Save message toast */}
      {saveMessage && (
        <div className="fixed bottom-4 right-4 bg-white px-6 py-3 rounded-lg shadow-lg border border-gray-200">
          {saveMessage}
        </div>
      )}
    </div>
  );
}

// Sea Service Tab Component
function SeaServiceTab({
  periods,
  loading,
  onRefresh,
  onAddManual,
}: {
  periods: SeaServicePeriod[];
  loading: boolean;
  onRefresh: () => void;
  onAddManual: () => void;
}) {
  // Calculate summary statistics
  const totalDays = periods.reduce((sum, p) => sum + (p.days_served || 0), 0);
  const deckDays = periods
    .filter((p) => p.department === 'deck')
    .reduce((sum, p) => sum + (p.days_served || 0), 0);
  const mostRecentPeriod = periods[0]; // Already sorted by sign_on_date desc
  const needsReview = periods.filter((p) => p.needs_manual_review).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Total Days */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">
                Total Sea Days
              </p>
              <p className="text-4xl font-bold mt-2">{totalDays}</p>
              <p className="text-blue-100 text-sm mt-1">days served</p>
            </div>
            <span className="text-5xl opacity-20">⚓</span>
          </div>
        </div>

        {/* Deck Days */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Deck Days</p>
              <p className="text-4xl font-bold mt-2">{deckDays}</p>
              <p className="text-green-100 text-sm mt-1">deck department</p>
            </div>
            <span className="text-5xl opacity-20">🧭</span>
          </div>
        </div>

        {/* Most Recent */}
        <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-teal-100 text-sm font-medium">Most Recent</p>
              <p className="text-xl font-bold mt-2">
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
                {mostRecentPeriod?.vessel_name || 'No records'}
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
          <div className="flex items-center space-x-3">
            <button
              onClick={onAddManual}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
            >
              ✏️ Add Manual Entry
            </button>
            <button
              onClick={onRefresh}
              className="px-4 py-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              🔄 Refresh
            </button>
          </div>
        </div>

        {periods.length === 0 ? (
          <div className="text-center py-12">
            <span className="text-6xl mb-4 block">📋</span>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Sea Service Records
            </h3>
            <p className="text-gray-600 mb-6">
              Upload a sea service letter or add an entry manually to get
              started.
            </p>
            <button
              onClick={onAddManual}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              Add Your First Entry
            </button>
          </div>
        ) : (
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
        )}
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
          {period.grt && (
            <p className="text-xs text-gray-500">{period.grt} GT</p>
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
        {period.grt && period.grt >= 1600 && (
          <span className="px-2 py-1 bg-white text-gray-700 text-xs rounded border border-gray-300">
            ≥1600 GRT
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

// Component: Document Section
function DocumentSection({
  title,
  files,
  type,
  uploading,
  onUpload,
  onDelete,
  userId,
  supabase,
}: {
  title: string;
  files: any[];
  type: 'mmc' | 'sea_service';
  uploading: boolean;
  onUpload: (files: FileList | null) => void;
  onDelete: (name: string) => void;
  userId: string;
  supabase: any;
}) {
  const [downloadingFile, setDownloadingFile] = useState<string | null>(null);

  // Download file using blob method (works on mobile Safari)
  const handleDownload = async (fileName: string) => {
    try {
      setDownloadingFile(fileName);

      // Build the storage path
      const path = `${type}/${userId}/${fileName}`;

      // Download the file as a blob
      const { data, error } = await supabase.storage
        .from('documents')
        .download(path);

      if (error) throw error;

      // Create a blob URL and trigger download
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();

      // Cleanup
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
        <p className="text-gray-500 text-center py-8">No files uploaded yet</p>
      ) : (
        <div className="space-y-2">
          {files.map((file) => (
            <div
              key={file.name}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <span className="text-2xl">📄</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(file.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleDownload(file.name)}
                  disabled={downloadingFile === file.name}
                  className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 font-medium disabled:opacity-50"
                >
                  {downloadingFile === file.name
                    ? 'Downloading...'
                    : 'Download'}
                </button>
                <button
                  onClick={() => onDelete(file.name)}
                  className="px-3 py-1 text-sm text-red-600 hover:text-red-800 font-medium"
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
// Career Goals Section Component
function CareerGoalsSection({
  careerGoal,
  userId,
  onUpdate,
}: {
  careerGoal: any;
  userId: string;
  onUpdate: () => void;
}) {
  const supabase = createClient();
  const [editing, setEditing] = useState(false);
  const [selectedPrimary, setSelectedPrimary] = useState<CareerGoalType | null>(
    careerGoal?.primary_goal || null
  );
  const [selectedSecondary, setSelectedSecondary] =
    useState<CareerGoalType | null>(careerGoal?.secondary_goal || null);
  const [currentCredential, setCurrentCredential] = useState<CredentialLevel>(
    careerGoal?.current_credential || 'third_mate'
  );
  const [targetCredential, setTargetCredential] = useState<CredentialLevel>(
    careerGoal?.target_credential || 'master'
  );

  // Update state when careerGoal prop changes
  useEffect(() => {
    if (careerGoal) {
      setSelectedPrimary(careerGoal.primary_goal || null);
      setSelectedSecondary(careerGoal.secondary_goal || null);
      setCurrentCredential(careerGoal.current_credential || 'third_mate');
      setTargetCredential(careerGoal.target_credential || 'master');
    }
  }, [careerGoal]);

  const primaryGoal = CAREER_GOAL_ARCHETYPES.find(
    (g) => g.id === selectedPrimary
  );
  const secondaryGoal = CAREER_GOAL_ARCHETYPES.find(
    (g) => g.id === selectedSecondary
  );

  async function handleSave() {
    const { error } = await supabase.from('career_goals').upsert({
      user_id: userId,
      primary_goal: selectedPrimary,
      secondary_goal: selectedSecondary,
      current_credential: currentCredential,
      target_credential: targetCredential,
    });

    if (error) {
      console.error('Error saving career goal:', error);
      alert('Failed to save career goal');
    } else {
      setEditing(false);
      onUpdate();
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold">Career Goals</h2>
          <p className="text-sm text-gray-600 mt-1">
            Tell us what you're working toward so we can help you get there
          </p>
        </div>
        <button
          onClick={() => {
            if (editing) {
              handleSave();
            } else {
              setEditing(true);
            }
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
        >
          {editing ? 'Save Goals' : 'Edit Goals'}
        </button>
      </div>

      {editing ? (
        <div className="space-y-6">
          {/* Current & Target Credentials */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Credential
              </label>
              <select
                value={currentCredential}
                onChange={(e) =>
                  setCurrentCredential(e.target.value as CredentialLevel)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="third_mate">Third Mate</option>
                <option value="second_mate">Second Mate</option>
                <option value="chief_mate">Chief Mate</option>
                <option value="master">Master</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Credential
              </label>
              <select
                value={targetCredential}
                onChange={(e) =>
                  setTargetCredential(e.target.value as CredentialLevel)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="second_mate">Second Mate</option>
                <option value="chief_mate">Chief Mate</option>
                <option value="master">Master</option>
              </select>
            </div>
          </div>

          {/* Primary Goal */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Primary Goal <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {CAREER_GOAL_ARCHETYPES.map((goal) => (
                <button
                  key={goal.id}
                  onClick={() => setSelectedPrimary(goal.id)}
                  className={`text-left p-4 rounded-lg border-2 transition-all ${
                    selectedPrimary === goal.id
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl">{goal.icon}</span>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">
                        {goal.shortLabel}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {goal.description}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Secondary Goal (Optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Secondary Goal <span className="text-gray-400">(optional)</span>
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <button
                onClick={() => setSelectedSecondary(null)}
                className={`text-left p-4 rounded-lg border-2 transition-all ${
                  !selectedSecondary
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-medium text-gray-700">None</div>
              </button>
              {CAREER_GOAL_ARCHETYPES.filter(
                (g) => g.id !== selectedPrimary
              ).map((goal) => (
                <button
                  key={goal.id}
                  onClick={() => setSelectedSecondary(goal.id)}
                  className={`text-left p-4 rounded-lg border-2 transition-all ${
                    selectedSecondary === goal.id
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl">{goal.icon}</span>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">
                        {goal.shortLabel}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {goal.description}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Display Mode */}
          {!primaryGoal ? (
            <div className="text-center py-8">
              <span className="text-5xl block mb-3">🎯</span>
              <p className="text-gray-600">No career goals set yet</p>
              <button
                onClick={() => setEditing(true)}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Set Your Goals
              </button>
            </div>
          ) : (
            <>
              {/* Credentials */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Current</p>
                  <p className="font-semibold text-gray-900 capitalize">
                    {currentCredential?.replace('_', ' ')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Target</p>
                  <p className="font-semibold text-gray-900 capitalize">
                    {targetCredential?.replace('_', ' ')}
                  </p>
                </div>
              </div>

              {/* Primary Goal */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-start space-x-3">
                  <span className="text-3xl">{primaryGoal.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                        Primary
                      </span>
                      <span className="font-semibold text-gray-900">
                        {primaryGoal.label}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      {primaryGoal.description}
                    </p>
                    <div className="mt-3">
                      <p className="text-xs font-medium text-gray-700 mb-1">
                        What this means:
                      </p>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {primaryGoal.systemBehavior.map((behavior, idx) => (
                          <li key={idx}>• {behavior}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Secondary Goal */}
              {secondaryGoal && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl">{secondaryGoal.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-1 bg-gray-200 text-gray-700 text-xs font-medium rounded">
                          Secondary
                        </span>
                        <span className="font-medium text-gray-900">
                          {secondaryGoal.shortLabel}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        {secondaryGoal.description}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
