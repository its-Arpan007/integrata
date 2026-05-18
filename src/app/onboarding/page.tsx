"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowRight, ArrowLeft, Sparkles, Check } from "lucide-react";
import { GlowButton } from "@/components/shared/glow-button";
import { FloatingElements } from "@/components/shared/floating-elements";
import { ALL_SKILLS, BUILDER_DNA_OPTIONS, FUN_PROMPT_QUESTIONS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/auth-provider";

const STEPS = ["basics", "skills", "dna", "vibes", "energy", "prompts", "summary"] as const;

const ARCHETYPES = ["⚡ MVP Speedrunner", "💀 Backend Goblin", "🎨 UI Wizard", "🤖 AI Maxxer", "🚀 Indie Hacker", "🦀 Systems Sage"];
const SOUNDTRACKS = ["Synthwave", "Lo-fi", "Hyperphonk", "Ambient rain sounds", "Doom soundtrack", "Interstellar OST", "Dark Ambient"];
const LOOKING_FOR = ["hackathon teammates", "startup cofounders", "indie hackers", "AI builders", "designers", "backend devs", "chaotic creators"];

export default function OnboardingPage() {
  const router = useRouter();
  const { updateUser } = useAuth();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedDna, setSelectedDna] = useState<string[]>([]);
  const [promptAnswers, setPromptAnswers] = useState<Record<string, string>>({});
  
  // New States
  const [archetype, setArchetype] = useState("");
  const [mood, setMood] = useState("");
  const [soundtrack, setSoundtrack] = useState("");
  const [selectedLookingFor, setSelectedLookingFor] = useState<string[]>([]);
  const [energy, setEnergy] = useState({
    chaosLevel: 50,
    shipsFast: 50,
    sleepCycle: 50,
    hackathonEnergy: 50,
    caffeineDependency: 50
  });

  const canProceed = () => {
    if (step === 0) return name.length > 0 && username.length > 0 && archetype !== "";
    if (step === 1) return selectedSkills.length >= 2;
    if (step === 2) return selectedDna.length >= 1;
    if (step === 3) return soundtrack !== "" && selectedLookingFor.length > 0;
    return true;
  };

  const next = () => step < STEPS.length - 1 && setStep(step + 1);
  const prev = () => step > 0 && setStep(step - 1);

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const toggleDna = (label: string) => {
    setSelectedDna((prev) =>
      prev.includes(label) ? prev.filter((d) => d !== label) : prev.length < 5 ? [...prev, label] : prev
    );
  };

  const toggleLookingFor = (tag: string) => {
    setSelectedLookingFor((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 animated-gradient-bg">
      <FloatingElements count={3} />
      <div className="relative z-10 w-full max-w-2xl">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-text-secondary">Step {step + 1} of {STEPS.length}</span>
            <span className="text-sm text-text-muted">{Math.round(((step + 1) / STEPS.length) * 100)}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-accent-purple to-accent-pink"
              animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
              transition={{ type: "spring", stiffness: 100 }}
            />
          </div>
        </div>

        {/* Step content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
            className="glass-static rounded-3xl p-8 sm:p-10"
          >
            {step === 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-2">Let&apos;s get started</h2>
                <p className="text-text-secondary text-sm mb-8">Tell us about yourself</p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-text-secondary mb-1.5">Full Name</label>
                    <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Alex Rivera" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-glass-border text-text-primary placeholder-text-muted text-sm focus:outline-none focus:border-accent-purple/50 transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm text-text-secondary mb-1.5">Username</label>
                    <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="alexcodes" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-glass-border text-text-primary placeholder-text-muted text-sm focus:outline-none focus:border-accent-purple/50 transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm text-text-secondary mb-1.5">Bio</label>
                    <textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Tell builders what you're about..." rows={3} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-glass-border text-text-primary placeholder-text-muted text-sm focus:outline-none focus:border-accent-purple/50 transition-all resize-none" />
                  </div>
                  <div>
                    <label className="block text-sm text-text-secondary mb-3">Builder Archetype</label>
                    <div className="grid grid-cols-2 gap-2">
                      {ARCHETYPES.map((arch) => (
                        <button
                          key={arch}
                          onClick={() => setArchetype(arch)}
                          className={cn(
                            "px-3 py-2 rounded-xl text-xs font-medium transition-all text-left border",
                            archetype === arch
                              ? "bg-accent-purple/20 text-accent-purple border-accent-purple/50"
                              : "bg-white/5 text-text-secondary border-transparent hover:bg-white/10"
                          )}
                        >
                          {arch}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 1 && (
              <div>
                <h2 className="text-2xl font-bold mb-2">Your skills</h2>
                <p className="text-text-secondary text-sm mb-8">Select at least 2 skills (pick all that apply)</p>
                <div className="flex flex-wrap gap-2">
                  {ALL_SKILLS.map((skill) => (
                    <motion.button
                      key={skill}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleSkill(skill)}
                      className={cn(
                        "px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                        selectedSkills.includes(skill)
                          ? "bg-accent-purple/20 text-accent-purple border border-accent-purple/30"
                          : "bg-white/5 text-text-secondary border border-glass-border hover:bg-white/10"
                      )}
                    >
                      {selectedSkills.includes(skill) && <Check className="w-3 h-3 inline mr-1.5" />}
                      {skill}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <h2 className="text-2xl font-bold mb-2">Builder DNA</h2>
                <p className="text-text-secondary text-sm mb-8">What describes your builder personality? (up to 5)</p>
                <div className="flex flex-wrap gap-2">
                  {BUILDER_DNA_OPTIONS.map((tag) => (
                    <motion.button
                      key={tag.label}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleDna(tag.label)}
                      className={cn(
                        "px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                        selectedDna.includes(tag.label)
                          ? "bg-accent-pink/20 text-accent-pink border border-accent-pink/30"
                          : "bg-white/5 text-text-secondary border border-glass-border hover:bg-white/10"
                      )}
                    >
                      {tag.emoji} {tag.label}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <h2 className="text-2xl font-bold mb-2">Your Vibes</h2>
                <p className="text-text-secondary text-sm mb-8">Set the atmosphere</p>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm text-text-secondary mb-2">Coding Soundtrack</label>
                    <div className="flex flex-wrap gap-2">
                      {SOUNDTRACKS.map((track) => (
                        <button key={track} onClick={() => setSoundtrack(track)} className={cn("px-3 py-1.5 rounded-full text-xs font-medium border transition-colors", soundtrack === track ? "bg-accent-cyan/20 border-accent-cyan/50 text-accent-cyan" : "bg-white/5 border-transparent text-text-secondary hover:bg-white/10")}>
                          {track}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-text-secondary mb-2">Current Builder Mood</label>
                    <input value={mood} onChange={(e) => setMood(e.target.value)} placeholder="e.g. running on caffeine and delusion" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-glass-border text-text-primary placeholder-text-muted text-sm focus:outline-none focus:border-accent-purple/50 transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm text-text-secondary mb-2">Looking For...</label>
                    <div className="flex flex-wrap gap-2">
                      {LOOKING_FOR.map((tag) => (
                        <button key={tag} onClick={() => toggleLookingFor(tag)} className={cn("px-3 py-1.5 rounded-full text-xs font-medium border transition-colors", selectedLookingFor.includes(tag) ? "bg-accent-emerald/20 border-accent-emerald/50 text-accent-emerald" : "bg-white/5 border-transparent text-text-secondary hover:bg-white/10")}>
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div>
                <h2 className="text-2xl font-bold mb-2">Builder Energy</h2>
                <p className="text-text-secondary text-sm mb-8">Be honest about your chaos.</p>
                <div className="space-y-6">
                  {[
                    { key: "chaosLevel", label: "Chaos Level", color: "bg-accent-purple" },
                    { key: "shipsFast", label: "Ships Fast", color: "bg-accent-cyan" },
                    { key: "sleepCycle", label: "Sleep Cycle", color: "bg-accent-emerald" },
                    { key: "hackathonEnergy", label: "Hackathon Energy", color: "bg-accent-orange" },
                    { key: "caffeineDependency", label: "Caffeine Dependency", color: "bg-accent-pink" }
                  ].map(({ key, label, color }) => (
                    <div key={key}>
                      <div className="flex justify-between text-xs mb-2">
                        <span className="text-text-secondary font-medium uppercase tracking-wider">{label}</span>
                        <span className="text-text-muted">{energy[key as keyof typeof energy]}%</span>
                      </div>
                      <input 
                        type="range" min="0" max="100" 
                        value={energy[key as keyof typeof energy]} 
                        onChange={(e) => setEnergy({ ...energy, [key]: parseInt(e.target.value) })}
                        className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step === 5 && (
              <div>
                <h2 className="text-2xl font-bold mb-2">Fun prompts</h2>
                <p className="text-text-secondary text-sm mb-8">Answer a few to show your personality (optional)</p>
                <div className="space-y-4">
                  {FUN_PROMPT_QUESTIONS.slice(0, 3).map((q) => (
                    <div key={q} className="p-1">
                      <label className="block text-sm text-accent-purple mb-1.5">{q}</label>
                      <input value={promptAnswers[q] || ""} onChange={(e) => setPromptAnswers({ ...promptAnswers, [q]: e.target.value })} placeholder="Type your answer..." className="w-full px-4 py-3 rounded-xl bg-white/5 border border-glass-border text-text-primary placeholder-text-muted text-sm focus:outline-none focus:border-accent-purple/50 transition-all" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step === 6 && (
              <div className="text-center">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }} className="w-20 h-20 rounded-3xl bg-gradient-to-br from-accent-purple to-accent-pink flex items-center justify-center mx-auto mb-6">
                  <Sparkles className="w-10 h-10 text-white" />
                </motion.div>
                <h2 className="text-2xl font-bold mb-2">You&apos;re all set!</h2>
                <p className="text-text-secondary text-sm mb-6">AI is generating your builder personality summary...</p>
                <div className="glass-static rounded-2xl p-5 text-left mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs">✨</span>
                    <span className="text-xs font-medium text-accent-purple">AI Summary</span>
                  </div>
                  <p className="text-sm text-text-secondary italic leading-relaxed">
                    &ldquo;{archetype} who thrives in high-energy environments. Combines {selectedSkills.slice(0, 2).join(" and ")} expertise with a {selectedDna[0]?.toLowerCase() || "unique"} personality.&rdquo;
                  </p>
                </div>
                <GlowButton size="lg" onClick={() => {
                  updateUser({
                    name,
                    username,
                    bio,
                    builderArchetype: archetype,
                    codingSoundtrack: soundtrack,
                    builderMood: mood,
                    lookingFor: selectedLookingFor,
                    builderEnergy: energy,
                    skills: selectedSkills,
                    builderDna: selectedDna.map(label => {
                       const opt = BUILDER_DNA_OPTIONS.find(d => d.label === label);
                       return { label, emoji: opt ? opt.emoji : '🔮' };
                    }),
                    funPrompts: Object.entries(promptAnswers).filter(([_, a]) => a.trim() !== '').map(([question, answer]) => ({ question, answer })),
                    aiSummary: `${archetype} who thrives in high-energy environments. Combines ${selectedSkills.slice(0, 2).join(" and ")} expertise with a ${selectedDna[0]?.toLowerCase() || "unique"} personality.`
                  });
                  router.push("/discover");
                }} icon={<ArrowRight className="w-5 h-5" />}>
                  Start Discovering Builders
                </GlowButton>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        {step < STEPS.length - 1 && (
          <div className="flex items-center justify-between mt-6">
            <GlowButton variant="ghost" onClick={prev} disabled={step === 0} icon={<ArrowLeft className="w-4 h-4" />}>
              Back
            </GlowButton>
            <GlowButton onClick={next} disabled={!canProceed()} icon={<ArrowRight className="w-4 h-4" />}>
              {step === STEPS.length - 2 ? "Finish" : "Continue"}
            </GlowButton>
          </div>
        )}
      </div>
    </div>
  );
}
