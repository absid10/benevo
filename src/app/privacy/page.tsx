import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — Benevo",
  description: "Benevo's Privacy Policy. Learn how we collect, use, and protect your personal data.",
};

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="gradient-hero-subtle min-h-screen">
        <section className="py-16 md:py-20">
          <div className="container">
            <div className="mx-auto max-w-3xl fade-up">
              <span className="badge bg-primary-soft text-primary mb-4">Legal</span>
              <h1 className="section-title text-3xl font-bold md:text-4xl mt-2">Privacy Policy</h1>
              <p className="mt-3 text-sm text-slate">Last updated: April 2025</p>

              <div className="surface-card mt-8 space-y-10 p-8 md:p-12 text-sm leading-relaxed text-slate">

                <div>
                  <h2 className="section-title text-lg font-bold text-ink mb-3">1. Introduction</h2>
                  <p>
                    Welcome to Benevo (&ldquo;we&rdquo;, &ldquo;our&rdquo;, &ldquo;us&rdquo;). We are committed to protecting your personal information
                    and your right to privacy. This Privacy Policy explains what information we collect, how we use it,
                    and what rights you have in relation to it when you use our website at{" "}
                    <a href="https://benevo-bice.vercel.app" className="text-primary hover:text-primary-hover transition-colors" target="_blank" rel="noreferrer">
                      benevo-bice.vercel.app
                    </a>{" "}
                    and our related services.
                  </p>
                  <p className="mt-3">
                    By using our platform, you agree to the collection and use of information in accordance with this policy.
                    If you have any questions or concerns, please contact us at{" "}
                    <a href="mailto:siddiquiabdullahahmed75@gmail.com" className="text-primary hover:text-primary-hover transition-colors">
                      siddiquiabdullahahmed75@gmail.com
                    </a>.
                  </p>
                </div>

                <div>
                  <h2 className="section-title text-lg font-bold text-ink mb-3">2. Information We Collect</h2>
                  <p>We collect the following categories of personal information:</p>
                  <ul className="mt-3 space-y-2 list-disc list-inside">
                    <li><span className="font-semibold text-ink">Account Information:</span> Your name, email address, and password when you create an account.</li>
                    <li><span className="font-semibold text-ink">Profile Data:</span> Your golf scores, draw history, and charity preferences that you provide.</li>
                    <li><span className="font-semibold text-ink">Payment Information:</span> Billing details processed securely via Stripe. We do not store your full card details on our servers.</li>
                    <li><span className="font-semibold text-ink">OAuth Data:</span> If you sign in with Google, we receive your name, email, and profile picture from Google in accordance with their privacy policy.</li>
                    <li><span className="font-semibold text-ink">Usage Data:</span> Pages visited, features used, and interactions with the platform, collected automatically via server logs.</li>
                  </ul>
                </div>

                <div>
                  <h2 className="section-title text-lg font-bold text-ink mb-3">3. How We Use Your Information</h2>
                  <p>We use the information we collect to:</p>
                  <ul className="mt-3 space-y-2 list-disc list-inside">
                    <li>Provide and operate the Benevo platform, including score tracking and monthly draws.</li>
                    <li>Process your subscription payments via Stripe.</li>
                    <li>Calculate and distribute your charitable contributions to your chosen charities.</li>
                    <li>Communicate with you about your account, draw results, and updates to our service.</li>
                    <li>Improve and personalise your experience on the platform.</li>
                    <li>Comply with applicable legal obligations.</li>
                  </ul>
                </div>

                <div>
                  <h2 className="section-title text-lg font-bold text-ink mb-3">4. Data Storage &amp; Security</h2>
                  <p>
                    Your data is stored in a Supabase (PostgreSQL) database hosted on secure cloud infrastructure.
                    We use Row-Level Security (RLS) to ensure that each user can only access their own data.
                    All data in transit is encrypted using TLS/HTTPS. We implement industry-standard security measures,
                    but no method of transmission over the internet is 100% secure.
                  </p>
                </div>

                <div>
                  <h2 className="section-title text-lg font-bold text-ink mb-3">5. Third-Party Services</h2>
                  <p>We work with the following third-party services who may receive your data:</p>
                  <ul className="mt-3 space-y-2 list-disc list-inside">
                    <li><span className="font-semibold text-ink">Supabase</span> — database and authentication infrastructure.</li>
                    <li><span className="font-semibold text-ink">Stripe</span> — payment processing. Their privacy policy applies to payment data.</li>
                    <li><span className="font-semibold text-ink">Google</span> — OAuth sign-in. Their privacy policy applies when you choose Google sign-in.</li>
                    <li><span className="font-semibold text-ink">Vercel</span> — platform hosting and deployment.</li>
                  </ul>
                  <p className="mt-3">We do not sell your personal information to any third parties.</p>
                </div>

                <div>
                  <h2 className="section-title text-lg font-bold text-ink mb-3">6. Cookies</h2>
                  <p>
                    We use strictly necessary cookies to maintain your authenticated session. We do not use tracking or
                    advertising cookies. Your session token is stored securely as an HTTP-only cookie.
                  </p>
                </div>

                <div>
                  <h2 className="section-title text-lg font-bold text-ink mb-3">7. Data Retention</h2>
                  <p>
                    We retain your account and score data for as long as your account is active. If you delete your account,
                    we will delete your personal data within 30 days, except where we are required to retain it for legal or
                    financial compliance purposes (e.g., payment records for up to 7 years).
                  </p>
                </div>

                <div>
                  <h2 className="section-title text-lg font-bold text-ink mb-3">8. Your Rights</h2>
                  <p>You have the right to:</p>
                  <ul className="mt-3 space-y-2 list-disc list-inside">
                    <li>Access the personal data we hold about you.</li>
                    <li>Correct inaccurate or incomplete data.</li>
                    <li>Request deletion of your personal data (&ldquo;right to be forgotten&rdquo;).</li>
                    <li>Export your data in a portable format.</li>
                    <li>Withdraw consent at any time (e.g., by cancelling your subscription or deleting your account).</li>
                  </ul>
                  <p className="mt-3">
                    To exercise any of these rights, email us at{" "}
                    <a href="mailto:siddiquiabdullahahmed75@gmail.com" className="text-primary hover:text-primary-hover transition-colors">
                      siddiquiabdullahahmed75@gmail.com
                    </a>.
                  </p>
                </div>

                <div>
                  <h2 className="section-title text-lg font-bold text-ink mb-3">9. Children&apos;s Privacy</h2>
                  <p>
                    Benevo is not intended for use by anyone under the age of 18. We do not knowingly collect personal
                    information from children. If we become aware that we have collected data from a child, we will delete
                    it promptly.
                  </p>
                </div>

                <div>
                  <h2 className="section-title text-lg font-bold text-ink mb-3">10. Changes to This Policy</h2>
                  <p>
                    We may update this Privacy Policy from time to time. We will notify registered users of significant
                    changes by email. Continued use of Benevo after changes are posted constitutes your acceptance of the
                    updated policy.
                  </p>
                </div>

                <div>
                  <h2 className="section-title text-lg font-bold text-ink mb-3">11. Contact</h2>
                  <p>
                    If you have questions about this Privacy Policy, please contact us:
                  </p>
                  <div className="mt-3 rounded-xl bg-cloud p-4 text-sm">
                    <p><span className="font-semibold text-ink">Email:</span>{" "}
                      <a href="mailto:siddiquiabdullahahmed75@gmail.com" className="text-primary hover:text-primary-hover transition-colors">
                        siddiquiabdullahahmed75@gmail.com
                      </a>
                    </p>
                    <p className="mt-1"><span className="font-semibold text-ink">Website:</span>{" "}
                      <a href="https://benevo-bice.vercel.app" target="_blank" rel="noreferrer" className="text-primary hover:text-primary-hover transition-colors">
                        benevo-bice.vercel.app
                      </a>
                    </p>
                  </div>
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
