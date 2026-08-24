"use client";

import React, { useState } from "react";

interface FaqItem {
  question: string;
  answer: string;
}

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqData: FaqItem[] = [
    {
      question: "What is MovieBox?",
      answer:
        "MovieBox is a cinematic database and streaming recommendation platform that helps you find, rate, and track your favorite movies and TV shows. We aggregate information from all popular streaming services so you know exactly where to watch.",
    },
    {
      question: "How much does MovieBox cost?",
      answer:
        "MovieBox offers a free standard tier with complete access to watchlist tracking and our movie database. Premium plans start at just $4.99/month, offering advanced analytics, ad-free viewing recommendations, and priority updates.",
    },
    {
      question: "Where can I watch?",
      answer:
        "You can access MovieBox anywhere through your web browser on desktop computers, laptops, tablets, smartphones, and smart TVs. We also support casting to chromecast-enabled devices.",
    },
    {
      question: "How do I cancel?",
      answer:
        "Canceling your Premium subscription is simple and quick. You can do it in your Account settings page with a single click. There are no cancellation fees, contracts, or hidden terms.",
    },
    {
      question: "What can I watch on MovieBox?",
      answer:
        "MovieBox tracks and cataloges millions of titles across multiple genres, including blockbusters, award-winning indie films, documentaries, classics, and newly released TV series from platforms like Netflix, Hulu, Prime Video, and Disney+.",
    },
    {
      question: "Is MovieBox good for kids?",
      answer:
        "Yes! MovieBox includes comprehensive parental control settings. You can activate Kid's Mode to restrict search results and recommendations to age-appropriate PG-rated content only.",
    },
  ];

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full bg-black text-white py-24 px-6 sm:px-12 lg:px-16 border-t border-zinc-900">
      <div className="max-w-3xl mx-auto flex flex-col items-center">
        {/* Subtle Category Badge */}
        <span className="text-[11px] font-bold uppercase tracking-widest text-rose-500 bg-rose-500/10 px-3 py-1.5 rounded-full mb-3 border border-rose-500/20">
          FAQ
        </span>

        {/* Section Header */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center mb-2 tracking-tight text-white">
          Frequently Asked Questions
        </h2>
        <p className="text-zinc-400 text-sm sm:text-base text-center mb-12 max-w-md">
          Got questions? We've got answers. If you can't find what you are looking for, contact our support team.
        </p>

        {/* Accordions Wrapper */}
        <div className="w-full space-y-3.5">
          {faqData.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div 
                key={index} 
                className="w-full rounded-xl border border-zinc-800/60 bg-[#161719]/40 hover:bg-[#1a1c1f]/80 overflow-hidden transition-all duration-300"
              >
                {/* Accordion Header */}
                <button
                  onClick={() => handleToggle(index)}
                  className="w-full flex items-center justify-between p-5 sm:p-6 transition-colors duration-200 text-left select-none cursor-pointer focus:outline-none"
                >
                  <span className={`text-base sm:text-lg font-semibold transition-colors duration-200 ${isOpen ? 'text-rose-500' : 'text-zinc-100'}`}>
                    {item.question}
                  </span>
                  <svg
                    className={`w-5 h-5 sm:w-6 sm:h-6 text-zinc-400 hover:text-white transition-transform duration-300 ease-out ${
                      isOpen ? "rotate-45 text-rose-500" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.5v15m7.5-7.5h-15"
                    />
                  </svg>
                </button>

                {/* Accordion Answer Body with Auto-height Slide transition */}
                <div
                  className={`grid transition-all duration-300 ease-in-out overflow-hidden ${
                    isOpen
                      ? "grid-rows-[1fr] opacity-100 border-t border-zinc-800/40"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="p-5 sm:p-6 bg-[#161719]/60 text-zinc-300 text-sm sm:text-base leading-relaxed font-normal">
                      {item.answer}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}