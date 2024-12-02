"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/landing-com/Navbar"; // Sesuaikan path komponen
import "../../styles/globals.css"; // Sesuaikan path CSS global


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