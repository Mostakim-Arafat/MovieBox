import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    // console.log(request)
    const textBody = await request.text();
    console.log(textBody)
    const bodyParams = new URLSearchParams(textBody);
    console.log(bodyParams)
    let valId = bodyParams.get('val_id');
    let tranId = bodyParams.get('tran_id');
    // const valId = searchParams.get('val_id');
    // const tranId = searchParams.get('tran_id');
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    if (!valId) {
      return NextResponse.redirect(`${baseUrl}/payment/failure`, { status: 303 });
    }

    const storeId = process.env.SSL_COMMERZ_STORE_ID;
    const storePassword = process.env.SSL_COMMERZ_STORE_PASSWORD;

    if (!storeId || !storePassword) {
      return NextResponse.redirect(`${baseUrl}/payment/failure`, { status: 303 });
    }

    const validationResponse = await axios.get(
      'https://sandbox-gw.sslcommerz.com/validator/api/validationserverAPI.php',
      {
        params: {
          val_id: valId,
          store_id: storeId,
          store_passwd: storePassword,
          format: 'json',
        },
      }
    );

    const validationData = validationResponse.data;

    console.log(validationData)

    if (validationData.status === 'VALID' || validationData.status === 'VALIDATED') {
      return NextResponse.redirect(`${baseUrl}/payment/success?tran_id=${tranId ?? ''}`, {
        status: 303,
      });
    }

    return NextResponse.redirect(`${baseUrl}/payment/failure`, { status: 303 });
  } catch (error) {
    console.error('SSLCommerz validation error:', error);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/payment/failure`,
      { status: 303 }
    );
  }
}

export async function POST(request: Request) {
  return GET(request);
}