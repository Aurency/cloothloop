import Image from "next/image";
import Link from "next/link";  // Mengimpor Link dari Next.js
import Logo from "/assets/png/cloohloop_logo.png";  // Correct path

const navLinks = [
    { name: "Home", href: "/USER" },
    { name: "Partner with us", href: "/USER/partner" },
    { name: "Chat us", href: "/USER/chat" },
    { name: "Help", href: "/USER/help" },
    { name: "Login", href: "/USER/auth/signin" }
];

console.log(navLinks);

export function Navbar() {
    return ( 
        <nav className="bg-[#0A4635] flex w-full items-center justify-between lg-container lg:mx-auto lg:px-21 px-[20px] py-[16px]">
            <div>
                <Image src={Logo} alt="Logo" />
            </div>
            <div className="flex gap-x-10 p-5">
                {navLinks.map((item, index) => (
                    <Link href={item.href} key={index}>
                        <span className="text-[#F2E8D8] font-medium hover:underline">
                            {item.name}
                        </span>
                    </Link>
                ))}
            </div>
        </nav>
    );
}
