import Link from "next/link";

export default function Home() {
  return (
    <main className="py-8 md:py-12">
      <div className="container">
        <nav className="surface-card fade-up mb-8 flex items-center justify-between px-5 py-4 md:px-7">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-sm font-bold text-white">
              B
            </span>
            <span className="font-semibold">Benevo</span>
          </div>
          <div className="flex items-center gap-2 text-sm md:gap-3">
            <Link className="rounded-xl px-4 py-2 hover:bg-slate-100" href="/dashboard">
              Dashboard
            </Link>
            <Link className="rounded-xl px-4 py-2 hover:bg-slate-100" href="/admin">
              Admin
            </Link>
            <button className="rounded-xl bg-primary px-4 py-2 font-semibold text-white transition hover:bg-primary-hover">
              Subscribe
            </button>
          </div>
        </nav>

        <section className="mb-10 grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
          <article className="surface-card fade-up p-7 md:p-10">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-impact">
              Performance with purpose
            </p>
            <h1 className="hero-title mb-5 text-4xl font-bold leading-tight md:text-6xl">
              Every score drives impact and unlocks monthly rewards.
            </h1>
            <p className="mb-7 max-w-2xl text-slate-700 md:text-lg">
              Benevo turns your latest golf performance into draw participation while sending part of your
              subscription to the charity you choose.
            </p>
            <div className="flex flex-wrap gap-3">
              <button className="rounded-xl bg-primary px-5 py-3 font-semibold text-white transition hover:bg-primary-hover">
                Start Monthly Plan
              </button>
              <button className="rounded-xl border border-mist bg-white px-5 py-3 font-semibold text-slate-800 transition hover:bg-slate-50">
                Explore Charities
              </button>
            </div>
          </article>

          <aside className="surface-card fade-up space-y-4 p-7" style={{ animationDelay: "120ms" }}>
            <h2 className="font-heading text-xl font-semibold">Live Impact</h2>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm text-slate-600">Total Donated</p>
              <p className="mt-1 text-3xl font-bold text-impact">$84,260</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs text-slate-600">Active Members</p>
                <p className="text-2xl font-semibold">1,124</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs text-slate-600">Prize Pool</p>
                <p className="text-2xl font-semibold">$31,900</p>
              </div>
            </div>
          </aside>
        </section>

        <section className="mb-10 grid gap-4 md:grid-cols-3">
          {[
            {
              title: "1. Subscribe",
              text: "Choose monthly or yearly. A fixed portion funds rewards and charity impact.",
            },
            {
              title: "2. Enter 5 Scores",
              text: "Keep your latest five Stableford scores up to date. One score per date.",
            },
            {
              title: "3. Join Monthly Draw",
              text: "Your latest form powers entry. Winners upload proof and get verified payouts.",
            },
          ].map((item, index) => (
            <article
              key={item.title}
              className="surface-card fade-up p-6"
              style={{ animationDelay: `${index * 90}ms` }}
            >
              <h3 className="mb-2 font-heading text-xl font-semibold">{item.title}</h3>
              <p className="text-slate-700">{item.text}</p>
            </article>
          ))}
        </section>

        <section className="grid gap-4 pb-8 md:grid-cols-2">
          <article className="surface-card p-6 md:p-7">
            <h3 className="font-heading text-2xl font-semibold">Featured Charity</h3>
            <p className="mt-2 text-slate-700">
              First Tee Access Initiative supports youth access to sport and mentoring through local coaching
              scholarships and events.
            </p>
            <button className="mt-5 rounded-xl border border-mist px-4 py-2 font-semibold hover:bg-slate-50">
              View profile
            </button>
          </article>
          <article className="surface-card p-6 md:p-7">
            <h3 className="font-heading text-2xl font-semibold">Transparent Draw Logic</h3>
            <p className="mt-2 text-slate-700">
              Admin can simulate random or weighted draws before publishing each month. Jackpot rolls over if
              no 5-match winner is verified.
            </p>
            <button className="mt-5 rounded-xl border border-mist px-4 py-2 font-semibold hover:bg-slate-50">
              Read mechanics
            </button>
          </article>
        </section>
      </div>
    </main>
  );
}
