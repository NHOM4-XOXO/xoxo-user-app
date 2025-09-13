import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

// Helper: thêm token
const prepareHeaders = (headers) => {
    const token = Cookies.get("token");
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return headers;
};

// Helper: lấy luôn data
const transform = (response) => response.data.content;

export const groupApi = createApi({
    reducerPath: "groupApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/api/v1`,
        prepareHeaders,
        credentials: "include",
    }),
    tagTypes: ["Group"],

    endpoints: (builder) => ({
        /* -------------------- GET -------------------- */
        getAllGroup: builder.query({
            query: () => "/groups",
            transformResponse: transform,
            providesTags: ["Group"],
        }),

        getGroupMembers: builder.query({
            query: ({ groupId, page = 0, size = 10, status }) => {
                let params = new URLSearchParams();
                params.append("page", page);
                params.append("size", size);
                if (status) params.append("status", status);

                return {
                    url: `group-members/${groupId}/members`,
                    params,
                };
            },
        }),

        /* -------------------- MUTATION -------------------- */
        joinGroup: builder.mutation({
            query: (groupId) => ({
                url: `/group-members/join/${groupId}`,
                method: "POST",
            }),
            invalidatesTags: ["Group"],
        }),
        createGroup: builder.mutation({
            query: (data) => ({
                url: "/groups",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Group"],
        }),
    }),
});

export const {
    useGetAllGroupQuery,
    useGetGroupMembersQuery,

    useJoinGroupMutation,
    useCreateGroupMutation,
} = groupApi;
