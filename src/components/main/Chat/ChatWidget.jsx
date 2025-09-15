"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Minus, X, Smile, Paperclip, Send, Download, ThumbsUp } from "lucide-react";
import { HEADER_HEIGHT } from "@/constants";
import { BASE_HEIGHT } from "@/constants/ChatWidget";
import ImagePreviewModal from "../../common/ImagePreviewModal";
import { ContentMultipleLines, CountContentLines } from "@/utils/ContentMultipleLines";
import ScrollableContainer from "@/components/common/ScrollableContainer";

export default function ChatWidget({
  contact,
  onClose,
  onMinimize,
  positionOffset = 0,
  windowHeight,
}) {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState("");

  // Calculate dynamic max height
  const dynamicMaxHeight = windowHeight
    ? windowHeight - HEADER_HEIGHT
    : BASE_HEIGHT;

  // Calculate position for each the chat widget
  // 80px + index * (width (w-80) + gap)
  const rightPosition = 80 + positionOffset * (320 + 16);

  useEffect(() => {
    // Simulate fetching messages for the contact
    setMessages([
      {
        id: 1,
        sender: "other",
        content: `Chào bạn, tôi là ${contact.name}!`,
        timestamp: "10:00 AM",
        type: "text",
      },
      {
        id: 2,
        sender: "other",
        content: "Bạn có khỏe không?",
        timestamp: "10:00 AM",
        type: "text",
      },
      {
        id: 3,
        sender: "other",
        content: "Tôi hy vọng bạn đang ổn",
        timestamp: "10:01 AM",
        type: "text",
      },
      {
        id: 4,
        sender: "me",
        content: "Chào bạn!",
        timestamp: "10:02 AM",
        type: "text",
      },
      {
        id: 5,
        sender: "me",
        content: "Mình khỏe, cảm ơn bạn!",
        timestamp: "10:02 AM",
        type: "text",
      },
      {
        id: 6,
        sender: "me",
        content: "Bạn thì sao?",
        timestamp: "10:03 AM",
        type: "text",
      },
      {
        id: 7,
        sender: "other",
        content: "Mình cũng ổn. Hôm nay bạn có rảnh không?",
        timestamp: "10:05 AM",
        type: "text",
      },
    ]);
  }, [contact]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
    const isMe = msg.sender === "me";
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
                src={contact.avatar || "/placeholder.svg"}
                alt={contact.name}
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
<<<<<<< HEAD
                  <p className="text-sm">
                    <ContentMultipleLines content={msg.content} />
                  </p>
=======
                  <p className="text-sm">{ContentMultipleLines(msg.content)}</p>
>>>>>>> e831905428471ab851098df54886f2b232d48738
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
                src={contact.avatar || "/default-avatar.jpg"}
                alt={contact.name}
                width={32}
                height={32}
                className="object-cover rounded-full"
              />
              <div
                className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 ${
                  contact.isOnline ? "bg-green-500" : "bg-red-500"
                } border border-white dark:border-fb-dark-secondary rounded-full`}
              ></div>
            </div>
            <span className="text-sm font-semibold text-black dark:text-white">
              {contact.name}
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
            {messages.map((msg, index) => renderMessage(msg, index))}
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

      {/* Image Preview Modal */}
      <ImagePreviewModal
        isOpen={isPreviewModalOpen}
        onClose={closeImagePreview}
        imageUrl={previewImageUrl}
      />
    </>
  );
}
