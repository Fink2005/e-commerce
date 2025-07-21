'use client';

import type React from 'react';

import authRequests from '@/app/apis/requests/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, CheckCircle, Mail } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await authRequests.forgotPassword(email);
      setIsEmailSent(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send reset email. Please try again.';
      setError(errorMessage);
      console.error('❌ Failed to send forgot password email:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendEmail = async () => {
    if (!email) {
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await authRequests.forgotPassword(email);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to resend email. Please try again.';
      setError(errorMessage);
      console.error('❌ Failed to resend forgot password email:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isEmailSent) {
    return (
      <div className="space-y-6">
        {/* Success State */}
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-green-600/20 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
          <h2 className="text-2xl font-semibold text-white">Check your email</h2>
          <p className="text-slate-400 text-sm leading-relaxed">We've sent a password reset link to</p>
          <p className="text-white font-medium">{email}</p>
        </div>

        {/* Instructions */}
        <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/30">
          <p className="text-slate-300 text-sm leading-relaxed">
            Click the link in your email to reset your password. The link will expire in 15 minutes.
          </p>
        </div>

        {/* Show error if resend fails */}
        {error && (
          <div className="bg-red-600/10 border border-red-600/20 rounded-lg p-3">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-4">
          <Button
            onClick={handleResendEmail}
            disabled={isLoading}
            variant="outline"
            className="w-full bg-transparent border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white disabled:opacity-50"
          >
            {isLoading ? 'Sending...' : 'Resend email'}
          </Button>

          <Link href="/login">
            <Button variant="ghost" className="w-full text-slate-300 hover:text-white hover:bg-slate-700">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to login
            </Button>
          </Link>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-slate-400 text-sm">
            Didn't receive the email? Check your spam folder or
            {' '}
            <Link href="/support" className="text-white hover:underline">
              contact support
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="mx-auto w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mb-4">
          <Mail className="w-8 h-8 text-slate-300" />
        </div>
        <h2 className="text-2xl font-semibold text-white">Reset your password</h2>
        <p className="text-slate-400">Enter your email address and we'll send you a reset link</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError('');
            }}
            className="bg-transparent border-slate-600 text-white placeholder:text-slate-400 focus:border-slate-400"
            disabled={isLoading}
          />
          {error && (
            <div className="bg-red-600/10 border border-red-600/20 rounded-lg p-3 mt-2">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}
        </div>

        <Button
          type="submit"
          disabled={isLoading || !email}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-medium disabled:opacity-50"
        >
          {isLoading ? 'Sending reset link...' : 'Send reset link'}
        </Button>
      </form>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-600"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-slate-800 text-slate-400">OR</span>
        </div>
      </div>

      {/* Back to Login */}
      <Link href="/login">
        <Button variant="ghost" className="w-full text-slate-300 hover:text-white hover:bg-slate-700">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to login
        </Button>
      </Link>

      {/* Footer Links */}
      <div className="text-center space-y-2">
        <p className="text-slate-400 text-sm">
          Remember your password?
          {' '}
          <Link href="/login" className="text-white hover:underline">
            Sign in
          </Link>
        </p>
        <p className="text-slate-400 text-sm">
          Don't have an account?
          {' '}
          <Link href="/register" className="text-white hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
