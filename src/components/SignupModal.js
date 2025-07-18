"use client";

import { useState } from "react";
import { HelpCircle, AlertCircle } from "lucide-react";
export default function SignupModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    birthday: "",
    gender: "",
  });

  const [touched, setTouched] = useState({
    firstName: false,
    lastName: false,
    email: false,
    password: false,
    confirmPassword: false,
    birthday: false,
  });
  // Hàm xử lý khi người dùng rời khỏi trường nhập liệu
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };
  const isInvalid = (field) => touched[field] && !formData[field];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  // Trạng thái hiển thị gợi ý
  const [showHint, setShowHint] = useState({
    email: false,
    password: false,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Mật khẩu không khớp!");
      return;
    }
    // Xử lý đăng ký ở đây
    console.log("Signup data:", formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-screen overflow-visible">
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
              <div className="relative">
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  onFocus={() =>
                    setTouched((prev) => ({ ...prev, lastName: false }))
                  }
                  placeholder="Tên"
                  required
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                    isInvalid("lastName")
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {isInvalid("lastName") && (
                  <AlertCircle className="absolute right-2 top-2 text-red-500 w-5 h-5" />
                )}
              </div>

              <div className="relative">
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  onFocus={() =>
                    setTouched((prev) => ({ ...prev, firstName: false }))
                  }
                  placeholder="Tên"
                  required
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                    isInvalid("firstName")
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />

                {isInvalid("firstName") && (
                  <AlertCircle className="absolute right-2 top-2 text-red-500 w-5 h-5" />
                )}
              </div>
            </div>

            <div className="relative">
              <input
                type="email"
                name="email"
                placeholder="Số di động hoặc email"
                value={formData.email}
                required
                onChange={handleChange}
                onFocus={() => {
                  setShowHint((prev) => ({ ...prev, email: true }));
                  setTouched((prev) => ({ ...prev, email: false }));
                }}
                onBlur={(e) => {
                  setShowHint((prev) => ({ ...prev, email: false }));
                  handleBlur(e);
                }}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  isInvalid("email") ? "border-red-500" : "border-gray-300"
                }`}
              />

              {isInvalid("email") && (
                <AlertCircle className="absolute right-2 top-2 text-red-500 w-5 h-5" />
              )}

              {showHint.email && (
                <div className="absolute -left-[270px] top-1/2 -translate-y-1/2 w-[250px] bg-[#c84141] text-white text-sm px-4 py-2 rounded shadow-lg z-20 border border-[#8a2c2c]">
                  <div className="absolute top-1/2 right-[-8px] -translate-y-1/2 w-0 h-0 border-t-[8px] border-b-[8px] border-l-[8px] border-t-transparent border-b-transparent border-l-[#c84141]"></div>
                  Bạn sẽ sử dụng thông tin này khi đăng nhập và khi cần đặt lại
                  mật khẩu.
                </div>
              )}
            </div>

            <div className="relative">
              <input
                type="password"
                name="password"
                value={formData.password}
                placeholder="Mật khẩu"
                required
                onChange={handleChange}
                onFocus={() => {
                  setShowHint((prev) => ({ ...prev, password: true }));
                  setTouched((prev) => ({ ...prev, password: false }));
                }}
                onBlur={(e) => {
                  setShowHint((prev) => ({ ...prev, password: false }));
                  handleBlur(e);
                }}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  isInvalid("password") ? "border-red-500" : "border-gray-300"
                }`}
              />
              {isInvalid("password") && (
                <AlertCircle className="absolute right-2 top-2 text-red-500 w-5 h-5" />
              )}

              {showHint.password && (
                <div className="absolute -left-[270px] top-1/2 -translate-y-1/2 w-[250px] bg-[#c84141] text-white text-sm px-4 py-2 rounded shadow-lg z-20 border border-[#8a2c2c]">
                  <div className="absolute top-1/2 right-[-8px] -translate-y-1/2 w-0 h-0 border-t-[8px] border-b-[8px] border-l-[8px] border-t-transparent border-b-transparent border-l-[#c84141]"></div>
                  Nhập mật khẩu có tối thiểu 6 ký tự, bao gồm chữ cái, số và ký
                  tự đặc biệt.
                </div>
              )}
            </div>

            <div className="relative">
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                onFocus={() =>
                  setTouched((prev) => ({ ...prev, confirmPassword: false }))
                }
                placeholder="Nhập lại mật khẩu"
                required
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  isInvalid("confirmPassword")
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
              {isInvalid("confirmPassword") && (
                <AlertCircle className="absolute right-2 top-2 text-red-500 w-5 h-5" />
              )}
            </div>
            <div className="relative">
              <label className="block text-sm text-gray-600 mb-1">
                Ngày sinh
                <div className="relative inline-block group ml-1">
                  <span>
                    <HelpCircle
                      className="w-4 h-4 text-black cursor-pointer"
                      title="Chúng tôi dùng ngày sinh để xác định độ tuổi."
                    />
                  </span>
                  <div className="absolute left-5 z-10 hidden group-hover:block w-56 bg-white text-sm text-gray-700 p-2 rounded shadow-lg border border-gray-200">
                    Cung cấp sinh nhật của bạn giúp đảm bảo bạn có được trải
                    nghiệm Facebook phù hợp với độ tuổi của mình. Nếu bạn muốn
                    thay đổi người nhìn thấy thông tin này, hãy đi tới phần
                    "Giới thiệu trên trang cá nhân" của bạn!
                  </div>
                </div>
              </label>
              <input
                type="date"
                name="birthday"
                value={formData.birthday}
                onChange={handleChange}
                onBlur={handleBlur}
                onFocus={() =>
                  setTouched((prev) => ({ ...prev, birthday: false }))
                }
                required
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  isInvalid("birthday") ? "border-red-500" : "border-gray-300"
                }`}
              />
              {isInvalid("birthday") && (
                <AlertCircle className="absolute right-2 top-2 text-red-500 w-5 h-5" />
              )}
            </div>

            <div className="relative">
              <label className="block text-sm text-gray-600 mb-1">
                Giới tính
                <div className="relative inline-block group ml-1">
                  <span>
                    <HelpCircle
                      className="w-4 h-4 text-black cursor-pointer"
                      title="Chúng tôi dùng ngày sinh để xác định độ tuổi."
                    />
                  </span>
                  <div className="absolute left-5 z-10 hidden group-hover:block w-56 bg-white text-sm text-gray-700 p-2 rounded shadow-lg border border-gray-200">
                    Bạn có thể thay đổi người nhìn thấy giới tính của mình trên
                    trang cá nhân vào lúc khác. Chọn Khác nếu bạn thuộc giới
                    tính khác hoặc không muốn tiết lộ.
                  </div>
                </div>
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
              {isInvalid("gender") && (
                <AlertCircle className="absolute right-2 top-2 text-red-500 w-5 h-5" />
              )}
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
