"use client";

import { FormEvent, useEffect, useState } from "react";
import { formatCurrencyFromCents } from "@/lib/format";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Winner = { id: string; user_id: string; tier: string; payout_cents: number; status: "pending" | "approved" | "paid" | "rejected"; proof_url: string | null };

export default function AdminPage() {
  const router = useRouter();
  const [adminUserId, setAdminUserId] = useState("");
  const [authLoading, setAuthLoading] = useState(true);
  const [drawMonth, setDrawMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM format
  const [mode, setMode] = useState<"random" | "weighted">("random");
  const [adminSecret, setAdminSecret] = useState("");
  const [secretVerified, setSecretVerified] = useState(false);
  const [charityName, setCharityName] = useState("");
  const [charitySlug, setCharitySlug] = useState("");
  const [charityDesc, setCharityDesc] = useState("");
  const [charityFeatured, setCharityFeatured] = useState(false);
  const [winners, setWinners] = useState<Winner[]>([]);
  const [winnerStatus, setWinnerStatus] = useState<"approved" | "paid" | "rejected">("approved");
  const [report, setReport] = useState<Record<string, unknown> | null>(null);
  const [activeTab, setActiveTab] = useState<"draws" | "charities" | "winners" | "reports">("draws");
  const [toast, setToast] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");
  const [loading, setLoading] = useState(false);
  const [simResult, setSimResult] = useState<Record<string, unknown> | null>(null);

  function notify(msg: string, type: "success" | "error" = "success") {
    setToast(msg); setToastType(type);
    setTimeout(() => setToast(""), 3500);
  }

  // Auto-detect admin user from Supabase Auth
  useEffect(() => {
    async function getSession() {
      try {
        const { createClient } = await import("@/utils/supabase/client");
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setAdminUserId(user.id);
        }
      } catch { /* continue without user */ }
      setAuthLoading(false);
    }
    getSession();
  }, []);

  function verifySecret(e: FormEvent) {
    e.preventDefault();
    if (adminSecret.trim().length > 0) {
      setSecretVerified(true);
      notify("Access granted", "success");
    } else {
      notify("Please enter the admin secret", "error");
    }
  }

  async function simulateDraw(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const r = await fetch("/api/draw/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ drawMonth: `${drawMonth}-01`, mode, actorUserId: adminUserId }),
      });
      const d = await r.json();
      if (r.ok) {
        setSimResult(d);
        notify("Simulation complete — review results below", "success");
      } else {
        notify(d.error?.formErrors?.[0] || d.error || "Simulation failed", "error");
      }
    } catch { notify("Network error", "error"); }
    setLoading(false);
  }

  async function publishDraw() {
    setLoading(true);
    try {
      const r = await fetch("/api/draw/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ drawMonth: `${drawMonth}-01`, mode, actorUserId: adminUserId }),
      });
      const d = await r.json();
      if (r.ok) {
        notify("Draw published successfully! Winners have been notified.", "success");
        setSimResult(null);
      } else {
        notify(d.error || "Publish failed", "error");
      }
    } catch { notify("Network error", "error"); }
    setLoading(false);
  }

  async function createCharity() {
    if (!charityName || !charitySlug) { notify("Name and slug are required", "error"); return; }
    setLoading(true);
    try {
      const r = await fetch("/api/charities", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-secret": adminSecret },
        body: JSON.stringify({ name: charityName, slug: charitySlug, description: charityDesc, featured: charityFeatured }),
      });
      const d = await r.json();
      if (r.ok) {
        setCharityName(""); setCharitySlug(""); setCharityDesc(""); setCharityFeatured(false);
        notify(`"${d.charity?.name || charityName}" created successfully`, "success");
      } else {
        notify(d.error || "Failed to create charity", "error");
      }
    } catch { notify("Network error", "error"); }
    setLoading(false);
  }

  async function fetchWinners() {
    setLoading(true);
    try {
      const r = await fetch("/api/winners?admin=true", { headers: { "x-admin-secret": adminSecret } });
      const d = await r.json();
      if (r.ok) {
        setWinners(d.winners ?? []);
        notify(`Loaded ${d.winners?.length ?? 0} winner records`, "success");
      } else {
        notify(d.error || "Failed to load winners", "error");
      }
    } catch { notify("Network error", "error"); }
    setLoading(false);
  }

  async function updateWinnerStatus(wId: string, newStatus: string) {
    try {
      const r = await fetch("/api/winners", {
        method: "PUT",
        headers: { "Content-Type": "application/json", "x-admin-secret": adminSecret },
        body: JSON.stringify({ winnerId: wId, status: newStatus, reviewedBy: adminUserId }),
      });
      if (r.ok) {
        await fetchWinners();
        notify(`Winner status updated to ${newStatus}`, "success");
      } else {
        const d = await r.json();
        notify(d.error || "Update failed", "error");
      }
    } catch { notify("Network error", "error"); }
  }

  async function fetchReports() {
    setLoading(true);
    try {
      const r = await fetch("/api/admin/reports", { headers: { "x-admin-secret": adminSecret } });
      const d = await r.json();
      if (r.ok) {
        setReport(d.totals);
        notify("Reports loaded", "success");
      } else {
        notify(d.error || "Failed to load reports", "error");
      }
    } catch { notify("Network error", "error"); }
    setLoading(false);
  }

  const tabs = [
    { key: "draws", label: "Draws", icon: "⚡" },
    { key: "charities", label: "Charities", icon: "💜" },
    { key: "winners", label: "Winners", icon: "🏆" },
    { key: "reports", label: "Reports", icon: "📊" },
  ] as const;

  // Show secret gate first
  if (!secretVerified) {
    return (
      <div className="flex min-h-screen items-center justify-center gradient-hero-subtle px-4">
        <div className="pointer-events-none fixed inset-0">
          <div className="absolute -left-32 top-1/4 h-[500px] w-[500px] rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute -right-32 top-1/3 h-[400px] w-[400px] rounded-full bg-amber/5 blur-3xl" />
        </div>

        <div className="relative w-full max-w-md">
          <Link href="/" className="mb-8 flex items-center justify-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-[#8b5cf6] shadow-md">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" /></svg>
            </div>
            <span className="text-xl font-bold tracking-tight">Benevo</span>
            <span className="badge bg-amber-soft text-amber ml-1">Admin</span>
          </Link>

          <div className="surface-card p-8 fade-up">
            <div className="text-center">
              <h1 className="section-title text-2xl font-bold">Admin Access</h1>
              <p className="mt-2 text-sm text-slate">Enter your admin credentials to continue</p>
            </div>

            <form className="mt-6 space-y-4" onSubmit={verifySecret}>
              <div>
                <label className="input-label" htmlFor="admin-secret">Admin Secret Key</label>
                <input
                  id="admin-secret"
                  className="input-field"
                  type="password"
                  placeholder="Enter admin secret"
                  value={adminSecret}
                  onChange={(e) => setAdminSecret(e.target.value)}
                  required
                  autoFocus
                />
              </div>
              <button type="submit" className="btn btn-primary w-full btn-lg">
                Access Admin Panel
              </button>
            </form>

            <p className="mt-4 text-center text-xs text-slate">
              <Link href="/dashboard" className="font-semibold text-primary hover:text-primary-hover transition-colors">
                ← Back to Dashboard
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center gradient-hero-subtle">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="mt-3 text-sm text-slate">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-hero-subtle">
      {/* Top Bar */}
      <nav className="sticky top-0 z-50 border-b border-mist/60 bg-white/80 backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-[#8b5cf6]">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" /></svg>
            </div>
            <span className="text-base font-bold tracking-tight">Benevo</span>
            <span className="badge bg-amber-soft text-amber ml-2">Admin</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="btn btn-ghost text-xs">Dashboard</Link>
            <button onClick={() => { setSecretVerified(false); setAdminSecret(""); }} className="btn btn-ghost text-xs text-danger">Lock Panel</button>
          </div>
        </div>
      </nav>

      {/* Toast Notification */}
      {toast && (
        <div className={`toast ${toastType === "success" ? "bg-impact text-white" : "bg-danger text-white"}`}>
          {toast}
        </div>
      )}

      <main className="container py-8 md:py-12">
        {/* Header */}
        <header className="surface-card p-6 md:p-8 mb-6 fade-up">
          <p className="mb-1 text-xs font-bold uppercase tracking-widest text-amber">Admin Panel</p>
          <h1 className="hero-title text-2xl font-bold md:text-3xl">Platform Management</h1>
          <p className="mt-1 text-sm text-slate">Manage draws, charities, winners, and view platform reports.</p>
        </header>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 rounded-xl bg-cloud p-1 w-fit overflow-x-auto">
          {tabs.map((t) => (
            <button key={t.key} onClick={() => setActiveTab(t.key)}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all whitespace-nowrap ${activeTab === t.key ? "bg-white shadow-sm text-ink" : "text-slate hover:text-ink"}`}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* ===== DRAWS TAB ===== */}
        {activeTab === "draws" && (
          <div className="space-y-6 fade-up">
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="surface-card p-6">
                <h2 className="section-title text-lg font-bold">Draw Configuration</h2>
                <p className="mt-1 text-sm text-slate">Set the month and draw mode, then simulate before publishing.</p>
                <form className="mt-4 space-y-4" onSubmit={simulateDraw}>
                  <div>
                    <label className="input-label">Draw Month</label>
                    <input type="month" className="input-field" value={drawMonth} onChange={(e) => setDrawMonth(e.target.value)} />
                  </div>
                  <div>
                    <label className="input-label">Draw Mode</label>
                    <select className="input-field" value={mode} onChange={(e) => setMode(e.target.value as "random" | "weighted")}>
                      <option value="random">Random — standard lottery-style generation</option>
                      <option value="weighted">Weighted — biased by most frequent user scores</option>
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <button className="btn btn-secondary flex-1" type="submit" disabled={loading}>
                      {loading ? "Running..." : "🔮 Simulate"}
                    </button>
                    <button className="btn btn-primary flex-1" type="button" disabled={loading}
                      onClick={() => publishDraw()}>
                      {loading ? "Publishing..." : "🚀 Publish Draw"}
                    </button>
                  </div>
                </form>
              </div>

              <div className="surface-card p-6">
                <h2 className="section-title text-lg font-bold">Draw Preview</h2>
                {simResult ? (
                  <div className="mt-4 space-y-3">
                    <div className="rounded-xl bg-cloud p-4">
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate">Generated Numbers</p>
                      <div className="flex gap-2 mt-2">
                        {(simResult.draw as Record<string, unknown>)?.generated_numbers
                          ? (((simResult.draw as Record<string, unknown>).generated_numbers as number[]) || []).map((n: number, i: number) => (
                            <div key={i} className="number-orb">{n}</div>
                          ))
                          : <p className="text-sm text-slate">Numbers will appear after simulation</p>
                        }
                      </div>
                    </div>
                    <div className="rounded-xl bg-cloud p-4">
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate">Mode</p>
                      <p className="text-sm font-bold capitalize">{mode}</p>
                    </div>
                    <div className="rounded-xl bg-cloud p-4">
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate">Status</p>
                      <p className="text-sm font-bold text-impact">Ready to publish</p>
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 flex flex-col items-center justify-center py-8 text-center">
                    <div className="text-4xl mb-3">🎲</div>
                    <p className="text-sm text-slate">Run a simulation to preview the draw results here.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Prize Pool Info */}
            <div className="surface-card p-6">
              <h2 className="section-title text-lg font-bold mb-4">Prize Pool Distribution</h2>
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  { tier: "5-Number Match", share: "40%", rollover: true, color: "var(--amber)" },
                  { tier: "4-Number Match", share: "35%", rollover: false, color: "var(--primary)" },
                  { tier: "3-Number Match", share: "25%", rollover: false, color: "var(--impact)" },
                ].map((p) => (
                  <div key={p.tier} className="rounded-xl border border-mist p-4">
                    <p className="text-sm font-bold" style={{ color: p.color }}>{p.tier}</p>
                    <p className="text-2xl font-bold mt-1">{p.share}</p>
                    <p className="text-xs text-slate mt-1">{p.rollover ? "Jackpot rolls over if unclaimed" : "No rollover"}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ===== CHARITIES TAB ===== */}
        {activeTab === "charities" && (
          <div className="grid gap-6 lg:grid-cols-2 fade-up">
            <div className="surface-card p-6">
              <h2 className="section-title text-lg font-bold">Create Charity</h2>
              <p className="mt-1 text-sm text-slate">Add a new charity to the directory for subscribers to support.</p>
              <div className="mt-4 space-y-4">
                <div><label className="input-label">Charity Name</label><input className="input-field" value={charityName} onChange={(e) => setCharityName(e.target.value)} placeholder="e.g. Hope Foundation" /></div>
                <div><label className="input-label">Slug (URL-friendly)</label><input className="input-field" value={charitySlug} onChange={(e) => setCharitySlug(e.target.value)} placeholder="e.g. hope-foundation" /></div>
                <div><label className="input-label">Description</label><textarea className="input-field" rows={3} value={charityDesc} onChange={(e) => setCharityDesc(e.target.value)} placeholder="Brief description of the charity's mission..." /></div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={charityFeatured} onChange={(e) => setCharityFeatured(e.target.checked)} className="h-4 w-4 rounded border-mist text-primary" />
                  <span className="text-sm font-medium">Featured charity (shown on homepage)</span>
                </label>
                <button className="btn btn-impact w-full" disabled={loading} onClick={() => createCharity()}>
                  {loading ? "Creating..." : "Create Charity"}
                </button>
              </div>
            </div>

            <div className="surface-card p-6">
              <h2 className="section-title text-lg font-bold">Charity Directory</h2>
              <p className="mt-1 text-sm text-slate">View and manage existing charities.</p>
              <div className="mt-4">
                <Link href="/charities" className="btn btn-secondary w-full text-center">
                  View Public Directory →
                </Link>
              </div>
              <div className="mt-4 rounded-xl bg-cloud p-4 text-center">
                <p className="text-xs text-slate">Charities can also be managed directly in the Supabase dashboard under the <code className="px-1 py-0.5 rounded bg-white text-xs">charities</code> table.</p>
              </div>
            </div>
          </div>
        )}

        {/* ===== WINNERS TAB ===== */}
        {activeTab === "winners" && (
          <div className="space-y-6 fade-up">
            <div className="surface-card p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="section-title text-lg font-bold">Winner Verification & Payouts</h2>
                  <p className="mt-1 text-sm text-slate">Review winner proof submissions and manage payout status.</p>
                </div>
                <button className="btn btn-primary text-xs" disabled={loading} onClick={() => fetchWinners()}>
                  {loading ? "Loading..." : "Refresh Winners"}
                </button>
              </div>

              {winners.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="text-4xl mb-3">🏆</div>
                  <p className="text-sm text-slate">No winners found. Click &quot;Refresh Winners&quot; after publishing a draw.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {winners.map((w) => (
                    <div key={w.id} className="flex items-center justify-between rounded-xl border border-mist p-4 hover:bg-cloud transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="badge text-[10px]" style={{
                            background: w.tier === "5-match" ? "var(--amber-soft)" : w.tier === "4-match" ? "var(--primary-soft)" : "var(--impact-soft)",
                            color: w.tier === "5-match" ? "var(--amber)" : w.tier === "4-match" ? "var(--primary)" : "var(--impact)",
                          }}>{w.tier}</span>
                          <span className={`badge text-[10px] status-${w.status}`}>{w.status}</span>
                        </div>
                        <p className="text-lg font-bold">{formatCurrencyFromCents(w.payout_cents)}</p>
                        <p className="text-xs text-slate mt-0.5">User: {w.user_id.slice(0, 8)}...</p>
                        {w.proof_url && <a className="text-xs font-semibold text-primary hover:underline" href={w.proof_url} target="_blank" rel="noreferrer">View proof →</a>}
                      </div>
                      <div className="flex gap-1">
                        {w.status === "pending" && (
                          <>
                            <button className="btn btn-ghost text-xs text-impact" onClick={() => updateWinnerStatus(w.id, "approved")}>Approve</button>
                            <button className="btn btn-ghost text-xs text-danger" onClick={() => updateWinnerStatus(w.id, "rejected")}>Reject</button>
                          </>
                        )}
                        {w.status === "approved" && (
                          <button className="btn btn-ghost text-xs text-primary" onClick={() => updateWinnerStatus(w.id, "paid")}>Mark Paid</button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ===== REPORTS TAB ===== */}
        {activeTab === "reports" && (
          <div className="space-y-6 fade-up">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="section-title text-lg font-bold">Platform Reports</h2>
                <p className="text-sm text-slate">Comprehensive overview of platform statistics and metrics.</p>
              </div>
              <button className="btn btn-primary" disabled={loading} onClick={() => fetchReports()}>
                {loading ? "Loading..." : "📊 Load Reports"}
              </button>
            </div>

            {report ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { label: "Total Users", value: String(report.users ?? 0), icon: "👥", color: "var(--primary)" },
                  { label: "Active Subscribers", value: String(report.activeSubscribers ?? 0), icon: "✅", color: "var(--impact)" },
                  { label: "Total Prize Pool", value: formatCurrencyFromCents(Number(report.prizePoolCents ?? 0)), icon: "💰", color: "var(--amber)" },
                  { label: "Avg Charity %", value: `${report.averageCharityPercent ?? 0}%`, icon: "❤️", color: "var(--rose)" },
                  { label: "Draws Completed", value: String(report.draws ?? 0), icon: "🎲", color: "var(--primary)" },
                  { label: "Monthly Revenue", value: formatCurrencyFromCents(Number(report.monthlyRevenueCents ?? 0)), icon: "📈", color: "var(--impact)" },
                  { label: "Jackpot Rollover", value: formatCurrencyFromCents(Number(report.rolloverCents ?? 0)), icon: "🏆", color: "var(--amber)" },
                ].map((s) => (
                  <div key={s.label} className="stat-card">
                    <div className="flex items-center justify-between">
                      <p className="stat-label">{s.label}</p>
                      <span className="text-lg">{s.icon}</span>
                    </div>
                    <p className="stat-value" style={{ color: s.color }}>{s.value}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="surface-card p-8 text-center">
                <div className="text-4xl mb-3">📊</div>
                <p className="text-sm text-slate">Click &quot;Load Reports&quot; to view platform statistics.</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
