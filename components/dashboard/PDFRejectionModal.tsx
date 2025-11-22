// components/dashboard/PDFRejectionModal.tsx
'use client';

interface PDFRejectionModalProps {
  isOpen: boolean;
  fileName: string;
  onClose: () => void;
  onManualEntry: () => void;
  onReupload: () => void;
}

export default function PDFRejectionModal({
  isOpen,
  fileName,
  onClose,
  onManualEntry,
  onReupload,
}: PDFRejectionModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-4xl">📄</span>
              <div>
                <h2 className="text-xl font-bold">PDF Uploaded</h2>
                <p className="text-amber-100 text-sm mt-1">File saved to documents</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* File Info */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">📎</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {fileName}
                </p>
                <p className="text-xs text-gray-500">Stored in your documents</p>
              </div>
              <span className="text-green-600 text-xl">✓</span>
            </div>
          </div>

          {/* Warning Message */}
          <div className="mb-6 p-4 bg-amber-50 border-l-4 border-amber-500 rounded">
            <div className="flex items-start space-x-3">
              <span className="text-amber-600 text-xl flex-shrink-0">⚠️</span>
              <div>
                <h3 className="font-semibold text-amber-900 mb-1">
                  Automatic Processing Not Available
                </h3>
                <p className="text-sm text-amber-800">
                  We currently cannot process PDF files automatically. Your file has been saved, 
                  but you'll need to either:
                </p>
              </div>
            </div>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {/* Option 1: Manual Entry */}
            <button
              onClick={() => {
                onClose();
                onManualEntry();
              }}
              className="w-full p-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-all shadow-lg hover:shadow-xl group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">✏️</span>
                  <div className="text-left">
                    <p className="font-semibold">Enter Data Manually</p>
                    <p className="text-sm text-blue-100">
                      I'll fill in the sea service details
                    </p>
                  </div>
                </div>
                <span className="text-white group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </button>

            {/* Option 2: Re-upload */}
            <button
              onClick={() => {
                onClose();
                onReupload();
              }}
              className="w-full p-4 bg-white hover:bg-gray-50 border-2 border-gray-300 hover:border-blue-400 rounded-lg transition-all group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">📸</span>
                  <div className="text-left">
                    <p className="font-semibold text-gray-900">Upload as Image</p>
                    <p className="text-sm text-gray-600">
                      Convert PDF to .png or .jpeg and re-upload
                    </p>
                  </div>
                </div>
                <span className="text-blue-600 group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </button>

            {/* Option 3: Close */}
            <button
              onClick={onClose}
              className="w-full py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              I'll do this later
            </button>
          </div>

          {/* Helpful Tip */}
          <div className="mt-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start space-x-2">
              <span className="text-blue-600">💡</span>
              <p className="text-xs text-blue-800">
                <strong>Tip:</strong> To convert a PDF to an image, take a screenshot 
                of the document on your device or use a free PDF-to-PNG converter online.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}