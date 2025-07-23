"use client";

import { useState } from "react";
import FindAccountModal from "./FindAccountModal";
import { useUser } from "../contexts/UserContext";
import Footer from "./common/Footer";

export default function ForgotPassword() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);

  // Header login form states
  const [headerLogin, setHeaderLogin] = useState({
    email: "",
    password: "",
  });
  const [headerLoading, setHeaderLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useUser();

  // Handle header login
  const handleHeaderLogin = async (e) => {
    e.preventDefault();
    if (!headerLogin.email || !headerLogin.password) {
      alert("Vui lòng nhập đầy đủ email và mật khẩu");
      return;
    }

    setHeaderLoading(true);
    try {
      await login(headerLogin.email, headerLogin.password);
      alert("Đăng nhập thành công!");
      window.location.href = "/";
    } catch (error) {
      alert("Đăng nhập thất bại: " + error.message);
    } finally {
      setHeaderLoading(false);
    }
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setError("Vui lòng nhập email");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(searchQuery)) {
      setError("Vui lòng nhập email hợp lệ");
      return;
    }

    setError("");
    setShowModal(true);
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
                <div>
                  <a href="/login" className="text-2xl font-bold text-blue-600">
                    XOXO
                  </a>
                </div>
              </div>
              <form
                onSubmit={handleHeaderLogin}
                className="ml-auto flex items-center space-x-4"
              >
                <input
                  type="text"
                  placeholder="Email "
                  value={headerLogin.email}
                  onChange={(e) =>
                    setHeaderLogin({ ...headerLogin, email: e.target.value })
                  }
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-600"
                  disabled={headerLoading}
                />
                <input
                  type="password"
                  placeholder="Mật khẩu"
                  value={headerLogin.password}
                  onChange={(e) =>
                    setHeaderLogin({ ...headerLogin, password: e.target.value })
                  }
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-600"
                  disabled={headerLoading}
                />
                <button
                  type="submit"
                  disabled={headerLoading}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    headerLoading
                      ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {headerLoading ? "Đang đăng nhập..." : "Đăng nhập"}
                </button>
              </form>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex items-center bg-blue-300 justify-center py-30 px-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Tìm tài khoản của bạn
            </h2>
            <p className="text-gray-600 mb-6">
              Vui lòng nhập email để tìm kiếm tài khoản của bạn.
            </p>

            <div className="mb-6">
              <input
                type="text"
                placeholder="Email"
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

        <Footer />
      </div>

      <FindAccountModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        searchQuery={searchQuery}
      />
    </>
  );
}
