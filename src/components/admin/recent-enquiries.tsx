import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Enquiry {
  id: string;
  customer: string;
  subject: string;
  status: string;
  date: string;
  priority: string;
}

interface RecentEnquiriesProps {
  enquiries: Enquiry[];
}

export function RecentEnquiries({ enquiries }: RecentEnquiriesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Enquiries</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {enquiries.map(enquiry => (
            <div key={enquiry.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">{enquiry.customer}</p>
                <p className="text-sm text-gray-600">{enquiry.subject}</p>
              </div>
              <div className="text-right">
                <Badge
                  variant={enquiry.status === 'pending' ? 'destructive' : 'secondary'}
                  className={enquiry.status === 'pending' ? 'bg-red-100 text-red-700' : ''}
                >
                  {enquiry.status}
                </Badge>
                <p className="text-xs text-gray-500 mt-1">{enquiry.date}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
