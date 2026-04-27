import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const userId = body.userId as string | undefined;
  const charityId = body.charityId as string | undefined;
  const charityPercent = Number(body.charityPercent);

  if (!userId || !charityId || Number.isNaN(charityPercent) || charityPercent < 10 || charityPercent > 100) {
    return NextResponse.json(
      { error: "userId, charityId, and charityPercent(10-100) are required" },
      { status: 400 }
    );
  }

  const supabase = createSupabaseAdminClient();

  const { error } = await supabase.from("user_charity_preferences").upsert(
    {
      user_id: userId,
      charity_id: charityId,
      charity_percent: charityPercent,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" }
  );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { error: subError } = await supabase
    .from("subscriptions")
    .update({ charity_percent: charityPercent, updated_at: new Date().toISOString() })
    .eq("user_id", userId);

  if (subError) {
    return NextResponse.json({ error: subError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
