import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

// Helper
const prepareHeaders = (headers) => {
    const token = Cookies.get("token");
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return headers;
};

const transform = (response) => response.data;

export const postApi = createApi({
    reducerPath: "postApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/api/posts`,
        prepareHeaders,
        credentials: "include",
    }),
    tagTypes: ["Post", "Comment", "Like", "Share", "Media"],

    endpoints: (builder) => ({
        /* -------------------- GET -------------------- */
        getPostById: builder.query({
            query: (postId) => `/${postId}`,
            transformResponse: transform,
            providesTags: (r, e, id) => [{ type: "Post", id }],
        }),
        getPostDetails: builder.query({
            query: (postId) => `/${postId}/details`,
            transformResponse: transform,
            providesTags: (r, e, id) => [{ type: "Post", id }],
        }),
        getPostMedia: builder.query({
            query: (postId) => `/${postId}/media`,
            transformResponse: transform,
            providesTags: (r, e, id) => [{ type: "Media", id }],
        }),
        getPostComments: builder.query({
            query: (postId) => `/${postId}/comments`,
            transformResponse: transform,
            providesTags: (r, e, id) => [{ type: "Comment", id }],
        }),
        getPostLikes: builder.query({
            query: (postId) => `/${postId}/likes`,
            transformResponse: transform,
            providesTags: (r, e, id) => [{ type: "Like", id }],
        }),
        getPostShares: builder.query({
            query: (postId) => `/${postId}/shares`,
            transformResponse: transform,
            providesTags: (r, e, id) => [{ type: "Share", id }],
        }),
        getPublicPosts: builder.query({
            query: () => `/public`,
            transformResponse: transform,
            providesTags: (result) =>
                result
                    ? result.map((post) => ({ type: "Post", id: post.id })) // từng post cụ thể
                        .concat([{ type: "Post", id: "LIST" }])              // tag chung cho list
                    : [{ type: "Post", id: "LIST" }],
        }),

        getPostsByAuthor: builder.query({
            query: (userId) => `/author/${userId}`,
            transformResponse: transform,
            providesTags: (r, e, id) => [{ type: "Post", id }],
        }),
        getPostsOfMe: builder.query({
            query: () => `/me`,
            transformResponse: transform,
            providesTags: ["Post"],
        }),
        getMyReaction: builder.query({
            query: (postId) => `/${postId}/my-reaction`,
            transformResponse: (response) => response.data,
            providesTags: (r, e, id) => [{ type: "Like", id }],
        }),
        getPostReactions: builder.query({
            query: (postId) => `/${postId}/reactions`,
            transformResponse: (response) => response.data,
            providesTags: (r, e, id) => [{ type: "Like", id }],
        }),


        /* -------------------- POST -------------------- */
        createPost: builder.mutation({
            query: (body) => ({
                url: ``,
                method: "POST",
                body,
            }),
            invalidatesTags: ["Post"],
        }),
        likePost: builder.mutation({
            query: (postId) => ({
                url: `/${postId}/like`,
                method: "POST",
            }),
            invalidatesTags: (r, e, id) => [
                { type: "Like", id },
                { type: "Post", id },
            ],
        }),
        sharePost: builder.mutation({
            query: (postId) => ({
                url: `/${postId}/share`,
                method: "POST",
            }),
            invalidatesTags: (r, e, id) => [
                { type: "Share", id },
                { type: "Post", id },
            ],
        }),
        commentPost: builder.mutation({
            query: ({ postId, content, parentCommentId }) => {
                const params = { content };
                if (parentCommentId !== null && parentCommentId !== undefined) {
                    params.parentCommentId = parentCommentId;
                }

                return {
                    url: `/${postId}/comment`,
                    method: "POST",
                    params,
                };
            },
            invalidatesTags: (r, e, { postId }) => [
                { type: "Comment", id: postId },
                { type: "Post", id: postId },
            ],
        }),
        addMediaToPost: builder.mutation({
            query: ({ postId, formData }) => ({
                url: `/${postId}/media`,
                method: "POST",
                body: formData,
            }),
            invalidatesTags: (r, e, { postId }) => [
                { type: "Media", id: postId },
                { type: "Post", id: postId },
            ],
        }),

        /* -------------------- PUT -------------------- */
        updatePost: builder.mutation({
            query: ({ postId, body }) => ({
                url: `/${postId}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: (r, e, { postId }) => [{ type: "Post", id: postId }],
        }),

        /* -------------------- DELETE -------------------- */
        deletePost: builder.mutation({
            query: (postId) => ({
                url: `/${postId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Post"],
        }),
        deletePostMedia: builder.mutation({
            query: ({ postId, mediaId }) => ({
                url: `/${postId}/media/${mediaId}`,
                method: "DELETE",
            }),
            invalidatesTags: (r, e, { postId }) => [
                { type: "Media", id: postId },
                { type: "Post", id: postId },
            ],
        }),
        deleteReactionPost: builder.mutation({
            query: (postId) => ({
                url: `/${postId}/react`,
                method: "DELETE",
            }),
            invalidatesTags: (r, e, { postId }) => [
                { type: "Post", id: postId },
                { type: "Like", id: postId },
            ],
        }),
    }),
});

export const {
    useGetPostByIdQuery,
    useGetPostDetailsQuery,
    useGetPostMediaQuery,
    useGetPostCommentsQuery,
    useGetPostLikesQuery,
    useGetPostSharesQuery,
    useGetPublicPostsQuery,
    useGetPostsByAuthorQuery,
    useGetPostsOfMeQuery,
    useGetMyReactionQuery,
    useGetPostReactionsQuery,

    useCreatePostMutation,
    useLikePostMutation,
    useSharePostMutation,
    useCommentPostMutation,
    useAddMediaToPostMutation,
    useUpdatePostMutation,
    useDeletePostMutation,
    useDeletePostMediaMutation,
    useDeleteReactionPostMutation,
} = postApi;
