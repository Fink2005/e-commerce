import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Minus, Plus } from 'lucide-react';
import Image from 'next/image';

export default function CheckoutSection() {
  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-sm">
      {/* Product Cards */}
      <div className="space-y-4 mb-6">
        {/* LCD Monitor */}
        <Card className="border border-gray-200 rounded-lg">
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-lg flex-shrink-0 overflow-hidden">
                <Image
                  src="https://i.postimg.cc/fyLV8F7T/image-63.png"
                  alt="LCD Monitor"
                  width={64}
                  height={64}
                  className="w-full object-contain mx-auto"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 mb-1">Gaming LCD Monitor</h3>
                <div className="text-sm text-gray-500 space-y-1">
                  <p>Color: Matte Black</p>
                  <p>Size: XL</p>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center border border-gray-300 rounded">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="px-3 py-1 text-sm">1</span>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  <span className="text-lg font-semibold text-red-500">$650</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* Mobile Data Package */}
        <Card className="border border-gray-200 rounded-lg">
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex-shrink-0 flex items-center justify-center">
                <div className="text-white text-xs font-bold">5G</div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 mb-1">Mobile Data</h3>
                <div className="text-sm text-gray-500 space-y-1">
                  <p>50GB Monthly</p>
                  <p>Duration: 30 Days</p>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center border border-gray-300 rounded">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="px-3 py-1 text-sm">1</span>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  <span className="text-lg font-semibold text-red-500">$45</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Order Summary */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-base">
          <span>Subtotal:</span>
          <span className="font-semibold">$987</span>
        </div>
        <hr className="border-gray-200" />
        <div className="flex justify-between text-base">
          <span>Shipping:</span>
          <span className="font-semibold">Free</span>
        </div>
        <hr className="border-gray-200" />
        <div className="flex justify-between text-base font-semibold">
          <span>Total:</span>
          <span>$987</span>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="mb-6">
        <RadioGroup defaultValue="cash" className="space-y-3">
          <div className="flex items-center space-x-3">
            <RadioGroupItem value="bank" id="bank" />
            <Label htmlFor="bank" className="flex items-center gap-2 cursor-pointer">
              <span>Bank</span>
              <div className="flex gap-1">
                <Image
                  src="/placeholder.svg?height=20&width=30"
                  alt="bKash"
                  width={30}
                  height={20}
                  className="rounded"
                />
                <Image
                  src="/placeholder.svg?height=20&width=30"
                  alt="Visa"
                  width={30}
                  height={20}
                  className="rounded"
                />
                <Image
                  src="/placeholder.svg?height=20&width=30"
                  alt="Mastercard"
                  width={30}
                  height={20}
                  className="rounded"
                />
                <Image
                  src="/placeholder.svg?height=20&width=30"
                  alt="Nagad"
                  width={30}
                  height={20}
                  className="rounded"
                />
              </div>
            </Label>
          </div>
          <div className="flex items-center space-x-3">
            <RadioGroupItem value="cash" id="cash" />
            <Label htmlFor="cash" className="cursor-pointer">
              Cash on delivery
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Coupon Section */}
      <div className="flex gap-2 mb-6">
        <Input placeholder="Coupon Code" className="flex-1" />
        <Button className="bg-red-500 hover:bg-red-600 text-white px-6">Apply Coupon</Button>
      </div>

      {/* Place Order Button */}
      <Button className="w-full bg-red-500 hover:bg-red-600 text-white py-3 text-base font-medium">
        Place Order
      </Button>
    </div>
  );
}
