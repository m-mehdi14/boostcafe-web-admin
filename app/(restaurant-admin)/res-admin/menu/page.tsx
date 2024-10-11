import React from "react";
import { RestaurantMenuComponent } from "./_components/main-component";
import { RoleBasedRoute } from "@/lib/AuthContext/RoleBasedRoutes";

const RestaurantMenuPage = () => {
  return (
    <>
      <RoleBasedRoute allowedRoles={["restaurantAdmin"]}>
        <RestaurantMenuComponent />
      </RoleBasedRoute>
    </>
  );
};

export default RestaurantMenuPage;
