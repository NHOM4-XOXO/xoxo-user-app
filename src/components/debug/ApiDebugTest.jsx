"use client";

import { useState } from "react";
import Cookies from "js-cookie";

export default function ApiDebugTest() {
  const [testUserId, setTestUserId] = useState("100");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const testDirectApi = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const token = Cookies.get("token");
      console.log("API Debug - Token:", token ? "Found" : "Not found");
      console.log("API Debug - Token preview:", token ? token.substring(0, 50) + "..." : "None");

      const url = `https://xoxo.id.vn/api/v1/chat/direct/${testUserId}`;
      console.log("API Debug - URL:", url);

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        credentials: "include",
      });

      console.log("API Debug - Response status:", response.status);
      console.log("API Debug - Response ok:", response.ok);
      console.log("API Debug - Response headers:", [...response.headers.entries()]);

      let data;
      try {
        data = await response.json();
        console.log("API Debug - Response data:", data);
      } catch (jsonError) {
        console.error("API Debug - JSON parse error:", jsonError);
        const textData = await response.text();
        console.log("API Debug - Response text:", textData);
        throw new Error(`Failed to parse JSON: ${textData}`);
      }

      if (response.ok) {
        setResult(data);
      } else {
        setError(`HTTP ${response.status}: ${data.message || data.error || "Unknown error"}`);
      }
    } catch (err) {
      console.error("API Debug - Fetch error:", err);
      setError(`Network error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testAuthApi = async () => {
    try {
      const token = Cookies.get("token");
      const response = await fetch("https://xoxo.id.vn/api/user/profile", {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        credentials: "include",
      });

      const data = await response.json();
      console.log("Auth test result:", data);

      if (response.ok) {
        alert(`Auth OK! User: ${data.data?.firstName} ${data.data?.lastName}`);
      } else {
        alert(`Auth failed: ${data.message}`);
      }
    } catch (error) {
      alert(`Auth test error: ${error.message}`);
    }
  };

  const checkTokens = () => {
    const token = Cookies.get("token");
    const refreshToken = Cookies.get("refreshToken");
    
    console.log("Token exists:", !!token);
    console.log("Refresh token exists:", !!refreshToken);
    console.log("Token preview:", token ? token.substring(0, 100) + "..." : "None");
    
    alert(`Token: ${token ? "Found" : "Not found"}\nRefresh: ${refreshToken ? "Found" : "Not found"}`);
  };

  return (
    <div className="p-4 bg-red-100 dark:bg-red-900 rounded-lg m-4">
      <h3 className="text-lg font-bold mb-4">API Debug Test</h3>
      
      <div className="space-y-2 mb-4">
        <button
          onClick={checkTokens}
          className="bg-gray-500 text-white px-3 py-1 rounded mr-2"
        >
          Check Tokens
        </button>
        <button
          onClick={testAuthApi}
          className="bg-green-500 text-white px-3 py-1 rounded mr-2"
        >
          Test Auth
        </button>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">User ID to chat with:</label>
        <input
          type="text"
          value={testUserId}
          onChange={(e) => setTestUserId(e.target.value)}
          className="border rounded px-2 py-1 mr-2"
        />
        <button
          onClick={testDirectApi}
          disabled={loading}
          className="bg-red-500 text-white px-4 py-1 rounded disabled:opacity-50"
        >
          {loading ? "Testing..." : "Test Direct Chat API"}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-2 bg-red-200 dark:bg-red-800 rounded">
          <p className="text-red-800 dark:text-red-200">Error: {error}</p>
        </div>
      )}

      {result && (
        <div className="mb-4 p-2 bg-green-200 dark:bg-green-800 rounded">
          <p className="text-green-800 dark:text-green-200">Success!</p>
          <pre className="text-xs mt-2 overflow-auto max-h-32">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}

      <div className="text-sm text-gray-600 dark:text-gray-400">
        <p><strong>Debug Info:</strong></p>
        <p>• Check browser console for detailed logs</p>
        <p>• Check Network tab in DevTools</p>
        <p>• Make sure you're logged in</p>
        <p>• Check if CORS is configured properly</p>
      </div>
    </div>
  );
}
