"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function TabNav({
  tabs = [
    { href: "/events", label: "Sự kiện" },
    { href: "/saved", label: "Đã lưu" },
    { href: "/games", label: "Chơi Game" },
  ],
  className = "",
}) {
  const pathname = usePathname();
  return (
    <div className={`flex gap-2 overflow-x-auto ${className}`}>
      {tabs.map((t) => {
        const active = pathname?.startsWith(t.href);
        return (
          <Link
            key={t.href}
            href={t.href}
            className={`whitespace-nowrap rounded-2xl border px-4 py-2 text-sm transition cursor-pointer ${
              active
                ? "bg-blue-600 text-white dark:bg-blue-500"
                : "hover:bg-blue-50 dark:hover:bg-blue-900/30"
            }`}
          >
            {t.label}
          </Link>
        );
      })}
    </div>
  );
}
