"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { MdOutlineExpandMore, MdOutlineExpandLess } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { PiDotsNineBold } from "react-icons/pi";
import { authClient } from "@/lib/auth-client";
import ThemeToggle from "@/UI/TToggle";
import { useState, useEffect, useRef } from "react";

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

function Navbar() {
    const [query, setQuery] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [movies, setMovies] = useState<Movie[]>([]);
    
    // Genres Modal State
    const [genresOpen, setGenresOpen] = useState(false);
    const genresRef = useRef<HTMLDivElement>(null);

    // Language Modal State (Prime Video reference style)
    const [langOpen, setLangOpen] = useState(false);
    const [selectedLang, setSelectedLang] = useState<LanguageOption>({
        code: "EN",
        name: "English",
    });
    const langRef = useRef<HTMLDivElement>(null);

    const router = useRouter();

    const handleLogOut = async () => {
        await authClient.signOut();
    };

    const { data } = authClient.useSession();
    const pathname = usePathname();

    const isHome = pathname === "/" || pathname === "";
    const isMovies = pathname?.startsWith("/movies");
    const isTV = pathname?.startsWith("/tvshows");

    // Close genres/language modal when clicking outside or pressing Escape
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (genresRef.current && !genresRef.current.contains(event.target as Node)) {
                setGenresOpen(false);
            }
            if (langRef.current && !langRef.current.contains(event.target as Node)) {
                setLangOpen(false);
            }
        }
        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") {
                setGenresOpen(false);
                setLangOpen(false);
            }
        }
        if (genresOpen || langOpen) {
            document.addEventListener("mousedown", handleClickOutside);
            document.addEventListener("keydown", handleKeyDown);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [genresOpen, langOpen]);

    // Search fetch
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

    return (
        <nav className="relative z-50 flex items-center justify-between border-b border-border bg-background/95 px-6 py-3 text-foreground backdrop-blur-sm">
            <div className="lg:hidden">
                <details className="dropdown">
                    <summary className="btn m-1">Menu </summary>
                    <ul className="menu dropdown-content bg-base-100 rounded-box z-50 w-52 p-2 shadow-sm">
                        <li>
                            <Link href="/">Home</Link>
                        </li>
                        <li>
                            <Link href="/movies">Movies</Link>
                        </li>
                        <li>
                            <Link href="/tvshows">TV shows</Link>
                        </li>
                    </ul>
                </details>
            </div>

            <div className="hidden items-center space-x-6 lg:flex">
                <div className="flex min-w-[200px] flex-col items-start">
                    <Link href="/" className="group mb-4 flex items-center gap-2">
                        <svg
                            className="h-7 w-7 text-rose-600 transition-transform duration-300 group-hover:scale-110"
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
                </div>

                <div className="flex items-center space-x-1 rounded-full bg-muted p-1">
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
                        href={"/tvshows"}
                        className={`px-4 py-1.5 rounded-full text-sm transition ${
                            isTV ? "bg-foreground text-background font-semibold" : "text-muted-foreground hover:text-foreground font-medium"
                        }`}
                    >
                        TV shows
                    </Link>
                </div>
            </div>

            <div className="flex items-center space-x-4 text-muted-foreground relative">
                {/* Search input */}
                <label className="input flex items-center gap-2">
                    <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
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
                    />
                </label>

                {/* Search Dropdown */}
                {isOpen && (
                    <div className="absolute right-0 top-full mt-2 w-80 bg-background border border-border rounded-lg shadow-xl max-h-80 overflow-y-auto z-50 divide-y divide-border">
                        {movies.length > 0 ? (
                            movies.map((movie, idx) => (
                                <div
                                    key={movie._id ? movie._id.toString() : idx}
                                    onClick={() => {
                                        setIsOpen(false);
                                        setQuery("");
                                        router.push(`/movies/${movie._id}`);
                                    }}
                                    className="flex items-center gap-3 p-3 hover:bg-muted cursor-pointer transition"
                                >
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={movie.poster} alt={movie.title} className="w-10 h-14 object-cover rounded bg-zinc-800" />
                                    <div className="flex flex-col text-sm">
                                        <span className="font-semibold text-foreground">{movie.title}</span>
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

                {/* 1. Language selector & Modal (Prime Video Reference Style) */}
                <div className="relative" ref={langRef}>
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
                <div className="relative" ref={genresRef}>
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

                <ThemeToggle />

                {data?.user ? (
                    <div className="flex items-center gap-4">
                        <details className="dropdown dropdown-end dropdown-bottom">
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
                            </ul>
                        </details>

                        <button className="btn btn-warning" onClick={handleLogOut}>
                            Logout
                        </button>
                    </div>
                ) : (
                    <Link
                        href={"/login"}
                        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 shrink-0"
                    >
                        Join MovieBox
                    </Link>
                )}
            </div>
        </nav>
    );
}

export default Navbar;