import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

// Helper to map DB profile to frontend User
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

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });

  const supabase = await createServerSupabaseClient();
  const { data: pings, error } = await supabase
    .from("pings")
    .select(`
      id, from_user_id, to_user_id, message, ai_suggested, status, created_at,
      fromUser:profiles!pings_from_user_id_fkey(*),
      toUser:profiles!pings_to_user_id_fkey(*)
    `)
    .or(`from_user_id.eq.${userId},to_user_id.eq.${userId}`);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const mapped = (pings || []).map((p: any) => ({
    id: p.id,
    fromUserId: p.from_user_id,
    toUserId: p.to_user_id,
    message: p.message,
    aiSuggested: p.ai_suggested,
    status: p.status,
    createdAt: p.created_at,
    fromUser: mapProfile(p.fromUser),
    toUser: mapProfile(p.toUser),
  }));

  return NextResponse.json(mapped);
}

export async function POST(req: NextRequest) {
  const { fromUserId, toUserId, message, aiSuggested = false } = await req.json();
  if (!fromUserId || !toUserId || !message) {
    return NextResponse.json({ error: "fromUserId, toUserId, message required" }, { status: 400 });
  }

  const supabase = await createServerSupabaseClient();
  const { data: rawPing, error } = await supabase
    .from("pings")
    .insert({
      from_user_id: fromUserId,
      to_user_id: toUserId,
      message,
      ai_suggested: aiSuggested,
    })
    .select(`
      id, from_user_id, to_user_id, message, ai_suggested, status, created_at,
      fromUser:profiles!pings_from_user_id_fkey(*),
      toUser:profiles!pings_to_user_id_fkey(*)
    `)
    .single();

  const ping = rawPing as any;

  if (error || !ping) return NextResponse.json({ error: error?.message || "Failed to create ping" }, { status: 500 });

  const mapped = {
    id: ping.id,
    fromUserId: ping.from_user_id,
    toUserId: ping.to_user_id,
    message: ping.message,
    aiSuggested: ping.ai_suggested,
    status: ping.status,
    createdAt: ping.created_at,
    fromUser: mapProfile(ping.fromUser),
    toUser: mapProfile(ping.toUser),
  };

  return NextResponse.json(mapped, { status: 201 });
}
