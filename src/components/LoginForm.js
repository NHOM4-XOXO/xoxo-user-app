"use client";

import { useState } from "react";
import SignupModal from "./SignupModal";
import userDataManager from "../utils/userDataManager";
import { AlertCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

export default function LoginForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error when user types
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      console.log("Đang thử đăng nhập với:");
      console.log("Email:", formData.email);
      console.log("Password:", formData.password);

      // Sử dụng userDataManager để đăng nhập
      const user = userDataManager.loginUser(formData.email, formData.password);

      console.log("Đăng nhập thành công:", user);

      // Simulate loading time
      await new Promise((resolve) => setTimeout(resolve, 1000));

      window.location.href = "/";
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl w-full space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left side - Branding */}
            <div className="text-center lg:text-left">
              <div className="flex justify-center lg:justify-start">
                <img
                  src="./logo_xoxo_500px-removebg-preview.png"
                  alt="Logo"
                  className="h-50 w-50 rounded-full"
                />
              </div>
              <p className="text-2xl text-gray-600 max-w-md mx-auto lg:mx-0">
                <span className="text-blue-600"><b>XOXO</b></span> giúp bạn kết nối và chia sẻ với mọi người
                trong cuộc sống của bạn.
              </p>
            </div>

            {/* Right side - Login Form */}
            <div className="max-w-md mx-auto w-full">
              <div className="bg-white rounded-lg shadow-lg p-8">
                {error && (
                  <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <input
                      type="email"
                      name="email"
                      placeholder="Email hoặc số điện thoại"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      disabled={isLoading}
                      className="w-full px-4 py-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg text-gray-900 placeholder-gray-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <input
                      type="password"
                      name="password"
                      placeholder="Mật khẩu"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      disabled={isLoading}
                      className="w-full px-4 py-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg text-gray-900 placeholder-gray-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-3 px-4 rounded-md font-semibold text-lg transition duration-200 ${
                      isLoading
                        ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Đang đăng nhập...
                      </span>
                    ) : (
                      "Đăng nhập"
                    )}
                  </button>
                </form>

                <div className="mt-4 text-center">
                  <a
                    href="/forgot-password"
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Quên mật khẩu?
                  </a>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setIsSignupModalOpen(true)}
                    className="w-full bg-green-500 text-white py-3 px-4 rounded-md hover:bg-green-600 transition duration-200 text-lg font-semibold"
                  >
                    Tạo tài khoản mới
                  </button>
                </div>
              </div>

              <div className="mt-6 text-center text-sm text-gray-600">
                <p>
                  <strong>Tạo Trang</strong> dành cho người nổi tiếng, thương
                  hiệu hoặc doanh nghiệp.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <SignupModal
        isOpen={isSignupModalOpen}
        onClose={() => setIsSignupModalOpen(false)}
      />
    </>
  );
}
