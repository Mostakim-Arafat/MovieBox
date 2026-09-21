"use client";

import { useEffect, useRef, useState, useMemo, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { LayoutGrid, Rows3, Search, ArrowUpDown, X } from "lucide-react";
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

    if (imgError) {
        return (
            <div
                className={
                    "flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-neutral-800 via-neutral-900 to-black p-4 text-center " +
                    className
                }
            >
                <span className="text-4xl opacity-60">📺</span>
                <span className="text-xs font-medium text-neutral-500">
                    {show.title}
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

function ShowRow({
    genre,
    shows,
    onSeeMore,
}: {
    genre: string;
    shows: Show[];
    onSeeMore: (genre: string, list: Show[]) => void;
}) {
    const rowRef = useRef<HTMLDivElement>(null);
    const [cardWidth, setCardWidth] = useState<number | null>(null);

    const isDragging = useRef(false);
    const startX = useRef(0);
    const startScrollLeft = useRef(0);

    const GAP = 12;
    const MIN_WIDTH = 130;
    const MAX_WIDTH = 320;
    const FIXED_WIDTH = 170;

    useEffect(() => {
        const el = rowRef.current;
        if (!el) return;

        const calculate = () => {
            const containerWidth = el.offsetWidth;
            const count = shows.length;
            const totalGap = GAP * (count - 1);
            const evenWidth = (containerWidth - totalGap) / count;

            if (evenWidth >= MIN_WIDTH) {
                setCardWidth(Math.min(evenWidth, MAX_WIDTH));
            } else {
                setCardWidth(FIXED_WIDTH);
            }
        };

        calculate();
        const observer = new ResizeObserver(calculate);
        observer.observe(el);
        return () => observer.disconnect();
    }, [shows.length]);

    const handleMouseDown = (e: React.MouseEvent) => {
        const el = rowRef.current;
        if (!el) return;
        isDragging.current = true;
        startX.current = e.pageX - el.offsetLeft;
        startScrollLeft.current = el.scrollLeft;
        el.style.cursor = "grabbing";
    };

    const stopDragging = () => {
        isDragging.current = false;
        if (rowRef.current) rowRef.current.style.cursor = "grab";
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        const el = rowRef.current;
        if (!el || !isDragging.current) return;
        e.preventDefault();
        const x = e.pageX - el.offsetLeft;
        const walk = x - startX.current;
        el.scrollLeft = startScrollLeft.current - walk;
    };

    return (
        <div className="mb-10">
            <div className="mb-4 flex items-center justify-between gap-4">
                <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
                    {genre}
                </h2>
                <button
                    type="button"
                    onClick={() => onSeeMore(genre, shows)}
                    className="group flex items-center gap-1.5 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-sm font-medium text-neutral-300 backdrop-blur-sm transition-all hover:border-white/40 hover:bg-white/10 hover:text-white cursor-pointer"
                >
                    See more
                    <span className="transition-transform group-hover:translate-x-0.5">
                        →
                    </span>
                </button>
            </div>

            <div
                ref={rowRef}
                onMouseDown={handleMouseDown}
                onMouseUp={stopDragging}
                onMouseLeave={stopDragging}
                onMouseMove={handleMouseMove}
                className="scrollbar-hide flex cursor-grab gap-3 overflow-x-auto pb-3 select-none"
            >
                {shows.map((show) => (
                    <motion.div
                        key={show.id}
                        whileHover={{ scale: 1.05 }}
                        transition={{
                            type: "spring",
                            stiffness: 260,
                            damping: 20,
                        }}
                        style={{
                            width: cardWidth ? cardWidth + "px" : undefined,
                        }}
                        className="group relative shrink-0 overflow-hidden rounded-lg"
                    >
                        <Link href={"/tvshows/" + show.id} className="block w-full h-full">
                            <PosterImage
                                show={show}
                                className="aspect-[2/3] w-full object-cover"
                            />

                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/80 to-transparent px-2 pb-2 pt-10">
                                <p className="truncate text-xs font-semibold text-white sm:text-sm">
                                    {show.title}
                                </p>
                                <p className="mt-0.5 line-clamp-1 text-[10px] text-neutral-400 sm:text-xs">
                                    {show.shortDescription}
                                </p>
                                <div className="mt-1 flex items-center gap-2 text-[10px] text-yellow-400 sm:text-xs">
                                    <span>⭐ {show.rating}</span>
                                    <span className="text-neutral-500">•</span>
                                    <span className="text-neutral-400">
                                        {show.seasons} Season
                                        {show.seasons > 1 ? "s" : ""}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

function TvShowsContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const initialGenre = searchParams.get("genre") || "All";

    const [shows, setShows] = useState<Show[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // View mode: 'rows' or 'grid'
    const [viewMode, setViewMode] = useState<"rows" | "grid">(
        initialGenre !== "All" ? "grid" : "rows"
    );

    // Grid filters and pagination
    const [activeGenre, setActiveGenre] = useState<string>(initialGenre);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [sortBy, setSortBy] = useState<"rating" | "year" | "seasons" | "title">("rating");
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(12);

    // See More modal state
    const [selectedGenre, setSelectedGenre] = useState<{
        name: string;
        shows: Show[];
    } | null>(null);
    const [modalPage, setModalPage] = useState(1);
    const MODAL_PAGE_SIZE = 12;

    const catalogTopRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetch("/tvshows.json")
            .then((res) => res.json())
            .then((data: Show[]) => {
                setShows(Array.isArray(data) ? data : []);
                setIsLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setIsLoading(false);
            });
    }, []);

    // Sync with URL genre param
    useEffect(() => {
        const urlGenre = searchParams.get("genre");
        if (urlGenre) {
            setActiveGenre(urlGenre);
            setViewMode("grid");
            setCurrentPage(1);
        }
    }, [searchParams]);

    const genreMap: Record<string, Show[]> = useMemo(() => {
        const map: Record<string, Show[]> = {};
        shows.forEach((show) => {
            if (Array.isArray(show.genre)) {
                show.genre.forEach((g) => {
                    if (!map[g]) map[g] = [];
                    map[g].push(show);
                });
            }
        });
        return map;
    }, [shows]);

    const genreOrder = useMemo(() => Object.keys(genreMap), [genreMap]);
    const allGenresList = useMemo(() => ["All", ...genreOrder], [genreOrder]);

    const featured = shows[0];

    // Filter & Sort for Grid View
    const filteredShows = useMemo(() => {
        let result = [...shows];

        if (activeGenre !== "All") {
            result = result.filter(
                (s) =>
                    Array.isArray(s.genre) &&
                    s.genre.some((g) => g.toLowerCase() === activeGenre.toLowerCase())
            );
        }

        if (searchTerm.trim()) {
            const q = searchTerm.toLowerCase();
            result = result.filter(
                (s) =>
                    s.title.toLowerCase().includes(q) ||
                    (s.channel && s.channel.toLowerCase().includes(q)) ||
                    (s.shortDescription && s.shortDescription.toLowerCase().includes(q)) ||
                    (s.description && s.description.toLowerCase().includes(q))
            );
        }

        result.sort((a, b) => {
            if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
            if (sortBy === "year") return (b.year || 0) - (a.year || 0);
            if (sortBy === "seasons") return (b.seasons || 0) - (a.seasons || 0);
            if (sortBy === "title") return a.title.localeCompare(b.title);
            return 0;
        });

        return result;
    }, [shows, activeGenre, searchTerm, sortBy]);

    // Paginated items
    const totalPages = Math.ceil(filteredShows.length / pageSize) || 1;
    const paginatedShows = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return filteredShows.slice(start, start + pageSize);
    }, [filteredShows, currentPage, pageSize]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        if (catalogTopRef.current) {
            catalogTopRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    const handleGenreSelect = (g: string) => {
        setActiveGenre(g);
        setCurrentPage(1);
        if (g === "All") {
            router.push("/tvshows");
        } else {
            router.push(`/tvshows?genre=${encodeURIComponent(g)}`);
        }
    };

    // Modal pagination
    const modalTotalPages = selectedGenre
        ? Math.ceil(selectedGenre.shows.length / MODAL_PAGE_SIZE) || 1
        : 1;
    const modalPaginatedShows = useMemo(() => {
        if (!selectedGenre) return [];
        const start = (modalPage - 1) * MODAL_PAGE_SIZE;
        return selectedGenre.shows.slice(start, start + MODAL_PAGE_SIZE);
    }, [selectedGenre, modalPage]);

    return (
        <main className="min-h-screen bg-black text-white">
            {isLoading ? (
                <div className="flex min-h-screen items-center justify-center">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-neutral-800 border-t-red-600" />
                </div>
            ) : (
                <>
                    {/* Hero / Featured Banner in Rows View */}
                    {featured && viewMode === "rows" && (
                        <div className="relative h-[60vh] min-h-[380px] w-full overflow-hidden sm:h-[70vh]">
                            <PosterImage
                                show={featured}
                                className="h-full w-full object-cover object-top opacity-60"
                            />

                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent" />

                            <div className="absolute bottom-0 left-0 right-0 px-4 pb-10 sm:px-8 sm:pb-14 lg:px-12">
                                <span className="mb-3 inline-block rounded-full bg-red-600/90 px-3 py-1 text-xs font-bold uppercase tracking-wider">
                                    Featured Series
                                </span>
                                <h1 className="max-w-2xl text-3xl font-black leading-tight sm:text-5xl">
                                    {featured.title}
                                </h1>
                                <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-neutral-300">
                                    <span className="flex items-center gap-1 font-semibold text-yellow-400">
                                        ⭐ {featured.rating}
                                    </span>
                                    <span>{featured.year}</span>
                                    <span>•</span>
                                    <span>
                                        {featured.seasons} Season
                                        {featured.seasons > 1 ? "s" : ""}
                                    </span>
                                    <span>•</span>
                                    <span>{featured.channel}</span>
                                </div>
                                <p className="mt-4 max-w-xl text-sm leading-relaxed text-neutral-300 sm:text-base">
                                    {featured.shortDescription}
                                </p>
                                <div className="mt-6 flex gap-3">
                                    <Link
                                        href={"/tvshows/" + featured.id}
                                        className="flex items-center gap-2 rounded-lg bg-white px-6 py-3 font-bold text-black transition hover:bg-neutral-200"
                                    >
                                        Play
                                    </Link>

                                    <Link
                                        href={"/tvshows/" + featured.id}
                                        className="flex items-center gap-2 rounded-lg bg-white/15 px-6 py-3 font-bold text-white backdrop-blur-sm transition hover:bg-white/25"
                                    >
                                        More Info
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Catalog Controls Header */}
                    <div
                        ref={catalogTopRef}
                        className="sticky top-0 z-20 bg-neutral-950/90 backdrop-blur-md border-b border-neutral-800/80 px-4 py-4 sm:px-8 lg:px-12"
                    >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            {/* View Switcher */}
                            <div className="flex items-center gap-2">
                                <div className="inline-flex rounded-xl bg-neutral-900 p-1 border border-neutral-800">
                                    <button
                                        type="button"
                                        onClick={() => setViewMode("rows")}
                                        className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                                            viewMode === "rows"
                                                ? "bg-rose-600 text-white shadow"
                                                : "text-neutral-400 hover:text-white"
                                        }`}
                                    >
                                        <Rows3 className="w-3.5 h-3.5" />
                                        Curated Rows
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setViewMode("grid")}
                                        className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                                            viewMode === "grid"
                                                ? "bg-rose-600 text-white shadow"
                                                : "text-neutral-400 hover:text-white"
                                        }`}
                                    >
                                        <LayoutGrid className="w-3.5 h-3.5" />
                                        Browse TV Shows
                                    </button>
                                </div>

                                {viewMode === "grid" && (
                                    <span className="text-xs text-neutral-400 hidden sm:inline">
                                        ({filteredShows.length} series)
                                    </span>
                                )}
                            </div>

                            {/* Search & Sort Controls in Grid View */}
                            {viewMode === "grid" && (
                                <div className="flex flex-wrap items-center gap-2.5">
                                    {/* Quick Search */}
                                    <div className="relative flex-1 sm:w-56 md:w-64">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                                        <input
                                            type="text"
                                            value={searchTerm}
                                            onChange={(e) => {
                                                setSearchTerm(e.target.value);
                                                setCurrentPage(1);
                                            }}
                                            placeholder="Search TV shows, networks..."
                                            className="w-full bg-neutral-900 border border-neutral-800 rounded-lg pl-9 pr-8 py-1.5 text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-rose-500 transition-colors"
                                        />
                                        {searchTerm && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setSearchTerm("");
                                                    setCurrentPage(1);
                                                }}
                                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white cursor-pointer"
                                            >
                                                <X className="w-3.5 h-3.5" />
                                            </button>
                                        )}
                                    </div>

                                    {/* Sort Dropdown */}
                                    <div className="flex items-center gap-1.5 bg-neutral-900 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-neutral-300">
                                        <ArrowUpDown className="w-3.5 h-3.5 text-neutral-500" />
                                        <select
                                            value={sortBy}
                                            onChange={(e) => {
                                                setSortBy(
                                                    e.target.value as
                                                        | "rating"
                                                        | "year"
                                                        | "seasons"
                                                        | "title"
                                                );
                                                setCurrentPage(1);
                                            }}
                                            className="bg-transparent text-xs text-neutral-200 focus:outline-none cursor-pointer"
                                        >
                                            <option value="rating" className="bg-neutral-900">
                                                Top Rated
                                            </option>
                                            <option value="year" className="bg-neutral-900">
                                                Release Year
                                            </option>
                                            <option value="seasons" className="bg-neutral-900">
                                                Most Seasons
                                            </option>
                                            <option value="title" className="bg-neutral-900">
                                                Title (A-Z)
                                            </option>
                                        </select>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Genre Filter Pills in Grid View */}
                        {viewMode === "grid" && (
                            <div className="mt-3.5 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
                                {allGenresList.map((genre) => {
                                    const isSelected =
                                        activeGenre.toLowerCase() === genre.toLowerCase();
                                    return (
                                        <button
                                            key={genre}
                                            type="button"
                                            onClick={() => handleGenreSelect(genre)}
                                            className={`shrink-0 px-3.5 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                                                isSelected
                                                    ? "bg-white text-black font-semibold shadow"
                                                    : "bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700"
                                            }`}
                                        >
                                            {genre}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Content Section */}
                    {viewMode === "rows" ? (
                        /* Curated Rows */
                        <div className="relative z-10 mt-6 px-4 pb-16 sm:px-8 lg:px-12">
                            {genreOrder.map((genre) => (
                                <ShowRow
                                    key={genre}
                                    genre={genre}
                                    shows={genreMap[genre] || []}
                                    onSeeMore={(name, list) => {
                                        setSelectedGenre({ name, shows: list });
                                        setModalPage(1);
                                    }}
                                />
                            ))}
                        </div>
                    ) : (
                        /* Paginated TV Shows Grid */
                        <div className="px-4 py-8 sm:px-8 lg:px-12">
                            {paginatedShows.length === 0 ? (
                                <div className="py-20 text-center text-neutral-500">
                                    <p className="text-4xl mb-3">📺</p>
                                    <p className="text-lg font-medium text-neutral-300">
                                        No TV shows found
                                    </p>
                                    <p className="text-sm mt-1">
                                        Try adjusting your genre filter or search query.
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setActiveGenre("All");
                                            setSearchTerm("");
                                            setCurrentPage(1);
                                            router.push("/tvshows");
                                        }}
                                        className="mt-4 px-4 py-2 rounded-lg bg-neutral-800 text-xs font-semibold text-white hover:bg-neutral-700 transition cursor-pointer"
                                    >
                                        Reset Filters
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                                        {paginatedShows.map((show) => (
                                            <motion.div
                                                key={show.id}
                                                whileHover={{ scale: 1.04, y: -4 }}
                                                whileTap={{ scale: 0.98 }}
                                                transition={{
                                                    type: "spring",
                                                    stiffness: 400,
                                                    damping: 26,
                                                }}
                                                className="group relative cursor-pointer overflow-hidden rounded-xl bg-neutral-900 border border-neutral-800/80 shadow-md hover:border-neutral-700 transition-all"
                                            >
                                                <Link
                                                    href={"/tvshows/" + show.id}
                                                    className="block w-full h-full"
                                                >
                                                    <PosterImage
                                                        show={show}
                                                        className="aspect-[2/3] w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                    />
                                                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/80 to-transparent px-3 pb-3 pt-12">
                                                        <p className="truncate text-xs font-bold text-white sm:text-sm">
                                                            {show.title}
                                                        </p>
                                                        <div className="mt-1 flex items-center justify-between text-[11px] text-neutral-400">
                                                            <span className="font-semibold text-yellow-400">
                                                                ⭐ {show.rating}
                                                            </span>
                                                            <span>
                                                                {show.seasons} season
                                                                {show.seasons > 1 ? "s" : ""}
                                                            </span>
                                                        </div>
                                                        {show.channel && (
                                                            <div className="mt-1.5">
                                                                <span className="inline-block text-[9px] px-1.5 py-0.5 rounded bg-white/10 text-neutral-300 backdrop-blur-sm">
                                                                    {show.channel}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </Link>
                                            </motion.div>
                                        ))}
                                    </div>

                                    {/* Pagination Controls */}
                                    <div className="mt-10 border-t border-neutral-800 pt-6">
                                        <Pagination
                                            currentPage={currentPage}
                                            totalPages={totalPages}
                                            onPageChange={handlePageChange}
                                            totalItems={filteredShows.length}
                                            pageSize={pageSize}
                                            pageSizeOptions={[8, 12, 18, 24]}
                                            onPageSizeChange={(size) => {
                                                setPageSize(size);
                                                setCurrentPage(1);
                                            }}
                                            showPageSize={true}
                                            showSummary={true}
                                            itemName="TV series"
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </>
            )}

            {/* See More Modal with Pagination */}
            <AnimatePresence>
                {selectedGenre && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            onClick={() => setSelectedGenre(null)}
                            className="fixed inset-0 z-40 bg-black/90 backdrop-blur-sm"
                        />

                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 30 }}
                            transition={{
                                type: "spring",
                                stiffness: 360,
                                damping: 34,
                                mass: 0.95,
                            }}
                            className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 pt-12 sm:p-8"
                        >
                            <div className="relative w-full max-w-6xl rounded-2xl bg-neutral-900 p-6 shadow-2xl ring-1 ring-white/10 sm:p-8">
                                <div className="mb-6 flex items-center justify-between">
                                    <div>
                                        <h2 className="text-2xl font-bold text-white sm:text-3xl">
                                            {selectedGenre.name} Series
                                        </h2>
                                        <p className="text-xs text-neutral-400 mt-1">
                                            {selectedGenre.shows.length} shows available
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setSelectedGenre(null)}
                                        className="flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-black/80 cursor-pointer"
                                    >
                                        ✕
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                                    {modalPaginatedShows.map((show) => (
                                        <motion.div
                                            key={show.id}
                                            whileHover={{ scale: 1.05, y: -3 }}
                                            whileTap={{ scale: 0.97 }}
                                            transition={{
                                                type: "spring",
                                                stiffness: 420,
                                                damping: 28,
                                                mass: 0.8,
                                            }}
                                            className="relative cursor-pointer overflow-hidden rounded-lg"
                                        >
                                            <Link href={"/tvshows/" + show.id} className="block w-full h-full">
                                                <PosterImage
                                                    show={show}
                                                    className="aspect-[2/3] w-full object-cover"
                                                />
                                                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/70 to-transparent px-2 pb-2 pt-8">
                                                    <p className="truncate text-xs font-semibold text-white sm:text-sm">
                                                        {show.title}
                                                    </p>
                                                    <div className="mt-0.5 flex items-center gap-1 text-[10px] text-yellow-400 sm:text-xs">
                                                        ⭐ {show.rating}
                                                    </div>
                                                </div>
                                            </Link>
                                        </motion.div>
                                    ))}
                                </div>

                                {modalTotalPages > 1 && (
                                    <div className="mt-6 border-t border-neutral-800 pt-4">
                                        <Pagination
                                            currentPage={modalPage}
                                            totalPages={modalTotalPages}
                                            onPageChange={(p) => setModalPage(p)}
                                            totalItems={selectedGenre.shows.length}
                                            pageSize={MODAL_PAGE_SIZE}
                                            showSummary={true}
                                            itemName="TV shows"
                                        />
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
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