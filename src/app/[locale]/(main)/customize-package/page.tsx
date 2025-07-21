'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { ArrowLeft, Monitor, Phone, PhoneCall, ShieldCheck, Wifi } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

export default function CustomizePackage() {
  const router = useRouter();
  const [mobileDataGb, setMobileDataGb] = useState(20);
  const [broadbandMbps, setBroadbandMbps] = useState(100);
  const [isStreamingChecked, setIsStreamingChecked] = useState(false);
  const [isSecurityChecked, setIsSecurityChecked] = useState(false);
  const [isInternationalChecked, setIsInternationalChecked] = useState(false);

  const basePlanCost = 45;
  const mobileDataPricePerGb = 1;
  const broadbandPricePerMbps = 0.25;
  const addOnPrice = 10;

  const currentMobileDataCost = mobileDataGb * mobileDataPricePerGb;
  const currentBroadbandCost = broadbandMbps * broadbandPricePerMbps;
  const currentAddOnsCost
    = (isStreamingChecked ? addOnPrice : 0)
      + (isSecurityChecked ? addOnPrice : 0)
      + (isInternationalChecked ? addOnPrice : 0);

  const newTotalMonthly = useMemo(() => {
    return basePlanCost + currentMobileDataCost + currentBroadbandCost + currentAddOnsCost;
  }, [currentMobileDataCost, currentBroadbandCost, currentAddOnsCost]);

  const currentPlanCost = 110;
  const costDifference = newTotalMonthly - currentPlanCost;

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
      <div className="flex items-center gap-4 pb-4 mb-4 border-b border-gray-200">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleBack}>
          <ArrowLeft className="h-5 w-5" />
          <span className="sr-only">Back</span>
        </Button>
        <h1 className="text-xl font-semibold text-gray-900">Customize Package</h1>
      </div>
      <div className="flex-1 space-y-6 max-w-md mx-auto w-full">
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-gray-900">Current Usage</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <div className="font-medium text-gray-900 mb-2">My Plan</div>
              <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
                <div>Mobile Data</div>
                <div className="text-right font-medium">20 GB</div>
                <div>Broadband Speed</div>
                <div className="text-right font-medium">100 Mbps</div>
                <div>Monthly Cost</div>
                <div className="text-right font-medium">$110.00</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2 text-gray-900">
              <Phone className="h-5 w-5" />
              Mobile Data
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="mobile-data-amount" className="text-gray-900">
                  Data Amount
                </Label>
                <span className="font-medium text-gray-900">
                  {mobileDataGb}
                  GB
                </span>
              </div>
              <Slider
                id="mobile-data-amount"
                min={5}
                max={100}
                step={5}
                value={[mobileDataGb]}
                onValueChange={([value]) => setMobileDataGb(value ?? 0)}
                className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>5GB</span>
                <span>100GB</span>
              </div>
              <p className="text-sm text-gray-600">
                Additional data: +$
                {mobileDataPricePerGb}
                /GB
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2 text-gray-900">
              <Wifi className="h-5 w-5" />
              Broadband Data
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="broadband-data-amount" className="text-gray-900">
                  Data Amount
                </Label>
                <span className="font-medium text-gray-900">
                  {broadbandMbps}
                  Mbps
                </span>
              </div>
              <Slider
                id="broadband-data-amount"
                min={25}
                max={500}
                step={25}
                value={[broadbandMbps]}
                onValueChange={([value]) => setBroadbandMbps(value ?? 0)}
                className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>25Mbps</span>
                <span>500Mbps</span>
              </div>
              <p className="text-sm text-gray-600">
                Additional speed: +$
                {broadbandPricePerMbps}
                /Mbps
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-gray-900">Add-ons</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200">
              <div className="flex items-center gap-3">
                <Monitor className="h-5 w-5 text-gray-600" />
                <div>
                  <div className="font-medium text-gray-900">Streaming Package</div>
                  <div className="text-sm text-gray-600">Netflix, Disney+, Prime Video</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-900">
                  +$
                  {addOnPrice}
                </span>
                <Checkbox
                  id="streaming"
                  checked={isStreamingChecked}
                  onCheckedChange={checked => setIsStreamingChecked(checked === true)}
                />
              </div>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-gray-600" />
                <div>
                  <div className="font-medium text-gray-900">Security Suite</div>
                  <div className="text-sm text-gray-600">Antivirus, VPN, Parental Controls</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-900">
                  +$
                  {addOnPrice}
                </span>
                <Checkbox
                  id="security"
                  checked={isSecurityChecked}
                  onCheckedChange={checked => setIsSecurityChecked(checked === true)}
                />
              </div>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200">
              <div className="flex items-center gap-3">
                <PhoneCall className="h-5 w-5 text-gray-600" />
                <div>
                  <div className="font-medium text-gray-900">International Calls</div>
                  <div className="text-sm text-gray-600">Unlimited calls to 50+ countries</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-900">
                  +$
                  {addOnPrice}
                </span>
                <Checkbox
                  id="international"
                  checked={isInternationalChecked}
                  onCheckedChange={checked => setIsInternationalChecked(checked === true)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-gray-900">New Package Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="bg-green-50 p-4 rounded-lg border border-green-100">
              <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
                <div>Base Plan</div>
                <div className="text-right font-medium">
                  $
                  {basePlanCost}
                </div>
                <div>
                  Mobile Data (
                  {mobileDataGb}
                  {' '}
                  GB)
                </div>
                <div className="text-right font-medium">
                  +$
                  {currentMobileDataCost}
                </div>
                <div>
                  Broadband (
                  {broadbandMbps}
                  {' '}
                  Mbps)
                </div>
                <div className="text-right font-medium">
                  +$
                  {currentBroadbandCost}
                </div>
                {isStreamingChecked && (
                  <>
                    <div>Streaming Package</div>
                    <div className="text-right font-medium">
                      +$
                      {addOnPrice}
                    </div>
                  </>
                )}
                {isSecurityChecked && (
                  <>
                    <div>Security Suite</div>
                    <div className="text-right font-medium">
                      +$
                      {addOnPrice}
                    </div>
                  </>
                )}
                {isInternationalChecked && (
                  <>
                    <div>International Calls</div>
                    <div className="text-right font-medium">
                      +$
                      {addOnPrice}
                    </div>
                  </>
                )}
                <div className="col-span-2 border-t border-gray-200 pt-2 mt-2" />
                <div className="font-bold text-gray-900">Total Monthly</div>
                <div className="text-right font-bold text-gray-900">
                  $
                  {newTotalMonthly}
                </div>
                <div className="text-sm text-gray-600">
                  Current: $
                  {currentPlanCost}
                  .00
                </div>
                <div
                  className={`text-right text-sm font-medium ${costDifference < 0 ? 'text-green-600' : 'text-red-600'}`}
                >
                  {costDifference < 0 ? `-$${Math.abs(costDifference)}` : `+$${costDifference}`}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="mt-6 space-y-3 max-w-md mx-auto w-full">
        <Button className="w-full h-12 text-base font-medium bg-red-600 hover:bg-red-700 text-white">
          Update Package - $
          {newTotalMonthly}
          /month
        </Button>
        <Button
          variant="outline"
          className="w-full h-12 text-base font-medium border-2 border-gray-200 text-gray-700 hover:bg-gray-50 bg-transparent"
          onClick={handleBack}
        >
          Cancel Changes
        </Button>
      </div>
    </div>
  );
}
