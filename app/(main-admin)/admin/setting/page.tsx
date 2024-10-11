import React from "react";
import { MainSettingComponent } from "./_components/main-component";
import { RoleBasedRoute } from "@/lib/AuthContext/RoleBasedRoutes";

const AdminSettingPage = () => {
  return (
    <>
      <RoleBasedRoute allowedRoles={["admin"]}>
        <MainSettingComponent />
      </RoleBasedRoute>
    </>
  );
};

export default AdminSettingPage;
