import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase";

function isAuthorizedAdmin(request: NextRequest) {
  const secret = request.headers.get("x-admin-secret");
  return Boolean(secret && process.env.ADMIN_API_SECRET && secret === process.env.ADMIN_API_SECRET);
}

export async function GET(request: NextRequest) {
  const supabase = createSupabaseAdminClient();
  const userId = request.nextUrl.searchParams.get("userId");
  const adminMode = request.nextUrl.searchParams.get("admin") === "true";

  if (!adminMode && !userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  if (adminMode && !isAuthorizedAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const query = supabase
    .from("winners")
    .select("id, draw_id, user_id, tier, payout_cents, proof_url, status, reviewed_at, created_at")
    .order("created_at", { ascending: false });

  const { data, error } = adminMode ? await query : await query.eq("user_id", userId as string);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ winners: data ?? [] });
}

export async function PUT(request: NextRequest) {
  if (!isAuthorizedAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const winnerId = body.winnerId as string | undefined;
  const status = body.status as "pending" | "approved" | "paid" | "rejected" | undefined;
  const reviewedBy = body.reviewedBy as string | undefined;

  if (!winnerId || !status || !reviewedBy) {
    return NextResponse.json(
      { error: "winnerId, status, and reviewedBy are required" },
      { status: 400 }
    );
  }

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase
    .from("winners")
    .update({
      status,
      reviewed_by: reviewedBy,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", winnerId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const winnerId = body.winnerId as string | undefined;
  const userId = body.userId as string | undefined;
  const proofUrl = body.proofUrl as string | undefined;

  if (!winnerId || !userId || !proofUrl) {
    return NextResponse.json({ error: "winnerId, userId, and proofUrl are required" }, { status: 400 });
  }

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase
    .from("winners")
    .update({
      proof_url: proofUrl,
      status: "pending",
    })
    .eq("id", winnerId)
    .eq("user_id", userId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
