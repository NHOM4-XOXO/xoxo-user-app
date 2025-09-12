import React from "react";
import { FiSearch } from "react-icons/fi";

const SearchBar = ({ placeholder, value, onChange, onKeyDown }) => {
  return (
    <div className="flex items-center rounded px-1 py-1 bg-transparent">
      <FiSearch className="text-gray-500 mr-2" />
      <input
        type="text"
        placeholder={placeholder || "Search..."}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        className="outline-none w-full"
      />
    </div>
  );
};

export default SearchBar;
