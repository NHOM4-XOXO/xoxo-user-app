"use client";

import ChatWidget from "@/components/main/Chat/ChatWidget";
import ChatBubble from "@/components/main/Chat/ChatBubble";
import Header from "@/components/main/LeftSidebar-Home/Header";
import MobileNavigation from "@/components/main/LeftSidebar-Home/MobileNavigation";
import { UserProvider } from "@/contexts/UserContext";
import useWindowHeight from "@/hooks/useWindowHeight";
import useWindowWidth from "@/hooks/useWindowWidth";
import { checkDeviceByWidth } from "@/utils/checkDeviceByWidth";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { MAX_VISIBLE_BUBBLES, MAX_VISIBLE_BUBBLES_EXPANDED } from "@/constants";

const ClientLayout = ({ children }) => {
  const pathname = usePathname();
  const [activeChatContacts, setActiveChatContacts] = useState([]);
  const [minimizedChats, setMinimizedChats] = useState([]);
  const [showAllBubbles, setShowAllBubbles] = useState(false);
  const windowWidth = useWindowWidth();
  const windowHeight = useWindowHeight();

  // Danh sách các trang không hiển thị header và chat
  const hideHeaderPaths = ["/login", "/forgot-password", "/email-verification"];
  const hideChatPaths = [
    "/login",
    "/forgot-password",
    "/email-verification",
    "/admin",
    "/messages",
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

  const handleMinimizeChat = (contact) => {
    setActiveChatContacts((prev) =>
      prev.filter((chat) => chat.id !== contact.id)
    );
    setMinimizedChats((prev) => {
      const isAlreadyMinimized = prev.some((chat) => chat.id === contact.id);
      if (!isAlreadyMinimized) {
        return [...prev, contact];
      }
      return prev;
    });
  };

  const handleRestoreChat = (contact) => {
    setMinimizedChats((prev) => prev.filter((chat) => chat.id !== contact.id));

    // Check if contact is already in activeChatContacts array
    const isChatOpen = activeChatContacts.some(
      (chat) => chat.id === contact.id
    );

    if (!isChatOpen) {
      setActiveChatContacts((prev) => {
        // If adding this chat would exceed the limit, remove the oldest one
        if (prev.length >= maxChatWindows) {
          return [...prev.slice(1), contact];
        }
        return [...prev, contact];
      });
    }
  };

  const handleCloseMinimizedChat = (contactId) => {
    setMinimizedChats((prev) => prev.filter((chat) => chat.id !== contactId));
  };

  const handleShowMoreBubbles = () => {
    setShowAllBubbles(true);
  };

  // Handle hide extra bubbles (when clicking outside or after some time)
  const handleHideExtraBubbles = () => {
    setShowAllBubbles(false);
  };

  // Calculate visible bubbles
  const getVisibleBubbles = () => {
    const maxVisible = showAllBubbles
      ? MAX_VISIBLE_BUBBLES_EXPANDED
      : MAX_VISIBLE_BUBBLES;

    if (minimizedChats.length <= MAX_VISIBLE_BUBBLES) {
      return {
        visibleBubbles: minimizedChats,
        hiddenCount: 0,
        showCounter: false,
      };
    }

    if (showAllBubbles) {
      return {
        visibleBubbles: minimizedChats.slice(0, maxVisible),
        hiddenCount: Math.max(0, minimizedChats.length - maxVisible),
        showCounter: minimizedChats.length > maxVisible,
      };
    }

    return {
      visibleBubbles: minimizedChats.slice(0, MAX_VISIBLE_BUBBLES - 1),
      hiddenCount: minimizedChats.length - (MAX_VISIBLE_BUBBLES - 1),
      showCounter: true,
    };
  };

  const { visibleBubbles, hiddenCount, showCounter } = getVisibleBubbles();

  // Global function to handle opening chat from anywhere
  useEffect(() => {
    const handleOpenChat = (event) => {
      const contact = event.detail;

      // First check if it's in minimized chats and restore it
      const isMinimized = minimizedChats.some((chat) => chat.id === contact.id);
      if (isMinimized) {
        handleRestoreChat(contact);
        return;
      }

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
  }, [activeChatContacts, minimizedChats, maxChatWindows]);

  // Auto-hide expanded bubbles after 5 seconds of no interaction
  useEffect(() => {
    if (showAllBubbles) {
      const timer = setTimeout(() => {
        setShowAllBubbles(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [showAllBubbles]);

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

      {/* Global Chat Widget - Showing on all pages except for exclusion pages */}
      {!shouldHideChat && (
        <div className="hidden md:block">
          {/* Active Chat Windows */}
          {activeChatContacts.map((contact, index) => (
            <ChatWidget
              key={contact.id}
              contact={contact}
              onClose={() => handleCloseChat(contact.id)}
              onMinimize={() => handleMinimizeChat(contact)}
              positionOffset={index}
              windowHeight={windowHeight}
            />
          ))}

          {/* Chat Bubbles for minimized chats */}
          {visibleBubbles.map((contact, index) => (
            <ChatBubble
              key={`bubble-${contact.id}`}
              contact={contact}
              onRestore={() => handleRestoreChat(contact)}
              onClose={() => handleCloseMinimizedChat(contact.id)}
              positionOffset={index}
              hasUnreadMessages={false}
            />
          ))}

          {/* Counter bubble for hidden chats */}
          {showCounter && hiddenCount > 0 && (
            <ChatBubble
              key="counter-bubble"
              isCounterBubble={true}
              hiddenCount={hiddenCount}
              positionOffset={visibleBubbles.length}
              onShowMore={handleShowMoreBubbles}
            />
          )}

          {/* Overlay to hide extra bubbles when clicking outside */}
          {showAllBubbles && (
            <div
              className="fixed inset-0 z-30"
              onClick={handleHideExtraBubbles}
            />
          )}
        </div>
      )}
    </UserProvider>
  );
};

export default ClientLayout;
