"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface GlowButtonProps {
  children: ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
  icon?: ReactNode;
  fullWidth?: boolean;
}

export function GlowButton({
  children,
  className,
  variant = "primary",
  size = "md",
  onClick,
  disabled = false,
  type = "button",
  icon,
  fullWidth = false,
}: GlowButtonProps) {
  const variants = {
    primary:
      "bg-gradient-to-r from-accent-purple to-accent-pink text-white shadow-lg shadow-accent-purple/25 hover:shadow-accent-purple/40 hover:brightness-110",
    secondary:
      "glass text-text-primary hover:bg-glass-bg-hover border border-glass-border hover:border-glass-border-hover",
    ghost:
      "bg-transparent text-text-secondary hover:text-text-primary hover:bg-white/5",
    danger:
      "bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-500/25 hover:shadow-red-500/40",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs gap-1.5",
    md: "px-5 py-2.5 text-sm gap-2",
    lg: "px-7 py-3.5 text-base gap-2.5",
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200",
        variants[variant],
        sizes[size],
        fullWidth && "w-full",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </motion.button>
  );
}
