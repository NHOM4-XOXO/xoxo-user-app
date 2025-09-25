"use client";

import { useState } from "react";
import Image from "next/image";
import { MoreHorizontal } from "lucide-react";
import { useGetUserByIdQuery, useGetCurrentUserProfileQuery } from "@/features/chatApi";
import Cookies from "js-cookie";

export default function ChatRoomWithUserInfo({ 
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

  // Prefer reliable ID from profile API
  const { data: profileData } = useGetCurrentUserProfileQuery();
  const profileUserId = profileData?.id;
  const currentUserId = profileUserId ?? getCurrentUserId();
  
  // Find other participant ID
  let otherParticipantId = null;
  if (Array.isArray(chatRoom.participantIds) && chatRoom.participantIds.length > 0) {
    if (chatRoom.participantIds.length === 2 && currentUserId != null) {
      otherParticipantId = chatRoom.participantIds[0] === currentUserId
        ? chatRoom.participantIds[1]
        : chatRoom.participantIds[0];
    } else if (currentUserId != null) {
      otherParticipantId = chatRoom.participantIds.find(id => id !== currentUserId) ?? null;
    } else {
      // current user unknown yet; avoid picking self by deferring render
      otherParticipantId = null;
    }
  }
  
  // Debug logging
  console.log('ChatRoomWithUserInfo - Chat room:', chatRoom.id);
  console.log('ChatRoomWithUserInfo - Current user ID:', currentUserId);
  console.log('ChatRoomWithUserInfo - Participant IDs:', chatRoom.participantIds);
  console.log('ChatRoomWithUserInfo - Other participant ID:', otherParticipantId);
  console.log('ChatRoomWithUserInfo - Chat room name:', chatRoom.name);
  
  // Fetch user info for other participant
  const { 
    data: userData, 
    isLoading: isLoadingUser, 
    error: userError 
  } = useGetUserByIdQuery(otherParticipantId, { 
    skip: otherParticipantId == null 
  });
  
  // Debug user data
  console.log('ChatRoomWithUserInfo - User data:', userData);
  console.log('ChatRoomWithUserInfo - Is loading user:', isLoadingUser);
  console.log('ChatRoomWithUserInfo - User error:', userError);

  const handleClick = () => {
    // Create contact object with proper user data
    const contact = {
      id: chatRoom.id,
      name: getDisplayName(),
      avatarUrl: getAvatar(),
      isOnline: getOnlineStatus(),
      lastSeen: chatRoom.lastMessageAt,
      lastMessage: typeof chatRoom.lastMessage === 'string' 
        ? chatRoom.lastMessage 
        : chatRoom.lastMessage?.content || "",
      unreadCount: chatRoom.unreadCount || 0,
      chatRoom: chatRoom,
      userId: otherParticipantId,
    };
    
    onSelect(contact);
    if (chatRoom.unreadCount > 0) {
      onMarkAsRead(chatRoom.id);
    }
  };

  // Determine display name
  const getDisplayName = () => {
    if (isLoadingUser) {
      return "Loading...";
    }
    
    if (userError) {
      console.log('Error fetching user:', userError);
      // If we can't fetch user data, try to determine name from chat room
      if (chatRoom.name && !chatRoom.name.includes('Nguyễn Hoàng Tuấn')) {
        return chatRoom.name; // Use chat room name if it's not current user's name
      }
      return `User ${otherParticipantId}`; // Fallback to user ID
    }
    
    if (userData) {
      const fullName = `${userData.firstName || ''} ${userData.lastName || ''}`.trim();
      const displayName = fullName || userData.username || userData.email;
      console.log('User data found:', userData);
      console.log('Display name from user data:', displayName);
      return displayName;
    }
    
    // If no user data and chat room name is current user's name, show user ID
    if (chatRoom.name && chatRoom.name.includes('Nguyễn Hoàng Tuấn')) {
      return `User ${otherParticipantId}`;
    }
    
    return chatRoom.name || `User ${otherParticipantId}`;
  };

  // Determine avatar
  const getAvatar = () => {
    if (userData?.avatarUrl) {
      return userData.avatarUrl;
    }
    return "/default-avatar.jpg";
  };

  // Determine online status
  const getOnlineStatus = () => {
    return userData?.isOnline || false;
  };

  return (
    <div
      className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
        isSelected ? "bg-[#EBF5FF] dark:bg-[#24313E]" : "hover:bg-fb-light-tertiary dark:hover:bg-fb-dark-quaternary"
      }`}
      onClick={handleClick}
    >
      <div className="relative">
        <Image
          src={getAvatar()}
          alt={getDisplayName()}
          width={48}
          height={48}
          className="object-cover rounded-full"
        />
        {getOnlineStatus() && (
          <div className="absolute w-3 h-3 bg-green-500 border-2 border-white rounded-full -bottom-1 -right-1 dark:border-gray-800"></div>
        )}
      </div>
      
      <div className="flex-1 min-w-0 ml-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold truncate">{getDisplayName()}</h3>
          <span className="text-xs text-gray-500">
            {chatRoom.lastMessageAt ? new Date(chatRoom.lastMessageAt).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit'
            }) : ''}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600 truncate dark:text-gray-400 flex-1">
            {typeof chatRoom.lastMessage === 'string' 
              ? chatRoom.lastMessage 
              : chatRoom.lastMessage?.content || "Chưa có tin nhắn"}
          </p>
          {/* Unread badge disabled */}
          {false && chatRoom.unreadCount > 0 && (
            <div className="ml-2 px-2 py-1 bg-blue-600 text-white text-xs rounded-full min-w-[20px] text-center">
              {chatRoom.unreadCount > 99 ? "99+" : chatRoom.unreadCount}
            </div>
          )}
        </div>
      </div>
      
      <button
        onClick={(e) => {
          e.stopPropagation();
          setShowMenu(!showMenu);
        }}
        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full"
      >
        <MoreHorizontal className="w-4 h-4 text-gray-500 dark:text-gray-400" />
      </button>
      
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