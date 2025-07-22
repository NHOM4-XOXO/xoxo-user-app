"use client";

import { useState } from "react";
import ResetPasswordModal from "./ResetPasswordModal";

export default function VerificationModal({ isOpen, onClose, method, user }) {
  const [verificationCode, setVerificationCode] = useState("");
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resendCount, setResendCount] = useState(0);
  const [showTestCode, setShowTestCode] = useState(false);
  const [showTroubleshoot, setShowTroubleshoot] = useState(false);

  // Mã test để demo (trong thực tế sẽ được tạo random và gửi qua API)
  const testVerificationCode = "123456";

  const handleVerifyCode = async () => {
    if (verificationCode.length === 6) {
      setIsLoading(true);

      const isValidCode =
        verificationCode === testVerificationCode ||
        verificationCode === "000000";

      // Simulate API call
      setTimeout(() => {
        setIsLoading(false);

        if (!isValidCode) {
          alert("Mã xác thực không đúng! Vui lòng thử lại.");
          return;
        }

        if (method === "email") {
          window.location.href = "/email-verification";
        } else {
          setShowResetPassword(true);
        }
      }, 1500);
    }
  };

  const handleResendCode = () => {
    setResendCount((prev) => prev + 1);

    // Hiển thị mã test sau lần thứ 2 gửi lại
    if (resendCount >= 1) {
      setShowTestCode(true);
    }

    // Simulate resending code
    const message =
      method === "email"
        `Mã xác thực đã được gửi lại đến ${user.email}. Vui lòng kiểm tra cả thư mục.`
    alert(message);


  };

  if (!isOpen) return null;

  if (showResetPassword) {
    return <ResetPasswordModal isOpen={true} onClose={onClose} user={user} />;
  }

  if (showTroubleshoot) {
    return (
      <EmailTroubleshootModal
        isOpen={true}
        userEmail={user.email}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Nhập mã bảo mật
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
              Vui lòng kiểm tra {method === "email" ? "email" : "tin nhắn"} của
              bạn để lấy tin nhắn có mã gồm 6 chữ số. Mã này có thể mất vài phút
              để đến.
            </p>

            {method === "email" && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                <div className="flex items-start">
                  <svg
                    className="w-5 h-5 text-yellow-600 mt-0.5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div className="text-sm text-yellow-800">
                    <p className="font-medium">Không nhận được email?</p>
                    <ul className="mt-1 list-disc list-inside space-y-1">
                      <li>Kiểm tra thư mục Spam/Junk</li>
                      <li>Đảm bảo email chính xác</li>
                      <li>Thử gửi lại mã xác thực</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* User Info */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="flex items-center space-x-3">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-medium text-gray-900">{user.name}</h3>
                  <p className="text-sm text-gray-600">
                    Gửi đến: {method === "email" ? user.email : user.phone}
                  </p>
                </div>
              </div>
            </div>

            {showTestCode && method === "email" && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 text-blue-600 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div className="text-sm text-blue-800">
                    <p className="font-medium">
                      Mã test cho demo:{" "}
                      <span className="font-mono bg-blue-100 px-2 py-1 rounded">
                        123456
                      </span>
                    </p>
                    <p className="text-xs mt-1">
                      Sử dụng mã này nếu không nhận được email
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Verification Code Input */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Nhập mã gồm 6 chữ số"
                value={verificationCode}
                onChange={(e) =>
                  setVerificationCode(
                    e.target.value.replace(/\D/g, "").slice(0, 6)
                  )
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg text-center tracking-widest placeholder:text-gray-600 placeholder:font-medium"
                maxLength={6}
              />
              <p className="text-sm text-gray-700 mt-1 text-center font-normal">
                Nhập 6 chữ số từ email
              </p>
            </div>

            <div className="text-center space-y-2">
              <button
                onClick={handleResendCode}
                className="text-blue-600 hover:underline text-sm font-medium"
              >
                Không nhận được mã? Gửi lại
              </button>
              {resendCount > 0 && (
                <p className="text-xs text-gray-500">
                  Đã gửi lại {resendCount} lần
                </p>
              )}

              {/* Alternative options */}
              <div className="pt-2 border-t border-gray-200">
                <p className="text-xs text-gray-600 mb-2">
                  Hoặc thử các cách khác:
                </p>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => setVerificationCode("123456")}
                    className="text-xs text-blue-600 hover:underline"
                  >
                    Dùng mã test
                  </button>
                  <button
                    onClick={() => setVerificationCode("000000")}
                    className="text-xs text-green-600 hover:underline"
                  >
                    Mã backup
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 font-medium"
            >
              Hủy
            </button>
            <button
              onClick={handleVerifyCode}
              disabled={verificationCode.length !== 6 || isLoading}
              className={`px-6 py-2 rounded-md font-medium ${
                verificationCode.length === 6 && !isLoading
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {isLoading ? "Đang xác thực..." : "Tiếp tục"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
