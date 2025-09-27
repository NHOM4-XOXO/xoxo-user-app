// ClientProviders.js
"use client";

import { useState, createContext, useEffect } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import ClientLayout from "@/layout/ClientLayout";
import ThemeProvider from "@/components/ThemeProvider";
import StoreProvider from "@/store/StoreProvider";
import { Toaster } from "react-hot-toast";
import LoadingOverlay from "@/components/LoadingOverlay";
import { usePathname } from "next/navigation";
import Cookies from "js-cookie";
import { scheduleTokenRefresh } from "@/features/auth/authManager";


// Fonts
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const RootContext = createContext();

export default function ClientProviders({ children }) {

  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      scheduleTokenRefresh(token); // setup lại khi reload
    }
  }, []);

  const pathname = usePathname();

  // useEffect(() => {
  //   if (pathname !== "/" && pathname !== "/login" && pathname !== "/oauth2/success" && pathname !== "/games" && pathname !== "/xoxo-ai" && pathname !== "/events"
  //     && pathname !== "/messages" && pathname !== "/saved" && pathname !== "/groups" && pathname !== "/friends" && pathname !== "/videos"
  //     && pathname !== "/musics" && pathname !== "/events" && pathname !== "/forgot-password" && pathname !== "/reset-password" && pathname !== "/change-password" && pathname !== "/profile") {
  //     setIsLoading(true);
  //   }
  // }, [children, pathname]);


  return (
    <StoreProvider>
      <RootContext.Provider value={{ setIsLoading }}>
        <ThemeProvider>
          <ClientLayout className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
            {children}
          </ClientLayout>
          <Toaster position="top-right" reverseOrder={false} />
          {isLoading && <LoadingOverlay visible={isLoading} />}
        </ThemeProvider>
      </RootContext.Provider>
    </StoreProvider>
  );
}
