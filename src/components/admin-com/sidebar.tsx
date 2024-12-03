"use client";
import Image from "next/image";
import Link from "next/link";

const navLinks = [
  { name: "Home", href: "admin/home-admin" },
  { name: "Industry Data", href: "admin/data-industri" },
  { name: "UMKM Data", href: "admin/data-umkm" },
  { name: "History", href: "admin/data-pengiriman" },
];

export function Sidebar3() {
  return (
    <div className="w-64 h-screen bg-[#F1F1F1] p-6 fixed top-0 left-0">
      {/* Logo Section */}
      <div className="marginBottom-20"> {/* Tambahkan margin-bottom untuk memberi jarak */}
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
              className="flex items-center text-lg text-[#2E7D32] hover:bg-[#E8F5E9] p-2 rounded-md"
            >
              <span className="mr-3">{item.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
