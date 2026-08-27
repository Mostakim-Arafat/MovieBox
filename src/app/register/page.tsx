"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signUp } from "@/lib/auth-client";
import { toast } from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const formdata = new FormData(e.currentTarget);
    const data = Object.fromEntries(formdata.entries());

    if (data.password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsSubmitting(true);

    await signUp.email(
      {
        email: data.email as string,
        password: data.password as string,
        name: data.name as string,
      },
      {
        onSuccess: () => {
          toast.success("Account created successfully!");
          router.push("/login");
        },
        onError: (ctx) => {
          setError(ctx.error.message);
          setIsSubmitting(false);
        },
      }
    );
  };

  const handleGoogleSignUp = async() => {
    const data = await authClient.signIn.social({
       provider: "google",
     });
     console.log(data)
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute left-[-20%] top-[-20%] h-[60%] w-[60%] rounded-full bg-rose-900/10 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-[-20%] right-[-20%] h-[60%] w-[60%] rounded-full bg-blue-900/10 blur-[120px]" />

      <div className="relative z-10 w-full max-w-md space-y-8 rounded-2xl border border-border bg-card/80 p-8 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col items-center justify-center text-center">
          <Link href="/" className="group mb-2 flex items-center gap-2">
            <svg
              className="h-8 w-8 text-rose-600 transition-transform duration-300 group-hover:scale-110"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
              />
            </svg>
            <span className="text-2xl font-black tracking-wider text-foreground">
              MOVIE<span className="text-rose-600">BOX</span>
            </span>
          </Link>
          <h2 className="mt-4 text-xl font-bold tracking-tight text-foreground">
            Create your account
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Join MovieBox to track your favorite movies
          </p>
        </div>

        {error && (
          <div className="rounded-md border border-rose-800/50 bg-rose-950/50 p-3 text-sm text-rose-400">
            {error}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="full-name" className="block text-sm font-medium text-muted-foreground">
              Full name
            </label>
            <input
              id="full-name"
              name="name"
              type="text"
              required
              className="mt-1.5 block w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/70 focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition-all"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label htmlFor="email-address" className="block text-sm font-medium text-muted-foreground">
              Email address
            </label>
            <input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="mt-1.5 block w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/70 focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition-all"
              placeholder="name@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-muted-foreground">
              Password
            </label>
            <div className="relative mt-1.5">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                minLength={8}
                className="block w-full rounded-lg border border-border bg-background py-2.5 pl-3.5 pr-11 text-sm text-foreground placeholder:text-muted-foreground/70 focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition-all"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3 text-muted-foreground transition-colors hover:text-foreground"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="confirm-password" className="block text-sm font-medium text-muted-foreground">
              Confirm password
            </label>
            <div className="relative mt-1.5">
              <input
                id="confirm-password"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                required
                minLength={8}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="block w-full rounded-lg border border-border bg-background py-2.5 pl-3.5 pr-11 text-sm text-foreground placeholder:text-muted-foreground/70 focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition-all"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3 text-muted-foreground transition-colors hover:text-foreground"
                title={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full cursor-pointer justify-center rounded-lg border border-transparent bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50"
          >
            {isSubmitting ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <div className="relative flex items-center py-2">
          <div className="grow border-t border-border"></div>
          <span className="mx-4 shrink text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Or continue with
          </span>
          <div className="grow border-t border-border"></div>
        </div>

        <button
          onClick={handleGoogleSignUp}
          type="button"
          className="flex w-full items-center justify-center gap-2.5 rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-semibold text-foreground transition-all hover:bg-muted focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:ring-offset-2 focus:ring-offset-background"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
          </svg>
          Google
        </button>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-rose-500 transition-colors hover:text-rose-400">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}