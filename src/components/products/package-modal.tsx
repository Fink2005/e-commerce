'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import type { Product } from '@/types/product';
import { Clock, HardDrive, MessageSquare, Router, ShoppingCart, Smartphone, Star, Tablet, Zap } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

interface PackageModalProps {
  product: Product | null;
  isOpen: boolean;
  onCloseAction: () => void;
}

export function PackageModal({ product, isOpen, onCloseAction }: PackageModalProps) {
  const [selectedPlan, setSelectedPlan] = useState('default');
  const [selectedUsageProfile, setSelectedUsageProfile] = useState('mediumUser');
  const [customPlan, setCustomPlan] = useState<any>({});
  const [selectedDevices, setSelectedDevices] = useState<any>({});
  const [selectedCombination, setSelectedCombination] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');

  if (!product || product.type !== 'package') {
    return null;
  }

  const isComboPackage = product.packageType === 'DoublePackage' || product.packageType === 'TriplePackage';

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
    ));
  };

  const calculateCustomPrice = (product: Product, plan: any) => {
    let totalPrice = 0;

    if (product.customizable?.minutes && plan.minutes !== 'unlimited') {
      totalPrice += (plan.minutes || 0) * product.customizable.minutes.price;
    } else if (plan.minutes === 'unlimited' && product.customizable?.minutes?.unlimited) {
      totalPrice += product.customizable.minutes.unlimited;
    }

    if (product.customizable?.sms && plan.sms !== 'unlimited') {
      totalPrice += (plan.sms || 0) * product.customizable.sms.price;
    } else if (plan.sms === 'unlimited' && product.customizable?.sms?.unlimited) {
      totalPrice += product.customizable.sms.unlimited;
    }

    if (product.customizable?.data && plan.data !== 'unlimited') {
      totalPrice += (plan.data || 0) * product.customizable.data.price;
    } else if (plan.data === 'unlimited' && product.customizable?.data?.unlimited) {
      totalPrice += product.customizable.data.unlimited;
    }

    if (product.customizable?.speed) {
      totalPrice += (plan.speed || 0) * product.customizable.speed.price;
    }

    return totalPrice;
  };

  const handleOpen = (open: boolean) => {
    if (!open) {
      onCloseAction();
    } else {
      // Initialize when opening
      if (product.usageRecommendation?.mediumUser) {
        setCustomPlan(product.usageRecommendation.mediumUser);
      }
      if (product.includedDevices && product.includedDevices.length > 0) {
        const defaultDevice: any = {};
        defaultDevice[product.packageType || ''] = product.includedDevices[0]?.name || '';
        setSelectedDevices(defaultDevice);
      }
      if (product.availableCombinations && product.availableCombinations.length > 0) {
        setSelectedCombination(product.availableCombinations[0]?.name || '');
      }
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleOpen}>
      <SheetContent side="right" className="w-full overflow-y-auto p-4">
        <SheetHeader>
          <SheetTitle className="text-lg">{product.name}</SheetTitle>
          <SheetDescription>
            {isComboPackage ? 'Choose your combination and customize' : 'Customize your package'}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Product Header */}
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <Image
              src={product.image || '/placeholder.svg'}
              alt={product.name}
              width={60}
              height={60}
              className="rounded-lg"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-base">{product.name}</h3>
              <div className="flex items-center space-x-1 mt-1">
                {renderStars(product.rating)}
                <span className="text-sm text-gray-600">
                  (
                  {product.reviews}
                  )
                </span>
              </div>
              <div className="flex items-center space-x-2 mt-1">
                <span className="font-bold text-lg text-red-600">
                  $
                  {product.price}
                  /month
                </span>
                {product.originalPrice && (
                  <span className="text-gray-500 line-through text-sm">
                    $
                    {product.originalPrice}
                  </span>
                )}
              </div>
            </div>
          </div>

          <Tabs defaultValue="customize" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="customize">Customize Package</TabsTrigger>
              <TabsTrigger value="usage">Usage Based</TabsTrigger>
            </TabsList>

            <TabsContent value="customize" className="space-y-6 mt-6">
              {isComboPackage ? (
                // Combo Package Configuration
                <div className="space-y-6">
                  <div>
                    <Label className="text-base font-semibold">Choose Combination</Label>
                    <RadioGroup value={selectedCombination} onValueChange={setSelectedCombination} className="mt-3">
                      {product.availableCombinations?.map(combo => (
                        <Card key={combo.name} className="p-4">
                          <div className="flex items-center space-x-3">
                            <RadioGroupItem value={combo.name} id={combo.name} />
                            <div className="flex-1">
                              <Label htmlFor={combo.name} className="font-semibold cursor-pointer">
                                {combo.name}
                              </Label>
                              <p className="text-sm text-gray-600 mt-1">
                                Save
                                {combo.discount}
                                % with this combination
                              </p>
                              <div className="flex flex-wrap gap-2 mt-2">
                                {combo.packages.map(pkg => (
                                  <Badge key={pkg} variant="secondary" className="text-xs">
                                    {pkg.replace('Only', '')}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </RadioGroup>
                  </div>
                </div>
              ) : (
                // Single Package Configuration
                <div className="space-y-6">
                  {/* Plan Selection */}
                  <div>
                    <Label className="text-base font-semibold">Choose Plan Type</Label>
                    <RadioGroup value={selectedPlan} onValueChange={setSelectedPlan} className="mt-3">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="default" id="default" />
                        <Label htmlFor="default">Default Plans</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="custom" id="custom" />
                        <Label htmlFor="custom">Custom Plan</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Device Selection */}
                  {product.includedDevices && product.includedDevices.length > 0 && (
                    <div>
                      <Label className="text-base font-semibold">Choose Device</Label>
                      <div className="grid grid-cols-1 gap-3 mt-3">
                        {product.includedDevices.map(device => (
                          <Card
                            key={device.name}
                            className={`p-3 cursor-pointer transition-colors ${
                              selectedDevices[product.packageType || ''] === device.name
                                ? 'border-red-500 bg-red-50'
                                : 'hover:border-gray-400'
                            }`}
                            onClick={() =>
                              setSelectedDevices({
                                ...selectedDevices,
                                [product.packageType || '']: device.name,
                              })}
                          >
                            <div className="flex items-center space-x-3">
                              <Image
                                src={device.image || '/placeholder.svg'}
                                alt={device.name}
                                width={40}
                                height={40}
                                className="rounded"
                              />
                              <div className="flex-1">
                                <p className="font-medium text-sm">{device.name}</p>
                                {device.price > 0 && (
                                  <p className="text-xs text-gray-600">
                                    +$
                                    {device.price}
                                    /month
                                  </p>
                                )}
                              </div>
                              {device.type === 'mobile' && <Smartphone className="w-4 h-4 text-gray-400" />}
                              {device.type === 'tablet' && <Tablet className="w-4 h-4 text-gray-400" />}
                              {device.type === 'router' && <Router className="w-4 h-4 text-gray-400" />}
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Default Plans */}
                  {selectedPlan === 'default' && product.defaultPlans && product.defaultPlans.length > 0 && (
                    <div className="space-y-3">
                      <Label className="text-base font-semibold">Available Plans</Label>
                      <RadioGroup defaultValue={product.defaultPlans[1]?.name?.toLowerCase()}>
                        {product.defaultPlans.map(plan => (
                          <Card key={plan.name} className="p-4">
                            <div className="flex items-center space-x-3">
                              <RadioGroupItem value={plan.name.toLowerCase()} id={plan.name} />
                              <div className="flex-1">
                                <Label htmlFor={plan.name} className="font-semibold cursor-pointer">
                                  {plan.name}
                                  {' '}
                                  - $
                                  {plan.price}
                                  /month
                                </Label>
                                <div className="grid grid-cols-2 gap-4 mt-2 text-sm text-gray-600">
                                  {plan.minutes && (
                                    <div className="flex items-center space-x-1">
                                      <Clock className="w-4 h-4" />
                                      <span>
                                        {plan.minutes === 'unlimited' ? 'Unlimited' : `${plan.minutes}`}
                                        {' '}
                                        Minutes
                                      </span>
                                    </div>
                                  )}
                                  {plan.sms && (
                                    <div className="flex items-center space-x-1">
                                      <MessageSquare className="w-4 h-4" />
                                      <span>
                                        {plan.sms === 'unlimited' ? 'Unlimited' : `${plan.sms}`}
                                        {' '}
                                        SMS
                                      </span>
                                    </div>
                                  )}
                                  {plan.data && (
                                    <div className="flex items-center space-x-1">
                                      <HardDrive className="w-4 h-4" />
                                      <span>
                                        {plan.data === 'unlimited' ? 'Unlimited' : `${plan.data}GB`}
                                        {' '}
                                        Data
                                      </span>
                                    </div>
                                  )}
                                  {plan.speed && (
                                    <div className="flex items-center space-x-1">
                                      <Zap className="w-4 h-4" />
                                      <span>
                                        {plan.speed}
                                        Mbps Speed
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </RadioGroup>
                    </div>
                  )}

                  {/* Custom Plan */}
                  {selectedPlan === 'custom' && product.customizable && (
                    <div className="space-y-6">
                      <Label className="text-base font-semibold">Customize Your Plan</Label>

                      <div className="space-y-4">
                        {product.customizable.minutes && (
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <Label className="flex items-center space-x-2">
                                <Clock className="w-4 h-4" />
                                <span>Minutes</span>
                              </Label>
                              <span className="text-sm font-semibold">
                                {customPlan.minutes === 'unlimited' ? 'Unlimited' : `${customPlan.minutes || 0}`}
                              </span>
                            </div>
                            <Slider
                              value={[
                                customPlan.minutes === 'unlimited'
                                  ? product.customizable.minutes.max
                                  : customPlan.minutes || 0,
                              ]}
                              onValueChange={value =>
                                setCustomPlan({
                                  ...customPlan,
                                  minutes: value[0] >= (product.customizable?.minutes?.max ?? 0) ? 'unlimited' : value[0],
                                })}
                              max={product.customizable.minutes.max}
                              min={product.customizable.minutes.min}
                              step={100}
                              className="w-full"
                            />
                          </div>
                        )}

                        {product.customizable.sms && (
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <Label className="flex items-center space-x-2">
                                <MessageSquare className="w-4 h-4" />
                                <span>SMS</span>
                              </Label>
                              <span className="text-sm font-semibold">
                                {customPlan.sms === 'unlimited' ? 'Unlimited' : `${customPlan.sms || 0}`}
                              </span>
                            </div>
                            <Slider
                              value={[
                                customPlan.sms === 'unlimited' ? product.customizable.sms.max : customPlan.sms || 0,
                              ]}
                              onValueChange={value =>
                                setCustomPlan({
                                  ...customPlan,
                                  sms: value[0] >= (product.customizable?.sms?.max ?? 0) ? 'unlimited' : value[0],
                                })}
                              max={product.customizable.sms.max}
                              min={product.customizable.sms.min}
                              step={200}
                              className="w-full"
                            />
                          </div>
                        )}

                        {product.customizable.data && (
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <Label className="flex items-center space-x-2">
                                <HardDrive className="w-4 h-4" />
                                <span>Data</span>
                              </Label>
                              <span className="text-sm font-semibold">
                                {customPlan.data === 'unlimited' ? 'Unlimited' : `${customPlan.data || 0}GB`}
                              </span>
                            </div>
                            <Slider
                              value={[
                                customPlan.data === 'unlimited' ? product.customizable.data.max : customPlan.data || 0,
                              ]}
                              onValueChange={value =>
                                setCustomPlan({
                                  ...customPlan,
                                  data: value[0] >= (product.customizable?.data?.max ?? 0) ? 'unlimited' : value[0],
                                })}
                              max={product.customizable.data.max}
                              min={product.customizable.data.min}
                              step={product.packageType === 'TabletOnly' ? 2 : 5}
                              className="w-full"
                            />
                          </div>
                        )}

                        {product.customizable.speed && (
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <Label className="flex items-center space-x-2">
                                <Zap className="w-4 h-4" />
                                <span>Speed</span>
                              </Label>
                              <span className="text-sm font-semibold">
                                {customPlan.speed || 0}
                                Mbps
                              </span>
                            </div>
                            <Slider
                              value={[customPlan.speed || 0]}
                              onValueChange={value => setCustomPlan({ ...customPlan, speed: value[0] })}
                              max={product.customizable.speed.max}
                              min={product.customizable.speed.min}
                              step={25}
                              className="w-full"
                            />
                          </div>
                        )}
                      </div>

                      {/* Price Breakdown */}
                      <Card className="p-4 bg-gray-50">
                        <div className="text-sm space-y-1">
                          {customPlan.minutes && (
                            <div className="flex justify-between">
                              <span>
                                Minutes (
                                {customPlan.minutes === 'unlimited' ? 'Unlimited' : customPlan.minutes}
                                ):
                              </span>
                              <span>
                                $
                                {customPlan.minutes === 'unlimited'
                                  ? product.customizable?.minutes?.unlimited || 0
                                  : ((customPlan.minutes || 0) * (product.customizable?.minutes?.price || 0)).toFixed(2)}
                              </span>
                            </div>
                          )}
                          {customPlan.sms && (
                            <div className="flex justify-between">
                              <span>
                                SMS (
                                {customPlan.sms === 'unlimited' ? 'Unlimited' : customPlan.sms}
                                ):
                              </span>
                              <span>
                                $
                                {customPlan.sms === 'unlimited'
                                  ? product.customizable?.sms?.unlimited || 0
                                  : ((customPlan.sms || 0) * (product.customizable?.sms?.price || 0)).toFixed(2)}
                              </span>
                            </div>
                          )}
                          {customPlan.data && (
                            <div className="flex justify-between">
                              <span>
                                Data (
                                {customPlan.data === 'unlimited' ? 'Unlimited' : `${customPlan.data}GB`}
                                ):
                              </span>
                              <span>
                                $
                                {customPlan.data === 'unlimited'
                                  ? product.customizable?.data?.unlimited || 0
                                  : ((customPlan.data || 0) * (product.customizable?.data?.price || 0)).toFixed(2)}
                              </span>
                            </div>
                          )}
                          {customPlan.speed && (
                            <div className="flex justify-between">
                              <span>
                                Speed (
                                {customPlan.speed}
                                Mbps):
                              </span>
                              <span>
                                $
                                {((customPlan.speed || 0) * (product.customizable?.speed?.price || 0)).toFixed(2)}
                              </span>
                            </div>
                          )}
                          <Separator className="my-2" />
                          <div className="flex justify-between font-semibold">
                            <span>Total Monthly:</span>
                            <span>
                              $
                              {calculateCustomPrice(product, customPlan).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </Card>
                    </div>
                  )}
                </div>
              )}
            </TabsContent>

            <TabsContent value="usage" className="space-y-6 mt-6">
              {/* Usage-Based Recommendations */}
              <div>
                <Label className="text-base font-semibold">Based on Your Usage Profile</Label>
                <p className="text-sm text-gray-600 mt-1">Choose a profile that matches your typical usage</p>

                <RadioGroup
                  value={selectedUsageProfile}
                  onValueChange={(value) => {
                    setSelectedUsageProfile(value);
                    if (product.usageRecommendation) {
                      const recommendation = product.usageRecommendation[value as keyof typeof product.usageRecommendation];
                      if (recommendation) {
                        setCustomPlan(recommendation);
                      }
                    }
                  }}
                  className="mt-3"
                >
                  <Card className="p-4">
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="lightUser" id="lightUser" />
                      <div className="flex-1">
                        <Label htmlFor="lightUser" className="font-semibold cursor-pointer">
                          Light User
                        </Label>
                        <p className="text-sm text-gray-600">Basic usage, occasional calls and browsing</p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="mediumUser" id="mediumUser" />
                      <div className="flex-1">
                        <Label htmlFor="mediumUser" className="font-semibold cursor-pointer">
                          Medium User
                        </Label>
                        <p className="text-sm text-gray-600">Regular usage, social media, streaming</p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="heavyUser" id="heavyUser" />
                      <div className="flex-1">
                        <Label htmlFor="heavyUser" className="font-semibold cursor-pointer">
                          Heavy User
                        </Label>
                        <p className="text-sm text-gray-600">Intensive usage, gaming, work from home</p>
                      </div>
                    </div>
                  </Card>
                </RadioGroup>

                {/* Recommended Configuration */}
                {product.usageRecommendation && (
                  <Card className="p-4 bg-blue-50 border-blue-200 mt-4">
                    <h4 className="font-semibold text-blue-900 mb-2">
                      Recommended for
                      {' '}
                      {selectedUsageProfile.replace('User', ' User')}
                    </h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      {product.usageRecommendation[selectedUsageProfile as keyof typeof product.usageRecommendation]
                        ?.minutes && (
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-blue-600" />
                          <span>
                            {
                              product.usageRecommendation[
                                selectedUsageProfile as keyof typeof product.usageRecommendation
                              ]?.minutes
                            }
                            {' '}
                            minutes
                          </span>
                        </div>
                      )}
                      {product.usageRecommendation[selectedUsageProfile as keyof typeof product.usageRecommendation]
                        ?.sms && (
                        <div className="flex items-center space-x-2">
                          <MessageSquare className="w-4 h-4 text-blue-600" />
                          <span>
                            {
                              product.usageRecommendation[
                                selectedUsageProfile as keyof typeof product.usageRecommendation
                              ]?.sms
                            }
                            {' '}
                            SMS
                          </span>
                        </div>
                      )}
                      {product.usageRecommendation[selectedUsageProfile as keyof typeof product.usageRecommendation]
                        ?.data && (
                        <div className="flex items-center space-x-2">
                          <HardDrive className="w-4 h-4 text-blue-600" />
                          <span>
                            {
                              product.usageRecommendation[
                                selectedUsageProfile as keyof typeof product.usageRecommendation
                              ]?.data
                            }
                            GB data
                          </span>
                        </div>
                      )}
                      {product.usageRecommendation[selectedUsageProfile as keyof typeof product.usageRecommendation]
                        ?.speed && (
                        <div className="flex items-center space-x-2">
                          <Zap className="w-4 h-4 text-blue-600" />
                          <span>
                            {
                              product.usageRecommendation[
                                selectedUsageProfile as keyof typeof product.usageRecommendation
                              ]?.speed
                            }
                            Mbps speed
                          </span>
                        </div>
                      )}
                    </div>
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>

          {/* Special Requests */}
          <div>
            <Label className="text-base font-semibold">Special Requests (Optional)</Label>
            <Textarea
              placeholder="Any special requirements or requests for your package..."
              value={specialRequests}
              onChange={e => setSpecialRequests(e.target.value)}
              className="mt-2"
              rows={3}
            />
          </div>

          <Separator />

          {/* Total and Add to Cart */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">Total:</span>
              <span className="text-xl font-bold text-red-600">
                $
                {selectedPlan === 'custom'
                  ? calculateCustomPrice(product, customPlan).toFixed(2)
                  : product.price.toFixed(2)}
                /month
              </span>
            </div>

            <Button
              className="w-full bg-red-500 hover:bg-red-600 text-white py-3"
              onClick={() => {
                onCloseAction();
              }}
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Add To Cart
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
