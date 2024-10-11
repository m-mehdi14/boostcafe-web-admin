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

interface Promotion {
  id: string;
  title: string;
  description: string;
  discount: number;
  startDate: string;
  endDate: string;
}

export const PromotionsManagement: React.FC = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([
    {
      id: "1",
      title: "New Year Sale",
      description: "Get 20% off on all items during the New Year Sale!",
      discount: 20,
      startDate: "2024-01-01",
      endDate: "2024-01-10",
    },
    {
      id: "2",
      title: "Happy Hour",
      description: "Enjoy 15% off from 4 PM to 6 PM every day.",
      discount: 15,
      startDate: "2024-01-01",
      endDate: "2024-12-31",
    },
  ]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(
    null
  );

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (!editingPromotion) return;
    const { name, value } = e.target;
    setEditingPromotion({ ...editingPromotion, [name]: value });
  };

  const handleAddNewPromotion = () => {
    setEditingPromotion({
      id: "",
      title: "",
      description: "",
      discount: 0,
      startDate: "",
      endDate: "",
    });
    setDialogOpen(true);
  };

  const handleEditPromotion = (promotion: Promotion) => {
    setEditingPromotion(promotion);
    setDialogOpen(true);
  };

  const handleSavePromotion = () => {
    if (!editingPromotion) return;
    if (editingPromotion.id) {
      setPromotions((prevPromotions) =>
        prevPromotions.map((promo) =>
          promo.id === editingPromotion.id ? editingPromotion : promo
        )
      );
    } else {
      setPromotions((prevPromotions) => [
        ...prevPromotions,
        { ...editingPromotion, id: Date.now().toString() },
      ]);
    }
    setDialogOpen(false);
    setEditingPromotion(null);
  };

  const handleDeletePromotion = (id: string) => {
    setPromotions((prevPromotions) =>
      prevPromotions.filter((promo) => promo.id !== id)
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold text-gray-800">
            Promotions Management
          </h1>
          <Button
            onClick={handleAddNewPromotion}
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            Add New Promotion
          </Button>
        </div>
        <div className="space-y-4">
          {promotions.map((promo) => (
            <div
              key={promo.id}
              className="bg-gray-100 p-4 rounded-lg shadow-md flex justify-between items-center"
            >
              <div>
                <h2 className="text-xl font-semibold text-gray-700">
                  {promo.title}
                </h2>
                <p className="text-gray-600">{promo.description}</p>
                <p className="text-gray-800 font-bold">
                  {promo.discount}% Discount | {promo.startDate} -{" "}
                  {promo.endDate}
                </p>
              </div>
              <div className="space-x-2">
                <Button
                  onClick={() => handleEditPromotion(promo)}
                  className="bg-yellow-500 text-white hover:bg-yellow-600"
                >
                  Edit
                </Button>
                <Button
                  onClick={() => handleDeletePromotion(promo.id)}
                  className="bg-red-600 text-white hover:bg-red-700"
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dialog for Add/Edit Promotion */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingPromotion?.id ? "Edit Promotion" : "Add New Promotion"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Title
              </label>
              <Input
                type="text"
                name="title"
                value={editingPromotion?.title || ""}
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
                value={editingPromotion?.description || ""}
                onChange={handleInputChange}
                className="w-full"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Discount (%)
              </label>
              <Input
                type="number"
                name="discount"
                value={editingPromotion?.discount || ""}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Start Date
              </label>
              <Input
                type="date"
                name="startDate"
                value={editingPromotion?.startDate || ""}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                End Date
              </label>
              <Input
                type="date"
                name="endDate"
                value={editingPromotion?.endDate || ""}
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
              onClick={handleSavePromotion}
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
