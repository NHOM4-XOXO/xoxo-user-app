"use client";
import { useState, useRef, useEffect } from "react";
import { FaFacebook, FaUserFriends, FaStore } from "react-icons/fa";
import { FiSearch, FiMessageCircle, FiMenu } from "react-icons/fi";
import { IoMdHome, IoMdNotifications } from "react-icons/io";
import { MdOndemandVideo } from "react-icons/md";
import { RiGroup2Line } from "react-icons/ri";
import { IoClose } from "react-icons/io5";
import Image from "next/image";
import MessageDropdown from "./MessageDropdown";
import NotificationDropdown from "./NotiDropDown";
import SearchBar from "../../Search/SearchBar";
import {
  sampleMessages,
  sampleNotifications,
} from "../../../data/asideHeaderSampleData";
import NavItem from "../../../components/Navbar/NavItem";
import ThemeToggle from "../../ThemeToggle";

export default function Header() {
  const [showMessages, setShowMessages] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [searchTerm, setsearchTerm] = useState("");

  const [results, setResults] = useState([]);

  const messageRef = useRef(null);
  const notiRef = useRef(null);

  const toggleMessageDropdown = () => {
    setShowMessages((prev) => !prev);
    setShowNotifications(false);
  };

  const toggleNotificationDropdown = () => {
    setShowNotifications((prev) => !prev);
    setShowMessages(false);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
    window.dispatchEvent(
      new CustomEvent("toggleSidebar", { detail: !sidebarOpen })
    );
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (messageRef.current && !messageRef.current.contains(event.target)) {
        setShowMessages(false);
      }

      if (notiRef.current && !notiRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 bg-white dark:bg-fb-dark-secondary shadow z-50 px-2 sm:px-4 flex justify-between items-center">
      <div className="flex items-center space-x-2">
        {/* <button className="lg:hidden p-2 hover bg-gray-100 dark:hover:bg-gray-700 rounded-full">
          <FiMenu className="text-xl" />
        </button> */}

        <li className="flex items-center">
          <FaFacebook className="text-blue-600 text-3xl sm:text-4xl" />
        </li>

        <div className="bg-gray-100 dark:bg-fb-dark-tertiary sm:flex px-3 py-1 items-center space-x-2 rounded-full min-w-[240px] hidden">
          {/* <FiSearch className="text-gray-500" /> */}
          {/* <input type="text" placeholder="Tìm kiếm" /> */}
          <SearchBar
            type="text"
            placeholder=""
            // className="bg-transparent outline-none text-sm flex-1"
            value={searchTerm}
            onChange={(e) => setsearchTerm(e.target.value)}
          />
        </div>

        <button className="sm:hidden p-2 hover:bg-gray-100 dar:hover:bg-gray-700 rounded-full">
          <FiSearch className="text-xl" />
        </button>
      </div>

      <div className="hidden md:flex mr-35 items-center text-2xl lg:text-3xl space-x-8 lg:space-6 text-gray-400 cursor-pointer">
        <NavItem href="/" exact>
          <IoMdHome />
        </NavItem>

        <NavItem href="/friends">
          <FaUserFriends />
        </NavItem>

        <NavItem href="/videos">
          <MdOndemandVideo />
        </NavItem>

        <NavItem href="/store">
          <FaStore />
        </NavItem>

        <NavItem href="/groups">
          <RiGroup2Line />
        </NavItem>
      </div>

      <div className="flex space-x-1 sm:space-x-2 items-center relative">
        {/* Theme Toggle */}
        <ThemeToggle />
        <button
          ref={messageRef}
          className="p-2 bg-gray-100 dark:bg-fb-dark-tertiary hover:bg-fb-light-tertiary dark:hover:bg-gray-700 rounded-full relative cursor-pointer"
          onClick={toggleMessageDropdown}
        >
          <FiMessageCircle className="text-2xl" />
          <span className="absolute top-1 -right-1 bg-red-500 text-white text-sx rounded-full w-3 h-3 flex items-center justify-center " />
        </button>

        <button
          ref={notiRef}
          className="p-2 bg-gray-100 dark:bg-fb-dark-tertiary hover:bg-fb-light-tertiary dark:hover:bg-gray-700 rounded-full relative cursor-pointer"
          onClick={toggleNotificationDropdown}
        >
          <IoMdNotifications className="text-2xl" />
          <span className="absolute top-1 -right-1 bg-red-500 text-white text-sx rounded-full w-3 h-3 flex items-center justify-center" />
        </button>

        <button className="flex items-center space-x-2 p-1 hover:bg-fb-light-tertiary dark:hover:bg-gray-700 rounded-full cursor-pointer">
          <Image
            src="/image/georgina.jpg"
            alt="Avatar"
            width={32}
            height={32}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
          />
        </button>
      </div>

      {showSearch && (
        <div className="sm:hidden absolute top-full left-0 right-0 bg-white dark:bg-fb-secondary shadow-lg p-4 z-40">
          <div className="flex items-center space-x-2">
            <div className="flex-1 bg-gray-100 dark:bg-gray-fb-dark-tertiary px-3 py-2 rounded-full flex items-center space-x-2">
              <FiSearch className="text-gray-500" />
              {/* <input
                type="text"
                className="bg-transparent outline-none text-sm flex-1"
                autoFocus
              /> */}
              <SearchBar
                value={searchTerm}
                onChange={(e) => setsearchTerm(e.target.value)}
                className="flex-1"
              />
            </div>
            <button
              onClick={() => setShowSearch(false)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
            >
              <IoClose className="text-xl" />
            </button>
          </div>
        </div>
      )}

      {showMessages && (
        <div className="absolute top-2 right-2 z-50 sm:right-4 mt-2">
          <MessageDropdown
            messages={sampleMessages}
            onClose={() => setShowMessages(false)}
          />
        </div>
      )}

      {showNotifications && (
        <div className="absolute top-3 -right-15 z-50 transition-all duration-200 scale-100 opacity-100 sm:-right-15 mt-2">
          <NotificationDropdown
            rel={notiRef}
            notifications={sampleNotifications}
            onClose={() => setShowNotifications(false)}
          />
        </div>
      )}
    </header>
  );
}
