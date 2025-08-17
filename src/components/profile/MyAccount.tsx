'use client';
import userRequests from '@/app/apis/requests/user';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { CreditCard, Mail, MapPin, MessageCircle, Phone, Save, User, Wifi } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function MyAccount() {
  const router = useRouter();

  // State for enquiry form
  const [enquiry, setEnquiry] = useState({
    issues: '',
    description: ''
  });
  const [enquiryLoading, setEnquiryLoading] = useState(false);
  const [enquiryError, setEnquiryError] = useState('');
  const [enquirySuccess, setEnquirySuccess] = useState(false);

  const handleCustomizePackage = () => {
    router.push('/customize-package');
  };

  const handleEnquiryTypeChange = (value: string) => {
    setEnquiry(prev => ({ ...prev, issues: value }));
    // Clear messages when user changes selection
    setEnquiryError('');
    setEnquirySuccess(false);
  };

  const handleEnquiryDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEnquiry(prev => ({ ...prev, description: e.target.value }));
    // Clear messages when user starts typing
    setEnquiryError('');
    setEnquirySuccess(false);
  };

  const handleSubmitEnquiry = async () => {
    // Validation
    if (!enquiry.issues) {
      setEnquiryError('Please select an enquiry type');
      return;
    }
    if (!enquiry.description.trim()) {
      setEnquiryError('Please describe your issue');
      return;
    }
    if (enquiry.description.trim().length < 10) {
      setEnquiryError('Description should be at least 10 characters long');
      return;
    }

    setEnquiryLoading(true);
    setEnquiryError('');
    setEnquirySuccess(false);

    try {
      const response = await userRequests.postEnquiry({
        issues: enquiry.issues,
        description: enquiry.description.trim()
      });

      if (response && response.success) {
        setEnquirySuccess(true);
        // Reset form
        setEnquiry({
          issues: '',
          description: ''
        });
        // Auto-hide success message after 5 seconds
        setTimeout(() => {
          setEnquirySuccess(false);
        }, 5000);
      } else {
        setEnquiryError('Failed to submit enquiry. Please try again.');
      }
    } catch (error) {
      setEnquiryError('An error occurred while submitting your enquiry. Please try again later.');
      console.error('Submit enquiry error:', error);
    } finally {
      setEnquiryLoading(false);
    }
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
            <CardHeader>
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
                <Select
                  value={enquiry.issues}
                  onValueChange={handleEnquiryTypeChange}
                  disabled={enquiryLoading}
                >
                  <SelectTrigger className="h-12 text-base">
                    <SelectValue placeholder="Select enquiry type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BILLING_ISSUE">Billing Issue</SelectItem>
                    <SelectItem value="TECHNICAL_SUPPORT">Technical Support</SelectItem>
                    <SelectItem value="ACCOUNT_MANAGEMENT">Account Management</SelectItem>
                    <SelectItem value="GENERAL_INQUIRY">General Inquiry</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="message" className="text-sm font-medium">
                  Describe your issue
                </Label>
                <Textarea
                  id="message"
                  value={enquiry.description}
                  onChange={handleEnquiryDescriptionChange}
                  placeholder="Tell us more about your enquiry..."
                  className="min-h-[120px] text-base resize-none"
                  disabled={enquiryLoading}
                  maxLength={500}
                />
                <p className="text-xs text-gray-500 text-right">
                  {enquiry.description.length}
                  /500 characters
                </p>
              </div>

              {/* Error Alert */}
              {enquiryError && (
                <Alert variant="destructive">
                  <AlertDescription>{enquiryError}</AlertDescription>
                </Alert>
              )}

              {/* Success Alert */}
              {enquirySuccess && (
                <Alert className="border-green-200 bg-green-50">
                  <AlertDescription className="text-green-800">
                    ✓ Your enquiry has been submitted successfully! We'll get back to you within 24-48 hours.
                  </AlertDescription>
                </Alert>
              )}

              <Button
                className="w-full h-12 bg-red-500 hover:bg-red-600 text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleSubmitEnquiry}
                disabled={enquiryLoading || !enquiry.issues || enquiry.description.length < 10}
              >
                {enquiryLoading ? (
                  <>
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                    Submitting...
                  </>
                ) : (
                  <>
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Submit Enquiry
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
