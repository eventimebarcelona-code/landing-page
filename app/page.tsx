"use client";

import Image from "next/image";
import { useRef, useState, type CSSProperties } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { Reveal } from "./components/Reveal";
import { Counter } from "./components/Counter";
import { Magnetic } from "./components/Magnetic";
import { Cursor } from "./components/Cursor";
import { ScrollDots } from "./components/ScrollDots";
import { AmbientOrbs } from "./components/AmbientOrbs";
import { Particles } from "./components/Particles";
import { GrainOverlay } from "./components/GrainOverlay";

const events = [
  { date: "30 AGO", name: "Ice Dylan", venue: "Downtown · Barcelona", status: "Entradas" },
];

const services = [
  { num: "01", title: "Producción de directo", desc: "Escenario, montaje, logística y dirección técnica.", delay: 0 },
  { num: "02", title: "Booking & line-up", desc: "Artistas que encajan con tu público y tu presupuesto.", delay: 80 },
  { num: "03", title: "Sonido e iluminación", desc: "Audio y luces a la altura de cualquier festival.", delay: 160 },
  { num: "04", title: "Streaming en vivo", desc: "Multicámara, realización y emisión en tiempo real.", delay: 240 },
];

const stats = [
  { value: 250, suffix: "+", label: "Eventos" },
  { value: 80, suffix: "+", label: "Artistas" },
  { value: 8, suffix: "", label: "Años" },
];

const gallery = [
  { label: "Aftermovie", span: { gridColumn: "span 2", gridRow: "span 2" }, delay: 0 },
  { label: "Público", span: { gridColumn: "span 2" }, delay: 80 },
  { label: "Escenario", span: {}, delay: 160 },
  { label: "Luces", span: {}, delay: 220 },
];

const navLinks = [
  ["#eventos", "Eventos"],
  ["#galeria", "Galería"],
  ["#servicios", "Servicios"],
  ["#nosotros", "Nosotros"],
];

const footerLinks = [
  ["mailto:hola@eventimesound.com", "Email"],
  ["#", "Instagram"],
  ["#", "TikTok"],
  ["#", "Spotify"],
];

const TICKER_ITEMS = ["LIVE", "CONCIERTOS", "FESTIVALES", "SONIDO", "LUCES", "DIRECTO"];

// One pass of the marquee content; the dim words are separated by #0a0a0a ✦ dots.
function tickerInner() {
  return TICKER_ITEMS.map((w) => (
    <span key={w}>
      {" "}
      {w}
      {" "}
      <span style={{ color: "#0a0a0a" }}>✦</span>
    </span>
  ));
}

// ---------- Design tokens ----------
const SPACE = "var(--font-space), sans-serif";
const BEBAS = "var(--font-bebas), sans-serif";
const PAD = "clamp(24px,6vw,80px)";
const CARD_BG = "#EAE7E0"; // card surface on the #F2F0EB base
const CARD_BORDER = "0.5px solid rgba(0,0,0,.07)";
const BORDER = "0.5px solid rgba(0,0,0,.06)";
const HAIRLINE = "0.5px solid rgba(0,0,0,.06)"; // nav / footer / ticker separators
const SURFACE = "#EAE7E0"; // footer + ticker surface
const MUTED = "rgba(0,0,0,.45)";
const FAINT = "rgba(0,0,0,.25)";
// Alternating section tints: odd sections show the base #F2F0EB, even sections
// are darkened ~3% so they read a touch deeper while letting the grain/orbs show through.
const EVEN_BG = "rgba(0,0,0,0.03)";

