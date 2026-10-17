"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { getDashboard } from "../../../lib/api";

import {
  Package,
  Boxes,
  ArrowDownToLine,
  ArrowUpFromLine,
  Users,
  AlertTriangle,
  History,
  RefreshCw,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface DashboardData {
  totalProducts: number;
  totalUsers?: number;
  totalStock: number;
  totalStockIn: number;
  totalStockOut: number;
  lowStockProducts: any[];
  recentTransactions: any[];
}

export default function Dashboard() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        setError("");

        const data = await getDashboard();

        setDashboard(data.data);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Failed to load dashboard.",
        );
      } finally {
        setLoading(false);
      }
    }

    fetchDashboard();
  }, [retry]);

  const handleRetry = () => {
    setLoading(true);
    setError("");
    setRetry((prev) => prev + 1);
  };

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />

          <p className="text-sm text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center p-8 text-center">
            <div className="mb-4 rounded-full bg-destructive/10 p-3">
              <AlertTriangle className="h-7 w-7 text-destructive" />
            </div>

            <h2 className="text-xl font-semibold">Failed to load dashboard</h2>

            <p className="mt-2 text-sm text-muted-foreground">{error}</p>

            <Button onClick={handleRetry} className="mt-5">
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!dashboard) {
    return null;
  }

  const summaryCards = [
    {
      title: "Total Products",
      value: dashboard.totalProducts,
      description: "Products in inventory",
      icon: Package,
    },
    {
      title: "Total Stock",
      value: dashboard.totalStock,
      description: "Available quantity",
      icon: Boxes,
    },
    {
      title: "Stock In",
      value: dashboard.totalStockIn,
      description: "Total quantity added",
      icon: ArrowDownToLine,
      valueClass: "text-green-600",
    },
    {
      title: "Stock Out",
      value: dashboard.totalStockOut,
      description: "Total quantity removed",
      icon: ArrowUpFromLine,
      valueClass: "text-red-600",
    },
    ...(dashboard.totalUsers !== undefined
      ? [
          {
            title: "Total Users",
            value: dashboard.totalUsers,
            description: "Registered users",
            icon: Users,
          },
        ]
      : []),
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>

        <p className="mt-1 text-muted-foreground">
          Overview of your electronics shop inventory
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {summaryCards.map((card) => {
          const Icon = card.icon;

          return (
            <Card key={card.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {card.title}
                    </p>

                    <p
                      className={`mt-2 text-3xl font-bold ${
                        card.valueClass ?? ""
                      }`}
                    >
                      {card.value}
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      {card.description}
                    </p>
                  </div>

                  <div className="rounded-lg bg-muted p-3">
                    <Icon className="h-5 w-5 text-muted-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Sections */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Low Stock Products */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Low Stock Products
                </CardTitle>

                <p className="mt-1 text-sm text-muted-foreground">
                  Products that need restocking
                </p>
              </div>

              {dashboard.lowStockProducts.length > 0 && (
                <Badge variant="secondary">
                  {dashboard.lowStockProducts.length}
                </Badge>
              )}
            </div>
          </CardHeader>

          <CardContent>
            {dashboard.lowStockProducts.length === 0 ? (
              <div className="rounded-lg border border-dashed p-8 text-center">
                <Package className="mx-auto h-8 w-8 text-muted-foreground" />

                <p className="mt-3 font-medium">No low-stock products</p>

                <p className="mt-1 text-sm text-muted-foreground">
                  Your inventory is currently well stocked.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {dashboard.lowStockProducts.slice(0, 5).map((product) => (
                  <div
                    key={product._id}
                    className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium">
                        {product.productName}
                      </p>

                      <p className="mt-1 text-xs text-muted-foreground">
                        SKU: {product.sku}
                      </p>
                    </div>

                    <div className="ml-4 text-right">
                      <p className="font-semibold text-red-600">
                        {product.quantity}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        Min: {product.minimumStock}
                      </p>
                    </div>
                  </div>
                ))}

                {dashboard.lowStockProducts.length > 5 && (
                  <p className="pt-2 text-center text-xs text-muted-foreground">
                    + {dashboard.lowStockProducts.length - 5} more low-stock
                    products
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Recent Transactions
            </CardTitle>

            <p className="text-sm text-muted-foreground">
              Latest stock activity
            </p>
          </CardHeader>

          <CardContent>
            {dashboard.recentTransactions.length === 0 ? (
              <div className="rounded-lg border border-dashed p-8 text-center">
                <History className="mx-auto h-8 w-8 text-muted-foreground" />

                <p className="mt-3 font-medium">No recent transactions</p>

                <p className="mt-1 text-sm text-muted-foreground">
                  Stock activity will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {dashboard.recentTransactions.slice(0, 5).map((transaction) => {
                  const isStockIn = transaction.type === "stock-in";

                  return (
                    <div
                      key={transaction._id}
                      className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-medium">
                          {transaction.product?.productName ??
                            "Unknown Product"}
                        </p>

                        <div className="mt-2 flex items-center gap-2">
                          <Badge
                            variant={isStockIn ? "default" : "destructive"}
                          >
                            {isStockIn ? "Stock In" : "Stock Out"}
                          </Badge>

                          <span className="text-xs text-muted-foreground">
                            {transaction.createdBy?.name ?? "Unknown User"}
                          </span>
                        </div>

                        <p className="mt-1 text-xs text-muted-foreground">
                          {transaction.createdAt
                            ? new Date(
                                transaction.createdAt,
                              ).toLocaleDateString()
                            : "Unknown date"}
                        </p>
                      </div>

                      <div className="ml-4 text-right">
                        <p
                          className={`text-lg font-bold ${
                            isStockIn ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {isStockIn ? "+" : "-"}
                          {transaction.quantity}
                        </p>

                        <p className="text-xs text-muted-foreground">units</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
