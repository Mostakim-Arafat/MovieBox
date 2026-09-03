"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MdOutlineSearch } from "react-icons/md";
import { MdOutlineExpandMore } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { PiDotsSixVerticalFill } from "react-icons/pi";
import { authClient } from "@/lib/auth-client";
import ThemeToggle from "@/UI/TToggle";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

function Navbar() {

    const [query, setQuery] = useState('')
    const [isOpen, setIsOpen] = useState(false)
    const [movies, setmovies] = useState<any[]>([])
    const router = useRouter()


    const handleLogOut = async () => {
        await authClient.signOut()
    }

    // window.location.reload()
    const { data } = authClient.useSession()
    const pathname = usePathname()

    const isHome = pathname === "/" || pathname === ""
    const isMovies = pathname?.startsWith("/movies")
    const isTV = pathname?.startsWith("/tv")

    // console.log(data?.user, pathname)
    console.log(query)

    useEffect(() => {
        if (query.trim() === "") {
            setIsOpen(false)
        } else {
            setIsOpen(true)
        }

        const fetchData = async () => {
            const coming = await fetch(`/api/movies/search?q=${encodeURIComponent(query)}`)
            const data = await coming.json()
            setmovies(data)
        }
        const timer = setTimeout(fetchData, 300);
        return () => clearTimeout(timer)
    }, [query])

    return (
        <nav className="flex  items-center justify-between border-b border-border bg-background/95 px-6 py-3 text-foreground backdrop-blur-sm">
            <div className="lg:hidden">
                <h1 className="flex items-center gap-2"><span>Menu</span><MdOutlineExpandMore size={20} /></h1>
            </div>
            <div className="hidden items-center space-x-6 lg:flex">
            <div className="flex min-w-[200px] flex-col items-start">
            <Link href="/" className="group mb-4 flex items-center gap-2">
              <svg
                className="h-7 w-7 text-rose-600 transition-transform duration-300 group-hover:scale-110"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
                />
              </svg>
              <span className="text-xl font-black tracking-wider text-foreground">
                MOVIE<span className="text-rose-600">BOX</span>
              </span>
            </Link>
          </div>

                <div className="flex items-center space-x-1 rounded-full bg-muted p-1">
                    <Link
                        href={'/'}
                        className={`px-4 py-1.5 rounded-full text-sm transition ${isHome ? 'bg-foreground text-background font-semibold' : 'text-zinc-300 hover:text-white font-medium'}`}
                    >
                        Home
                    </Link>
                    <Link
                        href={'/movies'}
                        className={`px-4 py-1.5 rounded-full text-sm transition ${isMovies ? 'bg-foreground text-background font-semibold' : 'text-zinc-300 hover:text-white font-medium'}`}
                    >
                        Movies
                    </Link>
                    <Link
                        href={'/tv'}
                        className={`px-4 py-1.5 rounded-full text-sm transition ${isTV ? 'bg-foreground text-background font-semibold' : 'text-muted-foreground hover:text-foreground font-medium'}`}
                    >
                        TV shows
                    </Link>
                </div>
            </div>

            <div className="flex  items-center space-x-5 text-muted-foreground">
                {/* <button aria-label="Search" className="transition hover:text-foreground">
                    <MdOutlineSearch size={20} />
                </button> */}


                {/* // search button */}
                <label className="input">
                    <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <g
                            strokeLinejoin="round"
                            strokeLinecap="round"
                            strokeWidth="2.5"
                            fill="none"
                            stroke="currentColor"
                        >
                            <circle cx="11" cy="11" r="8"></circle>
                            <path d="m21 21-4.3-4.3"></path>
                        </g>
                    </svg>
                    <input type="search" required placeholder="Search" value={query} onChange={(e) => { setQuery(e.target.value) }} />
                </label>

                {isOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-background border border-border rounded-lg shadow-xl max-h-80 overflow-y-auto z-50 divide-y divide-border">
                        {movies.length > 0 ? (
                            movies.map((movie) => (
                                <div
                                    key={movie._id.toString()}
                                    onClick={() => {
                                        setIsOpen(false);
                                        setQuery("");
                                        router.push(`/movies/${movie._id}`);
                                    }}
                                    className="flex items-center gap-3 p-3 hover:bg-muted cursor-pointer transition"
                                >
                                    <img src={movie.poster} alt={movie.title} className="w-10 h-14 object-cover rounded" />
                                    <div className="flex flex-col text-sm">
                                        <span className="font-semibold text-foreground">{movie.title}</span>
                                        <span className="text-xs text-muted-foreground">{movie.year}</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-4 text-center text-sm text-muted-foreground">
                                Not found
                            </div>
                        )}
                    </div>
                )}

                <div className="flex cursor-pointer items-center space-x-1 text-sm font-medium transition hover:text-foreground">
                    <span>EN</span>
                    <MdOutlineExpandMore size={18} />
                </div>

                <button aria-label="Apps" className="hidden transition hover:text-foreground lg:block">
                    <PiDotsSixVerticalFill size={20} />
                </button>

                <ThemeToggle />

                {
                    data?.user ?
                        <div className="flex items-center gap-4">
                            <Link href={"/Profile"} aria-label="Profile" className="transition hover:text-foreground">
                                <CgProfile size={20} />
                            </Link>
                            <button className="btn btn-warning" onClick={handleLogOut}>
                                Logout
                            </button>
                        </div>
                        :
                        <Link
                            href={"/login"}
                            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 shrink-0"
                        >
                            Join MovieBox
                        </Link>
                }
            </div>
        </nav>
    );
}

export default Navbar;