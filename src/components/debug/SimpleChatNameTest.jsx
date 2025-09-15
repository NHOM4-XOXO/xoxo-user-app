"use client";

import { useState, useEffect } from "react";
import { useGetChatRoomsQuery } from "@/features/chatApi";
import Cookies from "js-cookie";

export default function SimpleChatNameTest() {
  const [testResults, setTestResults] = useState([]);

  const {
    data: chatRoomsData,
    isLoading: isLoadingChatRooms,
    error: chatRoomsError,
  } = useGetChatRoomsQuery({ page: 0, size: 50 });

  const addResult = (message, type = "info") => {
    const timestamp = new Date().toLocaleTimeString();
    setTestResults(prev => [...prev, { timestamp, message, type }]);
  };

  // Get current user ID from token
  const getCurrentUserId = () => {
    try {
      const token = Cookies.get('token');
      if (!token) return null;
      
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.userId || payload.id || payload.sub;
    } catch (error) {
      console.error('Failed to decode token:', error);
      return null;
    }
  };

  // Test chat name logic
  const testChatNameLogic = (chatRoom, currentUserId) => {
    addResult(`--- Testing Chat Room ${chatRoom.id} ---`, "info");
    addResult(`Name: ${chatRoom.name}`, "info");
    addResult(`Type: ${chatRoom.type}`, "info");
    addResult(`Created By: ${chatRoom.createdBy}`, "info");
    addResult(`Participant IDs: [${chatRoom.participantIds.join(', ')}]`, "info");
    addResult(`Current User ID: ${currentUserId}`, "info");
    
    // Find other participant ID
    const otherParticipantId = chatRoom.participantIds?.find(id => id !== currentUserId);
    addResult(`Other Participant ID: ${otherParticipantId || 'Not found'}`, otherParticipantId ? "success" : "warning");
    
    // Determine display name logic
    let displayName = chatRoom.name;
    if (chatRoom.type === 'DIRECT') {
      if (chatRoom.createdBy === currentUserId) {
        addResult(`✅ Current user is creator, using chat room name: ${displayName}`, "success");
      } else {
        addResult(`✅ Other user is creator, using chat room name: ${displayName}`, "success");
      }
    }
    
    addResult(`Final Display Name: ${displayName}`, "info");
    addResult(`--- End Chat Room ${chatRoom.id} ---`, "info");
  };

  // Run tests when data is loaded
  useEffect(() => {
    if (isLoadingChatRooms) {
      addResult("⏳ Loading chat rooms...", "info");
    } else if (chatRoomsError) {
      addResult(`❌ API Error: ${JSON.stringify(chatRoomsError)}`, "error");
    } else if (chatRoomsData && Array.isArray(chatRoomsData)) {
      addResult("✅ Chat rooms data received", "success");
      
      const currentUserId = getCurrentUserId();
      addResult(`👤 Current User ID: ${currentUserId}`, "info");
      
      // Test each chat room
      chatRoomsData.forEach(chatRoom => {
        testChatNameLogic(chatRoom, currentUserId);
      });
      
      // Summary
      addResult("📊 Summary:", "info");
      addResult(`Total chat rooms: ${chatRoomsData.length}`, "info");
      
      const directChats = chatRoomsData.filter(r => r.type === 'DIRECT');
      addResult(`Direct chats: ${directChats.length}`, "info");
      
      const createdByCurrentUser = directChats.filter(r => r.createdBy === currentUserId);
      addResult(`Created by current user: ${createdByCurrentUser.length}`, "info");
      
      const createdByOthers = directChats.filter(r => r.createdBy !== currentUserId);
      addResult(`Created by others: ${createdByOthers.length}`, "info");
    }
  }, [chatRoomsData, isLoadingChatRooms, chatRoomsError]);

  const clearResults = () => {
    setTestResults([]);
  };

  const exportResults = () => {
    const content = testResults.map(r => `[${r.timestamp}] ${r.message}`).join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `simple-chat-name-test-${new Date().toISOString().slice(0, 19)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
        Simple Chat Name Test
      </h3>
      
      <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
        <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">
          Test Chat Name Logic
        </h4>
        <p className="text-sm text-green-700 dark:text-green-300">
          This test verifies the simple chat name logic using participantIds and createdBy fields.
        </p>
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
            <p className="text-gray-500 dark:text-gray-400 text-sm">No test results yet. Loading...</p>
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
        <p><strong>Logic:</strong> Use chatRoom.name as display name for all direct chats.</p>
        <p><strong>Note:</strong> Backend should set chatRoom.name to the other participant's name.</p>
      </div>
    </div>
  );
}
