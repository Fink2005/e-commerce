'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, BarChart3 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function StatsPage() {
  const router = useRouter();

  // Mock data - in real app this would come from API
  const userData = {
    totalOrders: 12,
    createdAt: '2023-01-15T00:00:00Z',
    role: 'premium',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto bg-white min-h-screen">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" size="sm" onClick={() => router.back()} className="p-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold text-gray-900">Account Statistics</h1>
          </div>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Account Statistics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Total Orders</span>
                <span className="font-medium">{userData.totalOrders}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Member Since</span>
                <span className="font-medium">{new Date(userData.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-gray-600">Account Type</span>
                <span className="font-medium capitalize">{userData.role}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
