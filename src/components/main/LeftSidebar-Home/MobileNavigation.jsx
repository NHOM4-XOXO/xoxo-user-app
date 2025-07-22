"use client";
import { IoMdHome, IoMdNotifications } from "react-icons/io";
import { FaUserFriends, FaStore } from "react-icons/fa";
import { MdOndemandVideo } from "react-icons/md";
import { RiGroup2Line } from "react-icons/ri";

export default function MobileNavigation() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-fb-dark-secondary border-t border-gray-200 dark:border-gray-700 z-40">
      <div className="flex justify-around items-center py-2">
        <button className="flex flex-col items-center p-2 text-blue-600">
          <IoMdHome className="text-2xl" />
          <span className="text-xs mt-1">Trang chủ</span>
        </button>

        <button className="flex flex-col items-center p-2 text-gray-500 hover:text-blue-600">
          <FaUserFriends className="text-2xl" />
          <span className="text-xs mt-1">Bạn bè</span>
        </button>

        <button className="flex flex-col items-center p-2 text-gray-500 hover:text-blue-600">
          <MdOndemandVideo className="text-2xl" />
          <span className="text-xs mt-1">Video</span>
        </button>

        <button className="flex flex-col items-center p-2 text-gray-500 hover:text-blue-600">
          <FaStore className="text-2xl" />
          <span className="text-xs mt-1">Marketplace</span>
        </button>

        <button className="flex flex-col items-center p-2 text-gray-500 hover:text-blue-600 relative">
          <IoMdNotifications className="text-2xl" />
          <span className="text-xs mt-1">Thông báo</span>
          <span className="absolute -top-1 right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            2
          </span>
        </button>

        <button className="flex flex-col items-center p-2 text-gray-500 hover:text-blue-600">
          <RiGroup2Line className="text-2xl" />
          <span className="text-xs mt-1">Nhóm</span>
        </button>
      </div>
    </nav>
  );
}
