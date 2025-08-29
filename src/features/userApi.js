import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

export const userApi = createApi({
    reducerPath: "userApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/api/user`, // vẫn dùng biến môi trường
        prepareHeaders: (headers) => {
            let token = Cookies.get("token");
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }

            return headers;
        },
        credentials: "include", // để gửi cookie refreshToken
    }),
    endpoints: (builder) => ({
        getMyProfile: builder.query({
            query: () => "/profile",
        }),
        getUserByUsername: builder.query({
            query: (username) => `/${username}`,
        }),
        getNotifications: builder.query({
            query: () => "/notifications",
        }),
        getUnreadNotifications: builder.query({
            query: () => "/notifications/unread",
        }),
        getUnreadCount: builder.query({
            query: () => "/notifications/unread/count",
        }),
        getNotificationsByType: builder.query({
            query: (type) => `/notifications/type/${type}`,
        }),
        updateProfile: builder.mutation({
            query: (data) => ({
                url: "/profile",
                method: "PUT",
                body: data,
            }),
        }),
        updateCover: builder.mutation({
            query: (formData) => ({
                url: "/profile/cover",
                method: "POST",
                body: formData,
            }),
        }),
        updateAvatar: builder.mutation({
            query: (formData) => ({
                url: "/profile/avatar",
                method: "POST",
                body: formData,
            }),
        }),
        markNotificationRead: builder.mutation({
            query: (id) => ({
                url: `/notifications/${id}/read`,
                method: "PUT",
            }),
        }),
        deleteNotification: builder.mutation({
            query: (id) => ({
                url: `/notifications/${id}/delete`,
                method: "PUT",
            }),
        }),
        markAllRead: builder.mutation({
            query: () => ({
                url: "/notifications/read-all",
                method: "PUT",
            }),
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
