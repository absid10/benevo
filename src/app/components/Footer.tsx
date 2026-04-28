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
              Where performance meets purpose. Track your scores, win prizes, and make a real difference for the charities you care about.
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
              <li><Link href="/signup" className="text-sm text-slate hover:text-primary transition-colors">Get Started</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate">Support</p>
            <ul className="space-y-2">
              <li><Link href="/#how-it-works" className="text-sm text-slate hover:text-primary transition-colors">FAQ</Link></li>
              <li><Link href="/#pricing" className="text-sm text-slate hover:text-primary transition-colors">Pricing</Link></li>
              <li><span className="text-sm text-slate">Privacy Policy</span></li>
              <li><span className="text-sm text-slate">Terms of Service</span></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate">Contact Us</p>
            <ul className="space-y-2">
              <li>
                <a href="mailto:siddiquiabdullahahmed75@gmail.com" className="text-sm text-slate hover:text-primary transition-colors flex items-center gap-1.5">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                  siddiquiabdullahahmed75@gmail.com
                </a>
              </li>
              <li>
                <a href="tel:+917420940665" className="text-sm text-slate hover:text-primary transition-colors flex items-center gap-1.5">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.64 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.1 6.1l.98-.98a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 17.92z"/></svg>
                  +91 74209 40665
                </a>
              </li>
              <li>
                <a href="https://www.linkedin.com/in/abdullah-ahmed-siddiqui" target="_blank" rel="noreferrer" className="text-sm text-slate hover:text-primary transition-colors flex items-center gap-1.5">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>
                  LinkedIn Profile
                </a>
              </li>
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
