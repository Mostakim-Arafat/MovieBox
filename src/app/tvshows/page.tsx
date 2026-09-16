"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

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
}: {
    genre: string;
    shows: Show[];
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
            <h2 className="mb-4 text-xl font-bold tracking-tight sm:text-2xl">
                {genre}
            </h2>

            <div
                ref={rowRef}
                onMouseDown={handleMouseDown}
                onMouseUp={stopDragging}
                onMouseLeave={stopDragging}
                onMouseMove={handleMouseMove}
                className="scrollbar-hide flex cursor-grab gap-3 overflow-x-auto pb-3 select-none"
            >
                {shows.map((show) => (
                    <motion.a
                        key={show.id}
                        href={"/tvshows/" + show.id}
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
                    </motion.a>
                ))}
            </div>
        </div>
    );
}

export default function TvShowsPage() {
    const [shows, setShows] = useState<Show[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetch("/tvshows.json")
            .then((res) => res.json())
            .then((data: Show[]) => {
                setShows(data);
                setIsLoading(false);
            })
            .catch((err) => console.error(err));
    }, []);

    const genreMap: Record<string, Show[]> = {};
    shows.forEach((show) => {
        show.genre.forEach((g) => {
            if (!genreMap[g]) genreMap[g] = [];
            genreMap[g].push(show);
        });
    });
    const genreOrder = Object.keys(genreMap);
    const featured = shows[0];

    return (
        <main className="min-h-screen bg-black text-white">
            {isLoading ? (
                <div className="flex min-h-screen items-center justify-center">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-neutral-800 border-t-red-600" />
                </div>
            ) : (
                <>
                    {/* Hero / Featured Banner */}
                    {featured && (
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
                                    <a
                                        href={"/tvshows/" + featured.id}
                                        className="flex items-center gap-2 rounded-lg bg-white px-6 py-3 font-bold text-black transition hover:bg-neutral-200"
                                    >
                                        Play
                                    </a>

                                    <a
                                        href={"/tvshows/" + featured.id}
                                        className="flex items-center gap-2 rounded-lg bg-white/15 px-6 py-3 font-bold text-white backdrop-blur-sm transition hover:bg-white/25"
                                    >
                                        More Info
                                    </a>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Genre Rows */}
                    <div className="relative z-10 -mt-8 px-4 pb-16 sm:px-8 lg:px-12">
                        {genreOrder.map((genre) => (
                            <ShowRow
                                key={genre}
                                genre={genre}
                                shows={genreMap[genre]}
                            />
                        ))}
                    </div>
                </>
            )}
        </main>
    );
}