"use client";

import { useState } from "react";
import { useGetOrCreateDirectChatMutation } from "@/features/chatApi";
import { useGetFriendsQuery } from "@/features/friendshipApi";

export default function UserIdTest() {
  const [testResults, setTestResults] = useState([]);
  const [isTestingAll, setIsTestingAll] = useState(false);
  
  const [getOrCreateDirectChat] = useGetOrCreateDirectChatMutation();
  const { data: friends, isLoading: loadingFriends } = useGetFriendsQuery();

  const testUserIds = [100, 118, 6, 1, 2]; // Common test IDs

  const testSingleUserId = async (userId) => {
    try {
      console.log(`Testing user ID: ${userId}`);
      const result = await getOrCreateDirectChat(userId).unwrap();
      console.log(`Success for user ${userId}:`, result);
      
      return {
        userId,
        success: true,
        data: result,
        error: null
      };
    } catch (error) {
      console.error(`Failed for user ${userId}:`, error);
      
      return {
        userId,
        success: false,
        data: null,
        error: {
          status: error?.status,
          message: error?.data?.message || error?.message || 'Unknown error'
        }
      };
    }
  };

  const testAllUserIds = async () => {
    setIsTestingAll(true);
    setTestResults([]);
    
    const results = [];
    
    for (const userId of testUserIds) {
      const result = await testSingleUserId(userId);
      results.push(result);
      setTestResults([...results]); // Update UI progressively
      
      // Wait 1 second between tests
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    setIsTestingAll(false);
  };

  const testWithFriends = async () => {
    if (!friends || friends.length === 0) {
      alert('No friends found to test with');
      return;
    }

    setIsTestingAll(true);
    setTestResults([]);
    
    const results = [];
    const friendsToTest = friends.slice(0, 5); // Test first 5 friends
    
    for (const friend of friendsToTest) {
      const result = await testSingleUserId(friend.id);
      result.friendName = `${friend.firstName} ${friend.lastName}`;
      results.push(result);
      setTestResults([...results]);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    setIsTestingAll(false);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="p-4 bg-indigo-100 dark:bg-indigo-900 rounded-lg m-4">
      <h3 className="text-lg font-bold mb-4">User ID Test</h3>
      
      <div className="space-y-2 mb-4">
        <div className="flex gap-2">
          <button
            onClick={testAllUserIds}
            disabled={isTestingAll}
            className="bg-indigo-500 text-white px-3 py-1 rounded disabled:opacity-50"
          >
            {isTestingAll ? "Testing..." : "Test Common User IDs"}
          </button>
          
          <button
            onClick={testWithFriends}
            disabled={isTestingAll || loadingFriends}
            className="bg-green-500 text-white px-3 py-1 rounded disabled:opacity-50"
          >
            {loadingFriends ? "Loading..." : "Test with Friends"}
          </button>
          
          <button
            onClick={clearResults}
            className="bg-gray-500 text-white px-3 py-1 rounded"
          >
            Clear
          </button>
        </div>
        
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Testing user IDs: {testUserIds.join(', ')}
        </p>
      </div>

      {testResults.length > 0 && (
        <div className="mt-4">
          <h4 className="font-medium mb-2">Test Results:</h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {testResults.map((result, index) => (
              <div
                key={index}
                className={`p-2 rounded text-sm ${
                  result.success
                    ? 'bg-green-100 dark:bg-green-900 border-l-4 border-green-500'
                    : 'bg-red-100 dark:bg-red-900 border-l-4 border-red-500'
                }`}
              >
                <div className="font-medium">
                  User ID: {result.userId}
                  {result.friendName && ` (${result.friendName})`}
                  {result.success ? ' ✅' : ' ❌'}
                </div>
                
                {result.success ? (
                  <div className="text-xs mt-1">
                    Chat Room ID: {result.data?.id}, Name: {result.data?.name}
                  </div>
                ) : (
                  <div className="text-xs mt-1">
                    Error {result.error?.status}: {result.error?.message}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 text-xs text-gray-600 dark:text-gray-400">
        <p><strong>Purpose:</strong> Test different user IDs to find which ones work</p>
        <p><strong>Common Issues:</strong></p>
        <ul className="list-disc list-inside ml-2">
          <li>HTTP 404: User doesn't exist</li>
          <li>HTTP 500: Server error (database, validation, etc.)</li>
          <li>HTTP 401: Authentication failed</li>
        </ul>
      </div>
    </div>
  );
}

