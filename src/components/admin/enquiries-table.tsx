'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { Download, Mail } from 'lucide-react';
import { useState } from 'react';

interface Enquiry {
  id: string;
  customer: string;
  subject: string;
  status: string;
  date: string;
  priority: string;
}

interface EnquiriesTableProps {
  enquiries: Enquiry[];
}

export function EnquiriesTable({ enquiries }: EnquiriesTableProps) {
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Customer Enquiries</CardTitle>
        <div className="flex space-x-2">
          <Button className="bg-red-500 hover:bg-red-600 text-white">
            <Mail className="h-4 w-4 mr-2" />
            Respond to Enquiry
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Enquiries
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Enquiry ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {enquiries.map(enquiry => (
              <TableRow key={enquiry.id}>
                <TableCell className="font-medium">{enquiry.id}</TableCell>
                <TableCell>{enquiry.customer}</TableCell>
                <TableCell>{enquiry.subject}</TableCell>
                <TableCell>
                  <Badge
                    variant={enquiry.priority === 'high' ? 'destructive' : 'secondary'}
                    className={enquiry.priority === 'high' ? 'bg-red-100 text-red-700' : ''}
                  >
                    {enquiry.priority}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={enquiry.status === 'pending' ? 'destructive' : 'secondary'}
                    className={enquiry.status === 'pending' ? 'bg-red-100 text-red-700' : ''}
                  >
                    {enquiry.status}
                  </Badge>
                </TableCell>
                <TableCell>{enquiry.date}</TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        className="bg-red-500 hover:bg-red-600 text-white"
                        onClick={() => setSelectedEnquiry(enquiry)}
                      >
                        Respond
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>
                          Respond to Enquiry -
                          {enquiry.id}
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label>
                            Customer:
                            {enquiry.customer}
                          </Label>
                          <p className="text-sm text-gray-600">
                            Subject:
                            {enquiry.subject}
                          </p>
                        </div>
                        <div>
                          <Label htmlFor="response">Response</Label>
                          <Textarea id="response" placeholder="Type your response here..." className="min-h-32" />
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline">Save Draft</Button>
                          <Button className="bg-red-500 hover:bg-red-600 text-white">Send Response</Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
