"use client";

import { cn } from "@/lib/utils";
import { FileText, Home, LayoutDashboard, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ElementType } from "react";

export const Sidebar = () => (
  <aside className="bg-white text-black border-r border-gray-200 w-70 min-h-screen hidden lg:block" >
    <SidebarContent />
  </aside>
);

const SidebarContent = () => {
  const pathname = usePathname();
  const sidebarItems = [
    {
      icon: Home,
      label: "Trang chủ",
      href: "/",
    },
    {
      icon: LayoutDashboard,
      label: "Tổng quan",
      href: "/dashboard",
    },
    {
      icon: FileText,
      label: "Kết quả",
      href: "/dashboard/results",
    },
    {
      icon: Settings,
      label: "Cài đặt",
      href: "/dashboard/settings",
    },
  ];

  return (
    <div className="bg-white text-black h-full flex flex-col">
      <nav className="grow p-6">
        <ul role="list" className="flex flex-col grow">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {sidebarItems.map((item) => {
                return <NavLink key={item.label} path={pathname} link={item} />;
              })}
            </ul>
          </li>
        </ul>
      </nav>
    </div>
  );
};

const NavLink = ({
  path,
  link,
}: {
  path: string;
  link: {
    icon: ElementType;
    label: string;
    href: string;
    target?: string;
  };
}) => {
  return (
    <li key={link.label}>
      <Link
        href={link.href}
        target={link.target}
        className={cn(
          "group flex h-9 items-center gap-x-3 rounded-md px-3 text-sm font-semibold leading-5 text-black",
          path === link.href ? "bg-gray-200" : "hover:bg-gray-200",
        )}
      >
        <link.icon className="size-4 shrink-0" />
        <span>{link.label}</span>
      </Link>
    </li>
  );
};
interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 overflow-x-hidden bg-white overflow-y-auto p-6">
        {children}
      </main>
    </div>
  );
}
