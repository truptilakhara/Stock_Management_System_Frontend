"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Plus, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { getStockInHistory } from "@/lib/api";
import { toast } from "sonner";
import { StockInRecord, Supplier } from "@/lib/types";

export default function StockInPage() {
  const [stockInRecords, setStockInRecords] = useState<StockInRecord[]>([]);
  const [filteredStockInRecords, setFilteredStockInRecords] = useState<
    StockInRecord[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [date, setDate] = useState(() => {
    const today = new Date();
    const offset = today.getTimezoneOffset();
    return new Date(today.getTime() - offset * 60_000)
      .toISOString()
      .slice(0, 10);
  });
  useEffect(() => {
    async function fetchStockInData() {
      setIsLoading(true);
      try {
        const data = await getStockInHistory();

        setStockInRecords(data.data);
        setFilteredStockInRecords(data.data);
        const uniqueSuppliers: Supplier[] = Array.from(
          new Map<string, Supplier>(
            data.data
              .filter((record) => record.supplier?._id)
              .map(
                (record) =>
                  [record.supplier!._id, record.supplier!] as [
                    string,
                    Supplier,
                  ],
              ),
          ).values(),
        );

        setSuppliers(uniqueSuppliers);
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to fetch stock-in data.",
        );
      } finally {
        setIsLoading(false);
      }
    }
    fetchStockInData();
  }, []);

  const handleSearchChange = (value: string) => {
    setSearchText(value);
    searchAndDateFilter(value.trim().toLowerCase(), date, selectedSupplier);
  };

  const handleDateChange = (value: string) => {
    setDate(value);
    searchAndDateFilter(
      searchText.trim().toLowerCase(),
      value,
      selectedSupplier,
    );
  };
  const handleSupplierChange = (value: string) => {
    console.log(value);
    setSelectedSupplier(value);
    searchAndDateFilter(searchText.trim().toLowerCase(), date, value);
  };
  const searchAndDateFilter = (
    searchValue: string,
    dateValue: string,
    supplierId: string,
  ) => {
    const filteredData = stockInRecords.filter(
      ({ product, supplier, reference, createdAt }) => {
        const matchesSearch =
          product?.productName?.toLowerCase().includes(searchValue) ||
          supplier?.name?.toLowerCase().includes(searchValue) ||
          reference?.toLowerCase().includes(searchValue);

        const matchesDate =
          new Date(createdAt).toDateString() ===
          new Date(`${dateValue}T00:00:00`).toDateString();

        const matchesSupplier =
          supplierId === "all" || !supplierId || supplier?._id === supplierId;

        return matchesSearch && matchesDate && matchesSupplier;
      },
    );

    setFilteredStockInRecords(filteredData);
  };
  const units = filteredStockInRecords.reduce((acc, curr) => {
    return (acc = acc + curr.quantity);
  }, 0);
  const totalReceipts = filteredStockInRecords.length;
  const todayTotalReceipts = filteredStockInRecords.filter(
    ({ createdAt }) =>
      new Date(createdAt).toDateString() === new Date().toDateString(),
  ).length;
  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Stock In</h1>
          <p className="text-sm text-muted-foreground">
            Manage incoming inventory and stock receipts.
          </p>
        </div>

        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Stock In
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Stock Received
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{units} units</div>
            <p className="text-xs text-muted-foreground">
              Across recent receipts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Receipts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalReceipts}</div>
            <p className="text-xs text-muted-foreground">
              Stock-in transactions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Today's Receipts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayTotalReceipts}</div>
            <p className="text-xs text-muted-foreground">Received today</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Stock In */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Stock In</CardTitle>
          <CardDescription>
            View and search your incoming stock transactions.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search product, supplier or invoice..."
                className="pl-9"
                value={searchText}
                onChange={(e) => handleSearchChange(e.target.value)}
              />
            </div>
            <Input
              type="date"
              className="sm:w-[180px]"
              onChange={(e) => handleDateChange(e.target.value)}
              value={date}
            />
            <Select
              value={selectedSupplier}
              onValueChange={handleSupplierChange}
            >
              <SelectTrigger className="sm:w-[200px]">
                <SelectValue placeholder="All suppliers" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All suppliers</SelectItem>

                {suppliers.map((supplier) => (
                  <SelectItem key={supplier._id} value={supplier._id}>
                    {supplier.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Invoice No.</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Received Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      Loading stock-in records...
                    </TableCell>
                  </TableRow>
                ) : filteredStockInRecords.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      No stock-in records found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredStockInRecords.map((record) => (
                    <TableRow key={record._id}>
                      <TableCell>
                        {record.product?.productName ?? "Unknown product"}
                      </TableCell>
                      <TableCell>{record.supplier?.name ?? "—"}</TableCell>
                      <TableCell>{record.reference || "—"}</TableCell>
                      <TableCell>{record.quantity}</TableCell>
                      <TableCell>
                        {new Date(record.createdAt).toLocaleDateString("en-IN")}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">Received</Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
