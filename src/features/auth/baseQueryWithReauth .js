import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

export const createBaseQueryWithReauth = (baseUrl) => {
    const rawBaseQuery = fetchBaseQuery({
        baseUrl,
        credentials: "include",
        prepareHeaders: (headers) => {
            // Lấy token từ cookie
            const token = Cookies.get("token");
            if (token) headers.set("Authorization", `Bearer ${token}`);
            return headers;
        },
    });

    return async (args, api, extraOptions) => {
        let result = await rawBaseQuery(args, api, extraOptions);

        // Nếu gặp lỗi 401 hoặc 500 thì thử refresh token
        if ((result.error && result.error.status === 401) || result?.error?.status === 500) {
            const refreshResult = await rawBaseQuery(
                { url: "/auth/refresh-token", method: "POST" },
                api,
                extraOptions
            );

            if (refreshResult.data) {
                const token = refreshResult.data.data;

                // Lưu token mới vào cookie
                Cookies.set("token", token, { expires: 1, secure: true, sameSite: "strict" });

                // Retry request ban đầu
                result = await rawBaseQuery(args, api, extraOptions);
            } else {
                // Xóa cookie nếu refresh fail
                Cookies.remove("token");
            }
        }

        return result;
    };
};
