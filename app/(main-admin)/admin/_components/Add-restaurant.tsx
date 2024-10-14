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
import { editRestaurant } from "@/actions/admin/editRestaurant";
import { deleteRestaurant } from "@/actions/admin/deleteRestaurant";
import { toast } from "sonner";
import { useAuth } from "@/lib/AuthContext/AuthContext";
import { FiKey, FiPlus, FiEye, FiEyeOff } from "react-icons/fi";
import { changeRestaurantPassword } from "@/actions/admin/change-res-pass";
import { MdDeleteForever, MdEdit } from "react-icons/md";
import { Hint } from "@/components/hint";
import { GetRestaurants } from "@/actions/get-restaurant";

// Define the form schema using Zod
const formSchema = z.object({
  name: z.string().min(1, "Restaurant name is required"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  email: z.string().email("Please enter a valid email address"),
  address: z.string().min(1, "Address is required"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .optional(),
});

// Define the form schema for password change
const passwordFormSchema = z
  .object({
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Password must be at least 6 characters"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type AddRestaurantFormValues = z.infer<typeof formSchema>;
type ChangePasswordFormValues = z.infer<typeof passwordFormSchema>;

interface Restaurant {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  status: "Active" | "Inactive";
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export const AddRestaurant: React.FC = () => {
  const { user } = useAuth();
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState<boolean>(false); // For password change dialog
  const [loadingAdd, setLoadingAdd] = useState<boolean>(false); // For adding restaurant
  const [loadingEdit, setLoadingEdit] = useState<boolean>(false); // For editing restaurant
  const [loadingPassword, setLoadingPassword] = useState<boolean>(false); // For password change
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null); // Track the restaurant being deleted
  const [restaurantData, setRestaurantData] = useState<Restaurant[]>([]);
  const [currentRestaurantId, setCurrentRestaurantId] = useState<string | null>(
    null
  );
  const [fetching, setFetching] = useState<boolean>(true);

  const addForm = useForm<AddRestaurantFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      address: "",
      password: "",
    },
  });

  const editForm = useForm<AddRestaurantFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      address: "",
    },
  });

  const passwordForm = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Fetch restaurant data
  const fetchRestaurantData = async (): Promise<void> => {
    setFetching(true);
    // @ts-ignore
    const result: ApiResponse<Restaurant[]> = await GetRestaurants();
    if (result.success && result.data) {
      setRestaurantData(result.data);
    } else {
      console.error(result.message);
      toast.error("Failed to fetch restaurants.");
    }
    setFetching(false);
  };

  useEffect(() => {
    fetchRestaurantData();
  }, []);

  // Function to handle password update
  const handleChangePassword = async (
    data: ChangePasswordFormValues
  ): Promise<void> => {
    setLoadingPassword(true);
    const result: ApiResponse<null> = await changeRestaurantPassword({
      adminId: currentRestaurantId!,
      newPassword: data.newPassword,
      creatorId: user?.uid || ("" as string),
    });

    if (result.success) {
      toast.success(result.message || "Password updated successfully.");
      setPasswordDialogOpen(false);
      passwordForm.reset();
    } else {
      toast.error(result.message || "Failed to update password.");
    }
    setLoadingPassword(false);
  };

  // Function to open password change dialog
  const handleChangePasswordClick = (restaurant: Restaurant) => {
    setCurrentRestaurantId(restaurant.id);
    setPasswordDialogOpen(true);
  };

  // Function to add a new restaurant
  const handleAddRestaurant = async (
    data: AddRestaurantFormValues
  ): Promise<void> => {
    setLoadingAdd(true);
    // @ts-ignore
    const result: ApiResponse<null> = await addRestaurant({
      ...data,
      creatorId: user?.uid || ("" as string),
    });

    if (result.success) {
      toast.success(result.message || "Restaurant added successfully.");
      setDialogOpen(false);
      addForm.reset();
      fetchRestaurantData();
    } else {
      toast.error(result.message || "Failed to add restaurant.");
    }

    setLoadingAdd(false);
  };

  // Function to edit a restaurant
  const handleEditRestaurant = async (
    data: AddRestaurantFormValues
  ): Promise<void> => {
    setLoadingEdit(true);
    const result: ApiResponse<null> = await editRestaurant({
      adminId: currentRestaurantId!,
      name: data.name,
      phone: data.phone,
      email: data.email,
      address: data.address,
    });

    if (result.success) {
      toast.success(result.message || "Restaurant updated successfully.");
      setEditDialogOpen(false);
      editForm.reset();
      fetchRestaurantData();
    } else {
      toast.error(result.message || "Failed to update restaurant.");
    }

    setLoadingEdit(false);
  };

  // Function to handle when Edit button is clicked
  const handleEditClick = (restaurant: Restaurant) => {
    setCurrentRestaurantId(restaurant.id);
    editForm.setValue("name", restaurant.name);
    editForm.setValue("phone", restaurant.phone);
    editForm.setValue("email", restaurant.email);
    editForm.setValue("address", restaurant.address);
    setEditDialogOpen(true);
  };

  // Function to delete a restaurant
  const handleDeleteClick = async (id: string) => {
    setDeletingId(id);
    const result = await deleteRestaurant({ adminId: id });

    if (result.success) {
      toast.success("Restaurant deleted successfully.");
      fetchRestaurantData();
    } else {
      toast.error(result.message || "Failed to delete restaurant.");
    }

    setDeletingId(null);
  };

  return (
    <>
      <div className="p-5 mb-6 bg-white rounded-lg shadow">
        <h2 className="mb-4 text-lg font-semibold text-gray-800">
          Restaurants Management
        </h2>
        <Button
          onClick={() => {
            setDialogOpen(true);
            addForm.reset(); // Reset form before opening
          }}
          className="flex items-center justify-center px-4 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105"
        >
          <FiPlus className="mr-2 text-lg" /> {/* Icon with margin */}
          Add New Restaurant
        </Button>

        <div className="mt-6">
          {fetching ? (
            <>
              <Skeleton className="w-full h-12 mb-4" />
              <Skeleton className="w-full h-12 mb-4" />
              <Skeleton className="w-full h-12 mb-4" />
            </>
          ) : restaurantData.length === 0 ? (
            <div className="p-6 text-center bg-red-50 border border-red-400 rounded-lg">
              <h3 className="text-xl font-semibold text-red-600">
                No Restaurants Found
              </h3>
              <p className="text-gray-700">
                You currently have no restaurants added. Please use the button
                above to add a new restaurant.
              </p>
            </div>
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
                    <td className="px-4 py-2 space-x-2">
                      <Button
                        onClick={() => handleEditClick(restaurant)}
                        className="px-3 py-1 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                        disabled={loadingEdit}
                      >
                        {loadingEdit &&
                        currentRestaurantId === restaurant.id ? (
                          <Skeleton className="h-4 w-4  mx-auto" />
                        ) : (
                          <Hint label="Edit" side="top">
                            <MdEdit size={20} />
                          </Hint>
                        )}
                      </Button>
                      <Button
                        onClick={() => handleChangePasswordClick(restaurant)}
                        className=" px-3 py-1 text-sm text-white bg-yellow-600 rounded-lg hover:bg-yellow-700"
                        disabled={loadingPassword}
                      >
                        {loadingPassword &&
                        currentRestaurantId === restaurant.id ? (
                          <Skeleton className="h-4 w-4  mx-auto" />
                        ) : (
                          <Hint label="Change Password" side="top">
                            <FiKey className="" size={20} />
                          </Hint>
                        )}
                      </Button>
                      <Button
                        onClick={() => handleDeleteClick(restaurant.id)}
                        className="ml-2 px-3 py-1 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700"
                        disabled={deletingId === restaurant.id}
                      >
                        {deletingId === restaurant.id ? (
                          <Skeleton className="h-4 w-4 mx-auto" />
                        ) : (
                          <Hint label="Delete Restaurant" side="top">
                            <MdDeleteForever size={20} />
                          </Hint>
                        )}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Password Change Dialog */}
      <Dialog
        open={passwordDialogOpen}
        onOpenChange={() => {
          setPasswordDialogOpen(false);
          passwordForm.reset();
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Restaurant Password</DialogTitle>
            <DialogDescription>
              Please enter the new password below to update it for the
              restaurant.
            </DialogDescription>
          </DialogHeader>
          <Form {...passwordForm}>
            <form
              onSubmit={passwordForm.handleSubmit(handleChangePassword)}
              className="space-y-4"
            >
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter new password"
                      disabled={loadingPassword}
                      {...passwordForm.register("newPassword")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600"
                    >
                      {showPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage>
                  {passwordForm.formState.errors.newPassword?.message}
                </FormMessage>
              </FormItem>
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm new password"
                      disabled={loadingPassword}
                      {...passwordForm.register("confirmPassword")}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600"
                    >
                      {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage>
                  {passwordForm.formState.errors.confirmPassword?.message}
                </FormMessage>
              </FormItem>

              <div className="flex justify-end mt-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setPasswordDialogOpen(false)}
                  className="mr-4"
                  disabled={loadingPassword}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={loadingPassword}
                >
                  {loadingPassword ? (
                    <Skeleton className="h-4 w-20 mx-auto" />
                  ) : (
                    "Change Password"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Dialog for Adding a Restaurant */}
      <Dialog
        open={dialogOpen}
        onOpenChange={() => {
          setDialogOpen(false);
          addForm.reset();
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Restaurant</DialogTitle>
            <DialogDescription>
              Please fill out the details below to add a new restaurant.
            </DialogDescription>
          </DialogHeader>
          <Form {...addForm}>
            <form
              onSubmit={addForm.handleSubmit((data) => {
                handleAddRestaurant(data);
              })}
              className="space-y-4"
            >
              <FormItem>
                <FormLabel>Restaurant Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter restaurant name"
                    disabled={loadingAdd}
                    {...addForm.register("name")}
                  />
                </FormControl>
                <FormMessage>
                  {addForm.formState.errors.name?.message}
                </FormMessage>
              </FormItem>
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter phone number"
                    disabled={loadingAdd}
                    {...addForm.register("phone")}
                  />
                </FormControl>
                <FormMessage>
                  {addForm.formState.errors.phone?.message}
                </FormMessage>
              </FormItem>
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter email address"
                    disabled={loadingAdd}
                    {...addForm.register("email")}
                  />
                </FormControl>
                <FormMessage>
                  {addForm.formState.errors.email?.message}
                </FormMessage>
              </FormItem>
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter address"
                    disabled={loadingAdd}
                    {...addForm.register("address")}
                  />
                </FormControl>
                <FormMessage>
                  {addForm.formState.errors.address?.message}
                </FormMessage>
              </FormItem>
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter password"
                      disabled={loadingAdd}
                      {...addForm.register("password")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600"
                    >
                      {showPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage>
                  {addForm.formState.errors.password?.message}
                </FormMessage>
              </FormItem>

              <div className="flex justify-end mt-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setDialogOpen(false)}
                  className="mr-4"
                  disabled={loadingAdd}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={loadingAdd}
                >
                  {loadingAdd ? (
                    <Skeleton className="h-4 w-20 mx-auto" />
                  ) : (
                    "Add Restaurant"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Dialog for Editing a Restaurant */}
      <Dialog
        open={editDialogOpen}
        onOpenChange={() => {
          setEditDialogOpen(false);
          editForm.reset();
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Restaurant</DialogTitle>
            <DialogDescription>
              Please update the restaurant details below.
            </DialogDescription>
          </DialogHeader>
          <Form {...editForm}>
            <form
              onSubmit={editForm.handleSubmit((data) => {
                handleEditRestaurant(data);
              })}
              className="space-y-4"
            >
              <FormItem>
                <FormLabel>Restaurant Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter restaurant name"
                    disabled={loadingEdit}
                    {...editForm.register("name")}
                  />
                </FormControl>
                <FormMessage>
                  {editForm.formState.errors.name?.message}
                </FormMessage>
              </FormItem>
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter phone number"
                    disabled={loadingEdit}
                    {...editForm.register("phone")}
                  />
                </FormControl>
                <FormMessage>
                  {editForm.formState.errors.phone?.message}
                </FormMessage>
              </FormItem>
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter email address"
                    disabled={loadingEdit}
                    {...editForm.register("email")}
                  />
                </FormControl>
                <FormMessage>
                  {editForm.formState.errors.email?.message}
                </FormMessage>
              </FormItem>
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter address"
                    disabled={loadingEdit}
                    {...editForm.register("address")}
                  />
                </FormControl>
                <FormMessage>
                  {editForm.formState.errors.address?.message}
                </FormMessage>
              </FormItem>

              <div className="flex justify-end mt-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setEditDialogOpen(false)}
                  className="mr-4"
                  disabled={loadingEdit}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={loadingEdit}
                >
                  {loadingEdit ? (
                    <Skeleton className="h-4 w-20 mx-auto" />
                  ) : (
                    "Update Restaurant"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};
