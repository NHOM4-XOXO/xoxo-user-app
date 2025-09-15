"use client";

import { useState } from "react";
import { useGetFriendsQuery } from "@/features/friendshipApi";
import { useGetOrCreateDirectChatMutation } from "@/features/chatApi";
import { useChat } from "@/hooks/useChat";

export default function CompleteFlowTest() {
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [chatRoom, setChatRoom] = useState(null);
  const [testMessage, setTestMessage] = useState("Hello! This is a test message.");

  const { data: friends, isLoading: loadingFriends } = useGetFriendsQuery();
  const [getOrCreateDirectChat, { isLoading: creatingChat }] = useGetOrCreateDirectChatMutation();

  // Use chat hook when we have a chat room
  const {
    currentChatRoom,
    messages,
    isConnected,
    handleSendMessage,
    isLoadingMessages,
  } = useChat(selectedFriend?.id, chatRoom);

  const handleSelectFriend = async (friend) => {
    try {
      console.log("Creating chat with friend:", friend);
      setSelectedFriend(friend);
      
      // Create/get chat room
      const result = await getOrCreateDirectChat(friend.id).unwrap();
      console.log("Chat room created:", result);
      
      setChatRoom(result);
    } catch (error) {
      console.error("Failed to create chat:", error);
      alert(`Failed to create chat with ${friend.firstName}: ${error.data?.message || error.message}`);
    }
  };

  const handleSendTestMessage = async () => {
    if (!testMessage.trim()) return;
    
    try {
      await handleSendMessage(testMessage);
      setTestMessage(""); // Clear after sending
    } catch (error) {
      console.error("Failed to send message:", error);
      alert(`Failed to send message: ${error.message}`);
    }
  };

  const resetTest = () => {
    setSelectedFriend(null);
    setChatRoom(null);
    setTestMessage("Hello! This is a test message.");
  };

  return (
    <div className="p-4 bg-yellow-100 dark:bg-yellow-900 rounded-lg m-4">
      <h3 className="text-lg font-bold mb-4">Complete Flow Test</h3>
      
      {!selectedFriend ? (
        <div>
          <h4 className="font-medium mb-2">Step 1: Select a friend to chat with</h4>
          {loadingFriends ? (
            <p>Loading friends...</p>
          ) : (
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {friends?.slice(0, 5).map((friend) => (
                <div
                  key={friend.id}
                  className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded"
                >
                  <span>{friend.firstName} {friend.lastName} (ID: {friend.id})</span>
                  <button
                    onClick={() => handleSelectFriend(friend)}
                    disabled={creatingChat}
                    className="bg-blue-500 text-white px-2 py-1 rounded disabled:opacity-50"
                  >
                    {creatingChat ? "Creating..." : "Select"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div>
          <h4 className="font-medium mb-2">
            Step 2: Chat with {selectedFriend.firstName} {selectedFriend.lastName}
          </h4>
          
          <div className="mb-4 p-2 bg-white dark:bg-gray-800 rounded">
            <p><strong>Friend ID:</strong> {selectedFriend.id}</p>
            <p><strong>Chat Room ID:</strong> {chatRoom?.id || "Not created"}</p>
            <p><strong>WebSocket:</strong> {isConnected ? "✅ Connected" : "❌ Disconnected"}</p>
            <p><strong>Messages Loaded:</strong> {messages.length}</p>
          </div>

          {isLoadingMessages ? (
            <p>Loading messages...</p>
          ) : (
            <div className="mb-4">
              <h5 className="font-medium mb-2">Messages ({messages.length}):</h5>
              <div className="max-h-32 overflow-y-auto bg-white dark:bg-gray-800 rounded p-2">
                {messages.length === 0 ? (
                  <p className="text-gray-500 text-sm">No messages yet</p>
                ) : (
                  messages.map((msg, index) => (
                    <div key={index} className="text-sm mb-1">
                      <strong>{msg.senderName || msg.senderId}:</strong> {msg.content}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          <div className="mb-4">
            <h5 className="font-medium mb-2">Step 3: Send a test message</h5>
            <div className="flex gap-2">
              <input
                type="text"
                value={testMessage}
                onChange={(e) => setTestMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 border rounded px-2 py-1"
                onKeyPress={(e) => e.key === 'Enter' && handleSendTestMessage()}
              />
              <button
                onClick={handleSendTestMessage}
                disabled={!testMessage.trim() || !chatRoom}
                className="bg-green-500 text-white px-3 py-1 rounded disabled:opacity-50"
              >
                Send
              </button>
            </div>
          </div>

          <button
            onClick={resetTest}
            className="bg-gray-500 text-white px-3 py-1 rounded"
          >
            Reset Test
          </button>
        </div>
      )}

      <div className="mt-4 text-xs text-gray-600 dark:text-gray-400">
        <p><strong>Complete Flow:</strong></p>
        <ol className="list-decimal list-inside">
          <li>Select friend → Create chat room</li>
          <li>Load old messages from database</li>
          <li>Connect to WebSocket for real-time</li>
          <li>Send message → Save to DB + Send via WebSocket</li>
          <li>Other user should see message real-time</li>
        </ol>
      </div>
    </div>
  );
}
