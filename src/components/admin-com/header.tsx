"use client";

import { useState } from "react";
import { FaSearch } from "react-icons/fa";

export function Header3() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <header className="bg-[#FAF7F1] flex justify-between items-center p-4 border-b-[rgba(10,70,53,0.5)] border-b-[2px]">
      <h1 className="text-[#0A4635] text-2xl font-semibold">Admin</h1>
    </header>
  );
}
