"use client";

import { useState, useEffect } from "react";
import VerificationModal from "./VerificationModal";
import { userDataManager } from "../utils/userDataManager";

export default function FindAccountModal({ isOpen, onClose, searchQuery }) {
  const [selectedMethod, setSelectedMethod] = useState("");
  const [showVerification, setShowVerification] = useState(false);
  const [foundUser, setFoundUser] = useState(null);

  useEffect(() => {
    if (searchQuery) {
      // Tìm user thật từ localStorage
      const realUser = userDataManager.findUserByEmailOrPhone(searchQuery);
      if (realUser) {
        setFoundUser(realUser);
      } else {
        // Không tạo mock user nữa, thông báo không tìm thấy
        setFoundUser(null);
      }
    }
  }, [searchQuery]);

  const handleSendCode = () => {
    if (selectedMethod && foundUser) {
      setShowVerification(true);
    }
  };

  if (!isOpen) return null;

  // Nếu không tìm thấy user thật, hiển thị thông báo
  if (!foundUser) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Không tìm thấy tài khoản
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>
            <p className="text-gray-600 mb-6">
              Không tìm thấy tài khoản nào với email/số điện thoại này. Vui lòng
              kiểm tra lại hoặc đăng ký tài khoản mới.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showVerification) {
    return (
      <VerificationModal
        isOpen={true}
        onClose={onClose}
        method={selectedMethod}
        user={foundUser}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-blue-300 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Đặt lại mật khẩu của bạn
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
              Bạn có muốn đặt lại mật khẩu cho tài khoản này không?
            </p>

            {/* User Info */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="flex items-center space-x-3">
                <img
                  src={foundUser.avatar}
                  alt={foundUser.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {foundUser.name}
                  </h3>
                  <p className="text-sm text-gray-600">Người dùng Facebook</p>
                </div>
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-4">
              Chúng tôi sẽ gửi mã xác thực đến:
            </p>

            {/* Verification Methods */}
            <div className="space-y-3">
              <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="method"
                  value="email"
                  checked={selectedMethod === "email"}
                  onChange={(e) => setSelectedMethod(e.target.value)}
                  className="mr-3"
                />
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-blue-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">Gửi mã qua email</p>
                    <p className="text-sm text-gray-500">{foundUser.email}</p>
                  </div>
                </div>
              </label>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 font-medium"
            >
              Không phải bạn?
            </button>
            <button
              onClick={handleSendCode}
              disabled={!selectedMethod}
              className={`px-6 py-2 rounded-md font-medium ${
                selectedMethod
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Tiếp tục
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
