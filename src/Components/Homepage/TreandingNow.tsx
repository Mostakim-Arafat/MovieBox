"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";

// ১. সঠিক টাইপ বা ইন্টারফেস ডিফাইন করা হলো
interface TrendingItem {
  _id: string;
  title: string;
  poster: string;
}

export default function TrendingNow() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // ২. any এর পরিবর্তে সঠিক TrendingItem[] টাইপ ব্যবহার করা হয়েছে
  const [trending, setTrending] = useState<TrendingItem[]>([]);

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
        const data1 = await fetch('https://movie-box-teal-two.vercel.app/api/trending');
        const data2 = await data1.json();

        // data2 যদি Array হয় তবেই set করবেন, অন্যথায় ফাঁকা Array [] রাখবেন
        if (Array.isArray(data2)) {
          setTrending(data2);
        } else {
          console.error("API response is not an array:", data2);
          setTrending([]);
        }
      } catch (error) {
        console.error("Failed to fetch trending data", error);
        setTrending([]);
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
    <section className="w-full bg-background px-4 py-10 text-foreground sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-5 text-xl font-bold tracking-tight sm:text-2xl">
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
            className="trending-scroll flex snap-x snap-mandatory gap-1 overflow-x-auto overflow-y-hidden pb-2 pt-2"
          >
            {trending.map((title, index) => {
              const rank = index + 1;
              const isDoubleDigit = rank >= 10;
              return (
                <article
                  key={title._id}
                  className="relative flex h-[240px] w-[168px] shrink-0 snap-start items-end sm:h-[280px] sm:w-[196px] md:h-[320px] md:w-[224px]"
                >
                  <span
                    aria-hidden
                    className={`trending-rank absolute bottom-[-0.35rem] z-0 font-sans ${isDoubleDigit
                      ? "left-[-0.15rem] text-[7.5rem] sm:text-[9rem] md:text-[10.5rem]"
                      : "left-[-0.35rem] text-[9rem] sm:text-[11rem] md:text-[13rem]"
                      }`}
                  >
                    {rank}
                  </span>
                  <div
                    className={`relative z-10 mb-1 ml-auto overflow-hidden rounded-md shadow-[0_8px_24px_rgba(0,0,0,0.45)] ring-1 ring-black/20 ${isDoubleDigit ? "h-[82%] w-[58%]" : "h-[86%] w-[62%]"
                      }`}
                  >
                    <Image
                      src={title.poster}
                      alt={title.title}
                      fill
                      sizes="(max-width: 640px) 40vw, 160px"
                      className="object-cover transition duration-300 hover:scale-[1.03]"
                      priority={index < 4}
                    />
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