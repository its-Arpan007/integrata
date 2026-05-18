"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  X, Sparkles, LogOut, Settings, Bell, ChevronDown, ChevronRight,
  MessageSquare, KanbanSquare, UserCog, Lightbulb, Moon, Sun,
  Volume2, VolumeX, Palette, Shield, HelpCircle, Keyboard,
  ExternalLink, Heart, Zap, Clock, Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/auth-provider";
import { GlowButton } from "./glow-button";
import { useBackground, type BackgroundType } from "@/providers/background-provider";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  navLinks: Array<{ href: string; label: string; icon: any }>;
}

const TEAM_TABS = [
  { key: "chat", label: "Chat", icon: MessageSquare },
  { key: "tasks", label: "Tasks", icon: KanbanSquare },
  { key: "roles", label: "Roles", icon: UserCog },
  { key: "ideas", label: "AI Ideas", icon: Lightbulb },
];

const MOCK_NOTIFICATIONS = [
  { id: "1", type: "ping" as const, text: "Priya Patel sent you a ping!", time: "2m ago", read: false },
  { id: "2", type: "team" as const, text: "New message in Team Nexus", time: "15m ago", read: false },
  { id: "3", type: "system" as const, text: "Your profile is 80% complete", time: "1h ago", read: true },
  { id: "4", type: "ping" as const, text: "Luna Zhang accepted your ping", time: "3h ago", read: true },
];

