'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Phone, Wifi } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function UsagePage() {
  const router = useRouter();

  // Mock data - in real app this would come from API
  const mobileData = 15;
  const broadbandData = 350;
  const packageType = 'Premium Package';

  const mobileUsagePercent = Math.round((mobileData / 20) * 100);
  const broadbandUsagePercent = Math.round((broadbandData / 500) * 100);

  const handleCustomizePackage = () => {
    router.push('/customize-package');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto bg-white min-h-screen">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" size="sm" onClick={() => router.back()} className="p-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold text-gray-900">Current Usage</h1>
          </div>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Current Usage
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500 rounded-lg">
                      <Phone className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Mobile Data</div>
                      <div className="text-sm text-gray-600">
                        {mobileData}
                        {' '}
                        GB used of 20GB
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-blue-600">
                      {mobileUsagePercent}
                      %
                    </div>
                  </div>
                </div>
                <Progress value={mobileUsagePercent} className="h-3 bg-blue-100" />
              </div>

              <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-500 rounded-lg">
                      <Wifi className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Broadband</div>
                      <div className="text-sm text-gray-600">
                        {broadbandData}
                        GB used of 500GB
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600">
                      {broadbandUsagePercent}
                      %
                    </div>
                  </div>
                </div>
                <Progress value={broadbandUsagePercent} className="h-3 bg-green-100" />
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="text-sm text-gray-600">Current Package</div>
                <div className="font-medium text-gray-900">{packageType}</div>
              </div>

              <Button
                variant="outline"
                className="w-full h-12 text-base font-medium border-2 border-red-200 text-red-600 hover:bg-red-50 bg-transparent"
                onClick={handleCustomizePackage}
              >
                Customize Package
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
