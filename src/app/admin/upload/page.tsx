"use client";
import React, { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const GENRES_LIST = [
  "Action",
  "Adventure",
  "Animation",
  "Comedy",
  "Crime",
  "Documentary",
  "Drama",
  "Fantasy",
  "Horror",
  "Mystery",
  "Romance",
  "Sci-Fi",
  "Thriller",
];

const AGE_RATINGS = ["G", "PG", "PG-13", "R", "NC-17", "TV-MA", "TV-14"];

const QUALITY_OPTIONS = [
  "4K Ultra HD",
  "1080p Full HD",
  "HDR10",
  "Dolby Vision",
  "Dolby Atmos",
  "5.1 Surround",
];

export default function MovieUploadPage() {
  const router = useRouter();

  // Form State
  const [title, setTitle] = useState("");
  const [tagline, setTagline] = useState("");
  const [synopsis, setSynopsis] = useState("");
  const [releaseYear, setReleaseYear] = useState(new Date().getFullYear().toString());
  const [releaseDate, setReleaseDate] = useState("");
  const [durationHours, setDurationHours] = useState("2");
  const [durationMinutes, setDurationMinutes] = useState("15");
  const [ageRating, setAgeRating] = useState("PG-13");
  const [language, setLanguage] = useState("English");
  const [subtitles, setSubtitles] = useState("English, Spanish, French");

  // Categorization
  const [selectedGenres, setSelectedGenres] = useState<string[]>(["Action", "Sci-Fi"]);
  const [director, setDirector] = useState("");
  const [castInput, setCastInput] = useState("");
  const [castList, setCastList] = useState<string[]>([]);
  const [tagsInput, setTagsInput] = useState("");
  const [tagsList, setTagsList] = useState<string[]>(["Trending", "Blockbuster"]);

  // Media
  const [posterPreview, setPosterPreview] = useState<string | null>(null);
  const [posterName, setPosterName] = useState<string>("");
  const [backdropPreview, setBackdropPreview] = useState<string | null>(null);
  const [backdropName, setBackdropName] = useState<string>("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState("");

  // Flags & Settings
  const [selectedQualities, setSelectedQualities] = useState<string[]>([
    "4K Ultra HD",
    "HDR10",
    "Dolby Atmos",
  ]);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isTrending, setIsTrending] = useState(true);
  const [status, setStatus] = useState<"Published" | "Draft" | "Scheduled">("Published");

  // Upload Progress / State
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStage, setUploadStage] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const posterInputRef = useRef<HTMLInputElement>(null);
  const backdropInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  // Genre Toggle
  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  // Quality Toggle
  const toggleQuality = (quality: string) => {
    setSelectedQualities((prev) =>
      prev.includes(quality) ? prev.filter((q) => q !== quality) : [...prev, quality]
    );
  };

  // Cast Tag Handling
  const handleAddCast = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === ",") && castInput.trim()) {
      e.preventDefault();
      const val = castInput.trim().replace(/^,|,$/g, "");
      if (val && !castList.includes(val)) {
        setCastList([...castList, val]);
      }
      setCastInput("");
    }
  };

  const removeCast = (indexToRemove: number) => {
    setCastList(castList.filter((_, i) => i !== indexToRemove));
  };

  // Keywords Tag Handling
  // const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
  //   if ((e.key === "Enter" || e.key === ",") && tagsInput.trim()) {
  //     e.preventDefault();
  //     const val = tagsInput.trim().replace(/^,|,$/g, "");
  //     if (val && !tagsList.includes(val)) {
  //       setTagsList([...tagsList, val]);
  //     }
  //     setTagsInput("");
  //   }
  // };

  const removeTag = (indexToRemove: number) => {
    setTagsList(tagsList.filter((_, i) => i !== indexToRemove));
  };

  // Media File Handling
  const handlePosterChange = (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setErrorMessage("Please upload a valid image file for the poster (JPEG, PNG, WebP).");
      return;
    }
    setPosterName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => setPosterPreview(e.target?.result as string);
    reader.readAsDataURL(file);
    setErrorMessage("");
  };

  const handleBackdropChange = (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setErrorMessage("Please upload a valid image file for the backdrop banner.");
      return;
    }
    setBackdropName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => setBackdropPreview(e.target?.result as string);
    reader.readAsDataURL(file);
    setErrorMessage("");
  };

  const handleVideoChange = (file: File | undefined) => {
    if (!file) return;
    setVideoFile(file);
    setErrorMessage("");
  };














  // Form Submit / Mock Upload
  const handleFormSubmit = async (e: React.FormEvent, submitStatus: "Published" | "Draft") => {
    e.preventDefault();


    setErrorMessage("");

    if (!title.trim()) {
      setErrorMessage("Movie title is required.");
      return;
    }
    if (selectedGenres.length === 0) {
      setErrorMessage("Please select at least one genre.");
      return;
    }

    setStatus(submitStatus);
    setIsUploading(true);

    try {
      const response = await fetch("/api/movies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          poster: posterPreview,
          year: Number(releaseYear),
          releaseDate,
          ageRating,
          language,
          subtitles,
          genre: selectedGenres,
          rating: 0,
          duration: `${durationHours}h ${durationMinutes}m`,
          description: synopsis.trim(),
        }),
      });

      if (!response.ok) throw new Error("Failed to save movie");

      setUploadSuccess(true);
      setUploadProgress(100);
    } catch (error) {
      console.error(error);
      setErrorMessage("Could not save the movie. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

















  const resetForm = () => {
    setTitle("");
    setTagline("");
    setSynopsis("");
    setPosterPreview(null);
    setPosterName("");
    setBackdropPreview(null);
    setBackdropName("");
    setVideoFile(null);
    setVideoUrl("");
    setCastList([]);
    setTagsList(["Trending"]);
    setSelectedGenres(["Action"]);
    setUploadSuccess(false);
    setUploadProgress(0);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-800/80 pb-6">
        <div>
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-zinc-400 mb-2">
            <Link href="/admin" className="hover:text-zinc-200 transition-colors">
              Dashboard
            </Link>
            <span>/</span>
            <Link href="/admin/movies" className="hover:text-zinc-200 transition-colors">
              Movies
            </Link>
            <span>/</span>
            <span className="text-rose-500 font-medium">Upload Movie</span>
          </nav>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-100 tracking-tight flex items-center gap-3">
            Upload New Movie
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-rose-600/10 text-rose-400 border border-rose-500/20">
              Admin Portal
            </span>
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Add a new title, upload media files, and configure catalog metadata.
          </p>
        </div>

        {/* Top Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <Link
            href="/admin/movies"
            className="px-4 py-2 rounded-lg text-sm font-medium text-zinc-300 hover:text-white bg-zinc-900 border border-zinc-800 hover:bg-zinc-800/60 transition-colors"
          >
            Cancel
          </Link>
          {/* <button
            type="button"
            disabled={isUploading}
            onClick={(e) => handleFormSubmit(e, "Draft")}
            className="px-4 py-2 rounded-lg text-sm font-medium text-zinc-200 bg-zinc-800 hover:bg-zinc-700 transition-colors disabled:opacity-50 cursor-pointer"
          >
            Save Draft
          </button> */}
          <button
            type="button"
            disabled={isUploading}
            onClick={(e) => handleFormSubmit(e, "Published")}
            className="px-5 py-2 rounded-lg text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 shadow-md shadow-rose-900/30 transition-all active:scale-95 disabled:opacity-50 cursor-pointer flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Publish Movie
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="bg-rose-950/60 border border-rose-800 text-rose-300 px-4 py-3 rounded-xl flex items-center justify-between text-sm">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-rose-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{errorMessage}</span>
          </div>
          <button
            onClick={() => setErrorMessage("")}
            className="text-rose-400 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}

      {/* Success Modal / Banner */}
      {uploadSuccess && (
        <div className="bg-gradient-to-r from-emerald-950/60 to-zinc-900 border border-emerald-500/40 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20 shrink-0">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white">Movie Uploaded Successfully!</h3>
              <p className="text-sm text-zinc-300 mt-1">
                <strong>{title || "New Movie"}</strong> has been processed and saved as{" "}
                <span className="text-emerald-400 font-semibold">{status}</span>. It is now registered in the MovieBox database.
              </p>
              <div className="flex items-center gap-3 mt-4">
                <button
                  onClick={resetForm}
                  className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors cursor-pointer"
                >
                  Upload Another Movie
                </button>
                <Link
                  href="/admin/movies"
                  className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors"
                >
                  View Movie Catalog
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Uploading Progress Overlay */}
      {isUploading && (
        <div className="bg-zinc-900/90 border border-rose-500/40 rounded-2xl p-6 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold text-zinc-200 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping inline-block" />
              {uploadStage}
            </span>
            <span className="font-mono text-rose-400 font-bold">{uploadProgress}%</span>
          </div>
          <div className="w-full bg-zinc-950 rounded-full h-2.5 overflow-hidden border border-zinc-800">
            <div
              className="bg-gradient-to-r from-rose-600 to-rose-400 h-full transition-all duration-300 rounded-full"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Main Upload Form Layout */}
      <form onSubmit={(e) => handleFormSubmit(e, "Published")} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left 2 Columns: Metadata & Descriptions */}
          <div className="lg:col-span-2 space-y-6">

            {/* 1. General Information Card */}
            <div className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 rounded-2xl p-6 space-y-5">
              <div className="border-b border-zinc-800/80 pb-3 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-zinc-100">General Information</h2>
                  <p className="text-xs text-zinc-500">Title, synopsis, and duration details</p>
                </div>
                <span className="text-xs text-zinc-500">* Required fields</span>
              </div>

              {/* Title & Tagline */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
                    Movie Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Interstellar Odyssey"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all"
                  />
                </div>

                {/* <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
                    Tagline / Catchphrase
                  </label>
                  <input
                    type="text"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    placeholder="e.g. Mankind was born on Earth. It was never meant to die here."
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all"
                  />
                </div> */}
              </div>

              {/* Synopsis */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300">
                    Synopsis / Storyline
                  </label>
                  <span className="text-xs text-zinc-500">{synopsis.length} characters</span>
                </div>
                <textarea
                  rows={4}
                  value={synopsis}
                  onChange={(e) => setSynopsis(e.target.value)}
                  placeholder="Provide an overview of the film, plot premise, and themes..."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all resize-y"
                />
              </div>

              {/* Release Details Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
                    Release Year *
                  </label>
                  <input
                    type="number"
                    min="1900"
                    max="2035"
                    value={releaseYear}
                    onChange={(e) => setReleaseYear(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
                    Release Date
                  </label>
                  <input
                    type="date"
                    value={releaseDate}
                    onChange={(e) => setReleaseDate(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
                    Duration
                  </label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      min="0"
                      max="10"
                      value={durationHours}
                      onChange={(e) => setDurationHours(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-2 text-sm text-center text-zinc-100 focus:outline-none focus:border-rose-500"
                    />
                    <span className="text-xs text-zinc-400">h</span>
                    <input
                      type="number"
                      min="0"
                      max="59"
                      value={durationMinutes}
                      onChange={(e) => setDurationMinutes(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-2 text-sm text-center text-zinc-100 focus:outline-none focus:border-rose-500"
                    />
                    <span className="text-xs text-zinc-400">m</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
                    Rating
                  </label>
                  <select
                    value={ageRating}
                    onChange={(e) => setAgeRating(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-rose-500"
                  >
                    {AGE_RATINGS.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Language & Subtitles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
                    Audio Language
                  </label>
                  <input
                    type="text"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    placeholder="e.g. English (Original)"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2 text-sm text-zinc-100 focus:outline-none focus:border-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
                    Available Subtitles
                  </label>
                  <input
                    type="text"
                    value={subtitles}
                    onChange={(e) => setSubtitles(e.target.value)}
                    placeholder="e.g. English, French, Spanish, German"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2 text-sm text-zinc-100 focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>
            </div>

            {/* 2. Genres & Categorization Card */}
            <div className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 rounded-2xl p-6 space-y-5">
              <div className="border-b border-zinc-800/80 pb-3">
                <h2 className="text-base font-bold text-zinc-100">Genres & Classification</h2>
                <p className="text-xs text-zinc-500">Select applicable categories and tags</p>
              </div>

              {/* Multi-select Genres */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-2.5">
                  Movie Genres * (Select multiple)
                </label>
                <div className="flex flex-wrap gap-2">
                  {GENRES_LIST.map((genre) => {
                    const isSelected = selectedGenres.includes(genre);
                    return (
                      <button
                        key={genre}
                        type="button"
                        onClick={() => toggleGenre(genre)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer select-none ${isSelected
                          ? "bg-rose-600 text-white shadow-md shadow-rose-900/30 border border-rose-500"
                          : "bg-zinc-950 text-zinc-400 border border-zinc-800 hover:border-zinc-700 hover:text-zinc-200"
                          }`}
                      >
                        {isSelected ? "✓ " : "+ "}
                        {genre}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Keywords / Search Tags */}
              {/* <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
                  Keywords / Search Tags (Type & hit Enter)
                </label>
                <div className="flex flex-wrap items-center gap-2 p-2 bg-zinc-950 border border-zinc-800 rounded-lg min-h-[44px]">
                  {tagsList.map((tag, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-zinc-800 text-zinc-200 border border-zinc-700/60"
                    >
                      #{tag}
                      <button
                        type="button"
                        onClick={() => removeTag(idx)}
                        className="text-zinc-400 hover:text-rose-400 text-sm leading-none cursor-pointer"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    onKeyDown={handleAddTag}
                    placeholder={tagsList.length === 0 ? "e.g. superhero, oscar-winner, space" : "Add tag..."}
                    className="flex-1 min-w-[120px] bg-transparent text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none px-2"
                  />
                </div>
              </div> */}
            </div>

            {/* 3. Cast & Crew Card */}
            <div className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 rounded-2xl p-6 space-y-5">
              <div className="border-b border-zinc-800/80 pb-3">
                <h2 className="text-base font-bold text-zinc-100">Cast & Crew</h2>
                <p className="text-xs text-zinc-500">Directors, producers, and starring talent</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
                    Director(s)
                  </label>
                  <input
                    type="text"
                    value={director}
                    onChange={(e) => setDirector(e.target.value)}
                    placeholder="e.g. Christopher Nolan"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2 text-sm text-zinc-100 focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
                    Starring Cast (Type & hit Enter)
                  </label>
                  <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-zinc-950 border border-zinc-800 rounded-lg min-h-[42px]">
                    {castList.map((member, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-zinc-800 text-zinc-300"
                      >
                        {member}
                        <button
                          type="button"
                          onClick={() => removeCast(idx)}
                          className="hover:text-rose-400 text-xs cursor-pointer"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                    <input
                      type="text"
                      value={castInput}
                      onChange={(e) => setCastInput(e.target.value)}
                      onKeyDown={handleAddCast}
                      placeholder="Add actor..."
                      className="flex-1 min-w-[80px] bg-transparent text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none px-1"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Video & Streaming Source Card */}
            <div className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 rounded-2xl p-6 space-y-5">
              <div className="border-b border-zinc-800/80 pb-3">
                <h2 className="text-base font-bold text-zinc-100">Video File & Stream Source</h2>
                <p className="text-xs text-zinc-500">Upload primary feature movie file or specify CDN URL</p>
              </div>

              {/* Video File Dropzone */}
              <div>
                <input
                  type="file"
                  ref={videoInputRef}
                  accept="video/mp4,video/x-matroska,video/quicktime,video/webm"
                  className="hidden"
                  onChange={(e) => handleVideoChange(e.target.files?.[0])}
                />
                <div
                  onClick={() => videoInputRef.current?.click()}
                  className="border-2 border-dashed border-zinc-800 hover:border-rose-500/60 rounded-xl p-6 text-center cursor-pointer transition-colors bg-zinc-950/40 group"
                >
                  <div className="w-12 h-12 mx-auto rounded-full bg-zinc-900 flex items-center justify-center text-zinc-400 group-hover:text-rose-500 group-hover:bg-rose-600/10 transition-colors mb-3">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9A2.25 2.25 0 0013.5 5.25h-9A2.25 2.25 0 002.25 7.5v9A2.25 2.25 0 004.5 18.75z" />
                    </svg>
                  </div>
                  {videoFile ? (
                    <div>
                      <p className="text-sm font-semibold text-rose-400">{videoFile.name}</p>
                      <p className="text-xs text-zinc-500 mt-0.5">
                        {(videoFile.size / (1024 * 1024)).toFixed(2)} MB • Ready to upload
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm font-medium text-zinc-300">
                        Drop video file here or <span className="text-rose-500 underline">browse</span>
                      </p>
                      <p className="text-xs text-zinc-500 mt-1">
                        Supports MP4, MKV, MOV, WebM up to 40 GB
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Streaming URL Alternative */}
              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-zinc-800"></div>
                <span className="flex-shrink mx-4 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                  Or External Stream / HLS URL
                </span>
                <div className="flex-grow border-t border-zinc-800"></div>
              </div>

              <div>
                <input
                  type="url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://cdn.moviebox.com/stream/movie-master.m3u8"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

          </div>

          {/* Right Column: Visual Artwork, Status & Publishing Options */}
          <div className="space-y-6">

            {/* 1. Poster Artwork Upload (2:3 Aspect) */}
            <div className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 rounded-2xl p-6 space-y-4">
              <div className="border-b border-zinc-800/80 pb-2">
                <h2 className="text-base font-bold text-zinc-100">Poster Artwork</h2>
                <p className="text-xs text-zinc-500">Recommended ratio 2:3 (e.g. 600×900 px)</p>
              </div>

              <input
                type="file"
                ref={posterInputRef}
                accept="image/*"
                className="hidden"
                onChange={(e) => handlePosterChange(e.target.files?.[0])}
              />

              {posterPreview ? (
                <div className="relative group rounded-xl overflow-hidden border border-zinc-700 bg-zinc-950">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={posterPreview}
                    alt="Poster Preview"
                    className="w-full aspect-[2/3] object-cover"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => posterInputRef.current?.click()}
                      className="px-3 py-1.5 rounded-lg bg-zinc-800 text-white text-xs font-semibold hover:bg-zinc-700 cursor-pointer"
                    >
                      Change Poster
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setPosterPreview(null);
                        setPosterName("");
                      }}
                      className="px-3 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="p-2 bg-zinc-900 text-center">
                    <p className="text-[11px] text-zinc-400 truncate">{posterName}</p>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => posterInputRef.current?.click()}
                  className="w-full aspect-[2/3] border-2 border-dashed border-zinc-800 hover:border-rose-500/60 rounded-xl flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-colors bg-zinc-950/40 group"
                >
                  <div className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-500 group-hover:text-rose-500 group-hover:bg-rose-600/10 transition-colors mb-3">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                    </svg>
                  </div>
                  <p className="text-xs font-semibold text-zinc-300">Upload Poster</p>
                  <p className="text-[11px] text-zinc-500 mt-1">PNG, JPG, WebP up to 10MB</p>
                </div>
              )}
            </div>

            {/* 2. Backdrop Banner (16:9 Aspect) */}
            {/* <div className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 rounded-2xl p-6 space-y-4">
              <div className="border-b border-zinc-800/80 pb-2">
                <h2 className="text-base font-bold text-zinc-100">Hero Backdrop Banner</h2>
                <p className="text-xs text-zinc-500">Wide banner ratio 16:9 (e.g. 1920×1080 px)</p>
              </div>

              <input
                type="file"
                ref={backdropInputRef}
                accept="image/*"
                className="hidden"
                onChange={(e) => handleBackdropChange(e.target.files?.[0])}
              />

              {backdropPreview ? (
                <div className="relative group rounded-xl overflow-hidden border border-zinc-700 bg-zinc-950">
                 
                  <img
                    src={backdropPreview}
                    alt="Backdrop Preview"
                    className="w-full aspect-[16/9] object-cover"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => backdropInputRef.current?.click()}
                      className="px-3 py-1.5 rounded-lg bg-zinc-800 text-white text-xs font-semibold hover:bg-zinc-700 cursor-pointer"
                    >
                      Change
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setBackdropPreview(null);
                        setBackdropName("");
                      }}
                      className="px-3 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => backdropInputRef.current?.click()}
                  className="w-full aspect-[16/9] border-2 border-dashed border-zinc-800 hover:border-rose-500/60 rounded-xl flex flex-col items-center justify-center p-4 text-center cursor-pointer transition-colors bg-zinc-950/40 group"
                >
                  <p className="text-xs font-semibold text-zinc-300">Upload Backdrop Banner</p>
                  <p className="text-[11px] text-zinc-500 mt-1">16:9 Landscape Artwork</p>
                </div>
              )}
            </div> */}

            {/* 3. Audio & Video Quality Badges */}
            {/* <div className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 rounded-2xl p-6 space-y-4">
              <div className="border-b border-zinc-800/80 pb-2">
                <h2 className="text-base font-bold text-zinc-100">Quality & Formats</h2>
                <p className="text-xs text-zinc-500">Select supported badge formats</p>
              </div>

              <div className="flex flex-wrap gap-2">
                {QUALITY_OPTIONS.map((quality) => {
                  const isSelected = selectedQualities.includes(quality);
                  return (
                    <button
                      key={quality}
                      type="button"
                      onClick={() => toggleQuality(quality)}
                      className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors cursor-pointer ${
                        isSelected
                          ? "bg-zinc-100 text-zinc-950 border border-white"
                          : "bg-zinc-950 text-zinc-400 border border-zinc-800 hover:border-zinc-700"
                      }`}
                    >
                      {quality}
                    </button>
                  );
                })}
              </div>
            </div> */}

            {/* 4. Display Toggles & Publishing Controls */}
            {/* <div className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 rounded-2xl p-6 space-y-5">
              <div className="border-b border-zinc-800/80 pb-2">
                <h2 className="text-base font-bold text-zinc-100">Catalog Placement</h2>
                <p className="text-xs text-zinc-500">Configure homepage visibility</p>
              </div>

             
              <label className="flex items-center justify-between cursor-pointer group">
                <div>
                  <p className="text-sm font-semibold text-zinc-200 group-hover:text-white">
                    Feature on Hero Banner
                  </p>
                  <p className="text-xs text-zinc-500">Show in the homepage backdrop rotation</p>
                </div>
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-4 h-4 rounded border-zinc-700 bg-zinc-950 text-rose-600 focus:ring-0 accent-rose-600 cursor-pointer"
                />
              </label>

              
              <label className="flex items-center justify-between cursor-pointer group">
                <div>
                  <p className="text-sm font-semibold text-zinc-200 group-hover:text-white">
                    Trending Now Carousel
                  </p>
                  <p className="text-xs text-zinc-500">Include in top 10 rankings slider</p>
                </div>
                <input
                  type="checkbox"
                  checked={isTrending}
                  onChange={(e) => setIsTrending(e.target.checked)}
                  className="w-4 h-4 rounded border-zinc-700 bg-zinc-950 text-rose-600 focus:ring-0 accent-rose-600 cursor-pointer"
                />
              </label>

              
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
                  Publishing Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as "Published" | "Draft" | "Scheduled")}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-rose-500"
                >
                  <option value="Published">Published (Live now)</option>
                  <option value="Draft">Draft (Hidden)</option>
                  <option value="Scheduled">Scheduled (Coming Soon)</option>
                </select>
              </div>

             
              <div className="pt-2 space-y-2">
                <button
                  type="submit"
                  disabled={isUploading}
                  className="w-full py-3 px-4 rounded-xl text-sm font-bold text-white bg-rose-600 hover:bg-rose-700 active:scale-[0.99] transition-all duration-200 shadow-lg shadow-rose-900/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  {isUploading ? "Uploading Movie..." : "Upload & Publish Movie"}
                </button>
              </div>

            </div> */}

          </div>

        </div>
      </form>
    </div>
  );
}