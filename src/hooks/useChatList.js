import { useState, useEffect, useCallback } from 'react';
import { useGetChatRoomsQuery } from '@/features/chatApi';
import websocketService from '@/services/websocketService';
import Cookies from 'js-cookie';

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
        console.log('Chat rooms API response:', chatRoomsData);
        if (chatRoomsData?.content) {
            console.log('Chat rooms loaded from API:', chatRoomsData.content);
            setChatRooms(chatRoomsData.content);
        } else if (chatRoomsData) {
            console.log('Chat rooms data structure:', chatRoomsData);
            // Try different possible data structures
            if (Array.isArray(chatRoomsData)) {
                console.log('Chat rooms is array:', chatRoomsData);
                setChatRooms(chatRoomsData);
            } else if (chatRoomsData.data) {
                console.log('Chat rooms in data field:', chatRoomsData.data);
                setChatRooms(chatRoomsData.data);
            }
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

    // Get current user ID from JWT token
    const getCurrentUserId = useCallback(() => {
        try {
            const token = Cookies.get('token');
            if (!token) return null;
            
            // Decode JWT token to get user ID
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.sub || payload.userId || null;
        } catch (error) {
            console.error('Failed to decode token:', error);
            return null;
        }
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
