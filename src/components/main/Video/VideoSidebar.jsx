"use client";

import { SIDEBAR_ITEM_NAMES } from "@/constants/WatchPage";
import {
  Settings,
  Search,
  Home,
  Radio,
  Film,
  Rocket,
  Bookmark,
  X,
  Clock,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function WatchSidebar({ itemSelected, setItemSelected }) {
  const items = [
    {
      label: "Trang chủ",
      icon: <Home className="w-6 h-6" />,
      name: SIDEBAR_ITEM_NAMES.HOME,
      isSelected: itemSelected === SIDEBAR_ITEM_NAMES.HOME,
    },
    {
      label: "Trực tiếp",
      icon: <Radio className="w-6 h-6" />,
      name: SIDEBAR_ITEM_NAMES.LIVE,
      isSelected: itemSelected === SIDEBAR_ITEM_NAMES.LIVE,
    },
    {
      label: "Reels",
      icon: <Film className="w-6 h-6" />,
      name: SIDEBAR_ITEM_NAMES.REELS,
      isSelected: itemSelected === SIDEBAR_ITEM_NAMES.REELS,
    },
    {
      label: "Khám phá",
      icon: <Rocket className="w-6 h-6" />,
      name: SIDEBAR_ITEM_NAMES.EXPLORE,
      isSelected: itemSelected === SIDEBAR_ITEM_NAMES.EXPLORE,
    },
    {
      label: "Video đã lưu",
      icon: <Bookmark className="w-6 h-6" />,
      name: SIDEBAR_ITEM_NAMES.SAVED,
      isSelected: itemSelected === SIDEBAR_ITEM_NAMES.SAVED,
    },
  ];
  const [searchTerm, setSearchTerm] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const searchInputRef = useRef(null);
  const historyDropdownRef = useRef(null);

  // Load search history from localStorage on component mount
  useEffect(() => {
    const storedHistory = localStorage.getItem("videoSearchHistory");
    if (storedHistory) {
      setSearchHistory(JSON.parse(storedHistory));
    }
  }, []);

  // Save search history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("videoSearchHistory", JSON.stringify(searchHistory));
  }, [searchHistory]);

  // Handle clicks outside to close the history dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        historyDropdownRef.current &&
        !historyDropdownRef.current.contains(event.target) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target)
      ) {
        setShowHistory(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    if (e.key === "Enter" && searchTerm.trim()) {
      const newSearchTerm = searchTerm.trim();
      setSearchHistory((prevHistory) => {
        // Remove if already exists to move it to the top
        const filtered = prevHistory.filter((item) => item !== newSearchTerm);
        return [newSearchTerm, ...filtered].slice(0, 5); // Keep last 5 searches
      });
      // Perform actual search here (e.g., navigate or filter content)
      console.log("Searching for:", newSearchTerm);
      setShowHistory(false); // Hide history after search
      // setSearchTerm(""); // Clear search term after search if desired
    }
  };

  const handleHistoryItemClick = (item) => {
    setSearchTerm(item);
    setShowHistory(false);
    // Optionally trigger search immediately
    // console.log("Searching for:", item);
  };

  const handleClearHistoryItem = (itemToRemove, e) => {
    e.stopPropagation(); // Prevent triggering handleHistoryItemClick
    setSearchHistory((prevHistory) =>
      prevHistory.filter((item) => item !== itemToRemove)
    );
  };

  const handleClearAllHistory = () => {
    setSearchHistory([]);
    setShowHistory(false);
  };

  return (
    <aside className="hidden md:block md:w-80 lg:w-96 bg-fb-light-primary dark:bg-fb-dark-secondary text-black dark:text-white h-full flex-shrink-0 border-r border-fb-light-quaternary dark:border-fb-dark-quaternary overflow-y-auto scrollbar-hide">
      <div className="px-4 py-2 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Video</h2>
        <button className="p-2 rounded-full bg-fb-light-quaternary dark:bg-fb-dark-tertiary hover:bg-fb-light-tertiary dark:hover:bg-fb-dark-quaternary transition-colors cursor-pointer">
          <Settings className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      <div className="px-4 py-2">
        <div className="relative">
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Tìm kiếm video"
            onChange={handleSearchChange}
            onFocus={() => setShowHistory(true)}
            onKeyDown={handleSearchSubmit}
            className="w-full bg-fb-light-secondary dark:bg-fb-dark-tertiary rounded-full py-2 pl-10 pr-4 text-sm text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-300 dark:focus:ring-gray-500"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>
      </div>

      {showHistory && (
        <div
          ref={historyDropdownRef}
          className="absolute left-0 right-0 mt-2 md:w-80 lg:w-96 md:max-w-80 lg:max-w-96 bg-fb-light-primary dark:bg-fb-dark-secondary rounded-lg shadow-lg z-10"
        >
          <div className="p-2 text-center max-h-80 overflow-y-auto">
            {searchHistory.length > 0 ? (
              <>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-black dark:text-gray-400">
                    Tìm kiếm gần đây
                  </span>
                  <button
                    onClick={handleClearAllHistory}
                    className="text-xs text-blue-400 hover:underline cursor-pointer"
                  >
                    Xóa tất cả
                  </button>
                </div>
                <ul>
                  {searchHistory.map((item, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between p-2 hover:bg-fb-light-secondary dark:hover:bg-fb-dark-quaternary rounded-md cursor-pointer"
                      onClick={() => handleHistoryItemClick(item)}
                    >
                      <div className="p-2 rounded-full bg-fb-light-tertiary dark:bg-fb-dark-primary">
                        <Clock className="w-5 h-5 text-gray-500 dark:text-gray-300" />
                      </div>
                      <div className="flex-1 mx-2 overflow-hidden">
                        <span className="truncate text-sm text-start block text-black dark:text-gray-200">
                          {item}
                        </span>
                      </div>
                      <button
                        onClick={(e) => handleClearHistoryItem(item, e)}
                        className="p-1 rounded-full hover:bg-fb-light-primary dark:hover:bg-fb-dark-tertiary text-gray-400 cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <span className="">Không có tìm kiếm nào gần đây</span>
            )}
          </div>
        </div>
      )}

      <nav className="p-2">
        <ul>
          {items.map((item) => (
            <li key={item.name} className="mt-1">
              <button
                className={`flex items-center w-full px-3 py-2 rounded-lg ${
                  item.isSelected &&
                  "bg-fb-light-secondary dark:bg-fb-dark-quaternary"
                } 
                hover:bg-fb-light-secondary dark:hover:bg-fb-dark-quaternary text-black dark:text-gray-300 font-medium space-x-3 transition-colors cursor-pointer`}
                onClick={() => setItemSelected(item.name)}
              >
                <div
                  className={`p-2 rounded-full ${
                    item.isSelected
                      ? "bg-blue-600 text-white"
                      : "bg-fb-light-tertiary dark:bg-fb-dark-tertiary"
                  }`}
                >
                  {item.icon}
                </div>
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
