# Contexto — Eventime Sound

> Documento vivo. Lo vamos actualizando a medida que avanza el proyecto.
> Última actualización: 2026-06-23

## Qué es

Landing page de **Eventime Sound**, una productora de eventos en directo
(conciertos, festivales, sonido, iluminación, line-ups). Web de una sola página
(one-page) en español, estética oscura con acentos neón.

El diseño original viene de un proyecto de **Claude Design**:

- Proyecto: `Stack tecnológico para web de eventos`
- Fichero fuente: `Eventime Sound.dc.html` (formato `.dc.html` de Claude Design)
- ID de proyecto: `2164b5a0-b49b-4dc2-843c-c5478dbf2312`
- URL: https://claude.ai/design/p/2164b5a0-b49b-4dc2-843c-c5478dbf2312

El `.dc.html` se ha **traducido a Next.js** (no se usa el runtime de Claude
Design en producción). Es la fuente de la verdad del diseño; si cambia allí,
hay que re-sincronizar a mano.

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
  animaciones están migradas a framer-motion** (ya no hay `useEffect` vanilla).

### Estructura de carpetas (ojo, anidada)

```
/Users/kylexbeats/eventime-sound/          <- raíz externa (package.json mínimo + node_modules con framer-motion)
└── eventime-sound/                         <- PROYECTO Next.js real (aquí se trabaja)
    ├── app/
    │   ├── layout.tsx
    │   ├── page.tsx
    │   ├── globals.css
    │   ├── favicon.ico
    │   └── components/        <- componentes de animación (framer-motion)
    │       ├── Reveal.tsx     <- fade+rise al entrar en viewport
    │       ├── Counter.tsx    <- contador animado al verse
    │       ├── Magnetic.tsx   <- enlaces magnéticos (spring)
    │       ├── Cursor.tsx     <- cursor custom (dot+ring) + spotlight
    │       ├── ScrollDots.tsx <- navegación lateral por puntos (snap)
    │       └── AmbientOrbs.tsx<- fondo animado de orbes (CSS keyframes)
    ├── public/
    ├── context.md   <- este fichero
    ├── AGENTS.md / CLAUDE.md
    └── package.json
```

Hay un `package-lock.json` duplicado en la raíz externa que provoca un warning
de "workspace root" en `next build` (inofensivo). Pendiente de limpiar si molesta.

## Qué está implementado

Traducción fiel del diseño a tres ficheros:

### `app/layout.tsx`
- Fuentes **Space Grotesk** (titulares) y **Manrope** (texto) vía
  `next/font/google` (self-hosted), expuestas como variables CSS `--font-space`
  y `--font-manrope`.
- `lang="es"`.
- Metadata (title + description) de Eventime Sound.

### `app/globals.css`
- Base/reset, color de fondo `#07070A`, `::selection`.
- Keyframes: `drift1/2/3` (blobs del hero), `marquee`, `cue` (indicador scroll).
- Estados `:hover` (los estilos inline no pueden hacer hover) por clase:
  `.nav-link`, `.btn-outline`, `.btn-grad`, `.btn-ghost`, `.link-underline`,
  `.event-row`, `.artist-card`, `.service-card`, `.gallery-tile`, `.contact-cta`.
- Reglas responsive (`max-width: 860px`) que colapsan nav, filas de eventos,
  grid de galería y grid de "nosotros" en móvil.

### `app/page.tsx` (`"use client"`)
Componente cliente con el markup + datos + interactividad. Secciones:

1. **Nav** fija (con blur al hacer scroll)
2. **Hero** con blobs animados, badge, titular gradiente y CTAs
3. **Marquee** infinito
4. **Eventos** (`#eventos`) — lista con estado por entrada (`ok`/`last`/`sold`)
5. **Artistas** (`#artistas`) — grid de tarjetas line-up
6. **Galería** (`#galeria`) — grid tipo mosaico
7. **Servicios** (`#servicios`) — 4 tarjetas numeradas
8. **Nosotros** (`#nosotros`) — texto + stats con contador animado
9. **Contacto/Footer** (`#contacto`)

