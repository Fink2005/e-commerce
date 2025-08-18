'use client';

import userRequests from '@/app/apis/requests/user'; // Adjust the import path as needed based on your project structure
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { Eye, Mail, MoreHorizontal } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Enquiry {
  id: number;
  customer: string;
  subject: string;
  status: 'PENDING' | 'RESPONDED';
  date: string;
  description: string;
  userId?: number; // Added userId for the API call
}

export function EnquiriesTable() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [respondOpen, setRespondOpen] = useState(false);
  const [responseText, setResponseText] = useState('');
  const [loading, setLoading] = useState(true);
  const [responding, setResponding] = useState(false); // New state for response loading

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'RESPONDED':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleViewEnquiry = (enquiry: Enquiry) => {
    setSelectedEnquiry(enquiry);
  };

  const handleRespondEnquiry = (enquiry: Enquiry) => {
    setSelectedEnquiry(enquiry);
    setRespondOpen(true);
  };

  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      const data = await userRequests.getAllEnquiries();
      if (Array.isArray(data)) {
        const mapped = data.map((item: any) => ({
          id: item.id,
          customer: item.users?.name || 'Unknown',
          subject: item.issues?.replace(/_/g, ' ') || 'No Subject',
          status: item.status || 'PENDING',
          date: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A',
          description: item.description || 'No description provided',
          userId: item.userId || item.users?.id, // Capture userId for API call
        }));
        setEnquiries(mapped);
      }
    } catch (error) {
      console.error('Error fetching enquiries:', error);
      // You might want to show a toast notification here
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const handleSendResponse = async () => {
    if (
      !selectedEnquiry
      || !responseText.trim()
      || typeof selectedEnquiry.userId !== 'number'
    ) {
      // You might want to show a validation message here
      return;
    }

    setResponding(true);

    try {
      // Call the respondEnquiry API
      const response = await userRequests.respondEnquiry({
        resolution: responseText,
        userId: selectedEnquiry.userId,
        userIssue: selectedEnquiry.subject.replace(/\s+/g, '_'), // Convert spaces back to underscores for API
        supportId: selectedEnquiry.id,
      });

      if (response?.success) {
        // Close dialog and reset state
        setRespondOpen(false);
        setResponseText('');
        setSelectedEnquiry(null);

        // Fetch fresh data from the server
        await fetchEnquiries();
      } else {
        // Handle API failure
        console.error('Failed to send response');
        // You might want to show an error toast notification here
      }
    } catch (error) {
      console.error('Error sending response:', error);
      // You might want to show an error toast notification here
    } finally {
      setResponding(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Enquiries</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <p>Loading...</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {enquiries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    No enquiries found.
                  </TableCell>
                </TableRow>
              ) : (
                enquiries.map(enquiry => (
                  <TableRow key={enquiry.id}>
                    <TableCell className="font-medium">{enquiry.id}</TableCell>
                    <TableCell>{enquiry.customer}</TableCell>
                    <TableCell>{enquiry.subject}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusColor(enquiry.status)}>
                        {enquiry.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{enquiry.date}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewEnquiry(enquiry)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleRespondEnquiry(enquiry)}
                            disabled={enquiry.status === 'RESPONDED'}
                          >
                            <Mail className="mr-2 h-4 w-4" />
                            Respond
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>

      {/* View Details Dialog */}
      <Dialog
        open={!!selectedEnquiry && !respondOpen}
        onOpenChange={open => !open && setSelectedEnquiry(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enquiry Details</DialogTitle>
          </DialogHeader>
          {selectedEnquiry && (
            <div className="space-y-2">
              <p>
                <strong>ID:</strong>
                {' '}
                {selectedEnquiry.id}
              </p>
              <p>
                <strong>Customer:</strong>
                {' '}
                {selectedEnquiry.customer}
              </p>
              <p>
                <strong>Subject:</strong>
                {' '}
                {selectedEnquiry.subject}
              </p>
              <p>
                <strong>Description:</strong>
                {' '}
                {selectedEnquiry.description}
              </p>
              <p>
                <strong>Status:</strong>
                {' '}
                {selectedEnquiry.status}
              </p>
              <p>
                <strong>Date:</strong>
                {' '}
                {selectedEnquiry.date || 'N/A'}
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Respond Dialog */}
      <Dialog open={respondOpen} onOpenChange={setRespondOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Respond to Enquiry</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedEnquiry && (
              <div className="bg-gray-50 p-3 rounded">
                <p>
                  <strong>Subject:</strong>
                  {' '}
                  {selectedEnquiry.subject}
                </p>
                <p>
                  <strong>Description:</strong>
                  {' '}
                  {selectedEnquiry.description}
                </p>
              </div>
            )}
            <Textarea
              className="w-full h-32"
              value={responseText}
              onChange={e => setResponseText(e.target.value)}
              placeholder="Type your response here..."
              disabled={responding}
            />
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => setRespondOpen(false)}
                disabled={responding}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSendResponse}
                disabled={!responseText.trim() || responding}
              >
                {responding ? 'Sending...' : 'Send Response'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
