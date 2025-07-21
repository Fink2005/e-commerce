'use client';

import authRequests from '@/app/apis/requests/auth';
import { Button } from '@/components/ui/button';
import { VerifyEmailForm } from '@/components/verify-email/VerifyEmailForm';
import { CheckCircle, Loader2, XCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

type VerificationStatus = 'loading' | 'success' | 'error' | 'none';

const VerifyEmailPage = () => {
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>('none');
  const [errorMessage, setErrorMessage] = useState('');
  const searchParams = useSearchParams();
  const router = useRouter();

  const verifyEmailCode = useCallback(async (code: string) => {
    setVerificationStatus('loading');

    try {
      const success = await authRequests.verifyEmail(code);

      if (success) {
        setVerificationStatus('success');
        toast.success('Email verified successfully!');

        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      } else {
        setVerificationStatus('error');
        setErrorMessage('Invalid or expired verification code');
        toast.error('Email verification failed');
      }
    } catch (error: any) {
      setVerificationStatus('error');
      setErrorMessage(error.message || 'Verification failed');
      toast.error('Email verification failed');
    }
  }, [router]);

  useEffect(() => {
    const code = searchParams.get('code');

    if (code) {
      // If there's a verification code in URL, verify it
      verifyEmailCode(code);
    }
  }, [searchParams, verifyEmailCode]);

  // Show verification result if there's a code in URL
  if (searchParams.get('code')) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center p-4">
        <div className="w-full max-w-md mx-auto">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-8 text-center space-y-6">
            {verificationStatus === 'loading' && (
              <>
                <div className="mx-auto w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
                </div>
                <h2 className="text-2xl font-semibold text-white">Verifying your email...</h2>
                <p className="text-slate-400">Please wait while we verify your email address.</p>
              </>
            )}

            {verificationStatus === 'success' && (
              <>
                <div className="mx-auto w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-400" />
                </div>
                <h2 className="text-2xl font-semibold text-white">Email verified successfully!</h2>
                <p className="text-slate-400">
                  Your email has been verified. You will be redirected to login in a few seconds.
                </p>
                <Button
                  onClick={() => router.push('/login')}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  Continue to Login
                </Button>
              </>
            )}

            {verificationStatus === 'error' && (
              <>
                <div className="mx-auto w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center">
                  <XCircle className="w-8 h-8 text-red-400" />
                </div>
                <h2 className="text-2xl font-semibold text-white">Verification failed</h2>
                <p className="text-slate-400">{errorMessage}</p>
                <div className="space-y-3">
                  <Button
                    onClick={() => router.push('/verify-email')}
                    variant="outline"
                    className="w-full border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
                  >
                    Request new verification email
                  </Button>
                  <Link href="/login">
                    <Button
                      variant="ghost"
                      className="w-full text-slate-300 hover:text-white hover:bg-slate-700"
                    >
                      Back to login
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Show normal verify email form if no code in URL
  return (
    <div>
      <VerifyEmailForm />
    </div>
  );
};

export default VerifyEmailPage;
