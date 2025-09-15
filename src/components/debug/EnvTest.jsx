"use client";

import { useState, useEffect } from "react";

export default function EnvTest() {
  const [envInfo, setEnvInfo] = useState({});

  useEffect(() => {
    setEnvInfo({
      NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
      NODE_ENV: process.env.NODE_ENV,
      location: typeof window !== 'undefined' ? window.location.origin : 'SSR',
      userAgent: typeof window !== 'undefined' ? navigator.userAgent : 'SSR',
    });
  }, []);

  return (
    <div className="p-4 bg-purple-100 dark:bg-purple-900 rounded-lg m-4">
      <h3 className="text-lg font-bold mb-4">Environment Test</h3>
      
      <div className="space-y-2 text-sm">
        <div><strong>API URL:</strong> {envInfo.NEXT_PUBLIC_API_URL || "Not set (will use default)"}</div>
        <div><strong>Default URL:</strong> https://xoxo.id.vn</div>
        <div><strong>NODE_ENV:</strong> {envInfo.NODE_ENV}</div>
        <div><strong>Current Origin:</strong> {envInfo.location}</div>
        <div><strong>User Agent:</strong> {envInfo.userAgent?.substring(0, 100)}...</div>
      </div>

      <div className="mt-4 text-xs text-gray-600 dark:text-gray-400">
        <p><strong>Note:</strong> If API URL is not set, it will use https://xoxo.id.vn by default.</p>
        <p>Make sure CORS is configured for your current origin: {envInfo.location}</p>
      </div>
    </div>
  );
}
