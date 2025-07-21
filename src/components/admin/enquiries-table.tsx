'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Eye, Mail, MoreHorizontal } from 'lucide-react';

interface Enquiry {
  id: string;
  customer: string;
  subject: string;
  status: 'pending' | 'responded' | 'closed';
  date: string;
  priority: 'low' | 'medium' | 'high';
}

interface EnquiriesTableProps {
  enquiries: Enquiry[];
}

export function EnquiriesTable({ enquiries }: EnquiriesTableProps) {
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
    // Add view logic here
    console.warn('Viewing enquiry:', enquiry);
  };

  const handleRespondEnquiry = (enquiry: Enquiry) => {
    // Add respond logic here
    console.warn('Responding to enquiry:', enquiry);
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
    </Card>
  );
}
