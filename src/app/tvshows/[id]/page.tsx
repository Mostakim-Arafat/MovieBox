"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

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

// Generate mock episode list distributed evenly across seasons
function generateEpisodesBySeason(totalEpisodes: number, seasons: number) {
    const perSeason = Math.floor(totalEpisodes / seasons);
    const remainder = totalEpisodes % seasons;
    const result: { season: number; episodes: number[] }[] = [];

    for (let s = 1; s <= seasons; s++) {
        const count = perSeason + (s <= remainder ? 1 : 0);
        result.push({
            season: s,
            episodes: Array.from({ length: count }, (_, i) => i + 1),
        });
    }
    return result;
}

export default function TvShowDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const [show, setShow] = useState<Show | null>(null);
    const [allShows, setAllShows] = useState<Show[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    // Fixed type declaration syntax for activeTab
    const [activeTab, setActiveTab] = useState<"overview" | "episodes" | "cast">("overview");

    const [selectedSeason, setSelectedSeason] = useState(1);
    const [inList, setInList] = useState(false);

    useEffect(() => {
        fetch("/tvshows.json")
            .then((res) => res.json())
            .then((data: Show[]) => {
                setAllShows(data);
                const found = data.find(
                    (s) => String(s.id) === String(params.id)
                );
                if (found) {
                    setShow(found);
                } else {
                    setNotFound(true);
                }
                setIsLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setIsLoading(false);
            });

        const list = localStorage.getItem("mylist-tv");
        if (list) {
            const parsed: string[] = JSON.parse(list);
            setInList(parsed.includes(String(params.id)));
        }
    }, [params.id]);

    const toggleMyList = () => {
        const stored = localStorage.getItem("mylist-tv");
        let list: string[] = stored ? JSON.parse(stored) : [];
        const id = String(params.id);

        if (list.includes(id)) {
            list = list.filter((x) => x !== id);
            setInList(false);
        } else {
            list.push(id);
            setInList(true);
        }
        localStorage.setItem("mylist-tv", JSON.stringify(list));
    };

    if (isLoading) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-black">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-red-600 dark:border-neutral-800" />
            </main>
        );
    }

    if (notFound || !show) {
        return (
            <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 text-center text-gray-900 dark:bg-black dark:text-white">
                <span className="text-5xl">📺</span>
                <h1 className="mt-4 text-2xl font-bold">Show not found</h1>
                <p className="mt-2 text-gray-500 dark:text-neutral-400">
                    We couldn&apos;t find the show you&apos;re looking for.
                </p>
                <button
                    onClick={() => router.push("/tvshows")}
                    className="mt-6 rounded-full bg-red-600 px-6 py-3 font-bold text-white transition hover:bg-red-700"
                >
                    Back to TV Shows
                </button>
            </main>
        );
    }

    const similarShows = allShows
        .filter(
            (s) =>
                s.id !== show.id && s.genre.some((g) => show.genre.includes(g))
        )
        .slice(0, 6);

    const seasonData = generateEpisodesBySeason(show.episodes, show.seasons);
    const currentSeasonEpisodes =
        seasonData.find((s) => s.season === selectedSeason)?.episodes || [];

    const infoStats = [
        { label: "Rating", value: show.rating + " / 10", icon: "⭐" },
        { label: "Seasons", value: String(show.seasons), icon: "📀" },
        { label: "Episodes", value: String(show.episodes), icon: "🎞" },
        { label: "Channel", value: show.channel, icon: "📡" },
    ];

    return (
        <main className="min-h-screen bg-gray-50 text-gray-900 dark:bg-black dark:text-white">
            {/* Hero banner */}
            <div className="relative h-[55vh] min-h-[360px] w-full overflow-hidden sm:h-[65vh]">
                <PosterImage
                    show={show}
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

                <div className="absolute bottom-0 left-0 right-0 px-4 pb-8 sm:px-8 lg:px-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="mb-3 flex flex-wrap gap-2">
                            {show.genre.map((g) => (
                                <span
                                    key={g}
                                    className="rounded-full border border-red-500/40 bg-red-500/20 px-3 py-1 text-xs font-semibold text-red-400 backdrop-blur-sm"
                                >
                                    {g}
                                </span>
                            ))}
                        </div>
                        <h1 className="max-w-2xl text-3xl font-black text-white drop-shadow-lg sm:text-5xl">
                            {show.title}
                        </h1>
                        <p className="mt-2 max-w-xl text-sm text-neutral-300 drop-shadow sm:text-base">
                            {show.shortDescription}
                        </p>
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
                    <button className="flex items-center gap-2 rounded-full bg-red-600 px-8 py-3 font-bold text-white shadow-lg shadow-red-600/20 transition hover:bg-red-700">
                        ▶ Watch Now
                    </button>
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
                    {(["overview", "episodes", "cast"] as const).map(
                        (tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`relative px-4 py-3 text-sm font-semibold capitalize transition ${activeTab === tab
                                    ? "text-red-600 dark:text-red-500"
                                    : "text-gray-500 hover:text-gray-800 dark:text-neutral-500 dark:hover:text-neutral-300"
                                    }`}
                            >
                                {tab}
                                {activeTab === tab && (
                                    <motion.div
                                        layoutId="tv-tab-underline"
                                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600"
                                    />
                                )}
                            </button>
                        )
                    )}
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
                                    {show.description}
                                </p>

                                {similarShows.length > 0 && (
                                    <div className="mt-10">
                                        <h2 className="mb-4 text-xl font-bold">
                                            More like this
                                        </h2>
                                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                                            {similarShows.map((s) => (
                                                <a
                                                    key={s.id}
                                                    href={"/tvshows/" + s.id}
                                                    className="group overflow-hidden rounded-lg"
                                                >
                                                    <PosterImage
                                                        show={s}
                                                        className="aspect-[2/3] w-full object-cover transition group-hover:scale-105"
                                                    />
                                                    <p className="mt-2 truncate text-sm font-medium">
                                                        {s.title}
                                                    </p>
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {activeTab === "episodes" && (
                            <motion.div
                                key="episodes"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                {/* Season selector */}
                                <div className="mb-5 flex gap-2 overflow-x-auto pb-2">
                                    {seasonData.map((s) => (
                                        <button
                                            key={s.season}
                                            onClick={() =>
                                                setSelectedSeason(s.season)
                                            }
                                            className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${selectedSeason === s.season
                                                ? "bg-red-600 text-white"
                                                : "border border-gray-300 text-gray-700 hover:border-gray-500 dark:border-neutral-700 dark:text-neutral-300"
                                                }`}
                                        >
                                            Season {s.season}
                                        </button>
                                    ))}
                                </div>

                                {/* Episode list */}
                                <div className="space-y-3">
                                    {currentSeasonEpisodes.map((ep) => (
                                        <div
                                            key={ep}
                                            className="flex items-center gap-4 rounded-xl border border-gray-200 p-4 dark:border-neutral-800 dark:bg-neutral-900"
                                        >
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-600/10 font-bold text-red-600 dark:text-red-500">
                                                {ep}
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-semibold">
                                                    Episode {ep}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-neutral-500">
                                                    ~45 min
                                                </p>
                                            </div>
                                            <button className="text-sm font-semibold text-red-600 dark:text-red-500">
                                                ▶ Play
                                            </button>
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
                                {["🎭", "🎬", "🎨", "🎥", "🌟"].map(
                                    (emoji, i) => (
                                        <div
                                            key={i}
                                            className="rounded-xl border border-gray-200 bg-white p-4 text-center dark:border-neutral-800 dark:bg-neutral-900"
                                        >
                                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-red-500/20 to-purple-500/20 text-3xl">
                                                {emoji}
                                            </div>
                                            <p className="mt-3 text-sm font-semibold">
                                                ast Member {i + 1}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-neutral-500">
                                                Main Role
                                            </p>
                                        </div>
                                    )
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </main>
    );
}