# Contexto — Eventime Sound

> Documento vivo. Lo vamos actualizando a medida que avanza el proyecto.
> Última actualización: 2026-06-26

## Qué es

Landing page de **Eventime Sound**, una productora de eventos en directo
(conciertos, festivales, sonido, iluminación, line-ups). Web de una sola página
(one-page) en español. **Estética actual: clara, tipo "paper / grain"** —
fondo blanco roto cálido con textura de grano, manchas orgánicas y partículas.

El diseño original viene de un proyecto de **Claude Design**:

- Proyecto: `Stack tecnológico para web de eventos`
- Fichero fuente: `Eventime Sound.dc.html` (formato `.dc.html` de Claude Design)
- ID de proyecto: `2164b5a0-b49b-4dc2-843c-c5478dbf2312`
- URL: https://claude.ai/design/p/2164b5a0-b49b-4dc2-843c-c5478dbf2312

El `.dc.html` se tradujo a Next.js y desde entonces **el código ha divergido
mucho** del diseño original a través de varias iteraciones (paleta, secciones,
fondo). La fuente de la verdad hoy es el **código** (`app/`), no el `.dc.html`.

## Stack técnico

- **Next.js 16.2.9** (App Router, Turbopack). ⚠️ Esta versión tiene breaking
  changes respecto al Next.js "de memoria". Antes de escribir código, leer la
  guía relevante en `node_modules/next/dist/docs/` (ver `AGENTS.md`).
- **React 19.2.4**
- **TypeScript 5**
- **Tailwind v4** (`@tailwindcss/postcss`) — configurado pero el grueso del
  estilado es inline + clases en `globals.css`.
- **framer-motion 12.41.0** — declarado en `package.json` del proyecto interno;
  se resuelve desde el `node_modules` de la raíz externa (hoisting). **Todas las
  animaciones están en framer-motion** (más algún keyframe CSS puro).

### Estructura de carpetas (ojo, anidada)

```
/Users/kylexbeats/eventime-sound/          <- raíz externa (package.json mínimo + node_modules con framer-motion)
└── eventime-sound/                         <- PROYECTO Next.js real (aquí se trabaja)
    ├── app/
    │   ├── layout.tsx
    │   ├── page.tsx
    │   ├── globals.css
    │   └── components/        <- componentes de animación / fondo
    │       ├── Reveal.tsx     <- fade+rise al entrar en viewport
    │       ├── Counter.tsx    <- contador animado al verse (stats)
    │       ├── Magnetic.tsx   <- enlaces magnéticos (spring)
    │       ├── Cursor.tsx     <- cursor custom (dot+ring) + spotlight
    │       ├── ScrollDots.tsx <- navegación lateral por puntos (snap)
    │       ├── AmbientOrbs.tsx<- manchas orgánicas de fondo (client; reaccionan al cursor)
    │       ├── Particles.tsx  <- canvas de partículas con efecto gravedad al cursor
    │       └── GrainOverlay.tsx<- textura de grano SVG (feTurbulence) sobre todo
    ├── public/
    │   ├── EVENTIME sound LOGO.png  <- logo usado en nav/footer Y como favicon (negro, fondo transparente)
    │   └── EVENTIME sound LOGO.svg  <- versión SVG (ya no se usa para mostrar)
    ├── context.md   <- este fichero
    ├── AGENTS.md / CLAUDE.md
    └── package.json
```

⚠️ **Ya NO existe `app/favicon.ico`** (se eliminó para que el navegador use el
logo como favicon, ver sección "Favicon").

Hay un `package-lock.json` duplicado en la raíz externa que provoca un warning
de "workspace root" en `next build` (inofensivo). Pendiente de limpiar si molesta.

## Qué está implementado

Diseño completo en tres ficheros (`layout.tsx`, `globals.css`, `page.tsx`) +
los componentes de `app/components/`.

