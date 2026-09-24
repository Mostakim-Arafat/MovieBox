'use client';

import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

interface Movie {
  id: string | number;
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
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | number | null>(null);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/movies");
      const data = await response.json();
      // Map MongoDB _id to id for consistent usage in the UI
      const mapped = (Array.isArray(data) ? data : []).map((m: any) => ({
        ...m,
        id: m._id || m.id,
      }));
      setMovies(mapped);
    } catch (error) {
      console.error("Failed to fetch movies:", error);
      toast.error("Failed to load movies");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string | number) => {
    setDeleteConfirmId(null);
    const deleteToast = toast.loading("Deleting movie...");

    try {
      const res = await fetch(
        "/api/movies?id=" + id,
        { method: "DELETE" }
      );

      if (!res.ok) throw new Error("Delete failed");

      setMovies((prev) => prev.filter((m) => m.id !== id));
      toast.success("Movie deleted successfully", { id: deleteToast });
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete movie", { id: deleteToast });
    }
  };

  const handleEdit = (movie: Movie) => {
    setEditingMovie({ ...movie });
  };

  const handleSaveEdit = async () => {
    if (!editingMovie) return;

    const saveToast = toast.loading("Saving changes...");

    try {
      const res = await fetch("/api/movies", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingMovie),
      });

      if (!res.ok) throw new Error("Update failed");

      setMovies((prev) =>
        prev.map((m) =>
          m.id === editingMovie.id ? editingMovie : m
        )
      );
      toast.success("Movie updated successfully", { id: saveToast });
      setEditingMovie(null);
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update movie", { id: saveToast });
    }
  };

  if (loading) {
    return <div className="text-zinc-400 p-6">Loading movies...</div>;
  }

  return (
    <div className="space-y-4 p-6 bg-zinc-950 min-h-screen text-zinc-100">
      <Toaster position="top-center" />

      <h2 className="text-xl font-bold tracking-tight">
        Movie Catalog
      </h2>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        {movies.length === 0 ? (
          <p className="p-6 text-zinc-500 text-sm">
            No movies found in database.
          </p>
        ) : (
          <div className="divide-y divide-zinc-800">
            {movies.map((movie) => (
              <div
                key={movie.id}
                className="flex items-center justify-between p-4 hover:bg-zinc-800/40 transition-colors gap-4"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    className="w-12 h-16 object-cover rounded-lg bg-zinc-800 shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-sm text-zinc-200 truncate">
                        {movie.title}
                      </p>
                      <span className="text-xs text-zinc-500">
                        ({movie.year})
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="text-xs px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-500 font-medium">
                        ★ {movie.rating}
                      </span>
                      <span className="text-xs text-zinc-400">
                        {movie.duration}
                      </span>
                      <span className="text-xs text-zinc-500">
                        {movie.genre?.join(", ")}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleEdit(movie)}
                    className="p-2 rounded-xl bg-zinc-800/60 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-all cursor-pointer"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.8}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.862 4.487zm0 0L19.5 7.125"
                      />
                    </svg>
                  </button>

                  <button
                    onClick={() =>
                      setDeleteConfirmId(movie.id)
                    }
                    className="p-2 rounded-xl bg-zinc-800/60 text-zinc-400 hover:text-rose-500 hover:bg-rose-500/10 transition-all cursor-pointer"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.8}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingMovie && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
            <h3 className="mb-4 text-lg font-bold">Edit Movie</h3>

            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs text-zinc-400">
                  Title
                </label>
                <input
                  value={editingMovie.title}
                  onChange={(e) =>
                    setEditingMovie({
                      ...editingMovie,
                      title: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs text-zinc-400">
                  Year
                </label>
                <input
                  type="number"
                  value={editingMovie.year}
                  onChange={(e) =>
                    setEditingMovie({
                      ...editingMovie,
                      year: Number(e.target.value),
                    })
                  }
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs text-zinc-400">
                  Rating
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={editingMovie.rating}
                  onChange={(e) =>
                    setEditingMovie({
                      ...editingMovie,
                      rating: Number(e.target.value),
                    })
                  }
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs text-zinc-400">
                  Duration
                </label>
                <input
                  value={editingMovie.duration}
                  onChange={(e) =>
                    setEditingMovie({
                      ...editingMovie,
                      duration: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs text-zinc-400">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={editingMovie.description}
                  onChange={(e) =>
                    setEditingMovie({
                      ...editingMovie,
                      description: e.target.value,
                    })
                  }
                  className="w-full resize-none rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm outline-none focus:border-rose-500"
                />
              </div>
            </div>

            <div className="mt-5 flex gap-3">
              <button
                onClick={() => setEditingMovie(null)}
                className="flex-1 rounded-lg border border-zinc-700 py-2.5 text-sm font-semibold text-zinc-300 hover:bg-zinc-800"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="flex-1 rounded-lg bg-rose-600 py-2.5 text-sm font-semibold text-white hover:bg-rose-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-sm rounded-2xl border border-zinc-800 bg-zinc-900 p-6 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-rose-500/10 text-2xl">
              🗑️
            </div>
            <h3 className="text-lg font-bold">Delete Movie?</h3>
            <p className="mt-1 text-sm text-zinc-400">
              This action cannot be undone.
            </p>

            <div className="mt-5 flex gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 rounded-lg border border-zinc-700 py-2.5 text-sm font-semibold text-zinc-300 hover:bg-zinc-800"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="flex-1 rounded-lg bg-rose-600 py-2.5 text-sm font-semibold text-white hover:bg-rose-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}