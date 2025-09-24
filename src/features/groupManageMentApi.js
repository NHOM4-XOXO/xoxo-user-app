import { createApi } from "@reduxjs/toolkit/query/react";
import { createBaseQueryWithReauth } from "./auth/baseQueryWithReauth ";


// Helper: lấy luôn data
const transform = (response) => response.data.content;

export const groupApi = createApi({
    reducerPath: "groupApi",
    baseQuery: createBaseQueryWithReauth(`${process.env.NEXT_PUBLIC_API_URL}/api/v1`),
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
