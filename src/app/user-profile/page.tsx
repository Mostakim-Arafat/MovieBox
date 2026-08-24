"use client";

import { useState } from "react";

export default function UserProfilePage() {
    const [activeTab, setActiveTab] = useState("profile");
    const [isDark, setIsDark] = useState(false);

    const user = {
        name: "Alomgir Hossain",
        username: "alomgir",
        avatar: "https://i.pravatar.cc/300?img=12",
    };

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

                        <button
                            onClick={() => setIsDark(!isDark)}
                            className="shrink-0 rounded-full border border-gray-300 px-3 py-2 text-sm hover:bg-gray-100 sm:px-4 dark:border-gray-700 dark:hover:bg-gray-800"
                        >
                            {isDark ? "🌙 Dark" : "☀️ Light"}
                        </button>
                    </div>

                    {/* Main Grid: Sidebar + Content */}
                    <div className="grid gap-6 lg:grid-cols-[280px_1fr] lg:gap-8">
                        {/* Sidebar */}
                        <aside className="h-fit rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
                            {/* Avatar + Name */}
                            <div className="flex flex-col items-center text-center">
                                <img
                                    src={user.avatar}
                                    alt={user.name}
                                    className="h-20 w-20 rounded-full border-4 border-gray-100 object-cover sm:h-24 sm:w-24 dark:border-gray-800"
                                />
                                <h2 className="mt-4 text-lg font-bold sm:text-xl">
                                    {user.name}
                                </h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    @{user.username}
                                </p>
                            </div>

                            {/* Tab Navigation */}
                            <div className="mt-6 flex gap-2 overflow-x-auto lg:mt-8 lg:flex-col lg:gap-2 lg:overflow-visible">
                                <button
                                    onClick={() => setActiveTab("profile")}
                                    className={`whitespace-nowrap rounded-lg px-4 py-3 text-left text-sm transition sm:text-base ${
                                        activeTab === "profile"
                                            ? "bg-black text-white dark:bg-white dark:text-black"
                                            : "hover:bg-gray-100 dark:hover:bg-gray-800"
                                    }`}
                                >
                                    👤 Profile Information
                                </button>

                                <button
                                    onClick={() => setActiveTab("security")}
                                    className={`whitespace-nowrap rounded-lg px-4 py-3 text-left text-sm transition sm:text-base ${
                                        activeTab === "security"
                                            ? "bg-black text-white dark:bg-white dark:text-black"
                                            : "hover:bg-gray-100 dark:hover:bg-gray-800"
                                    }`}
                                >
                                    🔒 Security
                                </button>

                                <button
                                    onClick={() => setActiveTab("settings")}
                                    className={`whitespace-nowrap rounded-lg px-4 py-3 text-left text-sm transition sm:text-base ${
                                        activeTab === "settings"
                                            ? "bg-black text-white dark:bg-white dark:text-black"
                                            : "hover:bg-gray-100 dark:hover:bg-gray-800"
                                    }`}
                                >
                                    ⚙️ Preferences
                                </button>
                            </div>
                        </aside>

                        {/* Content area - placeholder for now */}
                        <section className="rounded-2xl border border-gray-200 bg-white p-6 md:p-8 dark:border-gray-800 dark:bg-gray-900">
                            <p className="text-gray-500 dark:text-gray-400">
                                Content for &quot;{activeTab}&quot; tab will go here (next step).
                            </p>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
}