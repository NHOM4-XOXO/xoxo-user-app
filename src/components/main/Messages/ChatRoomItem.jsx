"use client";

import { useState } from "react";
import Image from "next/image";
import { MoreHorizontal } from "lucide-react";
import { useParticipantInfo } from "@/hooks/useParticipantInfo";
import Cookies from "js-cookie";

export default function ChatRoomItem({ 
  chatRoom, 
  isSelected, 
  onSelect, 
  onMarkAsRead 
}) {
  const [showMenu, setShowMenu] = useState(false);

  // Get current user ID from token
  const getCurrentUserId = () => {
    try {
      const token = Cookies.get('token');
      if (!token) return null;
      
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.userId || payload.id || payload.sub;
    } catch (error) {
      console.error('Failed to decode token:', error);
      return null;
    }
  };

  const currentUserId = getCurrentUserId();
  
  // Get participant info using the new hook
  const { otherParticipant, isLoading } = useParticipantInfo(
    chatRoom.participantIds, 
    currentUserId
  );

  const handleClick = () => {
    onSelect(chatRoom);
    if (chatRoom.unreadCount > 0) {
      onMarkAsRead(chatRoom.id);
    }
  };

  // Determine display name
  const getDisplayName = () => {
    if (isLoading) {
      return "Loading...";
    }
    
    if (otherParticipant) {
      const fullName = `${otherParticipant.firstName || ''} ${otherParticipant.lastName || ''}`.trim();
      return fullName || otherParticipant.username || otherParticipant.email || chatRoom.name;
    }
    
    // Fallback to chat room name
    return chatRoom.name;
  };

  // Determine avatar
  const getAvatar = () => {
    if (isLoading) {
      return "/default-avatar.jpg";
    }
    
    if (otherParticipant?.avatarUrl) {
      return otherParticipant.avatarUrl;
    }
    
    return "/default-avatar.jpg";
  };

  // Determine online status
  const getOnlineStatus = () => {
    if (isLoading) {
      return false;
    }
    
    return otherParticipant?.isOnline || false;
  };

  return (
    <div
      className={`flex items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors ${
        isSelected ? "bg-blue-50 dark:bg-blue-900/20 border-r-2 border-blue-500" : ""
      }`}
      onClick={handleClick}
    >
      <div className="relative">
        <Image
          src={getAvatar()}
          alt={getDisplayName()}
          width={48}
          height={48}
          className="rounded-full object-cover"
        />
        {getOnlineStatus() && (
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
        )}
      </div>
      
      <div className="ml-3 flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
            {getDisplayName()}
          </h3>
          <div className="flex items-center space-x-1">
            {chatRoom.lastMessageAt && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {new Date(chatRoom.lastMessageAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full"
            >
              <MoreHorizontal className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-1">
          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
            {chatRoom.lastMessage?.content || "No messages yet"}
          </p>
          {chatRoom.unreadCount > 0 && (
            <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
              {chatRoom.unreadCount}
            </span>
          )}
        </div>
      </div>
      
      {showMenu && (
        <div className="absolute right-2 top-12 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
          <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
            Mark as read
          </button>
          <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
            Mute notifications
          </button>
          <button className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700">
            Delete chat
          </button>
        </div>
      )}
    </div>
  );
}
