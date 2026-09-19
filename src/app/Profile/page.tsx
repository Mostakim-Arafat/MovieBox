"use client";

import { ChangeEvent, useRef, useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

type UserData = {
    name: string;
    email: string;
    phone: string;
    location: string;
    avatar: string;
};

export default function UserProfilePage() {
    const [activeTab, setActiveTab] = useState("profile");
    const [isEditing, setIsEditing] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

     const {data} = authClient.useSession()
    console.log(data?.user?.name)

    const [user, setUser] = useState<UserData>({
        name: data?.user?.name ?? "",
        email: data?.user?.email ?? "",
        phone: "+880 1XXX-XXXXXX",
        location: "dhaka",
        avatar: data?.user?.image ?? ""
    });

   

    const [formData, setFormData] = useState<UserData>(user);

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleAvatarClick = () => {
        if (!isEditing) return;
        fileInputRef.current?.click();
    };

    const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        const uploadToast = toast.loading("Uploading photo...");

        try {
            const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

            if (!apiKey) {
                toast.error("imgbb API key is missing. Check .env.local", {
                    id: uploadToast,
                });
                setIsUploading(false);
                return;
            }

            const form = new FormData();
            form.append("image", file);

            const res = await fetch(
                `https://api.imgbb.com/1/upload?key=${apiKey}`,
                {
                    method: "POST",
                    body: form,
                }
            );

            const data = await res.json();

            if (data.success) {
                const imageUrl = data.data.url as string;
                setFormData((prev) => ({ ...prev, avatar: imageUrl }));
                toast.success("Photo uploaded!", { id: uploadToast });
            } else {
                toast.error("Upload failed. Try again.", { id: uploadToast });
            }
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong while uploading.", {
                id: uploadToast,
            });
        } finally {
            setIsUploading(false);
        }
    };

    const handleSave = () => {
        setUser(formData);
        setIsEditing(false);
        toast.success("Profile updated successfully!");
    };

    const handleCancel = () => {
        setFormData(user);
        setIsEditing(false);
        toast("Changes discarded", { icon: "↩️" });
    };
    const router = useRouter();

    useEffect(() => {
        if (!data?.user) {
            router.push('/login');
        }
    }, [data?.user, router]);

    if (!data?.user) {
        return null;
    }

    return (
        <>
            <Toaster position="top-center" />

            <main className="min-h-screen bg-background px-3 py-5 text-foreground sm:px-6 sm:py-10">
                <div className="mx-auto min-w-0 max-w-6xl">
                    {/* Header */}
                    <div className="mb-6 flex min-w-0 items-start justify-between gap-4 sm:mb-8">
                        <div className="min-w-0">
                            <h1 className="wrap-break-word text-2xl font-bold sm:text-3xl">
                                My Profile
                            </h1>
                            <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                                Manage your personal information and account settings.
                            </p>
                        </div>
                    </div>

                    {/* Main Grid: Sidebar + Content */}
                    <div className="grid min-w-0 gap-4 sm:gap-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-8">
                        {/* Sidebar */}
                        <aside className="h-fit min-w-0 rounded-2xl border border-border bg-card p-4 sm:p-5">
                            <div className="flex flex-col items-center text-center">
                                <img
                                    src={user.avatar || "./random.png"}
                                    alt={user.name}
                                    className="h-20 w-20 rounded-full border-4 border-border object-cover sm:h-24 sm:w-24"
                                />
                                <h2 className="mt-4 text-lg font-bold sm:text-xl">
                                    {user.name}
                                </h2>
                            </div>

                            <div className="mt-6 grid gap-2 lg:mt-8 lg:flex lg:flex-col">
                                <button
                                    onClick={() => setActiveTab("profile")}
                                    className={`shrink-0 whitespace-nowrap rounded-lg px-4 py-3 text-left text-sm transition sm:text-base ${activeTab === "profile"
                                            ? "bg-primary text-primary-foreground"
                                            : "hover:bg-muted"
                                        }`}
                                >
                                    👤 Profile Information
                                </button>

                                <button
                                    onClick={() => setActiveTab("security")}
                                    className={`shrink-0 whitespace-nowrap rounded-lg px-4 py-3 text-left text-sm transition sm:text-base ${activeTab === "security"
                                            ? "bg-primary text-primary-foreground"
                                            : "hover:bg-muted"
                                        }`}
                                >
                                    🔒 Security
                                </button>

                                <button
                                    onClick={() => setActiveTab("settings")}
                                    className={`shrink-0 whitespace-nowrap rounded-lg px-4 py-3 text-left text-sm transition sm:text-base ${activeTab === "settings"
                                            ? "bg-primary text-primary-foreground"
                                            : "hover:bg-muted"
                                        }`}
                                >
                                    ⚙️ Preferences
                                </button>
                            </div>
                        </aside>

                        {/* Content */}
                        <section className="min-w-0 rounded-2xl border border-border bg-card p-4 sm:p-6 md:p-8">
                            {/* PROFILE TAB */}
                            {activeTab === "profile" && (
                                <>
                                    <div className="flex flex-col items-start justify-between gap-4 border-b border-border pb-6 sm:flex-row sm:items-center">
                                        <div className="min-w-0">
                                            <h2 className="text-xl font-bold sm:text-2xl">
                                                Profile Information
                                            </h2>
                                            <p className="mt-1 text-sm text-muted-foreground">
                                                Update your personal information.
                                            </p>
                                        </div>

                                        {!isEditing ? (
                                            <button
                                                onClick={() => setIsEditing(true)}
                                                className="w-full rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-80 sm:w-auto sm:text-base"
                                            >
                                                Edit Profile
                                            </button>
                                        ) : (
                                            <div className="flex w-full gap-3 sm:w-auto">
                                                <button
                                                    onClick={handleCancel}
                                                    className="flex-1 rounded-lg border border-border bg-background px-5 py-2.5 text-sm transition hover:bg-muted sm:flex-none sm:text-base"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={handleSave}
                                                    disabled={isUploading}
                                                    className="flex-1 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none sm:text-base"
                                                >
                                                    Save Changes
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {/* Avatar Upload */}
                                    <div className="mt-8 flex min-w-0 flex-col gap-5 sm:flex-row sm:items-center">
                                        <div
                                            onClick={handleAvatarClick}
                                            className={`group relative h-24 w-24 shrink-0 rounded-full sm:h-28 sm:w-28 ${isEditing ? "cursor-pointer" : ""
                                                }`}
                                        >
                                            <img
                                                src={isEditing ? formData.avatar : user.avatar}
                                                alt="Profile"
                                                className={`h-24 w-24 rounded-full object-cover sm:h-28 sm:w-28 ${isEditing
                                                        ? "opacity-90 transition group-hover:opacity-50"
                                                        : ""
                                                    }`}
                                            />

                                            {isEditing && (
                                                <div className="absolute inset-0 flex items-center justify-center rounded-full bg-foreground/20 text-xs font-medium text-background opacity-0 transition group-hover:bg-foreground/40 group-hover:opacity-100">
                                                    {isUploading ? "Uploading..." : "Change"}
                                                </div>
                                            )}

                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={handleImageChange}
                                            />
                                        </div>

                                        <div className="min-w-0">
                                            <h3 className="font-semibold">Profile Picture</h3>
                                            <p className="mt-1 wrap-break-word text-sm text-muted-foreground">
                                                {isEditing
                                                    ? "Click on the photo to upload a new one."
                                                    : "Click Edit Profile to change your photo."}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Form Fields */}
                                    <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
                                        <div>
                                            <label className="mb-2 block text-sm font-medium text-foreground">
                                                Full Name
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={isEditing ? formData.name : user.name}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary disabled:cursor-not-allowed disabled:opacity-70 sm:text-base"
                                            />
                                        </div>


                                        <div>
                                            <label className="mb-2 block text-sm font-medium text-foreground">
                                                Email Address
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={isEditing ? formData.email : user.email}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary disabled:cursor-not-allowed disabled:opacity-70 sm:text-base"
                                            />
                                        </div>

                                        <div>
                                            <label className="mb-2 block text-sm font-medium text-foreground">
                                                Phone Number
                                            </label>
                                            <input
                                                type="text"
                                                name="phone"
                                                value={isEditing ? formData.phone : user.phone}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary disabled:cursor-not-allowed disabled:opacity-70 sm:text-base"
                                            />
                                        </div>

                                        <div>
                                            <label className="mb-2 block text-sm font-medium text-foreground">
                                                Location
                                            </label>
                                            <input
                                                type="text"
                                                name="location"
                                                value={isEditing ? formData.location : user.location}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary disabled:cursor-not-allowed disabled:opacity-70 sm:text-base"
                                            />
                                        </div>

                                    </div>
                                </>
                            )}

                            {/* SECURITY TAB */}
                            {activeTab === "security" && (
                                <div>
                                    <div className="border-b border-border pb-6">
                                        <h2 className="text-xl font-bold sm:text-2xl">
                                            Security Settings
                                        </h2>
                                        <p className="mt-1 text-sm text-muted-foreground">
                                            Manage your account security.
                                        </p>
                                    </div>

                                    <div className="mt-8 space-y-5">
                                        <div className="flex flex-col justify-between gap-4 rounded-xl border border-border bg-background p-5 sm:flex-row sm:items-center">
                                            <div>
                                                <h3 className="font-semibold">
                                                    Change Password
                                                </h3>
                                                <p className="mt-1 text-sm text-muted-foreground">
                                                    Keep your account secure with a strong password.
                                                </p>
                                            </div>

                                            <button
                                                onClick={() =>
                                                    toast(
                                                        "Password update API will be connected later.",
                                                        { icon: "🔧" }
                                                    )
                                                }
                                                className="w-full shrink-0 rounded-lg border border-border bg-background px-4 py-2.5 text-sm transition hover:bg-muted sm:w-auto"
                                            >
                                                Change Password
                                            </button>
                                        </div>

                                        <div className="flex flex-col justify-between gap-4 rounded-xl border border-border bg-background p-5 sm:flex-row sm:items-center">
                                            <div>
                                                <h3 className="font-semibold">
                                                    Two-Factor Authentication
                                                </h3>
                                                <p className="mt-1 text-sm text-muted-foreground">
                                                    Add an extra layer of security to your account.
                                                </p>
                                            </div>

                                            <button
                                                onClick={() =>
                                                    toast(
                                                        "Two-factor authentication coming soon.",
                                                        { icon: "🔧" }
                                                    )
                                                }
                                                className="w-full shrink-0 rounded-lg border border-border bg-background px-4 py-2.5 text-sm transition hover:bg-muted sm:w-auto"
                                            >
                                                Enable
                                            </button>
                                        </div>

                                        <div className="flex flex-col justify-between gap-4 rounded-xl border border-border bg-background p-5 sm:flex-row sm:items-center">
                                            <div>
                                                <h3 className="font-semibold">
                                                    Active Sessions
                                                </h3>
                                                <p className="mt-1 text-sm text-muted-foreground">
                                                    See where you&apos;re currently logged in.
                                                </p>
                                            </div>

                                            <button
                                                onClick={() =>
                                                    toast(
                                                        "Session list API will be connected later.",
                                                        { icon: "🔧" }
                                                    )
                                                }
                                                className="w-full shrink-0 rounded-lg border border-border bg-background px-4 py-2.5 text-sm transition hover:bg-muted sm:w-auto"
                                            >
                                                View Sessions
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* PREFERENCES / SETTINGS TAB */}
                            {activeTab === "settings" && (
                                <div>
                                    <div className="border-b border-border pb-6">
                                        <h2 className="text-xl font-bold sm:text-2xl">
                                            Preferences
                                        </h2>
                                        <p className="mt-1 text-sm text-muted-foreground">
                                            Manage your account preferences.
                                        </p>
                                    </div>

                                    <div className="mt-8 space-y-5">
                                        <div className="rounded-xl border border-border bg-background p-5">
                                            <h3 className="font-semibold">
                                                Email Notifications
                                            </h3>
                                            <p className="mt-1 text-sm text-muted-foreground">
                                                Receive notifications about important account activity.
                                            </p>

                                            <button
                                                onClick={() =>
                                                    toast(
                                                        "Notification settings will be connected later.",
                                                        { icon: "🔧" }
                                                    )
                                                }
                                                className="mt-4 w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm transition hover:bg-muted sm:w-auto"
                                            >
                                                Manage Notifications
                                            </button>
                                        </div>

                                        <div className="rounded-xl border border-border bg-background p-5">
                                            <h3 className="font-semibold">
                                                Language & Region
                                            </h3>
                                            <p className="mt-1 text-sm text-muted-foreground">
                                                Choose your preferred language and region.
                                            </p>

                                            <button
                                                onClick={() =>
                                                    toast(
                                                        "Language settings will be connected later.",
                                                        { icon: "🔧" }
                                                    )
                                                }
                                                className="mt-4 w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm transition hover:bg-muted sm:w-auto"
                                            >
                                                Change Language
                                            </button>
                                        </div>

                                        <div className="rounded-xl border border-red-300 bg-red-500/5 p-5 dark:border-red-900">
                                            <h3 className="font-semibold text-red-600">
                                                Delete Account
                                            </h3>
                                            <p className="mt-1 text-sm text-muted-foreground">
                                                This action cannot be undone.
                                            </p>

                                            <button
                                                onClick={() => {
                                                    const confirmDelete = confirm(
                                                        "Are you sure you want to delete your account?"
                                                    );

                                                    if (confirmDelete) {
                                                        toast(
                                                            "Delete account API will be connected later.",
                                                            { icon: "🔧" }
                                                        );
                                                    }
                                                }}
                                                className="mt-4 w-full rounded-lg bg-red-600 px-4 py-2.5 text-sm text-white transition hover:opacity-80 sm:w-auto"
                                            >
                                                Delete Account
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </section>
                    </div>
                </div>
            </main>
        </>
    );

    
}