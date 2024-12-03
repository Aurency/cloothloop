"use client";

import Image from "next/image";
import Link from "next/link";

const navLinks = [
  { name: "Home", href: "/umkm" },
  { name: "Delivery", href: "/umkm/delivery" },
  { name: "Profile", href: "/umkm/profil" }
];

export function Sidebar() {
  return (
    <div className="w-64 h-screen bg-[#F1F1F1] p-6 fixed top-0 left-0">
       <div className ="marginBottom-20">
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
            <Link href={item.href} className="flex items-center text-lg text-[#2E7D32] hover:bg-[#E8F5E9] p-2 rounded-md">
              <span className="mr-3">{item.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}