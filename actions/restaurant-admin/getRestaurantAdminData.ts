// app/actions/getRestaurantAdminData.ts
"use server";

import { db } from "@/lib/firebase"; // Assuming your Firebase config is here
import { doc, getDoc } from "firebase/firestore";
import { FirestoreError } from "firebase/firestore";

// Define the restaurant admin profile type
interface RestaurantAdminProfile {
  name: string;
  email: string;
  phone: string;
  address: string;
  status: string;
}

// Define the return type for the function
interface GetRestaurantAdminResponse {
  success: boolean;
  message: string;
  data?: RestaurantAdminProfile; // data is optional, only present if the request is successful
}

// Server action to get a single restaurant admin data
export const getRestaurantAdminData = async (
  uid: string
): Promise<GetRestaurantAdminResponse> => {
  try {
    // Input validation
    if (!uid) {
      return { success: false, message: "User ID is required." };
    }

    // Firestore reference for the restaurant admin document
    const restaurantRef = doc(db, "restaurants", uid);

    // Fetch the document
    const restaurantSnapshot = await getDoc(restaurantRef);

    // Check if the document exists
    if (!restaurantSnapshot.exists()) {
      return { success: false, message: "Restaurant admin profile not found." };
    }

    // Extract the data
    const restaurantData = restaurantSnapshot.data() as RestaurantAdminProfile;

    // Return success response with the restaurant admin data
    return {
      success: true,
      message: "Restaurant admin data retrieved successfully.",
      data: restaurantData,
    };
  } catch (error) {
    // Enhanced error handling based on error type
    if (error instanceof FirestoreError) {
      console.error("Firestore error:", error.message);

      switch (error.code) {
        case "not-found":
          return { success: false, message: "Restaurant admin not found." };
        case "permission-denied":
          return {
            success: false,
            message: "You don't have permission to access this data.",
          };
        case "unavailable":
          return {
            success: false,
            message:
              "Firestore service is currently unavailable. Please try again later.",
          };
        default:
          return {
            success: false,
            message: "An unknown Firestore error occurred.",
          };
      }
    } else if (error instanceof Error) {
      console.error("Runtime error:", error.message);
      return {
        success: false,
        message:
          "An unexpected error occurred while retrieving the restaurant admin data. Please try again later.",
      };
    } else {
      return {
        success: false,
        message: "An unknown error occurred.",
      };
    }
  }
};
