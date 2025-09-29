"use client";
import React, { forwardRef, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  useGetUserByIdQuery,
  useMarkNotificationReadMutation,
  useDeleteNotificationMutation,
  useMarkAllReadMutation,
} from "@/features/userApi";
import websocketService from "@/services/websocketService";

// Component con cho từng notification
const NotificationItem = ({ item, formatTimeAgo }) => {
  const { data: profile } = useGetUserByIdQuery(item.senderId);

  const [markRead] = useMarkNotificationReadMutation();
  const [deleteNoti] = useDeleteNotificationMutation();
  console.log(profile);


  return (
    <li
      className={`flex items-start gap-3 p-2 rounded-lg ${item.isRead ? "bg-transparent" : "bg-blue-50 dark:bg-blue-900"
        } hover:bg-gray-100 dark:hover:bg-gray-700`}
    >
      <Image
        src={profile?.avatarUrl || "/default-avatar.jpg"}
        alt="avatar"
        width={40}
        height={40}
        className="rounded-full w-10 h-10"
      />
      <div className="flex-1">
        <p className="text-sm text-gray-800 dark:text-white">{item.message}</p>
        <span className="text-xs text-gray-500">{formatTimeAgo(item.createdAt)}</span>
      </div>
      <div className="flex flex-col items-end gap-1">
        {!item.isRead && (
          <button
            onClick={async (e) => {
              e.stopPropagation();
              try {
                await markRead(item.id).unwrap();
              } catch { }
            }}
            className="text-xs text-blue-600 hover:underline"
          >
            Đánh dấu đã đọc
          </button>
        )}
        <button
          onClick={async (e) => {
            e.stopPropagation();
            try {
              await deleteNoti(item.id).unwrap();
            } catch { }
          }}
          className="text-xs text-gray-500 hover:underline"
        >
          Xóa
        </button>
      </div>
    </li>
  );
};

const NotificationDropdown = forwardRef((props, ref) => {
  const { notifications = [], isLoading = false, onClose } = props;
  const [markAllRead] = useMarkAllReadMutation();
  console.log(props);

  const [items, setItems] = useState(() => notifications);

  useEffect(() => {
    setItems(notifications);
  }, [notifications]);

  useEffect(() => {
    let sub;
    const run = async () => {
      try {
        await websocketService.connect();
        sub = await websocketService.subscribeToNotifications((realtime) => {
          const mapped = {
            id: realtime.id || `${Date.now()}-${Math.random().toString(36).slice(2)}`,
            message: realtime.message,
            isRead: realtime.read ?? false,
            createdAt: realtime.createdAt,
            senderId: realtime.senderId,
            type: realtime.type,
            targetId: realtime.targetId,
            targetType: realtime.targetType,
            actionType: realtime.actionType,
            payload: realtime.payload,
          };
          setItems((prev) => [mapped, ...prev]);
        });
      } catch (e) {
        console.error("Failed to subscribe notifications:", e);
      }
    };
    run();
    return () => sub?.unsubscribe?.();
  }, []);
  const formatTimeAgo = (isoString) => {
    if (!isoString) return "";
    const then = new Date(isoString).getTime();
    const now = Date.now();
    const diff = Math.max(0, Math.floor((now - then) / 1000));
    if (diff < 60) return `${diff}s trước`;
    const minutes = Math.floor(diff / 60);
    if (minutes < 60) return `${minutes}p trước`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}g trước`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}n trước`;
    const weeks = Math.floor(days / 7);
    if (weeks < 4) return `${weeks}t trước`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months}th trước`;
    const years = Math.floor(days / 365);
    return `${years}y trước`;
  };

  return (
    <div
      ref={ref}
      className="absolute top-9 right-17 w-[360px] max-h-[400px] overflow-y-auto bg-white dark:bg-fb-dark-secondary shadow-xl rounded-lg p-3 z-50 cursor-pointer"
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-black dark:text-white">
          Thông báo
        </h3>
        <div className="flex items-center gap-3">
          <button
            onClick={async () => {
              try { await markAllRead().unwrap(); } catch { }
            }}
            className="text-sm text-blue-600 hover:underline"
          >
            Đánh dấu đã đọc hết
          </button>
          <button
            onClick={onClose}
            className="text-sm text-gray-500 hover:underline dark:text-white-300"
          >
            Đóng
          </button>
        </div>
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center py-6">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
        </div>
      ) : items.length === 0 ? (
        <div className="py-4 text-center text-sm text-gray-500 dark:text-gray-300">Không có thông báo</div>
      ) : (
        <ul className="space-y-2">
          {items.map((item) => (
            <NotificationItem
              key={item.id}
              item={item}
              formatTimeAgo={formatTimeAgo}
            />
          ))}
        </ul>
      )}
    </div>
  );
});

NotificationDropdown.displayName = "NotificationDropdown";
export default NotificationDropdown;
