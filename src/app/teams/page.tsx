"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Plus, Users, ArrowRight, X, Sparkles, Zap, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/shared/navbar";
import { GlassCard } from "@/components/shared/glass-card";
import { GlowButton } from "@/components/shared/glow-button";
import { FloatingElements } from "@/components/shared/floating-elements";
import { AmbientMotion } from "@/components/shared/ambient-motion";
import { useAuth } from "@/providers/auth-provider";
import { cn } from "@/lib/utils";

interface ApiTeamMember {
  id: string;
  userId: string;
  role: string;
  user: { id: string; name: string; avatar: string; online?: boolean } | null;
}

interface ApiTeam {
  id: string;
  name: string;
  description: string;
  project: string;
  status: "active" | "planning";
  energy: string;
  lastActive: string;
  members: ApiTeamMember[];
  createdAt: string;
}

export default function TeamsPage() {
  const router = useRouter();
  const { user: currentUser } = useAuth();
  const [teams, setTeams] = useState<ApiTeam[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [teamDesc, setTeamDesc] = useState("");
  const [creating, setCreating] = useState(false);

  // Resolve canonical user ID from API
  const [resolvedId, setResolvedId] = useState<string>("");

  useEffect(() => {
    if (!currentUser) return;
    // Get canonical ID from /api/users (match by email)
    fetch("/api/users")
      .then((r) => r.json())
      .then((users: { id: string; email: string }[]) => {
        const match = users.find((u) => u.email === currentUser.email);
        const id = match?.id ?? currentUser.id;
        setResolvedId(id);
        return fetch(`/api/teams?userId=${id}`);
      })
      .then((r) => r.json())
      .then((data: ApiTeam[]) => setTeams(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [currentUser]);

  const handleCreate = async () => {
    if (!teamName.trim() || !resolvedId) return;
    setCreating(true);
    try {
      const res = await fetch("/api/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: teamName, description: teamDesc || "A new builder squad", createdBy: resolvedId }),
      });
      if (res.ok) {
        const newTeam: ApiTeam = await res.json();
        setTeams((prev) => [newTeam, ...prev]);
        setTeamName("");
        setTeamDesc("");
        setShowModal(false);
        router.push(`/teams/${newTeam.id}`);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="relative min-h-screen animated-gradient-bg">
      <AmbientMotion />
      <FloatingElements count={3} />
      <Navbar isApp />

      <main className="relative z-10 pt-20 px-4 pb-12 max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-1">Teams</h1>
            <p className="text-text-secondary text-sm">Your collaboration spaces</p>
          </div>
          <GlowButton size="sm" icon={<Plus className="w-4 h-4" />} onClick={() => setShowModal(true)}>New Team</GlowButton>
        </motion.div>

        {/* Stats bar */}
        {!loading && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="flex items-center gap-4 mb-6 text-xs text-text-muted">
            <div className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-accent-purple" /> {teams.length} teams</div>
            <div className="w-1 h-1 rounded-full bg-glass-border" />
            <div className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-accent-emerald" /> {teams.filter((t) => t.status === "active").length} active</div>
            <div className="w-1 h-1 rounded-full bg-glass-border" />
            <div className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-accent-cyan" /> {teams.reduce((a, t) => a + t.members.length, 0)} total members</div>
          </motion.div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-6 h-6 border-2 border-accent-purple border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-4">
            {teams.map((team, i) => (
              <motion.div key={team.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <Link href={`/teams/${team.id}`}>
                  <GlassCard className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-purple to-accent-cyan flex items-center justify-center shrink-0">
                            <Users className="w-5 h-5 text-white" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">{team.name}</h3>
                              <span className="px-1.5 py-0.5 rounded text-[9px] uppercase tracking-wider font-bold bg-accent-purple/10 text-accent-purple">{team.energy}</span>
                            </div>
                            <p className="text-xs text-text-muted truncate">{team.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 mt-4">
                          <div className="flex -space-x-2">
                            {team.members.slice(0, 4).map((m) =>
                              m.user ? (
                                <img key={m.id} src={m.user.avatar} alt={m.user.name} className="w-7 h-7 rounded-full border-2 border-bg-primary bg-bg-tertiary" />
                              ) : null
                            )}
                          </div>
                          <span className="text-xs text-text-muted">{team.members.length} members</span>
                          <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-medium", team.status === "active" ? "bg-accent-emerald/10 text-accent-emerald" : "bg-accent-orange/10 text-accent-orange")}>
                            {team.status}
                          </span>
                          <span className="text-[10px] text-text-muted ml-auto flex items-center gap-1"><Clock className="w-3 h-3" />{team.lastActive}</span>
                        </div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-text-muted shrink-0 mt-2" />
                    </div>
                  </GlassCard>
                </Link>
              </motion.div>
            ))}

            {teams.length === 0 && (
              <div className="text-center py-16">
                <Users className="w-12 h-12 text-text-muted mx-auto mb-4 opacity-40" />
                <p className="text-text-muted text-sm">No teams yet. Create one to start building!</p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Create Team Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="fixed z-50 inset-0 flex items-center justify-center px-4">
              <div className="glass-static rounded-3xl p-8 w-full max-w-md border border-glass-border shadow-2xl relative">
                <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 p-2 text-text-muted hover:text-text-primary rounded-lg hover:bg-white/5 transition-colors">
                  <X className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-purple to-accent-pink flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Create a Team</h2>
                    <p className="text-xs text-text-muted">Start a new builder squad</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-text-secondary mb-1.5">Team Name</label>
                    <input
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                      placeholder="e.g. Team Nexus"
                      autoFocus
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-glass-border text-text-primary placeholder-text-muted text-sm focus:outline-none focus:border-accent-purple/50 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-text-secondary mb-1.5">Description</label>
                    <textarea value={teamDesc} onChange={(e) => setTeamDesc(e.target.value)} placeholder="What are you building?" rows={3} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-glass-border text-text-primary placeholder-text-muted text-sm focus:outline-none focus:border-accent-purple/50 transition-all resize-none" />
                  </div>
                  <GlowButton fullWidth onClick={handleCreate} disabled={!teamName.trim() || creating} icon={creating ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Plus className="w-4 h-4" />}>
                    {creating ? "Creating..." : "Create Team"}
                  </GlowButton>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
