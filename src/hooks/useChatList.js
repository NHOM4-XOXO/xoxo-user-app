import { useState, useEffect, useCallback } from 'react';
import { useGetChatRoomsQuery } from '@/features/chatApi';
import websocketService from '@/services/websocketService';

export const useChatList = () => {
    const [chatRooms, setChatRooms] = useState([]);
    const [isConnected, setIsConnected] = useState(false);

    // Fetch chat rooms from API
    const {
        data: chatRoomsData,
        isLoading: isLoadingChatRooms,
        error: chatRoomsError,
        refetch: refetchChatRooms,
    } = useGetChatRoomsQuery({ page: 0, size: 50 });

    // Update local chat rooms when API data changes
    useEffect(() => {
        if (chatRoomsData?.content) {
            console.log('Chat rooms loaded from API:', chatRoomsData.content);
            setChatRooms(chatRoomsData.content);
        }
    }, [chatRoomsData]);

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
    }, []);

    // Handle real-time chat list updates
    const handleChatListUpdate = useCallback((message) => {
        setChatRooms(prev => {
            return prev.map(room => {
                if (room.id === message.chatRoomId) {
                    // Update last message info
                    return {
                        ...room,
                        lastMessage: {
                            content: message.content,
                            sentAt: message.sentAt || new Date().toISOString(),
                            senderId: message.senderId,
                        },
                        lastMessageAt: message.sentAt || new Date().toISOString(),
                        unreadCount: message.senderId !== getCurrentUserId() ? 
                            (room.unreadCount || 0) + 1 : room.unreadCount,
                    };
                }
                return room;
            });
        });
    }, []);

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
        setChatRooms(prev => {
            return prev.map(room => {
                if (room.id === chatRoomId) {
                    return { ...room, ...updates };
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

    // Get current user ID (you might need to adjust this based on your auth system)
    const getCurrentUserId = useCallback(() => {
        // This should return the current user's ID
        // You might get this from auth context or localStorage
        return localStorage.getItem('currentUserId') || null;
    }, []);

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
        addChatRoom,
        updateChatRoom,
        markChatAsRead,
        connectWebSocket,
    };
};
