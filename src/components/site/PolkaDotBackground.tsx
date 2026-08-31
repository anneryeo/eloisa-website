"use client";

import { useEffect, useRef } from "react";

const SPACING = 24;
const DOT_RADIUS = 1.8;
const CURSOR_RADIUS = 150;

const SHIELD_SELECTOR = [
  ".polka-site h1",
  ".polka-site h2",
  ".polka-site h3",
  ".polka-site p",
  ".polka-site dt",
  ".polka-site dd",
  ".polka-site figure",
  ".polka-site img",
  ".polka-site video",
  ".polka-site iframe",
  ".polka-site button",
  ".polka-site nav",
].join(",");

/**
 * Viewport-level dot texture. Dots soften beneath readable/media surfaces and
 * transition from neutral gray to pink within a circular cursor falloff.
 */
export function PolkaDotBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const finePointer = window.matchMedia("(pointer: fine)");
    let pointerX = -CURSOR_RADIUS * 2;
    let pointerY = -CURSOR_RADIUS * 2;
    let frame = 0;

    const visibleShields = () =>
      Array.from(document.querySelectorAll<HTMLElement>(SHIELD_SELECTOR))
        .map((element) => element.getBoundingClientRect())
        .filter(
          (rect) =>
            rect.width > 0 &&
            rect.height > 0 &&
            rect.bottom >= 0 &&
            rect.right >= 0 &&
            rect.top <= window.innerHeight &&
            rect.left <= window.innerWidth,
        );

    const draw = () => {
      frame = 0;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      const width = window.innerWidth;
      const height = window.innerHeight;
      const pixelWidth = Math.round(width * ratio);
      const pixelHeight = Math.round(height * ratio);
      if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
        canvas.width = pixelWidth;
        canvas.height = pixelHeight;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
      }
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      context.clearRect(0, 0, width, height);

      const shields = visibleShields();
      const cursorActive = finePointer.matches && pointerX >= 0;

      for (let y = SPACING / 2; y < height; y += SPACING) {
        for (let x = SPACING / 2; x < width; x += SPACING) {
          const shielded = shields.some(
            (rect) =>
              x >= rect.left - 8 &&
              x <= rect.right + 8 &&
              y >= rect.top - 6 &&
              y <= rect.bottom + 6,
          );
          const distance = cursorActive
            ? Math.hypot(x - pointerX, y - pointerY)
            : CURSOR_RADIUS;
          const pinkStrength = Math.max(0, 1 - distance / CURSOR_RADIUS) ** 1.6;
          const shieldAlpha = shielded ? 0.22 : 1;

          const red = Math.round(30 + (248 - 30) * pinkStrength);
          const green = Math.round(30 + (73 - 30) * pinkStrength);
          const blue = Math.round(30 + (193 - 30) * pinkStrength);
          const alpha = (0.105 + pinkStrength * 0.48) * shieldAlpha;

          context.beginPath();
          context.arc(x, y, DOT_RADIUS + pinkStrength * 0.45, 0, Math.PI * 2);
          context.fillStyle = `rgba(${red}, ${green}, ${blue}, ${alpha})`;
          context.fill();
        }
      }
    };

    const scheduleDraw = () => {
      if (!frame) frame = window.requestAnimationFrame(draw);
    };
    const onPointerMove = (event: PointerEvent) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      scheduleDraw();
    };
    const onPointerLeave = () => {
      pointerX = -CURSOR_RADIUS * 2;
      pointerY = -CURSOR_RADIUS * 2;
      scheduleDraw();
    };

    draw();
    window.addEventListener("resize", scheduleDraw, { passive: true });
    window.addEventListener("scroll", scheduleDraw, { passive: true });
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onPointerLeave);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", scheduleDraw);
      window.removeEventListener("scroll", scheduleDraw);
      window.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener("pointerleave", onPointerLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0"
    />
  );
}
