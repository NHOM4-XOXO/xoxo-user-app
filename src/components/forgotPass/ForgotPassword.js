"use client";

import { useState } from "react";
import Footer from "../common/Footer";

export const dynamic = "force-dynamic";
export default function ForgotPassword() {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSearch = async () => {
    setError("");
    setSuccess("");
    if (!searchQuery.trim()) {
      setError("Vui lòng nhập email");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(searchQuery)) {
      setError("Vui lòng nhập email hợp lệ");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("https://xoxo.id.vn/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "*/*",
        },
        body: JSON.stringify({ email: searchQuery }),
      });
      const data = await res.json();
      if (res.status === 200) {
        setSuccess(data.message || "Email reset password đã được gửi!");
      } else if (res.status === 404) {
        setError(data.message || "Email không tồn tại trong hệ thống");
      } else {
        setError(data.message || "Lỗi gửi email, vui lòng thử lại!");
      }
    } catch (err) {
      setError("Có lỗi xảy ra, vui lòng thử lại!");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <div className="flex items-center bg-blue-300 justify-center py-30 px-4 flex-1">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Tìm tài khoản của bạn
          </h2>
          <p className="text-gray-600 mb-6">
            Vui lòng nhập email để nhận hướng dẫn đặt lại mật khẩu.
          </p>
          <div className="mb-6">
            <input
              type="text"
              placeholder="Email"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg placeholder-gray-600 text-black ${
                error ? "border-red-500" : "border-gray-300"
              }`}
              disabled={loading}
            />
            {error && <p className="text-red-500 text-sm mt-2">Tài khoản người dùng không tồn tại.</p>}
            {success && <p className="text-green-600 text-sm mt-2">Vui lòng kiểm tra email của bạn để đặt lại mật khẩu.</p>}
          </div>
          <div className="flex space-x-3 justify-end">
            <button
              onClick={() => (window.location.href = "/login")}
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 font-medium cursor-pointer"
              disabled={loading}
            >
              Hủy
            </button>
            <button
              onClick={handleSearch}
              disabled={loading}
              className={`px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium cursor-pointer ${
                loading ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Đang xử lý..." : "Xác nhận"}
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