### `app/layout.tsx`
- Fuentes vía `next/font/google` (self-hosted), expuestas como variables CSS:
  - **Space Grotesk** (`--font-space`) — titulares.
  - **Manrope** (`--font-manrope`, pesos 300–700) — cuerpo (peso base **300**).
  - **Bebas Neue** (`--font-bebas`) — **números de los stats**.
- `lang="es"`.
- `metadata`: title + description + **`icons`** (favicon, ver abajo).

### `app/globals.css`
- Base/reset, fondo `#f2f0eb`, texto `#0a0a0a`, `::selection`.
- Keyframes: `drift1/2/3` (blobs del hero), `marquee` (ticker),
  `orbDiagonal/orbCircular/orbVertical/orbWander/orbSway` (manchas de fondo).
- Estados `:hover` por clase: `.nav-link`, `.footer-link`, `.btn-outline`,
  `.btn-grad`, `.btn-ghost`, `.link-underline`, `.service-card`, `.gallery-tile`,
  `.contact-cta`, `.scroll-dot-*`.
- Reglas responsive (`max-width: 860px`): colapsan nav, grids de eventos/
  servicios/galería, grid "nosotros" y fila de stats en móvil.
- `prefers-reduced-motion`: desactiva snap + scroll suave + animaciones de orbes.

### `app/page.tsx` (`"use client"`)
Componente cliente con markup + datos + interactividad. **Tokens de diseño** al
principio (ver "Paleta"). Secciones (snap full-page, 100vh c/u):

1. **Nav** fija (transparente → blur al hacer scroll)
2. **Hero** (`#top`) — blobs animados, eyebrow, titular `EVENTIME / SOUND`, 2 CTAs
3. **Ticker / marquee** infinito en la banda inferior del hero
4. **Eventos** (`#eventos`) — cards horizontales anchas (1 evento en los datos)
5. **Galería** (`#galeria`) — grid mosaico (gap 1px)
6. **Servicios** (`#servicios`) — 4 tarjetas numeradas, grid 2 columnas
7. **Nosotros** (`#nosotros`) — texto + panel "Since 2012" + stats (contador)
8. **Contacto / Footer** (`#contacto`) — CTA grande + barra inferior compacta

⚠️ **La sección "Artistas / Line-up" se ELIMINÓ** (con su array `artists`, su
punto lateral y su clase CSS). Quedan **6 paradas de snap**: hero, eventos,
galería, servicios, nosotros, contacto.

**Datos** en arrays al principio del fichero: `events`, `services`, `stats`,
`gallery`, `navLinks`, `footerLinks`, `TICKER_ITEMS`. Para editar contenido,
tocar estos arrays.

**Interactividad** (framer-motion salvo keyframes CSS puros):
- Scroll reveals → `<Reveal>` (`whileInView`, `viewport once`, `delay` en ms, `whileHover`).
- Contadores → `<Counter>` (números de stats, fuente Bebas Neue).
- Barra de progreso de scroll → `useScroll().scrollYProgress` + `scaleX`.
- Blur de nav → `useScroll().scrollY` + `useMotionValueEvent` (estado `scrolled`).
- Parallax del hero → `useTransform(scrollY, ...)` para `y`/`opacity`.
- Cursor + spotlight → `<Cursor>` (motion values + `useSpring`; gradiente con
  `useMotionTemplate`).
- Botones magnéticos → `<Magnetic>`.
- Hover de tarjetas: el "lift" lo hace `whileHover={{ y: -4 }}`; color/borde en CSS.

## Fondo "paper / grain" (clave de la estética actual)

Tres capas fijas detrás del contenido (`z-index:0`) + el grano por encima:

- **Manchas orgánicas** → `<AmbientOrbs>` (client component). 5 blobs grandes
  (500–900px) en tonos cálidos `#D4D0C8 / #C8C4BC / #DEDAD2`, `blur(140px)`,
  opacity 0.6–0.9, derivando lento con keyframes CSS. **Reaccionan al cursor**:
  la mancha más cercana se desplaza ~2.5% de su tamaño hacia el puntero
  (capa interna con `transition: transform 0.6s ease`, para no chocar con la
  animación de deriva del contenedor externo).
