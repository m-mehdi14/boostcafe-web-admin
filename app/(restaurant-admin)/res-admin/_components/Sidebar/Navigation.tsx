"use client";

// import { useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { Fullscreen, Users, UserCircle, ShieldBan } from "lucide-react";
import { NavItem, NavItemSkeleton } from "./nav-item";
import { useAuth } from "@/lib/AuthContext/AuthContext";

export const Navigation = () => {
  const pathname = usePathname();
  // const user = currentUser();
  const { user } = useAuth();

  const routes = [
    {
      label: "Home",
      href: `/`,
      icon: Fullscreen,
    },
    {
      label: "Restaurant Management",
      href: `/admin`,
      icon: UserCircle,
    },
    {
      label: "Order Management",
      href: `/admin/order-management`,
      icon: UserCircle,
    },
    {
      label: "User Management",
      href: `/admin/user-management`,
      icon: ShieldBan,
    },
    {
      label: "Setting",
      href: `/admin/setting`,
      icon: Users,
    },
  ];

  if (!user?.name) {
    return (
      <ul className=" space-y-2">
        {[...Array(4)].map((_, i) => (
          <NavItemSkeleton key={i} />
        ))}
      </ul>
    );
  }

  return (
    <ul className=" space-y-2 px-2 pt-4 lg:pt-0">
      {routes.map((route) => (
        <NavItem
          key={route.href}
          label={route.label}
          icon={route.icon}
          href={route.href}
          isActive={pathname === route.href}
        />
      ))}
    </ul>
  );
};
