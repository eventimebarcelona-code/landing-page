"use client";

import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "framer-motion";
import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";

type CounterProps = {
  value: number;
  suffix?: string;
  style?: CSSProperties;
  className?: string;
};

const EASE_OUT_CUBIC = [0.33, 1, 0.68, 1] as const;

/**
 * Counts up from 0 to `value` the first time it scrolls into view.
 * Replaces the requestAnimationFrame counter from the original design.
 */
export function Counter({ value, suffix = "", style, className }: CounterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const count = useMotionValue(0);
  const text = useTransform(count, (v) => Math.floor(v) + suffix);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      count.set(value);
      return;
    }
    const controls = animate(count, value, {
      duration: 1.5,
      ease: EASE_OUT_CUBIC,
    });
    return () => controls.stop();
  }, [inView, reduce, value, count]);

  return (
    <motion.div ref={ref} className={className} style={style}>
      {text}
    </motion.div>
  );
}
