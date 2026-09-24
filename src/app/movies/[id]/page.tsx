"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { ObjectId } from "mongodb";
import WatchModal from "@/Components/Movie/watchModal";

type Movie = {
    _id: ObjectId;
    title: string;
    poster: string;
    year: number;
    genre: string[];
    rating: number;
    duration: string;
    description: string;
    muxPlaybackId: string;
};

type Review = {
    id: string;
    name: string;
    rating: number;
    comment: string;
    date: string;
};

const mockCast = [
    { name: "Emma Stone", role: "Lead Actor", emoji: "🎭" },
    { name: "Ryan Gosling", role: "Lead Actor", emoji: "🎬" },
    { name: "Ana de Armas", role: "Supporting", emoji: "🎨" },
    { name: "Idris Elba", role: "Supporting", emoji: "🎥" },
    { name: "Zendaya", role: "Supporting", emoji: "🌟" },
];

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
                    className="text-2xl transition hover:scale-110"
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
    const [activeTab, setActiveTab] = useState<"overview" | "reviews" | "cast">(
        "overview"
    );
    const [inList, setInList] = useState(false);

    const [reviews, setReviews] = useState<Review[]>([]);
    const [reviewName, setReviewName] = useState("");
    const [reviewRating, setReviewRating] = useState(0);
    const [reviewComment, setReviewComment] = useState("");

    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        fetch("/api/proxy-movies")
            .then((res) => res.json())
            .then((data: Movie[]) => {
                setAllMovies(data);
                const found = data.find(
                    (m) => String(m._id) === String(params.id)
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

        const stored = localStorage.getItem("reviews-" + params.id);
        if (stored) {
            setReviews(JSON.parse(stored));
        }

        const list = localStorage.getItem("mylist");
        if (list) {
            const parsed: string[] = JSON.parse(list);
            setInList(parsed.includes(String(params.id)));
        }
    }, [params.id]);

    const toggleMyList = () => {
        const stored = localStorage.getItem("mylist");
        let list: string[] = stored ? JSON.parse(stored) : [];
        const id = String(params.id);

        if (list.includes(id)) {
            list = list.filter((x) => x !== id);
            setInList(false);
            toast("Removed from My List", { icon: "↩️" });
        } else {
            list.push(id);
            setInList(true);
            toast.success("Added to My List!");
        }
        localStorage.setItem("mylist", JSON.stringify(list));
    };

    const handleSubmitReview = (e: React.FormEvent) => {
        e.preventDefault();
        if (reviewRating === 0) {
            toast.error("Please select a star rating before submitting.");
            return;
        }
        if (!reviewName.trim()) {
            toast.error("Please enter your name.");
            return;
        }
        if (!reviewComment.trim()) {
            toast.error("Please write your review.");
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
        toast.success("Review submitted successfully!");
    };

    if (isLoading) {
        return (
            <main className="min-h-screen animate-pulse bg-black text-white">
                <div className="relative h-[55vh] min-h-[360px] w-full bg-neutral-900 sm:h-[65vh]">
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 px-4 pb-8 sm:px-8 lg:px-12">
                        <div className="h-6 w-24 rounded-full bg-neutral-800" />
                        <div className="mt-4 h-10 w-2/3 max-w-xl rounded-lg bg-neutral-800 sm:h-14" />
                    </div>
                </div>
                <div className="mx-auto max-w-5xl px-4 pb-16 pt-6 sm:px-8 lg:px-12">
                    <div className="flex flex-wrap gap-3">
                        <div className="h-12 w-36 rounded-xl bg-neutral-800" />
                        <div className="h-12 w-32 rounded-full bg-neutral-800" />
                        <div className="h-12 w-24 rounded-full bg-neutral-800" />
                    </div>
                    <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
                        {[1, 2, 3, 4].map((item) => (
                            <div key={item} className="h-24 rounded-xl bg-neutral-900" />
                        ))}
                    </div>
                </div>
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
                String(m._id) !== String(movie._id) &&
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

    const infoStats = [
        { label: "Rating", value: movie.rating + " / 10", icon: "⭐" },
        { label: "Duration", value: movie.duration, icon: "⏱" },
        { label: "Release", value: String(movie.year), icon: "📅" },
        { label: "Language", value: "English", icon: "🌐" },
    ];

    return (
        <main className="min-h-screen bg-gray-50 text-gray-900 dark:bg-black dark:text-white">
            <Toaster position="top-center" />
            {/* Hero banner */}
            <div className="relative h-[55vh] min-h-[360px] w-full overflow-hidden sm:h-[65vh]">
                <PosterImage
                    movie={movie}
                    className="h-full w-full object-cover object-top opacity-70"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-50 via-gray-50/30 to-transparent dark:from-black dark:via-black/30" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent" />

                <button
                    onClick={() => router.back()}
                    className="absolute left-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition hover:bg-black/70 sm:left-8 sm:top-8"
                >
                    ←
                </button>

                {/* Title overlay on hero */}
                <div className="absolute bottom-0 left-0 right-0 px-4 pb-8 sm:px-8 lg:px-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="mb-3 flex flex-wrap gap-2">
                            {movie.genre.map((g) => (
                                <span
                                    key={g}
                                    className="rounded-full border border-red-500/40 bg-red-500/20 px-3 py-1 text-xs font-semibold text-red-400 backdrop-blur-sm"
                                >
                                    {g}
                                </span>
                            ))}
                        </div>
                        <h1 className="max-w-2xl text-3xl font-black text-white drop-shadow-lg sm:text-5xl">
                            {movie.title}
                        </h1>
                    </motion.div>
                </div>
            </div>

            {/* Content */}
            <div className="mx-auto max-w-5xl px-4 pb-16 pt-6 sm:px-8 lg:px-12">
                {/* Action buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="flex flex-wrap gap-3"
                >



                    <button
                        onClick={() => setIsPlaying(true)}
                        disabled={!movie.muxPlaybackId}
                        className="px-6 py-3 rounded-xl font-semibold text-white bg-rose-600 hover:bg-rose-700 shadow-lg shadow-rose-900/30 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                        </svg>
                        {movie.muxPlaybackId ? "Watch Now" : "Video Unavailable"}
                    </button>

                    <WatchModal
                        isOpen={isPlaying}
                        onClose={() => setIsPlaying(false)}
                        muxPlaybackId={movie.muxPlaybackId}
                        title={movie.title}
                    />


                    <button
                        onClick={toggleMyList}
                        className={`flex items-center gap-2 rounded-full border px-8 py-3 font-bold transition ${inList
                            ? "border-red-600 bg-red-600/10 text-red-500"
                            : "border-gray-300 text-gray-700 hover:border-gray-500 dark:border-neutral-700 dark:text-neutral-300 dark:hover:border-neutral-500 dark:hover:text-white"
                            }`}
                    >
                        {inList ? "✓ In My List" : "+ My List"}
                    </button>
                    <button className="flex items-center gap-2 rounded-full border border-gray-300 px-6 py-3 font-bold text-gray-700 transition hover:border-gray-500 dark:border-neutral-700 dark:text-neutral-300 dark:hover:border-neutral-500 dark:hover:text-white">
                        ↗ Share
                    </button>
                </motion.div>

                {/* Info stats grid */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4"
                >
                    {infoStats.map((stat) => (
                        <div
                            key={stat.label}
                            className="rounded-xl border border-gray-200 bg-white p-4 text-center dark:border-neutral-800 dark:bg-neutral-900"
                        >
                            <div className="text-2xl">{stat.icon}</div>
                            <p className="mt-1 text-sm font-bold">
                                {stat.value}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-neutral-500">
                                {stat.label}
                            </p>
                        </div>
                    ))}
                </motion.div>

                {/* Tabs */}
                <div className="mt-10 flex gap-2 border-b border-gray-200 dark:border-neutral-800">
                    {(["overview", "reviews", "cast"] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`relative px-4 py-3 text-sm font-semibold capitalize transition ${activeTab === tab
                                ? "text-red-600 dark:text-red-500"
                                : "text-gray-500 hover:text-gray-800 dark:text-neutral-500 dark:hover:text-neutral-300"
                                }`}
                        >
                            {tab === "reviews"
                                ? `Reviews (${reviews.length})`
                                : tab}
                            {activeTab === tab && (
                                <motion.div
                                    layoutId="tab-underline"
                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600"
                                />
                            )}
                        </button>
                    ))}
                </div>

                {/* Tab content */}
                <div className="mt-6 min-h-[200px]">
                    <AnimatePresence mode="wait">
                        {activeTab === "overview" && (
                            <motion.div
                                key="overview"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <p className="max-w-2xl text-base leading-relaxed text-gray-700 dark:text-neutral-300">
                                    {movie.description}
                                </p>

                                {similarMovies.length > 0 && (
                                    <div className="mt-10">
                                        <h2 className="mb-4 text-xl font-bold">
                                            More like this
                                        </h2>
                                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                                            {similarMovies.map((m) => (
                                                <Link
                                                    key={String(m._id)}
                                                    href={"/movies/" + String(m._id)}
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
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {activeTab === "reviews" && (
                            <motion.div
                                key="reviews"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                {averageUserRating && (
                                    <div className="mb-6 flex items-center gap-3 rounded-xl border border-yellow-400/30 bg-yellow-400/10 px-4 py-3">
                                        <span className="text-2xl font-black text-yellow-500">
                                            {averageUserRating}
                                        </span>
                                        <div>
                                            <div className="flex">
                                                {[1, 2, 3, 4, 5].map((s) => (
                                                    <span
                                                        key={s}
                                                        className={
                                                            s <=
                                                                Math.round(
                                                                    Number(
                                                                        averageUserRating
                                                                    )
                                                                )
                                                                ? "text-yellow-400"
                                                                : "text-gray-300 dark:text-neutral-700"
                                                        }
                                                    >
                                                        ★
                                                    </span>
                                                ))}
                                            </div>
                                            <p className="text-xs text-gray-500 dark:text-neutral-500">
                                                Based on {reviews.length}{" "}
                                                review
                                                {reviews.length !== 1 && "s"}
                                            </p>
                                        </div>
                                    </div>
                                )}

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
                                        onChange={(e) =>
                                            setReviewName(e.target.value)
                                        }
                                        placeholder="Your name"
                                        className="mb-3 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm outline-none focus:border-red-600 dark:border-neutral-700"
                                    />

                                    <textarea
                                        value={reviewComment}
                                        onChange={(e) =>
                                            setReviewComment(e.target.value)
                                        }
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

                                <div className="mt-6 space-y-4">
                                    {reviews.length === 0 && (
                                        <p className="text-sm text-gray-500 dark:text-neutral-500">
                                            No reviews yet. Be the first to
                                            share your thoughts!
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
                        )}

                        {activeTab === "cast" && (
                            <motion.div
                                key="cast"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5"
                            >
                                {mockCast.map((actor) => (
                                    <div
                                        key={actor.name}
                                        className="rounded-xl border border-gray-200 bg-white p-4 text-center dark:border-neutral-800 dark:bg-neutral-900"
                                    >
                                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-red-500/20 to-purple-500/20 text-3xl">
                                            {actor.emoji}
                                        </div>
                                        <p className="mt-3 text-sm font-semibold">
                                            {actor.name}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-neutral-500">
                                            {actor.role}
                                        </p>
                                    </div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </main>
    );
}