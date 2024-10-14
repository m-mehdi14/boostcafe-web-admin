"use server";

import axios from "axios";

// Define the data type for changing restaurant password
interface ChangePasswordData {
  adminId: string;
  newPassword: string;
  creatorId: string;
}

// Function to change the restaurant admin's password
export async function changeRestaurantPassword(data: ChangePasswordData) {
  try {
    // Call the backend API endpoint
    const response = await axios.post(
      "https://boostcafe-backend.onrender.com/api/restaurant/change-password",
      {
        adminId: data.adminId,
        newPassword: data.newPassword,
        creatorId: data.creatorId,
      }
    );
    console.log("🚀 ~ changeRestaurantPassword ~ response:", response);

    if (response.data.success) {
      return { success: true, message: "Password updated successfully." };
    } else {
      return {
        success: false,
        message: response.data.error || "Failed to change password.",
      };
    }
  } catch (error) {
    console.error("Error changing restaurant password:", error);

    return { success: false, message: "Failed to change password." };
  }
}
