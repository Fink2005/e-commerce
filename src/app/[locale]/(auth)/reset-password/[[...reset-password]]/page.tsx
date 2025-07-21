'use client';

import authRequests from '@/app/apis/requests/auth';
import { ResetPasswordForm } from '@/components/forgot-password/ResetPasswordForm';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const ResetPasswordPage = () => {
  const searchParams = useSearchParams();
  const code = searchParams.get('code'); // Get the verification code from URL
  const [isCodeValid, setIsCodeValid] = useState<boolean | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  // Verify the reset code when component mounts and code exists
  useEffect(() => {
    const verifyCode = async () => {
      if (!code) {
        setIsCodeValid(false);
        return;
      }

      setIsVerifying(true);
      try {
        await authRequests.verifyPasswordResetCode(code);
        setIsCodeValid(true);
      } catch (error) {
        setIsCodeValid(false);
        console.error('❌ Invalid or expired reset code:', error);
      } finally {
        setIsVerifying(false);
      }
    };

    verifyCode();
  }, [code]);

  // Show loading while verifying code
  if (isVerifying) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-black/50 border-none backdrop-blur-sm font-inter rounded-2xl p-8 shadow-2xl">
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mb-4">
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
              <h2 className="text-xl font-semibold text-white">Verifying reset link...</h2>
              <p className="text-slate-400">Please wait while we verify your reset link.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error if code is invalid or missing
  if (!code || isCodeValid === false) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-slate-800 rounded-2xl p-8 shadow-2xl border border-slate-700">
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-white">Invalid reset link</h2>
              <p className="text-slate-400">
                {!code
                  ? 'No reset code provided. Please use the link from your email.'
                  : 'This password reset link is invalid or has expired.'}
              </p>
              <div className="space-y-3 mt-6">
                <Link
                  href="/forgot-password"
                  className="inline-block w-full px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-center"
                >
                  Request new reset link
                </Link>
                <Link
                  href="/login"
                  className="inline-block w-full px-6 py-3 bg-transparent border border-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors text-center"
                >
                  Back to login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show reset password form if code is valid
  return (
    <div className="flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-black/50 border-none backdrop-blur-sm font-inter rounded-2xl p-8 shadow-2xl">
          <ResetPasswordForm code={code} />
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
