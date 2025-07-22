"use client";

import { useState } from "react";
import FindAccountModal from "./FindAccountModal";

export default function ForgotPassword() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setError("Vui lòng nhập email hoặc số điện thoại");
      return;
    }

    // Basic validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10,11}$/;

    if (!emailRegex.test(searchQuery) && !phoneRegex.test(searchQuery)) {
      setError("Vui lòng nhập email hoặc số điện thoại hợp lệ");
      return;
    }

    setError("");
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="min-h-screen bg-gray-100">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center">
              <div className="flex items-center">
                <div className="w-14 h-14 bg-amber-50 rounded-full flex items-center justify-center mr-4">
                  <img
                    src="./logo_xoxo_500px-removebg-preview.png"
                    alt="Logo"
                    className="h-16 w-16 rounded-full"
                  />
                </div>
                <h1 className="text-2xl font-bold text-blue-600">XOXO</h1>
              </div>
              <div className="ml-auto flex items-center space-x-4">
                <input
                  type="text"
                  placeholder="Email hoặc điện thoại"
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
                <input
                  type="password"
                  placeholder="Mật khẩu"
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
                <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
                  Đăng nhập
                </button>
                <a
                  href="/login"
                  className="text-blue-600 text-sm hover:underline"
                >
                  Bạn quên tài khoản ư?
                </a>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex items-center justify-center py-30 px-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Tìm tài khoản của bạn
            </h2>
            <p className="text-gray-600 mb-6">
              Vui lòng nhập email hoặc số di động để tìm kiếm tài khoản của bạn.
            </p>

            <div className="mb-6">
              <input
                type="text"
                placeholder="Email hoặc số di động"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg placeholder-gray-600 ${
                  error ? "border-red-500" : "border-gray-300"
                }`}
              />

              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </div>

            <div className="flex space-x-3 justify-end">
              <button
                onClick={() => (window.location.href = "/login")}
                className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 font-medium"
              >
                Hủy
              </button>
              <button
                onClick={handleSearch}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
              >
                Tìm kiếm
              </button>
            </div>
          </div>
        </div>
      </div>

      <FindAccountModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        searchQuery={searchQuery}
      />
    </>
  );
}
