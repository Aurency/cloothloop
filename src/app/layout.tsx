"use client";

import { usePathname } from "next/navigation";
import {Navbar} from "@/components/Navbar"; // Navbar Anda
import "./globals.css"; 

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Tentukan path yang tidak membutuhkan Navbar
  const noNavbarRoutes = ["/auth/sign-up", "/auth/sign-in"];

  return (
    <html lang="en">
      <body>
        {!noNavbarRoutes.includes(pathname) && <Navbar />}{" "}
        {/* Tampilkan Navbar kecuali di halaman tertentu */}
        {children}
      </body>
    </html>
  );
}
