'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  onSearchChangeAction: (value: string) => void;
  onNewOrderAction: () => void;
}

export function Header({ searchQuery, onSearchChangeAction, onNewOrderAction }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-gray-900">CRM Dashboard</h1>
          <Badge variant="secondary" className="bg-red-50 text-red-600 border-red-200">
            CSR Portal
          </Badge>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search customers, orders..."
              value={searchQuery}
              onChange={e => onSearchChangeAction(e.target.value)}
              className="pl-10 w-80"
            />
          </div>
          <Button onClick={onNewOrderAction} className="bg-red-500 hover:bg-red-600 text-white">
            <Plus className="h-4 w-4 mr-2" />
            New Order
          </Button>
        </div>
      </div>
    </header>
  );
}
