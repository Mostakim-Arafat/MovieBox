import { NextResponse } from 'next/server';

export async function POST() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  return NextResponse.redirect(`${baseUrl}/payment/failure`, { status: 303 });
}