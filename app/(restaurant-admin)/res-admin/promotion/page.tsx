import React from "react";
import { PromotionsManagement } from "./_components/promotions";
import { RoleBasedRoute } from "@/lib/AuthContext/RoleBasedRoutes";

const PromotionPage = () => {
  return (
    <>
      <RoleBasedRoute allowedRoles={["restaurantAdmin"]}>
        <PromotionsManagement />
      </RoleBasedRoute>
    </>
  );
};

export default PromotionPage;
