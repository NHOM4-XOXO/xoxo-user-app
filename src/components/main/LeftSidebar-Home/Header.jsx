"use client";
import { useRef, useEffect } from "react";
import { FaUserFriends, FaStore } from "react-icons/fa";
import { FiSearch, FiMessageCircle, FiRefreshCw } from "react-icons/fi";
import { IoMdHome, IoMdNotifications } from "react-icons/io";
import { MdOndemandVideo } from "react-icons/md";
import { RiGroup2Line } from "react-icons/ri";
import { IoClose } from "react-icons/io5";
import Image from "next/image";
import MessageDropdown from "./MessageDropdown";
import NotificationDropdown from "./NotiDropDown";
import SearchBar from "../../Search/SearchBar";
import {
  
  sampleNotifications,
} from "../../../data/asideHeaderSampleData";
import sampleFriends from "../../../data/sampleFriends";
import NavItem from "../../../components/Navbar/NavItem";
import ThemeToggle from "../../ThemeToggle";
import ProfileDropdown from "../../../components/ProfileDropdown";
import { BsMusicPlayerFill } from "react-icons/bs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { searchUsers } from "../../../features/searchApi";
import useMergeState from "../../../hooks/useMergeState";
import { useGetChatRoomsQuery } from "@/features/chatApi";

