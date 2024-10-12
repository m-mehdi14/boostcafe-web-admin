"use client";
import { RoleBasedRoute } from "@/lib/AuthContext/RoleBasedRoutes";
import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card"; // Assuming you have a Card component or create a simple div with card styles
import { useRouter } from "next/navigation";

export const RestaurantAdminComponent: React.FC = () => {
  const router = useRouter();
  return (
    <>
      <RoleBasedRoute allowedRoles={["restaurantAdmin"]}>
        <div className="p-6 bg-gray-100 min-h-screen">
          <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
            <h1 className="text-3xl font-semibold text-blue-700">
              Restaurant Admin Dashboard
            </h1>
            <p className="text-gray-600 mt-2">
              Manage your restaurant&apos;s profile, menu, orders, and more.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Restaurant Profile Management */}
            <Card className="bg-blue-50 p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-blue-600 mb-4">
                Profile Management
              </h2>
              <p className="text-gray-600 mb-4">
                Update restaurant information, contact details, and opening
                hours.
              </p>
              <Button
                onClick={() => router.push("/res-admin/profile")}
                className="bg-blue-600 text-white w-full"
              >
                Manage Profile
              </Button>
            </Card>

            {/* Menu Management */}
            <Card className="bg-green-50 p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-green-600 mb-4">
                Menu Management
              </h2>
              <p className="text-gray-600 mb-4">
                Add, edit, or remove menu items to keep your menu up-to-date.
              </p>
              <Button
                onClick={() => router.push("/res-admin/menu")}
                className="bg-green-600 text-white w-full"
              >
                Manage Menu
              </Button>
            </Card>

            {/* Order Management */}
            <Card className="bg-yellow-50 p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-yellow-600 mb-4">
                Order Management
              </h2>
              <p className="text-gray-600 mb-4">
                View and update the status of customer orders in real-time.
              </p>
              <Button
                onClick={() => router.push("/res-admin/order")}
                className="bg-yellow-600 text-white w-full"
              >
                Manage Orders
              </Button>
            </Card>

            {/* Analytics and Reports */}
            {/* <Card className="bg-purple-50 p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-purple-600 mb-4">
                Analytics & Reports
              </h2>
              <p className="text-gray-600 mb-4">
                Track sales, popular menu items, and customer feedback.
              </p>
              <Button className="bg-purple-600 text-white w-full">
                View Analytics
              </Button>
            </Card> */}

            {/* Promotions Management */}
            {/* <Card className="bg-pink-50 p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-pink-600 mb-4">
                Promotions Management
              </h2>
              <p className="text-gray-600 mb-4">
                Create and manage special offers or discounts for customers.
              </p>
              <Button className="bg-pink-600 text-white w-full">
                Manage Promotions
              </Button>
            </Card> */}

            {/* Reviews & Feedback */}
            {/* <Card className="bg-indigo-50 p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-indigo-600 mb-4">
                Reviews & Feedback
              </h2>
              <p className="text-gray-600 mb-4">
                Read customer reviews and respond to their feedback.
              </p>
              <Button className="bg-indigo-600 text-white w-full">
                View Feedback
              </Button>
            </Card> */}
          </div>
        </div>
      </RoleBasedRoute>
    </>
  );
};
