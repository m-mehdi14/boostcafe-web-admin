// lib/serverActions.ts
"use server";

import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

// Define a function to fetch user data from Firestore
export async function getUsersData() {
  try {
    const usersCollectionRef = collection(db, "users");
    const snapshot = await getDocs(usersCollectionRef);

    // Map over the snapshot to get an array of user data
    const usersData = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return usersData;
  } catch (error) {
    console.error("Error fetching users data:", error);
    throw new Error("Failed to fetch users data");
  }
}
