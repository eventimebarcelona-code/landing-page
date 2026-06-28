"use client";

import {
  animate,
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";

const RING_SPRING = { stiffness: 500, damping: 40, mass: 0.6 };
const SPOT_SPRING = { stiffness: 120, damping: 26, mass: 0.7 };
const SCALE_SPRING = { stiffness: 300, damping: 25 };

const DOT_SIZE = 5;
const RING_SIZE = 28; // resting diameter
const HOVER_SCALE = 52 / RING_SIZE; // 52px on hover

type Ripple = { id: number; x: number; y: number };

/**
 * Custom cursor (dot + trailing ring) and a spotlight glow that follows the
 * pointer. On click a quick ripple fires: two rings expand and fade from the
 * click point while the dot dips to 3px and springs back to 5px.
 */
export function Cursor() {
  const mx = useMotionValue(-100);
  const my = useMotionValue(-100);
  const scale = useMotionValue(1);
  const dotScale = useMotionValue(1);

  // Dot tracks the raw pointer (centered on the dot).
  const dotX = useTransform(mx, (v) => v - DOT_SIZE / 2);
  const dotY = useTransform(my, (v) => v - DOT_SIZE / 2);

  // Ring trails with a spring (centered on the 28px ring).
  const ringSpringX = useSpring(mx, RING_SPRING);
  const ringSpringY = useSpring(my, RING_SPRING);
  const ringX = useTransform(ringSpringX, (v) => v - RING_SIZE / 2);
  const ringY = useTransform(ringSpringY, (v) => v - RING_SIZE / 2);
  const ringScale = useSpring(scale, SCALE_SPRING);

  // Spotlight follows with a softer spring.
  const spotX = useSpring(mx, SPOT_SPRING);
  const spotY = useSpring(my, SPOT_SPRING);
  const spotBg = useMotionTemplate`radial-gradient(600px circle at ${spotX}px ${spotY}px, rgba(0,0,0,0.03) 0%, transparent 70%)`;

  const [ripples, setRipples] = useState<Ripple[]>([]);
  const rippleId = useRef(0);

  useEffect(() => {
    // Center the spotlight on mount (so it isn't off-screen before first move).
    mx.set(window.innerWidth / 2);
    my.set(window.innerHeight / 2);

    const fine = window.matchMedia("(pointer:fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const onMove = (e: MouseEvent) => {
      mx.set(e.clientX);
      my.set(e.clientY);
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    let targets: Element[] = [];
    const enter = () => scale.set(HOVER_SCALE);
    const leave = () => scale.set(1);

    // Click ripple: spawn the rings (CSS-animated, auto-removed via setTimeout)
    // and dip the dot to 3px and back to 5px.
    const onDown = (e: MouseEvent) => {
      const id = rippleId.current++;
      setRipples((r) => [...r, { id, x: e.clientX, y: e.clientY }]);
      window.setTimeout(() => {
        setRipples((r) => r.filter((p) => p.id !== id));
      }, 500);
      animate(dotScale, [1, 0.6, 1], { duration: 0.4, times: [0, 0.18, 1], ease: "easeOut" });
    };

    if (fine) {
      document.body.style.cursor = "none";
      targets = [...document.querySelectorAll("a,button,[data-magnetic]")];
      targets.forEach((t) => {
        t.addEventListener("mouseenter", enter);
        t.addEventListener("mouseleave", leave);
      });
      if (!reduce) window.addEventListener("mousedown", onDown);
    }

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      document.body.style.cursor = "";
      targets.forEach((t) => {
        t.removeEventListener("mouseenter", enter);
        t.removeEventListener("mouseleave", leave);
      });
    };
  }, [mx, my, scale, dotScale]);

  return (
    <>
      <motion.div
        data-spotlight
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          background: spotBg,
        }}
      />

      {/* Click ripples — two rings that expand and fade from the click point. */}
      {ripples.map((r) => (
        <div
          key={r.id}
          aria-hidden
          style={{ position: "fixed", left: r.x, top: r.y, zIndex: 9997, pointerEvents: "none" }}
        >
          <span className="cursor-ripple" />
          <span className="cursor-ripple cursor-ripple-2" />
        </div>
      ))}

      <motion.div
        data-cursor-ring
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: RING_SIZE,
          height: RING_SIZE,
          border: "1px solid rgba(0,0,0,0.4)",
          borderRadius: "50%",
          zIndex: 9998,
          pointerEvents: "none",
          x: ringX,
          y: ringY,
          scale: ringScale,
        }}
      />
      <motion.div
        data-cursor-dot
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: DOT_SIZE,
          height: DOT_SIZE,
          borderRadius: "50%",
          background: "#0a0a0a",
          zIndex: 9999,
          pointerEvents: "none",
          x: dotX,
          y: dotY,
          scale: dotScale,
        }}
      />
    </>
  );
}
