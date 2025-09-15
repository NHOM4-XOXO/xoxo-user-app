"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";

export default function AuthTest() {
  const [authInfo, setAuthInfo] = useState(null);

  useEffect(() => {
    const token = Cookies.get("token");
    const refreshToken = Cookies.get("refreshToken");
    
    setAuthInfo({
      token: token ? `${token.substring(0, 20)}...` : "Not found",
      refreshToken: refreshToken ? `${refreshToken.substring(0, 20)}...` : "Not found",
      hasToken: !!token,
      hasRefreshToken: !!refreshToken,
    });
  }, []);

  const testAuth = async () => {
    try {
      const token = Cookies.get("token");
      
      const response = await fetch("https://xoxo.id.vn/api/user/profile", {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        credentials: "include",
      });

      const data = await response.json();
      
      if (response.ok) {
        alert(`Auth successful! User: ${data.data?.firstName} ${data.data?.lastName}`);
      } else {
        alert(`Auth failed: ${data.message || "Unknown error"}`);
      }
    } catch (error) {
      alert(`Auth test failed: ${error.message}`);
    }
  };

  return (
    <div className="p-4 bg-blue-100 dark:bg-blue-900 rounded-lg m-4">
      <h3 className="text-lg font-bold mb-4">Authentication Test</h3>
      
      {authInfo && (
        <div className="mb-4 space-y-2">
          <p><strong>Token:</strong> {authInfo.token}</p>
          <p><strong>Refresh Token:</strong> {authInfo.refreshToken}</p>
          <p><strong>Has Token:</strong> {authInfo.hasToken ? "✅" : "❌"}</p>
          <p><strong>Has Refresh Token:</strong> {authInfo.hasRefreshToken ? "✅" : "❌"}</p>
        </div>
      )}

      <button
        onClick={testAuth}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        Test Authentication
      </button>
    </div>
  );
}

