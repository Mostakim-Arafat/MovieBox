"use client";

/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Film, Loader2, Search, Sparkles } from "lucide-react";

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
    <section className="relative isolate overflow-hidden border-b border-rose-950/70 bg-[linear-gradient(115deg,#09090b_0%,#14090d_48%,#09090b_100%)] px-5 py-12 text-white sm:px-8 sm:py-16">
      <div className="mx-auto w-full max-w-6xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-3 flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-rose-400">
            <Sparkles className="h-4 w-4" /> Moviebox discovery
          </p>
          <h2 className="text-2xl font-bold text-white sm:text-3xl">Find your next favorite</h2>
          <p className="mt-2 text-sm text-zinc-400">Search by title, story</p>

          <form onSubmit={handleSearch} className="mx-auto mt-7 w-full max-w-2xl">
            <div className="flex min-w-0 items-center gap-2 rounded-xl border border-zinc-700 bg-black/70 p-1.5 shadow-xl shadow-black/30 transition-colors focus-within:border-rose-500/80 focus-within:ring-2 focus-within:ring-rose-500/15">
              <Search className="ml-3 h-5 w-5 shrink-0 text-rose-400" aria-hidden="true" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Try: a tense sci-fi movie set in space"
                aria-label="Search movies by title, story, mood, or genre"
                className="h-11 min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-zinc-500"
              />
              <button
                type="submit"
                disabled={loading || !query.trim()}
                className="flex h-10 shrink-0 items-center gap-2 rounded-lg bg-rose-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-rose-500 disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-400"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
              </button>
            </div>
          </form>
        </div>

        {loading && (
          <p className="mt-8 flex items-center justify-center gap-2 text-sm text-zinc-400" role="status">
            <Loader2 className="h-4 w-4 animate-spin text-rose-400" /> Finding matching movies...
          </p>
        )}
        {error && <p className="mt-6 text-center text-sm text-rose-300" role="alert">{error}</p>}
        {hasSearched && !loading && !error && movies.length === 0 && (
          <p className="mt-8 text-center text-sm text-zinc-400">No matching movies found.</p>
        )}

        {hasSearched && movies.length > 0 && (
          <div className="mt-10">
            <h3 className="mb-4 text-lg font-semibold text-white">Matching movies</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {movies.map((movie) => (
                <Link
                  key={movie._id}
                  href={`/movies/${movie._id}`}
                  className="group flex min-h-40 overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950/80 transition-colors hover:border-rose-700"
                >
                  {movie.poster ? (
                    <img src={movie.poster} alt="" className="h-40 w-28 shrink-0 object-cover" />
                  ) : (
                    <div className="flex h-40 w-28 shrink-0 items-center justify-center bg-zinc-900 text-zinc-600">
                      <Film className="h-8 w-8" />
                    </div>
                  )}
                  <div className="flex min-w-0 flex-1 flex-col p-4">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="line-clamp-2 font-semibold text-white">{movie.title}</h4>
                      <ArrowUpRight className="h-4 w-4 shrink-0 text-zinc-500 transition-colors group-hover:text-rose-400" />
                    </div>
                    <p className="mt-1 text-xs text-zinc-400">
                      {[movie.year, movie.genre?.join(" · ")].filter(Boolean).join(" · ")}
                    </p>
                    {movie.description && (
                      <p className="mt-3 line-clamp-3 text-sm leading-5 text-zinc-300">
                        {movie.description}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}