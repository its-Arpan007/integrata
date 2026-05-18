"use client";

import { useState } from "react";
import { use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Zap, Lightbulb, AlertTriangle, UserCheck, Sparkles, MessageSquare } from "lucide-react";
import { Navbar } from "@/components/shared/navbar";
import { GlassCard } from "@/components/shared/glass-card";
import { GlowButton } from "@/components/shared/glow-button";
import { FloatingElements } from "@/components/shared/floating-elements";
import { MOCK_USERS, CURRENT_USER } from "@/data/mock-users";

const dimensions = [
  { name: "Technical Synergy", score: 92, color: "from-purple-500 to-violet-500", icon: "⚡", description: "Your skills complement each other extremely well" },
  { name: "Work Style", score: 87, color: "from-cyan-500 to-blue-500", icon: "🔄", description: "Similar pacing with complementary approaches" },
  { name: "Communication", score: 94, color: "from-pink-500 to-rose-500", icon: "💬", description: "Both value clear, async-first communication" },
  { name: "Goal Alignment", score: 89, color: "from-emerald-500 to-green-500", icon: "🎯", description: "Shared ambition for impactful projects" },
  { name: "Creative Energy", score: 96, color: "from-orange-500 to-yellow-500", icon: "✨", description: "High creative compatibility and idea synergy" },
];