export default function Header({ onContactClick }) {
  const router = useRouter();

  const [state, setState] = useMergeState({
    showMessages: false,
    showNotifications: false,
    showSearch: false,
    sidebarOpen: false,
    showMarketPlace: false,
    searchTerm: "",
    results: {
      users: [],
      posts: [],
      groups: [],
      totalResults: 0,
    },
    loading: false,
    showResults: false,
  });

  const {
    showMessages,
    showNotifications,
    showSearch,
    sidebarOpen,
    showMarketPlace,
    searchTerm,
    results,
    loading,
    showResults,
  } = state;

  const searchWrapperRef = useRef(null);
  const messageRef = useRef(null);
  const notiRef = useRef(null);

  // Search functionality với API call
  useEffect(() => {
    const performSearch = async () => {
      if (!searchTerm.trim()) {
        setState({
          results: { users: [], posts: [], groups: [], totalResults: 0 },
          showResults: false,
          loading: false,
        });
        return;
      }

      if (searchTerm.trim().length < 1) {
        setState({
          results: { users: [], posts: [], groups: [], totalResults: 0 },
          showResults: false,
          loading: false,
        });
        return; 
      }

      
      setState({ 
        loading: true, 
        showResults: true,
        results: { users: [], posts: [], groups: [], totalResults: 0 }, // Clear old results
      });

      try {
        console.log("Searching for:", searchTerm.trim()); // Debug log
        const response = await searchUsers({
          keyword: searchTerm.trim(),
          page: 0,
          size: 10, // Giới hạn kết quả cho dropdown
        });

        console.log("Search response:", response); // Debug log

        if (response && response.data) {
          setState({
            results: response.data,
            loading: false,
            showResults: true, // Đảm bảo vẫn hiển thị results
          });
        } else {
          setState({
            results: { users: [], posts: [], groups: [], totalResults: 0 },
            loading: false,
            showResults: true,
          });
        }
      } catch (error) {
        console.error("Search error:", error);
        setState({
          results: { users: [], posts: [], groups: [], totalResults: 0 },
          loading: false,
          showResults: true,
        });
      }
    };

    const timeoutId = setTimeout(performSearch, 200);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        searchWrapperRef.current &&
        !searchWrapperRef.current.contains(e.target)
      ) {
        setState({
          searchTerm: "",
          results: { users: [], posts: [], groups: [], totalResults: 0 },
          showResults: false,
        });
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

  const handleSearchSubmit = () => {
    if (searchTerm.trim()) {
      // Chuyển đến trang search với keyword
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      setState({
        searchTerm: "",
        results: { users: [], posts: [], groups: [], totalResults: 0 },
        showResults: false,
      });
    }
  };

  // Force search - chuyển đến trang search với từ khóa mới
  const handleForceSearch = () => {
    if (searchTerm.trim()) {
      // Chuyển đến trang search với keyword mới để render lại kết quả
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      setState({
        searchTerm: "",
        results: { users: [], posts: [], groups: [], totalResults: 0 },
        showResults: false,
      });
    }
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      // Enter sẽ chuyển đến trang search để render lại kết quả
      handleForceSearch();
    }
    if (e.key === "Escape") {
      setState({
        searchTerm: "",
        results: { users: [], posts: [], groups: [], totalResults: 0 },
        showResults: false,
      });
    }
  };

  const handleUserClick = (user) => {
    // Chuyển đến profile của user
    router.push(`/profile/${user.id}`);
    setState({
      searchTerm: "",
      results: { users: [], posts: [], groups: [], totalResults: 0 },
      showResults: false,
    });
  };

  const handleViewAllResults = () => {
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      setState({
        searchTerm: "",
        results: { users: [], posts: [], groups: [], totalResults: 0 },
        showResults: false,
      });
    }
  };

  const handleReload = () => {
    // Reload trang hiện tại
    window.location.reload();
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white dark:bg-fb-dark-secondary shadow z-50 px-2 sm:px-4 flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <Link href="/" className="flex items-center">
          <div className="w-14 h-14 bg-amber-50 flex items-center justify-center mr-4">
            <img
              src="/XoXo-Lg.png"
              alt="Logo"
              className="h-full w-full bg-white dark:bg-fb-dark-secondary"
            />
          </div>
        </Link>

        <div
          ref={searchWrapperRef}
          className="bg-gray-100 dark:bg-fb-dark-tertiary sm:flex px-3 py-1 items-center space-x-2 rounded-full min-w-[240px] hidden relative"
        >
          {/* Search Results Dropdown */}
          {showResults && (
            <div className="absolute top-14 bg-white dark:bg-fb-dark-secondary rounded-lg shadow-lg p-2 z-50 w-[350px] max-h-[400px] overflow-y-auto">
              {loading ? (
                <div className="flex justify-center items-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <>
                  {/* Users */}
                  {results.users && results.users.length > 0 && (
                    <div className="mb-3">
                      <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2 px-2">
                        Mọi người
                      </h4>
                      {results.users.slice(0, 3).map((user) => (
                        <div
                          key={user.id}
                          onClick={() => handleUserClick(user)}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer flex items-center gap-3"
                        >
                          <img
                            src={user.avatarUrl || "/default-avatar.jpg"}
                            alt={user.username}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {user.firstName} {user.lastName}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              @{user.username}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Posts */}
                  {results.posts && results.posts.length > 0 && (
                    <div className="mb-3">
                      <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2 px-2">
                        Bài viết
                      </h4>
                      {results.posts.slice(0, 2).map((post) => (
                        <div
                          key={post.id}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer"
                        >
                          <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                            {post.content}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            bởi {post.authorName}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Groups */}
                  {results.groups && results.groups.length > 0 && (
                    <div className="mb-3">
                      <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2 px-2">
                        Nhóm
                      </h4>
                      {results.groups.slice(0, 2).map((group) => (
                        <div
                          key={group.id}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer flex items-center gap-3"
                        >
                          <img
                            src={group.coverUrl || "/default-avatar.jpg"}
                            alt={group.title}
                            className="w-8 h-8 rounded object-cover"
                          />
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {group.title}
                            </p>
                            <p className="text-xs text-gray-500">
                              {group.memberCount} thành viên
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* View All Results */}
                  {results.totalResults > 0 && (
                    <div className="border-t border-gray-200 dark:border-gray-600 pt-2">
                      <button
                        onClick={handleViewAllResults}
                        className="w-full p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded text-sm font-medium"
                      >
                        Xem tất cả kết quả cho "{searchTerm}" →
                      </button>
                    </div>
                  )}

                  {/* No Results */}
                  {!loading &&
                    results.totalResults === 0 &&
                    searchTerm.trim().length >= 1 && (
                      <div className="py-4 text-center">
                        <p className="text-gray-500 text-sm">
                          Không tìm thấy kết quả cho "{searchTerm}"
                        </p>
                      </div>
                    )}
                </>
              )}
            </div>
          )}

          <div className="flex items-center">
            <SearchBar
              placeholder="Tìm kiếm trên XOXO..."
              value={searchTerm}
              onChange={(e) => setState({ searchTerm: e.target.value })}
              onKeyDown={handleSearchKeyDown}
            />
            <button
              onClick={handleForceSearch}
              className="ml-2 p-2 text-gray-500 hover:text-blue-500 transition-colors"
              title="Tìm kiếm"
            >
              <FiSearch className="w-4 h-4" />
            </button>
          </div>
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

        {/* Reload Button */}
        <button
          onClick={handleReload}
          className="p-2 bg-gray-100 dark:bg-fb-dark-tertiary hover:bg-fb-light-tertiary dark:hover:bg-gray-700 rounded-full transition-colors"
          title="Tải lại trang"
        >
          <FiRefreshCw className="text-xl" />
        </button>

        <button
          ref={messageRef}
          className="p-2 bg-gray-100 dark:bg-fb-dark-tertiary hover:bg-fb-light-tertiary dark:hover:bg-gray-700 rounded-full relative"
          onClick={toggleMessageDropdown}
        >
          <FiMessageCircle className="text-2xl" />
          {/* <span className="absolute top-1 -right-1 bg-red-500 text-white rounded-full w-3 h-3" /> */}
        </button>

        <button
          ref={notiRef}
          className="p-2 bg-gray-100 dark:bg-fb-dark-tertiary hover:bg-fb-light-tertiary dark:hover:bg-gray-700 rounded-full relative"
          onClick={toggleNotificationDropdown}
        >
          <IoMdNotifications className="text-2xl" />
          {/* <span className="absolute top-1 -right-1 bg-red-500 text-white rounded-full w-3 h-3" /> */}
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
                onKeyDown={handleSearchKeyDown}
                className="flex-1"
              />
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
            messages={[]}
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