- **Partículas** → `<Particles>` (canvas fijo). 80 partículas `#0a0a0a`,
  opacity 0.25–0.5, radio 1.5–4px (12 "de profundidad" más grandes 4–5.5px a
  opacity 0.25). Derivan lento y rebotan en los bordes. **Efecto gravedad**:
  dentro de 120px del cursor son atraídas (fuerza 0.015) y vuelven a su sitio
  con ease (decay ×0.9). Respeta `prefers-reduced-motion` y `pointer:fine`.
- **Grano** → `<GrainOverlay>` (SVG fijo **encima de todo**, `z-index:1000`,
  `pointer-events:none`). `feTurbulence type="fractalNoise" baseFrequency=0.65
  numOctaves=3` + `feColorMatrix saturate=0`, opacity **0.08**.
- **Spotlight** del cursor → `radial-gradient(circle, rgba(0,0,0,0.03) 0%, transparent 70%)`.

## Comportamiento de scroll (snap full-page)

- **El contenedor scroller es el div raíz de `page.tsx`** (`id="scroll-root"`),
  no la ventana. Inline: `height:100vh`, `overflowY:scroll`,
  `scrollSnapType:"y mandatory"`, `scrollBehavior:"smooth"`. `body`/`html` con
  `height:100%; overflow:hidden`.
  - ⚠️ A `useScroll` se le pasa `{ container: scrollRef }` (progreso/blur/parallax).
  - El `IntersectionObserver` de `ScrollDots` usa `root: #scroll-root`.
  - Scrollbar del contenedor oculta (`.scroll-root`).
- Cada sección lleva inline `height:100vh` + `overflow:hidden` +
  `scrollSnapAlign:"start"` + `scrollSnapStop:"always"` (vía `sectionStyle`,
  salvo hero y footer que lo llevan propio).
- **Navegación lateral por puntos** → `ScrollDots.tsx`: **6 puntos** (uno por
  sección), fija a la derecha. Activo `#0a0a0a` (glow + escala), inactivos
  `rgba(0,0,0,0.2)`. Sección activa con `IntersectionObserver`
  (`rootMargin: "-50% 0px -50% 0px"`). Etiqueta visible al hover/activo.
  Oculta en `<=860px`.

## Paleta y tipografía (estado actual: clara "paper")

Tokens en `page.tsx` (arriba del componente):

- **Fondo base: `#F2F0EB`** · Texto principal: `#0a0a0a`
- Texto secundario `MUTED = rgba(0,0,0,0.45)` · terciario `FAINT = rgba(0,0,0,0.25)`
- Bordes: reposo `rgba(0,0,0,0.06)` (`BORDER`/`HAIRLINE`) y `rgba(0,0,0,0.07)`
  (`CARD_BORDER`); hover `rgba(0,0,0,0.12–0.15)`.
- **Cards** (`CARD_BG = #EAE7E0`, hover `#E2DED6`) — eventos, servicios, galería.
  Sin blur/cristal (fue glass en una iteración, ahora superficies sólidas).
- **Footer + panel "Since 2012"**: `SURFACE = #EAE7E0`; borde superior hairline.
- **Ticker**: fondo `#E6E3DC`, bordes hairline, texto `rgba(0,0,0,0.2)`,
  separadores ✦ en `#0a0a0a`.
- **Stats**: números `#0a0a0a` (Bebas Neue), labels `rgba(0,0,0,0.3)`,
  sección `#EAE7E0`.
- **Nav**: transparente → `rgba(242,240,235,0.85)` + `backdrop-filter blur(16px)`,
  borde inferior hairline. Links `rgba(0,0,0,0.4)` → hover `rgba(0,0,0,0.85)`
  (font 11px, letter-spacing 2px). Logo 36px. CTA "Contacto" es **texto** con
  subrayado en hover (ya no botón con borde).
