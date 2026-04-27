import Link from "next/link";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function HeroSection() {
  return (
    <section className="relative overflow-hidden pb-20 pt-16 md:pb-28 md:pt-24">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -right-32 top-20 h-[400px] w-[400px] rounded-full bg-impact/5 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-[300px] w-[600px] -translate-x-1/2 rounded-full bg-amber/5 blur-3xl" />
      </div>

      <div className="container relative">
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge */}
          <div className="fade-up mb-6 inline-flex items-center gap-2 rounded-full bg-primary-soft px-4 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-semibold tracking-wide text-primary">Monthly draws now live</span>
          </div>

          {/* Heading */}
          <h1 className="hero-title fade-up fade-up-delay-1 text-4xl font-bold md:text-6xl lg:text-7xl">
            Where performance{" "}
            <span className="bg-gradient-to-r from-primary via-[#8b5cf6] to-impact bg-clip-text text-transparent">
              meets purpose
            </span>
          </h1>

          {/* Subtext */}
          <p className="fade-up fade-up-delay-2 mx-auto mt-6 max-w-xl text-lg leading-relaxed text-slate md:text-xl">
            Track your golf scores. Enter monthly prize draws. Fund the charities that matter to you. Every round counts.
          </p>

          {/* CTA Buttons */}
          <div className="fade-up fade-up-delay-3 mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link href="/signup" className="btn btn-primary btn-lg w-full sm:w-auto" id="hero-cta">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
              Start your journey
            </Link>
            <Link href="/#how-it-works" className="btn btn-secondary btn-lg w-full sm:w-auto">
              See how it works
            </Link>
          </div>

          {/* Social proof */}
          <div className="fade-up fade-up-delay-4 mt-10 flex items-center justify-center gap-6 text-sm text-slate">
            <div className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--impact)" stroke="none">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
              <span>No credit card required</span>
            </div>
            <div className="hidden items-center gap-2 sm:flex">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--impact)" stroke="none">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
              <span>Cancel anytime</span>
            </div>
            <div className="hidden items-center gap-2 md:flex">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--impact)" stroke="none">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
              <span>Real charity impact</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  const steps = [
    {
      step: "01",
      title: "Track Your Scores",
      description: "Enter your latest golf scores in Stableford format. Keep your rolling top 5 — your scores become your draw entry.",
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 11l3 3L22 4" />
          <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
        </svg>
      ),
      color: "primary",
    },
    {
      step: "02",
      title: "Enter Monthly Draws",
      description: "Your scores are automatically entered into the monthly prize draw. Match 3, 4, or all 5 numbers to win from the prize pool.",
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--amber)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
        </svg>
      ),
      color: "amber",
    },
    {
      step: "03",
      title: "Fund Real Change",
      description: "A portion of every subscription goes directly to your chosen charity. You decide how much. Track the impact you're making.",
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--impact)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
        </svg>
      ),
      color: "impact",
    },
  ];

  return (
    <section id="how-it-works" className="py-20 md:py-28">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <span className="badge bg-primary-soft text-primary mb-4">How it works</span>
          <h2 className="section-title text-3xl font-bold md:text-4xl">
            Three steps to meaningful impact
          </h2>
          <p className="mt-4 text-base text-slate md:text-lg">
            Simple by design. Every score you enter creates a ripple of positive change.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {steps.map((item) => (
            <div key={item.step} className="surface-card hover-lift p-8 text-center">
              <div className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-${item.color}-soft`} style={{
                background: item.color === "primary" ? "var(--primary-soft)" : item.color === "amber" ? "var(--amber-soft)" : "var(--impact-soft)"
              }}>
                {item.icon}
              </div>
              <p className="mt-5 text-xs font-bold uppercase tracking-widest text-slate">{item.step}</p>
              <h3 className="mt-2 text-xl font-bold">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ImpactSection() {
  const stats = [
    { label: "Charities Supported", value: "25+", color: "var(--impact)" },
    { label: "Monthly Prize Pool", value: "₹50K+", color: "var(--amber)" },
    { label: "Scores Tracked", value: "10K+", color: "var(--primary)" },
    { label: "Lives Impacted", value: "500+", color: "var(--rose)" },
  ];

  return (
    <section className="py-20 md:py-28" style={{
      background: "linear-gradient(180deg, var(--bg) 0%, var(--cloud) 100%)"
    }}>
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <span className="badge bg-impact-soft text-impact mb-4">Our Impact</span>
          <h2 className="section-title text-3xl font-bold md:text-4xl">
            Every round creates a ripple
          </h2>
          <p className="mt-4 text-base text-slate md:text-lg">
            Together, our community is making real, measurable change through the game they love.
          </p>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="surface-card hover-lift p-8 text-center">
              <p className="hero-title text-4xl font-bold" style={{ color: stat.color }}>
                {stat.value}
              </p>
              <p className="mt-2 text-sm font-medium text-slate">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingSection() {
  return (
    <section id="pricing" className="py-20 md:py-28">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <span className="badge bg-amber-soft text-amber mb-4">Pricing</span>
          <h2 className="section-title text-3xl font-bold md:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-base text-slate md:text-lg">
            Choose a plan. Part of your subscription goes to charity. The rest fuels the prize pool.
          </p>
        </div>

        <div className="mx-auto mt-14 grid max-w-3xl gap-6 md:grid-cols-2">
          {/* Monthly */}
          <div className="surface-card hover-lift p-8">
            <p className="text-sm font-semibold uppercase tracking-wider text-slate">Monthly</p>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="hero-title text-4xl font-bold">₹500</span>
              <span className="text-sm text-slate">/month</span>
            </div>
            <p className="mt-3 text-sm text-slate">Perfect for getting started. Cancel anytime.</p>
            <hr className="divider" />
            <ul className="space-y-3">
              {["Full score tracking", "Monthly draw entry", "Charity contribution (10%+)", "Dashboard access", "Winner verification"].map((f) => (
                <li key={f} className="flex items-center gap-2.5 text-sm">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--impact)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/signup?plan=monthly" className="btn btn-secondary mt-6 w-full">
              Choose Monthly
            </Link>
          </div>

          {/* Yearly */}
          <div className="relative overflow-hidden rounded-2xl border-2 border-primary bg-white p-8 shadow-lg">
            <div className="absolute -right-8 top-4 rotate-45 bg-primary px-10 py-1 text-xs font-bold uppercase tracking-wider text-white">
              Save 17%
            </div>
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">Yearly</p>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="hero-title text-4xl font-bold">₹5,000</span>
              <span className="text-sm text-slate">/year</span>
            </div>
            <p className="mt-3 text-sm text-slate">Best value. Two months free compared to monthly.</p>
            <hr className="divider" />
            <ul className="space-y-3">
              {["Everything in Monthly", "Priority draw processing", "Increased charity impact", "Annual impact report", "Early feature access"].map((f) => (
                <li key={f} className="flex items-center gap-2.5 text-sm">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--impact)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/signup?plan=yearly" className="btn btn-primary mt-6 w-full">
              Choose Yearly — Save ₹1,000
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function DrawMechanicsSection() {
  return (
    <section className="py-20 md:py-28" style={{
      background: "linear-gradient(180deg, var(--cloud) 0%, var(--bg) 100%)"
    }}>
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <span className="badge bg-primary-soft text-primary mb-4">The Draw</span>
          <h2 className="section-title text-3xl font-bold md:text-4xl">
            Your scores. Your numbers. Your chance.
          </h2>
          <p className="mt-4 text-base text-slate md:text-lg">
            Your latest 5 scores become your draw entry. Match the winning numbers to win from the prize pool.
          </p>
        </div>

        <div className="mx-auto mt-14 max-w-3xl">
          <div className="surface-card p-8 md:p-10">
            {/* Example numbers */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              {[38, 27, 33, 41, 19].map((num, i) => (
                <div key={num} className="number-orb" style={{ animationDelay: `${i * 100}ms` }}>
                  {num}
                </div>
              ))}
            </div>
            <p className="mt-5 text-center text-sm text-slate">Example draw numbers based on player scores</p>

            <hr className="divider my-8" />

            {/* Prize tiers */}
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-xl bg-amber-soft p-5 text-center">
                <p className="text-xs font-bold uppercase tracking-wider text-amber">5-Number Match</p>
                <p className="mt-1 text-2xl font-bold text-amber">40%</p>
                <p className="mt-1 text-xs text-slate">of prize pool · Jackpot rollover</p>
              </div>
              <div className="rounded-xl bg-primary-soft p-5 text-center">
                <p className="text-xs font-bold uppercase tracking-wider text-primary">4-Number Match</p>
                <p className="mt-1 text-2xl font-bold text-primary">35%</p>
                <p className="mt-1 text-xs text-slate">of prize pool</p>
              </div>
              <div className="rounded-xl bg-impact-soft p-5 text-center">
                <p className="text-xs font-bold uppercase tracking-wider text-impact">3-Number Match</p>
                <p className="mt-1 text-2xl font-bold text-impact">25%</p>
                <p className="mt-1 text-xs text-slate">of prize pool</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="py-20 md:py-28">
      <div className="container">
        <div className="relative overflow-hidden rounded-3xl gradient-hero px-8 py-16 text-center text-white md:px-16 md:py-20">
          {/* Decorative circles */}
          <div className="pointer-events-none absolute -left-20 -top-20 h-80 w-80 rounded-full bg-white/10 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-20 -right-20 h-60 w-60 rounded-full bg-white/10 blur-2xl" />

          <div className="relative">
            <h2 className="hero-title text-3xl font-bold md:text-5xl">
              Ready to make every round count?
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-lg text-white/80">
              Join Benevo today. Track your performance, compete in monthly draws, and create lasting impact for the charities you care about.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link href="/signup" className="btn btn-lg bg-white text-primary font-bold hover:bg-white/90 w-full sm:w-auto" id="cta-bottom">
                Get started for free
              </Link>
              <Link href="/#how-it-works" className="btn btn-lg border border-white/30 text-white hover:bg-white/10 w-full sm:w-auto">
                Learn more
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="gradient-hero-subtle">
        <HeroSection />
        <HowItWorksSection />
        <ImpactSection />
        <DrawMechanicsSection />
        <PricingSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
