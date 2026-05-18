"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { GlassCard } from "@/components/shared/glass-card";
import { TESTIMONIALS } from "@/lib/constants";
import { getAvatarUrl } from "@/lib/utils";

export function Testimonials() {
  return (
    <section id="testimonials" className="relative py-24 sm:py-32 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-accent-emerald uppercase tracking-wider">
            Testimonials
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-3 mb-4">
            Loved by <span className="gradient-text">builders</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
            >
              <GlassCard className="p-6 h-full flex flex-col">
                <Quote className="w-8 h-8 text-accent-purple/30 mb-4" />
                <p className="text-text-secondary text-sm leading-relaxed flex-1 mb-6">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <img src={getAvatarUrl(t.avatar)} alt={t.name} className="w-10 h-10 rounded-full bg-bg-tertiary" />
                  <div>
                    <div className="text-sm font-semibold">{t.name}</div>
                    <div className="text-xs text-text-muted">{t.role} · {t.company}</div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
