"use client";

import { useState, useEffect } from "react";
import websocketService from "@/services/websocketService";

export default function MultiUserTest({ chatRoomId }) {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [testMessage, setTestMessage] = useState("");
  const [userInfo, setUserInfo] = useState("");

  useEffect(() => {
    const checkConnection = () => {
      setIsConnected(websocketService.isConnectedToWebSocket());
    };

    checkConnection();
    const interval = setInterval(checkConnection, 1000);

    // Get user info from localStorage or cookies
    const user = localStorage.getItem('user') || 'Unknown User';
    setUserInfo(user);

    return () => clearInterval(interval);
  }, []);

  const connectWebSocket = async () => {
    try {
      await websocketService.connect();
      setIsConnected(true);
    } catch (error) {
      console.error("Failed to connect:", error);
    }
  };

  const subscribeToRoom = async () => {
    if (!chatRoomId) return;

    try {
      await websocketService.subscribeToRoom(chatRoomId, (message) => {
        console.log("Received message:", message);
        setMessages(prev => [...prev, {
          ...message,
          timestamp: new Date().toLocaleTimeString(),
          receivedAt: new Date().toISOString()
        }]);
      });
      console.log(`Subscribed to room ${chatRoomId}`);
    } catch (error) {
      console.error("Failed to subscribe:", error);
    }
  };

  const sendTestMessage = async () => {
    if (!chatRoomId || !testMessage.trim()) return;

    try {
      await websocketService.sendMessage(chatRoomId, testMessage.trim());
      console.log("Message sent:", testMessage);
      
      // Add to local messages for immediate display
      setMessages(prev => [...prev, {
        id: Date.now(),
        content: testMessage,
        senderId: 'me',
        senderName: userInfo,
        timestamp: new Date().toLocaleTimeString(),
        sentAt: new Date().toISOString()
      }]);
      
      setTestMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return (
    <div className="p-4 bg-orange-100 dark:bg-orange-900 rounded-lg m-4">
      <h3 className="text-lg font-bold mb-4">Multi-User Test</h3>
      
      <div className="space-y-2 mb-4">
        <p><strong>User:</strong> {userInfo}</p>
        <p><strong>Status:</strong> {isConnected ? "✅ Connected" : "❌ Disconnected"}</p>
        <p><strong>Chat Room ID:</strong> {chatRoomId || "None"}</p>
        <p><strong>Messages Count:</strong> {messages.length}</p>
      </div>

      <div className="space-x-2 mb-4">
        <button
          onClick={connectWebSocket}
          disabled={isConnected}
          className="bg-blue-500 text-white px-3 py-1 rounded disabled:opacity-50"
        >
          Connect
        </button>
        <button
          onClick={subscribeToRoom}
          disabled={!isConnected || !chatRoomId}
          className="bg-green-500 text-white px-3 py-1 rounded disabled:opacity-50"
        >
          Subscribe
        </button>
        <button
          onClick={clearMessages}
          className="bg-red-500 text-white px-3 py-1 rounded"
        >
          Clear
        </button>
      </div>

      <div className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={testMessage}
            onChange={(e) => setTestMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 border rounded px-2 py-1"
            onKeyPress={(e) => e.key === 'Enter' && sendTestMessage()}
          />
          <button
            onClick={sendTestMessage}
            disabled={!isConnected || !chatRoomId || !testMessage.trim()}
            className="bg-orange-500 text-white px-3 py-1 rounded disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>

      {messages.length > 0 && (
        <div className="mt-4">
          <h4 className="font-medium mb-2">Messages ({messages.length}):</h4>
          <div className="max-h-64 overflow-y-auto bg-white dark:bg-gray-800 rounded p-2 space-y-1">
            {messages.map((msg, index) => (
              <div key={index} className={`text-sm p-2 rounded ${
                msg.senderId === 'me' 
                  ? 'bg-blue-100 dark:bg-blue-900 ml-4' 
                  : 'bg-gray-100 dark:bg-gray-700 mr-4'
              }`}>
                <div className="font-medium text-xs">
                  {msg.senderName || msg.senderId} - {msg.timestamp}
                </div>
                <div>{msg.content}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 text-xs text-gray-600 dark:text-gray-400">
        <p><strong>Instructions:</strong></p>
        <p>1. Open this page on 2 different devices/browsers</p>
        <p>2. Connect and subscribe to the same chat room</p>
        <p>3. Send messages from one device</p>
        <p>4. Check if messages appear on the other device</p>
      </div>
    </div>
  );
}

