"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  MdOutlineExpandMore,
  MdOutlineExpandLess,
  MdLanguage,
  MdMovie,
  MdTv,
  MdHome,
  MdHistory,
  MdLogout,
  MdOutlineLightMode,
  MdOutlineDarkMode,
} from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { PiDotsNineBold } from "react-icons/pi";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import { authClient } from "@/lib/auth-client";

interface Movie {
  _id: string | number;
  title: string;
  poster?: string;
  year?: string | number;
}

interface LanguageOption {
  code: string;
  name: string;
}

interface NavbarProps {
  showLogo?: boolean;
  showSignIn?: boolean;
}

// 5 Columns matching Amazon Prime Video language dropdown
const LANGUAGE_COLUMNS: LanguageOption[][] = [
  [
    { code: "ID", name: "Bahasa Indonesia" },
    { code: "MS", name: "Bahasa Melayu" },
    { code: "DA", name: "Dansk" },
    { code: "DE", name: "Deutsch" },
    { code: "EN", name: "English" },
    { code: "ES", name: "Español" },
    { code: "ES-LA", name: "Español Latinoamérica" },
    { code: "FR", name: "Français" },
  ],
  [
    { code: "IT", name: "Italiano" },
    { code: "HU", name: "Magyar" },
    { code: "NL", name: "Nederlands" },
    { code: "NO", name: "Norsk" },
    { code: "PL", name: "Polski" },
    { code: "PT-BR", name: "Português (Brasil)" },
    { code: "PT-PT", name: "Português (Portugal)" },
    { code: "RO", name: "Română" },
  ],
  [
    { code: "FI", name: "Suomi" },
    { code: "SV", name: "Svenska" },
    { code: "TR", name: "Türkçe" },
    { code: "FIL", name: "Wikang Filipino" },
    { code: "CS", name: "Čeština" },
    { code: "EL", name: "Ελληνικά" },
    { code: "RU", name: "Русский" },
    { code: "HE", name: "עברית" },
  ],
  [
    { code: "AR", name: "العربية" },
    { code: "HI", name: "हिन्दी" },
    { code: "TA", name: "தமிழ்" },
    { code: "TE", name: "తెలుగు" },
    { code: "TH", name: "ไทย" },
    { code: "JA", name: "日本語" },
    { code: "ZH-CN", name: "简体中文" },
    { code: "ZH-TW", name: "繁體中文" },
  ],
  [
    { code: "KO", name: "한국어" },
  ],
];

const GENRE_COL_LEFT = [
  "Action and adventure",
  "Comedy",
  "Documentary",
  "Drama",
  "Fantasy",
  "Horror",
  "Kids",
  "Mystery and thrillers",
];

const GENRE_COL_RIGHT = [
  "Romance",
  "Science fiction",
  "Anime & Animation",
  "Crime & Suspense",
];

const ALL_GENRES = [...GENRE_COL_LEFT, ...GENRE_COL_RIGHT];

