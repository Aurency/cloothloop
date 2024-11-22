import Image from "next/image";
import Logo from "../../public/assets/cloohloop_logo.png";
import { HiUserCircle } from "react-icons/hi";

export function Navbar() {
    return ( 
            <nav className="flex w-full items-center justify-between px-[10px] py-[8px]">
                <div>
                    <Image src={Logo} alt="Logo" />
                </div>

                <div className="flex gap-x-5">
                    <div>
                    <HiUserCircle />
                    <span className="text-slate-900 flex-col"> Profile</span>
                    </div>
                </div>






            </nav>
     
    );
}