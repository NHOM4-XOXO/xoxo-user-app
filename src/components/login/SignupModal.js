"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { AlertCircle, Eye, EyeOff, CheckCircle, XCircle } from "lucide-react";
import { useDispatch } from "react-redux";
import { useRegisterMutation } from "@/features/auth/authApi";

const schema = yup.object().shape({
  firstName: yup.string().required("Vui lòng nhập tên."),
  lastName: yup.string().required("Vui lòng nhập họ."),
  email: yup
    .string()
    .required("Vui lòng nhập email.")
    .test("email", "Email không hợp lệ.", (value) =>
      /^[a-zA-Z0-9._%+-]+@(?:gmail\.com|yahoo\.com|outlook\.com|example\.com)$/.test(
        value || ""
      )
    ),
  password: yup
    .string()
    .required("Vui lòng nhập mật khẩu.")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/,
      "Mật khẩu phải có ít nhất 6 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt."
    ),
});

export default function SignupModal({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const [registerUser, { isLoading }] = useRegisterMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = async (data) => {
    try {
      const res = await registerUser(data).unwrap();

      // Đăng ký thành công
      reset();
      setSuccessModalOpen(true);
    } catch (error) {
      console.error("Lỗi khi đăng ký:", error);
      setErrorMessage(error?.data?.message || "Có lỗi xảy ra khi đăng ký!");
      setErrorModalOpen(true);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Signup Modal */}
      <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-screen overflow-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Đăng ký</h2>
                <p className="text-gray-600">Nhanh chóng và dễ dàng.</p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 cursor-pointer hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Họ + Tên */}
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <input
                    type="text"
                    {...register("lastName")}
                    placeholder="Họ"
                    className={`w-full px-3 py-2 border rounded-md text-lg ${errors.lastName ? "border-red-500" : "border-gray-300"
                      }`}
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
                <div className="relative">
                  <input
                    type="text"
                    {...register("firstName")}
                    placeholder="Tên"
                    className={`w-full px-3 py-2 border rounded-md text-lg ${errors.firstName ? "border-red-500" : "border-gray-300"
                      }`}
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.firstName.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="relative">
                <input
                  type="text"
                  {...register("email")}
                  placeholder="Email"
                  className={`w-full px-3 py-2 border rounded-md text-lg ${errors.email ? "border-red-500" : "border-gray-300"
                    }`}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Mật khẩu"
                  {...register("password")}
                  className={`w-full px-3 py-2 border rounded-md text-lg pr-10 ${errors.password ? "border-red-500" : "border-gray-300"
                    }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-2 top-3 text-gray-500 cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.password.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2 px-4 rounded-md font-semibold transition duration-200 bg-green-500 text-white hover:bg-green-600"
              >
                {isLoading ? "Đang xử lý..." : "Đăng ký"}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {successModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg text-center max-w-sm w-full">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Đăng ký thành công!
            </h3>
            <p className="text-gray-600 mb-4">
              Vui lòng kiểm tra email để xác thực tài khoản của bạn.
            </p>
            <button
              onClick={() => {
                setSuccessModalOpen(false);
                onClose();
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {errorModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg text-center max-w-sm w-full">
            <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Đăng ký thất bại!
            </h3>
            <p className="text-gray-600 mb-4">{errorMessage}</p>
            <button
              onClick={() => setErrorModalOpen(false)}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Thử lại
            </button>
          </div>
        </div>
      )}
    </>
  );
}
