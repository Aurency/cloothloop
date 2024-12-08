"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FiHome, FiLogOut, FiUser } from "react-icons/fi";
import { HiOutlineClock } from "react-icons/hi2";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebaseconfig";

const navLinks = [
  { name: "Home", href: "/umkm", icon: <FiHome size={20} /> },
  { name: "Activity", href: "/umkm/delivery", icon: <HiOutlineClock size={20} /> },
  { name: "Profile", href: "/umkm/profil", icon: <FiUser size={20} /> }
];

export function Sidebar() {
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
    <div className="w-60 h-screen bg-[#0A4635] fixed top-0 left-0 shadow-md ">
       <div className ="items-center justify-center pl-10 py-6 pr-5">
                {/* Path ke gambar di folder public */}
                <Image 
                    src="/assets/logo-cream.png" // Path yang benar
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
            className={`flex items-center text-md font-medium text-[#FAF7F1] border-[#0A4635] hover:bg-[#E8F5E9]/30 gap-4 px-4 py-5  border-l-4 hover:border-[#FFEA7F] hover:text-[#FFEA7F]"
              ${
                pathname === item.href
                  ? "bg-[#E8F5E9]/30 text-[#FFEA7F] border-l-4 border-[#FFEA7F]" // Aktif
                  : "text-[#FAF7F1] hover:bg-[#E8F5E9]/30 hover:text-[#FFEA7F] hover:border-l-4 hover:border-[#FFEA7F]"
              }`}>
              <span className="flex items-center gap-4">
                {item.icon}
                {item.name}</span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="border-t border-[#f4ede6]/30 mt-[415px]">
        <div 
        onClick={handleLogout}
        className="flex items-center text-[#f4ede6] border-[#0A4635] hover:bg-[#E8F5E9]/30 gap-4 px-4 py-5 mt-3 border-l-4 hover:border-[#FFEA7F] hover:text-[#FFEA7F]">
          <FiLogOut size={20} /> {/* Tambahkan ikon logout */}
          <span className="text-md font-medium">Logout</span>
        </div>
      </div>
    </div>
  );
}