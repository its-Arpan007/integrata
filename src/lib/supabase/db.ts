import { createBrowserClient } from "@supabase/ssr";
import type { User, BuilderDnaTag, FunPrompt } from "@/types";

function getSupabase() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// ==========================================
// PROFILE OPERATIONS
// ==========================================

/** Fetch a profile by user ID */
export async function getProfile(userId: string): Promise<User | null> {
  const { data, error } = await getSupabase()
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error || !data) return null;
  return mapProfileToUser(data);
}

/** Fetch a profile by username */
export async function getProfileByUsername(username: string): Promise<User | null> {
  const { data, error } = await getSupabase()
    .from("profiles")
    .select("*")
    .eq("username", username)
    .single();

  if (error || !data) return null;
  return mapProfileToUser(data);
}

/** Fetch all profiles for discovery (excludes current user) */
export async function getDiscoverProfiles(currentUserId: string, limit = 20): Promise<User[]> {
  const { data, error } = await getSupabase()
    .from("profiles")
    .select("*")
    .neq("id", currentUserId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data) return [];
  return data.map(mapProfileToUser);
}

/** Update the current user's profile */
export async function updateProfile(
  userId: string,
  updates: {
    name?: string;
    username?: string;
    bio?: string;
    location?: string;
    company?: string;
    college?: string;
    github?: string;
    portfolio?: string;
    skills?: string[];
    builder_dna?: BuilderDnaTag[];
    fun_prompts?: FunPrompt[];
    ai_summary?: string;
    availability?: string;
    interests?: string[];
  }
) {
  const { data, error } = await getSupabase()
    .from("profiles")
    .update(updates)
    .eq("id", userId)
    .select()
    .single();

  if (error) throw error;
  return data ? mapProfileToUser(data) : null;
}

// ==========================================
// PING OPERATIONS
// ==========================================

