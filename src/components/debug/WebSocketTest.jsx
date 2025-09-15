"use client";

import { useState, useEffect } from "react";
import websocketService from "@/services/websocketService";

export default function WebSocketTest({ chatRoomId }) {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [testMessage, setTestMessage] = useState("");

  useEffect(() => {
    const checkConnection = () => {
      setIsConnected(websocketService.isConnectedToWebSocket());
    };

    checkConnection();
    const interval = setInterval(checkConnection, 1000);

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
          timestamp: new Date().toLocaleTimeString()
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
      setTestMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="p-4 bg-purple-100 dark:bg-purple-900 rounded-lg m-4">
      <h3 className="text-lg font-bold mb-4">WebSocket Test</h3>
      
      <div className="space-y-2 mb-4">
        <p><strong>Status:</strong> {isConnected ? "✅ Connected" : "❌ Disconnected"}</p>
        <p><strong>Chat Room ID:</strong> {chatRoomId || "None"}</p>
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
      </div>

      <div className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={testMessage}
            onChange={(e) => setTestMessage(e.target.value)}
            placeholder="Test message..."
            className="flex-1 border rounded px-2 py-1"
            onKeyPress={(e) => e.key === 'Enter' && sendTestMessage()}
          />
          <button
            onClick={sendTestMessage}
            disabled={!isConnected || !chatRoomId || !testMessage.trim()}
            className="bg-purple-500 text-white px-3 py-1 rounded disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>

      {messages.length > 0 && (
        <div className="mt-4">
          <h4 className="font-medium mb-2">Received Messages:</h4>
          <div className="max-h-32 overflow-y-auto bg-white dark:bg-gray-800 rounded p-2">
            {messages.map((msg, index) => (
              <div key={index} className="text-sm">
                {JSON.stringify(msg, null, 2)}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
