"use client";

import { useBackground } from "@/providers/background-provider";
import DarkVeil from "./DarkVeil";
import Prism from "./Prism";
import Silk from "./Silk";
import DotGrid from "@/components/DotGrid";

export function BackgroundLayer() {
  const { background } = useBackground();

  return (
    <div className="fixed inset-0 z-[0] pointer-events-none">
      {background === "darkveil" && <DarkVeil />}
      {background === "prism" && <Prism />}
      {background === "silk" && <Silk />}
      {background === "default" && (
        <DotGrid 
          className="w-full h-full opacity-50" 
          baseColor="#2a2a40" 
          activeColor="#c084fc" 
          gap={24}
          dotSize={2}
        />
      )}
    </div>
  );
}
