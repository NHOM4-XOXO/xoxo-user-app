"use client";

import { useState, useEffect } from "react";
import { useGetChatRoomsQuery } from "@/features/chatApi";
import Cookies from "js-cookie";

export default function ChatRoomAnalysis() {
  const [testResults, setTestResults] = useState([]);
  const [userInfo, setUserInfo] = useState(null);

  const {
    data: chatRoomsData,
    isLoading: isLoadingChatRooms,
    error: chatRoomsError,
  } = useGetChatRoomsQuery({ page: 0, size: 50 });

  const addResult = (message, type = "info") => {
    const timestamp = new Date().toLocaleTimeString();
    setTestResults(prev => [...prev, { timestamp, message, type }]);
  };

  // Analyze JWT token
  useEffect(() => {
    try {
      const token = Cookies.get('token');
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserInfo(payload);
        addResult(`🔑 JWT Token found`, "success");
        addResult(`📧 Email (sub): ${payload.sub}`, "info");
        addResult(`👤 User ID: ${payload.userId || 'undefined'}`, "info");
        addResult(`🆔 ID: ${payload.id || 'undefined'}`, "info");
        addResult(`🎭 Roles: ${JSON.stringify(payload.roles || [])}`, "info");
      } else {
        addResult(`❌ No JWT token found`, "error");
      }
    } catch (error) {
      addResult(`❌ Failed to decode JWT: ${error.message}`, "error");
    }
  }, []);

  // Analyze chat rooms
  useEffect(() => {
    if (isLoadingChatRooms) {
      addResult("⏳ Loading chat rooms...", "info");
    } else if (chatRoomsError) {
      addResult(`❌ API Error: ${JSON.stringify(chatRoomsError)}`, "error");
    } else if (chatRoomsData) {
      addResult("✅ Chat rooms data received", "success");
      
      // Analyze response structure
      addResult(`📊 Response structure:`, "info");
      addResult(`  - Is array: ${Array.isArray(chatRoomsData)}`, "info");
      addResult(`  - Length: ${Array.isArray(chatRoomsData) ? chatRoomsData.length : 'N/A'}`, "info");
      
      if (Array.isArray(chatRoomsData)) {
        addResult(`📋 Found ${chatRoomsData.length} chat rooms`, "success");
        
        // Get current user ID from token
        const currentUserId = userInfo?.userId || userInfo?.id || userInfo?.sub;
        addResult(`👤 Current user ID: ${currentUserId}`, "info");
        
        // Analyze each chat room
        chatRoomsData.forEach((room, index) => {
          addResult(`--- Chat Room ${index + 1} ---`, "info");
          addResult(`ID: ${room.id}`, "info");
          addResult(`Name: ${room.name}`, "info");
          addResult(`Type: ${room.type}`, "info");
          addResult(`Created By: ${room.createdBy}`, "info");
          addResult(`Participant IDs: [${room.participantIds.join(', ')}]`, "info");
          
          // Find other participant
          if (room.participantIds && Array.isArray(room.participantIds)) {
            const otherParticipantId = room.participantIds.find(id => id !== currentUserId);
            if (otherParticipantId) {
              addResult(`Other Participant ID: ${otherParticipantId}`, "success");
            } else {
              addResult(`⚠️ No other participant found (current user is ${currentUserId})`, "warning");
            }
          } else {
            addResult(`❌ No participant IDs found`, "error");
          }
          
          // Check for duplicates
          const duplicateRooms = chatRoomsData.filter(r => r.name === room.name);
          if (duplicateRooms.length > 1) {
            addResult(`⚠️ Duplicate name "${room.name}" found ${duplicateRooms.length} times`, "warning");
          }
        });
        
        // Check for duplicate names
        const names = chatRoomsData.map(r => r.name);
        const uniqueNames = [...new Set(names)];
        if (names.length !== uniqueNames.length) {
          addResult(`⚠️ Found ${names.length - uniqueNames.length} duplicate chat room names`, "warning");
          const duplicates = names.filter((name, index) => names.indexOf(name) !== index);
          [...new Set(duplicates)].forEach(dup => {
            addResult(`  - "${dup}" appears ${names.filter(n => n === dup).length} times`, "warning");
          });
        }
      }
    }
  }, [chatRoomsData, isLoadingChatRooms, chatRoomsError, userInfo]);

  const clearResults = () => {
    setTestResults([]);
  };

  const exportResults = () => {
    const content = testResults.map(r => `[${r.timestamp}] ${r.message}`).join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-room-analysis-${new Date().toISOString().slice(0, 19)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
        Chat Room Analysis
      </h3>
      
      <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
          Analyze Chat Room Data Structure
        </h4>
        <p className="text-sm text-blue-700 dark:text-blue-300">
          This test analyzes the actual API response to understand the chat room structure and participant IDs.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="space-y-2">
          <h4 className="font-semibold text-gray-700 dark:text-gray-300">JWT Token Info</h4>
          {userInfo ? (
            <div className="text-sm space-y-1">
              <div><strong>Email:</strong> {userInfo.sub}</div>
              <div><strong>User ID:</strong> {userInfo.userId || 'undefined'}</div>
              <div><strong>ID:</strong> {userInfo.id || 'undefined'}</div>
              <div><strong>Roles:</strong> {JSON.stringify(userInfo.roles || [])}</div>
            </div>
          ) : (
            <div className="text-sm text-red-600">No token found</div>
          )}
        </div>

        <div className="space-y-2">
          <h4 className="font-semibold text-gray-700 dark:text-gray-300">API Status</h4>
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${isLoadingChatRooms ? 'bg-yellow-500' : chatRoomsError ? 'bg-red-500' : 'bg-green-500'}`}></div>
            <span className="text-sm">
              {isLoadingChatRooms ? 'Loading...' : chatRoomsError ? 'Error' : 'Ready'}
            </span>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Chat Rooms: {Array.isArray(chatRoomsData) ? chatRoomsData.length : 0}
          </div>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <h4 className="font-semibold text-gray-700 dark:text-gray-300">Analysis Results</h4>
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
            <p className="text-gray-500 dark:text-gray-400 text-sm">No analysis results yet. Loading...</p>
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
        <p><strong>Expected:</strong> API returns array of chat rooms with participantIds, current user ID should be in JWT token.</p>
        <p><strong>Issue:</strong> Need to find other participant ID from participantIds array.</p>
      </div>
    </div>
  );
}
