"use client";

import { useState, useEffect } from "react";
import { HiUserCircle } from "react-icons/hi";
import { getDoc, doc } from "firebase/firestore";
import { auth, db } from "@/lib/firebaseconfig"; // pastikan import dari file firebaseconfig Anda
import { signOut } from "firebase/auth";

export function Header4() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [courier, setCourier] = useState<any>(null);

  // Mengambil data kurir dari Firestore berdasarkan UID
  useEffect(() => {
    const fetchCourierData = async () => {
      if (auth.currentUser) {
        const courierRef = doc(db, "couriers", auth.currentUser.uid); // pastikan path sesuai dengan koleksi Firestore Anda
        const docSnapshot = await getDoc(courierRef);
        if (docSnapshot.exists()) {
          setCourier(docSnapshot.data());
        }
      }
    };

    fetchCourierData();
  }, []);

  // Fungsi untuk logout
  const handleLogout = async () => {
    try {
      await signOut(auth); // Log out dari Firebase Auth
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <header className="bg-[#FAF7F1] flex justify-between items-center py-4 px-6 border-b-[#0A4635]/50 border-b-2">
      <h1 className="text-[#0A4635] text-2xl font-semibold">Courier</h1>
      <div className="flex gap-4  text-[#0A4635] relative">
        <HiUserCircle
          size={30}
          className="cursor-pointer"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)} // Toggle dropdown
        />
        {isDropdownOpen && courier && (
          <div className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-md p-4 border border-[#0A4635]">
            <p className="font-medium text-[#0A4635]">{courier.nama}</p>
            <button
              onClick={handleLogout}
              className="mt-2 w-full text-center text-red-500 hover:bg-red-100 py-2 px-4 rounded-md"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
