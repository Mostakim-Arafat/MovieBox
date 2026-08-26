"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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

export default function MoviesPage() {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetch("/movies.json")
            .then((res) => res.json())
            .then((data: Movie[]) => {
                setMovies(data);
                setIsLoading(false);
            })
            .catch((err) => {
                console.error("Failed to load movies:", err);
                setIsLoading(false);
            });
    }, []);

    return (
        <main className="min-h-screen bg-black px-4 py-8 text-white sm:px-6 sm:py-10">
            <div className="mx-auto max-w-7xl">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold sm:text-3xl">
                        🎬 Movies
                    </h1>
                    <p className="mt-2 text-sm text-neutral-400 sm:text-base">
                        Explore our full collection of movies.
                    </p>
                </div>

                {/* Loading state */}
                {isLoading && (
                    <div className="flex items-center justify-center py-20">
                        <div className="h-10 w-10 animate-spin rounded-full border-4 border-neutral-800 border-t-red-600" />
                    </div>
                )}

                {/* Movie Grid */}
                {!isLoading && (
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 md:grid-cols-4 lg:grid-cols-5">
                        {movies.map((movie) => (
                            <motion.div
                                key={movie.id}
                                layoutId={`movie-card-${movie.id}`}
                                onClick={() => setSelectedMovie(movie)}
                                className="group cursor-pointer overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900 shadow-sm"
                                whileHover={{ scale: 1.03 }}
                                transition={{ duration: 0.2 }}
                            >
                                <motion.img
                                    layoutId={`movie-poster-${movie.id}`}
                                    src={movie.poster}
                                    alt={movie.title}
                                    className="aspect-[2/3] w-full object-cover"
                                />
                                <div className="p-3">
                                    <motion.h3
                                        layoutId={`movie-title-${movie.id}`}
                                        className="truncate text-sm font-semibold text-white sm:text-base"
                                    >
                                        {movie.title}
                                    </motion.h3>
                                    <div className="mt-1 flex items-center gap-2 text-xs text-neutral-400">
                                        <span>{movie.year}</span>
                                        <span>•</span>
                                        <span className="flex items-center gap-1">
                                            ⭐ {movie.rating}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Expanded Movie Modal */}
            <AnimatePresence>
                {selectedMovie && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedMovie(null)}
                            className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm"
                        />

                        {/* Expanded Card */}
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                            <motion.div
                                layoutId={`movie-card-${selectedMovie.id}`}
                                className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-neutral-900 shadow-2xl"
                            >
                                {/* Close button */}
                                <button
                                    onClick={() => setSelectedMovie(null)}
                                    className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-black/80"
                                >
                                    ✕
                                </button>

                                <div className="flex flex-col sm:flex-row">
                                    {/* Poster */}
                                    <motion.img
                                        layoutId={`movie-poster-${selectedMovie.id}`}
                                        src={selectedMovie.poster}
                                        alt={selectedMovie.title}
                                        className="h-64 w-full object-cover sm:h-auto sm:w-64"
                                    />

                                    {/* Details */}
                                    <div className="flex-1 p-6">
                                        <motion.h2
                                            layoutId={`movie-title-${selectedMovie.id}`}
                                            className="text-2xl font-bold text-white"
                                        >
                                            {selectedMovie.title}
                                        </motion.h2>

                                        <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-neutral-400">
                                            <span>{selectedMovie.year}</span>
                                            <span>•</span>
                                            <span>{selectedMovie.duration}</span>
                                            <span>•</span>
                                            <span className="flex items-center gap-1">
                                                ⭐ {selectedMovie.rating}
                                            </span>
                                        </div>

                                        <div className="mt-3 flex flex-wrap gap-2">
                                            {selectedMovie.genre.map((g) => (
                                                <span
                                                    key={g}
                                                    className="rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs text-red-400"
                                                >
                                                    {g}
                                                </span>
                                            ))}
                                        </div>

                                        <p className="mt-4 text-sm leading-relaxed text-neutral-300">
                                            {selectedMovie.description}
                                        </p>

                                        <button className="mt-6 w-full rounded-full bg-red-600 px-6 py-3 font-semibold text-white transition hover:bg-red-700 sm:w-auto">
                                            ▶ Watch Now
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </>
                )}
            </AnimatePresence>
        </main>
    );
}