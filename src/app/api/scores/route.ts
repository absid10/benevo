import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase";
import { scoreInputSchema } from "@/lib/schemas";

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get("userId");
  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("scores")
    .select("id, user_id, score_date, stableford_score, created_at")
    .eq("user_id", userId)
    .order("score_date", { ascending: false })
    .limit(5);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ scores: data ?? [] });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = scoreInputSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { userId, scoreDate, stablefordScore } = parsed.data;
  const supabase = createSupabaseAdminClient();

  const { data: existing, error: existingError } = await supabase
    .from("scores")
    .select("id")
    .eq("user_id", userId)
    .eq("score_date", scoreDate)
    .maybeSingle();

  if (existingError) {
    return NextResponse.json({ error: existingError.message }, { status: 500 });
  }

  if (existing) {
    return NextResponse.json(
      { error: "A score already exists for this date. Edit or delete it instead." },
      { status: 409 }
    );
  }

  const { error: insertError } = await supabase.from("scores").insert({
    user_id: userId,
    score_date: scoreDate,
    stableford_score: stablefordScore,
  });

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  const { data: sorted, error: sortedError } = await supabase
    .from("scores")
    .select("id")
    .eq("user_id", userId)
    .order("score_date", { ascending: false })
    .order("created_at", { ascending: false });

  if (sortedError) {
    return NextResponse.json({ error: sortedError.message }, { status: 500 });
  }

  const staleScoreIds = (sorted ?? []).slice(5).map((item) => item.id);
  if (staleScoreIds.length > 0) {
    const { error: deleteError } = await supabase.from("scores").delete().in("id", staleScoreIds);
    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }
  }

  return NextResponse.json({ success: true });
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  const schema = scoreInputSchema.extend({ scoreId: scoreInputSchema.shape.userId });
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { scoreId, userId, scoreDate, stablefordScore } = parsed.data;
  const supabase = createSupabaseAdminClient();

  const { data: duplicate, error: duplicateError } = await supabase
    .from("scores")
    .select("id")
    .eq("user_id", userId)
    .eq("score_date", scoreDate)
    .neq("id", scoreId)
    .maybeSingle();

  if (duplicateError) {
    return NextResponse.json({ error: duplicateError.message }, { status: 500 });
  }

  if (duplicate) {
    return NextResponse.json(
      { error: "Cannot move score to a date that already has an entry." },
      { status: 409 }
    );
  }

  const { error } = await supabase
    .from("scores")
    .update({ score_date: scoreDate, stableford_score: stablefordScore })
    .eq("id", scoreId)
    .eq("user_id", userId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(request: NextRequest) {
  const body = await request.json();
  const userId = body.userId as string | undefined;
  const scoreId = body.scoreId as string | undefined;

  if (!userId || !scoreId) {
    return NextResponse.json({ error: "userId and scoreId are required" }, { status: 400 });
  }

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("scores").delete().eq("id", scoreId).eq("user_id", userId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
