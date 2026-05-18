"use client";

import { motion } from "framer-motion";

interface FloatingElementsProps {
  count?: number;
}

export function FloatingElements({ count = 5 }: FloatingElementsProps) {
  const orbs = [
    { color: "orb-purple", size: 400, top: "10%", left: "10%", delay: 0 },
    { color: "orb-blue", size: 350, top: "60%", right: "5%", delay: 2 },
    { color: "orb-pink", size: 300, top: "30%", right: "20%", delay: 4 },
    { color: "orb-cyan", size: 250, bottom: "10%", left: "20%", delay: 6 },
    { color: "orb-purple", size: 200, top: "70%", left: "50%", delay: 8 },
    { color: "orb-blue", size: 180, top: "5%", right: "40%", delay: 3 },
    { color: "orb-pink", size: 150, bottom: "30%", right: "35%", delay: 5 },
  ].slice(0, count);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          className={`orb ${orb.color}`}
          style={{
            width: orb.size,
            height: orb.size,
            top: orb.top,
            left: orb.left,
            right: (orb as Record<string, unknown>).right as string | undefined,
            bottom: (orb as Record<string, unknown>).bottom as string | undefined,
          }}
          animate={{
            x: [0, 30, -20, 40, 0],
            y: [0, -40, 20, 30, 0],
            scale: [1, 1.1, 0.95, 1.05, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            delay: orb.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
