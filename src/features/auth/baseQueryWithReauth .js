import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

export const createBaseQueryWithReauth = (baseUrl) => {
    const rawBaseQuery = fetchBaseQuery({
        baseUrl,
        credentials: "include",
        prepareHeaders: (headers) => {
            const token = Cookies.get("token");
            if (token) headers.set("Authorization", `Bearer ${token}`);
            return headers;
        },
    });

    return async (args, api, extraOptions) => {
        let result = await rawBaseQuery(args, api, extraOptions);

        // Nếu gặp lỗi 401, thử refresh token mà không log lỗi ban đầu
        if (result.error && result.error.status === 401) {
            const refreshResult = await rawBaseQuery(
                {
                    url: "https://xoxo.id.vn/api/auth/refresh-token",
                    method: "POST",
                },
                api,
                extraOptions
            );

            if (refreshResult.data) {
                const token = refreshResult.data.data;
                Cookies.set("token", token, { expires: 1, secure: true, sameSite: "strict" });

                // Retry request ban đầu sau khi refresh token thành công
                result = await rawBaseQuery(args, api, extraOptions);
            } else {
                Cookies.remove("token");
                // Lúc này mới trả lỗi nếu refresh fail
                result = { error: refreshResult.error };
            }
        }

        return result;
    };
};
