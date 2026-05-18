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
  { params }: { params: Promise<{ teamId: string; taskId: string }> }
) {
  const { taskId } = await params;
  const updates = await req.json();

  const dbUpdates: any = {};
  if (updates.status) dbUpdates.status = updates.status;
  if (updates.title) dbUpdates.title = updates.title;
  if (updates.priority) dbUpdates.priority = updates.priority;
  if (updates.assigneeId !== undefined) dbUpdates.assignee_id = updates.assigneeId;

  const supabase = await createServerSupabaseClient();
  const { data: rawUpdated, error } = await supabase
    .from("tasks")
    .update(dbUpdates)
    .eq("id", taskId)
    .select(`
      id, team_id, title, description, status, priority, assignee_id, created_by, created_at,
      assignee:profiles!tasks_assignee_id_fkey(*)
    `)
    .single();

  const updated = rawUpdated as any;

  if (error || !updated) return NextResponse.json({ error: "Task not found or update failed" }, { status: 404 });

  const mapped = {
    id: updated.id,
    teamId: updated.team_id,
    title: updated.title,
    description: updated.description,
    status: updated.status,
    priority: updated.priority,
    assigneeId: updated.assignee_id,
    createdBy: updated.created_by,
    createdAt: updated.created_at,
    mood: "🧠 thinking", // Mocked mood
    assignee: mapProfile(updated.assignee),
  };

  return NextResponse.json(mapped);
}
