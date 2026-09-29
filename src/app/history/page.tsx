'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from '@/lib/auth-client';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

interface WatchHistoryEntry {
    _id: string;
    userEmail: string;
    movieId: string;
    title: string;
    poster: string;
    year: number | null;
    genre: string[];
    rating: number;
    duration: string;
    watchedAt: string;
}

function formatDate(dateStr: string) {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

function formatTime(dateStr: string) {
    const d = new Date(dateStr);
    return d.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
    });
}

function timeAgo(dateStr: string) {
    const now = new Date();
    const d = new Date(dateStr);
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return formatDate(dateStr);
}

// Group entries by date
function groupByDate(entries: WatchHistoryEntry[]) {
    const groups: { [key: string]: WatchHistoryEntry[] } = {};
    entries.forEach((entry) => {
        const date = formatDate(entry.watchedAt);
        if (!groups[date]) groups[date] = [];
        groups[date].push(entry);
    });
    return groups;
}

function PosterFallback({ title }: { title: string }) {
    return (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-rose-900/40 via-zinc-900 to-zinc-950">
            <span className="text-3xl opacity-40">🎬</span>
        </div>
    );
}

export default function WatchHistoryPage() {
    const { data: session, isPending: sessionLoading } = useSession();
    const [history, setHistory] = useState<WatchHistoryEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [clearing, setClearing] = useState(false);
    const [showClearConfirm, setShowClearConfirm] = useState(false);

    useEffect(() => {
        if (!session?.user?.email) {
            setLoading(false);
            return;
        }

        fetch(`/api/watch-history?email=${encodeURIComponent(session.user.email)}`)
            .then((res) => res.json())
            .then((data) => {
                setHistory(Array.isArray(data) ? data : []);
            })
            .catch((err) => {
                console.error('Failed to load watch history:', err);
            })
            .finally(() => setLoading(false));
    }, [session?.user?.email]);

    const handleClearHistory = async () => {
        if (!session?.user?.email) return;
        setClearing(true);
        try {
            await fetch(`/api/watch-history?email=${encodeURIComponent(session.user.email)}`, {
                method: 'DELETE',
            });
            setHistory([]);
        } catch (err) {
            console.error('Failed to clear history:', err);
        } finally {
            setClearing(false);
            setShowClearConfirm(false);
        }
    };

    if (sessionLoading || loading) {
        return (
            <main className="min-h-screen bg-zinc-950 text-white">
                <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
                    {/* Header skeleton */}
                    <div className="mb-10 animate-pulse">
                        <div className="h-8 w-48 rounded-lg bg-zinc-800" />
                        <div className="mt-2 h-4 w-72 rounded bg-zinc-800/60" />
                    </div>
                    {/* Card skeletons */}
                    <div className="space-y-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex gap-4 rounded-2xl border border-zinc-800/50 bg-zinc-900/50 p-4 animate-pulse">
                                <div className="h-28 w-20 shrink-0 rounded-xl bg-zinc-800" />
                                <div className="flex-1 space-y-3 py-1">
                                    <div className="h-5 w-2/3 rounded bg-zinc-800" />
                                    <div className="h-3 w-1/3 rounded bg-zinc-800/60" />
                                    <div className="h-3 w-1/2 rounded bg-zinc-800/60" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        );
    }

    if (!session?.user) {
        return (
            <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 px-4 text-center text-white">
                <div className="rounded-3xl border border-zinc-800 bg-zinc-900/80 p-10 backdrop-blur-sm max-w-md">
                    <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-rose-500/10">
                        <span className="text-4xl">🔒</span>
                    </div>
                    <h1 className="text-2xl font-bold">Sign in Required</h1>
                    <p className="mt-3 text-sm text-zinc-400 leading-relaxed">
                        Please sign in to view your watch history and keep track of the movies you&apos;ve watched.
                    </p>
                    <Link
                        href="/login"
                        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-rose-600 px-6 py-3 font-semibold text-white transition hover:bg-rose-700"
                    >
                        Sign In →
                    </Link>
                </div>
            </main>
        );
    }

    const grouped = groupByDate(history);
    const dateKeys = Object.keys(grouped);

    return (
        <main className="min-h-screen bg-zinc-950 text-white">
            {/* Ambient gradient */}
            <div className="pointer-events-none fixed inset-0 overflow-hidden">
                <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-rose-600/5 blur-3xl" />
                <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-purple-600/5 blur-3xl" />
            </div>

            <div className="relative mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-10"
                >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 text-lg">
                                    🕐
                                </div>
                                <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
                                    Watch History
                                </h1>
                            </div>
                            <p className="mt-2 text-sm text-zinc-400">
                                {history.length > 0
                                    ? `${history.length} movie${history.length !== 1 ? 's' : ''} watched · ${session.user.email}`
                                    : `No movies watched yet · ${session.user.email}`}
                            </p>
                        </div>

                        {history.length > 0 && (
                            <button
                                onClick={() => setShowClearConfirm(true)}
                                className="inline-flex items-center gap-2 rounded-xl border border-zinc-800 px-4 py-2.5 text-sm font-medium text-zinc-400 transition hover:border-rose-500/30 hover:text-rose-400 hover:bg-rose-500/5"
                            >
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                </svg>
                                Clear All
                            </button>
                        )}
                    </div>
                </motion.div>

                {/* Empty state */}
                {history.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-col items-center justify-center rounded-3xl border border-zinc-800/50 bg-zinc-900/30 px-6 py-20 text-center"
                    >
                        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-rose-500/10 to-purple-500/10">
                            <span className="text-5xl">🍿</span>
                        </div>
                        <h2 className="text-xl font-bold">No watch history yet</h2>
                        <p className="mt-2 max-w-sm text-sm text-zinc-500">
                            Start watching movies and they&apos;ll appear here. Click &ldquo;Watch Now&rdquo; on any movie to begin!
                        </p>
                        <Link
                            href="/movies"
                            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-rose-600 px-6 py-3 font-semibold text-white transition hover:bg-rose-700"
                        >
                            <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                            Browse Movies
                        </Link>
                    </motion.div>
                )}

                {/* History grouped by date */}
                <div className="space-y-8">
                    {dateKeys.map((date, groupIdx) => (
                        <motion.div
                            key={date}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: groupIdx * 0.08 }}
                        >
                            {/* Date label */}
                            <div className="mb-4 flex items-center gap-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-800/80 text-xs font-bold text-zinc-300">
                                    📅
                                </div>
                                <h3 className="text-sm font-semibold text-zinc-300">{date}</h3>
                                <div className="h-px flex-1 bg-zinc-800/50" />
                                <span className="text-xs text-zinc-600">
                                    {grouped[date].length} movie{grouped[date].length !== 1 ? 's' : ''}
                                </span>
                            </div>

                            {/* Movie cards */}
                            <div className="space-y-3">
                                {grouped[date].map((entry, idx) => (
                                    <HistoryCard key={entry._id || idx} entry={entry} index={idx} />
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Clear confirmation modal */}
            <AnimatePresence>
                {showClearConfirm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="w-full max-w-sm rounded-2xl border border-zinc-800 bg-zinc-900 p-6 text-center"
                        >
                            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/10 text-2xl">
                                🗑️
                            </div>
                            <h3 className="text-lg font-bold">Clear Watch History?</h3>
                            <p className="mt-2 text-sm text-zinc-400">
                                This will permanently delete all {history.length} entries from your watch history.
                            </p>
                            <div className="mt-6 flex gap-3">
                                <button
                                    onClick={() => setShowClearConfirm(false)}
                                    className="flex-1 rounded-xl border border-zinc-700 py-2.5 text-sm font-semibold text-zinc-300 transition hover:bg-zinc-800"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleClearHistory}
                                    disabled={clearing}
                                    className="flex-1 rounded-xl bg-rose-600 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:opacity-50"
                                >
                                    {clearing ? 'Clearing...' : 'Clear All'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}

function HistoryCard({ entry, index }: { entry: WatchHistoryEntry; index: number }) {
    const [imgError, setImgError] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
        >
            <Link
                href={`/movies/${entry.movieId}`}
                className="group flex gap-4 rounded-2xl border border-zinc-800/50 bg-zinc-900/40 p-3 sm:p-4 transition-all hover:border-zinc-700/60 hover:bg-zinc-900/70 hover:shadow-lg hover:shadow-rose-950/10"
            >
                {/* Poster */}
                <div className="relative h-28 w-20 shrink-0 overflow-hidden rounded-xl bg-zinc-800 sm:h-32 sm:w-[90px]">
                    {imgError || !entry.poster ? (
                        <PosterFallback title={entry.title} />
                    ) : (
                        <img
                            src={entry.poster}
                            alt={entry.title}
                            onError={() => setImgError(true)}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                    )}
                    {/* Play overlay on hover */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all group-hover:bg-black/40">
                        <svg
                            className="h-8 w-8 fill-white opacity-0 transition-opacity group-hover:opacity-100"
                            viewBox="0 0 24 24"
                        >
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    </div>
                </div>

                {/* Info */}
                <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
                    <div>
                        <h4 className="truncate text-base font-bold text-zinc-100 transition group-hover:text-white sm:text-lg">
                            {entry.title}
                        </h4>
                        <div className="mt-1.5 flex flex-wrap items-center gap-2">
                            {entry.year && (
                                <span className="rounded-md bg-zinc-800/80 px-2 py-0.5 text-xs font-medium text-zinc-400">
                                    {entry.year}
                                </span>
                            )}
                            {entry.rating > 0 && (
                                <span className="flex items-center gap-1 rounded-md bg-amber-500/10 px-2 py-0.5 text-xs font-semibold text-amber-400">
                                    ★ {entry.rating}
                                </span>
                            )}
                            {entry.duration && (
                                <span className="text-xs text-zinc-500">{entry.duration}</span>
                            )}
                        </div>
                        {entry.genre && entry.genre.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1.5">
                                {entry.genre.slice(0, 3).map((g) => (
                                    <span
                                        key={g}
                                        className="rounded-full border border-rose-500/20 bg-rose-500/5 px-2.5 py-0.5 text-[10px] font-medium text-rose-400"
                                    >
                                        {g}
                                    </span>
                                ))}
                                {entry.genre.length > 3 && (
                                    <span className="text-[10px] text-zinc-600">+{entry.genre.length - 3} more</span>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Timestamp */}
                    <div className="mt-2 flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-rose-500/60" />
                        <span className="text-xs text-zinc-500">
                            Watched {timeAgo(entry.watchedAt)}
                        </span>
                        <span className="text-[10px] text-zinc-600">
                            · {formatTime(entry.watchedAt)}
                        </span>
                    </div>
                </div>

                {/* Arrow */}
                <div className="flex items-center">
                    <svg
                        className="h-5 w-5 text-zinc-700 transition group-hover:text-zinc-400 group-hover:translate-x-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                </div>
            </Link>
        </motion.div>
    );
}
