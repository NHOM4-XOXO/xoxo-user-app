"use client";

import { useState } from "react";
import { useGetOrCreateDirectChatMutation } from "@/features/chatApi";
import { useGetFriendsQuery } from "@/features/friendshipApi";

export default function ChatDebug() {
  const [testUserId, setTestUserId] = useState("100");
  const [getOrCreateDirectChat, { isLoading, error }] = useGetOrCreateDirectChatMutation();
  const { data: friends, isLoading: loadingFriends } = useGetFriendsQuery();

  const testCreateChat = async () => {
    try {
      console.log('Testing chat creation with user ID:', testUserId);
      const result = await getOrCreateDirectChat(testUserId).unwrap();
      console.log('Chat creation result:', result);
      alert('Chat created successfully! Check console for details.');
    } catch (err) {
      console.error('Chat creation failed:', err);
      alert(`Error: ${err.data?.message || err.message}`);
    }
  };

  const testWithFriend = async (friend) => {
    try {
      console.log('Testing chat creation with friend:', friend);
      const result = await getOrCreateDirectChat(friend.id).unwrap();
      console.log('Chat creation result:', result);
      alert(`Chat created with ${friend.firstName}! Check console for details.`);
    } catch (err) {
      console.error('Chat creation failed:', err);
      alert(`Error: ${err.data?.message || err.message}`);
    }
  };

  return (
    <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg m-4">
      <h3 className="text-lg font-bold mb-4">Chat API Debug</h3>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Test User ID:</label>
        <input
          type="text"
          value={testUserId}
          onChange={(e) => setTestUserId(e.target.value)}
          className="border rounded px-2 py-1 mr-2"
        />
        <button
          onClick={testCreateChat}
          disabled={isLoading}
          className="bg-blue-500 text-white px-4 py-1 rounded disabled:opacity-50"
        >
          {isLoading ? "Testing..." : "Test Create Chat"}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-2 bg-red-100 dark:bg-red-900 rounded">
          <p className="text-red-700 dark:text-red-300">Error: {error.data?.message || error.message}</p>
        </div>
      )}

      <div className="mb-4">
        <h4 className="font-medium mb-2">Friends List:</h4>
        {loadingFriends ? (
          <p>Loading friends...</p>
        ) : (
          <div className="space-y-2">
            {friends?.slice(0, 5).map((friend) => (
              <div key={friend.id} className="flex items-center justify-between p-2 bg-white dark:bg-gray-700 rounded">
                <span>{friend.firstName} {friend.lastName} (ID: {friend.id})</span>
                <button
                  onClick={() => testWithFriend(friend)}
                  className="bg-green-500 text-white px-2 py-1 rounded text-sm"
                >
                  Test Chat
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

