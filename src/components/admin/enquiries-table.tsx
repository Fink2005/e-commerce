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
  id: string;
  customer: string;
  subject: string;
  status: 'pending' | 'responded' | 'closed';
  date: string;
  priority: 'low' | 'medium' | 'high';
  description: string;
}

export function EnquiriesTable() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [respondOpen, setRespondOpen] = useState(false);
  const [responseText, setResponseText] = useState('');

  useEffect(() => {
    async function fetchEnquiries() {
      const data = await userRequests.getAllEnquiries();
      if (Array.isArray(data)) {
        const mapped = data.map((item: any) => ({
          id: item.id.toString(),
          customer: item.users?.name || 'Unknown',
          subject: item.issues?.replace(/_/g, ' ') || 'No Subject',
          status: 'pending' as const, // Hardcoded, as no status in API data
          date: '', // No date in API data; leave blank or implement if added later
          priority: 'medium' as const, // Hardcoded, as no priority in API data
          description: item.description || 'No description provided',
        }));
        setEnquiries(mapped);
      }
    }
    fetchEnquiries();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'responded':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'closed':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-200';
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

  const handleSendResponse = () => {
    if (selectedEnquiry) {
      // Update local status (no backend update assumed)
      setEnquiries(prev =>
        prev.map(e =>
          e.id === selectedEnquiry.id ? { ...e, status: 'responded' } : e
        )
      );
    }
    setRespondOpen(false);
    setResponseText('');
    setSelectedEnquiry(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Enquiries</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {enquiries.map(enquiry => (
              <TableRow key={enquiry.id}>
                <TableCell className="font-medium">{enquiry.id}</TableCell>
                <TableCell>{enquiry.customer}</TableCell>
                <TableCell>{enquiry.subject}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={getStatusColor(enquiry.status)}>
                    {enquiry.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={getPriorityColor(enquiry.priority)}>
                    {enquiry.priority}
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
                      <DropdownMenuItem onClick={() => handleRespondEnquiry(enquiry)}>
                        <Mail className="mr-2 h-4 w-4" />
                        Respond
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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
                <strong>Priority:</strong>
                {' '}
                {selectedEnquiry.priority}
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
          <Textarea
            className="w-full h-32"
            value={responseText}
            onChange={e => setResponseText(e.target.value)}
            placeholder="Type your response here..."
          />
          <Button onClick={handleSendResponse}>Send Response</Button>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
