"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Check, X, Eye, Zap, Inbox, Send, Clock, MessageCircle, Sparkles, Search, UserPlus, Bell } from "lucide-react";
import { Navbar } from "@/components/shared/navbar";
import { GlassCard } from "@/components/shared/glass-card";
import { GlowButton } from "@/components/shared/glow-button";
import { FloatingElements } from "@/components/shared/floating-elements";
import { ChatModal } from "@/components/shared/chat-modal";
import { AmbientMotion } from "@/components/shared/ambient-motion";
import { LiveActivityFeed } from "@/components/shared/live-activity-feed";
import { useAuth } from "@/providers/auth-provider";
import { cn } from "@/lib/utils";
import type { Ping, User } from "@/types";

// ── API helpers ────────────────────────────────────────────────────────────────

async function apiFetch<T>(url: string, opts?: RequestInit): Promise<T> {
  const res = await fetch(url, opts);
  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<T>;
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(diff / 3600000);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(diff / 86400000)}d ago`;
}

/** Shape returned by the API (fromUser/toUser as full User objects) */
interface ApiPing {
  id: string;
  fromUserId: string;
  toUserId: string;
  message: string;
  aiSuggested: boolean;
  status: "pending" | "accepted" | "ignored";
  createdAt: string;
  fromUser: User | null;
  toUser: User | null;
}

function apiPingToPing(p: ApiPing): Ping | null {
  if (!p.fromUser || !p.toUser) return null;
  return {
    id: p.id,
    fromUser: p.fromUser,
    toUser: p.toUser,
    message: p.message,
    aiSuggested: p.aiSuggested,
    status: p.status,
    createdAt: p.createdAt,
  };
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function PingsPage() {
  const { user: currentUser } = useAuth();
  const [tab, setTab] = useState<"inbox" | "sent" | "accepted">("inbox");
  const [pings, setPings] = useState<Ping[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [chatUser, setChatUser] = useState<User | null>(null);
  const [celebratingPing, setCelebratingPing] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [showCompose, setShowCompose] = useState(false);
  const [composeTarget, setComposeTarget] = useState<User | null>(null);
  const [composeMessage, setComposeMessage] = useState("");
  const [composeSending, setComposeSending] = useState(false);

  // Resolve the current user's canonical ID from the users list
  const resolvedId = allUsers.find((u) => u.email === currentUser?.email)?.id ?? currentUser?.id ?? "";

  const fetchData = useCallback(async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const [usersData, pingsRaw] = await Promise.all([
        apiFetch<User[]>("/api/users"),
        resolvedId
          ? apiFetch<ApiPing[]>(`/api/pings?userId=${resolvedId}`)
          : Promise.resolve([] as ApiPing[]),
      ]);
      setAllUsers(usersData);
      setPings(pingsRaw.map(apiPingToPing).filter(Boolean) as Ping[]);
    } catch (e) {
      console.error("Failed to load pings:", e);
    } finally {
      setLoading(false);
    }
  }, [currentUser, resolvedId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // ── Derived lists ────────────────────────────────────────────────────────────

  const inboxPings = pings.filter((p) => p.toUser.id === resolvedId && p.status !== "ignored");
  const sentPings = pings.filter((p) => p.fromUser.id === resolvedId);
  const acceptedPings = pings.filter((p) => p.status === "accepted" && (p.fromUser.id === resolvedId || p.toUser.id === resolvedId));
  const pendingCount = inboxPings.filter((p) => p.status === "pending").length;

  const filteredPings = (tab === "inbox" ? inboxPings : tab === "sent" ? sentPings : acceptedPings)
    .filter((p) => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      const other = tab === "inbox" ? p.fromUser : p.toUser;
      return other.name.toLowerCase().includes(q) || p.message.toLowerCase().includes(q);
    });

  const availableTargets = allUsers.filter(
    (u) =>
      u.id !== resolvedId &&
      !pings.some((p) => p.fromUser.id === resolvedId && p.toUser.id === u.id)
  );

  // ── Actions ──────────────────────────────────────────────────────────────────

  const handleAccept = async (pingId: string, fromUser: User) => {
    setCelebratingPing(pingId);
    try {
      await apiFetch(`/api/pings/${pingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "accepted" }),
      });
      setPings((prev) => prev.map((p) => p.id === pingId ? { ...p, status: "accepted" as const } : p));
      setTimeout(() => { setCelebratingPing(null); setChatUser(fromUser); }, 800);
    } catch {
      setCelebratingPing(null);
    }
  };

  const handleIgnore = async (id: string) => {
    try {
      await apiFetch(`/api/pings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "ignored" }),
      });
      setPings((prev) => prev.map((p) => p.id === id ? { ...p, status: "ignored" as const } : p));
    } catch { /* silent */ }
  };

  const handleCompose = async () => {
    if (!composeTarget || !composeMessage.trim() || !resolvedId) return;
    setComposeSending(true);
    try {
      const newPingRaw = await apiFetch<ApiPing>("/api/pings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fromUserId: resolvedId, toUserId: composeTarget.id, message: composeMessage, aiSuggested: false }),
      });
      const newPing = apiPingToPing(newPingRaw);
      if (newPing) setPings((prev) => [newPing, ...prev]);
      setComposeMessage("");
      setComposeTarget(null);
      setShowCompose(false);
      setTab("sent");
    } catch { /* silent */ } finally {
      setComposeSending(false);
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="relative min-h-screen animated-gradient-bg">
      <AmbientMotion />
      <LiveActivityFeed />
      <FloatingElements count={3} />
      <Navbar isApp />

      <main className="relative z-10 pt-20 px-4 pb-12 max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-start justify-between mb-2">
          <div>
            <h1 className="text-3xl font-bold mb-1">Pings</h1>
            <p className="text-text-secondary text-sm">Manage your collaboration requests</p>
          </div>
          <GlowButton size="sm" icon={<UserPlus className="w-4 h-4" />} onClick={() => setShowCompose(true)}>New Ping</GlowButton>
        </motion.div>

        {/* Stats strip */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 }} className="flex items-center gap-4 mb-6 text-xs text-text-muted">
          <div className="flex items-center gap-1.5"><Inbox className="w-3.5 h-3.5 text-accent-purple" /> {pendingCount} pending</div>
          <div className="w-1 h-1 rounded-full bg-glass-border" />
          <div className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-accent-emerald" /> {acceptedPings.length} connected</div>
          <div className="w-1 h-1 rounded-full bg-glass-border" />
          <div className="flex items-center gap-1.5"><Send className="w-3.5 h-3.5 text-accent-cyan" /> {sentPings.length} sent</div>
        </motion.div>

        {/* Tabs + Search */}
        <div className="flex items-center justify-between mb-6 gap-2">
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
            {[
              { key: "inbox" as const, label: "Inbox", icon: Inbox, count: pendingCount },
              { key: "sent" as const, label: "Sent", icon: Send, count: sentPings.length },
              { key: "accepted" as const, label: "Connected", icon: Zap, count: acceptedPings.length },
            ].map((t) => (
              <button key={t.key} onClick={() => setTab(t.key)} className={cn("flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all whitespace-nowrap", tab === t.key ? "bg-accent-purple/15 text-accent-purple" : "text-text-secondary hover:bg-white/5")}>
                <t.icon className="w-3.5 h-3.5" />
                {t.label}
                {t.count > 0 && <span className={cn("w-4 h-4 rounded-full text-[9px] flex items-center justify-center font-bold", tab === t.key ? "bg-accent-purple text-white" : "bg-white/10 text-text-muted")}>{t.count}</span>}
              </button>
            ))}
          </div>
          <button onClick={() => setShowSearch(!showSearch)} className={cn("p-2 rounded-xl transition-colors shrink-0", showSearch ? "bg-accent-purple/15 text-accent-purple" : "text-text-muted hover:text-text-primary hover:bg-white/5")}>
            <Search className="w-4 h-4" />
          </button>
        </div>

        {/* Search bar */}
        <AnimatePresence>
          {showSearch && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mb-4">
              <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search pings by name or message..." autoFocus className="w-full px-4 py-3 rounded-xl bg-white/5 border border-glass-border text-text-primary placeholder-text-muted text-sm focus:outline-none focus:border-accent-purple/50 transition-all" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pings list */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-6 h-6 border-2 border-accent-purple border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-3">
              {filteredPings.length === 0 && (
                <div className="text-center py-16">
                  <Bell className="w-10 h-10 text-text-muted mx-auto mb-3 opacity-40" />
                  <p className="text-sm text-text-muted">{searchQuery ? "No pings match your search" : tab === "inbox" ? "No incoming pings yet" : tab === "sent" ? "You haven't sent any pings yet" : "No connections yet"}</p>
                </div>
              )}
              {filteredPings.map((ping, i) => {
                const otherUser = tab === "inbox" ? ping.fromUser : ping.toUser;
                return (
                  <motion.div key={ping.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                    <GlassCard hover={false} className={cn("p-5 relative overflow-hidden", celebratingPing === ping.id && "border-accent-emerald/50 shadow-[0_0_20px_rgba(16,185,129,0.2)]")}>
                      {celebratingPing === ping.id && (
                        <motion.div initial={{ scale: 0.5, opacity: 1 }} animate={{ scale: 4, opacity: 0 }} transition={{ duration: 0.8 }} className="absolute inset-0 bg-accent-emerald/20 blur-xl pointer-events-none" />
                      )}
                      <div className="flex items-start gap-4 relative z-10">
                        <Link href={`/compatibility/${otherUser.id}`} className="relative shrink-0 group">
                          <img src={otherUser.avatar} alt="" className="w-12 h-12 rounded-xl bg-bg-tertiary group-hover:ring-2 ring-accent-purple/50 transition-all" />
                          {otherUser.online && <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-accent-emerald border-2 border-bg-primary" />}
                        </Link>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <Link href={`/compatibility/${otherUser.id}`} className="font-semibold text-sm hover:text-accent-purple transition-colors">{otherUser.name}</Link>
                            {otherUser.builderArchetype && <span className="px-1.5 py-0.5 rounded text-[9px] bg-accent-cyan/10 text-accent-cyan font-bold">{otherUser.builderArchetype}</span>}
                            {ping.aiSuggested && <span className="px-1.5 py-0.5 rounded-full bg-accent-purple/10 text-accent-purple text-[10px] font-bold flex items-center gap-1"><Sparkles className="w-2.5 h-2.5" />AI Match</span>}
                            <span className="text-[10px] text-text-muted flex items-center gap-1 ml-auto"><Clock className="w-3 h-3" />{timeAgo(ping.createdAt)}</span>
                          </div>

                          {otherUser.builderMood && (
                            <div className="flex items-center gap-1.5 mb-2 text-[10px] text-text-muted">
                              <span className="w-1.5 h-1.5 rounded-full bg-accent-pink animate-pulse" />
                              {otherUser.builderMood}
                              {otherUser.codingSoundtrack && <span className="ml-2 px-1.5 py-0.5 rounded bg-white/5 text-text-muted">🎧 {otherUser.codingSoundtrack}</span>}
                            </div>
                          )}

                          <p className="text-sm text-text-secondary leading-relaxed">{ping.message}</p>

                          {otherUser.skills && otherUser.skills.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {otherUser.skills.slice(0, 4).map((s) => (
                                <span key={s} className="px-1.5 py-0.5 rounded text-[9px] bg-white/5 text-text-muted border border-white/5">{s}</span>
                              ))}
                              {otherUser.skills.length > 4 && <span className="px-1.5 py-0.5 rounded text-[9px] text-text-muted">+{otherUser.skills.length - 4}</span>}
                            </div>
                          )}

                          {tab === "inbox" && ping.status === "pending" && (
                            <div className="flex items-center gap-2 mt-3">
                              <GlowButton size="sm" onClick={() => handleAccept(ping.id, ping.fromUser)} icon={<Check className="w-3.5 h-3.5" />}>Accept</GlowButton>
                              <GlowButton variant="ghost" size="sm" onClick={() => handleIgnore(ping.id)} icon={<X className="w-3.5 h-3.5" />}>Ignore</GlowButton>
                              <Link href={`/compatibility/${otherUser.id}`}>
                                <GlowButton variant="ghost" size="sm" icon={<Eye className="w-3.5 h-3.5" />}>View</GlowButton>
                              </Link>
                            </div>
                          )}

                          {ping.status !== "pending" && (
                            <div className="flex items-center gap-3 mt-3">
                              <div className={cn("inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium", ping.status === "accepted" ? "bg-accent-emerald/10 text-accent-emerald" : "bg-white/5 text-text-muted")}>
                                {ping.status === "accepted" ? <><Check className="w-3 h-3" />Connected</> : "Ignored"}
                              </div>
                              {ping.status === "accepted" && (
                                <button onClick={() => setChatUser(otherUser)} className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-purple/10 text-accent-purple hover:bg-accent-purple/20 transition-colors text-xs font-medium">
                                  <MessageCircle className="w-3.5 h-3.5" /> Chat
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </GlassCard>
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        )}
      </main>

      {/* Compose Ping Modal */}
      <AnimatePresence>
        {showCompose && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowCompose(false)} className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="fixed z-50 inset-0 flex items-center justify-center px-4">
              <div className="glass-static rounded-3xl p-8 w-full max-w-md border border-glass-border shadow-2xl relative">
                <button onClick={() => setShowCompose(false)} className="absolute top-4 right-4 p-2 text-text-muted hover:text-text-primary rounded-lg hover:bg-white/5 transition-colors">
                  <X className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-purple to-accent-cyan flex items-center justify-center">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Send a Ping</h2>
                    <p className="text-xs text-text-muted">Reach out to a builder</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-text-secondary mb-2">Select Builder</label>
                    <div className="space-y-1.5 max-h-40 overflow-y-auto no-scrollbar">
                      {availableTargets.map((u) => (
                        <button key={u.id} onClick={() => setComposeTarget(u)} className={cn("w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all", composeTarget?.id === u.id ? "bg-accent-purple/15 border border-accent-purple/30" : "hover:bg-white/5 border border-transparent")}>
                          <img src={u.avatar} alt="" className="w-8 h-8 rounded-full bg-bg-tertiary" />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium truncate">{u.name}</div>
                            <div className="text-[10px] text-text-muted truncate">{u.builderArchetype || (u.skills ?? []).slice(0, 2).join(", ")}</div>
                          </div>
                          {u.online && <div className="w-2 h-2 rounded-full bg-accent-emerald" />}
                        </button>
                      ))}
                      {availableTargets.length === 0 && <p className="text-xs text-text-muted text-center py-4">You&apos;ve pinged everyone!</p>}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-text-secondary mb-1.5">Message</label>
                    <textarea value={composeMessage} onChange={(e) => setComposeMessage(e.target.value)} placeholder="Hey! I noticed we both..." rows={3} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-glass-border text-text-primary placeholder-text-muted text-sm focus:outline-none focus:border-accent-purple/50 transition-all resize-none" />
                  </div>
                  {composeTarget && composeMessage.length === 0 && (
                    <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => setComposeMessage(`Hey ${composeTarget.name}! I noticed we both love ${(composeTarget.skills ?? [])[0] || "building"}. Want to hack on something together?`)} className="w-full p-3 rounded-xl bg-accent-cyan/10 border border-accent-cyan/20 text-left hover:bg-accent-cyan/15 transition-colors">
                      <div className="flex items-center gap-1.5 mb-1"><Sparkles className="w-3 h-3 text-accent-cyan" /><span className="text-[9px] font-bold text-accent-cyan uppercase tracking-widest">AI Icebreaker</span></div>
                      <p className="text-xs text-text-primary italic">Tap to use a suggested intro</p>
                    </motion.button>
                  )}
                  <GlowButton fullWidth onClick={handleCompose} disabled={!composeTarget || !composeMessage.trim() || composeSending} icon={composeSending ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Send className="w-4 h-4" />}>
                    {composeSending ? "Sending..." : "Send Ping"}
                  </GlowButton>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <ChatModal user={chatUser} onClose={() => setChatUser(null)} />
    </div>
  );
}
