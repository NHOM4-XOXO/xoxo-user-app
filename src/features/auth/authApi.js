import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.NEXT_PUBLIC_API_URL + "/api/auth",
        prepareHeaders: (headers, { getState }) => {
            const token = getState().auth.token;
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
            return headers;
        },
        credentials: "include", // để gửi cookie refreshToken
    }),
    endpoints: (builder) => ({
        register: builder.mutation({
            query: (userData) => ({
                url: "/register",
                method: "POST",
                body: userData,
            }),
        }),
        login: builder.mutation({
            query: (credentials) => ({
                url: "/login",
                method: "POST",
                body: credentials, // { email, password }
            }),
        }),
        logout: builder.mutation({
            query: () => ({
                url: "/logout",
                method: "POST",
            }),
        }),
        refreshToken: builder.mutation({
            query: () => ({
                url: "/refresh-token",
                method: "POST",
            }),
        }),
        verifyEmail: builder.query({
            query: (token) => `/verify?token=${token}`,
        }),
        forgotPassword: builder.mutation({
            query: (data) => ({
                url: "/forgot-password",
                method: "POST",
                body: data, // { email }
            }),
        }),
        resetPassword: builder.mutation({
            query: (data) => ({
                url: "/reset-password",
                method: "POST",
                body: data, // { token, newPassword }
            }),
        }),
        changePassword: builder.mutation({
            query: (data) => ({
                url: "/change-password",
                method: "POST",
                body: data, // { oldPassword, newPassword }
            }),
        }),
    }),
});

export const {
    useRegisterMutation,
    useLoginMutation,
    useLogoutMutation,
    useRefreshTokenMutation,
    useVerifyEmailQuery,
    useForgotPasswordMutation,
    useResetPasswordMutation,
    useChangePasswordMutation,
} = authApi;