/** Send a ping to another user */
export async function sendPing(fromUserId: string, toUserId: string, message: string, aiSuggested = false) {
  const { data, error } = await getSupabase()
    .from("pings")
    .insert({
      from_user_id: fromUserId,
      to_user_id: toUserId,
      message,
      ai_suggested: aiSuggested,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/** Get pings received by a user */
export async function getReceivedPings(userId: string) {
  const { data, error } = await getSupabase()
    .from("pings")
    .select(`
      *,
      from_user:profiles!pings_from_user_id_fkey(*)
    `)
    .eq("to_user_id", userId)
    .order("created_at", { ascending: false });

  if (error) return [];
  return data;
}

/** Get pings sent by a user */
export async function getSentPings(userId: string) {
  const { data, error } = await getSupabase()
    .from("pings")
    .select(`
      *,
      to_user:profiles!pings_to_user_id_fkey(*)
    `)
    .eq("from_user_id", userId)
    .order("created_at", { ascending: false });

  if (error) return [];
  return data;
}

/** Update ping status (accept/ignore) */
export async function updatePingStatus(pingId: string, status: "accepted" | "ignored") {
  const { error } = await getSupabase()
    .from("pings")
    .update({ status })
    .eq("id", pingId);

  if (error) throw error;
}

// ==========================================
// TEAM OPERATIONS
// ==========================================

/** Create a new team */
export async function createTeam(name: string, description: string, createdBy: string) {
  const { data: team, error: teamError } = await getSupabase()
    .from("teams")
    .insert({ name, description, created_by: createdBy })
    .select()
    .single();

  if (teamError || !team) throw teamError;

  // Add creator as first member
  await getSupabase().from("team_members").insert({
    team_id: team.id,
    user_id: createdBy,
    role: "Owner",
  });

  return team;
}

/** Get teams for a user */
export async function getUserTeams(userId: string) {
  const { data, error } = await getSupabase()
    .from("team_members")
    .select(`
      *,
      team:teams(*)
    `)
    .eq("user_id", userId);

  if (error) return [];
  return data;
}

/** Get full team details with members */
export async function getTeamDetails(teamId: string) {
  const supabase = getSupabase();

  const { data: team, error: teamError } = await supabase
    .from("teams")
    .select("*")
    .eq("id", teamId)
    .single();

  if (teamError || !team) return null;

  const { data: members } = await supabase
    .from("team_members")
    .select(`
      *,
      user:profiles(*)
    `)
    .eq("team_id", teamId);

  const { data: tasks } = await supabase
    .from("tasks")
    .select(`
      *,
      assignee:profiles(*)
    `)
    .eq("team_id", teamId)
    .order("created_at", { ascending: false });

  return { ...team, members: members || [], tasks: tasks || [] };
}

// ==========================================
// TASK OPERATIONS
// ==========================================

/** Create a task */
export async function createTask(
  teamId: string,
  title: string,
  createdBy: string,
  options?: { description?: string; priority?: string; assigneeId?: string }
) {
  const { data, error } = await getSupabase()
    .from("tasks")
    .insert({
      team_id: teamId,
      title,
      created_by: createdBy,
      description: options?.description || "",
      priority: options?.priority || "medium",
      assignee_id: options?.assigneeId,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/** Update task status */
export async function updateTaskStatus(taskId: string, status: string) {
  const { error } = await getSupabase()
    .from("tasks")
    .update({ status })
    .eq("id", taskId);

  if (error) throw error;
}

// ==========================================
// MESSAGE OPERATIONS
// ==========================================

/** Send a message in a team */
export async function sendMessage(teamId: string, userId: string, content: string, type = "text") {
  const { data, error } = await getSupabase()
    .from("messages")
    .insert({
      team_id: teamId,
      user_id: userId,
      content,
      type,
    })
    .select(`
      *,
      user:profiles(*)
    `)
    .single();

  if (error) throw error;
  return data;
}

/** Get messages for a team */
export async function getTeamMessages(teamId: string, limit = 50) {
  const { data, error } = await getSupabase()
    .from("messages")
    .select(`
      *,
      user:profiles(*)
    `)
    .eq("team_id", teamId)
    .order("created_at", { ascending: true })
    .limit(limit);

  if (error) return [];
  return data;
}

/** Subscribe to realtime messages */
export function subscribeToMessages(teamId: string, onMessage: (msg: Record<string, unknown>) => void) {
  return getSupabase()
    .channel(`messages:${teamId}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "messages",
        filter: `team_id=eq.${teamId}`,
      },
      (payload) => onMessage(payload.new as Record<string, unknown>)
    )
    .subscribe();
}

/** Subscribe to realtime pings */
export function subscribeToPings(userId: string, onPing: (ping: Record<string, unknown>) => void) {
  return getSupabase()
    .channel(`pings:${userId}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "pings",
        filter: `to_user_id=eq.${userId}`,
      },
      (payload) => onPing(payload.new as Record<string, unknown>)
    )
    .subscribe();
}

// ==========================================
// COMPATIBILITY OPERATIONS
// ==========================================

/** Save compatibility result to cache */
export async function saveCompatibility(
  user1Id: string,
  user2Id: string,
  result: { overallScore: number; dimensions: unknown[]; strengths: string[]; challenges: string[]; suggestedRoles: unknown[]; aiInsight: string }
) {
  const { error } = await getSupabase()
    .from("compatibility_cache")
    .upsert({
      user1_id: user1Id,
      user2_id: user2Id,
      overall_score: result.overallScore,
      dimensions: result.dimensions as unknown as Record<string, unknown>,
      strengths: result.strengths as unknown as Record<string, unknown>,
      challenges: result.challenges as unknown as Record<string, unknown>,
      suggested_roles: result.suggestedRoles as unknown as Record<string, unknown>,
      ai_insight: result.aiInsight,
    });

  if (error) throw error;
}

/** Get cached compatibility */
export async function getCachedCompatibility(user1Id: string, user2Id: string) {
  const { data } = await getSupabase()
    .from("compatibility_cache")
    .select("*")
    .or(`and(user1_id.eq.${user1Id},user2_id.eq.${user2Id}),and(user1_id.eq.${user2Id},user2_id.eq.${user1Id})`)
    .single();

  return data;
}

// ==========================================
// HELPERS
// ==========================================

/* eslint-disable @typescript-eslint/no-explicit-any */
function mapProfileToUser(profile: any): User {
  return {
    id: profile.id,
    username: profile.username,
    name: profile.name,
    email: profile.email,
    avatar: profile.avatar,
    bio: profile.bio || "",
    college: profile.college,
    company: profile.company,
    location: profile.location || "",
    github: profile.github,
    portfolio: profile.portfolio,
    skills: profile.skills || [],
    builderDna: profile.builder_dna || [],
    funPrompts: profile.fun_prompts || [],
    aiSummary: profile.ai_summary || "",
    availability: profile.availability || "Open",
    interests: profile.interests || [],
    createdAt: profile.created_at,
    online: profile.online,
  };
}
