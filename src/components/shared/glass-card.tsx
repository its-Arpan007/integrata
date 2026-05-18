"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import React, { useRef, useState, type ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: "purple" | "blue" | "cyan" | "pink" | "none";
  onClick?: () => void;
  neonBorder?: boolean;
  spotlightColor?: string;
}

export function GlassCard({
  children,
  className,
  hover = true,
  glow = "none",
  onClick,
  neonBorder = false,
  spotlightColor = "rgba(255, 255, 255, 0.08)",
}: GlassCardProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState<number>(0);

  const glowClass = {
    purple: "glow-purple",
    blue: "glow-blue",
    cyan: "glow-cyan",
    pink: "glow-pink",
    none: "",
  }[glow];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current || isFocused) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleFocus = () => {
    setIsFocused(true);
    setOpacity(0.6);
  };

  const handleBlur = () => {
    setIsFocused(false);
    setOpacity(0);
  };

  const handleMouseEnter = () => {
    setOpacity(0.6);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  return (
    <motion.div
      ref={divRef}
      whileHover={hover ? { y: -4, scale: 1.01 } : undefined}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "rounded-2xl relative overflow-hidden",
        hover ? "glass cursor-pointer" : "glass-static",
        glowClass,
        neonBorder && "neon-border",
        onClick && "cursor-pointer",
        className
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 ease-in-out"
        style={{
          opacity,
          background: `radial-gradient(circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 80%)`,
        }}
      />
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </motion.div>
  );
}
