import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";
import { refreshTokenFlow, logoutFlow } from "@/features/auth/authManager";

const prepareHeaders = (headers) => {
    const token = Cookies.get("token");
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return headers;
};

// Base query for chat APIs
const rawBaseQuery = fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "https://xoxo.id.vn",
    prepareHeaders: (headers) => {
        const token = Cookies.get("token");
        if (token) {
            headers.set("Authorization", `Bearer ${token}`);
        }
        headers.set("Content-Type", "application/json");
        return headers;
    },
    credentials: "include",
});

// Local 401 auto-refresh
const baseQuery = async (args, api, extraOptions) => {
    let result = await rawBaseQuery(args, api, extraOptions);
    if (result.error && result.error.status === 401) {
        try {
            const newToken = await refreshTokenFlow();
            if (newToken) {
                result = await rawBaseQuery(args, api, extraOptions);
            } else {
                logoutFlow();
            }
        } catch (e) {
            logoutFlow();
        }
    }
    return result;
};

export const chatApi = createApi({
    reducerPath: "chatApi",
    baseQuery,
    tagTypes: ["ChatRoom", "ChatMessage"],
    endpoints: (builder) => ({
        // Get or create direct chat with another user
        getOrCreateDirectChat: builder.mutation({
            query: (otherUserId) => {
               
                return {
                    url: `/api/v1/chat/direct/${otherUserId}`,
                    method: "POST",
                };
            },
            invalidatesTags: ["ChatRoom"],
            transformResponse: (response) => {
               
                // Return the data field if it exists, otherwise return the whole response
                return response.data || response;
            },
            transformErrorResponse: (response, meta, arg) => {
              
                return response;
            },
        }),

        // Get user's chat rooms
        getChatRooms: builder.query({
            query: ({ page = 0, size = 20 }) => ({
                url: `/api/v1/chat/rooms?page=${page}&size=${size}`,
                method: "GET",
                headers: {
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache'
                }
            }),
            keepUnusedDataFor: 0,
            providesTags: (result, error, arg) => [
                "ChatRoom",
                ...(result?.map(({ id }) => ({ type: "ChatRoom", id })) || [])
            ],
            transformResponse: (response) => {
                // API returns array directly, not wrapped in content
                if (Array.isArray(response.data)) {
                    return response.data;
                }
                return response.data;
            },
        }),

        // Get messages for a chat room
        getChatMessages: builder.query({
            query: ({ chatRoomId, page = 0, size = 50 }) => ({
                url: `/api/v1/chat/rooms/${chatRoomId}/messages?page=${page}&size=${size}`,
                method: "GET",
            }),
            providesTags: (result, error, { chatRoomId }) => [
                { type: "ChatMessage", id: chatRoomId },
            ],
            transformResponse: (response) => response.data,
        }),

        // Mark message as read
        markMessageAsRead: builder.mutation({
            query: (messageId) => ({
                url: `/api/v1/chat/messages/${messageId}/read`,
                method: "POST",
            }),
            invalidatesTags: (result, error, messageId) => [
                { type: "ChatMessage", id: messageId },
            ],
        }),

        // Mark message as delivered
        markMessageAsDelivered: builder.mutation({
            query: (messageId) => ({
                url: `/api/v1/chat/messages/${messageId}/delivered`,
                method: "POST",
            }),
            invalidatesTags: (result, error, messageId) => [
                { type: "ChatMessage", id: messageId },
            ],
        }),

        // Get unread message count
        getUnreadMessageCount: builder.query({
            query: (chatRoomId) => ({
                url: `/api/v1/chat/rooms/${chatRoomId}/unread-count`,
                method: "GET",
            }),
            transformResponse: (response) => response.data,
        }),

        // Delete message
        deleteMessage: builder.mutation({
            query: (messageId) => ({
                url: `/api/v1/chat/messages/${messageId}`,
                method: "DELETE",
            }),
            invalidatesTags: (result, error, messageId) => [
                { type: "ChatMessage", id: messageId },
            ],
        }),

        // Leave chat room
        leaveChatRoom: builder.mutation({
            query: (chatRoomId) => ({
                url: `/api/v1/chat/rooms/${chatRoomId}/leave`,
                method: "POST",
            }),
            invalidatesTags: ["ChatRoom"],
        }),

        // Get user info by ID (for participant names)
        getUserById: builder.query({
            query: (userId) => ({
                url: `/api/v1/chat/users/${userId}`,
                method: "GET",
            }),
            transformResponse: (response) => response.data,
            transformErrorResponse: (response) => response,
        }),

        // Get current user's profile (to reliably obtain current user ID)
        getCurrentUserProfile: builder.query({
            query: () => ({
                url: `/api/user/profile`,
                method: "GET",
            }),
            transformResponse: (response) => response.data,
        }),
    }),
});

export const {
    useGetOrCreateDirectChatMutation,
    useGetChatRoomsQuery,
    useGetChatMessagesQuery,
    useMarkMessageAsReadMutation,
    useMarkMessageAsDeliveredMutation,
    useGetUnreadMessageCountQuery,
    useDeleteMessageMutation,
    useLeaveChatRoomMutation,
    useGetUserByIdQuery,
    useGetCurrentUserProfileQuery,
} = chatApi;
