"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const MainNav = () => {
  const pathName = usePathname();

  const routes = [
    {
      href: "/",
      label: "Dashboard",
      active: pathName === "/",
    },
    {
      href: "/sizes",
      label: "Sizes",
      active: pathName === "sizes",
    },
    {
      href: "/colors",
      label: "Colors",
      active: pathName === "colors",
    },
    {
      href: "/products",
      label: "Products",
      active: pathName === "products",
    },
    {
      href: "/inventory",
      label: "Inventory",
      active: pathName === "inventory",
    },
  ];

  return (
    <div className="ml-auto flex items-center gap-6 lg:gap-10">
      {routes.map((route) => (
        <div key={route.href}>
          <Link
            className={cn(
              "text-sm hover:text-black",
              route.active ? "text-black" : "text-muted-foreground"
            )}
            href={route.href}
          >
            {route.label}
          </Link>
        </div>
      ))}
    </div>
  );
};

export default MainNav;
