'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Eye, Plus } from 'lucide-react';
import { useState } from 'react';
import { OrderProcessingDialog } from './order-processing-dialog';

interface Order {
  id: string;
  customer: string;
  package: string;
  amount: number;
  status: string;
  date: string;
}

interface Customer {
  id: string;
  name: string;
}

interface Package {
  id: string;
  name: string;
  price: number;
}

interface OrdersTableProps {
  orders: Order[];
  customers: Customer[];
  packages: Package[];
}

export function OrdersTable({ orders, customers, packages }: OrdersTableProps) {
  const [showOrderDialog, setShowOrderDialog] = useState(false);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Order Management</CardTitle>
        <Button onClick={() => setShowOrderDialog(true)} className="bg-red-500 hover:bg-red-600 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Process New Order
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Package</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map(order => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell>{order.package}</TableCell>
                <TableCell>
                  $
                  {order.amount.toFixed(2)}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={order.status === 'completed' ? 'secondary' : 'destructive'}
                    className={
                      order.status === 'completed'
                        ? 'bg-green-100 text-green-700'
                        : order.status === 'processing'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                    }
                  >
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell>{order.date}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>

      <OrderProcessingDialog
        customers={customers}
        packages={packages}
        open={showOrderDialog}
        onOpenChangeAction={setShowOrderDialog}
      />
    </Card>
  );
}
