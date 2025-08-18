'use client';

import { orderRequest } from '@/app/apis/requests/order';
import userRequests from '@/app/apis/requests/user';
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
import { useEffect, useState } from 'react';

export default function CRMDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [showVerificationDialog, setShowVerificationDialog] = useState(false);
  const [customers, setCustomers] = useState<any>([]);
  const [orders, setOrders] = useState<any>([]); // Use Order type
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // Specify error type

  // Mock data for stats, enquiries, and packages (unchanged)
  const [stats, setStats] = useState({
    totalCustomers: 0,
    pendingEnquiries: 23,
    activeOrders: 156,
    completedOrders: 892,
  });

  const recentEnquiries = [
    {
      id: 'ENQ001',
      customer: 'John Smith',
      subject: 'Package Information',
      status: 'pending' as const,
      date: '2024-01-15',
      priority: 'high' as const,
    },
    {
      id: 'ENQ002',
      customer: 'Sarah Johnson',
      subject: 'Order Status',
      status: 'responded' as const,
      date: '2024-01-15',
      priority: 'medium' as const,
    },
    {
      id: 'ENQ003',
      customer: 'Mike Wilson',
      subject: 'Refund Request',
      status: 'pending' as const,
      date: '2024-01-14',
      priority: 'high' as const,
    },
  ];

  const packages = [
    { id: 'PKG001', name: 'Gaming Controller Pro', price: 102.0, stock: 45, category: 'Gaming', status: 'active' },
    { id: 'PKG002', name: 'Wireless Headset', price: 89.99, stock: 23, category: 'Audio', status: 'active' },
    { id: 'PKG003', name: 'Gaming Mouse', price: 45.5, stock: 67, category: 'Gaming', status: 'active' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null); // Reset error state

        // Fetch customers
        const customersData = await userRequests.getUsers();

        if (!customersData) {
          throw new Error('No users data returned from API');
        }

        setStats(prevStats => ({
          ...prevStats,
          totalCustomers: customersData.users.length,
        }));
        setCustomers(customersData.users);
        // Fetch orders
        const ordersData = await orderRequest.getOrders();

        if (!ordersData) {
          throw new Error('No orders data returned from API');
        }
        setOrders(ordersData);
      } catch {
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
        {loading && <p>Loading data...</p>}
        {error && (
          <p className="text-red-600">
            Error:
            {error}
          </p>
        )}
        {!loading && !error && (
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
              <CustomersTable customers={customers} onVerifyCustomerAction={handleVerifyCustomerAction} />
            </TabsContent>

            <TabsContent value="enquiries" className="space-y-6">
              <EnquiriesTable />
            </TabsContent>

            <TabsContent value="packages" className="space-y-6">
              <PackagesTable packages={packages} />
            </TabsContent>

            <TabsContent value="orders" className="space-y-6">
              <OrdersTable orders={orders as any} customers={customers} packages={packages} />
            </TabsContent>
          </Tabs>
        )}
      </div>

      <CustomerVerificationDialog
        open={showVerificationDialog}
        onOpenChangeAction={handleVerificationDialogChangeAction}
      />
    </>
  );
}
