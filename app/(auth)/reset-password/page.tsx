import { Suspense } from 'react';
import ResetPasswordClient from './reset-password-client';

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center text-sm text-gray-600">
            Loading password reset...
          </div>
        </div>
      }
    >
      <ResetPasswordClient />
    </Suspense>
  );
}
