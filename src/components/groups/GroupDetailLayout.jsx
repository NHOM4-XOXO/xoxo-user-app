"use client";

import { useState } from "react";
import GroupDetailSidebar from "./GroupDetailSidebar";
import GroupDetailContent from "./GroupDetailContent";
import { HEADER_HEIGHT } from "@/constants";
import ScrollableContainer from "../common/ScrollableContainer";

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
    <div className="bg-gray-100">
      <div className="max-w-full mx-1 ">
        <div className="flex gap-12 ">
          {/* Left Sidebar */}
          <div className="w-80 ">
            <ScrollableContainer className=" overflow-y-auto">
              <GroupDetailSidebar group={groupData} />
            </ScrollableContainer>
          </div>

          {/* Main Content */}
          <ScrollableContainer className=" overflow-y-auto flex-2">
            <div
          
              style={{ maxHeight: `calc(100vh - ${HEADER_HEIGHT}px)` }}
            >
              <GroupDetailContent
                group={groupData}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
            </div>
          </ScrollableContainer>
        </div>
      </div>
    </div>
  );
}
