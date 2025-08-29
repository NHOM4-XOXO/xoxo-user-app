// baseQueryWithReauth.js
import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { refreshTokenFlow, logoutFlow } from "./authManager";
import Cookies from "js-cookie";

const baseQuery = fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL + "/api/auth",
    prepareHeaders: (headers) => {
        const token = Cookies.get("token");
        if (token) headers.set("Authorization", `Bearer ${token}`);
        return headers;
    },
    credentials: "include",
});

export const baseQueryWithReauth = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);

    // Fallback: nếu request fail vì 401 thì refresh token rồi retry
    if (result.error && result.error.status === 401) {
        console.warn("[baseQueryWithReauth] 401 detected -> trying refresh...");
        const newToken = await refreshTokenFlow();

        if (newToken) {
            // retry lại request gốc
            result = await baseQuery(args, api, extraOptions);
        } else {
            logoutFlow();
        }
    }

    return result;
};
