"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles, Users, Zap } from "lucide-react";
import { GlowButton } from "@/components/shared/glow-button";
import { TypingEffect } from "@/components/shared/typing-effect";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 pt-16 overflow-hidden">
      <div className="max-w-5xl mx-auto text-center relative z-10">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-static text-sm text-text-secondary mb-8"
        >
          <Sparkles className="w-4 h-4 text-accent-purple" />
          <span>AI-Powered Builder Matchmaking</span>
          <span className="w-1.5 h-1.5 rounded-full bg-accent-emerald animate-pulse" />
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 80 }}
          className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6"
        >
          Find Your Perfect
          <br />
          <span className="gradient-text">Builder Team.</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto mb-4 leading-relaxed"
        >
          Buildr helps developers, designers, and founders discover teammates
          based on{" "}
          <span className="text-text-primary font-medium">chemistry</span>,{" "}
          <span className="text-text-primary font-medium">ambition</span>, and{" "}
          <span className="text-text-primary font-medium">work style</span>.
        </motion.p>

        {/* Typing effect */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-text-muted text-sm sm:text-base mb-10 h-6"
        >
          <TypingEffect
            texts={[
              "Match with AI engineers for your next hackathon",
              "Find a co-founder who complements your skills",
              "Build side projects with night owls like you",
              "Discover designers who ship as fast as you code",
            ]}
            speed={40}
            pauseTime={2500}
          />
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/login">
            <GlowButton size="lg" icon={<Zap className="w-5 h-5" />}>
              Start Building
              <ArrowRight className="w-4 h-4 ml-1" />
            </GlowButton>
          </Link>
          <Link href="/discover">
            <GlowButton
              variant="secondary"
              size="lg"
              icon={<Users className="w-5 h-5" />}
            >
              Explore Builders
            </GlowButton>
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="flex items-center justify-center gap-8 sm:gap-12 mt-16"
        >
          {[
            { value: "2.4K+", label: "Builders" },
            { value: "890+", label: "Teams Formed" },
            { value: "95%", label: "Match Rate" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl sm:text-3xl font-bold gradient-text">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm text-text-muted mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Preview cards floating */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, type: "spring", stiffness: 60 }}
          className="mt-20 relative"
        >
          <div className="relative max-w-3xl mx-auto">
            {/* Background glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-accent-purple/20 via-accent-pink/10 to-accent-blue/20 rounded-3xl blur-3xl" />

            {/* Main preview card */}
            <div className="relative glass-static rounded-3xl p-6 sm:p-8">
              <div className="flex items-start gap-4 sm:gap-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-accent-purple/30 to-accent-pink/30 flex items-center justify-center text-2xl shrink-0">
                  🚀
                </div>
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg font-semibold">Alex Rivera</span>
                    <span className="w-2 h-2 rounded-full bg-accent-emerald" />
                    <span className="text-xs text-text-muted">Online</span>
                  </div>
                  <p className="text-sm text-text-secondary mb-3">
                    Full-stack dev obsessed with building delightful products.
                    Currently exploring AI agents.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {["React", "AI/ML", "TypeScript"].map((skill) => (
                      <span
                        key={skill}
                        className="px-2.5 py-1 rounded-lg bg-accent-purple/10 text-accent-purple text-xs font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent-emerald/10 text-accent-emerald text-xs font-medium">
                      <span className="relative flex h-2 w-2">
                        <span className="pulse-ring absolute inline-flex h-full w-full rounded-full bg-accent-emerald opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-emerald" />
                      </span>
                      92% Compatible
                    </div>
                    <span className="text-xs text-text-muted">
                      ⚡ Fast Shipper · 🌙 Night Owl
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating mini cards */}
            <motion.div
              animate={{ y: [-5, 5, -5] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-4 -right-4 sm:right-8 glass-static rounded-xl p-3 text-xs"
            >
              <span className="text-accent-pink">🤖</span> AI Match Found!
            </motion.div>

            <motion.div
              animate={{ y: [5, -5, 5] }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
              className="absolute -bottom-3 -left-2 sm:left-12 glass-static rounded-xl p-3 text-xs"
            >
              <span className="text-accent-cyan">⚡</span> Ping sent!
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
