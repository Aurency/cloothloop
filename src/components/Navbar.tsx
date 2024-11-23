import Image from "next/image";
import Logo from "../../public/assets/cloohloop_logo.png";


const navLinks = [
    { name: "Home", href: "/" },
    { name: "Partner with us", href: "/Partner" },
    { name: "Chat us", href: "/Chatus" },
    { name: "Help", href: "/Help" },
    { name : "Login", href: "/Login"}
];

export function Navbar() {
    return ( 
            <nav className="bg-[#0A4635] flex w-full items-center justify-between lg-container lg:mx-auto lg:px-21 px-[20px] py-[16px]">
                <div>
                    <Image src={Logo} alt="Logo" />
                </div>
                <div className="flex gap-x-10 p-5>">
                    {navLinks.map((item, index) => (
                        <p className="text-[#F2E8D8] font-medium hover:underline " key={index}>
                            {item.name}
                        </p>
                    ))}
                </div>
            </nav>
     
    );
}