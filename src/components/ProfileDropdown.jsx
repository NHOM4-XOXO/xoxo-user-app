"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { profileMenuItems } from "@/data/profileMenuItems";
import Link from "next/link";

export default function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  const handleClickOutside = (e) => {
    if (menuRef.current && !menuRef.current.contains(e.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        className="flex items-center space-x-2 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Image
          src="/image/georgina.jpg"
          alt="Avatar"
          width={32}
          height={32}
          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
        />
      </button>

      {isOpen && (
        <div className="absolute -right-2 top-11 mt-2 w-48 bg-white dark:bg-fb-dark-secondary shadow-lg rounded-lg py-2 z-50">
          {profileMenuItems.map((item) =>
            item.type === "divider" ? (
              <hr
                key={item.id}
                className="my-1 border-t border-gray-300 dark:border-gray-600"
              />
            ) : (
              <Link
                href={item.href}
                key={item.id}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 text-sm text-gray-800 dark:text-gray-200 cursor-pointer"
              >
                <span>{item.icon}</span>
                {item.label}
              </Link>
            )
          )}
        </div>
      )}
    </div>
  );
}
