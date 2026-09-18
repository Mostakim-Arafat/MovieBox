"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

type Movie = {
    id: number;
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
                    className="group flex items-center gap-1.5 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-sm font-medium text-neutral-300 backdrop-blur-sm transition-all hover:border-white/40 hover:bg-white/10 hover:text-white"
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
                        key={movie.id}
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

export default function MoviesPage() {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
    const [selectedGenre, setSelectedGenre] = useState<{
        name: string;
        movies: Movie[];
    } | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetch("/api/movies")
            .then((res) => res.json())
            .then((data: Movie[]) => {
                setMovies(data);
                setIsLoading(false);
            })
            .catch((err) => console.error(err));
    }, []);

    const genreMap: Record<string, Movie[]> = {};
    movies.forEach((movie) => {
        movie.genre.forEach((g) => {
            if (!genreMap[g]) genreMap[g] = [];
            genreMap[g].push(movie);
        });
    });

    const genreOrder = Object.keys(genreMap).sort((a, b) => {
        if (a === "Drama") return -1;
        if (b === "Drama") return 1;
        return genreMap[b].length - genreMap[a].length;
    });

    const featured = movies[0];

    return (
        <main className="min-h-screen bg-black text-white">
            {isLoading ? (
                <div className="flex min-h-screen items-center justify-center">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-neutral-800 border-t-red-600" />
                </div>
            ) : (
                <>
                    {featured && (
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
                                        className="flex items-center gap-2 rounded-lg bg-white px-6 py-3 font-bold text-black transition hover:bg-neutral-200"
                                    >
                                        ▶ Play
                                    </button>
                                    <button
                                        onClick={() => setSelectedMovie(featured)}
                                        className="flex items-center gap-2 rounded-lg bg-white/15 px-6 py-3 font-bold text-white backdrop-blur-sm transition hover:bg-white/25"
                                    >
                                        ℹ More Info
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="relative z-10 -mt-8 px-4 pb-16 sm:px-8 lg:px-12">
                        {genreOrder.map((genre) => (
                            <MovieRow
                                key={genre}
                                genre={genre}
                                movies={genreMap[genre]}
                                onSelect={setSelectedMovie}
                                onSeeMore={(name, list) =>
                                    setSelectedGenre({ name, movies: list })
                                }
                            />
                        ))}
                    </div>
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
                                    className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-black/80"
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
                                        <button className="flex-1 rounded-lg bg-red-600 px-6 py-3 font-bold text-white transition hover:bg-red-700 sm:flex-none">
                                            ▶ Watch Now
                                        </button>

                                        <Link
                                            href={"/movies/" + selectedMovie.id}
                                            className="flex-1 rounded-lg border border-red-600 px-6 py-3 text-center font-bold text-red-500 transition hover:bg-red-600/10 sm:flex-none"
                                        >
                                            View Details
                                        </Link>

                                        <button className="rounded-lg border border-neutral-700 px-6 py-3 font-bold text-neutral-300 transition hover:border-neutral-500 hover:text-white">
                                            + My List
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* See more Modal */}
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
                            className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 pt-16 sm:p-8"
                        >
                            <div className="relative w-full max-w-6xl rounded-2xl bg-neutral-900 p-6 shadow-2xl ring-1 ring-white/10 sm:p-8">
                                <div className="mb-6 flex items-center justify-between">
                                    <h2 className="text-2xl font-bold text-white sm:text-3xl">
                                        {selectedGenre.name}
                                    </h2>
                                    <button
                                        onClick={() => setSelectedGenre(null)}
                                        className="flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-black/80"
                                    >
                                        ✕
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                                    {selectedGenre.movies.map((movie) => (
                                        <motion.div
                                            key={movie.id}
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
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </main>
    );
}