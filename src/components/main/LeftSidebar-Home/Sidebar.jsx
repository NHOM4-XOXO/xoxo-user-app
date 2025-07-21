"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  FaUserFriends,
  FaUsers,
  FaVideo,
  FaRegSave,
  FaPlaceOfWorship,
  FaGamepad,
} from "react-icons/fa";
import { FaMeta, FaRegMessage } from "react-icons/fa6";
import { IoTimer, IoClose } from "react-icons/io5";
import { MdEvent } from "react-icons/md";

const items = [
  { icon: <FaMeta />, label: "Meta AI" },
  { icon: <FaUserFriends />, label: "Bạn bè" },
  { icon: <FaUsers />, label: "Nhóm" },
  { icon: <FaVideo />, label: "Video" },
  { icon: <IoTimer />, label: "Kỷ niệm" },
  { icon: <FaRegSave />, label: "Đã lưu" },
  { icon: <FaPlaceOfWorship />, label: "Marketplace" },
  { icon: <FaGamepad />, label: "Chơi game" },
  { icon: <FaRegMessage />, label: "Message kid" },
  { icon: <MdEvent />, label: "Sự kiện" },
];

const shortcuts = [
  { name: "Lập trình viên 2k5", image: "/image/group1.jpg" },
  { name: "LikeLion 2025 k1", image: "/image/group2.jpg" },
  { name: "Group 5", image: "/image/group1.jpg" },
  { name: "Lập trình hay bug", image: "/image/group2.jpg" },
  { name: "Group 7", image: "/image/group1.jpg" },
  { name: "Lập trình viên trái nghành", image: "/image/group1.jpg" },
  { name: "Group 6", image: "/image/group1.jpg" },
  { name: "Group 1", image: "/image/group1.jpg" },
];

export default function Sidebar() {
  const [showAll, setShowAll] = useState(false);
  const [showAllShortCut, setShowAllShortCut] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const visibleItems = showAll ? items : items.slice(0, 4);
  const visibleShortcut = showAllShortCut ? shortcuts : shortcuts.slice(0, 4);

  useEffect(() => {
    const handleToggleSidebar = (event) => {
      setIsOpen(event.detail);
    };

    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsOpen(false);
      }
    };

    window.addEventListener("toggleSidebar", handleToggleSidebar);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("toggleSidebar", handleToggleSidebar);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const closeSidebar = () => {
    setIsOpen(false);
    window.dispatchEvent(new CustomEvent("toggleSidebar", { detail: false }));
  };

  return (
    <>
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={closeSidebar}
        />
      )}

      <aside
        className={`
          h-full w-72 sm:w-80 bg-white dark:bg-fb-dark-primary 
          shadow-lg lg:shadow-none p-4 z-50 transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:top-14 lg:h-[calc(100vh-56px)] lg:z-30
        `}
      >
        <div className="lg:hidden flex justify-between items-center mb-4 pt-2">
          <h2 className="text-xl font-semibold">Menu</h2>
          <button
            onClick={closeSidebar}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
          >
            <IoClose className="text-xl" />
          </button>
        </div>

        <div className="mb-6">
          <div className="flex items-center space-x-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg cursor-pointer">
            <Image
              src="/image/georgina.jpg"
              alt="User Avatar"
              width={40}
              height={40}
              className="rounded-full w-10 h-10 object-cover"
            />
            <span className="font-medium">Georgina Rodriguez</span>
          </div>
        </div>

        <div className="mb-6">
          <ul className="space-y-1">
            {visibleItems.map((item, index) => (
              <li key={index}>
                <button className="w-full p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg cursor-pointer flex items-center space-x-3 text-left transition-colors">
                  <span className="text-xl text-blue-600">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            ))}

            <li>
              <button
                className="w-full p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg cursor-pointer text-left font-medium transition-colors"
                onClick={() => setShowAll(!showAll)}
              >
                {showAll ? "Ẩn bớt" : "Xem thêm"}
              </button>
            </li>
          </ul>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <h3 className="text-gray-600 dark:text-gray-400 font-medium mb-3 px-3">
            Lối tắt của bạn
          </h3>
          <ul className="space-y-1">
            {visibleShortcut.map((group, idx) => (
              <li key={idx}>
                <button className="w-full flex items-center space-x-3 p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg cursor-pointer text-left transition-colors">
                  <Image
                    src={group.image || "/placeholder.svg"}
                    alt={group.name}
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-lg object-cover"
                  />
                  <span className="font-medium truncate">{group.name}</span>
                </button>
              </li>
            ))}
            <li>
              <button
                className="w-full p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg cursor-pointer text-left font-medium transition-colors"
                onClick={() => setShowAllShortCut(!showAllShortCut)}
              >
                {showAllShortCut ? "Ẩn bớt" : "Xem thêm"}
              </button>
            </li>
          </ul>
        </div>

        <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
            <p>Quyền riêng tư · Điều khoản · Quảng cáo · Lựa chọn quảng cáo</p>
            <p>Meta © 2024</p>
          </div>
        </div>
      </aside>
    </>
  );
}
