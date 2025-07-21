"use client"

import MyAccount from "@/components/profile/MyAccount"
import MyOrders from "@/components/profile/MyOrders"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState } from "react"

export default function MobileProfilePage() {
  const [activeTab, setActiveTab] = useState("account")

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 sticky top-0 z-10">
        <h1 className="text-xl font-bold text-gray-900">My Profile</h1>
      </div>

      {/* Mobile Tabs - Fixed to match original design */}
      <div className="bg-white border-b border-gray-200">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 h-14 bg-white rounded-none border-0 p-0">
            <TabsTrigger
              value="account"
              className="text-base font-medium data-[state=active]:text-gray-900 data-[state=inactive]:text-gray-400 data-[state=active]:bg-transparent data-[state=inactive]:bg-transparent rounded-none border-0 shadow-none h-full"
            >
              My Account
            </TabsTrigger>
            <TabsTrigger
              value="orders"
              className="text-base font-medium data-[state=active]:text-gray-900 data-[state=inactive]:text-gray-400 data-[state=active]:bg-transparent data-[state=inactive]:bg-transparent rounded-none border-0 shadow-none h-full"
            >
              My Orders
            </TabsTrigger>
            <TabsTrigger
              value="bills"
              className="text-base font-medium data-[state=active]:text-gray-900 data-[state=inactive]:text-gray-400 data-[state=active]:bg-transparent data-[state=inactive]:bg-transparent rounded-none border-0 shadow-none h-full"
            >
              My Bills
            </TabsTrigger>
          </TabsList>

          <TabsContent value="account" className="mt-0">
						<div className="px-4 py-4">
              <MyAccount></MyAccount>
            </div>
          </TabsContent>

          <TabsContent value="orders" className="mt-0">
            <div className="px-4 py-4">
              <MyOrders></MyOrders>
            </div>
          </TabsContent>

          <TabsContent value="bills" className="mt-0">
            <div className="px-4 py-8">
              <Card className="border-0 shadow-sm">
                <CardContent className="p-8 text-center">
                  <div className="text-gray-400 mb-2">💳</div>
                  <p className="text-gray-500">No bills available</p>
                  <p className="text-sm text-gray-400 mt-1">Your billing history will appear here</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
