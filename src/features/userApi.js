import { createApi } from "@reduxjs/toolkit/query/react";
import { createBaseQueryWithReauth } from "./auth/baseQueryWithReauth ";

// Helper: lấy luôn data
const transform = (response) => response.data;

export const userApi = createApi({
    reducerPath: "userApi",
    baseQuery: createBaseQueryWithReauth(`${process.env.NEXT_PUBLIC_API_URL}/api/user`),
    tagTypes: ["User", "Notification"],

    endpoints: (builder) => ({
        /* -------------------- GET -------------------- */
        getMyProfile: builder.query({
            query: () => "/profile",
            transformResponse: transform,
            providesTags: ["User"],
        }),
        getUserByUsername: builder.query({
            query: (username) => `/${username}`,
            transformResponse: transform,
            providesTags: (r, e, username) => [{ type: "User", id: username }],
        }),
        getUserById: builder.query({
            query: (userId) => `/${userId}`,
            transformResponse: transform,
            providesTags: (r, e, userId) => [{ type: "User", id: userId }],
        }),
        getNotifications: builder.query({
            query: ({ page = 0, size = 20 } = {}) => `/notifications?page=${page}&size=${size}`,
            transformResponse: transform,
            providesTags: ["Notification"],
        }),
        getUnreadNotifications: builder.query({
            query: () => "/notifications/unread",
            transformResponse: transform,
            providesTags: ["Notification"],
        }),
        getUnreadCount: builder.query({
            query: () => "/notifications/unread/count",
            transformResponse: transform,
            providesTags: ["Notification"],
        }),
        getNotificationsByType: builder.query({
            query: (type) => `/notifications/type/${type}`,
            transformResponse: transform,
            providesTags: (r, e, type) => [{ type: "Notification", id: type }],
        }),

        /* -------------------- MUTATION -------------------- */
        updateProfile: builder.mutation({
            query: (data) => ({
                url: "/profile",
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["User"],
        }),
        updateCover: builder.mutation({
            query: (formData) => ({
                url: "/profile/cover",
                method: "POST",
                body: formData,
            }),
            invalidatesTags: ["User"],
        }),
        updateAvatar: builder.mutation({
            query: (formData) => ({
                url: "/profile/avatar",
                method: "POST",
                body: formData,
            }),
            invalidatesTags: ["User"],
        }),
        markNotificationRead: builder.mutation({
            query: (id) => ({
                url: `/notifications/${id}/read`,
                method: "PUT",
            }),
            invalidatesTags: ["Notification"],
        }),
        deleteNotification: builder.mutation({
            query: (id) => ({
                url: `/notifications/${id}/delete`,
                method: "PUT",
            }),
            invalidatesTags: ["Notification"],
        }),
        markAllRead: builder.mutation({
            query: () => ({
                url: "/notifications/read-all",
                method: "PUT",
            }),
            invalidatesTags: ["Notification"],
        }),
    }),
});

export const {
    useGetMyProfileQuery,
    useGetUserByUsernameQuery,
    useGetUserByIdQuery,
    useGetNotificationsQuery,
    useGetUnreadNotificationsQuery,
    useGetUnreadCountQuery,
    useGetNotificationsByTypeQuery,

    useUpdateProfileMutation,
    useUpdateCoverMutation,
    useUpdateAvatarMutation,
    useMarkNotificationReadMutation,
    useDeleteNotificationMutation,
    useMarkAllReadMutation,
} = userApi;
