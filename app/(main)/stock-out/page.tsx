"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getProducts, getStockOutHistory } from "@/lib/api";
import { Product, StockOutRecord, StockOutSummary } from "@/lib/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export default function StockOutPage() {
  const [searchText, setSearchText] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [stockOutRecords, setStockOutRecords] = useState<StockOutRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [formData, setFormData] = useState<{
    product: string;
    quantity: number;
    reason: string;
    reference: string;
  }>({
    product: "",
    quantity: 1,
    reason: "Sold",
    reference: "",
  });
  const [summary, setSummary] = useState<StockOutSummary>({
    totalRecords: 0,
    totalQuantity: 0,
    todayQuantity: 0,
  });

  useEffect(() => {
    async function fetchStockOutRecords() {
      try {
        const data = await getStockOutHistory();
        setSummary(data.summary);
        setStockOutRecords(data.data);
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to fetch stock-out history.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    fetchStockOutRecords();
  }, []);
  useEffect(() => {
    async function fetchProducts() {
      try {
        const data = await getProducts();

        setProducts(data.data);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to load products.",
        );
      }
    }

    fetchProducts();
  }, []);
  const filteredStockOutRecords = useMemo(() => {
    const searchValue = searchText.trim().toLowerCase();

    return stockOutRecords.filter((record) => {
      const product =
        record.product && typeof record.product === "object"
          ? record.product
          : null;

      const matchesSearch =
        !searchValue ||
        (product?.productName ?? "").toLowerCase().includes(searchValue) ||
        (product?.sku ?? "").toLowerCase().includes(searchValue) ||
        (record.reason ?? "").toLowerCase().includes(searchValue) ||
        (record.reference ?? "").toLowerCase().includes(searchValue);

      const recordDate = new Date(record.createdAt);
      const localRecordDate = [
        recordDate.getFullYear(),
        String(recordDate.getMonth() + 1).padStart(2, "0"),
        String(recordDate.getDate()).padStart(2, "0"),
      ].join("-");

      const matchesDate = !selectedDate || localRecordDate === selectedDate;

      return matchesSearch && matchesDate;
    });
  }, [stockOutRecords, searchText, selectedDate]);
  const handleAddStockOut = () => {
    setIsDialogOpen(!isDialogOpen);
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formData);
  };
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Stock Out</h1>
          <p className="text-muted-foreground">
            Manage outgoing inventory and stock removals.
          </p>
        </div>

        <Button onClick={handleAddStockOut}>
          <Plus className="mr-2 h-4 w-4" />
          Record Stock Out
        </Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Records</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.totalRecords}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Quantity Removed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.totalQuantity}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Quantity Removed Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.todayQuantity}</div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Stock Out History</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

              <Input
                placeholder="Search product, SKU, reason or reference..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="pl-9"
              />
            </div>

            <Input
              type="date"
              aria-label="Filter stock-out records by date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="sm:w-[200px]"
            />

            {selectedDate && (
              <Button variant="outline" onClick={() => setSelectedDate("")}>
                Clear Date
              </Button>
            )}
          </div>

          <div className="mt-4 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Quantity Out</TableHead>
                  <TableHead>Available Stock</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-8 text-center">
                      Loading stock-out records...
                    </TableCell>
                  </TableRow>
                ) : filteredStockOutRecords.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="py-8 text-center text-muted-foreground"
                    >
                      No stock-out records found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredStockOutRecords.map((record) => {
                    const product =
                      record.product && typeof record.product === "object"
                        ? record.product
                        : null;

                    return (
                      <TableRow key={record._id}>
                        <TableCell>
                          {product?.productName ??
                            "Product details unavailable"}
                        </TableCell>

                        <TableCell>{record.quantity}</TableCell>

                        <TableCell>{product?.quantity ?? "—"}</TableCell>

                        <TableCell>{record.reason || "—"}</TableCell>

                        <TableCell>{record.reference || "—"}</TableCell>

                        <TableCell>
                          {new Date(record.createdAt).toLocaleDateString(
                            "en-IN",
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>

          {!isLoading && (
            <p className="mt-3 text-sm text-muted-foreground">
              Showing {filteredStockOutRecords.length} of{" "}
              {stockOutRecords.length} records
            </p>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        {/* <Button type="button" onClick={openAddDialog} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Supplier
        </Button> */}

        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Update Stock</DialogTitle>
            <DialogDescription>
              Enter the products details below.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="product-name">Product Name*</Label>
              <Select
                value={formData.product}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, product: value }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder="Select a product"
                    renderValue={(value) => {
                      const selectedProduct = products.find(
                        (product) => product._id === value,
                      );

                      return selectedProduct
                        ? `${selectedProduct.productName} — Stock: ${selectedProduct.quantity}`
                        : "Select a product";
                    }}
                  />
                </SelectTrigger>

                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product._id} value={product._id}>
                      {product.productName} — Stock: {product.quantity}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="company-name">Quantity*</Label>
              <Input
                type="number"
                id="quantity"
                placeholder="Enter quantity"
                value={formData.quantity}
                onChange={(e) =>
                  setFormData({ ...formData, quantity: Number(e.target.value) })
                }
                required
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="supplier-email">Reason*</Label>
                <Select
                  value={formData.reason}
                  onValueChange={(value) =>
                    setFormData({ ...formData, reason: value })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a reason" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sold">Sold</SelectItem>
                    <SelectItem value="Damaged">Damaged</SelectItem>
                    <SelectItem value="Supplier Return">
                      Supplier Return
                    </SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="supplier-address">Reference (optional)</Label>
              <Input
                id="ref"
                placeholder="City, State"
                value={formData.reference}
                onChange={(e) =>
                  setFormData({ ...formData, reference: e.target.value })
                }
              />
            </div>

            <DialogFooter className="gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Add</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
