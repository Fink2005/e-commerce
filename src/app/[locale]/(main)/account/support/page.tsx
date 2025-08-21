'use client';
import type React from 'react';
import { useState } from 'react';

import userRequests from '@/app/apis/requests/user';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, MessageCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SupportPage() {
  const router = useRouter();
  const [enquiry, setEnquiry] = useState({
    issues: '',
    description: '',
  });
  const [enquiryLoading, setEnquiryLoading] = useState(false);
  const [enquiryError, setEnquiryError] = useState('');
  const [enquirySuccess, setEnquirySuccess] = useState(false);

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
      // Call the actual API instead of mock timeout
      const response = await userRequests.postEnquiry({
        issues: enquiry.issues,
        description: enquiry.description.trim()
      });

      if (response && response.success) {
        setEnquirySuccess(true);
        setEnquiry({
          issues: '',
          description: '',
        });
        setTimeout(() => {
          setEnquirySuccess(false);
        }, 5000);
      } else {
        setEnquiryError('Failed to submit enquiry. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting enquiry:', error);
      setEnquiryError('An error occurred while submitting your enquiry. Please try again later.');
    } finally {
      setEnquiryLoading(false);
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
            <h1 className="text-xl font-bold text-gray-900">Support & Help</h1>
          </div>

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
                <Select value={enquiry.issues} onValueChange={handleEnquiryTypeChange} disabled={enquiryLoading}>
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

              {enquiryError && (
                <Alert variant="destructive">
                  <AlertDescription>{enquiryError}</AlertDescription>
                </Alert>
              )}

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
