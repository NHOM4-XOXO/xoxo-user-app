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

import SidebarShell from "@/components/ui/SidebarShell";
import SidebarSection from "@/components/ui/SidebarSection";

export default function WatchSidebar({ itemSelected, setItemSelected }) {
  const items = [
    {
      label: "Trang chủ",
      icon: <Home className="w-6 h-6" />,
      name: SIDEBAR_ITEM_NAMES.HOME,
    },
    {
      label: "Trực tiếp",
      icon: <Radio className="w-6 h-6" />,
      name: SIDEBAR_ITEM_NAMES.LIVE,
    },
    {
      label: "Reels",
      icon: <Film className="w-6 h-6" />,
      name: SIDEBAR_ITEM_NAMES.REELS,
    },
    {
      label: "Khám phá",
      icon: <Rocket className="w-6 h-6" />,
      name: SIDEBAR_ITEM_NAMES.EXPLORE,
    },
    {
      label: "Video đã lưu",
      icon: <Bookmark className="w-6 h-6" />,
      name: SIDEBAR_ITEM_NAMES.SAVED,
    },
  ];

  const [searchTerm, setSearchTerm] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const searchInputRef = useRef(null);
  const historyDropdownRef = useRef(null);

  // Load history
  useEffect(() => {
    const stored = localStorage.getItem("videoSearchHistory");
    if (stored) setSearchHistory(JSON.parse(stored));
  }, []);

  // Persist history
  useEffect(() => {
    localStorage.setItem("videoSearchHistory", JSON.stringify(searchHistory));
  }, [searchHistory]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        historyDropdownRef.current &&
        !historyDropdownRef.current.contains(e.target) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(e.target)
      ) {
        setShowHistory(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  const handleSearchSubmit = (e) => {
    if (e.key === "Enter" && searchTerm.trim()) {
      const term = searchTerm.trim();
      setSearchHistory((prev) => {
        const filtered = prev.filter((i) => i !== term);
        return [term, ...filtered].slice(0, 5);
      });
      // TODO: thực hiện search thật tại đây
      setShowHistory(false);
    }
  };

  const handleHistoryItemClick = (item) => {
    setSearchTerm(item);
    setShowHistory(false);
    // Optional: trigger search tại đây
  };

  const handleClearHistoryItem = (itemToRemove, e) => {
    e.stopPropagation();
    setSearchHistory((prev) => prev.filter((i) => i !== itemToRemove));
  };

  const handleClearAllHistory = () => {
    setSearchHistory([]);
    setShowHistory(false);
  };

  return (
    <>
      {/* Spacer: chừa chỗ cho sidebar cố định (đồng bộ kích thước với các sidebar khác) */}
      <div className="hidden md:block w-72 sm:w-80 shrink-0" aria-hidden />

      {/* Sidebar cố định trên md+ */}
      <SidebarShell
        title="Video"
        className="
          hidden md:block w-72 sm:w-80
          md:fixed md:top-14 md:bottom-0 md:left-0
        "
        contentClassName="gap-4 relative h-full"
      >
        {/* Header (không cuộn) */}
        <div className="px-4 py-2 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-black dark:text-white">
            Video
          </h2>
          <button className="p-2 rounded-full bg-fb-light-quaternary dark:bg-fb-dark-tertiary hover:bg-fb-light-tertiary dark:hover:bg-fb-dark-quaternary transition-colors cursor-pointer">
            <Settings className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Search (không cuộn) */}
        <div className="px-4 py-2">
          <div className="relative">
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Tìm kiếm video"
              value={searchTerm}
              onChange={handleSearchChange}
              onFocus={() => setShowHistory(true)}
              onKeyDown={handleSearchSubmit}
              className="w-full bg-fb-light-secondary dark:bg-fb-dark-tertiary rounded-full py-2 pl-10 pr-4 text-sm text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-300 dark:focus:ring-gray-500"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
        </div>

        {/* Dropdown lịch sử (absolute trong shell) */}
        {showHistory && (
          <div
            ref={historyDropdownRef}
            className="absolute left-4 right-4 top-28 bg-fb-light-primary dark:bg-fb-dark-secondary rounded-lg shadow-lg z-10"
          >
            <div className="p-2 text-center max-h-80 overflow-y-auto">
              {searchHistory.length > 0 ? (
                <>
                  <div className="flex justify-between items-center mb-2 px-2">
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
                <span className="block py-2 text-sm text-gray-500 dark:text-gray-400">
                  Không có tìm kiếm nào gần đây
                </span>
              )}
            </div>
          </div>
        )}

        {/* Vùng cuộn nội bộ: danh mục — icon xanh + active/hover đồng bộ */}
        <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden [scrollbar-gutter:stable] pr-2 ">
          <SidebarSection className="px-2">
            <ul>
              {items.map((item) => {
                const isActive = itemSelected === item.name;
                return (
                  <li key={item.name} className="mt-1">
                    <button
                      onClick={() => setItemSelected(item.name)}
                      className={`flex items-center w-full px-3 py-2 rounded-lg cursor-pointer transition-colors
                        ${
                          isActive
                            ? "bg-gray-200 dark:bg-gray-700 font-semibold"
                            : "hover:bg-gray-100 dark:hover:bg-gray-800"
                        }
                      `}
                    >
                      <span className="text-xl text-blue-600">{item.icon}</span>
                      <span className="ml-3 text-sm text-black dark:text-white">
                        {item.label}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </SidebarSection>
        </div>

        {/* Footer chuẩn */}
        <SidebarSection withTopBorder className="pt-4">
          <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1 px-3">
            <p>Quyền riêng tư · Điều khoản · Quảng cáo · Lựa chọn quảng cáo</p>
            <p>XOXO © 2025</p>
          </div>
        </SidebarSection>
      </SidebarShell>
    </>
  );
}