export function Sidebar({ isOpen, onClose, navLinks }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { background, setBackground } = useBackground();

  const [activePanel, setActivePanel] = useState<"nav" | "notifications" | "settings">("nav");
  const [teamsExpanded, setTeamsExpanded] = useState(pathname.startsWith("/teams"));
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  const markRead = (id: string) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));

  const handleLogout = () => {
    logout();
    onClose();
    router.push("/");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm"
          />

          {/* Sidebar Drawer */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 left-0 bottom-0 z-[101] w-80 glass-static border-r border-glass-border flex flex-col"
          >
            {/* Header */}
            <div className="h-16 flex items-center justify-between px-6 border-b border-glass-border/50 shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-purple to-accent-pink flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="text-xl font-bold tracking-tight">
                  Buil<span className="gradient-text">dr</span>
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setActivePanel(activePanel === "notifications" ? "nav" : "notifications")}
                  className={cn("relative p-2 rounded-xl transition-colors cursor-target", activePanel === "notifications" ? "bg-accent-purple/15 text-accent-purple" : "text-text-secondary hover:text-text-primary hover:bg-white/5")}
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-accent-pink text-white text-[9px] font-bold flex items-center justify-center shadow-[0_0_8px_rgba(236,72,153,0.6)]">
                      {unreadCount}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setActivePanel(activePanel === "settings" ? "nav" : "settings")}
                  className={cn("p-2 rounded-xl transition-colors cursor-target", activePanel === "settings" ? "bg-accent-purple/15 text-accent-purple" : "text-text-secondary hover:text-text-primary hover:bg-white/5")}
                >
                  <Settings className="w-5 h-5" />
                </button>
                <button
                  onClick={onClose}
                  className="p-2 text-text-secondary hover:text-text-primary rounded-xl hover:bg-white/5 transition-colors cursor-target"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto no-scrollbar">
              <AnimatePresence mode="wait">
                {/* ===== NAVIGATION PANEL ===== */}
                {activePanel === "nav" && (
                  <motion.div key="nav" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="py-6 px-4 space-y-1">
                    <div className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-3 px-2">Navigation</div>
                    {navLinks.map((link) => {
                      const Icon = link.icon;
                      const isActive = pathname === link.href || (link.href === "/teams" && pathname.startsWith("/teams"));
                      const isTeams = link.label === "Teams";
                      return (
                        <div key={link.href}>
                          <div className="flex items-center">
                            <Link
                              href={link.href}
                              onClick={() => { if (!isTeams) onClose(); }}
                              className={cn(
                                "flex-1 flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 cursor-target",
                                isActive ? "bg-accent-purple/15 text-accent-purple" : "text-text-secondary hover:text-text-primary hover:bg-white/5"
                              )}
                            >
                              <Icon className="w-5 h-5" />
                              {link.label}
                              {link.label === "Pings" && (
                                <span className="ml-auto px-2 py-0.5 rounded-full bg-accent-pink/20 text-accent-pink text-[10px] font-bold">3</span>
                              )}
                            </Link>
                            {isTeams && (
                              <button onClick={() => setTeamsExpanded(!teamsExpanded)} className="p-2 text-text-muted hover:text-text-primary rounded-lg hover:bg-white/5 transition-colors">
                                {teamsExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                              </button>
                            )}
                          </div>
                          {/* Teams Sub-nav */}
                          <AnimatePresence>
                            {isTeams && teamsExpanded && (
                              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="ml-6 mt-1 space-y-0.5 border-l border-glass-border/50 pl-3">
                                <Link href="/teams/1" onClick={onClose} className={cn("flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors", pathname === "/teams/1" ? "text-accent-purple bg-accent-purple/10" : "text-text-muted hover:text-text-secondary hover:bg-white/5")}>
                                  <span className="w-2 h-2 rounded-full bg-accent-emerald animate-pulse" />
                                  Team Nexus
                                </Link>
                                <div className="ml-5 space-y-0.5">
                                  {TEAM_TABS.map(tab => {
                                    const TabIcon = tab.icon;
                                    return (
                                      <Link key={tab.key} href={`/teams/1?tab=${tab.key}`} onClick={onClose} className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] text-text-muted hover:text-text-secondary hover:bg-white/5 transition-colors">
                                        <TabIcon className="w-3.5 h-3.5" />
                                        {tab.label}
                                      </Link>
                                    );
                                  })}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}

                    {/* Quick Actions */}
                    <div className="mt-8 mb-3 px-2 text-[10px] font-bold text-text-muted uppercase tracking-widest">Quick Actions</div>
                    <Link href="/onboarding" onClick={onClose} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-white/5 transition-all">
                      <Heart className="w-5 h-5" /> Edit Builder Persona
                    </Link>
                    <button onClick={() => { setActivePanel("settings"); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-white/5 transition-all">
                      <Palette className="w-5 h-5" /> Change Background
                    </button>
                    <button onClick={() => { setActivePanel("notifications"); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-white/5 transition-all">
                      <Bell className="w-5 h-5" /> Notifications
                      {unreadCount > 0 && <span className="ml-auto px-2 py-0.5 rounded-full bg-accent-pink/20 text-accent-pink text-[10px] font-bold">{unreadCount}</span>}
                    </button>

                    {/* Status */}
                    <div className="mt-8 mb-3 px-2 text-[10px] font-bold text-text-muted uppercase tracking-widest">Platform</div>
                    <div className="px-4 py-3 rounded-xl bg-black/20 border border-white/5 space-y-2">
                      <div className="flex items-center gap-2 text-xs text-text-secondary">
                        <span className="w-2 h-2 rounded-full bg-accent-emerald animate-pulse" />
                        <span className="font-medium">248 builders online</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-text-muted">
                        <Zap className="w-3.5 h-3.5 text-accent-cyan" />
                        <span>12 active hackathons</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-text-muted">
                        <Clock className="w-3.5 h-3.5 text-accent-pink" />
                        <span>37 coding after midnight</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* ===== NOTIFICATIONS PANEL ===== */}
                {activePanel === "notifications" && (
                  <motion.div key="notifications" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="py-4 px-4">
                    <div className="flex items-center justify-between mb-4 px-2">
                      <div className="flex items-center gap-2">
                        <button onClick={() => setActivePanel("nav")} className="p-1 text-text-muted hover:text-text-primary transition-colors"><ChevronRight className="w-4 h-4 rotate-180" /></button>
                        <span className="text-sm font-bold">Notifications</span>
                        {unreadCount > 0 && <span className="px-1.5 py-0.5 rounded-full bg-accent-pink/20 text-accent-pink text-[9px] font-bold">{unreadCount}</span>}
                      </div>
                      {unreadCount > 0 && (
                        <button onClick={markAllRead} className="text-[10px] font-bold text-accent-purple uppercase tracking-wider hover:text-accent-purple/80 transition-colors">Mark all read</button>
                      )}
                    </div>
                    <div className="space-y-1">
                      {notifications.map(n => (
                        <button key={n.id} onClick={() => { markRead(n.id); if (n.type === "ping") { router.push("/pings"); onClose(); } if (n.type === "team") { router.push("/teams/1"); onClose(); } }} className={cn("w-full text-left p-3 rounded-xl transition-all", n.read ? "hover:bg-white/5" : "bg-accent-purple/5 border border-accent-purple/10 hover:bg-accent-purple/10")}>
                          <div className="flex items-start gap-3">
                            <div className={cn("mt-0.5 w-2 h-2 rounded-full shrink-0", n.read ? "bg-transparent" : "bg-accent-pink shadow-[0_0_6px_rgba(236,72,153,0.6)]")} />
                            <div className="flex-1 min-w-0">
                              <p className={cn("text-xs leading-relaxed", n.read ? "text-text-muted" : "text-text-primary font-medium")}>{n.text}</p>
                              <span className="text-[10px] text-text-muted mt-1 block">{n.time}</span>
                            </div>
                            {n.type === "ping" && <Zap className="w-3.5 h-3.5 text-accent-cyan shrink-0 mt-0.5" />}
                            {n.type === "team" && <MessageSquare className="w-3.5 h-3.5 text-accent-emerald shrink-0 mt-0.5" />}
                          </div>
                        </button>
                      ))}
                      {notifications.length === 0 && (
                        <div className="text-center py-8">
                          <Bell className="w-8 h-8 text-text-muted mx-auto mb-2 opacity-50" />
                          <p className="text-sm text-text-muted">No notifications yet</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* ===== SETTINGS PANEL ===== */}
                {activePanel === "settings" && (
                  <motion.div key="settings" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="py-4 px-4">
                    <div className="flex items-center gap-2 mb-6 px-2">
                      <button onClick={() => setActivePanel("nav")} className="p-1 text-text-muted hover:text-text-primary transition-colors"><ChevronRight className="w-4 h-4 rotate-180" /></button>
                      <span className="text-sm font-bold">Settings</span>
                    </div>

                    <div className="space-y-6">
                      {/* Appearance */}
                      <div>
                        <div className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-3 px-2">Appearance</div>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-white/5 transition-colors">
                            <div className="flex items-center gap-3">
                              <Palette className="w-5 h-5 text-accent-purple" />
                              <span className="text-sm text-text-secondary font-medium">Background</span>
                            </div>
                            <select
                              value={background}
                              onChange={(e) => setBackground(e.target.value as BackgroundType)}
                              className="bg-white/5 text-xs text-text-secondary border border-white/10 rounded-lg px-2 py-1.5 focus:outline-none focus:border-accent-purple transition-colors cursor-pointer"
                            >
                              <option value="darkveil">Dark Veil</option>
                              <option value="prism">Prism Core</option>
                              <option value="silk">Neural Silk</option>
                              <option value="default">Dot Grid</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Sound */}
                      <div>
                        <div className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-3 px-2">Sound & Alerts</div>
                        <button onClick={() => setSoundEnabled(!soundEnabled)} className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-white/5 transition-colors">
                          <div className="flex items-center gap-3">
                            {soundEnabled ? <Volume2 className="w-5 h-5 text-accent-emerald" /> : <VolumeX className="w-5 h-5 text-text-muted" />}
                            <span className="text-sm text-text-secondary font-medium">Notification Sounds</span>
                          </div>
                          <div className={cn("w-10 h-6 rounded-full p-1 transition-colors", soundEnabled ? "bg-accent-emerald" : "bg-white/10")}>
                            <motion.div animate={{ x: soundEnabled ? 16 : 0 }} className="w-4 h-4 rounded-full bg-white shadow-sm" />
                          </div>
                        </button>
                      </div>

                      {/* Privacy */}
                      <div>
                        <div className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-3 px-2">Privacy</div>
                        <div className="px-4 py-3 rounded-xl hover:bg-white/5 transition-colors flex items-center gap-3">
                          <Shield className="w-5 h-5 text-accent-cyan" />
                          <div>
                            <span className="text-sm text-text-secondary font-medium block">Online Status</span>
                            <span className="text-[10px] text-text-muted">Visible to other builders</span>
                          </div>
                          <div className="ml-auto w-2 h-2 rounded-full bg-accent-emerald shadow-[0_0_6px_rgba(16,185,129,0.6)]" />
                        </div>
                      </div>

                      {/* Help & About */}
                      <div>
                        <div className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-3 px-2">Help</div>
                        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-white/5 transition-all">
                          <HelpCircle className="w-5 h-5" /> Help & FAQ
                        </button>
                        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-white/5 transition-all">
                          <Keyboard className="w-5 h-5" /> Keyboard Shortcuts
                        </button>
                        <div className="px-4 py-3 rounded-xl text-xs text-text-muted flex items-center justify-between">
                          <span>Buildr v1.0.0</span>
                          <span className="flex items-center gap-1 text-accent-emerald"><Check className="w-3 h-3" /> Up to date</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer / User Profile */}
            <div className="p-4 border-t border-glass-border/50 shrink-0">
              {user ? (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-bg-tertiary/50 border border-glass-border/50">
                  <img src={user.avatar || ""} alt={user.name} className="w-10 h-10 rounded-full bg-bg-tertiary object-cover" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold truncate text-text-primary">{user.name}</div>
                    <div className="text-xs text-text-muted truncate">@{user.username || "builder"}</div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors cursor-target"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <Link href="/login" onClick={onClose}>
                  <GlowButton fullWidth className="cursor-target">Get Started</GlowButton>
                </Link>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
