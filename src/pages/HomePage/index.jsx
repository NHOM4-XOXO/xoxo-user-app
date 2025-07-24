import Sidebar from "../../components/main/LeftSidebar-Home/Sidebar";
import RightSideBar from "@/components/main/RightSidebar-Home/RightSideBar";
import { useState } from "react";
import PostCreation from "@/components/main/PostCreation";
import SettingsDropdown from "@/components/main/RightSidebar-Home/SettingsDropdown";
import ScrollableContainer from "@/components/common/ScrollableContainer";
import { postData } from "@/data/postData";
import Post from "@/components/main/Post/PostItem";

export default function HomePage() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <main className="flex h-[calc(100vh-56px)] bg-fb-light-secondary dark:bg-fb-dark-primary overflow-hidden">
      {/* Left Sidebar */}
      <ScrollableContainer className="flex-shrink-0 h-full overflow-y-auto hidden xl:block">
        <Sidebar />
      </ScrollableContainer>

      {/* Main Content Area */}
      <ScrollableContainer className="flex-1 h-full overflow-y-auto">
        <div className="p-2 px-10 bg-fb-light-secondary dark:bg-fb-dark-primary">
          <div className="max-w-xl mx-auto">
            {/* Post Creation */}
            <PostCreation />

            {/* Posts Feed */}
            <div className="space-y-4">
              {postData.map((item, index) => (
                <Post key={index} data={item} />
              ))}
            </div>
          </div>
        </div>
      </ScrollableContainer>

      {/* Right Sidebar */}
      <ScrollableContainer className="flex-shrink-0 h-full overflow-y-auto">
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
