"use client";

import { ReactNode, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { useRouter } from "next/navigation";
type UserRole = "user" | "admin" | "restaurantAdmin";
interface RoleBasedRouteProps {
  allowedRoles: UserRole[];
  children: ReactNode;
}

export function RoleBasedRoute({
  allowedRoles,
  children,
}: RoleBasedRouteProps) {
  const { user, loading } = useAuth();
  console.log("🚀 ~ user:", user);
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else if (!allowedRoles.includes(user.role)) {
        router.push("/unauthorized");
      }
    }
  }, [user, loading, router, allowedRoles]);

  if (loading || !user) {
    return <div>Loading...</div>; // Replace with a spinner or skeleton if desired
  }

  return <>{children}</>;
}
