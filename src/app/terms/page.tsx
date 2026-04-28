import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — Benevo",
  description: "Benevo's Terms of Service. Read the rules and conditions that govern your use of the platform.",
};

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="gradient-hero-subtle min-h-screen">
        <section className="py-16 md:py-20">
          <div className="container">
            <div className="mx-auto max-w-3xl fade-up">
              <span className="badge bg-primary-soft text-primary mb-4">Legal</span>
              <h1 className="section-title text-3xl font-bold md:text-4xl mt-2">Terms of Service</h1>
              <p className="mt-3 text-sm text-slate">Last updated: April 2025</p>

              <div className="surface-card mt-8 space-y-10 p-8 md:p-12 text-sm leading-relaxed text-slate">

                <div>
                  <h2 className="section-title text-lg font-bold text-ink mb-3">1. Acceptance of Terms</h2>
                  <p>
                    By accessing or using Benevo (&ldquo;the Platform&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;), available at{" "}
                    <a href="https://benevo-bice.vercel.app" target="_blank" rel="noreferrer" className="text-primary hover:text-primary-hover transition-colors">
                      benevo-bice.vercel.app
                    </a>,
                    you agree to be bound by these Terms of Service. If you do not agree with any part of these terms,
                    you may not use the Platform.
                  </p>
                </div>

                <div>
                  <h2 className="section-title text-lg font-bold text-ink mb-3">2. Eligibility</h2>
                  <p>
                    You must be at least 18 years old and capable of entering into a legally binding contract to use Benevo.
                    By creating an account, you confirm that you meet this requirement.
                  </p>
                </div>

                <div>
                  <h2 className="section-title text-lg font-bold text-ink mb-3">3. Description of Service</h2>
                  <p>Benevo is a subscription-based platform that allows users to:</p>
                  <ul className="mt-3 space-y-2 list-disc list-inside">
                    <li>Record and track Stableford golf scores on a monthly basis.</li>
                    <li>Participate in monthly prize draws where scores serve as draw entry numbers.</li>
                    <li>Allocate a portion of their subscription fee to one or more verified charities.</li>
                    <li>View their personal dashboard, contribution history, and draw results.</li>
                  </ul>
                </div>

                <div>
                  <h2 className="section-title text-lg font-bold text-ink mb-3">4. Accounts &amp; Registration</h2>
                  <ul className="space-y-2 list-disc list-inside">
                    <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
                    <li>You may not create an account on behalf of another person without their explicit consent.</li>
                    <li>You must provide accurate and complete information during registration and keep it up to date.</li>
                    <li>You are responsible for all activity that occurs under your account.</li>
                    <li>Notify us immediately at{" "}
                      <a href="mailto:siddiquiabdullahahmed75@gmail.com" className="text-primary hover:text-primary-hover transition-colors">
                        siddiquiabdullahahmed75@gmail.com
                      </a>{" "}
                      if you suspect unauthorised access to your account.
                    </li>
                  </ul>
                </div>

                <div>
                  <h2 className="section-title text-lg font-bold text-ink mb-3">5. Subscriptions &amp; Payments</h2>
                  <ul className="space-y-2 list-disc list-inside">
                    <li>Benevo operates on a paid subscription model (monthly or yearly). Prices are displayed at the time of purchase.</li>
                    <li>All payments are processed securely by Stripe. By subscribing, you agree to Stripe&apos;s terms.</li>
                    <li>Subscriptions renew automatically at the end of each billing period unless cancelled beforehand.</li>
                    <li>You may cancel your subscription at any time from your account dashboard. Cancellation takes effect at the end of the current billing period.</li>
                    <li>We do not offer refunds for partially used billing periods unless required by applicable law.</li>
                  </ul>
                </div>

                <div>
                  <h2 className="section-title text-lg font-bold text-ink mb-3">6. Monthly Prize Draws</h2>
                  <ul className="space-y-2 list-disc list-inside">
                    <li>Entry into each monthly draw requires an active subscription and at least one score submitted in the relevant month.</li>
                    <li>Your most recent five Stableford scores form your draw entry numbers.</li>
                    <li>Winners are selected by matching draw numbers. Prize tiers are: 5-number match (40% of pool), 4-number match (35%), 3-number match (25%).</li>
                    <li>If no winner is found for the jackpot (5-number), the prize rolls over to the following month.</li>
                    <li>Benevo reserves the right to verify scores and may disqualify entries found to contain fraudulent data.</li>
                    <li>Draw results are final once verified by an administrator.</li>
                  </ul>
                </div>

                <div>
                  <h2 className="section-title text-lg font-bold text-ink mb-3">7. Charitable Contributions</h2>
                  <ul className="space-y-2 list-disc list-inside">
                    <li>A portion of your subscription is allocated to your chosen charity, as set in your account settings.</li>
                    <li>Charitable contributions are processed at the end of each billing cycle and are non-refundable once transferred.</li>
                    <li>Benevo partners only with verified, registered charitable organisations. We are not liable for how charities use donated funds beyond the point of transfer.</li>
                    <li>Benevo does not provide tax receipts for charitable donations. Please consult a tax professional for guidance on deductibility in your jurisdiction.</li>
                  </ul>
                </div>

                <div>
                  <h2 className="section-title text-lg font-bold text-ink mb-3">8. User Conduct</h2>
                  <p>You agree not to:</p>
                  <ul className="mt-3 space-y-2 list-disc list-inside">
                    <li>Submit false, fabricated, or misleading golf scores.</li>
                    <li>Attempt to manipulate or exploit the draw mechanics.</li>
                    <li>Use the platform for any unlawful purpose.</li>
                    <li>Attempt to gain unauthorised access to other users&apos; accounts or our systems.</li>
                    <li>Reverse engineer, copy, or redistribute any part of the Platform.</li>
                  </ul>
                  <p className="mt-3">Violation of these rules may result in immediate account suspension or termination without refund.</p>
                </div>

                <div>
                  <h2 className="section-title text-lg font-bold text-ink mb-3">9. Intellectual Property</h2>
                  <p>
                    All content, design, code, and branding on the Platform (excluding user-submitted data) is the intellectual
                    property of Benevo. You may not copy, reproduce, or distribute any part of the Platform without prior
                    written permission.
                  </p>
                </div>

                <div>
                  <h2 className="section-title text-lg font-bold text-ink mb-3">10. Disclaimer of Warranties</h2>
                  <p>
                    Benevo is provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis without warranties of any kind, either express
                    or implied. We do not guarantee that the Platform will be uninterrupted, error-free, or free of harmful
                    components. Your use of the Platform is at your own risk.
                  </p>
                </div>

                <div>
                  <h2 className="section-title text-lg font-bold text-ink mb-3">11. Limitation of Liability</h2>
                  <p>
                    To the maximum extent permitted by law, Benevo and its team shall not be liable for any indirect, incidental,
                    special, consequential, or punitive damages, including loss of profits, data, or goodwill, arising from
                    your use of or inability to use the Platform.
                  </p>
                </div>

                <div>
                  <h2 className="section-title text-lg font-bold text-ink mb-3">12. Termination</h2>
                  <p>
                    We reserve the right to suspend or terminate your account at any time if we believe you have violated
                    these Terms. You may delete your account at any time from your account settings. Upon termination,
                    your right to use the Platform ceases immediately.
                  </p>
                </div>

                <div>
                  <h2 className="section-title text-lg font-bold text-ink mb-3">13. Changes to Terms</h2>
                  <p>
                    We may modify these Terms at any time. We will notify registered users of material changes by email.
                    Continued use of the Platform after changes are posted constitutes your acceptance of the updated Terms.
                  </p>
                </div>

                <div>
                  <h2 className="section-title text-lg font-bold text-ink mb-3">14. Governing Law</h2>
                  <p>
                    These Terms are governed by the laws of India. Any disputes arising under these Terms shall be subject
                    to the exclusive jurisdiction of the courts located in India.
                  </p>
                </div>

                <div>
                  <h2 className="section-title text-lg font-bold text-ink mb-3">15. Contact</h2>
                  <p>For questions about these Terms, please contact us:</p>
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
