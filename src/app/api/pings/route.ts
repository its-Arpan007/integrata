import { NextRequest, NextResponse } from "next/server";
import { seedIfNeeded, readCollection, insertOne } from "@/lib/seed";
import type { StoredPing, StoredUser } from "@/lib/seed";

/** Hydrate a StoredPing with full user objects */
function hydrate(ping: StoredPing, users: StoredUser[]) {
  const strip = ({ password: _pw, ...u }: StoredUser) => u;
  const fromUser = users.find((u) => u.id === ping.fromUserId);
  const toUser = users.find((u) => u.id === ping.toUserId);
  return {
    ...ping,
    fromUser: fromUser ? strip(fromUser) : null,
    toUser: toUser ? strip(toUser) : null,
  };
}

/**
 * GET /api/pings?userId=<id>
 * Returns all pings involving this user (inbox + sent).
 */
export async function GET(req: NextRequest) {
  seedIfNeeded();
  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });

  const pings = readCollection<StoredPing>("pings").filter(
    (p) => p.fromUserId === userId || p.toUserId === userId
  );
  const users = readCollection<StoredUser>("users");
  return NextResponse.json(pings.map((p) => hydrate(p, users)));
}

/**
 * POST /api/pings
 * Body: { fromUserId, toUserId, message, aiSuggested? }
 */
export async function POST(req: NextRequest) {
  seedIfNeeded();
  const { fromUserId, toUserId, message, aiSuggested = false } = await req.json();
  if (!fromUserId || !toUserId || !message) {
    return NextResponse.json({ error: "fromUserId, toUserId, message required" }, { status: 400 });
  }

  const ping: StoredPing = {
    id: `ping_${Date.now()}`,
    fromUserId,
    toUserId,
    message,
    aiSuggested,
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  insertOne("pings", ping);
  const users = readCollection<StoredUser>("users");
  return NextResponse.json(hydrate(ping, users), { status: 201 });
}
