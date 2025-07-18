"use client";
import React, { forwardRef } from "react";
import Image from "next/image";

const NotificationDropdown = forwardRef((props, ref) => {
  const { notifications, onClose } = props;

  return (
    <div
      ref={ref}
      className="absolute top-14 right-16 w-[360px] max-h-[400px] overflow-y-auto bg-white dark:bg-fb-dark-tertiary shadow-xl rounded-lg p-3 z-50"
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">Thông báo</h3>
        <button
          onClick={onClose}
          className="text-sm text-gray-500 hover:underline"
        >
          Đóng
        </button>
      </div>
      <ul className="space-y-2">
        {notifications.map((item) => (
          <li
            key={item.id}
            className={`flex items-start gap-3 p-2 rounded-lg ${
              item.isRead ? "bg-transparent" : "bg-blue-50 dark:bg-blue-900"
            } hover:bg-gray-100 dark:hover:bg-gray-700`}
          >
            <Image
              src={item.avatar}
              alt="avatar"
              width={40}
              height={40}
              className="rounded-full w-10 h-10"
            />
            <div className="flex-1">
              <p className="text-sm text-gray-800 dark:text-white">
                {item.message}
              </p>
              <span className="text-xs text-gray-500">{item.time} trước</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
});

NotificationDropdown.displayName = "NotificationDropdown";
export default NotificationDropdown;
