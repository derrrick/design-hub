"use client";

import { useEffect, type ReactNode } from "react";

import { SensoryUIProvider, useSensoryUI } from "@/components/sensory-ui/config/provider";

const INTERACTIVE = "a[href], button";

// Hover and click sounds for every link and button, wired once at the document
// level so pages don't need to opt in. Sound pack and volume are set below.
// sensory-ui stays silent when the visitor prefers reduced motion.
function Listeners() {
  const { playSound } = useSensoryUI();

  useEffect(() => {
    let hovered: Element | null = null;

    function onOver(event: PointerEvent) {
      if (event.pointerType !== "mouse") return;
      const target = (event.target as Element | null)?.closest(INTERACTIVE) ?? null;
      if (target === hovered) return;
      hovered = target;
      if (target) void playSound("interaction.subtle", { volume: 0.5 });
    }

    function onClick(event: MouseEvent) {
      const target = (event.target as Element | null)?.closest(INTERACTIVE);
      if (!target) return;
      void playSound(target.classList.contains("toggle") ? "interaction.toggle" : "interaction.tap");
    }

    document.addEventListener("pointerover", onOver);
    document.addEventListener("click", onClick, true);
    return () => {
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("click", onClick, true);
    };
  }, [playSound]);

  return null;
}

export function SoundLayer({ children }: { children: ReactNode }) {
  return (
    <SensoryUIProvider config={{ theme: "minimal", volume: 0.25 }}>
      <Listeners />
      {children}
    </SensoryUIProvider>
  );
}
