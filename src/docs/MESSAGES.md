# 💬 Messages Help

The Messages part lets you chat with friends in real time. You can send text, photos, videos, audios and other files.

## 📋 What's Here

- [What is This](#what-is-this)
- [How It Works](#how-it-works)
- [Parts You See](#parts-you-see)
- [What You Can Do](#what-you-can-do)
- [Types of Messages](#types-of-messages)
- [How to Connect](#how-to-connect)

## 🎯 What is This

The Messages system lets you:
- Chat with friends right away
- Talk in groups
- Send photos and videos
- React to messages with emojis
- See when friends are online

## 🏗 How It Works

### Main Parts

```
Messages
├── Messages Page (main chat page)
├── Chat List (list of your chats)
├── Chat Window (where you type and see messages)
├── Chat Info (info about the chat)
└── Online Friends (who is online now)
```

## 🧩 Parts You See

### 1. **Messages Page**
The main page where you see all your chats.

```javascript
What it does:
- Shows three parts: chat list, messages, chat info
- Works on tablets and computers
- Lets you pick which chat to open
- Shows who is online
```

### 2. **Chat List**
Left side showing all your conversations.

```javascript
What it does:
- Shows all your chats
- Search for chats
- Shows new message alerts
- Start new chats
- Delete old chats
```

### 3. **Chat Window**
Where you see and send messages.

```javascript
What it does:
- Shows old messages
- Gets new messages right away
- Type and send messages
- Send photos, videos, audios and other files
- Shows when someone is typing
- Shows if message was read
```

## ✨ What You Can Do

### 💬 Basic Chatting
- **Send Messages**: Type and send messages right away
- **See Old Messages**: Look at messages from before
- **Typing Alert**: See when friends are typing
- **Read Alerts**: See if friends read your message
- **Search Messages**: Find old messages

### 📎 Share Files
- **Send Photos**: Upload and see photos
- **Send Videos**: Share video files
- **Send Files**: Share different types of files
- **Drag and Drop**: Easy way to add files
- **Photo Gallery**: See all photos shared in chat

### 😊 Fun Things
- **Emoji Reactions**: React to messages with emojis
- **Reply to Messages**: Answer specific messages
- **Forward Messages**: Share messages with other friends
- **Edit Messages**: Change messages you sent (for a short time)
- **Delete Messages**: Remove messages

### 🔒 Privacy and Safety
- **Private Messages**: Keep messages safe
- **Privacy Controls**: Choose who can message you
- **Block People**: Stop unwanted messages
- **Report**: Report bad messages

## 🔄 Live Chatting

### How Messages Work
```javascript
// Connect to chat server
const socket = new WebSocket('ws://localhost:3001/chat')

socket.onmessage = (event) => {
  const message = JSON.parse(event.data)
  showNewMessage(message)
}

// Send message
const sendMessage = (chatId, message, type = 'text') => {
  socket.send(JSON.stringify({
    type: 'message',
    chatId: chatId,
    content: message,
    messageType: type,
    time: Date.now()
  }))
}
```

### Message Status
```javascript
const MESSAGE_STATUS = {
  SENDING: 'sending',     // Sending now
  SENT: 'sent',          // Sent to server
  DELIVERED: 'delivered', // Got to friend
  READ: 'read',          // Friend saw it
  FAILED: 'failed'       // Didn't work
}
```

## 📝 Types of Messages

### Text Messages
```javascript
{
  id: 'msg_123',
  type: 'text',
  content: 'Hello, how are you?',
  sender: 'user_456',
  time: 1640995200000,
  status: 'read'
}
```

### Photo Messages
```javascript
{
  id: 'msg_124',
  type: 'image',
  content: {
    url: '/uploads/image.jpg',
    small: '/uploads/image_small.jpg',
    caption: 'Look at this photo!'
  },
  sender: 'user_456',
  time: 1640995260000,
  status: 'delivered'
}
```

### System Messages
```javascript
{
  id: 'msg_125',
  type: 'system',
  content: 'User joined the chat',
  time: 1640995300000,
  system: true
}
```

## 📱 Different Screen Sizes

### Computer Screen (big) and Tablet Screen (medium)
```
┌─────────────┬──────────────────┬─────────────┐
│  Chat List  │    Messages      │  Chat Info  │
│             │                  │             │
│ - Chats     │ - Messages       │ - Profile   │
│ - Search    │ - Type Here      │ - Photos    │
│ - Online    │ - Typing...      │ - Settings  │
└─────────────┴──────────────────┴─────────────┘
```

## 🔧 How to Connect

### Get Your Chats
```javascript
GET /api/messages/conversations
Response: {
  conversations: [
    {
      id: 'chat_123',
      people: ['user_456', 'user_789'],
      lastMessage: {
        content: 'Hello!',
        time: 1640995200000,
        sender: 'user_456'
      },
      newMessages: 2
    }
  ]
}
```

### Send Message
```javascript
POST /api/messages/send
Body: {
  chatId: 'chat_123',
  content: 'Hello, world!',
  type: 'text'
}
Response: {
  message: {
    id: 'msg_456',
    content: 'Hello, world!',
    sender: 'user_123',
    time: 1640995200000,
    status: 'sent'
  }
}
```

### Upload Files
```javascript
POST /api/messages/upload
Body: File data
Response: {
  url: '/uploads/file.jpg',
  small: '/uploads/file_small.jpg',
  type: 'image',
  size: 1024000
}
```

## 🎯 Good Ways to Do Things

### Make It Fast
- Don't load all messages at once
- Load photos when you need them
- Remember chats you use often
- Show typing alerts quickly

### Make It Easy
- Show when messages are being sent
- Show if messages were read
- Let people chat when internet is slow
- Scroll to new messages automatically

### Keep It Safe
- Check all messages before sending
- Don't let people send too many messages too fast
- Check uploaded files are safe
- Use secure connections

## 🐛 Fix Problems

### Common Problems

1. **Messages don't send**
   - Check internet connection
   - Make sure you're logged in
   - Try sending again

2. **Photos don't load**
   - Check if photo is too big
   - Make sure you can upload files
   - Check internet connection

3. **Live chat doesn't work**
   - Check internet connection
   - Make sure server is working
   - Check firewall settings

---

*Last updated: March 8, 2025*
*For more help, see the [main README](../../README.md) or other help files.*
