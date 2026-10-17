"use client";

import { useRouter } from "next/navigation";

export default function AddProductButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push("/products/new")}
      className="rounded-lg bg-black px-4 py-2 text-white"
    >
      + Add Product
    </button>
  );
}
