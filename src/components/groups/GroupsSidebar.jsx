"use client";

import { Settings } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useGroups } from "@/contexts/GroupsContext";

export default function GroupsSidebar({ activeTab, setActiveTab }) {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const { myGroups } = useGroups();

  return (
    <div className="bg-white rounded-lg shadow-sm w-90">
      {/* Search */}
      <div className="p-3 border-b border-gray-200">
        <div className="relative">
          <div className="flex items-center space-x-58">
            <h1 className="text-2xl font-bold text-gray-900">Nhóm</h1>
            <button className="text-blue-600 hover:text-blue-700 font-medium cursor-pointer">
              <Settings />
            </button>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Tìm kiếm nhóm"
          />
        </div>
      </div>

      {/* Navigation */}
      <div className="p-4 border-b border-gray-200">
        <nav className="space-y-1">
          <button
            className="w-full flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-900 hover:bg-gray-50"
            onClick={() => router.push("/groups")}
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
        <button
          onClick={() => router.push("/groups/create")}
          className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 cursor-pointer"
        >
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
              className="flex items-center p-2 rounded-md hover:bg-gray-50 cursor-pointer"
              onClick={() => router.push(`/groups/${group.id}`)}
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
