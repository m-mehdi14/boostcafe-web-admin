/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";

import React, { useState, useEffect } from "react";
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
import jsPDF from "jspdf"; // For PDF generation
import autoTable from "jspdf-autotable"; // For structured tables in the PDF
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DatePicker } from "@/components/ui/date-picker";
import { getOrders } from "@/actions/admin/get-orders"; // Import order fetching logic
import { getRestaurantsForAnalytics } from "@/actions/admin/getRestaurants"; // Import restaurant fetching logic

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

interface Order {
  orderDate: string;
  totalAmount: number;
  restaurantName: string;
  cartItems: {
    name: string;
    quantity: number;
  }[];
}

interface SalesData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
    fill: boolean;
  }[];
}

interface OrderTrendsData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
  }[];
}

interface TopItemsData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string[];
  }[];
}

interface Restaurant {
  id: string;
  name: string;
}

export const AnalyticsAndReports: React.FC = () => {
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<string>("All Restaurants");
  console.log("🚀 ~ selectedRestaurant:", selectedRestaurant);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [salesData, setSalesData] = useState<SalesData | null>(null);
  const [orderTrendsData, setOrderTrendsData] =
    useState<OrderTrendsData | null>(null);
  const [topItemsData, setTopItemsData] = useState<TopItemsData | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]); // State for restaurants
  const [totalSales, setTotalSales] = useState<number>(0);
  const [totalOrders, setTotalOrders] = useState<number>(0);
  const [topSellingItem, setTopSellingItem] = useState<string>("");

  // Fetch and process restaurant data
  const fetchRestaurants = async () => {
    try {
      // @ts-ignore
      const restaurantsData: Restaurant[] = await getRestaurantsForAnalytics();
      setRestaurants(restaurantsData);
    } catch (error) {
      console.error("Error fetching restaurants:", error);
    }
  };

  // Fetch and process the real order data based on restaurant and date filters
  const fetchAndProcessOrders = async () => {
    try {
      // @ts-ignore
      const orders: Order[] = await getOrders();
      if (orders.length === 0) return;

      const filteredOrders = orders.filter((order) => {
        const orderDate = new Date(order.orderDate);
        return (
          (selectedRestaurant === "All Restaurants" ||
            order.restaurantName === selectedRestaurant) &&
          (!startDate || orderDate >= startDate) &&
          (!endDate || orderDate <= new Date(endDate.setHours(23, 59, 59, 999))) // Ensure we include the whole day
        );
      });

      const salesByMonth: { [key: string]: number } = {};
      const ordersByWeek: { [key: string]: number } = {};
      const itemSales: { [key: string]: number } = {};

      filteredOrders.forEach((order) => {
        const orderDate = new Date(order.orderDate);
        const month = orderDate.toLocaleString("default", { month: "long" });
        const week = `Week ${Math.ceil(orderDate.getDate() / 7)}`;

        // Accumulate sales by month
        salesByMonth[month] = (salesByMonth[month] || 0) + order.totalAmount;

        // Accumulate orders by week
        ordersByWeek[week] = (ordersByWeek[week] || 0) + 1;

        // Accumulate item sales
        order.cartItems.forEach((item) => {
          itemSales[item.name] = (itemSales[item.name] || 0) + item.quantity;
        });
      });

      // Update Sales Data
      const salesLabels = Object.keys(salesByMonth);
      const salesValues = Object.values(salesByMonth);
      setSalesData({
        labels: salesLabels,
        datasets: [
          {
            label: "Sales",
            data: salesValues,
            borderColor: "#4c51bf",
            backgroundColor: "rgba(76, 81, 191, 0.5)",
            fill: true,
          },
        ],
      });

      // Update Order Trends Data
      const orderLabels = Object.keys(ordersByWeek);
      const orderValues = Object.values(ordersByWeek);
      setOrderTrendsData({
        labels: orderLabels,
        datasets: [
          {
            label: "Orders",
            data: orderValues,
            backgroundColor: "#82ca9d",
          },
        ],
      });

      // Update Top Items Data
      const itemLabels = Object.keys(itemSales);
      const itemValues = Object.values(itemSales);
      setTopItemsData({
        labels: itemLabels,
        datasets: [
          {
            label: "Top Items",
            data: itemValues,
            backgroundColor: [
              "#0088FE",
              "#00C49F",
              "#FFBB28",
              "#FF8042",
              "#FF4567",
              "#AF19FF",
              "#FF6F91",
              "#FF9671",
            ],
          },
        ],
      });

      // Calculate Total Sales and Orders
      setTotalSales(salesValues.reduce((a, b) => a + b, 0));
      setTotalOrders(orderValues.reduce((a, b) => a + b, 0));

      // Find the top-selling item
      const topItem = itemLabels[itemValues.indexOf(Math.max(...itemValues))];
      setTopSellingItem(topItem);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  // Function to handle report download
  const handleDownloadReport = () => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(18);
    doc.text("Analytics Report", 14, 22);

    // Total Sales
    doc.setFontSize(12);
    doc.text(`Total Sales: $${totalSales.toLocaleString()}`, 14, 32);

    // Total Orders
    doc.text(`Total Orders: ${totalOrders.toLocaleString()}`, 14, 42);

    // Top-Selling Item
    doc.text(`Top-Selling Item: ${topSellingItem}`, 14, 52);

    // Add AutoTable for a detailed breakdown
    autoTable(doc, {
      head: [["Month", "Sales"]],
      body: salesData
        ? salesData.labels.map((label, index) => [
            label,
            salesData.datasets[0].data[index].toLocaleString(),
          ])
        : [],
    });

    doc.save("analytics_report.pdf");
  };

  // Re-fetch data when filters change
  useEffect(() => {
    fetchRestaurants(); // Fetch restaurants when component mounts
  }, []);

  useEffect(() => {
    // Fetch data when restaurant or date range changes
    fetchAndProcessOrders();
  }, [selectedRestaurant, startDate, endDate]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold text-gray-800">
            Analytics & Reports
          </h1>
          <Button
            className="bg-blue-600 text-white hover:bg-blue-700"
            onClick={handleDownloadReport}
          >
            Download Report
          </Button>
        </div>

        {/* Filters: Restaurant and Date Range */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Select Restaurant</CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={selectedRestaurant}
                onValueChange={setSelectedRestaurant}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Restaurant" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Restaurants">
                    All Restaurants
                  </SelectItem>
                  {restaurants.map((restaurant) => (
                    <SelectItem key={restaurant.id} value={restaurant.id}>
                      {restaurant.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Select Start Date</CardTitle>
            </CardHeader>
            <CardContent>
              <DatePicker
                placeholder="Start Date"
                selected={startDate}
                onChange={setStartDate}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Select End Date</CardTitle>
            </CardHeader>
            <CardContent>
              <DatePicker
                placeholder="End Date"
                selected={endDate}
                onChange={setEndDate}
              />
            </CardContent>
          </Card>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Total Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-800 mt-2">
                ${totalSales.toLocaleString()}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-100">
            <CardHeader>
              <CardTitle>Total Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-800 mt-2">
                {totalOrders.toLocaleString()}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-100">
            <CardHeader>
              <CardTitle>Top-Selling Item</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-800 mt-2">
                {topSellingItem}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Sales Over Time and Weekly Order Trends Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Sales Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              {salesData && (
                <Line data={salesData} options={{ responsive: true }} />
              )}
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Weekly Order Trends</CardTitle>
            </CardHeader>
            <CardContent>
              {orderTrendsData && (
                <Bar data={orderTrendsData} options={{ responsive: true }} />
              )}
            </CardContent>
          </Card>
        </div>

        {/* Top-Selling Items Pie Chart */}
        <Card className="bg-white mt-8">
          <CardHeader>
            <CardTitle>Top-Selling Items</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <div className="w-140 h-140">
              {topItemsData && (
                <Pie data={topItemsData} options={{ responsive: true }} />
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
