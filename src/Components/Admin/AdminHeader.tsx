"use client";

import React from "react";

interface AdminHeaderProps {
  onToggleMobileSidebar?: () => void;
}

export default function AdminHeader({ onToggleMobileSidebar }: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-30 w-full bg-zinc-900/80 backdrop-blur-xl border-b border-zinc-800/60">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        {/* Left: Hamburger menu toggle (mobile) + Page title */}
        <div className="flex items-center gap-3">
          {onToggleMobileSidebar && (
            <button
              onClick={onToggleMobileSidebar}
              className="lg:hidden p-2 -ml-1 text-zinc-400 hover:text-white hover:bg-zinc-800/60 rounded-lg transition-colors cursor-pointer"
              aria-label="Open sidebar navigation"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}
          <h1 className="text-base sm:text-lg font-bold text-zinc-100 tracking-tight">
            Dashboard
          </h1>
          <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-rose-600/10 text-rose-500 border border-rose-500/20">
            Admin
          </span>
        </div>

        {/* Right: Search, Notifications, Profile */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          {/* Search Input */}
          <div className="hidden md:block relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search..."
              className="w-40 lg:w-56 bg-zinc-950 border border-zinc-800 rounded-lg pl-9 pr-3 py-1.5 sm:py-2 text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 transition-all"
            />
          </div>

          {/* Notification bell */}
          <button
            className="relative p-2 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50 transition-colors cursor-pointer"
            title="Notifications"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
              />
            </svg>
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-600 rounded-full border-2 border-zinc-900" />
          </button>

          {/* Profile Badge */}
          <div className="flex items-center gap-2 sm:gap-3 pl-2 sm:pl-3 border-l border-zinc-800/60">
            <div className="hidden sm:block text-right">
              <p className="text-xs sm:text-sm font-semibold text-zinc-200 leading-tight">Admin User</p>
              <p className="text-[11px] text-zinc-500 leading-tight">admin@moviebox.com</p>
            </div>
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-rose-600 to-rose-800 flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-lg shadow-rose-900/20">
              A
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}