export default function CompatibilityPage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = use(params);
  const user = MOCK_USERS.find((u) => u.id === userId) || MOCK_USERS[0];
  const overallScore = Math.round(dimensions.reduce((sum, d) => sum + d.score, 0) / dimensions.length);

  const [icebreaker, setIcebreaker] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateIcebreaker = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const options = [
        `You both survive on caffeine and claim to "ship fast". Who actually tests their code first?`,
        `I see you both have chaotic sleep schedules. Want to rewrite the backend together at 3 AM?`,
        `Debate topic: Local LLMs vs. Cloud APIs. Go.`,
        `I noticed you both love AI maxxing. What's the most unhinged agent you've built?`
      ];
      setIcebreaker(options[Math.floor(Math.random() * options.length)]);
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <div className="relative min-h-screen animated-gradient-bg">
      <FloatingElements count={3} />
      <Navbar isApp />

      <main className="relative z-10 pt-20 px-4 pb-12 max-w-4xl mx-auto">
        <Link href="/discover" className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Discover
        </Link>

        {/* Header with both users */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-static rounded-3xl p-6 sm:p-10 mb-6 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-accent-purple/5 to-accent-pink/5" />
          
          <div className="flex items-center justify-center gap-4 sm:gap-8 mb-6 relative z-10">
            <div className="text-center relative">
              <div className="absolute inset-0 bg-accent-cyan/20 blur-2xl rounded-full scale-150 animate-pulse" />
              <img src={CURRENT_USER.avatar} alt="You" className="w-20 h-20 rounded-2xl bg-bg-tertiary mx-auto mb-3 relative z-10 border-2 border-white/10" />
              <span className="text-sm font-bold uppercase tracking-widest text-text-secondary">You</span>
            </div>
            
            <div className="flex flex-col items-center gap-2">
              <motion.div 
                animate={{ rotate: 360 }} 
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="relative flex items-center justify-center w-12 h-12"
              >
                <div className="absolute inset-0 border-2 border-dashed border-accent-purple/40 rounded-full" />
                <Zap className="w-6 h-6 text-accent-purple" />
              </motion.div>
              <div className="h-0.5 w-16 bg-gradient-to-r from-accent-purple via-accent-pink to-accent-cyan opacity-50" />
            </div>

            <div className="text-center relative">
              <div className="absolute inset-0 bg-accent-pink/20 blur-2xl rounded-full scale-150 animate-pulse" />
              <img src={user.avatar} alt={user.name} className="w-20 h-20 rounded-2xl bg-bg-tertiary mx-auto mb-3 relative z-10 border-2 border-white/10" />
              <span className="text-sm font-bold uppercase tracking-widest text-text-secondary">{user.name}</span>
            </div>
          </div>

          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.3 }} className="relative z-10 text-6xl font-black gradient-text mb-2 drop-shadow-2xl">
            {overallScore}%
          </motion.div>
          <p className="text-accent-purple text-xs uppercase font-bold tracking-widest relative z-10">Vibe Compatibility</p>
        </motion.div>

        {/* Dimensions */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <GlassCard hover={false} className="p-6 sm:p-8 mb-6">
            <h2 className="text-lg font-semibold mb-6">Compatibility Breakdown</h2>
            <div className="space-y-5">
              {dimensions.map((dim, i) => (
                <motion.div key={dim.name} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.1 }}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm flex items-center gap-2"><span>{dim.icon}</span> {dim.name}</span>
                    <span className="text-sm font-mono font-bold">{dim.score}%</span>
                  </div>
                  <div className="h-3 rounded-full bg-white/5 overflow-hidden mb-1">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${dim.score}%` }} transition={{ delay: 0.5 + i * 0.1, duration: 1, ease: "easeOut" }} className={`h-full rounded-full bg-gradient-to-r ${dim.color}`} />
                  </div>
                  <p className="text-xs text-text-muted">{dim.description}</p>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Strengths */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <GlassCard hover={false} className="p-6 h-full">
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="w-5 h-5 text-accent-emerald" />
                <h2 className="text-lg font-semibold">Collaboration Strengths</h2>
              </div>
              <ul className="space-y-4">
                {[
                  "Both thrive in sleep-deprived hackathon chaos",
                  "Survive entirely on caffeine and pure delusion",
                  "Shared obsession with shipping first, fixing in prod later",
                  "Both complain about CSS but still write it from scratch",
                ].map((s, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-text-primary">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-accent-emerald/20 text-accent-emerald text-[10px] mt-0.5 shrink-0">✓</span> 
                    {s}
                  </li>
                ))}
              </ul>
            </GlassCard>
          </motion.div>

          {/* Challenges */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <GlassCard hover={false} className="p-6 h-full">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-5 h-5 text-accent-orange" />
                <h2 className="text-lg font-semibold">Possible Challenges</h2>
              </div>
              <ul className="space-y-3">
                {[
                  "Both tend toward night-owl schedules — may need sync points",
                  "Could benefit from designating clear ownership boundaries",
                  "Fast shipping culture may need QA checkpoints",
                ].map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                    <span className="text-accent-orange mt-0.5">⚠</span> {s}
                  </li>
                ))}
              </ul>
            </GlassCard>
          </motion.div>
        </div>

        {/* Role suggestions */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="mt-6">
          <GlassCard hover={false} className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <UserCheck className="w-5 h-5 text-accent-purple" />
              <h2 className="text-lg font-semibold">Suggested Roles</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-accent-purple/5 border border-accent-purple/10">
                <div className="text-sm font-semibold mb-1">You → Lead Frontend / AI Integration</div>
                <p className="text-xs text-text-secondary">Your React and AI/ML skills make you ideal for building the core product experience.</p>
              </div>
              <div className="p-4 rounded-xl bg-accent-cyan/5 border border-accent-cyan/10">
                <div className="text-sm font-semibold mb-1">{user.name} → Backend / Systems Architecture</div>
                <p className="text-xs text-text-secondary">Strong system design and backend skills for scalable infrastructure.</p>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* AI Insight */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="mt-6">
          <div className="p-6 rounded-2xl bg-gradient-to-r from-accent-purple/10 to-accent-pink/10 border border-accent-purple/15">
            <div className="flex items-center gap-2 mb-3">
              <span>🧠</span>
              <span className="text-sm font-semibold text-accent-purple">AI Insight</span>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed italic">
              &ldquo;This is a high-potential collaboration. You both enjoy rapid prototyping and AI projects. {user.name}&apos;s methodical approach balances your creative energy, creating a team that can both dream big and execute precisely. Recommended project types: AI tools, developer productivity apps, hackathon projects.&rdquo;
            </p>
          </div>
        </motion.div>

        {/* AI Icebreaker Generator */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="mt-8">
          <GlassCard hover={false} className="p-8 text-center border border-accent-pink/20 relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-accent-pink/20 blur-3xl rounded-full" />
            
            <Sparkles className="w-8 h-8 text-accent-pink mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Don't know what to say?</h2>
            <p className="text-sm text-text-secondary mb-6">Let our highly unhinged AI generate a conversation starter based on your shared chaos.</p>
            
            <AnimatePresence mode="wait">
              {!icebreaker ? (
                <motion.div key="button" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <GlowButton 
                    onClick={generateIcebreaker} 
                    disabled={isGenerating}
                    icon={<MessageSquare className="w-4 h-4" />}
                  >
                    {isGenerating ? "Analyzing Vibes..." : "Generate Icebreaker"}
                  </GlowButton>
                </motion.div>
              ) : (
                <motion.div key="result" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-left">
                  <div className="p-4 rounded-xl bg-black/40 border border-accent-pink/30 mb-4 shadow-inner">
                    <p className="text-sm italic font-medium">"{icebreaker}"</p>
                  </div>
                  <div className="flex justify-center gap-3">
                    <button onClick={generateIcebreaker} className="text-xs text-text-muted hover:text-white transition-colors">
                      Regenerate
                    </button>
                    <GlowButton size="sm" icon={<Zap className="w-4 h-4" />}>
                      Send to {user.name}
                    </GlowButton>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </GlassCard>
        </motion.div>

        {/* CTA */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} className="mt-8 text-center">
          <Link href="/discover">
            <GlowButton variant="ghost" size="lg">
              Keep Swiping
            </GlowButton>
          </Link>
        </motion.div>
      </main>
    </div>
  );
}
