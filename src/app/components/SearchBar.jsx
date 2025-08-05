"use client";

import React from "react";
import { FiSearch } from "react-icons/fi";

const SearchBar = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="flex items-center w-full px-4 py-2 rounded-full bg-[#1e2124]">
      <FiSearch className="text-gray-400 text-xl mr-2" />
      <input
        type="text"
        placeholder="Search users..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="bg-transparent outline-none text-sm w-full text-white placeholder-gray-400"
      />
    </div>
  );
};

export default SearchBar;
