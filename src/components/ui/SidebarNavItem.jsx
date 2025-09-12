"use client";
import Link from "next/link";
import React from "react";

export default function SidebarNavItem({
  icon,
  label,
  href,
  onClick,
  right,
  className = "",
  active = false,
  labelClassName = "text-black dark:text-gray-300",
}) {
  const base =
    "w-full p-3 rounded-lg cursor-pointer flex items-center space-x-3 text-left transition-colors";
  const color =
    "hover:bg-gray-100 dark:hover:bg-gray-800 " +
    (active ? "bg-gray-100 dark:bg-gray-800" : "");
  const classes = [base, color, className].filter(Boolean).join(" ");

  const Label = () => (
    <span className={["font-medium flex-1", labelClassName].join(" ")}>
      {label}
    </span>
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {icon && <span className="text-xl">{icon}</span>}
        <Label />
        {right}
      </Link>
    );
  }

  return (
    <button className={classes} onClick={onClick}>
      {icon && <span className="text-xl">{icon}</span>}
      <Label />
      {right}
    </button>
  );
}