- **Botones primarios** (hero + footer CTA): fondo `#0a0a0a`, texto `#F0EEE8`.
- **Secciones alternas** (`EVEN_BG = rgba(0,0,0,0.03)`): eventos y servicios
  llevan ese tinte sutil; deja ver grano/manchas a través.
- **Cursor**: punto `#0a0a0a`, anillo `1px rgba(0,0,0,0.4)`.
- **Scroll**: barra de progreso `#0a0a0a`; puntos laterales activo `#0a0a0a` /
  inactivos `rgba(0,0,0,0.2)`.

Tipografía: `Space Grotesk` (titulares) · `Manrope` peso 300 (cuerpo) ·
`Bebas Neue` (números de stats).

> **Historial de paleta**: el proyecto ha alternado varias veces entre una
> versión **oscura** (fondo `#080808`, texto blanco, partículas/orbes blancos)
> y esta **clara "paper"**. Si se pide "volver a la oscura", es básicamente
> invertir todos los tokens y los colores de los componentes de fondo/cursor/
> scroll (todo blanco ↔ negro). El estado vigente es el **claro**.

## Logo y favicon

- **Logo**: `<Image src="/EVENTIME sound LOGO.png">` en nav (36px) y footer (32px).
  El PNG es **negro sobre fondo transparente** (580×465) — el negro es lo que lo
  hace visible sobre el fondo claro. ⚠️ NO recolorear a blanco: desaparecería del
  nav/footer.
- ⚠️ El titular grande del hero (`EVENTIME / SOUND`) es texto, **no** el logo.
- **Favicon** (2026-06-26): `metadata.icons` en `layout.tsx` apunta al mismo PNG
  (`icon` / `shortcut` / `apple`). Se **eliminó `app/favicon.ico`** para que el
  navegador no priorice el icono antiguo. Se decidió dejar el logo **negro** (no
  blanco) para no romper su visibilidad en el nav/footer.
- `next.config.ts` mantiene `images.dangerouslyAllowSVG: true` (legado de cuando
  el logo era SVG; hoy se muestra el PNG, es inofensivo).

## Comandos

```bash
cd /Users/kylexbeats/eventime-sound/eventime-sound
npm run dev      # desarrollo
npm run build    # build de producción
npm run start    # servir el build
npx eslint app/  # lint (el `next lint` clásico no aplica en esta versión)
npx tsc --noEmit # type-check
```

## Estado de verificación (2026-06-26)

- ✅ `tsc --noEmit` limpio
- ✅ `eslint` limpio
- ✅ `next build` OK (página prerenderizada estática)
- ✅ Favicon: el HTML compilado emite `<link rel="icon|shortcut icon|apple-touch-icon">`
  apuntando al logo; ya no hay `favicon.ico` que compita.

## Convenciones / decisiones

- **Leer los docs de Next 16** en `node_modules/next/dist/docs/` antes de tocar
  APIs del framework (lo pide `AGENTS.md`).
- Estilado: inline styles + tokens en `page.tsx` para valores; clases en
  `globals.css` para hover/animaciones/responsive. (No migrado a Tailwind utils.)
- Toda la página es un client component porque es muy interactiva.
- El contenido es maquetado/placeholder (galería sin fotos reales).

## Pendiente / ideas futuras

- [ ] Sustituir los placeholders de galería por imágenes reales.
- [x] ~~Migrar animaciones a framer-motion~~ ✅ (2026-06-23).
- [x] ~~Snap full-page + bullets laterales~~ ✅ (2026-06-23).
- [x] ~~Favicon propio~~ ✅ (2026-06-26, logo PNG vía `metadata.icons`).
- [ ] Formulario de contacto real (ahora es `mailto:`).
- [ ] Limpiar el `package-lock.json` duplicado de la raíz externa.
- [ ] Enlaces sociales reales (Instagram/TikTok/Spotify apuntan a `#`).
- [ ] (Opcional) Favicon cuadrado dedicado (el PNG es 580×465 y se escala con margen).
- [ ] OG image para compartir en redes.
