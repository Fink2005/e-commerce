'use client';
import { Card, CardContent } from '@/components/ui/card';
import { BarChart3, ChevronRight, CreditCard, MessageCircle, Phone, User } from 'lucide-react';
import { useRouter } from 'next/navigation';

const accountSections = [
  {
    id: 'personal-info',
    title: 'Personal Information',
    description: 'Update your name, email and contact details',
    icon: User,
    href: '/account/personal-info',
  },
  {
    id: 'payment',
    title: 'Payment Method',
    description: 'Manage your payment cards and billing information',
    icon: CreditCard,
    href: '/account/payment',
  },
  {
    id: 'usage',
    title: 'Current Usage',
    description: 'View your mobile data and broadband usage',
    icon: Phone,
    href: '/account/usage',
  },
  {
    id: 'support',
    title: 'Support & Help',
    description: 'Get help and submit enquiries',
    icon: MessageCircle,
    href: '/account/support',
  },
  {
    id: 'stats',
    title: 'Account Statistics',
    description: 'View your account details and history',
    icon: BarChart3,
    href: '/account/stats',
  },
];

export default function AccountPage() {
  const router = useRouter();

  const handleSectionClick = (href: string) => {
    router.push(href);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto bg-white min-h-screen">
        <div className="p-6">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">My Account</h1>
            <p className="text-gray-600">Manage your account settings and preferences</p>
          </div>

          <div className="space-y-4">
            {accountSections.map((section) => {
              const IconComponent = section.icon;
              return (
                <Card
                  key={section.id}
                  className="cursor-pointer hover:shadow-md transition-shadow duration-200 border-gray-200"
                  onClick={() => handleSectionClick(section.href)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-red-50 rounded-lg">
                          <IconComponent className="h-6 w-6 text-red-500" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">{section.title}</h3>
                          <p className="text-sm text-gray-600">{section.description}</p>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
