import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

// Helper
const prepareHeaders = (headers) => {
    const token = Cookies.get("token");
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return headers;
};

const transform = (response) => response.data;

export const postReactionApi = createApi({
    reducerPath: "postReactionApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/posts`,
        prepareHeaders,
        credentials: "include",
    }),
    tagTypes: ["Post", "Comment", "Like", "Share", "Media"],

    endpoints: (builder) => ({
        /* -------------------- GET -------------------- */
        getPostReactions: builder.query({
            query: (postId) => `/${postId}/reactions`,
            transformResponse: transform,
            providesTags: (r, e, id) => [{ type: "Like", id }],
        }),
        getPostReactionsByType: builder.query({
            query: ({ postId, reactionType }) => `/${postId}/reactions/type/${reactionType}`,
            transformResponse: transform,
            providesTags: (r, e, { postId }) => [{ type: "Like", id: postId }],
        }),
        getPostReactionStats: builder.query({
            query: (postId) => `/${postId}/reactions/stats`,
            transformResponse: transform,
            providesTags: (r, e, id) => [{ type: "Like", id }],
        }),
        getMyReactionOnPost: builder.query({
            query: (postId) => `/${postId}/reactions/me`,
            transformResponse: transform,
            providesTags: (r, e, id) => [{ type: "Like", id }],
        }),
        getPostReactionCount: builder.query({
            query: ({ postId, reactionType }) => `/${postId}/reactions/count/${reactionType}`,
            transformResponse: transform,
            providesTags: (r, e, { postId }) => [{ type: "Like", id: postId }],
        }),
        checkIfReacted: builder.query({
            query: (postId) => `/${postId}/reactions/check`,
            transformResponse: transform,
            providesTags: (r, e, id) => [{ type: "Like", id }],
        }),
        getTrendingReactions: builder.query({
            query: () => `/reactions/trending`,
            transformResponse: transform,
            providesTags: ["Like"],
        }),
        getMyPostsReacted: builder.query({
            query: (reactionType) => `/reactions/my-posts/${reactionType}`,
            transformResponse: transform,
            providesTags: ["Like"],
        }),
        getReactionHistory: builder.query({
            query: () => `/reactions/history`,
            transformResponse: transform,
            providesTags: ["Like"],
        }),
        getGlobalReactionStats: builder.query({
            query: () => `/reactions/global-stats`,
            transformResponse: transform,
            providesTags: ["Like"],
        }),

        /* -------------------- POST -------------------- */
        addReaction: builder.mutation({
            query: ({ postId, reactionType }) => ({
                url: `/${postId}/reactions/${reactionType}`,
                method: "POST",
            }),
            invalidatesTags: (r, e, { postId }) => [
                { type: "Like", id: postId },
            ],
        }),
        quickLike: builder.mutation({
            query: (postId) => ({
                url: `/${postId}/like`,
                method: "POST",
            }),
            invalidatesTags: (r, e, id) => [
                { type: "Like", id },
            ],
        }),

        /* -------------------- DELETE -------------------- */
        removeReaction: builder.mutation({
            query: (postId) => ({
                url: `/${postId}/reactions`,
                method: "DELETE",
            }),
            invalidatesTags: (r, e, id) => [
                { type: "Like", id },
            ],
        }),
    }),
});

export const {
    // Queries
    useGetPostReactionsQuery,
    useGetPostReactionsByTypeQuery,
    useGetPostReactionStatsQuery,
    useGetMyReactionOnPostQuery,
    useGetPostReactionCountQuery,
    useCheckIfReactedQuery,
    useGetTrendingReactionsQuery,
    useGetMyPostsReactedQuery,
    useGetReactionHistoryQuery,
    useGetGlobalReactionStatsQuery,

    // Mutations
    useAddReactionMutation,
    useQuickLikeMutation,
    useRemoveReactionMutation,
} = postReactionApi;
