"use client";

import { useState } from "react";
import GroupsSidebar from "./GroupsSidebar";
import GroupsFeed from "./GroupsFeed";
import GroupsDiscovery from "./GroupsDiscovery";

export default function GroupsLayout() {
  const [activeTab, setActiveTab] = useState("feed");

  return (
    <div className="min-h-screen bg-gray-100">

      <div className="max-7xl mx-auto ">
        <div className="flex gap-12">
          {/* Left Sidebar */}
          <div className="w-80 flex-shrink-0 ">
            <GroupsSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === "feed" && <GroupsFeed />}
            {activeTab === "discovery" && <GroupsDiscovery />}
          </div>
        </div>
      </div>
    </div>
  );
}
