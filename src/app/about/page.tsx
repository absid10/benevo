import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — Benevo",
  description:
    "Learn about Benevo — the platform that combines competitive golf scoring with real charitable impact. Our mission, story, and the team behind it.",
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="gradient-hero-subtle min-h-screen">
        {/* Hero */}
        <section className="py-16 md:py-24">
          <div className="container">
            <div className="mx-auto max-w-2xl text-center fade-up">
              <span className="badge bg-primary-soft text-primary mb-4">About Us</span>
              <h1 className="section-title text-3xl font-bold md:text-5xl">
                Where performance{" "}
                <span className="bg-gradient-to-r from-primary via-[#8b5cf6] to-impact bg-clip-text text-transparent">
                  meets purpose
                </span>
              </h1>
              <p className="mt-4 text-base text-slate md:text-lg">
                Benevo was built on a simple idea: your golf game can do more than just track your handicap — it can change lives.
              </p>
            </div>
          </div>
        </section>

        {/* Mission */}
        <section className="pb-20 md:pb-28">
          <div className="container">
            <div className="mx-auto max-w-3xl">
              <div className="surface-card p-8 md:p-12 fade-up">
                <span className="badge bg-impact-soft text-impact mb-4">Our Mission</span>
                <h2 className="section-title text-2xl font-bold md:text-3xl mt-2">
                  Making every round count — for you and for the world
                </h2>
                <p className="mt-4 text-base leading-relaxed text-slate">
                  We believe that sport and social impact go hand in hand. Benevo is a subscription platform that lets golfers
                  track their Stableford scores each month, compete in prize draws, and automatically fund the charities they
                  care about — all in one place.
                </p>
                <p className="mt-4 text-base leading-relaxed text-slate">
                  A portion of every subscription goes directly to your chosen charity. You set the percentage, you choose the
                  cause, and you watch your impact grow alongside your game.
                </p>
              </div>

              {/* Values */}
              <div className="mt-8 grid gap-6 md:grid-cols-3">
                {[
                  {
                    icon: (
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      </svg>
                    ),
                    bg: "var(--primary-soft)",
                    title: "Transparency",
                    description: "Every penny is accounted for. We show you exactly how much goes to charity, the prize pool, and our operating costs.",
                  },
                  {
                    icon: (
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--impact)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                      </svg>
                    ),
                    bg: "var(--impact-soft)",
                    title: "Real Impact",
                    description: "We partner with verified charities so your contributions create measurable, documented change in the world.",
                  },
                  {
                    icon: (
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--amber)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                      </svg>
                    ),
                    bg: "var(--amber-soft)",
                    title: "Fair Play",
                    description: "Our draw mechanics are fully transparent. Your scores are your numbers — no algorithms, no hidden advantages.",
                  },
                ].map((v) => (
                  <div key={v.title} className="surface-card hover-lift p-7 text-center fade-up">
                    <div
                      className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl"
                      style={{ background: v.bg }}
                    >
                      {v.icon}
                    </div>
                    <h3 className="mt-5 text-lg font-bold">{v.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate">{v.description}</p>
                  </div>
                ))}
              </div>

              {/* Story */}
              <div className="surface-card mt-8 p-8 md:p-12 fade-up">
                <span className="badge bg-amber-soft text-amber mb-4">Our Story</span>
                <h2 className="section-title text-2xl font-bold md:text-3xl mt-2">
                  Born on the fairway, built for change
                </h2>
                <p className="mt-4 text-base leading-relaxed text-slate">
                  Benevo started as a personal project to combine two things that matter: competitive sport and giving back.
                  The idea was simple — what if your golf score didn&apos;t just live in a spreadsheet, but actually did something
                  meaningful in the world?
                </p>
                <p className="mt-4 text-base leading-relaxed text-slate">
                  We built the first version to answer that question. Monthly draws, score-based entries, real charity contributions — all
                  automated so you can focus on playing your best game while we handle the rest.
                </p>
                <p className="mt-4 text-base leading-relaxed text-slate">
                  Today, Benevo is a full platform available to golfers who want their hobby to have a lasting impact.
                  We&apos;re growing the charity network, improving the draw experience, and always listening to our community.
                </p>
              </div>

              {/* Tech Stack */}
              <div className="surface-card mt-8 p-8 md:p-12 fade-up">
                <span className="badge bg-primary-soft text-primary mb-4">Built With</span>
                <h2 className="section-title text-2xl font-bold md:text-3xl mt-2">
                  Technology at the core
                </h2>
                <p className="mt-4 text-base leading-relaxed text-slate">
                  Benevo is built on modern, reliable technology to ensure your data is secure and the platform is always fast.
                </p>
                <div className="mt-6 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                  {[
                    { label: "Frontend", value: "Next.js 16 + React 19" },
                    { label: "Styling", value: "Tailwind CSS 4" },
                    { label: "Language", value: "TypeScript 5" },
                    { label: "Database", value: "Supabase (PostgreSQL)" },
                    { label: "Auth", value: "Supabase Auth + OAuth" },
                    { label: "Payments", value: "Stripe" },
                    { label: "Deployment", value: "Vercel" },
                    { label: "Security", value: "Row-Level Security (RLS)" },
                  ].map((t) => (
                    <div key={t.label} className="flex items-start gap-2 rounded-xl bg-cloud px-4 py-3 text-sm">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--impact)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                      <span><span className="font-semibold text-ink">{t.label}:</span> <span className="text-slate">{t.value}</span></span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact */}
              <div className="surface-card mt-8 p-8 md:p-12 fade-up">
                <span className="badge bg-impact-soft text-impact mb-4">Get In Touch</span>
                <h2 className="section-title text-2xl font-bold md:text-3xl mt-2">
                  We&apos;d love to hear from you
                </h2>
                <p className="mt-4 text-base leading-relaxed text-slate">
                  Have a question, suggestion, or want to partner with us for your charity? Reach out — we reply to every message.
                </p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <a
                    href="mailto:siddiquiabdullahahmed75@gmail.com"
                    className="btn btn-primary btn-lg"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                    Email us
                  </a>
                  <a
                    href="https://github.com/absid10/benevo"
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-secondary btn-lg"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                    View on GitHub
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="pb-20 md:pb-28">
          <div className="container">
            <div className="relative overflow-hidden rounded-3xl gradient-hero px-8 py-14 text-center text-white md:px-16 md:py-18">
              <div className="pointer-events-none absolute -left-20 -top-20 h-80 w-80 rounded-full bg-white/10 blur-2xl" />
              <div className="pointer-events-none absolute -bottom-20 -right-20 h-60 w-60 rounded-full bg-white/10 blur-2xl" />
              <div className="relative">
                <h2 className="hero-title text-2xl font-bold md:text-4xl">
                  Ready to make every round count?
                </h2>
                <p className="mx-auto mt-3 max-w-md text-base text-white/80">
                  Join Benevo today and start tracking scores, winning prizes, and funding the charities you care about.
                </p>
                <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                  <Link href="/signup" className="btn btn-primary btn-lg w-full sm:w-auto font-bold shadow-lg">
                    Get started free
                  </Link>
                  <Link href="/charities" className="btn btn-lg border-2 border-white text-white hover:bg-white/20 w-full sm:w-auto font-medium">
                    Browse charities
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
