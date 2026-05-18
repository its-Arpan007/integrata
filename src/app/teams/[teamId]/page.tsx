"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Hash, MessageSquare, KanbanSquare, UserCog, Lightbulb, Send, Plus, ArrowLeft, Sparkles, Zap, Coffee, Headphones, Check, Flame, Battery, Brain, X } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/shared/navbar";
import { GlassCard } from "@/components/shared/glass-card";
import { GlowButton } from "@/components/shared/glow-button";
import { FloatingElements } from "@/components/shared/floating-elements";
import { AmbientMotion } from "@/components/shared/ambient-motion";
import { LiveActivityFeed } from "@/components/shared/live-activity-feed";
import { MOCK_USERS } from "@/data/mock-users";
import { cn } from "@/lib/utils";

type Tab = "chat" | "tasks" | "roles" | "ideas";

const tabs: { key: Tab; label: string; icon: typeof Hash }[] = [
  { key: "chat", label: "Chat", icon: MessageSquare },
  { key: "tasks", label: "Tasks", icon: KanbanSquare },
  { key: "roles", label: "Roles", icon: UserCog },
  { key: "ideas", label: "AI Ideas", icon: Lightbulb },
];

const TEAMS_DATA: Record<string, { name: string; project: string; energy: string; mood: string; members: typeof MOCK_USERS; messages: typeof mockMessagesNexus; tasks: typeof mockTasksNexus; roles: { role: string; desc: string }[]; ideas: typeof aiIdeasNexus }> = {};

const membersNexus = [MOCK_USERS[0], MOCK_USERS[1], MOCK_USERS[2]];
const membersAlpha = [MOCK_USERS[0], MOCK_USERS[3], MOCK_USERS[5]];

const mockMessagesNexus = [
  { id: "1", user: MOCK_USERS[1], content: "Hey team! I've been thinking about the architecture for the AI code review bot.", timestamp: "10:32 AM", type: "text" as const },
  { id: "2", user: MOCK_USERS[0], content: "Nice! I was prototyping the frontend last night. Got a basic diff viewer working with syntax highlighting.", timestamp: "10:35 AM", type: "text" as const },
  { id: "3", user: MOCK_USERS[2], content: "I can start on the UI design today. I'm thinking a Linear-inspired minimal interface.", timestamp: "10:38 AM", type: "text" as const },
  { id: "4", user: MOCK_USERS[0], content: "Perfect. Let me set up the Next.js project with our standard config.", timestamp: "10:40 AM", type: "text" as const },
  { id: "s1", user: MOCK_USERS[0], content: "✨ AI Suggestion: Consider using tree-sitter for AST parsing — it would give you language-agnostic code analysis capabilities.", timestamp: "10:41 AM", type: "ai-suggestion" as const },
];

const mockMessagesAlpha = [
  { id: "a1", user: MOCK_USERS[3], content: "Alright team, the hackathon starts in 48 hours. What's our MVP scope?", timestamp: "9:15 AM", type: "text" as const },
  { id: "a2", user: MOCK_USERS[0], content: "I say we go with the smart campus idea — room booking + AR navigation.", timestamp: "9:18 AM", type: "text" as const },
  { id: "a3", user: MOCK_USERS[5], content: "Love it. I can handle the mobile UI and the map integration.", timestamp: "9:22 AM", type: "text" as const },
  { id: "as1", user: MOCK_USERS[0], content: "✨ AI Suggestion: Use Mapbox GL for indoor mapping — it supports custom floor plans and has great React Native bindings.", timestamp: "9:23 AM", type: "ai-suggestion" as const },
];

type TaskStatus = "todo" | "in-progress" | "review" | "done";
type TaskPriority = "low" | "medium" | "high" | "urgent";

interface MockTask {
  id: string;
  title: string;
  status: TaskStatus;
  assignee: any;
  priority: TaskPriority;
  mood?: string;
}

