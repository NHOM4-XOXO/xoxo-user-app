import { useState, useEffect, useCallback, useRef } from 'react';
import { useGetOrCreateDirectChatMutation, useGetChatMessagesQuery, useSendMessageMutation } from '@/features/chatApi';
import websocketService from '@/services/websocketService';

export const useChat = (otherUserId = null) => {
    const [currentChatRoom, setCurrentChatRoom] = useState(null);
    const [messages, setMessages] = useState([]);
    const [isConnected, setIsConnected] = useState(false);
    const [typingUsers, setTypingUsers] = useState([]);
    const subscriptionRef = useRef(null);

    const [getOrCreateDirectChat, { isLoading: isCreatingChat }] = useGetOrCreateDirectChatMutation();
    const [sendMessage, { isLoading: isSendingMessage }] = useSendMessageMutation();
    
    const {
        data: messagesData,
        isLoading: isLoadingMessages,
        refetch: refetchMessages
    } = useGetChatMessagesQuery(
        { 
            chatRoomId: currentChatRoom?.id,
            page: 0,
            size: 50 
        },
        { 
            skip: !currentChatRoom?.id,
            refetchOnMountOrArgChange: true
        }
    );

    // Initialize chat room
    const initializeChat = useCallback(async (userId) => {
        try {
            console.log('Creating chat room for user:', userId);
            const result = await getOrCreateDirectChat(userId).unwrap();
            console.log('Chat room created:', result);
            setCurrentChatRoom(result);
            return result;
        } catch (error) {
            console.error('Failed to create/get chat room:', error);
            console.error('Error details:', error.data || error.message);
            // Don't throw error, just log it and continue
            return null;
        }
    }, [getOrCreateDirectChat]);

    // Connect to WebSocket
    const connectWebSocket = useCallback(async () => {
        try {
            await websocketService.connect();
            setIsConnected(true);
        } catch (error) {
            console.error('Failed to connect to WebSocket:', error);
            setIsConnected(false);
        }
    }, []);

    // Subscribe to room messages
    const subscribeToRoom = useCallback(async (chatRoomId) => {
        if (!chatRoomId) return;

        try {
            // Unsubscribe from previous room if exists
            if (subscriptionRef.current) {
                subscriptionRef.current.unsubscribe();
            }

            const subscription = await websocketService.subscribeToRoom(chatRoomId, (message) => {
                setMessages(prev => {
                    // Avoid duplicates
                    if (prev.some(msg => msg.id === message.id)) {
                        return prev;
                    }
                    return [...prev, message];
                });
            });

            subscriptionRef.current = subscription;
        } catch (error) {
            console.error('Failed to subscribe to room:', error);
        }
    }, []);

    // Send a message
    const handleSendMessage = useCallback(async (content, type = 'TEXT', mediaUrl = null, mediaType = null, replyToMessageId = null) => {
        if (!currentChatRoom?.id || !content.trim()) return;

        try {
            // Send via WebSocket for real-time
            await websocketService.sendMessage(
                currentChatRoom.id,
                content,
                type,
                mediaUrl,
                mediaType,
                replyToMessageId
            );

            // Also send via REST API for persistence
            await sendMessage({
                chatRoomId: currentChatRoom.id,
                content,
                type,
                mediaUrl,
                mediaType,
                replyToMessageId,
            }).unwrap();

        } catch (error) {
            console.error('Failed to send message:', error);
            throw error;
        }
    }, [currentChatRoom?.id, sendMessage]);

    // Load messages when chat room changes
    useEffect(() => {
        if (messagesData?.content) {
            setMessages([...messagesData.content].reverse()); // Create copy before reversing to show latest at bottom
        }
    }, [messagesData]);

    // Initialize chat when otherUserId is provided
    useEffect(() => {
        if (otherUserId) {
            initializeChat(otherUserId);
        }
    }, [otherUserId, initializeChat]);

    // Connect to WebSocket on mount
    useEffect(() => {
        connectWebSocket();

        return () => {
            if (subscriptionRef.current) {
                subscriptionRef.current.unsubscribe();
            }
        };
    }, [connectWebSocket]);

    // Subscribe to room when chat room is available
    useEffect(() => {
        if (currentChatRoom?.id && isConnected) {
            subscribeToRoom(currentChatRoom.id);
        }

        return () => {
            if (subscriptionRef.current) {
                subscriptionRef.current.unsubscribe();
            }
        };
    }, [currentChatRoom?.id, isConnected, subscribeToRoom]);

    return {
        // State
        currentChatRoom,
        messages,
        isConnected,
        typingUsers,
        
        // Loading states
        isCreatingChat,
        isSendingMessage,
        isLoadingMessages,
        
        // Actions
        initializeChat,
        handleSendMessage,
        refetchMessages,
        
        // WebSocket actions
        connectWebSocket,
        subscribeToRoom,
    };
};
