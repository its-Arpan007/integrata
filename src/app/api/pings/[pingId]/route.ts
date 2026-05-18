import { NextRequest, NextResponse } from "next/server";
import { seedIfNeeded, readCollection, updateOne } from "@/lib/seed";
import type { StoredPing, StoredUser } from "@/lib/seed";

/**
 * PATCH /api/pings/[pingId]
 * Body: { status: "accepted" | "ignored" }
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ pingId: string }> }
) {
  seedIfNeeded();
  const { pingId } = await params;
  const { status } = await req.json();

  if (!["accepted", "ignored", "pending"].includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const updated = updateOne<StoredPing>("pings", pingId, { status });
  if (!updated) return NextResponse.json({ error: "Ping not found" }, { status: 404 });

  const users = readCollection<StoredUser>("users");
  const strip = ({ password: _pw, ...u }: StoredUser) => u;
  const fromUser = users.find((u) => u.id === updated.fromUserId);
  const toUser = users.find((u) => u.id === updated.toUserId);

  return NextResponse.json({
    ...updated,
    fromUser: fromUser ? strip(fromUser) : null,
    toUser: toUser ? strip(toUser) : null,
  });
}
