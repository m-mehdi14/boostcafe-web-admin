// app/actions/getUsers.ts
"use server";

import { db } from "@/lib/firebase"; // Example with Firestore
import { collection, getDocs } from "firebase/firestore";

// Server action to get users from Firestore
export async function getUsers() {
  try {
    const usersCollection = collection(db, "users");
    const snapshot = await getDocs(usersCollection);
    const users = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
}
