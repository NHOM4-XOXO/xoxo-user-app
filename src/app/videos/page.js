"use client";

import WatchHome from "@/components/main/Video/VideoHome";
import WatchSidebar from "@/components/main/Video/VideoSidebar";
import { SIDEBAR_ITEM_NAMES } from "@/constants/WatchPage";
import { useState } from "react";

export default function VideoPage() {
  const [itemSelected, setItemSelected] = useState(SIDEBAR_ITEM_NAMES.HOME);

  return (
    <div className="flex h-[calc(100vh-56px)] bg-fb-light-primary dark:bg-fb-dark-primary text-white mt-14">
      {/* Video Sidebar */}
      <WatchSidebar
        itemSelected={itemSelected}
        setItemSelected={setItemSelected}
      />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto scrollbar-hide bg-fb-light-secondary dark:bg-fb-dark-primary">
        <div className="p-4 md:p-6 max-w-3xl mx-auto">
          {itemSelected === SIDEBAR_ITEM_NAMES.HOME && <WatchHome />}
        </div>
      </main>
    </div>
  );
}
