import React, { useState, useMemo } from "react";
import Link from "next/link";
import Pagination from "@/UI/Pagination";

interface TrendingMovie {
  rank: number;
  title: string;
  views: string;
  rating: number;
  poster: string;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      <svg className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
      <span className="text-xs font-semibold text-zinc-300">{Number(rating || 0).toFixed(1)}</span>
    </div>
  );
}

export default function TrendingMoviesTable({ movies }: { movies: TrendingMovie[] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const totalPages = Math.ceil((movies?.length || 0) / pageSize) || 1;
  const paginatedMovies = useMemo(() => {
    if (!Array.isArray(movies)) return [];
    const start = (currentPage - 1) * pageSize;
    return movies.slice(start, start + pageSize);
  }, [movies, currentPage, pageSize]);

  return (
    <div className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 rounded-2xl p-6 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-base font-bold text-zinc-100">Top Trending</h3>
            <p className="text-sm text-zinc-500 mt-0.5">Most viewed this month</p>
          </div>
          <Link
            href="/admin/movieControl"
            className="text-xs font-semibold text-rose-500 hover:text-rose-400 transition-colors"
          >
            View All →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800/60">
                <th className="text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider pb-3 pr-2 w-8">#</th>
                <th className="text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider pb-3 pr-4">Movie</th>
                <th className="text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider pb-3 pr-4 hidden sm:table-cell">Views</th>
                <th className="text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider pb-3">Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/40">
              {paginatedMovies.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-zinc-500 text-xs">
                    No trending movies data available.
                  </td>
                </tr>
              ) : (
                paginatedMovies.map((movie, idx) => (
                  <tr key={movie.title || idx} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="py-3 pr-2">
                      <span className={`text-sm font-bold ${movie.rank <= 3 ? "text-rose-500" : "text-zinc-500"}`}>
                        {movie.rank || (currentPage - 1) * pageSize + idx + 1}
                      </span>
                    </td>
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={movie.poster}
                          alt={movie.title}
                          className="w-9 h-12 rounded-md object-cover border border-zinc-800 shrink-0"
                        />
                        <span className="text-sm font-semibold text-zinc-200 truncate max-w-[160px] sm:max-w-xs">
                          {movie.title}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 pr-4 hidden sm:table-cell">
                      <span className="text-sm text-zinc-400 font-medium">{movie.views || "20K"}</span>
                    </td>
                    <td className="py-3">
                      <StarRating rating={movie.rating || 5} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="mt-4 border-t border-zinc-800/60 pt-2">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(p) => setCurrentPage(p)}
            totalItems={movies.length}
            pageSize={pageSize}
            showSummary={true}
            itemName="trending"
          />
        </div>
      )}
    </div>
  );
}