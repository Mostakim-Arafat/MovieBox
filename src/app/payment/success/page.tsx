'use client'

import React from "react";
import Link from "next/link";

export default function PaymentSuccessPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-zinc-950 text-zinc-100 p-6">
      <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-3xl p-8 text-center space-y-6 shadow-2xl">
        <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">Payment Successful</h1>
          <p className="text-sm text-zinc-400">
            Thank you for your purchase. Your transaction has been completed successfully and your account has been updated.
          </p>
        </div>

        <div className="pt-4 flex flex-col gap-3">
          <Link
            href="/admin"
            className="w-full py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-sm transition-all text-center"
          >
            Go to Dashboard
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