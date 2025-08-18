"use client";
import { useRef, useEffect } from "react";
import { FaUserFriends, FaStore } from "react-icons/fa";
import { FiSearch, FiMessageCircle } from "react-icons/fi";
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
import sampleFriends from "../../../data/sampleFriends";
import NavItem from "../../../components/Navbar/NavItem";
import ThemeToggle from "../../ThemeToggle";
import ProfileDropdown from "../../../components/ProfileDropdown";
import { BsMusicPlayerFill } from "react-icons/bs";
import Link from "next/link";
import useMergeState from "../../../hooks/useMergeState";

export default function Header({ onContactClick }) {
  const [state, setState] = useMergeState({
    showMessages: false,
    showNotifications: false,
    showSearch: false,
    sidebarOpen: false,
    showMarketPlace: false,
    searchTerm: "",
    results: [],
  });

  const {
    showMessages,
    showNotifications,
    showSearch,
    sidebarOpen,
    showMarketPlace,
    searchTerm,
    results,
  } = state;

  const searchWrapperRef = useRef(null);
  const messageRef = useRef(null);
  const notiRef = useRef(null);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setState({ results: [] });
      return;
    }
    const filtered = sampleFriends.filter((friend) =>
      friend.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setState({ results: filtered });
  }, [searchTerm]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        searchWrapperRef.current &&
        !searchWrapperRef.current.contains(e.target)
      ) {
        setState({ searchTerm: "", results: [] });
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMessageDropdown = () => {
    setState({
      showMessages: !showMessages,
      showNotifications: false,
      showMarketPlace: false,
    });
  };

  const toggleMarketPlace = () => {
    setState({ showMarketPlace: !showMarketPlace });
  };

  const toggleNotificationDropdown = () => {
    setState({
      showNotifications: !showNotifications,
      showMessages: false,
      showMarketPlace: false,
    });
  };

  const toggleSidebar = () => {
    setState({ sidebarOpen: !sidebarOpen });
    window.dispatchEvent(
      new CustomEvent("toggleSidebar", { detail: !sidebarOpen })
    );
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white dark:bg-fb-dark-secondary shadow z-50 px-2 sm:px-4 flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <Link href="/" className="flex items-center">
          <div className="w-14 h-14 bg-amber-50 flex items-center justify-center mr-4">
            <img
              src="/logo_xoxo_500px-removebg-preview.png"
              alt="Logo"
              className="h-full w-full bg-white dark:bg-fb-dark-secondary"
            />
          </div>
        </Link>

        <div
          ref={searchWrapperRef}
          className="bg-gray-100 dark:bg-fb-dark-tertiary sm:flex px-3 py-1 items-center space-x-2 rounded-full min-w-[240px] hidden relative"
        >
          {searchTerm && results.length > 0 && (
            <div className="absolute top-14 bg-white dark:bg-fb-dark-secondary rounded shadow-md p-2 z-50 w-[250px]">
              {results.map((friend) => (
                <div
                  key={friend.id}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer"
                >
                  {friend.name}
                </div>
              ))}
            </div>
          )}

          {searchTerm && results.length === 0 && (
            <div className="absolute top-14 bg-white dark:bg-fb-dark-secondary rounded shadow-md p-2 z-50 w-[250px]">
              <p className="text-gray-500 text-sm">Không tìm thấy kết quả.</p>
            </div>
          )}

          <SearchBar
            type="Search .... "
            value={searchTerm}
            onChange={(e) => setState({ searchTerm: e.target.value })}
          />
        </div>
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
        <NavItem href="/marketplace" onClick={toggleMarketPlace}>
          <FaStore />
        </NavItem>
        <NavItem href="/groups">
          <RiGroup2Line />
        </NavItem>
        <NavItem href="/musics">
          <BsMusicPlayerFill />
        </NavItem>
      </div>

      <div className="flex space-x-1 sm:space-x-2 items-center relative">
        <ThemeToggle />
        <button
          ref={messageRef}
          className="p-2 bg-gray-100 dark:bg-fb-dark-tertiary hover:bg-fb-light-tertiary dark:hover:bg-gray-700 rounded-full relative"
          onClick={toggleMessageDropdown}
        >
          <FiMessageCircle className="text-2xl" />
          <span className="absolute top-1 -right-1 bg-red-500 text-white rounded-full w-3 h-3" />
        </button>

        <button
          ref={notiRef}
          className="p-2 bg-gray-100 dark:bg-fb-dark-tertiary hover:bg-fb-light-tertiary dark:hover:bg-gray-700 rounded-full relative"
          onClick={toggleNotificationDropdown}
        >
          <IoMdNotifications className="text-2xl" />
          <span className="absolute top-1 -right-1 bg-red-500 text-white rounded-full w-3 h-3" />
        </button>

        <ProfileDropdown />
      </div>

      {showSearch && (
        <div className="sm:hidden absolute top-full left-0 right-0 bg-white dark:bg-fb-secondary shadow-lg p-4 z-40">
          <div className="flex items-center space-x-2">
            <div className="flex-1 bg-gray-100 dark:bg-gray-fb-dark-tertiary px-3 py-2 rounded-full flex items-center space-x-2">
              <FiSearch className="text-gray-500" />
              <SearchBar
                value={searchTerm}
                onChange={(e) => setState({ searchTerm: e.target.value })}
                className="flex-1"
              />
              {searchTerm && results.length > 0 && (
                <div className="mt-2 bg-white dark:bg-fb-dark-secondary rounded shadow-md p-2 z-50">
                  {results.map((friend) => (
                    <div
                      key={friend.id}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer"
                    >
                      {friend.name}
                    </div>
                  ))}
                </div>
              )}
              {searchTerm && results.length === 0 && (
                <div className="mt-2 bg-white dark:bg-fb-dark-secondary rounded shadow-md p-2 z-50">
                  <p className="text-gray-500 text-sm">
                    Không tìm thấy kết quả.
                  </p>
                </div>
              )}
            </div>
            <button
              onClick={() => setState({ showSearch: false })}
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
            onClose={() => setState({ showMessages: false })}
            onContactClick={onContactClick}
          />
        </div>
      )}

      {showNotifications && (
        <div className="absolute top-3 -right-15 z-50 sm:-right-15 mt-2">
          <NotificationDropdown
            rel={notiRef}
            notifications={sampleNotifications}
            onClose={() => setState({ showNotifications: false })}
          />
        </div>
      )}
    </header>
  );
}
