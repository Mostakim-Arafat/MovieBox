"use client";

import React, { useState } from "react";

interface MonthData {
  label: string;
  value: number;
}

const allData: Record<string, MonthData[]> = {
  "7D": [
    { label: "Mon", value: 4200 },
    { label: "Tue", value: 5800 },
    { label: "Wed", value: 4900 },
    { label: "Thu", value: 6100 },
    { label: "Fri", value: 7200 },
    { label: "Sat", value: 8400 },
    { label: "Sun", value: 6800 },
  ],
  "30D": [
    { label: "W1", value: 28500 },
    { label: "W2", value: 32100 },
    { label: "W3", value: 29800 },
    { label: "W4", value: 38050 },
  ],
  "90D": [
    { label: "Jul", value: 98400 },
    { label: "Aug", value: 112300 },
    { label: "Sep", value: 128450 },
  ],
  "12M": [
    { label: "Oct", value: 72400 },
    { label: "Nov", value: 81200 },
    { label: "Dec", value: 95600 },
    { label: "Jan", value: 88300 },
    { label: "Feb", value: 92100 },
    { label: "Mar", value: 98400 },
    { label: "Apr", value: 105800 },
    { label: "May", value: 99200 },
    { label: "Jun", value: 108700 },
    { label: "Jul", value: 98400 },
    { label: "Aug", value: 112300 },
    { label: "Sep", value: 128450 },
  ],
};

export default function RevenueChart() {
  const [period, setPeriod] = useState<string>("12M");
  const data = allData[period];
  const maxValue = Math.max(...data.map((d) => d.value));

  return (
    <div className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 rounded-2xl p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-zinc-100">Revenue Overview</h3>
          <p className="text-xs sm:text-sm text-zinc-500 mt-0.5">Monthly revenue breakdown</p>
        </div>
        {/* Period tabs */}
        <div className="flex items-center self-start sm:self-auto bg-zinc-950 rounded-lg border border-zinc-800 p-0.5">
          {Object.keys(allData).map((key) => (
            <button
              key={key}
              onClick={() => setPeriod(key)}
              className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-md text-[11px] sm:text-xs font-semibold transition-all cursor-pointer ${
                period === key
                  ? "bg-rose-600 text-white shadow-md shadow-rose-900/30"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              {key}
            </button>
          ))}
        </div>
      </div>

      {/* Chart with horizontal scroll safety on mobile */}
      <div className="overflow-x-auto pb-1 scrollbar-none">
        <div className="flex items-end gap-1.5 sm:gap-2 h-44 sm:h-52 min-w-[280px]">
          {data.map((item, idx) => {
            const heightPercent = (item.value / maxValue) * 100;
            return (
              <div
                key={`${period}-${idx}`}
                className="flex-1 flex flex-col items-center gap-2 group"
              >
                {/* Tooltip */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity text-xs font-semibold text-zinc-200 bg-zinc-800 border border-zinc-700 px-2 py-1 rounded-md shadow-lg whitespace-nowrap">
                  ${item.value.toLocaleString()}
                </div>
                {/* Bar */}
                <div className="w-full flex justify-center">
                  <div
                    className="w-full max-w-[48px] rounded-t-lg bg-gradient-to-t from-rose-700 to-rose-500 group-hover:from-rose-600 group-hover:to-rose-400 transition-all duration-300 shadow-md shadow-rose-900/10"
                    style={{ height: `${heightPercent}%`, minHeight: "8px" }}
                  />
                </div>
                {/* Label */}
                <span className="text-[11px] text-zinc-500 font-medium mt-1">
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}