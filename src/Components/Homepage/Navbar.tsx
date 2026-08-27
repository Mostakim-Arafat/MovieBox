"use client"

import Link from "next/link";
import { MdOutlineSearch } from "react-icons/md";
import { MdOutlineExpandMore } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { PiDotsSixVerticalFill } from "react-icons/pi";
import { authClient } from "@/lib/auth-client";
import ThemeToggle from "@/components/TToggle";

function Navbar() {

    const handleLogOut = async () => {
        await authClient.signOut()
    }
   
    // window.location.reload()
    const {data} = authClient.useSession()
    
    console.log(data?.user)

    return (  
        <nav className="flex items-center justify-between border-b border-border bg-background/95 px-6 py-3 text-foreground backdrop-blur-sm">
            <div className="lg:hidden">
                <h1 className="flex items-center gap-2"><span>Menu</span><MdOutlineExpandMore size={20} /></h1>
            </div>
            <div className="hidden items-center space-x-6 lg:flex">
                <span className="text-lg font-bold lowercase tracking-tight">
                    Movie Box
                </span>
                <div className="flex items-center space-x-1 rounded-full bg-muted p-1">
                    <Link 
                        href={"/"} 
                        className="rounded-full bg-foreground px-4 py-1.5 text-sm font-semibold text-background transition"
                    >
                        Home
                    </Link>
                    <Link 
                        href={"/movies"} 
                        className="px-4 py-1.5 rounded-full text-zinc-300 hover:text-white font-medium text-sm transition"
                    >
                        Movies
                    </Link>
                    <Link 
                        href={"/#"} 
                        className="rounded-full px-4 py-1.5 text-sm font-medium text-muted-foreground transition hover:text-foreground"
                    >
                        TV shows
                    </Link>
                </div>
            </div>

            <div className="flex items-center space-x-5 text-muted-foreground">
                <button aria-label="Search" className="transition hover:text-foreground">
                    <MdOutlineSearch size={20} />
                </button>
                
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
                    className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                    Join MovieBox
                </Link>
                }
            </div>
        </nav>
    );
}

export default Navbar;