import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AddCategoryButton() {
  return (
    <Button>
      <Link href={"/categories/new"}>+Add Category</Link>
    </Button>
  );
}
