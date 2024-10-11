import React from "react";
import { RestaurantProfileComponent } from "./_components/main-component";
import { RoleBasedRoute } from "@/lib/AuthContext/RoleBasedRoutes";

const RestaurantProfilePage = () => {
  return (
    <>
      <RoleBasedRoute allowedRoles={["restaurantAdmin"]}>
        <RestaurantProfileComponent />
      </RoleBasedRoute>
    </>
  );
};

export default RestaurantProfilePage;
