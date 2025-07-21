'use client';

import { CustomerVerificationDialog } from '@/components/admin/customer-verification-dialog';
import { CustomersTable } from '@/components/admin/customers-table';
import { EnquiriesTable } from '@/components/admin/enquiries-table';
import { Header } from '@/components/admin/header';
import { OrdersTable } from '@/components/admin/orders-table';
import { PackagesTable } from '@/components/admin/packages-table';
import { QuickActions } from '@/components/admin/quick-actions';
import { RecentEnquiries } from '@/components/admin/recent-enquiries';
import { StatsCards } from '@/components/admin/stats-cards';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';

export default function CRMDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [showVerificationDialog, setShowVerificationDialog] = useState(false);

  // Mock data
  const stats = {
    totalCustomers: 1247,
    pendingEnquiries: 23,
    activeOrders: 156,
    completedOrders: 892,
  };

  const recentEnquiries = [
    {
      id: 'ENQ001',
      customer: 'John Smith',
      subject: 'Package Information',
      status: 'pending',
      date: '2024-01-15',
      priority: 'high',
    },
    {
      id: 'ENQ002',
      customer: 'Sarah Johnson',
      subject: 'Order Status',
      status: 'responded',
      date: '2024-01-15',
      priority: 'medium',
    },
    {
      id: 'ENQ003',
      customer: 'Mike Wilson',
      subject: 'Refund Request',
      status: 'pending',
      date: '2024-01-14',
      priority: 'high',
    },
  ];

  const customers = [
    {
      id: 'CUST001',
      name: 'John Smith',
      email: 'john@example.com',
      phone: '+1 234-567-8901',
      orders: 5,
      status: 'verified',
    },
    {
      id: 'CUST002',
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      phone: '+1 234-567-8902',
      orders: 3,
      status: 'pending',
    },
    {
      id: 'CUST003',
      name: 'Mike Wilson',
      email: 'mike@example.com',
      phone: '+1 234-567-8903',
      orders: 8,
      status: 'verified',
    },
  ];

  const packages = [
    { id: 'PKG001', name: 'Gaming Controller Pro', price: 102.0, stock: 45, category: 'Gaming', status: 'active' },
    { id: 'PKG002', name: 'Wireless Headset', price: 89.99, stock: 23, category: 'Audio', status: 'active' },
    { id: 'PKG003', name: 'Gaming Mouse', price: 45.5, stock: 67, category: 'Gaming', status: 'active' },
  ];

  const orders = [
    {
      id: 'ORD001',
      customer: 'John Smith',
      package: 'Gaming Controller Pro',
      amount: 102.0,
      status: 'processing',
      date: '2024-01-15',
    },
    {
      id: 'ORD002',
      customer: 'Sarah Johnson',
      package: 'Wireless Headset',
      amount: 89.99,
      status: 'completed',
      date: '2024-01-14',
    },
    {
      id: 'ORD003',
      customer: 'Mike Wilson',
      package: 'Gaming Mouse',
      amount: 45.5,
      status: 'pending',
      date: '2024-01-14',
    },
  ];

  const handleNewOrderAction = () => {
    setActiveTab('orders');
  };

  const handleVerifyCustomerAction = () => {
    setShowVerificationDialog(true);
  };

  const handleRespondEnquiryAction = () => {
    setActiveTab('enquiries');
  };

  const handleExportDataAction = () => {
    // Export functionality
  };

  const handleSearchChangeAction = (value: string) => {
    setSearchQuery(value);
  };

  const handleVerificationDialogChangeAction = (open: boolean) => {
    setShowVerificationDialog(open);
  };

  return (
    <>
      <Header
        searchQuery={searchQuery}
        onSearchChangeAction={handleSearchChangeAction}
        onNewOrderAction={handleNewOrderAction}
      />

      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-white border border-gray-200">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-red-50 data-[state=active]:text-red-600">
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="customers" className="data-[state=active]:bg-red-50 data-[state=active]:text-red-600">
              Customers
            </TabsTrigger>
            <TabsTrigger value="enquiries" className="data-[state=active]:bg-red-50 data-[state=active]:text-red-600">
              Enquiries
            </TabsTrigger>
            <TabsTrigger value="packages" className="data-[state=active]:bg-red-50 data-[state=active]:text-red-600">
              Packages
            </TabsTrigger>
            <TabsTrigger value="orders" className="data-[state=active]:bg-red-50 data-[state=active]:text-red-600">
              Orders
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <StatsCards stats={stats} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RecentEnquiries enquiries={recentEnquiries} />
              <QuickActions
                onVerifyCustomerAction={handleVerifyCustomerAction}
                onNewOrderAction={handleNewOrderAction}
                onRespondEnquiryAction={handleRespondEnquiryAction}
                onExportDataAction={handleExportDataAction}
              />
            </div>
          </TabsContent>

          <TabsContent value="customers" className="space-y-6">
            <CustomersTable customers={customers} onVerifyCustomer={handleVerifyCustomerAction} />
          </TabsContent>

          <TabsContent value="enquiries" className="space-y-6">
            <EnquiriesTable enquiries={recentEnquiries} />
          </TabsContent>

          <TabsContent value="packages" className="space-y-6">
            <PackagesTable packages={packages} />
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <OrdersTable orders={orders} customers={customers} packages={packages} />
          </TabsContent>
        </Tabs>
      </div>

      <CustomerVerificationDialog
        open={showVerificationDialog}
        onOpenChangeAction={handleVerificationDialogChangeAction}
      />
    </>
  );
}
