"use client";

import { useEffect, useRef } from "react";

const COUNT = 80;
const DEPTH = 12; // larger, fainter particles for depth

const INFLUENCE = 120; // px radius the cursor pulls particles within
const FORCE = 0.015; // attraction strength toward the cursor
const RETURN = 0.9; // per-frame easing back to the home position

type P = {
  x: number; // home x (drifts/bounces)
  y: number; // home y
  vx: number;
  vy: number;
  ox: number; // cursor-driven offset from home
  oy: number;
  r: number;
  o: number;
  color: string; // "r,g,b"
};

const COLORS = ["10,10,10"]; // #0a0a0a
const rand = (min: number, max: number) => min + Math.random() * (max - min);

/**
 * Fixed full-screen canvas of slow-floating dots behind all content (z-index 0).
 * 80 #0a0a0a particles drift with random velocity and bounce off the viewport
 * edges — no connecting lines. A handful are larger and
 * fainter to suggest depth. Particles within INFLUENCE px of the cursor are
 * gently pulled toward it and ease back home when it leaves. Honors
 * prefers-reduced-motion (single static frame).
 */
export function Particles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(pointer:fine)").matches;
    // Fewer particles and no cursor gravity on mobile (performance).
    const mobile = window.matchMedia("(max-width: 767px)").matches;
    const count = mobile ? 30 : COUNT;
    const depth = mobile ? 5 : DEPTH;

    let width = 0;
    let height = 0;
    let particles: P[] = [];
    // Cursor position; off-screen sentinel means "no attraction".
    const cursor = { x: -9999, y: -9999 };

    const seed = () => {
      particles = Array.from({ length: count }, (_, i) => {
        const isDepth = i < depth;
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          vx: rand(-0.13, 0.13),
          vy: rand(-0.13, 0.13),
          ox: 0,
          oy: 0,
          r: isDepth ? rand(4, 5.5) : rand(1.5, 4),
          o: isDepth ? 0.25 : rand(0.25, 0.5),
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
        };
      });
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (particles.length === 0) seed();
    };

    const paint = () => {
      ctx.clearRect(0, 0, width, height);
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x + p.ox, p.y + p.oy, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color},${p.o})`;
        ctx.fill();
      }
    };

    resize();

    let raf = 0;
    const tick = () => {
      for (const p of particles) {
        // Natural drift of the home position with edge bounce.
        p.x += p.vx;
        p.y += p.vy;
        if (p.x <= 0 || p.x >= width) p.vx *= -1;
        if (p.y <= 0 || p.y >= height) p.vy *= -1;

        // Cursor gravity: pull the rendered point toward the cursor when close.
        const dx = cursor.x - (p.x + p.ox);
        const dy = cursor.y - (p.y + p.oy);
        const dist = Math.hypot(dx, dy);
        if (!mobile && dist < INFLUENCE) {
          const pull = FORCE * (1 - dist / INFLUENCE);
          p.ox += dx * pull;
          p.oy += dy * pull;
        }
        // Ease the offset back to zero (home) every frame.
        p.ox *= RETURN;
        p.oy *= RETURN;
      }
      paint();
      raf = requestAnimationFrame(tick);
    };

    if (reduce) {
      paint();
    } else {
      raf = requestAnimationFrame(tick);
    }

    const onMove = (e: MouseEvent) => {
      cursor.x = e.clientX;
      cursor.y = e.clientY;
    };
    const onLeave = () => {
      cursor.x = -9999;
      cursor.y = -9999;
    };
    if (fine && !reduce && !mobile) {
      window.addEventListener("mousemove", onMove, { passive: true });
      window.addEventListener("mouseout", onLeave, { passive: true });
    }

    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseout", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
}
