// app/actions/editRestaurant.ts
"use server";

import { db } from "@/lib/firebase";
import { doc, updateDoc, getDoc } from "firebase/firestore"; // Import getDoc to fetch existing data
import {
  getStorage,
  ref,
  uploadString,
  getDownloadURL,
} from "firebase/storage";
import { FirestoreError } from "firebase/firestore";
import { revalidatePath } from "next/cache";

// Define the data type for the restaurant
interface RestaurantData {
  name?: string;
  phone?: string;
  email?: string;
  address?: string;
  adminId: string; // unique identifier for the restaurant admin (user ID)
  imageBase64?: string; // Optional field for updating the image file (Base64)
}

// Function to upload image to Firebase Storage and return the download URL
async function uploadImageToStorage(
  base64Image: string,
  adminId: string
): Promise<string> {
  const storage = getStorage();
  const imageRef = ref(storage, `restaurants/${adminId}`); // Store with adminId as the image name
  try {
    await uploadString(imageRef, base64Image, "data_url"); // Upload as a Base64 data URL
    const downloadURL = await getDownloadURL(imageRef); // Get the download URL of the uploaded image
    return downloadURL;
  } catch (error) {
    console.log("🚀 Image upload failed.", error);
    return "Image upload failed.";
  }
}

export async function editRestaurant(data: RestaurantData) {
  try {
    console.log("🚀 ~ editRestaurant ~ data:", data);
    const restaurantRef = doc(db, "restaurants", data.adminId);

    // Fetch existing restaurant data to check if an image already exists
    const existingRestaurantDoc = await getDoc(restaurantRef);
    if (!existingRestaurantDoc.exists()) {
      return { success: false, message: "Restaurant not found." };
    }

    const existingRestaurantData = existingRestaurantDoc.data();

    // Prepare the updated data with type safety
    const updatedData: Partial<{
      name: string;
      phone: string;
      email: string;
      address: string;
      imageUrl: string; // Changed from imageBase64 to imageUrl
    }> = {};

    if (data.name) updatedData.name = data.name;
    if (data.phone) updatedData.phone = data.phone;
    if (data.email) updatedData.email = data.email;
    if (data.address) updatedData.address = data.address;

    // Check if a new image was provided; otherwise, retain the existing imageUrl
    if (data.imageBase64) {
      const imageUrl = await uploadImageToStorage(
        data.imageBase64,
        data.adminId
      ); // Upload new image
      updatedData.imageUrl = imageUrl; // Save the new image URL to Firestore (using imageUrl field)
    } else if (existingRestaurantData?.imageUrl) {
      updatedData.imageUrl = existingRestaurantData.imageUrl; // Retain the existing image URL
    }

    // Update the restaurant data in Firestore with the latest TypeScript types
    await updateDoc(restaurantRef, {
      ...updatedData,
      updatedAt: new Date().toISOString(), // Log the update time
    });

    revalidatePath("/admin");

    return { success: true, message: "Restaurant updated successfully." };
  } catch (error) {
    console.error("Error editing restaurant:", error);
    if (error instanceof FirestoreError) {
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
      return {
        success: false,
        message: "An unexpected error occurred while editing the restaurant.",
      };
    }
  }
}
