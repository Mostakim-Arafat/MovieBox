export default function Loading() {
    return (
        <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-black px-4 text-white">
            {/* Background Glow */}
            <div className="absolute left-1/4 top-1/4 h-72 w-72 animate-pulse rounded-full bg-red-600 opacity-15 blur-[130px]" />
            <div className="absolute bottom-1/4 right-1/4 h-72 w-72 animate-pulse rounded-full bg-purple-600 opacity-15 blur-[130px] delay-700" />

            {/* Spinner + Logo */}
            <div className="relative z-10 flex flex-col items-center">
                <div className="relative flex h-24 w-24 items-center justify-center sm:h-28 sm:w-28">
                    {/* Spinning ring - pure Tailwind, no custom CSS needed */}
                    <div className="h-full w-full animate-spin rounded-full border-4 border-gray-800 border-t-red-600" />

                    {/* Center icon */}
                    <span className="absolute text-3xl sm:text-4xl">🎬</span>
                </div>

                <h2 className="mt-6 bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-xl font-bold tracking-tight text-transparent">
                    MovieBox
                </h2>

                <p className="mt-2 text-sm text-neutral-500">
                    Loading, please wait...
                </p>
            </div>
        </div>
    );
}