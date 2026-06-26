"use client";

import { motion, useReducedMotion, type TargetAndTransition } from "framer-motion";
import type { CSSProperties, ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  /** Delay before the reveal starts, in milliseconds (matches the original data-delay). */
  delay?: number;
  whileHover?: TargetAndTransition;
  className?: string;
  style?: CSSProperties;
  id?: string;
};

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Fade + rise reveal driven by the element entering the viewport.
 * Replaces the IntersectionObserver-based reveals from the original design.
 */
export function Reveal({ children, delay = 0, whileHover, className, style, id }: RevealProps) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      id={id}
      className={className}
      style={style}
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.14 }}
      transition={{ duration: 0.7, ease: EASE, delay: delay / 1000 }}
      whileHover={reduce ? undefined : whileHover}
    >
      {children}
    </motion.div>
  );
}
