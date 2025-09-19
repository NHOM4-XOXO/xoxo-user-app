"use client";

import { createContext, useContext, useRef } from 'react';

const ChatContext = createContext();

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    // Return default values instead of throwing error
    return {
      setRefetchChatRooms: () => {},
      refetchChatRooms: () => {
        console.warn('refetchChatRooms called but no ChatProvider found');
      },
      setHandleChatListUpdate: () => {},
      handleChatListUpdate: () => {
        console.warn('handleChatListUpdate called but no ChatProvider found');
      },
      setForceRefreshChatRooms: () => {},
      forceRefreshChatRooms: () => {
        console.warn('forceRefreshChatRooms called but no ChatProvider found');
      },
    };
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const refetchChatRoomsRef = useRef(null);
  const handleChatListUpdateRef = useRef(null);
  const forceRefreshChatRoomsRef = useRef(null);

  const setRefetchChatRooms = (refetchFn) => {
    refetchChatRoomsRef.current = refetchFn;
  };

  const setHandleChatListUpdate = (updateFn) => {
    handleChatListUpdateRef.current = updateFn;
  };

  const setForceRefreshChatRooms = (forceRefreshFn) => {
    forceRefreshChatRoomsRef.current = forceRefreshFn;
  };

  const refetchChatRooms = () => {
    if (refetchChatRoomsRef.current) {
      console.log('🔄 Refetching chat rooms from context');
      refetchChatRoomsRef.current();
    } else {
      console.warn('⚠️ No refetchChatRooms function available in context');
    }
  };

  const forceRefreshChatRooms = () => {
    if (forceRefreshChatRoomsRef.current) {
      console.log('🔄 Force refreshing chat rooms from context');
      forceRefreshChatRoomsRef.current();
    } else {
      console.warn('⚠️ No forceRefreshChatRooms function available in context');
    }
  };

  const handleChatListUpdate = (message) => {
    if (handleChatListUpdateRef.current) {
      console.log('🔄 Handling chat list update from context');
      handleChatListUpdateRef.current(message);
    } else {
      console.warn('⚠️ No handleChatListUpdate function available in context');
    }
  };

  return (
    <ChatContext.Provider value={{
      setRefetchChatRooms,
      refetchChatRooms,
      setHandleChatListUpdate,
      handleChatListUpdate,
      setForceRefreshChatRooms,
      forceRefreshChatRooms,
    }}>
      {children}
    </ChatContext.Provider>
  );
};
