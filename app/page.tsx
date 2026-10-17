import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/40 px-4 py-10">
      <Card className="w-full max-w-lg border-border shadow-sm">
        <CardHeader className="items-center space-y-4 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-xl font-bold text-primary-foreground">
            AK
          </div>

          <div className="space-y-2">
            <CardTitle className="text-3xl font-bold tracking-tight">
              A. KUMAR ELECTRONICS
            </CardTitle>

            <CardDescription className="text-base">
              Electronics Shop Stock Management System
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          <Link
            href="/signin"
            className={buttonVariants({
              className: "w-full",
            })}
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className={buttonVariants({
              variant: "outline",
              className: "w-full",
            })}
          >
            Create Account
          </Link>
          <p className="pt-3 text-center text-xs text-muted-foreground">
            Manage products, stock and suppliers in one place.
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
