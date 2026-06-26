"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useReducedMotion } from "framer-motion";

type Orb = {
  color: string;
  size: number;
  opacity: number;
  animation: string;
  top?: string;
  bottom?: string;
  left?: string;
};

const ORBS: Orb[] = [
  { color: "#D4D0C8", size: 800, opacity: 0.8, top: "-8%", left: "-6%", animation: "orbDiagonal 46s ease-in-out infinite" },
  { color: "#C8C4BC", size: 900, opacity: 0.7, top: "8%", left: "52%", animation: "orbCircular 60s linear infinite" },
  { color: "#DEDAD2", size: 600, opacity: 0.9, bottom: "-10%", left: "8%", animation: "orbVertical 36s ease-in-out infinite" },
  { color: "#C8C4BC", size: 700, opacity: 0.7, bottom: "2%", left: "58%", animation: "orbWander 52s ease-in-out infinite" },
  { color: "#D4D0C8", size: 500, opacity: 0.6, top: "34%", left: "24%", animation: "orbSway 40s ease-in-out infinite" },
];

const SHIFT = 0.025; // nearest orb drifts 2.5% of its size toward the cursor

/**
 * Organic "paper texture" background: large soft blobs in warm tones slightly
 * darker than the base, drifting very slowly on their own (pure CSS keyframes).
 * The blob nearest the cursor eases ~2.5% toward it for a subtle gravity feel.
 * Fixed behind all content at z-index 0.
 */
export function AmbientOrbs() {
  const reduce = useReducedMotion();
  const outerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [offsets, setOffsets] = useState(() => ORBS.map(() => ({ x: 0, y: 0 })));

  useEffect(() => {
    if (reduce) return;
    if (!window.matchMedia("(pointer:fine)").matches) return;

    let raf = 0;
    const onMove = (e: MouseEvent) => {
      if (raf) return; // throttle to one update per frame
      const mx = e.clientX;
      const my = e.clientY;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const centers = outerRefs.current.map((el) => {
          if (!el) return null;
          const r = el.getBoundingClientRect();
          return { cx: r.left + r.width / 2, cy: r.top + r.height / 2 };
        });
        let nearest = -1;
        let best = Infinity;
        centers.forEach((c, i) => {
          if (!c) return;
          const d = Math.hypot(c.cx - mx, c.cy - my);
          if (d < best) {
            best = d;
            nearest = i;
          }
        });
        setOffsets(
          ORBS.map((orb, i) => {
            const c = centers[i];
            if (i !== nearest || !c) return { x: 0, y: 0 };
            const dx = mx - c.cx;
            const dy = my - c.cy;
            const dist = Math.hypot(dx, dy) || 1;
            const shift = orb.size * SHIFT;
            return { x: (dx / dist) * shift, y: (dy / dist) * shift };
          })
        );
      });
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reduce]);

  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      {ORBS.map((orb, i) => (
        <div
          key={i}
          ref={(el) => {
            outerRefs.current[i] = el;
          }}
          style={outerStyle(orb)}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              background: orb.color,
              opacity: orb.opacity,
              filter: "blur(140px)",
              transform: `translate(${offsets[i].x}px, ${offsets[i].y}px)`,
              transition: "transform 0.6s ease",
              willChange: "transform",
            }}
          />
        </div>
      ))}
    </div>
  );
}

function outerStyle(orb: Orb): CSSProperties {
  return {
    position: "absolute",
    top: orb.top,
    bottom: orb.bottom,
    left: orb.left,
    width: orb.size,
    height: orb.size,
    willChange: "transform",
    animation: orb.animation,
  };
}
