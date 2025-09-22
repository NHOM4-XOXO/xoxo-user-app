"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { getProfileMenuItems } from "@/data/profileMenuItems";
import Link from "next/link";

export default function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState("User");
  const [userAvatar, setUserAvatar] = useState("/image/georgina.jpg");
  const menuRef = useRef(null);
  const items = getProfileMenuItems();

  // const storedProfile = localStorage.getItem("auth");

  // let avatarUrl = null;
  // if (storedProfile) {
  //   const profileObj = JSON.parse(storedProfile);
  //   avatarUrl = profileObj?.profile.avatarUrl; // Lấy ra link avatar
  // }

  const handleClickOutside = (e) => {
    if (menuRef.current && !menuRef.current.contains(e.target)) {
      setIsOpen(false);
    }
  };
  useEffect(() => {
    try {
      const profile = localStorage.getItem("profile");
      if (profile) {
        const parsedUser = JSON.parse(profile);
        setUser(parsedUser);

        if (parsedUser) {
          setUserName(parsedUser.firstName + " " + parsedUser.lastName);
          setUserAvatar(parsedUser.avatarUrl || "/image/georgina.jpg");
        }
      }
    } catch (error) {
      console.error("Error loading user data:", error);
      setUserName("User");
      setUserAvatar("/image/georgina.jpg");
    }
  }, []);
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
          src={userAvatar || "/image/georgina.jpg"}
          alt="Avatar"
          className="w-6 h-6 sm:w-9 sm:h-9 rounded-full object-cover"
          width={32}
          height={32}
        />
      </button>

      {isOpen && (
        <div className="absolute -right-2 top-11 mt-2 w-48 bg-white dark:bg-fb-dark-secondary shadow-lg rounded-lg py-2 z-50">
          {items.map((item) => {
            if (item.type === "divider") {
              return (
                <hr
                  key={item.id}
                  className="my-1 border-t border-gray-300 dark:border-gray-600"
                />
              );
            }
            if (item.label === "Đăng Xuất") {
              const LogoutButton =
                require("@/components/common/LogoutButton.jsx").default;
              return (
                <div key={item.id} className="px-4 py-2">
                  <LogoutButton />
                </div>
              );
            }
            return (
              <Link
                href={item.href}
                key={item.id}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 text-sm text-gray-800 dark:text-gray-200 cursor-pointer"
              >
                <span>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
