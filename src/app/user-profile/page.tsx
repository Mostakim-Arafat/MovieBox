"use client";

import { ChangeEvent, useState } from "react";

type UserData = {
    name: string;
    username: string;
    email: string;
    phone: string;
    bio: string;
    location: string;
    website: string;
    avatar: string;
};

export default function UserProfilePage() {
    const [activeTab, setActiveTab] = useState("profile");
    const [isDark, setIsDark] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [message, setMessage] = useState("");

    const [user, setUser] = useState<UserData>({
        name: "Alomgir Hossain",
        username: "alomgir",
        email: "alomgir@example.com",
        phone: "+880 1XXX-XXXXXX",
        bio: "Movie lover and passionate about discovering amazing films.",
        location: "Mymensingh, Bangladesh",
        website: "https://example.com",
        avatar: "https://i.pravatar.cc/300?img=12",
    });

    const [formData, setFormData] = useState<UserData>(user);

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const imageUrl = URL.createObjectURL(file);
        setFormData((prev) => ({ ...prev, avatar: imageUrl }));
    };

    const handleSave = () => {
        setUser(formData);
        setIsEditing(false);
        setMessage("Profile updated successfully!");
        setTimeout(() => setMessage(""), 3000);
    };

    const handleCancel = () => {
        setFormData(user);
        setIsEditing(false);
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

                    {/* Success Message */}
                    {message && (
                        <div className="mb-6 rounded-xl border border-green-500 bg-green-100 px-5 py-4 text-sm text-green-700 sm:text-base dark:bg-green-950 dark:text-green-400">
                            {message}
                        </div>
                    )}

                    {/* Main Grid: Sidebar + Content */}
                    <div className="grid gap-6 lg:grid-cols-[280px_1fr] lg:gap-8">
                        {/* Sidebar */}
                        <aside className="h-fit rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
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

                        {/* Content */}
                        <section className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 md:p-8 dark:border-gray-800 dark:bg-gray-900">
                            {activeTab === "profile" && (
                                <>
                                    {/* Tab Header + Edit Button */}
                                    <div className="flex flex-col justify-between gap-4 border-b border-gray-200 pb-6 sm:flex-row sm:items-center dark:border-gray-800">
                                        <div>
                                            <h2 className="text-xl font-bold sm:text-2xl">
                                                Profile Information
                                            </h2>
                                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                                Update your personal information.
                                            </p>
                                        </div>

                                        {!isEditing ? (
                                            <button
                                                onClick={() => setIsEditing(true)}
                                                className="rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-80 sm:text-base dark:bg-white dark:text-black"
                                            >
                                                Edit Profile
                                            </button>
                                        ) : (
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={handleCancel}
                                                    className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm transition hover:bg-gray-100 sm:text-base dark:border-gray-700 dark:hover:bg-gray-800"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={handleSave}
                                                    className="rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-80 sm:text-base dark:bg-white dark:text-black"
                                                >
                                                    Save Changes
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {/* Avatar Upload */}
                                    <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-center">
                                        <img
                                            src={isEditing ? formData.avatar : user.avatar}
                                            alt="Profile"
                                            className="h-24 w-24 rounded-full object-cover sm:h-28 sm:w-28"
                                        />
                                        <div>
                                            <h3 className="font-semibold">Profile Picture</h3>
                                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                                Upload a new profile picture.
                                            </p>
                                            {isEditing && (
                                                <label className="mt-4 inline-block cursor-pointer rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800">
                                                    Change Photo
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        className="hidden"
                                                        onChange={handleImageChange}
                                                    />
                                                </label>
                                            )}
                                        </div>
                                    </div>

                                    {/* Form Fields */}
                                    <div className="mt-8 grid gap-6 sm:grid-cols-2">
                                        <div>
                                            <label className="mb-2 block text-sm font-medium">
                                                Full Name
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={isEditing ? formData.name : user.name}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                                className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-3 text-sm outline-none transition focus:border-black disabled:cursor-not-allowed disabled:opacity-70 sm:text-base dark:border-gray-700 dark:focus:border-white"
                                            />
                                        </div>

                                        <div>
                                            <label className="mb-2 block text-sm font-medium">
                                                Username
                                            </label>
                                            <input
                                                type="text"
                                                name="username"
                                                value={isEditing ? formData.username : user.username}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                                className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-3 text-sm outline-none transition focus:border-black disabled:cursor-not-allowed disabled:opacity-70 sm:text-base dark:border-gray-700 dark:focus:border-white"
                                            />
                                        </div>

                                        <div>
                                            <label className="mb-2 block text-sm font-medium">
                                                Email Address
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={isEditing ? formData.email : user.email}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                                className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-3 text-sm outline-none transition focus:border-black disabled:cursor-not-allowed disabled:opacity-70 sm:text-base dark:border-gray-700 dark:focus:border-white"
                                            />
                                        </div>

                                        <div>
                                            <label className="mb-2 block text-sm font-medium">
                                                Phone Number
                                            </label>
                                            <input
                                                type="text"
                                                name="phone"
                                                value={isEditing ? formData.phone : user.phone}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                                className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-3 text-sm outline-none transition focus:border-black disabled:cursor-not-allowed disabled:opacity-70 sm:text-base dark:border-gray-700 dark:focus:border-white"
                                            />
                                        </div>

                                        <div>
                                            <label className="mb-2 block text-sm font-medium">
                                                Location
                                            </label>
                                            <input
                                                type="text"
                                                name="location"
                                                value={isEditing ? formData.location : user.location}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                                className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-3 text-sm outline-none transition focus:border-black disabled:cursor-not-allowed disabled:opacity-70 sm:text-base dark:border-gray-700 dark:focus:border-white"
                                            />
                                        </div>

                                        <div>
                                            <label className="mb-2 block text-sm font-medium">
                                                Website
                                            </label>
                                            <input
                                                type="text"
                                                name="website"
                                                value={isEditing ? formData.website : user.website}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                                className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-3 text-sm outline-none transition focus:border-black disabled:cursor-not-allowed disabled:opacity-70 sm:text-base dark:border-gray-700 dark:focus:border-white"
                                            />
                                        </div>

                                        <div className="sm:col-span-2">
                                            <label className="mb-2 block text-sm font-medium">
                                                Bio
                                            </label>
                                            <textarea
                                                name="bio"
                                                rows={4}
                                                value={isEditing ? formData.bio : user.bio}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                                className="w-full resize-none rounded-lg border border-gray-300 bg-transparent px-4 py-3 text-sm outline-none transition focus:border-black disabled:cursor-not-allowed disabled:opacity-70 sm:text-base dark:border-gray-700 dark:focus:border-white"
                                            />
                                        </div>
                                    </div>
                                </>
                            )}

                            {activeTab === "security" && (
                                <p className="text-gray-500 dark:text-gray-400">
                                    Security settings will go here (next step).
                                </p>
                            )}

                            {activeTab === "settings" && (
                                <p className="text-gray-500 dark:text-gray-400">
                                    Preferences settings will go here (next step).
                                </p>
                            )}
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
}