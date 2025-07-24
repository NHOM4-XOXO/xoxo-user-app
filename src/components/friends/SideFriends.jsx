"use client";
import { FaUserFriends } from "react-icons/fa";
import { RiUserAddLine } from "react-icons/ri";
import { MdOutlinePeople } from "react-icons/md";
import { HiOutlineGift } from "react-icons/hi";
import { BsListUl } from "react-icons/bs";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/friends", icon: <FaUserFriends />, label: "Trang chủ" },
  {
    href: "/friends/requests",
    icon: <RiUserAddLine />,
    label: "Lời mời kết bạn",
  },
  { href: "/friends/suggestions", icon: <MdOutlinePeople />, label: "Gợi ý" },
  { href: "/friends/all", icon: <FaUserFriends />, label: "Tất cả bạn bè" },
  { href: "/friends/birthdays", icon: <HiOutlineGift />, label: "Sinh nhật" },
  {
    href: "/friends/custom-lists",
    icon: <BsListUl />,
    label: "Danh sách tùy chỉnh",
  },
];

export default function SidebarFriend() {
  const pathname = usePathname();

  return (
    <aside className="w-72 sm:w-80 bg-white dark:bg-fb-dark-primary p-4  overflow-y-auto hidden lg:block">
      <div className="aside-children fixed">
        <h2 className="text-xl font-semibold mb-4 px-2 text-black dark:text-white">
          Bạn bè
        </h2>
        <ul className="space-y-1">
          {items.map((item, idx) => {
            const isActive = pathname === item.href;
            return (
              <li key={idx}>
                <Link
                  href={item.href}
                  className={`flex items-center space-x-3 p-3 rounded-lg transition-colors
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
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}
