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

export default function Header() {
  const [showMessages, setShowMessages] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const messageRef = useRef(null);
  const notiRef = useRef(null);

  const sampleMessages = [
    {
      id: 1,
      name: "Quang Anh",
      avatar: "/images/group1.jpg",
      preview: "Xin chào bạn nhé!",
      time: "3 phút",
      isRead: false,
    },
    {
      id: 2,
      name: "Thị B",
      avatar: "/images/group2.jpg",
      preview: "Tối nay đi chơi chứ?",
      time: "1 giờ",
      isRead: true,
    },
    {
      id: 3,
      name: "Văn C",
      avatar: "/images/group1.jpg",
      preview: "Đã nhận được file nha.",
      time: "3 giờ",
      isRead: true,
    },
    {
      id: 4,
      name: "Thị D",
      avatar: "/images/group2.jpg",
      preview: "Off thôi",
      time: "6 giờ",
      isRead: true,
    },
  ];

  const sampleNotifications = [
    {
      id: 1,
      type: "friend",
      message: "Trang Nguyễn đã thích bài viết của bạn.",
      avatar: "/image/group1.jpg",
      time: "2 phút",
      isRead: false,
    },
    {
      id: 2,
      type: "invite",
      message: "Linh Trần đã gửi lời mời kết bạn.",
      avatar: "/image/group2.jpg",
      time: "15 phút",
      isRead: true,
    },
    {
      id: 3,
      type: "group",
      message: "DevGroup có bài viết mới.",
      avatar: "/image/group1.jpg",
      time: "1 giờ",
      isRead: true,
    },
  ];

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
    <header className="fixed flex top-0 left-0 right-0 bg-white dark:bg-fb-dark-secondary shadow z-50 px-2 sm:px-4 flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <button className="lg:hidden p-2 hover bg-gray-100 dark:hover:bg-gray-700 rounded-full">
          <FiMenu className="text-xl" />
        </button>

        <li className="flex items-center">
          <FaFacebook className="text-blue-600 text-3xl sm:text-4xl" />
        </li>

        <div className="bg-gray-100 dark:bg-fb-dark-tertiary px-2 py-1 sm:flex px-3 py-2items-center space-x-2 rounded-full min-w-[240px] hidden">
          <FiSearch className="text-gray-500" />
          <input
            type="text"
            placeholder="Tìm kiếm"
            className="bg-transparent outline-none text-sm flex-1"
          />
        </div>

        <button className="sm:hidden p-2 hover:bg-gray-100 dar:hover:bg-gray-700 rounded-full">
          <FiSearch className="text-xl" />
        </button>
      </div>

      <div className="hidden mr-35 md:flex items-center text-2xl lg:text-3xl space-x-4 lg:space-6 text-gray-400 cursor-pointer">
        <button className="p-2 lg:p-3 hover:bg-gray100 dark:hover:bg-gray-700 rounded-lg hover:text-blue-600 transition-colors cursor-pointer">
          <IoMdHome />
        </button>
        <button className="p-2 lg:p-3 hover:bg-gray100 dark:hover:bg-gray-700 rounded-lg hover:text-blue-600 transition-colors cursor-pointer">
          <FaUserFriends className="ml-4" />
        </button>
        <button className="p-2 lg:p-3 hover:bg-gray100 dark:hover:bg-gray-700 rounded-lg hover:text-blue-600 transition-colors cursor-pointer">
          <MdOndemandVideo className="ml-4" />
        </button>
        <button className="p-2 lg:p-3 hover:bg-gray100 dark:hover:bg-gray-700 rounded-lg hover:text-blue-600 transition-colors cursor-pointer">
          <FaStore className="ml-4" />
        </button>
        <button className="p-2 lg:p-3 hover:bg-gray100 dark:hover:bg-gray-700 rounded-lg hover:text-blue-600 transition-colors cursor-pointer">
          <RiGroup2Line className="ml-4" />
        </button>
      </div>

      <div className="flex space-x-1 sm:space-x-2 items-center relative">
        <button
          ref={messageRef}
          className="p-2 bg-gray-100 dark:bg-fb-dark-tertiary hover:bg-fb-dark-quaternary dar:hover:bg-gray-700 rounded-full relative cursor-pointer"
          onClick={toggleMessageDropdown}
        >
          <FiMessageCircle className="text-2xl" />
          <span className="absolute top-1 -right-1 bg-red-500 text-white text-sx rounded-full w-3 h-3 flex items-center justify-center " />
        </button>

        <button
          ref={notiRef}
          className="p-2 bg-gray-100 dark:bg-fb-dark-tertiary hover:bg-fb-dark-quaternary dar:hover:bg-gray-700 rounded-full relative cursor-pointer"
          onClick={toggleNotificationDropdown}
        >
          <IoMdNotifications className="text-2xl" />
          <span className="absolute top-1 -right-1 bg-red-500 text-white text-sx rounded-full w-3 h-3 flex items-center justify-center" />
        </button>

        <button className="flex items-center space-x-2 p-1 hover:bg-fb-dark-quaternary dark:hover:bg-gray-700 rounded-full cursor-pointer">
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
              <input
                type="text"
                className="bg-transparent outline-none text-sm flex-1"
                autoFocus
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
