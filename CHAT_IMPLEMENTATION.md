# Chat Implementation Documentation

This document explains the implementation of real-time chat functionality using the backend API `/api/v1/chat/direct/` endpoint.

## Overview

The chat system integrates with the existing XoXo backend to provide:
- Direct messaging between users
- Real-time message delivery via WebSocket
- Message persistence and history
- Online status and typing indicators
- File sharing capabilities

## Architecture

### Backend Integration
- **API Endpoint**: `POST /api/v1/chat/direct/{otherUserId}`
- **Authentication**: Bearer token via cookies
- **WebSocket**: STOMP over SockJS for real-time messaging
- **Base URL**: `https://xoxo.id.vn`

### Frontend Components

#### 1. API Layer (`src/features/chatApi.js`)
RTK Query API for chat operations:
- `getOrCreateDirectChat` - Create/get direct chat room
- `getChatRooms` - Fetch user's chat rooms
- `getChatMessages` - Get messages for a chat room
- `sendMessage` - Send a new message
- `markMessageAsRead/Delivered` - Update message status

#### 2. WebSocket Service (`src/services/websocketService.js`)
Manages real-time connections:
- STOMP client over SockJS
- Auto-reconnection with exponential backoff
- Room subscriptions for real-time messages
- Private message handling

#### 3. Chat Hook (`src/hooks/useChat.js`)
Custom React hook providing:
- Chat room initialization
- Message state management
- WebSocket connection handling
- Send message functionality

#### 4. UI Components

**EnhancedMessagesChat** (`src/components/main/Messages/EnhancedMessagesChat.jsx`)
- Real-time message display
- Message input with file upload
- Typing indicators and online status
- Message grouping and timestamps

**EnhancedMessagesSidebar** (`src/components/main/Messages/EnhancedMessagesSidebar.jsx`)
- Chat rooms list with search
- Unread message counts
- Online status indicators

**EnhancedMessagesPage** (`src/pages/MessagesPage/EnhancedMessagesPage.jsx`)
- Main chat interface
- URL-based chat navigation
- Mobile responsive layout

## Usage Examples

### 1. Start Direct Chat with User ID

```jsx
import { useRouter } from "next/navigation";
import { createDirectChatUrl } from "@/utils/chatUtils";

const router = useRouter();
const userId = 123;

// Navigate to messages page with userId - chat will be created automatically
router.push(createDirectChatUrl(userId));
```

### 2. Using the StartChatButton Component

```jsx
import StartChatButton from "@/components/common/StartChatButton";

// Default button
<StartChatButton userId={123} userName="John Doe" />

// Icon only
<StartChatButton userId={123} variant="icon" />

// Text only
<StartChatButton userId={123} variant="text" userName="John" />
```

### 3. Using the Chat Hook

```jsx
import { useChat } from "@/hooks/useChat";

function ChatComponent({ otherUserId }) {
  const {
    currentChatRoom,
    messages,
    isConnected,
    handleSendMessage,
    isLoadingMessages
  } = useChat(otherUserId);

  const sendMessage = () => {
    handleSendMessage("Hello!");
  };

  return (
    <div>
      <div>Status: {isConnected ? 'Connected' : 'Disconnected'}</div>
      {messages.map(msg => (
        <div key={msg.id}>{msg.content}</div>
      ))}
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}
```

## API Endpoints Used

### 1. Create/Get Direct Chat
```bash
curl -X 'POST' \
  'https://xoxo.id.vn/api/v1/chat/direct/100' \
  -H 'accept: */*' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

**Response:**
```json
{
  "data": {
    "id": 1,
    "name": "John Doe",
    "type": "DIRECT",
    "participants": [...],
    "lastMessageAt": "2024-01-01T10:00:00Z",
    "unreadCount": 0
  }
}
```

### 2. Get Chat Rooms
```bash
curl -X 'GET' \
  'https://xoxo.id.vn/api/v1/chat/rooms?page=0&size=20' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### 3. Send Message
```bash
curl -X 'POST' \
  'https://xoxo.id.vn/api/v1/chat/messages' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -d '{
    "chatRoomId": 1,
    "content": "Hello!",
    "type": "TEXT"
  }'
```

## WebSocket Integration

### Connection
```javascript
// WebSocket URL
const wsUrl = "https://xoxo.id.vn/ws";

// Subscribe to room messages
client.subscribe(`/topic/room/${chatRoomId}`, (message) => {
  const parsedMessage = JSON.parse(message.body);
  // Handle incoming message
});

// Send message
client.publish({
  destination: '/app/send-message',
  body: JSON.stringify({
    chatRoomId: 1,
    content: "Hello!",
    type: "TEXT"
  })
});
```

## Environment Variables

Add to your `.env.local`:

```bash
NEXT_PUBLIC_API_URL=https://xoxo.id.vn
NEXT_PUBLIC_WS_URL=https://xoxo.id.vn/ws
```

## Integration with Existing App

### 1. Update Redux Store
The chat API is already integrated with the Redux store in `src/store/store.js`.

### 2. Add to User Profiles
Use the `StartChatButton` component in user profiles:

```jsx
import StartChatButton from "@/components/common/StartChatButton";

function UserProfile({ user }) {
  return (
    <div>
      <h1>{user.name}</h1>
      <StartChatButton userId={user.id} userName={user.name} />
    </div>
  );
}
```

### 3. Navigation
Direct chat URLs follow the pattern:
- `/messages?userId=123` - Create/open chat with user 123
- `/messages?contact=456` - Open existing chat room 456

## Features Implemented

✅ **Core Messaging**
- Direct chat creation
- Real-time message sending/receiving
- Message history loading
- Message status (sent/delivered/read)

✅ **UI/UX**
- Responsive design
- Message grouping
- Typing indicators
- Online status
- File upload interface

✅ **WebSocket**
- Auto-reconnection
- Room subscriptions
- Private messaging
- Connection status

## Future Enhancements

🔄 **Planned Features**
- File upload implementation
- Emoji reactions
- Message editing/deletion
- Group chat support
- Push notifications
- Message search
- Voice/video calling integration

## Troubleshooting

### Common Issues

1. **WebSocket Connection Failed**
   - Check if backend WebSocket endpoint is accessible
   - Verify authentication token is valid
   - Check CORS settings

2. **Messages Not Loading**
   - Verify API endpoints are correct
   - Check authentication headers
   - Review network requests in dev tools

3. **Real-time Messages Not Received**
   - Check WebSocket connection status
   - Verify room subscription
   - Check if user has proper permissions

### Debug Mode

Enable WebSocket debugging:
```javascript
// In websocketService.js
debug: (str) => {
    console.log('STOMP Debug:', str);
}
```

## Testing

### Manual Testing Steps

1. **Direct Chat Creation**
   - Navigate to `/messages?userId=123`
   - Verify chat room is created
   - Check if other user appears in chat list

2. **Message Sending**
   - Send a text message
   - Verify it appears in chat
   - Check WebSocket traffic in network tab

3. **Real-time Messaging**
   - Open same chat in two browser tabs
   - Send message from one tab
   - Verify it appears in other tab immediately

### API Testing with cURL

Test the direct chat endpoint:
```bash
curl -X 'POST' \
  'https://xoxo.id.vn/api/v1/chat/direct/100' \
  -H 'accept: */*' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -d ''
```

Replace `YOUR_TOKEN` with a valid JWT token from your application.
