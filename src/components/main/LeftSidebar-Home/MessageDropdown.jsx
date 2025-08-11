"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

export default function MessageDropdown({ messages, onClose, onContactClick }) {
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div
      ref={dropdownRef}
      className="absolute -right-2 top-10 w-96 bg-white dark:bg-fb-dark-secondary shadow-lg rounded-lg p-4 z-50"
    >
      <h3 className="text-lg font-semibold mb-2 text-black dark:text-white">
        Đoạn chat
      </h3>
      <input
        type="text"
        placeholder="Tìm kiếm trên Messenger"
        className="w-full px-3 py-1 mb-2 text-sm rounded-full bg-gray-100 dark:bg-gray-700 text-black outline-none dark:placeholder:text-gray-400"
      />
      <div className="max-h-72 overflow-y-auto space-y-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer ${
              msg.isRead ? "opacity-70" : "bg-blue-50 dark:bg-gray-700"
            }`}
            onClick={() => {
              if (onContactClick) {
                onContactClick({
                  id: msg.id,
                  name: msg.name,
                  avatar: msg.avatar,
                  isOnline: Math.random() > 0.5, // Random online status for demo
                });
              }
              onClose();
            }}
          >
            <Image
              src={msg.avatar}
              alt={msg.name}
              width={50}
              height={40}
              className="rounded-full w-10 h-10 mr-3"
            />
            <div className="flex-1">
              <p className="font-medium text-black dark:text-white">
                {msg.name}
              </p>
              <p className="text-sm text-gray-900 dark:text-gray-400 truncate">
                {msg.preview}
              </p>
            </div>
            <span className="text-xs text-gray-400 ml-2">{msg.time}</span>
          </div>
        ))}
      </div>
      <Link
        href="/messages"
        className="block text-center text-blue-500 text-sm mt-2 dark:text-white"
      >
        Xem tất cả trong Messenger
      </Link>
    </div>
  );
}
