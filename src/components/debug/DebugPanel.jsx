"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Bug } from "lucide-react";
import CompleteFlowTest from "./CompleteFlowTest";
import EnvTest from "./EnvTest";
import UserIdTest from "./UserIdTest";
import ApiDebugTest from "./ApiDebugTest";
import AuthTest from "./AuthTest";
import SimpleApiTest from "./SimpleApiTest";
import ChatDebug from "./ChatDebug";
import WebSocketOnlyTest from "./WebSocketOnlyTest";
import ChatRoomsTest from "./ChatRoomsTest";

export default function DebugPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("flow");

  const debugComponents = {
    flow: { name: "Complete Flow", component: CompleteFlowTest },
    websocket: { name: "WebSocket Only", component: WebSocketOnlyTest },
    chatrooms: { name: "Chat Rooms", component: ChatRoomsTest },
    env: { name: "Environment", component: EnvTest },
    users: { name: "User ID Test", component: UserIdTest },
    api: { name: "API Debug", component: ApiDebugTest },
    auth: { name: "Auth Test", component: AuthTest },
    simple: { name: "Simple API", component: SimpleApiTest },
    chat: { name: "Chat Debug", component: ChatDebug },
  };

  const ActiveComponent = debugComponents[activeTab]?.component;

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 left-4 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-red-700 transition-colors"
        >
          <Bug className="w-4 h-4" />
          Debug Tools
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <div className="flex items-center gap-2">
            <Bug className="w-5 h-5 text-red-600" />
            <h2 className="text-lg font-bold">Debug Tools</h2>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <ChevronUp className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b dark:border-gray-700 overflow-x-auto">
          {Object.entries(debugComponents).map(([key, { name }]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === key
                  ? "text-red-600 border-b-2 border-red-600 bg-red-50 dark:bg-red-900/20"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
              }`}
            >
              {name}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {ActiveComponent && <ActiveComponent />}
        </div>

        {/* Footer */}
        <div className="p-4 border-t dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400">
          <p>Use these tools to debug chat functionality. Close this panel to use the normal chat interface.</p>
        </div>
      </div>
    </div>
  );
}