const mockTasksNexus: MockTask[] = [
  { id: "1", title: "Set up project repo", status: "done", assignee: MOCK_USERS[0], priority: "high", mood: "☕ running on caffeine" },
  { id: "2", title: "Design system & component library", status: "in-progress", assignee: MOCK_USERS[2], priority: "high", mood: "🎨 making it pop" },
  { id: "3", title: "Implement AI code analysis API", status: "in-progress", assignee: MOCK_USERS[1], priority: "urgent", mood: "💀 this API is fighting back" },
  { id: "4", title: "Build diff viewer component", status: "todo", assignee: MOCK_USERS[0], priority: "medium", mood: "🚀 shipping tonight no matter what" },
  { id: "5", title: "User auth & onboarding", status: "todo", assignee: MOCK_USERS[0], priority: "medium", mood: "🧠 deep thinking" },
  { id: "6", title: "Integration tests", status: "todo", assignee: MOCK_USERS[1], priority: "low", mood: "🥱 procrastinating this" },
];

const mockTasksAlpha: MockTask[] = [
  { id: "a1", title: "Define hackathon MVP scope", status: "done", assignee: MOCK_USERS[3], priority: "urgent", mood: "⚡ locked in" },
  { id: "a2", title: "Set up React Native project", status: "in-progress", assignee: MOCK_USERS[5], priority: "high", mood: "📱 mobile grinding" },
  { id: "a3", title: "Design campus map UI", status: "in-progress", assignee: MOCK_USERS[0], priority: "high", mood: "🗺️ mapping the chaos" },
  { id: "a4", title: "Build room booking API", status: "todo", assignee: MOCK_USERS[3], priority: "medium", mood: "🔧 backend time" },
  { id: "a5", title: "Prepare pitch deck", status: "todo", assignee: MOCK_USERS[0], priority: "medium", mood: "🎤 storytelling mode" },
];

const aiIdeasNexus = [
  { title: "AI Code Review Bot", description: "Automated PR reviews using LLMs with context-aware suggestions, security analysis, and style enforcement.", tags: ["AI/ML", "DevOps"], reasons: ["Strong AI expertise detected", "Shared startup energy", "Night-owl collaboration style"] },
  { title: "Developer Mood Tracker", description: "Track team mood and productivity patterns using commit messages and activity data for better sprint planning.", tags: ["Data Science", "Backend"], reasons: ["Similar chaotic debugging habits", "High frontend synergy", "Perfect for your fast shipping rate"] },
  { title: "Smart Documentation Generator", description: "Auto-generate and keep docs in sync with code changes using AI-powered analysis.", tags: ["AI/ML", "Developer Tools"], reasons: ["Compliments the team's system design background", "Great hackathon potential", "Matches your UI focus"] },
];

const aiIdeasAlpha = [
  { title: "Smart Campus Navigator", description: "AR-powered indoor navigation for university campuses with real-time room availability and event tracking.", tags: ["Mobile", "AR"], reasons: ["Perfect hackathon scope", "Strong mobile expertise", "High visual impact for demo"] },
  { title: "Study Group Matchmaker", description: "AI-powered matching for study partners based on courses, schedule, and learning style.", tags: ["AI/ML", "Social"], reasons: ["Builds on your matching expertise", "Great for campus culture", "Quick to prototype"] },
];

TEAMS_DATA["1"] = {
  name: "Team Nexus", project: "AI Code Review Bot", energy: "Chaotic Productive", mood: "Sleep Deprivation",
  members: membersNexus, messages: mockMessagesNexus, tasks: mockTasksNexus,
  roles: [
    { role: "🎨 UI Wizard / Frontend Gremlin", desc: "Owns the frontend architecture and makes everything glow" },
    { role: "🤖 AI Maxxer", desc: "Builds the chaotic AI pipelines and fights with local models" },
    { role: "💀 Backend Goblin", desc: "Lives in the terminal, keeps the databases from collapsing" },
  ],
  ideas: aiIdeasNexus,
};

TEAMS_DATA["2"] = {
  name: "HackSquad Alpha", project: "Smart Campus App", energy: "Warming Up", mood: "Pre-Hackathon Hype",
  members: membersAlpha, messages: mockMessagesAlpha, tasks: mockTasksAlpha,
  roles: [
    { role: "🚀 Project Lead / Full Stack", desc: "Coordinates the chaos and fills in the gaps" },
    { role: "⚙️ Systems Architect", desc: "Designs the backend and keeps data flowing" },
    { role: "📱 Mobile UI Specialist", desc: "Makes the app feel native and buttery smooth" },
  ],
  ideas: aiIdeasAlpha,
};

