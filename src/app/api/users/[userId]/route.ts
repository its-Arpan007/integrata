import { NextRequest, NextResponse } from "next/server";
import { seedIfNeeded, readCollection } from "@/lib/seed";
import type { StoredUser } from "@/lib/seed";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  seedIfNeeded();
  const { userId } = await params;
  const user = readCollection<StoredUser>("users").find((u) => u.id === userId);
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
  const { password: _pw, ...safe } = user;
  return NextResponse.json(safe);
}
