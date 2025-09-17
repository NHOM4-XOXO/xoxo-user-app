"use client";

import { useEffect } from "react";

export default function OAuth2Callback() {
    useEffect(() => {
        // Nếu backend redirect token trong hash URL
        const hash = new URLSearchParams(window.location.hash.slice(1));
        const token = hash.get("access_token");

        if (token) {
            // Lưu token vào cookie (không phải HttpOnly, chỉ frontend)
            document.cookie = `token=${token}; max-age=${24 * 60 * 60}; path=/; samesite=strict`;

            // Nếu popup
            if (window.opener) {
                window.opener.postMessage(
                    { type: "OAUTH2_DONE", success: true, token },
                    process.env.NEXT_PUBLIC_FE_BASE_URL
                );
                window.close();
            }
        }
    }, []);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <p className="text-lg font-semibold">
                Đang đăng nhập... bạn có thể đóng cửa sổ này nếu không tự đóng
            </p>
        </div>
    );
}
