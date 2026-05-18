import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

function mapProfile(u: any) {
  if (!u) return null;
  return {
    id: u.id,
    username: u.username,
    name: u.name,
    email: u.email,
    avatar: u.avatar,
    bio: u.bio,
    college: u.college,
    company: u.company,
    location: u.location,
    github: u.github,
    portfolio: u.portfolio,
    skills: u.skills,
    builderDna: u.builder_dna,
    funPrompts: u.fun_prompts,
    aiSummary: u.ai_summary,
    availability: u.availability,
    interests: u.interests,
    online: u.online,
    createdAt: u.created_at,
  };
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ pingId: string }> }
) {
  const { pingId } = await params;
  const { status } = await req.json();

  if (!["accepted", "ignored", "pending"].includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const supabase = await createServerSupabaseClient();
  const { data: rawUpdated, error } = await supabase
    .from("pings")
    .update({ status })
    .eq("id", pingId)
    .select(`
      id, from_user_id, to_user_id, message, ai_suggested, status, created_at,
      fromUser:profiles!pings_from_user_id_fkey(*),
      toUser:profiles!pings_to_user_id_fkey(*)
    `)
    .single();

  const updated = rawUpdated as any;

  if (error || !updated) return NextResponse.json({ error: "Ping not found or update failed" }, { status: 404 });

  const mapped = {
    id: updated.id,
    fromUserId: updated.from_user_id,
    toUserId: updated.to_user_id,
    message: updated.message,
    aiSuggested: updated.ai_suggested,
    status: updated.status,
    createdAt: updated.created_at,
    fromUser: mapProfile(updated.fromUser),
    toUser: mapProfile(updated.toUser),
  };

  return NextResponse.json(mapped);
}
