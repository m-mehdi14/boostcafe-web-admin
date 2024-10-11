"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  Cell,
} from "recharts";

const salesData = [
  { name: "January", sales: 4000 },
  { name: "February", sales: 3000 },
  { name: "March", sales: 5000 },
  { name: "April", sales: 7000 },
  { name: "May", sales: 6000 },
  { name: "June", sales: 8000 },
];

const orderTrendsData = [
  { name: "Week 1", orders: 120 },
  { name: "Week 2", orders: 200 },
  { name: "Week 3", orders: 150 },
  { name: "Week 4", orders: 250 },
];

const topItemsData = [
  { name: "Burger", value: 35 },
  { name: "Pizza", value: 25 },
  { name: "Biryani", value: 20 },
  { name: "Pasta", value: 15 },
  { name: "Fries", value: 5 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#FF4567"];

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
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData}>
                <CartesianGrid stroke="#ccc" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Weekly Order Trends
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={orderTrendsData}>
                <CartesianGrid stroke="#ccc" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="orders" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md mt-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Top-Selling Items
          </h2>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={topItemsData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={150}
                fill="#8884d8"
                label
              >
                {topItemsData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
