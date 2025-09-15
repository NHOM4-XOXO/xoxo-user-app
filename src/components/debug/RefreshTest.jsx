"use client";

import { useState, useEffect } from "react";
import { useGetChatRoomsQuery } from "@/features/chatApi";
import Cookies from "js-cookie";

export default function RefreshTest() {
  const [testResults, setTestResults] = useState([]);
  const [refreshCount, setRefreshCount] = useState(0);
  const [lastRefreshTime, setLastRefreshTime] = useState(null);

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

  // Track when data changes
  useEffect(() => {
    const now = new Date().toLocaleTimeString();
    addResult(`🔄 Data changed at ${now}`, "info");
    
    if (isLoadingChatRooms) {
      addResult("⏳ Loading chat rooms...", "info");
    } else if (chatRoomsError) {
      addResult(`❌ Error: ${JSON.stringify(chatRoomsError)}`, "error");
    } else if (chatRoomsData) {
      addResult("✅ Chat rooms data received", "success");
      
      // Extract chat rooms
      let chatRooms = [];
      if (chatRoomsData.content) {
        chatRooms = chatRoomsData.content;
      } else if (Array.isArray(chatRoomsData)) {
        chatRooms = chatRoomsData;
      } else if (chatRoomsData.data) {
        chatRooms = chatRoomsData.data;
      }
      
      addResult(`📊 Found ${chatRooms.length} chat rooms`, "info");
      
      // Check for duplicates
      const currentUserId = getCurrentUserId();
      const participantIds = new Set();
      const duplicates = [];
      
      chatRooms.forEach((room, index) => {
        if (room.participants) {
          room.participants.forEach(participant => {
            if (participant.id !== currentUserId) {
              if (participantIds.has(participant.id)) {
                duplicates.push({
                  participantId: participant.id,
                  participantName: `${participant.firstName || ''} ${participant.lastName || ''}`.trim() || participant.username || participant.email,
                  roomIds: [room.id]
                });
              } else {
                participantIds.add(participant.id);
              }
            }
          });
        }
      });
      
      if (duplicates.length > 0) {
        addResult(`⚠️ Found ${duplicates.length} potential duplicate participants`, "warning");
        duplicates.forEach(dup => {
          addResult(`  - ${dup.participantName} (ID: ${dup.participantId})`, "warning");
        });
      } else {
        addResult("✅ No duplicate participants found", "success");
      }
    }
  }, [chatRoomsData, isLoadingChatRooms, chatRoomsError]);

  const testRefresh = async () => {
    setRefreshCount(prev => prev + 1);
    setLastRefreshTime(new Date().toLocaleTimeString());
    addResult(`🔄 Manual refresh #${refreshCount + 1} at ${lastRefreshTime}`, "info");
    
    try {
      const result = await refetchChatRooms();
      addResult(`✅ Manual refresh successful`, "success");
    } catch (error) {
      addResult(`❌ Manual refresh failed: ${error.message}`, "error");
    }
  };

  const simulateF5 = () => {
    addResult("🔄 Simulating F5 refresh...", "info");
    window.location.reload();
  };

  const clearResults = () => {
    setTestResults([]);
    setRefreshCount(0);
    setLastRefreshTime(null);
  };

  const exportResults = () => {
    const content = testResults.map(r => `[${r.timestamp}] ${r.message}`).join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `refresh-test-${new Date().toISOString().slice(0, 19)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
        Refresh Test (F5 Load Test)
      </h3>
      
      <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
          Test F5 Refresh Behavior
        </h4>
        <p className="text-sm text-blue-700 dark:text-blue-300">
          This test verifies that chat rooms are properly loaded when you press F5 or refresh the page.
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
            Refresh Count: {refreshCount}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Last Refresh: {lastRefreshTime || 'Never'}
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="font-semibold text-gray-700 dark:text-gray-300">Actions</h4>
          <button
            onClick={testRefresh}
            disabled={isLoadingChatRooms}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoadingChatRooms ? 'Refreshing...' : 'Manual Refresh'}
          </button>
          <button
            onClick={simulateF5}
            className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Simulate F5
          </button>
        </div>
      </div>

      <div className="mb-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
        <h4 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
          Instructions
        </h4>
        <ol className="text-sm text-yellow-700 dark:text-yellow-300 list-decimal list-inside space-y-1">
          <li>Click "Manual Refresh" to test API refetch</li>
          <li>Press F5 or click "Simulate F5" to test full page reload</li>
          <li>Check if chat rooms load correctly after refresh</li>
          <li>Look for duplicate participants in the results</li>
        </ol>
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
            <p className="text-gray-500 dark:text-gray-400 text-sm">No test results yet. Try refreshing or press F5.</p>
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
        <p><strong>Expected:</strong> After F5 refresh, chat rooms should load from API and display correct names.</p>
        <p><strong>Note:</strong> If you see duplicate participants, it might indicate duplicate chat rooms in the database.</p>
      </div>
    </div>
  );
}

