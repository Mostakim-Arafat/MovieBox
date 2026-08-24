"use client";

import { useState } from "react";

export default function UserProfilePage() {
    const [activeTab, setActiveTab] = useState("profile");
    const [isDark, setIsDark] = useState(false);

    return (
        <div className={isDark ? "dark" : ""}>
            <main className="min-h-screen bg-gray-50 px-4 py-6 text-gray-900 sm:px-6 sm:py-10 dark:bg-gray-950 dark:text-white">
                <div className="mx-auto max-w-6xl">
                    {/* Header */}
                    <div className="mb-6 flex items-start justify-between gap-4 sm:mb-8">
                        <div>
                            <h1 className="text-2xl font-bold sm:text-3xl">
                                My Profile
                            </h1>
                            <p className="mt-2 text-sm text-gray-500 sm:text-base dark:text-gray-400">
                                Manage your personal information and account settings.
                            </p>
                        </div>

                        {/* Theme Toggle Button */}
                        <button
                            onClick={() => setIsDark(!isDark)}
                            className="shrink-0 rounded-full border border-gray-300 px-3 py-2 text-sm hover:bg-gray-100 sm:px-4 dark:border-gray-700 dark:hover:bg-gray-800"
                        >
                            {isDark ? "🌙 Dark" : "☀️ Light"}
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}