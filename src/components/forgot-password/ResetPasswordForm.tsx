'use client';

import type React from 'react';

import authRequests from '@/app/apis/requests/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckCircle, Eye, EyeOff, Lock } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

interface ResetPasswordFormProps {
  code: string;
}

export function ResetPasswordForm({ code }: ResetPasswordFormProps) {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords don\'t match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      await authRequests.setNewPassword(formData.password, code);
      setIsSuccess(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to reset password. Please try again.';
      setErrors({ general: errorMessage });
      console.error('❌ Failed to reset password:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    // Clear general errors when user starts typing
    if (errors.general) {
      setErrors(prev => ({ ...prev, general: '' }));
    }
  };

  if (isSuccess) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-green-600/20 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
          <h2 className="text-2xl font-semibold text-white">Password reset successful</h2>
          <p className="text-slate-400">Your password has been successfully reset. You can now log in with your new password.</p>
        </div>

        <Link href="/login">
          <Button className="w-full bg-red-600 hover:bg-red-700 text-white font-medium">
            Continue to login
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="mx-auto w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mb-4">
          <Lock className="w-8 h-8 text-slate-300" />
        </div>
        <h2 className="text-2xl font-semibold text-white">Set new password</h2>
        <p className="text-slate-400">Enter your new password below</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {errors.general && (
          <div className="bg-red-600/10 border border-red-600/20 rounded-lg p-3">
            <p className="text-red-400 text-sm">{errors.general}</p>
          </div>
        )}

        <div>
          <div className="relative">
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="New Password"
              value={formData.password}
              onChange={e => handleInputChange('password', e.target.value)}
              className="bg-transparent border-slate-600 text-white placeholder:text-slate-400 focus:border-slate-400 pr-10"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password}</p>}
        </div>

        <div>
          <div className="relative">
            <Input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm New Password"
              value={formData.confirmPassword}
              onChange={e => handleInputChange('confirmPassword', e.target.value)}
              className="bg-transparent border-slate-600 text-white placeholder:text-slate-400 focus:border-slate-400 pr-10"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300"
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.confirmPassword && <p className="text-red-400 text-sm mt-1">{errors.confirmPassword}</p>}
        </div>

        {/* Password Requirements */}
        <div className="bg-slate-700/30 rounded-lg p-3 border border-slate-600/30">
          <p className="text-slate-300 text-xs mb-2">Password must contain:</p>
          <ul className="text-slate-400 text-xs space-y-1 list-none">
            <li className={formData.password.length >= 8 ? 'text-green-400' : ''}>
              At least 8 characters
            </li>
            <li className={/[A-Z]/.test(formData.password) ? 'text-green-400' : ''}>
              One uppercase letter
            </li>
            <li className={/[a-z]/.test(formData.password) ? 'text-green-400' : ''}>
              One lowercase letter
            </li>
            <li className={/\d/.test(formData.password) ? 'text-green-400' : ''}>
              One number
            </li>
          </ul>
        </div>

        <Button
          type="submit"
          disabled={isLoading || !formData.password || !formData.confirmPassword}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-medium disabled:opacity-50"
        >
          {isLoading ? 'Updating password...' : 'Update password'}
        </Button>
      </form>

      {/* Footer */}
      <div className="text-center">
        <p className="text-slate-400 text-sm">
          Remember your password?
          {' '}
          <Link href="/login" className="text-white hover:underline">
            Back to login
          </Link>
        </p>
      </div>
    </div>
  );
}
