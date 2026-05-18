import { NextRequest, NextResponse } from "next/server";
import { seedIfNeeded, readCollection, insertOne } from "@/lib/seed";
import type { StoredTeam, StoredTeamMember, StoredUser } from "@/lib/seed";

/** Build a team response with its members */
function buildTeamResponse(team: StoredTeam, members: StoredTeamMember[], users: StoredUser[]) {
  const strip = ({ password: _pw, ...u }: StoredUser) => u;
  const teamMembers = members
    .filter((m) => m.teamId === team.id)
    .map((m) => {
      const user = users.find((u) => u.id === m.userId);
      return { ...m, user: user ? strip(user) : null };
    });
  return { ...team, members: teamMembers };
}

/**
 * GET /api/teams?userId=<id>
 * Returns teams the user belongs to.
 */
export async function GET(req: NextRequest) {
  seedIfNeeded();
  const userId = req.nextUrl.searchParams.get("userId");

  const members = readCollection<StoredTeamMember>("team_members");
  const teams = readCollection<StoredTeam>("teams");
  const users = readCollection<StoredUser>("users");

  let filteredTeams = teams;
  if (userId) {
    const userTeamIds = new Set(members.filter((m) => m.userId === userId).map((m) => m.teamId));
    filteredTeams = teams.filter((t) => userTeamIds.has(t.id));
  }

  return NextResponse.json(filteredTeams.map((t) => buildTeamResponse(t, members, users)));
}

/**
 * POST /api/teams
 * Body: { name, description, createdBy }
 */
export async function POST(req: NextRequest) {
  seedIfNeeded();
  const { name, description = "", createdBy } = await req.json();
  if (!name || !createdBy) {
    return NextResponse.json({ error: "name and createdBy required" }, { status: 400 });
  }

  const team: StoredTeam = {
    id: `team_${Date.now()}`,
    name,
    description,
    project: "TBD",
    status: "planning",
    energy: "Fresh Start",
    lastActive: "just now",
    createdBy,
    createdAt: new Date().toISOString(),
  };

  insertOne("teams", team);

  // Add creator as first member
  const member: StoredTeamMember = {
    id: `tm_${Date.now()}`,
    teamId: team.id,
    userId: createdBy,
    role: "Owner",
    joinedAt: new Date().toISOString(),
  };
  insertOne("team_members", member);

  const users = readCollection<StoredUser>("users");
  const allMembers = readCollection<StoredTeamMember>("team_members");
  return NextResponse.json(buildTeamResponse(team, allMembers, users), { status: 201 });
}
