"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext/AuthContext";
import { FaUserShield, FaUtensils, FaUser } from "react-icons/fa";
import Image from "next/image";

export default function RoleBasedContent() {
  const { user, loading, handleLogout } = useAuth();
  const router = useRouter();
  const [content, setContent] = useState<JSX.Element | null>(null);

  useEffect(() => {
    if (loading) return;

    // Set the content based on user role
    if (user?.role === "admin") {
      setContent(
        <div className="relative h-screen w-full">
          <Image
            src="/boost-cafe-design.png"
            alt="Admin Background"
            layout="fill"
            objectFit="cover"
            className="z-0"
          />
          <div className="absolute inset-0 bg-black opacity-50"></div>{" "}
          {/* Dark overlay */}
          <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white">
            <FaUserShield className="text-5xl mb-4" />
            <h1 className="text-5xl font-bold">Welcome, Admin!</h1>
            <p className="mt-2 text-lg">
              Manage the platform, view analytics, and configure settings.
            </p>
            <div className="flex gap-4 mt-6">
              <Button
                onClick={() => router.push("/admin")}
                className="bg-white text-gray-800 hover:bg-gray-200"
              >
                Go to Dashboard
              </Button>
              <Button
                onClick={() => router.push("/admin/analysis")}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                View Analytics
              </Button>
            </div>
          </div>
        </div>
      );
    } else if (user?.role === "restaurantAdmin") {
      setContent(
        <div className="relative h-screen w-full">
          <Image
            src="/boost-cafe-design.png"
            alt="Restaurant Admin Background"
            layout="fill"
            objectFit="cover"
            className="z-0"
          />
          <div className="absolute inset-0 bg-black opacity-50"></div>{" "}
          {/* Dark overlay */}
          <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white">
            <FaUtensils className="text-5xl mb-4" />
            <h1 className="text-5xl font-bold">Welcome, Restaurant Admin!</h1>
            <p className="mt-2 text-lg">
              Manage your restaurant&apos;s menu, orders, and reviews.
            </p>
            <div className="flex gap-4 mt-6">
              <Button
                onClick={() => router.push("/res-admin")}
                className="bg-white text-gray-800 hover:bg-gray-200"
              >
                Go to Dashboard
              </Button>
              <Button
                onClick={() => router.push("/res-admin/menu")}
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                Manage Menu
              </Button>
            </div>
          </div>
        </div>
      );
    } else {
      setContent(
        <div className="relative h-screen w-full">
          <Image
            src="/boost-cafe-design.png"
            alt="Public Background"
            layout="fill"
            objectFit="cover"
            className="z-0 "
          />
          <div className="absolute inset-0 bg-black opacity-50"></div>{" "}
          {/* Dark overlay */}
          <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white">
            <FaUser className="text-5xl mb-4" />
            <h1 className="text-5xl font-bold">Boost Cafe!</h1>
            <p className="mt-2 text-lg">
              Delicious, Healthy, and Organic food for everyone!
            </p>
            <div className="flex gap-6 mt-6">
              <Button
                onClick={() => router.push("/admin-login")}
                className="bg-white text-gray-800 hover:bg-gray-200"
              >
                Admin Login
              </Button>
              <Button
                onClick={() => router.push("/res-admin-login")}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                Restaurant Login
              </Button>
            </div>
          </div>
        </div>
      );
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse space-y-4">
          <div className="h-12 w-3/4 mx-auto bg-gray-300 rounded"></div>
          <div className="h-8 w-1/2 mx-auto bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {content}
      {user && (
        <div className="fixed bottom-8 right-8 z-20">
          <Button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white "
          >
            Logout
          </Button>
        </div>
      )}
    </div>
  );
}
