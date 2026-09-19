export default function MovieDetailsLoading() {
    return (
        <main className="min-h-screen animate-pulse bg-black text-white">
            <div className="relative h-[55vh] min-h-[360px] w-full bg-neutral-900 sm:h-[65vh]">
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 px-4 pb-8 sm:px-8 lg:px-12">
                    <div className="h-6 w-24 rounded-full bg-neutral-800" />
                    <div className="mt-4 h-10 w-2/3 max-w-xl rounded-lg bg-neutral-800 sm:h-14" />
                </div>
            </div>

            <div className="mx-auto max-w-5xl px-4 pb-16 pt-6 sm:px-8 lg:px-12">
                <div className="flex flex-wrap gap-3">
                    <div className="h-12 w-36 rounded-xl bg-neutral-800" />
                    <div className="h-12 w-32 rounded-full bg-neutral-800" />
                    <div className="h-12 w-24 rounded-full bg-neutral-800" />
                </div>
                <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {[1, 2, 3, 4].map((item) => (
                        <div key={item} className="h-24 rounded-xl bg-neutral-900" />
                    ))}
                </div>
                <div className="mt-8 h-32 rounded-xl bg-neutral-900" />
            </div>
        </main>
    );
}