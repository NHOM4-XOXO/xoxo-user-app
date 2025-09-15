/**
 * Utility functions for chat functionality
 */

/**
 * Creates a URL for direct chat with a user
 * @param {number|string} userId - The ID of the user to chat with
 * @returns {string} - The URL for the messages page with userId parameter
 */
export const createDirectChatUrl = (userId) => {
    return `/messages?userId=${userId}`;
};

/**
 * Opens a direct chat with a user by navigating to the messages page
 * @param {number|string} userId - The ID of the user to chat with
 * @param {object} router - Next.js router instance
 */
export const openDirectChat = (userId, router) => {
    const url = createDirectChatUrl(userId);
    router.push(url);
};

/**
 * Formats a timestamp for message display
 * @param {string|number|Date} timestamp - The timestamp to format
 * @returns {string} - Formatted time string
 */
export const formatMessageTime = (timestamp) => {
    if (!timestamp) return "";
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMs = now - date;
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 1) {
        return "Vừa xong";
    } else if (diffInMinutes < 60) {
        return `${diffInMinutes} phút trước`;
    } else if (diffInHours < 24) {
        return `${diffInHours} giờ trước`;
    } else if (diffInDays === 1) {
        return "Hôm qua";
    } else if (diffInDays < 7) {
        return `${diffInDays} ngày trước`;
    } else {
        return date.toLocaleDateString('vi-VN');
    }
};

/**
 * Formats a message timestamp for display in chat
 * @param {string|number|Date} timestamp - The timestamp to format
 * @returns {string} - Formatted time string (HH:MM)
 */
export const formatChatMessageTime = (timestamp) => {
    if (!timestamp) return "";
    
    const date = new Date(timestamp);
    return date.toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
};

/**
 * Checks if two messages should be grouped together
 * @param {object} currentMessage - The current message
 * @param {object} previousMessage - The previous message
 * @param {number} maxGroupTimeMs - Maximum time difference for grouping (default: 5 minutes)
 * @returns {boolean} - Whether messages should be grouped
 */
export const shouldGroupMessages = (currentMessage, previousMessage, maxGroupTimeMs = 5 * 60 * 1000) => {
    if (!currentMessage || !previousMessage) return false;
    
    // Same sender
    if (currentMessage.senderId !== previousMessage.senderId) return false;
    
    // Within time threshold
    const timeDiff = new Date(currentMessage.sentAt || currentMessage.createdAt) - 
                    new Date(previousMessage.sentAt || previousMessage.createdAt);
    
    return timeDiff <= maxGroupTimeMs;
};

/**
 * Extracts user information from chat room participants
 * @param {object} chatRoom - The chat room object
 * @param {number|string} currentUserId - The current user's ID
 * @returns {object|null} - The other participant's information
 */
export const getOtherParticipant = (chatRoom, currentUserId) => {
    if (!chatRoom?.participants) return null;
    
    return chatRoom.participants.find(participant => 
        participant.id !== currentUserId && participant.id != currentUserId
    );
};

/**
 * Generates a chat room name for direct chats
 * @param {object} otherUser - The other user object
 * @returns {string} - Generated chat room name
 */
export const generateDirectChatName = (otherUser) => {
    if (!otherUser) return "Unknown User";
    
    const firstName = otherUser.firstName || "";
    const lastName = otherUser.lastName || "";
    
    if (firstName && lastName) {
        return `${firstName} ${lastName}`;
    } else if (firstName) {
        return firstName;
    } else if (lastName) {
        return lastName;
    } else {
        return otherUser.username || otherUser.email || "Unknown User";
    }
};

