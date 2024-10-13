/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getMenuItems } from "@/actions/restaurant-admin/getMenuItems";
import { saveMenuItem } from "@/actions/restaurant-admin/saveMenuItem"; // Import the server action to save menu items
import { toast } from "sonner";
import { useAuth } from "@/lib/AuthContext/AuthContext"; // Assuming this contains the user context
import { Skeleton } from "@/components/ui/skeleton";
import { deleteMenuItem } from "@/actions/restaurant-admin/deleteMenuItem";
import imageCompression from "browser-image-compression";
import Image from "next/image";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string; // Image field
}

const MAX_IMAGE_SIZE_MB = 5; // Set maximum image size to 5MB

export const RestaurantMenuComponent: React.FC = () => {
  const { user } = useAuth(); // Get the restaurant admin user context
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  console.log("🚀 ~ menuItems:", menuItems);
  const [loading, setLoading] = useState(false); // Loading state for fetching menu items
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  console.log("🚀 ~ editingItem:", editingItem);
  const [imagePreview, setImagePreview] = useState<string | null>(null); // Image preview for UI

  // Fetch menu items when the component mounts
  useEffect(() => {
    const fetchMenuItems = async () => {
      if (!user) return;

      setLoading(true);

      // Fetch the menu items for the restaurant admin
      const result = await getMenuItems(user.uid);

      if (result.success && result.data) {
        // @ts-ignore
        setMenuItems(result.data);
      } else {
        toast.error(result.message);
      }

      setLoading(false);
    };

    fetchMenuItems();
  }, [user]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (!editingItem) return;
    const { name, value } = e.target;
    setEditingItem({ ...editingItem, [name]: value });
  };

  // const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (file) {
  //     // Compress the image before converting it to base64
  //     const compressedFile = await imageCompression(file, {
  //       maxSizeMB: 1, // Maximum size in MB
  //       maxWidthOrHeight: 1920, // Maximum width or height in pixels
  //       useWebWorker: true, // Enable web worker for faster compression
  //     });

  //     const reader = new FileReader();
  //     reader.onload = (event) => {
  //       const base64Image = event.target?.result as string;
  //       setEditingItem((prevItem) => ({ ...prevItem, image: base64Image }));
  //       setImagePreview(base64Image);
  //     };
  //     reader.readAsDataURL(compressedFile);
  //   }
  // };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      // Check if the file size exceeds the maximum limit of 5MB
      const fileSizeMB = file.size / 1024 / 1024; // Convert file size to MB
      if (fileSizeMB > MAX_IMAGE_SIZE_MB) {
        toast.error(
          "Image size exceeds the 5MB limit. Please upload a smaller image."
        );
        return; // Exit the function if the image is too large
      }

      try {
        // Compress the image before converting it to base64
        const compressedFile = await imageCompression(file, {
          maxSizeMB: 1, // Maximum size after compression
          maxWidthOrHeight: 1920, // Maximum width or height in pixels
          useWebWorker: true, // Enable web worker for faster compression
        });

        const reader = new FileReader();
        reader.onload = (event) => {
          const base64Image = event.target?.result as string;
          // @ts-ignore
          setEditingItem((prevItem) => ({ ...prevItem, image: base64Image }));
          setImagePreview(base64Image);
        };
        reader.readAsDataURL(compressedFile);
      } catch (error) {
        console.error("Image upload error:", error);
        toast.error("Failed to upload image. Please try again.");
      }
    }
  };

  const handleAddNewItem = () => {
    setEditingItem({ id: "", name: "", description: "", price: 0, image: "" });
    setImagePreview(null); // Reset the image preview
    setDialogOpen(true);
  };

  const handleEditItem = (item: MenuItem) => {
    setEditingItem(item);
    setImagePreview(item.image || null); // Show existing image
    setDialogOpen(true);
  };

  const handleSaveItem = async () => {
    if (!editingItem || !user) return; // Ensure user (restaurant admin) and item are valid
    setLoading(true);

    // Save the menu item (either add new or edit existing)
    const result = await saveMenuItem(user.uid, editingItem, !!editingItem.id);

    if (result.success) {
      toast.success(result.message);

      // Update local state with the saved item
      if (editingItem.id) {
        setMenuItems((prevItems) =>
          prevItems.map((item) =>
            item.id === editingItem.id ? editingItem : item
          )
        );
      } else {
        setMenuItems((prevItems) => [
          ...prevItems,
          { ...editingItem, id: Date.now().toString() },
        ]);
      }

      setDialogOpen(false);
      setEditingItem(null);
    } else {
      toast.error(result.message);
    }

    setLoading(false);
  };

  const handleDeleteItem = async (id: string) => {
    if (!user) return;

    setLoading(true);

    // Call the delete server action
    const result = await deleteMenuItem(user.uid, id);

    if (result.success) {
      setMenuItems((prevItems) => prevItems.filter((item) => item.id !== id));
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }

    setLoading(false);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold text-gray-800">
            Restaurant Menu
          </h1>
          <Button
            onClick={handleAddNewItem}
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            Add New Item
          </Button>
        </div>

        {loading ? (
          // <p>Loading menu items...</p>
          <div className="space-y-4">
            <Skeleton className="h-8 w-full bg-gray-200 rounded" />
            <Skeleton className="h-8 w-full bg-gray-200 rounded" />
            <Skeleton className="h-8 w-full bg-gray-200 rounded" />
          </div>
        ) : (
          <div className="space-y-4">
            {menuItems.map((item) => (
              <div
                key={item.id}
                className="bg-gray-100 p-4 rounded-lg shadow-md flex justify-between items-center"
              >
                <div className=" flex flex-row">
                  {item.image && (
                    <Image
                      src={item.image}
                      alt={item.name}
                      className="mt-2 w-24 h-24 object-cover rounded-lg"
                      width={96}
                      height={96}
                    />
                  )}
                  <div className=" flex flex-col ml-4 mt-3 ">
                    <h2 className="text-xl font-semibold text-gray-700">
                      {item.name}
                    </h2>
                    <p className="text-gray-600">{item.description}</p>
                    <p className="text-gray-800 font-bold">
                      {/* ${item.price.toFixed(2)} */}${item.price}
                    </p>
                  </div>
                </div>
                <div className="space-x-2">
                  <Button
                    onClick={() => handleEditItem(item)}
                    className="bg-yellow-500 text-white hover:bg-yellow-600"
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDeleteItem(item.id)}
                    className="bg-red-600 text-white hover:bg-red-700"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Dialog for Add/Edit Menu Item */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingItem?.id ? "Edit Menu Item" : "Add New Menu Item"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Name
              </label>
              <Input
                type="text"
                name="name"
                value={editingItem?.name || ""}
                onChange={handleInputChange}
                className="w-full"
                placeholder="Enter name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Description
              </label>
              <Textarea
                name="description"
                value={editingItem?.description || ""}
                onChange={handleInputChange}
                className="w-full"
                rows={3}
                placeholder="Enter description"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Price
              </label>
              <Input
                type="text"
                name="price"
                value={editingItem?.price}
                onChange={handleInputChange}
                className="w-full"
                placeholder="Enter price"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Upload Image
              </label>
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full"
                placeholder="Upload image"
              />
              {imagePreview && (
                <Image
                  src={imagePreview}
                  alt="Preview"
                  className="mt-2 w-24 h-24 object-cover rounded-lg"
                  width={96}
                  height={96}
                />
              )}
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-2">
            <Button
              onClick={() => setDialogOpen(false)}
              className="bg-gray-600 text-white hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveItem}
              className="bg-blue-600 text-white hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
