'use client';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Mail, Save, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function PersonalInfoPage() {
  const router = useRouter();
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [personalInfo, setPersonalInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
  });

  const handlePersonalInfoChange = (field: string, value: string) => {
    setPersonalInfo(prev => ({ ...prev, [field]: value }));
    setSaveError('');
    setSaveSuccess(false);
  };

  const handleSavePersonalInfo = async () => {
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch {
      setSaveError('An error occurred while saving. Please try again later.');
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto bg-white min-h-screen">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" size="sm" onClick={() => router.back()} className="p-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold text-gray-900">Personal Information</h1>
          </div>

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

              {saveError && (
                <Alert variant="destructive">
                  <AlertDescription>{saveError}</AlertDescription>
                </Alert>
              )}

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
        </div>
      </div>
    </div>
  );
}
