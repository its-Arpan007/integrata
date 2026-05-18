import { NextResponse } from "next/server";
import { seedIfNeeded, readCollection } from "@/lib/seed";
import type { StoredUser } from "@/lib/seed";

export async function GET() {
  seedIfNeeded();
  const users = readCollection<StoredUser>("users").map(({ password: _pw, ...u }) => u);
  return NextResponse.json(users);
}
