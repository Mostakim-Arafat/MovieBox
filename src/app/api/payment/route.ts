import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const storeId = process.env.SSL_COMMERZ_STORE_ID;
    const storePassword = process.env.SSL_COMMERZ_STORE_PASSWORD;

    console.log(body)

    if (!storeId || !storePassword) {
      return NextResponse.json(
        {
          error:
            "SSLCommerz credentials are missing. Add SSL_COMMERZ_STORE_ID and SSL_COMMERZ_STORE_PASSWORD to your .env file.",
        },
        { status: 500 }
      );
    }

    const transactionId = String(`TXN${Date.now()}`);
    const amount = Number(body.amount ?? 0);

    const data = {
      store_id: storeId,
      store_passwd: storePassword,
      total_amount: String(amount || 100),
      currency: "BDT",
      tran_id: transactionId,
      success_url: `${baseUrl}/api/payment/success?tran_id=${transactionId}`,
      fail_url: `${baseUrl}/api/payment/fail`,
      cancel_url: `${baseUrl}/api/payment/cancel`,
      ipn_url: `${baseUrl}/api/payment/success?tran_id=${transactionId}`,

      cus_name: body.name || "Test Customer",
      cus_email: body.email || "test@example.com",
      cus_add1: body.address || "Dhaka",
      cus_city: body.city || "Dhaka",
      cus_postcode: body.postcode || "1200",
      cus_country: body.country || "Bangladesh",
      cus_phone: body.phone ,

      product_name: body.productName || "Movie Subscription",
      product_category: body.productCategory || "General",
      product_profile: "general",

      shipping_method: "NO",
      num_of_item: String(body.num_of_item || 1),
      weight_of_items: String(body.weight_of_items || 1),
      // ship_name: body.name || "Test Customer",
      // ship_add1: body.address || "Dhaka",
      // ship_city: body.city || "Dhaka",
      // ship_postcode: body.postcode || "1200",
      // ship_country: body.country || "Bangladesh",
    };

    const response = await axios.post(
      "https://sandbox-gw.sslcommerz.com/gwprocess/v4/api.php",
      new URLSearchParams(data).toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const gatewayUrl = response?.data?.GatewayPageURL || response?.data?.gatewayPageURL;

    console.log(gatewayUrl)

    if (response.data && response.data.status === "SUCCESS" && gatewayUrl) {
      return NextResponse.json({ gatewayUrl });
    }

    return NextResponse.json(
      {
        error: response?.data?.failedreason || "Failed to retrieve gateway URL",
      },
      { status: 400 }
    );
  } catch (error: any) {
    console.error("SSLCommerz Init Error:", error?.response?.data || error.message);
    return NextResponse.json(
      {
        error:
          error?.response?.data?.failedreason ||
          "SSLCommerz request failed. Check your store credentials and sandbox setup.",
      },
      { status: 500 }
    );
  }
}