const statusColors = { "todo": "bg-white/10 text-text-secondary", "in-progress": "bg-accent-blue/10 text-accent-blue", "review": "bg-accent-orange/10 text-accent-orange", "done": "bg-accent-emerald/10 text-accent-emerald" };
const priorityColors = { "low": "text-text-muted", "medium": "text-accent-cyan", "high": "text-accent-orange", "urgent": "text-red-400" };

export default function TeamWorkspacePage() {
  const params = useParams();
  const teamId = (params?.teamId as string) || "1";
  const team = TEAMS_DATA[teamId] || TEAMS_DATA["1"];
  const members = team.members;

  const [activeTab, setActiveTab] = useState<Tab>("chat");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(team.messages);
  const [tasks, setTasks] = useState(team.tasks);
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [roles, setRoles] = useState(
    team.roles.map((r, i) => ({ user: members[i], ...r }))
  );
  const [editingRole, setEditingRole] = useState<number | null>(null);
  const [editRoleText, setEditRoleText] = useState("");
  const [editDescText, setEditDescText] = useState("");

  const sendMessage = () => {
    if (!message.trim()) return;
    const newMsg = { id: String(Date.now()), user: MOCK_USERS[0], content: message, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), type: "text" as const };
    setMessages(prev => [...prev, newMsg]);
    setMessage("");
  };

  const addTask = () => {
    if (!newTaskTitle.trim()) return;
    const t: MockTask = { id: String(Date.now()), title: newTaskTitle, status: "todo", assignee: MOCK_USERS[0], priority: "medium", mood: "🧠 thinking about it" };
    setTasks(prev => [...prev, t]);
    setNewTaskTitle("");
    setShowAddTask(false);
  };

  const cycleTaskStatus = (id: string) => {
    const order: TaskStatus[] = ["todo", "in-progress", "review", "done"];
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: order[(order.indexOf(t.status) + 1) % order.length] } : t));
  };

  const saveRole = (i: number) => {
    setRoles(prev => prev.map((r, idx) => idx === i ? { ...r, role: editRoleText, desc: editDescText } : r));
    setEditingRole(null);
  };

  return (
    <div className="relative min-h-screen animated-gradient-bg">
      <AmbientMotion />
      <LiveActivityFeed />
      <FloatingElements count={2} />
      <Navbar isApp />

      <div className="relative z-10 pt-16 flex h-screen">
        {/* Sidebar */}
        <div className="hidden md:flex w-64 shrink-0 flex-col glass-static border-r border-glass-border">
          <div className="p-4 border-b border-glass-border">
            <Link href="/teams" className="text-xs text-text-muted hover:text-text-primary flex items-center gap-1 mb-3">
              <ArrowLeft className="w-3 h-3" /> Teams
            </Link>
            <h2 className="font-bold text-lg">{team.name}</h2>
            <p className="text-xs text-text-muted">{team.project}</p>
          </div>

          {/* Channels / tabs */}
          <div className="flex-1 p-3 space-y-1">
            <div className="text-[10px] uppercase tracking-wider text-text-muted font-semibold px-2 mb-2">Workspace</div>
            {tabs.map((tab) => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={cn("w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all", activeTab === tab.key ? "bg-accent-purple/15 text-accent-purple" : "text-text-secondary hover:bg-white/5 hover:text-text-primary")}>
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Members */}
          <div className="p-3 border-t border-glass-border">
            <div className="text-[10px] uppercase tracking-wider text-text-muted font-semibold px-2 mb-2">Members</div>
            {members.map((m) => (
              <div key={m.id} className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm">
                <div className="relative">
                  <img src={m.avatar} alt={m.name} className="w-6 h-6 rounded-full bg-bg-tertiary" />
                  {m.online && <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-accent-emerald border border-bg-primary" />}
                </div>
                <span className="text-xs text-text-secondary truncate">{m.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col min-w-0">
          
          {/* Team Energy Header (Desktop & Mobile) */}
          <div className="w-full bg-black/40 border-b border-glass-border p-3 sm:p-4 backdrop-blur-md relative overflow-hidden z-20">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent-purple/10 blur-[80px] rounded-full pointer-events-none" />
            
            <div className="flex items-center gap-2 mb-2 md:hidden">
              <h2 className="font-bold text-lg">{team.name}</h2>
              <span className="px-1.5 py-0.5 rounded text-[9px] uppercase tracking-wider font-bold bg-accent-purple/10 text-accent-purple">{team.energy}</span>
            </div>

            <div className="flex flex-wrap items-center gap-3 sm:gap-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-accent-emerald/10 border border-accent-emerald/20 flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                  <Zap className="w-4 h-4 text-accent-emerald" />
                </div>
                <div>
                  <div className="text-[9px] uppercase tracking-widest text-text-muted font-bold">Team Energy</div>
                  <div className="text-xs font-bold text-accent-emerald">{team.energy}</div>
                </div>
              </div>

              <div className="hidden sm:flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-accent-cyan/10 border border-accent-cyan/20 flex items-center justify-center shrink-0">
                  <Battery className="w-4 h-4 text-accent-cyan" />
                </div>
                <div>
                  <div className="text-[9px] uppercase tracking-widest text-text-muted font-bold">Active Hours</div>
                  <div className="text-xs font-bold text-text-primary">Midnight – 4 AM</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-accent-pink/10 border border-accent-pink/20 flex items-center justify-center shrink-0">
                  <Coffee className="w-4 h-4 text-accent-pink" />
                </div>
                <div>
                  <div className="text-[9px] uppercase tracking-widest text-text-muted font-bold">Team Mood</div>
                  <div className="text-xs font-bold text-accent-pink">{team.mood}</div>
                </div>
              </div>

              <div className="hidden lg:flex items-center gap-2 flex-1 justify-end">
                <div className="text-right">
                  <div className="text-[9px] uppercase tracking-widest text-text-muted font-bold">Team Soundtrack</div>
                  <div className="text-xs font-bold text-text-primary flex items-center gap-1.5 justify-end">
                    <Headphones className="w-3 h-3 text-accent-purple" />
                    Synthwave + Deadline Panic
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile tab bar */}
          <div className="md:hidden flex items-center gap-1 p-3 border-b border-glass-border overflow-x-auto no-scrollbar bg-bg-primary/80 z-20">
            {tabs.map((tab) => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs whitespace-nowrap", activeTab === tab.key ? "bg-accent-purple/15 text-accent-purple" : "text-text-secondary")}>
                <tab.icon className="w-3.5 h-3.5" /> {tab.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {activeTab === "chat" && (
              <motion.div key="chat" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col">
                <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 no-scrollbar relative z-10">
                  {/* Shared Builder DNA Intro */}
                  <div className="w-full bg-black/40 border border-white/5 rounded-xl p-4 shadow-inner mb-6">
                    <div className="text-[10px] uppercase font-bold text-accent-purple tracking-widest mb-3 flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-accent-purple" /> Shared Builder DNA
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {["prefer shipping fast", "code best at night", "survive on caffeine", "enjoy chaotic brainstorming", "love AI tooling"].map((trait, i) => (
                        <span key={i} className="flex items-center gap-1 text-[10px] text-text-primary bg-white/5 px-2 py-1 rounded-full border border-white/10">
                          <Check className="w-3 h-3 text-accent-emerald shadow-[0_0_5px_rgba(16,185,129,0.5)]" /> {trait}
                        </span>
                      ))}
                    </div>
                  </div>

                  {messages.map((msg) => (
                    <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={cn("flex gap-3", msg.type === "ai-suggestion" && "pl-4 border-l-2 border-accent-purple/50 bg-accent-purple/5 p-3 rounded-r-xl relative overflow-hidden")}>
                      {msg.type === "ai-suggestion" && <div className="absolute inset-0 bg-gradient-to-r from-accent-purple/10 to-transparent pointer-events-none" />}
                      <img src={msg.user.avatar} alt={msg.user.name} className="w-8 h-8 rounded-full bg-bg-tertiary shrink-0 mt-0.5 relative z-10" />
                      <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-sm font-semibold">{msg.user.name}</span>
                          <span className="text-[10px] text-text-muted">{msg.timestamp}</span>
                          {msg.type === "ai-suggestion" && <span className="px-1.5 py-0.5 rounded text-[9px] bg-accent-purple/20 text-accent-purple uppercase tracking-widest font-bold">AI Assistant</span>}
                        </div>
                        <p className={cn("text-sm leading-relaxed", msg.type === "ai-suggestion" ? "text-accent-purple font-medium" : "text-text-secondary")}>{msg.content}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="relative z-10 bg-bg-secondary/80 backdrop-blur-md border-t border-glass-border">
                  {/* Quick Actions Scroll Area */}
                  <div className="flex items-center gap-2 overflow-x-auto no-scrollbar px-4 pt-3 pb-2">
                    <button onClick={() => setMessage("I've been thinking about an AI-powered...")} className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-[10px] font-bold uppercase tracking-wider text-text-secondary hover:text-text-primary transition-colors">
                      <Lightbulb className="w-3 h-3 text-accent-purple" /> Pitch Idea
                    </button>
                    <button onClick={() => setMessage("Here's my deadline panic playlist 🎧")} className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-[10px] font-bold uppercase tracking-wider text-text-secondary hover:text-text-primary transition-colors">
                      <Headphones className="w-3 h-3 text-accent-pink" /> Share Playlist
                    </button>
                    <button onClick={() => setMessage("Anyone up for a quick brainstorm? ⚡")} className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-[10px] font-bold uppercase tracking-wider text-text-secondary hover:text-text-primary transition-colors">
                      <Zap className="w-3 h-3 text-accent-cyan" /> Start Brainstorm
                    </button>
                    <button onClick={() => setMessage("Time for a late night session ☕")} className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-[10px] font-bold uppercase tracking-wider text-text-secondary hover:text-text-primary transition-colors">
                      <Coffee className="w-3 h-3 text-amber-500" /> Late Night Session
                    </button>
                  </div>

                  <div className="p-4 pt-2">
                    <div className="flex gap-2 bg-black/40 rounded-xl border border-glass-border p-1 focus-within:border-accent-purple/50 focus-within:shadow-[0_0_15px_rgba(139,92,246,0.15)] transition-all">
                      <input value={message} onChange={(e) => setMessage(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMessage()} placeholder="Type a message..." className="flex-1 px-3 py-2 bg-transparent text-sm text-text-primary placeholder-text-muted focus:outline-none" />
                      <GlowButton size="sm" icon={<Send className="w-4 h-4" />} onClick={sendMessage}>Send</GlowButton>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "tasks" && (
              <motion.div key="tasks" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 p-4 sm:p-6 overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold">Task Board</h3>
                  <GlowButton size="sm" icon={<Plus className="w-4 h-4" />} onClick={() => setShowAddTask(true)}>Add Task</GlowButton>
                </div>
                <AnimatePresence>
                  {showAddTask && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-4">
                      <div className="flex gap-2">
                        <input value={newTaskTitle} onChange={e => setNewTaskTitle(e.target.value)} onKeyDown={e => e.key === 'Enter' && addTask()} placeholder="Task title..." autoFocus className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-glass-border text-text-primary placeholder-text-muted text-sm focus:outline-none focus:border-accent-purple/50" />
                        <GlowButton size="sm" onClick={addTask} icon={<Check className="w-4 h-4" />}>Add</GlowButton>
                        <button onClick={() => setShowAddTask(false)} className="p-2 text-text-muted hover:text-text-primary rounded-lg hover:bg-white/5"><X className="w-4 h-4" /></button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div className="space-y-2">
                  {tasks.map((task, i) => (
                    <motion.div key={task.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                      <GlassCard hover={false} className={cn("p-4 flex items-center gap-3 relative overflow-hidden", task.priority === "urgent" && task.status !== "done" && "border-red-500/30 shadow-[0_0_15px_rgba(248,113,113,0.1)]", task.priority === "high" && task.status !== "done" && "border-accent-orange/30 shadow-[0_0_10px_rgba(251,146,60,0.05)]", task.status === "done" && "border-accent-emerald/20 bg-accent-emerald/5")}>
                        {task.status === "in-progress" && <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }} className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none" />}
                        <button onClick={() => cycleTaskStatus(task.id)} className={cn("w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors", task.status === "done" ? "bg-accent-emerald border-accent-emerald" : task.status === "in-progress" ? "border-accent-blue animate-pulse" : task.status === "review" ? "border-accent-orange" : "border-white/20 hover:border-white/40")}>
                          {task.status === "done" && <Check className="w-3 h-3 text-white" />}
                        </button>
                        <div className="flex-1 min-w-0">
                          <div className={cn("text-sm font-medium", task.status === "done" && "line-through text-text-muted")}>{task.title}</div>
                          {task.mood && <div className="text-[10px] text-text-muted mt-1 font-medium">{task.mood}</div>}
                        </div>
                        <span className={cn("text-[10px] font-medium uppercase hidden sm:inline", priorityColors[task.priority])}>{task.priority}</span>
                        <span className={cn("px-2 py-0.5 rounded-full text-[10px] cursor-pointer", statusColors[task.status])} onClick={() => cycleTaskStatus(task.id)}>{task.status}</span>
                        <img src={task.assignee.avatar} alt="" className="w-6 h-6 rounded-full bg-bg-tertiary ring-1 ring-white/10" />
                      </GlassCard>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === "roles" && (
              <motion.div key="roles" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 p-4 sm:p-6 overflow-y-auto">
                <h3 className="text-lg font-semibold mb-6">Role Assignment</h3>
                <p className="text-xs text-text-muted mb-4 -mt-4">Click a role to edit it</p>
                <div className="space-y-4">
                  {roles.map((r, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                      <GlassCard hover={false} className="p-5">
                        <div className="flex items-center gap-4">
                          <img src={r.user.avatar} alt={r.user.name} className="w-12 h-12 rounded-xl bg-bg-tertiary shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-sm">{r.user.name}</div>
                            {editingRole === i ? (
                              <div className="space-y-1.5 mt-1">
                                <input value={editRoleText} onChange={e => setEditRoleText(e.target.value)} className="w-full text-xs bg-white/5 border border-glass-border rounded-lg px-2 py-1 text-accent-purple focus:outline-none focus:border-accent-purple/50" />
                                <input value={editDescText} onChange={e => setEditDescText(e.target.value)} className="w-full text-xs bg-white/5 border border-glass-border rounded-lg px-2 py-1 text-text-secondary focus:outline-none focus:border-accent-purple/50" />
                                <div className="flex gap-1">
                                  <button onClick={() => saveRole(i)} className="px-2 py-0.5 rounded text-[10px] bg-accent-purple/20 text-accent-purple hover:bg-accent-purple/30">Save</button>
                                  <button onClick={() => setEditingRole(null)} className="px-2 py-0.5 rounded text-[10px] text-text-muted hover:bg-white/5">Cancel</button>
                                </div>
                              </div>
                            ) : (
                              <button onClick={() => { setEditingRole(i); setEditRoleText(r.role); setEditDescText(r.desc); }} className="text-left">
                                <div className="text-accent-purple text-xs font-medium">{r.role}</div>
                                <div className="text-xs text-text-muted mt-1">{r.desc}</div>
                              </button>
                            )}
                          </div>
                        </div>
                      </GlassCard>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === "ideas" && (
              <motion.div key="ideas" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 p-4 sm:p-6 overflow-y-auto">
                <div className="flex items-center gap-2 mb-6">
                  <Sparkles className="w-5 h-5 text-accent-purple" />
                  <h3 className="text-lg font-semibold">AI Project Ideas</h3>
                </div>
                <div className="space-y-4">
                  {team.ideas.map((idea, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                      <GlassCard className="p-5">
                        <h4 className="font-semibold mb-2">{idea.title}</h4>
                        <p className="text-sm text-text-secondary leading-relaxed mb-3">{idea.description}</p>
                        <div className="flex flex-wrap gap-2 mt-4">
                          {idea.tags.map((tag) => (
                            <span key={tag} className="px-2 py-0.5 rounded-lg bg-white/5 border border-white/10 text-text-secondary text-[10px] uppercase font-bold">{tag}</span>
                          ))}
                        </div>
                        {idea.reasons && (
                          <div className="mt-4 pt-4 border-t border-glass-border/50">
                            <div className="text-[10px] uppercase tracking-widest font-bold text-accent-cyan mb-2 flex items-center gap-1.5">
                              <Flame className="w-3 h-3" /> Why this fits your team
                            </div>
                            <div className="space-y-1.5">
                              {idea.reasons.map((reason, idx) => (
                                <div key={idx} className="flex items-start gap-2 text-[11px] text-text-primary">
                                  <Check className="w-3 h-3 text-accent-cyan mt-0.5 shrink-0 shadow-[0_0_5px_rgba(34,211,238,0.5)]" />
                                  <span>{reason}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </GlassCard>
                    </motion.div>
                  ))}
                </div>
                <div className="mt-6">
                  <GlowButton variant="secondary" icon={<Sparkles className="w-4 h-4" />}>Generate More Ideas</GlowButton>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
