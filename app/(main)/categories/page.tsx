"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { Category, Product } from "@/lib/types";
import { getCategories, getProducts } from "@/lib/api";

import AddCategoryButton from "@/app/components/categories/AddCategoryButton";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface CategoryStats {
  productCount: number;
  brandCount: number;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        const [categoryResponse, productResponse] = await Promise.all([
          getCategories(),
          getProducts(),
        ]);

        setCategories(categoryResponse.data);
        setProducts(productResponse.data);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to fetch category data.",
        );
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const getCategoryStats = (categoryId: string): CategoryStats => {
    const categoryProducts = products.filter(
      (product) => product.category?._id === categoryId,
    );

    const uniqueBrands = new Set(
      categoryProducts.map((product) => product.brand?.trim()).filter(Boolean),
    );

    return {
      productCount: categoryProducts.length,
      brandCount: uniqueBrands.size,
    };
  };

  if (loading) {
    return (
      <div className="flex min-h-75 items-center justify-center">
        <p className="text-muted-foreground">Loading categories...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-75 items-center justify-center">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Categories</h1>

          <p className="text-muted-foreground">
            Browse your products by category and brand.
          </p>
        </div>

        <AddCategoryButton />
      </div>

      {/* Empty State */}
      {categories.length === 0 ? (
        <div className="flex min-h-50 items-center justify-center rounded-lg border border-dashed">
          <p className="text-muted-foreground">No categories found.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => {
            const stats = getCategoryStats(category._id!);

            return (
              <Card
                key={category._id}
                className="transition-shadow hover:shadow-md"
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-xl">
                      📦
                    </div>

                    <span className="text-sm text-muted-foreground">
                      Category
                    </span>
                  </div>

                  <CardTitle className="mt-3">{category.name}</CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="min-h-12 text-sm text-muted-foreground">
                    {category.description || "No description available."}
                  </p>

                  {/* Statistics */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg border p-3">
                      <p className="text-xs text-muted-foreground">Products</p>

                      <p className="mt-1 text-lg font-semibold">
                        {stats.productCount}
                      </p>
                    </div>

                    <div className="rounded-lg border p-3">
                      <p className="text-xs text-muted-foreground">Brands</p>

                      <p className="mt-1 text-lg font-semibold">
                        {stats.brandCount}
                      </p>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="flex flex-wrap gap-2">
                  <Button className="flex-1">
                    <Link href={`/categories/${category._id}`}>
                      Browse Products →
                    </Link>
                  </Button>

                  <Button variant="outline" size="sm">
                    <Link href={`/categories/${category._id}/edit`}>Edit</Link>
                  </Button>

                  <Button variant="destructive" size="sm">
                    Delete
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
