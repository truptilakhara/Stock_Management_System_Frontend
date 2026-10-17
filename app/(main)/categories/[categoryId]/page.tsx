"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";

import { getProducts } from "@/lib/api";
import { Product } from "@/lib/types";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface BrandSummary {
  brand: string;
  productCount: number;
  minPrice: number;
  maxPrice: number;
}

export default function CategoryProductsPage({
  params,
}: {
  params: Promise<{ categoryId: string }>;
}) {
  const { categoryId } = use(params);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);

        const response = await getProducts();

        const categoryProducts = response.data.filter(
          (product: Product) => product.category?._id === categoryId,
        );

        setProducts(categoryProducts);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Failed to fetch products.",
        );
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [categoryId]);

  const brandMap = new Map<string, BrandSummary>();

  products.forEach((product) => {
    const brand = product.brand?.trim() || "Other";

    const existingBrand = brandMap.get(brand);

    if (existingBrand) {
      existingBrand.productCount += 1;
      existingBrand.minPrice = Math.min(
        existingBrand.minPrice,
        product.sellingPrice,
      );
      existingBrand.maxPrice = Math.max(
        existingBrand.maxPrice,
        product.sellingPrice,
      );
    } else {
      brandMap.set(brand, {
        brand,
        productCount: 1,
        minPrice: product.sellingPrice,
        maxPrice: product.sellingPrice,
      });
    }
  });

  const brands = Array.from(brandMap.values());

  if (loading) {
    return (
      <div className="flex min-h-75 items-center justify-center">
        <p className="text-muted-foreground">Loading products...</p>
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
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Category Products</h1>

        <p className="text-muted-foreground">Browse products by brand.</p>
      </div>

      {/* Empty State */}
      {brands.length === 0 ? (
        <div className="flex min-h-50 items-center justify-center rounded-lg border border-dashed">
          <p className="text-muted-foreground">
            No products found in this category.
          </p>
        </div>
      ) : (
        <>
          {/* Summary */}
          <div className="text-sm text-muted-foreground">
            {products.length} {products.length === 1 ? "product" : "products"}{" "}
            found across {brands.length}{" "}
            {brands.length === 1 ? "brand" : "brands"}.
          </div>

          {/* Brand Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {brands.map((brand) => (
              <Card
                key={brand.brand}
                className="transition-shadow hover:shadow-md"
              >
                <CardHeader>
                  <CardTitle>{brand.brand}</CardTitle>
                </CardHeader>

                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Products</p>

                    <p className="text-lg font-semibold">
                      {brand.productCount}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Price Range</p>

                    <p className="font-medium">
                      ₹{brand.minPrice.toLocaleString("en-IN")}
                      {" - "}₹{brand.maxPrice.toLocaleString("en-IN")}
                    </p>
                  </div>
                </CardContent>

                <CardFooter>
                  <Button asChild className="w-full">
                    <Link
                      href={`/categories/${categoryId}/brand/${encodeURIComponent(
                        brand.brand,
                      )}`}
                    >
                      View Products →
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
