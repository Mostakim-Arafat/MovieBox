import React from "react";

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: React.ReactNode;
}

export default function StatCard({ title, value, change, isPositive, icon }: StatCardProps) {
  return (
    <div className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 rounded-2xl p-5 hover:border-zinc-700 transition-all duration-300 group">
      <div className="flex items-start justify-between mb-4">
        <div className="p-2.5 rounded-xl bg-zinc-800/60 text-zinc-400 group-hover:text-rose-500 group-hover:bg-rose-600/10 transition-all duration-300">
          {icon}
        </div>
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
            isPositive
              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
              : "bg-red-500/10 text-red-400 border border-red-500/20"
          }`}
        >
          <svg
            className={`w-3 h-3 ${isPositive ? "" : "rotate-180"}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
          </svg>
          {change}
        </span>
      </div>
      <p className="text-2xl font-bold text-zinc-100 tracking-tight">{value}</p>
      <p className="text-sm text-zinc-500 mt-1">{title}</p>
    </div>
  );
}