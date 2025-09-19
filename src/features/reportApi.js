import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Helper: thêm token
const prepareHeaders = (headers) => {
  const token = Cookies.get("token");
  if (token) headers.set("Authorization", `Bearer ${token}`);
  return headers;
};

// Helper: lấy luôn data
const transform = (response) => response.data;

export const reportsApi = createApi({
  reducerPath: "reportsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/api/v1`,
    prepareHeaders,
    credentials: "include",
  }),
  tagTypes: ["Report"],
  endpoints: (builder) => ({
    createReport: builder.mutation({
      query: (reportData) => ({
        url: "/reports",
        method: "POST",
        body: reportData,
      }),
      transformResponse: transform,
      invalidatesTags: ["Report"],
    }),
    getMyReports: builder.query({
      query: () => "/reports/my-reports",
      transformResponse: transform,
      providesTags: ["Report"],
    }),
    getReportsByTarget: builder.query({
      query: ({ targetType, targetId }) =>
        `/reports/target/${targetType}/${targetId}`,
      transformResponse: transform,
      providesTags: (result, error, { targetType, targetId }) => [
        { type: "Report", id: `${targetType}-${targetId}` },
      ],
    }),
  }),
});

export const {
  useCreateReportMutation,
  useGetMyReportsQuery,
  useGetReportsByTargetQuery,
} = reportsApi;
