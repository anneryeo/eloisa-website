"use client";

import { useEffect } from "react";

const SPARKLES = ["✦", "·", "✧"];

export function CursorSparkles() {
  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!finePointer.matches || reducedMotion.matches) return;

    let lastX = 0;
    let lastY = 0;
    let sparkleIndex = 0;

    const onPointerMove = (event: PointerEvent) => {
      const distance = Math.hypot(event.clientX - lastX, event.clientY - lastY);
      if (distance < 18) return;
      lastX = event.clientX;
      lastY = event.clientY;

      const sparkle = document.createElement("span");
      sparkle.className = "cursor-sparkle";
      sparkle.textContent = SPARKLES[sparkleIndex % SPARKLES.length];
      sparkleIndex += 1;
      sparkle.style.left = `${event.clientX}px`;
      sparkle.style.top = `${event.clientY}px`;
      sparkle.style.setProperty("--sparkle-x", `${(sparkleIndex % 3) * 5 - 5}px`);
      document.body.appendChild(sparkle);
      sparkle.addEventListener("animationend", () => sparkle.remove(), {
        once: true,
      });
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", onPointerMove);
  }, []);

  return null;
}
