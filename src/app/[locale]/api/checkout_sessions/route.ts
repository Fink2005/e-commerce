import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe('sk_test_51RwRywGkkzzoEoT5IrxOPkpkiG3KeBoVEuXXaeSt4ExQgTi788cLwktBNKKV5WJ0NuDUqu4StekyyHPB5MDTbv3V00g1oxDGZK', {
  apiVersion: '2025-07-30.basil',
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { cartItems, orders } = body;
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: cartItems.map((item: any) => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
          },
          unit_amount: Math.round(item.price * 100), // USD cents
        },
        quantity: item.quantity,
      })),
      metadata: {
        orderId: orders?.id.toString(),
        orderNumber: orders?.orderNumber.toString(),
        userId: orders?.userId.toString(),
        totalAmount: orders?.totalAmount.toString(),
        shippingAddress: orders?.shippingAddress.toString(),
        createdAt: orders?.createdAt.toString(),
      },
      mode: 'payment',
      success_url: `https://cheapdeals.vercel.app/order-success`,
      cancel_url: `https://cheapdeals.vercel.app/cart`,
    });

    return NextResponse.json({ id: session.id });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
