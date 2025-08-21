/* eslint-disable react-hooks-extra/no-direct-set-state-in-use-effect */
'use client';
import userRequests from '@/app/apis/requests/user';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import useUserStore from '@/lib/store/userStore';
import { ArrowLeft, Mail, Save, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function PersonalInfoPage() {
  const router = useRouter();
  const { user, setUser, isLoading: userLoading, fetchUser } = useUserStore();

  const [saveLoading, setSaveLoading] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [personalInfo, setPersonalInfo] = useState({
    firstName: '',
    lastName: '',
    email: ''
  });

  // Load user data from store when component mounts or user data changes
  useEffect(() => {
    if (user) {
      // Split the name into first and last name
      const nameParts = user.name?.split(' ') || [''];
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      setPersonalInfo({
        firstName,
        lastName,
        email: user.email || ''
      });
    } else if (!userLoading) {
      // If no user data and not loading, try to fetch user data
      fetchUser().catch(console.error);
    }
  }, [user, userLoading, fetchUser]);

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

    if (!user) {
      setSaveError('User data not available. Please refresh the page.');
      return;
    }

    setSaveLoading(true);
    setSaveError('');
    setSaveSuccess(false);

    try {
      // Combine first and last name
      const fullName = `${personalInfo.firstName.trim()} ${personalInfo.lastName.trim()}`.trim();

      // Prepare updated user data
      const updatedUserData = {
        ...user,
        name: fullName,
        email: personalInfo.email.trim(),
      };

      // Call the updateUser API
      const response = await userRequests.updateUser(updatedUserData);

      if (response) {
        // Update the user store with the new data
        setUser(updatedUserData);
        setSaveSuccess(true);
        setTimeout(() => {
          setSaveSuccess(false);
        }, 3000);
      } else {
        throw new Error('Failed to update user information');
      }
    } catch (error: any) {
      console.error('Error updating user:', error);
      setSaveError(error.message || 'An error occurred while saving. Please try again later.');
    } finally {
      setSaveLoading(false);
    }
  };

  // Show loading state while fetching user data
  if (userLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-md mx-auto bg-white min-h-screen">
          <div className="p-6">
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show message if no user data
  if (!user) {
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
            <Alert variant="destructive">
              <AlertDescription>
                Unable to load user data. Please try refreshing the page or logging in again.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </div>
    );
  }

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
                disabled={saveLoading || !user}
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
