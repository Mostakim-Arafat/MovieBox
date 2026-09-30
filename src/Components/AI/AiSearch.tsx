"use client";

/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Film, Loader2, Sparkles } from "lucide-react";

type MovieResult = {
  _id: string;
  title: string;
  poster?: string;
  year?: number;
  genre?: string[];
  description?: string;
};

export default function AiSearch({ onResults }: { onResults?: (movies: MovieResult[]) => void }) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [movies, setMovies] = useState<MovieResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError("");
    setHasSearched(false);
    try {
      const res = await fetch("/api/ai/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Search failed. Please try again.");
      }

      const results: MovieResult[] = Array.isArray(data.movies) ? data.movies : [];
      setMovies(results);
      setHasSearched(true);
      onResults?.(results);
    } catch (err) {
      console.error("Search failed:", err);
      setError(err instanceof Error ? err.message : "Search failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto w-full max-w-6xl px-5 py-10 text-white sm:px-8">
      <form onSubmit={handleSearch} className="relative mx-auto w-full max-w-xl">
        <div className="relative flex items-center">
          <span className="absolute left-4 text-purple-400">
            <Sparkles className="h-5 w-5" />
          </span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask AI: e.g., sea beach tour"
            aria-label="Search movies"
            className="w-full rounded-full border border-gray-700 bg-gray-900 py-3 pl-12 pr-28 text-white shadow-lg placeholder:text-gray-400 focus:border-purple-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="absolute right-2 flex items-center gap-2 rounded-full bg-linear-to-r from-purple-600 to-indigo-600 px-5 py-2 font-medium text-white transition hover:opacity-90 disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
          </button>
        </div>
      </form>

      {loading && (
        <p className="mt-8 flex items-center justify-center gap-2 text-sm text-neutral-400" role="status">
          <Loader2 className="h-4 w-4 animate-spin" /> Finding matching movies...
        </p>
      )}
      {error && <p className="mt-6 text-center text-sm text-red-400" role="alert">{error}</p>}
      {hasSearched && !loading && !error && movies.length === 0 && (
        <p className="mt-8 text-center text-sm text-neutral-400">No matching movies found.</p>
      )}

      {hasSearched && movies.length > 0 && (
        <div className="mt-10">
          <h2 className="mb-4 text-lg font-semibold">Matching movies</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {movies.map((movie) => (
              <Link
                key={movie._id}
                href={`/movies/${movie._id}`}
                className="group flex min-h-40 overflow-hidden rounded-lg border border-white/10 bg-neutral-900 transition-colors hover:border-purple-400/60"
              >
                {movie.poster ? (
                  <img src={movie.poster} alt="" className="h-40 w-28 shrink-0 object-cover" />
                ) : (
                  <div className="flex h-40 w-28 shrink-0 items-center justify-center bg-neutral-800 text-neutral-500">
                    <Film className="h-8 w-8" />
                  </div>
                )}
                <div className="flex min-w-0 flex-1 flex-col p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="line-clamp-2 font-semibold text-white">{movie.title}</h3>
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-neutral-500 transition-colors group-hover:text-purple-300" />
                  </div>
                  <p className="mt-1 text-xs text-neutral-400">
                    {[movie.year, movie.genre?.join(" · ")].filter(Boolean).join(" · ")}
                  </p>
                  {movie.description && (
                    <p className="mt-3 line-clamp-3 text-sm leading-5 text-neutral-300">
                      {movie.description}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}