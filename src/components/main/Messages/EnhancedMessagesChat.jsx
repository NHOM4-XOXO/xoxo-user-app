"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  ArrowLeft,
  Phone,
  Video,
  Info,
  Smile,
  Paperclip,
  Send,
  ThumbsUp,
  Download,
  Loader2,
} from "lucide-react";
import ScrollableContainer from "@/components/common/ScrollableContainer";
import {
  ContentMultipleLines,
  CountContentLines,
} from "@/utils/ContentMultipleLines";
import ImagePreviewModal from "@/components/common/ImagePreviewModal";
import { useChat } from "@/hooks/useChat";

export default function EnhancedMessagesChat({
  contact,
  onBack,
  onToggleChatInfo,
  showBackButton,
}) {
  const [message, setMessage] = useState("");
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState("");
  
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Use the chat hook with the contact's ID
  const {
    currentChatRoom,
    messages,
    isConnected,
    isCreatingChat,
    isSendingMessage,
    isLoadingMessages,
    handleSendMessage,
    initializeChat,
  } = useChat(contact?.id);

  // Initialize chat when contact changes
  useEffect(() => {
    if (contact?.id) {
      initializeChat(contact.id);
    }
  }, [contact?.id, initializeChat]);

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
      // You might want to show a toast notification here
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessageClick();
    }
  };

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // TODO: Implement file upload
    // For now, just show a placeholder
    console.log("File upload not implemented yet:", file.name);
    event.target.value = "";
  };

  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isFirstInGroup = (currentIndex) => {
    if (currentIndex === 0) return true;
    const currentMsg = messages[currentIndex];
    const prevMsg = messages[currentIndex - 1];
    return currentMsg.senderId !== prevMsg.senderId;
  };

  const isLastInGroup = (currentIndex) => {
    if (currentIndex === messages.length - 1) return true;
    const currentMsg = messages[currentIndex];
    const nextMsg = messages[currentIndex + 1];
    return currentMsg.senderId !== nextMsg.senderId;
  };

  // Show loading state while creating chat
  if (isCreatingChat) {
    return (
      <div className="flex items-center justify-center flex-1 bg-fb-light-secondary dark:bg-fb-dark-secondary">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Đang tạo cuộc trò chuyện...</p>
        </div>
      </div>
    );
  }

  // Show error state if chat room creation failed
  if (!currentChatRoom && !isCreatingChat) {
    return (
      <div className="flex items-center justify-center flex-1 bg-fb-light-secondary dark:bg-fb-dark-secondary">
        <div className="text-center">
          <p className="text-red-500 mb-2">Không thể tạo cuộc trò chuyện</p>
          <p className="text-sm text-gray-500">Vui lòng thử lại sau</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-fb-light-primary dark:bg-fb-dark-secondary">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-300 bg-fb-light-primary dark:bg-fb-dark-secondary dark:border-fb-dark-tertiary">
        <div className="flex items-center space-x-3">
          {showBackButton && (
            <button
              onClick={onBack}
              className="p-2 transition-colors rounded-full cursor-pointer hover:bg-fb-light-tertiary dark:hover:bg-fb-dark-quaternary"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div className="relative">
            <Image
              src={contact.avatar || "/default-avatar.jpg"}
              alt={contact.name}
              width={40}
              height={40}
              className="object-cover rounded-full"
            />
            {contact.isOnline && (
              <div className="absolute w-3 h-3 bg-green-500 border-2 border-white rounded-full -bottom-1 -right-1 dark:border-gray-800"></div>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-black dark:text-white">
              {contact.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {isConnected ? (
                contact.isOnline ? "Đang hoạt động" : "Không hoạt động"
              ) : (
                "Đang kết nối..."
              )}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-2 transition-colors rounded-full cursor-pointer hover:bg-fb-light-tertiary dark:hover:bg-fb-dark-quaternary">
            <Phone className="w-5 h-5 text-blue-600" />
          </button>
          <button className="p-2 transition-colors rounded-full cursor-pointer hover:bg-fb-light-tertiary dark:hover:bg-fb-dark-quaternary">
            <Video className="w-5 h-5 text-blue-600" />
          </button>
          <button
            onClick={onToggleChatInfo}
            className="p-2 transition-colors rounded-full cursor-pointer hover:bg-fb-light-tertiary dark:hover:bg-fb-dark-quaternary"
          >
            <Info className="w-5 h-5 text-blue-600" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <ScrollableContainer className="flex-1 p-4 overflow-y-auto bg-fb-light-secondary dark:bg-fb-dark-primary">
        {isLoadingMessages ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
              <p className="text-sm text-gray-500">Đang tải tin nhắn...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-1">
            {messages.map((msg, index) => {
              const isFromMe = msg.senderId === currentChatRoom?.currentUserId;
              const showAvatar = isLastInGroup(index) && !isFromMe;
              const showName = isFirstInGroup(index) && !isFromMe;

              return (
                <div
                  key={msg.id}
                  className={`flex ${isFromMe ? "justify-end" : "justify-start"} ${
                    isFirstInGroup(index) ? "mt-4" : "mt-1"
                  }`}
                >
                  {/* Avatar for received messages */}
                  {!isFromMe && (
                    <div className="w-8 mr-2">
                      {showAvatar && (
                        <Image
                          src={contact.avatar || "/default-avatar.jpg"}
                          alt={contact.name}
                          width={32}
                          height={32}
                          className="object-cover rounded-full"
                        />
                      )}
                    </div>
                  )}

                  <div className={`max-w-[70%] ${isFromMe ? "ml-auto" : ""}`}>
                    {/* Sender name for received messages */}
                    {showName && !isFromMe && (
                      <p className="mb-1 ml-3 text-xs text-gray-500">
                        {msg.senderName || contact.name}
                      </p>
                    )}

                    <div
                      className={`px-3 py-2 rounded-2xl ${
                        isFromMe
                          ? "bg-blue-600 text-white"
                          : "bg-white dark:bg-fb-dark-tertiary text-black dark:text-white"
                      } ${
                        isFirstInGroup(index) && isLastInGroup(index)
                          ? "rounded-2xl"
                          : isFirstInGroup(index)
                          ? isFromMe
                            ? "rounded-br-lg"
                            : "rounded-bl-lg"
                          : isLastInGroup(index)
                          ? isFromMe
                            ? "rounded-tr-lg"
                            : "rounded-tl-lg"
                          : isFromMe
                          ? "rounded-r-lg"
                          : "rounded-l-lg"
                      }`}
                    >
                      {/* Message content */}
                      {msg.type === "IMAGE" && msg.mediaUrl ? (
                        <div>
                          <Image
                            src={msg.mediaUrl}
                            alt="Shared image"
                            width={200}
                            height={200}
                            className="object-cover rounded-lg cursor-pointer"
                            onClick={() => {
                              setPreviewImageUrl(msg.mediaUrl);
                              setIsPreviewModalOpen(true);
                            }}
                          />
                          {msg.content && (
                            <p className="mt-2 text-sm">{msg.content}</p>
                          )}
                        </div>
                      ) : (
                        <div>
                          <ContentMultipleLines
                            content={msg.content}
                            maxLines={20}
                          />
                        </div>
                      )}

                      {/* Message status and time */}
                      {isLastInGroup(index) && (
                        <div
                          className={`flex items-center justify-end mt-1 space-x-1 ${
                            isFromMe ? "text-blue-200" : "text-gray-500"
                          }`}
                        >
                          <span className="text-xs">
                            {formatMessageTime(msg.sentAt || msg.createdAt)}
                          </span>
                          {isFromMe && (
                            <div className="text-xs">
                              {msg.read ? "✓✓" : msg.delivered ? "✓✓" : "✓"}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </ScrollableContainer>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-300 bg-fb-light-primary dark:bg-fb-dark-secondary dark:border-fb-dark-tertiary">
        <div className="flex items-end space-x-3">
          {/* File upload */}
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileSelect}
            className="hidden"
            accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 transition-colors rounded-full cursor-pointer hover:bg-fb-light-tertiary dark:hover:bg-fb-dark-quaternary"
          >
            <Paperclip className="w-5 h-5 text-blue-600" />
          </button>

          {/* Message input */}
          <div className="flex-1">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Aa"
              className="w-full px-4 py-2 text-sm border border-gray-300 rounded-full resize-none bg-fb-light-secondary dark:bg-fb-dark-tertiary dark:border-fb-dark-quaternary focus:outline-none focus:ring-1 focus:ring-blue-600 max-h-32"
              rows={1}
              style={{
                height: "auto",
                minHeight: "40px",
                maxHeight: "120px",
                overflowY: "auto",
              }}
              onInput={(e) => {
                e.target.style.height = "auto";
                e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
              }}
            />
          </div>

          {/* Send button */}
          {message.trim() ? (
            <button
              onClick={handleSendMessageClick}
              disabled={isSendingMessage}
              className="p-2 transition-colors rounded-full cursor-pointer bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            >
              {isSendingMessage ? (
                <Loader2 className="w-5 h-5 text-white animate-spin" />
              ) : (
                <Send className="w-5 h-5 text-white" />
              )}
            </button>
          ) : (
            <button className="p-2 transition-colors rounded-full cursor-pointer hover:bg-fb-light-tertiary dark:hover:bg-fb-dark-quaternary">
              <ThumbsUp className="w-5 h-5 text-blue-600" />
            </button>
          )}
        </div>
      </div>

      {/* Image Preview Modal */}
      <ImagePreviewModal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        imageUrl={previewImageUrl}
      />
    </div>
  );
}
