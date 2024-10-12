// pages/MainAdminPage.js

import { RoleBasedRoute } from "@/lib/AuthContext/RoleBasedRoutes";
import React from "react";
import { AddRestaurant } from "./_components/Add-restaurant";
import { getTotalRestaurants } from "@/actions/get-total-restaurants";
import { getTotalUsers } from "@/actions/get-total-users";

const MainAdminPage = async () => {
  const totalRestaurants = await getTotalRestaurants();
  const totalUsers = await getTotalUsers();
  console.log("🚀 ~ MainAdminPage ~ totalRestaurants:", totalRestaurants);
  return (
    <>
      <RoleBasedRoute allowedRoles={["admin"]}>
        <div className="p-6 bg-gray-100">
          {/* Dashboard Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-semibold text-gray-800">
              Restaurant Management Dashboard
            </h1>
            <p className="text-gray-600">
              Manage restaurants, orders, users, and other settings
            </p>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="p-5 bg-white rounded-lg shadow">
              <h2 className="text-sm font-medium text-gray-500">
                Total Restaurants
              </h2>
              <p className="mt-1 text-2xl font-bold text-gray-800">
                {totalRestaurants.data ? totalRestaurants.data : 0}
              </p>
            </div>
            <div className="p-5 bg-white rounded-lg shadow">
              <h2 className="text-sm font-medium text-gray-500">
                Total Orders
              </h2>
              <p className="mt-1 text-2xl font-bold text-gray-800">345</p>
            </div>
            <div className="p-5 bg-white rounded-lg shadow">
              <h2 className="text-sm font-medium text-gray-500">Users</h2>
              <p className="mt-1 text-2xl font-bold text-gray-800">
                {totalUsers.data ? totalUsers.data : 0}
              </p>
            </div>
            <div className="p-5 bg-white rounded-lg shadow">
              <h2 className="text-sm font-medium text-gray-500">
                Monthly Revenue
              </h2>
              <p className="mt-1 text-2xl font-bold text-gray-800">$45,000</p>
            </div>
          </div>
          <AddRestaurant />
          {/* Order Management Section */}
          {/* <div className="p-5 mb-6 bg-white rounded-lg shadow">
            <h2 className="mb-4 text-lg font-semibold text-gray-800">
              Order Management
            </h2>
            <p className="text-gray-600">
              Monitor and manage orders from all restaurants.
            </p>
            <button className="px-4 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-700">
              View All Orders
            </button>
          </div> */}

          {/* User Management Section */}
          {/* <div className="p-5 mb-6 bg-white rounded-lg shadow">
            <h2 className="mb-4 text-lg font-semibold text-gray-800">
              User Management
            </h2>
            <p className="text-gray-600">
              Manage registered users and their details.
            </p>
            <button className="px-4 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-700">
              View All Users
            </button>
          </div> */}

          {/* Settings and Configurations */}
          {/* <div className="p-5 bg-white rounded-lg shadow">
            <h2 className="mb-4 text-lg font-semibold text-gray-800">
              Settings
            </h2>
            <p className="text-gray-600">
              Configure app settings, roles, and permissions.
            </p>
            <button className="px-4 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-700">
              Go to Settings
            </button>
          </div> */}
        </div>
      </RoleBasedRoute>
    </>
  );
};

export default MainAdminPage;
