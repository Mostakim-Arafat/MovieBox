"use client";

import { useEffect, useRef, useState, useMemo, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { LayoutGrid, Rows3, Search, ArrowUpDown, X } from "lucide-react";
import Pagination from "@/UI/Pagination";

type Movie = {
    _id: string;
    title: string;
    poster: string;
    year: number;
    genre: string[];
    rating: number;
    duration: string;
    description: string;
};

function PosterImage({
    movie,
    className,
}: {
    movie: Movie;
    className: string;
}) {
    const [imgError, setImgError] = useState(false);

    if (imgError) {
        return (
            <div
                className={`flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-neutral-800 via-neutral-900 to-black p-4 text-center ${className}`}
            >
                <span className="text-4xl opacity-60">🎬</span>
                <span className="line-clamp-2 text-xs font-medium text-neutral-500">
                    {movie.title}
                </span>
            </div>
        );
    }

    return (
        <img
            src={movie.poster}
            alt={movie.title}
            onError={() => setImgError(true)}
            className={className}
        />
    );
}

function MovieRow({
    genre,
    movies,
    onSelect,
    onSeeMore,
}: {
    genre: string;
    movies: Movie[];
    onSelect: (m: Movie) => void;
    onSeeMore: (genre: string, movies: Movie[]) => void;
}) {
    const rowRef = useRef<HTMLDivElement>(null);
    const [cardWidth, setCardWidth] = useState<number>(200);

    const isDragging = useRef(false);
    const startX = useRef(0);
    const startScrollLeft = useRef(0);

    const GAP = 16;
    const MAX_VISIBLE = 5;

    useEffect(() => {
        const el = rowRef.current;
        if (!el) return;

        const calculate = () => {
            const containerWidth = el.offsetWidth;
            const visibleCount = Math.min(movies.length, MAX_VISIBLE);
            if (visibleCount === 0) return;

            const totalGap = GAP * (visibleCount - 1);
            let width = (containerWidth - totalGap) / visibleCount;

            if (movies.length <= 2) {
                width = Math.min(width, 280);
            }

            setCardWidth(Math.max(width, 150));
        };

        calculate();
        const observer = new ResizeObserver(calculate);
        observer.observe(el);
        return () => observer.disconnect();
    }, [movies.length]);

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

    const handleWheel = (e: React.WheelEvent) => {
        const el = rowRef.current;
        if (!el) return;
        if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
            e.preventDefault();
            el.scrollLeft += e.deltaY;
        }
    };

    return (
        <div className="mb-10">
            <div className="mb-4 flex items-center justify-between gap-4">
                <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
                    {genre}
                </h2>

                <button
                    onClick={() => onSeeMore(genre, movies)}
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
                onWheel={handleWheel}
                className="scrollbar-hide flex cursor-grab gap-4 overflow-x-auto pb-3 select-none"
            >
                {movies.map((movie) => (
                    <motion.div
                        key={movie._id}
                        onClick={() => onSelect(movie)}
                        whileHover={{ scale: 1.05, y: -4 }}
                        whileTap={{ scale: 0.97 }}
                        transition={{
                            type: "spring",
                            stiffness: 420,
                            damping: 28,
                            mass: 0.8,
                        }}
                        style={{ width: `${cardWidth}px` }}
                        className="relative shrink-0 cursor-pointer overflow-hidden rounded-lg"
                    >
                        <PosterImage
                            movie={movie}
                            className="aspect-[2/3] w-full object-cover"
                        />

                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/70 to-transparent px-2.5 pb-2.5 pt-8">
                            <p className="truncate text-xs font-semibold text-white sm:text-sm">
                                {movie.title}
                            </p>
                            <div className="mt-0.5 flex items-center gap-1 text-[10px] text-yellow-400 sm:text-xs">
                                ⭐ {movie.rating}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

function MoviesContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const initialGenre = searchParams.get("genre") || "All";

    const [movies, setMovies] = useState<Movie[]>([]);
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
    const [selectedGenre, setSelectedGenre] = useState<{
        name: string;
        movies: Movie[];
    } | null>(null);
    const [modalPage, setModalPage] = useState(1);
    const MODAL_PAGE_SIZE = 12;

    const [isLoading, setIsLoading] = useState(true);
    const [isNavigating, setIsNavigating] = useState(false);

    // View mode: 'rows' (curated carousels) or 'grid' (paginated catalog)
    const [viewMode, setViewMode] = useState<"rows" | "grid">(
        initialGenre !== "All" ? "grid" : "rows"
    );

    // Grid filters and pagination state
    const [activeGenre, setActiveGenre] = useState<string>(initialGenre);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [sortBy, setSortBy] = useState<"rating" | "year" | "title">("rating");
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(12);

    const catalogTopRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetch("/api/movies")
            .then((res) => res.json())
            .then((data: Movie[]) => {
                setMovies(Array.isArray(data) ? data : []);
                setIsLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setIsLoading(false);
            });
    }, []);

    // Sync with URL genre param when it changes
    useEffect(() => {
        const urlGenre = searchParams.get("genre");
        if (urlGenre) {
            setActiveGenre(urlGenre);
            setViewMode("grid");
            setCurrentPage(1);
        }
    }, [searchParams]);

    // Build genre map
    const genreMap: Record<string, Movie[]> = useMemo(() => {
        const map: Record<string, Movie[]> = {};
        movies.forEach((movie) => {
            if (Array.isArray(movie.genre)) {
                movie.genre.forEach((g) => {
                    if (!map[g]) map[g] = [];
                    map[g].push(movie);
                });
            }
        });
        return map;
    }, [movies]);

    const genreOrder = useMemo(() => {
        return Object.keys(genreMap).sort((a, b) => {
            if (a === "Drama") return -1;
            if (b === "Drama") return 1;
            return (genreMap[b]?.length || 0) - (genreMap[a]?.length || 0);
        });
    }, [genreMap]);

    const allGenresList = useMemo(() => {
        return ["All", ...genreOrder];
    }, [genreOrder]);

    // Filter and sort movies for the paginated grid view
    const filteredMovies = useMemo(() => {
        let result = [...movies];

        // Filter by genre
        if (activeGenre !== "All") {
            result = result.filter(
                (m) =>
                    Array.isArray(m.genre) &&
                    m.genre.some(
                        (g) => g.toLowerCase() === activeGenre.toLowerCase()
                    )
            );
        }

        // Filter by search term
        if (searchTerm.trim()) {
            const q = searchTerm.toLowerCase();
            result = result.filter(
                (m) =>
                    m.title.toLowerCase().includes(q) ||
                    (m.description && m.description.toLowerCase().includes(q))
            );
        }

        // Sort
        result.sort((a, b) => {
            if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
            if (sortBy === "year") return (b.year || 0) - (a.year || 0);
            if (sortBy === "title") return a.title.localeCompare(b.title);
            return 0;
        });

        return result;
    }, [movies, activeGenre, searchTerm, sortBy]);

    // Paginated slice
    const totalPages = Math.ceil(filteredMovies.length / pageSize) || 1;
    const paginatedMovies = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return filteredMovies.slice(start, start + pageSize);
    }, [filteredMovies, currentPage, pageSize]);

    // Handle page change with scroll
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        if (catalogTopRef.current) {
            catalogTopRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    // Filter changes reset page to 1
    const handleGenreSelect = (g: string) => {
        setActiveGenre(g);
        setCurrentPage(1);
        if (g === "All") {
            router.push("/movies");
        } else {
            router.push(`/movies?genre=${encodeURIComponent(g)}`);
        }
    };

    const handleSearchChange = (term: string) => {
        setSearchTerm(term);
        setCurrentPage(1);
    };

    const featured = movies[16] || movies[0];

    // See More modal pagination
    const modalTotalPages = selectedGenre
        ? Math.ceil(selectedGenre.movies.length / MODAL_PAGE_SIZE) || 1
        : 1;
    const modalPaginatedMovies = useMemo(() => {
        if (!selectedGenre) return [];
        const start = (modalPage - 1) * MODAL_PAGE_SIZE;
        return selectedGenre.movies.slice(start, start + MODAL_PAGE_SIZE);
    }, [selectedGenre, modalPage]);

    return (
        <main className="min-h-screen bg-black text-white">
            {isLoading ? (
                <div className="flex min-h-screen items-center justify-center">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-neutral-800 border-t-red-600" />
                </div>
            ) : (
                <>
                    {/* Featured Hero Banner */}
                    {featured && viewMode === "rows" && (
                        <div className="relative h-[58vh] min-h-[360px] w-full overflow-hidden sm:h-[68vh]">
                            <PosterImage
                                movie={featured}
                                className="h-full w-full object-cover object-top opacity-75"
                            />

                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent" />

                            <div className="absolute bottom-0 left-0 right-0 px-4 pb-10 sm:px-8 sm:pb-14 lg:px-12">
                                <span className="mb-3 inline-block rounded-full bg-red-600 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
                                    Featured
                                </span>
                                <h1 className="max-w-2xl text-3xl font-black leading-tight text-white sm:text-5xl">
                                    {featured.title}
                                </h1>
                                <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-neutral-300">
                                    <span className="flex items-center gap-1 font-semibold text-yellow-400">
                                        ⭐ {featured.rating}
                                    </span>
                                    <span>{featured.year}</span>
                                    <span>•</span>
                                    <span>{featured.duration}</span>
                                </div>
                                <p className="mt-4 max-w-xl text-sm leading-relaxed text-neutral-300 sm:text-base">
                                    {featured.description}
                                </p>
                                <div className="mt-6 flex gap-3">
                                    <button
                                        onClick={() => setSelectedMovie(featured)}
                                        className="flex items-center gap-2 rounded-lg bg-white px-6 py-3 font-bold text-black transition hover:bg-neutral-200 cursor-pointer"
                                    >
                                        ▶ Play
                                    </button>
                                    <button
                                        onClick={() => setSelectedMovie(featured)}
                                        className="flex items-center gap-2 rounded-lg bg-white/15 px-6 py-3 font-bold text-white backdrop-blur-sm transition hover:bg-white/25 cursor-pointer"
                                    >
                                        ℹ More Info
                                    </button>
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
                            {/* View Switcher Tabs */}
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
                                        Browse Catalog
                                    </button>
                                </div>

                                {viewMode === "grid" && (
                                    <span className="text-xs text-neutral-400 hidden sm:inline">
                                        ({filteredMovies.length} movies)
                                    </span>
                                )}
                            </div>

                            {/* Search & Sort Controls when in Grid view */}
                            {viewMode === "grid" && (
                                <div className="flex flex-wrap items-center gap-2.5">
                                    {/* Quick Search */}
                                    <div className="relative flex-1 sm:w-56 md:w-64">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                                        <input
                                            type="text"
                                            value={searchTerm}
                                            onChange={(e) => handleSearchChange(e.target.value)}
                                            placeholder="Search in movies..."
                                            className="w-full bg-neutral-900 border border-neutral-800 rounded-lg pl-9 pr-8 py-1.5 text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-rose-500 transition-colors"
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
                                    <div className="flex items-center gap-1.5 bg-neutral-900 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-neutral-300">
                                        <ArrowUpDown className="w-3.5 h-3.5 text-neutral-500" />
                                        <select
                                            value={sortBy}
                                            onChange={(e) => {
                                                setSortBy(e.target.value as "rating" | "year" | "title");
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
                                    const isSelected = activeGenre.toLowerCase() === genre.toLowerCase();
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
                        /* Traditional Carousels */
                        <div className="relative z-10 mt-6 px-4 pb-16 sm:px-8 lg:px-12">
                            {genreOrder.map((genre) => (
                                <MovieRow
                                    key={genre}
                                    genre={genre}
                                    movies={genreMap[genre] || []}
                                    onSelect={setSelectedMovie}
                                    onSeeMore={(name, list) => {
                                        setSelectedGenre({ name, movies: list });
                                        setModalPage(1);
                                    }}
                                />
                            ))}
                        </div>
                    ) : (
                        /* Paginated Catalog Grid View */
                        <div className="px-4 py-8 sm:px-8 lg:px-12">
                            {paginatedMovies.length === 0 ? (
                                <div className="py-20 text-center text-neutral-500">
                                    <p className="text-4xl mb-3">🎬</p>
                                    <p className="text-lg font-medium text-neutral-300">No movies found</p>
                                    <p className="text-sm mt-1">Try adjusting your genre filter or search query.</p>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setActiveGenre("All");
                                            setSearchTerm("");
                                            setCurrentPage(1);
                                            router.push("/movies");
                                        }}
                                        className="mt-4 px-4 py-2 rounded-lg bg-neutral-800 text-xs font-semibold text-white hover:bg-neutral-700 transition cursor-pointer"
                                    >
                                        Reset Filters
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                                        {paginatedMovies.map((movie) => (
                                            <motion.div
                                                key={movie._id}
                                                onClick={() => setSelectedMovie(movie)}
                                                whileHover={{ scale: 1.04, y: -4 }}
                                                whileTap={{ scale: 0.98 }}
                                                transition={{
                                                    type: "spring",
                                                    stiffness: 400,
                                                    damping: 26,
                                                }}
                                                className="group relative cursor-pointer overflow-hidden rounded-xl bg-neutral-900 border border-neutral-800/80 shadow-md hover:border-neutral-700 transition-all"
                                            >
                                                <PosterImage
                                                    movie={movie}
                                                    className="aspect-[2/3] w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                />
                                                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/80 to-transparent px-3 pb-3 pt-12">
                                                    <p className="truncate text-xs font-bold text-white sm:text-sm">
                                                        {movie.title}
                                                    </p>
                                                    <div className="mt-1 flex items-center justify-between text-[11px] text-neutral-400">
                                                        <span className="font-semibold text-yellow-400">
                                                            ⭐ {movie.rating}
                                                        </span>
                                                        <span>{movie.year}</span>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>

                                    {/* Pagination Controls */}
                                    <div className="mt-10 border-t border-neutral-800 pt-6">
                                        <Pagination
                                            currentPage={currentPage}
                                            totalPages={totalPages}
                                            onPageChange={handlePageChange}
                                            totalItems={filteredMovies.length}
                                            pageSize={pageSize}
                                            pageSizeOptions={[12, 18, 24, 36]}
                                            onPageSizeChange={(size) => {
                                                setPageSize(size);
                                                setCurrentPage(1);
                                            }}
                                            showPageSize={true}
                                            showSummary={true}
                                            itemName="movies"
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </>
            )}

            {/* Detail Modal */}
            <AnimatePresence>
                {selectedMovie && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            onClick={() => setSelectedMovie(null)}
                            className="fixed inset-0 z-40 bg-black/85 backdrop-blur-sm"
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
                            className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        >
                            <div className="relative w-full max-w-3xl overflow-hidden rounded-2xl bg-neutral-900 shadow-2xl ring-1 ring-white/10">
                                <button
                                    onClick={() => setSelectedMovie(null)}
                                    className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-black/80 cursor-pointer"
                                >
                                    ✕
                                </button>

                                <div className="relative h-56 w-full sm:h-64">
                                    <PosterImage
                                        movie={selectedMovie}
                                        className="h-full w-full object-cover object-top"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/40 to-transparent" />
                                </div>

                                <div className="p-6 sm:p-8">
                                    <h2 className="text-2xl font-bold text-white sm:text-3xl">
                                        {selectedMovie.title}
                                    </h2>

                                    <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-neutral-400">
                                        <span className="flex items-center gap-1 font-semibold text-yellow-400">
                                            ⭐ {selectedMovie.rating}
                                        </span>
                                        <span>{selectedMovie.year}</span>
                                        <span>•</span>
                                        <span>{selectedMovie.duration}</span>
                                    </div>

                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {selectedMovie.genre.map((g) => (
                                            <span
                                                key={g}
                                                className="rounded-full border border-neutral-700 bg-neutral-800 px-3 py-1 text-xs text-neutral-300"
                                            >
                                                {g}
                                            </span>
                                        ))}
                                    </div>

                                    <p className="mt-5 text-sm leading-relaxed text-neutral-300 sm:text-base">
                                        {selectedMovie.description}
                                    </p>

                                    <div className="mt-7 flex flex-wrap gap-3">
                                        <Link
                                            href={"/movies/" + selectedMovie._id}
                                            onClick={() => {
                                                setSelectedMovie(null);
                                                setIsNavigating(true);
                                            }}
                                            className="flex-1 rounded-lg border border-red-600 px-6 py-3 text-center font-bold text-red-500 transition hover:bg-red-600/10 sm:flex-none"
                                        >
                                            View Details
                                        </Link>

                                        <button className="rounded-lg border border-neutral-700 px-6 py-3 font-bold text-neutral-300 transition hover:border-neutral-500 hover:text-white cursor-pointer">
                                            + My List
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {isNavigating && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm">
                    <div className="flex flex-col items-center text-center text-white">
                        <div className="relative flex h-16 w-16 items-center justify-center">
                            <div className="absolute inset-0 animate-spin rounded-full border-4 border-neutral-700 border-t-red-600" />
                            <span className="text-xl">🎬</span>
                        </div>
                        <p className="mt-4 text-sm font-semibold">Loading movie details...</p>
                    </div>
                </div>
            )}

            {/* See more Modal with Pagination */}
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
                                            {selectedGenre.name} Movies
                                        </h2>
                                        <p className="text-xs text-neutral-400 mt-1">
                                            {selectedGenre.movies.length} titles available
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setSelectedGenre(null)}
                                        className="flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-black/80 cursor-pointer"
                                    >
                                        ✕
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                                    {modalPaginatedMovies.map((movie) => (
                                        <motion.div
                                            key={movie._id}
                                            onClick={() => {
                                                setSelectedGenre(null);
                                                setSelectedMovie(movie);
                                            }}
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
                                            <PosterImage
                                                movie={movie}
                                                className="aspect-[2/3] w-full object-cover"
                                            />
                                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/70 to-transparent px-2 pb-2 pt-8">
                                                <p className="truncate text-xs font-semibold text-white sm:text-sm">
                                                    {movie.title}
                                                </p>
                                                <div className="mt-0.5 flex items-center gap-1 text-[10px] text-yellow-400 sm:text-xs">
                                                    ⭐ {movie.rating}
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>

                                {modalTotalPages > 1 && (
                                    <div className="mt-6 border-t border-neutral-800 pt-4">
                                        <Pagination
                                            currentPage={modalPage}
                                            totalPages={modalTotalPages}
                                            onPageChange={(p) => setModalPage(p)}
                                            totalItems={selectedGenre.movies.length}
                                            pageSize={MODAL_PAGE_SIZE}
                                            showSummary={true}
                                            itemName="movies"
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

export default function MoviesPage() {
    return (
        <Suspense
            fallback={
                <div className="flex min-h-screen items-center justify-center bg-black">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-neutral-800 border-t-red-600" />
                </div>
            }
        >
            <MoviesContent />
        </Suspense>
    );
}