"use client";

import { useState, useEffect } from "react";
import { useChat } from "@/hooks/useChat";

export default function WebSocketOnlyTest() {
  const [testMessage, setTestMessage] = useState("");
  const [testResults, setTestResults] = useState([]);
  const [isTestRunning, setIsTestRunning] = useState(false);

  // Use chat hook with a test chat room
  const {
    currentChatRoom,
    messages,
    isConnected,
    isSendingMessage,
    handleSendMessage,
    connectWebSocket,
    subscribeToRoom,
  } = useChat(null, { id: 6, name: "Test Room" });

  const addResult = (message, type = "info") => {
    const timestamp = new Date().toLocaleTimeString();
    setTestResults(prev => [...prev, { timestamp, message, type }]);
  };

  const testWebSocketOnlyMessaging = async () => {
    setIsTestRunning(true);
    addResult("🚀 Starting WebSocket-only messaging test...", "info");

    try {
      // Test 1: Connect WebSocket
      addResult("📡 Connecting to WebSocket...", "info");
      await connectWebSocket();
      addResult("✅ WebSocket connected successfully", "success");

      // Test 2: Subscribe to room
      addResult("📺 Subscribing to room 6...", "info");
      await subscribeToRoom(6);
      addResult("✅ Subscribed to room successfully", "success");

      // Test 3: Send test message
      const testMsg = `WebSocket-only test at ${new Date().toLocaleTimeString()}`;
      addResult(`📤 Sending message: "${testMsg}"`, "info");
      
      await handleSendMessage(testMsg);
      addResult("✅ Message sent via WebSocket (Kafka → Consumer → DB)", "success");

      // Test 4: Wait for message to appear in local state
      addResult("⏳ Waiting for message to appear in local state...", "info");
      
      // Check if message appears in messages array
      const checkMessage = () => {
        const found = messages.some(msg => msg.content === testMsg);
        if (found) {
          addResult("✅ Message received in local state!", "success");
          return true;
        }
        return false;
      };

      // Wait up to 5 seconds for message to appear
      let attempts = 0;
      const maxAttempts = 50; // 5 seconds with 100ms intervals
      
      const waitForMessage = () => {
        if (checkMessage()) {
          addResult("🎉 WebSocket-only messaging test completed successfully!", "success");
          setIsTestRunning(false);
          return;
        }
        
        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(waitForMessage, 100);
        } else {
          addResult("⚠️ Message not received in local state after 5 seconds", "warning");
          addResult("💡 This might be normal if the message is processed by Kafka consumer", "info");
          setIsTestRunning(false);
        }
      };

      waitForMessage();

    } catch (error) {
      addResult(`❌ Test failed: ${error.message}`, "error");
      setIsTestRunning(false);
    }
  };

  const sendCustomMessage = async () => {
    if (!testMessage.trim()) return;
    
    try {
      addResult(`📤 Sending custom message: "${testMessage}"`, "info");
      await handleSendMessage(testMessage);
      addResult("✅ Custom message sent via WebSocket", "success");
      setTestMessage("");
    } catch (error) {
      addResult(`❌ Failed to send custom message: ${error.message}`, "error");
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  const exportResults = () => {
    const content = testResults.map(r => `[${r.timestamp}] ${r.message}`).join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `websocket-only-test-${new Date().toISOString().slice(0, 19)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
        WebSocket-Only Messaging Test
      </h3>
      
      <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
          Test Flow: WebSocket → Kafka → Consumer → Database
        </h4>
        <p className="text-sm text-blue-700 dark:text-blue-300">
          This test verifies that messages are sent only via WebSocket, 
          then processed by Kafka consumer to save to database.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="space-y-2">
          <h4 className="font-semibold text-gray-700 dark:text-gray-300">Connection Status</h4>
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-sm">{isConnected ? 'Connected' : 'Disconnected'}</span>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Chat Room: {currentChatRoom?.id || 'None'}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Messages Count: {messages.length}
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="font-semibold text-gray-700 dark:text-gray-300">Actions</h4>
          <button
            onClick={testWebSocketOnlyMessaging}
            disabled={isTestRunning}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isTestRunning ? 'Running Test...' : 'Run Full Test'}
          </button>
        </div>
      </div>

      <div className="mb-4">
        <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Custom Message Test</h4>
        <div className="flex space-x-2">
          <input
            type="text"
            value={testMessage}
            onChange={(e) => setTestMessage(e.target.value)}
            placeholder="Type a test message..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            onKeyPress={(e) => e.key === 'Enter' && sendCustomMessage()}
          />
          <button
            onClick={sendCustomMessage}
            disabled={!testMessage.trim() || isSendingMessage}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSendingMessage ? 'Sending...' : 'Send'}
          </button>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <h4 className="font-semibold text-gray-700 dark:text-gray-300">Test Results</h4>
          <div className="space-x-2">
            <button
              onClick={clearResults}
              className="px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Clear
            </button>
            <button
              onClick={exportResults}
              className="px-3 py-1 text-sm bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              Export
            </button>
          </div>
        </div>
        
        <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 max-h-64 overflow-y-auto">
          {testResults.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-sm">No test results yet. Click "Run Full Test" to start.</p>
          ) : (
            <div className="space-y-1">
              {testResults.map((result, index) => (
                <div key={index} className={`text-sm font-mono ${
                  result.type === 'success' ? 'text-green-600 dark:text-green-400' :
                  result.type === 'error' ? 'text-red-600 dark:text-red-400' :
                  result.type === 'warning' ? 'text-yellow-600 dark:text-yellow-400' :
                  'text-gray-700 dark:text-gray-300'
                }`}>
                  [{result.timestamp}] {result.message}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="text-xs text-gray-500 dark:text-gray-400">
        <p><strong>Note:</strong> This test uses WebSocket-only messaging. Messages are sent to Kafka, 
        processed by consumer, and saved to database. No REST API calls are made for sending messages.</p>
      </div>
    </div>
  );
}
