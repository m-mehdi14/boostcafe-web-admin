"use server";

import { db } from "@/lib/firebase"; // Assuming your Firebase config is here
import { doc, updateDoc } from "firebase/firestore";
import { revalidatePath } from "next/cache";
import { FirestoreError } from "firebase/firestore"; // Import Firestore-specific error type

// Define the profile object type with optional fields
interface Profile {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
}

// Define the return type for the function
interface UpdateProfileResponse {
  success: boolean;
  message: string;
}

// Server action to update restaurant profile
export const updateRestaurantProfile = async (
  uid: string,
  profile: Partial<Profile> // Use Partial to allow optional fields
): Promise<UpdateProfileResponse> => {
  try {
    if (!uid) {
      return { success: false, message: "User ID is required." };
    }

    // Create an object with only the fields that are defined in the profile
    const updatedFields: Partial<Profile> = {};
    if (profile.name !== undefined) updatedFields.name = profile.name;
    if (profile.email !== undefined) updatedFields.email = profile.email;
    if (profile.phone !== undefined) updatedFields.phone = profile.phone;
    if (profile.address !== undefined) updatedFields.address = profile.address;

    // If no fields are provided for update, return an error
    if (Object.keys(updatedFields).length === 0) {
      return { success: false, message: "No fields provided for update." };
    }

    // Firestore reference for the restaurant document
    const restaurantRef = doc(db, "restaurants", uid);

    // Attempt to update the Firestore document with only the provided fields
    await updateDoc(restaurantRef, updatedFields);

    // Trigger a path revalidation for the updated data to reflect in real-time
    revalidatePath(`/res-admin/profile`);

    // Return success response
    return { success: true, message: "Profile updated successfully!" };
  } catch (error) {
    // Enhanced error handling based on error type
    if (error instanceof FirestoreError) {
      console.error("Firestore error:", error.message);

      switch (error.code) {
        case "not-found":
          return { success: false, message: "Restaurant profile not found." };
        case "permission-denied":
          return {
            success: false,
            message: "You don't have permission to update this profile.",
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
      // General or runtime error
      console.error("Runtime error:", error.message);
      return {
        success: false,
        message:
          "An unexpected error occurred while updating the profile. Please try again later.",
      };
    } else {
      // Fallback for unexpected error types
      return {
        success: false,
        message: "An unknown error occurred.",
      };
    }
  }
};
