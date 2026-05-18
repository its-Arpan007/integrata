import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createServerSupabaseClient();
  const { data: users, error } = await supabase.from("profiles").select("*");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Map to frontend User type if needed
  const mapped = (users || []).map((u: any) => ({
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
  }));

  return NextResponse.json(mapped);
}
