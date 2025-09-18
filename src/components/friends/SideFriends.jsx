"use client";
import { FaUserFriends } from "react-icons/fa";
import { MdOutlinePeople } from "react-icons/md";
import { HiOutlineGift } from "react-icons/hi";
import { BsListUl } from "react-icons/bs";
import Link from "next/link";
import { usePathname } from "next/navigation";

import SidebarShell from "@/components/ui/SidebarShell";
import SidebarSection from "@/components/ui/SidebarSection";

const items = [
  { href: "/friends", icon: <FaUserFriends />, label: "Trang chủ" },
  // { href: "/friends/requests", icon: <RiUserAddLine />, label: "Lời mời kết bạn" },
  { href: "/friends/suggestions", icon: <MdOutlinePeople />, label: "Gợi ý" },
  { href: "/friends/all", icon: <FaUserFriends />, label: "Tất cả bạn bè" },
];

export default function SidebarFriend() {
  const pathname = usePathname();

  return (
    <>
      {/* Spacer: chừa chỗ cho sidebar fixed trên màn hình lớn */}
      <div className="hidden lg:block w-72 sm:w-80 shrink-0" aria-hidden />

      {/* Sidebar fixed (UI chuẩn + footer) */}
      <SidebarShell
        title="Bạn bè"
        className="
          hidden lg:block w-72 sm:w-80
          lg:fixed lg:top-14 lg:bottom-0 lg:left-0
        "
        contentClassName="gap-4 h-full"
      >
        {/* Header (không cuộn) */}
        <div className="px-2">
          <h2 className="text-xl font-semibold text-black dark:text-white">
            Bạn bè
          </h2>
        </div>

        {/* Vùng cuộn nội bộ: danh sách */}
        <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden [scrollbar-gutter:stable] pr-1">
          <ul className="space-y-1 px-1">
            {items.map((item, idx) => {
              const isActive = pathname === item.href;
              return (
                <li key={idx}>
                  <Link
                    href={item.href}
                    className={`flex items-center space-x-3 p-3 rounded-lg transition-colors
                      ${isActive
                        ? "bg-gray-200 dark:bg-gray-700 font-semibold"
                        : "hover:bg-gray-100 dark:hover:bg-gray-800"
                      }
                    `}
                  >
                    <span className="text-xl text-blue-600">{item.icon}</span>
                    <span className="text-sm text-black dark:text-white">
                      {item.label}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Footer chuẩn (không cuộn, dính đáy) */}
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
