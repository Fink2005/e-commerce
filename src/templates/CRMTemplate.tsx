import React from 'react';

interface CRMLayoutProps {
  children: React.ReactNode;
}

export default function CRMLayout({ children }: CRMLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Full width container for CRM */}
      <div className="w-full">
        {children}
      </div>
    </div>
  );
}
