/* eslint-disable react-hooks-extra/no-direct-set-state-in-use-effect */
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
import { CreditCard, Mail, MessageCircle, Phone, Save, User, Wifi } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface UserData {
  totalOrders: number;
  email: string;
  name: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  product: {
    broadBandData: number;
    mobileData: number;
    packageType: string;
  };
}

interface MyAccountProps {
  userData?: UserData | null;
  onUpdateUser?: (data: Partial<UserData>) => Promise<{ success: boolean; error?: string }>;
}

export default function MyAccount({ userData: propUserData, onUpdateUser }: MyAccountProps) {
  const router = useRouter();

  // User data state
  const [userData, setUserData] = useState<UserData | null>(propUserData || null);
  const [loading, setLoading] = useState(!propUserData);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form state for personal information
  const [personalInfo, setPersonalInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: ''
  });

  // State for enquiry form
  const [enquiry, setEnquiry] = useState({
    issues: '',
    description: ''
  });
  const [enquiryLoading, setEnquiryLoading] = useState(false);
  const [enquiryError, setEnquiryError] = useState('');
  const [enquirySuccess, setEnquirySuccess] = useState(false);

  // Fetch user data if not provided as prop
  useEffect(() => {
    if (!propUserData) {
      const fetchUserData = async () => {
        try {
          setLoading(true);
          const data = await userRequests.getMe();
          if (data) {
            setUserData(data);
            // Parse name into first and last name
            const nameParts = data.name ? data.name.split(' ') : ['', ''];
            setPersonalInfo(prev => ({
              ...prev,
              firstName: nameParts[0] || '',
              lastName: nameParts.slice(1).join(' ') || '',
              email: data.email || '',
            }));
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchUserData();
    } else {
      // If userData is provided as prop, initialize form
      const initializePersonalInfo = () => {
        const nameParts = propUserData.name ? propUserData.name.split(' ') : ['', ''];
        setPersonalInfo(prev => ({
          ...prev,
          firstName: nameParts[0] || '',
          lastName: nameParts.slice(1).join(' ') || '',
          email: propUserData.email || '',
        }));
      };
      initializePersonalInfo();
    }
  }, [propUserData]);

  // Update local state when prop changes
  useEffect(() => {
    if (propUserData) {
      setUserData(propUserData);
      const initializePersonalInfo = () => {
        const nameParts = propUserData.name ? propUserData.name.split(' ') : ['', ''];
        setPersonalInfo(prev => ({
          ...prev,
          firstName: nameParts[0] || '',
          lastName: nameParts.slice(1).join(' ') || '',
          email: propUserData.email || '',
        }));
      };
      initializePersonalInfo();
    }
  }, [propUserData]);

  const handlePersonalInfoChange = (field: string, value: string) => {
    setPersonalInfo(prev => ({ ...prev, [field]: value }));
    // Clear messages when user starts typing
    setSaveError('');
    setSaveSuccess(false);
  };

  const handleSavePersonalInfo = async () => {
    if (!userData) {
      return;
    }

    // Validation
    if (!personalInfo.firstName.trim()) {
      setSaveError('First name is required');
      return;
    }
    if (!personalInfo.email.trim()) {
      setSaveError('Email is required');
      return;
    }

    setSaveLoading(true);
    setSaveError('');
    setSaveSuccess(false);

    try {
      const fullName = `${personalInfo.firstName.trim()} ${personalInfo.lastName.trim()}`.trim();

      const updatedData = {
        ...userData,
        name: fullName,
        email: personalInfo.email.trim(),
        updatedAt: new Date().toISOString(),
      };

      let updateResult;
      if (onUpdateUser) {
        // Use provided update function
        updateResult = await onUpdateUser(updatedData);
      } else {
        // Use direct API call
        const response = await userRequests.updateUser(updatedData);
        updateResult = { success: !!response };
      }

      if (updateResult.success) {
        setUserData(updatedData);
        setSaveSuccess(true);
        // Auto-hide success message after 3 seconds
        setTimeout(() => {
          setSaveSuccess(false);
        }, 3000);
      } else {
        setSaveError(updateResult.error || 'Failed to save changes. Please try again.');
      }
    } catch (error) {
      setSaveError('An error occurred while saving. Please try again later.');
      console.error('Save personal info error:', error);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleCustomizePackage = () => {
    router.push('/customize-package');
  };

  const handleEnquiryTypeChange = (value: string) => {
    setEnquiry(prev => ({ ...prev, issues: value }));
    setEnquiryError('');
    setEnquirySuccess(false);
  };

  const handleEnquiryDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEnquiry(prev => ({ ...prev, description: e.target.value }));
    setEnquiryError('');
    setEnquirySuccess(false);
  };

  const handleSubmitEnquiry = async () => {
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
        setEnquiry({
          issues: '',
          description: ''
        });
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

  // Calculate usage percentages
  const mobileUsagePercent = userData?.product ? Math.round((userData.product.mobileData / 20) * 100) : 0;
  const broadbandUsagePercent = userData?.product ? Math.round((userData.product.broadBandData / 500) * 100) : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-md mx-auto bg-white min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading account information...</p>
          </div>
        </div>
      </div>
    );
  }

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
                <Input
                  id="firstName"
                  value={personalInfo.firstName}
                  onChange={e => handlePersonalInfoChange('firstName', e.target.value)}
                  placeholder="Enter first name"
                  className="h-12 text-base"
                  disabled={saveLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-sm font-medium">
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  value={personalInfo.lastName}
                  onChange={e => handlePersonalInfoChange('lastName', e.target.value)}
                  placeholder="Enter last name"
                  className="h-12 text-base"
                  disabled={saveLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2 text-sm font-medium">
                  <Mail className="h-4 w-4" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={personalInfo.email}
                  onChange={e => handlePersonalInfoChange('email', e.target.value)}
                  placeholder="Enter email address"
                  className="h-12 text-base"
                  disabled={saveLoading}
                />
              </div>

              {/* Save Error Alert */}
              {saveError && (
                <Alert variant="destructive">
                  <AlertDescription>{saveError}</AlertDescription>
                </Alert>
              )}

              {/* Save Success Alert */}
              {saveSuccess && (
                <Alert className="border-green-200 bg-green-50">
                  <AlertDescription className="text-green-800">
                    ✓ Personal information saved successfully!
                  </AlertDescription>
                </Alert>
              )}

              <Button
                className="w-full h-12 bg-red-500 hover:bg-red-600 text-base font-medium mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleSavePersonalInfo}
                disabled={saveLoading}
              >
                {saveLoading ? (
                  <>
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Personal Info
                  </>
                )}
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
                      <div className="text-sm text-gray-600">
                        {userData?.product?.mobileData || 0}
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
                        {userData?.product?.broadBandData || 0}
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

              {userData?.product?.packageType && (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="text-sm text-gray-600">Current Package</div>
                  <div className="font-medium text-gray-900">{userData.product.packageType}</div>
                </div>
              )}

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

              {/* Enquiry Error Alert */}
              {enquiryError && (
                <Alert variant="destructive">
                  <AlertDescription>{enquiryError}</AlertDescription>
                </Alert>
              )}

              {/* Enquiry Success Alert */}
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

          {/* Account Stats */}
          {userData && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Account Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Total Orders</span>
                  <span className="font-medium">{userData.totalOrders}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Member Since</span>
                  <span className="font-medium">
                    {new Date(userData.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-600">Account Type</span>
                  <span className="font-medium capitalize">{userData.role}</span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
