"use client";

import { useState } from "react";

const myGroups = [
  {
    id: 1,
    name: "GIÚP TUỔI CẤY SHOPEE",
    image: "/image/group1.jpg",
    hasNotification: true,
    lastActivity: "Lần hoạt động gần nhất: 5 phút trước",
  },
  {
    id: 2,
    name: "Garena Liên Quân Mobile",
    image: "/image/group2.jpg",
    hasNotification: false,
    lastActivity: "Lần hoạt động gần nhất: khoảng 1 giờ trước",
  },
  {
    id: 3,
    name: "Garena Liên Quân Mobile vn",
    image: "/image/group1.jpg",
    hasNotification: false,
    lastActivity: "Lần hoạt động gần nhất: 46 phút trước",
  },
  {
    id: 4,
    name: "SỐ GÌ ĐẤY SHOPEE ?",
    image: "/image/group2.jpg",
    hasNotification: false,
    lastActivity: "Lần hoạt động gần nhất: 24 phút trước",
  },
];

export default function GroupsSidebar({ activeTab, setActiveTab }) {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className=" bg-white rounded-lg shadow-sm w-90 ">
      {/* Search */}
      <div className="p-3 border-b border-gray-200">
        <div className="relative">
          <div className="flex items-center space-x-58">
            <h1 className="text-2xl font-bold text-gray-900">Nhóm</h1>
            <button className="text-blue-600 hover:text-blue-700 font-medium">
              ⚙️
            </button>
          </div>
          <div className="absolute inset-y-13 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Tìm kiếm nhóm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-600 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Navigation */}
      <div className="p-4 border-b border-gray-200">
        <nav className="space-y-2">
          <button
            onClick={() => setActiveTab("feed")}
            className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
              activeTab === "feed"
                ? "bg-blue-50 text-blue-700"
                : "text-gray-900 hover:bg-gray-50"
            }`}
          >
            <div className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center mr-4">
              📰
            </div>
            Bảng feed của bạn
          </button>

          <button
            onClick={() => setActiveTab("discovery")}
            className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
              activeTab === "discovery"
                ? "bg-blue-50 text-blue-700"
                : "text-gray-900 hover:bg-gray-50"
            }`}
          >
            <div className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center mr-4">
              🔍
            </div>
            Khám phá
          </button>

          <button className="w-full flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-900 hover:bg-gray-50">
            <div className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center mr-4">
              👥
            </div>
            Nhóm của bạn
          </button>
        </nav>
      </div>

      {/* Create Group Button */}
      <div className="p-4 border-b border-gray-200">
        <button className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700">
          ➕ Tạo nhóm mới
        </button>
      </div>

      {/* My Groups */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-900">
            Nhóm bạn đã tham gia
          </h3>
          <button className="text-blue-600 hover:text-blue-700 text-sm">
            Xem tất cả
          </button>
        </div>

        <div className="space-y-2">
          {myGroups.map((group) => (
            <div
              key={group.id}
              className="flex items-center p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
              onClick={() => (window.location.href = `/groups/${group.id}`)}
            >
              <div className="relative">
                <img
                  src={group.image}
                  alt={group.name}
                  className="w-10 h-10 rounded-lg object-cover"
                />
                {group.hasNotification && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
                )}
              </div>
              <div className="ml-3 flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {group.name}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {group.lastActivity}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
