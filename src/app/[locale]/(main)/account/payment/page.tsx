'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, CreditCard } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function PaymentPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto bg-white min-h-screen">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" size="sm" onClick={() => router.back()} className="p-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold text-gray-900">Payment Method</h1>
          </div>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Method
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cardNumber" className="text-sm font-medium">
                  Card Number
                </Label>
                <Input id="cardNumber" placeholder="1234 5678 9012 3456" className="h-12 text-base tracking-wider" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiryMonth" className="text-sm font-medium">
                    Month
                  </Label>
                  <Select>
                    <SelectTrigger className="h-12 text-base">
                      <SelectValue placeholder="MM" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 12 }, (_, i) => (
                        <SelectItem key={i + 1} value={String(i + 1).padStart(2, '0')}>
                          {String(i + 1).padStart(2, '0')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                a
                <div className="space-y-2">
                  <Label htmlFor="expiryYear" className="text-sm font-medium">
                    Year
                  </Label>
                  <Select>
                    <SelectTrigger className="h-12 text-base">
                      <SelectValue placeholder="YYYY" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 10 }, (_, i) => (
                        <SelectItem key={2024 + i} value={String(2024 + i)}>
                          {2024 + i}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvv" className="text-sm font-medium">
                    CVV
                  </Label>
                  <Input id="cvv" placeholder="123" maxLength={4} className="h-12 text-base" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cardName" className="text-sm font-medium">
                  Cardholder Name
                </Label>
                <Input id="cardName" placeholder="Name as on card" className="h-12 text-base" />
              </div>
              <Button className="w-full h-12 bg-red-500 hover:bg-red-600 text-base font-medium mt-6">
                <CreditCard className="h-4 w-4 mr-2" />
                Save Payment Method
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
