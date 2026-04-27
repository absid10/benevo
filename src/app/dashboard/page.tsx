/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { formatCurrencyFromCents } from "@/lib/format";
import Link from "next/link";

type Score = { id: string; score_date: string; stableford_score: number };
type Charity = { id: string; name: string };
type Winner = { id: string; tier: string; payout_cents: number; status: string; proof_url: string | null };
type Summary = {
  subscription?: { plan?: string; status?: string; current_period_end?: string | null } | null;
  charity: { name: string | null; percent: number };
  participation: { drawsEntered: number };
  winnings: { totalWonCents: number; pendingCount: number };
};

function fmt(d: string) { return new Date(`${d}T00:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }); }

export default function DashboardPage() {
  const [userId, setUserId] = useState(() => typeof window === "undefined" ? "" : window.localStorage.getItem("benevo.userId") ?? "");
  const [scoreDate, setScoreDate] = useState("");
  const [stablefordScore, setStablefordScore] = useState("");
  const [scores, setScores] = useState<Score[]>([]);
  const [charities, setCharities] = useState<Charity[]>([]);
  const [selectedCharityId, setSelectedCharityId] = useState("");
  const [charityPercent, setCharityPercent] = useState("10");
  const [summary, setSummary] = useState<Summary | null>(null);
  const [winners, setWinners] = useState<Winner[]>([]);
  const [proofWinnerId, setProofWinnerId] = useState("");
  const [proofUrl, setProofUrl] = useState("");
  const [message, setMessage] = useState("");
  const [msgType, setMsgType] = useState<"success" | "error" | "info">("info");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"scores" | "charity" | "winnings">("scores");

  function toast(msg: string, type: "success" | "error" | "info" = "info") {
    setMessage(msg); setMsgType(type);
    setTimeout(() => setMessage(""), 3000);
  }

  async function api(url: string, opts?: RequestInit) {
    const r = await fetch(url, opts);
    const d = await r.json();
    if (!r.ok) throw new Error(d.error ?? "Request failed");
    return d;
  }

  async function loadAll(uid: string) {
    if (!uid) return;
    try {
      const [sc, sm, wn, ch] = await Promise.all([
        api(`/api/scores?userId=${uid}`),
        api(`/api/dashboard/summary?userId=${uid}`),
        api(`/api/winners?userId=${uid}`),
        api("/api/charities"),
      ]);
      setScores(sc.scores ?? []);
      setSummary(sm);
      setCharityPercent(String(sm.charity?.percent ?? 10));
      setWinners(wn.winners ?? []);
      setCharities(ch.charities ?? []);
    } catch { toast("Failed to load data", "error"); }
  }

  useEffect(() => { if (userId) loadAll(userId); }, [userId]);

  const canSubmit = useMemo(() => userId.trim().length > 0 && scoreDate.length > 0 && Number(stablefordScore) >= 1, [userId, scoreDate, stablefordScore]);

  async function handleScoreCreate(e: FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    window.localStorage.setItem("benevo.userId", userId);
    try {
      await api("/api/scores", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId, scoreDate, stablefordScore: Number(stablefordScore) }) });
      toast("Score saved ✓", "success");
      setStablefordScore(""); setScoreDate("");
      const sc = await api(`/api/scores?userId=${userId}`);
      setScores(sc.scores ?? []);
    } catch (err) { toast((err as Error).message, "error"); }
    setLoading(false);
  }

  async function deleteScore(scoreId: string) {
    try {
      await api("/api/scores", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId, scoreId }) });
      toast("Score removed", "success");
      const sc = await api(`/api/scores?userId=${userId}`);
      setScores(sc.scores ?? []);
    } catch { toast("Delete failed", "error"); }
  }

  async function saveCharity() {
    if (!userId || !selectedCharityId) { toast("Select a charity first", "error"); return; }
    try {
      await api("/api/charity-preference", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId, charityId: selectedCharityId, charityPercent: Number(charityPercent) }) });
      toast("Charity preference saved ✓", "success");
      const sm = await api(`/api/dashboard/summary?userId=${userId}`);
      setSummary(sm);
    } catch (err) { toast((err as Error).message, "error"); }
  }

  async function submitProof() {
    if (!proofWinnerId || !proofUrl) { toast("Fill winner id & proof url", "error"); return; }
    try {
      await api("/api/winners", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId, winnerId: proofWinnerId, proofUrl }) });
      toast("Proof uploaded ✓", "success");
      setProofUrl(""); setProofWinnerId("");
      const wn = await api(`/api/winners?userId=${userId}`);
      setWinners(wn.winners ?? []);
    } catch (err) { toast((err as Error).message, "error"); }
  }

  async function startCheckout(plan: "monthly" | "yearly") {
    if (!userId || !selectedCharityId) { toast("Enter user id and select charity first", "error"); return; }
    try {
      const d = await api("/api/billing/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId, plan, charityId: selectedCharityId, charityPercent: Number(charityPercent) }) });
      if (d.checkoutUrl) window.location.href = d.checkoutUrl;
    } catch (err) { toast((err as Error).message, "error"); }
  }

  const subStatus = summary?.subscription?.status ?? "inactive";

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
          </Link>
          <div className="flex items-center gap-3">
            <span className={`badge ${subStatus === "active" ? "status-active" : "status-inactive"}`}>{subStatus}</span>
            <Link href="/admin" className="btn btn-ghost text-xs">Admin</Link>
          </div>
        </div>
      </nav>

      <main className="container py-8 md:py-12">
        {/* Toast */}
        {message && (
          <div className={`toast ${msgType === "success" ? "bg-impact text-white" : msgType === "error" ? "bg-danger text-white" : "bg-midnight text-white"}`}>
            {message}
          </div>
        )}

        {/* Header */}
        <header className="surface-card p-6 md:p-8 mb-6 fade-up">
          <p className="mb-1 text-xs font-bold uppercase tracking-widest text-impact">Subscriber Dashboard</p>
          <h1 className="hero-title text-2xl font-bold md:text-4xl">Track scores. Fund change. Win prizes.</h1>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <label className="input-label mb-0 mr-1">User ID</label>
            <input className="input-field max-w-xs text-xs" placeholder="Supabase user uuid" value={userId}
              onChange={(e) => { setUserId(e.target.value); window.localStorage.setItem("benevo.userId", e.target.value); }} />
            <button className="btn btn-ghost text-xs" onClick={() => loadAll(userId)}>Refresh</button>
          </div>
        </header>

        {/* Stats Row */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
          {[
            { label: "Subscription", value: summary?.subscription?.plan ?? "—", sub: subStatus, color: "var(--primary)" },
            { label: "Charity Share", value: `${summary?.charity?.percent ?? 10}%`, sub: summary?.charity?.name ?? "Not selected", color: "var(--impact)" },
            { label: "Draws Entered", value: String(summary?.participation?.drawsEntered ?? 0), sub: "This season", color: "var(--amber)" },
            { label: "Total Winnings", value: formatCurrencyFromCents(summary?.winnings?.totalWonCents ?? 0), sub: `${summary?.winnings?.pendingCount ?? 0} pending`, color: "var(--rose)" },
          ].map((s, i) => (
            <div key={s.label} className={`stat-card fade-up fade-up-delay-${i + 1}`}>
              <p className="stat-label">{s.label}</p>
              <p className="stat-value" style={{ color: s.color }}>{s.value}</p>
              <p className="mt-1 text-xs text-slate capitalize">{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 rounded-xl bg-cloud p-1 w-fit">
          {(["scores", "charity", "winnings"] as const).map((t) => (
            <button key={t} onClick={() => setActiveTab(t)}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all capitalize ${activeTab === t ? "bg-white shadow-sm text-ink" : "text-slate hover:text-ink"}`}>
              {t}
            </button>
          ))}
        </div>

        {/* Scores Tab */}
        {activeTab === "scores" && (
          <div className="grid gap-6 lg:grid-cols-[1fr_1fr] fade-up">
            <div className="surface-card p-6">
              <h2 className="section-title text-lg font-bold">Add Score</h2>
              <form className="mt-4 space-y-4" onSubmit={handleScoreCreate}>
                <div><label className="input-label">Score Date</label><input type="date" className="input-field" value={scoreDate} onChange={(e) => setScoreDate(e.target.value)} /></div>
                <div><label className="input-label">Stableford Score (1–45)</label><input type="number" min={1} max={45} className="input-field" value={stablefordScore} onChange={(e) => setStablefordScore(e.target.value)} /></div>
                <button type="submit" disabled={!canSubmit || loading} className="btn btn-primary w-full">{loading ? "Saving..." : "Save Score"}</button>
              </form>
            </div>

            <div className="surface-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="section-title text-lg font-bold">Latest 5 Scores</h2>
                <span className="badge bg-primary-soft text-primary">{scores.length}/5</span>
              </div>
              {scores.length === 0 ? (
                <p className="text-sm text-slate">No scores yet. Add your first score.</p>
              ) : (
                <div className="space-y-2">
                  {scores.map((s) => (
                    <div key={s.id} className="flex items-center justify-between rounded-xl border border-mist px-4 py-3 hover:bg-cloud transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="number-orb" style={{ width: 36, height: 36, fontSize: 14 }}>{s.stableford_score}</div>
                        <div>
                          <p className="text-sm font-semibold">{s.stableford_score} pts</p>
                          <p className="text-xs text-slate">{fmt(s.score_date)}</p>
                        </div>
                      </div>
                      <button className="text-xs font-semibold text-danger hover:bg-red-50 rounded-lg px-2 py-1 transition-colors" onClick={() => deleteScore(s.id)}>Delete</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Charity Tab */}
        {activeTab === "charity" && (
          <div className="grid gap-6 lg:grid-cols-[1fr_1fr] fade-up">
            <div className="surface-card p-6">
              <h2 className="section-title text-lg font-bold">Charity Selection</h2>
              <p className="mt-1 text-sm text-slate">Current: <strong>{summary?.charity?.name ?? "Not selected"}</strong></p>
              <div className="mt-4 space-y-4">
                <div><label className="input-label">Choose Charity</label>
                  <select className="input-field" value={selectedCharityId} onChange={(e) => setSelectedCharityId(e.target.value)}>
                    <option value="">Select charity</option>
                    {charities.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div><label className="input-label">Contribution % (min 10%)</label>
                  <input type="number" min={10} max={100} className="input-field" value={charityPercent} onChange={(e) => setCharityPercent(e.target.value)} />
                </div>
                <button className="btn btn-impact w-full" onClick={() => saveCharity().catch(() => toast("Failed", "error"))}>Save Charity Preference</button>
              </div>
            </div>

            <div className="surface-card p-6">
              <h2 className="section-title text-lg font-bold">Subscription</h2>
              <div className="mt-4 space-y-3">
                <div className="rounded-xl bg-cloud p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate">Plan</p>
                  <p className="text-lg font-bold capitalize">{summary?.subscription?.plan ?? "None"}</p>
                </div>
                <div className="rounded-xl bg-cloud p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate">Renewal</p>
                  <p className="text-sm font-semibold">{summary?.subscription?.current_period_end ?? "N/A"}</p>
                </div>
                <div className="flex gap-2">
                  <button className="btn btn-secondary flex-1 text-xs" onClick={() => startCheckout("monthly").catch(() => toast("Failed", "error"))}>Monthly</button>
                  <button className="btn btn-primary flex-1 text-xs" onClick={() => startCheckout("yearly").catch(() => toast("Failed", "error"))}>Yearly</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Winnings Tab */}
        {activeTab === "winnings" && (
          <div className="space-y-6 fade-up">
            <div className="surface-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="section-title text-lg font-bold">Winnings & Verification</h2>
                <p className="text-xs text-slate">Pending: {summary?.winnings?.pendingCount ?? 0}</p>
              </div>
              {winners.length === 0 ? (
                <p className="text-sm text-slate">No winnings yet. Keep entering scores!</p>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {winners.map((w) => (
                    <div key={w.id} className="rounded-xl border border-mist p-4 hover:bg-cloud transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <span className="badge text-[10px]" style={{ background: w.tier === "5-match" ? "var(--amber-soft)" : w.tier === "4-match" ? "var(--primary-soft)" : "var(--impact-soft)", color: w.tier === "5-match" ? "var(--amber)" : w.tier === "4-match" ? "var(--primary)" : "var(--impact)" }}>{w.tier}</span>
                        <span className={`badge text-[10px] status-${w.status}`}>{w.status}</span>
                      </div>
                      <p className="text-xl font-bold">{formatCurrencyFromCents(w.payout_cents)}</p>
                      {w.proof_url && <a className="mt-1 text-xs font-semibold text-primary hover:underline" href={w.proof_url} target="_blank" rel="noreferrer">View proof</a>}
                    </div>
                  ))}
                </div>
              )}

              <hr className="divider" />
              <h3 className="text-sm font-bold mb-3">Upload Winner Proof</h3>
              <div className="grid gap-3 md:grid-cols-3">
                <input className="input-field" placeholder="Winner ID" value={proofWinnerId} onChange={(e) => setProofWinnerId(e.target.value)} />
                <input className="input-field md:col-span-2" placeholder="Proof URL" value={proofUrl} onChange={(e) => setProofUrl(e.target.value)} />
              </div>
              <button className="btn btn-primary mt-3" onClick={() => submitProof().catch(() => toast("Failed", "error"))}>Submit Proof</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
