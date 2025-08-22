"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import userDataManager from "@/utils/userDataManager";

const sixYearsAgo = new Date();
sixYearsAgo.setFullYear(sixYearsAgo.getFullYear() - 6);

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
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Mật khẩu không khớp.")
    .required("Vui lòng xác nhận mật khẩu."),
  birthday: yup
    .date()
    .typeError("Vui lòng chọn ngày sinh hợp lệ.")
    .max(sixYearsAgo, "Bạn phải đủ ít nhất 6 tuổi để đăng ký.")
    .required("Vui lòng chọn ngày sinh."),

  gender: yup.string().required("Vui lòng chọn giới tính."),
});

export default function SignupModal({ isOpen, onClose }) {
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
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Lưu user data
      const savedUser = userDataManager.saveUser(data);
      setSubmitSuccess(true);

      reset();

      setTimeout(() => {
        setSubmitSuccess(false);
        setIsSubmitting(false);
        onClose();
        alert("Đăng ký thành công!");
      }, 2000);
    } catch (error) {
      console.error("Lỗi khi đăng ký:", error);
      alert(error.message || "Có lỗi xảy ra khi đăng ký. Vui lòng thử lại!");
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-screen overflow-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 ">Đăng ký</h2>
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
            <div className="grid grid-cols-2 gap-3">
              <div className="relative">
                <input
                  type="text"
                  {...register("lastName")}
                  placeholder="Họ"
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg text-gray-900 placeholder-gray-500 disabled:bg-gray-100 disabled:cursor-not-allowed ${
                    errors.lastName ? "border-red-500" : "border-gray-300"
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
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg text-gray-900 placeholder-gray-500 disabled:bg-gray-100 disabled:cursor-not-allowed ${
                    errors.firstName ? "border-red-500" : "border-gray-300"
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

            <div className="relative">
              <input
                type="text"
                {...register("email")}
                placeholder="Email "
                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg text-gray-900 placeholder-gray-500 disabled:bg-gray-100 disabled:cursor-not-allowed ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Mật khẩu"
                {...register("password")}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg text-gray-900 placeholder-gray-500 disabled:bg-gray-100 disabled:cursor-not-allowed ${
                  errors.password ? "border-red-500" : "border-gray-300"
                } pr-10`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-2 top-3 text-gray-500 cursor-pointer"
                tabIndex={-1}
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

            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Nhập lại mật khẩu"
                {...register("confirmPassword")}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg text-gray-900 placeholder-gray-500 disabled:bg-gray-100 disabled:cursor-not-allowed ${
                  errors.confirmPassword ? "border-red-500" : "border-gray-300"
                } pr-10`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-2 top-3 text-gray-500 cursor-pointer"
                tabIndex={-1}
              >
                {showConfirmPassword ? (
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

            <div className="relative">
              <label className="block text-sm text-gray-600 mb-1">
                Ngày sinh
              </label>
              <input
                type="date"
                {...register("birthday")}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg text-gray-900 placeholder-gray-500 disabled:bg-gray-100 disabled:cursor-not-allowed cursor-pointer ${
                  errors.birthday ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.birthday && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1 cursor-pointer ">
                  <AlertCircle className="w-4 h-4" />
                  {errors.birthday.message}
                </p>
              )}
            </div>

            <div className="relative">
              <label className="block text-sm text-gray-600 mb-1">
                Giới tính
              </label>
              <div className="grid grid-cols-3 gap-2">
                {["female", "male", "other"].map((value) => (
                  <label
                    key={value}
                    className="flex items-center p-2 border border-gray-300 rounded-md text-gray-800 cursor-pointer"
                  >
                    <input
                      type="radio"
                      value={value}
                      {...register("gender")}
                      className="mr-2 w-5 h-5 rounded-full border-2 cursor-pointer broder-gray-200 appearance-none checked:bg-blue-600 checked:before:bg-white checked:border-blue-200 accent-blue-600"
                    />
                    <span>
                      {value === "female"
                        ? "Nữ"
                        : value === "male"
                        ? "Nam"
                        : "Khác"}
                    </span>
                  </label>
                ))}
              </div>
              {errors.gender && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.gender.message}
                </p>
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
              disabled={isSubmitting}
              className={`w-full py-2 px-4 rounded-md font-semibold transition duration-200 cursor-pointer ${
                isSubmitting
                  ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                  : submitSuccess
                  ? "bg-green-600 text-white"
                  : "bg-green-500 text-white hover:bg-green-600"
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center ">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Đang đăng ký...
                </span>
              ) : submitSuccess ? (
                <span className="flex items-center justify-center ">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Đăng ký thành công!
                </span>
              ) : (
                "Đăng ký"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
