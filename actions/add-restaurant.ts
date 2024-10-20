// app/actions/addRestaurant.ts
"use server";

import { db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import axios from "axios";
import {
  getStorage,
  ref,
  uploadString,
  getDownloadURL,
} from "firebase/storage"; // Firebase storage imports
import { revalidatePath } from "next/cache";

// Define the data type for the restaurant and creator
interface RestaurantData {
  name: string;
  phone: string;
  email: string;
  address: string;
  password: string;
  creatorId: string; // Add creatorId to track who added the restaurant
  imageBase64?: string; // Store image as Base64 (optional)
}

// Function to upload image to Firebase Storage and return the download URL
async function uploadImageToStorage(
  base64Image: string,
  userId: string
): Promise<string> {
  const storage = getStorage();
  const imageRef = ref(storage, `restaurants/${userId}`); // Save image with userId as the name
  try {
    await uploadString(imageRef, base64Image, "data_url"); // Upload as a Base64 data URL
    const downloadURL = await getDownloadURL(imageRef); // Get the download URL of the uploaded image
    return downloadURL;
  } catch (error) {
    console.log("🚀 ~ error:", error);
    return "Image upload failed.";
  }
}

export async function addRestaurant(data: RestaurantData) {
  try {
    console.log("🚀 ~ addRestaurant ~ data:", data);

    // Step 1: Create a new user in Firebase Authentication using REST API
    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

    const userResponse = await axios.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`,
      {
        email: data.email,
        password: data.password,
        returnSecureToken: false, // Do not return secure token to avoid creating a session
      }
    );

    const userId = userResponse.data.localId;

    // Step 2: Upload the image to Firebase Storage (if provided) and get the download URL
    let imageUrl: string | null = null;
    if (data.imageBase64) {
      imageUrl = await uploadImageToStorage(data.imageBase64, userId); // Upload image and get the download URL
    }

    // Step 3: Save the restaurant data in Firestore, including the image URL
    await setDoc(doc(db, "restaurants", userId), {
      name: data.name,
      phone: data.phone,
      email: data.email,
      address: data.address,
      adminId: userId,
      status: "Active",
      role: "restaurantAdmin",
      createdAt: new Date().toISOString(),
      createdBy: data.creatorId, // Save the ID of the user who created this restaurant
      imageUrl: imageUrl || null, // Store the image URL (or null if no image)
    });

    revalidatePath("/admin");

    return { success: true, message: "Restaurant added successfully." };
  } catch (error) {
    console.error("Error adding restaurant:", error);
    if (axios.isAxiosError(error)) {
      // Handle specific errors from Firebase Authentication API
      return {
        success: false,
        message:
          error.response?.data?.error?.message ||
          "Failed to create Firebase user.",
      };
    } else {
      return {
        success: false,
        message: "Failed to add restaurant. Please try again.",
      };
    }
  }
}
