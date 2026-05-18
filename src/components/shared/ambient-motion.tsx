"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

function generateParticles(count: number) {
  return Array.from({ length: count }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 20 + 20,
    delay: Math.random() * 10,
  }));
}

export function AmbientMotion() {
  const [particles, setParticles] = useState<any[]>([]);

  useEffect(() => {
    setParticles(generateParticles(30));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Slow-moving Blur Orbs */}
      <motion.div
        animate={{
          x: ["-10%", "10%", "-10%"],
          y: ["-10%", "10%", "-10%"],
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="absolute top-[10%] left-[20%] w-[500px] h-[500px] rounded-full bg-accent-purple/5 blur-[120px]"
      />
      <motion.div
        animate={{
          x: ["10%", "-10%", "10%"],
          y: ["10%", "-10%", "10%"],
        }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-[10%] right-[20%] w-[600px] h-[600px] rounded-full bg-accent-pink/5 blur-[150px]"
      />

      {/* Network lines (faint grids) */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-[0.02]" />

      {/* Drifting Neon Particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ x: `${p.x}vw`, y: `${p.y}vh`, opacity: 0 }}
          animate={{
            y: [`${p.y}vh`, `${p.y - 20}vh`],
            opacity: [0, 0.4, 0],
            scale: [0.5, 1, 0.5],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "linear",
          }}
          className="absolute rounded-full bg-accent-cyan shadow-[0_0_10px_rgba(6,182,212,0.5)]"
          style={{ width: p.size, height: p.size }}
        />
      ))}
    </div>
  );
}
