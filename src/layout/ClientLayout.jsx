"use client";

import Header from "@/components/main/LeftSidebar-Home/Header";
import MobileNavigation from "@/components/main/LeftSidebar-Home/MobileNavigation";
import { UserProvider } from "@/contexts/UserContext";
import { usePathname } from "next/navigation";
import React from "react";

const ClientLayout = ({ children }) => {
  const pathname = usePathname();

  // Danh sách các trang không hiển thị header
  const hideHeaderPaths = ["/login", "/forgot-password", "/email-verification"];
  const shouldHideHeader = hideHeaderPaths.includes(pathname);

  return (
    <UserProvider>
      {!shouldHideHeader && <Header />}
      <div className={shouldHideHeader ? "" : "mt-14"}>{children}</div>
      {!shouldHideHeader && <MobileNavigation />}
    </UserProvider>
  );
};

export default ClientLayout;
