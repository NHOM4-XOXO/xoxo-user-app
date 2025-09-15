"use client";

import { useRouter } from "next/navigation";
import { MessageCircle, Loader2 } from "lucide-react";
import { useGetOrCreateDirectChatMutation } from "@/features/chatApi";
import { createDirectChatUrl } from "@/utils/chatUtils";

/**
 * A reusable button component to start a direct chat with a user
 * Can be used in user profiles, friend lists, etc.
 */
export default function StartChatButton({ 
  userId, 
  userName = "this user",
  variant = "default", // "default", "icon", "text"
  className = "",
  disabled = false,
  showText = true
}) {
  const router = useRouter();
  const [getOrCreateDirectChat, { isLoading }] = useGetOrCreateDirectChatMutation();

  const handleStartChat = async () => {
    if (disabled || isLoading || !userId) return;

    try {
      // Option 1: Navigate directly to messages page with userId
      // This is simpler and lets the messages page handle chat creation
      const chatUrl = createDirectChatUrl(userId);
      router.push(chatUrl);

      // Option 2: Create chat first, then navigate (uncomment if preferred)
      /*
      const result = await getOrCreateDirectChat(userId).unwrap();
      router.push(`/messages?contact=${result.id}`);
      */
    } catch (error) {
      console.error("Failed to start chat:", error);
      // You might want to show a toast notification here
    }
  };

  const getButtonContent = () => {
    if (isLoading) {
      return (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          {showText && <span className="ml-2">Đang tạo...</span>}
        </>
      );
    }

    switch (variant) {
      case "icon":
        return <MessageCircle className="w-4 h-4" />;
      case "text":
        return showText ? `Nhắn tin cho ${userName}` : "Nhắn tin";
      default:
        return (
          <>
            <MessageCircle className="w-4 h-4" />
            {showText && <span className="ml-2">Nhắn tin</span>}
          </>
        );
    }
  };

  const getButtonClasses = () => {
    const baseClasses = "inline-flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed";
    
    switch (variant) {
      case "icon":
        return `${baseClasses} p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 ${className}`;
      case "text":
        return `${baseClasses} text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 ${className}`;
      default:
        return `${baseClasses} px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 ${className}`;
    }
  };

  if (!userId) {
    return null; // Don't render if no userId provided
  }

  return (
    <button
      onClick={handleStartChat}
      disabled={disabled || isLoading}
      className={getButtonClasses()}
      title={`Nhắn tin cho ${userName}`}
    >
      {getButtonContent()}
    </button>
  );
}

