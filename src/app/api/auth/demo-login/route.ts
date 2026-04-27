import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const userId = body.userId as string | undefined;
  const role = (body.role as "subscriber" | "admin" | undefined) ?? "subscriber";
  const fullName = body.fullName as string | undefined;

  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("profiles").upsert(
    {
      id: userId,
      role,
      full_name: fullName ?? null,
    },
    { onConflict: "id" }
  );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
