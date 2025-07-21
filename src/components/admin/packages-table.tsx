import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Eye } from 'lucide-react';

interface Package {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  status: string;
}

interface PackagesTableProps {
  packages: Package[];
}

export function PackagesTable({ packages }: PackagesTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Package Information</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Package ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {packages.map(pkg => (
              <TableRow key={pkg.id}>
                <TableCell className="font-medium">{pkg.id}</TableCell>
                <TableCell>{pkg.name}</TableCell>
                <TableCell>
                  $
                  {pkg.price.toFixed(2)}
                </TableCell>
                <TableCell>{pkg.stock}</TableCell>
                <TableCell>{pkg.category}</TableCell>
                <TableCell>
                  <Badge className="bg-green-100 text-green-700">{pkg.status}</Badge>
                </TableCell>
                <TableCell>
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
