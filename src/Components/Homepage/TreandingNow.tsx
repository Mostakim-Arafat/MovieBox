"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";

const DEFAULT_TRENDING_MOVIES = [
  { _id: "1", title: "Cocktail 2", poster: "https://images.unsplash.com/photo-1542204172-e7052809f852?q=80&w=400" },
  { _id: "2", title: "Detective Conan", poster: "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=400" },
  { _id: "3", title: "Musafir Cafe", poster: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=400" },
  { _id: "4", title: "Lock Upp", poster: "https://images.unsplash.com/photo-1505635552518-3448ff116af3?q=80&w=400" },
  { _id: "5", title: "Operation Safed Sagar", poster: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=400" },
  { _id: "6", title: "The Last House", poster: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?q=80&w=400" },
  { _id: "7", title: "Main Vaapaa Aaunga", poster: "https://images.unsplash.com/photo-1585647347483-22b66260dfff?q=80&w=400" },
  { _id: "8", title: "Action Waves", poster: "https://images.unsplash.com/photo-1501430654243-c934ccd2e1c0?q=80&w=400" },
  { _id: "9", title: "Magic Spell", poster: "https://images.unsplash.com/photo-1496345875659-11f7dd282d1d?q=80&w=400" },
  { _id: "10", title: "Cyberpunk Alley", poster: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=400" },
];

export default function TrendingNow() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [trending, setTrending] = useState<any[]>(DEFAULT_TRENDING_MOVIES);

  const updateScrollState = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollLeft < max - 8);
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [updateScrollState]);

  useEffect(() => {
    const fetchdata = async () => {
      try {
        const data1 = await fetch('/api/trending');
        if (data1.ok) {
          const data2 = await data1.json();
          if (Array.isArray(data2) && data2.length > 0) {
            setTrending(data2);
          }
        }
      } catch (error) {
        console.error("Failed to fetch trending data, using fallback", error);
      }
    };

    fetchdata();
  }, []);

  const scrollByCards = (direction: -1 | 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const amount = Math.min(el.clientWidth * 0.85, 720);
    el.scrollBy({ left: direction * amount, behavior: "smooth" });
  };

  return (
    <section id="trending" className="w-full bg-black text-white py-12 sm:py-16 px-4 sm:px-12 lg:px-16 relative z-30">
      <div className="max-w-7xl mx-auto relative group/section">
        {/* Title */}
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-6 sm:mb-8 text-white text-left">
          Trending Now
        </h2>
        <div className="relative">
          {canScrollLeft && (
            <button
              type="button"
              aria-label="Scroll trending titles left"
              onClick={() => scrollByCards(-1)}
              className="absolute top-0 bottom-2 left-0 z-20 hidden w-12 items-center justify-center bg-gradient-to-r from-background via-background/80 to-transparent text-foreground md:flex"
            >
              <span className="flex h-full w-10 items-center justify-center rounded-r-md bg-muted/70 hover:bg-muted">
                <MdChevronLeft size={32} />
              </span>
            </button>
          )}
          <div
            ref={scrollerRef}
            className="trending-scroll flex snap-x snap-mandatory gap-2 overflow-x-auto overflow-y-hidden pb-4 pt-2"
          >
            {trending.map((title, index) => {
              const rank = index + 1;
              const isDoubleDigit = rank >= 10;
              return (
                <article
                  key={title._id || index}
                  className="relative flex h-[240px] w-[168px] shrink-0 snap-start items-end sm:h-[280px] sm:w-[196px] md:h-[320px] md:w-[224px] group/card cursor-pointer"
                >
                  <span
                    aria-hidden
                    className={`trending-rank absolute bottom-[-0.35rem] z-0 font-sans ${
                      isDoubleDigit
                        ? "left-[-0.15rem] text-[7.5rem] sm:text-[9rem] md:text-[10.5rem]"
                        : "left-[-0.35rem] text-[9rem] sm:text-[11rem] md:text-[13rem]"
                    }`}
                  >
                    {rank}
                  </span>
                  <div
                    className={`relative z-10 mb-1 ml-auto overflow-hidden rounded-md shadow-[0_8px_24px_rgba(0,0,0,0.45)] ring-1 ring-black/20 ${
                      isDoubleDigit
                        ? "h-[82%] w-[58%]"
                        : "h-[86%] w-[62%]"
                    }`}
                  >
                    <Image
                      src={title.poster || "https://images.unsplash.com/photo-1542204172-e7052809f852?q=80&w=400"}
                      alt={title.title || "Movie"}
                      fill
                      sizes="(max-width: 640px) 40vw, 160px"
                      className="object-cover transition duration-300 group-hover/card:scale-[1.05]"
                      priority={index < 4}
                    />

                    {/* Movie Name Bottom Gradient Overlay */}
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/80 to-transparent p-2 pt-6 text-center z-20 pointer-events-none">
                      <p className="text-[10px] sm:text-xs font-bold text-white tracking-wide truncate">
                        {title.title}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
          {canScrollRight && (
            <button
              type="button"
              aria-label="Scroll trending titles right"
              onClick={() => scrollByCards(1)}
              className="absolute top-0 right-0 bottom-2 z-20 hidden w-12 items-center justify-center bg-gradient-to-l from-background via-background/80 to-transparent text-foreground md:flex"
            >
              <span className="flex h-full w-10 items-center justify-center rounded-l-md bg-muted/70 hover:bg-muted">
                <MdChevronRight size={32} />
              </span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}