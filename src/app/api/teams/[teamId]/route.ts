import { NextRequest, NextResponse } from "next/server";
import { seedIfNeeded, readCollection } from "@/lib/seed";
import type { StoredTeam, StoredTeamMember, StoredTask, StoredMessage, StoredUser } from "@/lib/seed";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ teamId: string }> }
) {
  seedIfNeeded();
  const { teamId } = await params;

  const teams = readCollection<StoredTeam>("teams");
  const team = teams.find((t) => t.id === teamId);
  if (!team) return NextResponse.json({ error: "Team not found" }, { status: 404 });

  const users = readCollection<StoredUser>("users");
  const strip = ({ password: _pw, ...u }: StoredUser) => u;

  const rawMembers = readCollection<StoredTeamMember>("team_members").filter((m) => m.teamId === teamId);
  const members = rawMembers.map((m) => {
    const user = users.find((u) => u.id === m.userId);
    return { ...m, user: user ? strip(user) : null };
  });

  const tasks = readCollection<StoredTask>("tasks")
    .filter((t) => t.teamId === teamId)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    .map((t) => {
      const assignee = t.assigneeId ? users.find((u) => u.id === t.assigneeId) : null;
      return { ...t, assignee: assignee ? strip(assignee) : null };
    });

  const messages = readCollection<StoredMessage>("messages")
    .filter((m) => m.teamId === teamId)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    .slice(-50)
    .map((m) => {
      const user = users.find((u) => u.id === m.userId);
      return { ...m, user: user ? strip(user) : null };
    });

  return NextResponse.json({ ...team, members, tasks, messages });
}
