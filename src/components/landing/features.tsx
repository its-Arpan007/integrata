"use client";

import { motion } from "framer-motion";
import {
  Brain,
  Dna,
  Heart,
  Sparkles,
  LayoutGrid,
  BarChart3,
} from "lucide-react";
import SpotlightCard from "@/components/SpotlightCard";
import { FEATURES } from "@/lib/constants";

const iconMap: Record<string, React.ReactNode> = {
  brain: <Brain className="w-6 h-6" />,
  dna: <Dna className="w-6 h-6" />,
  heart: <Heart className="w-6 h-6" />,
  sparkles: <Sparkles className="w-6 h-6" />,
  layout: <LayoutGrid className="w-6 h-6" />,
  chart: <BarChart3 className="w-6 h-6" />,
};

export function Features() {
  return (
    <section id="features" className="relative py-24 sm:py-32 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-accent-purple uppercase tracking-wider">
            Features
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-3 mb-4">
            Everything you need to{" "}
            <span className="gradient-text">find your team</span>
          </h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Buildr combines AI intelligence with human chemistry to create the
            best team matchmaking experience.
          </p>
        </motion.div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.1 }}
            >
              <SpotlightCard className="p-6 h-full group">
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  {iconMap[feature.icon]}
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {feature.description}
                </p>
              </SpotlightCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
