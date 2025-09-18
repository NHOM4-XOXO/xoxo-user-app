"use client";

import { useEffect, useState } from "react";
import SignupModal from "./SignupModal";


import { useDispatch } from "react-redux";
import { useLoginMutation } from "@/features/auth/authApi";
import { setCredentials } from "@/features/auth/authSlice";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { scheduleTokenRefresh } from "@/features/auth/authManager";
import GoogleLoginButton from "./GoogleLoginButton";


export default function LoginForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [error, setError] = useState("");

  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();
  const [verifyMessage, setVerifyMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    const message = localStorage.getItem("verifyMessage");
    if (message) {
      setVerifyMessage(message);
      localStorage.removeItem("verifyMessage"); // clear sau khi hiển thị
    }
  }, []);


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error when user types
    if (error) setError("");
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login(formData).unwrap();
      const { email, token } = res.data; // backend trả ra gì thì lấy thêm

      dispatch(setCredentials({ email, token }));
      scheduleTokenRefresh(token);

      console.log("Đăng nhập thành công!");
      router.replace("/");
    } catch (err) {
      console.error("Login error:", err);
      setError(err?.data?.message || "Đăng nhập thất bại");
    }
  };

  // const handleGoogleLogin = () => {
  //   const popup = window.open(
  //     `${process.env.NEXT_PUBLIC_API_URL}/oauth2/authorization/google`, // endpoint Google OAuth
  //     "GoogleLogin",
  //     "width=500,height=600"
  //   );

  //   const handleMessage = (event) => {
  //     if (event.origin !== window.location.origin) return; // chỉ chấp nhận từ origin của bạn

  //     const { type, token, profile } = event.data;
  //     if (type === "OAUTH2_DONE" && token) {
  //       dispatch(setCredentials({ token, profile })); // lưu vào Redux
  //       router.replace("/"); // redirect home
  //       popup.close();
  //       window.removeEventListener("message", handleMessage);
  //     }
  //   };

  //   window.addEventListener("message", handleMessage);

  //   // kiểm tra popup có bị đóng không
  //   const timer = setInterval(() => {
  //     if (popup.closed) {
  //       clearInterval(timer);
  //       window.removeEventListener("message", handleMessage);
  //     }
  //   }, 500);
  // };


  return (
    <>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl w-full space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left side - Branding */}
            <div className="text-center lg:text-left">
              <div className="flex justify-center lg:justify-start">
                <img
                  src="/logo_xoxo_500px-removebg-preview.png"
                  alt="Logo"
                  className="h-50 w-50 rounded-full"
                />
              </div>
              <p className="text-2xl text-gray-600 max-w-md mx-auto lg:mx-0">
                <span className="text-blue-600">
                  <b>XOXO</b>
                </span>{" "}
                giúp bạn kết nối và chia sẻ với mọi người trong cuộc sống của
                bạn.
              </p>
            </div>

            {/* Right side - Login Form */}
            <div className="max-w-md mx-auto w-full">
              <div className="bg-white rounded-lg shadow-lg p-8">
                {error && (
                  <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <input
                      type="email"
                      name="email"
                      placeholder="Email "
                      value={formData.email}
                      onChange={handleChange}
                      required
                      disabled={isLoading}
                      className="w-full px-4 py-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg text-gray-900 placeholder-gray-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <input
                      type="password"
                      name="password"
                      placeholder="Mật khẩu"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      disabled={isLoading}
                      className="w-full px-4 py-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg text-gray-900 placeholder-gray-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-3 px-4 rounded-md font-semibold text-lg transition duration-200 cursor-pointer ${isLoading
                      ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                      }`}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
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
                        Đang đăng nhập...
                      </span>
                    ) : (
                      "Đăng nhập"
                    )}
                  </button>
                </form>

                <button
                  type="button"
                  onClick={() => {
                    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/login`;
                  }}
                  className="w-full mt-4 flex items-center justify-center gap-2 bg-red-500 text-white py-3 px-4 rounded-md hover:bg-red-600 transition duration-200 text-lg font-semibold cursor-pointer"
                >
                  <img src="https://www.svgrepo.com/show/355037/google.svg" alt="Google" className="w-5 h-5" />
                  Đăng nhập bằng Google
                </button>

                {/* <GoogleLoginButton /> */}


                <div className="mt-4 text-center">
                  <a
                    href="/forgot-password"
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Quên mật khẩu?
                  </a>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setIsSignupModalOpen(true)}
                    className="w-full bg-green-500 text-white py-3 px-4 rounded-md hover:bg-green-600 transition duration-200 text-lg font-semibold cursor-pointer"
                  >
                    Tạo tài khoản mới
                  </button>
                </div>
              </div>

              <div className="mt-6 text-center text-sm text-gray-600">
                <p>
                  <strong>Tạo Trang</strong> dành cho người nổi tiếng, thương
                  hiệu hoặc doanh nghiệp.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <SignupModal
        isOpen={isSignupModalOpen}
        onClose={() => setIsSignupModalOpen(false)}
      />

      {verifyMessage && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded shadow-lg text-center">
            <p>{verifyMessage}</p>
            <button
              onClick={() => setVerifyMessage("")}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </>
  );
}
