"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Redirect to dashboard if already logged in
  useEffect(() => {
    async function checkAuth() {
      const { createClient } = await import("@/utils/supabase/client");
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) router.replace("/dashboard");
    }
    checkAuth();
  }, [router]);

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { createClient } = await import("@/utils/supabase/client");
      const supabase = createClient();

      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(authError.message);
        setLoading(false);
        return;
      }

      router.push("/dashboard");
    } catch {
      setError("Something went wrong. Please try again.");
    }

    setLoading(false);
  }

  async function handleGoogleLogin() {
    try {
      const { createClient } = await import("@/utils/supabase/client");
      const supabase = createClient();
      const redirectTo = `${window.location.origin}/auth/callback`;

      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo },
      });
    } catch {
      setError("Google sign-in failed. Please try again.");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center gradient-hero-subtle px-4">
      {/* Background decoration */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -left-32 top-1/4 h-[500px] w-[500px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -right-32 top-1/3 h-[400px] w-[400px] rounded-full bg-impact/5 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="mb-8 flex items-center justify-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-[#8b5cf6] shadow-md">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight">Benevo</span>
        </Link>

        <div className="surface-card p-8 fade-up">
          <div className="text-center">
            <h1 className="section-title text-2xl font-bold">Welcome back</h1>
            <p className="mt-2 text-sm text-slate">Log in to your Benevo account</p>
          </div>

          {error && (
            <div className="mt-4 rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-danger">
              {error}
            </div>
          )}

          <form className="mt-6 space-y-4" onSubmit={handleLogin}>
            <div>
              <label className="input-label" htmlFor="login-email">Email address</label>
              <input
                id="login-email"
                className="input-field"
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="input-label" htmlFor="login-password">Password</label>
              <input
                id="login-password"
                className="input-field"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full btn-lg"
              id="login-submit"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in...
                </span>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-mist" />
            <span className="text-xs font-medium text-slate">OR</span>
            <div className="h-px flex-1 bg-mist" />
          </div>

          {/* Google Sign In */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="mt-4 flex w-full items-center justify-center gap-3 rounded-xl border border-mist bg-white px-4 py-3 text-sm font-semibold text-ink shadow-sm transition-all hover:bg-cloud hover:shadow-md"
            id="google-login"
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continue with Google
          </button>

          <p className="mt-6 text-center text-sm text-slate">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="font-semibold text-primary hover:text-primary-hover transition-colors">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
