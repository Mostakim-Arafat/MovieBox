import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(request: any) {
  try {
    const body = await request.json()
    const transaction_id = "TXN" + Date.now()

    const data = {
      store_id: 'movie6a9d5427686a3',
      store_passwd: 'DgndTl9soIkX',
      total_amount: body.amount || 100.00,
      currency: 'BDT',
      tran_id: transaction_id,
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/payment/success?tran_id=${transaction_id}`,
      fail_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/payment/fail`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/payment/cancel`,

      // Customer Info
      cus_name: body.name || 'Test Customer',
      cus_email: body.email || 'test@example.com',
      cus_add1: 'Dhaka',
      cus_city: 'Dhaka',
      cus_postcode: '1200',
      cus_country: 'Bangladesh',
      cus_phone: body.phone || '01700000000',

      // Product Info
      product_name: 'E-commerce Item',
      product_category: 'General',
      product_profile: 'physical-goods',

      // Shipping Info (Required by SSLCommerz)
      shipping_method: 'NO',
      num_of_item: String(1),
      weight_of_items: String(1),
      ship_name: 'Customer',
      ship_add1: 'Dhaka',
      ship_city: 'Dhaka',
      ship_postcode: '1200',
      ship_country: 'Bangladesh',
    };

    const response = await axios.post(
      'https://sandbox-gw.sslcommerz.com/gwprocess/v4/api.php',
      new URLSearchParams(data).toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    )

    console.log("SSLCommerz Server Response:", response.data);

    if (response.data && response.data.GatewayPageURL) {
      return NextResponse.json({ gatewayUrl: response.data.GatewayPageURL });
    } else {
      return NextResponse.json({ error: 'Failed to retrieve gateway URL' }, { status: 400 });
    }
  } catch (error) {
    console.error('SSLCommerz Init Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
