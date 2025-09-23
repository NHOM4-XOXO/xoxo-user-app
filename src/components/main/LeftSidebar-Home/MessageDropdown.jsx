"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGetUserByIdQuery, useGetCurrentUserProfileQuery } from "@/features/chatApi";

// Component for individual message item with proper avatar
function MessageItem({ chatRoom, onContactClick, onClose }) {
  const { data: profileData } = useGetCurrentUserProfileQuery();
  const myId = profileData?.id;
  
  // Get other participant ID from chat room
  const otherId = chatRoom?.participantIds?.find(id => id !== myId);
  const { data: otherUser } = useGetUserByIdQuery(otherId, { skip: !otherId });

  // Get display data
  const displayAvatar = otherUser?.avatarUrl || "/default-avatar.jpg";
  const displayName = otherUser ? 
    `${(otherUser.firstName || "")} ${(otherUser.lastName || "")}`.trim() || otherUser.username || otherUser.email
    : chatRoom.name;

  // Format last message preview
  const lastMessage = typeof chatRoom.lastMessage === 'string' 
    ? chatRoom.lastMessage 
    : chatRoom.lastMessage?.content || "No messages yet";

  // Format time
  const lastMessageTime = chatRoom.lastMessageAt 
    ? new Date(chatRoom.lastMessageAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "";

  const handleClick = () => {
    if (onContactClick) {
      // Create contact object with proper structure
      const contact = {
        id: chatRoom.id,
        name: displayName, // Use the computed displayName instead of chatRoom.name
        avatarUrl: displayAvatar, // Use the computed displayAvatar
        isOnline: otherUser?.isOnline || false,
        userId: otherId,
        chatRoom: chatRoom,
      };
      onContactClick(contact);
    }
    onClose();
  };

  return (
    <div
      className={`flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer ${
        !chatRoom.unreadCount ? "opacity-70" : "bg-blue-50 dark:bg-gray-700"
      }`}
      onClick={handleClick}
    >
      <Image
        src={displayAvatar}
        alt={displayName}
        width={50}
        height={40}
        className="rounded-full w-10 h-10 mr-3 object-cover"
      />
      <div className="flex-1">
        <p className="font-medium text-black dark:text-white">
          {displayName}
        </p>
        <p className="text-sm text-gray-900 dark:text-gray-400 truncate">
          {lastMessage}
        </p>
      </div>
      <div className="flex flex-col items-end">
        <span className="text-xs text-gray-400 ml-2">{lastMessageTime}</span>
        {chatRoom.unreadCount > 0 && (
          <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1 mt-1">
            {chatRoom.unreadCount}
          </span>
        )}
      </div>
    </div>
  );
}

export default function MessageDropdown({ messages, isLoading, onClose, onContactClick }) {
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div
      ref={dropdownRef}
      className="absolute -right-2 top-10 w-96 bg-white dark:bg-fb-dark-secondary shadow-lg rounded-lg p-4 z-50"
    >
      <h3 className="text-lg font-semibold mb-2 text-black dark:text-white">
        Đoạn chat
      </h3>
      <input
        type="text"
        placeholder="Tìm kiếm trên XoxoMess"
        className="w-full px-3 py-1 mb-2 text-sm rounded-full bg-gray-100 dark:bg-gray-700 text-black outline-none dark:placeholder:text-gray-400"
      />
      <div className="max-h-72 overflow-y-auto space-y-2">
        {isLoading ? (
          <div className="flex items-center justify-center p-4">
            <div className="text-sm text-gray-500">Đang tải tin nhắn...</div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center p-4">
            <div className="text-sm text-gray-500">Chưa có cuộc trò chuyện nào</div>
          </div>
        ) : (
          messages.map((chatRoom) => (
            <MessageItem
              key={chatRoom.id}
              chatRoom={chatRoom}
              onContactClick={onContactClick}
              onClose={onClose}
            />
          ))
        )}
      </div>
      <Link
        href="/messages"
        className="block text-center text-blue-500 text-sm mt-2 dark:text-white"
      >
        Xem tất cả trong XoxoMess
      </Link>
    </div>
  );
}
