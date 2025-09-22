"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function OnlineFriends({ contacts, onSelectContact }) {
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const scrollContainerRef = useRef(null);

  // Check scroll position to show/hide arrows
  const checkScrollPosition = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;
    setShowLeftArrow(scrollLeft > 0);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
  };

  useEffect(() => {
    checkScrollPosition();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", checkScrollPosition);
      return () => container.removeEventListener("scroll", checkScrollPosition);
    }
  }, [contacts]);

  // Handle resize to recheck scroll position
  useEffect(() => {
    const handleResize = () => {
      setTimeout(checkScrollPosition, 100);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const scrollLeft = () => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollBy({ left: -200, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollBy({ left: 200, behavior: "smooth" });
    }
  };

  if (contacts.length === 0) return null;

  return (
    <div className="relative">
      {/* Left Arrow */}
      {showLeftArrow && (
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-full shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center cursor-pointer"
          style={{ marginLeft: "-4px" }}
        >
          <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        </button>
      )}

      {/* Right Arrow */}
      {showRightArrow && (
        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-full shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center cursor-pointer"
          style={{ marginRight: "-4px" }}
        >
          <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        </button>
      )}

      {/* Scrollable Container */}
      <div
        ref={scrollContainerRef}
        className="flex space-x-3 overflow-x-auto scrollbar-hide scroll-smooth"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitScrollbar: { display: "none" },
        }}
      >
        {contacts.map((contact) => (
          <div
            key={contact.id}
            className="flex-shrink-0 text-center cursor-pointer group"
            onClick={() => onSelectContact(contact)}
          >
            <div className="relative mb-2">
              <Image
                src={contact.avatarUrl || "/default-avatar.jpg"}
                alt={contact.name}
                width={56}
                height={56}
                className="rounded-full object-cover transition-transform duration-200 group-hover:scale-105"
              />
              {/* Online indicator */}
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
            </div>
            <p className="text-xs truncate w-14 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {contact.name.split(" ")[0]}
            </p>
          </div>
        ))}
      </div>

      {/* Gradient overlays for better visual indication */}
      {showLeftArrow && (
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-fb-light-primary dark:from-fb-dark-primary to-transparent pointer-events-none"></div>
      )}
      {showRightArrow && (
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-fb-light-primary dark:from-fb-dark-primary to-transparent pointer-events-none"></div>
      )}
    </div>
  );
}
