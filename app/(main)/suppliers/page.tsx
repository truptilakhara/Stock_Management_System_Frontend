"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Building2,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Plus,
  Search,
  Trash2,
  Truck,
  Users,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { getSuppliers } from "@/lib/api";
import { Supplier } from "@/lib/types";

const emptyForm = {
  name: "",
  companyName: "",
  email: "",
  phone: "",
  address: "",
};

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  // Load suppliers from MongoDB through the backend API.
  useEffect(() => {
    let isMounted = true;

    async function loadSuppliers() {
      try {
        const response = await getSuppliers();

        // Supports { data: [...] }, { suppliers: [...] }, or [...].
        const supplierList = Array.isArray(response)
          ? response
          : Array.isArray(response?.data)
            ? response.data
            : response?.suppliers;

        if (!Array.isArray(supplierList)) {
          throw new Error("Invalid supplier data received from server.");
        }

        if (isMounted) {
          setSuppliers(supplierList);
        }
      } catch (error) {
        if (isMounted) {
          toast.error(
            error instanceof Error
              ? error.message
              : "Failed to load suppliers.",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadSuppliers();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredSuppliers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return suppliers.filter((supplier) =>
      [
        supplier.name,
        supplier.companyName,
        supplier.email,
        supplier.phone,
        supplier.address,
      ].some((value) => (value ?? "").toLowerCase().includes(query)),
    );
  }, [suppliers, search]);

  const suppliersWithEmail = suppliers.filter((supplier) =>
    Boolean(supplier.email?.trim()),
  ).length;

  function openAddDialog() {
    setEditingId(null);
    setForm({ ...emptyForm });
    setDialogOpen(true);
  }

  function openEditDialog(supplier: Supplier) {
    setEditingId(supplier?._id);

    setForm({
      name: supplier.name ?? "",
      companyName: supplier.companyName ?? "",
      email: supplier.email ?? "",
      phone: supplier.phone ?? "",
      address: supplier.address ?? "",
    });

    setDialogOpen(true);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const name = form.name.trim();
    const companyName = form.companyName.trim();
    const email = form.email.trim();
    const phone = form.phone.trim();
    const address = form.address.trim();

    if (!name || !companyName || !email || !phone || !address) {
      toast.error("Please fill in all required supplier fields.");
      return;
    }

    const duplicateEmail = suppliers.some(
      (supplier) =>
        supplier.email.toLowerCase() === email.toLowerCase() &&
        supplier._id !== editingId,
    );

    if (duplicateEmail) {
      toast.error("A supplier with this email already exists.");
      return;
    }

    // Temporary local-state update.
    // Replace this with your POST/PUT API calls to persist changes.
    if (editingId !== null) {
      setSuppliers((current) =>
        current.map((supplier) =>
          supplier._id === editingId
            ? {
                ...supplier,
                name,
                companyName,
                email,
                phone,
                address,
              }
            : supplier,
        ),
      );

      toast.success("Supplier updated in the current list.");
    } else {
      toast.error(
        "Add supplier API is not connected yet. No supplier was saved.",
      );
      return;
    }

    setDialogOpen(false);
    setForm({ ...emptyForm });
    setEditingId(null);
  }

  function handleDelete(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this supplier?",
    );

    if (!confirmed) return;

    // Temporary local-state deletion only.
    // Connect your DELETE API before removing database records.
    setSuppliers((current) =>
      current.filter((supplier) => supplier._id !== id),
    );

    toast.success("Supplier removed from the current list.");
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Suppliers
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your electronics suppliers and contact details.
          </p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger>
            <Button onClick={openAddDialog} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Supplier
            </Button>
          </DialogTrigger>

          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {editingId ? "Edit Supplier" : "Add New Supplier"}
              </DialogTitle>
              <DialogDescription>
                Enter the supplier details below.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="supplier-name">Supplier Name *</Label>
                <Input
                  id="supplier-name"
                  placeholder="Enter supplier name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company-name">Company Name *</Label>
                <Input
                  id="company-name"
                  placeholder="Enter company name"
                  value={form.companyName}
                  onChange={(e) =>
                    setForm({ ...form, companyName: e.target.value })
                  }
                  required
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="supplier-email">Email *</Label>
                  <Input
                    id="supplier-email"
                    type="email"
                    placeholder="supplier@example.com"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="supplier-phone">Phone *</Label>
                  <Input
                    id="supplier-phone"
                    type="tel"
                    placeholder="Enter phone number"
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="supplier-address">Address *</Label>
                <Input
                  id="supplier-address"
                  placeholder="City, State"
                  value={form.address}
                  onChange={(e) =>
                    setForm({ ...form, address: e.target.value })
                  }
                  required
                />
              </div>

              <DialogFooter className="gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingId ? "Save Changes" : "Add Supplier"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-muted-foreground">Total Suppliers</p>
              <p className="mt-2 text-3xl font-bold">{suppliers.length}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Registered vendors
              </p>
            </div>
            <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
              <Users className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-muted-foreground">
                Suppliers with Email
              </p>
              <p className="mt-2 text-3xl font-bold">{suppliersWithEmail}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Suppliers with contact email
              </p>
            </div>
            <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
              <Mail className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Supplier table */}
      <Card className="overflow-hidden">
        <CardHeader className="gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>All Suppliers</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              View and manage your registered suppliers.
            </p>
          </div>

          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search suppliers..."
              className="pl-9"
              aria-label="Search suppliers"
            />
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead className="border-y bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-4 font-medium">Supplier</th>
                  <th className="px-5 py-4 font-medium">Contact</th>
                  <th className="px-5 py-4 font-medium">Address</th>
                  <th className="px-5 py-4 text-right font-medium">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {isLoading ? (
                  <tr>
                    <td colSpan={4} className="px-5 py-12 text-center">
                      Loading suppliers...
                    </td>
                  </tr>
                ) : filteredSuppliers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-5 py-12 text-center">
                      <Truck className="mx-auto h-8 w-8 text-slate-300" />
                      <p className="mt-3 font-medium text-slate-700">
                        No suppliers found
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Try another search or add a supplier.
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredSuppliers.map((supplier) => (
                    <tr
                      key={supplier._id}
                      className="transition-colors hover:bg-slate-50/80"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                            <Building2 className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">
                              {supplier.name}
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground">
                              {supplier.companyName}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <p className="flex items-center gap-1.5 font-medium text-slate-800">
                          <Mail className="h-3.5 w-3.5" />
                          {supplier.email || "No email"}
                        </p>
                        <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Phone className="h-3.5 w-3.5" />
                          {supplier.phone}
                        </p>
                      </td>

                      <td className="px-5 py-4 text-slate-600">
                        <span className="flex items-center gap-1.5">
                          <MapPin className="h-4 w-4 shrink-0 text-slate-400" />
                          {supplier.address || "—"}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            aria-label={`Edit ${supplier.name}`}
                            onClick={() => openEditDialog(supplier)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            aria-label={`Delete ${supplier.name}`}
                            onClick={() => handleDelete(supplier._id)}
                            className="text-red-600 hover:bg-red-50 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="border-t px-5 py-3 text-xs text-muted-foreground">
            Showing {filteredSuppliers.length} of {suppliers.length} suppliers
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
