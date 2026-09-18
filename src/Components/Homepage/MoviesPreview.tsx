"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link"; // Next.js ব্যবহার করলে Link ইম্পোর্ট করতে পারেন, অথবা সরাসরি a tag রাখতে পারেন

type Movie = {
    id: number | string;
    title: string;
    poster: string;
    rating: number;
    year: number;
};

function PosterImage({
    item,
    className,
}: {
    item: { title: string; poster: string };
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
                <span className="text-3xl opacity-60">🎬</span>
                <span className="text-xs font-medium text-neutral-500">
                    {item.title}
                </span>
            </div>
        );
    }

    return (
        <img
            src={item.poster}
            alt={item.title}
            onError={() => setImgError(true)}
            className={className}
        />
    );
}

export default function MoviesPreview() {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetch("/api/proxy-movies")
            .then((res) => res.json())
            .then((data: Movie[]) => {
                setMovies(data.slice(0, 8));
                setIsLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setIsLoading(false);
            });
    }, []);

    return (
        <section className="w-full bg-gray-50 px-4 py-12 dark:bg-black sm:px-8 lg:px-12">
            <div className="mx-auto max-w-7xl">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-black text-gray-900 dark:text-white sm:text-3xl">
                            🎬 Movies
                        </h2>
                        <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
                            Popular picks just for you
                        </p>
                    </div>

                    {/* এখানে আগে ওপেনিং ট্যাগ ছাড়া শুধু অ্যাট্রিবিউট ছিল, যা ঠিক করা হয়েছে */}
                    <Link
                        href="/movies"
                        className="shrink-0 rounded-full bg-red-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-red-700"
                    >
                        All Movies →
                    </Link>
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-16">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-red-600 dark:border-neutral-800" />
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
                        {movies.map((movie, index) => (
                            <motion.a
                                key={movie.id}
                                href={"/movies/" + movie.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{
                                    duration: 0.4,
                                    delay: index * 0.05,
                                }}
                                whileHover={{ scale: 1.05 }}
                                className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
                            >
                                <PosterImage
                                    item={movie}
                                    className="aspect-[2/3] w-full object-cover"
                                />
                                <div className="p-2.5">
                                    <p className="truncate text-xs font-semibold text-gray-900 dark:text-white sm:text-sm">
                                        {movie.title}
                                    </p>
                                    <div className="mt-1 flex items-center gap-1 text-[10px] text-yellow-500 dark:text-yellow-400 sm:text-xs">
                                        ⭐ {movie.rating}
                                    </div>
                                </div>
                            </motion.a>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}