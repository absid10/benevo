"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      try {
        const { createClient } = await import("@/utils/supabase/client");
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        setIsLoggedIn(!!user);
      } catch {
        setIsLoggedIn(false);
      }
    }
    checkAuth();
  }, []);

  return (
    <nav className="sticky top-0 z-50 border-b border-mist/60 bg-white/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-[#8b5cf6] shadow-sm">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
          </div>
          <span className="text-lg font-bold tracking-tight text-ink group-hover:text-primary transition-colors">
            Benevo
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-1 md:flex">
          <Link href="/#how-it-works" className="btn-ghost rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:text-primary">
            How It Works
          </Link>
          <Link href="/charities" className="btn-ghost rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:text-primary">
            Charities
          </Link>
          <Link href="/#pricing" className="btn-ghost rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:text-primary">
            Pricing
          </Link>
          <div className="mx-2 h-5 w-px bg-mist" />
          {isLoggedIn ? (
            <>
              <Link href="/dashboard" className="btn-ghost rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:text-primary">
                Dashboard
              </Link>
              <Link href="/dashboard" className="btn btn-primary ml-1 text-sm">
                My Account
              </Link>
            </>
          ) : (
            <>
              <Link href="/login" className="btn-ghost rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:text-primary">
                Log in
              </Link>
              <Link href="/signup" className="btn btn-primary ml-1 text-sm">
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-cloud md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M3 12h18M3 6h18M3 18h18" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="border-t border-mist bg-white px-4 pb-4 pt-2 md:hidden" style={{ animation: "slideDown 200ms ease-out" }}>
          <Link href="/#how-it-works" className="block rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-cloud" onClick={() => setMobileOpen(false)}>
            How It Works
          </Link>
          <Link href="/charities" className="block rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-cloud" onClick={() => setMobileOpen(false)}>
            Charities
          </Link>
          <Link href="/#pricing" className="block rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-cloud" onClick={() => setMobileOpen(false)}>
            Pricing
          </Link>
          <hr className="divider my-2" />
          {isLoggedIn ? (
            <Link href="/dashboard" className="btn btn-primary mt-2 w-full text-sm" onClick={() => setMobileOpen(false)}>
              Dashboard
            </Link>
          ) : (
            <>
              <Link href="/login" className="block rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-cloud" onClick={() => setMobileOpen(false)}>
                Log in
              </Link>
              <Link href="/signup" className="btn btn-primary mt-2 w-full text-sm" onClick={() => setMobileOpen(false)}>
                Get Started
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
