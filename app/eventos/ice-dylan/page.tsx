import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { AmbientOrbs } from "../../components/AmbientOrbs";
import { Particles } from "../../components/Particles";
import { GrainOverlay } from "../../components/GrainOverlay";
import { Cursor } from "../../components/Cursor";

export const metadata: Metadata = {
  title: "Ice Dylan — Eventime Sound",
  description: "Ice Dylan en directo · 30 AGO 2026 · Downtown, Barcelona.",
};

const SPACE = "var(--font-space), sans-serif";
const BEBAS = "var(--font-bebas), sans-serif";
const MUTED = "rgba(0,0,0,.45)";
const FAINT = "rgba(0,0,0,.25)";
const HAIRLINE = "1px solid rgba(0,0,0,0.08)";

const songs = [
  { n: "01", title: "BZRP Music Sessions #45", time: "3:12" },
  { n: "02", title: "Solo", time: "2:58" },
  { n: "03", title: "Mentirosa", time: "3:24" },
  { n: "04", title: "No Me Falles", time: "2:47" },
  { n: "05", title: "Freestyle", time: "4:01" },
];

const eyebrow: CSSProperties = {
  fontSize: 10,
  fontWeight: 500,
  letterSpacing: "5px",
  color: FAINT,
  textTransform: "uppercase",
  marginBottom: 20,
};

const sectionLabel: CSSProperties = {
  ...eyebrow,
  color: MUTED,
  marginBottom: 24,
};

export default function IceDylanPage() {
  return (
    <div
      className="event-root"
      style={{
        position: "relative",
        height: "100vh",
        overflowY: "auto",
        overflowX: "hidden",
        background: "#F2F0EB",
        color: "#0a0a0a",
        fontFamily: "var(--font-manrope), sans-serif",
        fontWeight: 300,
        lineHeight: 1.5,
      }}
    >
      <AmbientOrbs />
      <Particles />
      <GrainOverlay />
      <Cursor />

      {/* NAV — transparent, back link top-left */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 900,
          padding: "16px clamp(24px,6vw,80px)",
          background: "transparent",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
        }}
      >
        <Link
          href="/"
          className="nav-link"
          style={{ fontSize: 11, fontWeight: 400, letterSpacing: "2px", textDecoration: "none" }}
        >
          ← Volver
        </Link>
      </nav>

      {/* LEFT — photo, full height */}
      <div
        className="event-photo"
        style={{ position: "fixed", top: 0, left: 0, width: "40%", height: "100vh", zIndex: 1 }}
      >
        <Image
          src="/ICE_DILAN.jpg"
          alt="Ice Dylan"
          fill
          priority
          sizes="(max-width: 860px) 100vw, 40vw"
          style={{ objectFit: "cover" }}
        />
      </div>

      {/* RIGHT — content (scrolls within the page) */}
      <div
        className="event-content"
        style={{
          position: "relative",
          zIndex: 2,
          marginLeft: "40%",
          width: "60%",
          minHeight: "100vh",
          padding: "clamp(96px,12vh,120px) 80px 80px",
          boxSizing: "border-box",
        }}
      >
        <div style={{ maxWidth: 720 }}>
          <div style={eyebrow}>30 AGO 2026 · BARCELONA</div>
          <h1
            style={{
              fontFamily: BEBAS,
              fontWeight: 400,
              fontSize: "clamp(72px,10vw,150px)",
              lineHeight: 0.9,
              letterSpacing: ".01em",
              margin: 0,
              color: "#0a0a0a",
            }}
          >
            Ice Dylan
          </h1>
          <div style={{ fontSize: 18, fontWeight: 300, color: MUTED, marginTop: 10 }}>
            Downtown · Barcelona
          </div>

          <hr style={{ border: 0, borderTop: HAIRLINE, margin: "44px 0" }} />

          {/* Sobre el artista */}
          <h2 style={sectionLabel}>Sobre el artista</h2>
          <p
            style={{
              fontSize: 16,
              fontWeight: 300,
              color: "#0a0a0a",
              lineHeight: 1.75,
              margin: "0 0 56px",
              maxWidth: "62ch",
            }}
          >
            Ice Dylan es uno de los raperos urbanos más explosivos del momento.
            Conocido por su flow directo, sus letras callejeras y una energía en
            directo que arrastra a cualquier crowd. Criado entre las calles de
            Madrid, su música mezcla trap, drill y rap español con una
            autenticidad que lo ha llevado a ser uno de los nombres más buscados
            de la escena.
          </p>

          {/* Canciones destacadas */}
          <h2 style={sectionLabel}>Canciones destacadas</h2>
          <div style={{ marginBottom: 56 }}>
            {songs.map((s) => (
              <div
                key={s.n}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 24,
                  padding: "18px 0",
                  borderTop: HAIRLINE,
                }}
              >
                <div style={{ display: "flex", alignItems: "baseline", gap: 20, minWidth: 0 }}>
                  <span style={{ fontFamily: SPACE, fontSize: 13, color: FAINT, width: 22, flexShrink: 0 }}>
                    {s.n}
                  </span>
                  <span style={{ fontSize: 16, fontWeight: 400, color: "#0a0a0a" }}>{s.title}</span>
                </div>
                <span
                  style={{ fontSize: 14, color: MUTED, fontVariantNumeric: "tabular-nums", flexShrink: 0 }}
                >
                  {s.time}
                </span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <a
            href="#"
            className="contact-cta"
            style={{
              display: "inline-block",
              fontSize: 16,
              fontWeight: 500,
              color: "#F0EEE8",
              textDecoration: "none",
              padding: "18px 40px",
              borderRadius: 100,
              background: "#0a0a0a",
            }}
          >
            Comprar entradas
          </a>
        </div>
      </div>
    </div>
  );
}
