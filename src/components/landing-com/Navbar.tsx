import Image from "next/image";
import Link from "next/link";  // Mengimpor Link dari Next.js

const navLinks = [
    { name: "Home", href: "/" },
    { name: "Partner with us", href: "/partner" },
    { name: "Login", href: "/(auth)/signin" }
];

export function Navbar() {
    return ( 
        <nav className="bg-[#0A4635] flex w-full items-center justify-between lg-container lg:mx-auto lg:px-21 px-[20px] py-[16px]">
            <div>
                {/* Path ke gambar di folder public */}
                <Image 
                    src="/assets/cloohloop_logo.png" // Path yang benar
                    alt="Cloohloop Logo"
                    width={150} // Tentukan lebar gambar
                    height={50} // Tentukan tinggi gambar
                />
            </div>
            <div className="flex gap-x-10 p-5">
                {navLinks.map((item, index) => (
                    <Link href={item.href} key={index}>
                        {/* Link sudah menangani <a> tag secara otomatis */}
                        <span className="text-[#F2E8D8] font-medium hover:underline">
                            {item.name}
                        </span>
                    </Link>
                ))}
            </div>
        </nav>
    );
}
