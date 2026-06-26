"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

const SECTIONS = [
  { id: "top", label: "Inicio" },
  { id: "eventos", label: "Eventos" },
  { id: "galeria", label: "Galería" },
  { id: "servicios", label: "Servicios" },
  { id: "nosotros", label: "Nosotros" },
  { id: "contacto", label: "Contacto" },
] as const;

const ACTIVE = "#0a0a0a";
const INACTIVE = "rgba(0,0,0,0.2)";

/**
 * Fixed vertical dot navigation, one dot per snap section. The dot of the
 * section crossing the viewport center lights up in #0a0a0a. Clicking a dot
 * scrolls (snaps) to that section.
 */
export function ScrollDots() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState<string>("top");

  useEffect(() => {
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter(
      (el): el is HTMLElement => el !== null
    );
    // The page scrolls inside #scroll-root, so observe against that container.
    const root = document.getElementById("scroll-root");
    // Shrink the observer root to a thin line at the vertical center: the
    // section crossing that line is the active one.
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { root, rootMargin: "-50% 0px -50% 0px", threshold: 0 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const go = (id: string) => {
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <nav
      aria-label="Secciones"
      className="scroll-dots"
      style={{
        position: "fixed",
        right: "clamp(14px,2vw,30px)",
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 950,
        display: "flex",
        flexDirection: "column",
        gap: 16,
        alignItems: "flex-end",
      }}
    >
      {SECTIONS.map((s) => {
        const isActive = active === s.id;
        return (
          <button
            key={s.id}
            type="button"
            onClick={() => go(s.id)}
            aria-label={s.label}
            aria-current={isActive ? "true" : undefined}
            className="scroll-dot"
          >
            <span className="scroll-dot-label">{s.label}</span>
            <motion.span
              className="scroll-dot-mark"
              animate={{
                backgroundColor: isActive ? ACTIVE : INACTIVE,
                scale: isActive ? 1.45 : 1,
                boxShadow: isActive
                  ? "0 0 10px rgba(0,0,0,0.25)"
                  : "0 0 0 rgba(0,0,0,0)",
              }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            />
          </button>
        );
      })}
    </nav>
  );
}
