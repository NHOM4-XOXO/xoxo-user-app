"use client";

import { Settings } from "lucide-react";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useGroups } from "@/contexts/GroupsContext";
import SidebarShell from "@/components/ui/SidebarShell";
import SidebarSection from "@/components/ui/SidebarSection";
import SidebarListItem from "@/components/ui/SidebarListItem";
import { TbDeviceImacSearch } from "react-icons/tb";
import { HiMiniUserGroup } from "react-icons/hi2";

export default function GroupsSidebar() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const pathname = usePathname();
  const { myGroups } = useGroups();

  const navItems = [
    { label: "Khám phá", href: "/groups", icon: <TbDeviceImacSearch /> },
    {
      label: "Nhóm của bạn",
      href: "/groups?tab=mine",
      icon: <HiMiniUserGroup />,
    },
  ];

  return (
    <>
      {/* Spacer: chừa chỗ cho sidebar cố định (đồng bộ với các sidebar khác) */}
      <div className="hidden md:block w-72 sm:w-80 shrink-0" aria-hidden />

      {/* Sidebar cố định trên md+ */}
      <SidebarShell
        title="Nhóm"
        className="
          hidden md:block w-72 sm:w-80
          md:fixed md:top-14 md:bottom-0 md:left-0
        "
        contentClassName="gap-4 h-full"
      >
        {/* Header actions (không cuộn) */}
        <div className="mb-2">
          <div className="flex items-center justify-between px-2">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Nhóm
            </h1>
            <button className="text-blue-600 hover:text-blue-700 font-medium cursor-pointer p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
              <Settings />
            </button>
          </div>
        </div>

        {/* Search (không cuộn) */}
        <div className="px-2">
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
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md leading-5 bg-white dark:bg-fb-dark-primary placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Tìm kiếm nhóm"
            />
          </div>
        </div>

        {/* Vùng cuộn nội bộ: Nav + Create + My Groups */}
        <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden [scrollbar-gutter:stable] pr-2">
          {/* Navigation (icon xanh + hover/active đồng bộ) */}
          <SidebarSection className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <ul className="space-y-1 px-1">
              {navItems.map((item, idx) => {
                const isActive = pathname === item.href;
                return (
                  <li key={idx}>
                    <button
                      onClick={() => router.push(item.href)}
                      className={`flex items-center space-x-3 p-3 rounded-lg transition-colors w-full text-left cursor-pointer
                        ${
                          isActive
                            ? "bg-gray-200 dark:bg-gray-700 font-semibold"
                            : "hover:bg-gray-100 dark:hover:bg-gray-800"
                        }
                      `}
                    >
                      <span className="text-xl text-blue-600">{item.icon}</span>
                      <span className="text-sm text-black dark:text-white">
                        {item.label}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </SidebarSection>

          {/* Create Group */}
          <div className="px-2 mt-3">
            <button
              onClick={() => router.push("/groups/create")}
              className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 cursor-pointer"
            >
              Tạo nhóm mới
            </button>
          </div>

          {/* My Groups */}
          <SidebarSection title="Nhóm bạn đã tham gia">
            <div className="space-y-1">
              {myGroups.map((g) => (
                <SidebarListItem
                  key={g.id}
                  image={g.image}
                  title={g.name}
                  subtitle={g.lastActivity}
                  onClick={() => router.push(`/groups/${g.id}`)}
                  badge={
                    g.hasNotification ? (
                      <div className="w-3 h-3 bg-red-500 rounded-full" />
                    ) : null
                  }
                />
              ))}
            </div>
          </SidebarSection>
        </div>

        {/* Footer (không cuộn, dính đáy) */}
        <SidebarSection withTopBorder>
          <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1 px-3">
            <p>Quyền riêng tư · Điều khoản · Quảng cáo · Lựa chọn quảng cáo</p>
            <p>XOXO © 2025</p>
          </div>
        </SidebarSection>
      </SidebarShell>
    </>
  );
}
