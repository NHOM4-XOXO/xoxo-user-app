import { createApi } from "@reduxjs/toolkit/query/react";
import { createBaseQueryWithReauth } from "./auth/baseQueryWithReauth ";


export const newsfeedApi = createApi({
    reducerPath: "newsfeedApi",
    baseQuery: createBaseQueryWithReauth(
        `${process.env.NEXT_PUBLIC_API_URL}/api`
    ),
    tagTypes: ["NewsFeed"],
    endpoints: (builder) => ({
        // ---------------- QUERY ----------------
        // Lấy feed theo page
        getNewsFeed: builder.query({
            query: ({ page = 0, size = 5, forceRefresh = false } = {}) =>
                `/newsfeed?page=${page}&size=${size}&forceRefresh=${forceRefresh}`,
            transformResponse: (response) => response.data, // lấy thẳng "data"
            providesTags: (result) =>
                result?.items
                    ? [
                        ...result.items.map(({ id }) => ({ type: "NewsFeed", id })),
                        { type: "NewsFeed", id: "LIST" },
                    ]
                    : [{ type: "NewsFeed", id: "LIST" }],
        }),
        // ---------------- MUTATION ----------------
        // Đánh dấu đã xem
        markSeen: builder.mutation({
            query: (ids) => ({
                url: "/newsfeed/mark-seen",
                method: "POST",
                body: ids, // gửi array trực tiếp
            }),
        }),


        // Đánh dấu tương tác (like, comment, share)
        interact: builder.mutation({
            query: ({ itemId }) => ({
                url: `/newsfeed/items/${itemId}/interact`,
                method: "POST",
            }),
            // có thể để optimistic update ở client, không invalidate
        }),

        // Làm mới feed (optional, trigger re-fetch)
        refreshFeed: builder.mutation({
            query: () => ({
                url: "/newsfeed/refresh",
                method: "POST",
            }),
            invalidatesTags: [{ type: "NewsFeed", id: "LIST" }],
        }),

        // Xóa cache feed
        clearCache: builder.mutation({
            query: () => ({
                url: `/newsfeed/cache`,
                method: "DELETE",
            }),
            invalidatesTags: [{ type: "NewsFeed", id: "LIST" }],
        }),

        // Khởi tạo feed cho user (On app start/login hoặc sau migrate)
        initialize: builder.mutation({
            query: () => ({
                url: "/newsfeed/initialize",
                method: "POST",
            }),
            invalidatesTags: [{ type: "NewsFeed", id: "LIST" }],
        }),

        // Cập nhật độ ưu tiên của feed
        updatepriorities: builder.mutation({
            query: () => ({
                url: "/newsfeed/update-priorities",
                method: "POST",
            }),
            invalidatesTags: [{ type: "NewsFeed", id: "LIST" }],
        }),

        // ---------------- ADMIN ----------------
        adminInitializeUser: builder.mutation({
            query: (userId) => ({
                url: `/newsfeed/admin/initialize-user/${userId}`,
                method: "POST",
            }),
            invalidatesTags: [{ type: "NewsFeed", id: "LIST" }],
        }),

        adminPopulateAllUsers: builder.mutation({
            query: () => ({
                url: "/newsfeed/admin/populate-all-users",
                method: "POST",
            }),
            invalidatesTags: [{ type: "NewsFeed", id: "LIST" }],
        }),

        adminCleanupFriendshipItems: builder.mutation({
            query: () => ({
                url: "/newsfeed/admin/cleanup-friendship-items",
                method: "POST",
            }),
        }),
    }),
});

export const {
    useGetNewsFeedQuery,
    useMarkSeenMutation,
    useInteractMutation,
    useRefreshFeedMutation,
    useClearCacheMutation,
    useInitializeMutation,
    useUpdateprioritiesMutation,
    useAdminInitializeUserMutation,
    useAdminPopulateAllUsersMutation,
    useAdminCleanupFriendshipItemsMutation,
} = newsfeedApi;
