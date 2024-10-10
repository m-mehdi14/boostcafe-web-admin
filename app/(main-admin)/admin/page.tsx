import { RoleBasedRoute } from "@/lib/AuthContext/RoleBasedRoutes";
import React from "react";

const MainAdminPage = () => {
  return (
    <>
      <RoleBasedRoute allowedRoles={["admin"]}>
        <div className=" text-6xl"> Main Admin Page</div>;
      </RoleBasedRoute>
    </>
  );
};

export default MainAdminPage;
