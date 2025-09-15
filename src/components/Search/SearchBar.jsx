import React from "react";
import { FiSearch } from "react-icons/fi";

<<<<<<< HEAD
const SearchBar = ({ placeholder, value, onChange, onKeyDown }) => {
=======
const SearchBar = ({ placeholder, value, onChange }) => {
>>>>>>> e831905428471ab851098df54886f2b232d48738
  return (
    <div className="flex items-center rounded px-1 py-1 bg-transparent">
      <FiSearch className="text-gray-500 mr-2" />
      <input
        type="text"
<<<<<<< HEAD
        placeholder={placeholder || "Search..."}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
=======
        placeholder={placeholder}
        value={value}
        onChange={onChange}
>>>>>>> e831905428471ab851098df54886f2b232d48738
        className="outline-none w-full"
      />
    </div>
  );
};

<<<<<<< HEAD
=======


>>>>>>> e831905428471ab851098df54886f2b232d48738
export default SearchBar;
