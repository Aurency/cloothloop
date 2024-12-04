"use client";

import Image from "next/image";
import Link from "next/link";

const navLinks = [
  { name: "Home", href: "/umkm" },
  { name: "Activity", href: "/umkm/delivery" },
  { name: "Profile", href: "/umkm/profil" }
];

export function Sidebar() {
  return (
    <div className="w-60 h-screen bg-white p-5 fixed top-0 left-0 shadow-sm border-r-[#0A4635]/50 border-r-2">
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
            <Link href={item.href} className="flex items-center text-md font-medium text-[#0A4635] hover:bg-[#E8F5E9] p-2 rounded-md">
              <span className="mr-3">{item.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}