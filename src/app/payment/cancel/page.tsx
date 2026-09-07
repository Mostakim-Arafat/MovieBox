'use client'

import React from "react";
import Link from "next/link";

export default function PaymentCancelPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-zinc-950 text-zinc-100 p-6">
      <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-3xl p-8 text-center space-y-6 shadow-2xl">
        <div className="w-16 h-16 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center mx-auto">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">Payment Cancelled</h1>
          <p className="text-sm text-zinc-400">
            Your payment session was cancelled. No charges have been made to your account.
          </p>
        </div>

        <div className="pt-4 flex flex-col gap-3">
          <Link
            href="/pricing"
            className="w-full py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-sm transition-all text-center"
          >
            Return to Pricing
          </Link>
          <Link
            href="/"
            className="w-full py-3 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold text-sm transition-all text-center"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}