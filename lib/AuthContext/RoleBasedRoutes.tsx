/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";

import { ReactNode, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { useRouter } from "next/navigation";
import { MoonLoader } from "react-spinners";

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
        router.push("/");
        // @ts-ignore
      } else if (!allowedRoles.includes(user?.role)) {
        router.push("/unauthorized");
      }
    }
  }, [user, loading, router, allowedRoles]);

  if (loading || !user) {
    return (
      <>
        <div className=" min-h-screen w-full flex flex-row items-center justify-center">
          <MoonLoader size={35} />
        </div>
      </>
    ); // Replace with a spinner or skeleton if desired
  }

  return <>{children}</>;
}
