import { RoleBasedRoute } from "@/lib/AuthContext/RoleBasedRoutes";
import React from "react";
import { RestaurantAdminComponent } from "./_components/main-component";

const RestaurantAdminPage = () => {
  return (
    <>
      <RoleBasedRoute allowedRoles={["restaurantAdmin"]}>
        <RestaurantAdminComponent />
      </RoleBasedRoute>
    </>
  );
};

export default RestaurantAdminPage;
