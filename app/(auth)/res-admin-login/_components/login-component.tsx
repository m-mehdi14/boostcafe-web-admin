// app/login/page.tsx
"use client";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { auth, db } from "@/lib/firebase"; // Import firestore
import { collection, getDocs, query, where } from "firebase/firestore";
import {
  Form,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { FirebaseError } from "firebase/app";
import Logo from "@/public/boost-cafe.png";
import Image from "next/image";

// Define the schema using Zod
const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof formSchema>;

export function LoginRestaurantComponent() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const validateRestaurantUser = async (email: string): Promise<boolean> => {
    try {
      const restaurantsRef = collection(db, "restaurants");
      const q = query(
        restaurantsRef,
        where("email", "==", email),
        where("role", "==", "restaurantAdmin")
      );
      const querySnapshot = await getDocs(q);
      console.log(
        "🚀 ~ validateRestaurantUser ~ querySnapshot:",
        querySnapshot
      );
      return !querySnapshot.empty; // Returns true if a matching document is found
    } catch (error) {
      console.error("Error checking restaurant admin:", error);
      return false;
    }
  };

  const onSubmit = async (data: LoginFormValues) => {
    setLoading(true);

    try {
      // Validate if the user exists in the restaurants collection
      const isRestaurantAdmin = await validateRestaurantUser(data.email);
      console.log("🚀 isRestaurantAdmin ---- >", isRestaurantAdmin);
      if (!isRestaurantAdmin) {
        form.setError("root", {
          type: "manual",
          message: "You are not authorized to log in as a restaurant admin.",
        });
        setLoading(false);
        return;
      }

      // Sign in with Firebase Authentication
      await signInWithEmailAndPassword(auth, data.email, data.password);
      // Redirect to the admin dashboard
      router.push("/res-admin");
    } catch (err) {
      if (err instanceof FirebaseError) {
        // Handle specific Firebase errors if needed
        form.setError("root", {
          type: "manual",
          message:
            err.message || "Failed to log in. Please check your credentials.",
        });
      } else {
        // Handle other errors
        form.setError("root", {
          type: "manual",
          message: "An unexpected error occurred.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-stone-400 to-stone-800">
      <div className="w-full max-w-md p-8 space-y-6 bg-white/55 rounded-lg shadow-xl">
        {/* Logo and Title */}
        <div className=" w-full flex flex-col items-center justify-center">
          <Image
            src={Logo}
            alt="Boost Cafe"
            width={170}
            height={170}
            priority
          />
        </div>
        <h2 className="text-3xl font-extrabold text-center text-gray-800">
          Restaurant Login
        </h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  disabled={loading}
                  {...form.register("email")}
                />
              </FormControl>
              <FormMessage>{form.formState.errors.email?.message}</FormMessage>
            </FormItem>

            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Enter your password"
                  disabled={loading}
                  {...form.register("password")}
                />
              </FormControl>
              <FormMessage>
                {form.formState.errors.password?.message}
              </FormMessage>
            </FormItem>

            {form.formState.errors.root && (
              <p className="text-red-500 text-sm text-center">
                {form.formState.errors.root.message}
              </p>
            )}

            <div>
              <Button
                type="submit"
                className="w-full bg-blue-600 text-white hover:bg-blue-700"
                disabled={loading}
              >
                {loading ? <Skeleton className="h-4 w-20 mx-auto" /> : "Log In"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
