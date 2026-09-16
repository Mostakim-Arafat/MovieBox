"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MdOutlineExpandMore } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { PiDotsNineBold } from "react-icons/pi";
import { authClient } from "@/lib/auth-client";
import ThemeToggle from "@/UI/TToggle";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

interface Movie {
    _id: string | number;
    title: string;
    poster?: string;
    year?: string | number;
}

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
    const [genresOpen, setGenresOpen] = useState(false);
    const genresRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    const handleLogOut = async () => {
        await authClient.signOut();
    };

    const { data } = authClient.useSession();
    const pathname = usePathname();

    const isHome = pathname === "/" || pathname === "";
    const isMovies = pathname?.startsWith("/movies");
    const isTV = pathname?.startsWith("/tv");

    // Close genres modal when clicking outside or pressing Escape
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (genresRef.current && !genresRef.current.contains(event.target as Node)) {
                setGenresOpen(false);
            }
        }
        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") {
                setGenresOpen(false);
            }
        }
        if (genresOpen) {
            document.addEventListener("mousedown", handleClickOutside);
            document.addEventListener("keydown", handleKeyDown);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [genresOpen]);

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
                            <Link href="/tv">TV shows</Link>
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
                        href={"/tv"}
                        className={`px-4 py-1.5 rounded-full text-sm transition ${
                            isTV ? "bg-foreground text-background font-semibold" : "text-muted-foreground hover:text-foreground font-medium"
                        }`}
                    >
                        TV shows
                    </Link>
                </div>
            </div>

            <div className="flex items-center space-x-5 text-muted-foreground relative">
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

                {/* Language selector */}
                <div className="flex cursor-pointer items-center space-x-1 text-sm font-medium transition hover:text-foreground">
                    <span>EN</span>
                    <MdOutlineExpandMore size={18} />
                </div>

                {/* 9-Dots Icon Button & Genres Modal (Prime Video reference style) */}
                <div className="relative" ref={genresRef}>
                    <button
                        type="button"
                        onClick={() => setGenresOpen((prev) => !prev)}
                        aria-label="Browse Genres"
                        aria-expanded={genresOpen}
                        className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer ${
                            genresOpen
                                ? "bg-white text-black shadow-lg ring-2 ring-white/30"
                                : "bg-neutral-850 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-700/50"
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