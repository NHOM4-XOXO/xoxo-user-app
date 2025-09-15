"use client";

import { useState, useEffect } from "react";
import { useGetChatRoomsQuery } from "@/features/chatApi";
import Cookies from "js-cookie";

export default function ChatRoomsTest() {
  const [testResults, setTestResults] = useState([]);
  const [isTestRunning, setIsTestRunning] = useState(false);

  const {
    data: chatRoomsData,
    isLoading: isLoadingChatRooms,
    error: chatRoomsError,
    refetch: refetchChatRooms,
  } = useGetChatRoomsQuery({ page: 0, size: 50 });

  const addResult = (message, type = "info") => {
    const timestamp = new Date().toLocaleTimeString();
    setTestResults(prev => [...prev, { timestamp, message, type }]);
  };

  const testChatRoomsAPI = async () => {
    setIsTestRunning(true);
    addResult("🚀 Starting Chat Rooms API test...", "info");

    try {
      // Test 1: Check token
      const token = Cookies.get('token');
      addResult(`🔑 Token found: ${token ? 'Yes' : 'No'}`, token ? "success" : "error");
      
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          addResult(`👤 User ID from token: ${payload.sub || payload.userId || 'Unknown'}`, "info");
        } catch (e) {
          addResult(`❌ Failed to decode token: ${e.message}`, "error");
        }
      }

      // Test 2: Check API response
      addResult("📡 Checking API response...", "info");
      
      if (isLoadingChatRooms) {
        addResult("⏳ API is loading...", "info");
      } else if (chatRoomsError) {
        addResult(`❌ API Error: ${JSON.stringify(chatRoomsError)}`, "error");
      } else if (chatRoomsData) {
        addResult(`✅ API Response received:`, "success");
        addResult(`📊 Data structure: ${JSON.stringify(chatRoomsData, null, 2)}`, "info");
        
        // Check different possible data structures
        if (chatRoomsData.content) {
          addResult(`📋 Chat rooms in content: ${chatRoomsData.content.length} items`, "success");
          chatRoomsData.content.forEach((room, index) => {
            addResult(`  ${index + 1}. ${room.name} (ID: ${room.id})`, "info");
          });
        } else if (Array.isArray(chatRoomsData)) {
          addResult(`📋 Chat rooms as array: ${chatRoomsData.length} items`, "success");
          chatRoomsData.forEach((room, index) => {
            addResult(`  ${index + 1}. ${room.name} (ID: ${room.id})`, "info");
          });
        } else if (chatRoomsData.data) {
          addResult(`📋 Chat rooms in data field: ${chatRoomsData.data.length} items`, "success");
          chatRoomsData.data.forEach((room, index) => {
            addResult(`  ${index + 1}. ${room.name} (ID: ${room.id})`, "info");
          });
        } else {
          addResult(`⚠️ Unknown data structure`, "warning");
        }
      } else {
        addResult("❌ No data received from API", "error");
      }

      // Test 3: Manual refetch
      addResult("🔄 Testing manual refetch...", "info");
      try {
        const result = await refetchChatRooms();
        addResult(`✅ Refetch successful: ${JSON.stringify(result.data)}`, "success");
      } catch (error) {
        addResult(`❌ Refetch failed: ${error.message}`, "error");
      }

    } catch (error) {
      addResult(`❌ Test failed: ${error.message}`, "error");
    } finally {
      setIsTestRunning(false);
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
    a.download = `chat-rooms-test-${new Date().toISOString().slice(0, 19)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
        Chat Rooms API Test
      </h3>
      
      <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
          Test Chat Rooms Loading
        </h4>
        <p className="text-sm text-blue-700 dark:text-blue-300">
          This test verifies that chat rooms are loaded from the API and displayed in the sidebar.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="space-y-2">
          <h4 className="font-semibold text-gray-700 dark:text-gray-300">API Status</h4>
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${isLoadingChatRooms ? 'bg-yellow-500' : chatRoomsError ? 'bg-red-500' : 'bg-green-500'}`}></div>
            <span className="text-sm">
              {isLoadingChatRooms ? 'Loading...' : chatRoomsError ? 'Error' : 'Success'}
            </span>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Data: {chatRoomsData ? 'Received' : 'None'}
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="font-semibold text-gray-700 dark:text-gray-300">Actions</h4>
          <button
            onClick={testChatRoomsAPI}
            disabled={isTestRunning}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isTestRunning ? 'Running Test...' : 'Run API Test'}
          </button>
          <button
            onClick={() => refetchChatRooms()}
            disabled={isLoadingChatRooms}
            className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoadingChatRooms ? 'Refetching...' : 'Manual Refetch'}
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
            <p className="text-gray-500 dark:text-gray-400 text-sm">No test results yet. Click "Run API Test" to start.</p>
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
        <p><strong>Note:</strong> This test checks if chat rooms are properly loaded from the API. 
        If no chat rooms are shown, check the API response structure and authentication.</p>
      </div>
    </div>
  );
}
