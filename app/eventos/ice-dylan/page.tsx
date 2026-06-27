import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { AmbientOrbs } from "../../components/AmbientOrbs";
import { Particles } from "../../components/Particles";
import { GrainOverlay } from "../../components/GrainOverlay";
import { Cursor } from "../../components/Cursor";

export const metadata: Metadata = {
  title: "Ya Ice Dilan — Eventime Sound",
  description: "Ya Ice Dilan en directo · 30 AGO 2026 · Downtown, Barcelona.",
};

const SPACE = "var(--font-space), sans-serif";
const BEBAS = "var(--font-bebas), sans-serif";
const MUTED = "rgba(0,0,0,.45)";
const FAINT = "rgba(0,0,0,.25)";
const HAIRLINE = "1px solid rgba(0,0,0,0.08)";

const songs = [
  { n: "01", title: "Dichavate", plays: "83.5M plays" },
  { n: "02", title: "Tienes (Remix)", plays: "16.7M plays" },
  { n: "03", title: "Dame Un AAA (Tita)", plays: "4.3M plays" },
  { n: "04", title: "Dándola", plays: "2.6M plays" },
  { n: "05", title: "P2ta Mia", plays: "2.9M plays" },
  { n: "06", title: "Abusadora", plays: "4.4M plays" },
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

      {/* No nav bar on this page — only a floating back button over the photo */}
      <Link
        href="/"
        style={{
          position: "fixed",
          top: 32,
          left: 32,
          zIndex: 9990,
          color: "#ffffff",
          background: "rgba(0,0,0,0.3)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          padding: "10px 20px",
          borderRadius: 100,
          fontSize: 12,
          fontWeight: 400,
          letterSpacing: "2px",
          textTransform: "uppercase",
          textDecoration: "none",
        }}
      >
        ← Volver
      </Link>

      {/* LEFT — photo, full height */}
      <div
        className="event-photo"
        style={{ position: "fixed", top: 0, left: 0, width: "40%", height: "100vh", zIndex: 1 }}
      >
        <Image
          src="/ICE_DILAN.jpg"
          alt="Ya Ice Dilan"
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
            Ya Ice Dilan
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
              margin: "0 0 28px",
              maxWidth: "62ch",
            }}
          >
            Ya Ice Dilan es un artista cubano de trap y música urbana que ha
            conquistado la escena hispanohablante con su flow directo y su
            carisma arrollador. Desde sus inicios en Cuba hasta consolidarse
            como uno de los nombres más sonados del trap latino, su música
            conecta con una generación que busca autenticidad.
          </p>
          <div
            style={{
              display: "inline-flex",
              fontSize: 13,
              fontWeight: 400,
              letterSpacing: "1px",
              color: MUTED,
              padding: "12px 18px",
              border: HAIRLINE,
              borderRadius: 100,
              marginBottom: 56,
            }}
          >
            30 AGO 2026 · Downtown Barcelona · Puertas 21:00h
          </div>

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
                  {s.plays}
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
