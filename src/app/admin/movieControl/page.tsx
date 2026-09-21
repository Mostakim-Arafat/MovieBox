'use client';

import React, { useEffect, useState, useMemo } from "react";
import { Search, Filter, ArrowUpDown, X } from "lucide-react";
import Pagination from "@/UI/Pagination";

interface Movie {
  id?: string | number;
  _id?: string | number;
  title: string;
  poster: string;
  year: number;
  genre: string[];
  rating: number;
  duration: string;
  description: string;
}

export default function MovieListAdmin() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Search, filter, sorting, and pagination state
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedGenre, setSelectedGenre] = useState<string>("All");
  const [sortBy, setSortBy] = useState<"title" | "year" | "rating">("title");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch('/api/movies');
        const data = await response.json();
        setMovies(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch movies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  // Collect unique genres
  const allGenres = useMemo(() => {
    const genres = new Set<string>();
    movies.forEach((m) => {
      if (Array.isArray(m.genre)) {
        m.genre.forEach((g) => genres.add(g));
      }
    });
    return ["All", ...Array.from(genres).sort()];
  }, [movies]);

  // Filter and sort movies
  const filteredMovies = useMemo(() => {
    let list = [...movies];

    if (selectedGenre !== "All") {
      list = list.filter((m) =>
        Array.isArray(m.genre) &&
        m.genre.some((g) => g.toLowerCase() === selectedGenre.toLowerCase())
      );
    }

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          String(m.year).includes(q) ||
          (Array.isArray(m.genre) && m.genre.some((g) => g.toLowerCase().includes(q)))
      );
    }

    list.sort((a, b) => {
      if (sortBy === "title") return a.title.localeCompare(b.title);
      if (sortBy === "year") return (b.year || 0) - (a.year || 0);
      if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
      return 0;
    });

    return list;
  }, [movies, selectedGenre, searchTerm, sortBy]);

  const totalPages = Math.ceil(filteredMovies.length / pageSize) || 1;
  const paginatedMovies = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredMovies.slice(start, start + pageSize);
  }, [filteredMovies, currentPage, pageSize]);

  const handleDelete = (id?: string | number) => {
    const _id = id;
    console.log("Delete movie:", _id);
  };

  const handleEdit = (movie: Movie) => {
    const _movie = movie;
    console.log("Edit movie:", _movie);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 text-zinc-400 bg-zinc-950 min-h-screen">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-700 border-t-rose-500" />
          <p className="text-sm">Loading catalog...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 p-6 bg-zinc-950 min-h-screen text-zinc-100">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Movie Catalog Management</h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Manage, edit, or remove titles from your streaming library.
          </p>
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search box */}
          <div className="relative flex-1 sm:w-56">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search catalog..."
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-8 py-2 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-rose-500 transition-colors"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm("");
                  setCurrentPage(1);
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Genre filter dropdown */}
          <div className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-300">
            <Filter className="w-3.5 h-3.5 text-zinc-500" />
            <select
              value={selectedGenre}
              onChange={(e) => {
                setSelectedGenre(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-transparent text-xs text-zinc-200 focus:outline-none cursor-pointer"
            >
              {allGenres.map((g) => (
                <option key={g} value={g} className="bg-zinc-900 text-zinc-200">
                  {g === "All" ? "All Genres" : g}
                </option>
              ))}
            </select>
          </div>

          {/* Sort dropdown */}
          <div className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-300">
            <ArrowUpDown className="w-3.5 h-3.5 text-zinc-500" />
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value as "title" | "year" | "rating");
                setCurrentPage(1);
              }}
              className="bg-transparent text-xs text-zinc-200 focus:outline-none cursor-pointer"
            >
              <option value="title" className="bg-zinc-900">Title (A-Z)</option>
              <option value="year" className="bg-zinc-900">Year (Newest)</option>
              <option value="rating" className="bg-zinc-900">Rating (High-Low)</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Table Container */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
        {filteredMovies.length === 0 ? (
          <div className="p-12 text-center text-zinc-500">
            <p className="text-3xl mb-2">🎬</p>
            <p className="text-sm font-medium text-zinc-400">No movies found</p>
            <p className="text-xs text-zinc-600 mt-1">
              {searchTerm || selectedGenre !== "All"
                ? "Try adjusting your search criteria or genre filter."
                : "No movies in database."}
            </p>
          </div>
        ) : (
          <>
            <div className="divide-y divide-zinc-800/70">
              {paginatedMovies.map((movie) => {
                const movieId = movie.id || movie._id;
                return (
                  <div 
                    key={String(movieId || movie.title)} 
                    className="flex items-center justify-between p-4 hover:bg-zinc-800/40 transition-colors gap-4"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <img 
                        src={movie.poster} 
                        alt={movie.title} 
                        className="w-12 h-16 object-cover rounded-lg bg-zinc-800 shrink-0 border border-zinc-800" 
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-sm text-zinc-200 truncate">{movie.title}</p>
                          <span className="text-xs text-zinc-500">({movie.year})</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                          <span className="text-xs px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-500 font-medium">
                            ★ {movie.rating}
                          </span>
                          <span className="text-xs text-zinc-400">{movie.duration}</span>
                          <span className="text-xs text-zinc-500">
                            {movie.genre?.join(", ")}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleEdit(movie)}
                        title="Edit movie"
                        className="p-2 rounded-xl bg-zinc-800/60 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-all cursor-pointer"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.862 4.487zm0 0L19.5 7.125" />
                        </svg>
                      </button>

                      <button
                        onClick={() => handleDelete(movieId)}
                        title="Delete movie"
                        className="p-2 rounded-xl bg-zinc-800/60 text-zinc-400 hover:text-rose-500 hover:bg-rose-500/10 transition-all cursor-pointer"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination Footer */}
            <div className="border-t border-zinc-800/70 px-4 bg-zinc-900/40">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(p) => setCurrentPage(p)}
                totalItems={filteredMovies.length}
                pageSize={pageSize}
                pageSizeOptions={[10, 25, 50]}
                onPageSizeChange={(sz) => {
                  setPageSize(sz);
                  setCurrentPage(1);
                }}
                showPageSize={true}
                showSummary={true}
                itemName="movies"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}