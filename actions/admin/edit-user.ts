"use server";
import axios from "axios";

// Define the data structure for updating the user
interface EditUser {
  userId: string;
  name?: string;
  email?: string;
  role?: "admin" | "user";
}

export async function editUser(data: EditUser) {
  try {
    // Make a PUT request to your Express API to update the user
    const response = await axios.put(
      `https://boostcafe-backend.onrender.com/api/users/${data.userId}`,
      {
        name: data.name,
        email: data.email,
        role: data.role,
      }
    );
    console.log("🚀 ~ editUser ~ response:", response);

    return { success: true, message: response.data.success };
  } catch (error) {
    console.error("Error updating user:", error);
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        message:
          error.response?.data?.error || "Failed to update user profile.",
      };
    } else {
      return {
        success: false,
        message: "Failed to update user.",
      };
    }
  }
}
