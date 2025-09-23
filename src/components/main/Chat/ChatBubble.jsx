"use client";

import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { useGetUserByIdQuery, useGetCurrentUserProfileQuery } from "@/features/chatApi";

export default function ChatBubble({
  contact,
  onRestore,
  onClose,
  positionOffset = 0,
  hasUnreadMessages = false,
  isCounterBubble = false,
  hiddenCount = 0,
  onShowMore,
}) {
  const [isHovered, setIsHovered] = useState(false);

  // Fetch user data for proper display like MessagesChat.jsx
  const { data: profileData } = useGetCurrentUserProfileQuery();
  const myId = profileData?.id;
  
  // Get other participant ID from contact
  const otherId = contact?.userId || contact?.chatRoom?.participantIds?.find(id => id !== myId);
  const { data: otherUser } = useGetUserByIdQuery(otherId, { skip: !otherId });

  // Get display data - prioritize API data, fallback to contact data
  const displayAvatar = otherUser?.avatarUrl || contact?.avatarUrl || "/default-avatar.jpg";
  const displayName = otherUser ? 
    `${(otherUser.firstName || "")} ${(otherUser.lastName || "")}`.trim() || otherUser.username || otherUser.email
    : contact?.name || `User ${otherId}`;

  // Debug logging
  console.log("ChatBubble Debug:", {
    contact: contact,
    otherId: otherId,
    otherUser: otherUser,
    myId: myId,
    displayName: displayName,
    displayAvatar: displayAvatar
  });

  // Calculate position from bottom - each bubble is 70px apart
  const bottomPosition = 16 + positionOffset * 70;

  // Counter bubble for showing hidden chats
  if (isCounterBubble) {
    return (
      <div
        className="fixed z-50 cursor-pointer"
        style={{
          right: "16px",
          bottom: `${bottomPosition}px`,
        }}
        onClick={onShowMore}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative">
          <div className="w-14 h-14 bg-gray-100 dark:bg-fb-dark-tertiary rounded-full border-2 border-white dark:border-fb-dark-quaternary shadow-lg hover:shadow-xl transition-shadow duration-200 flex items-center justify-center">
            <span className="text-lg font-bold text-gray-600 dark:text-gray-300">
              +{hiddenCount}
            </span>
          </div>

          {/* Tooltip for counter bubble */}
          {isHovered && (
            <div className="absolute right-16 top-1/2 transform -translate-y-1/2 bg-black text-white text-sm px-3 py-2 rounded-lg shadow-lg whitespace-nowrap z-50">
              {hiddenCount} đoạn chat khác
              <div className="absolute left-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-4 border-l-black border-t-4 border-t-transparent border-b-4 border-b-transparent"></div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed z-40 cursor-pointer"
      style={{
        right: "16px",
        bottom: `${bottomPosition}px`,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onRestore}
    >
      <div className="relative">
        {/* Avatar */}
        <div className="relative w-14 h-14 bg-white dark:bg-fb-dark-secondary rounded-full border-2 border-white dark:border-gray-600 shadow-lg hover:shadow-xl transition-shadow duration-200">
          <Image
            src={displayAvatar}
            alt={displayName}
            width={56}
            height={56}
            className="w-full h-full object-cover rounded-full"
          />

          {/* Online/Offline Status */}
          <div
            className={`absolute -bottom-1 -right-1 w-4 h-4 ${
              otherUser?.isOnline || contact?.isOnline ? "bg-green-500" : "bg-gray-400"
            } border-2 border-white dark:border-fb-dark-secondary rounded-full`}
          />
        </div>

        {/* Unread Messages Indicator */}
        {hasUnreadMessages && (
          <div className="absolute -top-2 -left-2 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white dark:border-fb-dark-secondary">
            !
          </div>
        )}

        {/* Name Tooltip (show on hover) */}
        {isHovered && (
          <div className="absolute right-16 top-1/2 transform -translate-y-1/2 bg-black text-white text-sm px-3 py-2 rounded-lg shadow-lg whitespace-nowrap z-50">
            {displayName}
            <div className="absolute left-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-4 border-l-black border-t-4 border-t-transparent border-b-4 border-b-transparent"></div>
          </div>
        )}

        {/* Close Button (only visible on hover) */}
        {isHovered && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="absolute -top-2 -right-2 w-6 h-6 bg-fb-dark-quaternary hover:bg-fb-dark-primary text-white rounded-full flex items-center justify-center transition-colors duration-200 shadow-md cursor-pointer"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
}
