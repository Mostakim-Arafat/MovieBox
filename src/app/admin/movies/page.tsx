"use client";

import React, { useState } from "react";
import Link from "next/link";

interface MovieItem {
  id: string;
  title: string;
  year: number;
  duration: string;
  rating: string;
  genres: string[];
  status: "Published" | "Draft" | "Scheduled";
  views: string;
  posterUrl: string;
}

const INITIAL_MOVIES: MovieItem[] = [
  {
    id: "mov-1",
    title: "Cocktail 2",
    year: 2026,
    duration: "2h 14m",
    rating: "PG-13",
    genres: ["Drama", "Comedy", "Romance"],
    status: "Published",
    views: "1.2M",
    posterUrl: "https://images.unsplash.com/photo-1542204172-e7052809f852?q=80&w=200",
  },
  {
    id: "mov-2",
    title: "Detective Conan: The Phantom Code",
    year: 2026,
    duration: "1h 50m",
    rating: "PG-13",
    genres: ["Animation", "Mystery", "Crime"],
    status: "Published",
    views: "985K",
    posterUrl: "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=200",
  },
  {
    id: "mov-3",
    title: "Musafir Cafe",
    year: 2025,
    duration: "2h 05m",
    rating: "PG",
    genres: ["Drama", "Adventure"],
    status: "Published",
    views: "876K",
    posterUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=200",
  },
  {
    id: "mov-4",
    title: "Lock Upp",
    year: 2025,
    duration: "1h 42m",
    rating: "TV-MA",
    genres: ["Horror", "Thriller"],
    status: "Published",
    views: "764K",
    posterUrl: "https://images.unsplash.com/photo-1505635552518-3448ff116af3?q=80&w=200",
  },
  {
    id: "mov-5",
    title: "Operation Safed Sagar",
    year: 2026,
    duration: "2h 28m",
    rating: "R",
    genres: ["Action", "Thriller"],
    status: "Published",
    views: "651K",
    posterUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=200",
  },
  {
    id: "mov-6",
    title: "Shadows in the Deep",
    year: 2026,
    duration: "2h 10m",
    rating: "PG-13",
    genres: ["Sci-Fi", "Action"],
    status: "Draft",
    views: "—",
    posterUrl: "https://images.unsplash.com/photo-1635805737707-575885ab0820?q=80&w=200",
  },
];

export default function AdminMoviesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterGenre, setFilterGenre] = useState("All");

  const filteredMovies = INITIAL_MOVIES.filter((movie) => {
    const matchesSearch = movie.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = filterGenre === "All" || movie.genres.includes(filterGenre);
    return matchesSearch && matchesGenre;
  });

  return (
    <div className="space-y-6">
      {/* Header & Upload Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100 tracking-tight">Movie Catalog</h1>
          <p className="text-sm text-zinc-400 mt-1">
            Manage movie listings, video streams, and catalog entries.
          </p>
        </div>
        <Link
          href="/admin/movies/upload"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold shadow-md shadow-rose-900/30 transition-all active:scale-95 cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Upload Movie
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 p-3 rounded-xl">
        <div className="relative flex-1 w-full">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search movie titles..."
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-9 pr-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-rose-500"
          />
        </div>

        <select
          value={filterGenre}
          onChange={(e) => setFilterGenre(e.target.value)}
          className="w-full sm:w-48 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-rose-500"
        >
          <option value="All">All Genres</option>
          <option value="Action">Action</option>
          <option value="Animation">Animation</option>
          <option value="Comedy">Comedy</option>
          <option value="Drama">Drama</option>
          <option value="Horror">Horror</option>
          <option value="Mystery">Mystery</option>
          <option value="Sci-Fi">Sci-Fi</option>
          <option value="Thriller">Thriller</option>
        </select>
      </div>

      {/* Movies Table */}
      <div className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-950/60 border-b border-zinc-800/80 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Movie</th>
                <th className="py-3.5 px-4">Year</th>
                <th className="py-3.5 px-4 hidden md:table-cell">Duration</th>
                <th className="py-3.5 px-4 hidden sm:table-cell">Rating</th>
                <th className="py-3.5 px-4 hidden lg:table-cell">Genres</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/40">
              {filteredMovies.map((movie) => (
                <tr key={movie.id} className="hover:bg-zinc-800/20 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={movie.posterUrl}
                        alt={movie.title}
                        className="w-10 h-14 rounded-md object-cover border border-zinc-800 shrink-0"
                      />
                      <div>
                        <p className="font-semibold text-zinc-200">{movie.title}</p>
                        <p className="text-xs text-zinc-500">{movie.views} views</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-zinc-400">{movie.year}</td>
                  <td className="py-3 px-4 text-zinc-400 hidden md:table-cell">{movie.duration}</td>
                  <td className="py-3 px-4 hidden sm:table-cell">
                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-zinc-800 text-zinc-300 border border-zinc-700">
                      {movie.rating}
                    </span>
                  </td>
                  <td className="py-3 px-4 hidden lg:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {movie.genres.map((g) => (
                        <span key={g} className="px-2 py-0.5 rounded text-[11px] bg-zinc-800/60 text-zinc-400">
                          {g}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                        movie.status === "Published"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : movie.status === "Draft"
                          ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                          : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                      }`}
                    >
                      {movie.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href="/admin/movies/upload"
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
                        title="Edit movie"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}