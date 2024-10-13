/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";
import { RoleBasedRoute } from "@/lib/AuthContext/RoleBasedRoutes";
import React, { useState } from "react";
// import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
// import { useRouter } from "next/navigation";
import { Bar } from "react-chartjs-2"; // Import Bar chart from chartjs
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Static order data for demonstration purposes
const staticOrders = [
  { id: "ORD-001", status: "placed" },
  { id: "ORD-002", status: "processing" },
  { id: "ORD-003", status: "completed" },
  { id: "ORD-004", status: "canceled" },
  { id: "ORD-005", status: "placed" },
  { id: "ORD-006", status: "processing" },
  { id: "ORD-007", status: "completed" },
  { id: "ORD-008", status: "canceled" },
  { id: "ORD-009", status: "completed" },
];

export const RestaurantAdminComponent: React.FC = () => {
  // @ts-ignore
  const [orders, setOrders] = useState(staticOrders);
  console.log("🚀 ~ setOrders:", setOrders);

  // Calculate analytics data based on order statuses
  const totalOrders = orders.length;
  const totalPlaced = orders.filter(
    (order) => order.status === "placed"
  ).length;
  const totalProcessing = orders.filter(
    (order) => order.status === "processing"
  ).length;
  const totalCompleted = orders.filter(
    (order) => order.status === "completed"
  ).length;
  const totalCanceled = orders.filter(
    (order) => order.status === "canceled"
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
    maintainAspectRatio: false, // Allow custom width and height
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <>
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
          <div className="mt-8 bg-white p-6 rounded-lg ">
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
                <h3 className="text-2xl font-semibold text-red-600">
                  Canceled
                </h3>
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
              {" "}
              {/* Set chart size */}
              <Bar data={chartData} options={chartOptions} />
            </div>
          </div>
        </div>
      </RoleBasedRoute>
    </>
  );
};
