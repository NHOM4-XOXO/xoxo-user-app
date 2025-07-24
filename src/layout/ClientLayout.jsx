"use client";

import ChatWidget from "@/components/main/Chat/ChatWidget";
import Header from "@/components/main/LeftSidebar-Home/Header";
import MobileNavigation from "@/components/main/LeftSidebar-Home/MobileNavigation";
import { UserProvider } from "@/contexts/UserContext";
import useWindowHeight from "@/hooks/useWindowHeight";
import useWindowWidth from "@/hooks/useWindowWidth";
import { checkDeviceByWidth } from "@/utils/checkDeviceByWidth";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

const ClientLayout = ({ children }) => {
  const pathname = usePathname();
  const [activeChatContacts, setActiveChatContacts] = useState([]);
  const windowWidth = useWindowWidth();
  const windowHeight = useWindowHeight();

  // Danh sách các trang không hiển thị header và chat
  const hideHeaderPaths = ["/login", "/forgot-password", "/email-verification"];
  const hideChatPaths = [
    "/login",
    "/forgot-password",
    "/email-verification",
    "/admin",
  ];

  const shouldHideHeader = hideHeaderPaths.includes(pathname);
  const shouldHideChat = hideChatPaths.includes(pathname);

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

  // Global function to handle opening chat from anywhere
  useEffect(() => {
    const handleOpenChat = (event) => {
      const contact = event.detail;
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

    // Listen for global chat open events
    window.addEventListener("openChat", handleOpenChat);

    return () => {
      window.removeEventListener("openChat", handleOpenChat);
    };
  }, [activeChatContacts, maxChatWindows]);

  const handleCloseChat = (contactId) => {
    setActiveChatContacts((prev) =>
      prev.filter((chat) => chat.id !== contactId)
    );
  };

  return (
    <UserProvider>
      {!shouldHideHeader && (
        <Header
          onContactClick={(contact) => {
            // Dispatch global event for opening chat
            window.dispatchEvent(
              new CustomEvent("openChat", { detail: contact })
            );
          }}
        />
      )}
      <div className={shouldHideHeader ? "" : "mt-14"}>{children}</div>
      {!shouldHideHeader && <MobileNavigation />}

      {/* Global Chat Widget - hiển thị trên tất cả trang trừ những trang bị loại trừ */}
      {!shouldHideChat && (
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
      )}
    </UserProvider>
  );
};

export default ClientLayout;
