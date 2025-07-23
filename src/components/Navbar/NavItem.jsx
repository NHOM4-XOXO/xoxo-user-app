"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavItem({ href, exact = false, children }) {
  const pathname = usePathname();
  const isActive = exact ? pathname === href : pathname.startsWith(href);

  const baseStyle = "p-2 lg:p-3 rounded-lg transition-colors cursor-pointer";
  const activeStyle = "text-blue-600 bg-gray-200 dark:bg-gray-700";
  const hoverStyle =
    "hover:text-blue-600 hover:bg-gray-100 dark:hover:bg-gray-700";
  const className = `${baseStyle} ${hoverStyle} ${
    isActive ? activeStyle : "text-gray-400"
  }`;

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
