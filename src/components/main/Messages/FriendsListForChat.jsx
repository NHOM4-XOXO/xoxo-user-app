"use client";

import { useState } from "react";
import Image from "next/image";
import { Search, Loader2, MessageCircle } from "lucide-react";
import ScrollableContainer from "@/components/common/ScrollableContainer";
import { useGetFriendsQuery } from "@/features/friendshipApi";
import { useGetOrCreateDirectChatMutation } from "@/features/chatApi";

export default function FriendsListForChat({ 
  onChatCreated, 
  onClose 
}) {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Fetch friends list from friendship API
  const {
    data: friendsData,
    isLoading: isLoadingFriends,
    error: friendsError,
  } = useGetFriendsQuery();

  const [getOrCreateDirectChat, { isLoading: isCreatingChat }] = useGetOrCreateDirectChatMutation();

  const friends = friendsData || [];

  // Filter friends based on search term
  const filteredFriends = friends.filter((friend) =>
    `${friend.firstName} ${friend.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    friend.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStartChat = async (friend) => {
    try {
      console.log('Starting chat with friend:', friend);
      
      // Validate friend data
      if (!friend || !friend.id) {
        throw new Error('Invalid friend data');
      }
      
      // Create/get direct chat room
      const chatRoom = await getOrCreateDirectChat(friend.id).unwrap();
      console.log('Chat room response:', chatRoom);
      
      // Validate chat room response
      if (!chatRoom || !chatRoom.id) {
        throw new Error('Invalid chat room response');
      }
      
      // Convert to contact format for compatibility
      const contact = {
        id: chatRoom.id,
        name: chatRoom.name || `${friend.firstName} ${friend.lastName}`,
        avatar: chatRoom.avatarUrl || friend.avatarUrl || "/default-avatar.jpg",
        isOnline: friend.isOnline || false,
        userId: friend.id, // Keep original user ID
        chatRoom: chatRoom,
      };

      // Notify parent component
      onChatCreated(contact);
      onClose();
    } catch (error) {
      console.error("Failed to create chat:", error);
      console.error("Error details:", error?.data || error?.message);
      
      let errorMessage = `Không thể tạo cuộc trò chuyện với ${friend.firstName}.`;
      
      if (error?.status === 500) {
        errorMessage += ' Lỗi server. Vui lòng thử lại sau.';
      } else if (error?.status === 404) {
        errorMessage += ' Người dùng không tồn tại.';
      } else if (error?.status === 401) {
        errorMessage += ' Vui lòng đăng nhập lại.';
      } else {
        errorMessage += ' Vui lòng thử lại.';
      }
      
      alert(errorMessage);
    }
  };

  if (isLoadingFriends) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Đang tải danh sách bạn bè...</p>
        </div>
      </div>
    );
  }

  if (friendsError) {
    return (
      <div className="p-4 text-center">
        <p className="text-red-500 mb-2">Không thể tải danh sách bạn bè</p>
        <button
          onClick={() => window.location.reload()}
          className="text-blue-600 hover:text-blue-800 text-sm"
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-fb-light-primary dark:bg-fb-dark-secondary">
      {/* Header */}
      <div className="p-4 border-b border-gray-300 dark:border-fb-dark-tertiary">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Chọn bạn bè để chat</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute w-4 h-4 text-gray-500 -translate-y-1/2 left-3 top-1/2" />
          <input
            type="text"
            placeholder="Tìm kiếm bạn bè..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full py-2 pl-10 pr-4 text-sm rounded-full bg-fb-light-secondary dark:bg-fb-dark-tertiary focus:outline-none focus:ring-1 focus:ring-blue-600"
          />
        </div>
      </div>

      {/* Friends List */}
      <ScrollableContainer className="flex-1 overflow-y-auto">
        {filteredFriends.length === 0 ? (
          <div className="p-4 text-center">
            <p className="text-gray-500">
              {searchTerm ? "Không tìm thấy bạn bè nào" : "Bạn chưa có bạn bè nào"}
            </p>
          </div>
        ) : (
          <div className="p-2">
            {filteredFriends.map((friend) => (
              <div
                key={friend.id}
                className="flex items-center p-3 rounded-lg hover:bg-fb-light-tertiary dark:hover:bg-fb-dark-quaternary transition-colors"
              >
                <div className="relative">
                  <Image
                    src={friend.avatarUrl || "/default-avatar.jpg"}
                    alt={`${friend.firstName} ${friend.lastName}`}
                    width={48}
                    height={48}
                    className="object-cover rounded-full"
                  />
                  {friend.isOnline && (
                    <div className="absolute w-3 h-3 bg-green-500 border-2 border-white rounded-full -bottom-1 -right-1 dark:border-gray-800"></div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0 ml-3">
                  <h3 className="font-semibold truncate">
                    {friend.firstName} {friend.lastName}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                    @{friend.username}
                  </p>
                  <p className="text-xs text-gray-500">
                    {friend.isOnline ? "Đang hoạt động" : "Không hoạt động"}
                  </p>
                </div>

                <button
                  onClick={() => handleStartChat(friend)}
                  disabled={isCreatingChat}
                  className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  title={`Nhắn tin cho ${friend.firstName} ${friend.lastName}`}
                >
                  {isCreatingChat ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <MessageCircle className="w-5 h-5" />
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </ScrollableContainer>
    </div>
  );
}
