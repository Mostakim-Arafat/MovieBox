"use client"

import Link from "next/link";
import { MdOutlineSearch } from "react-icons/md";
import { MdOutlineExpandMore } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { PiDotsSixVerticalFill } from "react-icons/pi";
import { authClient } from "@/lib/auth-client";

function Navbar() {

    const handleLogOut = async () => {
        await authClient.signOut()
    }

    const {data} = authClient.useSession()
    console.log(data?.user)

    return (  
        <nav className="flex justify-between items-center px-6 py-3 bg-black text-white">
            <div className="lg:hidden">
                <h1 className="flex gap-2 items-center"><span>Menu</span><MdOutlineExpandMore size={20}></MdOutlineExpandMore></h1>
            </div>
            <div className="hidden lg:flex items-center space-x-6 ">
                <span className="font-bold tracking-tight text-lg lowercase">
                    Movie Box
                </span>
                <div className="flex items-center space-x-1 bg-zinc-900/60 p-1 rounded-full">
                    <Link 
                        href={"/"} 
                        className="px-4 py-1.5 rounded-full bg-white text-black font-semibold text-sm transition"
                    >
                        Home
                    </Link>
                    <Link 
                        href={"/#"} 
                        className="px-4 py-1.5 rounded-full text-zinc-300 hover:text-white font-medium text-sm transition"
                    >
                        Movies
                    </Link>
                    <Link 
                        href={"/#"} 
                        className="px-4 py-1.5 rounded-full text-zinc-300 hover:text-white font-medium text-sm transition"
                    >
                        TV shows
                    </Link>
                </div>
            </div>

            <div className="flex items-center space-x-5 text-zinc-300">
                <button aria-label="Search" className="hover:text-white transition">
                    <MdOutlineSearch size={20} />
                </button>
                
                <div className="flex items-center space-x-1 cursor-pointer hover:text-white transition text-sm font-medium">
                    <span>EN</span> 
                    <MdOutlineExpandMore size={18} />
                </div>

                <button aria-label="Apps" className="hidden lg:block hover:text-white transition">
                    <PiDotsSixVerticalFill size={20} />
                </button>

                <Link href={"/Profile"} aria-label="Profile" className="hover:text-white transition">
                    <CgProfile size={20} />
                </Link>
                {
                    data?.user ?
                
                <button className="btn btn-warning" onClick={handleLogOut}>
                    Logout
                </button>
                :
                <Link 
                    href={"/login"} 
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-md text-sm transition"
                >
                    Join MovieBox
                </Link>
                
                }
            </div>
        </nav>
    );
}

export default Navbar;