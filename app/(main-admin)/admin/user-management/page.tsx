import React from "react";
import { UserMainComponent } from "./_components/main-component";
import { RoleBasedRoute } from "@/lib/AuthContext/RoleBasedRoutes";

const UserMangementPage = () => {
  return (
    <>
      <RoleBasedRoute allowedRoles={["admin"]}>
        <UserMainComponent />
      </RoleBasedRoute>
    </>
  );
};

export default UserMangementPage;
