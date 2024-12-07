"use client";

import Image from "next/image";
import Link from "next/link";

const navLinks = [
  { name: "Home", href: "/industri" },
  { name: "Activity", href: "/industri/delivery" },
  { name: "Profile", href: "/industri/profil" }
];

export function Sidebar2() {
  return (
    <div className="w-60 h-screen bg-white p-5 fixed top-0 left-0 shadow-sm border-r-[#0A4635]/50 border-r-2">
      {/* Logo Section */}
       <div className ="items-center justify-center">
                {/* Path ke gambar di folder public */}
                <Image 
                    src="/assets/logo-hijau.png" // Path yang benar
                    alt="Cloohloop Logo"
                    width={150} // Tentukan lebar gambar
                    height={50} // Tentukan tinggi gambar
                />
            </div>

      {/* Menu Section */}
      <ul className="space-y-4 mt-10">
        {navLinks.map((item, index) => (
          <li key={index}>
            <Link href={item.href}
             className="flex items-center text-md font-medium text-[#0A4635] hover:bg-[#E8F5E9] p-2 rounded-md ">
              <span className="mr-3">{item.name}</span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="border-t-2 border-[#0A4635]/50 mt-3">
        <li className="mt-3 flex items-center text-md font-medium text-[#0A4635] hover:bg-[#E8F5E9] p-2 rounded-md cursor-pointer"
          >
          Logout {/* blmpa bisa kasih logout jadi button nya mo saja dlu diksih muncul alias ndbisa dipencet :'( */}
        </li>
      </div>
    </div>
  );
}