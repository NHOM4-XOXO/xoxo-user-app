"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useChangePasswordMutation } from "@/features/auth/authApi";
import { useDispatch } from "react-redux";
import { logout } from "@/features/auth/authSlice";
import { toast } from "react-hot-toast";
export const dynamic = "force-dynamic";

export default function ChangePassword() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false,
  });
  const [logoutAllDevices, setLogoutAllDevices] = useState(false);
  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.oldPassword) {
      newErrors.oldPassword = "Vui lòng nhập mật khẩu cũ";
    }

    if (!formData.newPassword) {
      newErrors.newPassword = "Vui lòng nhập mật khẩu mới";
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = "Mật khẩu mới phải có ít nhất 6 ký tự";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu mới";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }

    if (formData.oldPassword === formData.newPassword) {
      newErrors.newPassword = "Mật khẩu mới phải khác mật khẩu cũ";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      
      await changePassword({
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
      }).unwrap();

      toast.success("Đổi mật khẩu thành công!");

      console.log("logoutAllDevices:", logoutAllDevices);

     
      if (logoutAllDevices) {
        console.log("Preparing to logout...");
        dispatch(logout());

        router.refresh(); 
        router.replace("/login"); 

        setTimeout(() => {
          window.location.href = "/login";
        }, 100);
      } else {
        router.push("/");
      }
    } catch (error) {
      console.log("Change password error:", error);

      // Kiểm tra token hết hạn
      if (error?.status === 401 || error?.status === 403) {
        toast.error("Phiên đăng nhập đã hết hạn");
        dispatch(logout());
        window.location.replace("/login");
        return;
      }

      // Xử lý lỗi mật khẩu cũ sai
      if (error?.status === 400) {
        setErrors({ oldPassword: "Mật khẩu cũ không đúng" });
        toast.error("Mật khẩu cũ không đúng");
        return;
      }

      // Các lỗi khác
      const errorMessage =
        error?.data?.message || error?.message || "Đổi mật khẩu thất bại";
      toast.error(errorMessage);
    }
  };


  return (
    <div className="min-h-screen bg-blue-300 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Đổi mật khẩu</h2>
            <p className="text-gray-600 mt-2">Cập nhật mật khẩu của bạn</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Mật khẩu cũ */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mật khẩu cũ
              </label>
              <div className="relative">
                <input
                  type={showPasswords.old ? "text" : "password"}
                  name="oldPassword"
                  value={formData.oldPassword}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.oldPassword ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Nhập mật khẩu cũ"
                />
              </div>
              {errors.oldPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.oldPassword}
                </p>
              )}
            </div>

            {/* Mật khẩu mới */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mật khẩu mới
              </label>
              <div className="relative">
                <input
                  type={showPasswords.new ? "text" : "password"}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.newPassword ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Nhập mật khẩu mới"
                />
              </div>
              {errors.newPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.newPassword}
                </p>
              )}
            </div>

            {/* Xác nhận mật khẩu mới */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Xác nhận mật khẩu mới
              </label>
              <div className="relative">
                <input
                  type={showPasswords.confirm ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.confirmPassword
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="Nhập lại mật khẩu mới"
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <div className="flex items-start">
              <input
                type="checkbox"
                id="logoutAllDevices"
                checked={logoutAllDevices}
                onChange={(e) => setLogoutAllDevices(e.target.checked)}
                className="mt-1 mr-3 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <div>
                <label
                  htmlFor="logoutAllDevices"
                  className="text-sm font-medium text-gray-700 cursor-pointer"
                >
                  Đăng xuất khỏi tất cả thiết bị khác
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  Bạn sẽ cần đăng nhập lại trên tất cả các thiết bị khác
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
                disabled={isLoading}
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className={`flex-1 py-3 px-4 rounded-lg text-white font-medium ${
                  isLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {isLoading ? "Đang xử lý..." : "Đổi mật khẩu"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
