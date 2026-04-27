"use client";

import { FormEvent, useState } from "react";
import { formatCurrencyFromCents } from "@/lib/format";
import Link from "next/link";

type Winner = { id: string; user_id: string; tier: string; payout_cents: number; status: "pending" | "approved" | "paid" | "rejected"; proof_url: string | null };

export default function AdminPage() {
  const [actorUserId, setActorUserId] = useState("");
  const [drawMonth, setDrawMonth] = useState(new Date().toISOString().slice(0, 10));
  const [mode, setMode] = useState<"random" | "weighted">("random");
  const [adminSecret, setAdminSecret] = useState("");
  const [output, setOutput] = useState("");
  const [charityName, setCharityName] = useState("");
  const [charitySlug, setCharitySlug] = useState("");
  const [charityDesc, setCharityDesc] = useState("");
  const [winners, setWinners] = useState<Winner[]>([]);
  const [winnerId, setWinnerId] = useState("");
  const [winnerStatus, setWinnerStatus] = useState<"approved" | "paid" | "rejected">("approved");
  const [report, setReport] = useState<Record<string, unknown> | null>(null);
  const [activeTab, setActiveTab] = useState<"draws" | "charities" | "winners" | "reports">("draws");
  const [toast, setToast] = useState("");

  function notify(msg: string) { setToast(msg); setTimeout(() => setToast(""), 3000); }

  async function simulateDraw(e: FormEvent) {
    e.preventDefault();
    const r = await fetch("/api/draw/simulate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ drawMonth, mode, actorUserId }) });
    const d = await r.json();
    setOutput(JSON.stringify(d, null, 2));
    notify(r.ok ? "Simulation complete" : "Simulation failed");
  }

  async function publishDraw() {
    const r = await fetch("/api/draw/publish", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ drawMonth, mode, actorUserId }) });
    const d = await r.json();
    setOutput(JSON.stringify(d, null, 2));
    notify(r.ok ? "Draw published ✓" : d.error ?? "Publish failed");
  }

  async function createCharity() {
    const r = await fetch("/api/charities", { method: "POST", headers: { "Content-Type": "application/json", "x-admin-secret": adminSecret }, body: JSON.stringify({ name: charityName, slug: charitySlug, description: charityDesc }) });
    const d = await r.json();
    setOutput(JSON.stringify(d, null, 2));
    if (r.ok) { setCharityName(""); setCharitySlug(""); setCharityDesc(""); notify("Charity created ✓"); } else { notify(d.error ?? "Failed"); }
  }

  async function fetchWinners() {
    const r = await fetch("/api/winners?admin=true", { headers: { "x-admin-secret": adminSecret } });
    const d = await r.json();
    if (r.ok) setWinners(d.winners ?? []);
    else setOutput(JSON.stringify(d, null, 2));
  }

  async function updateWinner() {
    const r = await fetch("/api/winners", { method: "PUT", headers: { "Content-Type": "application/json", "x-admin-secret": adminSecret }, body: JSON.stringify({ winnerId, status: winnerStatus, reviewedBy: actorUserId }) });
    const d = await r.json();
    setOutput(JSON.stringify(d, null, 2));
    if (r.ok) { await fetchWinners(); notify("Winner updated ✓"); }
  }

  async function fetchReports() {
    const r = await fetch("/api/admin/reports", { headers: { "x-admin-secret": adminSecret } });
    const d = await r.json();
    if (r.ok) setReport(d.totals);
    else setOutput(JSON.stringify(d, null, 2));
  }

  const tabs = [
    { key: "draws", label: "Draws", icon: "⚡" },
    { key: "charities", label: "Charities", icon: "💜" },
    { key: "winners", label: "Winners", icon: "🏆" },
    { key: "reports", label: "Reports", icon: "📊" },
  ] as const;

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
          <Link href="/dashboard" className="btn btn-ghost text-xs">Dashboard</Link>
        </div>
      </nav>

      {toast && <div className="toast bg-midnight text-white">{toast}</div>}

      <main className="container py-8 md:py-12">
        {/* Header */}
        <header className="surface-card p-6 md:p-8 mb-6 fade-up">
          <p className="mb-1 text-xs font-bold uppercase tracking-widest text-amber">Admin Console</p>
          <h1 className="hero-title text-2xl font-bold md:text-4xl">Platform Operations</h1>
          <div className="mt-3 grid gap-2 sm:grid-cols-2 max-w-lg">
            <div><label className="input-label">Admin User ID</label><input className="input-field text-xs" value={actorUserId} onChange={(e) => setActorUserId(e.target.value)} placeholder="uuid" /></div>
            <div><label className="input-label">Admin Secret</label><input className="input-field text-xs" type="password" value={adminSecret} onChange={(e) => setAdminSecret(e.target.value)} placeholder="ADMIN_API_SECRET" /></div>
          </div>
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

        {/* Draws */}
        {activeTab === "draws" && (
          <div className="grid gap-6 lg:grid-cols-2 fade-up">
            <div className="surface-card p-6">
              <h2 className="section-title text-lg font-bold">Draw Management</h2>
              <form className="mt-4 space-y-4" onSubmit={simulateDraw}>
                <div><label className="input-label">Draw Month</label><input type="date" className="input-field" value={drawMonth} onChange={(e) => setDrawMonth(e.target.value)} /></div>
                <div><label className="input-label">Mode</label>
                  <select className="input-field" value={mode} onChange={(e) => setMode(e.target.value as "random" | "weighted")}>
                    <option value="random">Random</option><option value="weighted">Weighted</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <button className="btn btn-primary flex-1" type="submit">Run Simulation</button>
                  <button className="btn btn-secondary flex-1" type="button" onClick={() => publishDraw().catch(() => notify("Publish failed"))}>Publish Draw</button>
                </div>
              </form>
            </div>
            <div className="surface-card p-6">
              <h2 className="section-title text-lg font-bold">API Output</h2>
              <pre className="mt-4 overflow-auto rounded-xl bg-midnight p-4 text-xs text-slate-100 max-h-80 leading-relaxed" style={{ color: "#e2e8f0" }}>
                {output || "Run a command to see output here."}
              </pre>
            </div>
          </div>
        )}

        {/* Charities */}
        {activeTab === "charities" && (
          <div className="surface-card p-6 max-w-xl fade-up">
            <h2 className="section-title text-lg font-bold">Create Charity</h2>
            <div className="mt-4 space-y-4">
              <div><label className="input-label">Name</label><input className="input-field" value={charityName} onChange={(e) => setCharityName(e.target.value)} /></div>
              <div><label className="input-label">Slug</label><input className="input-field" value={charitySlug} onChange={(e) => setCharitySlug(e.target.value)} placeholder="e.g. hope-foundation" /></div>
              <div><label className="input-label">Description</label><textarea className="input-field" rows={3} value={charityDesc} onChange={(e) => setCharityDesc(e.target.value)} /></div>
              <button className="btn btn-impact w-full" onClick={() => createCharity().catch(() => notify("Failed"))}>Create Charity</button>
            </div>
          </div>
        )}

        {/* Winners */}
        {activeTab === "winners" && (
          <div className="space-y-6 fade-up">
            <div className="surface-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="section-title text-lg font-bold">Winner Verification & Payout</h2>
                <button className="btn btn-ghost text-xs" onClick={() => fetchWinners().catch(() => notify("Failed"))}>Load Winners</button>
              </div>

              <div className="grid gap-3 md:grid-cols-3 mb-4">
                <input className="input-field" placeholder="Winner ID" value={winnerId} onChange={(e) => setWinnerId(e.target.value)} />
                <select className="input-field" value={winnerStatus} onChange={(e) => setWinnerStatus(e.target.value as "approved" | "paid" | "rejected")}>
                  <option value="approved">Approve</option><option value="paid">Mark Paid</option><option value="rejected">Reject</option>
                </select>
                <button className="btn btn-primary" onClick={() => updateWinner().catch(() => notify("Failed"))}>Update</button>
              </div>

              {winners.length === 0 ? (
                <p className="text-sm text-slate">No winners loaded. Click &quot;Load Winners&quot; above.</p>
              ) : (
                <div className="space-y-2">
                  {winners.map((w) => (
                    <div key={w.id} className="flex items-center justify-between rounded-xl border border-mist p-4 hover:bg-cloud transition-colors">
                      <div>
                        <p className="text-xs text-slate font-mono">{w.id}</p>
                        <p className="text-sm font-semibold mt-1">{formatCurrencyFromCents(w.payout_cents)} · {w.tier}</p>
                      </div>
                      <span className={`badge text-[10px] status-${w.status}`}>{w.status}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Reports */}
        {activeTab === "reports" && (
          <div className="space-y-6 fade-up">
            <div className="flex gap-2">
              <button className="btn btn-primary" onClick={() => fetchReports().catch(() => notify("Failed"))}>Fetch Reports</button>
            </div>
            {report && (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { label: "Total Users", value: String(report.users ?? 0), color: "var(--primary)" },
                  { label: "Active Subscribers", value: String(report.activeSubscribers ?? 0), color: "var(--impact)" },
                  { label: "Total Prize Pool", value: formatCurrencyFromCents(Number(report.prizePoolCents ?? 0)), color: "var(--amber)" },
                  { label: "Avg Charity %", value: `${report.averageCharityPercent ?? 0}%`, color: "var(--rose)" },
                  { label: "Draws Run", value: String(report.draws ?? 0), color: "var(--primary)" },
                  { label: "Monthly Revenue", value: formatCurrencyFromCents(Number(report.monthlyRevenueCents ?? 0)), color: "var(--impact)" },
                  { label: "Rollover Amount", value: formatCurrencyFromCents(Number(report.rolloverCents ?? 0)), color: "var(--amber)" },
                ].map((s) => (
                  <div key={s.label} className="stat-card">
                    <p className="stat-label">{s.label}</p>
                    <p className="stat-value" style={{ color: s.color }}>{s.value}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
