// app/actions/addRestaurant.ts
"use server";

import { db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import axios from "axios";
import { revalidatePath } from "next/cache";

// Define the data type for the restaurant
interface RestaurantData {
  name: string;
  phone: string;
  email: string;
  address: string;
  password: string;
}

export async function addRestaurant(data: RestaurantData) {
  try {
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

    // Step 2: Save the restaurant data in Firestore
    await setDoc(doc(db, "restaurants", userId), {
      name: data.name,
      phone: data.phone,
      email: data.email,
      address: data.address,
      adminId: userId,
      status: "Active",
      role: "restaurantAdmin",
      createdAt: new Date().toISOString(),
    });
    revalidatePath("/admin");
    return { success: true, message: "Restaurant added successfully." };
  } catch (error) {
    console.error("Error adding restaurant:", error);
    if (axios.isAxiosError(error)) {
      // Handle specific errors from Firebase Authentication API
      console.error("Error creating Firebase user:", error.response?.data);
      return {
        success: false,
        message:
          error.response?.data?.error?.message ||
          "Failed to create Firebase user.",
      };
    } else {
      console.error("Error adding restaurant:", error);
      return {
        success: false,
        message: "Failed to add restaurant. Please try again.",
      };
    }
  }
}
