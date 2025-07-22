"use client";

import { useState } from "react";
import { userDataManager } from "../utils/userDataManager";

export default function ResetPasswordModal({ isOpen, onClose, user }) {
  const [passwords, setPasswords] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Debug: log user object khi component render
  console.log("ResetPasswordModal - User object:", user);

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

    if (passwords.newPassword.length < 6) {
      newErrors.newPassword = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }

    if (!passwords.newPassword) {
      newErrors.newPassword = "Vui lòng nhập mật khẩu mới";
    }

    if (!passwords.confirmPassword) {
      newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validatePasswords()) {
      return;
    }

    setIsLoading(true);

    try {
      console.log("Đang reset password cho user:", user);
      console.log("User ID:", user?.id);
      console.log("New password:", passwords.newPassword);

      if (!user?.id) {
        throw new Error("User ID không hợp lệ!");
      }

      // Cập nhật mật khẩu mới vào localStorage
      const updatedUser = userDataManager.updatePassword(
        user.id,
        passwords.newPassword
      );
      console.log("Mật khẩu đã được cập nhật:", updatedUser);

      // Kiểm tra lại user sau khi cập nhật để đảm bảo mật khẩu đã được lưu
      const verifyUser = userDataManager.findUserByEmail(user.email);
      console.log("Kiểm tra user sau khi cập nhật:", verifyUser);

      if (verifyUser && verifyUser.password === passwords.newPassword) {
        console.log("✅ Mật khẩu đã được cập nhật thành công!");

        // Simulate API call delay
        setTimeout(() => {
          setIsLoading(false);
          alert(
            ` Mật khẩu đã được đặt lại thành công!\n\nEmail: ${user.email}\nMật khẩu mới: ${passwords.newPassword}\n\nVui lòng đăng nhập với mật khẩu mới.`
          );
          onClose();
          // Reset form
          setPasswords({
            newPassword: "",
            confirmPassword: "",
          });
          // Redirect to login page
          window.location.href = "/login";
        }, 1500);
      } else {
        throw new Error("Có lỗi xảy ra khi lưu mật khẩu mới!");
      }
    } catch (error) {
      setIsLoading(false);
      alert("Có lỗi xảy ra khi đặt lại mật khẩu. Vui lòng thử lại!");
      console.error("Error updating password:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Chọn mật khẩu mới
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          <div className="mb-6">
            <p className="text-gray-600 mb-4">
              Tạo mật khẩu mới có ít nhất 6 ký tự. Mật khẩu mạnh bao gồm chữ số,
              chữ cái và dấu câu.
            </p>

            {/* User Info */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-3">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-medium text-gray-900">{user.name}</h3>
                  <p className="text-sm text-gray-600">
                    Đặt lại mật khẩu cho tài khoản này
                  </p>
                </div>
              </div>
            </div>

            {/* Password Form */}
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
                />
                {errors.newPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.newPassword}
                  </p>
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
                    errors.confirmPassword
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 font-medium"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`px-6 py-2 rounded-md font-medium ${
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
      </div>
    </div>
  );
}
