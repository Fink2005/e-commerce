'use client';
import { ArrowRight, CheckCircle, Clock, Package } from 'lucide-react';

const OrderSuccessPage = () => {
  const handleRedirectHome = () => {
    // In a real Next.js app, you'd use: router.push('/') or window.location.href = '/'
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          {/* Success Icon and Header */}
          <div className="text-center mb-12">
            <div className="relative inline-flex items-center justify-center w-24 h-24 mb-6">
              <div className="absolute inset-0 bg-green-100 rounded-full animate-pulse"></div>
              <CheckCircle className="relative w-16 h-16 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Order Confirmed!
            </h1>
            <p className="text-xl text-gray-600 mb-2">
              Thank you for your purchase
            </p>
            <p className="text-gray-500">
              We've received your order and will process it shortly
            </p>
          </div>

          {/* Order Details Card */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 mb-8">
            <div className="">
              <div className="text-center p-4 bg-gray-50 rounded-lg border-b-black/50 border">
                <Package className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-1">Order Number</h3>
                <p className="text-gray-600 font-mono">#ORD-2024-001</p>
              </div>

              <div className="text-center p-4 bg-gray-50 rounded-lg border-b-black/50 border">
                <Clock className="w-8 h-8 text-orange-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-1">Estimated Delivery</h3>
                <p className="text-gray-600">3-5 Business Days</p>
              </div>

              <div className="text-center p-4 bg-gray-50 rounded-lg border-b-black/50 border">
                <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-1">Order Status</h3>
                <p className="text-green-600 font-medium">Confirmed</p>
              </div>
            </div>
          </div>

          {/* What's Next Section */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">What happens next?</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold text-sm">1</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Order Processing</h3>
                  <p className="text-gray-600">We're preparing your items for shipment</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold text-sm">2</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Shipping Confirmation</h3>
                  <p className="text-gray-600">You'll receive a tracking number via email</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold text-sm">3</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Delivery</h3>
                  <p className="text-gray-600">Your order will arrive at your doorstep</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              type="button"
              onClick={handleRedirectHome}
              className="group inline-flex items-center justify-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Continue Shopping
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
            </button>

            <button
              type="button"

              className="inline-flex items-center justify-center px-8 py-4 border-2 border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 font-semibold rounded-lg transition-all duration-200 hover:bg-gray-50"
            >
              Track Your Order
            </button>
          </div>

          {/* Footer Message */}
          <div className="text-center mt-12 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
            <p className="text-gray-600 mb-2">
              Need help with your order?
            </p>
            <p className="text-blue-600 font-medium hover:text-blue-700 cursor-pointer">
              Contact our support team
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
