"use client";

import Image from "next/image";
import Link from "next/link";

const navLinks = [
  { name: "Home", href: "umkm/home-umkm" },
  { name: "Chat", href: "umkm/chat" },
  { name: "History", href: "umkm/history" },
  { name: "Profile", href: "umkm/profile" }
];

export function Sidebar() {
  return (
    <div className="w-64 h-screen bg-[#F1F1F1] p-6 fixed top-0 left-0">
      {/* Logo Section */}
      <div className="flex items-center mb-12">
        <Image
          src="/assets/cloohloop_logo.png" // Path to your logo
          alt="ClothLoop Logo"
          width={40} // Logo width
          height={40} // Logo height
        />
        <h2 className="text-2xl font-semibold text-[#2E7D32] ml-3">ClothLoop</h2>
      </div>

      {/* Menu Section */}
      <ul className="space-y-4">
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