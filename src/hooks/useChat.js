import { useState, useEffect, useCallback, useRef } from 'react';
import { useGetOrCreateDirectChatMutation, useGetChatMessagesQuery } from '@/features/chatApi';
import websocketService from '@/services/websocketService';
import { useChatContext } from '@/contexts/ChatContext';

export const useChat = (otherUserId = null, existingChatRoom = null) => {
    const [currentChatRoom, setCurrentChatRoom] = useState(existingChatRoom);
    const [messages, setMessages] = useState([]);
    const [isConnected, setIsConnected] = useState(false);
    const [typingUsers, setTypingUsers] = useState([]);
    const [isSendingMessage, setIsSendingMessage] = useState(false);
    const subscriptionRef = useRef(null);
    const { refetchChatRooms, handleChatListUpdate, forceRefreshChatRooms } = useChatContext();

    const [getOrCreateDirectChat, { isLoading: isCreatingChat }] = useGetOrCreateDirectChatMutation();
    
    
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
        if (!userId) {
            console.warn('No userId provided to initializeChat');
            return null;
        }
        
        try {
            console.log('Creating chat room for user:', userId);
            const result = await getOrCreateDirectChat(userId).unwrap();
            console.log('Chat room created successfully:', result);
            
            // Handle different response structures
            const chatRoom = result.data || result;
            
            if (chatRoom && chatRoom.id) {
                setCurrentChatRoom(chatRoom);
                return chatRoom;
            } else {
                console.error('Invalid chat room response:', result);
                return null;
            }
        } catch (error) {
            console.error('Failed to create/get chat room:', error);
            console.error('Error status:', error?.status);
            console.error('Error data:', error?.data);
            console.error('Error message:', error?.message);
            console.error('Error type:', typeof error);
            console.error('Error keys:', Object.keys(error || {}));
            
            // Try to extract meaningful error info
            let errorMessage = 'Unknown error';
            if (error?.data?.message) {
                errorMessage = error.data.message;
            } else if (error?.message) {
                errorMessage = error.message;
            } else if (error?.status) {
                errorMessage = `HTTP ${error.status}`;
            }
            
            console.error('Processed error message:', errorMessage);
            
            // Set a default error state
            setCurrentChatRoom(null);
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
                console.log('Received real-time message:', message);
                
                setMessages(prev => {
                    // Avoid duplicates by checking both id and content+timestamp
                    const isDuplicate = prev.some(msg => 
                        msg.id === message.id || 
                        (msg.content === message.content && 
                         Math.abs(new Date(msg.sentAt || msg.createdAt) - new Date(message.sentAt || message.createdAt)) < 1000)
                    );
                    
                    if (isDuplicate) {
                        console.log('Duplicate message detected, skipping');
                        return prev;
                    }
                    
                    console.log('Adding new real-time message to chat');
                    return [...prev, message];
                });
            });

            subscriptionRef.current = subscription;
            console.log('Successfully subscribed to room:', chatRoomId);
        } catch (error) {
            console.error('Failed to subscribe to room:', error);
        }
    }, []);

    // Send a message
    const handleSendMessage = useCallback(async (content, type = 'TEXT', mediaUrl = null, mediaType = null, replyToMessageId = null) => {
        if (!currentChatRoom?.id || !content.trim() || isSendingMessage) return;

        try {
            setIsSendingMessage(true);
            console.log('Sending message via WebSocket:', { chatRoomId: currentChatRoom.id, content, type });
            
            // Send via WebSocket
            await websocketService.sendMessage(
                currentChatRoom.id,
                content,
                type,
                mediaUrl,
                mediaType,
                replyToMessageId
            );

            // No REST send; backend handles persistence via Kafka from WebSocket

            console.log('Message sent via WebSocket (Kafka → Consumer → DB)');
            
            // Simulate WebSocket message to trigger sidebar update
            const now = new Date().toISOString();
            const mockMessage = {
                id: Date.now(), // Temporary ID
                chatRoomId: currentChatRoom.id,
                content: content,
                senderId: currentChatRoom.currentUserId,
                sentAt: now,
                type: type,
                mediaUrl: mediaUrl,
                mediaType: mediaType,
                replyToMessageId: replyToMessageId,
            };
            
            // Trigger the chat list update immediately
            console.log('🔄 Triggering manual chat list update with mock message:', mockMessage);
            if (handleChatListUpdate) {
                console.log('✅ Calling handleChatListUpdate from context (immediate)');
                handleChatListUpdate(mockMessage);
            } else {
                console.warn('⚠️ handleChatListUpdate not available in context');
            }
            
            // Force refetch from API to get latest data from server
            setTimeout(() => {
                if (forceRefreshChatRooms) {
                    console.log('🔄 Force refetching from API after sending message');
                    forceRefreshChatRooms();
                }
            }, 200); // Reduced delay to 200ms
            
            // Update chat room locally immediately
            if (currentChatRoom?.id) {
                const now = new Date().toISOString();
                console.log('🔄 Updating chat room locally with new message:', content);
                
                // Force a re-render by updating the chat room state
                setCurrentChatRoom(prev => ({
                    ...prev,
                    lastMessage: {
                        content: content,
                        sentAt: now,
                        senderId: currentChatRoom.currentUserId,
                    },
                    lastMessageAt: now,
                }));
            }
            
            // Refetch chat rooms list to update last message and timestamp
            if (refetchChatRooms) {
                console.log('🔄 Refetching chat rooms list after sending message');
                // Call immediately without delay
                refetchChatRooms();
            } else {
                console.warn('⚠️ refetchChatRooms function not available');
            }
            
            // Force refresh from API to get latest data from server
            setTimeout(() => {
                if (forceRefreshChatRooms) {
                    console.log('🔄 Force refetching from API after sending message');
                    forceRefreshChatRooms();
                }
            }, 100); // Short delay to ensure API has processed

        } catch (error) {
            console.error('Failed to send message:', error);
            throw error;
        } finally {
            setIsSendingMessage(false);
        }
    }, [currentChatRoom?.id, isSendingMessage, refetchChatRooms, handleChatListUpdate, forceRefreshChatRooms]);

    // Load messages when chat room changes
    useEffect(() => {
        if (messagesData?.content) {
            setMessages([...messagesData.content].reverse()); // Create copy before reversing to show latest at bottom
        }
    }, [messagesData]);

    // Initialize chat when otherUserId is provided or use existing chat room
    useEffect(() => {
        if (existingChatRoom) {
            console.log('useChat - Using existing chat room:', existingChatRoom);
            setCurrentChatRoom(existingChatRoom);
        } else if (otherUserId) {
            console.log('useChat - Initializing chat with user ID:', otherUserId);
            initializeChat(otherUserId);
        }
    }, [otherUserId, existingChatRoom, initializeChat]);

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
