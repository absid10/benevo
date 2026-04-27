"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function CTAButton({ className = "", children, size = "default" }: { className?: string; children: React.ReactNode; size?: "default" | "lg" }) {
  const [href, setHref] = useState("/signup");

  useEffect(() => {
    async function checkAuth() {
      try {
        const { createClient } = await import("@/utils/supabase/client");
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) setHref("/dashboard");
      } catch { /* stay on signup */ }
    }
    checkAuth();
  }, []);

  return (
    <Link href={href} className={`btn btn-primary ${size === "lg" ? "btn-lg" : ""} ${className}`}>
      {children}
    </Link>
  );
}
