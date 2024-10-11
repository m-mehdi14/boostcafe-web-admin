"use client";

import React from "react";

export const AddRestaurant = () => {
  return (
    <>
      {/* Restaurant Management Section */}
      <div className="p-5 mb-6 bg-white rounded-lg shadow">
        <h2 className="mb-4 text-lg font-semibold text-gray-800">
          Restaurants Management
        </h2>
        <p className="text-gray-600">
          Manage the list of restaurants, add new ones, or edit existing
          details.
        </p>
        <button className="px-4 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-700">
          Add New Restaurant
        </button>
        <div className="mt-6">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2 text-sm font-medium text-gray-700">
                  Restaurant Name
                </th>
                <th className="px-4 py-2 text-sm font-medium text-gray-700">
                  Location
                </th>
                <th className="px-4 py-2 text-sm font-medium text-gray-700">
                  Admin
                </th>
                <th className="px-4 py-2 text-sm font-medium text-gray-700">
                  Status
                </th>
                <th className="px-4 py-2 text-sm font-medium text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="px-4 py-2 text-gray-600">Pizza Palace</td>
                <td className="px-4 py-2 text-gray-600">New York</td>
                <td className="px-4 py-2 text-gray-600">John Doe</td>
                <td className="px-4 py-2">
                  <span className="px-2 py-1 text-sm font-medium text-green-700 bg-green-100 rounded-lg">
                    Active
                  </span>
                </td>
                <td className="px-4 py-2">
                  <button className="px-3 py-1 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                    Edit
                  </button>
                  <button className="ml-2 px-3 py-1 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700">
                    Delete
                  </button>
                </td>
              </tr>
              {/* Add more rows as needed */}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};
