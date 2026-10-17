"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Supplier } from "@/lib/types";

interface SupplierSelectProps {
  suppliers: Supplier[];
  value: string;
  onChange: (value: string) => void;

  onCreateSupplier: (data: {
    name: string;
    phone: string;
    email: string;
    address: string;
    companyName: string;
  }) => Promise<Supplier>;
}

export default function SupplierSelect({
  suppliers,
  value,
  onChange,
  onCreateSupplier,
}: SupplierSelectProps) {
  const [open, setOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    companyName: "",
  });

  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    setError("");
  };

  const handleCreate = async () => {
    const { name, phone, email, address, companyName } = formData;

    if (
      !name.trim() ||
      !phone.trim() ||
      !email.trim() ||
      !address.trim() ||
      !companyName.trim()
    ) {
      setError("All supplier fields are required.");
      return;
    }

    try {
      setCreating(true);
      setError("");

      const newSupplier = await onCreateSupplier({
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        address: address.trim(),
        companyName: companyName.trim(),
      });
      onChange(newSupplier._id);

      setFormData({
        name: "",
        phone: "",
        email: "",
        address: "",
        companyName: "",
      });

      setOpen(false);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to create supplier.",
      );
    } finally {
      setCreating(false);
    }
  };

  const selectedSupplier = suppliers.find((supplier) => supplier._id === value);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Supplier</label>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button type="button" variant="link" className="px-0">
              + New Supplier
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Supplier</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Supplier Name</label>

                <Input
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="Enter supplier name"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Phone</label>

                <Input
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  placeholder="Enter phone number"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>

                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="Enter email"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Company Name</label>

                <Input
                  value={formData.companyName}
                  onChange={(e) => handleChange("companyName", e.target.value)}
                  placeholder="Enter company name"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Address</label>

                <textarea
                  value={formData.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                  placeholder="Enter supplier address"
                  className="min-h-24 w-full rounded-md border px-3 py-2 text-sm"
                />
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>

              <Button type="button" onClick={handleCreate} disabled={creating}>
                {creating ? "Creating..." : "Create Supplier"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue>
            {selectedSupplier?.name || "Select supplier"}
          </SelectValue>
        </SelectTrigger>

        <SelectContent>
          {suppliers.map((supplier) => (
            <SelectItem key={supplier._id} value={supplier._id}>
              {supplier.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
