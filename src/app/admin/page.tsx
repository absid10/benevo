"use client";

import { FormEvent, useState } from "react";
import { formatCurrencyFromCents } from "@/lib/format";

type Winner = {
  id: string;
  user_id: string;
  tier: string;
  payout_cents: number;
  status: "pending" | "approved" | "paid" | "rejected";
  proof_url: string | null;
};

export default function AdminPage() {
  const [actorUserId, setActorUserId] = useState("");
  const [drawMonth, setDrawMonth] = useState(new Date().toISOString().slice(0, 10));
  const [mode, setMode] = useState<"random" | "weighted">("random");
  const [adminSecret, setAdminSecret] = useState("");
  const [output, setOutput] = useState("");
  const [charityName, setCharityName] = useState("");
  const [charitySlug, setCharitySlug] = useState("");
  const [winners, setWinners] = useState<Winner[]>([]);
  const [winnerId, setWinnerId] = useState("");
  const [winnerStatus, setWinnerStatus] = useState<"approved" | "paid" | "rejected">("approved");
  const [report, setReport] = useState("");

  async function simulateDraw(event: FormEvent) {
    event.preventDefault();

    const response = await fetch("/api/draw/simulate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ drawMonth, mode, actorUserId }),
    });

    const payload = await response.json();
    setOutput(JSON.stringify(payload, null, 2));
  }

  async function publishDraw() {
    const response = await fetch("/api/draw/publish", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ drawMonth, mode, actorUserId }),
    });

    const payload = await response.json();
    setOutput(JSON.stringify(payload, null, 2));
  }

  async function createCharity() {
    const response = await fetch("/api/charities", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-secret": adminSecret,
      },
      body: JSON.stringify({
        name: charityName,
        slug: charitySlug,
      }),
    });

    const payload = await response.json();
    setOutput(JSON.stringify(payload, null, 2));
  }

  async function fetchWinners() {
    const response = await fetch("/api/winners?admin=true", {
      headers: {
        "x-admin-secret": adminSecret,
      },
    });
    const payload = await response.json();
    if (!response.ok) {
      setOutput(JSON.stringify(payload, null, 2));
      return;
    }

    setWinners(payload.winners ?? []);
  }

  async function updateWinnerStatus() {
    const response = await fetch("/api/winners", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-admin-secret": adminSecret,
      },
      body: JSON.stringify({
        winnerId,
        status: winnerStatus,
        reviewedBy: actorUserId,
      }),
    });

    const payload = await response.json();
    setOutput(JSON.stringify(payload, null, 2));
    if (response.ok) {
      await fetchWinners();
    }
  }

  async function fetchReports() {
    const response = await fetch("/api/admin/reports", {
      headers: {
        "x-admin-secret": adminSecret,
      },
    });
    const payload = await response.json();
    if (!response.ok) {
      setReport(payload.error ?? "Failed to fetch reports");
      return;
    }
    setReport(JSON.stringify(payload, null, 2));
  }

  return (
    <main className="py-8 md:py-12">
      <div className="container space-y-6">
        <header className="surface-card p-6 md:p-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-impact">Operations console</p>
          <h1 className="hero-title text-3xl font-bold md:text-5xl">Admin controls for draws, winners, and charities</h1>
          <p className="mt-3 max-w-2xl text-slate-700">
            This panel supports simulation and publish for the monthly draw engine, plus quick charity creation.
          </p>
        </header>

        <section className="grid gap-5 lg:grid-cols-2">
          <article className="surface-card p-6">
            <h2 className="font-heading text-xl font-semibold">Draw management</h2>
            <form className="mt-4 space-y-4" onSubmit={simulateDraw}>
              <label className="block space-y-1">
                <span className="text-sm font-medium">Admin user id</span>
                <input
                  className="w-full rounded-xl border border-mist px-3 py-2 outline-none focus:border-primary"
                  value={actorUserId}
                  onChange={(event) => setActorUserId(event.target.value)}
                />
              </label>

              <label className="block space-y-1">
                <span className="text-sm font-medium">Draw month</span>
                <input
                  type="date"
                  className="w-full rounded-xl border border-mist px-3 py-2 outline-none focus:border-primary"
                  value={drawMonth}
                  onChange={(event) => setDrawMonth(event.target.value)}
                />
              </label>

              <label className="block space-y-1">
                <span className="text-sm font-medium">Mode</span>
                <select
                  className="w-full rounded-xl border border-mist px-3 py-2 outline-none focus:border-primary"
                  value={mode}
                  onChange={(event) => setMode(event.target.value as "random" | "weighted")}
                >
                  <option value="random">Random</option>
                  <option value="weighted">Weighted</option>
                </select>
              </label>

              <div className="flex gap-3">
                <button className="rounded-xl bg-primary px-4 py-2 font-semibold text-white hover:bg-primary-hover" type="submit">
                  Run simulation
                </button>
                <button
                  className="rounded-xl border border-mist px-4 py-2 font-semibold hover:bg-slate-50"
                  type="button"
                  onClick={() => publishDraw().catch(() => setOutput("Publish failed"))}
                >
                  Publish draw
                </button>
              </div>
            </form>
          </article>

          <article className="surface-card p-6">
            <h2 className="font-heading text-xl font-semibold">Charity management</h2>
            <div className="mt-4 space-y-4">
              <label className="block space-y-1">
                <span className="text-sm font-medium">Admin API secret</span>
                <input
                  className="w-full rounded-xl border border-mist px-3 py-2 outline-none focus:border-primary"
                  value={adminSecret}
                  onChange={(event) => setAdminSecret(event.target.value)}
                />
              </label>

              <label className="block space-y-1">
                <span className="text-sm font-medium">Charity name</span>
                <input
                  className="w-full rounded-xl border border-mist px-3 py-2 outline-none focus:border-primary"
                  value={charityName}
                  onChange={(event) => setCharityName(event.target.value)}
                />
              </label>

              <label className="block space-y-1">
                <span className="text-sm font-medium">Charity slug</span>
                <input
                  className="w-full rounded-xl border border-mist px-3 py-2 outline-none focus:border-primary"
                  value={charitySlug}
                  onChange={(event) => setCharitySlug(event.target.value)}
                />
              </label>

              <button
                className="rounded-xl bg-primary px-4 py-2 font-semibold text-white hover:bg-primary-hover"
                onClick={() => createCharity().catch(() => setOutput("Charity creation failed"))}
              >
                Create charity
              </button>
            </div>
          </article>
        </section>

        <section className="grid gap-5 lg:grid-cols-2">
          <article className="surface-card p-6">
            <h2 className="font-heading text-xl font-semibold">Winner verification and payout</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <input
                className="rounded-xl border border-mist px-3 py-2 outline-none focus:border-primary"
                placeholder="winner id"
                value={winnerId}
                onChange={(event) => setWinnerId(event.target.value)}
              />
              <select
                className="rounded-xl border border-mist px-3 py-2 outline-none focus:border-primary"
                value={winnerStatus}
                onChange={(event) =>
                  setWinnerStatus(event.target.value as "approved" | "paid" | "rejected")
                }
              >
                <option value="approved">Approve</option>
                <option value="paid">Mark paid</option>
                <option value="rejected">Reject</option>
              </select>
              <button
                className="rounded-xl bg-primary px-4 py-2 font-semibold text-white hover:bg-primary-hover"
                onClick={() => updateWinnerStatus().catch(() => setOutput("Winner update failed"))}
              >
                Update winner
              </button>
            </div>

            <button
              className="mt-3 rounded-xl border border-mist px-4 py-2 font-semibold hover:bg-slate-50"
              onClick={() => fetchWinners().catch(() => setOutput("Failed to fetch winners"))}
            >
              Refresh winners list
            </button>

            <div className="mt-4 space-y-2">
              {winners.length === 0 && <p className="text-sm text-slate-700">No winners loaded yet.</p>}
              {winners.map((winner) => (
                <div key={winner.id} className="rounded-xl border border-mist p-3">
                  <p className="text-xs text-slate-600">{winner.id}</p>
                  <p className="text-sm">User: {winner.user_id}</p>
                  <p className="text-sm">Tier: {winner.tier}</p>
                  <p className="text-sm">Payout: {formatCurrencyFromCents(winner.payout_cents)}</p>
                  <p className="text-sm capitalize">Status: {winner.status}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="surface-card p-6">
            <h2 className="font-heading text-xl font-semibold">Reports and analytics</h2>
            <p className="mt-2 text-sm text-slate-700">
              Pull total users, active subscriptions, pool amounts, and average charity percentage.
            </p>

            <button
              className="mt-4 rounded-xl bg-primary px-4 py-2 font-semibold text-white hover:bg-primary-hover"
              onClick={() => fetchReports().catch(() => setReport("Failed to fetch reports"))}
            >
              Fetch reports
            </button>

            <pre className="mt-4 overflow-auto rounded-xl bg-slate-900 p-4 text-xs text-slate-100">
              {report || "Reports output will appear here."}
            </pre>
          </article>
        </section>

        <section className="surface-card p-6">
          <h2 className="font-heading text-xl font-semibold">API output</h2>
          <pre className="mt-4 overflow-auto rounded-xl bg-slate-900 p-4 text-xs text-slate-100">{output || "Run a command to inspect output."}</pre>
        </section>
      </div>
    </main>
  );
}
