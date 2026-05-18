"use client";

import { useRef } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { MapPin, Briefcase, Sparkles, Target, Zap, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import type { User } from "@/types";

export function ProfileCard({ user }: { user: User }) {
  const compatibility = 70 + (user.id.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % 25);
  
  // 3D Tilt Effect
  const cardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 40 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 40 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className="p-6 sm:p-8 h-full flex flex-col relative overflow-hidden w-full bg-transparent overflow-y-auto no-scrollbar"
    >
      <div style={{ transform: "translateZ(30px)" }}>
        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          <div className="relative shrink-0">
            <img src={user.avatar} alt={user.name} className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-bg-tertiary object-cover shadow-lg" />
            {user.online && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-bg-primary flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-accent-emerald pulse-ring" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-xl font-bold truncate">{user.name}</h3>
              <span className="text-xs text-text-muted">@{user.username}</span>
            </div>
            
            <div className="flex items-center gap-3 mt-1 mb-2 text-xs text-text-muted">
              {user.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{user.location}</span>}
              {(user.company || user.college) && <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" />{user.company || user.college}</span>}
            </div>

            {/* Builder Mood Chip */}
            {user.builderMood && (
              <div className="flex items-center gap-2 mt-2 bg-gradient-to-r from-accent-purple/10 to-transparent border border-accent-purple/20 rounded-lg px-3 py-1.5 w-max max-w-full">
                <span className="text-[11px] font-bold text-accent-purple uppercase tracking-widest">{user.builderMood}</span>
              </div>
            )}
          </div>
          <div className="shrink-0">
            <div className="px-3 py-1.5 rounded-full bg-accent-emerald/10 text-accent-emerald border border-accent-emerald/20 text-sm font-bold shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              {compatibility}%
            </div>
          </div>
        </div>

        {/* Bio */}
        <p className="text-sm text-text-secondary leading-relaxed mb-5">{user.bio}</p>

        {/* Match Insights Panel */}
        {user.matchInsights && user.matchInsights.length > 0 && (
          <div className="mb-5 p-4 rounded-xl border border-accent-emerald/20 bg-gradient-to-br from-accent-emerald/10 to-transparent relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Zap className="w-12 h-12 text-accent-emerald" />
            </div>
            <div className="text-[10px] uppercase font-bold text-accent-emerald tracking-widest mb-3 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3" />
              Match Insights
            </div>
            <ul className="space-y-2 relative z-10">
              {user.matchInsights.map((insight, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-text-primary">
                  <span className="text-accent-emerald shadow-[0_0_8px_rgba(16,185,129,0.5)] mt-0.5 rounded-full">✓</span>
                  <span className="leading-tight">{insight}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Builder Tags */}
        {(user.builderTags?.length || 0) > 0 && (
          <div className="flex flex-wrap gap-2 mb-5">
            {user.builderTags?.map((tag) => (
              <motion.span whileHover={{ scale: 1.05, y: -2 }} key={tag} className="px-3 py-1 rounded-lg text-[10px] uppercase font-bold tracking-wider bg-white/5 text-white/80 border border-white/10 hover:border-accent-purple/50 hover:bg-accent-purple/20 hover:text-white hover:shadow-[0_0_15px_rgba(139,92,246,0.3)] transition-all cursor-default">
                {tag}
              </motion.span>
            ))}
          </div>
        )}

        {/* Stats Section: Radar + Chaos Meters */}
        {user.personalityStats && (
          <div className="glass-static rounded-2xl p-4 mb-5 border border-white/5">
            <div className="text-[10px] uppercase font-bold text-text-muted tracking-widest mb-4 flex items-center gap-1.5">
              <Activity className="w-3 h-3" />
              Builder DNA Profile
            </div>
            
            <div className="flex items-center gap-4">
              {/* Radar Chart */}
              <div className="w-24 h-24 shrink-0 relative">
                <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
                  {/* Grid */}
                  <polygon points="50,10 90,50 50,90 10,50" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                  <polygon points="50,30 70,50 50,70 30,50" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                  <line x1="50" y1="10" x2="50" y2="90" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                  <line x1="10" y1="50" x2="90" y2="50" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                  
                  {/* Data Polygon */}
                  <motion.polygon
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    points={`
                      50,${50 - (user.personalityStats.competitive / 100) * 40} 
                      ${50 + (user.personalityStats.chaotic / 100) * 40},50 
                      50,${50 + (user.personalityStats.shipsFast / 100) * 40} 
                      ${50 - (user.personalityStats.sleepSchedule / 100) * 40},50
                    `}
                    fill="rgba(139,92,246,0.3)"
                    stroke="rgba(139,92,246,0.8)"
                    strokeWidth="1.5"
                    className="drop-shadow-[0_0_8px_rgba(139,92,246,0.5)]"
                  />
                </svg>
                {/* Radar Labels */}
                <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[8px] text-text-muted">Comp</span>
                <span className="absolute top-1/2 -right-3 -translate-y-1/2 text-[8px] text-text-muted">Chaos</span>
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-[8px] text-text-muted">Fast</span>
                <span className="absolute top-1/2 -left-3 -translate-y-1/2 text-[8px] text-text-muted">Sleep</span>
              </div>

              {/* Progress Bars */}
              <div className="flex-1 space-y-3">
                {Object.entries(user.personalityStats).map(([key, value]) => {
                  const labels: Record<string, string> = {
                    competitive: "Competitive", chaotic: "Chaotic", shipsFast: "Ships Fast", sleepSchedule: "Sleep Schedule"
                  };
                  const gradient = key === 'chaotic' ? 'from-red-500 to-orange-500' :
                                   key === 'competitive' ? 'from-blue-500 to-cyan-500' :
                                   key === 'shipsFast' ? 'from-emerald-500 to-teal-500' : 'from-purple-500 to-pink-500';

                  return (
                    <div key={key}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[9px] uppercase font-bold text-text-secondary tracking-widest">{labels[key]}</span>
                        <span className="text-[9px] font-mono text-text-muted">{value}%</span>
                      </div>
                      <div className="h-1 w-full bg-black/40 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }} animate={{ width: `${value}%` }} transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                          className={cn("h-full rounded-full bg-gradient-to-r shadow-[0_0_8px_rgba(255,255,255,0.3)]", gradient)}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Deep Personality Details */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          {user.hyperfixation && (
            <div className="glass-static rounded-xl p-3 border border-accent-pink/10 hover:border-accent-pink/30 transition-colors">
              <div className="text-[9px] uppercase font-bold text-accent-pink tracking-widest mb-1.5 flex items-center gap-1"><Target className="w-3 h-3" /> Hyperfixation</div>
              <p className="text-xs text-text-primary leading-tight">{user.hyperfixation}</p>
            </div>
          )}
          {user.mostLikelyTo && (
            <div className="glass-static rounded-xl p-3 border border-accent-cyan/10 hover:border-accent-cyan/30 transition-colors">
              <div className="text-[9px] uppercase font-bold text-accent-cyan tracking-widest mb-1.5 flex items-center gap-1"><Sparkles className="w-3 h-3" /> Most likely to</div>
              <p className="text-xs text-text-primary leading-tight">{user.mostLikelyTo}</p>
            </div>
          )}
        </div>

        {/* Fun Prompts Carousel (or list) */}
        {user.funPrompts.length > 0 && (
          <div className="space-y-3 mb-5">
            {user.funPrompts.map((prompt, i) => (
              <motion.div whileHover={{ scale: 1.02 }} key={i} className="glass-static border border-white/5 rounded-xl p-4 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] hover:bg-white/5 transition-colors cursor-default">
                <div className="text-[10px] uppercase tracking-wider text-accent-purple font-bold mb-1.5">{prompt.question}</div>
                <p className="text-sm text-text-primary italic leading-relaxed">&ldquo;{prompt.answer}&rdquo;</p>
              </motion.div>
            ))}
          </div>
        )}

        {/* AI Icebreaker Preview */}
        <div className="p-4 rounded-xl bg-accent-pink/5 border border-accent-pink/20 shadow-[0_0_15px_rgba(236,72,153,0.1)] mt-auto mb-2 group cursor-pointer hover:bg-accent-pink/10 transition-colors">
          <div className="flex items-center gap-1.5 mb-2">
            <Sparkles className="w-4 h-4 text-accent-pink animate-pulse" />
            <span className="text-[10px] font-bold text-accent-pink uppercase tracking-widest">AI Icebreaker Gen</span>
          </div>
          <p className="text-xs text-text-primary italic leading-relaxed">
            &ldquo;You both claim to ship fast. Who actually tests their code?&rdquo;
          </p>
          <div className="mt-2 text-[9px] text-text-muted uppercase font-bold tracking-widest group-hover:text-accent-pink transition-colors">
            Tap to use when swiping right →
          </div>
        </div>

        {/* AI Summary */}
        <div className="p-4 rounded-xl bg-accent-purple/5 border border-accent-purple/20 shadow-sm mt-2">
          <div className="flex items-center gap-1.5 mb-2">
            <span className="text-sm">✨</span>
            <span className="text-[10px] font-bold text-accent-purple uppercase tracking-wider">AI Summary</span>
          </div>
          <p className="text-xs text-text-secondary leading-relaxed">{user.aiSummary}</p>
        </div>
      </div>
    </motion.div>
  );
}
