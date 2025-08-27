"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/features/auth/authSlice";
import Cookies from "js-cookie";

export default function OAuth2Success() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const dispatch = useDispatch();

    useEffect(() => {
        const token = searchParams.get("token");

        if (token) {
            Cookies.set("token", token, { expires: 1 / 144, secure: true, sameSite: "strict" });


            dispatch(setCredentials({ token }));

            // ✅ chuyển thẳng về Home
            router.replace("/");
        } else {
            router.replace("/login"); // nếu không có token thì quay về login
        }
    }, [searchParams, router, dispatch]);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <p className="text-lg font-semibold">Đang xử lý đăng nhập Google...</p>
        </div>
    );
}
