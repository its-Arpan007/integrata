import { NextRequest, NextResponse } from "next/server";
import { seedIfNeeded, readCollection, insertOne } from "@/lib/seed";
import type { StoredMessage, StoredUser } from "@/lib/seed";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ teamId: string }> }
) {
  seedIfNeeded();
  const { teamId } = await params;
  const users = readCollection<StoredUser>("users");
  const strip = ({ password: _pw, ...u }: StoredUser) => u;

  const messages = readCollection<StoredMessage>("messages")
    .filter((m) => m.teamId === teamId)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    .slice(-50)
    .map((m) => {
      const user = users.find((u) => u.id === m.userId);
      return { ...m, user: user ? strip(user) : null };
    });

  return NextResponse.json(messages);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ teamId: string }> }
) {
  seedIfNeeded();
  const { teamId } = await params;
  const { userId, content, type = "text" } = await req.json();

  if (!userId || !content) {
    return NextResponse.json({ error: "userId and content required" }, { status: 400 });
  }

  const message: StoredMessage = {
    id: `msg_${Date.now()}`,
    teamId,
    userId,
    content,
    type,
    createdAt: new Date().toISOString(),
  };

  insertOne("messages", message);

  const users = readCollection<StoredUser>("users");
  const strip = ({ password: _pw, ...u }: StoredUser) => u;
  const user = users.find((u) => u.id === userId);
  return NextResponse.json({ ...message, user: user ? strip(user) : null }, { status: 201 });
}
