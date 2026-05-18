"use client";

import { motion } from "framer-motion";
import { UserPlus, Compass, Zap, Rocket } from "lucide-react";
import { HOW_IT_WORKS } from "@/lib/constants";

const icons = [UserPlus, Compass, Zap, Rocket];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-24 sm:py-32 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-20"
        >
          <span className="text-sm font-medium text-accent-cyan uppercase tracking-wider">
            How it works
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-3 mb-4">
            From solo to{" "}
            <span className="gradient-text-cyan">dream team</span> in minutes
          </h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Four simple steps to find the builders you click with.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-8 sm:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-accent-purple via-accent-cyan to-accent-pink hidden sm:block" />

          {HOW_IT_WORKS.map((item, index) => {
            const Icon = icons[index];
            const isLeft = index % 2 === 0;

            return (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: index * 0.15, type: "spring" }}
                className={`relative flex items-center mb-16 last:mb-0 ${
                  isLeft ? "sm:flex-row" : "sm:flex-row-reverse"
                } flex-row`}
              >
                {/* Content */}
                <div
                  className={`flex-1 ${isLeft ? "sm:pr-16 sm:text-right" : "sm:pl-16 sm:text-left"} pl-20 sm:pl-0 text-left`}
                >
                  <span className="text-xs font-mono text-accent-purple uppercase tracking-widest">
                    Step {item.step}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold mt-1 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-text-secondary">{item.description}</p>
                </div>

                {/* Center node */}
                <div className="absolute left-0 sm:left-1/2 sm:-translate-x-1/2 z-10">
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: 10 }}
                    className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-purple to-accent-cyan flex items-center justify-center text-white shadow-lg shadow-accent-purple/25"
                  >
                    <Icon className="w-7 h-7" />
                  </motion.div>
                </div>

                {/* Spacer for other side */}
                <div className="flex-1 hidden sm:block" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
