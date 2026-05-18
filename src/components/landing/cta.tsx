"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { GlowButton } from "@/components/shared/glow-button";

export function CTA() {
  return (
    <section className="relative py-24 sm:py-32 px-4">
      <div className="max-w-4xl mx-auto text-center relative">
        <div className="absolute inset-0 bg-gradient-to-r from-accent-purple/10 via-accent-pink/5 to-accent-blue/10 rounded-3xl blur-3xl" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative glass-static rounded-3xl p-10 sm:p-16"
        >
          <Sparkles className="w-10 h-10 text-accent-purple mx-auto mb-6" />
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Ready to find your <span className="gradient-text">dream team</span>?
          </h2>
          <p className="text-text-secondary text-lg max-w-xl mx-auto mb-8">
            Join thousands of builders already discovering their perfect collaborators on Buildr.
          </p>
          <Link href="/login">
            <GlowButton size="lg" icon={<ArrowRight className="w-5 h-5" />}>
              Get Started — It&apos;s Free
            </GlowButton>
          </Link>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="max-w-6xl mx-auto mt-20 pt-8 border-t border-glass-border">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-text-muted">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-accent-purple to-accent-pink flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
            <span className="font-semibold text-text-secondary">Buildr</span>
          </div>
          <p>© 2024 Buildr. Built with ❤️ for builders.</p>
        </div>
      </div>
    </section>
  );
}
