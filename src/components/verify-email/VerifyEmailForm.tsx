'use client';

import authRequests from '@/app/apis/requests/auth';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Mail, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

interface VerifyEmailFormProps {
  email?: string;
}

export function VerifyEmailForm({ email: propEmail }: VerifyEmailFormProps) {
  const [isResending, setIsResending] = useState(false);
  const [resent, setResent] = useState(false);
  const searchParams = useSearchParams();

  // Use useMemo to compute the email and user status
  const { currentEmail, isNewUser } = useMemo(() => {
    const emailFromParams = searchParams.get('email');
    const email = emailFromParams || propEmail || '';
    const isNew = !!emailFromParams;

    return {
      currentEmail: email,
      isNewUser: isNew
    };
  }, [searchParams, propEmail]);

  const handleResendEmail = async () => {
    if (!currentEmail) {
      toast.error('Please provide a valid email address');
      return;
    }

    setIsResending(true);
    try {
      const success = await authRequests.sendConfirmationEmail(currentEmail);

      if (success) {
        setResent(true);
        toast.success('Verification email sent successfully!');
        setTimeout(() => setResent(false), 5000);
      } else {
        toast.error('Failed to send verification email. Please try again.');
      }
    } catch (error) {
      console.error('Error sending confirmation email:', error);
      toast.error('Failed to send verification email. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto">
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="mx-auto w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mb-4">
              <Mail className="w-8 h-8 text-slate-300" />
            </div>
            <h2 className="text-2xl font-semibold text-white">
              {isNewUser ? 'Welcome! Verify your email' : 'Verify your email'}
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              {isNewUser
                ? 'Thanks for signing up! We\'ve sent a verification link to'
                : 'We\'ve sent a verification link to'}
            </p>
            {currentEmail && (
              <p className="text-white font-medium break-all">{currentEmail}</p>
            )}
          </div>

          {/* Instructions */}
          <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/30">
            <p className="text-slate-300 text-sm leading-relaxed">
              {isNewUser
                ? 'To complete your registration, click the verification link in your email. If you don\'t see the email, check your spam folder.'
                : 'Click the link in your email to verify your account. If you don\'t see the email, check your spam folder.'}
            </p>
          </div>

          {/* Resend Button */}
          {currentEmail && (
            <div className="space-y-4">
              <Button
                onClick={handleResendEmail}
                disabled={isResending}
                variant="outline"
                className="w-full bg-transparent border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white disabled:opacity-50"
              >
                {isResending ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4 mr-2" />
                    Resend verification email
                  </>
                )}
              </Button>

              {resent && (
                <p className="text-green-400 text-sm text-center">
                  ✅ Verification email sent successfully! Check your inbox.
                </p>
              )}
            </div>
          )}

          {/* No email provided */}
          {!currentEmail && (
            <div className="text-center text-yellow-400">
              <p className="text-sm">No email address provided</p>
            </div>
          )}

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-900 text-slate-400">OR</span>
            </div>
          </div>

          {/* Back to Login/Register */}
          <div className="space-y-2">
            <Link href="/login">
              <Button variant="ghost" className="w-full text-slate-300 hover:text-white hover:bg-slate-700">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to login
              </Button>
            </Link>

            {/* Footer Links */}
            <div className="text-center space-y-1">
              <p className="text-slate-400 text-sm">
                Wrong email address?
                {' '}
                <Link href="/register" className="text-white hover:underline">
                  Sign up again
                </Link>
              </p>
              {isNewUser && (
                <p className="text-slate-400 text-sm">
                  Already have an account?
                  {' '}
                  <Link href="/login" className="text-white hover:underline">
                    Sign in
                  </Link>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
