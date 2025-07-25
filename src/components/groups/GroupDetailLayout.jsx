"use client";

import { useState } from "react";
import GroupDetailSidebar from "./GroupDetailSidebar";
import GroupDetailContent from "./GroupDetailContent";

// Mock data cho nhóm
const groupData = {
  id: 1,
  name: "TỰ HỌC GUITAR - PIANO VÀ UKULELE",
  coverImage: "https://picsum.photos/800/300?random=1",
  members: "501.2K thành viên",
  isPublic: true,
  description: "Nhóm Công khai • 501,2K thành viên",
};

export default function GroupDetailLayout({ groupId }) {
  const [activeTab, setActiveTab] = useState("discussion");

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-full mx-1 ">
        <div className="flex gap-12 ">
          {/* Left Sidebar */}
          <div className="w-80 ">
            <GroupDetailSidebar group={groupData} />
          </div>

          {/* Main Content */}
          <div className="flex-2">
            <GroupDetailContent
              group={groupData}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          </div>
          
        </div>
        
      </div>
    </div>
  );
}
