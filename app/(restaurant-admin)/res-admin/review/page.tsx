import React from "react";
import { ReviewsAndFeedback } from "./_components/review&feedback";
import { RoleBasedRoute } from "@/lib/AuthContext/RoleBasedRoutes";

const ReviewPage = () => {
  return (
    <>
      <RoleBasedRoute allowedRoles={["restaurantAdmin"]}>
        <ReviewsAndFeedback />
      </RoleBasedRoute>
    </>
  );
};

export default ReviewPage;
