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

  const { data: tasks, error } = await supabase
    .from("tasks")
    .select(`
      id, team_id, title, description, status, priority, assignee_id, created_by, created_at,
      assignee:profiles!tasks_assignee_id_fkey(*)
    `)
    .eq("team_id", teamId)
    .order("created_at", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const mapped = (tasks || []).map((t: any) => ({
    id: t.id,
    teamId: t.team_id,
    title: t.title,
    description: t.description,
    status: t.status,
    priority: t.priority,
    assigneeId: t.assignee_id,
    createdBy: t.created_by,
    createdAt: t.created_at,
    mood: "🧠 thinking", // Mocked mood
    assignee: mapProfile(t.assignee),
  }));

  return NextResponse.json(mapped);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ teamId: string }> }
) {
  const { teamId } = await params;
  const { title, assigneeId, priority = "medium", createdBy, mood } = await req.json();

  if (!title || !createdBy) {
    return NextResponse.json({ error: "title and createdBy required" }, { status: 400 });
  }

  const supabase = await createServerSupabaseClient();
  const { data: rawTask, error } = await supabase
    .from("tasks")
    .insert({
      team_id: teamId,
      title,
      description: "",
      status: "todo",
      priority,
      assignee_id: assigneeId,
      created_by: createdBy,
    })
    .select(`
      id, team_id, title, description, status, priority, assignee_id, created_by, created_at,
      assignee:profiles!tasks_assignee_id_fkey(*)
    `)
    .single();

  const task = rawTask as any;

  if (error || !task) return NextResponse.json({ error: error?.message || "Failed to create task" }, { status: 500 });

  const mapped = {
    id: task.id,
    teamId: task.team_id,
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    assigneeId: task.assignee_id,
    createdBy: task.created_by,
    createdAt: task.created_at,
    mood: mood || "🧠 thinking", // Mocked mood
    assignee: mapProfile(task.assignee),
  };

  return NextResponse.json(mapped, { status: 201 });
}
