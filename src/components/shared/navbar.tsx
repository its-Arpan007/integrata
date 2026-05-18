"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Compass,
  Zap,
  Users,
  User,
  Menu,
  X,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { GlowButton } from "./glow-button";
import { useAuth } from "@/providers/auth-provider";
import { Sidebar } from "./sidebar";
import { useBackground, type BackgroundType } from "@/providers/background-provider";

const navLinks = [
  { href: "/discover", label: "Discover", icon: Compass },
  { href: "/pings", label: "Pings", icon: Zap },
  { href: "/teams", label: "Teams", icon: Users },
  { href: "/profile", label: "Profile", icon: User },
];

interface NavbarProps {
  isApp?: boolean;
}

export function Navbar({ isApp = false }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { user } = useAuth();
  const { background, setBackground } = useBackground();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={isApp ? { y: 0 } : { y: -100 }}
        animate={{ y: 0 }}
        transition={isApp ? { duration: 0 } : { type: "spring", stiffness: 100, damping: 20 }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          scrolled || isApp
            ? "glass-static backdrop-blur-xl border-b border-glass-border shadow-lg shadow-black/20"
            : "bg-transparent"
        )}
      >
        <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-2 group">
                <div className="relative">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-purple to-accent-pink flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div className="absolute inset-0 w-8 h-8 rounded-lg bg-gradient-to-br from-accent-purple to-accent-pink opacity-40 blur-lg group-hover:opacity-60 transition-opacity" />
                </div>
                <span className="text-xl font-bold tracking-tight">
                  Buil<span className="gradient-text">dr</span>
                </span>
              </Link>

              {/* Live Status Indicator */}
              {isApp && (
                <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 border border-white/5 backdrop-blur-md">
                  <span className="w-2 h-2 rounded-full bg-accent-emerald animate-pulse" />
                  <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">248 Builders Online</span>
                </div>
              )}
            </div>

            {/* Desktop nav */}
            {isApp ? (
              <div className="hidden md:flex items-center gap-2">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 group",
                        isActive ? "text-white" : "text-text-secondary hover:text-white"
                      )}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="nav-active"
                          className="absolute inset-0 rounded-xl bg-accent-purple/15 border border-accent-purple/30 shadow-[0_0_15px_rgba(139,92,246,0.15)]"
                          initial={false}
                          transition={{ type: "spring", stiffness: 350, damping: 30 }}
                        />
                      )}
                      <Icon className={cn("w-4 h-4 relative z-10 transition-colors", isActive ? "text-accent-purple" : "group-hover:text-accent-purple/70")} />
                      <span className="relative z-10">{link.label}</span>
                      {link.label === "Pings" && (
                        <span className="relative z-10 w-2 h-2 rounded-full bg-accent-pink shadow-[0_0_8px_rgba(236,72,153,0.8)] animate-pulse" />
                      )}
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-6">
                <Link
                  href="#features"
                  className="text-sm text-text-secondary hover:text-text-primary transition-colors"
                >
                  Features
                </Link>
                <Link
                  href="#how-it-works"
                  className="text-sm text-text-secondary hover:text-text-primary transition-colors"
                >
                  How it works
                </Link>
                <Link
                  href="#testimonials"
                  className="text-sm text-text-secondary hover:text-text-primary transition-colors"
                >
                  Testimonials
                </Link>
              </div>
            )}

            {/* CTA / Profile */}
            <div className="hidden md:flex items-center gap-3">
              {/* Background Selector */}
              <div className="mr-2">
                <select 
                  value={background}
                  onChange={(e) => setBackground(e.target.value as BackgroundType)}
                  className="bg-bg-elevated/50 text-xs text-text-secondary border border-white/10 rounded-lg px-2 py-1.5 focus:outline-none focus:border-accent-purple transition-colors cursor-pointer"
                >
                  <option value="darkveil">Dark Veil</option>
                  <option value="prism">Prism Core</option>
                  <option value="silk">Neural Silk</option>
                  <option value="default">Dot Grid</option>
                </select>
              </div>

              {isApp ? (
                <div className="flex items-center gap-3">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full bg-bg-tertiary object-cover" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-purple to-accent-blue flex items-center justify-center text-xs font-bold">
                      {user?.name?.[0]?.toUpperCase() || "U"}
                    </div>
                  )}
                  <button
                    onClick={() => setMobileOpen(true)}
                    className="hidden md:flex p-2 text-text-secondary hover:text-text-primary hover:bg-white/5 rounded-xl transition-colors cursor-target"
                  >
                    <Menu className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <>
                  <Link href="/login">
                    <GlowButton variant="ghost" size="sm">
                      Log in
                    </GlowButton>
                  </Link>
                  <Link href="/login">
                    <GlowButton size="sm">Get Started</GlowButton>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-2 text-text-secondary hover:text-text-primary transition-colors cursor-target"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Universal Sidebar Drawer */}
      <Sidebar 
        isOpen={mobileOpen} 
        onClose={() => setMobileOpen(false)} 
        navLinks={isApp ? navLinks : [
          { href: "#features", label: "Features", icon: Sparkles },
          { href: "#how-it-works", label: "How it works", icon: Compass },
          { href: "#testimonials", label: "Testimonials", icon: Users },
        ]} 
      />
    </>
  );
}
