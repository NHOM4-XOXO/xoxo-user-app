"use client";

import { useState } from "react";
import { useSendMessageMutation } from "@/features/chatApi";

export default function MessageTest({ chatRoomId }) {
  const [message, setMessage] = useState("");
  const [sendMessage, { isLoading }] = useSendMessageMutation();

  const handleSend = async () => {
    if (!message.trim() || !chatRoomId) return;

    try {
      const result = await sendMessage({
        chatRoomId: chatRoomId,
        content: message.trim(),
        type: "TEXT"
      }).unwrap();
      
      console.log("Message sent:", result);
      setMessage("");
      alert("Message sent successfully!");
    } catch (error) {
      console.error("Failed to send message:", error);
      alert(`Failed to send message: ${error.data?.message || error.message}`);
    }
  };

  if (!chatRoomId) {
    return (
      <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg m-4">
        <p className="text-gray-500">No chat room selected</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-green-100 dark:bg-green-900 rounded-lg m-4">
      <h3 className="text-lg font-bold mb-4">Message Test</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
        Chat Room ID: {chatRoomId}
      </p>
      
      <div className="flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 border rounded px-2 py-1"
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        />
        <button
          onClick={handleSend}
          disabled={isLoading || !message.trim()}
          className="bg-blue-500 text-white px-4 py-1 rounded disabled:opacity-50"
        >
          {isLoading ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
}

