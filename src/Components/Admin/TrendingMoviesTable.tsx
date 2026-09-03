import React from "react";

interface TrendingMovie {
  rank: number;
  title: string;
  views: string;
  rating: number;
  imageUrl: string;
}

const trendingMovies: TrendingMovie[] = [
  { rank: 1, title: "Cocktail 2", views: "1.2M", rating: 4.8, imageUrl: "https://images.unsplash.com/photo-1542204172-e7052809f852?q=80&w=100" },
  { rank: 2, title: "Detective Conan", views: "985K", rating: 4.7, imageUrl: "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=100" },
  { rank: 3, title: "Musafir Cafe", views: "876K", rating: 4.5, imageUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=100" },
  { rank: 4, title: "Lock Upp", views: "764K", rating: 4.3, imageUrl: "https://images.unsplash.com/photo-1505635552518-3448ff116af3?q=80&w=100" },
  { rank: 5, title: "Operation Safed Sagar", views: "651K", rating: 4.6, imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=100" },
  { rank: 6, title: "The Last House", views: "542K", rating: 4.2, imageUrl: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?q=80&w=100" },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      <svg className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
      <span className="text-xs font-semibold text-zinc-300">{rating.toFixed(1)}</span>
    </div>
  );
}

export default function TrendingMoviesTable() {
  return (
    <div className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-base font-bold text-zinc-100">Top Trending</h3>
          <p className="text-sm text-zinc-500 mt-0.5">Most viewed this month</p>
        </div>
        <button className="text-xs font-semibold text-rose-500 hover:text-rose-400 transition-colors cursor-pointer">
          View All →
        </button>
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
            {trendingMovies.map((movie) => (
              <tr key={movie.rank} className="hover:bg-zinc-800/30 transition-colors">
                <td className="py-3 pr-2">
                  <span className={`text-sm font-bold ${movie.rank <= 3 ? "text-rose-500" : "text-zinc-500"}`}>
                    {movie.rank}
                  </span>
                </td>
                <td className="py-3 pr-4">
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={movie.imageUrl}
                      alt={movie.title}
                      className="w-9 h-12 rounded-md object-cover border border-zinc-800 shrink-0"
                    />
                    <span className="text-sm font-semibold text-zinc-200 truncate">{movie.title}</span>
                  </div>
                </td>
                <td className="py-3 pr-4 hidden sm:table-cell">
                  <span className="text-sm text-zinc-400 font-medium">{movie.views}</span>
                </td>
                <td className="py-3">
                  <StarRating rating={movie.rating} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}