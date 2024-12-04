"use client";

import { useState } from "react";
import { FaSearch } from "react-icons/fa";

export function Header3() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <header className="bg-white flex justify-between items-center p-4 border-b-[#0A4635]/50 border-b-2">
      <h1 className="text-[#0A4635] text-2xl font-semibold">HOMEPAGE</h1>

      {/* Search Bar */}
      <div className="relative w-1/4 border-[#0A4635]/50 border-2 rounded-full">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search..."
          className="w-full pl-10 pr-4 py-1 rounded-full text-md text-[#0A4635]"
        />
        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#0A4635]/50 text-md" />
      </div>
    </header>
  );
}
