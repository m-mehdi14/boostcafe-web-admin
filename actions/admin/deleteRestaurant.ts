// app/actions/deleteRestaurant.ts
"use server";

import axios from "axios";

// Define the input type for deleting a restaurant
interface DeleteRestaurantData {
  adminId: string; // unique identifier for the restaurant admin (user ID)
}

// Define the return type for the function
interface DeleteRestaurantResponse {
  success: boolean;
  message: string;
}

// Server action to delete a restaurant by making a DELETE request to the Express route
export async function deleteRestaurant(
  data: DeleteRestaurantData
): Promise<DeleteRestaurantResponse> {
  try {
    // Send a DELETE request to your Express route
    const response = await axios.delete(
      `https://boostcafe-backend.onrender.com/api/restaurants/${data.adminId}`
    );

    // If the request is successful, return the success response
    if (response.status === 200) {
      return {
        success: true,
        message: response.data.success || "Restaurant deleted successfully!",
      };
    }

    return {
      success: false,
      message: "Failed to delete restaurant. Please try again.",
    };
  } catch (error) {
    // Error handling based on different error types
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.response?.data || error.message);
      return {
        success: false,
        message: error.response?.data?.error || "Failed to delete restaurant.",
      };
    } else {
      console.error("Unknown error:", error);
      return {
        success: false,
        message: "An unexpected error occurred.",
      };
    }
  }
}
