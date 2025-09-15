"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import EnhancedMessagesSidebar from "@/components/main/Messages/EnhancedMessagesSidebar";
import ProductionMessagesChat from "@/components/main/Messages/ProductionMessagesChat";
import MessagesChatInfo from "@/components/main/Messages/MessagesChatInfo";
import { HEADER_HEIGHT } from "@/constants";
import { checkDeviceByWidth } from "@/utils/checkDeviceByWidth";
import { useGetOrCreateDirectChatMutation } from "@/features/chatApi";
import DebugPanel from "@/components/debug/DebugPanel";
import ErrorBoundary from "@/components/common/ErrorBoundary";

export default function EnhancedMessagesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedContact, setSelectedContact] = useState(null);
  const [showChatInfo, setShowChatInfo] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const [getOrCreateDirectChat] = useGetOrCreateDirectChatMutation();

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(checkDeviceByWidth.mobile(window.innerWidth));
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Handle URL params for selected contact
  useEffect(() => {
    const contactId = searchParams.get("contact");
    const userId = searchParams.get("userId"); // For direct chat with user ID
    
    if (contactId && selectedContact?.id !== parseInt(contactId)) {
      // If we have a contactId, restore the selected contact
      // Note: In a real app, you might need to fetch contact details here
      setSelectedContact({
        id: parseInt(contactId),
        name: "Loading...", // This should be replaced with actual contact data
      });
    } else if (userId && !contactId) {
      // If we have a userId but no contactId, create/get direct chat
      handleCreateDirectChat(parseInt(userId));
    }
  }, [searchParams]);

  const handleCreateDirectChat = async (userId) => {
    try {
      const result = await getOrCreateDirectChat(userId).unwrap();
      
      // Create a contact object from the chat room result
      const contact = {
        id: result.id,
        name: result.name,
        avatar: result.participants?.find(p => p.id !== result.currentUserId)?.avatarUrl,
        isOnline: false, // You might want to fetch this separately
        chatRoom: result,
      };
      
      setSelectedContact(contact);
      setShowChatInfo(false);

      // Update URL to reflect the selected chat
      const params = new URLSearchParams(searchParams);
      params.delete("userId");
      params.set("contact", contact.id.toString());
      router.push(`/messages?${params.toString()}`, { scroll: false });
    } catch (error) {
      console.error("Failed to create direct chat:", error);
      // You might want to show a toast notification here
    }
  };

  const handleSelectContact = (contact) => {
    setSelectedContact(contact);
    setShowChatInfo(false);

    // Update URL
    const params = new URLSearchParams(searchParams);
    params.delete("userId");
    params.set("contact", contact.id.toString());
    router.push(`/messages?${params.toString()}`, { scroll: false });
  };

  const handleBackToList = () => {
    setSelectedContact(null);
    setShowChatInfo(false);
    router.push("/messages", { scroll: false });
  };

  const handleToggleChatInfo = () => {
    setShowChatInfo(!showChatInfo);
  };

  // No longer needed - handled by FriendsListForChat component

  return (
    <ErrorBoundary>
      <div
        className="flex text-black bg-fb-light-secondary dark:bg-fb-dark-primary dark:text-white"
        style={{ height: `calc(100vh - ${HEADER_HEIGHT}px)` }}
      >
      {/* Left Sidebar - Messages List */}
      <div
        className={`
        ${isMobile && selectedContact ? "hidden" : "flex"} 
        ${isMobile ? "w-full" : "w-80 xl:w-96"} 
        flex-shrink-0 border-r border-gray-300 dark:border-fb-dark-tertiary
      `}
      >
        <EnhancedMessagesSidebar
          selectedContact={selectedContact}
          onSelectContact={handleSelectContact}
        />
      </div>

      {/* Main Chat Area */}
      <div
        className={`
        ${isMobile && !selectedContact ? "hidden" : "flex"} 
        flex-1 flex flex-col
      `}
      >
        {selectedContact ? (
          <ProductionMessagesChat
            contact={selectedContact}
            onBack={handleBackToList}
            onToggleChatInfo={handleToggleChatInfo}
            showBackButton={isMobile}
          />
        ) : (
          <div className="flex items-center justify-center flex-1 bg-fb-light-secondary dark:bg-fb-dark-secondary">
            <div className="text-center">
              <div className="flex items-center justify-center w-24 h-24 mx-auto mb-4 bg-gray-300 rounded-full dark:bg-gray-600">
                <svg
                  className="w-12 h-12 text-gray-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold">
                Chọn một cuộc trò chuyện
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Chọn từ các cuộc trò chuyện hiện có hoặc bắt đầu cuộc trò chuyện
                mới.
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Nhấn vào nút "Tạo mới" ở góc trên để bắt đầu cuộc trò chuyện.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Right Sidebar - Chat Info */}
      {selectedContact && showChatInfo && !isMobile && (
        <div className="flex-shrink-0 w-80 xl:w-96 dark:border-gray-700">
          <MessagesChatInfo
            contact={selectedContact}
            onClose={() => setShowChatInfo(false)}
          />
        </div>
      )}
      </div>

      {/* Debug Panel - Fixed position, toggleable */}
      <DebugPanel />
    </ErrorBoundary>
  );
}
