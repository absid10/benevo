/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { formatCurrencyFromCents } from "@/lib/format";

type Score = {
  id: string;
  score_date: string;
  stableford_score: number;
};

type Charity = {
  id: string;
  name: string;
};

type Winner = {
  id: string;
  tier: string;
  payout_cents: number;
  status: string;
  proof_url: string | null;
};

type Summary = {
  subscription?: {
    plan?: string;
    status?: string;
    current_period_end?: string | null;
  } | null;
  charity: {
    name: string | null;
    percent: number;
  };
  participation: {
    drawsEntered: number;
  };
  winnings: {
    totalWonCents: number;
    pendingCount: number;
  };
};

function formatDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString();
}

export default function DashboardPage() {
  const [userId, setUserId] = useState(() => {
    if (typeof window === "undefined") return "";
    return window.localStorage.getItem("benevo.userId") ?? "";
  });
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
  const [loading, setLoading] = useState(false);

  async function startCheckout(plan: "monthly" | "yearly") {
    if (!userId || !selectedCharityId) {
      setMessage("Enter user id and select charity before starting checkout.");
      return;
    }

    const response = await fetch("/api/billing/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        plan,
        charityId: selectedCharityId,
        charityPercent: Number(charityPercent),
      }),
    });

    const payload = await response.json();
    if (!response.ok) {
      setMessage(payload.error ?? "Unable to initialize checkout");
      return;
    }

    if (payload.checkoutUrl) {
      window.location.href = payload.checkoutUrl;
    }
  }

  async function loadSummary(targetUserId: string) {
    if (!targetUserId) return;
    const response = await fetch(`/api/dashboard/summary?userId=${targetUserId}`);
    const payload = await response.json();

    if (!response.ok) {
      setMessage(payload.error ?? "Failed to load dashboard summary");
      return;
    }

    setSummary(payload);
    setCharityPercent(String(payload.charity?.percent ?? 10));
  }

  async function loadWinners(targetUserId: string) {
    if (!targetUserId) return;
    const response = await fetch(`/api/winners?userId=${targetUserId}`);
    const payload = await response.json();

    if (!response.ok) {
      setMessage(payload.error ?? "Failed to load winners");
      return;
    }

    setWinners(payload.winners ?? []);
  }

  async function loadCharities() {
    const response = await fetch("/api/charities");
    const payload = await response.json();

    if (!response.ok) {
      setMessage(payload.error ?? "Failed to load charities");
      return;
    }

    setCharities(payload.charities ?? []);
  }

  async function loadScores(targetUserId: string) {
    if (!targetUserId) return;

    const response = await fetch(`/api/scores?userId=${targetUserId}`);
    const payload = await response.json();

    if (!response.ok) {
      setMessage(payload.error ?? "Failed to fetch scores");
      return;
    }

    setScores(payload.scores);
  }

  useEffect(() => {
    if (userId) {
      Promise.all([loadScores(userId), loadSummary(userId), loadWinners(userId)]).catch(() =>
        setMessage("Failed to load dashboard data")
      );
    }
  }, [userId]);

  useEffect(() => {
    loadCharities().catch(() => setMessage("Failed to load charities"));
  }, []);

  const canSubmit = useMemo(() => {
    return userId.trim().length > 0 && scoreDate.length > 0 && Number(stablefordScore) >= 1;
  }, [userId, scoreDate, stablefordScore]);

  async function handleScoreCreate(event: FormEvent) {
    event.preventDefault();
    if (!canSubmit) return;

    setLoading(true);
    setMessage("");
    window.localStorage.setItem("benevo.userId", userId);

    const response = await fetch("/api/scores", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        scoreDate,
        stablefordScore: Number(stablefordScore),
      }),
    });

    const payload = await response.json();
    if (!response.ok) {
      setMessage(payload.error ?? "Score could not be saved");
      setLoading(false);
      return;
    }

    setMessage("Score saved. Rolling top-5 list updated.");
    setStablefordScore("");
    setScoreDate("");
    await loadScores(userId);
    setLoading(false);
  }

  async function deleteScore(scoreId: string) {
    const response = await fetch("/api/scores", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, scoreId }),
    });

    const payload = await response.json();
    if (!response.ok) {
      setMessage(payload.error ?? "Delete failed");
      return;
    }

    setMessage("Score removed.");
    await loadScores(userId);
  }

  async function saveCharityPreference() {
    if (!userId || !selectedCharityId) {
      setMessage("Provide user id and charity selection first.");
      return;
    }

    const response = await fetch("/api/charity-preference", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        charityId: selectedCharityId,
        charityPercent: Number(charityPercent),
      }),
    });

    const payload = await response.json();
    if (!response.ok) {
      setMessage(payload.error ?? "Failed to update charity preference");
      return;
    }

    setMessage("Charity preference updated.");
    await loadSummary(userId);
  }

  async function submitWinnerProof() {
    if (!userId || !proofWinnerId || !proofUrl) {
      setMessage("Winner id and proof url are required.");
      return;
    }

    const response = await fetch("/api/winners", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, winnerId: proofWinnerId, proofUrl }),
    });

    const payload = await response.json();
    if (!response.ok) {
      setMessage(payload.error ?? "Failed to upload winner proof");
      return;
    }

    setMessage("Proof uploaded for review.");
    setProofUrl("");
    setProofWinnerId("");
    await loadWinners(userId);
  }

  return (
    <main className="py-8 md:py-12">
      <div className="container space-y-6">
        <header className="surface-card p-6 md:p-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-impact">Subscriber dashboard</p>
          <h1 className="hero-title text-3xl font-bold md:text-5xl">Track scores. Fund change. Enter every draw.</h1>
          <p className="mt-3 max-w-2xl text-slate-700">
            Use your real Supabase user id while testing. The system keeps only your latest five scores and
            blocks duplicate entries for the same date.
          </p>
        </header>

        <section className="grid gap-5 lg:grid-cols-[1fr_1fr]">
          <article className="surface-card p-6">
            <h2 className="font-heading text-xl font-semibold">Add score</h2>
            <form className="mt-4 space-y-4" onSubmit={handleScoreCreate}>
              <label className="block space-y-1">
                <span className="text-sm font-medium">User id</span>
                <input
                  className="w-full rounded-xl border border-mist px-3 py-2 outline-none focus:border-primary"
                  placeholder="uuid"
                  value={userId}
                  onChange={(event) => setUserId(event.target.value)}
                />
              </label>

              <label className="block space-y-1">
                <span className="text-sm font-medium">Score date</span>
                <input
                  type="date"
                  className="w-full rounded-xl border border-mist px-3 py-2 outline-none focus:border-primary"
                  value={scoreDate}
                  onChange={(event) => setScoreDate(event.target.value)}
                />
              </label>

              <label className="block space-y-1">
                <span className="text-sm font-medium">Stableford score (1 to 45)</span>
                <input
                  type="number"
                  min={1}
                  max={45}
                  className="w-full rounded-xl border border-mist px-3 py-2 outline-none focus:border-primary"
                  value={stablefordScore}
                  onChange={(event) => setStablefordScore(event.target.value)}
                />
              </label>

              <button
                type="submit"
                disabled={!canSubmit || loading}
                className="rounded-xl bg-primary px-4 py-2 font-semibold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Saving..." : "Save score"}
              </button>
            </form>
          </article>

          <article className="surface-card p-6">
            <h2 className="font-heading text-xl font-semibold">Status snapshot</h2>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs text-slate-600">Subscription</p>
                <p className="text-xl font-semibold capitalize">{summary?.subscription?.status ?? "inactive"}</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs text-slate-600">Charity Share</p>
                <p className="text-xl font-semibold text-impact">{summary?.charity?.percent ?? 10}%</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs text-slate-600">Draws Entered</p>
                <p className="text-xl font-semibold">{summary?.participation?.drawsEntered ?? 0}</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs text-slate-600">Winnings</p>
                <p className="text-xl font-semibold">
                  {formatCurrencyFromCents(summary?.winnings?.totalWonCents ?? 0)}
                </p>
              </div>
            </div>
            {message && <p className="mt-4 rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-700">{message}</p>}
          </article>
        </section>

        <section className="grid gap-5 lg:grid-cols-[1fr_1fr]">
          <article className="surface-card p-6">
            <h2 className="font-heading text-xl font-semibold">Charity selection</h2>
            <p className="mt-2 text-sm text-slate-700">
              Current charity: <strong>{summary?.charity?.name ?? "Not selected"}</strong>
            </p>

            <div className="mt-4 space-y-3">
              <label className="block space-y-1">
                <span className="text-sm font-medium">Choose charity</span>
                <select
                  className="w-full rounded-xl border border-mist px-3 py-2 outline-none focus:border-primary"
                  value={selectedCharityId}
                  onChange={(event) => setSelectedCharityId(event.target.value)}
                >
                  <option value="">Select charity</option>
                  {charities.map((charity) => (
                    <option key={charity.id} value={charity.id}>
                      {charity.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block space-y-1">
                <span className="text-sm font-medium">Contribution percentage (minimum 10%)</span>
                <input
                  type="number"
                  min={10}
                  max={100}
                  className="w-full rounded-xl border border-mist px-3 py-2 outline-none focus:border-primary"
                  value={charityPercent}
                  onChange={(event) => setCharityPercent(event.target.value)}
                />
              </label>

              <button
                className="rounded-xl bg-primary px-4 py-2 font-semibold text-white hover:bg-primary-hover"
                onClick={() => saveCharityPreference().catch(() => setMessage("Failed to save charity preference"))}
              >
                Save charity preference
              </button>
            </div>
          </article>

          <article className="surface-card p-6">
            <h2 className="font-heading text-xl font-semibold">Subscription module</h2>
            <p className="mt-2 text-sm text-slate-700">
              Plan: <strong className="capitalize">{summary?.subscription?.plan ?? "monthly"}</strong>
            </p>
            <p className="mt-1 text-sm text-slate-700">
              Renewal: <strong>{summary?.subscription?.current_period_end ?? "Not available"}</strong>
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                className="rounded-xl border border-mist px-4 py-2 text-sm font-semibold hover:bg-slate-50"
                onClick={() => startCheckout("yearly").catch(() => setMessage("Checkout failed"))}
              >
                Switch to Yearly
              </button>
              <button
                className="rounded-xl border border-mist px-4 py-2 text-sm font-semibold hover:bg-slate-50"
                onClick={() => startCheckout("monthly").catch(() => setMessage("Checkout failed"))}
              >
                Renew Monthly
              </button>
              <button className="rounded-xl border border-mist px-4 py-2 text-sm font-semibold hover:bg-slate-50" type="button">
                Manage billing
              </button>
            </div>
          </article>
        </section>

        <section className="surface-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-heading text-xl font-semibold">Latest 5 scores</h2>
            <button
              className="rounded-xl border border-mist px-3 py-2 text-sm font-semibold hover:bg-slate-50"
              onClick={() => loadScores(userId).catch(() => setMessage("Failed to refresh scores"))}
            >
              Refresh
            </button>
          </div>

          <div className="space-y-2">
            {scores.length === 0 && <p className="text-slate-700">No scores yet. Add your first score above.</p>}
            {scores.map((score) => (
              <div key={score.id} className="flex items-center justify-between rounded-xl border border-mist px-4 py-3">
                <div>
                  <p className="font-semibold">{score.stableford_score} pts</p>
                  <p className="text-sm text-slate-600">{formatDate(score.score_date)}</p>
                </div>
                <button
                  className="rounded-xl px-3 py-2 text-sm font-semibold text-danger hover:bg-red-50"
                  onClick={() => deleteScore(score.id).catch(() => setMessage("Delete failed"))}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="surface-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-heading text-xl font-semibold">Winnings and verification</h2>
            <p className="text-sm text-slate-700">Pending reviews: {summary?.winnings?.pendingCount ?? 0}</p>
          </div>

          <div className="space-y-2">
            {winners.length === 0 && <p className="text-slate-700">No winnings yet.</p>}
            {winners.map((winner) => (
              <div key={winner.id} className="rounded-xl border border-mist p-4">
                <p className="text-sm text-slate-700">Tier: {winner.tier}</p>
                <p className="font-semibold">{formatCurrencyFromCents(winner.payout_cents)}</p>
                <p className="text-sm capitalize text-slate-700">Status: {winner.status}</p>
                {winner.proof_url && (
                  <a className="text-sm font-semibold text-primary" href={winner.proof_url} target="_blank" rel="noreferrer">
                    View uploaded proof
                  </a>
                )}
              </div>
            ))}
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <input
              className="rounded-xl border border-mist px-3 py-2 outline-none focus:border-primary"
              placeholder="winner id"
              value={proofWinnerId}
              onChange={(event) => setProofWinnerId(event.target.value)}
            />
            <input
              className="rounded-xl border border-mist px-3 py-2 outline-none focus:border-primary md:col-span-2"
              placeholder="proof url"
              value={proofUrl}
              onChange={(event) => setProofUrl(event.target.value)}
            />
          </div>

          <button
            className="mt-3 rounded-xl bg-primary px-4 py-2 font-semibold text-white hover:bg-primary-hover"
            onClick={() => submitWinnerProof().catch(() => setMessage("Failed to submit proof"))}
          >
            Submit winner proof
          </button>
        </section>
      </div>
    </main>
  );
}