function Navbar({ showLogo = true, showSignIn = true }: NavbarProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [movies, setMovies] = useState<Movie[]>([]);

  // Mobile Drawer State
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [drawerGenresOpen, setDrawerGenresOpen] = useState(false);
  const [drawerLangOpen, setDrawerLangOpen] = useState(false);

  // Desktop Popovers State
  const [genresOpen, setGenresOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState<LanguageOption>({
    code: "EN",
    name: "English",
  });

  // Dark mode toggle
  const [isDark, setIsDark] = useState(true);

  const router = useRouter();
  const pathname = usePathname();
  const { data } = authClient.useSession();

  const genresRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const isHome = pathname === "/" || pathname === "";
  const isMovies = pathname?.startsWith("/movies");
  const isTV = pathname?.startsWith("/tv");

  // Sync theme with root class
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [isDark]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileDrawerOpen]);

  // Handle outside click & escape key
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (genresRef.current && !genresRef.current.contains(event.target as Node)) {
        setGenresOpen(false);
      }
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setLangOpen(false);
      }
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setGenresOpen(false);
        setLangOpen(false);
        setMobileDrawerOpen(false);
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Search fetch with debounce
  useEffect(() => {
    if (!query.trim()) {
      return;
    }

    let isMounted = true;
    const fetchData = async () => {
      try {
        const coming = await fetch(`/api/movies/search?q=${encodeURIComponent(query.trim())}`);
        if (!isMounted) return;
        if (coming.ok) {
          const result = await coming.json();
          setMovies(Array.isArray(result) ? result : []);
          setIsOpen(true);
        } else {
          setMovies([]);
          setIsOpen(true);
        }
      } catch (err) {
        console.error("Search fetch error:", err);
        if (isMounted) {
          setMovies([]);
          setIsOpen(true);
        }
      }
    };

    const timer = setTimeout(fetchData, 300);
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [query]);

  const handleSearchChange = (val: string) => {
    setQuery(val);
    if (!val.trim()) {
      setIsOpen(false);
      setMovies([]);
    }
  };

  const handleLogOut = async () => {
    await authClient.signOut();
    setMobileDrawerOpen(false);
  };

  return (
    <>
      <nav className="relative z-50 flex items-center justify-between border-b border-border bg-background/95 px-3 sm:px-6 py-2.5 sm:py-3 text-foreground backdrop-blur-sm pt-[calc(0.625rem+env(safe-area-inset-top,0px))]">
        {/* Left Section: Mobile Drawer Trigger + Original MovieBox Logo + Desktop Nav Pills */}
        <div className="flex items-center gap-1.5 sm:gap-4 shrink-0">
          {/* Mobile Drawer Trigger (< lg) */}
          <button
            type="button"
            onClick={() => {
              setMobileDrawerOpen(true);
              setGenresOpen(false);
              setLangOpen(false);
            }}
            aria-label="Open Navigation Drawer"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-300 hover:bg-zinc-800/80 hover:text-white lg:hidden transition-colors cursor-pointer active:scale-95 touch-manipulation"
          >
            <HiMenuAlt3 className="h-6 w-6" />
          </button>

          {/* Original MovieBox Logo - Kept exact same */}
          {showLogo && (
            <Link href="/" className="group flex items-center gap-1.5 sm:gap-2 select-none touch-manipulation">
              <svg
                className="h-6 w-6 sm:h-7 sm:w-7 text-rose-600 transition-transform duration-300 group-hover:scale-110 shrink-0"
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
              <span className="text-lg sm:text-xl font-black tracking-wider text-foreground">
                MOVIE<span className="text-rose-600">BOX</span>
              </span>
            </Link>
          )}

          {/* Desktop Navigation Links (>= lg) */}
          <div className="hidden items-center space-x-1 rounded-full bg-muted p-1 ml-4 lg:flex">
            <Link
              href={"/"}
              className={`px-4 py-1.5 rounded-full text-sm transition ${
                isHome ? "bg-foreground text-background font-semibold" : "text-zinc-300 hover:text-white font-medium"
              }`}
            >
              Home
            </Link>
            <Link
              href={"/movies"}
              className={`px-4 py-1.5 rounded-full text-sm transition ${
                isMovies ? "bg-foreground text-background font-semibold" : "text-zinc-300 hover:text-white font-medium"
              }`}
            >
              Movies
            </Link>
            <Link
              href={"/tv"}
              className={`px-4 py-1.5 rounded-full text-sm transition ${
                isTV ? "bg-foreground text-background font-semibold" : "text-muted-foreground hover:text-foreground font-medium"
              }`}
            >
              TV shows
            </Link>
          </div>
        </div>

        {/* Right Section: Exact Original Search Input & Dropdown, Language, Genres, Theme, Auth */}
        <div className="flex items-center space-x-1.5 sm:space-x-4 text-muted-foreground relative shrink-0">
          
          {/* Exact Previous Search Input Section */}
          <div className="relative" ref={searchContainerRef}>
            <label className="input flex items-center gap-1.5 sm:gap-2 w-24 min-[360px]:w-28 sm:w-44 md:w-56 transition-all py-1 px-2.5 sm:py-1.5 sm:px-3 text-xs sm:text-sm">
              <svg className="h-[1em] opacity-50 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <g
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth="2.5"
                  fill="none"
                  stroke="currentColor"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.3-4.3"></path>
                </g>
              </svg>
              <input
                type="search"
                placeholder="Search"
                value={query}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full bg-transparent focus:outline-none text-[16px] sm:text-sm -webkit-appearance-none"
              />
            </label>

            {/* Exact Previous Search Dropdown */}
            {isOpen && (
              <div className="absolute right-0 top-full mt-2 w-[calc(100vw-24px)] min-[400px]:w-80 max-w-sm bg-background border border-border rounded-lg shadow-xl max-h-[60vh] sm:max-h-80 overflow-y-auto z-50 divide-y divide-border -webkit-overflow-scrolling-touch">
                {movies.length > 0 ? (
                  movies.map((movie, idx) => (
                    <div
                      key={movie._id ? movie._id.toString() : idx}
                      onClick={() => {
                        setIsOpen(false);
                        setQuery("");
                        router.push(`/movies/${movie._id}`);
                      }}
                      className="flex items-center gap-3 p-3 hover:bg-muted active:bg-muted cursor-pointer transition touch-manipulation"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={movie.poster} alt={movie.title} className="w-10 h-14 object-cover rounded bg-zinc-800 shrink-0" />
                      <div className="flex flex-col text-sm min-w-0">
                        <span className="font-semibold text-foreground truncate">{movie.title}</span>
                        <span className="text-xs text-muted-foreground">{movie.year}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    Not found
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 1. Language selector & Modal (Prime Video Reference Style) */}
          <div className="relative hidden sm:block" ref={langRef}>
            <button
              type="button"
              onClick={() => {
                setLangOpen((prev) => !prev);
                setGenresOpen(false);
              }}
              aria-label="Select Language"
              aria-expanded={langOpen}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer select-none ${
                langOpen
                  ? "bg-white text-zinc-950 shadow-md ring-1 ring-white/40"
                  : "text-zinc-300 hover:text-white hover:bg-zinc-800/70"
              }`}
            >
              <span>{selectedLang.code}</span>
              {langOpen ? (
                <MdOutlineExpandLess size={18} />
              ) : (
                <MdOutlineExpandMore size={18} />
              )}
            </button>

            {/* Floating 5-Column Language Modal */}
            {langOpen && (
              <div
                role="dialog"
                aria-label="Language selection"
                className="absolute right-0 top-full mt-3 w-[92vw] sm:w-[640px] md:w-[740px] lg:w-[820px] max-w-[850px] bg-[#0c1017]/95 backdrop-blur-2xl border border-zinc-800/90 rounded-2xl p-6 sm:p-7 shadow-2xl shadow-black/80 z-50 animate-in fade-in zoom-in-95 duration-150"
              >
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-x-6 sm:gap-x-8 gap-y-3.5 sm:gap-y-4 max-h-[70vh] overflow-y-auto sm:overflow-visible pr-1 sm:pr-0 text-left">
                  {LANGUAGE_COLUMNS.map((column, colIdx) => (
                    <div key={colIdx} className="flex flex-col space-y-3">
                      {column.map((lang) => {
                        const isCurrent = selectedLang.name === lang.name;
                        return (
                          <button
                            key={lang.name}
                            type="button"
                            onClick={() => {
                              setSelectedLang(lang);
                              setLangOpen(false);
                            }}
                            className={`text-left text-sm transition-all duration-150 py-0.5 leading-snug cursor-pointer group flex items-center justify-between ${
                              isCurrent
                                ? "font-semibold text-white"
                                : "font-normal text-zinc-300 hover:text-white"
                            }`}
                          >
                            <span className="group-hover:translate-x-0.5 transition-transform duration-150">
                              {lang.name}
                            </span>
                            {isCurrent && (
                              <span className="w-1.5 h-1.5 rounded-full bg-white ml-2 shrink-0 sm:hidden" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 2. 9-Dots Icon Button & Genres Modal (Prime Video reference style) */}
          <div className="relative hidden sm:block" ref={genresRef}>
            <button
              type="button"
              onClick={() => {
                setGenresOpen((prev) => !prev);
                setLangOpen(false);
              }}
              aria-label="Browse Genres"
              aria-expanded={genresOpen}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer ${
                genresOpen
                  ? "bg-white text-black shadow-lg ring-2 ring-white/30"
                  : "bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white border border-neutral-700/50"
              }`}
            >
              <PiDotsNineBold size={20} />
            </button>

            {/* Floating Genres Modal / Popover */}
            {genresOpen && (
              <div className="absolute right-0 top-full mt-3 w-[330px] sm:w-[370px] bg-[#0e121a]/95 backdrop-blur-2xl border border-neutral-800 rounded-2xl p-6 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="mb-4">
                  <h3 className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest select-none">
                    GENRES
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-left">
                  {/* Column 1 */}
                  <div className="flex flex-col space-y-3">
                    {GENRE_COL_LEFT.map((genre) => (
                      <Link
                        key={genre}
                        href={`/movies?genre=${encodeURIComponent(genre)}`}
                        onClick={() => setGenresOpen(false)}
                        className="text-sm font-medium text-neutral-300 hover:text-white hover:translate-x-1 transition-all duration-150 py-0.5 leading-snug"
                      >
                        {genre}
                      </Link>
                    ))}
                  </div>

                  {/* Column 2 */}
                  <div className="flex flex-col space-y-3">
                    {GENRE_COL_RIGHT.map((genre) => (
                      <Link
                        key={genre}
                        href={`/movies?genre=${encodeURIComponent(genre)}`}
                        onClick={() => setGenresOpen(false)}
                        className="text-sm font-medium text-neutral-300 hover:text-white hover:translate-x-1 transition-all duration-150 py-0.5 leading-snug"
                      >
                        {genre}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <div className="hidden sm:block shrink-0">
            <button
              type="button"
              onClick={() => setIsDark((prev) => !prev)}
              aria-label="Toggle Theme"
              className="p-2 rounded-full text-zinc-300 hover:text-white hover:bg-zinc-800 transition cursor-pointer"
            >
              {isDark ? (
                <MdOutlineDarkMode size={20} className="text-yellow-400" />
              ) : (
                <MdOutlineLightMode size={20} className="text-yellow-500" />
              )}
            </button>
          </div>

          {/* User Auth Section */}
          {data?.user ? (
            <div className="flex items-center gap-2 sm:gap-4">
              <details className="dropdown dropdown-end dropdown-bottom relative">
                <summary className="btn btn-ghost btn-circle avatar flex items-center justify-center list-none cursor-pointer">
                  <CgProfile size={22} className="text-foreground" />
                </summary>
                <ul className="menu dropdown-content bg-base-100 rounded-box z-50 w-52 p-2 shadow-xl mt-2 border border-border">
                  <li>
                    <Link href={"/profile"} aria-label="Profile" className="transition hover:text-foreground">
                      Profile
                    </Link>
                  </li>
                  <li>
                    <Link href={"/history"}>Watch History</Link>
                  </li>
                  <li className="sm:hidden border-t border-border pt-1 mt-1">
                    <button onClick={handleLogOut} className="text-rose-500">
                      Logout
                    </button>
                  </li>
                </ul>
              </details>

              <button className="hidden sm:inline-flex btn btn-warning" onClick={handleLogOut}>
                Logout
              </button>
            </div>
          ) : (
            showSignIn && (
              /* Exact Previous Join MovieBox Button */
              <Link
                href={"/login"}
                className="rounded-md bg-blue-600 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-white transition hover:bg-blue-700 shrink-0 touch-manipulation active:bg-blue-800"
              >
                Join MovieBox
              </Link>
            )
          )}
        </div>
      </nav>

      {/* PROFESSIONAL MOBILE SLIDE-OVER DRAWER (< lg) */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex justify-end animate-in fade-in duration-200">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-sm"
            onClick={() => setMobileDrawerOpen(false)}
          />

          {/* Drawer Panel - using h-[100dvh] for iOS Safari dynamic toolbar and notch */}
          <div className="relative w-[85vw] sm:w-96 max-w-md h-[100dvh] bg-[#0b0e14] border-l border-zinc-800 flex flex-col shadow-2xl z-10 animate-in slide-in-from-right duration-250">
            {/* Drawer Header with Original Logo & iPhone notch safe-area */}
            <div className="flex items-center justify-between p-4 sm:p-5 pt-[calc(1rem+env(safe-area-inset-top,0px))] sm:pt-5 border-b border-zinc-800/80">
              <Link
                href="/"
                onClick={() => setMobileDrawerOpen(false)}
                className="flex items-center gap-2 touch-manipulation"
              >
                <svg
                  className="h-6 w-6 text-rose-600"
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
                <span className="text-lg font-black tracking-wider text-white">
                  MOVIE<span className="text-rose-600">BOX</span>
                </span>
              </Link>
              <button
                type="button"
                onClick={() => setMobileDrawerOpen(false)}
                aria-label="Close menu"
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition active:scale-95 touch-manipulation"
              >
                <HiX size={22} />
              </button>
            </div>

            {/* Drawer Content with iOS smooth touch scrolling */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6 -webkit-overflow-scrolling-touch">
              {/* Primary Navigation Links */}
              <div className="space-y-1">
                <Link
                  href="/"
                  onClick={() => setMobileDrawerOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition touch-manipulation ${
                    isHome
                      ? "bg-rose-600/15 text-rose-500 font-semibold"
                      : "text-zinc-300 hover:bg-zinc-800/60 hover:text-white"
                  }`}
                >
                  <MdHome size={20} />
                  Home
                </Link>
                <Link
                  href="/movies"
                  onClick={() => setMobileDrawerOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition touch-manipulation ${
                    isMovies
                      ? "bg-rose-600/15 text-rose-500 font-semibold"
                      : "text-zinc-300 hover:bg-zinc-800/60 hover:text-white"
                  }`}
                >
                  <MdMovie size={20} />
                  Movies
                </Link>
                <Link
                  href="/tv"
                  onClick={() => setMobileDrawerOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition touch-manipulation ${
                    isTV
                      ? "bg-rose-600/15 text-rose-500 font-semibold"
                      : "text-zinc-300 hover:bg-zinc-800/60 hover:text-white"
                  }`}
                >
                  <MdTv size={20} />
                  TV shows
                </Link>
              </div>

              {/* Browse Genres Collapsible Section */}
              <div className="border-t border-zinc-800/80 pt-4">
                <button
                  type="button"
                  onClick={() => setDrawerGenresOpen((prev) => !prev)}
                  className="flex items-center justify-between w-full px-2 py-1 text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-white transition touch-manipulation"
                >
                  <span className="flex items-center gap-2">
                    <PiDotsNineBold size={16} />
                    Browse Genres
                  </span>
                  {drawerGenresOpen ? <MdOutlineExpandLess size={18} /> : <MdOutlineExpandMore size={18} />}
                </button>

                {drawerGenresOpen && (
                  <div className="mt-2.5 grid grid-cols-2 gap-1.5 animate-in fade-in duration-150">
                    {ALL_GENRES.map((genre) => (
                      <Link
                        key={genre}
                        href={`/movies?genre=${encodeURIComponent(genre)}`}
                        onClick={() => setMobileDrawerOpen(false)}
                        className="text-xs text-zinc-300 hover:text-white px-2.5 py-2 rounded-lg bg-zinc-900/80 hover:bg-zinc-800 transition truncate border border-zinc-800/50 touch-manipulation"
                      >
                        {genre}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Language Picker Collapsible */}
              <div className="border-t border-zinc-800/80 pt-4">
                <button
                  type="button"
                  onClick={() => setDrawerLangOpen((prev) => !prev)}
                  className="flex items-center justify-between w-full px-2 py-1 text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-white transition touch-manipulation"
                >
                  <span className="flex items-center gap-2">
                    <MdLanguage size={16} />
                    Language ({selectedLang.code})
                  </span>
                  {drawerLangOpen ? <MdOutlineExpandLess size={18} /> : <MdOutlineExpandMore size={18} />}
                </button>

                {drawerLangOpen && (
                  <div className="mt-2.5 grid grid-cols-2 gap-1.5 max-h-48 overflow-y-auto pr-1 animate-in fade-in duration-150 -webkit-overflow-scrolling-touch">
                    {LANGUAGE_COLUMNS.flat().map((lang) => {
                      const isCurrent = selectedLang.name === lang.name;
                      return (
                        <button
                          key={lang.name}
                          type="button"
                          onClick={() => {
                            setSelectedLang(lang);
                            setDrawerLangOpen(false);
                          }}
                          className={`text-left text-xs px-2.5 py-1.5 rounded-lg transition truncate touch-manipulation ${
                            isCurrent
                              ? "bg-white text-zinc-950 font-semibold"
                              : "text-zinc-400 hover:text-white bg-zinc-900/60"
                          }`}
                        >
                          {lang.name}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Appearance / Theme Toggle Row */}
              <div className="border-t border-zinc-800/80 pt-4 flex items-center justify-between px-2">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Theme
                </span>
                <button
                  type="button"
                  onClick={() => setIsDark((prev) => !prev)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 hover:text-white cursor-pointer touch-manipulation active:scale-95"
                >
                  {isDark ? (
                    <>
                      <MdOutlineDarkMode size={16} className="text-yellow-400" />
                      <span>Dark</span>
                    </>
                  ) : (
                    <>
                      <MdOutlineLightMode size={16} className="text-yellow-500" />
                      <span>Light</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Drawer Footer (Auth info or Original Blue Join MovieBox button) */}
            <div className="p-4 sm:p-5 border-t border-zinc-800 bg-[#080b10] pb-[calc(1.25rem+env(safe-area-inset-bottom,0px))]">
              {data?.user ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0">
                      <CgProfile size={24} className="text-zinc-300" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-semibold text-white truncate">
                        {data.user.name || "MovieBox User"}
                      </span>
                      <span className="text-xs text-zinc-400 truncate">
                        {data.user.email || ""}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <Link
                      href="/history"
                      onClick={() => setMobileDrawerOpen(false)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-medium text-zinc-300 hover:text-white active:scale-98 transition"
                    >
                      <MdHistory size={16} />
                      History
                    </Link>
                    <button
                      type="button"
                      onClick={handleLogOut}
                      className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-rose-600/15 text-rose-500 text-xs font-medium hover:bg-rose-600 hover:text-white active:scale-98 transition cursor-pointer"
                    >
                      <MdLogout size={16} />
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                showSignIn && (
                  <div className="space-y-2">
                    <Link
                      href="/login"
                      onClick={() => setMobileDrawerOpen(false)}
                      className="block w-full rounded-md bg-blue-600 px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-blue-700 active:bg-blue-800"
                    >
                      Join MovieBox
                    </Link>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;