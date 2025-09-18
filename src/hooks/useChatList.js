import { useState, useEffect, useCallback } from 'react';
import { useGetChatRoomsQuery } from '@/features/chatApi';
import websocketService from '@/services/websocketService';
import Cookies from 'js-cookie';
import { useChatContext } from '@/contexts/ChatContext';

export const useChatList = () => {
    const [chatRooms, setChatRooms] = useState([]);
    const [isConnected, setIsConnected] = useState(false);
    const { setRefetchChatRooms, setHandleChatListUpdate, setForceRefreshChatRooms } = useChatContext();

    // Fetch chat rooms from API
    const {
        data: chatRoomsData,
        isLoading: isLoadingChatRooms,
        error: chatRoomsError,
        refetch: refetchChatRooms,
    } = useGetChatRoomsQuery({ page: 0, size: 50 }, {
        refetchOnMountOrArgChange: true,
        refetchOnFocus: true,
        refetchOnReconnect: true,
        pollingInterval: 0,
    });

    // Get current user ID from profile API and cache it (fallback to JWT decode)
    const getCurrentUserId = useCallback(() => {
        try {
            const cached = typeof window !== 'undefined' ? window.__currentUserId || localStorage.getItem('currentUserId') : null;
            if (cached) return Number(cached);

            const token = Cookies.get('token');
            if (!token) {
                console.log('No token found in cookies');
                return null;
            }

            // Fallback decode if profile not yet fetched
            const payload = JSON.parse(atob(token.split('.')[1]));
            const fallbackId = payload.userId || payload.id;
            return fallbackId ?? null;
        } catch (error) {
            console.error('Failed to get current user id:', error);
            return null;
        }
    }, []);

    // Update local chat rooms when API data changes
    useEffect(() => {
        console.log('📊 Chat rooms API response:', chatRoomsData);
        const normalize = (rooms) => {
            // Sort by lastMessageAt desc (newest first)
            return [...rooms].sort((a, b) => {
                const aTime = a?.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0;
                const bTime = b?.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0;
                return bTime - aTime;
            });
        };

        if (Array.isArray(chatRoomsData)) {
            console.log('📊 Chat rooms loaded from API (array):', chatRoomsData);
            setChatRooms(normalize(chatRoomsData));
        } else if (chatRoomsData?.content) {
            console.log('📊 Chat rooms loaded from API (content):', chatRoomsData.content);
            setChatRooms(normalize(chatRoomsData.content));
        } else if (chatRoomsData?.data) {
            console.log('📊 Chat rooms loaded from API (data):', chatRoomsData.data);
            setChatRooms(normalize(chatRoomsData.data));
        }
    }, [chatRoomsData]);

    // Handle real-time chat list updates
    const handleChatListUpdate = useCallback((message) => {
        const currentUserId = getCurrentUserId();
        console.log('📨 Handling chat list update:', message, 'Current user ID:', currentUserId);
        
        setChatRooms(prev => {
            const updated = prev.map(room => {
                if (room.id === message.chatRoomId) {
                    const updatedRoom = {
                        ...room,
                        lastMessage: {
                            content: message.content,
                            sentAt: message.sentAt || new Date().toISOString(),
                            senderId: message.senderId,
                        },
                        lastMessageAt: message.sentAt || new Date().toISOString(),
                        unreadCount: message.senderId !== currentUserId ? (room.unreadCount || 0) + 1 : room.unreadCount,
                    };
                    console.log('✅ Chat room updated via WebSocket:', updatedRoom);
                    return updatedRoom;
                }
                return room;
            });

            // Reorder list to move updated room to top by lastMessageAt
            return updated.sort((a, b) => {
                const aTime = a?.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0;
                const bTime = b?.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0;
                return bTime - aTime;
            });
        });
    }, [getCurrentUserId]);

    // Connect to WebSocket for real-time updates
    const connectWebSocket = useCallback(async () => {
        try {
            await websocketService.connect();
            setIsConnected(true);
            
            // Subscribe to user's private messages for chat list updates
            await websocketService.subscribeToPrivateMessages('user', (message) => {
                console.log('Received chat list update:', message);
                handleChatListUpdate(message);
            });
            
        } catch (error) {
            console.error('Failed to connect to WebSocket for chat list:', error);
            setIsConnected(false);
        }
    }, [handleChatListUpdate]);

    // Add new chat room to list
    const addChatRoom = useCallback((newChatRoom) => {
        setChatRooms(prev => {
            // Check if chat room already exists
            if (prev.some(room => room.id === newChatRoom.id)) {
                return prev;
            }
            return [newChatRoom, ...prev];
        });
    }, []);

    // Update chat room (e.g., when last message changes)
    const updateChatRoom = useCallback((chatRoomId, updates) => {
        console.log('🔄 Updating chat room locally:', chatRoomId, updates);
        setChatRooms(prev => {
            return prev.map(room => {
                if (room.id === chatRoomId) {
                    const updatedRoom = { ...room, ...updates };
                    console.log('✅ Chat room updated:', updatedRoom);
                    return updatedRoom;
                }
                return room;
            });
        });
    }, []);

    // Mark chat as read
    const markChatAsRead = useCallback((chatRoomId) => {
        setChatRooms(prev => {
            return prev.map(room => {
                if (room.id === chatRoomId) {
                    return { ...room, unreadCount: 0 };
                }
                return room;
            });
        });
    }, []);

    // Force refresh function that bypasses cache
    const forceRefreshChatRooms = useCallback(() => {
        console.log('🔄 Force refreshing chat rooms from API (bypassing cache)');
        refetchChatRooms();
    }, [refetchChatRooms]);

    // Register functions with context
    useEffect(() => {
        console.log('📝 Registering refetchChatRooms function with context');
        setRefetchChatRooms(refetchChatRooms);
    }, [setRefetchChatRooms, refetchChatRooms]);

    useEffect(() => {
        console.log('📝 Registering handleChatListUpdate function with context');
        setHandleChatListUpdate(handleChatListUpdate);
    }, [setHandleChatListUpdate, handleChatListUpdate]);

    useEffect(() => {
        console.log('📝 Registering forceRefreshChatRooms function with context');
        setForceRefreshChatRooms(forceRefreshChatRooms);
    }, [setForceRefreshChatRooms, forceRefreshChatRooms]);

    // Connect to WebSocket on mount
    useEffect(() => {
        connectWebSocket();
    }, [connectWebSocket]);

    return {
        // State
        chatRooms,
        isLoadingChatRooms,
        chatRoomsError,
        isConnected,
        
        // Actions
        refetchChatRooms,
        forceRefreshChatRooms,
        addChatRoom,
        updateChatRoom,
        markChatAsRead,
        connectWebSocket,
        handleChatListUpdate, // Export this function
    };
};
