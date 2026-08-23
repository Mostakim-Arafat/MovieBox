import Link from "next/link";
import { MdOutlineSearch } from "react-icons/md";
import { MdOutlineExpandMore } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { PiDotsSixVerticalFill } from "react-icons/pi";

function Navbar() {
    return (  
        <div className = "flex justify-between px-1 py-1.5 border-b-2 border-red-400 items-center">
            <div className="flex justify-between items-center space-x-2">
                <div>Logo</div>
                <button className="btn btn-neutral">Home</button>
                <Link href={"/"} className="font-bold">Movies</Link>
                <Link href={"/"} className="font-bold">Tv Shows</Link>

            </div>
            <div className="flex justify-between items-center space-x-2">
                <MdOutlineSearch></MdOutlineSearch>
                <p className="flex gap-0.5 items-center">EN <MdOutlineExpandMore></MdOutlineExpandMore></p>
                <PiDotsSixVerticalFill></PiDotsSixVerticalFill>
                <CgProfile></CgProfile>
                <h1 className="btn btn-primary">Join moviebox</h1>
            </div>
        </div>
    );
}

export default Navbar;