export default function Home() {
  const reduce = useReducedMotion();
  const scrollRef = useRef<HTMLDivElement>(null);
  // The main wrapper is the scroll container, so useScroll must target it
  // (not the window) for the progress bar, nav blur and hero parallax.
  const { scrollY, scrollYProgress } = useScroll({ container: scrollRef });

  const [scrolled, setScrolled] = useState(false);
  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 40));

  const bgY = useTransform(scrollY, (v) => (reduce ? 0 : v * 0.35));
  const contentY = useTransform(scrollY, (v) => (reduce ? 0 : v * 0.14));
  const contentOpacity = useTransform(
    scrollY,
    [0, 620],
    reduce ? [1, 1] : [1, 0]
  );

  return (
    <div
      ref={scrollRef}
      id="scroll-root"
      className="scroll-root"
      style={{
        position: "relative",
        background: "#F2F0EB",
        color: "#0a0a0a",
        fontFamily: "var(--font-manrope), sans-serif",
        fontWeight: 300,
        height: "100vh",
        overflowY: "scroll",
        overflowX: "hidden",
        scrollSnapType: "y mandatory",
        scrollBehavior: "smooth",
        lineHeight: 1.5,
      }}
    >
      <AmbientOrbs />
      <Particles />
      <GrainOverlay />
      <Cursor />
      <ScrollDots />

      <motion.div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: 2,
          width: "100%",
          transformOrigin: "0% 50%",
          scaleX: scrollYProgress,
          background: "#0a0a0a",
          zIndex: 9997,
        }}
      />

      {/* NAV */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 900,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: `16px ${PAD}`,
          borderBottom: scrolled ? HAIRLINE : "0.5px solid transparent",
          background: scrolled ? "rgba(242,240,235,.85)" : "transparent",
          backdropFilter: scrolled ? "blur(16px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(16px)" : "none",
          transition: "background .3s ease,border-color .3s ease",
        }}
      >
        <a href="#top" style={brandStyle}>
          <Image src="/EVENTIME sound LOGO.png" alt="Eventime Sound" height={36} width={150} priority />
        </a>
        <div style={{ display: "flex", alignItems: "center", gap: "clamp(20px,3vw,40px)" }}>
          <div className="nav-links" style={navLinkRow}>
            {navLinks.map(([href, label]) => (
              <a key={href} href={href} className="nav-link">
                {label}
              </a>
            ))}
          </div>
          <Magnetic
            href="#contacto"
            className="nav-link"
            style={{ fontSize: 11, fontWeight: 400, letterSpacing: "2px", textDecoration: "none" }}
          >
            Contacto
          </Magnetic>
        </div>
      </nav>

      {/* HERO */}
      <header
        id="top"
        style={{
          position: "relative",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: `100px ${PAD} 110px`,
          overflow: "hidden",
          scrollSnapAlign: "start",
          scrollSnapStop: "always",
        }}
      >
        <motion.div style={{ position: "absolute", inset: "-10%", zIndex: 0, pointerEvents: "none", y: bgY }}>
          <div style={blob("#0a0a0a", { top: "-5%", left: "-8%", width: 640, height: 640, opacity: 0.05, animation: "drift1 19s ease-in-out infinite" })} />
          <div style={blob("#0a0a0a", { top: "10%", right: "-10%", width: 600, height: 600, opacity: 0.04, animation: "drift2 23s ease-in-out infinite" })} />
          <div style={blob("#0a0a0a", { bottom: "-15%", left: "30%", width: 560, height: 560, opacity: 0.04, animation: "drift3 21s ease-in-out infinite" })} />
        </motion.div>
        <motion.div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center", y: contentY, opacity: contentOpacity }}>
          <div style={{ ...eyebrow(), marginBottom: 34 }}>Productora de eventos en directo</div>
          <h1
            style={{
              fontFamily: SPACE,
              fontWeight: 600,
              fontSize: "clamp(54px,12vw,160px)",
              lineHeight: 0.88,
              letterSpacing: "-.04em",
              margin: 0,
              color: "#0a0a0a",
              textWrap: "balance",
            }}
          >
            <span style={{ display: "block" }}>EVENTIME</span>
            <span style={{ display: "block", color: "rgba(0,0,0,.45)" }}>SOUND</span>
          </h1>
          <p
            style={{
              maxWidth: 440,
              fontSize: "clamp(15px,2vw,18px)",
              fontWeight: 300,
              color: MUTED,
              margin: "32px 0 0",
              lineHeight: 1.6,
              textWrap: "pretty",
            }}
          >
            Producción, sonido y line-ups que hacen vibrar a miles de personas.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "center", marginTop: 44 }}>
            <Magnetic
              href="#eventos"
              className="btn-grad"
              style={{
                fontSize: 15,
                fontWeight: 500,
                color: "#F0EEE8",
                textDecoration: "none",
                padding: "15px 30px",
                borderRadius: 100,
                background: "#0a0a0a",
              }}
            >
              Próximos eventos
            </Magnetic>
            <Magnetic
              href="#contacto"
              className="btn-ghost"
              style={{
                fontSize: 15,
                fontWeight: 500,
                color: "#0a0a0a",
                textDecoration: "none",
                padding: "15px 30px",
                borderRadius: 100,
                border: "1px solid rgba(0,0,0,.15)",
              }}
            >
              Reserva tu evento
            </Magnetic>
          </div>
        </motion.div>

        {/* MARQUEE (banda inferior del hero) */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 2,
            background: "#E6E3DC",
            borderTop: HAIRLINE,
            borderBottom: HAIRLINE,
            padding: "18px 0",
            overflow: "hidden",
            whiteSpace: "nowrap",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              gap: 56,
              fontFamily: SPACE,
              fontWeight: 500,
              fontSize: "clamp(18px,3vw,34px)",
              letterSpacing: ".04em",
              color: "rgba(0,0,0,.2)",
              animation: "marquee 24s linear infinite",
              willChange: "transform",
            }}
          >
            <span>{tickerInner()}</span>
            <span>{tickerInner()}</span>
          </div>
        </div>
      </header>

      {/* EVENTOS */}
      <section id="eventos" style={{ ...sectionStyle, background: EVEN_BG }}>
        <div style={contentWrap}>
          <Reveal
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 24,
              marginBottom: HEADER_MB,
            }}
          >
            <div>
              <div style={eyebrow()}>Agenda 2026</div>
              <h2 style={sectionTitle}>Próximos eventos</h2>
            </div>
            <a
              href="#contacto"
              className="link-underline"
              style={{
                color: MUTED,
                textDecoration: "none",
                fontSize: 13,
                fontWeight: 400,
                borderBottom: "1px solid rgba(0,0,0,.15)",
                paddingBottom: 4,
              }}
            >
              Ver agenda completa →
            </a>
          </Reveal>

          <div className="events-grid" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {events.map((ev, i) => (
              <Reveal
                key={ev.name}
                delay={i * 80}
                whileHover={{ y: -4 }}
                className="service-card"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: 32,
                  padding: 40,
                  border: CARD_BORDER,
                  borderRadius: 16,
                  background: CARD_BG,
                }}
              >
                <div>
                  <div style={{ ...microLabel, marginBottom: 16 }}>{ev.date}</div>
                  <div style={{ fontFamily: SPACE, fontWeight: 600, fontSize: "clamp(26px,3vw,42px)", letterSpacing: "-.02em", lineHeight: 1, color: "#0a0a0a" }}>
                    {ev.name}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 14, fontWeight: 300, color: MUTED, marginBottom: 12 }}>{ev.venue}</div>
                  <span style={microLabel}>{ev.status}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* GALERIA */}
      <section id="galeria" style={sectionStyle}>
        <div style={contentWrap}>
          <Reveal style={{ marginBottom: HEADER_MB }}>
            <div style={eyebrow()}>En directo</div>
            <h2 style={sectionTitle}>Galería</h2>
          </Reveal>
          <div
            className="gallery-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4,1fr)",
              gridAutoRows: "clamp(130px,18vh,190px)",
              gap: 1,
            }}
          >
            {gallery.map((g) => (
              <Reveal
                key={g.label}
                delay={g.delay}
                className="gallery-tile"
                style={{ ...galleryTile, ...g.span }}
              >
                <span style={tileLabel}>{g.label}</span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICIOS */}
      <section id="servicios" style={{ ...sectionStyle, background: EVEN_BG }}>
        <div style={contentWrap}>
          <Reveal style={{ marginBottom: HEADER_MB }}>
            <div style={eyebrow()}>Qué hacemos</div>
            <h2 style={{ ...sectionTitle, maxWidth: "16ch", textWrap: "balance" }}>
              Todo el directo, de principio a fin
            </h2>
          </Reveal>
          <div className="services-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 16 }}>
            {services.map((sv) => (
              <Reveal
                key={sv.num}
                delay={sv.delay}
                whileHover={{ y: -4 }}
                className="service-card"
                style={{ padding: 40, border: CARD_BORDER, borderRadius: 16, background: CARD_BG }}
              >
                <div style={{ fontFamily: SPACE, fontWeight: 500, fontSize: 13, letterSpacing: ".1em", color: FAINT, marginBottom: 24 }}>
                  {sv.num}
                </div>
                <h3 style={{ fontFamily: SPACE, fontWeight: 600, fontSize: 20, letterSpacing: "-.01em", margin: "0 0 12px", color: "#0a0a0a" }}>
                  {sv.title}
                </h3>
                <p style={{ fontSize: 14, fontWeight: 300, color: MUTED, margin: 0, lineHeight: 1.6 }}>{sv.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* NOSOTROS */}
      <section id="nosotros" style={{ ...sectionStyle, background: SURFACE }}>
        <div style={contentWrap}>
          <div
            className="about-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "1.3fr 1fr",
              gap: "clamp(40px,6vw,80px)",
              alignItems: "center",
            }}
          >
            <Reveal>
              <div style={{ ...eyebrow(), marginBottom: 28 }}>Sobre nosotros</div>
              <p style={{ fontFamily: SPACE, fontWeight: 500, fontSize: "clamp(24px,3vw,38px)", lineHeight: 1.2, letterSpacing: "-.02em", margin: 0, color: "#0a0a0a", textWrap: "balance" }}>
                Llevamos el sonido y la energía del directo a más de un millón de
                personas cada año.
              </p>
              <p style={{ fontSize: 15, fontWeight: 300, color: MUTED, margin: "28px 0 0", maxWidth: "48ch", lineHeight: 1.7 }}>
                Desde clubs íntimos hasta festivales open-air, diseñamos cada
                evento de cero: line-up, escenario, sonido e iluminación.
              </p>
            </Reveal>
            <Reveal
              delay={120}
              style={{
                background: CARD_BG,
                border: BORDER,
                borderRadius: 16,
                minHeight: "clamp(220px,32vh,320px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  padding: "12px 26px",
                  border: BORDER,
                  borderRadius: 100,
                  fontSize: 11,
                  fontWeight: 400,
                  letterSpacing: "4px",
                  textTransform: "uppercase",
                  color: MUTED,
                }}
              >
                Since 2012
              </div>
            </Reveal>
          </div>

          <Reveal
            delay={120}
            className="stats-row"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3,1fr)",
              gap: "clamp(24px,5vw,80px)",
              marginTop: "clamp(48px,7vh,80px)",
            }}
          >
            {stats.map((st) => (
              <div key={st.label}>
                <Counter
                  value={st.value}
                  suffix={st.suffix}
                  style={{ fontFamily: BEBAS, fontWeight: 400, fontSize: "clamp(56px,7vw,92px)", lineHeight: 1, letterSpacing: ".01em", color: "#0a0a0a" }}
                />
                <div style={{ ...microLabel, marginTop: 14 }}>{st.label}</div>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* CONTACTO / FOOTER */}
      <footer
        id="contacto"
        style={{
          position: "relative",
          zIndex: 2,
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: `48px ${PAD}`,
          background: SURFACE,
          borderTop: HAIRLINE,
          overflow: "hidden",
          scrollSnapAlign: "start",
          scrollSnapStop: "always",
        }}
      >
        <Reveal style={{ position: "relative", maxWidth: 820, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontFamily: SPACE, fontWeight: 600, fontSize: "clamp(40px,7vw,88px)", lineHeight: 0.92, letterSpacing: "-.03em", margin: 0, color: "#0a0a0a", textWrap: "balance" }}>
            ¿Listo para el directo?
          </h2>
          <p style={{ fontSize: "clamp(15px,2vw,18px)", fontWeight: 300, color: MUTED, margin: "24px auto 40px", maxWidth: "44ch", lineHeight: 1.6 }}>
            Cuéntanos tu evento y lo hacemos sonar. Respondemos en menos de 24 horas.
          </p>
          <Magnetic
            href="mailto:hola@eventimesound.com"
            className="contact-cta"
            style={{
              display: "inline-block",
              fontSize: 16,
              fontWeight: 500,
              color: "#F0EEE8",
              textDecoration: "none",
              padding: "16px 36px",
              borderRadius: 100,
              background: "#0a0a0a",
            }}
          >
            Reserva tu evento
          </Magnetic>
        </Reveal>
        <div
          style={{
            position: "relative",
            maxWidth: 1240,
            width: "100%",
            margin: "clamp(40px,7vh,72px) auto 0",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 24,
            paddingTop: 28,
            borderTop: HAIRLINE,
          }}
        >
          <a href="#top" style={brandStyle}>
            <Image src="/EVENTIME sound LOGO.png" alt="Eventime Sound" height={32} width={133} />
          </a>
          <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 11, letterSpacing: "1px" }}>
            {footerLinks.map(([href, label], i) => (
              <span key={label} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                {i > 0 && <span style={{ color: "rgba(0,0,0,.18)" }}>·</span>}
                <a href={href} className="footer-link">
                  {label}
                </a>
              </span>
            ))}
          </div>
          <div style={{ fontSize: 11, color: "rgba(0,0,0,.35)" }}>© 2026 Eventime Sound</div>
        </div>
      </footer>
    </div>
  );
}

