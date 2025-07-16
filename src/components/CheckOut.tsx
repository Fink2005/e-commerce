'use client';
import React, { useState } from 'react';
import CartItem from './ItemCheckout';
import CartSummary from './HandlePrice';
import PaymentOptions from './PaymentOption';
import { useForm } from 'react-hook-form';
import { Input } from './ui/input';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';

export default function Checkout({ cartItems = [] }) {
  const [saveInfo, setSaveInfo] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState('cod');
  const [coupon, setCoupon] = useState('');

  const total = cartItems.reduce((acc, item) => acc + item.price, 0);

  const fields = [
    { name: 'firstName', label: 'First Name', type: 'text', required: true },
    { name: 'lastName', label: 'Last Name', type: 'text', required: true },
    { name: 'age', label: 'Age', type: 'number', required: true },
    { name: 'email', label: 'Email', type: 'email', required: true },
    { name: 'phone', label: 'Phone Number', type: 'tel', required: true },
    { name: 'address', label: 'Address', type: 'text', required: true },
    { name: 'city', label: 'City', type: 'text', required: true },
  ];

  const defaultValues = Object.fromEntries(fields.map(f => [f.name, '']));

  const form = useForm({
    defaultValues,
    mode: 'onBlur',
  });

  const onSubmit = data => {
    const orderData = {
      ...data,
      saveInfo,
      selectedPayment,
      coupon,
      cartItems,
      total,
    };
    console.log(orderData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 px-4 py-6">
        <h2 className="text-lg font-semibold">Billing Details</h2>
        {fields.map(field => (
          <FormField
            key={field.name}
            control={form.control}
            name={field.name}
            rules={{ required: field.required ? `${field.label} is required` : false }}
            render={({ field: rhfField }) => (
              <FormItem>
                <FormLabel className="text-xs text-gray-500 mb-1">
                  {field.label}
                  {field.required && <span className="text-red-500">*</span>}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={field.label}
                    type={field.type}
                    {...rhfField}
                    className="bg-gray-100 rounded-md h-10 text-sm"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
        <label className="flex items-start space-x-2 text-sm text-gray-600">
          <input
            type="checkbox"
            checked={saveInfo}
            onChange={() => setSaveInfo(!saveInfo)}
            className="accent-red-500 mt-1"
          />
          <span>Save this information for faster check-out next time</span>
        </label>
        <div className="space-y-4">
          {cartItems.map((item, i) => (
            <CartItem key={i} item={item} />
          ))}
        </div>
        <CartSummary total={total} coupon={coupon} setCoupon={setCoupon} />
        <PaymentOptions
          selected={selectedPayment}
          onChange={setSelectedPayment}
        />
        <button
          type="submit"
          className="bg-red-500 text-white w-full py-2 rounded-md font-semibold hover:bg-red-600"
        >
          Place Order
        </button>
      </form>
    </Form>
  );
}
