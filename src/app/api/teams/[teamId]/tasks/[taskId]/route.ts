import { NextRequest, NextResponse } from "next/server";
import { seedIfNeeded, readCollection, updateOne } from "@/lib/seed";
import type { StoredTask, StoredUser } from "@/lib/seed";

/**
 * PATCH /api/teams/[teamId]/tasks/[taskId]
 * Body: { status?, title?, priority?, assigneeId? }
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ teamId: string; taskId: string }> }
) {
  seedIfNeeded();
  const { taskId } = await params;
  const updates = await req.json();

  const updated = updateOne<StoredTask>("tasks", taskId, updates);
  if (!updated) return NextResponse.json({ error: "Task not found" }, { status: 404 });

  const users = readCollection<StoredUser>("users");
  const strip = ({ password: _pw, ...u }: StoredUser) => u;
  const assignee = updated.assigneeId ? users.find((u) => u.id === updated.assigneeId) : null;
  return NextResponse.json({ ...updated, assignee: assignee ? strip(assignee) : null });
}
