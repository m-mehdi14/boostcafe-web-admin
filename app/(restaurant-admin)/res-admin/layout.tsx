import React from "react";
import { Sidebar } from "./_components/Sidebar";
import { Container } from "./_components/Container";
import { Toaster } from "@/components/ui/sonner";

interface MainAdminLayoutProps {
  children: React.ReactNode;
}

const MainRestaurantLayout: React.FC<MainAdminLayoutProps> = ({ children }) => {
  return (
    <>
      <div className="">
        <Sidebar />
        <Container>
          <Toaster />
          {children}
        </Container>
      </div>
    </>
  );
};

export default MainRestaurantLayout;
