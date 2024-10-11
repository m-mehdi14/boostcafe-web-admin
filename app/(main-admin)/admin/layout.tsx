import React from "react";
import { Sidebar } from "./_components/Sidebar";
import { Container } from "./_components/Container";

interface MainAdminLayoutProps {
  children: React.ReactNode;
}

const MainAdminLayout: React.FC<MainAdminLayoutProps> = ({ children }) => {
  return (
    <>
      <div className="">
        <Sidebar />
        <Container>{children}</Container>
      </div>
    </>
  );
};

export default MainAdminLayout;
