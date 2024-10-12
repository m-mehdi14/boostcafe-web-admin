/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { addRestaurant } from "@/actions/add-restaurant";
import { toast } from "sonner";
import { GetRestaurants } from "@/actions/get-restaurant";

// Define the form schema using Zod
const formSchema = z.object({
  name: z.string().min(1, "Restaurant name is required"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  email: z.string().email("Please enter a valid email address"),
  address: z.string().min(1, "Address is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type AddRestaurantFormValues = z.infer<typeof formSchema>;

// Define the type for a Restaurant
interface Restaurant {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  status: "Active" | "Inactive";
}

// Define the type for the API response
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export const AddRestaurant: React.FC = () => {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [formMessage, setFormMessage] = useState<string>("");
  const [restaurantData, setRestaurantData] = useState<Restaurant[]>([]);
  const [fetching, setFetching] = useState<boolean>(true);

  const form = useForm<AddRestaurantFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      address: "",
      password: "",
    },
  });

  // Fetch restaurant data
  const fetchRestaurantData = async (): Promise<void> => {
    setFetching(true);
    //@ts-ignore
    const result: ApiResponse<Restaurant[]> = await GetRestaurants();
    console.log("🚀 ~ fetchRestaurantData ~ result:", result);
    if (result.success && result.data) {
      setRestaurantData(result.data);
    } else {
      console.error(result.message);
    }
    setFetching(false);
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchRestaurantData();
  }, []);

  const onSubmit = async (data: AddRestaurantFormValues): Promise<void> => {
    setLoading(true);
    setFormMessage("");

    const result: ApiResponse<null> = await addRestaurant(data);

    if (result.success) {
      toast.success("Restaurant added successfully.");
      setFormMessage("Restaurant added successfully.");
      setDialogOpen(false);
      form.reset();
      fetchRestaurantData(); // Refresh the restaurant data after adding
    } else {
      toast.error(result.message || "Failed to add restaurant.");
      setFormMessage(result.message || "Failed to add restaurant.");
    }

    setLoading(false);
  };

  return (
    <>
      {/* Restaurant Management Section */}
      <div className="p-5 mb-6 bg-white rounded-lg shadow">
        <h2 className="mb-4 text-lg font-semibold text-gray-800">
          Restaurants Management
        </h2>
        <p className="text-gray-600">
          Manage the list of restaurants, add new ones, or edit existing
          details.
        </p>
        <Button
          onClick={() => setDialogOpen(true)}
          className="px-4 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          Add New Restaurant
        </Button>
        <div className="mt-6">
          {fetching ? (
            <Skeleton className="w-full h-20" />
          ) : (
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-4 py-2 text-sm font-medium text-gray-700">
                    Restaurant Name
                  </th>
                  <th className="px-4 py-2 text-sm font-medium text-gray-700">
                    Location
                  </th>
                  <th className="px-4 py-2 text-sm font-medium text-gray-700">
                    Admin Email
                  </th>
                  <th className="px-4 py-2 text-sm font-medium text-gray-700">
                    Status
                  </th>
                  <th className="px-4 py-2 text-sm font-medium text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {restaurantData.map((restaurant) => (
                  <tr key={restaurant.id} className="border-b">
                    <td className="px-4 py-2 text-gray-600">
                      {restaurant.name}
                    </td>
                    <td className="px-4 py-2 text-gray-600">
                      {restaurant.address}
                    </td>
                    <td className="px-4 py-2 text-gray-600">
                      {restaurant.email}
                    </td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-2 py-1 text-sm font-medium rounded-lg ${
                          restaurant.status === "Active"
                            ? "text-green-700 bg-green-100"
                            : "text-red-700 bg-red-100"
                        }`}
                      >
                        {restaurant.status}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <Button className="px-3 py-1 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                        Edit
                      </Button>
                      <Button className="ml-2 px-3 py-1 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700">
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Dialog for Adding Restaurant */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Restaurant</DialogTitle>
            <DialogDescription>
              Please fill out the details below to add a new restaurant.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormItem>
                <FormLabel>Restaurant Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter restaurant name"
                    disabled={loading}
                    {...form.register("name")}
                  />
                </FormControl>
                <FormMessage>{form.formState.errors.name?.message}</FormMessage>
              </FormItem>

              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter phone number"
                    disabled={loading}
                    {...form.register("phone")}
                  />
                </FormControl>
                <FormMessage>
                  {form.formState.errors.phone?.message}
                </FormMessage>
              </FormItem>

              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter email address"
                    disabled={loading}
                    {...form.register("email")}
                  />
                </FormControl>
                <FormMessage>
                  {form.formState.errors.email?.message}
                </FormMessage>
              </FormItem>

              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter address"
                    disabled={loading}
                    {...form.register("address")}
                  />
                </FormControl>
                <FormMessage>
                  {form.formState.errors.address?.message}
                </FormMessage>
              </FormItem>

              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter password"
                    disabled={loading}
                    {...form.register("password")}
                  />
                </FormControl>
                <FormMessage>
                  {form.formState.errors.password?.message}
                </FormMessage>
              </FormItem>

              <div className="flex justify-end mt-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setDialogOpen(false)}
                  className="mr-4"
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={loading}
                >
                  {loading ? (
                    <Skeleton className="h-4 w-20 mx-auto" />
                  ) : (
                    "Add Restaurant"
                  )}
                </Button>
              </div>
              {formMessage && (
                <p className="mt-4 text-center text-red-500">{formMessage}</p>
              )}
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};
