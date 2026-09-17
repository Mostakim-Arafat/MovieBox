"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  MdOutlineExpandMore,
  MdOutlineExpandLess,
  MdSearch,
  MdClose,
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
  const [isSearching, setIsSearching] = useState(false);
  const [movies, setMovies] = useState<Movie[]>([]);

  // Mobile Drawer & Search Overlay
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [mobileSearchActive, setMobileSearchActive] = useState(false);
  const [drawerGenresOpen, setDrawerGenresOpen] = useState(false);
  const [drawerLangOpen, setDrawerLangOpen] = useState(false);

  // Desktop Popovers
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
  const searchInputRef = useRef<HTMLInputElement>(null);
  const desktopSearchRef = useRef<HTMLDivElement>(null);

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

  // Lock background body scroll when mobile drawer or mobile search overlay is open
  useEffect(() => {
    if (mobileDrawerOpen || mobileSearchActive) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileDrawerOpen, mobileSearchActive]);

  // Auto-focus input when mobile search is activated
  useEffect(() => {
    if (mobileSearchActive) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 120);
    }
  }, [mobileSearchActive]);

  // Handle outside click & escape key
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (genresRef.current && !genresRef.current.contains(event.target as Node)) {
        setGenresOpen(false);
      }
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setLangOpen(false);
      }
      if (desktopSearchRef.current && !desktopSearchRef.current.contains(event.target as Node)) {
        setIsSearching(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setGenresOpen(false);
        setLangOpen(false);
        setMobileDrawerOpen(false);
        setMobileSearchActive(false);
        setIsSearching(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Debounced search query
  useEffect(() => {
    if (!query.trim()) {
      setMovies([]);
      setIsSearching(false);
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
          setIsSearching(true);
        } else {
          setMovies([]);
          setIsSearching(true);
        }
      } catch (err) {
        console.error("Search fetch error:", err);
        if (isMounted) {
          setMovies([]);
          setIsSearching(true);
        }
      }
    };

    const timer = setTimeout(fetchData, 280);
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [query]);

  const handleMovieSelect = (id: string | number) => {
    setQuery("");
    setIsSearching(false);
    setMobileSearchActive(false);
    setMobileDrawerOpen(false);
    router.push(`/movies/${id}`);
  };

  const handleLogOut = async () => {
    await authClient.signOut();
    setMobileDrawerOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur-md transition-all duration-200">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8">
          
          {/* LEFT: Mobile Menu Button + Original MovieBox Logo + Desktop Nav Pills */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Mobile Drawer Trigger (< lg) */}
            <button
              type="button"
              onClick={() => {
                setMobileDrawerOpen(true);
                setGenresOpen(false);
                setLangOpen(false);
              }}
              aria-label="Open Navigation Drawer"
              className="flex h-10 w-10 items-center justify-center rounded-lg text-zinc-300 hover:bg-zinc-800/80 hover:text-white lg:hidden transition-colors cursor-pointer"
            >
              <HiMenuAlt3 className="h-6 w-6" />
            </button>

            {/* Original MovieBox Logo - Kept exactly as designed */}
            {showLogo && (
              <Link
                href="/"
                className="group flex items-center gap-2 select-none"
              >
                <svg
                  className="h-7 w-7 text-rose-600 transition-transform duration-300 group-hover:scale-110 shrink-0"
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
                <span className="text-xl font-black tracking-wider text-foreground">
                  MOVIE<span className="text-rose-600">BOX</span>
                </span>
              </Link>
            )}

            {/* Desktop Navigation Links (>= lg) */}
            <nav className="hidden lg:flex items-center space-x-1 rounded-full bg-muted p-1 ml-4">
              <Link
                href="/"
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition duration-150 ${
                  isHome
                    ? "bg-foreground text-background font-semibold"
                    : "text-zinc-300 hover:text-white"
                }`}
              >
                Home
              </Link>
              <Link
                href="/movies"
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition duration-150 ${
                  isMovies
                    ? "bg-foreground text-background font-semibold"
                    : "text-zinc-300 hover:text-white"
                }`}
              >
                Movies
              </Link>
              <Link
                href="/tv"
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition duration-150 ${
                  isTV
                    ? "bg-foreground text-background font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                TV shows
              </Link>
            </nav>
          </div>

          {/* RIGHT: Search, Language, Genres, Theme, Profile / Original Blue Join MovieBox CTA */}
          <div className="flex items-center gap-1.5 sm:gap-3 text-muted-foreground">
            
            {/* Desktop Search Bar (>= md) */}
            <div className="relative hidden md:block" ref={desktopSearchRef}>
              <div className="flex items-center rounded-full bg-zinc-900/90 border border-zinc-800 px-3 py-1.5 focus-within:border-zinc-500 focus-within:ring-1 focus-within:ring-zinc-500 transition-all">
                <MdSearch className="h-5 w-5 text-zinc-400 shrink-0 mr-1.5" />
                <input
                  type="search"
                  placeholder="Search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => query.trim() && setIsSearching(true)}
                  className="w-32 lg:w-48 bg-transparent text-sm text-foreground placeholder-muted-foreground focus:outline-none"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => {
                      setQuery("");
                      setIsSearching(false);
                    }}
                    className="text-zinc-400 hover:text-white p-0.5 cursor-pointer"
                  >
                    <MdClose size={16} />
                  </button>
                )}
              </div>

              {/* Desktop Search Dropdown */}
              {isSearching && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-background border border-border rounded-lg shadow-xl max-h-80 overflow-y-auto z-50 divide-y divide-border animate-in fade-in zoom-in-95 duration-150">
                  {movies.length > 0 ? (
                    movies.map((movie, idx) => (
                      <button
                        key={movie._id ? movie._id.toString() : idx}
                        type="button"
                        onClick={() => handleMovieSelect(movie._id)}
                        className="w-full flex items-center gap-3 p-3 hover:bg-muted cursor-pointer transition text-left"
                      >
                        {movie.poster ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={movie.poster}
                            alt={movie.title}
                            className="w-10 h-14 object-cover rounded bg-zinc-800 shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-14 rounded bg-zinc-800 flex items-center justify-center text-xs text-muted-foreground shrink-0">
                            N/A
                          </div>
                        )}
                        <div className="flex flex-col min-w-0">
                          <span className="font-semibold text-foreground truncate text-sm">
                            {movie.title}
                          </span>
                          {movie.year && (
                            <span className="text-xs text-muted-foreground mt-0.5">
                              {movie.year}
                            </span>
                          )}
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="p-4 text-center text-sm text-muted-foreground">
                      Not found
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Search Icon Button (< md) */}
            <button
              type="button"
              onClick={() => setMobileSearchActive(true)}
              aria-label="Open Search"
              className="flex md:hidden h-9 w-9 items-center justify-center rounded-full bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 transition cursor-pointer"
            >
              <MdSearch size={20} />
            </button>

            {/* Language Selector (Prime Video Style - Desktop & Tablet) */}
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
                {langOpen ? <MdOutlineExpandLess size={18} /> : <MdOutlineExpandMore size={18} />}
              </button>

              {langOpen && (
                <div
                  role="dialog"
                  aria-label="Language selection"
                  className="absolute right-0 top-full mt-3 w-[92vw] sm:w-[640px] md:w-[740px] lg:w-[820px] max-w-[850px] bg-[#0c1017]/95 backdrop-blur-2xl border border-zinc-800/90 rounded-2xl p-6 sm:p-7 shadow-2xl shadow-black/80 z-50 animate-in fade-in zoom-in-95 duration-150"
                >
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-x-6 sm:gap-x-8 gap-y-3.5 sm:gap-y-4 max-h-[70vh] overflow-y-auto pr-1 text-left">
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
                              <span className="group-hover:translate-x-0.5 transition-transform duration-150 truncate">
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

            {/* 9-Dots Genres Icon Button (Prime Video Style - Desktop & Tablet) */}
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

              {genresOpen && (
                <div className="absolute right-0 top-full mt-3 w-[330px] sm:w-[370px] bg-[#0e121a]/95 backdrop-blur-2xl border border-neutral-800 rounded-2xl p-6 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="mb-4">
                    <h3 className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest select-none">
                      GENRES
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-left max-h-[60vh] overflow-y-auto">
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
              <div className="flex items-center gap-3">
                <details className="relative group">
                  <summary className="flex items-center justify-center p-1.5 rounded-full hover:bg-zinc-800 cursor-pointer list-none transition text-foreground">
                    <CgProfile size={22} className="text-foreground" />
                  </summary>
                  <ul className="absolute right-0 top-full mt-2 w-52 rounded-box bg-base-100 border border-border p-2 shadow-xl z-50 flex flex-col gap-1 text-sm">
                    <li>
                      <Link
                        href="/profile"
                        className="block px-3 py-2 rounded-lg text-foreground hover:bg-muted transition"
                      >
                        Profile
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/history"
                        className="block px-3 py-2 rounded-lg text-foreground hover:bg-muted transition"
                      >
                        Watch History
                      </Link>
                    </li>
                    <li className="border-t border-border pt-1 mt-1 sm:hidden">
                      <button
                        onClick={handleLogOut}
                        className="w-full text-left px-3 py-2 rounded-lg text-rose-500 hover:bg-muted transition cursor-pointer"
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                </details>

                <button
                  className="hidden sm:inline-flex px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-500 hover:bg-amber-600 text-black transition cursor-pointer"
                  onClick={handleLogOut}
                >
                  Logout
                </button>
              </div>
            ) : (
              showSignIn && (
                /* Original Join MovieBox Button - Exact color & design kept */
                <Link
                  href="/login"
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 shrink-0"
                >
                  Join MovieBox
                </Link>
              )
            )}
          </div>
        </div>
      </header>

      {/* FULL-WIDTH MOBILE SEARCH OVERLAY (< md) */}
      {mobileSearchActive && (
        <div className="fixed inset-0 z-50 bg-[#07090e]/98 backdrop-blur-2xl flex flex-col p-4 animate-in fade-in duration-150">
          <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
            <MdSearch className="h-6 w-6 text-rose-600 shrink-0" />
            <input
              ref={searchInputRef}
              type="search"
              placeholder="Search movies, tv shows..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent text-base text-white placeholder-zinc-500 focus:outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="p-1 text-zinc-400 hover:text-white"
              >
                <MdClose size={20} />
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                setMobileSearchActive(false);
                setQuery("");
              }}
              className="ml-1 px-2.5 py-1 text-xs font-semibold text-zinc-300 hover:text-white rounded-lg bg-zinc-800"
            >
              Cancel
            </button>
          </div>

          {/* Live Mobile Search Results */}
          <div className="flex-1 overflow-y-auto mt-3 divide-y divide-zinc-800/60">
            {query.trim() && movies.length > 0 ? (
              movies.map((movie, idx) => (
                <button
                  key={movie._id ? movie._id.toString() : idx}
                  type="button"
                  onClick={() => handleMovieSelect(movie._id)}
                  className="w-full flex items-center gap-3 py-3 hover:bg-zinc-900/50 cursor-pointer text-left"
                >
                  {movie.poster ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={movie.poster}
                      alt={movie.title}
                      className="w-12 h-16 object-cover rounded-lg bg-zinc-800 shrink-0 shadow"
                    />
                  ) : (
                    <div className="w-12 h-16 rounded-lg bg-zinc-800 flex items-center justify-center text-xs text-zinc-500 shrink-0">
                      N/A
                    </div>
                  )}
                  <div className="flex flex-col min-w-0">
                    <span className="font-semibold text-white truncate text-base">
                      {movie.title}
                    </span>
                    {movie.year && (
                      <span className="text-xs text-zinc-400 mt-0.5">
                        {movie.year}
                      </span>
                    )}
                  </div>
                </button>
              ))
            ) : query.trim() && movies.length === 0 ? (
              <div className="py-12 text-center text-zinc-400 text-sm">
                Not found
              </div>
            ) : (
              <div className="py-6 text-zinc-500 text-xs">
                <span className="font-semibold uppercase tracking-wider text-zinc-400 block mb-2">
                  Popular Genres
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {ALL_GENRES.slice(0, 8).map((genre) => (
                    <button
                      key={genre}
                      type="button"
                      onClick={() => {
                        setMobileSearchActive(false);
                        router.push(`/movies?genre=${encodeURIComponent(genre)}`);
                      }}
                      className="px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs hover:border-zinc-600"
                    >
                      {genre}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* PROFESSIONAL MOBILE SLIDE-OVER DRAWER (< lg) */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex justify-end animate-in fade-in duration-200">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-sm"
            onClick={() => setMobileDrawerOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="relative w-[85vw] sm:w-96 max-w-md h-full bg-[#0b0e14] border-l border-zinc-800 flex flex-col shadow-2xl z-10 animate-in slide-in-from-right duration-250">
            {/* Drawer Header with Original Logo */}
            <div className="flex items-center justify-between p-5 border-b border-zinc-800/80">
              <Link
                href="/"
                onClick={() => setMobileDrawerOpen(false)}
                className="flex items-center gap-2"
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
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
              >
                <HiX size={22} />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {/* Primary Navigation Links */}
              <div className="space-y-1">
                <Link
                  href="/"
                  onClick={() => setMobileDrawerOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
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
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
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
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
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
                  className="flex items-center justify-between w-full px-2 py-1 text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-white transition"
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
                        className="text-xs text-zinc-300 hover:text-white px-2.5 py-2 rounded-lg bg-zinc-900/80 hover:bg-zinc-800 transition truncate border border-zinc-800/50"
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
                  className="flex items-center justify-between w-full px-2 py-1 text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-white transition"
                >
                  <span className="flex items-center gap-2">
                    <MdLanguage size={16} />
                    Language ({selectedLang.code})
                  </span>
                  {drawerLangOpen ? <MdOutlineExpandLess size={18} /> : <MdOutlineExpandMore size={18} />}
                </button>

                {drawerLangOpen && (
                  <div className="mt-2.5 grid grid-cols-2 gap-1.5 max-h-48 overflow-y-auto pr-1 animate-in fade-in duration-150">
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
                          className={`text-left text-xs px-2.5 py-1.5 rounded-lg transition truncate ${
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
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 hover:text-white cursor-pointer"
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
            <div className="p-5 border-t border-zinc-800 bg-[#080b10]">
              {data?.user ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center">
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
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-medium text-zinc-300 hover:text-white transition"
                    >
                      <MdHistory size={16} />
                      History
                    </Link>
                    <button
                      type="button"
                      onClick={handleLogOut}
                      className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600/15 text-rose-500 text-xs font-medium hover:bg-rose-600 hover:text-white transition cursor-pointer"
                    >
                      <MdLogout size={16} />
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                showSignIn && (
                  <div className="space-y-2">
                    {/* Exact original blue Join MovieBox design */}
                    <Link
                      href="/login"
                      onClick={() => setMobileDrawerOpen(false)}
                      className="block w-full rounded-md bg-blue-600 px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-blue-700"
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