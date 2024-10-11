"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Line, Bar, Pie } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const salesData = {
  labels: ["January", "February", "March", "April", "May", "June"],
  datasets: [
    {
      label: "Sales",
      data: [4000, 3000, 5000, 7000, 6000, 8000],
      borderColor: "#4c51bf",
      backgroundColor: "rgba(76, 81, 191, 0.5)",
      fill: true,
    },
  ],
};

const orderTrendsData = {
  labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
  datasets: [
    {
      label: "Orders",
      data: [120, 200, 150, 250],
      backgroundColor: "#82ca9d",
    },
  ],
};

const topItemsData = {
  labels: ["Burger", "Pizza", "Biryani", "Pasta", "Fries"],
  datasets: [
    {
      label: "Top Items",
      data: [35, 25, 20, 15, 5],
      backgroundColor: ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#FF4567"],
    },
  ],
};

export const AnalyticsAndReports: React.FC = () => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold text-gray-800">
            Analytics & Reports
          </h1>
          <Button className="bg-blue-600 text-white hover:bg-blue-700">
            Download Report
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-100 p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray-700">Total Sales</h2>
            <p className="text-3xl font-bold text-gray-800 mt-2">$45,000</p>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray-700">
              Total Orders
            </h2>
            <p className="text-3xl font-bold text-gray-800 mt-2">1,250</p>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray-700">
              Top-Selling Item
            </h2>
            <p className="text-3xl font-bold text-gray-800 mt-2">Burger</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Sales Over Time
            </h2>
            <Line data={salesData} options={{ responsive: true }} />
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Weekly Order Trends
            </h2>
            <Bar data={orderTrendsData} options={{ responsive: true }} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md mt-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Top-Selling Items
          </h2>
          <div className="w-full flex justify-center">
            <div className="w-140 h-140">
              <Pie data={topItemsData} options={{ responsive: true }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
