"use client";

import { useState } from "react";
import { FaSearch } from "react-icons/fa";

export function Header() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <header className="bg-[#0A4635] flex justify-between items-center p-4">
      <h1 className="text-white text-2xl font-bold">UMKM Dashboard</h1>

      {/* Search Bar */}
      <div className="relative w-1/4">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search..."
          className="w-full pl-10 pr-4 py-2 rounded-md text-lg text-gray-800"
        />
        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
      </div>
    </header>
  );
}
