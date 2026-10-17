"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { deleteProductById, getCategories, getProducts } from "@/lib/api";

import { Product, Category } from "@/lib/types";

//import AddProductButton from "../components/products/AddProductButton";
import AddProductButton from "@/app/components/products/AddProductButton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Eye,
  Pencil,
  Search,
  Trash2,
  X,
} from "lucide-react";

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

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchText, setSearchText] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [sortOption, setSortOption] = useState("default");

  const [productsFilter, setProductsFilter] = useState<Product[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [deleteProductId, setDeleteProductId] = useState<string | null>(null);
  const [deleteProductName, setDeleteProductName] = useState("");

  const [successMessage, setSuccessMessage] = useState("");

  /* ---------------- Fetch Data ---------------- */

  useEffect(() => {
    async function fetchProducts() {
      try {
        const data = await getProducts();

        setProducts(data.data);
        setProductsFilter(data.data);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Failed to load products.",
        );
      } finally {
        setLoading(false);
      }
    }

    async function fetchCategories() {
      try {
        const data = await getCategories();
        setCategories(data.data);
      } catch (error) {
        console.error("Failed to load categories:", error);
      }
    }

    fetchProducts();
    fetchCategories();
  }, []);

  /* ---------------- Filter Logic ---------------- */

  const handleFilter = (
    searchValue: string,
    categoryValue: string,
    stockValue: string,
  ) => {
    const filteredData = products.filter(
      ({ productName, sku, supplier, category, quantity, minimumStock }) => {
        const matchesSearch =
          productName.toLowerCase().includes(searchValue) ||
          sku.toLowerCase().includes(searchValue) ||
          supplier?.name?.toLowerCase().includes(searchValue) ||
          category?.name?.toLowerCase().includes(searchValue);

        const matchesCategory =
          categoryValue === "all" || category?.name === categoryValue;

        let matchesStock = true;

        if (stockValue === "outofstock") {
          matchesStock = quantity === 0;
        } else if (stockValue === "lowstock") {
          matchesStock = quantity > 0 && quantity <= minimumStock;
        } else if (stockValue === "instock") {
          matchesStock = quantity > minimumStock;
        }

        return matchesSearch && matchesCategory && matchesStock;
      },
    );

    setProductsFilter(filteredData);
    setCurrentPage(1);
  };

  /* ---------------- Search ---------------- */

  const handleSearch = (value: string) => {
    setSearchText(value);

    handleFilter(value.trim().toLowerCase(), categoryFilter, stockFilter);
  };

  /* ---------------- Category Filter ---------------- */

  const handleCategoryChange = (value: string) => {
    setCategoryFilter(value);

    handleFilter(searchText.trim().toLowerCase(), value, stockFilter);
  };

  /* ---------------- Stock Filter ---------------- */

  const handleStockChange = (value: string) => {
    setStockFilter(value);

    handleFilter(searchText.trim().toLowerCase(), categoryFilter, value);
  };

  /* ---------------- Clear Filters ---------------- */

  const handleClearFilters = () => {
    setSearchText("");
    setCategoryFilter("all");
    setStockFilter("all");
    setSortOption("default");
    setProductsFilter(products);
    setCurrentPage(1);
  };

  /* ---------------- Sorting ---------------- */

  const handleSort = (value: string) => {
    setSortOption(value);

    const sortedData = [...productsFilter];

    switch (value) {
      case "name-asc":
        sortedData.sort((a, b) => a.productName.localeCompare(b.productName));
        break;

      case "name-desc":
        sortedData.sort((a, b) => b.productName.localeCompare(a.productName));
        break;

      case "price-low":
        sortedData.sort((a, b) => a.sellingPrice - b.sellingPrice);
        break;

      case "price-high":
        sortedData.sort((a, b) => b.sellingPrice - a.sellingPrice);
        break;

      case "quantity-low":
        sortedData.sort((a, b) => a.quantity - b.quantity);
        break;

      case "quantity-high":
        sortedData.sort((a, b) => b.quantity - a.quantity);
        break;

      default:
        break;
    }

    setProductsFilter(sortedData);
    setCurrentPage(1);
  };

  /* ---------------- Stock Status ---------------- */

  const getStockStatus = (quantity: number, minimumStock: number) => {
    if (quantity === 0) {
      return {
        label: "Out of Stock",
        variant: "destructive" as const,
      };
    }

    if (quantity <= minimumStock) {
      return {
        label: "Low Stock",
        variant: "secondary" as const,
      };
    }

    return {
      label: "In Stock",
      variant: "default" as const,
    };
  };

  /* ---------------- Delete ---------------- */

  const openDeleteDialog = (product: Product) => {
    setDeleteProductId(product._id);
    setDeleteProductName(product.productName);
  };

  const handleDelete = async () => {
    if (!deleteProductId) return;

    try {
      await deleteProductById(deleteProductId);

      setProducts((prev) =>
        prev.filter((product) => product._id !== deleteProductId),
      );

      setProductsFilter((prev) =>
        prev.filter((product) => product._id !== deleteProductId),
      );

      setDeleteProductId(null);
      setDeleteProductName("");

      setSuccessMessage("Product deleted successfully.");

      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to delete product.",
      );

      setDeleteProductId(null);
    }
  };

  /* ---------------- Pagination ---------------- */

  const totalPages = Math.ceil(productsFilter.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;

  const endIndex = startIndex + itemsPerPage;

  const currentProducts = productsFilter.slice(startIndex, endIndex);

  /* ---------------- Loading ---------------- */

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-muted border-t-primary" />

          <p className="text-sm text-muted-foreground">Loading products...</p>
        </div>
      </div>
    );
  }

  /* ---------------- Error ---------------- */

  if (error) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="max-w-md rounded-lg border p-6 text-center">
          <AlertTriangle className="mx-auto mb-3 h-8 w-8 text-destructive" />

          <h2 className="font-semibold">Failed to load products</h2>

          <p className="mt-2 text-sm text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Products</h1>

          <p className="text-sm text-muted-foreground">
            Manage your electronics inventory.
          </p>
        </div>

        <AddProductButton />
      </div>

      {/* Success Message */}

      {successMessage && (
        <div className="flex items-center justify-between rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          <span>{successMessage}</span>

          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => setSuccessMessage("")}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Filters */}

      <div className="rounded-lg border bg-card p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          {/* Search */}

          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              type="text"
              value={searchText}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search by product, SKU, supplier..."
              className="pl-9"
            />
          </div>

          {/* Category */}

          <Select value={categoryFilter} onValueChange={handleCategoryChange}>
            <SelectTrigger className="w-full lg:w-48">
              <SelectValue placeholder="Category" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>

              {categories.map((category) => (
                <SelectItem key={category._id} value={category.name}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Stock */}

          <Select value={stockFilter} onValueChange={handleStockChange}>
            <SelectTrigger className="w-full lg:w-40">
              <SelectValue placeholder="Stock" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">All Stock</SelectItem>

              <SelectItem value="instock">In Stock</SelectItem>

              <SelectItem value="lowstock">Low Stock</SelectItem>

              <SelectItem value="outofstock">Out of Stock</SelectItem>
            </SelectContent>
          </Select>

          {/* Sort */}

          <Select value={sortOption} onValueChange={handleSort}>
            <SelectTrigger className="w-full lg:w-48">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="default">Sort By</SelectItem>

              <SelectItem value="name-asc">Name: A → Z</SelectItem>

              <SelectItem value="name-desc">Name: Z → A</SelectItem>

              <SelectItem value="price-low">Price: Low → High</SelectItem>

              <SelectItem value="price-high">Price: High → Low</SelectItem>

              <SelectItem value="quantity-low">Quantity: Low → High</SelectItem>

              <SelectItem value="quantity-high">
                Quantity: High → Low
              </SelectItem>
            </SelectContent>
          </Select>

          {/* Clear */}

          <Button
            variant="outline"
            onClick={handleClearFilters}
            disabled={
              searchText === "" &&
              categoryFilter === "all" &&
              stockFilter === "all" &&
              sortOption === "default"
            }
          >
            Clear
          </Button>
        </div>
      </div>

      {/* Product Count */}

      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">Products</p>

          <p className="text-sm text-muted-foreground">
            {productsFilter.length} product
            {productsFilter.length !== 1 ? "s" : ""} found
          </p>
        </div>
      </div>

      {/* Table */}

      <div className="overflow-hidden rounded-lg border">
        <div className="overflow-x-auto">
          <Table className="min-w-[900px]">
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Selling Price</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {currentProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-40 text-center">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Search className="h-8 w-8 text-muted-foreground" />

                      <p className="font-medium">No products found</p>

                      <p className="text-sm text-muted-foreground">
                        Try changing your search or filters.
                      </p>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleClearFilters}
                      >
                        Clear Filters
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                currentProducts.map((product) => {
                  const stockStatus = getStockStatus(
                    product.quantity,
                    product.minimumStock,
                  );

                  return (
                    <TableRow key={product._id}>
                      {/* Product */}

                      <TableCell>
                        <div>
                          <p className="font-medium">{product.productName}</p>

                          {product.brand && (
                            <p className="text-xs text-muted-foreground">
                              {product.brand}
                            </p>
                          )}
                        </div>
                      </TableCell>

                      {/* SKU */}

                      <TableCell className="font-mono text-sm">
                        {product.sku}
                      </TableCell>

                      {/* Category */}

                      <TableCell>{product.category?.name || "—"}</TableCell>

                      {/* Quantity */}

                      <TableCell>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-medium">
                            {product.quantity}
                          </span>

                          <Badge variant={stockStatus.variant}>
                            {stockStatus.label}
                          </Badge>
                        </div>
                      </TableCell>

                      {/* Price */}

                      <TableCell className="font-medium">
                        ₹{product.sellingPrice.toLocaleString("en-IN")}
                      </TableCell>

                      {/* Actions */}

                      <TableCell>
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            title="View product"
                          >
                            <Link href={`/products/${product._id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>

                          <Button
                            variant="ghost"
                            size="icon"
                            title="Edit product"
                          >
                            <Link href={`/products/${product._id}/edit`}>
                              <Pencil className="h-4 w-4" />
                            </Link>
                          </Button>

                          <Button
                            variant="ghost"
                            size="icon"
                            title="Delete product"
                            className="text-destructive hover:text-destructive"
                            onClick={() => openDeleteDialog(product)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Bottom Section */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Showing{" "}
          <span className="font-medium text-foreground">
            {currentProducts.length}
          </span>{" "}
          of{" "}
          <span className="font-medium text-foreground">
            {productsFilter.length}
          </span>{" "}
          products
        </p>

        <div className="flex flex-wrap items-center gap-2">
          {/* Items per page */}

          <Select
            value={String(itemsPerPage)}
            onValueChange={(value) => {
              setItemsPerPage(Number(value));
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="10">10 / page</SelectItem>

              <SelectItem value="20">20 / page</SelectItem>

              <SelectItem value="50">50 / page</SelectItem>
            </SelectContent>
          </Select>

          {/* Previous */}

          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage((prev) => prev - 1)}
            disabled={currentPage === 1}
            title="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {/* Page Number */}

          <div className="flex h-9 min-w-20 items-center justify-center rounded-md border px-3 text-sm">
            Page {currentPage} of {Math.max(totalPages, 1)}
          </div>

          {/* Next */}

          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
            title="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Delete Confirmation */}

      <AlertDialog
        open={deleteProductId !== null}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteProductId(null);
            setDeleteProductName("");
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product?</AlertDialogTitle>

            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-medium text-foreground">
                {deleteProductName}
              </span>
              ? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>

            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Product
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
