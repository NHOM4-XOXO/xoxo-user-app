// Home.jsx
"use client";

import { useGetMyProfileQuery } from "@/features/userApi";
import HomePage from "@/pages/HomePage";
import { useEffect } from "react";
export default function Home() {
  // Lấy profile từ API
  const { data: profile, isSuccess } = useGetMyProfileQuery();

  useEffect(() => {
    if (isSuccess && profile) {
      // Lưu profile vào localStorage để lần sau reload vẫn còn
      if (profile) {
        localStorage.setItem("profile", JSON.stringify(profile));
      }
    }
  }, [isSuccess, profile]);
  return (
    <main>
      <HomePage />
    </main>
  );
}
