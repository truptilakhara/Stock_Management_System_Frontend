"use client";

import { getProducts } from "@/lib/api";
import Link from "next/link";
import { use, useEffect, useState } from "react";

interface Category {
  _id: string;
  name: string;
}

interface ProductData {
  _id: string;
  productName: string;
  sku: string;
  quantity: number;
  minimumStock: number;
  purchasePrice: number;
  sellingPrice: number;
  brand?: string;
  description?: string;
  category: Category;
  supplier: object;
}

export default function ProductDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [products, setProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getProducts();

      setProducts(data.data);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to load dashboard.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const { id } = use(params);

  const product = products.find((p) => p._id === id);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (!product) {
    return <h1>Product not found</h1>;
  }
  if (error) {
    return (
      <div>
        <h1>Failed to load product</h1>
        <p>{error}</p>

        <button onClick={fetchProducts}>Retry</button>
      </div>
    );
  }
  return (
    <div className="max-w-5xl">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/products"
          className="text-sm text-blue-600 hover:underline"
        >
          ← Back to Products
        </Link>

        <h1 className="mt-3 text-3xl font-bold text-gray-900">
          {product.productName}
        </h1>

        <p className="mt-1 text-gray-500">
          Product details and inventory information
        </p>
      </div>

      {/* Main Card */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Product Information */}
          <div>
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Product Information
            </h2>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Product Name</p>
                <p className="font-medium text-gray-900">
                  {product.productName}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">SKU</p>
                <p className="font-medium text-gray-900">{product.sku}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Category</p>
                <p className="font-medium text-gray-900">
                  {product.category.name}
                </p>
              </div>

              {product.brand && (
                <div>
                  <p className="text-sm text-gray-500">Brand</p>
                  <p className="font-medium text-gray-900">{product.brand}</p>
                </div>
              )}
            </div>
          </div>

          {/* Inventory Information */}
          <div>
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Inventory Information
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-sm text-gray-500">Current Stock</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">
                  {product.quantity}
                </p>
              </div>

              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-sm text-gray-500">Minimum Stock</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">
                  {product.minimumStock}
                </p>
              </div>

              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-sm text-gray-500">Purchase Price</p>
                <p className="mt-1 text-xl font-bold text-gray-900">
                  ₹{product.purchasePrice}
                </p>
              </div>

              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-sm text-gray-500">Selling Price</p>
                <p className="mt-1 text-xl font-bold text-gray-900">
                  ₹{product.sellingPrice}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        {product.description && (
          <div className="mt-8 border-t pt-6">
            <h2 className="mb-2 text-lg font-semibold text-gray-900">
              Description
            </h2>

            <p className="text-gray-600">{product.description}</p>
          </div>
        )}
      </div>
    </div>
  );
}