**Datos** en arrays al principio del fichero: `events`, `artists`, `services`,
`stats`, `navLinks`, `STATUS_STYLES`. Para editar contenido, tocar estos arrays.

**Interactividad** (toda con **framer-motion**, sin `useEffect` vanilla):
- Scroll reveals → `<Reveal>` (`whileInView`, `viewport once`). Acepta `delay`
  (en ms) y `whileHover`.
- Contadores animados → `<Counter>` (`useInView` + `animate` sobre un
  `useMotionValue`, render vía `useTransform`).
- Barra de progreso de scroll → `useScroll().scrollYProgress` + `scaleX`.
- Blur de nav al hacer scroll → `useScroll().scrollY` + `useMotionValueEvent`
  (estado `scrolled`).
- Parallax del hero → `useTransform(scrollY, ...)` para `y`/`opacity`.
- Cursor + spotlight → `<Cursor>` (motion values + `useSpring`; el gradiente del
  spotlight se construye con `useMotionTemplate`). Punto 6px, anillo 28px (52px en
  hover) con border 1px.
- Fondo animado autónomo → `<AmbientOrbs>` (3 orbes difuminados `blur(120px)` con
  keyframes CSS `orbDiagonal/orbCircular/orbVertical`; fixed a `z-index:0`, NO
  reacciona al cursor).
- Botones magnéticos → `<Magnetic>` (motion values + `useSpring`).
- Hover de tarjetas (artist/service): el "lift" (transform) lo hace
  `whileHover={{ y: -6 }}`; el color/borde sigue en CSS `:hover`.
- Keyframes CSS que **siguen en `globals.css`** (no migrados, son puro CSS):
  `drift1/2/3` (blobs), `marquee`, `cue`.
- Respeta `prefers-reduced-motion` (`useReducedMotion`) y punteros `coarse`.

## Comportamiento de scroll (snap full-page) — implementado

- **El contenedor scroller es el div raíz de `page.tsx`** (`id="scroll-root"`),
  no la ventana. Inline lleva: `height:100vh`, `overflowY:scroll`,
  `scrollSnapType:"y mandatory"`, `scrollBehavior:"smooth"`. El `body`/`html`
  tienen `height:100%; overflow:hidden` (no scrollean).
  - ⚠️ Como el scroll ya NO es de la ventana, a `useScroll` se le pasa
    `{ container: scrollRef }` para que progreso/blur/parallax sigan funcionando.
  - El `IntersectionObserver` de `ScrollDots` usa `root: #scroll-root`.
  - Scrollbar del contenedor oculta (`.scroll-root` en `globals.css`).
- Cada sección "snap" lleva inline `height:100vh` + `overflow:hidden` +
  `scrollSnapAlign:"start"` + `scrollSnapStop:"always"`:
  - hero `#top`, y vía `sectionStyle`: `#eventos`, `#artistas`, `#galeria`,
    `#servicios`, `#nosotros`, y el footer `#contacto` (7 paradas).
  - `sectionStyle` centra vertical (`display:flex; justify-content:center`).
- **Contenido ajustado para caber en 100vh sin scroll interno** (req. del user):
  - Tamaños de fuente y padding reducidos (títulos `clamp(32,5vw,58)`, etc.).
  - `Eventos`: ahora son **3 cards en una fila** (`events-grid`, `events.slice(0,3)`).
  - `Servicios`: grid **3 columnas compacto** (`services-grid`, 4 cards → 3x2).
  - `Artistas`: **scroll horizontal** con altura limitada
    (`.artist-scroll`, `height: clamp(320px,52vh,440px)`).
  - `Galería`: filas más bajas (`gridAutoRows: clamp(120px,17vh,180px)`).
  - El marquee se movió a una **banda inferior del hero** (ya no es bloque suelto).
- **Navegación lateral por puntos** → `app/components/ScrollDots.tsx`:
  - 7 puntos (uno por sección), fija a la derecha y centrada vertical.
  - Activo en **`#E8005A`** (con glow + escala); inactivos `rgba(255,255,255,0.3)`.
    Animado con framer-motion (`motion.span` + `animate`).
  - Sección activa con `IntersectionObserver` (root `#scroll-root`) y truco
    `rootMargin: "-50% 0px -50% 0px"` (la sección que cruza el centro = activa).
  - Click en un punto → `scrollIntoView` (smooth, o `auto` si reduced-motion).
  - Etiqueta visible al hover / cuando está activo. Oculta en `<=860px`.
