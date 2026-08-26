"use client";

import { useEffect } from "react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log error to console (later can be sent to error tracking service)
        console.error(error);
    }, [error]);

    return (
        <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-black px-4 text-white">
            {/* Background Glow */}
            <div className="absolute left-1/4 top-1/4 h-72 w-72 animate-pulse rounded-full bg-red-600 opacity-15 blur-[130px]" />
            <div className="absolute bottom-1/4 right-1/4 h-72 w-72 animate-pulse rounded-full bg-purple-600 opacity-15 blur-[130px] delay-700" />

            {/* Main Content */}
            <div className="z-10 flex max-w-xl flex-col items-center text-center">
                {/* Brand Logo */}
                <div className="mb-8 flex select-none items-center gap-2.5 text-xl font-bold tracking-tight">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-red-500 via-red-600 to-purple-600 text-lg shadow-md shadow-red-500/20">
                        🎬
                    </div>
                    <div className="flex flex-col justify-center text-left leading-none">
                        <div className="flex items-center text-lg font-extrabold tracking-tight md:text-xl">
                            <span className="bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
                                Movie
                            </span>
                            <span className="ml-1 text-red-500">Box</span>
                        </div>
                    </div>
                </div>

                {/* Error Icon */}
                <div className="relative mb-6 flex h-32 w-32 items-center justify-center">
                    <div className="absolute inset-0 animate-pulse rounded-full bg-red-600/20 blur-xl" />
                    <span className="z-10 text-6xl">⚠️</span>
                </div>

                {/* Badge */}
                <span className="mb-4 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-red-400">
                    Something Went Wrong
                </span>

                {/* Message */}
                <h2 className="mb-3 bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent md:text-4xl">
                    Oops! An Error Occurred
                </h2>

                <p className="mb-8 max-w-md text-sm leading-relaxed text-neutral-400 md:text-base">
                    Something unexpected happened while loading this page.
                    Don&apos;t worry, you can try again or head back home.
                </p>

                {/* Action Buttons */}
                <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row">
                    <button
                        onClick={() => reset()}
                        className="w-full rounded-full bg-gradient-to-r from-red-500 to-purple-600 px-7 py-3 font-bold text-white shadow-lg shadow-red-500/20 transition-transform duration-300 hover:scale-[1.03] sm:w-40"
                    >
                        Try Again
                    </button>

                    <a href="/">
                        <button className="w-full rounded-full border border-neutral-800 px-7 py-3 font-bold text-neutral-300 transition-transform duration-300 hover:scale-[1.03] hover:border-neutral-700 hover:text-white sm:w-40">
                            Back to Home
                        </button>
                    </a>
                </div>
            </div>

            {/* Footer */}
            <div className="absolute bottom-6 left-0 z-10 w-full text-center">
                <p className="text-xs tracking-wide text-neutral-600">
                    Powered by{" "}
                    <span className="font-semibold text-neutral-400">
                        MovieBox
                    </span>
                </p>
            </div>
        </div>
    );
}