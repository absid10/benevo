import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase";

// POST /api/auth/create-admin
// Creates a dedicated admin user in Supabase Auth + sets role=admin in profiles
export async function POST(request: NextRequest) {
  const body = await request.json();
  const secret = body.secret as string | undefined;
  const email = body.email as string | undefined;
  const password = body.password as string | undefined;
  const fullName = (body.fullName as string | undefined) ?? "Platform Admin";

  // Guard with the admin secret
  if (secret !== process.env.ADMIN_API_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!email || !password) {
    return NextResponse.json({ error: "email and password are required" }, { status: 400 });
  }

  const supabase = createSupabaseAdminClient();

  // Create the user in Supabase Auth (email_confirm bypassed via admin API)
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName },
  });

  if (authError) {
    return NextResponse.json({ error: authError.message }, { status: 500 });
  }

  const userId = authData.user.id;

  // Upsert profile with role=admin
  const { error: profileError } = await supabase.from("profiles").upsert(
    { id: userId, role: "admin", full_name: fullName },
    { onConflict: "id" }
  );

  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    admin: { id: userId, email, fullName, role: "admin" },
  });
}
