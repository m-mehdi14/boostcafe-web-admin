"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
}

export const RestaurantMenuComponent: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    {
      id: "1",
      name: "Chicken Biryani",
      description: "A spicy rice dish with chicken.",
      price: 10.99,
    },
    {
      id: "2",
      name: "Beef Burger",
      description: "Grilled beef patty with lettuce, tomato, and cheese.",
      price: 8.49,
    },
  ]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (!editingItem) return;
    const { name, value } = e.target;
    setEditingItem({ ...editingItem, [name]: value });
  };

  const handleAddNewItem = () => {
    setEditingItem({ id: "", name: "", description: "", price: 0 });
    setDialogOpen(true);
  };

  const handleEditItem = (item: MenuItem) => {
    setEditingItem(item);
    setDialogOpen(true);
  };

  const handleSaveItem = () => {
    if (!editingItem) return;
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
  };

  const handleDeleteItem = (id: string) => {
    setMenuItems((prevItems) => prevItems.filter((item) => item.id !== id));
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
        <div className="space-y-4">
          {menuItems.map((item) => (
            <div
              key={item.id}
              className="bg-gray-100 p-4 rounded-lg shadow-md flex justify-between items-center"
            >
              <div>
                <h2 className="text-xl font-semibold text-gray-700">
                  {item.name}
                </h2>
                <p className="text-gray-600">{item.description}</p>
                <p className="text-gray-800 font-bold">
                  ${item.price.toFixed(2)}
                </p>
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
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Price
              </label>
              <Input
                type="number"
                name="price"
                value={editingItem?.price || ""}
                onChange={handleInputChange}
                className="w-full"
              />
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
            >
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
