import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

const prepareHeaders = (headers) => {
    const token = Cookies.get("token");
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return headers;
};

const transform = (response) => response.data;

export const friendshipApi = createApi({
    reducerPath: "friendshipApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/api/friendships`,
        prepareHeaders,
        credentials: "include",
    }),
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

        /* -------------------- MUTATION -------------------- */
        sendRequest: builder.mutation({
            query: (data) => ({
                url: "",
                method: "POST",
                body: data, // { receiverId }
            }),
            invalidatesTags: ["Friendship"],
        }),
        rejectRequest: builder.mutation({
            query: (data) => ({
                url: "/reject",
                method: "POST",
                body: data, // { requestId }
            }),
            invalidatesTags: ["Friendship"],
        }),
        acceptRequest: builder.mutation({
            query: (data) => ({
                url: "/accept",
                method: "POST",
                body: data, // { requestId }
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

    useSendRequestMutation,
    useRejectRequestMutation,
    useAcceptRequestMutation,
} = friendshipApi;
