"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, X, Zap, Bookmark, MapPin, Briefcase, ChevronDown, Filter, Sparkles, RotateCcw, Eye } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/shared/navbar";
import { GlowButton } from "@/components/shared/glow-button";
import { FloatingElements } from "@/components/shared/floating-elements";
import { MOCK_USERS } from "@/data/mock-users";
import { cn } from "@/lib/utils";
import type { User } from "@/types";
import CardSwap, { Card, CardSwapHandle } from "@/components/CardSwap";
import { ProfileCard } from "@/components/discover/profile-card";
import { LiveActivityFeed } from "@/components/shared/live-activity-feed";
import { AmbientMotion } from "@/components/shared/ambient-motion";

export default function DiscoverPage() {
  const [cards, setCards] = useState(MOCK_USERS.slice(0, 8));
  const [showFilters, setShowFilters] = useState(false);
  const [filterSkills, setFilterSkills] = useState<string[]>([]);
  const [filterTypes, setFilterTypes] = useState<string[]>([]);
  const [showPingModal, setShowPingModal] = useState<User | null>(null);
  const [pingMessage, setPingMessage] = useState("");
  const [pingSent, setPingSent] = useState(false);
  const [saved, setSaved] = useState<string[]>([]);
  const [swipedCount, setSwipedCount] = useState(0);
  const cardSwapRef = useRef<CardSwapHandle>(null);

  const onSwipeComplete = useCallback((dir: "left" | "right") => {
    setCards((prev) => prev.slice(1));
    setSwipedCount(p => p + 1);
  }, []);

  const filteredCards = cards.filter((user) => {
    if (filterSkills.length > 0 && !user.skills.some((s) => filterSkills.includes(s))) return false;
    if (filterTypes.length > 0 && !user.interests.some((i) => filterTypes.includes(i))) return false;
    return true;
  });

  const handleSendPing = () => {
    setPingSent(true);
    setTimeout(() => {
      setPingSent(false);
      setShowPingModal(null);
      setPingMessage("");
      cardSwapRef.current?.swipeRight();
    }, 1200);
  };

  const handleSave = () => {
    if (filteredCards[0]) {
      setSaved(prev => prev.includes(filteredCards[0].id) ? prev.filter(id => id !== filteredCards[0].id) : [...prev, filteredCards[0].id]);
    }
  };

  const handleReset = () => {
    setCards(MOCK_USERS.slice(0, 8));
    setSwipedCount(0);
  };

  const aiIcebreakers = [
    "Hey! I noticed we both love AI/ML. Want to team up for an upcoming hackathon?",
    "Your builder DNA is awesome — I think we'd ship really fast together. Got any projects in mind?",
    "Love your debugging trait 😂 I think our vibes would mesh well on a project!",
  ];

  const currentUser = filteredCards[0];

  return (
    <div className="w-full h-full relative">
      <AmbientMotion />
      <LiveActivityFeed />
      <FloatingElements count={3} />
      <Navbar isApp />

      <main className="relative z-10 pt-20 px-4 pb-8 max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters sidebar */}
          <div className="lg:w-72 shrink-0 z-10 relative">
            <button onClick={() => setShowFilters(!showFilters)} className="lg:hidden w-full flex items-center justify-between glass-static rounded-xl px-4 py-3 mb-4 text-sm font-bold tracking-wider uppercase">
              <span className="flex items-center gap-2"><Filter className="w-4 h-4" /> DNA Scanner</span>
              <ChevronDown className={cn("w-4 h-4 transition-transform", showFilters && "rotate-180")} />
            </button>

            <div className={cn("space-y-4", !showFilters && "hidden lg:block")}>
              {/* Card counter */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-static rounded-2xl p-4 border border-white/5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Builders</span>
                  <span className="text-lg font-bold text-text-primary">{filteredCards.length}</span>
                </div>
                <div className="h-1 rounded-full bg-white/5 overflow-hidden">
                  <motion.div animate={{ width: `${(filteredCards.length / MOCK_USERS.length) * 100}%` }} className="h-full rounded-full bg-gradient-to-r from-accent-purple to-accent-pink" />
                </div>
                <div className="flex items-center justify-between mt-2 text-[10px] text-text-muted">
                  <span>{swipedCount} viewed</span>
                  <span>{saved.length} saved</span>
                </div>
              </motion.div>

              <div className="glass-static rounded-2xl p-5 border border-accent-cyan/10">
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="w-4 h-4 text-accent-cyan" />
                  <h3 className="text-xs font-bold uppercase tracking-widest text-accent-cyan">Energy Vector</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {["🚀 Fast Builder", "🌙 Night Owl", "💀 Last Minute Merchant", "☕ Caffeine Powered"].map((skill) => (
                    <button key={skill} onClick={() => setFilterSkills((prev) => prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill])} className={cn("px-3 py-1.5 rounded-lg text-[10px] uppercase font-bold tracking-wider transition-all", filterSkills.includes(skill) ? "bg-accent-cyan/20 text-accent-cyan border border-accent-cyan/30 shadow-[0_0_10px_rgba(6,182,212,0.2)]" : "bg-black/40 text-text-muted border border-white/5 hover:border-white/20")}>
                      {skill}
                    </button>
                  ))}
                </div>
              </div>

              <div className="glass-static rounded-2xl p-5 border border-accent-purple/10">
                <div className="flex items-center gap-2 mb-4">
                  <Briefcase className="w-4 h-4 text-accent-purple" />
                  <h3 className="text-xs font-bold uppercase tracking-widest text-accent-purple">Hackathon Role</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {["Frontend Wizard", "Backend Goblin", "Design Brain", "Pitch Specialist", "AI Maxxer"].map((type) => (
                    <button key={type} onClick={() => setFilterTypes((prev) => prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type])} className={cn("px-3 py-1.5 rounded-lg text-[10px] uppercase font-bold tracking-wider transition-all", filterTypes.includes(type) ? "bg-accent-purple/20 text-accent-purple border border-accent-purple/30 shadow-[0_0_10px_rgba(139,92,246,0.2)]" : "bg-black/40 text-text-muted border border-white/5 hover:border-white/20")}>
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {(filterSkills.length > 0 || filterTypes.length > 0) && (
                <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => { setFilterSkills([]); setFilterTypes([]); }} className="w-full text-center text-[10px] text-accent-pink font-bold uppercase tracking-wider py-2 hover:text-accent-pink/80 transition-colors">
                  Clear all filters
                </motion.button>
              )}

              {/* Current builder mini-profile */}
              {currentUser && (
                <motion.div key={currentUser.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-static rounded-2xl p-4 border border-white/5 hidden lg:block">
                  <div className="flex items-center gap-3 mb-3">
                    <img src={currentUser.avatar} alt="" className="w-10 h-10 rounded-xl bg-bg-tertiary" />
                    <div className="min-w-0">
                      <div className="text-sm font-bold truncate">{currentUser.name}</div>
                      <div className="text-[10px] text-text-muted">@{currentUser.username}</div>
                    </div>
                  </div>
                  {currentUser.builderArchetype && (
                    <span className="text-[9px] px-2 py-0.5 rounded bg-accent-purple/10 text-accent-purple font-bold">{currentUser.builderArchetype}</span>
                  )}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {currentUser.skills.slice(0, 4).map(s => (
                      <span key={s} className="px-1.5 py-0.5 rounded text-[9px] bg-white/5 text-text-muted border border-white/5">{s}</span>
                    ))}
                  </div>
                  <Link href={`/compatibility/${currentUser.id}`} className="flex items-center gap-1 text-[10px] text-accent-purple font-bold mt-3 hover:text-accent-purple/80 transition-colors">
                    <Eye className="w-3 h-3" /> View full compatibility
                  </Link>
                </motion.div>
              )}
            </div>
          </div>

          {/* Swipe area */}
          <div className="flex-1 flex flex-col items-center">
            <div className="relative w-full max-w-md h-[600px] sm:h-[650px]">
                {filteredCards.length > 0 ? (
                  <div style={{ height: '600px', width: '100%', position: 'relative' }}>
                    <CardSwap
                      ref={cardSwapRef}
                      cardDistance={15}
                      verticalDistance={20}
                      onSwipeComplete={onSwipeComplete}
                      width="100%"
                      height="100%"
                    >
                      {filteredCards.slice(0, 6).map((user) => (
                        <Card key={user.id}>
                          <ProfileCard user={user} />
                        </Card>
                      ))}
                    </CardSwap>
                  </div>
                ) : null}

              {filteredCards.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
                    <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }} className="text-5xl mb-4">🎉</motion.div>
                    <h3 className="text-xl font-bold mb-2">All caught up!</h3>
                    <p className="text-text-secondary text-sm mb-2">You&apos;ve seen all the builders</p>
                    <p className="text-text-muted text-xs mb-4">{swipedCount} profiles viewed · {saved.length} saved</p>
                    <GlowButton onClick={handleReset} icon={<RotateCcw className="w-4 h-4" />}>Start Over</GlowButton>
                  </motion.div>
                </div>
              )}
            </div>

            {/* Action buttons */}
            {filteredCards.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4 mt-6">
                <div className="relative group">
                  <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => cardSwapRef.current?.swipeLeft()} className="w-14 h-14 rounded-2xl glass-static border border-white/5 flex items-center justify-center text-red-400 hover:bg-red-500/10 hover:border-red-500/30 hover:shadow-[0_0_15px_rgba(239,68,68,0.2)] transition-all">
                    <X className="w-6 h-6" />
                  </motion.button>
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-black/80 border border-white/10 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider text-red-400 pointer-events-none">
                    Not my chaos
                  </div>
                </div>

                <div className="relative group">
                  <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => filteredCards[0] && setShowPingModal(filteredCards[0])} className="w-16 h-16 rounded-2xl bg-gradient-to-r from-accent-purple to-accent-pink flex items-center justify-center text-white shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] transition-all border border-white/20 relative overflow-hidden">
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    <Zap className="w-7 h-7 relative z-10" />
                  </motion.button>
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-black/80 border border-accent-purple/30 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider text-accent-purple pointer-events-none">
                    Instant collab
                  </div>
                </div>

                <div className="relative group">
                  <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => cardSwapRef.current?.swipeRight()} className="w-14 h-14 rounded-2xl glass-static border border-white/5 flex items-center justify-center text-accent-emerald hover:bg-accent-emerald/10 hover:border-accent-emerald/30 hover:shadow-[0_0_15px_rgba(16,185,129,0.2)] transition-all">
                    <Heart className="w-6 h-6" />
                  </motion.button>
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-black/80 border border-white/10 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider text-accent-emerald pointer-events-none">
                    Vibe match
                  </div>
                </div>

                <div className="relative group">
                  <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={handleSave} className={cn("w-14 h-14 rounded-2xl glass-static border flex items-center justify-center transition-all", currentUser && saved.includes(currentUser.id) ? "border-accent-cyan/50 bg-accent-cyan/10 text-accent-cyan shadow-[0_0_15px_rgba(6,182,212,0.2)]" : "border-white/5 text-accent-cyan hover:bg-accent-cyan/10 hover:border-accent-cyan/30")}>
                    <Bookmark className={cn("w-6 h-6", currentUser && saved.includes(currentUser.id) && "fill-accent-cyan")} />
                  </motion.button>
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-black/80 border border-white/10 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider text-accent-cyan pointer-events-none">
                    {currentUser && saved.includes(currentUser.id) ? "Saved!" : "Save builder"}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Keyboard hint */}
            <div className="hidden lg:flex items-center gap-3 mt-4 text-[10px] text-text-muted">
              <span className="px-1.5 py-0.5 rounded border border-white/10 font-mono">←</span> skip
              <span className="px-1.5 py-0.5 rounded border border-white/10 font-mono">→</span> like
              <span className="px-1.5 py-0.5 rounded border border-white/10 font-mono">↑</span> ping
              <span className="px-1.5 py-0.5 rounded border border-white/10 font-mono">S</span> save
            </div>
          </div>
        </div>
      </main>

      {/* Ping Modal */}
      <AnimatePresence>
        {showPingModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center px-4" onClick={() => !pingSent && setShowPingModal(null)}>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative glass-static rounded-3xl p-6 sm:p-8 w-full max-w-md" onClick={(e) => e.stopPropagation()}>

              {/* Success state */}
              <AnimatePresence>
                {pingSent && (
                  <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="absolute inset-0 z-20 rounded-3xl bg-bg-primary/95 flex flex-col items-center justify-center">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: [0, 1.3, 1] }} transition={{ duration: 0.5 }} className="w-16 h-16 rounded-full bg-accent-emerald/20 border border-accent-emerald/30 flex items-center justify-center mb-4">
                      <Zap className="w-8 h-8 text-accent-emerald" />
                    </motion.div>
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-lg font-bold text-accent-emerald">Ping Sent! ⚡</motion.p>
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-xs text-text-muted mt-1">Waiting for {showPingModal.name} to respond</motion.p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Header with avatar */}
              <div className="flex items-center gap-4 mb-6">
                <img src={showPingModal.avatar} alt="" className="w-14 h-14 rounded-2xl bg-bg-tertiary" />
                <div>
                  <h3 className="text-xl font-bold">Ping {showPingModal.name}</h3>
                  <p className="text-xs text-text-muted">
                    {showPingModal.builderArchetype || showPingModal.skills.slice(0, 2).join(" · ")}
                  </p>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <span className="text-xs text-accent-purple font-medium flex items-center gap-1"><Sparkles className="w-3 h-3" /> AI Suggestions</span>
                {aiIcebreakers.map((msg, i) => (
                  <button key={i} onClick={() => setPingMessage(msg)} className={cn("w-full text-left p-3 rounded-xl text-xs transition-all", pingMessage === msg ? "bg-accent-purple/15 border border-accent-purple/30 text-text-primary" : "bg-white/5 text-text-secondary hover:bg-white/10 border border-transparent")}>
                    {msg}
                  </button>
                ))}
              </div>

              <textarea value={pingMessage} onChange={(e) => setPingMessage(e.target.value)} placeholder="Or write your own message..." rows={3} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-glass-border text-text-primary placeholder-text-muted text-sm focus:outline-none focus:border-accent-purple/50 transition-all resize-none mb-4" />

              <div className="flex gap-3">
                <GlowButton variant="ghost" onClick={() => setShowPingModal(null)} className="flex-1">Cancel</GlowButton>
                <GlowButton onClick={handleSendPing} disabled={!pingMessage.trim()} className="flex-1" icon={<Zap className="w-4 h-4" />}>
                  Send Ping
                </GlowButton>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
