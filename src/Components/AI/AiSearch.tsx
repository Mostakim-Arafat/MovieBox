"use client";

import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react"; // Or use any icon library you have

export default function AiSearch({ onResults }: { onResults?: (movies: any[]) => void }) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/ai/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      const data = await res.json();
      if (res.ok) {
        onResults?.(data.movies);
      } else {
        console.error(data.error);
      }
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full max-w-xl mx-auto">
      <div className="relative flex items-center">
        {/* AI Icon */}
        <span className="absolute left-4 text-purple-400">
          <Sparkles className="w-5 h-5 animate-pulse" />
        </span>

        {/* Search Input */}
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask AI: e.g., funny sci-fi movies about space..."
          className="w-full pl-12 pr-28 py-3 bg-gray-900 border border-gray-700 rounded-full text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 shadow-lg"
        />

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="absolute right-2 px-5 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full font-medium hover:opacity-90 disabled:opacity-50 transition flex items-center gap-2"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Search"}
        </button>
      </div>
    </form>
  );
}