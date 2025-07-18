import Sidebar from "../../components/LeftSidebar-Home/Sidebar";
import RightSideBar from "@/components/RightSidebar-Home/RightSideBar";
import { useState } from "react";
import PostCreation from "@/components/PostCreation";
import SettingsDropdown from "@/components/RightSidebar-Home/SettingsDropdown";
import ScrollableContainer from "@/components/ScrollableContainer";

export default function HomePage() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <main className="flex h-[calc(100vh-56px)] bg-fb-light-secondary dark:bg-fb-dark-primary overflow-hidden">
      {/* Left Sidebar - Fixed */}
      <ScrollableContainer className="flex-shrink-0 h-full overflow-y-auto hidden xl:block">
        <Sidebar />
      </ScrollableContainer>

      {/* Main Content Area - Scrollable */}
      <ScrollableContainer className="flex-1 h-full overflow-y-auto">
        <div className="p-2 px-10 bg-fb-light-secondary dark:bg-fb-dark-primary">
          <div className="max-w-xl mx-auto">
            {/* Post Creation Component */}
            <PostCreation />

            {/* Posts Feed */}
            <div className="space-y-4">
              {Array.from({ length: 20 }, (_, index) => (
                <div
                  key={index}
                  className="bg-gray-800 rounded-lg shadow-md p-4 md:p-6"
                >
                  <p className="text-gray-300">
                    Đây là khu vực hiển thị các bài viết. Post creation
                    component đã được thêm ở trên. Bài viết số {index + 1}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ScrollableContainer>

      {/* Right Sidebar - Fixed */}
      <ScrollableContainer className="flex-shrink-0 h-full overflow-y-auto">
        <RightSideBar
          isSettingsOpen={isSettingsOpen}
          setIsSettingsOpen={setIsSettingsOpen}
        />
        {/* Settings Dropdown */}
        <SettingsDropdown
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
        />
      </ScrollableContainer>
    </main>
  );
}
