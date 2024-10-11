import React from "react";

import { Toaster } from "@/components/ui/sonner";

interface MainAdminLayoutProps {
  children: React.ReactNode;
}

const MainAdminLogin: React.FC<MainAdminLayoutProps> = ({ children }) => {
  return (
    <>
      <div className="">
        <Toaster />
        {children}
      </div>
    </>
  );
};

export default MainAdminLogin;
