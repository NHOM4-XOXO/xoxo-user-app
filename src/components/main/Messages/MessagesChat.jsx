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
} from "lucide-react";
import ScrollableContainer from "@/components/common/ScrollableContainer";
import {
  ContentMultipleLines,
  CountContentLines,
} from "@/utils/ContentMultipleLines";
import ImagePreviewModal from "@/components/common/ImagePreviewModal";
import Cookies from "js-cookie";
import { useGetCurrentUserProfileQuery, useGetUserByIdQuery } from "@/features/chatApi";

export default function MessagesChat({
  contact,
  onBack,
  onToggleChatInfo,
  showBackButton,
}) {

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  // Fetch current user profile to obtain reliable current user id
  const { data: currentProfile } = useGetCurrentUserProfileQuery();
  
  // Fetch other user data for proper display
  const otherUserId = contact?.userId || contact?.id;
  const { data: otherUser } = useGetUserByIdQuery(otherUserId, { skip: !otherUserId });

  // Get display data - prioritize API data, fallback to contact data
  const displayAvatar = otherUser?.avatarUrl || contact?.avatarUrl || "/default-avatar.jpg";
  const displayName = otherUser ? 
    `${(otherUser.firstName || "")} ${(otherUser.lastName || "")}`.trim() || otherUser.username || otherUser.email
    : contact?.name || `User ${otherUserId}`;
  const displayIsOnline = otherUser?.isOnline ?? contact?.isOnline ?? false;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getCurrentUserId = () => {
    try {
      // Prefer cached value if available
      if (typeof window !== "undefined") {
        const cached = window.__currentUserId || localStorage.getItem("currentUserId");
        if (cached) return Number(cached);
      }

      const token = Cookies.get("token");
      if (!token) return null;
      const payload = JSON.parse(atob(token.split(".")[1]));
      const id = payload.userId || payload.id || payload.sub;
      return id != null ? Number(id) : null;
    } catch (e) {
      return null;
    }
  };
  const currentUserId = currentProfile?.id ?? getCurrentUserId();

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: messages.length + 1,
        sender: "me",
        content: message.trim(),
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        file: null,
      };
      setMessages([...messages, newMessage]);
      setMessage("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const fileUrl = URL.createObjectURL(file);
    let fileType = "other";

    if (file.type.startsWith("image/")) {
      fileType = "image";
    } else if (file.type.startsWith("video/")) {
      fileType = "video";
    } else if (file.type.startsWith("audio/")) {
      fileType = "audio";
    }

    const newMessage = {
      id: messages.length + 1,
      sender: "me",
      content: null,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      file: {
        url: fileUrl,
        type: fileType,
        name: file.name,
        size: file.size,
      },
    };

    setMessages([...messages, newMessage]);
    event.target.value = "";
  };

  // Kiểm tra xem có phải tin nhắn đầu tiên trong nhóm không
  const isFirstInGroup = (currentIndex) => {
    if (currentIndex === 0) return true;
    const currentMsg = messages[currentIndex];
    const prevMsg = messages[currentIndex - 1];
    return currentMsg.sender !== prevMsg.sender;
  };

  // Kiểm tra xem có phải tin nhắn cuối cùng trong nhóm không
  const isLastInGroup = (currentIndex) => {
    if (currentIndex === messages.length - 1) return true;
    const currentMsg = messages[currentIndex];
    const nextMsg = messages[currentIndex + 1];
    return currentMsg.sender !== nextMsg.sender;
  };

  const renderMessage = (msg, index) => {
    // Check if message is from current user (me)
    const isMe = msg.senderId === currentUserId || msg.sender === "me";
    const isFirst = isFirstInGroup(index);
    const isLast = isLastInGroup(index);

    return (
      <div
        key={msg.id}
        className={`flex ${isMe ? "justify-end" : "justify-start"} mb-1`}
      >
        {!isMe && (
          <div className="flex-shrink-0 mr-3">
            {isLast ? (
              <Image
                src={displayAvatar}
                alt={displayName}
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
            msg.file?.type === "audio" ? "w-3/4" : "max-w-xs lg:max-w-md"
          } ${isMe ? "order-1" : "order-2"}`}
        >
          <div
            className={`px-4 py-2 ${
              !msg.content && msg.file?.type !== "other"
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
            {!msg.content && msg.file?.type !== "other" ? (
              <div
                className={`w-full p-2 rounded-lg ${
                  msg.file
                    ? "bg-fb-light-tertiary dark:bg-fb-dark-tertiary dark:text-white"
                    : isMe
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-black dark:text-white"
                }`}
              >
                {msg.file.type === "image" && (
                  <img
                    src={msg.file.url || "/placeholder.svg"}
                    alt={msg.file.name}
                    className="rounded-md cursor-pointer"
                    onClick={() => openImagePreview(msg.file.url)}
                  />
                )}
                {msg.file.type === "video" && (
                  <video src={msg.file.url} controls className="rounded-md" />
                )}
                {msg.file.type === "audio" && (
                  <audio src={msg.file.url} controls className="w-full" />
                )}
              </div>
            ) : (
              <div className="break-words">
                {msg.content && (
                  <p className="text-sm">
                    <ContentMultipleLines content={msg.content} />
                  </p>
                )}

                {msg.file && (
                  <a
                    href={msg.file.url}
                    download={msg.file.name}
                    className="flex items-center space-x-2 hover:underline"
                  >
                    <Download className="w-4 h-4" />
                    <span className="text-sm font-bold">{msg.file.name}</span>
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
              {msg.timestamp}
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
      <div className="h-full p-3">
        <div className="flex flex-col h-full overflow-hidden bg-fb-light-primary dark:bg-fb-dark-secondary rounded-xl">
          {/* Header */}
          <div className="flex items-center justify-between flex-shrink-0 p-4 border-b border-gray-300 dark:border-fb-dark-tertiary bg-fb-light-primary dark:bg-fb-dark-secondary">
            <div className="flex items-center space-x-3">
              {showBackButton && (
                <button
                  onClick={onBack}
                  className="p-2 transition-colors rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              )}
              <div className="flex-shrink-0">
                <Image
                  src={displayAvatar}
                  alt={displayName}
                  width={40}
                  height={40}
                  className="object-cover w-10 h-10 rounded-full cursor-pointer hover:opacity-80"
                />
              </div>
              <div>
                <h2 className="text-sm font-semibold cursor-pointer">
                  {displayName}
                </h2>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {displayIsOnline
                    ? "Đang hoạt động"
                    : `Hoạt động ${contact.lastSeen || "2 phút"} trước`}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-2 transition-colors rounded-full cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700">
                <Phone className="w-5 h-5 text-blue-600" />
              </button>
              <button className="p-2 transition-colors rounded-full cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700">
                <Video className="w-5 h-5 text-blue-600" />
              </button>
              <button
                onClick={onToggleChatInfo}
                className="p-2 transition-colors rounded-full cursor-pointer hover:bg-gray-200 dark:hover:bg-fb-dark-quaternary"
              >
                <Info className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 min-h-0 overflow-hidden">
            <ScrollableContainer className="h-full p-4 overflow-y-auto">
              <div className="space-y-0 text-sm">
                {messages.map((msg, index) => renderMessage(msg, index))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollableContainer>
          </div>

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
                    onClick={handleSendMessage}
                    className="absolute p-1 text-blue-600 transition-colors -translate-y-1/2 cursor-pointer right-2 top-1/2 hover:text-blue-700"
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