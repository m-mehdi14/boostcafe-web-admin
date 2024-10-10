import { RoleBasedRoute } from "@/lib/AuthContext/RoleBasedRoutes";
import React from "react";

const RestaurantAdminPage = () => {
  return (
    <>
      <RoleBasedRoute allowedRoles={["restaurantAdmin"]}>
        <div>Restaurant Admin Page</div>
      </RoleBasedRoute>
    </>
  );
};

export default RestaurantAdminPage;
