'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Mail, Phone, Plus } from 'lucide-react';

interface QuickActionsProps {
  onVerifyCustomerAction: () => void;
  onNewOrderAction: () => void;
  onRespondEnquiryAction: () => void;
  onExportDataAction: () => void;
}

export function QuickActions({ onVerifyCustomerAction, onNewOrderAction, onRespondEnquiryAction, onExportDataAction }: QuickActionsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <Button
            onClick={onVerifyCustomerAction}
            variant="outline"
            className="h-20 flex flex-col items-center justify-center space-y-2 bg-transparent"
          >
            <Phone className="h-6 w-6 text-red-500" />
            <span>Verify Customer</span>
          </Button>
          <Button
            onClick={onNewOrderAction}
            variant="outline"
            className="h-20 flex flex-col items-center justify-center space-y-2 bg-transparent"
          >
            <Plus className="h-6 w-6 text-red-500" />
            <span>New Order</span>
          </Button>
          <Button
            onClick={onRespondEnquiryAction}
            variant="outline"
            className="h-20 flex flex-col items-center justify-center space-y-2 bg-transparent"
          >
            <Mail className="h-6 w-6 text-red-500" />
            <span>Respond Enquiry</span>
          </Button>
          <Button
            onClick={onExportDataAction}
            variant="outline"
            className="h-20 flex flex-col items-center justify-center space-y-2 bg-transparent"
          >
            <Download className="h-6 w-6 text-red-500" />
            <span>Export Data</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
