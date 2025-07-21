import Header from "@/components/main/LeftSidebar-Home/Header";
import MobileNavigation from "@/components/main/LeftSidebar-Home/MobileNavigation";
import React from "react";

const ClientLayout = ({ children }) => {
  return (
    <>
      <Header />
      <div className="mt-14">{children}</div>
      <MobileNavigation />
    </>
  );
};

export default ClientLayout;
