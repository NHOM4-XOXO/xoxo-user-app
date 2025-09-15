"use client";

import { useState } from "react";
import Cookies from "js-cookie";

export default function SimpleApiTest() {
  const [testUserId, setTestUserId] = useState("100");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const testApi = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const token = Cookies.get("token");
      console.log("Token:", token);

      const response = await fetch(`https://xoxo.id.vn/api/v1/chat/direct/${testUserId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        credentials: "include",
      });

      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);

      const data = await response.json();
      console.log("Response data:", data);

      if (response.ok) {
        setResult(data);
      } else {
        setError(`Error ${response.status}: ${data.message || data.error || "Unknown error"}`);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError(`Network error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-yellow-100 dark:bg-yellow-900 rounded-lg m-4">
      <h3 className="text-lg font-bold mb-4">Simple API Test (No Hooks)</h3>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">User ID:</label>
        <input
          type="text"
          value={testUserId}
          onChange={(e) => setTestUserId(e.target.value)}
          className="border rounded px-2 py-1 mr-2"
        />
        <button
          onClick={testApi}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-1 rounded disabled:opacity-50"
        >
          {loading ? "Testing..." : "Test API"}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-2 bg-red-100 dark:bg-red-900 rounded">
          <p className="text-red-700 dark:text-red-300">Error: {error}</p>
        </div>
      )}

      {result && (
        <div className="mb-4 p-2 bg-green-100 dark:bg-green-900 rounded">
          <p className="text-green-700 dark:text-green-300">Success!</p>
          <pre className="text-xs mt-2 overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}

      <div className="text-sm text-gray-600 dark:text-gray-400">
        <p>Check browser console for detailed logs.</p>
        <p>Make sure you're logged in and have a valid token.</p>
      </div>
    </div>
  );
}
