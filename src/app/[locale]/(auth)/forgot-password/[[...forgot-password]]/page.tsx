'use client';

import { ForgotPasswordForm } from '@/components/forgot-password/ForgotPasswordForm';

const ForgotPasswordPage = () => {
  return (
    <div className="flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-black/50 border-none backdrop-blur-sm font-inter rounded-2xl p-8 shadow-2xl">
          <ForgotPasswordForm />
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
