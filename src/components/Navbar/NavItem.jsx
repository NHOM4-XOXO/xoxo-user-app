"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

export default function NavItem({ href, children }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link href={href}>
      <div
        className={clsx(
          "flex flex-col items-center p-2 w-[60px] transition-colors",
          isActive
            ? "text-blue-600 px-9 bg-blue-100 dark:bg-blue-900 rounded-xl"
            : "text-gray-500 hover:text-blue-600"
        )}
      >
        {children}
      </div>
    </Link>
  );
}
