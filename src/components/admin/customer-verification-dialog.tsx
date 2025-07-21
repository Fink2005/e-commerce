'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CustomerVerificationDialogProps {
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
}

export function CustomerVerificationDialog({ open, onOpenChangeAction }: CustomerVerificationDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChangeAction}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Customer Identity Verification</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="customer-id">Customer ID or Phone</Label>
            <Input id="customer-id" placeholder="Enter customer ID or phone number" />
          </div>
          <div>
            <Label htmlFor="verification-method">Verification Method</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select verification method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="phone">Phone Verification</SelectItem>
                <SelectItem value="email">Email Verification</SelectItem>
                <SelectItem value="security-questions">Security Questions</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button className="w-full bg-red-500 hover:bg-red-600 text-white">Start Verification</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
