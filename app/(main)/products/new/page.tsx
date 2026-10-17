"use client";

import { createProduct } from "@/lib/api";
import { ProductFormData } from "@/lib/types";
import { useRouter } from "next/navigation";
import ProductForm from "../productForm";

export default function NewProductPage() {
  const router = useRouter();

  const handleCreate = async (data: ProductFormData) => {
    try {
      const response = await createProduct(data);

      console.log(response);

      alert("Product created successfully!");

      router.push("/products");
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error ? error.message : "Failed to create product",
      );
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">Add Product</h1>

      <p className="mt-1 text-gray-600">Add a new product to your inventory.</p>

      <div className="mt-8">
        <ProductForm submitLabel="Add Product" onSubmit={handleCreate} />
      </div>
    </div>
  );
}
