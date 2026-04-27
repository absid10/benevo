import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

type Charity = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  featured: boolean;
};

async function getCharities(): Promise<Charity[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/charities`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.charities ?? [];
  } catch {
    return [];
  }
}

export default async function CharitiesPage() {
  const charities = await getCharities();

  return (
    <>
      <Navbar />
      <main className="gradient-hero-subtle min-h-screen">
        {/* Hero */}
        <section className="py-16 md:py-24">
          <div className="container">
            <div className="mx-auto max-w-2xl text-center fade-up">
              <span className="badge bg-impact-soft text-impact mb-4">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                </svg>
                Charity Directory
              </span>
              <h1 className="section-title text-3xl font-bold md:text-5xl">
                Charities making a{" "}
                <span className="text-impact">real difference</span>
              </h1>
              <p className="mt-4 text-base text-slate md:text-lg">
                Choose the charity you want to support. A portion of your subscription goes directly to them every month.
              </p>
            </div>
          </div>
        </section>

        {/* Grid */}
        <section className="pb-20 md:pb-28">
          <div className="container">
            {charities.length === 0 ? (
              <div className="mx-auto max-w-md text-center">
                <div className="surface-card p-10 fade-up">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-impact-soft">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--impact)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                    </svg>
                  </div>
                  <h3 className="mt-5 text-xl font-bold">Charities coming soon</h3>
                  <p className="mt-2 text-sm text-slate">
                    We&apos;re curating our charity directory. Check back soon for organizations you can support.
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {charities.map((charity, i) => (
                  <div
                    key={charity.id}
                    className={`surface-card hover-lift overflow-hidden fade-up fade-up-delay-${Math.min(i + 1, 4)}`}
                  >
                    {/* Image or placeholder */}
                    <div className="relative h-44 overflow-hidden bg-gradient-to-br from-impact/10 to-primary/10">
                      {charity.image_url ? (
                        <img
                          src={charity.image_url}
                          alt={charity.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--impact)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="opacity-30">
                            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                          </svg>
                        </div>
                      )}
                      {charity.featured && (
                        <div className="absolute left-3 top-3">
                          <span className="badge bg-amber text-white text-[10px]">
                            ★ Featured
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="p-6">
                      <h3 className="text-lg font-bold">{charity.name}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-slate line-clamp-3">
                        {charity.description || "Supporting meaningful causes through community engagement and transparency."}
                      </p>
                      <div className="mt-4 flex items-center gap-2 text-xs font-medium text-impact">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                        </svg>
                        Accepting contributions
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
