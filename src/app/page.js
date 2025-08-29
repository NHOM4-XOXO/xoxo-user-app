"use client";

import { scheduleTokenRefresh } from "@/features/auth/authManager";
import HomePage from "@/pages/HomePage";
import Cookies from "js-cookie";
import { useEffect } from "react";


export default function Home() {
  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      scheduleTokenRefresh(token);
    }
  }, []);
  return (
    <main>
      <HomePage />
    </main>
  );
}
