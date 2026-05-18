"use client";

import React, { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export type BackgroundType = "darkveil" | "prism" | "silk" | "default";

interface BackgroundState {
  background: BackgroundType;
  setBackground: (bg: BackgroundType) => void;
}

const BackgroundContext = createContext<BackgroundState | null>(null);

export function useBackground() {
  const ctx = useContext(BackgroundContext);
  if (!ctx) throw new Error("useBackground must be used within BackgroundProvider");
  return ctx;
}

const STORAGE_KEY = "buildr_background";

export function BackgroundProvider({ children }: { children: ReactNode }) {
  const [background, setBackgroundState] = useState<BackgroundType>("darkveil");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as BackgroundType;
    if (saved && ["darkveil", "prism", "silk", "default"].includes(saved)) {
      setBackgroundState(saved);
    }
    setMounted(true);
  }, []);

  const setBackground = (bg: BackgroundType) => {
    setBackgroundState(bg);
    localStorage.setItem(STORAGE_KEY, bg);
  };

  // Render children even if not mounted to prevent hydration mismatch, 
  // but context will provide the default value.
  return (
    <BackgroundContext.Provider value={{ background, setBackground }}>
      {children}
    </BackgroundContext.Provider>
  );
}
