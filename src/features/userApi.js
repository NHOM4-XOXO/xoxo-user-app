import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

// Helper: thêm token
const prepareHeaders = (headers) => {
    const token = Cookies.get("token");
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return headers;
};

// Helper: lấy luôn data
const transform = (response) => response.data;

export const userApi = createApi({
    reducerPath: "userApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/api/user`,
        prepareHeaders,
        credentials: "include", // gửi refreshToken cookie
    }),
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
        getNotifications: builder.query({
            query: () => "/notifications",
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
            invalidatesTags: (r, e, id) => [{ type: "Notification", id }],
        }),
        deleteNotification: builder.mutation({
            query: (id) => ({
                url: `/notifications/${id}/delete`,
                method: "PUT",
            }),
            invalidatesTags: (r, e, id) => [{ type: "Notification", id }],
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
