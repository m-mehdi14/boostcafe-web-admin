// app/actions/editRestaurant.ts
"use server";

import { db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { FirestoreError } from "firebase/firestore";
import { revalidatePath } from "next/cache";

// Define the data type for the restaurant
interface RestaurantData {
  name?: string;
  phone?: string;
  email?: string;
  address?: string;
  adminId: string; // unique identifier for the restaurant admin (user ID)
}

export async function editRestaurant(data: RestaurantData) {
  try {
    console.log("🚀 ~ editRestaurant ~ data:", data);
    const restaurantRef = doc(db, "restaurants", data.adminId);
    console.log("🚀 ~ editRestaurant ~ restaurantRef:", restaurantRef);

    // Check that we have at least one field to update
    if (!data.name && !data.phone && !data.email && !data.address) {
      return { success: false, message: "No fields provided to update." };
    }

    // Step 1: Update the restaurant data in Firestore
    const updatedData: Partial<RestaurantData> = {};
    if (data.name) updatedData.name = data.name;
    if (data.phone) updatedData.phone = data.phone;
    if (data.email) updatedData.email = data.email;
    if (data.address) updatedData.address = data.address;

    console.log("🚀 ~ editRestaurant ~ updatedData:", updatedData);
    await updateDoc(restaurantRef, {
      ...updatedData,
      updatedAt: new Date().toISOString(), // Log the update time
    });

    // Step 2: Revalidate the path
    revalidatePath("/admin");

    return { success: true, message: "Restaurant updated successfully." };
  } catch (error) {
    if (error instanceof FirestoreError) {
      console.error("Firestore error:", error.message);
      switch (error.code) {
        case "not-found":
          return { success: false, message: "Restaurant not found." };
        case "permission-denied":
          return {
            success: false,
            message: "You do not have permission to edit this restaurant.",
          };
        case "unavailable":
          return {
            success: false,
            message:
              "Firestore service is unavailable. Please try again later.",
          };
        default:
          return {
            success: false,
            message: `Firestore error: ${error.message}`,
          };
      }
    } else {
      console.error("Unknown error:", error);
      return {
        success: false,
        message: "An unexpected error occurred while editing the restaurant.",
      };
    }
  }
}
