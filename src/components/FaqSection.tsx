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
    <section className="w-full bg-black text-white py-20 px-6 sm:px-12 lg:px-16 border-t border-zinc-900">
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        {/* Title */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-center mb-10 tracking-tight">
          Frequently Asked Questions
        </h2>

        {/* Accordions Wrapper */}
        <div className="w-full space-y-2">
          {faqData.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={index} className="w-full border-b border-black">
                {/* Accordion Header */}
                <button
                  onClick={() => handleToggle(index)}
                  className="w-full flex items-center justify-between p-6 bg-[#2d2d2d] hover:bg-[#414141] transition-colors duration-250 text-left text-lg sm:text-xl md:text-2xl font-medium select-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-rose-500/30"
                >
                  <span>{item.question}</span>
                  <svg
                    className={`w-6 h-6 sm:w-8 sm:h-8 text-zinc-100 transition-transform duration-300 ease-out ${
                      isOpen ? "rotate-45" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M12 4.5v15m7.5-7.5h-15"
                    />
                  </svg>
                </button>

                {/* Accordion Answer Body with Auto-height Slide transition */}
                <div
                  className={`grid transition-all duration-300 ease-in-out overflow-hidden ${
                    isOpen
                      ? "grid-rows-[1fr] opacity-100 mt-[1px]"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="p-6 bg-[#2d2d2d] text-zinc-200 text-base sm:text-lg md:text-xl leading-relaxed font-normal">
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