import { NextRequest, NextResponse } from "next/server";
import { seedIfNeeded, readCollection, insertOne } from "@/lib/seed";
import type { StoredTask, StoredUser } from "@/lib/seed";

function hydrateTask(task: StoredTask, users: StoredUser[]) {
  const strip = ({ password: _pw, ...u }: StoredUser) => u;
  const assignee = task.assigneeId ? users.find((u) => u.id === task.assigneeId) : null;
  return { ...task, assignee: assignee ? strip(assignee) : null };
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ teamId: string }> }
) {
  seedIfNeeded();
  const { teamId } = await params;
  const tasks = readCollection<StoredTask>("tasks")
    .filter((t) => t.teamId === teamId)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  const users = readCollection<StoredUser>("users");
  return NextResponse.json(tasks.map((t) => hydrateTask(t, users)));
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ teamId: string }> }
) {
  seedIfNeeded();
  const { teamId } = await params;
  const { title, assigneeId, priority = "medium", createdBy, mood } = await req.json();
  if (!title || !createdBy) {
    return NextResponse.json({ error: "title and createdBy required" }, { status: 400 });
  }

  const task: StoredTask = {
    id: `task_${Date.now()}`,
    teamId,
    title,
    description: "",
    status: "todo",
    priority,
    assigneeId,
    createdBy,
    mood: mood || "🧠 thinking about it",
    createdAt: new Date().toISOString(),
  };

  insertOne("tasks", task);
  const users = readCollection<StoredUser>("users");
  return NextResponse.json(hydrateTask(task, users), { status: 201 });
}
