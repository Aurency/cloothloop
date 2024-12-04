"use client";

import Image from "next/image";
import Link from "next/link";

const navLinks = [
  { name: "Home", href: "/admin" },
  { name: "Industry Data", href: "/admin/data-industri" },
  { name: "UMKM Data", href: "/admin/data-umkm" },
  { name: "History", href: "/admin/data-pengiriman" },
];

export function Sidebar3() {
  return (
    <div className="w-60 h-screen bg-white p-5 fixed top-0 left-0 shadow-sm border-r-[#0A4635]/50 border-r-2">
      {/* Logo Section */}
      <div className="items-center justify-center"> {/* Tambahkan margin-bottom untuk memberi jarak */}
        <Image
          src="/assets/logo-hijau.png"
          alt="Cloohloop Logo"
          width={150}
          height={50}
        />
      </div>

      {/* Menu Section */}
      <ul className="space-y-4 mt-10">
        {navLinks.map((item, index) => (
          <li key={index}>
            <Link
              href={item.href}
              className="flex items-center text-md font-medium text-[#0A4635] hover:bg-[#E8F5E9] p-2 rounded-md "
            >
              <span className="mr-3">{item.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
