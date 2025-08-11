"use client";

import { useState } from "react";
import GroupsSidebar from "./GroupsSidebar";
import GroupsFeed from "./GroupsFeed";
import GroupsDiscovery from "./GroupsDiscovery";
import ScrollableContainer from "../common/ScrollableContainer";
import { HEADER_HEIGHT } from "@/constants";

export default function GroupsLayout() {
  const [activeTab, setActiveTab] = useState("feed");

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-7xl mx-auto ">
        <div className="flex gap-12">
          {/* Left Sidebar */}
          <div className="w-100 sticky top-12 self-start">
            <ScrollableContainer className=" overflow-y-auto flex-2">
              <div style={{ maxHeight: `calc(100vh - ${HEADER_HEIGHT}px)` }}>
                <GroupsSidebar
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                />
              </div>
            </ScrollableContainer>
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
