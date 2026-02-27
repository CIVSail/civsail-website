'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const router = useRouter();
  const supabase = createClient();

  // Form data state
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    ref_number: '',
    mmc_exp: '',
    medical_exp: '',
    passport_exp: '',
    twic_exp: '',
    license_exp: '',
  });

  // File upload state
  const [mmcFile, setMmcFile] = useState<File | null>(null);
  const [seaServiceFiles, setSeaServiceFiles] = useState<File[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleNext = () => {
    // Validate current step before proceeding
    if (currentStep === 1) {
      if (!formData.full_name || !formData.phone) {
        setError('Please fill out all required fields');
        return;
      }
    }
    if (currentStep === 2) {
      if (!formData.ref_number || !formData.mmc_exp || !formData.medical_exp) {
        setError('Please fill out required credential information');
        return;
      }
    }

    setError('');
    setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    setError('');
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🚀 handleSubmit called, currentStep:', currentStep);

    // Only allow submit on Step 3
    if (currentStep !== 3) {
      console.log('⚠️ Not on step 3, blocking submit');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Not authenticated');
      }

      // Save profile data
      const { error: profileError } = await supabase.from('profiles').upsert(
        {
          user_id: user.id,
          full_name: formData.full_name,
          phone: formData.phone,
          email: user.email,
          ref_number: formData.ref_number,
          mmc_exp: formData.mmc_exp || null,
          medical_exp: formData.medical_exp || null,
          passport_exp: formData.passport_exp || null,
          twic_exp: formData.twic_exp || null,
          license_exp: formData.license_exp || null,
        },
        { onConflict: 'user_id' }
      );

      if (profileError) throw profileError;

      // Upload MMC file if provided
      if (mmcFile) {
        const mmcPath = `mmc/${user.id}/${mmcFile.name}`;
        const { error: mmcUploadError } = await supabase.storage
          .from('documents')
          .upload(mmcPath, mmcFile, { upsert: true });

        if (mmcUploadError) console.error('MMC upload error:', mmcUploadError);
      }

      // Upload sea service files if provided
      for (const file of seaServiceFiles) {
        const seaPath = `sea_service/${user.id}/${file.name}`;
        const { error: seaUploadError } = await supabase.storage
          .from('documents')
          .upload(seaPath, file, { upsert: true });

        if (seaUploadError)
          console.error('Sea service upload error:', seaUploadError);
      }

      console.log('✅ Profile saved successfully');
      // Redirect to dashboard
      router.push('/dashboard');
    } catch (err: any) {
      console.error('❌ Submit error:', err);
      setError(err.message || 'Failed to save profile');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Logo */}
        <div className="text-center mb-8">
          <Image
            src="/CIVSail-Logo-Crop.png"
            alt="CIVSail"
            width={200}
            height={50}
            className="mx-auto mb-4"
          />
          <h1 className="text-3xl font-bold text-gray-900">
            Complete Your Profile
          </h1>
          <p className="text-gray-600 mt-2">
            Let's get your maritime credentials organized
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                    currentStep >= step
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {step}
                </div>
                {step < 3 && (
                  <div
                    className={`w-16 h-1 transition-colors ${
                      currentStep > step ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-2">
            <p className="text-sm text-gray-600">Step {currentStep} of 3</p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Step 1: Personal Info */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Personal Information
                </h2>

                <div>
                  <label
                    htmlFor="full_name"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="full_name"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="555-123-4567"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Include area code
                  </p>
                </div>
              </div>
            )}

            {/* Step 2: Credentials */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Credential Information
                </h2>

                <div>
                  <label
                    htmlFor="ref_number"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Mariner Reference Number *
                  </label>
                  <input
                    type="text"
                    id="ref_number"
                    name="ref_number"
                    value={formData.ref_number}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="123456789"
                  />
                </div>

                <div>
                  <label
                    htmlFor="mmc_exp"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    MMC Expiration Date *
                  </label>
                  <input
                    type="date"
                    id="mmc_exp"
                    name="mmc_exp"
                    value={formData.mmc_exp}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="medical_exp"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Medical Certificate Expiration *
                  </label>
                  <input
                    type="date"
                    id="medical_exp"
                    name="medical_exp"
                    value={formData.medical_exp}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="passport_exp"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Passport Expiration (Optional)
                  </label>
                  <input
                    type="date"
                    id="passport_exp"
                    name="passport_exp"
                    value={formData.passport_exp}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="twic_exp"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    TWIC Expiration (Optional)
                  </label>
                  <input
                    type="date"
                    id="twic_exp"
                    name="twic_exp"
                    value={formData.twic_exp}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="license_exp"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Driver's License Expiration (Optional)
                  </label>
                  <input
                    type="date"
                    id="license_exp"
                    name="license_exp"
                    value={formData.license_exp}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            )}

            {/* Step 3: File Uploads */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Upload Documents (Optional)
                </h2>
                <p className="text-gray-600 mb-6">
                  You can upload these now or add them later from your
                  dashboard.
                </p>

                <div>
                  <label
                    htmlFor="mmc_upload"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    MMC Document (Photo or PDF)
                  </label>
                  <input
                    type="file"
                    id="mmc_upload"
                    accept="image/*,application/pdf"
                    onChange={(e) => setMmcFile(e.target.files?.[0] || null)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {mmcFile && (
                    <div className="mt-2 flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <span className="text-green-600">✓</span>
                        <span className="text-sm font-medium text-gray-900">
                          {mmcFile.name}
                        </span>
                        <span className="text-xs text-gray-500">
                          ({(mmcFile.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setMmcFile(null);
                          // Reset the file input
                          const input = document.getElementById(
                            'mmc_upload'
                          ) as HTMLInputElement;
                          if (input) input.value = '';
                        }}
                        className="text-red-600 hover:text-red-800 transition-colors px-2 py-1"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="sea_service_upload"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Sea Service Letters (Multiple files allowed)
                  </label>
                  <input
                    type="file"
                    id="sea_service_upload"
                    accept="application/pdf,image/*"
                    multiple
                    onChange={(e) =>
                      setSeaServiceFiles(Array.from(e.target.files || []))
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {seaServiceFiles.length > 0 && (
                    <div className="mt-2 space-y-2">
                      {seaServiceFiles.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg"
                        >
                          <div className="flex items-center space-x-2">
                            <span className="text-green-600">✓</span>
                            <span className="text-sm font-medium text-gray-900">
                              {file.name}
                            </span>
                            <span className="text-xs text-gray-500">
                              ({(file.size / 1024 / 1024).toFixed(2)} MB)
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const newFiles = seaServiceFiles.filter(
                                (_, i) => i !== index
                              );
                              setSeaServiceFiles(newFiles);
                              // If no files left, reset the input
                              if (newFiles.length === 0) {
                                const input = document.getElementById(
                                  'sea_service_upload'
                                ) as HTMLInputElement;
                                if (input) input.value = '';
                              }
                            }}
                            className="text-red-600 hover:text-red-800 transition-colors px-2 py-1"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={loading}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Back
                </button>
              )}

              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log(
                      '🔵 Next button clicked, current step:',
                      currentStep
                    );
                    handleNext();
                  }}
                  className="ml-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Next
                </button>
              ) : (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log(
                      '🟢 Complete Setup clicked, current step:',
                      currentStep
                    );
                    handleSubmit(e);
                  }}
                  disabled={loading}
                  className="ml-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Complete Setup'}
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Skip Option */}
        {currentStep > 1 && (
          <div className="text-center mt-6">
            <button
              onClick={(e) => {
                setCurrentStep(3);
                handleSubmit(e);
              }}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
            Skip for now →
          </button>
        </div>
        )}
      </div>
    </div>
  );
}
