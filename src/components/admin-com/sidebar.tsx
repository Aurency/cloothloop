"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FiHome, FiLogOut } from "react-icons/fi";
import { HiOutlineClock } from "react-icons/hi2";
import { IoBicycle, IoStorefrontOutline } from "react-icons/io5";
import { GiFactory } from "react-icons/gi";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebaseconfig"; // Path ke file konfigurasi Firebase Anda

const navLinks = [
  { name: "Home", href: "/admin", icon: <FiHome size={20} /> },
  { name: "Industry Data", href: "/admin/data-industri", icon: <GiFactory size={20} /> },
  { name: "UMKM Data", href: "/admin/data-umkm", icon: <IoStorefrontOutline size={20} /> },
  { name: "History", href: "/admin/data-pengiriman", icon: <HiOutlineClock size={20} /> },
  { name: "Kurir", href: "/admin/data-kurir", icon: <IoBicycle size={20} /> },
];

export function Sidebar3() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth); // Logout dari Firebase
      router.push("/auth/signin-admin"); // Redirect ke halaman signin
    } catch (error) {
      console.error("Error saat logout:", error);
    }
  };

  return (
    <div className="w-60 h-screen bg-[#0A4635] fixed top-0 left-0 shadow-md flex-1">
      {/* Logo Section */}
      <div className="items-center justify-center pl-10 py-6 pr-5"> 
        <Image
          src="/assets/logo-cream.png"
          alt="Cloohloop Logo"
          width={150}
          height={50}
        />
      </div>

      {/* Menu Section */}
      <ul className="space-y-1 mt-5">
        {navLinks.map((item, index) => (
          <li key={index}>
            <Link
              href={item.href}
              className={`flex items-center text-md font-medium text-[#FAF7F1] border-[#0A4635] hover:bg-[#E8F5E9]/30 gap-4 px-4 py-5 border-l-4 hover:border-[#FFEA7F] hover:text-[#FFEA7F] ${
                pathname === item.href
                  ? "bg-[#E8F5E9]/30 text-[#FFEA7F] border-l-4 border-[#FFEA7F]" // Aktif
                  : "text-[#FAF7F1] hover:bg-[#E8F5E9]/30 hover:text-[#FFEA7F] hover:border-l-4 hover:border-[#FFEA7F]"
              }`}
            >
              <span className="flex items-center gap-4">
                {item.icon}
                {item.name}
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {/* Logout Section */}
      <div className="border-t border-[#f4ede6]/30 mt-[280px]">
        <div
          onClick={handleLogout} // Logout ketika di-klik
          className="flex items-center text-[#f4ede6] border-[#0A4635] hover:bg-[#E8F5E9]/30 gap-4 px-4 py-5 mt-3 border-l-4 hover:border-[#FFEA7F] hover:text-[#FFEA7F]"
        >
          <FiLogOut size={20} />
          <span className="text-md font-medium">Logout</span>
        </div>
      </div>
    </div>
  );
}