const HEADER_MB = "clamp(36px,6vh,64px)";

const brandStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  textDecoration: "none",
};

const navLinkRow: CSSProperties = {
  display: "flex",
  gap: 28,
  fontSize: 11,
  fontWeight: 400,
  letterSpacing: "2px",
};

const contentWrap: CSSProperties = {
  maxWidth: 1240,
  margin: "0 auto",
  width: "100%",
};

const sectionStyle: CSSProperties = {
  position: "relative",
  zIndex: 2,
  height: "100vh",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  padding: `clamp(100px,13vh,130px) ${PAD} clamp(64px,8vh,90px)`,
  overflow: "hidden",
  scrollSnapAlign: "start",
  scrollSnapStop: "always",
};

const sectionTitle: CSSProperties = {
  fontFamily: SPACE,
  fontWeight: 600,
  fontSize: "clamp(34px,5vw,60px)",
  lineHeight: 0.98,
  letterSpacing: "-.02em",
  margin: 0,
  color: "#0a0a0a",
};

// Tiny desaturated uppercase label used across cards and stats.
const microLabel: CSSProperties = {
  fontSize: 10,
  fontWeight: 400,
  letterSpacing: "4px",
  textTransform: "uppercase",
  color: FAINT,
};

const galleryTile: CSSProperties = {
  position: "relative",
  overflow: "hidden",
  background: CARD_BG,
  border: CARD_BORDER,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const tileLabel: CSSProperties = {
  fontFamily: SPACE,
  fontSize: 11,
  fontWeight: 400,
  letterSpacing: "3px",
  color: "rgba(0,0,0,.25)",
  textTransform: "uppercase",
};

function eyebrow(): CSSProperties {
  return {
    fontSize: 10,
    fontWeight: 500,
    letterSpacing: "5px",
    color: FAINT,
    textTransform: "uppercase",
    marginBottom: 20,
  };
}

function blob(color: string, extra: CSSProperties): CSSProperties {
  return {
    position: "absolute",
    borderRadius: "50%",
    background: `radial-gradient(circle,${color},transparent 62%)`,
    filter: "blur(90px)",
    ...extra,
  };
}
