"use client";

import { use } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { MapPin, Briefcase, GitFork, ArrowLeft, Zap } from "lucide-react";
import { Navbar } from "@/components/shared/navbar";
import { GlassCard } from "@/components/shared/glass-card";
import { GlowButton } from "@/components/shared/glow-button";
import { FloatingElements } from "@/components/shared/floating-elements";
import { MOCK_USERS } from "@/data/mock-users";
import { cn, getSkillColor } from "@/lib/utils";

export default function PublicProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = use(params);
  const user = MOCK_USERS.find((u) => u.username === username) || MOCK_USERS[0];

  return (
    <div className="relative min-h-screen animated-gradient-bg">
      <FloatingElements count={3} />
      <Navbar isApp />
      <main className="relative z-10 pt-20 px-4 pb-12 max-w-4xl mx-auto">
        <Link href="/discover" className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>

        {/* Profile Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-static rounded-3xl p-6 sm:p-8 mb-6">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <div className="relative">
              <img src={user.avatar} alt={user.name} className="w-24 h-24 rounded-2xl bg-bg-tertiary" />
              {user.online && (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-bg-primary flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full bg-accent-emerald" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <p className="text-text-muted text-sm">@{user.username}</p>
              <p className="text-text-secondary text-sm mt-3 leading-relaxed">{user.bio}</p>
              <div className="flex items-center gap-4 mt-3 text-xs text-text-muted flex-wrap">
                {user.location && <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{user.location}</span>}
                {(user.company || user.college) && <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5" />{user.company || user.college}</span>}
                {user.github && <span className="flex items-center gap-1"><GitFork className="w-3.5 h-3.5" />{user.github}</span>}
              </div>
              <div className="mt-4 flex gap-3">
                <Link href={`/compatibility/${user.id}`}>
                  <GlowButton size="sm" icon={<Zap className="w-3.5 h-3.5" />}>View Compatibility</GlowButton>
                </Link>
                <GlowButton variant="secondary" size="sm" icon={<Zap className="w-3.5 h-3.5" />}>Ping</GlowButton>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          <GlassCard hover={false} className="p-6">
            <h2 className="text-lg font-semibold mb-4">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {user.skills.map((skill) => (
                <span key={skill} className={cn("px-3 py-1.5 rounded-xl text-xs font-medium bg-gradient-to-r text-white/90", getSkillColor(skill))}>
                  {skill}
                </span>
              ))}
            </div>
          </GlassCard>

          <GlassCard hover={false} className="p-6">
            <h2 className="text-lg font-semibold mb-4">Builder DNA</h2>
            <div className="flex flex-wrap gap-2">
              {user.builderDna.map((tag) => (
                <span key={tag.label} className="px-3 py-1.5 rounded-full bg-accent-pink/10 text-accent-pink text-xs font-medium border border-accent-pink/20">
                  {tag.emoji} {tag.label}
                </span>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Fun Prompts & AI Summary */}
        <div className="mt-6 space-y-6">
          <GlassCard hover={false} className="p-6">
            <div className="flex items-center gap-2 mb-3"><span>✨</span><h2 className="text-lg font-semibold">AI Summary</h2></div>
            <p className="text-sm text-text-secondary italic">&ldquo;{user.aiSummary}&rdquo;</p>
          </GlassCard>

          <GlassCard hover={false} className="p-6">
            <h2 className="text-lg font-semibold mb-4">Fun Prompts</h2>
            <div className="space-y-4">
              {user.funPrompts.map((p) => (
                <div key={p.question} className="p-4 rounded-xl bg-white/[0.02] border border-glass-border">
                  <div className="text-xs text-accent-purple font-medium mb-1.5">{p.question}</div>
                  <p className="text-sm text-text-secondary italic">&ldquo;{p.answer}&rdquo;</p>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </main>
    </div>
  );
}
