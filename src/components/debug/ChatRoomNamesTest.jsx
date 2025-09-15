"use client";

import { useState, useEffect } from "react";
import { useGetChatRoomsQuery } from "@/features/chatApi";
import Cookies from "js-cookie";

export default function ChatRoomNamesTest() {
  const [testResults, setTestResults] = useState([]);
  const [isTestRunning, setIsTestRunning] = useState(false);

  const {
    data: chatRoomsData,
    isLoading: isLoadingChatRooms,
    error: chatRoomsError,
  } = useGetChatRoomsQuery({ page: 0, size: 50 });

  const addResult = (message, type = "info") => {
    const timestamp = new Date().toLocaleTimeString();
    setTestResults(prev => [...prev, { timestamp, message, type }]);
  };

  const getCurrentUserId = () => {
    try {
      const token = Cookies.get('token');
      if (!token) return null;
      
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.sub || payload.userId || payload.id || null;
    } catch (error) {
      console.error('Failed to decode token:', error);
      return null;
    }
  };

  const testChatRoomNames = async () => {
    setIsTestRunning(true);
    addResult("🚀 Starting Chat Room Names test...", "info");

    try {
      // Test 1: Check current user ID
      const currentUserId = getCurrentUserId();
      addResult(`👤 Current user ID: ${currentUserId}`, currentUserId ? "success" : "error");

      // Test 2: Check chat rooms data
      if (isLoadingChatRooms) {
        addResult("⏳ Chat rooms are loading...", "info");
      } else if (chatRoomsError) {
        addResult(`❌ Error loading chat rooms: ${JSON.stringify(chatRoomsError)}`, "error");
      } else if (chatRoomsData) {
        addResult("✅ Chat rooms data received", "success");
        
        // Extract chat rooms from different possible structures
        let chatRooms = [];
        if (chatRoomsData.content) {
          chatRooms = chatRoomsData.content;
        } else if (Array.isArray(chatRoomsData)) {
          chatRooms = chatRoomsData;
        } else if (chatRoomsData.data) {
          chatRooms = chatRoomsData.data;
        }

        addResult(`📊 Found ${chatRooms.length} chat rooms`, "info");

        // Test 3: Analyze each chat room
        chatRooms.forEach((chatRoom, index) => {
          addResult(`\n--- Chat Room ${index + 1} ---`, "info");
          addResult(`ID: ${chatRoom.id}`, "info");
          addResult(`Name: ${chatRoom.name}`, "info");
          addResult(`Type: ${chatRoom.type}`, "info");
          addResult(`Current User ID: ${chatRoom.currentUserId}`, "info");
          
          if (chatRoom.participants) {
            addResult(`Participants (${chatRoom.participants.length}):`, "info");
            chatRoom.participants.forEach((participant, pIndex) => {
              addResult(`  ${pIndex + 1}. ID: ${participant.id}`, "info");
              addResult(`     Name: ${participant.firstName || ''} ${participant.lastName || ''}`.trim() || 'No name', "info");
              addResult(`     Username: ${participant.username || 'No username'}`, "info");
              addResult(`     Email: ${participant.email || 'No email'}`, "info");
              addResult(`     Is Current User: ${participant.id === currentUserId}`, participant.id === currentUserId ? "success" : "info");
            });
          } else {
            addResult("No participants data", "warning");
          }

          // Test name conversion logic
          const otherParticipant = chatRoom.participants?.find(
            (p) => p.id !== currentUserId
          );

          if (otherParticipant) {
            const displayName = otherParticipant ? 
              `${otherParticipant.firstName || ''} ${otherParticipant.lastName || ''}`.trim() || 
              otherParticipant.username || 
              otherParticipant.email || 
              chatRoom.name : 
              chatRoom.name;
            
            addResult(`🎯 Other Participant: ${otherParticipant.id}`, "info");
            addResult(`🎯 Display Name: ${displayName}`, "success");
            addResult(`🎯 Is Current User: ${otherParticipant.id === currentUserId}`, otherParticipant.id === currentUserId ? "error" : "success");
          } else {
            addResult(`⚠️ No other participant found (using chat room name: ${chatRoom.name})`, "warning");
            addResult(`⚠️ This might indicate duplicate chat rooms or wrong user ID`, "warning");
          }

          // Check for duplicate participants
          const duplicateParticipants = chatRooms.filter(room => 
            room.id !== chatRoom.id && 
            room.participants?.some(p => 
              chatRoom.participants?.some(cp => cp.id === p.id)
            )
          );
          
          if (duplicateParticipants.length > 0) {
            addResult(`⚠️ Found ${duplicateParticipants.length} potential duplicate chat rooms`, "warning");
          }
        });

      } else {
        addResult("❌ No chat rooms data received", "error");
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
    a.download = `chat-room-names-test-${new Date().toISOString().slice(0, 19)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
        Chat Room Names Test
      </h3>
      
      <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
          Test Chat Room Name Display
        </h4>
        <p className="text-sm text-blue-700 dark:text-blue-300">
          This test verifies that chat room names are displayed correctly as the other participant's name, not your own name.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="space-y-2">
          <h4 className="font-semibold text-gray-700 dark:text-gray-300">Status</h4>
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${isLoadingChatRooms ? 'bg-yellow-500' : chatRoomsError ? 'bg-red-500' : 'bg-green-500'}`}></div>
            <span className="text-sm">
              {isLoadingChatRooms ? 'Loading...' : chatRoomsError ? 'Error' : 'Ready'}
            </span>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Current User: {getCurrentUserId() || 'Unknown'}
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="font-semibold text-gray-700 dark:text-gray-300">Actions</h4>
          <button
            onClick={testChatRoomNames}
            disabled={isTestRunning}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isTestRunning ? 'Running Test...' : 'Test Names'}
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
            <p className="text-gray-500 dark:text-gray-400 text-sm">No test results yet. Click "Test Names" to start.</p>
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
        <p><strong>Expected:</strong> Chat room names should show the other participant's name (firstName + lastName), not your own name.</p>
        <p><strong>Fallback order:</strong> firstName + lastName → username → email → chatRoom.name</p>
      </div>
    </div>
  );
}
