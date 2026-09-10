"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

type Movie = {
    id: number | string;
    title: string;
    poster: string;
    year: number;
    genre: string[];
    rating: number;
    duration: string;
    description: string;
};

type Review = {
    id: string;
    name: string;
    rating: number;
    comment: string;
    date: string;
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
                className={
                    "flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-neutral-800 via-neutral-900 to-black p-4 text-center " +
                    className
                }
            >
                <span className="text-4xl opacity-60">🎬</span>
                <span className="text-xs font-medium text-neutral-500">
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

function StarRatingInput({
    rating,
    onChange,
}: {
    rating: number;
    onChange: (val: number) => void;
}) {
    return (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    onClick={() => onChange(star)}
                    className="text-2xl transition"
                >
                    <span
                        className={
                            star <= rating
                                ? "text-yellow-400"
                                : "text-gray-300 dark:text-neutral-700"
                        }
                    >
                        ★
                    </span>
                </button>
            ))}
        </div>
    );
}

export default function MovieDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const [movie, setMovie] = useState<Movie | null>(null);
    const [allMovies, setAllMovies] = useState<Movie[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    // Review state
    const [reviews, setReviews] = useState<Review[]>([]);
    const [reviewName, setReviewName] = useState("");
    const [reviewRating, setReviewRating] = useState(0);
    const [reviewComment, setReviewComment] = useState("");

    useEffect(() => {
        fetch("/api/proxy-movies")
            .then((res) => res.json())
            .then((data: Movie[]) => {
                setAllMovies(data);
                const found = data.find(
                    (m) => String(m.id) === String(params.id)
                );
                if (found) {
                    setMovie(found);
                } else {
                    setNotFound(true);
                }
                setIsLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setIsLoading(false);
            });

        // Load reviews from localStorage (demo only, until backend review API exists)
        const stored = localStorage.getItem("reviews-" + params.id);
        if (stored) {
            setReviews(JSON.parse(stored));
        }
    }, [params.id]);

    const handleSubmitReview = (e: React.FormEvent) => {
        e.preventDefault();
        if (!reviewName.trim() || reviewRating === 0 || !reviewComment.trim()) {
            return;
        }

        const newReview: Review = {
            id: Date.now().toString(),
            name: reviewName.trim(),
            rating: reviewRating,
            comment: reviewComment.trim(),
            date: new Date().toLocaleDateString(),
        };

        const updated = [newReview, ...reviews];
        setReviews(updated);
        localStorage.setItem("reviews-" + params.id, JSON.stringify(updated));

        setReviewName("");
        setReviewRating(0);
        setReviewComment("");
    };

    if (isLoading) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-black">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-red-600 dark:border-neutral-800" />
            </main>
        );
    }

    if (notFound || !movie) {
        return (
            <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 text-center text-gray-900 dark:bg-black dark:text-white">
                <span className="text-5xl">🎬</span>
                <h1 className="mt-4 text-2xl font-bold">Movie not found</h1>
                <p className="mt-2 text-gray-500 dark:text-neutral-400">
                    We couldn&apos;t find the movie you&apos;re looking for.
                </p>
                <button
                    onClick={() => router.push("/movies")}
                    className="mt-6 rounded-full bg-red-600 px-6 py-3 font-bold text-white transition hover:bg-red-700"
                >
                    Back to Movies
                </button>
            </main>
        );
    }

    const similarMovies = allMovies
        .filter(
            (m) =>
                m.id !== movie.id &&
                m.genre.some((g) => movie.genre.includes(g))
        )
        .slice(0, 6);

    const averageUserRating =
        reviews.length > 0
            ? (
                reviews.reduce((sum, r) => sum + r.rating, 0) /
                reviews.length
            ).toFixed(1)
            : null;

    return (
        <main className="min-h-screen bg-gray-50 text-gray-900 dark:bg-black dark:text-white">
            {/* Hero banner with poster */}
            <div className="relative h-[50vh] min-h-[320px] w-full overflow-hidden sm:h-[60vh]">
                <PosterImage
                    movie={movie}
                    className="h-full w-full object-cover object-top opacity-70"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-50 via-gray-50/40 to-transparent dark:from-black dark:via-black/40" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/10 to-transparent" />

                <button
                    onClick={() => router.back()}
                    className="absolute left-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition hover:bg-black/70 sm:left-8 sm:top-8"
                >
                    ←
                </button>
            </div>

            {/* Content */}
            <div className="mx-auto -mt-20 max-w-4xl px-4 pb-16 sm:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <h1 className="text-3xl font-black sm:text-5xl">
                        {movie.title}
                    </h1>

                    <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-neutral-300">
                        <span className="flex items-center gap-1 font-semibold text-yellow-500 dark:text-yellow-400">
                            ⭐ {movie.rating}
                        </span>
                        {averageUserRating && (
                            <span className="rounded-full bg-red-600/10 px-2 py-0.5 text-xs font-semibold text-red-600 dark:text-red-400">
                                User: {averageUserRating} ({reviews.length})
                            </span>
                        )}
                        <span>{movie.year}</span>
                        <span>•</span>
                        <span>{movie.duration}</span>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                        {movie.genre.map((g) => (
                            <span
                                key={g}
                                className="rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs font-medium text-red-600 dark:text-red-400"
                            >
                                {g}
                            </span>
                        ))}
                    </div>

                    <p className="mt-6 max-w-2xl text-base leading-relaxed text-gray-700 dark:text-neutral-300">
                        {movie.description}
                    </p>

                    <div className="mt-8 flex flex-wrap gap-3">
                        <button className="rounded-full bg-red-600 px-8 py-3 font-bold text-white transition hover:bg-red-700">
                            ▶ Watch Now
                        </button>
                        <button className="rounded-full border border-gray-300 px-8 py-3 font-bold text-gray-700 transition hover:border-gray-500 dark:border-neutral-700 dark:text-neutral-300 dark:hover:border-neutral-500 dark:hover:text-white">
                            + My List
                        </button>
                    </div>
                </motion.div>

                {/* Reviews Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.15 }}
                    className="mt-14"
                >
                    <h2 className="mb-4 text-xl font-bold sm:text-2xl">
                        Ratings & Reviews
                    </h2>

                    {/* Write a review */}
                    <form
                        onSubmit={handleSubmitReview}
                        className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900"
                    >
                        <p className="mb-3 text-sm font-medium">
                            Write a review
                        </p>

                        <div className="mb-3">
                            <StarRatingInput
                                rating={reviewRating}
                                onChange={setReviewRating}
                            />
                        </div>

                        <input
                            value={reviewName}
                            onChange={(e) => setReviewName(e.target.value)}
                            placeholder="Your name"
                            className="mb-3 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm outline-none focus:border-red-600 dark:border-neutral-700"
                        />

                        <textarea
                            value={reviewComment}
                            onChange={(e) => setReviewComment(e.target.value)}
                            placeholder="Share your thoughts about this movie..."
                            rows={3}
                            className="mb-4 w-full resize-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm outline-none focus:border-red-600 dark:border-neutral-700"
                        />

                        <button
                            type="submit"
                            className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-red-700"
                        >
                            Submit Review
                        </button>
                    </form>

                    {/* Reviews list */}
                    <div className="mt-6 space-y-4">
                        {reviews.length === 0 && (
                            <p className="text-sm text-gray-500 dark:text-neutral-500">
                                No reviews yet. Be the first to share your
                                thoughts!
                            </p>
                        )}

                        {reviews.map((review) => (
                            <div
                                key={review.id}
                                className="rounded-xl border border-gray-200 p-4 dark:border-neutral-800"
                            >
                                <div className="flex items-center justify-between">
                                    <p className="font-semibold">
                                        {review.name}
                                    </p>
                                    <span className="text-xs text-gray-500 dark:text-neutral-500">
                                        {review.date}
                                    </span>
                                </div>
                                <div className="mt-1 flex">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <span
                                            key={s}
                                            className={
                                                s <= review.rating
                                                    ? "text-yellow-400"
                                                    : "text-gray-300 dark:text-neutral-700"
                                            }
                                        >
                                            ★
                                        </span>
                                    ))}
                                </div>
                                <p className="mt-2 text-sm text-gray-700 dark:text-neutral-300">
                                    {review.comment}
                                </p>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Similar movies */}
                {similarMovies.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.3 }}
                        className="mt-14"
                    >
                        <h2 className="mb-4 text-xl font-bold sm:text-2xl">
                            More like this
                        </h2>

                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                            {similarMovies.map((m) => (
                                <Link
                                    key={m.id}
                                    href={"/movies/" + m.id}
                                    className="group overflow-hidden rounded-lg"
                                >
                                    <PosterImage
                                        movie={m}
                                        className="aspect-[2/3] w-full object-cover transition group-hover:scale-105"
                                    />
                                    <p className="mt-2 truncate text-sm font-medium">
                                        {m.title}
                                    </p>
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>
        </main>
    );
}