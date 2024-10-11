import React from "react";
import { AnalyticsAndReports } from "./_components/AnalyticsAndReports";
import { RoleBasedRoute } from "@/lib/AuthContext/RoleBasedRoutes";

const RestaurantAnalysisPage = () => {
  return (
    <>
      <RoleBasedRoute allowedRoles={['admin']}>
        <AnalyticsAndReports />
      </RoleBasedRoute>
    </>
  );
};

export default RestaurantAnalysisPage;
