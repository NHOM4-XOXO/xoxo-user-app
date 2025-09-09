// Home.jsx
"use client";

import { scheduleTokenRefresh } from "@/features/auth/authManager";

import HomePage from "@/pages/HomePage";
import Cookies from "js-cookie";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/features/auth/authSlice";
import { useGetMyProfileQuery } from "@/features/userApi";

export default function Home() {
  const dispatch = useDispatch();

  const token = Cookies.get("token");

  // Lấy profile từ API
  const { data: profile, isSuccess, isLoading, error } = useGetMyProfileQuery();

  useEffect(() => {
    if (token) {
      scheduleTokenRefresh(token);
    }
  }, [token]);

  useEffect(() => {
    if (isSuccess && profile) {
      dispatch(setCredentials({ profile, token })); // dùng setCredentials
    }
  }, [isSuccess, profile, dispatch, token]);

  return (
    <main>
      <HomePage />
    </main>
  );
}
