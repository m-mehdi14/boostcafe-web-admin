"use server";

import axios from "axios";

// Define the data type for deleting a user
interface DeleteUserData {
  userId: string;
}

// Function to delete a user by making an HTTP DELETE request to the backend API
export async function deleteUser(data: DeleteUserData) {
  try {
    // Call the backend API endpoint
    const response = await axios.delete(
      `https://boostcafe-backend.onrender.com/api/users/${data.userId}`
    );

    if (response.data.success) {
      return { success: true, message: "User deleted successfully." };
    } else {
      return {
        success: false,
        message: response.data.error || "Failed to delete user.",
      };
    }
  } catch (error) {
    console.error("Error deleting user:", error);

    return { success: false, message: "Failed to delete user." };
  }
}
