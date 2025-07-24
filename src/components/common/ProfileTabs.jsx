// src/components/profile/ProfileTabs.jsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ProfileTabs({ tabs }) {
    const pathname = usePathname();

    return (
        <ul className="flex flex-wrap gap-6 text-sm p-3 text-gray-700 dark:text-gray-300 justify-center">
            {tabs.map((tab, i) => {
                const isActive = pathname === `/profile${tab.path === "/" ? "" : `/${tab.path}`}`;


                return (
                    <li key={i}>
                        <Link
                            href={`/profile/${tab.path}`}
                            className={`relative transition-colors duration-200 py-2 px-3 rounded-sm ${isActive
                                ? "text-blue-600 dark:text-blue-400 font-medium after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:border-b-2 after:border-blue-600 dark:after:border-blue-400"
                                : "hover:bg-fb-light-tertiary dark:hover:bg-fb-dark-tertiary"
                                }`}
                        >
                            {tab.label}
                        </Link>
                    </li>
                );
            })}
        </ul>
    );
}
