"use client";

import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { setCredentials } from "@/features/auth/authSlice";

export default function GoogleLoginButton() {
    const dispatch = useDispatch();
    const router = useRouter();

    const handleGoogleLogin = () => {
        // Mở popup backend
        const popup = window.open(
            `${process.env.NEXT_PUBLIC_API_URL}/oauth2/authorization/google`,
            "GoogleLogin",
            "width=500,height=600"
        );

        // Lắng nghe message từ popup
        const handleMessage = (event) => {
            // Chỉ chấp nhận message từ frontend URL
            if (event.origin !== process.env.NEXT_PUBLIC_FE_BASE_URL) return;

            const { type, token } = event.data;
            if (type === "OAUTH2_DONE" && token) {
                // Lưu JWT vào Redux memory
                dispatch(setCredentials({ token }));

                // Redirect về trang chủ
                router.replace("/");

                // Đóng popup và remove listener
                popup?.close();
                window.removeEventListener("message", handleMessage);
            }
        };

        window.addEventListener("message", handleMessage);

        // Kiểm tra popup có bị đóng không
        const timer = setInterval(() => {
            if (popup?.closed) {
                clearInterval(timer);
                window.removeEventListener("message", handleMessage);
            }
        }, 500);
    };

    return (
        <button
            onClick={handleGoogleLogin}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
            Login with Google
        </button>
    );
}
