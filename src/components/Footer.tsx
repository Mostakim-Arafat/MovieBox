import React from "react";
import Link from "next/link";

export default function Footer() {
  const companyLinks = [
    { label: "About", href: "/about" },
    { label: "Careers", href: "/careers" },
    { label: "Our Culture", href: "/culture" },
    { label: "Giving", href: "/giving" },
    { label: "Press Room", href: "/press" },
    { label: "Partners", href: "/partners" },
    { label: "MovieBox Gear", href: "/gear" },
    { label: "The MovieBox Blog", href: "/blog" },
    { label: "Advertise with Us", href: "/advertise" },
  ];

  const watchFreeLinks = [
    { label: "Watch Free Movies", href: "/free-movies" },
    { label: "TV Channel Finder", href: "/channels" },
    { label: "Free Movies on MovieBox", href: "/free-streaming" },
    { label: "Trending on MovieBox", href: "/trending" },
  ];

  const discoverLinks = [
    { label: "What to Watch Now", href: "/recommendations" },
    { label: "What To Watch on Netflix", href: "/netflix" },
    { label: "What To Watch on Hulu", href: "/hulu" },
    { label: "Movies Database", href: "/database" },
  ];

  const myMediaLinks = [
    { label: "MovieBox Server", href: "/server" },
    { label: "Plans", href: "/plans" },
    { label: "Download App", href: "/download" },
    { label: "Available Devices", href: "/devices" },
    { label: "MovieBox Amp", href: "/amp" },
    { label: "Bug Bounty", href: "/bug-bounty" },
  ];

  const resourceLinks = [
    { label: "Finding Help", href: "/help" },
    { label: "Support Library", href: "/support" },
    { label: "Community Forums", href: "/forums" },
    { label: "Code of Conduct", href: "/conduct" },
    { label: "Billing Questions", href: "/billing" },
    { label: "Status", href: "/status" },
    { label: "CordCutter", href: "/cordcutter" },
    { label: "Get in Touch", href: "/contact" },
  ];

  return (
    <footer className="w-full bg-[#131517] text-zinc-400 py-12 px-6 sm:px-12 lg:px-16 border-t border-zinc-800/40">
      <div className="max-w-7xl mx-auto">
        {/* Top grid with logo and link categories */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 pb-12">
          {/* Logo Section */}
          <div className="col-span-2 md:col-span-1 flex flex-col items-start">
            <Link href="/" className="flex items-center gap-2 mb-4 group">
              <svg
                className="h-7 w-7 text-rose-600 transition-transform group-hover:scale-110 duration-300"
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
              <span className="text-xl font-black tracking-wider text-white">
                MOVIE<span className="text-rose-600">BOX</span>
              </span>
            </Link>
          </div>

          {/* Links Columns */}
          <div className="flex flex-col gap-2">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-zinc-100 mb-2">
              Company
            </h3>
            <ul className="flex flex-col gap-2 text-[13px]">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="hover:text-rose-500 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-zinc-100 mb-2">
              Watch Free
            </h3>
            <ul className="flex flex-col gap-2 text-[13px]">
              {watchFreeLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="hover:text-rose-500 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-zinc-100 mb-2">
              Discover
            </h3>
            <ul className="flex flex-col gap-2 text-[13px]">
              {discoverLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="hover:text-rose-500 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-zinc-100 mb-2">
              My Media
            </h3>
            <ul className="flex flex-col gap-2 text-[13px]">
              {myMediaLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="hover:text-rose-500 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-zinc-100 mb-2">
              Resources
            </h3>
            <ul className="flex flex-col gap-2 text-[13px]">
              {resourceLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="hover:text-rose-500 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider line */}
        <div className="border-t border-zinc-800/60 my-6"></div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-4 text-xs">
          {/* Left section: Copyright & Language */}
          <div className="flex flex-col items-center md:items-start gap-3">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-1 text-zinc-500">
              <span>Copyright &copy; 2026 MovieBox</span>
              <span className="hidden md:inline">•</span>
              <Link href="/privacy" className="hover:text-zinc-300">
                Privacy & Legal
              </Link>
              <span className="hidden md:inline">•</span>
              <Link href="/accessibility" className="hover:text-zinc-300">
                Accessibility
              </Link>
              <span className="hidden md:inline">•</span>
              <button className="hover:text-zinc-300 cursor-pointer">
                Manage Cookies
              </button>
            </div>
            <div className="text-zinc-500">
              Language:{" "}
              <span className="text-rose-500 font-medium hover:underline cursor-pointer">
                English (US)
              </span>
            </div>
          </div>

          {/* Right section: Social Media SVGs */}
          <div className="flex items-center gap-5">
            {/* Instagram */}
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-white transition-colors" title="Instagram">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>

            {/* TikTok */}
            <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-white transition-colors" title="TikTok">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.02 1.63 4.18 1.13 1.2 2.69 1.94 4.31 2.06v3.83c-1.89-.04-3.75-.72-5.17-1.99-.21-.18-.4-.38-.59-.58v7.6c-.03 2.01-.76 3.99-2.09 5.48-1.49 1.61-3.66 2.54-5.85 2.45-2.61-.07-5.14-1.51-6.49-3.77-1.44-2.34-1.48-5.38-.1-7.77 1.25-2.24 3.65-3.69 6.22-3.78v3.83c-1.28.05-2.52.74-3.19 1.83-.75 1.16-.72 2.76.08 3.86.74 1.09 2.07 1.7 3.39 1.5 1.34-.15 2.49-1.19 2.78-2.5.09-.43.11-.87.1-1.31V0h.87z" />
              </svg>
            </a>

            {/* X */}
            <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-white transition-colors" title="X">
              <svg className="h-4.5 w-4.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>

            {/* Threads */}
            <a href="https://threads.net" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-white transition-colors" title="Threads">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M13.26 12a1.69 1.69 0 0 0-.44-1.14 1.48 1.48 0 0 0-1.07-.46 1.45 1.45 0 0 0-1.06.46A1.69 1.69 0 0 0 10.25 12a1.69 1.69 0 0 0 .44 1.14 1.46 1.46 0 0 0 1.06.46 1.49 1.49 0 0 0 1.07-.46A1.69 1.69 0 0 0 13.26 12zm8.56 0c0 4.11-2.9 7.42-7.14 7.42-2 0-3.52-.69-4.58-2.07l-.14-.19-.48.33-.21.14c1.19 1.72 3.12 2.59 5.41 2.59 4.7 0 7.94-3.56 7.94-8.22a7.83 7.83 0 0 0-3.32-6.52A8.15 8.15 0 0 0 14 4.29a8.62 8.62 0 0 0-6.19 2.28 8.16 8.16 0 0 0-2.45 6.07c0 4.25 2.76 7.07 6.42 7.07A6.47 6.47 0 0 0 16.5 18l.19-.13.34.46-.14.1a7.12 7.12 0 0 1-5.11 2.07c-4.14 0-7.22-3.15-7.22-7.86a8.94 8.94 0 0 1 2.68-6.62A9.45 9.45 0 0 1 14 3.49a9 9 0 0 1 6 2 8.76 8.76 0 0 1 1.82 6.51zm-5.74 3.73a4.7 4.7 0 0 1-4.32 2.07c-2.58 0-4.39-1.92-4.39-4.78a5.55 5.55 0 0 1 1.65-4.08 5.76 5.76 0 0 1 4.15-1.53 4.24 4.24 0 0 1 3 1.13A4 4 0 0 1 17.3 12a4.34 4.34 0 0 1-.94 2.82 2.77 2.77 0 0 1-2.18.91 1.34 1.34 0 0 1-1.07-.46 1.83 1.83 0 0 1-.36-1.14c-.67 1-1.5 1.6-2.5 1.6a2.29 2.29 0 0 1-1.72-.73 2.77 2.77 0 0 1-.68-1.94 2.87 2.87 0 0 1 .68-2 2.29 2.29 0 0 1 1.72-.74c1 0 1.83.6 2.5 1.6a1.83 1.83 0 0 1 .36-1.14 1.34 1.34 0 0 1 1.07-.46c.86 0 1.6.36 2.18.94a4.42 4.42 0 0 1 .94 2.88 4.78 4.78 0 0 1-1.32 3.47z" />
              </svg>
            </a>

            {/* Facebook */}
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-white transition-colors" title="Facebook">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
              </svg>
            </a>

            {/* LinkedIn */}
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-white transition-colors" title="LinkedIn">
              <svg className="h-4.5 w-4.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>

            {/* YouTube */}
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-white transition-colors" title="YouTube">
              <svg className="h-5.5 w-5.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.518 3.545 12 3.545 12 3.545s-7.518 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.87.508 9.388.508 9.388.508s7.518 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}