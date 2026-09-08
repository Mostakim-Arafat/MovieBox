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

 // Updated opening tag with id="faq" and mobile responsive padding:
return (
  <section id="faq" className="w-full bg-black text-white py-16 sm:py-24 px-4 sm:px-12 lg:px-16 border-t border-zinc-900">
      <div className="mx-auto flex w-full max-w-3xl flex-col items-start">
        <h2 className="mb-2 text-left text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl md:text-4xl">
          Frequently Asked Questions
        </h2>

        <div className="w-full space-y-3.5">
          {faqData.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="w-full overflow-hidden rounded-xl border border-border bg-muted/60 transition-all duration-350 hover:bg-muted"
              >
                <button
                  onClick={() => handleToggle(index)}
                  className="flex w-full cursor-pointer items-center justify-between p-5 text-left transition-colors duration-200 focus:outline-none sm:p-6"
                >
                  <span className={`text-base font-semibold transition-colors duration-200 sm:text-lg ${isOpen ? "text-rose-500" : "text-foreground"}`}>
                    {item.question}
                  </span>
                  <svg
                    className={`h-5 w-5 transition-transform duration-300 ease-out sm:h-6 sm:w-6 ${
                      isOpen ? "rotate-45 text-rose-500" : "text-muted-foreground hover:text-foreground"
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

                <div
                  className={`grid overflow-hidden transition-all duration-300 ease-in-out ${
                    isOpen
                      ? "grid-rows-[1fr] border-t border-border opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="bg-background/80 p-5 text-sm leading-relaxed text-muted-foreground sm:p-6 sm:text-base">
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