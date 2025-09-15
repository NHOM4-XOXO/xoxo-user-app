"use client";

import { useState, useEffect } from "react";
import { useGetUserByIdQuery } from "@/features/chatApi";
import { useGetChatRoomsQuery } from "@/features/chatApi";
import Cookies from "js-cookie";

export default function UserApiTest() {
  const [testResults, setTestResults] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const {
    data: chatRoomsData,
    isLoading: isLoadingChatRooms,
    error: chatRoomsError,
  } = useGetChatRoomsQuery({ page: 0, size: 50 });

  const {
    data: userData,
    isLoading: isLoadingUser,
    error: userError,
  } = useGetUserByIdQuery(selectedUserId, { skip: !selectedUserId });

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

  // Test user API with different IDs
  const testUserApi = (userId) => {
    addResult(`--- Testing User API for ID: ${userId} ---`, "info");
    setSelectedUserId(userId);
  };

  // Monitor user data changes
  useEffect(() => {
    if (selectedUserId) {
      if (isLoadingUser) {
        addResult(`⏳ Loading user data for ID: ${selectedUserId}`, "info");
      } else if (userError) {
        addResult(`❌ Error loading user ${selectedUserId}: ${JSON.stringify(userError)}`, "error");
      } else if (userData) {
        addResult(`✅ User data loaded for ID: ${selectedUserId}`, "success");
        addResult(`  - First Name: ${userData.firstName || 'N/A'}`, "info");
        addResult(`  - Last Name: ${userData.lastName || 'N/A'}`, "info");
        addResult(`  - Username: ${userData.username || 'N/A'}`, "info");
        addResult(`  - Email: ${userData.email || 'N/A'}`, "info");
        addResult(`  - Avatar: ${userData.avatarUrl || 'N/A'}`, "info");
        addResult(`  - Online: ${userData.isOnline || false}`, "info");
      }
    }
  }, [selectedUserId, userData, isLoadingUser, userError]);

  // Analyze chat rooms and find other participants
  useEffect(() => {
    if (chatRoomsData && Array.isArray(chatRoomsData)) {
      addResult("✅ Chat rooms data received", "success");
      
      const currentUserId = getCurrentUserId();
      addResult(`👤 Current User ID: ${currentUserId}`, "info");
      
      // Find all unique other participant IDs
      const otherParticipantIds = new Set();
      chatRoomsData.forEach(chatRoom => {
        if (chatRoom.participantIds && Array.isArray(chatRoom.participantIds)) {
          const otherId = chatRoom.participantIds.find(id => id !== currentUserId);
          if (otherId) {
            otherParticipantIds.add(otherId);
          }
        }
      });
      
      addResult(`📊 Found ${otherParticipantIds.size} unique other participants:`, "info");
      Array.from(otherParticipantIds).forEach(id => {
        addResult(`  - User ID: ${id}`, "info");
      });
      
      // Test first few participant IDs
      const participantArray = Array.from(otherParticipantIds);
      if (participantArray.length > 0) {
        addResult(`🧪 Testing User API with first participant ID: ${participantArray[0]}`, "info");
        testUserApi(participantArray[0]);
      }
    }
  }, [chatRoomsData]);

  const clearResults = () => {
    setTestResults([]);
  };

  const exportResults = () => {
    const content = testResults.map(r => `[${r.timestamp}] ${r.message}`).join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `user-api-test-${new Date().toISOString().slice(0, 19)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
        User API Test
      </h3>
      
      <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
          Test Chat User API Endpoint
        </h4>
        <p className="text-sm text-blue-700 dark:text-blue-300">
          This test verifies if the /api/v1/chat/users/{userId} endpoint works correctly.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="space-y-2">
          <h4 className="font-semibold text-gray-700 dark:text-gray-300">Current Test</h4>
          <div className="text-sm">
            <div><strong>Selected User ID:</strong> {selectedUserId || 'None'}</div>
            <div><strong>Status:</strong> {
              isLoadingUser ? 'Loading...' : 
              userError ? 'Error' : 
              userData ? 'Success' : 'Not started'
            }</div>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="font-semibold text-gray-700 dark:text-gray-300">Quick Tests</h4>
          <div className="space-x-2">
            <button
              onClick={() => testUserApi(118)}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Test User 118
            </button>
            <button
              onClick={() => testUserApi(119)}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Test User 119
            </button>
            <button
              onClick={() => testUserApi(120)}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Test User 120
            </button>
          </div>
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
        <p><strong>Expected:</strong> User API should return user details for valid user IDs.</p>
        <p><strong>Issue:</strong> If API fails, chat room names will show fallback values.</p>
      </div>
    </div>
  );
}
