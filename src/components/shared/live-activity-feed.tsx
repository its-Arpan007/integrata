"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ACTIVITIES = [
  "🔥 Someone just found a hackathon teammate",
  "⚡ A startup duo just matched",
  "🎨 UI wizard joined from Kolkata",
  "☕ 3 builders are currently active at 2:37 AM",
  "💀 A developer just deployed to prod on a Friday",
  "🚀 New YC application duo formed",
  "🧠 Someone is rewriting their codebase in Rust",
  "🌙 12 night owls are currently swiping",
  "💻 Backend goblin just matched with a Design brain",
];

export function LiveActivityFeed() {
  const [activeToast, setActiveToast] = useState<{ id: number; text: string; top: string; left: string } | null>(null);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let toastId = 0;

    const showNextActivity = () => {
      // Pick random activity
      const text = ACTIVITIES[Math.floor(Math.random() * ACTIVITIES.length)];
      
      // Randomize position across the background (avoid center where the cards are)
      // We will put them on the far left or far right
      const isLeft = Math.random() > 0.5;
      const left = isLeft ? `${10 + Math.random() * 15}%` : `${75 + Math.random() * 15}%`;
      const top = `${20 + Math.random() * 60}%`;

      setActiveToast({ id: toastId++, text, top, left });

      // Hide after 4 seconds
      setTimeout(() => {
        setActiveToast(null);
      }, 4000);

      // Schedule next one between 6 to 12 seconds
      timeoutId = setTimeout(showNextActivity, 6000 + Math.random() * 6000);
    };

    // Start loop
    timeoutId = setTimeout(showNextActivity, 2000);

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[5]">
      <AnimatePresence>
        {activeToast && (
          <motion.div
            key={activeToast.id}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{ top: activeToast.top, left: activeToast.left, position: "absolute" }}
            className="glass-static px-4 py-2 rounded-full border border-glass-border shadow-lg shadow-black/20"
          >
            <p className="text-xs font-medium text-text-secondary whitespace-nowrap">
              {activeToast.text}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
