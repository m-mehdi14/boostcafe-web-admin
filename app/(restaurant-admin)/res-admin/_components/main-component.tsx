/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";
import React, { useState, useEffect } from "react";
import { getOrders } from "@/actions/restaurant-admin/getOrders";
import { Bar } from "react-chartjs-2";
import { Card } from "@/components/ui/card";
import { RoleBasedRoute } from "@/lib/AuthContext/RoleBasedRoutes";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useAuth } from "@/lib/AuthContext/AuthContext";
import { MoonLoader } from "react-spinners";

// Register chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Types for the order data
type OrderStatus = "Placed" | "Processing" | "Completed" | "Cancelled";

interface Order {
  id: string;
  orderStatus: OrderStatus;
  // Add other properties if needed
}

interface User {
  uid: string;
  restaurantId?: string;
  // Add other user properties if needed
}

// Define the Auth context type
interface AuthContextType {
  user: User | null;
}

// Component definition
export const RestaurantAdminComponent: React.FC = () => {
  const { user } = useAuth() as AuthContextType; // Type assertion for user
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Get the restaurantId from the authenticated user object
  const restaurantId = user?.uid;
  console.log("🚀 ~ restaurantId:", restaurantId);

  useEffect(() => {
    if (restaurantId) {
      const fetchOrders = async () => {
        try {
          const fetchedOrders = await getOrders(restaurantId);
          // @ts-ignore
          setOrders(fetchedOrders);
        } catch (error) {
          console.error("Error fetching orders:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchOrders();
    }
  }, [restaurantId]);

  // Calculate analytics data based on order statuses
  const totalOrders = orders.length;
  const totalPlaced = orders.filter(
    (order) => order.orderStatus === "Placed"
  ).length;
  const totalProcessing = orders.filter(
    (order) => order.orderStatus === "Processing"
  ).length;
  const totalCompleted = orders.filter(
    (order) => order.orderStatus === "Completed"
  ).length;
  const totalCanceled = orders.filter(
    (order) => order.orderStatus === "Cancelled"
  ).length;

  // Data for Bar Chart
  const chartData = {
    labels: ["Total Orders", "Placed", "Processing", "Completed", "Canceled"],
    datasets: [
      {
        label: "Order Status",
        data: [
          totalOrders,
          totalPlaced,
          totalProcessing,
          totalCompleted,
          totalCanceled,
        ],
        backgroundColor: [
          "rgba(54, 162, 235, 0.6)", // Blue for Total
          "rgba(75, 192, 192, 0.6)", // Green for Placed
          "rgba(255, 206, 86, 0.6)", // Yellow for Processing
          "rgba(153, 102, 255, 0.6)", // Purple for Completed
          "rgba(255, 99, 132, 0.6)", // Red for Canceled
        ],
        borderColor: [
          "rgba(54, 162, 235, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 99, 132, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  // Render loading state if orders are still being fetched
  if (loading) {
    return (
      <div className=" min-h-screen w-full flex flex-row items-center justify-center">
        <MoonLoader size={35} />
      </div>
    );
  }

  return (
    <RoleBasedRoute allowedRoles={["restaurantAdmin"]}>
      <div className="p-6 bg-gray-100 min-h-screen">
        <div className="bg-white p-6 rounded-lg mb-6">
          <h1 className="text-3xl font-semibold text-blue-700">
            Restaurant Admin Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your restaurant&apos;s profile, menu, orders, and more.
          </p>
        </div>

        {/* Order Analytics */}
        <div className="mt-8 bg-white p-6 rounded-lg">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Orders Analytics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-blue-50 p-6 rounded-lg shadow-md">
              <h3 className="text-2xl font-semibold text-blue-600">
                Total Orders
              </h3>
              <p className="text-4xl text-blue-600 font-bold mt-4">
                {totalOrders}
              </p>
            </Card>

            <Card className="bg-green-50 p-6 rounded-lg shadow-md">
              <h3 className="text-2xl font-semibold text-green-600">
                Completed
              </h3>
              <p className="text-4xl text-green-600 font-bold mt-4">
                {totalCompleted}
              </p>
            </Card>

            <Card className="bg-yellow-50 p-6 rounded-lg shadow-md">
              <h3 className="text-2xl font-semibold text-yellow-600">
                Processing
              </h3>
              <p className="text-4xl text-yellow-600 font-bold mt-4">
                {totalProcessing}
              </p>
            </Card>

            <Card className="bg-red-50 p-6 rounded-lg shadow-md">
              <h3 className="text-2xl font-semibold text-red-600">Canceled</h3>
              <p className="text-4xl text-red-600 font-bold mt-4">
                {totalCanceled}
              </p>
            </Card>
          </div>
        </div>

        {/* Bar Chart for Order Analytics */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Orders Analytics Chart
          </h2>
          <div className="h-80 w-full">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>
      </div>
    </RoleBasedRoute>
  );
};
