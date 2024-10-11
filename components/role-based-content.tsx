// components/RoleBasedContent.tsx
"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext/AuthContext";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { FaUserShield, FaUtensils, FaUser } from "react-icons/fa"; // Import icons from react-icons

export default function RoleBasedContent() {
  const { user, loading, handleLogout } = useAuth();
  console.log("🚀 ~ RoleBasedContent ~ user:", user);
  const router = useRouter();
  const [content, setContent] = useState<JSX.Element | null>(null);

  useEffect(() => {
    if (!loading && user) {
      // Determine content based on user role
      if (user.role === "admin") {
        setContent(
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FaUserShield className="h-6 w-6 text-primary" />
                Welcome, Admin!
              </CardTitle>
              <CardDescription>
                You have full access to the system.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Add more admin-specific content here */}
              <p className="text-muted-foreground">
                Manage users, view analytics, and configure settings.
              </p>
            </CardContent>
            <CardFooter>
              <Button onClick={() => router.push("/admin-login")}>
                Go to Admin Dashboard
              </Button>
            </CardFooter>
          </Card>
        );
      } else if (user.role === "restaurantAdmin") {
        setContent(
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FaUtensils className="h-6 w-6 text-primary" />
                Welcome, Restaurant Admin!
              </CardTitle>
              <CardDescription>
                You can manage your restaurant listings.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Add more restaurant admin-specific content here */}
              <p className="text-muted-foreground">
                Update menus, track orders, and respond to reviews.
              </p>
            </CardContent>
            <CardFooter>
              <Button onClick={() => router.push("/res-admin")}>
                Go to Restaurant Dashboard
              </Button>
            </CardFooter>
          </Card>
        );
      } else {
        setContent(
          <Alert>
            <FaUser className="h-5 w-5 text-primary" />
            <AlertTitle>Welcome back!</AlertTitle>
            <AlertDescription>
              We&apos;re glad to see you again. Explore new features and
              updates.
            </AlertDescription>
          </Alert>
        );
      }
    } else if (!loading && !user) {
      // User is not authenticated; show public content
      setContent(
        <div className="text-center">
          <h2 className="text-3xl font-bold">Welcome to Our Platform</h2>
          <p className="mt-2 text-lg text-muted-foreground">
            Please log in or sign up to enjoy more features.
          </p>
          <div className="flex gap-4 mt-6 justify-center">
            <Button onClick={() => router.push("/admin-login")}>
              Admin Login
            </Button>
            <Button onClick={() => router.push("/res-admin-login")}>
              Restaurant Login
            </Button>
          </div>
          {/* Add more public content here */}
        </div>
      );
    }
  }, [user, loading, router]);

  if (loading) {
    // Render a loading state while authentication is being verified
    return (
      <div className="mt-8 space-y-4">
        <Skeleton className="h-8 w-3/4 mx-auto" />
        <Skeleton className="h-6 w-1/2 mx-auto" />
        <Skeleton className="h-4 w-5/6 mx-auto" />
      </div>
    );
  }

  return (
    <div className="mt-8">
      {content}
      {user && (
        // Show logout button only if user is authenticated
        <div className="mt-6 flex justify-center">
          <Button variant="destructive" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      )}
    </div>
  );
}
