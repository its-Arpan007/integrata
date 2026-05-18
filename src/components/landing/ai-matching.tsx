"use client";

import { motion } from "framer-motion";

const dimensions = [
  { name: "Technical Synergy", score: 92, color: "from-purple-500 to-violet-500" },
  { name: "Work Style Match", score: 87, color: "from-cyan-500 to-blue-500" },
  { name: "Communication", score: 94, color: "from-pink-500 to-rose-500" },
  { name: "Goal Alignment", score: 89, color: "from-emerald-500 to-green-500" },
  { name: "Creative Energy", score: 96, color: "from-orange-500 to-yellow-500" },
];

export function AIMatching() {
  return (
    <section className="relative py-24 sm:py-32 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <span className="text-sm font-medium text-accent-pink uppercase tracking-wider">
              AI Engine
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-3 mb-6">
              Chemistry, <span className="gradient-text">analyzed</span>
            </h2>
            <p className="text-text-secondary text-lg mb-8 leading-relaxed">
              Our AI doesn&apos;t just match skills — it analyzes personality, work
              style, communication patterns, and ambition to find people
              you&apos;ll genuinely enjoy building with.
            </p>

            <div className="space-y-2 mb-8">
              {[
                "Personality-based compatibility scoring",
                "Work style & communication analysis",
                "AI-generated icebreakers & project ideas",
                "Dynamic team role suggestions",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent-purple" />
                  <span className="text-text-secondary text-sm">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: Compatibility Preview */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-accent-purple/10 to-accent-pink/10 rounded-3xl blur-3xl" />
            <div className="relative glass-static rounded-3xl p-6 sm:p-8">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-purple/30 to-accent-pink/30 flex items-center justify-center">
                    🧠
                  </div>
                  <div>
                    <div className="text-sm font-semibold">
                      Compatibility Analysis
                    </div>
                    <div className="text-xs text-text-muted">
                      You × Alex Rivera
                    </div>
                  </div>
                </div>
                <div className="text-2xl font-bold gradient-text">91%</div>
              </div>

              {/* Bars */}
              <div className="space-y-4">
                {dimensions.map((dim, i) => (
                  <motion.div
                    key={dim.name}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs text-text-secondary">
                        {dim.name}
                      </span>
                      <span className="text-xs font-mono text-text-muted">
                        {dim.score}%
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${dim.score}%` }}
                        viewport={{ once: true }}
                        transition={{
                          delay: 0.3 + i * 0.1,
                          duration: 1,
                          ease: "easeOut",
                        }}
                        className={`h-full rounded-full bg-gradient-to-r ${dim.color}`}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* AI Insight */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8 }}
                className="mt-6 p-4 rounded-xl bg-accent-purple/5 border border-accent-purple/10"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs">✨</span>
                  <span className="text-xs font-medium text-accent-purple">
                    AI Insight
                  </span>
                </div>
                <p className="text-xs text-text-secondary leading-relaxed">
                  &ldquo;You both thrive in fast-paced environments and share a passion
                  for AI. Alex&apos;s full-stack skills complement your ML expertise
                  perfectly.&rdquo;
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
