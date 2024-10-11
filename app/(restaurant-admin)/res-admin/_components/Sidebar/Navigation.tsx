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
      href: `/res-admin`,
      icon: Fullscreen,
    },
    {
      label: "Profile Management",
      href: `/res-admin/profile`,
      icon: UserCircle,
    },
    {
      label: "Menu Management",
      href: `/res-admin/menu`,
      icon: UserCircle,
    },
    {
      label: "Order Management",
      href: `/res-admin/order`,
      icon: ShieldBan,
    },
    {
      label: "Analytics & Reports",
      href: `/res-admin/analysis`,
      icon: Users,
    },
    {
      label: "Promotions Management",
      href: `/res-admin/promotion`,
      icon: Users,
    },
    {
      label: "Reviews & Feedback",
      href: `/res-admin/review`,
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
