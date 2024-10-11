import React from "react";
import { RestaurantOrderManagement } from "./_components/res-order-manage";
import { RoleBasedRoute } from "@/lib/AuthContext/RoleBasedRoutes";

const RestaurantOrderPage = () => {
  return (
    <>
      <RoleBasedRoute allowedRoles={["restaurantAdmin"]}>
        <RestaurantOrderManagement />
      </RoleBasedRoute>
    </>
  );
};

export default RestaurantOrderPage;
