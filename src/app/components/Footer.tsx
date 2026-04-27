import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-mist bg-white">
      <div className="container py-12 md:py-16">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-[#8b5cf6]">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                </svg>
              </div>
              <span className="text-base font-bold tracking-tight">Benevo</span>
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-slate">
              Where performance meets purpose. Track your scores, win prizes, and make a real difference.
            </p>
          </div>

          {/* Platform */}
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate">Platform</p>
            <ul className="space-y-2">
              <li><Link href="/#how-it-works" className="text-sm text-slate hover:text-primary transition-colors">How It Works</Link></li>
              <li><Link href="/#pricing" className="text-sm text-slate hover:text-primary transition-colors">Pricing</Link></li>
              <li><Link href="/charities" className="text-sm text-slate hover:text-primary transition-colors">Charities</Link></li>
              <li><Link href="/dashboard" className="text-sm text-slate hover:text-primary transition-colors">Dashboard</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate">Support</p>
            <ul className="space-y-2">
              <li><span className="text-sm text-slate">FAQ</span></li>
              <li><span className="text-sm text-slate">Contact Us</span></li>
              <li><span className="text-sm text-slate">Privacy Policy</span></li>
              <li><span className="text-sm text-slate">Terms of Service</span></li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate">Connect</p>
            <ul className="space-y-2">
              <li><span className="text-sm text-slate">Twitter / X</span></li>
              <li><span className="text-sm text-slate">Instagram</span></li>
              <li><span className="text-sm text-slate">LinkedIn</span></li>
            </ul>
          </div>
        </div>

        <hr className="divider mt-8 mb-6" />

        <div className="flex flex-col items-center justify-between gap-2 sm:flex-row">
          <p className="text-xs text-slate">
            © {new Date().getFullYear()} Benevo. All rights reserved.
          </p>
          <p className="text-xs text-slate">
            Built with 💜 for charity impact
          </p>
        </div>
      </div>
    </footer>
  );
}
