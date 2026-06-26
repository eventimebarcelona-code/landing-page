"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import type { CSSProperties, MouseEvent, ReactNode } from "react";

type MagneticProps = {
  href: string;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
};

const SPRING = { stiffness: 250, damping: 18, mass: 0.4 };

/**
 * Anchor that drifts toward the cursor while hovered, springing back on leave.
 * Replaces the per-element mousemove handlers from the original design.
 */
export function Magnetic({ href, children, className, style }: MagneticProps) {
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, SPRING);
  const sy = useSpring(y, SPRING);

  if (reduce) {
    return (
      <a href={href} className={className} style={style}>
        {children}
      </a>
    );
  }

  const onMove = (e: MouseEvent<HTMLAnchorElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    x.set((e.clientX - cx) * 0.28);
    y.set((e.clientY - cy) * 0.4);
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.a
      href={href}
      className={className}
      style={{ ...style, x: sx, y: sy }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {children}
    </motion.a>
  );
}
