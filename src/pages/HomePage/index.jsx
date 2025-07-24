import Sidebar from "../../components/main/LeftSidebar-Home/Sidebar";
import RightSideBar from "@/components/main/RightSidebar-Home/RightSideBar";
import { useEffect, useState } from "react";
import PostCreation from "@/components/main/PostCreation";
import SettingsDropdown from "@/components/main/RightSidebar-Home/SettingsDropdown";
import ScrollableContainer from "@/components/common/ScrollableContainer";
import ChatWidget from "@/components/main/Chat/ChatWidget";
import useWindowWidth from "@/hooks/useWindowWidth";
import useWindowHeight from "@/hooks/useWindowHeight";
import Post from "@/components/main/Post/PostItem";
import { checkDeviceByWidth } from "@/utils/checkDeviceByWidth";
import { allPosts } from "@/data/posts";

export default function HomePage() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeChatContacts, setActiveChatContacts] = useState([]);
  const windowWidth = useWindowWidth();
  const windowHeight = useWindowHeight();

  // Determine max chat windows based on screen size
  const getMaxChatWindows = () => {
    if (checkDeviceByWidth.desktop(windowWidth)) {
      return 3;
    } else if (checkDeviceByWidth.tablet(windowWidth)) {
      return 2;
    } else if (checkDeviceByWidth.mobile(windowWidth)) {
      return 1;
    }
    return 0;
  };

  const maxChatWindows = getMaxChatWindows();

  // Effect to adjust active chat contacts when window resizes
  useEffect(() => {
    if (activeChatContacts.length > maxChatWindows) {
      // Remove oldest chats (from the left) if limit is exceeded
      setActiveChatContacts((prev) => prev.slice(prev.length - maxChatWindows));
    }
  }, [windowWidth, activeChatContacts.length, maxChatWindows]);

  const handleOpenChat = (contact) => {
    // Check if contact is already in activeChatContacts array
    const isChatOpen = activeChatContacts.some(
      (chat) => chat.id === contact.id
    );

    if (!isChatOpen) {
      setActiveChatContacts((prev) => {
        // If adding this chat would exceed the limit, remove the oldest one
        if (prev.length >= maxChatWindows) {
          return [...prev.slice(1), contact]; // Remove the first (oldest) and add new
        }
        return [...prev, contact];
      });
    }
  };

  const handleCloseChat = (contactId) => {
    setActiveChatContacts((prev) =>
      prev.filter((chat) => chat.id !== contactId)
    );
  };

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
              {allPosts.map((item, index) => (
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
          onContactClick={handleOpenChat}
        />
        {/* Settings Dropdown */}
        <SettingsDropdown
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
        />
      </ScrollableContainer>

      {/* Chat Widget */}
      <div className="hidden md:block">
        {activeChatContacts.map((contact, index) => (
          <ChatWidget
            key={contact.id}
            contact={contact}
            onClose={() => handleCloseChat(contact.id)}
            positionOffset={index}
            windowHeight={windowHeight}
          />
        ))}
      </div>
    </main>
  );
}