- **Reduced-motion**: `@media (prefers-reduced-motion: reduce)` desactiva el snap
  (`scroll-snap-type:none`) y el scroll suave en `.scroll-root`.

## Paleta y tipografía

- **Paleta monocroma (blanco y negro)** desde 2026-06-25. Se eliminaron TODOS los
  acentos cromáticos (`#FF36B0`, `#9D4EFF`, `#27D8F0`, `#FF6FC3`, `#FFB23D`,
  `#E8005A`, `#8C00FF`).
- Fondo: `#07070A` · Texto: `#F5F5F7`
- Grises: `#B9B9C4`, `#8C8C98`, `#7B7B88`, `#5A5A66`, `#1c1c24` (marquee)
- **Acento principal: `#ffffff`**. Bordes/hover/glows/sombras = blanco con
  distintas opacidades. Eyebrows = `rgba(255,255,255,0.4)`.
  Orbes de fondo = blanco opacity 0.03–0.06. Cursor/spotlight/progreso = blanco.
  Puntos nav: activo `#ffffff`, inactivos `rgba(255,255,255,0.2)`.
- **Logo**: el wordmark de texto del nav y del footer se sustituyó por
  `<Image src="/EVENTIME sound LOGO.svg">` (nav 200×48, footer 160×40).
  `next.config.ts` tiene `images.dangerouslyAllowSVG: true` para servir el SVG.
  ⚠️ El titular grande del hero (`EVENTIME / SOUND`) NO es el logo y se mantiene.
- Titulares: `Space Grotesk` · Cuerpo: `Manrope`.
  ⚠️ NOTA: la última petición mencionaba "Bebas Neue (display) / Inter (cuerpo)"
  pero el proyecto NUNCA ha usado esas fuentes; como la instrucción era
  "mantén ... solo cambian los colores", se conservaron Space Grotesk + Manrope.
  Si de verdad se quieren Bebas Neue + Inter, es un cambio aparte pendiente.

## Comandos

```bash
cd /Users/kylexbeats/eventime-sound/eventime-sound
npm run dev      # desarrollo
npm run build    # build de producción
npm run start    # servir el build
npm run lint     # eslint
npx tsc --noEmit # type-check
```

## Estado de verificación (2026-06-23, tras snap en contenedor #scroll-root)

- ✅ `tsc --noEmit` limpio
- ✅ `eslint` limpio
- ✅ `next build` OK (página prerenderizada estática)
- ✅ Smoke test: HTTP 200, `#scroll-root` con `overflow-y:scroll` +
  `scroll-snap-type:y mandatory`, 7 secciones `scroll-snap-align:start`,
  7 puntos, Eventos = 3 cards

## Convenciones / decisiones

- **Leer los docs de Next 16** en `node_modules/next/dist/docs/` antes de tocar
  APIs del framework (lo pide `AGENTS.md`).
- Estilado: inline styles para valores puntuales + clases en `globals.css` para
  hover/animaciones/responsive. (No se ha migrado a Tailwind utilities.)
- Toda la página es un client component porque es muy interactiva.
- El contenido es maquetado/placeholder (imágenes son patrones de rayas, no fotos
  reales).

## Pendiente / ideas futuras

- [ ] Sustituir los placeholders de galería/artistas por imágenes reales.
- [x] ~~Migrar animaciones a framer-motion~~ ✅ hecho (2026-06-23).
- [x] ~~Implementar snap full-page + bullets laterales~~ ✅ hecho (2026-06-23).
      Snap en `html` para no romper el parallax/blur (ver sección arriba).
- [ ] Formulario de contacto real (ahora es `mailto:`).
- [ ] Limpiar el `package-lock.json` duplicado de la raíz externa.
- [ ] Enlaces sociales reales (Instagram/TikTok/Spotify apuntan a `#`).
- [ ] SEO/OG image, favicon propio.
