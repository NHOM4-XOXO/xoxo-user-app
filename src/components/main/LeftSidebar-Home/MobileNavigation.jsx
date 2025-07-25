"use client";
import { IoMdHome, IoMdNotifications } from "react-icons/io";
import { FaUserFriends, FaStore } from "react-icons/fa";
import { MdOndemandVideo } from "react-icons/md";
import { RiGroup2Line } from "react-icons/ri";
import { BsMusicPlayerFill } from "react-icons/bs";

import NavItem from "../../../components/Navbar/NavItem";

export default function MobileNavigation() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-fb-dark-secondary border-t border-gray-200 dark:border-gray-700 z-40">
      <div className="flex justify-around items-center py-2">
        <NavItem
          href="/"
          className="flex flex-col items-center p-2 text-blue-600"
        >
          <IoMdHome className="text-2xl" />
          <span className="text-xs mt-1 whitespace-nowrap">Trang chủ</span>
        </NavItem>

        <NavItem
          href="/friends"
          className="flex flex-col items-center p-2 text-gray-500 hover:text-blue-600"
        >
          <FaUserFriends className="text-2xl" />
          <span className="text-xs mt-1 whitespace-nowrap">Bạn bè</span>
        </NavItem>

        <NavItem
          href="/videos"
          className="flex flex-col items-center p-2 text-gray-500 hover:text-blue-600"
        >
          <MdOndemandVideo className="text-2xl" />
          <span className="text-xs mt-1">Video</span>
        </NavItem>

        <NavItem
          href="/marketplace"
          className="flex flex-col items-center p-2 text-gray-500 hover:text-blue-600"
        >
          <FaStore className="text-2xl" />
          <span className="text-xs mt-1">Marketplace</span>
        </NavItem>

        <NavItem
          href="/group"
          className="flex flex-col items-center p-2 text-gray-500 hover:text-blue-600"
        >
          <BsMusicPlayerFill className="text-2xl" />
          <span className="text-xs mt-1">Music</span>
        </NavItem>
      </div>
    </nav>
  );
}
