import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import Cookies from 'js-cookie';

class WebSocketService {
    constructor() {
        this.client = null;
        this.isConnected = false;
        this.messageHandlers = new Map();
        this.connectionPromise = null;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.reconnectDelay = 1000; // Start with 1 second
    }

    connect() {
        if (this.connectionPromise) {
            return this.connectionPromise;
        }

        this.connectionPromise = new Promise((resolve, reject) => {
            const token = Cookies.get('token');
            if (!token) {
                reject(new Error('No authentication token found'));
                return;
            }

            const socket = new SockJS(process.env.NEXT_PUBLIC_WS_URL || 'https://xoxo.id.vn/ws');
            
            this.client = new Client({
                webSocketFactory: () => socket,
                connectHeaders: {
                    Authorization: `Bearer ${token}`,
                },
                debug: (str) => {
                    console.log('STOMP Debug:', str);
                },
                reconnectDelay: this.reconnectDelay,
                heartbeatIncoming: 4000,
                heartbeatOutgoing: 4000,
                onConnect: (frame) => {
                    console.log('Connected to WebSocket:', frame);
                    this.isConnected = true;
                    this.reconnectAttempts = 0;
                    this.reconnectDelay = 1000; // Reset delay
                    resolve(this.client);
                },
                onStompError: (frame) => {
                    console.error('STOMP error:', frame);
                    this.isConnected = false;
                    reject(new Error(`STOMP error: ${frame.headers['message']}`));
                },
                onWebSocketError: (error) => {
                    console.error('WebSocket error:', error);
                    this.isConnected = false;
                    reject(error);
                },
                onDisconnect: () => {
                    console.log('Disconnected from WebSocket');
                    this.isConnected = false;
                    this.attemptReconnect();
                },
            });

            this.client.activate();
        });

        return this.connectionPromise;
    }

    attemptReconnect() {
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            console.error('Max reconnection attempts reached');
            return;
        }

        this.reconnectAttempts++;
        this.reconnectDelay = Math.min(this.reconnectDelay * 2, 30000); // Max 30 seconds

        console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts}) in ${this.reconnectDelay}ms`);

        setTimeout(() => {
            this.connectionPromise = null;
            this.connect().catch(error => {
                console.error('Reconnection failed:', error);
            });
        }, this.reconnectDelay);
    }

    async disconnect() {
        if (this.client && this.isConnected) {
            this.client.deactivate();
            this.isConnected = false;
            this.connectionPromise = null;
        }
    }

    async sendMessage(chatRoomId, content, type = 'TEXT', mediaUrl = null, mediaType = null, replyToMessageId = null) {
        if (!this.isConnected) {
            await this.connect();
        }

        const message = {
            chatRoomId,
            content,
            type,
            mediaUrl,
            mediaType,
            replyToMessageId,
        };

        this.client.publish({
            destination: '/app/send-message',
            body: JSON.stringify(message),
        });
    }

    async sendPrivateMessage(chatRoomId, content, type = 'TEXT', mediaUrl = null, mediaType = null, replyToMessageId = null) {
        if (!this.isConnected) {
            await this.connect();
        }

        const message = {
            chatRoomId,
            content,
            type,
            mediaUrl,
            mediaType,
            replyToMessageId,
        };

        this.client.publish({
            destination: '/app/private-message',
            body: JSON.stringify(message),
        });
    }

    async subscribeToRoom(chatRoomId, onMessage) {
        if (!this.isConnected) {
            await this.connect();
        }

        const subscription = this.client.subscribe(`/topic/room/${chatRoomId}`, (message) => {
            try {
                const parsedMessage = JSON.parse(message.body);
                onMessage(parsedMessage);
            } catch (error) {
                console.error('Error parsing message:', error);
            }
        });

        // Store the handler for cleanup
        this.messageHandlers.set(chatRoomId, subscription);
        return subscription;
    }

    async subscribeToPrivateMessages(userId, onMessage) {
        if (!this.isConnected) {
            await this.connect();
        }

        const subscription = this.client.subscribe(`/user/queue/private-message`, (message) => {
            try {
                const parsedMessage = JSON.parse(message.body);
                onMessage(parsedMessage);
            } catch (error) {
                console.error('Error parsing private message:', error);
            }
        });

        return subscription;
    }

    unsubscribeFromRoom(chatRoomId) {
        const subscription = this.messageHandlers.get(chatRoomId);
        if (subscription) {
            subscription.unsubscribe();
            this.messageHandlers.delete(chatRoomId);
        }
    }

    unsubscribeAll() {
        this.messageHandlers.forEach(subscription => {
            subscription.unsubscribe();
        });
        this.messageHandlers.clear();
    }

    isConnectedToWebSocket() {
        return this.isConnected;
    }
}

// Create a singleton instance
const websocketService = new WebSocketService();

export default websocketService;
