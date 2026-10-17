"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Category } from "@/lib/types";

interface CategorySelectProps {
  categories: Category[];
  value: string;
  onChange: (value: string) => void;
  onCreateCategory: (name: string, description: string) => Promise<Category>;
}

export default function CategorySelect({
  categories,
  value,
  onChange,
  onCreateCategory,
}: CategorySelectProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) {
      setError("Category name is required.");
      return;
    }

    try {
      setCreating(true);
      setError("");

      const newCategory = await onCreateCategory(
        name.trim(),
        description.trim(),
      );

      // Automatically select newly created category
      onChange(newCategory?._id);

      // Reset dialog
      setName("");
      setDescription("");
      setOpen(false);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to create category.",
      );
    } finally {
      setCreating(false);
    }
  };
  console.log(
    categories.find((category) => category._id === value)?.name,
    value,
    categories.map((ele) => ele._id),
  );

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Category</label>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button type="button" variant="link" className="px-0">
              + New Category
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Category</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Category Name</label>

                <Input
                  value={name}
                  placeholder="Enter category name"
                  onChange={(e) => {
                    setName(e.target.value);
                    setError("");
                  }}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>

                <textarea
                  value={description}
                  placeholder="Enter description"
                  onChange={(e) => setDescription(e.target.value)}
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
                {creating ? "Creating..." : "Create Category"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue>
            {categories.find((category) => category._id === value)?.name ||
              "Select category"}
          </SelectValue>
        </SelectTrigger>

        <SelectContent>
          {categories.map((category) => (
            <SelectItem key={category._id} value={category._id}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
