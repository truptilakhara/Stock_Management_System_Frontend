"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Layers3,
  Truck,
  ArrowDownToLine,
  ArrowUpFromLine,
  History,
  Store,
  ChevronRight,
  Boxes,
  LogOutIcon,
  ReceiptText,
  BarChart3,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

const navigation = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Products", href: "/products", icon: Package },
  { label: "Categories", href: "/categories", icon: Layers3 },
  { label: "Suppliers", href: "/suppliers", icon: Truck },
  { label: "Stock In", href: "/stock-in", icon: ArrowDownToLine },
  { label: "Stock Out", href: "/stock-out", icon: ArrowUpFromLine },
  { label: "Billing/Sales", href: "/billing", icon: ReceiptText },
  { label: "Report", href: "/report", icon: BarChart3 },
  { label: "Staff Management", href: "/staff-mgmt", icon: Users },
  { label: "Transactions", href: "/transactions", icon: History },
];

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  function handleSignOut() {
    setIsDialogOpen(true);
  }
  const handleDialogSignOut = () => {
    setIsDialogOpen(false);
    localStorage.removeItem("token");
    toast.success("Signed out successfully.");
    router.replace("/signin");
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 lg:flex-row">
      {/* Sidebar */}
      <aside className="flex w-full shrink-0 flex-col border-b border-slate-200 bg-white lg:min-h-screen lg:w-64 lg:border-b-0 lg:border-r">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 border-b border-slate-100 px-6 py-6"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm">
            <Store className="h-6 w-6" />
          </div>

          <div className="min-w-0">
            <h1 className="text-sm font-bold tracking-wide">
              A. KUMAR ELECTRONICS
            </h1>
            <p className="mt-1 text-xs text-slate-500">Inventory Management</p>
          </div>
        </Link>

        <div className="px-4 pb-2 pt-6">
          <p className="px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Workspace
          </p>
        </div>

        <nav className="grid grid-cols-2 gap-1 px-3 pb-4 sm:grid-cols-3 lg:flex lg:flex-1 lg:flex-col lg:gap-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" &&
                pathname.startsWith(`${item.href}/`));

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`group flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                }`}
              >
                <Icon
                  className={`h-[18px] w-[18px] shrink-0 ${
                    isActive
                      ? "text-white"
                      : "text-slate-400 group-hover:text-slate-700"
                  }`}
                />
                <span>{item.label}</span>

                {isActive && (
                  <ChevronRight className="ml-auto hidden h-4 w-4 lg:block" />
                )}
              </Link>
            );
          })}

          <button
            type="button"
            onClick={handleSignOut}
            className="group flex items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-medium text-slate-600 transition-colors hover:bg-red-50 hover:text-red-700"
          >
            <LogOutIcon className="h-[18px] w-[18px] shrink-0 text-slate-400 group-hover:text-red-600" />
            <span>Sign Out</span>
          </button>
        </nav>

        <div className="m-4 hidden rounded-xl bg-slate-50 p-4 lg:block">
          <div className="mb-2 flex items-center gap-2">
            <Boxes className="h-4 w-4 text-slate-700" />
            <p className="text-sm font-semibold">Stock overview</p>
          </div>
          <p className="text-xs leading-5 text-slate-500">
            Manage your products, stock movements and suppliers in one place.
          </p>
        </div>
      </aside>

      {/* Page Content */}
      <div className="flex min-w-0 flex-1 flex-col">
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto w-full max-w-[1600px]">{children}</div>
        </main>

        <footer className="border-t border-slate-200 bg-white px-6 py-4 text-center text-xs text-slate-500">
          © 2026 A. KUMAR ELECTRONICS
          <span className="mx-2 text-slate-300">•</span>
          Inventory Management System
        </footer>
      </div>
      {/* SIGN-OUT ALER DIALOG */}
      <AlertDialog open={isDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sign Out?</AlertDialogTitle>

            <AlertDialogDescription>
              Are you sure you want to Sign Out?{" "}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDialogOpen(false)}>
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={handleDialogSignOut}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Sign Out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
