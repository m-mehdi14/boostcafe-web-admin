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

// Dummy data for restaurants
const restaurants = [
  "All Restaurants",
  "Restaurant A",
  "Restaurant B",
  "Restaurant C",
];

// Generate large dummy sales data for a full year
const generateSalesData = () => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const sales = Array.from(
    { length: 12 },
    () => Math.floor(Math.random() * 10000) + 1000
  );
  return {
    labels: months,
    datasets: [
      {
        label: "Sales",
        data: sales,
        borderColor: "#4c51bf",
        backgroundColor: "rgba(76, 81, 191, 0.5)",
        fill: true,
      },
    ],
  };
};

// Generate large dummy order trends data for 12 weeks
const generateOrderTrendsData = () => {
  const weeks = Array.from({ length: 12 }, (_, i) => `Week ${i + 1}`);
  const orders = Array.from(
    { length: 12 },
    () => Math.floor(Math.random() * 500) + 100
  );
  return {
    labels: weeks,
    datasets: [
      {
        label: "Orders",
        data: orders,
        backgroundColor: "#82ca9d",
      },
    ],
  };
};

// Generate larger dummy top items data
const generateTopItemsData = () => {
  const items = [
    "Burger",
    "Pizza",
    "Biryani",
    "Pasta",
    "Fries",
    "Salad",
    "Steak",
    "Sushi",
  ];
  const sales = Array.from(
    { length: items.length },
    () => Math.floor(Math.random() * 50) + 10
  );
  return {
    labels: items,
    datasets: [
      {
        label: "Top Items",
        data: sales,
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
  };
};

export const AnalyticsAndReports: React.FC = () => {
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<string>("All Restaurants");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const [salesData, setSalesData] = useState(generateSalesData());
  const [orderTrendsData, setOrderTrendsData] = useState(
    generateOrderTrendsData()
  );
  const [topItemsData, setTopItemsData] = useState(generateTopItemsData());

  // State to hold the computed total sales, total orders, and top-selling item
  const [totalSales, setTotalSales] = useState<number>(45000);
  const [totalOrders, setTotalOrders] = useState<number>(1250);
  const [topSellingItem, setTopSellingItem] = useState<string>("Burger");

  // Function to handle download of the report in PDF format
  const handleDownloadReport = () => {
    const doc = new jsPDF();
    const title = `Analytics Report for ${selectedRestaurant}`;
    doc.setFontSize(18);
    doc.text(title, 15, 20);

    const subtitle = `Date Range: ${startDate?.toLocaleDateString()} - ${endDate?.toLocaleDateString()}`;
    doc.setFontSize(12);
    doc.text(subtitle, 15, 30);

    doc.setFontSize(14);
    doc.text("Sales Data", 15, 40);
    autoTable(doc, {
      startY: 45,
      head: [["Month", "Sales"]],
      body: salesData.labels.map((label, index) => [
        label,
        `$${salesData.datasets[0].data[index].toLocaleString()}`,
      ]),
    });
    // @ts-ignore
    doc.text("Order Trends", 15, doc.lastAutoTable.finalY + 10);
    autoTable(doc, {
      // @ts-ignore
      startY: doc.lastAutoTable.finalY + 15,
      head: [["Week", "Orders"]],
      body: orderTrendsData.labels.map((label, index) => [
        label,
        orderTrendsData.datasets[0].data[index].toLocaleString(),
      ]),
    });

    // @ts-ignore
    doc.text("Top-Selling Items", 15, doc.lastAutoTable.finalY + 10);
    autoTable(doc, {
      // @ts-ignore
      startY: doc.lastAutoTable.finalY + 15,
      head: [["Item", "Sales"]],
      body: topItemsData.labels.map((label, index) => [
        label,
        topItemsData.datasets[0].data[index].toLocaleString(),
      ]),
    });

    doc.save("analytics-report.pdf");
  };

  // Function to simulate data filtering based on the restaurant and date range
  const filterData = () => {
    // For demonstration, just modify the data based on selectedRestaurant
    const multiplier = selectedRestaurant === "All Restaurants" ? 1 : 1.5;

    // Update Sales Data
    const filteredSalesData = {
      ...salesData,
      datasets: salesData.datasets.map((dataset) => ({
        ...dataset,
        data: dataset.data.map((value) => value * multiplier),
      })),
    };

    // Calculate total sales
    const totalSalesValue = filteredSalesData.datasets[0].data.reduce(
      (acc, val) => acc + val,
      0
    );
    setTotalSales(totalSalesValue);

    // Update Order Trends Data
    const filteredOrderTrendsData = {
      ...orderTrendsData,
      datasets: orderTrendsData.datasets.map((dataset) => ({
        ...dataset,
        data: dataset.data.map((value) => value * multiplier),
      })),
    };

    // Calculate total orders
    const totalOrdersValue = filteredOrderTrendsData.datasets[0].data.reduce(
      (acc, val) => acc + val,
      0
    );
    setTotalOrders(totalOrdersValue);

    // Update Top Items Data
    const filteredTopItemsData = {
      ...topItemsData,
      datasets: topItemsData.datasets.map((dataset) => ({
        ...dataset,
        data: dataset.data.map((value) => value * multiplier),
      })),
    };

    // Find top-selling item
    const maxSalesIndex = filteredTopItemsData.datasets[0].data.indexOf(
      Math.max(...filteredTopItemsData.datasets[0].data)
    );
    setTopSellingItem(filteredTopItemsData.labels[maxSalesIndex]);

    setSalesData(filteredSalesData);
    setOrderTrendsData(filteredOrderTrendsData);
    setTopItemsData(filteredTopItemsData);
  };

  // Re-filter data whenever restaurant or date range changes
  useEffect(() => {
    filterData();
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
                  {restaurants.map((restaurant) => (
                    <SelectItem key={restaurant} value={restaurant}>
                      {restaurant}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Start Date</CardTitle>
            </CardHeader>
            <CardContent>
              <DatePicker
                selected={startDate}
                onChange={setStartDate}
                placeholder="Select start date"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>End Date</CardTitle>
            </CardHeader>
            <CardContent>
              <DatePicker
                selected={endDate}
                onChange={setEndDate}
                placeholder="Select end date"
              />
            </CardContent>
          </Card>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gray-100">
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
              <Line data={salesData} options={{ responsive: true }} />
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Weekly Order Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <Bar data={orderTrendsData} options={{ responsive: true }} />
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
              <Pie data={topItemsData} options={{ responsive: true }} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
