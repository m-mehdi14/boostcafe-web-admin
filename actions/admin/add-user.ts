// app/actions/admin/add-user.ts
"use server";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import axios from "axios";
import { revalidatePath } from "next/cache";

// Define user structure
interface NewUser {
  name: string;
  email: string;
  password: string;
  role: "admin" | "User" | "Moderator";
  fcmToken?: string;
  accountVerify?: string;
}

export async function addUser(newUser: NewUser) {
  try {
    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY; // Firebase API key

    // Create a new user in Firebase Authentication using axios
    const userResponse = await axios.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`,
      {
        email: newUser.email,
        password: newUser.password,
        returnSecureToken: false, // Do not return secure token to avoid session creation
      }
    );

    const userId = userResponse.data.localId; // Get the user ID from the response

    // Add user data to Firestore
    const usersCollection = collection(db, "users");
    await addDoc(usersCollection, {
      userId, // Store Firebase Authentication User ID
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      fcmToken: newUser.fcmToken || "",
      accountVerify: newUser.accountVerify || "PENDING",
    });

    revalidatePath("/admin/user-management");
    return { success: true, message: "User added successfully." };
  } catch (error) {
    console.error("Error adding user:", error);
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
      // Handle other potential errors
      console.error("Error adding user to Firestore:", error);
      return {
        success: false,
        message: "Failed to add user to Firestore.",
      };
    }
  }
}
