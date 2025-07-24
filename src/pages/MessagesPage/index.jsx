"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import MessagesSidebar from "@/components/main/Messages/MessagesSidebar";
import MessagesChat from "@/components/main/Messages/MessagesChat";
import MessagesChatInfo from "@/components/main/Messages/MessagesChatInfo";
import { contactsData } from "@/data/rightSidebarData";
import { HEADER_HEIGHT } from "@/constants";
import { checkDeviceByWidth } from "@/utils/checkDeviceByWidth";

export default function MessagesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedContact, setSelectedContact] = useState(null);
  const [showChatInfo, setShowChatInfo] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(checkDeviceByWidth.mobile(window.innerWidth));
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Handle URL params for selected contact
  useEffect(() => {
    const contactId = searchParams.get("contact");
    if (contactId) {
      const contact = contactsData.find((c) => c.id.toString() === contactId);
      if (contact) {
        setSelectedContact(contact);
      }
    }
  }, [searchParams]);

  const handleSelectContact = (contact) => {
    setSelectedContact(contact);
    setShowChatInfo(false);

    // Update URL
    const params = new URLSearchParams(searchParams);
    params.set("contact", contact.id.toString());
    router.push(`/messages?${params.toString()}`, { scroll: false });
  };

  const handleBackToList = () => {
    setSelectedContact(null);
    setShowChatInfo(false);
    router.push("/messages", { scroll: false });
  };

  const handleToggleChatInfo = () => {
    setShowChatInfo(!showChatInfo);
  };

  return (
    <div
      className="flex text-black bg-fb-light-secondary dark:bg-fb-dark-primary dark:text-white"
      style={{ height: `calc(100vh - ${HEADER_HEIGHT}px)` }}
    >
      {/* Left Sidebar - Messages List */}
      <div
        className={`
        ${isMobile && selectedContact ? "hidden" : "flex"} 
        ${isMobile ? "w-full" : "w-80 xl:w-96"} 
        flex-shrink-0 border-r border-gray-300 dark:border-fb-dark-tertiary
      `}
      >
        <MessagesSidebar
          selectedContact={selectedContact}
          onSelectContact={handleSelectContact}
          contacts={contactsData}
        />
      </div>

      {/* Main Chat Area */}
      <div
        className={`
        ${isMobile && !selectedContact ? "hidden" : "flex"} 
        flex-1 flex flex-col
      `}
      >
        {selectedContact ? (
          <MessagesChat
            contact={selectedContact}
            onBack={handleBackToList}
            onToggleChatInfo={handleToggleChatInfo}
            showBackButton={isMobile}
          />
        ) : (
          <div className="flex items-center justify-center flex-1 bg-fb-light-secondary dark:bg-fb-dark-secondary">
            <div className="text-center">
              <div className="flex items-center justify-center w-24 h-24 mx-auto mb-4 bg-gray-300 rounded-full dark:bg-gray-600">
                <svg
                  className="w-12 h-12 text-gray-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold">
                Chọn một cuộc trò chuyện
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Chọn từ các cuộc trò chuyện hiện có hoặc bắt đầu cuộc trò chuyện
                mới.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Right Sidebar - Chat Info */}
      {selectedContact && showChatInfo && !isMobile && (
        <div className="flex-shrink-0 w-80 xl:w-96 dark:border-gray-700">
          <MessagesChatInfo
            contact={selectedContact}
            onClose={() => setShowChatInfo(false)}
          />
        </div>
      )}
    </div>
  );
}
