import React from "react";
import { OrderMainComponent } from "./_components/main-component";
import { RoleBasedRoute } from "@/lib/AuthContext/RoleBasedRoutes";

const OrderManagementPage = () => {
  return (
    <>
      <RoleBasedRoute allowedRoles={["admin"]}>
        <OrderMainComponent />
      </RoleBasedRoute>
    </>
  );
};

export default OrderManagementPage;
