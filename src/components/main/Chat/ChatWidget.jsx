"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Minus, X, Smile, Paperclip, Send, Download } from "lucide-react";
import { HEADER_HEIGHT } from "@/constants";
import { BASE_HEIGHT } from "@/constants/ChatWidget";
import ImagePreviewModal from "./ImagePreviewModal";
import { ContentMultipleLines } from "@/utils/ContentMultipleLines";
import ScrollableContainer from "@/components/common/ScrollableContainer";

export default function ChatWidget({
  contact,
  onClose,
  onMinimize,
  positionOffset = 0,
  windowHeight,
}) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
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
      },
      { id: 2, sender: "me", content: "Chào bạn!", timestamp: "10:01 AM" },
      {
        id: 3,
        sender: "other",
        content: "Bạn khỏe không?",
        timestamp: "10:02 AM",
      },
    ]);
  }, [contact]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: prevMessages.length + 1,
          sender: "me",
          content: newMessage.trim(),
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          file: null,
        },
      ]);
      setNewMessage("");
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

    setMessages((prevMessages) => [
      ...prevMessages,
      {
        id: prevMessages.length + 1,
        sender: "me",
        content: null, // No text content for file message
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
      },
    ]);

    event.target.value = "";
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
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.sender === "me" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.content || msg.file?.type === "other" ? (
                  <div
                    className={`max-w-[75%] p-2 rounded-lg break-all ${
                      msg.file
                        ? "bg-fb-light-tertiary dark:bg-fb-dark-tertiary dark:text-white"
                        : msg.sender === "me"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 dark:bg-gray-700 text-black dark:text-white"
                    }`}
                  >
                    {msg.content && (
                      <p className="text-sm">
                        {ContentMultipleLines(msg.content)}
                      </p>
                    )}

                    {msg.file && (
                      <a
                        href={msg.file.url}
                        download={msg.file.name}
                        className="flex items-center space-x-2 hover:underline"
                      >
                        <Download className="w-4 h-4" />
                        <span className="text-sm font-bold">
                          {msg.file.name}
                        </span>
                      </a>
                    )}

                    <span className="block mt-1 text-xs text-right opacity-75">
                      {msg.timestamp}
                    </span>
                  </div>
                ) : (
                  <div className="w-3/4 mt-1 rounded-lg">
                    {msg.file.type === "image" && (
                      <img
                        src={msg.file.url || "/placeholder.svg"}
                        alt={msg.file.name}
                        className="rounded-md cursor-pointer"
                        onClick={() => openImagePreview(msg.file.url)}
                      />
                    )}
                    {msg.file.type === "video" && (
                      <video
                        src={msg.file.url}
                        controls
                        className="rounded-md"
                      />
                    )}
                    {msg.file.type === "audio" && (
                      <audio src={msg.file.url} controls className="w-full" />
                    )}
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollableContainer>

        {/* Input Area */}
        <div className="flex items-center p-3 space-x-2 border-t border-gray-300 dark:border-gray-700">
          <button className="p-1 text-gray-500 transition-colors cursor-pointer hover:text-blue-500">
            <Smile className="w-5 h-5" />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
            accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx,.txt" // Allow common file types
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-1 text-gray-500 transition-colors cursor-pointer hover:text-blue-500"
          >
            <Paperclip className="w-5 h-5" />
          </button>
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Aa"
            rows={newMessage.split(/\n/g).length}
            className="flex-1 px-3 py-2 text-sm text-black placeholder-gray-500 bg-gray-100 outline-none resize-none dark:bg-gray-700 max-h-20 rounded-xl dark:text-white"
          />
          <button
            onClick={handleSendMessage}
            className="p-1 text-blue-500 transition-colors cursor-pointer hover:text-blue-600"
            disabled={!newMessage.trim()}
          >
            <Send className="w-5 h-5" />
          </button>
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
