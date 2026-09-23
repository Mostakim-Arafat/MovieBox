"use client";

import React from "react";
import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
} from "lucide-react";

export interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    totalItems?: number;
    pageSize?: number;
    pageSizeOptions?: number[];
    onPageSizeChange?: (size: number) => void;
    showPageSize?: boolean;
    showSummary?: boolean;
    itemName?: string;
    className?: string;
}

export default function Pagination({
    currentPage,
    totalPages,
    onPageChange,
    totalItems,
    pageSize,
    pageSizeOptions = [12, 24, 36, 48],
    onPageSizeChange,
    showPageSize = false,
    showSummary = true,
    itemName = "items",
    className = "",
}: PaginationProps) {
    if (totalPages <= 1 && (!totalItems || totalItems <= (pageSize || 10))) {
        if (!totalItems || totalItems === 0) return null;
    }

    const safeCurrent = Math.max(1, Math.min(currentPage, Math.max(1, totalPages)));

    // Generate page numbers with ellipses
    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const maxPagesToShow = 5;

        if (totalPages <= maxPagesToShow + 2) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            pages.push(1);

            let start = Math.max(2, safeCurrent - 1);
            let end = Math.min(totalPages - 1, safeCurrent + 1);

            if (safeCurrent <= 3) {
                end = 4;
            } else if (safeCurrent >= totalPages - 2) {
                start = totalPages - 3;
            }

            if (start > 2) {
                pages.push("ellipsis-start");
            }

            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            if (end < totalPages - 1) {
                pages.push("ellipsis-end");
            }

            pages.push(totalPages);
        }

        return pages;
    };

    const handlePageClick = (page: number) => {
        if (page >= 1 && page <= totalPages && page !== safeCurrent) {
            onPageChange(page);
        }
    };

    // Calculate item range for summary
    const startItem = totalItems !== undefined && pageSize
        ? Math.min(totalItems, (safeCurrent - 1) * pageSize + 1)
        : null;
    const endItem = totalItems !== undefined && pageSize
        ? Math.min(totalItems, safeCurrent * pageSize)
        : null;

    return (
        <div
            className={`flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-2 select-none ${className}`}
        >
            {/* Summary info and page size selector */}
            <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-neutral-400">
                {showSummary && totalItems !== undefined && (
                    <span>
                        Showing{" "}
                        <span className="font-semibold text-white">
                            {totalItems === 0 ? 0 : `${startItem}–${endItem}`}
                        </span>{" "}
                        of <span className="font-semibold text-white">{totalItems}</span> {itemName}
                    </span>
                )}

                {showPageSize && onPageSizeChange && pageSize && (
                    <div className="flex items-center gap-1.5 ml-0 sm:ml-2">
                        <span className="text-neutral-500">Per page:</span>
                        <select
                            value={pageSize}
                            onChange={(e) => onPageSizeChange(Number(e.target.value))}
                            className="bg-neutral-900 border border-neutral-700/80 rounded-md px-2 py-1 text-xs text-neutral-200 focus:outline-none focus:border-rose-500 transition-colors cursor-pointer"
                        >
                            {pageSizeOptions.map((opt) => (
                                <option key={opt} value={opt}>
                                    {opt}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex items-center gap-1.5">
                    {/* Jump to first page */}
                    <button
                        type="button"
                        onClick={() => handlePageClick(1)}
                        disabled={safeCurrent === 1}
                        aria-label="First page"
                        className="hidden sm:inline-flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-800 bg-neutral-900/80 text-neutral-400 hover:text-white hover:border-neutral-700 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
                    >
                        <ChevronsLeft className="h-4 w-4" />
                    </button>

                    {/* Previous page */}
                    <button
                        type="button"
                        onClick={() => handlePageClick(safeCurrent - 1)}
                        disabled={safeCurrent === 1}
                        aria-label="Previous page"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-800 bg-neutral-900/80 text-neutral-300 hover:text-white hover:border-neutral-700 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </button>

                    {/* Page Numbers */}
                    <div className="flex items-center gap-1">
                        {getPageNumbers().map((pageItem, index) => {
                            if (typeof pageItem === "string") {
                                return (
                                    <span
                                        key={`ellipsis-${index}`}
                                        className="inline-flex h-8 w-6 items-center justify-center text-neutral-500 text-xs"
                                    >
                                        •••
                                    </span>
                                );
                            }

                            const isActive = pageItem === safeCurrent;

                            return (
                                <button
                                    key={pageItem}
                                    type="button"
                                    onClick={() => handlePageClick(pageItem)}
                                    aria-current={isActive ? "page" : undefined}
                                    className={`inline-flex h-8 min-w-[32px] px-2 items-center justify-center rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                                        isActive
                                            ? "bg-rose-600 text-white shadow-lg shadow-rose-600/30 border border-rose-500"
                                            : "border border-neutral-800 bg-neutral-900/80 text-neutral-300 hover:border-neutral-700 hover:text-white hover:bg-neutral-800/80"
                                    }`}
                                >
                                    {pageItem}
                                </button>
                            );
                        })}
                    </div>

                    {/* Next page */}
                    <button
                        type="button"
                        onClick={() => handlePageClick(safeCurrent + 1)}
                        disabled={safeCurrent === totalPages}
                        aria-label="Next page"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-800 bg-neutral-900/80 text-neutral-300 hover:text-white hover:border-neutral-700 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </button>

                    {/* Jump to last page */}
                    <button
                        type="button"
                        onClick={() => handlePageClick(totalPages)}
                        disabled={safeCurrent === totalPages}
                        aria-label="Last page"
                        className="hidden sm:inline-flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-800 bg-neutral-900/80 text-neutral-400 hover:text-white hover:border-neutral-700 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
                    >
                        <ChevronsRight className="h-4 w-4" />
                    </button>
                </div>
            )}
        </div>
    );
}