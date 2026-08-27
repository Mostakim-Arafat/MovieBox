"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function BannerSection() {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      router.push(`/register?email=${encodeURIComponent(email.trim())}`);
    }
  };

  // Movie poster list from Unsplash to create a beautiful grid
  const posterColumns = [
    [
      "https://images.unsplash.com/photo-1635805737707-575885ab0820?q=80&w=400", // Superhero mask
      "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?q=80&w=400", // Dark cityscape
      "https://images.unsplash.com/photo-1608889175123-8ec330b86f84?q=80&w=400", // Glowing suit
      "https://images.unsplash.com/photo-1569003339405-ea396a5a8a90?q=80&w=400", // Shield/hero
      "https://images.unsplash.com/photo-1585647347483-22b66260dfff?q=80&w=400", // Magic wand
    ],
    [
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=400", // Deep space
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=400", // Spy suit
      "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=400", // Film camera
      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=400", // Theater hall
      "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=400", // Theater seats
    ],
    [
      "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=400", // Neon street
      "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=400", // Cyberpunk character
      "https://images.unsplash.com/photo-1542204172-e7052809f852?q=80&w=400", // Foggy forest
      "https://images.unsplash.com/photo-1478720568477-151d9b21efb2?q=80&w=400", // Camera lens
      "https://images.unsplash.com/photo-1505635552518-3448ff116af3?q=80&w=400", // Horror mask
    ],
    [
      "https://images.unsplash.com/photo-1535016120720-40c646be5580?q=80&w=400", // Popcorn
      "https://images.unsplash.com/photo-1501430654243-c934ccd2e1c0?q=80&w=400", // Action surfer
      "https://images.unsplash.com/photo-1496345875659-11f7dd282d1d?q=80&w=400", // Adventure valley
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=400", // Vintage detective
      "https://images.unsplash.com/photo-1533928298208-27ff66555d8d?q=80&w=400", // City lights
    ],
    [
      "https://images.unsplash.com/photo-1504701954957-2390f806e9f4?q=80&w=400", // Spooky trees
      "https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=400", // Sparks/stage
      "https://images.unsplash.com/photo-1559583985-c80d8ad9b29f?q=80&w=400", // Crime scene city
      "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=400", // Projector film
      "https://images.unsplash.com/photo-1568832359672-e36cf5d74f54?q=80&w=400", // Collage posters
    ],
    [
      "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=400", // Stage lights
      "https://images.unsplash.com/photo-1578849278619-e73505e9610f?q=80&w=400", // Popcorn box
      "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=400", // Abstract colors
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=400", // Romance Eiffel
      "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=400", // Drama painting
    ]
  ];

  return (
    <section className="relative w-full overflow-hidden bg-black text-white h-[95vh] md:h-[90vh] flex flex-col justify-between select-none">
      
      {/* 1. Backdrop Tilted Poster Grid */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[140%] h-[140%] -top-[20%] -left-[20%] grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 md:gap-4.5 transform -rotate-[7deg] scale-105 opacity-[0.22] transition-opacity duration-700">
          {posterColumns.map((column, colIdx) => (
            <div 
              key={colIdx} 
              className={`flex flex-col gap-3 md:gap-4.5 ${
                colIdx % 2 === 0 ? "animate-marquee-slow" : "animate-marquee-slow-reverse"
              }`}
            >
              {[...column, ...column].map((imgUrl, imgIdx) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img 
                  key={imgIdx} 
                  src={imgUrl} 
                  alt="Movie Backdrop" 
                  className="w-full aspect-[2/3] rounded-lg bg-zinc-900 border border-zinc-800/20 overflow-hidden shadow-lg object-cover select-none"
                  loading="lazy"
                />
              ))}
            </div>
          ))}
        </div>
        
        {/* Cinematic Vignette Overlay Gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/45 to-black z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_10%,rgba(0,0,0,0.92)_90%)] z-10" />
      </div>

      {/* 2. Floating Navbar Header */}
      <header className="relative z-30 w-full max-w-7xl mx-auto px-6 py-6 md:px-12 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <svg
            className="h-8 w-8 text-rose-600 transition-transform group-hover:scale-110 duration-300"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
            />
          </svg>
          <span className="text-2xl font-black tracking-wider text-white">
            MOVIE<span className="text-rose-600">BOX</span>
          </span>
        </Link>
        <Link
          href="/login"
          className="bg-rose-600 hover:bg-rose-700 text-white font-semibold px-5 py-1.5 rounded-lg text-sm transition-all duration-200 shadow-md shadow-rose-900/20 active:scale-95"
        >
          Sign In
        </Link>
      </header>

      {/* 3. Hero Copy & Call To Action */}
      <div className="relative z-20 flex-grow flex flex-col items-center justify-center text-center px-4 max-w-3xl mx-auto -mt-6 sm:-mt-12">
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold leading-[1.1] tracking-tight text-white max-w-2xl sm:max-w-3xl">
          Unlimited movies, TV shows, and more
        </h1>
        <p className="text-lg sm:text-2xl font-medium mt-4 text-zinc-100">
          Starts at USD 2.99. Cancel anytime.
        </p>
        <p className="text-sm sm:text-lg text-zinc-300 mt-6 sm:mt-8 max-w-lg leading-relaxed">
          Ready to watch? Enter your email to create or restart your membership.
        </p>

        {/* Signup Email Form */}
        <form 
          onSubmit={handleSignup}
          className="w-full max-w-xl mt-6 flex flex-col sm:flex-row gap-3 items-stretch px-2 sm:px-0"
        >
          {/* Floating Label Email Input */}
          <div className="relative flex-grow min-w-0">
            <input
              type="email"
              id="hero-email"
              className="peer w-full bg-black/40 backdrop-blur-md border border-zinc-500 rounded-lg px-4 pt-5 pb-1.5 text-white placeholder-transparent focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all text-base outline-none"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label
              htmlFor="hero-email"
              className="absolute left-4 top-3 text-zinc-400 text-sm font-medium transition-all transform origin-left pointer-events-none
                peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0
                peer-focus:scale-[0.8] peer-focus:-translate-y-2.5 peer-focus:text-zinc-300
                peer-[:not(:placeholder-shown)]:scale-[0.8] peer-[:not(:placeholder-shown)]:-translate-y-2.5 peer-[:not(:placeholder-shown)]:text-zinc-300"
            >
              Email address
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-base sm:text-lg px-6 py-3.5 sm:py-0 rounded-lg flex items-center justify-center gap-1.5 transition-all duration-200 shadow-md shadow-rose-900/10 active:scale-[0.98] cursor-pointer whitespace-nowrap"
          >
            Get Started
            <svg
              className="w-4 h-4 text-white transform transition-transform group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </form>
      </div>

      {/* 4. Curved Glowing Bottom Divider */}
      <div className="relative z-20 w-full h-[60px] sm:h-[80px] md:h-[100px] pointer-events-none select-none overflow-visible">
        <svg 
          viewBox="0 0 1440 100" 
          fill="none" 
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute bottom-0 left-0 w-full h-full overflow-visible z-20"
        >
          {/* Solid Black mask below the curve */}
          <path d="M0 100 C 360 10, 1080 10, 1440 100 L 1440 101 L 0 101 Z" fill="#000000" />
          
          {/* Curved neon glow stroke */}
          <path 
            d="M0 100 C 360 10, 1080 10, 1440 100" 
            stroke="url(#rose-glow-gradient)" 
            strokeWidth="5" 
            className="drop-shadow-[0_0_8px_rgba(225,29,72,0.4)]"
          />
          
          <defs>
            <linearGradient id="rose-glow-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(225, 29, 72, 0)" />
              <stop offset="25%" stopColor="rgba(225, 29, 72, 0.4)" />
              <stop offset="50%" stopColor="rgba(225, 29, 72, 0.95)" />
              <stop offset="75%" stopColor="rgba(225, 29, 72, 0.4)" />
              <stop offset="100%" stopColor="rgba(225, 29, 72, 0)" />
            </linearGradient>
          </defs>
        </svg>
      </div>

    </section>
  );
}