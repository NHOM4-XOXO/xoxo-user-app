"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Search, MoreHorizontal, Edit, Loader2 } from "lucide-react";
import ScrollableContainer from "@/components/common/ScrollableContainer";
import { useChatList } from "@/hooks/useChatList";
import FriendsListForChat from "./FriendsListForChat";

export default function EnhancedMessagesSidebar({
  selectedContact,
  onSelectContact,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [showFriendsList, setShowFriendsList] = useState(false);

  // Use chat list hook for real-time updates
  const {
    chatRooms,
    isLoadingChatRooms,
    chatRoomsError,
    refetchChatRooms,
    addChatRoom,
    markChatAsRead,
  } = useChatList();

  // Debug logging
  useEffect(() => {
    console.log('EnhancedMessagesSidebar - chatRooms:', chatRooms);
    console.log('EnhancedMessagesSidebar - isLoadingChatRooms:', isLoadingChatRooms);
    console.log('EnhancedMessagesSidebar - chatRoomsError:', chatRoomsError);
  }, [chatRooms, isLoadingChatRooms, chatRoomsError]);

  // Filter chat rooms based on search term
  const filteredChatRooms = chatRooms.filter((chatRoom) =>
    chatRoom.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Convert chat room to contact format for compatibility
  const convertChatRoomToContact = (chatRoom) => {
    // For direct chats, try to get the other participant's info
    const otherParticipant = chatRoom.participants?.find(
      (p) => p.id !== chatRoom.currentUserId
    );

    return {
      id: chatRoom.id,
      name: chatRoom.name,
      avatar: otherParticipant?.avatarUrl || "/default-avatar.jpg",
      isOnline: otherParticipant?.isOnline || false,
      lastSeen: chatRoom.lastMessageAt,
      lastMessage: chatRoom.lastMessage?.content || "",
      unreadCount: chatRoom.unreadCount || 0,
      chatRoom: chatRoom, // Include full chat room data
    };
  };

  // Remove the old handleChatRoomClick since we have a new one above

  const handleNewChatClick = () => {
    setShowFriendsList(true);
  };

  const handleChatCreated = (contact) => {
    // When a new chat is created from friends list
    if (contact.chatRoom) {
      addChatRoom(contact.chatRoom);
    }
    onSelectContact(contact);
    refetchChatRooms(); // Refresh chat rooms list
  };

  const handleChatRoomClick = (chatRoom) => {
    // Mark as read when opening chat
    markChatAsRead(chatRoom.id);
    
    const contact = convertChatRoomToContact(chatRoom);
    onSelectContact(contact);
  };

  const formatLastMessageTime = (timestamp) => {
    if (!timestamp) return "";
    
    const now = new Date();
    const messageDate = new Date(timestamp);
    const diffInHours = (now - messageDate) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInHours * 60);
      return diffInMinutes <= 0 ? "Vừa xong" : `${diffInMinutes} phút`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} giờ`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return diffInDays === 1 ? "Hôm qua" : `${diffInDays} ngày`;
    }
  };

  // Show friends list when creating new chat
  if (showFriendsList) {
    return (
      <FriendsListForChat
        onChatCreated={handleChatCreated}
        onClose={() => setShowFriendsList(false)}
      />
    );
  }

  return (
    <div className="flex flex-col w-full h-full bg-fb-light-primary dark:bg-fb-dark-secondary">
      {/* Header */}
      <div className="p-4 border-b border-gray-300 dark:border-fb-dark-tertiary">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Đoạn chat</h1>
          <div className="flex items-center space-x-2">
            <button className="p-2 transition-colors rounded-full cursor-pointer bg-fb-light-secondary dark:bg-fb-dark-tertiary hover:bg-fb-light-tertiary dark:hover:bg-fb-dark-quaternary">
              <MoreHorizontal className="w-5 h-5" />
            </button>
            <button
              onClick={handleNewChatClick}
              className="p-2 transition-colors rounded-full cursor-pointer bg-fb-light-secondary dark:bg-fb-dark-tertiary hover:bg-fb-light-tertiary dark:hover:bg-fb-dark-quaternary"
            >
              <Edit className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute w-4 h-4 text-gray-500 -translate-y-1/2 left-3 top-1/2" />
          <input
            type="text"
            placeholder="Tìm kiếm trên Messenger"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full py-2 pl-10 pr-4 text-sm rounded-full bg-fb-light-secondary dark:bg-fb-dark-tertiary focus:outline-none focus:ring-1 focus:ring-fb-dark-quaternary"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-300 dark:border-fb-dark-tertiary">
        <button
          onClick={() => setActiveTab("all")}
          className={`flex-1 py-3 px-4 text-sm font-medium transition-colors cursor-pointer ${
            activeTab === "all"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
          }`}
        >
          Tất cả
        </button>
        <button
          onClick={() => setActiveTab("unread")}
          className={`flex-1 py-3 px-4 text-sm font-medium transition-colors cursor-pointer ${
            activeTab === "unread"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
          }`}
        >
          Chưa đọc
        </button>
        <button
          onClick={() => setActiveTab("groups")}
          className={`flex-1 py-3 px-4 text-sm font-medium transition-colors cursor-pointer ${
            activeTab === "groups"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
          }`}
        >
          Nhóm
        </button>
      </div>

      {/* Chat Rooms List */}
      <ScrollableContainer className="flex-1 overflow-y-auto">
        {isLoadingChatRooms ? (
          <div className="flex items-center justify-center h-32">
            <div className="text-center">
              <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
              <p className="text-sm text-gray-500">Đang tải cuộc trò chuyện...</p>
            </div>
          </div>
        ) : chatRoomsError ? (
          <div className="p-4 text-center">
            <p className="text-red-500 mb-2">Không thể tải cuộc trò chuyện</p>
            <button
              onClick={() => refetchChatRooms()}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              Thử lại
            </button>
          </div>
        ) : filteredChatRooms.length === 0 ? (
          <div className="p-4 text-center">
            <p className="text-gray-500 mb-2">
              {searchTerm ? "Không tìm thấy cuộc trò chuyện nào" : "Chưa có cuộc trò chuyện nào"}
            </p>
            {!searchTerm && (
              <button
                onClick={handleNewChatClick}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                Bắt đầu cuộc trò chuyện mới
              </button>
            )}
          </div>
        ) : (
          <div className="p-2">
            {filteredChatRooms
              .filter((chatRoom) => {
                if (activeTab === "unread") {
                  return (chatRoom.unreadCount || 0) > 0;
                } else if (activeTab === "groups") {
                  return chatRoom.type === "GROUP";
                }
                return true; // "all" tab
              })
              .map((chatRoom) => {
                const contact = convertChatRoomToContact(chatRoom);
                
                return (
                  <div
                    key={chatRoom.id}
                    onClick={() => handleChatRoomClick(chatRoom)}
                    className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedContact?.id === contact.id
                        ? "bg-[#EBF5FF] dark:bg-[#24313E]"
                        : "hover:bg-fb-light-tertiary dark:hover:bg-fb-dark-quaternary"
                    }`}
                  >
                    <div className="relative">
                      <Image
                        src={contact.avatar}
                        alt={contact.name}
                        width={48}
                        height={48}
                        className="object-cover rounded-full"
                      />
                      {contact.isOnline && (
                        <div className="absolute w-3 h-3 bg-green-500 border-2 border-white rounded-full -bottom-1 -right-1 dark:border-gray-800"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0 ml-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold truncate">{contact.name}</h3>
                        <span className="text-xs text-gray-500">
                          {formatLastMessageTime(contact.lastSeen)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600 truncate dark:text-gray-400 flex-1">
                          {contact.lastMessage || "Chưa có tin nhắn"}
                        </p>
                        {contact.unreadCount > 0 && (
                          <div className="ml-2 px-2 py-1 bg-blue-600 text-white text-xs rounded-full min-w-[20px] text-center">
                            {contact.unreadCount > 99 ? "99+" : contact.unreadCount}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </ScrollableContainer>
    </div>
  );
}
