"use client";

import { useState } from "react";
import MultiUserTest from "@/components/debug/MultiUserTest";
import { useGetOrCreateDirectChatMutation } from "@/features/chatApi";

export default function TestMultiUserPage() {
  const [chatRoomId, setChatRoomId] = useState("");
  const [getOrCreateDirectChat, { isLoading }] = useGetOrCreateDirectChatMutation();

  const createTestChat = async () => {
    try {
      const result = await getOrCreateDirectChat(100).unwrap();
      const roomId = result.data?.id || result.id;
      setChatRoomId(roomId);
      console.log("Test chat created with ID:", roomId);
    } catch (error) {
      console.error("Failed to create test chat:", error);
      alert("Failed to create test chat. Check console for details.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <h1 className="text-3xl font-bold mb-6">Multi-User Chat Test</h1>
      
      <div className="mb-6 p-4 bg-blue-100 dark:bg-blue-900 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Instructions</h2>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>Click "Create Test Chat" to create a chat room</li>
          <li>Open this page on 2 different devices/browsers</li>
          <li>Use the same chat room ID on both devices</li>
          <li>Connect and subscribe on both devices</li>
          <li>Send messages from one device and check if they appear on the other</li>
        </ol>
      </div>

      <div className="mb-6">
        <div className="flex gap-4 items-center">
          <button
            onClick={createTestChat}
            disabled={isLoading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? "Creating..." : "Create Test Chat"}
          </button>
          
          <div className="flex gap-2">
            <input
              type="text"
              value={chatRoomId}
              onChange={(e) => setChatRoomId(e.target.value)}
              placeholder="Or enter chat room ID manually"
              className="border rounded px-3 py-2"
            />
            <button
              onClick={() => setChatRoomId("")}
              className="bg-gray-500 text-white px-3 py-2 rounded"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {chatRoomId && (
        <MultiUserTest chatRoomId={parseInt(chatRoomId)} />
      )}

      <div className="mt-8 p-4 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
        <h3 className="font-semibold mb-2">Troubleshooting</h3>
        <ul className="text-sm space-y-1">
          <li>• Make sure both devices are logged in with valid tokens</li>
          <li>• Check browser console for WebSocket connection logs</li>
          <li>• Verify that both devices are using the same chat room ID</li>
          <li>• Check backend logs for WebSocket subscription events</li>
        </ul>
      </div>
    </div>
  );
}
