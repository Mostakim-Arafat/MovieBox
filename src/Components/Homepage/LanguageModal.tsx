"use client";

import React, { useState, useEffect, useRef } from "react";
import { MdOutlineExpandMore, MdOutlineExpandLess } from "react-icons/md";

export interface LanguageOption {
  code: string;
  label: string;
  name: string;
}

const LANGUAGE_COLUMNS: LanguageOption[][] = [
  // Column 1
  [
    { code: "ID", name: "Bahasa Indonesia", label: "Bahasa Indonesia" },
    { code: "MS", name: "Bahasa Melayu", label: "Bahasa Melayu" },
    { code: "DA", name: "Dansk", label: "Dansk" },
    { code: "DE", name: "Deutsch", label: "Deutsch" },
    { code: "EN", name: "English", label: "English" },
    { code: "ES", name: "Español", label: "Español" },
    { code: "ES-LA", name: "Español Latinoamérica", label: "Español Latinoamérica" },
    { code: "FR", name: "Français", label: "Français" },
  ],
  // Column 2
  [
    { code: "IT", name: "Italiano", label: "Italiano" },
    { code: "HU", name: "Magyar", label: "Magyar" },
    { code: "NL", name: "Nederlands", label: "Nederlands" },
    { code: "NO", name: "Norsk", label: "Norsk" },
    { code: "PL", name: "Polski", label: "Polski" },
    { code: "PT-BR", name: "Português (Brasil)", label: "Português (Brasil)" },
    { code: "PT-PT", name: "Português (Portugal)", label: "Português (Portugal)" },
    { code: "RO", name: "Română", label: "Română" },
  ],
  // Column 3
  [
    { code: "FI", name: "Suomi", label: "Suomi" },
    { code: "SV", name: "Svenska", label: "Svenska" },
    { code: "TR", name: "Türkçe", label: "Türkçe" },
    { code: "FIL", name: "Wikang Filipino", label: "Wikang Filipino" },
    { code: "CS", name: "Čeština", label: "Čeština" },
    { code: "EL", name: "Ελληνικά", label: "Ελληνικά" },
    { code: "RU", name: "Русский", label: "Русский" },
    { code: "HE", name: "עברית", label: "עברית" },
  ],
  // Column 4
  [
    { code: "AR", name: "العربية", label: "العربية" },
    { code: "HI", name: "हिन्दी", label: "हिन्दी" },
    { code: "TA", name: "தமிழ்", label: "தமிழ்" },
    { code: "TE", name: "తెలుగు", label: "తెలుగు" },
    { code: "TH", name: "ไทย", label: "ไทย" },
    { code: "JA", name: "日本語", label: "日本語" },
    { code: "ZH-CN", name: "简体中文", label: "简体中文" },
    { code: "ZH-TW", name: "繁體中文", label: "繁體中文" },
  ],
  // Column 5
  [
    { code: "KO", name: "한국어", label: "한국어" },
  ],
];

interface LanguageModalProps {
  className?: string;
  onLanguageChange?: (lang: LanguageOption) => void;
}

export default function LanguageModal({ className = "", onLanguageChange }: LanguageModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState<LanguageOption>({
    code: "EN",
    name: "English",
    label: "English",
  });
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click or Escape key
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleSelect = (lang: LanguageOption) => {
    setSelectedLang(lang);
    setIsOpen(false);
    if (onLanguageChange) {
      onLanguageChange(lang);
    }
  };

  return (
    <div className={`relative inline-block ${className}`} ref={containerRef}>
      {/* Trigger Button styled like Prime Video */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Select Language"
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer select-none ${
          isOpen
            ? "bg-white text-zinc-950 shadow-md ring-1 ring-white/40"
            : "text-zinc-300 hover:text-white hover:bg-zinc-800/70 border border-transparent"
        }`}
      >
        <span>{selectedLang.code}</span>
        {isOpen ? (
          <MdOutlineExpandLess size={18} className="transition-transform duration-200" />
        ) : (
          <MdOutlineExpandMore size={18} className="transition-transform duration-200" />
        )}
      </button>

      {/* Floating Multi-Column Modal */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="Language selection"
          className="absolute right-0 top-full mt-3 w-[92vw] sm:w-[640px] md:w-[740px] lg:w-[820px] max-w-[850px] bg-[#0c1017]/95 backdrop-blur-2xl border border-zinc-800/90 rounded-2xl p-6 sm:p-7 shadow-2xl shadow-black/80 z-50 animate-in fade-in zoom-in-95 duration-150"
        >
          {/* 5-Column Grid Layout */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-x-6 sm:gap-x-8 gap-y-3.5 sm:gap-y-4 max-h-[70vh] overflow-y-auto sm:overflow-visible pr-1 sm:pr-0">
            {LANGUAGE_COLUMNS.map((column, colIdx) => (
              <div key={colIdx} className="flex flex-col space-y-3">
                {column.map((lang) => {
                  const isCurrent = selectedLang.name === lang.name;
                  return (
                    <button
                      key={lang.name}
                      type="button"
                      onClick={() => handleSelect(lang)}
                      className={`text-left text-sm transition-all duration-150 py-0.5 leading-snug cursor-pointer group flex items-center justify-between ${
                        isCurrent
                          ? "font-semibold text-white"
                          : "font-normal text-zinc-300 hover:text-white"
                      }`}
                    >
                      <span className="group-hover:translate-x-0.5 transition-transform duration-150">
                        {lang.name}
                      </span>
                      {isCurrent && (
                        <span className="w-1.5 h-1.5 rounded-full bg-white ml-2 shrink-0 sm:hidden" />
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}