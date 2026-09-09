"use client";

import React, { useState } from "react";
import Link from "next/link";

interface NavbarProps {
  showSignIn?: boolean;
  showLogo?: boolean;
}

export default function Navbar({ showSignIn = true, showLogo = true }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Trending", href: "/#trending" },
    { label: "FAQ", href: "/#faq" },
    { label: "Admin Dashboard", href: "/admin" },
  ];

  return (
    <header className="relative z-40 w-full bg-transparent">
      <div
        className={`max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-4 sm:py-6 flex items-center ${
          !showLogo ? "justify-center relative" : "justify-between"
        }`}
      >
        {/* Brand Logo */}
        {showLogo && (
          <Link href="/" className="flex items-center gap-2 group z-50">
            <svg
              className="h-7 w-7 sm:h-8 sm:w-8 text-rose-600 transition-transform group-hover:scale-110 duration-300"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
              />
            </svg>
            <span className="text-xl sm:text-2xl font-black tracking-wider text-white">
              MOVIE<span className="text-rose-600">BOX</span>
            </span>
          </Link>
        )}

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-zinc-300 hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right Section: Sign In & Mobile Menu Button */}
        <div
          className={`flex items-center gap-3 z-50 ${
            !showLogo ? "absolute right-4 sm:right-6 md:right-12" : ""
          }`}
        >
          {showSignIn && (
            <Link
              href="/login"
              className="bg-rose-600 hover:bg-rose-700 text-white font-semibold px-4 py-1.5 rounded-lg text-xs sm:text-sm transition-all duration-200 active:scale-95 shadow-md shadow-rose-900/20"
            >
              Sign In
            </Link>
          )}

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-800/60 focus:outline-none transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-[68px] sm:top-[80px] bg-zinc-950/95 backdrop-blur-xl z-40 md:hidden flex flex-col px-6 py-8 border-b border-zinc-800 animate-fadeIn">
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-lg font-semibold text-zinc-200 hover:text-rose-500 py-2 border-b border-zinc-900 transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 flex flex-col gap-3">
              {showSignIn && (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-3 rounded-xl text-center font-semibold text-sm text-white bg-rose-600 hover:bg-rose-700 transition-colors shadow-lg shadow-rose-900/20"
                >
                  Sign In
                </Link>
              )}
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3 rounded-xl text-center font-semibold text-sm text-zinc-300 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 transition-colors"
              >
                Create Account
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}