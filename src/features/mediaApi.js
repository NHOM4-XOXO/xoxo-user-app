import { createApi } from "@reduxjs/toolkit/query/react";
import { createBaseQueryWithReauth } from "./auth/baseQueryWithReauth ";


// Helper: lấy luôn data
const transform = (response) => response.data;

export const mediaApi = createApi({
    reducerPath: "mediaApi",
    baseQuery: createBaseQueryWithReauth(`${process.env.NEXT_PUBLIC_API_URL}/api/media`),
    tagTypes: ["Media"],

    endpoints: (builder) => ({
        /* -------------------- GET -------------------- */
        getMediaById: builder.query({
            query: (id) => `/${id}`,
            transformResponse: transform,
            providesTags: (r, e, id) => [{ type: "Media", id }],
        }),
        getMyMedia: builder.query({
            query: () => "/my-media",
            transformResponse: transform,
            providesTags: ["Media"],
        }),

        /* -------------------- POST -------------------- */
        uploadMedia: builder.mutation({
            query: ({ file, mediaType }) => {
                const formData = new FormData();
                formData.append("file", file);

                return {
                    url: `/upload?mediaType=${mediaType}`,
                    method: "POST",
                    body: formData,
                };
            },
            transformResponse: transform,
            invalidatesTags: ["Media"],
        }),

        uploadMultipleMedia: builder.mutation({
            query: ({ files, mediaType }) => {
                const formData = new FormData();
                files.forEach((file) => formData.append("files", file));

                return {
                    url: `/upload-multiple?mediaType=${mediaType}`,
                    method: "POST",
                    body: formData,
                };
            },
            transformResponse: transform,
            invalidatesTags: ["Media"],
        }),


        /* -------------------- DELETE -------------------- */
        deleteMedia: builder.mutation({
            query: (id) => ({
                url: `/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: (r, e, id) => [{ type: "Media", id }],
        }),
    }),
});

export const {
    useGetMediaByIdQuery,
    useGetMyMediaQuery,
    useUploadMediaMutation,
    useUploadMultipleMediaMutation,
    useDeleteMediaMutation,
} = mediaApi;
