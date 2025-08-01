import Sidebar from "../../components/main/LeftSidebar-Home/Sidebar";
import RightSideBar from "@/components/main/RightSidebar-Home/RightSideBar";
import { useState } from "react";
import PostCreation from "@/components/main/PostCreation";
import SettingsDropdown from "@/components/main/RightSidebar-Home/SettingsDropdown";
import ScrollableContainer from "@/components/common/ScrollableContainer";
import Post from "@/components/main/Post/PostItem";
import { allPosts } from "@/data/posts";
import { HEADER_HEIGHT } from "@/constants";

export default function HomePage() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <main
      className={`flex h-[calc(100vh-${HEADER_HEIGHT}px)] bg-fb-light-secondary dark:bg-fb-dark-primary overflow-hidden`}
    >
      {/* Left Sidebar */}
      <ScrollableContainer className="flex-shrink-0 h-full hidden xl:block">
        <Sidebar />
      </ScrollableContainer>

      {/* Main Content Area */}
      <ScrollableContainer className="flex-1 h-full">
        <div className="p-2 px-10 bg-fb-light-secondary dark:bg-fb-dark-primary">
          <div className="max-w-xl mx-auto">
            {/* Post Creation */}
            <PostCreation />

            {/* Posts Feed */}
            <div className="space-y-4">
              {allPosts.map((item, index) => (
                <Post key={index} data={item} />
              ))}
            </div>
          </div>
        </div>
      </ScrollableContainer>

      {/* Right Sidebar */}
      <ScrollableContainer className="flex-shrink-0 h-full">
        <RightSideBar
          isSettingsOpen={isSettingsOpen}
          setIsSettingsOpen={setIsSettingsOpen}
          onContactClick={(contact) => {
            // Dispatch global event for opening chat
            window.dispatchEvent(
              new CustomEvent("openChat", { detail: contact })
            );
          }}
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
