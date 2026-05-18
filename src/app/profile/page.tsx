"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Briefcase, GitFork, Edit3, Plus, X, Check, LogOut, Zap, Headphones, Flame, Activity, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/shared/navbar";
import { GlassCard } from "@/components/shared/glass-card";
import { GlowButton } from "@/components/shared/glow-button";
import { FloatingElements } from "@/components/shared/floating-elements";
import { AmbientMotion } from "@/components/shared/ambient-motion";
import { MOCK_USERS } from "@/data/mock-users";
import { cn, getSkillColor } from "@/lib/utils";
import { useAuth } from "@/providers/auth-provider";
import { ALL_SKILLS, BUILDER_DNA_OPTIONS } from "@/lib/constants";

export default function ProfilePage() {
  const router = useRouter();
  const { user: authUser, isAuthenticated, updateUser, logout } = useAuth();

  // Fall back to mock user for demo
  const displayUser = authUser && authUser.skills.length > 0 ? authUser : MOCK_USERS[0];

  const [isEditing, setIsEditing] = useState(false);
  const [skills, setSkills] = useState<string[]>(displayUser.skills);
  const [builderDna, setBuilderDna] = useState(displayUser.builderDna);
  const [newSkill, setNewSkill] = useState("");
  const [newDnaLabel, setNewDnaLabel] = useState("");
  const [showSkillInput, setShowSkillInput] = useState(false);
  const [showDnaInput, setShowDnaInput] = useState(false);
  const [showSkillSuggestions, setShowSkillSuggestions] = useState(false);
  const [showDnaSuggestions, setShowDnaSuggestions] = useState(false);

  // Editable fields
  const [editName, setEditName] = useState(displayUser.name);
  const [editUsername, setEditUsername] = useState(displayUser.username);
  const [editBio, setEditBio] = useState(displayUser.bio);
  const [editLocation, setEditLocation] = useState(displayUser.location || "");
  const [editMood, setEditMood] = useState(displayUser.builderMood || "");
  const [editArchetype, setEditArchetype] = useState(displayUser.builderArchetype || "");
  const [editSoundtrack, setEditSoundtrack] = useState(displayUser.codingSoundtrack || "");
  const [editLookingFor, setEditLookingFor] = useState<string[]>(displayUser.lookingFor || []);
  const [editEnergy, setEditEnergy] = useState(displayUser.builderEnergy || { chaosLevel: 50, shipsFast: 50, sleepCycle: 50, hackathonEnergy: 50, caffeineDependency: 50 });
  const [editPrompts, setEditPrompts] = useState(displayUser.funPrompts);

  const ARCHETYPES = ["⚡ MVP Speedrunner", "💀 Backend Goblin", "🎨 UI Wizard", "🤖 AI Maxxer", "🚀 Indie Hacker", "🦀 Systems Sage", "☕ Startup Gremlin", "🛡️ Security Gremlin"];
  const SOUNDTRACKS = ["Synthwave", "Lo-fi", "Hyperphonk", "Ambient rain sounds", "Doom soundtrack", "Interstellar OST", "Dark Ambient", "Industrial Techno"];
  const LOOKING_FOR_OPTIONS = ["hackathon teammates", "startup cofounders", "indie hackers", "AI builders", "AI hackers", "designers", "backend devs", "backend goblins", "UI gremlins", "chaotic creators", "people who actually ship projects"];

  const handleSave = () => {
    const updates: Partial<typeof displayUser> = {
      name: editName, username: editUsername, bio: editBio, location: editLocation,
      builderMood: editMood, builderArchetype: editArchetype, codingSoundtrack: editSoundtrack,
      lookingFor: editLookingFor, builderEnergy: editEnergy, funPrompts: editPrompts,
      skills, builderDna,
    };
    updateUser(updates);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditName(displayUser.name); setEditUsername(displayUser.username); setEditBio(displayUser.bio);
    setEditLocation(displayUser.location || ""); setEditMood(displayUser.builderMood || "");
    setEditArchetype(displayUser.builderArchetype || ""); setEditSoundtrack(displayUser.codingSoundtrack || "");
    setEditLookingFor(displayUser.lookingFor || []); setEditEnergy(displayUser.builderEnergy || { chaosLevel: 50, shipsFast: 50, sleepCycle: 50, hackathonEnergy: 50, caffeineDependency: 50 });
    setEditPrompts(displayUser.funPrompts); setSkills(displayUser.skills); setBuilderDna(displayUser.builderDna);
    setIsEditing(false);
  };

  const toggleEditLookingFor = (tag: string) => {
    setEditLookingFor(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  // Filter suggestions based on input
  const skillSuggestions = ALL_SKILLS.filter(
    (s) => !skills.includes(s) && s.toLowerCase().includes(newSkill.toLowerCase())
  );

  const dnaSuggestions = BUILDER_DNA_OPTIONS.filter(
    (d) => !builderDna.some((b) => b.label === d.label) && d.label.toLowerCase().includes(newDnaLabel.toLowerCase())
  );

  const addSkill = (skill: string) => {
    if (skill.trim() && !skills.includes(skill.trim())) {
      const updated = [...skills, skill.trim()];
      setSkills(updated);
      setNewSkill("");
      setShowSkillSuggestions(false);
      if (isAuthenticated) updateUser({ skills: updated });
    }
  };

  const removeSkill = (skill: string) => {
    const updated = skills.filter((s) => s !== skill);
    setSkills(updated);
    if (isAuthenticated) updateUser({ skills: updated });
  };

  const addDna = (label: string, emoji: string) => {
    if (label.trim() && !builderDna.some((d) => d.label === label.trim())) {
      const updated = [...builderDna, { label: label.trim(), emoji }];
      setBuilderDna(updated);
      setNewDnaLabel("");
      setShowDnaSuggestions(false);
      if (isAuthenticated) updateUser({ builderDna: updated });
    }
  };

  const removeDna = (label: string) => {
    const updated = builderDna.filter((d) => d.label !== label);
    setBuilderDna(updated);
    if (isAuthenticated) updateUser({ builderDna: updated });
  };

  const handleSkillKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (skillSuggestions.length > 0) {
        addSkill(skillSuggestions[0]);
      } else if (newSkill.trim()) {
        addSkill(newSkill);
      }
    }
    if (e.key === "Escape") {
      setShowSkillInput(false);
      setNewSkill("");
    }
  };

  const handleDnaKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (dnaSuggestions.length > 0) {
        addDna(dnaSuggestions[0].label, dnaSuggestions[0].emoji);
      } else if (newDnaLabel.trim()) {
        addDna(newDnaLabel, "🔮");
      }
    }
    if (e.key === "Escape") {
      setShowDnaInput(false);
      setNewDnaLabel("");
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const user = isEditing ? { ...displayUser, name: editName, username: editUsername, bio: editBio, location: editLocation, builderMood: editMood, builderArchetype: editArchetype, codingSoundtrack: editSoundtrack, lookingFor: editLookingFor, builderEnergy: editEnergy, funPrompts: editPrompts, skills, builderDna } : displayUser;

  return (
    <div className="relative min-h-screen animated-gradient-bg">
      <AmbientMotion />
      <FloatingElements count={3} />
      <Navbar isApp />

      <main className="relative z-10 pt-20 px-4 pb-12 max-w-4xl mx-auto">
        {/* Edit Mode Bar */}
        <AnimatePresence>
          {isEditing && (
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="mb-4 glass-static rounded-2xl p-4 flex items-center justify-between border border-accent-purple/30">
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-accent-purple" />
                <span className="text-sm font-bold text-accent-purple uppercase tracking-wider">Editing Profile</span>
              </div>
              <div className="flex gap-2">
                <GlowButton variant="ghost" size="sm" onClick={handleCancel} icon={<X className="w-3.5 h-3.5" />}>Cancel</GlowButton>
                <GlowButton size="sm" onClick={handleSave} icon={<Save className="w-3.5 h-3.5" />}>Save Changes</GlowButton>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {/* Profile Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-static rounded-3xl p-6 sm:p-8 mb-6">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <div className="relative">
              <img src={user.avatar} alt={user.name} className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-bg-tertiary" />
              {user.online && (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-bg-primary flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full bg-accent-emerald" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between flex-wrap gap-2">
                <div className="flex-1 min-w-0">
                  {isEditing ? (
                    <div className="space-y-2">
                      <input value={editName} onChange={e => setEditName(e.target.value)} className="w-full text-2xl sm:text-3xl font-bold bg-white/5 border border-glass-border rounded-xl px-3 py-1.5 text-text-primary focus:outline-none focus:border-accent-purple/50" />
                      <div className="flex items-center gap-2">
                        <span className="text-text-muted text-sm">@</span>
                        <input value={editUsername} onChange={e => setEditUsername(e.target.value)} className="flex-1 text-sm bg-white/5 border border-glass-border rounded-lg px-2 py-1 text-text-primary focus:outline-none focus:border-accent-purple/50" />
                      </div>
                      <input value={editMood} onChange={e => setEditMood(e.target.value)} placeholder="e.g. running on caffeine and delusion" className="w-full text-xs bg-white/5 border border-glass-border rounded-lg px-2 py-1.5 text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-cyan/50" />
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-3 mb-1">
                        <h1 className="text-2xl sm:text-3xl font-bold">{user.name}</h1>
                        {user.builderArchetype && (
                          <span className="px-2 py-0.5 rounded-md bg-accent-purple/20 text-accent-purple text-xs font-bold border border-accent-purple/30">{user.builderArchetype}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <p className="text-text-muted text-sm">@{user.username}</p>
                        {user.builderMood && (
                          <span className="px-2 py-0.5 rounded-full bg-accent-cyan/10 text-accent-cyan text-[10px] uppercase font-bold tracking-wider">{user.builderMood}</span>
                        )}
                      </div>
                    </>
                  )}
                </div>
                <div className="flex gap-2 shrink-0">
                  {!isEditing && (
                    <GlowButton variant="secondary" size="sm" icon={<Edit3 className="w-3.5 h-3.5" />} onClick={() => setIsEditing(true)}>
                      Edit Profile
                    </GlowButton>
                  )}
                  {isAuthenticated && (
                    <GlowButton variant="ghost" size="sm" icon={<LogOut className="w-3.5 h-3.5" />} onClick={handleLogout}>
                      Logout
                    </GlowButton>
                  )}
                </div>
              </div>
              
              {user.liveVibe && (
                <div className="flex flex-wrap items-center gap-3 mt-3 mb-1">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-accent-emerald bg-accent-emerald/10 px-2 py-1 rounded-full border border-accent-emerald/20">
                    <div className="w-2 h-2 rounded-full bg-accent-emerald animate-pulse" />
                    {user.liveVibe.status}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-text-muted">
                    <Zap className="w-3.5 h-3.5" /> {user.liveVibe.activeHours}
                  </div>
                </div>
              )}

              {isEditing ? (
                <div className="space-y-2 mt-3">
                  <textarea value={editBio} onChange={e => setEditBio(e.target.value)} rows={2} placeholder="Tell builders what you're about..." className="w-full text-sm bg-white/5 border border-glass-border rounded-xl px-3 py-2 text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-purple/50 resize-none" />
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-text-muted shrink-0" />
                    <input value={editLocation} onChange={e => setEditLocation(e.target.value)} placeholder="Location" className="flex-1 text-xs bg-white/5 border border-glass-border rounded-lg px-2 py-1 text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-purple/50" />
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-text-secondary text-sm mt-3 leading-relaxed">{user.bio}</p>
                  <div className="flex items-center gap-4 mt-3 text-xs text-text-muted flex-wrap">
                    {user.location && <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{user.location}</span>}
                    {user.company && <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5" />{user.company}</span>}
                    {user.github && <span className="flex items-center gap-1"><GitFork className="w-3.5 h-3.5" />{user.github}</span>}
                  </div>
                </>
              )}
            </div>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Skills — EDITABLE */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <GlassCard hover={false} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Skills</h2>
                <button
                  onClick={() => { setShowSkillInput(!showSkillInput); setNewSkill(""); }}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-accent-purple/10 text-accent-purple text-xs font-medium hover:bg-accent-purple/20 transition-colors"
                >
                  <Plus className="w-3 h-3" />
                  Add Skill
                </button>
              </div>

              {/* Add skill input */}
              <AnimatePresence>
                {showSkillInput && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-4 relative"
                  >
                    <div className="flex gap-2">
                      <input
                        value={newSkill}
                        onChange={(e) => { setNewSkill(e.target.value); setShowSkillSuggestions(true); }}
                        onKeyDown={handleSkillKeyDown}
                        onFocus={() => setShowSkillSuggestions(true)}
                        placeholder="Type a skill (e.g. Python, Figma)..."
                        autoFocus
                        className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-glass-border text-text-primary placeholder-text-muted text-sm focus:outline-none focus:border-accent-purple/50 transition-all"
                      />
                      <button
                        onClick={() => newSkill.trim() && addSkill(newSkill)}
                        className="px-3 py-2 rounded-lg bg-accent-purple/20 text-accent-purple text-sm hover:bg-accent-purple/30 transition-colors"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Skill suggestions dropdown */}
                    {showSkillSuggestions && newSkill.length > 0 && skillSuggestions.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute z-20 top-full left-0 right-12 mt-1 p-2 rounded-xl bg-bg-secondary border border-glass-border shadow-xl max-h-40 overflow-y-auto"
                      >
                        {skillSuggestions.slice(0, 6).map((s) => (
                          <button
                            key={s}
                            onClick={() => addSkill(s)}
                            className="w-full text-left px-3 py-1.5 rounded-lg text-sm text-text-secondary hover:bg-white/5 hover:text-text-primary transition-colors"
                          >
                            {s}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <motion.span
                    layout
                    key={skill}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className={cn("px-3 py-1.5 rounded-xl text-xs font-medium bg-gradient-to-r text-white/90 flex items-center gap-1.5 group", getSkillColor(skill))}
                  >
                    {skill}
                    <button
                      onClick={() => removeSkill(skill)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity -mr-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </motion.span>
                ))}
                {skills.length === 0 && (
                  <p className="text-sm text-text-muted italic">Click &ldquo;Add Skill&rdquo; to get started</p>
                )}
              </div>
            </GlassCard>
          </motion.div>

          {/* Builder DNA — EDITABLE */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <GlassCard hover={false} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Builder DNA</h2>
                <button
                  onClick={() => { setShowDnaInput(!showDnaInput); setNewDnaLabel(""); }}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-accent-pink/10 text-accent-pink text-xs font-medium hover:bg-accent-pink/20 transition-colors"
                >
                  <Plus className="w-3 h-3" />
                  Add DNA
                </button>
              </div>

              {/* Add DNA input */}
              <AnimatePresence>
                {showDnaInput && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-4 relative"
                  >
                    <div className="flex gap-2">
                      <input
                        value={newDnaLabel}
                        onChange={(e) => { setNewDnaLabel(e.target.value); setShowDnaSuggestions(true); }}
                        onKeyDown={handleDnaKeyDown}
                        onFocus={() => setShowDnaSuggestions(true)}
                        placeholder="Type a trait (e.g. Night Owl)..."
                        autoFocus
                        className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-glass-border text-text-primary placeholder-text-muted text-sm focus:outline-none focus:border-accent-pink/50 transition-all"
                      />
                      <button
                        onClick={() => {
                          if (dnaSuggestions.length > 0) addDna(dnaSuggestions[0].label, dnaSuggestions[0].emoji);
                          else if (newDnaLabel.trim()) addDna(newDnaLabel, "🔮");
                        }}
                        className="px-3 py-2 rounded-lg bg-accent-pink/20 text-accent-pink text-sm hover:bg-accent-pink/30 transition-colors"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    </div>

                    {/* DNA suggestions dropdown */}
                    {showDnaSuggestions && newDnaLabel.length > 0 && dnaSuggestions.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute z-20 top-full left-0 right-12 mt-1 p-2 rounded-xl bg-bg-secondary border border-glass-border shadow-xl max-h-40 overflow-y-auto"
                      >
                        {dnaSuggestions.slice(0, 6).map((d) => (
                          <button
                            key={d.label}
                            onClick={() => addDna(d.label, d.emoji)}
                            className="w-full text-left px-3 py-1.5 rounded-lg text-sm text-text-secondary hover:bg-white/5 hover:text-text-primary transition-colors"
                          >
                            {d.emoji} {d.label}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex flex-wrap gap-2">
                {builderDna.map((tag) => (
                  <motion.span
                    layout
                    key={tag.label}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="px-3 py-1.5 rounded-full bg-accent-pink/10 text-accent-pink text-xs font-medium border border-accent-pink/20 flex items-center gap-1.5 group"
                  >
                    {tag.emoji} {tag.label}
                    <button
                      onClick={() => removeDna(tag.label)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity -mr-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </motion.span>
                ))}
                {builderDna.length === 0 && (
                  <p className="text-sm text-text-muted italic">Click &ldquo;Add DNA&rdquo; to get started</p>
                )}
              </div>
            </GlassCard>
          </motion.div>

          {/* AI Summary */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <GlassCard hover={false} className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <span>✨</span>
                <h2 className="text-lg font-semibold">AI Summary</h2>
              </div>
              <p className="text-sm text-text-secondary italic leading-relaxed">&ldquo;{user.aiSummary || "Complete your profile to get an AI-generated summary!"}&rdquo;</p>
            </GlassCard>
          </motion.div>

        </div>

        {/* Builder Energy & Social Signals */}
        <div className="grid md:grid-cols-3 gap-6 mt-6">
          {/* Builder Energy Meters */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="md:col-span-1">
            <GlassCard hover={false} className="p-6 h-full">
              <div className="flex items-center gap-2 mb-6">
                <Activity className="w-5 h-5 text-accent-pink" />
                <h2 className="text-lg font-semibold">Builder Energy</h2>
              </div>
              {user.builderEnergy ? (
                <div className="space-y-4">
                  {[
                    { key: "chaosLevel" as const, label: "Chaos Level", value: user.builderEnergy.chaosLevel, color: "bg-accent-purple" },
                    { key: "shipsFast" as const, label: "Ships Fast", value: user.builderEnergy.shipsFast, color: "bg-accent-cyan" },
                    { key: "sleepCycle" as const, label: "Sleep Cycle", value: user.builderEnergy.sleepCycle, color: "bg-accent-emerald" },
                    { key: "hackathonEnergy" as const, label: "Hackathon Energy", value: user.builderEnergy.hackathonEnergy, color: "bg-accent-orange" },
                    { key: "caffeineDependency" as const, label: "Caffeine Dependency", value: user.builderEnergy.caffeineDependency, color: "bg-accent-pink" }
                  ].map(({ key, label, value, color }) => (
                    <div key={key}>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-text-secondary font-medium uppercase tracking-wider">{label}</span>
                        <span className="text-text-muted font-mono">{isEditing ? editEnergy[key] : value}%</span>
                      </div>
                      {isEditing ? (
                        <input type="range" min="0" max="100" value={editEnergy[key]} onChange={e => setEditEnergy({ ...editEnergy, [key]: parseInt(e.target.value) })} className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white" />
                      ) : (
                        <div className="h-1.5 rounded-full bg-white/5 overflow-hidden flex">
                          {[...Array(10)].map((_, i) => (
                            <div key={i} className={cn("h-full flex-1 border-r border-black/20", i < Math.round(value / 10) ? color : "bg-transparent")} />
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-text-muted italic">No energy stats available.</p>
              )}
            </GlassCard>
          </motion.div>

          <div className="md:col-span-2 grid sm:grid-cols-2 gap-6">
            {/* Soundtrack */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
              <GlassCard hover={false} className="p-6 h-full relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-accent-purple/5 to-transparent pointer-events-none" />
                <div className="flex items-center gap-2 mb-4 relative z-10">
                  <Headphones className="w-5 h-5 text-accent-purple" />
                  <h2 className="text-lg font-semibold">Coding To</h2>
                </div>
                {isEditing ? (
                  <div className="relative z-10 flex flex-wrap gap-1.5">
                    {SOUNDTRACKS.map(t => (
                      <button key={t} onClick={() => setEditSoundtrack(t)} className={cn("px-2 py-1 rounded-full text-[10px] font-medium border transition-colors", editSoundtrack === t ? "bg-accent-purple/20 border-accent-purple/50 text-accent-purple" : "bg-white/5 border-transparent text-text-secondary hover:bg-white/10")}>{t}</button>
                    ))}
                  </div>
                ) : user.codingSoundtrack ? (
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-accent-purple to-accent-pink">{user.codingSoundtrack}</span>
                    <div className="flex gap-1 items-end h-6 opacity-80">
                      {[...Array(5)].map((_, i) => (
                        <motion.div key={i} animate={{ height: ["4px", "24px", "4px"] }} transition={{ repeat: Infinity, duration: 1 + Math.random(), delay: i * 0.2 }} className="w-1.5 bg-accent-purple rounded-t-sm" />
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-text-muted italic relative z-10">Silence</p>
                )}
              </GlassCard>
            </motion.div>

            {/* Looking For */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
              <GlassCard hover={false} className="p-6 h-full">
                <div className="flex items-center gap-2 mb-4">
                  <Flame className="w-5 h-5 text-accent-orange" />
                  <h2 className="text-lg font-semibold">Looking For</h2>
                </div>
                {isEditing ? (
                  <div className="flex flex-wrap gap-1.5">
                    {LOOKING_FOR_OPTIONS.map(tag => (
                      <button key={tag} onClick={() => toggleEditLookingFor(tag)} className={cn("px-2 py-1 rounded-full text-[10px] font-medium border transition-colors", editLookingFor.includes(tag) ? "bg-accent-orange/20 border-accent-orange/50 text-accent-orange" : "bg-white/5 border-transparent text-text-secondary hover:bg-white/10")}>{tag}</button>
                    ))}
                  </div>
                ) : user.lookingFor && user.lookingFor.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {user.lookingFor.map((tag) => (
                      <span key={tag} className="px-2.5 py-1 rounded-md bg-accent-orange/10 border border-accent-orange/20 text-accent-orange text-xs font-bold uppercase tracking-wider shadow-[0_0_10px_rgba(249,115,22,0.1)]">{tag}</span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-text-muted italic">Not actively looking right now.</p>
                )}
              </GlassCard>
            </motion.div>
            
            {/* Ambient Activity */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} className="sm:col-span-2">
              <GlassCard hover={false} className="p-5">
                <div className="flex items-center gap-4 text-sm font-medium text-text-secondary overflow-x-auto no-scrollbar whitespace-nowrap">
                  <div className="flex items-center gap-1.5"><Zap className="w-4 h-4 text-accent-cyan" /> Recently joined 2 hackathons</div>
                  <div className="w-1 h-1 rounded-full bg-glass-border shrink-0" />
                  <div className="flex items-center gap-1.5"><Activity className="w-4 h-4 text-accent-emerald" /> Last shipped project 3 days ago</div>
                  <div className="w-1 h-1 rounded-full bg-glass-border shrink-0" />
                  <div className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-accent-pink" /> Active mostly after midnight</div>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </div>

        {/* Fun Prompts */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="mt-6">
          <h2 className="text-2xl font-bold mb-4 ml-1">Builder Persona</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {(isEditing ? editPrompts : user.funPrompts).map((prompt, i) => (
              <GlassCard key={prompt.question} hover={!isEditing} className="p-5 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-accent-purple/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                <div className="text-[10px] uppercase tracking-widest text-accent-purple font-bold mb-3">{prompt.question}</div>
                {isEditing ? (
                  <input value={prompt.answer} onChange={e => { const updated = [...editPrompts]; updated[i] = { ...updated[i], answer: e.target.value }; setEditPrompts(updated); }} className="w-full text-sm bg-white/5 border border-glass-border rounded-lg px-2 py-1.5 text-text-primary focus:outline-none focus:border-accent-purple/50" />
                ) : (
                  <p className="text-base font-medium text-text-primary leading-relaxed relative z-10">&ldquo;{prompt.answer}&rdquo;</p>
                )}
              </GlassCard>
            ))}
            {user.funPrompts.length === 0 && (
              <p className="text-sm text-text-muted italic ml-1">No fun prompts answered yet.</p>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
