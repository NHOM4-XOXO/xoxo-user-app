"use client";

import ChatDebug from "@/components/debug/ChatDebug";

export default function TestChatPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <h1 className="text-2xl font-bold mb-6">Chat API Test Page</h1>
      <ChatDebug />
    </div>
  );
}

