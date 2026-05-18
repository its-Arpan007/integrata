"use client";

import { cn } from "@/lib/utils";

interface LoadingSkeletonProps {
  className?: string;
  variant?: "text" | "circle" | "card" | "rect";
  count?: number;
}

export function LoadingSkeleton({
  className,
  variant = "text",
  count = 1,
}: LoadingSkeletonProps) {
  const baseClasses = "shimmer rounded-lg bg-white/5";

  const variantClasses = {
    text: "h-4 w-full",
    circle: "h-12 w-12 rounded-full",
    card: "h-48 w-full rounded-2xl",
    rect: "h-8 w-32",
  };

  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={cn(baseClasses, variantClasses[variant], className)}
        />
      ))}
    </div>
  );
}
