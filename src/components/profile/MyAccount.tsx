'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { CreditCard, Mail, MapPin, MessageCircle, Phone, Save, User, Wifi } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function MyAccount() {
  const router = useRouter();

  const handleCustomizePackage = () => {
    router.push('/customize-package');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto bg-white min-h-screen">
        <div className="space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-sm font-medium">
                  First Name
                </Label>
                <Input id="firstName" placeholder="Enter first name" className="h-12 text-base" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-sm font-medium">
                  Last Name
                </Label>
                <Input id="lastName" placeholder="Enter last name" className="h-12 text-base" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2 text-sm font-medium">
                  <Mail className="h-4 w-4" />
                  Email Address
                </Label>
                <Input id="email" type="email" placeholder="Enter email address" className="h-12 text-base" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2 text-sm font-medium">
                  <Phone className="h-4 w-4" />
                  Phone Number
                </Label>
                <Input id="phone" type="tel" placeholder="Enter phone number" className="h-12 text-base" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address" className="flex items-center gap-2 text-sm font-medium">
                  <MapPin className="h-4 w-4" />
                  Address
                </Label>
                <Textarea
                  id="address"
                  placeholder="Enter full address"
                  className="min-h-[100px] text-base resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city" className="text-sm font-medium">
                    City
                  </Label>
                  <Input id="city" placeholder="Enter city" className="h-12 text-base" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zipCode" className="text-sm font-medium">
                    ZIP Code
                  </Label>
                  <Input id="zipCode" placeholder="Enter ZIP code" className="h-12 text-base" />
                </div>
              </div>
              <Button className="w-full h-12 bg-red-500 hover:bg-red-600 text-base font-medium mt-6">
                <Save className="h-4 w-4 mr-2" />
                Save Personal Info
              </Button>
            </CardContent>
          </Card>

          {/* Payment Information */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Method
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cardNumber" className="text-sm font-medium">
                  Card Number
                </Label>
                <Input
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  className="h-12 text-base tracking-wider"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiryMonth" className="text-sm font-medium">
                    Month
                  </Label>
                  <Select>
                    <SelectTrigger className="h-12 text-base">
                      <SelectValue placeholder="MM" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 12 }, (_, i) => (
                        <SelectItem key={i + 1} value={String(i + 1).padStart(2, '0')}>
                          {String(i + 1).padStart(2, '0')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expiryYear" className="text-sm font-medium">
                    Year
                  </Label>
                  <Select>
                    <SelectTrigger className="h-12 text-base">
                      <SelectValue placeholder="YYYY" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 10 }, (_, i) => (
                        <SelectItem key={2024 + i} value={String(2024 + i)}>
                          {2024 + i}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvv" className="text-sm font-medium">
                    CVV
                  </Label>
                  <Input id="cvv" placeholder="123" maxLength={4} className="h-12 text-base" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cardName" className="text-sm font-medium">
                  Cardholder Name
                </Label>
                <Input id="cardName" placeholder="Name as on card" className="h-12 text-base" />
              </div>
              <Button className="w-full h-12 bg-red-500 hover:bg-red-600 text-base font-medium mt-6">
                <CreditCard className="h-4 w-4 mr-2" />
                Save Payment Method
              </Button>
            </CardContent>
          </Card>

          {/* Current Usage */}
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
                      <div className="text-sm text-gray-600">15.2 GB used of 20GB</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-blue-600">76%</div>
                  </div>
                </div>
                <Progress value={76} className="h-3 bg-blue-100" />
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-500 rounded-lg">
                      <Wifi className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Broadband</div>
                      <div className="text-sm text-gray-600">245GB used of 500GB</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600">49%</div>
                  </div>
                </div>
                <Progress value={49} className="h-3 bg-green-100" />
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

          {/* Support & Help */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Support & Help
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="enquiryType" className="text-sm font-medium">
                  What can we help you with?
                </Label>
                <Select>
                  <SelectTrigger className="h-12 text-base">
                    <SelectValue placeholder="Select enquiry type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="billing">Billing Issue</SelectItem>
                    <SelectItem value="technical">Technical Support</SelectItem>
                    <SelectItem value="account">Account Management</SelectItem>
                    <SelectItem value="general">General Inquiry</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="message" className="text-sm font-medium">
                  Describe your issue
                </Label>
                <Textarea
                  id="message"
                  placeholder="Tell us more about your enquiry..."
                  className="min-h-[120px] text-base resize-none"
                />
              </div>
              <Button className="w-full h-12 bg-red-500 hover:bg-red-600 text-base font-medium">
                <MessageCircle className="h-4 w-4 mr-2" />
                Submit Enquiry
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
