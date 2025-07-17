"use client";

import { useState } from "react";

export default function SignupModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    birthday: "",
    gender: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Xử lý đăng ký ở đây
    console.log("Signup data:", formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-screen overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Đăng ký</h2>
              <p className="text-gray-600">Nhanh chóng và dễ dàng.</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                name="firstName"
                placeholder="Tên"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
              />
              <input
                type="text"
                name="lastName"
                placeholder="Họ"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
              />
            </div>

            <input
              type="email"
              name="email"
              placeholder="Email hoặc số điện thoại"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
            />

            <input
              type="password"
              name="password"
              placeholder="Mật khẩu mới"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
            />

            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Ngày sinh
              </label>
              <input
                type="date"
                name="birthday"
                value={formData.birthday}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Giới tính
              </label>
              <div className="grid grid-cols-3 gap-2">
                <label className="flex items-center p-2 border border-gray-300 rounded-md">
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    onChange={handleChange}
                    className="mr-2"
                  />
                  Nữ
                </label>
                <label className="flex items-center p-2 border border-gray-300 rounded-md">
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    onChange={handleChange}
                    className="mr-2"
                  />
                  Nam
                </label>
                <label className="flex items-center p-2 border border-gray-300 rounded-md">
                  <input
                    type="radio"
                    name="gender"
                    value="other"
                    onChange={handleChange}
                    className="mr-2"
                  />
                  Khác
                </label>
              </div>
            </div>

            <p className="text-xs text-gray-500">
              Bằng cách nhấp vào Đăng ký, bạn đồng ý với
              <a href="#" className="text-blue-600 hover:underline">
                {" "}
                Điều khoản
              </a>
              ,
              <a href="#" className="text-blue-600 hover:underline">
                {" "}
                Chính sách quyền riêng tư
              </a>{" "}
              và
              <a href="#" className="text-blue-600 hover:underline">
                {" "}
                Chính sách cookie
              </a>{" "}
              của chúng tôi.
            </p>

            <button
              type="submit"
              className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition duration-200 font-semibold"
            >
              Đăng ký
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
