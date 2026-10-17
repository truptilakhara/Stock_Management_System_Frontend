"use client";

import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff, Store } from "lucide-react";
import { useRouter } from "next/navigation";
import { GoogleLogin } from "@react-oauth/google";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { googleSignIn, signIn } from "@/lib/api";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSignInLoading, setIsSignInLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const router = useRouter();

  async function handleGoogleSuccess(credential: string) {
    setIsGoogleLoading(true);

    try {
      const data = await googleSignIn(credential);
      localStorage.setItem("token", data.token);
      toast.success("Google sign-in successful!");
      router.push("/dashboard");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Google sign-in failed. Please try again.",
      );
    } finally {
      setIsGoogleLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!email.trim() || !password) {
      toast.warning("Please enter your email and password.");
      return;
    }

    setIsSignInLoading(true);

    try {
      const data = await signIn({
        email: email.trim(),
        password,
      });

      localStorage.setItem("token", data.token);
      toast.success("Sign-in successful!");
      router.push("/dashboard");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Sign-in failed. Please try again.",
      );
    } finally {
      setIsSignInLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-md">
        <Card className="border-slate-200 shadow-lg">
          <CardHeader className="space-y-4 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-sm">
              <Store className="h-7 w-7" />
            </div>

            <div className="space-y-2">
              <CardTitle className="text-2xl font-bold tracking-tight">
                Welcome back
              </CardTitle>
              <CardDescription className="text-sm leading-6">
                Sign in to manage your shop inventory.
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div
                className={
                  isGoogleLoading ? "pointer-events-none opacity-60" : "w-full"
                }
              >
                <GoogleLogin
                  onSuccess={(response) => {
                    if (response.credential) {
                      void handleGoogleSuccess(response.credential);
                    } else {
                      toast.error("Google did not return a credential.");
                    }
                  }}
                  onError={() => {
                    toast.error(
                      "Google sign-in was unsuccessful. Please try again.",
                    );
                  }}
                  text="continue_with"
                  shape="rectangular"
                  width="100%"
                />
              </div>

              {isGoogleLoading && (
                <p
                  role="status"
                  className="text-center text-sm text-muted-foreground"
                >
                  Signing in with Google...
                </p>
              )}
            </div>

            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <span className="whitespace-nowrap text-xs font-medium text-muted-foreground">
                OR CONTINUE WITH EMAIL
              </span>
              <div className="h-px flex-1 bg-border" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signin-email">Email address</Label>
                <Input
                  id="signin-email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isSignInLoading || isGoogleLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="signin-password">Password</Label>

                <div className="relative">
                  <Input
                    id="signin-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    className="pr-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isSignInLoading || isGoogleLoading}
                  />

                  <button
                    type="button"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    aria-pressed={showPassword}
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isSignInLoading || isGoogleLoading}
              >
                {isSignInLoading ? "Signing in..." : "Sign in"}
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link
                href="/signup"
                className="font-medium text-primary hover:underline"
              >
                Create account
              </Link>
            </p>
          </CardContent>

          <p className="pb-5 text-center text-xs text-slate-400">
            A. KUMAR ELECTRONICS · Inventory Management
          </p>
        </Card>
      </div>
    </div>
  );
}
