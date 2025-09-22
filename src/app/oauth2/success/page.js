"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/features/auth/authSlice";
import Cookies from "js-cookie";

// Spinner component đơn giản
export function Spinner({ className = "" }) {
    return (
        <div
            className={`border-4 border-t-blue-500 border-b-blue-500 border-gray-200 rounded-full w-12 h-12 animate-spin ${className}`}
        ></div>
    );
}

export default function OAuth2Success() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const dispatch = useDispatch();
    const [status, setStatus] = useState("loading"); // chỉ cần string

    useEffect(() => {
        const token = searchParams.get("jwt");

        if (token) {
            try {
                // Lưu token vào cookie (tuổi ngắn) và Redux store
                Cookies.set("token", token, { expires: 1 / 144, secure: true, sameSite: "strict" });
                dispatch(setCredentials({ token }));
                setStatus("success");

                // Delay 1s để người dùng thấy trạng thái success trước khi redirect
                setTimeout(() => router.replace("/"), 1000);
            } catch (err) {
                console.error(err);
                setStatus("error");
                setTimeout(() => router.replace("/login"), 1500);
            }
        } else {
            setStatus("error");
            setTimeout(() => router.replace("/login"), 1500);
        }
    }, [searchParams, router, dispatch]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
            {status === "loading" && (
                <>
                    <Spinner className="w-12 h-12 text-blue-500" />
                    <p className="text-lg font-semibold text-gray-700">Đang xử lý đăng nhập Google...</p>
                </>
            )}
            {status === "success" && (
                <p className="text-lg font-semibold text-green-600 animate-pulse">Đăng nhập thành công! Đang chuyển hướng...</p>
            )}
            {status === "error" && (
                <p className="text-lg font-semibold text-red-600 animate-pulse">Đăng nhập thất bại. Chuyển về trang đăng nhập...</p>
            )}
        </div>
    );
}
