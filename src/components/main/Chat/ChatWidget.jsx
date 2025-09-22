"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import { Minus, X, Smile, Paperclip, Send, Download, ThumbsUp } from "lucide-react";
import { HEADER_HEIGHT } from "@/constants";
import { BASE_HEIGHT } from "@/constants/ChatWidget";
import ImagePreviewModal from "../../common/ImagePreviewModal";
import { ContentMultipleLines, CountContentLines } from "@/utils/ContentMultipleLines";
import ScrollableContainer from "@/components/common/ScrollableContainer";
import { useChat } from "@/hooks/useChat";
import { useGetUserByIdQuery, useGetCurrentUserProfileQuery } from "@/features/chatApi";

export default function ChatWidget({
  contact,
  onClose,
  onMinimize,
  positionOffset = 0,
  windowHeight,
}) {
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState("");

  // Use the chat hook with the contact's user ID and existing chat room
  const {
    currentChatRoom,
    messages,
    isConnected,
    isCreatingChat,
    isSendingMessage,
    isLoadingMessages,
    handleSendMessage,
    initializeChat,
  } = useChat(contact?.userId || contact?.id, contact?.chatRoom);

  // Fetch user data for avatar display
  const { data: profileData } = useGetCurrentUserProfileQuery();
  const myId = profileData?.id;
  
  // Get all participant IDs for potential multiple users
  const participantIds = currentChatRoom?.participantIds || [];
  const otherParticipantIds = participantIds.filter(id => id !== myId);
  
  // Fetch user data for all other participants
  const participantQueries = otherParticipantIds.map(participantId => 
    useGetUserByIdQuery(participantId, { skip: !participantId })
  );
  
  // Create a map of user data by ID for quick lookup
  const participantsMap = useMemo(() => {
    const map = {};
    participantQueries.forEach((query, index) => {
      const participantId = otherParticipantIds[index];
      if (query.data) {
        map[participantId] = query.data;
      }
    });
    return map;
  }, [participantQueries, otherParticipantIds]);
  
  // Get the correct other user ID - prioritize contact.userId if available
  const otherId = contact?.userId || otherParticipantIds[0];
  const { data: otherUser } = useGetUserByIdQuery(otherId, { skip: !otherId });
  
  // Function to get user data by sender ID
  const getSenderData = (senderId) => {
    if (senderId === myId) {
      return profileData; // Current user data
    }
    return participantsMap[senderId] || null;
  };

  // Get the display user data for header - prioritize otherUser, fallback to participantsMap
  const displayUser = otherUser || (otherId ? participantsMap[otherId] : null);

  // Debug logging
  useEffect(() => {
    console.log("ChatWidget Debug:", {
      contact: contact,
      otherId: otherId,
      otherUser: otherUser,
      participantsMap: participantsMap,
      displayUser: displayUser,
      myId: myId
    });
  }, [contact, otherId, otherUser, participantsMap, displayUser, myId]);

  // Calculate dynamic max height
  const dynamicMaxHeight = windowHeight
    ? windowHeight - HEADER_HEIGHT
    : BASE_HEIGHT;

  // Calculate position for each the chat widget
  // 80px + index * (width (w-80) + gap)
  const rightPosition = 80 + positionOffset * (320 + 16);

  // Initialize chat when contact changes
  useEffect(() => {
    if (contact?.chatRoom?.id) {
      console.log("ChatWidget - Using existing chat room:", contact.chatRoom.id);
    } else if (contact?.userId) {
      console.log("ChatWidget - Initializing chat with user ID:", contact.userId);
      initializeChat(contact.userId);
    } else if (contact?.id && !contact?.chatRoom) {
      console.log("ChatWidget - Fallback: using contact.id as user ID:", contact.id);
      initializeChat(contact.id);
    }
  }, [contact?.userId, contact?.id, contact?.chatRoom, initializeChat]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessageClick = async () => {
    if (!message.trim() || isSendingMessage) return;

    try {
      await handleSendMessage(message.trim());
      setMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessageClick();
    }
  };

  const handleFileSelect = (event) => {
    // File upload functionality can be implemented here
    // For now, we'll just clear the input
    event.target.value = "";
  };

  // Kiểm tra xem có phải tin nhắn đầu tiên trong nhóm không
  const isFirstInGroup = (currentIndex) => {
    if (currentIndex === 0) return true;
    const currentMsg = messages[currentIndex];
    const prevMsg = messages[currentIndex - 1];
    return currentMsg.senderId !== prevMsg.senderId;
  };

  // Kiểm tra xem có phải tin nhắn cuối cùng trong nhóm không
  const isLastInGroup = (currentIndex) => {
    if (currentIndex === messages.length - 1) return true;
    const currentMsg = messages[currentIndex];
    const nextMsg = messages[currentIndex + 1];
    return currentMsg.senderId !== nextMsg.senderId;
  };

  const renderMessage = (msg, index) => {
    // Check if message is from current user (me)
    const isMe = msg.senderId === myId;
    const isFirst = isFirstInGroup(index);
    const isLast = isLastInGroup(index);
    
    // Get sender data for avatar display
    const senderData = getSenderData(msg.senderId);
    const senderName = senderData 
      ? `${(senderData.firstName || "")} ${(senderData.lastName || "")}`.trim() || senderData.username || senderData.email
      : `User ${msg.senderId}`;

    return (
      <div
        key={msg.id}
        className={`flex ${isMe ? "justify-end" : "justify-start"} mb-1`}
      >
        {!isMe && (
          <div className="flex-shrink-0 mr-3">
            {isLast ? (
              <Image
                src={senderData?.avatarUrl || "/default-avatar.jpg"}
                alt={senderName}
                width={36}
                height={36}
                className="object-cover rounded-full w-9 h-9"
              />
            ) : (
              <div className="w-9 h-9" />
            )}
          </div>
        )}
        <div
          className={`${
            msg.mediaType === "AUDIO" ? "w-3/4" : "max-w-xs lg:max-w-md"
          } ${isMe ? "order-1" : "order-2"}`}
        >
          <div
            className={`px-4 py-2 ${
              !msg.content && msg.mediaType !== "TEXT"
                ? ""
                : isMe
                ? `bg-blue-600 text-white ${
                    isFirst && isLast
                      ? "rounded-2xl"
                      : isFirst
                      ? "rounded-2xl rounded-br-md"
                      : isLast
                      ? "rounded-2xl rounded-tr-md"
                      : "rounded-l-2xl rounded-r-md"
                  }`
                : `bg-fb-light-tertiary dark:bg-fb-dark-tertiary text-black dark:text-white ${
                    isFirst && isLast
                      ? "rounded-2xl"
                      : isFirst
                      ? "rounded-2xl rounded-bl-md"
                      : isLast
                      ? "rounded-2xl rounded-tl-md"
                      : "rounded-r-2xl rounded-l-md"
                  }`
            }`}
          >
            {!msg.content && msg.mediaType !== "TEXT" ? (
              <div
                className={`w-full p-2 rounded-lg ${
                  msg.mediaUrl
                    ? "bg-fb-light-tertiary dark:bg-fb-dark-tertiary dark:text-white"
                    : isMe
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-black dark:text-white"
                }`}
              >
                {msg.mediaType === "IMAGE" && (
                  <img
                    src={msg.mediaUrl || "/placeholder.svg"}
                    alt="Image"
                    className="rounded-md cursor-pointer"
                    onClick={() => openImagePreview(msg.mediaUrl)}
                  />
                )}
                {msg.mediaType === "VIDEO" && (
                  <video src={msg.mediaUrl} controls className="rounded-md" />
                )}
                {msg.mediaType === "AUDIO" && (
                  <audio src={msg.mediaUrl} controls className="w-full" />
                )}
              </div>
            ) : (
              <div className="break-words">
                {msg.content && (
                  <p className="text-sm">
                    <ContentMultipleLines content={msg.content} />
                  </p>
                )}

                {msg.mediaUrl && (
                  <a
                    href={msg.mediaUrl}
                    download="file"
                    className="flex items-center space-x-2 hover:underline"
                  >
                    <Download className="w-4 h-4" />
                    <span className="text-sm font-bold">File</span>
                  </a>
                )}
              </div>
            )}
          </div>
          {isLast && (
            <p
              className={`text-xs text-gray-500 mt-1 ${
                isMe ? "text-right" : "text-left"
              }`}
            >
              {msg.sentAt ? new Date(msg.sentAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }) : ""}
            </p>
          )}
        </div>
      </div>
    );
  };

  const openImagePreview = (imageUrl) => {
    setPreviewImageUrl(imageUrl);
    setIsPreviewModalOpen(true);
  };

  const closeImagePreview = () => {
    setIsPreviewModalOpen(false);
    setPreviewImageUrl("");
  };

  return (
    <>
      <div
        className="fixed bottom-0 z-40 flex flex-col bg-white border border-gray-300 rounded-lg shadow-lg w-80 dark:bg-fb-dark-secondary dark:border-gray-700"
        style={{
          right: `${rightPosition}px`,
          height: `${Math.min(BASE_HEIGHT, dynamicMaxHeight)}px`,
          maxHeight: `${dynamicMaxHeight}px`,
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-gray-300 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Image
                src={displayUser?.avatarUrl || "/default-avatar.jpg"}
                alt={displayUser?.firstName || contact.name}
                width={32}
                height={32}
                className="object-cover rounded-full"
              />
              <div
                className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 ${
                  displayUser?.isOnline ? "bg-green-500" : "bg-red-500"
                } border border-white dark:border-fb-dark-secondary rounded-full`}
              ></div>
            </div>
            <span className="text-sm font-semibold text-black dark:text-white">
              {displayUser ? 
                `${(displayUser.firstName || "")} ${(displayUser.lastName || "")}`.trim() || displayUser.username || displayUser.email
                : contact.name
              }
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <button
              onClick={onMinimize}
              className="p-1 transition-colors rounded-full cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <Minus className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
            <button
              onClick={onClose}
              className="p-1 transition-colors rounded-full cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <X className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>

        {/* Message Area */}
        <ScrollableContainer className="flex-1">
          <div className="p-3 space-y-3">
            {isLoadingMessages ? (
              <div className="flex items-center justify-center h-32">
                <div className="text-center">
                  <p className="text-sm text-gray-500">Đang tải tin nhắn...</p>
                </div>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex items-center justify-center h-32">
                <div className="text-center">
                  <p className="text-gray-500 mb-2">Chưa có tin nhắn nào</p>
                  <p className="text-sm text-gray-400">Hãy bắt đầu cuộc trò chuyện!</p>
                </div>
              </div>
            ) : (
              messages.map((msg, index) => renderMessage(msg, index))
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollableContainer>

        {/* Message Input */}
        <div className="flex-shrink-0 px-4 py-3 border-t border-gray-300 dark:border-fb-dark-tertiary bg-fb-light-primary dark:bg-fb-dark-secondary">
          <div className="flex items-center justify-center space-x-3">
            <div className="flex space-x-2">
              <button className="p-2 text-blue-600 transition-colors rounded-full cursor-pointer hover:bg-fb-light-quaternary dark:hover:bg-gray-700">
                <Smile className="w-5 h-5" />
              </button>
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  className="hidden"
                  accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 text-blue-600 transition-colors rounded-full cursor-pointer hover:bg-fb-light-quaternary dark:hover:bg-gray-700"
                >
                  <Paperclip className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="relative flex items-center flex-1">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Aa"
                rows={CountContentLines(message)}
                className="w-full px-4 py-2 pr-12 resize-none bg-fb-light-secondary rounded-xl dark:bg-fb-dark-tertiary focus:outline-none focus:ring-1 focus:ring-fb-light-tertiary dark:focus:ring-fb-dark-tertiary max-h-32"
                style={{ minHeight: "40px" }}
              />
              {message.trim() ? (
                <button
                  onClick={handleSendMessageClick}
                  disabled={isSendingMessage}
                  className="absolute p-1 text-blue-600 transition-colors -translate-y-1/2 cursor-pointer right-2 top-1/2 hover:text-blue-700 disabled:opacity-50"
                >
                  <Send className="w-5 h-5" />
                </button>
              ) : (
                <button className="absolute p-1 text-blue-600 transition-colors -translate-y-1/2 cursor-pointer right-2 top-1/2 hover:text-blue-700">
                  <ThumbsUp className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Image Preview Modal */}
      <ImagePreviewModal
        isOpen={isPreviewModalOpen}
        onClose={closeImagePreview}
        imageUrl={previewImageUrl}
      />
    </>
  );
}
