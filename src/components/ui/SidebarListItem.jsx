"use client";
import Image from "next/image";
import React from "react";

export default function SidebarListItem({
  image,
  title,
  subtitle,
  onClick,
  badge,
  className = "",
}) {
  const classes = [
    "w-full flex items-center space-x-3 p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg cursor-pointer text-left transition-colors",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button onClick={onClick} className={classes}>
      <div className="relative">
        <Image
          src={image || "/placeholder.svg"}
          alt={title || "item"}
          width={40}
          height={40}
          className="w-10 h-10 rounded-lg object-cover"
        />
        {badge ? <div className="absolute -top-1 -right-1">{badge}</div> : null}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
          {title}
        </p>
        {subtitle && (
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
            {subtitle}
          </p>
        )}
      </div>
    </button>
  );
}
