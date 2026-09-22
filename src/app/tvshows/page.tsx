/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useRef, useState, useMemo, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import {
    Search,
    ArrowUpDown,
    X,
    Play,
    Info,
    Tv,
    Sparkles,
} from "lucide-react";
import Pagination from "@/UI/Pagination";

type Show = {
    id: number;
    title: string;
    poster: string;
    year: number;
    genre: string[];
    rating: number;
    seasons: number;
    episodes: number;
    channel: string;
    shortDescription: string;
    description: string;
};

function PosterImage({
    show,
    className,
}: {
    show: Show;
    className: string;
}) {
    const [imgError, setImgError] = useState(false);

    if (imgError || !show?.poster) {
        return (
            <div
                className={`flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-neutral-800 via-neutral-900 to-black p-4 text-center ${className}`}
            >
                <Tv className="w-8 h-8 text-neutral-500" />
                <span className="line-clamp-2 text-xs font-medium text-neutral-400">
                    {show?.title || "TV Show"}
                </span>
            </div>
        );
    }

    return (
        <img
            src={show.poster}
            alt={show.title}
            onError={() => setImgError(true)}
            className={className}
        />
    );
}

function TvShowsContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    // Data state
    const [shows, setShows] = useState<Show[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedShow, setSelectedShow] = useState<Show | null>(null);
    const [isNavigating, setIsNavigating] = useState(false);

    // Derive active filter, sort, and pagination directly from URL searchParams
    const activeGenre = searchParams.get("genre") || "All";
    const currentPage = parseInt(searchParams.get("page") || "1", 10) || 1;
    const sortBy =
        (searchParams.get("sort") as "rating" | "year" | "seasons" | "title") || "rating";
    const urlSearch = searchParams.get("search") || "";

    // Synchronize search input without useEffect (React 19 render-phase pattern)
    const [searchTerm, setSearchTerm] = useState<string>(urlSearch);
    const [prevUrlSearch, setPrevUrlSearch] = useState<string>(urlSearch);

    if (urlSearch !== prevUrlSearch) {
        setPrevUrlSearch(urlSearch);
        setSearchTerm(urlSearch);
    }

    const [pageSize, setPageSize] = useState<number>(12);
    const catalogSectionRef = useRef<HTMLDivElement>(null);

    // Fetch shows from /tvshows.json
    useEffect(() => {
        let isMounted = true;
        fetch("/tvshows.json")
            .then((res) => res.json())
            .then((data: Show[]) => {
                if (isMounted) {
                    setShows(Array.isArray(data) ? data : []);
                    setIsLoading(false);
                }
            })
            .catch((err) => {
                console.error("Failed to load tvshows:", err);
                if (isMounted) setIsLoading(false);
            });

        return () => {
            isMounted = false;
        };
    }, []);

    // Update URL helper without full page reload
    const updateUrlParams = (updates: {
        page?: number;
        genre?: string;
        search?: string;
        sort?: string;
    }) => {
        const nextGenre = updates.genre !== undefined ? updates.genre : activeGenre;
        const nextPage = updates.page !== undefined ? updates.page : currentPage;
        const nextSearch = updates.search !== undefined ? updates.search : searchTerm;
        const nextSort = updates.sort !== undefined ? updates.sort : sortBy;

        const params = new URLSearchParams();
        if (nextGenre && nextGenre !== "All") params.set("genre", nextGenre);
        if (nextPage > 1) params.set("page", String(nextPage));
        if (nextSearch.trim()) params.set("search", nextSearch.trim());
        if (nextSort && nextSort !== "rating") params.set("sort", nextSort);

        const qs = params.toString();
        router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    };

    // Extract all unique genres
    const allGenresList = useMemo(() => {
        const genres = new Set<string>();
        shows.forEach((s) => {
            if (Array.isArray(s.genre)) {
                s.genre.forEach((g) => genres.add(g));
            }
        });
        const sorted = Array.from(genres).sort();
        return ["All", ...sorted];
    }, [shows]);

    // Featured series for Hero banner
    const featured = useMemo(() => {
        if (shows.length === 0) return null;
        const sorted = [...shows].sort((a, b) => (b.rating || 0) - (a.rating || 0));
        return sorted[0] || shows[0];
    }, [shows]);

    // Top trending picks for Spotlight carousel
    const trendingPicks = useMemo(() => {
        return [...shows]
            .sort((a, b) => (b.rating || 0) - (a.rating || 0))
            .slice(0, 10);
    }, [shows]);

    // Filter and sort shows for the catalog
    const filteredShows = (() => {
        let list = [...shows];

        // Genre filter
        if (activeGenre !== "All") {
            const target = activeGenre.toLowerCase();
            list = list.filter(
                (s) =>
                    Array.isArray(s.genre) &&
                    s.genre.some((g) => g.toLowerCase() === target)
            );
        }

        // Search query filter
        if (searchTerm.trim()) {
            const q = searchTerm.toLowerCase();
            list = list.filter((s) => {
                const titleMatch = s.title?.toLowerCase().includes(q);
                const channelMatch = s.channel?.toLowerCase().includes(q);
                const descMatch = (s.shortDescription || s.description)?.toLowerCase().includes(q);
                const genreMatch = Array.isArray(s.genre) && s.genre.some((g) => g.toLowerCase().includes(q));
                const yearMatch = String(s.year).includes(q);
                return Boolean(titleMatch || channelMatch || descMatch || genreMatch || yearMatch);
            });
        }

        // Sorting
        list.sort((a, b) => {
            if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
            if (sortBy === "year") return (b.year || 0) - (a.year || 0);
            if (sortBy === "seasons") return (b.seasons || 0) - (a.seasons || 0);
            if (sortBy === "title") return a.title.localeCompare(b.title);
            return 0;
        });

        return list;
    })();

    // Calculate Pagination
    const totalPages = Math.max(1, Math.ceil(filteredShows.length / pageSize));
    const safeCurrentPage = Math.min(currentPage, totalPages);

    const paginatedShows = (() => {
        const startIndex = (safeCurrentPage - 1) * pageSize;
        return filteredShows.slice(startIndex, startIndex + pageSize);
    })();

    // Handlers
    const handlePageChange = (newPage: number) => {
        updateUrlParams({ page: newPage });
        if (catalogSectionRef.current) {
            catalogSectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    const handleGenreChange = (newGenre: string) => {
        updateUrlParams({ genre: newGenre, page: 1 });
    };

    const handleSearchChange = (term: string) => {
        setSearchTerm(term);
        updateUrlParams({ search: term, page: 1 });
    };

    const handleSortChange = (newSort: "rating" | "year" | "seasons" | "title") => {
        updateUrlParams({ sort: newSort, page: 1 });
    };

    const handlePageSizeChange = (newSize: number) => {
        setPageSize(newSize);
        updateUrlParams({ page: 1 });
    };

    const handleResetFilters = () => {
        setSearchTerm("");
        router.replace(pathname, { scroll: false });
    };

    return (
        <main className="min-h-screen bg-black text-white selection:bg-rose-600 selection:text-white pb-20">
            {isLoading ? (
                <div className="flex min-h-[70vh] items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                        <div className="h-12 w-12 animate-spin rounded-full border-4 border-neutral-800 border-t-rose-600" />
                        <p className="text-sm font-medium text-neutral-400 animate-pulse">
                            Loading TV series...
                        </p>
                    </div>
                </div>
            ) : (
                <>
                    {/* Hero Spotlight Banner */}
                    {featured && activeGenre === "All" && !searchTerm && (
                        <div className="relative h-[65vh] min-h-[420px] max-h-[640px] w-full overflow-hidden sm:h-[72vh]">
                            <PosterImage
                                show={featured}
                                className="h-full w-full object-cover object-top opacity-70 scale-105 transition-transform duration-1000"
                            />

                            {/* Cinema Gradients */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" />

                            <div className="absolute bottom-0 left-0 right-0 px-4 pb-12 sm:px-8 sm:pb-16 lg:px-12 max-w-5xl">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-600 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-rose-600/40">
                                        <Sparkles className="w-3 h-3" /> Featured Series
                                    </span>
                                    {featured.channel && (
                                        <span className="rounded-full bg-white/10 backdrop-blur-md px-3 py-1 text-xs font-semibold text-neutral-300">
                                            {featured.channel}
                                        </span>
                                    )}
                                </div>

                                <h1 className="text-3xl font-black leading-tight text-white sm:text-5xl lg:text-6xl drop-shadow-md">
                                    {featured.title}
                                </h1>

                                <div className="mt-3.5 flex flex-wrap items-center gap-3 text-sm text-neutral-300 font-medium">
                                    <span className="flex items-center gap-1 font-bold text-yellow-400">
                                        ⭐ {featured.rating}
                                    </span>
                                    <span>•</span>
                                    <span>{featured.year}</span>
                                    <span>•</span>
                                    <span>
                                        {featured.seasons} Season{featured.seasons > 1 ? "s" : ""}
                                    </span>
                                    {featured.episodes && (
                                        <>
                                            <span>•</span>
                                            <span>{featured.episodes} Episodes</span>
                                        </>
                                    )}
                                    {featured.genre && (
                                        <>
                                            <span>•</span>
                                            <span className="text-neutral-400">
                                                {featured.genre.join(", ")}
                                            </span>
                                        </>
                                    )}
                                </div>

                                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-neutral-300 sm:text-base line-clamp-3">
                                    {featured.shortDescription || featured.description}
                                </p>

                                <div className="mt-7 flex flex-wrap items-center gap-3.5">
                                    <Link
                                        href={"/tvshows/" + featured.id}
                                        onClick={() => setIsNavigating(true)}
                                        className="flex items-center gap-2 rounded-xl bg-rose-600 px-7 py-3.5 font-bold text-white shadow-lg shadow-rose-600/30 hover:bg-rose-500 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                                    >
                                        <Play className="w-4 h-4 fill-white" />
                                        Watch Now
                                    </Link>

                                    <button
                                        type="button"
                                        onClick={() => setSelectedShow(featured)}
                                        className="flex items-center gap-2 rounded-xl bg-white/15 backdrop-blur-md px-6 py-3.5 font-bold text-white hover:bg-white/25 active:scale-95 transition-all cursor-pointer border border-white/10"
                                    >
                                        <Info className="w-4 h-4" />
                                        Details
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Spotlight Row / Highlights */}
                    {activeGenre === "All" && !searchTerm && trendingPicks.length > 0 && (
                        <div className="relative z-10 px-4 pt-6 pb-8 sm:px-8 lg:px-12">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-rose-500" />
                                        Popular TV Series
                                    </h2>
                                    <p className="text-xs text-neutral-400 mt-0.5">
                                        Critically acclaimed binges and fan favorites
                                    </p>
                                </div>
                            </div>

                            <div className="scrollbar-hide flex gap-4 overflow-x-auto pb-4 select-none">
                                {trendingPicks.map((show) => (
                                    <motion.div
                                        key={show.id}
                                        onClick={() => setSelectedShow(show)}
                                        whileHover={{ scale: 1.05, y: -4 }}
                                        whileTap={{ scale: 0.96 }}
                                        className="group relative w-[160px] sm:w-[190px] shrink-0 cursor-pointer overflow-hidden rounded-xl bg-neutral-900 border border-neutral-800/80 shadow-lg hover:border-neutral-600 transition-all"
                                    >
                                        <PosterImage
                                            show={show}
                                            className="aspect-[2/3] w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/85 to-transparent px-3 pb-3 pt-10">
                                            <p className="truncate text-xs font-bold text-white sm:text-sm">
                                                {show.title}
                                            </p>
                                            <div className="mt-1 flex items-center justify-between text-[11px] text-neutral-400 font-medium">
                                                <span className="text-yellow-400 font-semibold">
                                                    ⭐ {show.rating}
                                                </span>
                                                <span>{show.seasons}S</span>
                                            </div>
                                            {show.channel && (
                                                <p className="mt-1 line-clamp-1 text-[10px] text-neutral-400">
                                                    {show.channel}
                                                </p>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* All TV Shows Catalog Section with Direct Pagination */}
                    <div
                        ref={catalogSectionRef}
                        className="px-4 pt-6 sm:px-8 lg:px-12 scroll-mt-6"
                    >
                        {/* Section Title & Filter Header */}
                        <div className="border-b border-neutral-800 pb-5">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                    <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
                                        {activeGenre === "All" ? "All TV Shows" : `${activeGenre} Shows`}
                                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-neutral-800 text-neutral-300 border border-neutral-700/60">
                                            {filteredShows.length} {filteredShows.length === 1 ? "series" : "series"}
                                        </span>
                                    </h2>
                                    <p className="text-xs sm:text-sm text-neutral-400 mt-1">
                                        Browse all series with season details, networks, and full pagination.
                                    </p>
                                </div>

                                {/* Search Bar & Sort Dropdown */}
                                <div className="flex flex-wrap items-center gap-2.5">
                                    {/* Search Input */}
                                    <div className="relative flex-1 sm:w-64 max-w-sm">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                                        <input
                                            type="text"
                                            value={searchTerm}
                                            onChange={(e) => handleSearchChange(e.target.value)}
                                            placeholder="Search TV shows, networks..."
                                            className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-9 pr-8 py-2 text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-rose-500 transition-colors shadow-inner"
                                        />
                                        {searchTerm && (
                                            <button
                                                type="button"
                                                onClick={() => handleSearchChange("")}
                                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white cursor-pointer"
                                            >
                                                <X className="w-3.5 h-3.5" />
                                            </button>
                                        )}
                                    </div>

                                    {/* Sort Dropdown */}
                                    <div className="flex items-center gap-1.5 bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-300">
                                        <ArrowUpDown className="w-3.5 h-3.5 text-neutral-500" />
                                        <select
                                            value={sortBy}
                                            onChange={(e) =>
                                                handleSortChange(
                                                    e.target.value as
                                                        | "rating"
                                                        | "year"
                                                        | "seasons"
                                                        | "title"
                                                )
                                            }
                                            className="bg-transparent text-xs text-neutral-200 focus:outline-none cursor-pointer"
                                        >
                                            <option value="rating" className="bg-neutral-900 text-neutral-200">
                                                Top Rated ⭐
                                            </option>
                                            <option value="seasons" className="bg-neutral-900 text-neutral-200">
                                                Most Seasons 📺
                                            </option>
                                            <option value="year" className="bg-neutral-900 text-neutral-200">
                                                Newest Release 📅
                                            </option>
                                            <option value="title" className="bg-neutral-900 text-neutral-200">
                                                Title (A to Z) 🔤
                                            </option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Genre Filter Pills */}
                            <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
                                {allGenresList.map((genre) => {
                                    const isSelected =
                                        activeGenre.toLowerCase() === genre.toLowerCase();
                                    return (
                                        <button
                                            key={genre}
                                            type="button"
                                            onClick={() => handleGenreChange(genre)}
                                            className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                                                isSelected
                                                    ? "bg-rose-600 text-white shadow-md shadow-rose-600/30 border border-rose-500"
                                                    : "bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700"
                                            }`}
                                        >
                                            {genre}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* TV Shows Grid */}
                        <div className="py-8">
                            {paginatedShows.length === 0 ? (
                                <div className="py-24 text-center text-neutral-500">
                                    <Tv className="w-12 h-12 mx-auto mb-3 opacity-40" />
                                    <p className="text-lg font-bold text-neutral-300">
                                        No TV shows matched your search
                                    </p>
                                    <p className="text-sm mt-1 text-neutral-500">
                                        Try changing your search keywords or choosing another genre.
                                    </p>
                                    <button
                                        type="button"
                                        onClick={handleResetFilters}
                                        className="mt-5 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-bold text-white transition cursor-pointer shadow-lg shadow-rose-600/30"
                                    >
                                        Reset All Filters
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                                        {paginatedShows.map((show) => (
                                            <motion.div
                                                key={show.id}
                                                onClick={() => setSelectedShow(show)}
                                                whileHover={{ scale: 1.04, y: -4 }}
                                                whileTap={{ scale: 0.97 }}
                                                transition={{
                                                    type: "spring",
                                                    stiffness: 400,
                                                    damping: 26,
                                                }}
                                                className="group relative cursor-pointer overflow-hidden rounded-xl bg-neutral-900 border border-neutral-800/80 shadow-md hover:border-neutral-600 transition-all"
                                            >
                                                <PosterImage
                                                    show={show}
                                                    className="aspect-[2/3] w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                />

                                                {/* Overlay / Bottom gradient */}
                                                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/85 to-transparent px-3 pb-3 pt-12">
                                                    <p className="truncate text-xs font-bold text-white sm:text-sm">
                                                        {show.title}
                                                    </p>

                                                    <div className="mt-1 flex items-center justify-between text-[11px] text-neutral-400 font-medium">
                                                        <span className="font-semibold text-yellow-400 flex items-center gap-0.5">
                                                            ⭐ {show.rating}
                                                        </span>
                                                        <span>
                                                            {show.seasons} season{show.seasons > 1 ? "s" : ""}
                                                        </span>
                                                    </div>

                                                    <div className="mt-1 flex items-center gap-1.5 flex-wrap">
                                                        {show.channel && (
                                                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-neutral-300">
                                                                {show.channel}
                                                            </span>
                                                        )}
                                                        {show.genre && show.genre[0] && (
                                                            <span className="text-[10px] text-neutral-500">
                                                                {show.genre[0]}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>

                                    {/* Primary Pagination Bar */}
                                    <div className="mt-12 border-t border-neutral-800/80 pt-6">
                                        <Pagination
                                            currentPage={safeCurrentPage}
                                            totalPages={totalPages}
                                            onPageChange={handlePageChange}
                                            totalItems={filteredShows.length}
                                            pageSize={pageSize}
                                            pageSizeOptions={[8, 12, 18, 24]}
                                            onPageSizeChange={handlePageSizeChange}
                                            showPageSize={true}
                                            showSummary={true}
                                            itemName="TV series"
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </>
            )}

            {/* Quick TV Show Detail Modal */}
            <AnimatePresence>
                {selectedShow && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            onClick={() => setSelectedShow(null)}
                            className="fixed inset-0 z-40 bg-black/85 backdrop-blur-md"
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.92, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.92, y: 20 }}
                            transition={{
                                type: "spring",
                                stiffness: 380,
                                damping: 32,
                                mass: 0.9,
                            }}
                            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
                        >
                            <div className="relative w-full max-w-3xl overflow-hidden rounded-2xl bg-neutral-900 shadow-2xl ring-1 ring-white/10">
                                <button
                                    onClick={() => setSelectedShow(null)}
                                    aria-label="Close modal"
                                    className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-black/90 cursor-pointer"
                                >
                                    ✕
                                </button>

                                <div className="relative h-56 w-full sm:h-72">
                                    <PosterImage
                                        show={selectedShow}
                                        className="h-full w-full object-cover object-top"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/40 to-transparent" />
                                </div>

                                <div className="p-6 sm:p-8">
                                    <div className="flex items-center gap-2 mb-1">
                                        {selectedShow.channel && (
                                            <span className="rounded bg-rose-600/20 text-rose-400 border border-rose-500/30 px-2 py-0.5 text-xs font-semibold">
                                                {selectedShow.channel}
                                            </span>
                                        )}
                                        <span className="text-xs text-neutral-400">
                                            {selectedShow.year}
                                        </span>
                                    </div>

                                    <h2 className="text-2xl font-black text-white sm:text-3xl">
                                        {selectedShow.title}
                                    </h2>

                                    <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-neutral-400">
                                        <span className="flex items-center gap-1 font-semibold text-yellow-400">
                                            ⭐ {selectedShow.rating}
                                        </span>
                                        <span>•</span>
                                        <span>
                                            {selectedShow.seasons} Season{selectedShow.seasons > 1 ? "s" : ""}
                                        </span>
                                        {selectedShow.episodes && (
                                            <>
                                                <span>•</span>
                                                <span>{selectedShow.episodes} Episodes</span>
                                            </>
                                        )}
                                    </div>

                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {selectedShow.genre &&
                                            selectedShow.genre.map((g) => (
                                                <span
                                                    key={g}
                                                    className="rounded-full border border-neutral-700 bg-neutral-800 px-3 py-1 text-xs text-neutral-300"
                                                >
                                                    {g}
                                                </span>
                                            ))}
                                    </div>

                                    <p className="mt-5 text-sm leading-relaxed text-neutral-300 sm:text-base">
                                        {selectedShow.description || selectedShow.shortDescription}
                                    </p>

                                    <div className="mt-7 flex flex-wrap gap-3">
                                        <Link
                                            href={"/tvshows/" + selectedShow.id}
                                            onClick={() => {
                                                setSelectedShow(null);
                                                setIsNavigating(true);
                                            }}
                                            className="flex-1 rounded-xl bg-rose-600 px-6 py-3.5 text-center font-bold text-white transition hover:bg-rose-500 sm:flex-none shadow-lg shadow-rose-600/30"
                                        >
                                            Watch Series
                                        </Link>

                                        <button
                                            type="button"
                                            onClick={() => setSelectedShow(null)}
                                            className="rounded-xl border border-neutral-700 px-6 py-3.5 font-bold text-neutral-300 transition hover:border-neutral-500 hover:text-white cursor-pointer"
                                        >
                                            Close
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Navigation Transition Overlay */}
            {isNavigating && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm">
                    <div className="flex flex-col items-center text-center text-white">
                        <div className="relative flex h-16 w-16 items-center justify-center">
                            <div className="absolute inset-0 animate-spin rounded-full border-4 border-neutral-700 border-t-rose-600" />
                            <Tv className="w-7 h-7 text-rose-500" />
                        </div>
                        <p className="mt-4 text-sm font-semibold">Loading TV series...</p>
                    </div>
                </div>
            )}
        </main>
    );
}

export default function TvShowsPage() {
    return (
        <Suspense
            fallback={
                <div className="flex min-h-screen items-center justify-center bg-black">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-neutral-800 border-t-red-600" />
                </div>
            }
        >
            <TvShowsContent />
        </Suspense>
    );
}