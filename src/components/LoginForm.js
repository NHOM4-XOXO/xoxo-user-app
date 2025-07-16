"use client";

import { useState } from "react";
import SignupModal from "./SignupModal";

export default function LoginForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Xử lý đăng nhập ở đây
    console.log("Login data:", formData);
  };

  return (
    <>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl w-full space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left side - Branding */}
            <div className="text-center lg:text-left">
              <div className="flex justify-center lg:justify-start">
                <h1 className="text-6xl font-bold text-blue-600 mb-4">
                  facebook
                </h1>
              </div>
              <p className="text-2xl text-gray-600 max-w-md mx-auto lg:mx-0">
                Facebook giúp bạn kết nối và chia sẻ với mọi người trong cuộc
                sống của bạn.
              </p>
            </div>

            {/* Right side - Login Form */}
            <div className="max-w-md mx-auto w-full">
              <div className="bg-white rounded-lg shadow-lg p-8">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <input
                      type="email"
                      name="email"
                      placeholder="Email hoặc số điện thoại"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
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
                      className="w-full px-4 py-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition duration-200 text-lg font-semibold"
                  >
                    Đăng nhập
                  </button>
                </form>

                <div className="mt-4 text-center">
                  <a href="#" className="text-blue-600 hover:underline text-sm">
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
