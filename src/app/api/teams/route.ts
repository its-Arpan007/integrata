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

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  const supabase = await createServerSupabaseClient();

  let query = supabase.from("teams").select(`
    id, name, description, project, status, created_at, created_by,
    members:team_members(id, team_id, user_id, role, joined_at, user:profiles(*))
  `);

  if (userId) {
    // To filter teams by membership, we must query team_members first
    const { data: userMemberships } = await supabase
      .from("team_members")
      .select("team_id")
      .eq("user_id", userId);
      
    if (!userMemberships || userMemberships.length === 0) {
      return NextResponse.json([]);
    }
    
    const teamIds = userMemberships.map(m => m.team_id);
    query = query.in("id", teamIds);
  }

  const { data: teams, error } = await query;
  
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const mapped = (teams || []).map((t: any) => ({
    id: t.id,
    name: t.name,
    description: t.description,
    project: t.project,
    status: t.status,
    energy: "Active", // Not in schema, mocked
    lastActive: "just now", // Not in schema, mocked
    createdBy: t.created_by,
    createdAt: t.created_at,
    members: (t.members || []).map((m: any) => ({
      id: m.id,
      teamId: m.team_id,
      userId: m.user_id,
      role: m.role,
      joinedAt: m.joined_at,
      user: mapProfile(m.user),
    })),
  }));

  return NextResponse.json(mapped);
}

export async function POST(req: NextRequest) {
  const { name, description = "", createdBy } = await req.json();
  if (!name || !createdBy) {
    return NextResponse.json({ error: "name and createdBy required" }, { status: 400 });
  }

  const supabase = await createServerSupabaseClient();
  
  // 1. Create team
  const { data: rawTeam, error: teamError } = await supabase
    .from("teams")
    .insert({
      name,
      description,
      project: "TBD",
      status: "planning",
      created_by: createdBy,
    })
    .select()
    .single();

  const team = rawTeam as any;

  if (teamError || !team) return NextResponse.json({ error: teamError?.message || "Failed to create team" }, { status: 500 });

  // 2. Add creator as member
  const { data: rawMember, error: memberError } = await supabase
    .from("team_members")
    .insert({
      team_id: team.id,
      user_id: createdBy,
      role: "Owner",
    })
    .select(`id, team_id, user_id, role, joined_at, user:profiles(*)`)
    .single();

  const member = rawMember as any;

  if (memberError) return NextResponse.json({ error: memberError.message }, { status: 500 });

  const mappedTeam = {
    id: team.id,
    name: team.name,
    description: team.description,
    project: team.project,
    status: team.status,
    energy: "Fresh Start",
    lastActive: "just now",
    createdBy: team.created_by,
    createdAt: team.created_at,
    members: [{
      id: member.id,
      teamId: member.team_id,
      userId: member.user_id,
      role: member.role,
      joinedAt: member.joined_at,
      user: mapProfile(member.user),
    }],
  };

  return NextResponse.json(mappedTeam, { status: 201 });
}
