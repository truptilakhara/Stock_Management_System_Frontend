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

export default function BrandProductsPage({
  params,
}: {
  params: Promise<{
    categoryId: string;
    brandName: string;
  }>;
}) {
  const { categoryId, brandName } = use(params);

  const decodedBrandName = decodeURIComponent(brandName);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);

        const response = await getProducts();

        const brandProducts = response.data.filter(
          (product: Product) =>
            product.category?._id === categoryId &&
            product.brand?.toLowerCase() === decodedBrandName.toLowerCase(),
        );

        setProducts(brandProducts);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Failed to fetch products.",
        );
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [categoryId, decodedBrandName]);

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
        <p className="text-sm text-muted-foreground">Brand</p>

        <h1 className="text-2xl font-bold tracking-tight">
          {decodedBrandName} Products
        </h1>

        <p className="text-muted-foreground">
          Browse all models available from {decodedBrandName}.
        </p>
      </div>

      {/* Empty State */}
      {products.length === 0 ? (
        <div className="flex min-h-50 items-center justify-center rounded-lg border border-dashed">
          <p className="text-muted-foreground">
            No products found for this brand.
          </p>
        </div>
      ) : (
        <>
          {/* Product Count */}
          <div className="text-sm text-muted-foreground">
            {products.length} {products.length === 1 ? "model" : "models"}{" "}
            available
          </div>

          {/* Product Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <Card
                key={product._id}
                className="flex h-full flex-col transition-shadow hover:shadow-md"
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-3">
                    <CardTitle className="leading-6">
                      {product.productName}
                    </CardTitle>

                    <span className="rounded-full bg-muted px-2 py-1 text-xs">
                      {product.sku}
                    </span>
                  </div>
                </CardHeader>

                <CardContent className="flex-1 space-y-4">
                  {/* Price */}
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Selling Price
                    </p>

                    <p className="text-xl font-bold">
                      ₹{product.sellingPrice.toLocaleString("en-IN")}
                    </p>
                  </div>

                  {/* Stock */}
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Available Stock
                    </p>

                    <p className="font-medium">{product.quantity} units</p>
                  </div>

                  {/* Minimum Stock */}
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Minimum Stock
                    </p>

                    <p className="font-medium">{product.minimumStock} units</p>
                  </div>
                </CardContent>

                <CardFooter>
                  <Button asChild className="w-full">
                    <Link href={`/products/${product._id}`}>
                      View Details →
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
