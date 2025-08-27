"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function VerifyPage() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const router = useRouter();

    useEffect(() => {
        if (!token) {
            localStorage.setItem("verifyMessage", "Token không hợp lệ!");
            router.push("/login");
            return;
        }

        const verifyAccount = async () => {
            try {
                const res = await fetch(
                    `http://localhost:8080/api/auth/verify?token=${token}`
                );
                const data = await res.json();

                if (res.ok) {
                    localStorage.setItem("verifyMessage", "Xác thực thành công! Bạn có thể đăng nhập.");
                } else {
                    localStorage.setItem("verifyMessage", "Xác thực thất bại! Bạn đã xác thực rồi hoặc token không hợp lệ.");
                }
            } catch {
                localStorage.setItem("verifyMessage", "Có lỗi xảy ra khi xác thực.");
            }

            router.push("/login"); // luôn redirect về login
        };

        verifyAccount();
    }, [token, router]);

    return null; // Không cần render gì ở trang này
}
