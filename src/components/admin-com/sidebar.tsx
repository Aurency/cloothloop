"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";



const navLinks = [
  { name: "Home", href: "/admin" },
  { name: "Industry Data", href: "/admin/data-industri" },
  { name: "UMKM Data", href: "/admin/data-umkm" },
  { name: "History", href: "/admin/data-pengiriman" },
];


export function Sidebar3() {
  const pathname = usePathname(); 


  return (
    <div className="w-60 h-screen bg-[#0A4635] fixed top-0 left-0 shadow-md ">
      {/* Logo Section */}
      <div className="items-center justify-center pl-10 py-6 pr-5 "> 
        <Image
          src="/assets/logo-cream.png"
          alt="Cloohloop Logo"
          width={150}
          height={50}
        />
      </div>

      {/* Menu Section */}
      <ul className=" space-y-1 mt-5">
        {navLinks.map((item, index) => (
          <li key={index}>
            <Link
              href={item.href}
              className={`flex items-center text-md font-medium text-[#FAF7F1] border-[#0A4635] hover:bg-[#E8F5E9]/30 gap-4 px-4 py-5  border-l-4 hover:border-[#FFEA7F] hover:text-[#FFEA7F]"
              ${
                pathname === item.href
                  ? "bg-[#E8F5E9]/30 text-[#FFEA7F] border-l-4 border-[#FFEA7F]" // Aktif
                  : "text-[#FAF7F1] hover:bg-[#E8F5E9]/30 hover:text-[#FFEA7F] hover:border-l-4 hover:border-[#FFEA7F]"
              }`}
            >
            <span className="pl-3">{item.name}</span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="border-t border-[#f4ede6]/30 mt-5">
        <div className="text-[#f4ede6] border-[#0A4635] hover:bg-[#E8F5E9]/30 gap-4 px-4 py-5  mt-3 border-l-4 hover:border-[#FFEA7F] hover:text-[#FFEA7F]">
          <li className="flex items-center text-md font-medium pl-3"
            >
            Logout {/* blmpa bisa kasih logout jadi button nya mo saja dlu diksih muncul alias ndbisa dipencet :'( */}
          </li>
        </div>
      </div>
    </div>
  );
}
