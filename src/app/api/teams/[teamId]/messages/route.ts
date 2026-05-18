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

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ teamId: string }> }
) {
  const { teamId } = await params;
  const supabase = await createServerSupabaseClient();

  const { data: messages, error } = await supabase
    .from("messages")
    .select(`
      id, team_id, user_id, content, type, created_at,
      user:profiles(*)
    `)
    .eq("team_id", teamId)
    .order("created_at", { ascending: true })
    .limit(50);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const mapped = (messages || []).map((m: any) => ({
    id: m.id,
    teamId: m.team_id,
    userId: m.user_id,
    content: m.content,
    type: m.type,
    createdAt: m.created_at,
    user: mapProfile(m.user),
  }));

  return NextResponse.json(mapped);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ teamId: string }> }
) {
  const { teamId } = await params;
  const { userId, content, type = "text" } = await req.json();

  if (!userId || !content) {
    return NextResponse.json({ error: "userId and content required" }, { status: 400 });
  }

  const supabase = await createServerSupabaseClient();
  const { data: rawMessage, error } = await supabase
    .from("messages")
    .insert({
      team_id: teamId,
      user_id: userId,
      content,
      type,
    })
    .select(`
      id, team_id, user_id, content, type, created_at,
      user:profiles(*)
    `)
    .single();

  const message = rawMessage as any;

  if (error || !message) return NextResponse.json({ error: error?.message || "Failed to create message" }, { status: 500 });

  const mapped = {
    id: message.id,
    teamId: message.team_id,
    userId: message.user_id,
    content: message.content,
    type: message.type,
    createdAt: message.created_at,
    user: mapProfile(message.user),
  };

  return NextResponse.json(mapped, { status: 201 });
}
