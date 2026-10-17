"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Category, ProductFormData, Supplier } from "@/lib/types";
import Link from "next/link";
import CategorySelect from "../components/categories/categorySelect";
import {
  createCategory,
  createSupplier,
  getCategories,
  getSuppliers,
} from "@/lib/api";
import SupplierSelect from "../components/suppliers/supplierSelect";

interface ProductFormProps {
  initialData?: ProductFormData;
  submitLabel: string;
  onSubmit: (data: ProductFormData) => Promise<void>;
}

export default function ProductForm({
  initialData,
  submitLabel,
  onSubmit,
}: ProductFormProps) {
  console.log(initialData);
  const [formData, setFormData] = useState<ProductFormData>(
    initialData || {
      productName: "",
      sku: "",
      quantity: 0,
      minimumStock: 0,
      purchasePrice: 0,
      sellingPrice: 0,
      brand: "",
      description: "",
      category: "",
      supplier: "",
    },
  );

  const [categories, setCategories] = useState<Category[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  const handleChange = (
    field: keyof ProductFormData,
    value: string | number,
  ) => {
    console.log(value);
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData);
  };
  useEffect(() => {
    async function fetchCategories() {
      try {
        const data = await getCategories();
        setCategories(data.data);
      } catch (error) {
        console.error("Failed to load categories:", error);
      }
    }
    async function fetchSuppliers() {
      try {
        const data = await getSuppliers();
        setSuppliers(data.data);
      } catch (error) {
        console.error("Failed to load suppliers:", error);
      }
    }
    fetchSuppliers();
    fetchCategories();
  }, []);
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, []);
  return (
    <>
      {" "}
      <Link href="/products" className="text-sm text-blue-600 hover:underline">
        ← Back to Products
      </Link>
      <form
        onSubmit={handleSubmit}
        className="max-w-3xl space-y-6 rounded-lg border p-6"
      >
        <div className="space-y-2">
          <label className="text-sm font-medium">Product Name</label>
          <Input
            value={formData?.productName}
            onChange={(e) => handleChange("productName", e.target.value)}
            placeholder="Enter product name"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">SKU</label>
          <Input
            value={formData.sku}
            onChange={(e) => handleChange("sku", e.target.value)}
            placeholder="Enter SKU"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Quantity</label>
          <Input
            type="number"
            value={formData.quantity}
            onChange={(e) => handleChange("quantity", Number(e.target.value))}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Minimum Stock</label>
          <Input
            type="number"
            value={formData.minimumStock}
            onChange={(e) =>
              handleChange("minimumStock", Number(e.target.value))
            }
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Purchase Price</label>
          <Input
            type="number"
            value={formData.purchasePrice}
            onChange={(e) =>
              handleChange("purchasePrice", Number(e.target.value))
            }
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Selling Price</label>
          <Input
            type="number"
            value={formData.sellingPrice}
            onChange={(e) =>
              handleChange("sellingPrice", Number(e.target.value))
            }
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Brand</label>
          <Input
            value={formData.brand || ""}
            onChange={(e) => handleChange("brand", e.target.value)}
            placeholder="Enter brand"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Description</label>
          <textarea
            value={formData.description || ""}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="Enter product description"
            className="min-h-24 w-full rounded-md border px-3 py-2 text-sm"
          />
        </div>

        <div className="space-y-2">
          <CategorySelect
            categories={categories}
            value={formData.category}
            onChange={(value) => handleChange("category", value)}
            onCreateCategory={async (name, description) => {
              // We will connect the API here
              try {
                const response = await createCategory({ name, description });
                const newCategory = response.data;

                setCategories((prev) => [...prev, newCategory]);

                return newCategory;
              } catch (error) {
                throw new Error(
                  error instanceof Error
                    ? error.message
                    : "Failed to create category",
                );
              }
            }}
          />
        </div>

        <div className="space-y-2">
          <SupplierSelect
            suppliers={suppliers}
            value={formData.supplier}
            onChange={(value) => handleChange("supplier", value)}
            onCreateSupplier={async (data) => {
              try {
                const response = await createSupplier(data);

                const newSupplier = response.data;

                setSuppliers((prev) => [...prev, newSupplier]);

                return newSupplier;
              } catch (error) {
                throw new Error(
                  error instanceof Error
                    ? error.message
                    : "Failed to create supplier",
                );
              }
            }}
          />
        </div>

        <Button type="submit">{submitLabel}</Button>
      </form>
    </>
  );
}
