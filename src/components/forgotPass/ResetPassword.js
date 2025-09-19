"use client";

import { useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
export default function ResetPassword() {
  const router = useRouter();
  const [token, setToken] = useState("");
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setToken(params.get("token") || "");
  }, []);
  const [passwords, setPasswords] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [apiError, setApiError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validatePasswords = () => {
    const newErrors = {};

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/;

    if (!passwords.newPassword) {
      newErrors.newPassword = "Vui lòng nhập mật khẩu mới";
    } else if (!passwordRegex.test(passwords.newPassword)) {
      newErrors.newPassword =
        "Mật khẩu phải có ít nhất 6 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt";
    }

    if (!passwords.confirmPassword) {
      newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu";
    } else if (passwords.newPassword !== passwords.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    setSuccess("");
    if (!validatePasswords()) {
      return;
    }
    if (!token) {
      setApiError("Token không hợp lệ hoặc đã hết hạn!");
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch("https://xoxo.id.vn/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
        },
        body: JSON.stringify({
          token,
          newPassword: passwords.newPassword,
        }),
      });
      const data = await res.json();
      if (res.status === 200) {
        setSuccess(
          data.data || "Thay đổi mật khẩu thành công. Bạn có thể đăng nhập!"
        );
        setTimeout(() => {
          window.location.href = "/login";
        }, 1500);
      } else {
        setApiError(data.message || "Có lỗi xảy ra khi đặt lại mật khẩu.");
      }
    } catch (error) {
      setApiError("Có lỗi xảy ra khi kết nối server.");
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-blue-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Chọn mật khẩu mới
        </h2>
        <p className="text-gray-600 mb-4">
          Tạo mật khẩu mới có ít nhất 6 ký tự.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              name="newPassword"
              placeholder="Mật khẩu mới"
              value={passwords.newPassword}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg placeholder:text-gray-700 placeholder:font-medium ${
                errors.newPassword ? "border-red-500" : "border-gray-300"
              }`}
              disabled={isLoading}
            />
            {errors.newPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>
            )}
          </div>
          <div>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Nhập lại mật khẩu mới"
              value={passwords.confirmPassword}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg placeholder:text-gray-700 placeholder:font-medium ${
                errors.confirmPassword ? "border-red-500" : "border-gray-300"
              }`}
              disabled={isLoading}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>
          {apiError && <p className="text-red-500 text-sm mt-2">Token đã hết hiệu lực.</p>}
          {success && <p className="text-green-600 text-sm mt-2">{success}</p>}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className={`px-6 py-2 rounded-md font-medium cursor-pointer ${
                isLoading
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
