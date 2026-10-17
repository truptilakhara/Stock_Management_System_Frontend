"use client";

import { getProductById, updateProductById } from "@/lib/api";
import { use, useEffect, useState } from "react";
import { Product, ProductFormData } from "@/lib/types";
import ProductForm from "../../productForm";
import { useRouter } from "next/navigation";

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

import { AlertTriangle } from "lucide-react";

export default function ProductEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Confirmation dialog
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // Store form data until user confirms
  const [pendingData, setPendingData] = useState<ProductFormData | null>(null);

  // Update loading
  const [updating, setUpdating] = useState(false);

  // Success message
  const [successMessage, setSuccessMessage] = useState("");

  /* ---------------- Fetch Product ---------------- */

  useEffect(() => {
    async function fetchProductDetails() {
      try {
        setLoading(true);

        const data = await getProductById(id);

        setProduct(data.data);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Failed to fetch product.",
        );
      } finally {
        setLoading(false);
      }
    }

    fetchProductDetails();
  }, [id]);

  /* ---------------- Form Submit ---------------- */

  const handleUpdate = async (data: ProductFormData) => {
    // Don't update immediately.
    // First ask the user for confirmation.
    setPendingData(data);
    setShowConfirmDialog(true);
  };

  /* ---------------- Confirm Update ---------------- */

  const confirmUpdate = async () => {
    if (!pendingData) return;

    try {
      setUpdating(true);

      await updateProductById(id, pendingData);

      setShowConfirmDialog(false);
      setPendingData(null);

      setSuccessMessage("Product updated successfully!");

      // Give the user a moment to see the success message
      setTimeout(() => {
        router.push("/products");
      }, 1000);
    } catch (error) {
      setShowConfirmDialog(false);

      setError(
        error instanceof Error ? error.message : "Failed to update product.",
      );
    } finally {
      setUpdating(false);
    }
  };

  /* ---------------- Loading ---------------- */

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-muted border-t-primary" />

          <p className="text-sm text-muted-foreground">Loading product...</p>
        </div>
      </div>
    );
  }

  /* ---------------- Error ---------------- */

  if (error && !product) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="max-w-md rounded-lg border p-6 text-center">
          <AlertTriangle className="mx-auto mb-3 h-8 w-8 text-destructive" />

          <h2 className="font-semibold">Failed to load product</h2>

          <p className="mt-2 text-sm text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <h2 className="font-semibold">Product not found</h2>

          <p className="mt-2 text-sm text-muted-foreground">
            The product you are trying to edit does not exist.
          </p>
        </div>
      </div>
    );
  }

  /* ---------------- Initial Form Data ---------------- */

  const initialData: ProductFormData = {
    productName: product.productName,
    sku: product.sku,
    quantity: product.quantity,
    minimumStock: product.minimumStock,
    purchasePrice: product.purchasePrice,
    sellingPrice: product.sellingPrice,
    brand: product.brand ?? "",
    description: product.description ?? "",
    category: product.category._id,
    supplier: product.supplier._id,
  };

  return (
    <div className="space-y-6">
      {/* Header */}

      <div>
        <h1 className="text-2xl font-bold tracking-tight">Edit Product</h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Update product information.
        </p>
      </div>

      {/* Success Message */}

      {successMessage && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {successMessage}
        </div>
      )}

      {/* Update Error */}

      {error && product && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Product Form */}

      <ProductForm
        initialData={initialData}
        submitLabel={updating ? "Updating..." : "Update Product"}
        onSubmit={handleUpdate}
      />

      {/* Confirmation Dialog */}

      <AlertDialog
        open={showConfirmDialog}
        onOpenChange={(open) => {
          if (!updating) {
            setShowConfirmDialog(open);

            if (!open) {
              setPendingData(null);
            }
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Update Product?</AlertDialogTitle>

            <AlertDialogDescription>
              Are you sure you want to update{" "}
              <span className="font-medium text-foreground">
                {product.productName}
              </span>
              ? The existing product information will be replaced with the
              updated values.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={updating}>Cancel</AlertDialogCancel>

            <AlertDialogAction onClick={confirmUpdate} disabled={updating}>
              {updating ? "Updating..." : "Confirm Update"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
