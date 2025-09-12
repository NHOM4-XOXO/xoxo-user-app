"use client";
import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";

export default function SidebarShell({
  children,
  title = "Menu",
  className = "",
  contentClassName = "",
}) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleToggleSidebar = (event) => setIsOpen(!!event.detail);
    const handleResize = () => {
      if (typeof window !== "undefined" && window.innerWidth >= 1024) {
        setIsOpen(false);
      }
    };
    window.addEventListener("toggleSidebar", handleToggleSidebar);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("toggleSidebar", handleToggleSidebar);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const closeSidebar = () => {
    setIsOpen(false);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("toggleSidebar", { detail: false }));
    }
  };

  const asideBase =
    "h-full w-72 sm:w-80 bg-white dark:bg-fb-dark-primary shadow-lg lg:shadow-none p-4 z-50 transition-transform duration-300 ease-in-out -translate-x-full lg:translate-x-0 lg:top-14 lg:h-[calc(100vh-56px)] lg:z-30";
  const asideClass = [asideBase, isOpen && "translate-x-0", className]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={closeSidebar}
        />
      )}

      <aside className={asideClass}>
        {/* Mobile header */}
        <div className="lg:hidden flex justify-between items-center mb-4 pt-2">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button
            onClick={closeSidebar}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
          >
            <IoClose className="text-xl" />
          </button>
        </div>

        <div
          className={["flex flex-col gap-6", contentClassName].join(" ").trim()}
        >
          {children}
        </div>
      </aside>
    </>
  );
}
