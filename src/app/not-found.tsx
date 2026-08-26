"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import React from "react";

export default function NotFound(): React.JSX.Element {
    const router = useRouter();

    const floatingIcons = [
        { icon: "🍿", top: "15%", left: "10%", duration: "6s", delay: "0s" },
        { icon: "🎥", top: "70%", left: "8%", duration: "8s", delay: "1s" },
        { icon: "🎬", top: "20%", right: "10%", duration: "7s", delay: "0.5s" },
        { icon: "🍿", top: "75%", right: "12%", duration: "9s", delay: "2s" },
        { icon: "🎫", top: "45%", left: "5%", duration: "5s", delay: "1.5s" },
        { icon: "🎥", top: "50%", right: "6%", duration: "6.5s", delay: "2.5s" },
    ];

    return (
        <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-black px-4 text-white">
            {/* Background Decorative Blobs */}
            <div className="absolute left-1/4 top-1/4 h-72 w-72 animate-pulse rounded-full bg-red-600 opacity-15 blur-[130px]" />
            <div className="absolute bottom-1/4 right-1/4 h-72 w-72 animate-pulse rounded-full bg-purple-600 opacity-15 blur-[130px] delay-700" />

            {/* Floating movie-themed icons */}
            {floatingIcons.map((item, i) => (
                <div
                    key={i}
                    className="absolute animate-bounce text-3xl opacity-40 md:text-4xl"
                    style={{
                        top: item.top,
                        left: item.left,
                        right: item.right,
                        animationDuration: item.duration,
                        animationDelay: item.delay,
                    }}
                >
                    {item.icon}
                </div>
            ))}

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
                        <span className="mt-0.5 text-[10px] font-medium uppercase tracking-widest text-neutral-500">
                            Watch. Discover. Enjoy.
                        </span>
                    </div>
                </div>

                {/* Animated 404 */}
                <div className="relative mb-6 flex h-48 w-48 items-center justify-center">
                    <div className="absolute inset-0 animate-[spin_20s_linear_infinite] rounded-full border-4 border-dashed border-red-500/30" />
                    <div className="absolute inset-3 animate-[spin_3s_linear_infinite] rounded-full border-4 border-b-transparent border-l-transparent border-r-purple-500 border-t-red-500" />
                    <div className="absolute inset-10 rounded-full bg-gradient-to-tr from-red-500 via-red-600 to-purple-600 opacity-70 blur-md" />
                    <h1 className="z-10 text-5xl font-black tracking-tighter text-white drop-shadow-md">
                        404
                    </h1>
                </div>

                {/* Badge */}
                <span className="mb-4 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-red-400">
                    Page Unreachable
                </span>

                {/* Error Message */}
                <h2 className="mb-3 bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent md:text-4xl">
                    Lost in the Movie Universe!
                </h2>

                <p className="mb-8 max-w-md text-sm leading-relaxed text-neutral-400 md:text-base">
                    The page you&apos;re trying to reach has been moved or
                    doesn&apos;t exist. Let&apos;s get you back to the{" "}
                    <span className="font-semibold text-red-400">Home</span>.
                </p>

                {/* Action Buttons */}
                <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row">
                    <Link href="/" className="w-full sm:w-auto">
                        <button className="w-full rounded-full bg-gradient-to-r from-red-500 to-purple-600 px-7 py-3 font-bold text-white shadow-lg shadow-red-500/20 transition-transform duration-300 hover:scale-[1.03] sm:w-40">
                            Back to Home
                        </button>
                    </Link>

                    <button
                        onClick={() => router.back()}
                        className="w-full rounded-full border border-neutral-800 px-7 py-3 font-bold text-neutral-300 transition-transform duration-300 hover:scale-[1.03] hover:border-neutral-700 hover:text-white sm:w-40"
                    >
                        Go Back
                    </button>
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