import { createApi } from "@reduxjs/toolkit/query/react";
import { createBaseQueryWithReauth } from "./auth/baseQueryWithReauth ";


const transform = (response) => response.data;

export const friendshipApi = createApi({
    reducerPath: "friendshipApi",
    baseQuery: createBaseQueryWithReauth(`${process.env.NEXT_PUBLIC_API_URL}/api/friendships`),
    tagTypes: ["Friendship"],

    endpoints: (builder) => ({
        /* -------------------- GET -------------------- */
        getSuggestions: builder.query({
            query: () => "/suggestions",
            transformResponse: transform,
            providesTags: ["Friendship"],
        }),
        getSentPending: builder.query({
            query: () => "/sent/pending",
            transformResponse: transform,
            providesTags: ["Friendship"],
        }),
        getReceivedPending: builder.query({
            query: () => "/received/pending",
            transformResponse: transform,
            providesTags: ["Friendship"],
        }),
        getFriends: builder.query({
            query: () => "/friends",
            transformResponse: transform,
            providesTags: ["Friendship"],
        }),
        getFriendsByIduser: builder.query({
            query: (userId) => `/friends/${userId}`,
            transformResponse: transform,
            providesTags: ["Friendship"],
        }),

        /* -------------------- MUTATION -------------------- */
        sendRequest: builder.mutation({
            query: (friendId) => ({
                url: "",
                method: "POST",
                body: { friendId: friendId },
            }),
        }),
        rejectRequest: builder.mutation({
            query: (friendshipId) => ({
                url: `/reject?friendshipId=${friendshipId}`,
                method: "POST",
            }),
            invalidatesTags: ["Friendship"],
        }),

        acceptRequest: builder.mutation({
            query: (friendshipId) => ({
                url: `/accept?friendshipId=${friendshipId}`,
                method: "POST",
            }),
            invalidatesTags: ["Friendship"],
        }),

    }),
});

export const {
    useGetSuggestionsQuery,
    useGetSentPendingQuery,
    useGetReceivedPendingQuery,
    useGetFriendsQuery,
    useGetFriendsByIduserQuery,

    useSendRequestMutation,
    useRejectRequestMutation,
    useAcceptRequestMutation,
} = friendshipApi;
