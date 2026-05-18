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

  // Fetch team and members
  const { data: rawTeam, error: teamError } = await supabase
    .from("teams")
    .select(`
      id, name, description, project, status, created_at, created_by,
      members:team_members(id, team_id, user_id, role, joined_at, user:profiles(*))
    `)
    .eq("id", teamId)
    .single();

  const team = rawTeam as any;

  if (teamError || !team) return NextResponse.json({ error: "Team not found" }, { status: 404 });

  // Fetch tasks
  const { data: tasks } = await supabase
    .from("tasks")
    .select(`
      id, team_id, title, description, status, priority, assignee_id, created_by, created_at,
      assignee:profiles!tasks_assignee_id_fkey(*)
    `)
    .eq("team_id", teamId)
    .order("created_at", { ascending: true });

  // Fetch messages
  const { data: messages } = await supabase
    .from("messages")
    .select(`
      id, team_id, user_id, content, type, created_at,
      user:profiles(*)
    `)
    .eq("team_id", teamId)
    .order("created_at", { ascending: true })
    .limit(50);

  const mappedTeam = {
    id: team.id,
    name: team.name,
    description: team.description,
    project: team.project,
    status: team.status,
    energy: "Active",
    lastActive: "just now",
    createdBy: team.created_by,
    createdAt: team.created_at,
    members: (team.members || []).map((m: any) => ({
      id: m.id,
      teamId: m.team_id,
      userId: m.user_id,
      role: m.role,
      joinedAt: m.joined_at,
      user: mapProfile(m.user),
    })),
    tasks: (tasks || []).map((t: any) => ({
      id: t.id,
      teamId: t.team_id,
      title: t.title,
      description: t.description,
      status: t.status,
      priority: t.priority,
      assigneeId: t.assignee_id,
      createdBy: t.created_by,
      createdAt: t.created_at,
      mood: "🧠 thinking", // Mocked mood for now
      assignee: mapProfile(t.assignee),
    })),
    messages: (messages || []).map((m: any) => ({
      id: m.id,
      teamId: m.team_id,
      userId: m.user_id,
      content: m.content,
      type: m.type,
      createdAt: m.created_at,
      user: mapProfile(m.user),
    })),
  };

  return NextResponse.json(mappedTeam);
}
