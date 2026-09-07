import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request:any) {
  try {
    const formData = await request.formData();
    const val_id = formData.get('val_id');
    const tran_id = formData.get('tran_id');
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    // Call SSLCommerz Order Validation API to prevent spoofing
    const validationResponse = await axios.get(
      `https://sandbox-gw.sslcommerz.com/validator/api/validationserverAPI.php?val_id=${val_id}&store_id=movie6a9d5427686a3&store_passwd=DgndTl9soIkX&format=json`
    );

    const validationData = validationResponse.data;

    if (validationData.status === 'VALID' || validationData.status === 'VALIDATED') {
      // TODO: Save order status as 'PAID' in your database using tran_id
      
      // Redirect user to success confirmation page
      return NextResponse.redirect(`${baseUrl}/payment/success?tran_id=${tran_id}`, {
        status: 303,
      });
    } else {
      return NextResponse.redirect(`${baseUrl}/payment/failure`, { status: 303 });
    }
  } catch (error) {
    console.error('Validation Error:', error);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/payment/failure`, { status: 303 });
  }
}